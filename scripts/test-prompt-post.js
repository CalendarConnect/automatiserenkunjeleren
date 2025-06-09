// Script om een test prompt post aan te maken
// Run met: node scripts/test-prompt-post.js

const { ConvexHttpClient } = require("convex/browser");

// Vervang dit met je deployment URL
const DEPLOYMENT_URL = process.env.CONVEX_URL || "https://wandering-mandrill-316.convex.cloud";

async function createTestPromptPost() {
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
    const promptstructurenChannel = channels.find(channel => 
      channel.slug === "promptstructuren"
    );
    
    if (!promptstructurenChannel) {
      console.error("❌ Promptstructuren kanaal niet gevonden!");
      return;
    }
    
    console.log(`📝 Kanaal gevonden: ${promptstructurenChannel.naam}`);
    
    // Maak een test prompt post aan
    const result = await client.mutation("promptbibliotheek:createPromptPost", {
      kanaalId: promptstructurenChannel._id,
      titel: "Rolgebaseerde AI Assistant Setup",
      prompt: `Je bent een ervaren [VAKGEBIED] expert met 10+ jaar ervaring.

Jouw taak:
- Geef praktische, uitvoerbare adviezen
- Gebruik concrete voorbeelden uit de praktijk
- Stel vervolgvragen om de context te begrijpen
- Wees direct en to-the-point

Communicatiestijl:
- Professioneel maar toegankelijk
- Gebruik bullet points voor duidelijkheid
- Geef altijd een concrete volgende stap

Begin elke reactie met: "Als [VAKGEBIED] expert zie ik dit..."`,
      toelichting: "Deze promptstructuur werkt perfect voor het opzetten van een gespecialiseerde AI assistant. Vervang [VAKGEBIED] met het gewenste expertisegebied (bijv. marketing, finance, HR). De structuur zorgt voor consistente, professionele antwoorden met praktische waarde. Gebruik dit als basis template en pas de specifieke instructies aan voor jouw use case.",
      auteurId: creator._id
    });
    
    console.log("✅ Test prompt post aangemaakt!");
    console.log(`🆔 Thread ID: ${result.threadId}`);
    
  } catch (error) {
    console.error("❌ Fout bij aanmaken test prompt:", error);
  }
}

// Run het script
createTestPromptPost(); 