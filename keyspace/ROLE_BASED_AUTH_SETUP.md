# Role-Based Authentication Setup

Dit document beschrijft de implementatie van het role-based authorization systeem met Clerk voor authenticatie en Convex voor autorisatie.

## Overzicht

- **Clerk**: Verantwoordelijk voor authenticatie (signup/login/reset-email/session)
- **Convex**: Beheert alle autorisaties en rollen, onafhankelijk van Clerk
- **Eerste gebruiker**: Wordt automatisch als admin aangemerkt
- **Middleware**: Dwingt rolgebaseerde toegang af tot Convex-functies
- **Client-side**: Gebruiker wordt na login automatisch gesynchroniseerd met Convex

## Benodigde Environment Variables

Voeg de volgende variabelen toe aan je `.env.local` bestand:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your-deploy-key
```

## Implementatie Details

### 1. Schema Updates

Het `users` schema is uitgebreid met:
- `email`: String (verplicht)
- `role`: Union van "admin", "member", "moderator"
- Index op `role` voor efficiënte queries

### 2. Convex Functies

#### Nieuwe functies in `users.ts`:
- `createOrSyncUser`: Synchroniseert gebruiker bij eerste login
- `getCurrentUser`: Haalt huidige gebruiker op (vereist authenticatie)
- `updateUserRole`: Admin-only functie om rollen te wijzigen
- `deleteUser`: Admin-only functie om gebruikers te verwijderen
- `getAllUsersWithRoles`: Admin-only functie om alle gebruikers op te halen

#### Utility functies in `convex/lib/getUser.ts`:
- `getUser`: Haalt huidige geauthenticeerde gebruiker op
- `requireRole`: Controleert of gebruiker specifieke rol heeft
- `requireAdmin`: Vereist admin rol
- `requireModeratorOrAdmin`: Vereist moderator of admin rol

### 3. Client-side Componenten

#### `UserSync.tsx`
Automatische synchronisatie van gebruiker na Clerk login:
- Wordt uitgevoerd bij elke page load
- Synchroniseert gebruikersgegevens met Convex
- Eerste gebruiker krijgt automatisch admin rol

#### `useCurrentUser.ts`
Custom hooks voor gebruikersinformatie:
- `useCurrentUser()`: Huidige gebruiker met rol
- `useIsAdmin()`: Controleert admin status
- `useIsModerator()`: Controleert moderator/admin status

### 4. Provider Updates

`ConvexClientProvider` is bijgewerkt om:
- Clerk authenticatie te integreren
- `ConvexProviderWithClerk` te gebruiken
- Automatische token synchronisatie

### 5. Beheer Pagina

De bestaande beheer pagina (`/beheer`) is uitgebreid met:
- **Autorisatie controles**: Alleen admins hebben toegang
- **Gebruikers tab**: Beheer van gebruikersrollen
- **Role management**: Wijzigen van gebruikersrollen
- **Visual indicators**: Duidelijke rol badges en iconen

## Rollen Systeem

### Admin
- Volledige toegang tot alle functies
- Kan gebruikersrollen wijzigen
- Kan gebruikers verwijderen
- Toegang tot beheerpagina

### Moderator
- Kan content modereren
- Kan kanalen beheren
- Beperkte admin functies

### Member
- Standaard gebruiker
- Kan posts maken en reageren
- Geen admin functies

## Gebruik

### Voor Ontwikkelaars

1. **Middleware gebruiken in Convex functies**:
```typescript
import { getUser, requireAdmin } from "./lib/getUser";

export const adminOnlyFunction = mutation({
  args: { /* args */ },
  handler: async (ctx, args) => {
    await requireAdmin(ctx); // Gooit error als niet admin
    // Admin functionaliteit hier
  },
});
```

2. **Client-side rol controles**:
```typescript
import { useIsAdmin } from "@/lib/useCurrentUser";

function MyComponent() {
  const { isAdmin, isLoading } = useIsAdmin();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAdmin) return <div>Geen toegang</div>;
  
  return <div>Admin content</div>;
}
```

### Voor Gebruikers

1. **Eerste keer inloggen**: Automatisch admin rol
2. **Volgende gebruikers**: Standaard member rol
3. **Rol wijzigingen**: Alleen door admins via beheerpagina

## Beveiliging

- Alle autorisatie controles gebeuren server-side in Convex
- Client-side controles zijn alleen voor UX
- Middleware voorkomt ongeautoriseerde toegang
- Eerste gebruiker wordt automatisch admin (bootstrap)

## ✅ Implementatie Status

### Voltooid:
- ✅ Convex schema bijgewerkt met `email` en `role` velden
- ✅ Middleware voor rolgebaseerde toegang (`convex/lib/getUser.ts`)
- ✅ User bootstrap systeem (`createOrSyncUser`)
- ✅ Eerste gebruiker wordt automatisch admin
- ✅ Clerk middleware configuratie (`middleware.ts`)
- ✅ ConvexClientProvider met Clerk integratie
- ✅ UserSync component voor automatische synchronisatie
- ✅ Custom hooks (`useCurrentUser`, `useIsAdmin`, `useIsModerator`)
- ✅ Admin-only functies in Beheer pagina
- ✅ Publieke "Automatiseren kun je leren" pagina
- ✅ AuthNav component voor herbruikbare authenticatie menu
- ✅ Route bescherming via middleware

### Beschermde Routes:
- `/beheer/*` - Admin/Moderator toegang
- `/profiel/*` - Ingelogde gebruikers
- `/nieuw/*` - Ingelogde gebruikers

### Publieke Routes:
- `/automatiseren-kun-je-leren` - Landing page met registratie/login
- `/` - Dashboard (redirect naar landing als niet ingelogd)

## Troubleshooting

### Gebruiker niet gevonden
- Controleer of `UserSync` component geladen wordt
- Verificeer Clerk configuratie
- Check Convex deployment status

### Geen admin toegang
- Eerste gebruiker wordt automatisch admin
- Controleer of database leeg was bij eerste login
- Admin kan andere gebruikers promoveren

### Environment variabelen
- Controleer of alle Clerk keys correct zijn
- Verificeer Convex URL en deploy key
- Herstart development server na wijzigingen 