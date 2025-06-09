# 🛠️ AI Toolbibliotheek

De AI Toolbibliotheek is een speciale sectie in de communityomgeving van "Automatiseren kun je leren" waar leden hun favoriete AI-tools kunnen delen en ontdekken.

## 🎯 Doel

Vind en deel de tools die jij écht gebruikt met AI. De bibliotheek is ontworpen voor rust, overzicht en bruikbaarheid - zonder druk, sales of affiliate-structuur. Alles voelt open, speels en bruikbaar.

## 📂 Categorieën (kanalen)

De AI Toolbibliotheek bevat 15 vaste kanalen:

### 1. Automatisering & workflows
Tools voor het automatiseren van processen en workflows

### 2. Tekst & copywriting  
AI-tools voor het schrijven en bewerken van teksten

### 3. Beeld & visualisatie
Tools voor het genereren en bewerken van afbeeldingen

### 4. Video & audio
AI-tools voor video- en audioproductie

### 5. Chatbots & assistenten
Conversationele AI en virtuele assistenten

### 6. Ontwerp & UX
Design tools en UX/UI hulpmiddelen

### 7. Analyse & dashboards
Data-analyse en visualisatie tools

### 8. Onderwijs & leren
Educational AI tools en leerplatformen

### 9. Marketing & social media
Marketing automation en social media tools

### 10. E-commerce & verkoop
Sales en e-commerce AI-oplossingen

### 11. Ontwikkeltools & code
AI-powered development en coding tools

### 12. Projectbeheer & planning
Project management en planning tools

### 13. Notities & samenvattingen
Note-taking en content summarization tools

### 14. Zoekmachineoptimalisatie (SEO)
SEO en search optimization tools

### 15. Tools voor dagelijks gebruik
Praktische AI-tools voor alledaags gebruik

## 🧱 Structuur van een toolpost

Elke toolpost is een **kaart** met deze inhoud:

- **Titel** = naam van de tool (in bold)
- **Omschrijving** = max. 3 regels over wat het doet of waarvoor je het gebruikt
- **Link** = externe knop "🔗 Bezoek tool"
- **Optioneel label**: [gratis], [betaald], [open source], [freemium]
- **Upvote-knop** onderaan rechts (1 klik = omhoog, geen downvote)
- **Responsief gedrag**:
  - mobiel: stacked kaarten
  - desktop: cards in grid (max 3 per rij)

## 📌 Sticky Posts

Elke categorie heeft één vaste sticky bovenaan met deze tekst:

> Deel hier een tool die jij gebruikt binnen dit thema.
> Voeg een korte uitleg toe, een link, en stem omhoog op wat jij waardevol vindt.
> Alles is welkom, ook simpele tools. Als het werkt, is het goed.

## ✨ UX & Stijlrichtlijnen

- **Grid Layout**: Desktop max 3 per rij, mobiel gestapeld
- **Kaart styling**: Licht afgerond met pastelachtergrond (zachtgeel/lichtblauw)
- **Typografie**:
  - Titel in semibold
  - Omschrijving in gewone tekst
  - Linkbutton in zachte kleur met emoji: "🔗 Bezoek tool"
- **Sortering**: Automatisch op upvotes (meest geupvote bovenaan)
- **Labels**: Gekleurde badges voor gratis/betaald/freemium/open source
- **Hover-effecten**: Alleen waar standaard in het systeem aanwezig

## 🛠️ Technische Implementatie

### Database Schema
De AI Toolbibliotheek gebruikt de bestaande `threads` tabel met `type: "text"` en een speciale content structuur:

```
**Tool:** [tool naam]

**Omschrijving:**
[tool omschrijving]

**Link:** [tool URL]

**Type:** [label] (optioneel)
```

### Convex Functies

#### `toolbibliotheek.ts`
- `createToolbibliotheek`: Maakt de sectie en alle 15 kanalen aan
- `createToolPost`: Maakt een nieuwe tool post aan

### React Componenten

#### `ToolCard.tsx`
Speciale kaart component voor het weergeven van tool posts met:
- Parsing van tool informatie
- Externe link button met "🔗 Bezoek tool"
- Label badges met kleuren
- Grid-compatible design
- Upvote functionaliteit

#### `ToolPostForm.tsx`
Formulier voor het aanmaken van nieuwe tool posts met:
- Tool naam input
- Omschrijving textarea (max 3 regels)
- Link URL input
- Label dropdown (gratis/betaald/freemium/open source)
- Validatie

#### `ToolbibliotheekKanaal.tsx`
Speciale kanaal component voor AI Toolbibliotheek kanalen met:
- Grid layout (1/2/3 kolommen responsive)
- Sortering op upvotes (standaard) of datum
- Filtering van sticky posts
- Integratie met ToolCard en ToolPostForm

### Kanaal Pagina Integratie

De bestaande kanaal pagina (`/kanaal/[slug]/page.tsx`) detecteert automatisch AI Toolbibliotheek kanalen en gebruikt de speciale `ToolbibliotheekKanaal` component met grid layout.

## 🚀 Setup & Deployment

### Automatische Setup
```bash
# Maak de sectie en kanalen aan
node scripts/setup-toolbibliotheek.js

# Test met voorbeeld tools
node scripts/test-tool-post.js
```

### Handmatige Setup
1. Run de `createToolbibliotheek` mutation met een geldige `aangemaaktDoor` user ID
2. Controleer dat alle 15 kanalen zichtbaar zijn
3. Test de grid layout en tool posting functionaliteit

## 🧠 Communitytoon

Het platform volgt deze richtlijnen:
- **Geen advertenties** of commerciële druk
- **Geen affiliate-links** of verborgen commissies
- **Geen "Top tools"-framing** of rankings
- **Wel**: uitnodigen, delen, ontdekken
- **Iedereen mag posten** - je hoeft geen expert te zijn
- **Open en speels** - als het werkt, is het goed

## 📝 Content Richtlijnen

### Voor Tool Posts
- **Titel**: Exacte naam van de tool
- **Omschrijving**: Kort en praktisch (max. 3 regels)
- **Link**: Directe link naar de tool
- **Label**: Eerlijk over kosten (gratis/betaald/freemium/open source)

### Voor Reacties
- Praktische ervaringen met de tool
- Tips voor gebruik
- Alternatieven en vergelijkingen
- Geen zelfpromotie (behalve in daarvoor bestemde kanalen)

## 🎨 Styling Details

### Label Kleuren
- **Gratis**: Groen (`bg-green-100 text-green-800`)
- **Betaald**: Blauw (`bg-blue-100 text-blue-800`)
- **Open Source**: Paars (`bg-purple-100 text-purple-800`)
- **Freemium**: Oranje (`bg-orange-100 text-orange-800`)

### Grid Responsiveness
- **Mobile**: 1 kolom (stacked)
- **Tablet**: 2 kolommen
- **Desktop**: 3 kolommen (max)

### Card Design
- **Achtergrond**: `bg-gradient-to-br from-yellow-50/50 to-blue-50/50`
- **Shadow**: `shadow-md hover:shadow-lg`
- **Border**: Geen border, alleen shadow
- **Padding**: `p-6` voor content

## 🔧 Onderhoud

- Sticky posts mogen niet verwijderd worden
- Moderators kunnen tools verplaatsen tussen kanalen indien nodig
- Upvotes kunnen niet worden gedownvote (alleen toggle on/off)
- Sortering blijft altijd op upvotes als standaard
- Grid layout past automatisch aan op schermgrootte 