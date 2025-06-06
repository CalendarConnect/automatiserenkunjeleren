Keyholders Community Platform
Product Requirements Document (PRD)

Doel van het platform
Een zelfgehoste, open communityomgeving op community.keyholders.agency waarin ondernemers, ontwikkelaars en strategen publiek kunnen discussiëren over AI-implementatie, infrastructuur, modellen, ethiek en compliance. Geen gesloten platform, geen sales, geen privéchat. Alleen inhoudelijk debat en kennisdeling. Geheel onder eigen regie, op eigen server.

Doelgroep

MKB-ondernemers die AI willen implementeren

Developers die met Ollama, Open WebUI, n8n en VPS werken

Strategen die nadenken over datasoevereiniteit en infrastructuur

Professionals uit zorg, onderwijs, marketing, overheid en techniek

Kernprincipes

Open discussies, geen private 1-op-1 chat

Geen hiërarchie of badges

Nederlands als voertaal

Geen rolgebaseerde toegang (wel toegang via e-mail/LinkedIn login)

Geen gamification, geen directe connectie tussen gebruikers

Volledig transparante gespreksstructuur, alles publiek

Toegang & Authenticatie

Via Clerk.dev met LinkedIn OAuth only

Geen anonieme gebruikers

Publiek leesbare topics, alleen geregistreerde gebruikers kunnen posten

Technische Stack

Frontend: Next.js 15 (TypeScript)

Styling/UI: Tailwind CSS + ShadCN

Backend: ConvexDB

Hosting: Dedicated VPS bij Hostinger (Ubuntu 22.04)

Databasebeheer: Convex Functions en Auth Middleware

Belangrijkste functies

Threaded discussies per kanaal

Mogelijkheid tot stemmen op threads (upvote)

Reacties mogelijk binnen threads (commentaar), lineair weergegeven

Markdown-ondersteuning in posts en reacties

Sticky posts per kanaal

Zoeken op onderwerp of trefwoord

Verschillende kanaaltypes: modules, templates, discussies

Comments kunnen geliket worden

Volledige controle over structuur: kanaaltype bepaalt functionaliteit

Gebruikersprofielen met profielfoto, beschrijving, functietitel, expertisevelden, en zoekbare tags

Zoekfunctie op gebruikers via expertise-tags

Mogelijkheid om op profielpagina alle threads en reacties van gebruiker te bekijken

Onboardingflow via stappenpagina’s: profiel aanmaken → welkom → uitleg Keystack

Systeembeperkingen

Platform moet schaalbaar blijven voor >500 actieve gebruikers zonder performanceverlies

Alle content is in plain text + markdown, geen rich embedder

Beveiliging van routes via Clerk sessies en Convex middleware

Frontend Specificatie

1. Layout & Interface

Links: vaste navigatiekolom met lijst van kanalen

Midden: hoofdcontentgebied (threadlijst of threadview)

Rechts: optioneel leeg of voor latere extensie (bv. suggesties, laatste bijdrages)

Alle kanalen blijven altijd zichtbaar in de navigatiekolom

2. Onboardingflow

Stap 1: LinkedIn OAuth login via Clerk

Stap 2: Pop-up profielaanmaak (upload avatar, bedrijfsnaam, functie, expertise, vrije beschrijving, tags)

Stap 3: Welkomspagina met communityregels en “volgende”-knop

Stap 4: Keystack-uitlegpagina met embed YouTube-video + extra toelichting

Daarna: volledige toegang tot de communityomgeving

3. Paginaroutes (Next.js /app-routing):

/kanalen → overzicht van alle kanalen, filter op type (thread / module / template)

/kanaal/[slug] → view van één kanaal met sticky posts en threads/modules

/thread/[slug] → enkele thread met reacties

/nieuw → nieuwe thread/module aanmaken (alleen ingelogd)

/profiel → eigen profielpagina met overzicht bijdragen

/gebruiker/[slug] → publieke profielpagina van andere leden met bio, tags, threads, reacties

/beheer → (admin-only) sticky maken/verwijderen post, kanaaltype instellen

4. Kanaaltypes (instelbaar per kanaal):

Discussie (met threads, upvotes, comments)

Templates (alleen admin-upload, downloadbaar, markdown uitleg)

Modules (documentatie of lesvorm, geen reacties, alleen admin)

5. Componenten:

KanaalSidebar → vaste zijbalk links met alle kanalen

ThreadCard → titel, excerpt, datum, auteur, upvotes

ThreadView → originele post + reacties + comment-likes

Editor → Markdown-veld met live preview (ShadCN textarea + preview tab)

LoginScreen → Clerk login via LinkedIn

UserProfile → profielfoto, naam, functie, organisatie, beschrijving, expertise-tags, lijst bijdragen

UserDirectory → overzicht van alle leden met filter/search op tags of naam

OnboardingStep → component voor stapweergave met navigatie (bijv. regels, Keystack-uitleg)

6. UX-regels:

Geen privéchat of DM

Geen mentions of volgsystemen

Threads kunnen worden upvoted, reacties kunnen worden geliket

Functionaliteit per kanaal is afhankelijk van het ingestelde kanaaltype

Zoeken op titel + inhoud via Convex full-text query

Gebruikerstags zijn vrij instelbaar bij profielbewerking

7. Styling:

Licht thema, geen dark mode

Tailwind + ShadCN componenten, volledig mobile-first

Consistente componentherbruikbaarheid

Visueel minimalistisch, 2025 designstandaard

Focus op eenvoud, leesbaarheid en inhoud

Volgende document: Backend Specificatie (ConvexDB schema + functies)

