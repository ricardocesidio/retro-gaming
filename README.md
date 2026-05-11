# Retro Gaming Marketplace

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=reactrouter&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)
![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=flat&logo=fontawesome&logoColor=white)

A premium frontend-only marketplace simulation for buying, selling, and trading retro gaming items. Built as a complete product experience with real flows, listings, offers, bundles, messaging, profiles, wishlist, and more — all simulated through client-side state and `localStorage`.

---

## Live Demo

**[retro-gaming-cyan.vercel.app](https://retro-gaming-cyan.vercel.app)**

**Repository:** [github.com/ricardocesidio/retro-gaming](https://github.com/ricardocesidio/retro-gaming)

---

## Overview

Retro Gaming Marketplace is a frontend portfolio project demonstrating how a complete multi-page product can be structured, styled, and experienced from a user's perspective. It goes beyond a simple UI demo — users can browse listings, open product details, publish items, make offers, create bundles, send messages, save items to a wishlist, inspect seller profiles, and manage a wallet.

The entire application is designed to feel like a polished product, with a dark premium aesthetic, compact layout, and full mobile responsiveness across 15+ pages.

---

## Project Goal

This project was built to demonstrate:

- Strong UI architecture and component organization
- Realistic marketplace interactions without a backend
- Comprehensive responsive behavior (desktop through iPhone)
- Maintainable CSS architecture with design tokens
- Frontend product thinking at every level

Rather than focusing on a single feature, this project represents a **full marketplace experience** with interconnected pages and complete user flows.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 with JSX |
| **Routing** | React Router v6 (lazy loading, params, search params) |
| **State** | React Context API (Auth, Wishlist), useState, useReducer |
| **Persistence** | localStorage with quota management and safe JSON parsing |
| **Styling** | CSS3 with 130+ custom properties, CSS Grid, Flexbox, animations |
| **Build** | Vite with code splitting and lazy loading |
| **Linting** | ESLint flat config |
| **Deployment** | Vercel with SPA redirects |
| **Icons** | Font Awesome 6 |

---

## Pages

### Home
Entry point with banner slider, hero section, embedded marketplace preview, and call-to-action elements. Guides users toward browsing or selling.

### Market
Browse all listings with search, category filters, price range, condition, and sort controls. Features horizontal category pills, load-more pagination, and a responsive product grid with wishlist integration.

### Product Detail
Full item view with image gallery, seller information, shipping options, condition badge, description, and action buttons — Buy Now, Make Offer, Make a Bundle. Includes breadcrumb navigation and seller contact.

### Sell
Comprehensive listing creation form with title, category, subcategory, condition, price, description, images (upload with compression), and parcel size selector. Supports draft saving with localStorage quota handling. Edit mode for existing listings via URL params.

### Profile
User profile with avatar, verified badge, tiered border system, gem ratings, reviews, location, follower/following stats, items sold, bio, community review slider, and active listing inventory. Supports Follow/Edit Profile based on ownership.

### Messages
Marketplace chat system with conversation list, chat view, image attachments, report user, block/unblock, and delete chat functionality. Conversations persist across sessions.

### Bundle
Multi-item bundle flow: select primary item → browse marketplace → add items → review total → send bundled offer as a single message.

### Wishlist
Saved items with ctx-based add/remove from any product card. Persists via localStorage with proper context state management.

### Wallet
Simulated financial dashboard with available balance, pending balance, bank card, transaction history, withdrawal flow, and receive functionality.

### Invite Friends
Referral page with invite links, code copying, share buttons, and "How It Works" section. Uses stable mock invite codes.

### Settings
User preferences page with profile picture, username, email, about section, country, and language selection. Avatar upload with preview.

### Notifications
Activity feed showing marketplace events — follows, sales, shipments, new listings. Supports mark-all-read and individual dismissal.

### Donations
Support page with tiered donation amounts, transparency section, impact grid, wallet address display, and recognition tiers.

### My Orders
Order tracking with tab-based filtering (All, Pending, Shipped, Delivered, Cancelled), order cards, search, and status visualization.

### Auction
Placeholder page indicating upcoming auction functionality. Preserves navigation consistency.

### Retro Rules
Platform guidelines page with core principles, transaction framework, gems and reputation system explanation, tier breakdown, and enforcement severity grid.

### Login / Register
Authentication pages with form validation, password strength meter, demo password display, and simulated login flow. Includes policy modal on registration.

---

## User Flows

### Browse → Buy
1. User navigates to Market
2. Filters by category, condition, or searches
3. Clicks listing → Product Detail
4. Reviews item details and seller info
5. Clicks Buy Now → Confirmation modal
6. Redirects to My Orders

### Create Listing → Market Visibility
1. Navigates to Sell page
2. Completes form with validation
3. Uploads images (auto-compressed)
4. Publishes → appears immediately in Market
5. Also visible in Profile inventory

### Bundle Offer Flow
1. On Product Detail, clicks "Make a Bundle"
2. Bundle page opens with selected item
3. Browses Market to add more items
4. Reviews total with combined pricing
5. Clicks "Send Bundle Offer" → Message created
6. Navigated to conversation thread

### Profile Discovery
1. On Market, clicks seller name on product card
2. Views full seller profile — avatar, gems, reviews, stats
3. Reads community reviews with gem ratings
4. Browses seller's other listings
5. Can Follow or Message directly

---

## Architecture

```
retro-gaming/
├── src/
│   ├── components/        # Reusable UI (Header, Footer, Menu, ProductCard)
│   ├── pages/             # Main views (Home, Market, Sell, Profile, etc.)
│   ├── hooks/             # Custom hooks (useMarketListings)
│   ├── context/           # React Context providers (Auth, Wishlist)
│   ├── utils/             # Helpers (storage, auth, normalization, mock data)
│   ├── styles/            # Design tokens and global utilities
│   ├── images/            # Static assets
│   ├── App.jsx            # Root component with routes and providers
│   └── main.jsx           # Entry point with demo data seeding
├── public/
├── index.html
├── netlify.toml
└── package.json
```

**Separation of concerns:**
- **pages/** — Complete views, each with their own CSS
- **components/** — Shared UI elements used across multiple pages
- **hooks/** — Encapsulated data access (useMarketListings)
- **context/** — Global state without prop drilling (AuthContext, WishlistContext)
- **utils/** — Pure functions: storage, auth, normalization, mock data generation

---

## Key Technical Decisions

### Frontend-Only Architecture
This project intentionally avoids backend dependencies. localStorage with quota management simulates API persistence. The CRUD patterns, data normalization, and error handling shown here directly translate to REST API or GraphQL integration.

### Design System
A centralized design token system (`design-tokens.css`) provides:
- 130+ CSS custom properties
- Consistent color palette (dark theme)
- Typography scale (`--text-xs` through `--text-5xl`)
- Spacing system (`--space-1` through `--space-24`)
- Responsive breakpoints (`--bp-sm` through `--bp-4xl`)
- Z-index and transition tokens

Changing a single variable updates the entire application.

### Image Handling
- `normalizeProduct()` ensures consistent product shape across all pages
- Image compression via Canvas API before localStorage storage
- FileReader API with size validation (5MB limit)
- SVG fallback for broken images via shared fallback utility
- Quota-aware saving with progressive compaction

### localStorage Persistence
| Key | Purpose |
|-----|---------|
| `meusAnunciosRetro` | Marketplace listings |
| `retroConversations` | Message threads |
| `myRetroDrafts` | Incomplete listings |
| `marketplaceWishlist` | Saved items (via Context) |
| `registeredUsers` | Simulated user registry |
| `activeSession` | Current session (sessionStorage) |
| `retroBlockedUsers` | Blocked user list |

Each key has corresponding utilities with safe parsing and error handling.

### Demo Data Seeding
On first load, demo listings are automatically seeded into localStorage if the marketplace is empty. This ensures fresh deployments and incognito windows have content immediately, while never overwriting user-created data.

---

## Responsive Design

The application supports desktop, tablet, and full mobile (iPhone/iOS Safari) with:

- Fixed bottom navigation bar on mobile (≤768px)
- Compact product cards with 2-column grids
- Fullscreen chat overlay for Messages on mobile
- Horizontal scroll category pills
- Big elegant search bar on mobile Market
- Centered profile layout with compact stats
- Safe-area padding for iOS notch
- 77 media query blocks across 27 CSS files

All mobile changes are isolated inside media queries — desktop layout remains completely untouched.

---

## Challenges

**Multi-page consistency:**
With 15+ pages, maintaining consistent styling required a centralized design token system. CSS variables ensure that updating a brand color updates the entire application.

**Simulating backend behavior:**
localStorage has no relational queries or real-time sync. Solutions included image compression, progressive data reduction when approaching quota limits, normalized product shapes, and draft limits.

**CSS specificity management:**
Complex component hierarchies required careful selector specificity planning. The `.elite-tech` modifier pattern on profile cards uses compound selectors to safely layer styles without breaking base rules.

**Mobile-first layout adaptation:**
Converting a desktop marketplace to mobile required separate nav systems (top bar → bottom bar), grid restructuring (3→2→1 column), and overlay patterns for chat views — all scoped within media queries.

---

## What I Learned

- **Large frontend architecture** — Breaking a complex app into components, pages, hooks, context, and utils makes it navigable and maintainable
- **UX thinking** — Empty states, loading states, error handling, and user feedback separate a portfolio project from a real product
- **State without backend** — localStorage with quota management, data normalization, and compression can simulate backend persistence effectively
- **CSS architecture** — Design tokens eliminate visual inconsistency across a multi-page application
- **Mobile responsiveness** — Isolating all mobile changes in `@media` blocks prevents desktop regressions
- **Code quality** — Centralizing utilities (safe JSON parse, avatar resolution, ID normalization) prevents bugs from duplicated logic

---

## Limitations

- No real backend or database
- Data resets when localStorage is cleared
- No real payments or transaction processing
- Authentication is simulated (frontend only)
- Reviews and some profile stats use mock data generation
- Auction page is a placeholder
- localStorage quota limits available storage (~5MB)

---

## Future Improvements

- Backend integration with REST API or GraphQL
- Real authentication with JWT or OAuth
- Database storage (PostgreSQL, MongoDB)
- Real-time messaging with WebSockets
- Payment processing (Stripe)
- Image hosting (Cloudinary, S3)
- Full auction system with bidding logic
- Admin dashboard for moderation
- Product recommendations engine

---

**Author:** Ricardo Cesidio
**GitHub:** [github.com/ricardocesidio](https://github.com/ricardocesidio)
**Project:** [github.com/ricardocesidio/retro-gaming](https://github.com/ricardocesidio/retro-gaming)
**Live:** [retro-gaming-cyan.vercel.app](https://retro-gaming-cyan.vercel.app)
