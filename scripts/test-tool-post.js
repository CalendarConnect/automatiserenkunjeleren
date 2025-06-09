// Script om een test tool post aan te maken
// Run met: node scripts/test-tool-post.js

const { ConvexHttpClient } = require("convex/browser");

// Vervang dit met je deployment URL
const DEPLOYMENT_URL = process.env.CONVEX_URL || "https://wandering-mandrill-316.convex.cloud";

async function createTestToolPost() {
  const client = new ConvexHttpClient(DEPLOYMENT_URL);
  
  try {
    // Haal gebruiker op
    const users = await client.query("users:getAllUsers");
    if (!users || users.length === 0) {
      console.error("Geen gebruikers gevonden.");
      return;
    }
    
    const creator = users[0];
    console.log(`Gebruiker: ${creator.naam}`);
    
    // Haal kanalen op
    const channels = await client.query("channels:getVisibleChannelsWithSecties");
    const tekstCopywritingChannel = channels.find(channel => 
      channel.slug === "tekst-copywriting"
    );
    
    if (!tekstCopywritingChannel) {
      console.error("❌ Tekst & copywriting kanaal niet gevonden!");
      return;
    }
    
    console.log(`🛠️ Kanaal gevonden: ${tekstCopywritingChannel.naam}`);
    
    // Maak een test tool post aan
    const result = await client.mutation("toolbibliotheek:createToolPost", {
      kanaalId: tekstCopywritingChannel._id,
      titel: "ChatGPT",
      omschrijving: "De bekendste AI-chatbot voor het schrijven van teksten, brainstormen en beantwoorden van vragen. Perfect voor copywriting, e-mails en content creatie.",
      link: "https://chat.openai.com",
      label: "freemium",
      auteurId: creator._id
    });
    
    console.log("✅ Test tool post aangemaakt!");
    console.log(`🆔 Thread ID: ${result.threadId}`);
    
    // Maak nog een tool post aan
    const result2 = await client.mutation("toolbibliotheek:createToolPost", {
      kanaalId: tekstCopywritingChannel._id,
      titel: "Grammarly",
      omschrijving: "AI-powered writing assistant die je helpt met grammatica, spelling en stijl. Integreert met browsers en tekstverwerkers voor real-time feedback.",
      link: "https://grammarly.com",
      label: "freemium",
      auteurId: creator._id
    });
    
    console.log("✅ Tweede test tool post aangemaakt!");
    console.log(`🆔 Thread ID: ${result2.threadId}`);
    
  } catch (error) {
    console.error("❌ Fout bij aanmaken test tool:", error);
  }
}

// Run het script
createTestToolPost(); 