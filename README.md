# Keyspace Community Platform

> **Automatiseren kun je leren** - Nederlandse AI Community voor MKB

Een community platform voor Nederlandse MKB-ondernemers die AI willen implementeren met behoud van controle over hun data. Het platform faciliteert kennisdeling, discussies en samenwerking rond praktische AI-implementaties zonder vendor lock-in.

## 🎯 Missie

Een centrale plek creëren in Nederland waar MKB-ondernemers samen kunnen leren over AI-implementatie met focus op data soevereiniteit en praktische toepassingen.

## ✨ Features

### 🏢 Community Structuur
- **Thematische secties**: Startpunt, Sectoren, Strategie, Infrastructuur, Templates
- **Kanalen per sectie**: Specifieke discussieruimtes
- **Role-based toegang**: Admin, Moderator, Member rollen

### 💬 Content & Discussies
- **Threads**: Discussies met markdown ondersteuning
- **Comments**: Reacties met markdown
- **Polls**: Stemfunctionaliteit voor voorstellen
- **Upvoting**: Community-driven prioritering
- **SEO-vriendelijke URLs**: `/thread/[title-slug]-[number]`

### 👥 Gebruikersbeheer
- **LinkedIn OAuth**: Professionele authenticatie via Clerk
- **Privacy-first**: Gebruikersgegevens alleen voor admins
- **Profiel management**: Avatar upload, bio, expertise tags
- **Account deletion**: Volledige GDPR-compliant verwijdering

### 🎯 Speciale Features
- **Introduceer Jezelf kanaal**: Speciale onboarding experience
- **Breadcrumb navigatie**: Home > Kanalen > [Channel] > [Thread]
- **Admin dashboard**: Volledig beheer van content en gebruikers
- **Real-time zoeken**: Instant zoekresultaten

### 💰 Donatie Systeem
- **Dagelijks roterende berichten**: 12 humoristische donatie teksten
- **Sparkly sidebar button**: Glitterende knop met animaties
- **QR code integratie**: Buy Me a Coffee support
- **Developer humor**: Grappige teksten over debugging en AI development

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework met App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend & Database
- **Convex** - Real-time database en serverless backend
- **Cloudinary** - Image upload en CDN
- **Vercel** - Hosting en deployment

### Authentication
- **Clerk** - LinkedIn OAuth authenticatie
- **Role-based access control** - Granulaire permissies

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm of yarn
- Convex account
- Clerk account
- Cloudinary account

### Installation

1. **Clone de repository**
```bash
git clone https://github.com/CalendarConnect/automatiserenkunjeleren.git
cd automatiserenkunjeleren
```

2. **Install dependencies**
```bash
cd keyspace
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Vul de volgende variabelen in:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your-deploy-key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. **Setup Convex**
```bash
npx convex dev
```

5. **Start development server**
```bash
npm run dev
```

De applicatie is nu beschikbaar op `http://localhost:3000`

## 📁 Project Structuur

```
keyspace/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   ├── lib/                    # Utilities & hooks
│   └── providers/              # App providers
├── convex/                     # Convex backend functions
├── public/                     # Static assets
└── documentatie.md             # Volledige documentatie
```

## 🎨 Design System

- **Kleurenpalet**: Purple gradients, professional blues
- **Typography**: Inter font family
- **Responsive**: Mobile-first approach
- **Animations**: Sparkle effects voor donatie buttons
- **Accessibility**: WCAG 2.1 AA compliance

## 🔐 Privacy & Security

- **GDPR Compliant**: Recht op vergetelheid geïmplementeerd
- **Data minimization**: Alleen noodzakelijke data
- **Admin-only access**: Gebruikersgegevens beschermd
- **Encrypted storage**: Convex built-in encryption

## 🤝 Contributing

1. Fork de repository
2. Maak een feature branch (`git checkout -b feature/amazing-feature`)
3. Commit je changes (`git commit -m 'Add amazing feature'`)
4. Push naar de branch (`git push origin feature/amazing-feature`)
5. Open een Pull Request

## 📖 Documentatie

Zie `documentatie.md` voor volledige technische documentatie, inclusief:
- Database schema
- API endpoints
- Deployment guide
- Development guidelines

## 💰 Support

Deze community draait volledig op vrijwillige inzet. Wil je de moderators steunen?

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/automatiserenkunjeleren)

## 📄 License

Proprietary - Keyholders Agency

## 🙏 Acknowledgments

- Nederlandse AI community voor feedback en input
- MKB-ondernemers voor praktische use cases
- Open source community voor inspiratie

---

**Automatiseren kun je leren - en we doen het samen** 🚀 