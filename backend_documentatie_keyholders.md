# Keyholders Community – Backend Documentatie (ConvexDB)

## 1. Database Entities

### Gebruiker (`users`)
- `id` (string, Clerk ID)
- `naam` (string)
- `avatarUrl` (string)
- `functie` (string)
- `organisatie` (string)
- `bio` (string, max 500 tekens)
- `tags` (array of strings, max 10)
- `aangemaaktOp` (timestamp)

### Kanaal (`channels`)
- `id` (string)
- `naam` (string)
- `slug` (string, uniek)
- `beschrijving` (string)
- `type` (enum: 'discussie' | 'templates' | 'modules')
- `aangemaaktDoor` (userRef)
- `stickyPosts` (array of threadRefs)

### Thread (`threads`)
- `id` (string)
- `kanaalId` (channelRef)
- `titel` (string)
- `inhoud` (markdown string)
- `auteurId` (userRef)
- `upvotes` (array of userRefs)
- `sticky` (boolean)
- `aangemaaktOp` (timestamp)

### Reactie (`comments`)
- `id` (string)
- `threadId` (threadRef)
- `auteurId` (userRef)
- `inhoud` (markdown string)
- `likes` (array of userRefs)
- `aangemaaktOp` (timestamp)

## 2. Autorisatie & Middleware

### Clerk-auth middleware
- Alle routes vereisen actieve sessie via Clerk (LinkedIn OAuth)
- Geen toegang zonder geldig JWT en user-object

### Postrechten
- Alleen ingelogde gebruikers kunnen posten of reageren
- Alleen admins kunnen templates/modules aanmaken
- Sticky posts: alleen admins

## 3. Functies

### Thread logica
- `createThread(channelId, content, title)` → nieuwe thread
- `upvoteThread(threadId)` → toggle upvote door huidige gebruiker
- `markAsSticky(threadId)` → alleen voor admin

### Comment logica
- `postComment(threadId, content)` → nieuwe comment
- `likeComment(commentId)` → toggle like

### Gebruikersbeheer
- `updateProfile(data)` → bio, avatar, tags, functie
- `getUserProfile(userId)` → gegevens + bijdragen ophalen
- `searchUsersByTags(tags[])` → tag-gebaseerde directory-query

### Kanaalbeheer
- `getAllChannels()` → lijst met kanalen
- `getChannelBySlug(slug)` → detaildata
- `createChannel(data)` → alleen admin
- `setChannelType(channelId, type)` → alleen admin

## 4. Indexing en Performance

- Index op `kanaalId` bij threads
- Index op `threadId` bij reacties
- Full-text search op `titel`, `inhoud`, en `tags`
- Query-limieten per fetch: max 30 resultaten per paginatie

## 5. Backups & Hosting

- Database: Convex gehost
- App zelf draait op VPS met Ubuntu 22.04
- Periodieke exports (threads, comments) als JSON mogelijk (admin-only)