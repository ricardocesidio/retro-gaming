# Retro Gaming Marketplace

A modern, premium frontend marketplace for retro gaming collectors. Built as a complete UI/UX simulation demonstrating complex user flows, state management, and interface design without backend dependencies.

## Live Demo

Demo available locally via development server. See [Getting Started](#getting-started) below.

Repository: [github.com/ricardocesidio/retro-gaming](https://github.com/ricardocesidio/retro-gaming)

## Overview

This project is a fully functional frontend simulation of a retro gaming marketplace. Unlike simple UI demos, it implements complete user flows including listing creation, messaging, bundling, and wishlist management. The application demonstrates how complex interactions can be handled entirely on the frontend using browser storage APIs and React state management patterns.

What sets this project apart is its focus on product thinking: every page includes proper empty states, user feedback mechanisms, form validation, and responsive behavior. The codebase prioritizes maintainability through a centralized design token system and clear component architecture.

## Problem

Many frontend portfolio projects demonstrate isolated concepts: a form here, a component there, maybe a simple CRUD operation. They rarely show how to architect a multi-page application with interconnected flows, shared state, and consistent design language.

Typical challenges not addressed by simpler projects:
- How do you simulate backend behavior without creating a backend?
- How do you maintain consistent styling across 11+ pages?
- How do you handle complex user flows (bundles, offers) with only localStorage?
- How do you make a demo feel intentional rather than incomplete?

## Solution

This project solves these challenges by implementing a complete marketplace simulation using only frontend technologies. It demonstrates:

**Architecture decisions:**
- Centralized design token system (130+ CSS custom properties)
- Component-based architecture with clear separation of concerns
- localStorage-based persistence with quota management
- Context API for global state (auth, wishlist)
- Custom hooks for data access patterns

**Product simulation:**
- Listing creation with image compression and draft saving
- Multi-step bundle flow spanning multiple pages
- Message system with conversation management
- Offer generation with automatic navigation

The application feels like a real product because every interaction provides feedback, every page handles empty states, and the design system ensures visual consistency throughout.

## Features

- Listing creation with comprehensive form validation
- Marketplace browsing with category, price, and keyword filters
- Product detail pages with image galleries
- Make Offer system integrated with messaging
- Bundle system supporting multi-seller selections
- Real-time messaging simulation between users
- Wishlist functionality with persistent storage
- User profiles with inventory management
- Responsive design across desktop, tablet, and mobile breakpoints
- Toast notifications and inline form feedback
- Image upload with compression and fallback handling
- Draft saving for incomplete listings
- Settings page with user preferences

## Full Page Breakdown

### Home
Entry point featuring a hero section with banner slider and embedded marketplace preview. Guides users toward browsing or selling through clear call-to-action elements and subtle helper text.

What the user does there: Discovers the platform, navigates to marketplace or sell page.

Why it exists: First impression and navigation hub for the entire application.

### Market
Browse all listings with advanced filtering (category, condition, price range, search). Includes load-more pagination and responsive product grid with wishlist integration.

What the user does there: Searches, filters, and discovers retro gaming items. Can access product details or save items to wishlist.

Why it exists: Core discovery mechanism for the marketplace.

### Product Detail
Full item view with image gallery, seller information, description, and action buttons (Buy, Make Offer, Add to Bundle). Implements breadcrumb navigation and related items section.

What the user does there: Reviews item details, initiates purchase flow, creates offers, or bundles items.

Why it exists: Conversion point where browsing becomes action.

### Sell
Comprehensive listing creation with multi-step form validation:
- Title, category, subcategory, condition selection
- Price input with formatting and validation
- Description with character counter
- Image upload with compression and preview
- Parcel size selector with visual tier cards (bronze, silver, gold, pink)
- Draft saving with localStorage quota handling

What the user does there: Creates new marketplace listings with full validation feedback.

Why it exists: Supply side of the marketplace - enables users to become sellers.

### Profile
User profile page displaying avatar, seller stats, active listings inventory, and reviews section. Includes edit functionality and navigation to user content.

What the user does there: Manages their seller identity, views their listings, checks reviews.

Why it exists: Establishes seller credibility and provides account management.

### Messages
Chat system simulation between users with:
- Conversation list with unread indicators
- Image attachment support with preview
- Report user and block functionality
- Offer messages automatically generated from bundles

What the user does there: Communicates with sellers, negotiates offers, coordinates transactions.

Why it exists: Enables negotiation - critical for marketplace functionality.

### Bundle
Multi-seller bundle flow:
1. Select primary item from any listing
2. Browse marketplace to add additional items
3. Review bundle with total calculation
4. Send bundled offer as single message

What the user does there: Creates multi-item offers spanning different sellers.

Why it exists: Unique marketplace feature enabling complex negotiations.

### Wishlist
Saved items with add/remove functionality from any product card. Persists across sessions via WishlistContext and localStorage.

What the user does there: Bookmarks items for future purchase consideration.

Why it exists: Reduces friction for repeat buyers and saves interesting finds.

### Settings
User settings page (UI simulation) with profile picture upload, username/email management, about section, country and language selection. Email change limit simulation.

What the user does there: Configures their account preferences and profile information.

Why it exists: Provides user control over their account and display preferences.

### Auction
Placeholder page indicating "Coming Soon" for future auction functionality. Maintains navigation consistency.

What the user does there: Learns that auctions are planned for future development.

Why it exists: Shows forward-thinking product roadmap.

### Notifications
User notifications with support/donation prompts, invite friends functionality, and management options.

What the user does there: Stays informed about platform updates and support opportunities.

Why it exists: Engagement mechanism and community building feature.

### Login / Register
Authentication pages (frontend simulation) with form validation, password strength meter, email format validation, and character limits with error feedback.

What the user does there: Creates account or logs in (simulated).

Why it exists: Establishes user identity for personalized experience.

## User Flows

### Flow 1: Create Listing to Market + Profile
1. User navigates to Sell page
2. Completes form with validation feedback
3. Publishes listing to localStorage
4. Listing appears immediately in Market browse
5. Listing appears in user's Profile inventory

This flow demonstrates: Form validation, image handling, localStorage persistence, and cross-page state synchronization.

### Flow 2: Make Offer to Message
1. User clicks "Make Offer" on product detail
2. Bundle page opens with selected item
3. User adds more items from marketplace
4. Clicks "Send Bundle Offer"
5. Offer message appears in Messages conversation
6. Navigation redirects to message thread

This flow demonstrates: Multi-page navigation, state passing via URL params, and conversation creation.

### Flow 3: Wishlist Save to Revisit
1. User clicks heart icon on any product card
2. Item saves to Wishlist via Context API
3. Wishlist persists in localStorage
4. User navigates to Wishlist page later
5. All saved items display with removal options

This flow demonstrates: Context API usage, persistent state, and cross-component functionality.

## Tech Stack

- **React 18** - Component architecture and routing via React Router DOM
- **JavaScript (ES6+)** - Modern syntax with optional chaining, destructuring
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **Design Tokens** - 130+ CSS custom properties for consistency
- **localStorage** - Data persistence and state simulation
- **Vite** - Build tool and development server

## Architecture & Structure

```
retro-gaming/
├── src/
│   ├── components/        # Reusable UI (Header, Footer, Menu, ProductCard)
│   ├── pages/             # Main views (Home, Market, Sell, Profile, etc.)
│   ├── hooks/             # Custom hooks (useMarketListings)
│   ├── context/           # React contexts (Auth, Wishlist)
│   ├── utils/              # Helpers (storage, auth, image handling, normalization)
│   ├── styles/            # Global styles & design tokens
│   ├── images/            # Static assets
│   ├── App.jsx            # Root component with routes
│   └── main.jsx           # Entry point
├── public/
├── index.html
└── package.json
```

**Separation of concerns:**
- **components/** - Reusable UI elements used across multiple pages
- **pages/** - Complete views with their own styles and logic
- **hooks/** - Encapsulated data access patterns
- **context/** - Global state without prop drilling
- **utils/** - Pure functions and localStorage abstractions

## Key Technical Decisions

### Frontend-Only Approach
**Why no backend?**
This project intentionally avoids backend complexity to demonstrate frontend architecture skills. Using localStorage with quota management simulates API persistence. The patterns shown (CRUD operations, data normalization, error handling) directly translate to REST API integration.

### Design System
**Centralized design tokens (design-tokens.css):**
- 130+ CSS custom properties
- Consistent color palette (black theme only)
- Typography scale (--text-xs through --text-5xl)
- Spacing system (--space-1 through --space-24)
- Responsive breakpoints (--bp-sm through --bp-4xl)
- Z-index and transition tokens

This ensures that changing a color or spacing value updates the entire application consistently.

### Image Handling
**Normalization approach:**
- `normalizeProduct()` utility for consistent product shape
- Image compression before localStorage storage
- Fallback SVG for broken images
- FileReader API with proper cleanup
- Quota-aware saving with progressive compression

### State Simulation
**localStorage usage:**
- `meusAnunciosRetro` - Marketplace listings
- `retroConversations` - Message threads
- `myRetroDrafts` - Incomplete listings
- `wishlist` - Saved items (via Context)
- `retroRoomUser` - Current user (simulated auth)

Each storage key has corresponding utilities with error handling and quota management.

## UX / Product Thinking

### Why Flows Feel Realistic
Every interaction provides immediate feedback. When a user publishes a listing, it appears instantly in the marketplace. When they send a bundle offer, the message appears in their conversation thread. The flows interconnect - actions in one page affect others, just like a real marketplace.

### Importance of Empty States
Each page handles empty scenarios:
- No conversations yet (Messages)
- No selected bundle items (Bundle)
- No listings (Profile inventory)
- No wishlist items (Wishlist)

Empty states include clear guidance, relevant icons, and action buttons to help users progress.

### Feedback for User Actions
- Toast notifications for publish, draft save, errors
- Inline form validation with character counters
- Helper text for complex forms
- Success indicators when requirements are met
- Disabled states for incomplete actions

### "Demo Mode" Clarity
The footer includes a "Demo Mode - Frontend Simulation" label to set proper expectations. Users understand immediately that this is a polished demonstration, not an incomplete product.

## Challenges

**Keeping consistency across many pages:**
With 11+ pages, maintaining consistent styling required a centralized design token system. CSS variables ensure that updating a brand color in one file updates the entire application.

**Simulating backend behavior:**
localStorage has size limits and no relational queries. Solutions included:
- Image compression before storage
- Progressive data reduction when approaching quota
- Normalized product shapes for consistent access
- Draft limits to prevent storage overflow

**Avoiding messy CSS duplication:**
Initial development created duplicate style blocks. The solution involved:
- Removing 395+ duplicate lines from ProductDetail.css
- Consolidating duplicate blocks in profile.css
- Centralizing repeated patterns into design tokens

**Keeping project maintainable:**
- Clear file structure (components vs pages)
- Consistent naming conventions
- Separate utility functions
- Custom hooks for data access patterns

## Improvements Made During Development

- Removed 395+ duplicate CSS lines from ProductDetail.css
- Fixed Register.jsx email validation regex
- Removed unused BackToTop.jsx component
- Removed duplicate `:root` blocks from MyOrders.css and profile.css
- Centralized missing variables in design-tokens.css
- Removed negative margins causing layout issues
- Fixed retro-rules.jsx minmax() corruption
- Replaced hardcoded colors with design token variables
- Consolidated duplicate CSS blocks in profile.css
- Added "Demo Mode" indicator for clarity
- Improved empty states with proper guidance
- Added helper text for form completion feedback
- Created missing Auction.jsx page for navigation consistency

## Limitations

- No real backend or database
- Data resets when localStorage is cleared
- No real payments or transaction processing
- Authentication is simulated (frontend only)
- Reviews and some stats use mock data
- Auction page is a placeholder ("Coming Soon")
- Browser localStorage quotas limit data storage
- No real-time updates or WebSocket connections

## Future Improvements

- Backend integration with REST API or GraphQL
- Real user authentication with JWT tokens
- Database storage (PostgreSQL, MongoDB)
- Real-time messaging with WebSockets
- Payment processing integration (Stripe, PayPal)
- Image storage with cloud provider (AWS S3, Cloudinary)
- Auction system implementation with bidding logic
- Admin dashboard for moderation
- Search indexing and full-text search
- User ratings and reputation system

## What I Learned

**Structuring large frontend apps:**
Breaking a complex application into clear sections (components, pages, hooks, context, utils) makes the codebase navigable and maintainable. Each folder has a single responsibility.

**UX thinking:**
A polished demo requires attention to empty states, loading states, error handling, and user feedback. These "invisible" elements separate a portfolio project from a real product.

**State management without backend:**
localStorage with quota management, data normalization, and compression can simulate backend persistence surprisingly well. The patterns learned (CRUD operations, error handling) directly apply to API integration.

**Consistency and scalability:**
A centralized design token system (CSS variables) ensures that a 10-page application maintains visual consistency. Changing a brand color in one file updates the entire application.

## Final Note

This project demonstrates frontend architecture, React patterns, CSS design systems, and product thinking. It is built to showcase how a complex, multi-flow application can be structured and maintained entirely on the frontend. While intended for portfolio demonstration, the patterns and decisions shown here directly translate to production applications with backend integration.

---

**Author:** Ricardo Cesidio  
**GitHub:** [github.com/ricardocesidio](https://github.com/ricardocesidio)  
**Project:** [github.com/ricardocesidio/retro-gaming](https://github.com/ricardocesidio/retro-gaming)
