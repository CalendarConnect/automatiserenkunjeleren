import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Mutation om de Promptbibliotheek sectie en kanalen aan te maken
export const createPromptbibliotheek = mutation({
  args: {
    aangemaaktDoor: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Eerst controleren of de sectie al bestaat
    const existingSectie = await ctx.db
      .query("secties")
      .filter((q) => q.eq(q.field("naam"), "📦 Promptbibliotheek"))
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
        naam: "📦 Promptbibliotheek",
        emoji: "📦",
        kleur: "#8B5CF6", // Purple color
        status: "live",
        volgorde: maxVolgorde + 1,
        aangemaaktOp: Date.now(),
      });
    }

    // Definieer de kanalen voor de Promptbibliotheek
    const kanalen = [
      {
        naam: "🧱 Promptstructuren",
        slug: "promptstructuren",
        beschrijving: "Formats die je keer op keer kunt gebruiken: instructieprompts, memorystructuren, rolgebaseerde setups — alles wat structuur geeft aan je promptgedrag.",
        stickyContent: `Welkom in dit kanaal.
Hier deel je formats die je keer op keer kunt gebruiken: instructieprompts, memorystructuren, rolgebaseerde setups — alles wat structuur geeft aan je promptgedrag.
Post je prompt, vertel erbij wat het doet en wanneer je 'm gebruikt.
📌 Als iets voor jou werkt, stem het omhoog. Zo bouwen we samen de beste set.`
      },
      {
        naam: "🧑‍💻 Codegeneratie",
        slug: "codegeneratie",
        beschrijving: "Prompts die code opleveren: Python, JS, SQL, shell-commando's, noem maar op.",
        stickyContent: `Voor prompts die code opleveren: Python, JS, SQL, shell-commando's, noem maar op.
Laat je prompt zien, deel wat eruit komt, en vertel wanneer je 'm gebruikt.
📌 Alles wat werkende code oplevert is welkom — ook kleine stukjes.`
      },
      {
        naam: "💡 Idee-generatie",
        slug: "idee-generatie",
        beschrijving: "Denkprompts, brainstormsetups, conceptstarters — alles wat helpt om tot iets nieuws te komen.",
        stickyContent: `Denkprompts, brainstormsetups, conceptstarters — alles wat helpt om tot iets nieuws te komen.
Ook halve ideeën zijn waardevol. Deel je prompt en vertel wat eruit kwam.
📌 Werkt het als denkpartner? Dan hoort het hier.`
      },
      {
        naam: "🎨 Visualisatie",
        slug: "visualisatie",
        beschrijving: "Prompten voor beeld: DALL·E, Midjourney, andere tools.",
        stickyContent: `Prompten voor beeld: DALL·E, Midjourney, andere tools.
Gebruik je AI om renders, illustraties of stijlopzetten te maken? Laat zien hoe je dat aanpakt.
📌 Voeg je prompt toe, en (als je wil) een beeld van het resultaat.`
      },
      {
        naam: "🪄 Vibe-Coding",
        slug: "vibe-coding",
        beschrijving: "Prompts waarmee je een toon, een stem of een karakter vormgeeft.",
        stickyContent: `Prompts waarmee je een toon, een stem of een karakter vormgeeft.
Bijvoorbeeld: tone-of-voice-structuren, persona-prompts, agents met gedrag.
📌 Laat zien hoe je dat stuurt — en hoe je een AI menselijk laat voelen.`
      },
      {
        naam: "🔐 Compliance",
        slug: "compliance",
        beschrijving: "Prompts die helpen om veilig, zorgvuldig en verantwoord te bouwen.",
        stickyContent: `Hier komen prompts die helpen om veilig, zorgvuldig en verantwoord te bouwen.
AVG, AI Act, ethische rollen, loggingprompts — dit is waar ze thuishoren.
📌 Wat hier werkt, beschermt ook anderen. Deel je aanpak.`
      },
      {
        naam: "✍️ Copywriting",
        slug: "copywriting",
        beschrijving: "Teksten laten schrijven via AI: headlines, captions, productteksten, e-mails.",
        stickyContent: `Teksten laten schrijven via AI: headlines, captions, productteksten, e-mails.
Laat zien hoe je prompt eruitziet, wat het oplevert, en waarom het werkt.
📌 Praktisch. Geen theorie. Gewoon delen wat schrijft.`
      },
      {
        naam: "🔁 Automatisering",
        slug: "automatisering",
        beschrijving: "Prompts die iets doen in plaats van iets zeggen. Denk: n8n-integraties, API-chains, agent-taken.",
        stickyContent: `Prompts die iets doen in plaats van iets zeggen. Denk: n8n-integraties, API-chains, agent-taken.
Als je prompt iets triggert, hoort het hier.
📌 Bouw je logica met prompts? Deel 'm hier.`
      }
    ];

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
          type: "templates" as const, // Promptbibliotheek kanalen zijn template-type
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
          inhoud: kanaal.stickyContent,
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
      message: `Promptbibliotheek sectie en ${createdChannels.length} kanalen succesvol aangemaakt`
    };
  },
});

// Mutation om een nieuwe prompt post aan te maken
export const createPromptPost = mutation({
  args: {
    kanaalId: v.id("channels"),
    titel: v.string(),
    prompt: v.string(),
    toelichting: v.string(),
    auteurId: v.id("users"),
    afbeelding: v.optional(v.string()),
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

    // Combineer prompt en toelichting in de inhoud
    const inhoud = `**Prompt:**
\`\`\`
${args.prompt}
\`\`\`

**Toelichting:**
${args.toelichting}`;

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
      afbeelding: args.afbeelding,
      type: "text",
      aangemaaktOp: Date.now(),
    });

    return {
      success: true,
      threadId,
      message: "Prompt post succesvol aangemaakt"
    };
  },
}); 