import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Mutation om de AI Toolbibliotheek sectie en kanalen aan te maken
export const createToolbibliotheek = mutation({
  args: {
    aangemaaktDoor: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Eerst controleren of de sectie al bestaat
    const existingSectie = await ctx.db
      .query("secties")
      .filter((q) => q.eq(q.field("naam"), "🛠️ AI Toolbibliotheek"))
      .first();

    let sectieId;
    
    if (existingSectie) {
      sectieId = existingSectie._id;
    } else {
      // Bepaal de volgende volgorde nummer
      const existingSecties = await ctx.db.query("secties").collect();
      const maxVolgorde = existingSecties.length > 0 
        ? Math.max(...existingSecties.map(s => s.volgorde)) 
        : 0;

      // Maak de nieuwe sectie aan
      sectieId = await ctx.db.insert("secties", {
        naam: "🛠️ AI Toolbibliotheek",
        emoji: "🛠️",
        kleur: "#F59E0B", // Orange color
        status: "live",
        volgorde: maxVolgorde + 1,
        aangemaaktOp: Date.now(),
      });
    }

    // Definieer de 15 kanalen voor de AI Toolbibliotheek
    const kanalen = [
      {
        naam: "Automatisering & workflows",
        slug: "automatisering-workflows",
        beschrijving: "Tools voor het automatiseren van processen en workflows"
      },
      {
        naam: "Tekst & copywriting",
        slug: "tekst-copywriting",
        beschrijving: "AI-tools voor het schrijven en bewerken van teksten"
      },
      {
        naam: "Beeld & visualisatie",
        slug: "beeld-visualisatie",
        beschrijving: "Tools voor het genereren en bewerken van afbeeldingen"
      },
      {
        naam: "Video & audio",
        slug: "video-audio",
        beschrijving: "AI-tools voor video- en audioproductie"
      },
      {
        naam: "Chatbots & assistenten",
        slug: "chatbots-assistenten",
        beschrijving: "Conversationele AI en virtuele assistenten"
      },
      {
        naam: "Ontwerp & UX",
        slug: "ontwerp-ux",
        beschrijving: "Design tools en UX/UI hulpmiddelen"
      },
      {
        naam: "Analyse & dashboards",
        slug: "analyse-dashboards",
        beschrijving: "Data-analyse en visualisatie tools"
      },
      {
        naam: "Onderwijs & leren",
        slug: "onderwijs-leren",
        beschrijving: "Educational AI tools en leerplatformen"
      },
      {
        naam: "Marketing & social media",
        slug: "marketing-social-media",
        beschrijving: "Marketing automation en social media tools"
      },
      {
        naam: "E-commerce & verkoop",
        slug: "ecommerce-verkoop",
        beschrijving: "Sales en e-commerce AI-oplossingen"
      },
      {
        naam: "Ontwikkeltools & code",
        slug: "ontwikkeltools-code",
        beschrijving: "AI-powered development en coding tools"
      },
      {
        naam: "Projectbeheer & planning",
        slug: "projectbeheer-planning",
        beschrijving: "Project management en planning tools"
      },
      {
        naam: "Notities & samenvattingen",
        slug: "notities-samenvattingen",
        beschrijving: "Note-taking en content summarization tools"
      },
      {
        naam: "Zoekmachineoptimalisatie (SEO)",
        slug: "seo",
        beschrijving: "SEO en search optimization tools"
      },
      {
        naam: "Tools voor dagelijks gebruik",
        slug: "dagelijks-gebruik",
        beschrijving: "Praktische AI-tools voor alledaags gebruik"
      }
    ];

    // Standaard sticky content voor alle kanalen
    const stickyContent = `Deel hier een tool die jij gebruikt binnen dit thema.
Voeg een korte uitleg toe, een link, en stem omhoog op wat jij waardevol vindt.
Alles is welkom, ook simpele tools. Als het werkt, is het goed.`;

    const createdChannels = [];
    
    // Maak elk kanaal aan
    for (let i = 0; i < kanalen.length; i++) {
      const kanaal = kanalen[i];
      
      // Controleer of het kanaal al bestaat
      const existingChannel = await ctx.db
        .query("channels")
        .filter((q) => q.eq(q.field("slug"), kanaal.slug))
        .first();

      if (!existingChannel) {
        // Maak het kanaal aan
        const channelId = await ctx.db.insert("channels", {
          naam: kanaal.naam,
          slug: kanaal.slug,
          beschrijving: kanaal.beschrijving,
          type: "templates" as const, // AI Toolbibliotheek kanalen zijn template-type
          sectieId: sectieId,
          aangemaaktDoor: args.aangemaaktDoor,
          stickyPosts: [],
          volgorde: i + 1,
          visible: true,
          aangemaaktOp: Date.now(),
        });

        // Maak de sticky post aan voor dit kanaal
        const stickyThreadId = await ctx.db.insert("threads", {
          kanaalId: channelId,
          titel: `Welkom in ${kanaal.naam}`,
          slug: `welkom-${kanaal.slug}`,
          threadNumber: 1,
          inhoud: stickyContent,
          auteurId: args.aangemaaktDoor,
          upvotes: [],
          sticky: true,
          type: "text",
          aangemaaktOp: Date.now(),
        });

        // Voeg de sticky post toe aan het kanaal
        await ctx.db.patch(channelId, {
          stickyPosts: [stickyThreadId]
        });

        createdChannels.push({
          channelId,
          naam: kanaal.naam,
          stickyThreadId
        });
      }
    }

    return {
      success: true,
      sectieId,
      createdChannels,
      message: `AI Toolbibliotheek sectie en ${createdChannels.length} kanalen succesvol aangemaakt`
    };
  },
});

// Mutation om een nieuwe tool post aan te maken
export const createToolPost = mutation({
  args: {
    kanaalId: v.id("channels"),
    titel: v.string(),
    omschrijving: v.string(),
    link: v.string(),
    label: v.optional(v.union(
      v.literal("gratis"),
      v.literal("betaald"), 
      v.literal("open source"),
      v.literal("freemium")
    )),
    auteurId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Genereer een slug voor de thread
    const slug = args.titel
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    // Bepaal het volgende thread nummer
    const existingThreads = await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("kanaalId"), args.kanaalId))
      .collect();
    
    const maxThreadNumber = existingThreads.length > 0 
      ? Math.max(...existingThreads.map(t => t.threadNumber)) 
      : 0;

    // Combineer tool informatie in de inhoud
    let inhoud = `**Tool:** ${args.titel}

**Omschrijving:**
${args.omschrijving}

**Link:** ${args.link}`;

    if (args.label) {
      inhoud += `

**Type:** [${args.label}]`;
    }

    // Maak de thread aan
    const threadId = await ctx.db.insert("threads", {
      kanaalId: args.kanaalId,
      titel: args.titel,
      slug: slug,
      threadNumber: maxThreadNumber + 1,
      inhoud: inhoud,
      auteurId: args.auteurId,
      upvotes: [],
      sticky: false,
      type: "text",
      aangemaaktOp: Date.now(),
    });

    return {
      success: true,
      threadId,
      message: "Tool post succesvol aangemaakt"
    };
  },
}); 