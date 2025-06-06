import { mutation } from "./_generated/server";

export const seedAllChannels = mutation({
  args: {},
  handler: async (ctx) => {
    // Get the test user
    const testUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), "test-user-1"))
      .first();

    if (!testUser) {
      throw new Error("Test user not found. Run seedData first.");
    }

    // Check if channels already exist
    const existingChannels = await ctx.db.query("channels").collect();
    if (existingChannels.length > 3) {
      return "Channels already seeded";
    }

    const channelsToCreate = [
      // 📌 Startpunt
      {
        naam: "Welkom",
        slug: "welkom",
        beschrijving: "Waarom deze omgeving bestaat, wat je hier wel en niet vindt",
        type: "modules" as const,
        category: "Startpunt"
      },
      {
        naam: "Toegang krijgen",
        slug: "toegang-krijgen", 
        beschrijving: "Info over hoe je lid wordt (via LinkedIn login met Clerk)",
        type: "modules" as const,
        category: "Startpunt"
      },
      {
        naam: "Voorstellen",
        slug: "voorstellen",
        beschrijving: "Wie ben je, waar werk je aan, wat wil je hier leren of bijdragen",
        type: "discussie" as const,
        category: "Startpunt"
      },

      // 🛠️ Infrastructuur & Implementatie  
      {
        naam: "VPS & installatievragen",
        slug: "vps-installatie",
        beschrijving: "Alles over servers, poorten, fouten, instellingen",
        type: "discussie" as const,
        category: "Infrastructuur"
      },
      {
        naam: "Open WebUI & modellen",
        slug: "open-webui-modellen",
        beschrijving: "Hoe je Mistral, Ollama of Phi draait, optimalisatie, problemen",
        type: "discussie" as const,
        category: "Infrastructuur"
      },
      {
        naam: "n8n & automatisering",
        slug: "n8n-automatisering",
        beschrijving: "Workflows bouwen, integraties, agentics",
        type: "discussie" as const,
        category: "Infrastructuur"
      },
      {
        naam: "Beveiliging & hosting",
        slug: "beveiliging-hosting",
        beschrijving: "NGINX, firewall, backups, data-afhandeling",
        type: "discussie" as const,
        category: "Infrastructuur"
      },
      {
        naam: "Foutmeldingen / debugging",
        slug: "debugging",
        beschrijving: "Gestructureerde hulp bij logs, errors, setupproblemen",
        type: "discussie" as const,
        category: "Infrastructuur"
      },

      // 🧭 Sector-specifieke implementatie
      {
        naam: "Marketing & content",
        slug: "marketing-content",
        beschrijving: "Gebruik van AI voor SEO, copywriting, klantflows",
        type: "discussie" as const,
        category: "Sectoren"
      },
      {
        naam: "Zorg & welzijn",
        slug: "zorg-welzijn",
        beschrijving: "Automatisering in zorgpraktijken of organisaties",
        type: "discussie" as const,
        category: "Sectoren"
      },
      {
        naam: "Onderwijs & training",
        slug: "onderwijs-training",
        beschrijving: "AI in lesmateriaal, LMS, organisatie",
        type: "discussie" as const,
        category: "Sectoren"
      },
      {
        naam: "Kleine bedrijven & MKB",
        slug: "mkb",
        beschrijving: "Hoe AI praktisch en veilig wordt toegepast bij ondernemers",
        type: "discussie" as const,
        category: "Sectoren"
      },

      // 💬 Discussie & Strategische keuzes
      {
        naam: "AI in eigen beheer of uitbesteden?",
        slug: "eigen-beheer-uitbesteden",
        beschrijving: "Discussie over controle, eigenaarschap, cloud vs lokaal",
        type: "discussie" as const,
        category: "Strategie"
      },
      {
        naam: "Wetgeving & ethiek",
        slug: "wetgeving-ethiek",
        beschrijving: "AVG, AI Act, datasoevereiniteit",
        type: "discussie" as const,
        category: "Strategie"
      },
      {
        naam: "Welke modellen kies je?",
        slug: "model-keuzes",
        beschrijving: "Wat werkt, wat niet — onderbouwingen delen",
        type: "discussie" as const,
        category: "Strategie"
      },
      {
        naam: "Toekomst van agents",
        slug: "toekomst-agents",
        beschrijving: "Gesprekken over taken, rollen en mens-in-de-lus",
        type: "discussie" as const,
        category: "Strategie"
      },

      // 📂 Templates & Bijdragen
      {
        naam: "Werkende voorbeelden",
        slug: "werkende-voorbeelden",
        beschrijving: "Threads waarin leden hun setup of use case uitleggen",
        type: "templates" as const,
        category: "Templates"
      },
      {
        naam: "n8n-flows (te downloaden)",
        slug: "n8n-flows",
        beschrijving: "Uploadbare voorbeelden met uitleg",
        type: "templates" as const,
        category: "Templates"
      },
      {
        naam: "Dockerfiles & installscriptjes",
        slug: "dockerfiles-scripts",
        beschrijving: "Zelfgebouwde tools, setups, toevoegingen",
        type: "templates" as const,
        category: "Templates"
      },
      {
        naam: "Promptvoorbeelden / instructies",
        slug: "prompt-voorbeelden",
        beschrijving: "GPT-logica, toolpromptstructuren, agent-aansturing",
        type: "templates" as const,
        category: "Templates"
      },

      // 🧷 Functioneel & Organisatie
      {
        naam: "Feedback gevraagd",
        slug: "feedback-gevraagd",
        beschrijving: "Check mijn setup, Kan dit beter?, peer review",
        type: "discussie" as const,
        category: "Organisatie"
      },
      {
        naam: "Vraag & Antwoord",
        slug: "vraag-antwoord",
        beschrijving: "Eén centrale ruimte voor korte vragen",
        type: "discussie" as const,
        category: "Organisatie"
      },
      {
        naam: "Community updates",
        slug: "community-updates",
        beschrijving: "Nieuwe drops, verbeteringen, releases, keynotes",
        type: "modules" as const,
        category: "Organisatie"
      },
      {
        naam: "Voorstellen voor uitbreiding",
        slug: "voorstellen-uitbreiding",
        beschrijving: "Ideeën voor nieuwe kanalen of onderwerpen",
        type: "discussie" as const,
        category: "Organisatie"
      },
    ];

    // Create all channels
    const createdChannels = [];
    for (const channelData of channelsToCreate) {
      const channelId = await ctx.db.insert("channels", {
        naam: channelData.naam,
        slug: channelData.slug,
        beschrijving: channelData.beschrijving,
        type: channelData.type,
        aangemaaktDoor: testUser._id,
        stickyPosts: [],
        aangemaaktOp: Date.now(),
      });
      
      createdChannels.push({
        id: channelId,
        naam: channelData.naam,
        category: channelData.category
      });
    }

    return `Successfully created ${createdChannels.length} channels for Keyholders Community!`;
  },
}); 