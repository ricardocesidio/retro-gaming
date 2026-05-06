# Retro Gaming Marketplace

A modern frontend marketplace for buying, selling, and trading retro games and collectibles. Built as a complete UI/UX simulation with real interaction flows, localStorage-based state management, and premium visual design.

## Live Demo

Demo available locally via development server. See [Getting Started](#getting-started) below.

## Purpose

This is a frontend-only project built for portfolio demonstration. It focuses on frontend architecture, user experience design, and interface polish rather than backend integration. The project simulates marketplace behavior using browser localStorage to demonstrate:

- Complex state management without a backend
- Multi-page user flows
- Form validation and error handling
- Responsive design across breakpoints
- Component architecture and reusability

## Features

- User authentication simulation (frontend only)
- Create, preview, and publish marketplace listings
- Marketplace browsing with category, price, and keyword filters
- Product detail pages with image galleries
- Make Offer system with message integration
- Bundle system (select multiple items across sellers)
- Real-time messaging simulation between users
- Wishlist functionality with persistence
- User profiles with stats and inventory
- Responsive design (desktop, tablet, mobile)
- Toast notifications and form feedback
- Image upload with compression and fallback handling
- Draft saving for incomplete listings

## Pages & Functionality

### Home
Entry point with hero section, banner slider, and embedded marketplace preview. Guides users toward browsing or selling.

### Market
Browse all listings with advanced filters (category, condition, price range, search). Includes load-more pagination and responsive product grid.

### Product Detail
Full item view with image gallery, seller information, description, and action buttons (Buy, Make Offer, Add to Bundle).

### Sell
Create new listings with comprehensive form validation:
- Title, category, subcategory, condition, price
- Description with character counter
- Image upload with compression and draft saving
- Parcel size selector with visual tier cards (bronze, silver, gold, pink)
- localStorage quota handling

### Profile
User profile page displaying:
- Avatar and seller stats
- Active listings inventory
- Reviews section (mock data)
- Edit functionality

### Messages
Chat system simulation between users:
- Conversation list with unread indicators
- Image attachment support
- Report user functionality
- Block/unblock users

### Bundle
Multi-seller bundle flow:
- Select primary item from any listing
- Browse marketplace to add additional items
- Send bundled offer as a single message
- Visual bundle summary with total calculation

### Wishlist
Saved items with:
- Add/remove from any product card
- Persistent storage across sessions
- Empty state with clear guidance

### Settings
User settings page (UI simulation):
- Profile picture upload
- Username, email, about section
- Country and language selection
- Email change limit simulation

### Auction
Placeholder page indicating "Coming Soon" for future auction functionality.

### Notifications
User notifications with:
- Support/donation prompts
- Invite friends functionality
- Clear all and management options

### Login / Register
Authentication pages (frontend simulation):
- Form validation with password strength meter
- Email format validation
- Character limits and error feedback

## How It Works

This project uses **localStorage** to simulate backend behavior. No real backend or database is used.

**Simulated flows:**
- **Publishing listings**: Stored in `localStorage` under `meusAnunciosRetro`
- **Messaging**: Conversations stored in `localStorage` under `retroConversations`
- **Wishlist**: Persisted in `localStorage` via WishlistContext
- **User sessions**: Simulated via `localStorage` with auth context
- **Drafts**: Auto-saved to `localStorage` with quota management

**Important:** Data resets when localStorage is cleared. This project focuses on frontend architecture and user experience rather than backend integration.

## Tech Stack

- **React** (with React Router DOM for routing)
- **JavaScript (ES6+)**
- **CSS3** (custom styling with design tokens)
- **localStorage** (data persistence simulation)
- **Vite** (build tool and dev server)

## Project Structure

```
retro-gaming/
├── src/
│   ├── components/        # Reusable UI (Header, Footer, Menu, ProductCard)
│   ├── pages/             # Main views (Home, Market, Sell, Profile, etc.)
│   ├── hooks/             # Custom hooks (useMarketListings)
│   ├── utils/              # Helpers (storage, auth, image handling)
│   ├── styles/            # Global styles & design tokens
│   ├── context/           # React contexts (Auth, Wishlist)
│   ├── images/            # Static assets
│   ├── App.jsx            # Root component with routes
│   └── main.jsx           # Entry point
├── public/
├── index.html
└── package.json
```

## Design System

The project uses a centralized **design-tokens.css** file with:
- 130+ CSS custom properties
- Consistent color palette (black theme)
- Typography scale (--text-xs through --text-5xl)
- Spacing system (--space-1 through --space-24)
- Responsive breakpoint variables (--bp-sm through --bp-4xl)
- Z-index scale and transition tokens

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Then open: `http://localhost:5173`

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Limitations

- No real backend or database
- Data resets if localStorage is cleared
- No real payments or transaction processing
- Authentication is simulated (frontend only)
- Reviews and some stats use mock data
- Auction page is a placeholder ("Coming Soon")

## Future Improvements

- Backend integration with REST API or GraphQL
- Real user authentication with JWT
- Database storage (PostgreSQL, MongoDB)
- Real-time messaging with WebSockets
- Payment processing integration
- Image storage with cloud provider (AWS S3, Cloudinary)
- Auction system implementation
- Admin dashboard

## Author

Natalia Windelboth

GitHub: [github.com/nataliawindelboth](https://github.com/nataliawindelboth)

---

**Note:** This project is a frontend portfolio piece demonstrating UI/UX skills, React architecture, and CSS design systems. It is not intended for production use without backend integration.
