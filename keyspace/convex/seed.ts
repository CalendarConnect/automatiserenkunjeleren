import { mutation } from "./_generated/server";

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingChannels = await ctx.db.query("channels").collect();
    if (existingChannels.length > 0) {
      return "Data already seeded";
    }

    // Create test user
    const testUserId = await ctx.db.insert("users", {
      clerkId: "test-user-1",
      naam: "Test Gebruiker",
      functie: "Developer",
      organisatie: "Keyholders",
      bio: "Test gebruiker voor de applicatie",
      tags: ["AI", "Development", "Testing"],
      aangemaaktOp: Date.now(),
    });

    // Create channels
    const discussieChannel = await ctx.db.insert("channels", {
      naam: "AI Implementatie",
      slug: "ai-implementatie",
      beschrijving: "Discussies over AI implementatie in bedrijfsprocessen",
      type: "discussie",
      aangemaaktDoor: testUserId,
      stickyPosts: [],
      aangemaaktOp: Date.now(),
    });

    const templatesChannel = await ctx.db.insert("channels", {
      naam: "Templates & Voorbeelden",
      slug: "templates",
      beschrijving: "Herbruikbare templates en codevoorbeelden",
      type: "templates",
      aangemaaktDoor: testUserId,
      stickyPosts: [],
      aangemaaktOp: Date.now(),
    });

    const modulesChannel = await ctx.db.insert("channels", {
      naam: "Leermodules",
      slug: "leermodules",
      beschrijving: "Educatieve modules over AI en technologie",
      type: "modules",
      aangemaaktDoor: testUserId,
      stickyPosts: [],
      aangemaaktOp: Date.now(),
    });

    // Create some test threads
    const thread1 = await ctx.db.insert("threads", {
      kanaalId: discussieChannel,
      titel: "Welke AI-modellen gebruiken jullie?",
      inhoud: "Ik ben benieuwd naar de ervaringen van anderen met verschillende AI-modellen. Welke modellen gebruiken jullie en waarom?",
      auteurId: testUserId,
      upvotes: [],
      sticky: false,
      aangemaaktOp: Date.now(),
    });

    const thread2 = await ctx.db.insert("threads", {
      kanaalId: discussieChannel,
      titel: "Privacy en AI: hoe gaan jullie hiermee om?",
      inhoud: "Privacy is een belangrijk onderwerp bij AI-implementatie. Hoe zorgen jullie ervoor dat klantdata veilig blijft?",
      auteurId: testUserId,
      upvotes: [],
      sticky: true,
      aangemaaktOp: Date.now() - 86400000, // 1 day ago
    });

    // Add sticky post to channel
    await ctx.db.patch(discussieChannel, {
      stickyPosts: [thread2],
    });

    // Create some comments
    await ctx.db.insert("comments", {
      threadId: thread1,
      auteurId: testUserId,
      inhoud: "Zelf gebruik ik vooral Ollama voor lokale modellen. Werkt goed voor privacy-gevoelige toepassingen.",
      likes: [],
      aangemaaktOp: Date.now() - 3600000, // 1 hour ago
    });

    return "Seed data created successfully";
  },
}); 