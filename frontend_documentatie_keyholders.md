# Keyholders Community – Frontend Documentatie

## 1. Layout & Interface

- **Links**: vaste navigatiekolom met lijst van alle kanalen (type + label)
- **Midden**: hoofdcontentgebied met thread-overzicht of detailweergave
- **Rechts**: leeg, optioneel voor toekomstig gebruik
- Navigatiekolom is altijd zichtbaar

## 2. Onboardingflow

1. LinkedIn-login via Clerk
2. Pop-up voor profielaanmaak:
   - profielfoto uploaden
   - naam, functie, organisatie
   - korte beschrijving
   - expertise-tags (vrij instelbaar, searchable)
3. Welkomstpagina met communityregels (stap 1)
4. Keystack-uitlegpagina met embedded YouTube-video (stap 2)
5. Daarna volledige toegang tot platform

## 3. Paginaroutes (Next.js 15)

- `/kanalen` → overzicht van alle kanalen, filterbaar
- `/kanaal/[slug]` → inhoud van specifiek kanaal
- `/thread/[slug]` → enkele thread met reacties
- `/nieuw` → nieuwe thread of module starten
- `/profiel` → eigen profielpagina
- `/gebruiker/[slug]` → profielpagina van andere gebruikers
- `/beheer` → admin-only route voor sticky's en kanaaltypes

## 4. Kanaaltypes

- `discussie`: threads met reacties en upvotes
- `templates`: enkel admin, markdown uitleg + download
- `modules`: lesvorm of uitleg, geen reacties, alleen leesbaar

## 5. Componenten

- `KanaalSidebar`: kanaallijst
- `ThreadCard`: overzichtsweergave thread
- `ThreadView`: post met reacties
- `Editor`: Markdown met live preview
- `LoginScreen`: Clerk login + authenticatie
- `UserProfile`: avatar, bio, functie, tags, bijdragen
- `UserDirectory`: zoeken/filteren op gebruikers
- `OnboardingStep`: geneste stappencomponent voor onboardingflow

## 6. UX-regels

- Geen privéberichten
- Geen likes/followers
- Upvotes op threads, likes op comments
- Volledige transparantie: alles publiek
- Geen rolgebaseerde toegang
- Tag-based search op gebruikers en threads

## 7. Styling

- Licht thema (geen dark mode)
- Tailwind CSS
- ShadCN componenten
- Minimalistisch, mobielvriendelijk
- Maximale componentherbruikbaarheid