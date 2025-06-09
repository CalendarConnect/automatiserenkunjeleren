// Script om de Promptbibliotheek sectie live te zetten
// Run met: node scripts/publish-promptbibliotheek.js

const { ConvexHttpClient } = require("convex/browser");

// Vervang dit met je deployment URL
const DEPLOYMENT_URL = process.env.CONVEX_URL || "https://wandering-mandrill-316.convex.cloud";

async function publishPromptbibliotheek() {
  const client = new ConvexHttpClient(DEPLOYMENT_URL);
  
  try {
    // Haal alle secties op
    const secties = await client.query("secties:getAllSecties");
    
    // Zoek de Promptbibliotheek sectie
    const promptbibliotheekSectie = secties.find(sectie => 
      sectie.naam === "📦 Promptbibliotheek"
    );
    
    if (!promptbibliotheekSectie) {
      console.error("❌ Promptbibliotheek sectie niet gevonden!");
      return;
    }
    
    console.log(`📦 Promptbibliotheek sectie gevonden: ${promptbibliotheekSectie._id}`);
    console.log(`📊 Huidige status: ${promptbibliotheekSectie.status || 'draft'}`);
    
    if (promptbibliotheekSectie.status === "live") {
      console.log("✅ Promptbibliotheek is al live!");
      return;
    }
    
    // Zet de sectie live
    const result = await client.mutation("secties:toggleSectieStatus", {
      sectieId: promptbibliotheekSectie._id
    });
    
    console.log("✅ Promptbibliotheek sectie is nu live!");
    console.log(`🔄 Nieuwe status: ${result.newStatus}`);
    
    // Haal alle kanalen op om te controleren
    const channels = await client.query("channels:getVisibleChannelsWithSecties");
    const promptChannels = channels.filter(channel => 
      channel.sectie && channel.sectie.naam === "📦 Promptbibliotheek"
    );
    
    console.log(`🔗 Zichtbare Promptbibliotheek kanalen: ${promptChannels.length}`);
    promptChannels.forEach((channel, index) => {
      console.log(`   ${index + 1}. ${channel.naam} (${channel.slug})`);
    });
    
  } catch (error) {
    console.error("❌ Fout bij publiceren Promptbibliotheek:", error);
  }
}

// Run het script
publishPromptbibliotheek(); 