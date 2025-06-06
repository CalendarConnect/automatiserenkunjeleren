import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query om alle secties op te halen, gesorteerd op volgorde
export const getAllSecties = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("secties")
      .withIndex("by_volgorde")
      .collect();
  },
});

// Query om secties op te halen per status
export const getSectiesByStatus = query({
  args: {
    status: v.union(v.literal("draft"), v.literal("live")),
  },
  handler: async (ctx, args) => {
    const allSecties = await ctx.db.query("secties").collect();
    
    // Filter op basis van status, behandel ontbrekende status als "draft"
    const filteredSecties = allSecties.filter(sectie => {
      const sectieStatus = sectie.status || "draft";
      return sectieStatus === args.status;
    });
    
    // Sort by volgorde
    return filteredSecties.sort((a, b) => a.volgorde - b.volgorde);
  },
});

// Mutation om een nieuwe sectie aan te maken
export const createSectie = mutation({
  args: {
    naam: v.string(),
    emoji: v.string(),
    kleur: v.string(),
    status: v.optional(v.union(v.literal("draft"), v.literal("live"))),
  },
  handler: async (ctx, args) => {
    // Bepaal de volgende volgorde nummer voor de juiste status
    const status = args.status || "draft";
    const existingSecties = await ctx.db
      .query("secties")
      .withIndex("by_status", (q) => q.eq("status", status))
      .collect();
    
    const maxVolgorde = existingSecties.length > 0 
      ? Math.max(...existingSecties.map(s => s.volgorde)) 
      : 0;

    return await ctx.db.insert("secties", {
      naam: args.naam,
      emoji: args.emoji,
      kleur: args.kleur,
      status: status,
      volgorde: maxVolgorde + 1,
      aangemaaktOp: Date.now(),
    });
  },
});

// Mutation om een sectie bij te werken
export const updateSectie = mutation({
  args: {
    sectieId: v.id("secties"),
    naam: v.optional(v.string()),
    emoji: v.optional(v.string()),
    kleur: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("live"))),
    volgorde: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { sectieId, ...updates } = args;
    
    // Verwijder undefined waarden
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    return await ctx.db.patch(sectieId, cleanUpdates);
  },
});

// Mutation om een sectie te verwijderen
export const deleteSectie = mutation({
  args: {
    sectieId: v.id("secties"),
  },
  handler: async (ctx, args) => {
    // Eerst controleren of er nog kanalen zijn die deze sectie gebruiken
    const channelsInSectie = await ctx.db
      .query("channels")
      .withIndex("by_sectie", (q) => q.eq("sectieId", args.sectieId))
      .collect();
    
    if (channelsInSectie.length > 0) {
      throw new Error("Kan sectie niet verwijderen: er zijn nog kanalen toegewezen aan deze sectie");
    }
    
    return await ctx.db.delete(args.sectieId);
  },
});

// Mutation om de volgorde van secties te wijzigen
export const reorderSecties = mutation({
  args: {
    sectieOrders: v.array(v.object({
      sectieId: v.id("secties"),
      volgorde: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    // Update alle sectie volgordes
    for (const { sectieId, volgorde } of args.sectieOrders) {
      await ctx.db.patch(sectieId, { volgorde });
    }
  },
});

// Mutation om bestaande secties zonder status te updaten
export const updateExistingSecties = mutation({
  handler: async (ctx) => {
    const allSecties = await ctx.db.query("secties").collect();
    
    // Update secties die geen status hebben
    for (const sectie of allSecties) {
      if (!sectie.status) {
        await ctx.db.patch(sectie._id, { status: "draft" as const });
      }
    }
    
    return { updated: allSecties.filter(s => !s.status).length };
  },
});

// Mutation om bestaande secties te migreren
export const migrateDefaultSecties = mutation({
  handler: async (ctx) => {
    // Standaard secties om te migreren
    const defaultSecties = [
      { naam: "Startpunt", emoji: "📌", kleur: "#F59E0B" },
      { naam: "Infrastructuur", emoji: "🛠️", kleur: "#3B82F6" },
      { naam: "Sectoren", emoji: "🧭", kleur: "#10B981" },
      { naam: "Strategie", emoji: "💬", kleur: "#8B5CF6" },
      { naam: "Templates", emoji: "📂", kleur: "#F97316" },
      { naam: "Organisatie", emoji: "🧷", kleur: "#EC4899" },
      { naam: "Overig", emoji: "📋", kleur: "#6B7280" },
    ];

    // Check welke secties al bestaan
    const existingSecties = await ctx.db.query("secties").collect();
    const existingNamen = existingSecties.map(s => s.naam);

    // Bepaal hoogste volgorde voor draft secties
    const draftSecties = existingSecties.filter(s => (s.status || "draft") === "draft");
    const maxVolgorde = draftSecties.length > 0 
      ? Math.max(...draftSecties.map(s => s.volgorde)) 
      : 0;

    let addedCount = 0;
    // Voeg alleen ontbrekende secties toe
    for (let i = 0; i < defaultSecties.length; i++) {
      const sectie = defaultSecties[i];
      
      if (!existingNamen.includes(sectie.naam)) {
        await ctx.db.insert("secties", {
          naam: sectie.naam,
          emoji: sectie.emoji,
          kleur: sectie.kleur,
          status: "draft" as const,
          volgorde: maxVolgorde + addedCount + 1,
          aangemaaktOp: Date.now(),
        });
        addedCount++;
      }
    }

    return { success: true, count: addedCount, existing: existingSecties.length };
  },
});

// Mutation om sectie status te wijzigen (draft <-> live)
export const toggleSectieStatus = mutation({
  args: {
    sectieId: v.id("secties"),
  },
  handler: async (ctx, args) => {
    const sectie = await ctx.db.get(args.sectieId);
    if (!sectie) {
      throw new Error("Sectie niet gevonden");
    }

    const newStatus = sectie.status === "draft" ? "live" : "draft";
    
    // Keep the original volgorde to maintain position in the overall ordering
    // Only change the status, not the volgorde
    await ctx.db.patch(args.sectieId, { 
      status: newStatus,
      // volgorde stays the same to maintain position
    });

    return { success: true, newStatus };
  },
});

// Mutation om live secties definitief op te slaan
export const publishLiveSecties = mutation({
  handler: async (ctx) => {
    const liveSecties = await ctx.db
      .query("secties")
      .filter((q) => q.eq(q.field("status"), "live"))
      .collect();
    
    // Herorder alle live secties met opeenvolgende nummers
    const sortedLiveSecties = liveSecties.sort((a, b) => a.volgorde - b.volgorde);
    
    for (let i = 0; i < sortedLiveSecties.length; i++) {
      await ctx.db.patch(sortedLiveSecties[i]._id, {
        volgorde: i + 1,
      });
    }
    
    return { 
      success: true, 
      publishedCount: liveSecties.length,
      publishedAt: Date.now(),
    };
  },
}); 