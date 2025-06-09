# 📦 Promptbibliotheek

De Promptbibliotheek is een speciale sectie in de communityomgeving van "Automatiseren kun je leren" waar leden hun beste prompts kunnen delen en van elkaar leren.

## 🎯 Doel

De Promptbibliotheek wordt de centrale plek waar leden hun beste prompts kunnen delen. Het is ontworpen voor rust, overzicht, en menselijke samenwerking - zonder druk, stats of zichtbare rankings.

## 📦 Sectie-indeling

De Promptbibliotheek bevat acht vaste kanalen:

### 🧱 Promptstructuren
Formats die je keer op keer kunt gebruiken: instructieprompts, memorystructuren, rolgebaseerde setups — alles wat structuur geeft aan je promptgedrag.

### 🧑‍💻 Codegeneratie  
Prompts die code opleveren: Python, JS, SQL, shell-commando's, noem maar op.

### 💡 Idee-generatie
Denkprompts, brainstormsetups, conceptstarters — alles wat helpt om tot iets nieuws te komen.

### 🎨 Visualisatie
Prompten voor beeld: DALL·E, Midjourney, andere tools.

### 🪄 Vibe-Coding
Prompts waarmee je een toon, een stem of een karakter vormgeeft.

### 🔐 Compliance
Prompts die helpen om veilig, zorgvuldig en verantwoord te bouwen.

### ✍️ Copywriting
Teksten laten schrijven via AI: headlines, captions, productteksten, e-mails.

### 🔁 Automatisering
Prompts die iets doen in plaats van iets zeggen. Denk: n8n-integraties, API-chains, agent-taken.

## 🧱 Kanaalstructuur

Elk kanaal bestaat uit een lijst met individuele threads (prompt posts), met deze opbouw:

- **Titel** (in één regel, bovenaan)
- **Prompt** (in monospaced codeblok, duidelijk afgebakend)
- **Korte toelichting** (wanneer, waarvoor, waarom het werkt)
- **Optioneel**: afbeelding of screenshot
- **Upvote-knop** zichtbaar onderaan
- **Reacties** zijn toegestaan, zichtbaar onder de kaart

Promptposts worden standaard gesorteerd op meest geupvote bovenaan.

## 📌 Sticky Posts

Elk kanaal heeft één vaste sticky post die het kanaalintro bevat en niet verwijderd mag worden.

## 🎨 UI & Styling

- Elke promptpost zit in een lichte, afgeronde kaart
- Achtergrond per kaart: zacht lichtblauw of zandkleur (pastel)
- Typografie:
  - Titel in semibold
  - Prompt in monospaced codeblok met zachte rand
  - Uitleg in gewone tekst daaronder
- Upvote-knop onderaan rechts (één klik = omhoog, geen downvote)
- Sortering standaard: meest geupvote eerst
- Threads mogen reacties hebben, maar geen nested nesting

## 🛠️ Technische Implementatie

### Database Schema
De Promptbibliotheek gebruikt de bestaande `threads` tabel met `type: "text"` en een speciale content structuur:

```
**Prompt:**
```
[prompt content]
```

**Toelichting:**
[explanation content]
```

### Convex Functies

#### `promptbibliotheek.ts`
- `createPromptbibliotheek`: Maakt de sectie en alle kanalen aan
- `createPromptPost`: Maakt een nieuwe prompt post aan

### React Componenten

#### `PromptCard.tsx`
Speciale kaart component voor het weergeven van prompt posts met:
- Parsing van prompt en toelichting
- Monospaced codeblok voor prompts
- Upvote functionaliteit
- Responsive design

#### `PromptPostForm.tsx`
Formulier voor het aanmaken van nieuwe prompt posts met:
- Titel input
- Prompt textarea (monospaced)
- Toelichting textarea
- Optionele afbeelding URL
- Validatie

#### `PromptbibliotheekKanaal.tsx`
Speciale kanaal component voor Promptbibliotheek kanalen met:
- Sortering op upvotes (standaard) of datum
- Filtering van sticky posts
- Integratie met PromptCard en PromptPostForm

### Kanaal Pagina Integratie

De bestaande kanaal pagina (`/kanaal/[slug]/page.tsx`) detecteert automatisch Promptbibliotheek kanalen en gebruikt de speciale `PromptbibliotheekKanaal` component in plaats van de standaard thread lijst.

## 🚀 Setup & Deployment

### Automatische Setup
```bash
# Maak de sectie en kanalen aan
node scripts/setup-promptbibliotheek.js

# Zet de sectie live (indien nodig)
node scripts/publish-promptbibliotheek.js

# Test met een voorbeeld prompt
node scripts/test-prompt-post.js
```

### Handmatige Setup
1. Run de `createPromptbibliotheek` mutation met een geldige `aangemaaktDoor` user ID
2. Toggle de sectie status naar "live" met `toggleSectieStatus`
3. Controleer dat alle kanalen zichtbaar zijn

## 🎁 Gedrag en Toon

Het platform is ontworpen voor een plek zonder druk:
- Geen stats, geen prestaties, geen zichtbare rankings
- Alle taal is uitnodigend, maar niet overtuigend
- Geen tekst zoals "Sluit je aan", "Boost je prompt", "Word zichtbaar"
- Focus op rust, overzicht, en menselijke samenwerking

## 📝 Content Richtlijnen

### Voor Prompt Posts
- **Titel**: Duidelijk en beschrijvend
- **Prompt**: Werkende prompt die direct te gebruiken is
- **Toelichting**: Wanneer gebruik je het? Waarvoor werkt het? Waarom is het effectief?
- **Afbeelding**: Optioneel, alleen als het toegevoegde waarde heeft

### Voor Reacties
- Praktische feedback
- Variaties en verbeteringen
- Ervaringen met de prompt
- Geen zelfpromotie (behalve in daarvoor bestemde kanalen)

## 🔧 Onderhoud

- Sticky posts mogen niet verwijderd worden
- Moderators kunnen threads verplaatsen tussen kanalen indien nodig
- Upvotes kunnen niet worden gedownvote (alleen toggle on/off)
- Sortering blijft altijd op upvotes als standaard 