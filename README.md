# 🎮 Retro Gaming Marketplace

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=reactrouter&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat&logo=pwa&logoColor=white)
![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=flat&logo=fontawesome&logoColor=white)

A premium frontend-only marketplace simulation for retro gaming collectors. Buy, sell, and trade vintage consoles, games, and collectibles — all simulated through client-side state and `localStorage`.

---

## 🔴 Live Demo

**[retro-gaming-cyan.vercel.app](https://retro-gaming-cyan.vercel.app)**

---

## 🎥 Full Project Walkthrough

[![Watch the walkthrough](https://img.youtube.com/vi/9ImzJrmVunY/maxresdefault.jpg)](https://www.youtube.com/watch?v=9ImzJrmVunY)

Watch the complete tour covering marketplace browsing, listing creation, messaging, profile management, authentication, and mobile responsiveness.

---

## 📋 Overview

Retro Gaming Marketplace is a frontend portfolio project built to demonstrate how a complete multi-page product can be structured, styled, and experienced. It goes far beyond a simple UI demo — users can browse listings, view product details, publish items for sale, make offers, create bundles, send messages, save favorites, inspect seller profiles, and manage a wallet.

The entire application is designed to feel like a polished, real-world product — dark premium aesthetic, compact layout, and full mobile responsiveness across 17 pages.

---

## 🚀 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 with JSX |
| **Routing** | React Router v6 (lazy loading, params, search params) |
| **State** | React Context API (Auth, Wishlist), useState |
| **Persistence** | localStorage with quota management and safe JSON parsing |
| **Styling** | CSS3 — 130+ custom properties, CSS Grid, Flexbox, animations |
| **Build** | Vite with code splitting and lazy loading |
| **Linting** | ESLint flat config with React hooks plugin |
| **Deployment** | Vercel with SPA redirects |
| **Icons** | Font Awesome 6 |

---

## 🧭 Pages

### 🏠 Home
Entry point with banner slider, hero section, embedded marketplace preview, and call-to-action elements.

### 🛒 Market
Browse all listings with search, category filters, price range, condition, and sort controls. Features horizontal scrollable category pills, load-more pagination, and responsive product grid with wishlist integration.

### 📦 Product Detail
Full item view with image gallery, seller information, shipping options, condition badge, description, and action buttons — Buy Now, Make Offer, Make a Bundle.

### 💰 Sell
Comprehensive listing creation with title, category, condition, price, description, images (upload with compression), and parcel size selector. Supports draft saving and edit mode via URL params.

### 👤 Profile
User profile with avatar, verified badge, tiered border system, gem ratings, reviews, location, stats, bio, community review slider, and active listing inventory. Dynamic Follow/Edit Profile based on ownership.

### 💬 Messages
Elite-tech marketplace chat with conversation list, chat view, image attachments, report/block/unblock user, and delete chat. Conversations persist across sessions.

### 📦 Bundle
Multi-item bundle flow: select primary item → browse → add items → review total → send bundled offer as a single message.

### ❤️ Wishlist
Saved items with Context API-powered add/remove from any product card. Persists via localStorage.

### 💳 Wallet
Simulated financial dashboard with balance, bank card, transaction history, withdrawal, and receive functionality.

### 👥 Invite Friends
Referral page with invite links, code copying, share buttons, and How It Works section.

### ⚙️ Settings
User preferences with profile picture, username, email, about, country, and language selection.

### 🔔 Notifications
Activity feed for marketplace events — follows, sales, shipments, new listings. Supports mark-all-read.

### 💝 Donations
Support page with tiered donation amounts, transparency section, impact grid, and recognition tiers.

### 📋 My Orders
Order tracking with tab-based filtering, order cards, search, and status visualization.

### 🔨 Auction
Placeholder page for upcoming auction functionality.

### 📜 Retro Rules
Platform guidelines with core principles, transaction framework, gem reputation system, and enforcement severity grid.

### 🔐 Login / Register
Authentication with form validation, password strength meter, simulated login, and **Try Demo Account** one-click access. Credentials: `DemoUser` / `demo123`. Includes policy modal on registration.

---

## 🆕 Recent Highlights

- **Progressive Web App** — Installable on any device, works offline with service worker caching, full iOS/Android support
- **Demo Account** — One-click "Try Demo Account" on login for instant marketplace access (DemoUser / demo123)
- **Demo Data Seeding** — Fresh deployments auto-populate with 6 listings (no empty market)
- **Elite-Tech Messages** — Glass morphism chat with nebula background, purple glows, and refined dropdowns
- **Edit & Delete Listings** — Full CRUD on your own listings from Profile and Product Detail pages
- **Gem Rating System** — 5-gem review scores with purple filled / gray empty gems on every review
- **Tier System** — Bronze → Silver → Gold → Platinum → Master → Supreme animated profile borders
- **SPA Routing** — Vercel-configured catch-all rewrite prevents 404 on page refresh

---

## 🔄 User Flows

### Browse → Buy
1. Navigate to Market → filter or search
2. Click listing → Product Detail
3. Review item → Buy Now → confirmation
4. Redirected to My Orders

### Create Listing → Market Visibility
1. Navigate to Sell → complete form with validation
2. Upload images (auto-compressed)
3. Publish → appears immediately in Market + Profile inventory

### Bundle Offer Flow
1. On Product Detail → Make a Bundle
2. Browse Market to add more items
3. Review combined total
4. Send Bundle Offer → message created → navigate to conversation

### Profile Discovery
1. Click seller name on product card
2. View seller profile — avatar, gems, reviews, listings
3. Read community reviews with gem ratings
4. Follow or Message directly

---

## 📁 Project Structure

```
retro-gaming/
├── src/
│   ├── components/        # Reusable UI (Header, Footer, Menu, ProductCard)
│   ├── pages/             # 17 page views with own CSS
│   ├── hooks/             # Custom hooks (useMarketListings)
│   ├── context/           # React Context (Auth, Wishlist)
│   ├── utils/             # Helpers (storage, auth, normalization, mock data, seeding)
│   ├── styles/            # Design tokens & global utilities
│   ├── images/            # Static assets
│   ├── App.jsx            # Root component with routes & providers
│   └── main.jsx           # Entry point with demo data seeding
├── public/
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## 🧱 Key Technical Decisions

### Frontend-Only Architecture
No backend. `localStorage` with quota management simulates API persistence. CRUD patterns, data normalization, and error handling directly translate to REST/GraphQL.

### Design System
Centralized token system (`design-tokens.css`): 130+ CSS custom properties for colors, typography, spacing, breakpoints, z-index, and transitions. One variable change updates the entire application.

### Image Handling
- `normalizeProduct()` for consistent product shape
- Canvas API compression before storage
- FileReader with 5MB size validation
- SVG fallback for broken images
- Quota-aware saving with progressive compaction

### localStorage Persistence
| Key | Purpose |
|-----|---------|
| `meusAnunciosRetro` | Marketplace listings |
| `retroConversations` | Message threads |
| `myRetroDrafts` | Incomplete listings |
| `marketplaceWishlist` | Saved items |
| `registeredUsers` | User registry |
| `activeSession` | Current session (sessionStorage) |

### Demo Data Seeding
On first load, demo listings auto-seed into empty localStorage. Fresh deployments and incognito windows show content immediately — never overwrites user data.

---

## 📱 Responsive Design

Supports desktop, tablet, and full mobile (iPhone/iOS Safari):

- Fixed bottom navigation bar on mobile (≤768px)
- Compact product cards with 2-column grids
- Fullscreen chat overlay for Messages
- Horizontal scroll category pills
- Big elegant search bar on mobile Market
- iOS safe-area padding
- 77 media query blocks across 27 CSS files

All mobile changes isolated inside media queries — desktop untouched.

---

## 🧪 Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Multi-page consistency | Centralized design token system |
| Backend simulation | localStorage with quota, compression, normalization |
| CSS specificity management | `.elite-tech` compound selectors for safe layering |
| Mobile adaptation | Separate nav systems, grid restructuring, overlay patterns |

---

## 📝 What I Learned

- **Large frontend architecture** — components, pages, hooks, context, utils separation
- **UX thinking** — empty states, loading states, error handling differentiate a product from a demo
- **State without backend** — localStorage can credibly simulate persistence
- **CSS architecture** — design tokens eliminate visual inconsistency
- **Mobile responsiveness** — isolating changes in `@media` blocks prevents desktop regressions
- **Code quality** — centralized utilities prevent duplicated logic bugs

---

## ⚠️ Limitations

- No real backend or database
- Data resets when localStorage is cleared
- No real payments — simulated only
- Authentication is frontend-only
- Some stats use mock data generation
- localStorage quota limits (~5MB)

---

## 🔮 Future Improvements

- Backend integration (REST / GraphQL)
- Real authentication (JWT / OAuth)
- Database storage
- Real-time messaging (WebSockets)
- Payment processing (Stripe)
- Image hosting (Cloudinary / S3)
- Full auction system
- Admin dashboard
- Product recommendations

---

## Screenshots:
<img width="2100" height="839" alt="chatdesk" src="https://github.com/user-attachments/assets/4d1b1dd7-5366-4364-a20b-99a44a6df4d6" />
<img width="2092" height="838" alt="login" src="https://github.com/user-attachments/assets/5dac0b3b-10a7-40c1-869e-b5d46d0f4f7a" />
<img width="2098" height="838" alt="settingsdesk" src="https://github.com/user-attachments/assets/faf73e0e-e676-415d-addb-e7dd045c7e41" />
<img width="2098" height="838" alt="register" src="https://github.com/user-attachments/assets/46ba2b34-46c7-41be-9783-3108747b1cef" />
<img width="2092" height="836" alt="notificationdesk" src="https://github.com/user-attachments/assets/163cd7a5-cbf0-4c7b-92bb-79a7da2a3db0" />
<img width="2096" height="1679" alt="profiledesk" src="https://github.com/user-attachments/assets/da7522a3-bac2-4a8b-90e7-46438a679a81" />
<img width="2100" height="841" alt="wishlistdesk" src="https://github.com/user-attachments/assets/ca8a545c-7349-40c6-859b-3bdea558cd34" />
<img width="2096" height="825" alt="walletdesk" src="https://github.com/user-attachments/assets/bca11b08-cd0c-4386-8277-66bb5a5f1fcd" />
<img width="2104" height="2542" alt="topdesk" src="https://github.com/user-attachments/assets/16f95913-e41c-4445-90ff-7f57ee3d77a3" />
<img width="2096" height="1670" alt="myorderdesk" src="https://github.com/user-attachments/assets/db31158d-65fb-4c3d-ad9c-961438a1e961" />
<img width="2096" height="1669" alt="invitefriendsdesk" src="https://github.com/user-attachments/assets/3b154077-6472-4df6-9bdb-2461978e490d" />


## 🤝 Connect

**Author:** Ricardo Cesidio  
**GitHub:** [github.com/ricardocesidio](https://github.com/ricardocesidio)  
**Repository:** [github.com/ricardocesidio/retro-gaming](https://github.com/ricardocesidio/retro-gaming)  
**Live Demo:** [retro-gaming-cyan.vercel.app](https://retro-gaming-cyan.vercel.app)  
**Concept Doc:** [PROJECT_CONCEPT.md](PROJECT_CONCEPT.md) — detailed architecture, data flow, design decisions
