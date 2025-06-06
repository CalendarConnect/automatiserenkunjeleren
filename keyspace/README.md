# Keyspace - Keyholders Community Platform

Een zelfgehoste, open communityomgeving waarin ondernemers, ontwikkelaars en strategen publiek kunnen discussiëren over AI-implementatie, infrastructuur, modellen, ethiek en compliance.

## 🚀 Features

- **Open discussies** - Geen private chat, alles publiek
- **Threaded discussies** per kanaal
- **Upvoting systeem** voor threads
- **Reacties met likes** binnen threads
- **Markdown ondersteuning** in posts en reacties
- **Sticky posts** per kanaal
- **Zoekfunctionaliteit** op threads en gebruikers
- **Gebruikersprofielen** met expertise tags
- **Verschillende kanaaltypes**: discussies, templates, modules

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (TypeScript)
- **Styling**: Tailwind CSS + ShadCN/ui
- **Backend**: ConvexDB
- **Authenticatie**: Clerk.dev (LinkedIn OAuth)
- **Hosting**: VPS (Ubuntu 22.04)

## 📦 Installatie

### Vereisten

- Node.js 18+
- npm of yarn
- Convex account
- Clerk account (voor authenticatie)

### Setup

1. **Clone het project**
   ```bash
   git clone <repository-url>
   cd keyspace
   ```

2. **Installeer dependencies**
   ```bash
   npm install
   ```

3. **Convex setup**
   ```bash
   npx convex dev
   ```
   Volg de instructies om een Convex project aan te maken.

4. **Environment variabelen**
   Maak een `.env.local` bestand aan:
   ```env
   # Convex
   CONVEX_DEPLOYMENT=your-convex-deployment
   NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud

   # Clerk (optioneel voor development)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-key
   CLERK_SECRET_KEY=sk_test_your-clerk-secret
   ```

5. **Seed test data (optioneel)**
   ```bash
   # In Convex dashboard of via CLI
   npx convex run seed:seedData
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

   De applicatie is nu beschikbaar op `http://localhost:3000`

## 🏗 Project Structuur

```
keyspace/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── kanalen/        # Kanalen overzicht
│   │   ├── kanaal/[slug]/  # Kanaal detail
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React componenten
│   │   ├── ui/            # ShadCN componenten
│   │   ├── KanaalSidebar.tsx
│   │   └── ThreadCard.tsx
│   ├── providers/         # Context providers
│   └── lib/              # Utilities
├── convex/               # Convex backend
│   ├── schema.ts        # Database schema
│   ├── users.ts         # User functions
│   ├── channels.ts      # Channel functions
│   ├── threads.ts       # Thread functions
│   ├── comments.ts      # Comment functions
│   └── seed.ts          # Test data
└── public/              # Static assets
```

## 🗄 Database Schema

### Users
- clerkId, naam, avatarUrl, functie, organisatie, bio, tags

### Channels
- naam, slug, beschrijving, type (discussie/templates/modules), stickyPosts

### Threads
- kanaalId, titel, inhoud, auteurId, upvotes, sticky

### Comments
- threadId, auteurId, inhoud, likes

## 🚀 Deployment

### VPS Setup (Ubuntu 22.04)

1. **Server voorbereiding**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install nodejs npm nginx certbot python3-certbot-nginx
   ```

2. **Clone en build**
   ```bash
   git clone <repository-url>
   cd keyspace
   npm install
   npm run build
   ```

3. **PM2 voor process management**
   ```bash
   npm install -g pm2
   pm2 start npm --name "keyspace" -- start
   pm2 startup
   pm2 save
   ```

4. **Nginx configuratie**
   ```nginx
   server {
       listen 80;
       server_name community.keyholders.agency;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **SSL certificaat**
   ```bash
   sudo certbot --nginx -d community.keyholders.agency
   ```

## 🔧 Development

### Convex Functions

Alle backend logica staat in de `convex/` directory:
- `users.ts` - Gebruikersbeheer
- `channels.ts` - Kanaalbeheer  
- `threads.ts` - Thread CRUD + upvotes
- `comments.ts` - Reacties + likes

### Frontend Componenten

- `KanaalSidebar` - Navigatie tussen kanalen
- `ThreadCard` - Thread weergave in lijsten
- `ThreadView` - Volledige thread met reacties
- `UserProfile` - Gebruikersprofiel component

## 📝 Roadmap

- [ ] Clerk authenticatie integratie
- [ ] Onboarding flow
- [ ] Thread/comment editor met markdown preview
- [ ] Zoekfunctionaliteit
- [ ] Gebruikers directory
- [ ] Admin panel voor kanaal beheer
- [ ] Email notificaties
- [ ] Mobile responsive optimalisatie

## 🤝 Contributing

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je changes (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 License

Dit project is gelicenseerd onder de MIT License.

## 📞 Contact

Voor vragen over het platform: support@keyholders.agency
