// Script om de AI Toolbibliotheek sectie en kanalen aan te maken
// Run met: node scripts/setup-toolbibliotheek.js

const { ConvexHttpClient } = require("convex/browser");

// Vervang dit met je deployment URL
const DEPLOYMENT_URL = process.env.CONVEX_URL || "https://wandering-mandrill-316.convex.cloud";

async function setupToolbibliotheek() {
  const client = new ConvexHttpClient(DEPLOYMENT_URL);
  
  try {
    // Eerst een gebruiker ophalen om als creator te gebruiken
    const users = await client.query("users:getAllUsers");
    if (!users || users.length === 0) {
      console.error("Geen gebruikers gevonden. Maak eerst een gebruiker aan.");
      return;
    }
    
    const creator = users[0]; // Gebruik de eerste gebruiker als creator
    console.log(`Gebruiker gevonden: ${creator.naam} (${creator._id})`);
    
    // Maak de AI Toolbibliotheek sectie en kanalen aan
    const result = await client.mutation("toolbibliotheek:createToolbibliotheek", {
      aangemaaktDoor: creator._id
    });
    
    console.log("✅ AI Toolbibliotheek succesvol aangemaakt!");
    console.log(`🛠️ Sectie ID: ${result.sectieId}`);
    console.log(`🔗 Kanalen aangemaakt: ${result.createdChannels.length}`);
    
    result.createdChannels.forEach((channel, index) => {
      console.log(`   ${index + 1}. ${channel.naam} (ID: ${channel.channelId})`);
    });
    
  } catch (error) {
    console.error("❌ Fout bij aanmaken AI Toolbibliotheek:", error);
  }
}

// Run het script
setupToolbibliotheek(); 