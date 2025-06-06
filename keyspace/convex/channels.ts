import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createChannel = mutation({
  args: {
    naam: v.string(),
    slug: v.string(),
    beschrijving: v.string(),
    type: v.union(v.literal("discussie"), v.literal("templates"), v.literal("modules")),
    sectieId: v.optional(v.id("secties")),
    aangemaaktDoor: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("channels", {
      ...args,
      stickyPosts: [],
      visible: false, // New channels are hidden by default
      aangemaaktOp: Date.now(),
    });
  },
});

export const getAllChannels = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("channels").order("asc").collect();
  },
});

export const getVisibleChannels = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("channels")
      .filter((q) => q.eq(q.field("visible"), true))
      .order("asc")
      .collect();
  },
});

export const getAllChannelsWithSecties = query({
  args: {},
  handler: async (ctx) => {
    const channels = await ctx.db.query("channels").order("asc").collect();
    
    // Voor elk kanaal, haal de sectie informatie op als het bestaat
    const channelsWithSecties = await Promise.all(
      channels.map(async (channel) => {
        if (channel.sectieId) {
          const sectie = await ctx.db.get(channel.sectieId);
          return { ...channel, sectie };
        }
        return { ...channel, sectie: null };
      })
    );
    
    return channelsWithSecties;
  },
});

export const getVisibleChannelsWithSecties = query({
  args: {},
  handler: async (ctx) => {
    // Get all visible channels
    const channels = await ctx.db
      .query("channels")
      .filter((q) => q.eq(q.field("visible"), true))
      .order("asc")
      .collect();
    
    // Voor elk kanaal, haal de sectie informatie op als het bestaat
    const channelsWithSecties = await Promise.all(
      channels.map(async (channel) => {
        if (channel.sectieId) {
          const sectie = await ctx.db.get(channel.sectieId);
          // Only include channels from live sections (or no section)
          if (!sectie || sectie.status === "live") {
            return { ...channel, sectie };
          }
          return null;
        }
        return { ...channel, sectie: null };
      })
    );
    
    // Filter out null values (channels from draft sections)
    return channelsWithSecties.filter(channel => channel !== null);
  },
});

export const getChannelBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("channels")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
  },
});

export const getChannelsByType = query({
  args: { type: v.union(v.literal("discussie"), v.literal("templates"), v.literal("modules")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("channels")
      .filter((q) => q.eq(q.field("type"), args.type))
      .collect();
  },
});

export const setChannelType = mutation({
  args: {
    channelId: v.id("channels"),
    type: v.union(v.literal("discussie"), v.literal("templates"), v.literal("modules")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.channelId, { type: args.type });
  },
});

export const addStickyPost = mutation({
  args: {
    channelId: v.id("channels"),
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const channel = await ctx.db.get(args.channelId);
    if (!channel) throw new Error("Kanaal niet gevonden");

    const updatedStickies = [...channel.stickyPosts, args.threadId];
    
    await ctx.db.patch(args.channelId, { stickyPosts: updatedStickies });
  },
});

export const removeStickyPost = mutation({
  args: {
    channelId: v.id("channels"),
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const channel = await ctx.db.get(args.channelId);
    if (!channel) throw new Error("Kanaal niet gevonden");

    const updatedStickies = channel.stickyPosts.filter((id: any) => id !== args.threadId);
    
    await ctx.db.patch(args.channelId, { stickyPosts: updatedStickies });
  },
});

export const updateChannel = mutation({
  args: {
    kanaalId: v.id("channels"),
    naam: v.optional(v.string()),
    beschrijving: v.optional(v.string()),
    type: v.optional(v.union(v.literal("discussie"), v.literal("templates"), v.literal("modules"))),
    sectieId: v.optional(v.id("secties")),
    slug: v.optional(v.string()),
    headerAfbeelding: v.optional(v.string()),
    headerOmschrijving: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { kanaalId, ...updates } = args;
    
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(cleanUpdates).length === 0) {
      throw new Error("Geen updates opgegeven");
    }

    return await ctx.db.patch(kanaalId, cleanUpdates as any);
  },
});

export const updateChannelHeader = mutation({
  args: {
    kanaalId: v.id("channels"),
    headerAfbeelding: v.optional(v.string()),
    headerOmschrijving: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { kanaalId, ...updates } = args;
    
    // Clean updates object - remove undefined values and convert empty strings to undefined
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    return await ctx.db.patch(kanaalId, cleanUpdates);
  },
});

export const deleteChannel = mutation({
  args: { kanaalId: v.id("channels") },
  handler: async (ctx, args) => {
    // Check of er nog threads zijn in dit kanaal
    const threadsInChannel = await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("kanaalId"), args.kanaalId))
      .collect();

    if (threadsInChannel.length > 0) {
      throw new Error("Kan kanaal niet verwijderen: er zijn nog threads in dit kanaal");
    }

    return await ctx.db.delete(args.kanaalId);
  },
});

// Mutation to toggle channel visibility
export const toggleChannelVisibility = mutation({
  args: { 
    channelId: v.id("channels") 
  },
  handler: async (ctx, args) => {
    const channel = await ctx.db.get(args.channelId);
    if (!channel) {
      throw new Error("Kanaal niet gevonden");
    }

    const newVisibility = !(channel.visible ?? false);
    
    await ctx.db.patch(args.channelId, { 
      visible: newVisibility
    });

    return { 
      success: true, 
      newVisibility,
      channelName: channel.naam
    };
  },
});

// Mutation to reorder channels within a section
export const reorderChannels = mutation({
  args: {
    channelOrders: v.array(v.object({
      channelId: v.id("channels"),
      volgorde: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    // Update all channel orders
    for (const { channelId, volgorde } of args.channelOrders) {
      await ctx.db.patch(channelId, { volgorde });
    }
    
    return {
      success: true,
      updatedCount: args.channelOrders.length
    };
  },
});

// Mutation to move a channel to a different section and reorder
export const moveChannelToSection = mutation({
  args: {
    channelId: v.id("channels"),
    newSectionId: v.optional(v.id("secties")),
    newOrder: v.array(v.object({
      channelId: v.id("channels"),
      volgorde: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    // Update the channel's section
    await ctx.db.patch(args.channelId, { 
      sectieId: args.newSectionId 
    });
    
    // Update all channel orders in the target section
    for (const { channelId, volgorde } of args.newOrder) {
      await ctx.db.patch(channelId, { volgorde });
    }
    
    return {
      success: true,
      movedChannel: args.channelId,
      newSectionId: args.newSectionId,
      updatedCount: args.newOrder.length
    };
  },
});

// Migration function to set existing channels as visible
export const migrateChannelVisibility = mutation({
  handler: async (ctx) => {
    const channels = await ctx.db.query("channels").collect();
    
    let updatedCount = 0;
    
    // Set all existing channels to visible if they don't have a visibility value
    for (const channel of channels) {
      if (channel.visible === undefined) {
        await ctx.db.patch(channel._id, { visible: true });
        updatedCount++;
      }
    }
    
    return {
      success: true,
      updatedChannels: updatedCount,
      totalChannels: channels.length
    };
  },
});

// Migration function to assign volgorde to channels within their sections
export const migrateChannelOrder = mutation({
  handler: async (ctx) => {
    const channels = await ctx.db.query("channels").collect();
    
    // Group channels by sectieId
    const channelsBySectie = channels.reduce((acc, channel) => {
      const sectieId = channel.sectieId || 'no-section';
      if (!acc[sectieId]) {
        acc[sectieId] = [];
      }
      acc[sectieId].push(channel);
      return acc;
    }, {} as Record<string, any[]>);
    
    let updatedCount = 0;
    
    // Assign volgorde within each section
    for (const [sectieId, sectionChannels] of Object.entries(channelsBySectie)) {
      // Sort by creation time for consistent ordering
      const sortedChannels = sectionChannels.sort((a, b) => a.aangemaaktOp - b.aangemaaktOp);
      
      for (let i = 0; i < sortedChannels.length; i++) {
        const channel = sortedChannels[i];
        if (!channel.volgorde) {
          await ctx.db.patch(channel._id, { volgorde: i + 1 });
          updatedCount++;
        }
      }
    }
    
    return {
      success: true,
      updatedChannels: updatedCount,
      totalChannels: channels.length,
      sectionsProcessed: Object.keys(channelsBySectie).length
    };
  },
});

// Migration function to assign sectieId to channels without one
export const migrateChannelSections = mutation({
  handler: async (ctx) => {
    // Get all channels without sectieId
    const channels = await ctx.db.query("channels").collect();
    const channelsWithoutSection = channels.filter(channel => !channel.sectieId);
    
    // Get all sections for mapping
    const allSecties = await ctx.db.query("secties").collect();
    
    // Create mapping functions
    const getSectieByName = (naam: string) => 
      allSecties.find(s => s.naam === naam);
    
    let updatedCount = 0;
    
    for (const channel of channelsWithoutSection) {
      let targetSectie = null;
      
      // Map channels based on their content and type
      if (channel.type === "templates") {
        targetSectie = getSectieByName("Templates");
      } else if (channel.type === "modules") {
        // Educational content -> Startpunt or specific sections
        if (channel.naam.toLowerCase().includes("welkom") || 
            channel.naam.toLowerCase().includes("voorstellen")) {
          targetSectie = getSectieByName("Startpunt");
        } else {
          targetSectie = getSectieByName("Startpunt"); // Default for modules
        }
      } else if (channel.type === "discussie") {
        // Map discussion channels based on their content
        const naam = channel.naam.toLowerCase();
        const beschrijving = channel.beschrijving.toLowerCase();
        
        if (naam.includes("welkom") || naam.includes("voorstellen") || 
            naam.includes("community") || naam.includes("updates")) {
          targetSectie = getSectieByName("Startpunt");
        } else if (naam.includes("vps") || naam.includes("installatie") || 
                   naam.includes("beveiliging") || naam.includes("hosting") || 
                   naam.includes("webui") || naam.includes("modellen") || 
                   naam.includes("n8n") || naam.includes("debug")) {
          targetSectie = getSectieByName("Infrastructuur");
        } else if (naam.includes("zorg") || naam.includes("onderwijs") || 
                   naam.includes("mkb") || naam.includes("marketing")) {
          targetSectie = getSectieByName("Sectoren");
        } else if (naam.includes("eigen beheer") || naam.includes("wetgeving") || 
                   naam.includes("model") || naam.includes("agent") || naam.includes("toekomst")) {
          targetSectie = getSectieByName("Strategie");
        } else if (naam.includes("business") || naam.includes("organisatie")) {
          targetSectie = getSectieByName("Business") || getSectieByName("Organisatie");
        } else {
          // Default to Overig for unmatched discussions
          targetSectie = getSectieByName("Overig");
        }
      }
      
      // Fallback to Overig if no specific section found
      if (!targetSectie) {
        targetSectie = getSectieByName("Overig");
      }
      
      if (targetSectie) {
        await ctx.db.patch(channel._id, { sectieId: targetSectie._id });
        updatedCount++;
      }
    }
    
    return {
      success: true,
      totalChannels: channels.length,
      channelsWithoutSection: channelsWithoutSection.length,
      updatedCount,
      availableSections: allSecties.map(s => s.naam)
    };
  },
}); 