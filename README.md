# Keyspace - Automatiseren Kun Je Leren

A Dutch community platform for AI implementation discussions and knowledge sharing, built with modern web technologies and focused on bringing together professionals, makers, entrepreneurs, and thinkers to collaborate on AI adoption in the Netherlands.

## 🚀 Tech Stack

### Frontend
- **Next.js 15.3.3** - React framework with App Router
- **React 19.0.0** - UI library with latest features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Tailwind Animate** - Animation utilities
- **Lucide React** - Icon library

### Backend & Database
- **Convex 1.24.8** - Real-time backend-as-a-service
- **Convex React Client** - Real-time data synchronization
- **Convex with Clerk** - Integrated authentication

### Authentication & User Management
- **Clerk 6.21.0** - Complete authentication solution
- **Clerk Next.js Integration** - Server-side authentication

### UI Components & Design System
- **Radix UI** - Headless UI components
  - Avatar, Dialog, Label, Select, Slot components
- **Class Variance Authority** - Component variant management
- **clsx & tailwind-merge** - Conditional styling utilities

### Rich Text & Content
- **TipTap 2.13.0** - Rich text editor
  - Extensions: Color, Link, Placeholder, Text Style
  - Starter Kit with basic functionality
- **Emoji Picker React** - Emoji selection component

### File Upload & Media
- **Cloudinary 2.6.1** - Cloud-based image and video management
- **Cloudinary React** - React components for media handling
- **Cloudinary URL Gen** - URL generation for transformations

### Drag & Drop
- **DND Kit** - Modern drag and drop toolkit
  - Core, Sortable, and Utilities packages

### Date & Time
- **date-fns 4.1.0** - Modern JavaScript date utility library

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── automatiseren-kun-je-leren/  # Landing page route
│   ├── beheer/            # Admin management pages
│   ├── community/         # Community overview
│   ├── gebruiker/         # User profile pages
│   ├── gebruikers/        # Users listing
│   ├── kanaal/            # Individual channel pages
│   ├── kanalen/           # Channels overview
│   ├── nieuw/             # New content creation
│   ├── onboarding/        # User onboarding flow
│   ├── profiel/           # User profile management
│   ├── thread/            # Discussion thread pages
│   ├── zoeken/            # Search functionality
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── AdminViewModeBar.tsx
│   ├── AuthNav.tsx
│   ├── CloudinaryUpload.tsx
│   ├── ColorPicker.tsx
│   ├── CrossSectionChannelsList.tsx
│   ├── EmojiPicker.tsx
│   ├── ErrorBoundary.tsx
│   ├── HtmlRenderer.tsx
│   ├── IntroduceerJezelfForm.tsx
│   ├── KanaalHeader.tsx
│   ├── KanaalSidebar.tsx
│   ├── OnboardingCheck.tsx
│   ├── PollCreator.tsx
│   ├── PollDisplay.tsx
│   ├── SortableChannelsList.tsx
│   ├── ThreadCard.tsx
│   ├── ThreadView.tsx
│   └── UserSync.tsx
├── contexts/              # React contexts
│   └── ViewModeContext.tsx
├── lib/                   # Utility functions and hooks
│   ├── useConvexFunction.ts
│   ├── useCurrentUser.ts
│   ├── useViewAwareRole.ts
│   └── utils.ts
├── providers/             # Context providers
│   └── ConvexClientProvider.tsx
└── middleware.ts          # Next.js middleware for auth

convex/                    # Convex backend functions
├── _generated/           # Auto-generated Convex files
├── lib/                  # Backend utilities
├── channels.ts           # Channel management functions
├── comments.ts           # Comment system functions
├── schema.ts             # Database schema definition
├── secties.ts            # Section management functions
├── threads.ts            # Thread/discussion functions
└── users.ts              # User management functions
```

## 🎯 Core Functionalities

### 1. User Authentication & Management
- **Clerk Integration**: Complete authentication flow with sign-up, sign-in, and user management
- **Role-based Access**: Admin, Moderator, and Member roles with different permissions
- **User Profiles**: Comprehensive profiles with name, function, organization, bio, tags, and LinkedIn integration
- **Onboarding Flow**: Guided setup for new users

### 2. Community Structure
- **Sections (Secties)**: Organized content areas with emoji, color coding, and ordering
- **Channels (Kanalen)**: Discussion channels within sections
  - Discussion channels for conversations
  - Template channels for reusable content
  - Module channels for structured learning
- **Sticky Posts**: Important threads pinned to channel tops

### 3. Discussion System
- **Threads**: Rich text discussions with titles, content, and metadata
- **Comments**: Nested commenting system with likes
- **Upvoting**: Community-driven content ranking
- **Search**: Full-text search across threads and content
- **Polls**: Interactive polling system with multiple choice options

### 4. Content Management
- **Rich Text Editor**: TipTap-powered editor with formatting, links, and colors
- **Image Upload**: Cloudinary integration for media management
- **Drag & Drop**: Sortable channels and sections for admins
- **Content Types**: Text posts, polls, and media-rich content

### 5. Admin Features
- **Admin Panel**: Comprehensive management interface
- **View Mode Toggle**: Admins can view site as regular members
- **Channel Management**: Create, edit, and organize channels
- **User Management**: Role assignment and user administration
- **Content Moderation**: Thread and comment management

### 6. Real-time Features
- **Live Updates**: Real-time synchronization via Convex
- **Instant Notifications**: Live updates for new content
- **Collaborative Editing**: Real-time content updates

## 🔧 Function Calling & API Structure

### Convex Functions

#### User Management (`users.ts`)
- `getUserByClerkId`: Retrieve user by Clerk authentication ID
- `createUser`: Create new user profile
- `updateUser`: Update user information
- `getUserById`: Get user by internal ID
- Role management functions for admin operations

#### Channel Management (`channels.ts`)
- `getChannels`: Retrieve all channels
- `getChannelBySlug`: Get specific channel by URL slug
- `createChannel`: Create new discussion channel
- `updateChannel`: Modify channel properties
- `deleteChannel`: Remove channel (admin only)
- `getChannelsBySection`: Get channels within a section

#### Thread Management (`threads.ts`)
- `getThreads`: Retrieve threads with pagination
- `getThreadBySlug`: Get specific thread by URL slug
- `createThread`: Create new discussion thread
- `updateThread`: Modify thread content
- `deleteThread`: Remove thread
- `upvoteThread`: Add/remove upvotes
- `searchThreads`: Full-text search functionality

#### Comment System (`comments.ts`)
- `getComments`: Retrieve comments for a thread
- `createComment`: Add new comment
- `updateComment`: Edit comment content
- `deleteComment`: Remove comment
- `likeComment`: Toggle comment likes

#### Section Management (`secties.ts`)
- `getSections`: Get all content sections
- `createSection`: Create new section
- `updateSection`: Modify section properties
- `reorderSections`: Change section ordering

### API Routes
- `/api/delete-user`: User account deletion endpoint

## 🌐 Platform Features

### Internationalization
- **Dutch Language**: Primary language for the Dutch AI community
- **Localized Content**: All UI text and content in Dutch
- **Cultural Context**: Tailored for Dutch business and tech culture

### Performance & Scalability
- **Next.js App Router**: Modern routing with server components
- **Real-time Backend**: Convex provides instant updates and synchronization
- **Image Optimization**: Cloudinary for optimized media delivery
- **Type Safety**: Full TypeScript implementation

### Security & Privacy
- **Authentication**: Secure Clerk-based authentication
- **Route Protection**: Middleware-based route protection
- **Role-based Access**: Granular permission system
- **Privacy-first**: Mentioned as core value in platform description

### User Experience
- **Responsive Design**: Mobile-first responsive layout
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Accessibility**: Radix UI components for accessibility compliance
- **Error Handling**: Comprehensive error boundaries and handling

## 🚦 Getting Started

### Prerequisites
- Node.js (version compatible with Next.js 15)
- npm or yarn package manager
- Convex account for backend services
- Clerk account for authentication
- Cloudinary account for media management

### Environment Variables
```env
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

## 🎨 Design System

The platform uses a comprehensive design system built on:
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Custom Components**: Branded UI components in `/components/ui/`
- **Color Scheme**: Blue/indigo gradient theme with semantic colors
- **Typography**: Inter font family for clean, modern text
- **Icons**: Lucide React for consistent iconography

## 🤝 Community Values

Based on the platform's mission:
1. **Open & Ego-free**: Knowledge sharing without pretense
2. **Volunteer-driven**: No commercial agenda, donation-supported
3. **Practical Knowledge**: Focus on actionable insights that make a difference
4. **Dutch AI Community**: Central hub for AI discussions in the Netherlands
5. **Professional Collaboration**: Bringing together diverse professionals and expertise levels

## 📊 Data Model

### Core Entities
- **Users**: Community members with profiles and roles
- **Sections**: Organizational categories for content
- **Channels**: Discussion areas within sections
- **Threads**: Individual discussion topics
- **Comments**: Responses to threads
- **Polls**: Interactive voting content
- **Poll Votes**: User responses to polls

### Relationships
- Users create and participate in threads and comments
- Channels belong to sections and contain threads
- Threads can have multiple comments and poll attachments
- Role-based permissions control access and actions

This platform represents a comprehensive community solution specifically designed for the Dutch AI implementation community, combining modern web technologies with thoughtful user experience design and robust real-time functionality. 