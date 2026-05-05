# 🎮 Retro Gaming Marketplace

A modern, full-featured frontend marketplace for retro gaming enthusiasts. Built as a single-page application with React, featuring user profiles, real-time messaging, offers, bundles, and a responsive dark-themed UI.

![Retro Gaming Banner](./public/retro-banner.png)

## 🚀 Live Demo

Since this is a frontend-only demo using localStorage, you can run it locally to experience all features.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Page Documentation](#page-documentation)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Key Implementations](#key-implementations)
- [Future Enhancements](#future-enhancements)

## 🛠 Tech Stack

- **Framework**: React 18+ with Vite
- **Routing**: React Router DOM v6
- **Styling**: CSS3 with CSS Variables, Flexbox/Grid
- **Fonts**: Google Sans & Kanit (Google Fonts)
- **Icons**: Font Awesome 6
- **State**: React Context API, useState, useEffect, useMemo
- **Storage**: localStorage (frontend-only demo)
- **Build Tool**: Vite 8.x

## ✨ Features

### Core Marketplace
- **Product Listings** - Browse retro games, consoles, and accessories
- **Advanced Search & Filters** - Category, price range, condition filters
- **Product Detail Pages** - Images, descriptions, shipping options
- **Responsive Grid** - 5-column layout with max-width 1600px

### User System
- **Authentication** - Login/Register with session management
- **User Profiles** - Customizable profiles with avatars, bio, location
- **Follow System** - Follow/unfollow users, track followers/following
- **User Tiers** - Bronze, Silver, Gold, Platinum, Master, Supreme based on gems/reviews

### Commerce Features
- **Make an Offer** - Negotiate prices with sellers (`/offer/:id`)
- **Create Bundles** - Bundle multiple items from any seller (`/bundle/:id`)
- **Sell Items** - Post new listings with images and details
- **Orders Management** - View active and sold items

### Communication
- **Messaging System** - Real-time chat interface with conversations
- **Offer Notifications** - Automated messages for offers and bundles
- **Unread Indicators** - Yellow dots for new messages

### UI/UX Highlights
- **Dark Theme** - Premium black (#000000) background with purple accents
- **Elite-Tech Profile Cards** - Animated gradient borders and glow effects
- **Smooth Scrolling** - Auto-scroll to top on page navigation
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Glass-morphism** - Frosted glass effects on cards

## 📄 Page Documentation

### 1. **Home (`/`)**
Landing page with hero section, featured products, and call-to-action sections.
- Animated banner slider
- Featured retro gaming products
- Quick navigation to marketplace

### 2. **Market (`/market`)**
Main marketplace with product grid.
- **Grid Layout**: 5 columns, max-width 1600px
- **Filters**: Category (Games, Consoles, Accessories), price range, condition
- **Product Cards**: Image, title, price, condition, seller info
- **Responsive**: Adapts from 5 columns to 1 column on mobile

### 3. **Product Detail (`/product/:id`)**
Individual product page with full details.
- **Image Gallery**: Product images with fallback placeholders
- **Seller Info**: Clickable seller row navigates to `/profile/:username`
- **Shipping Tabs**: "Shipping" and "In-person Sale" with toggle
- **Protected Shipping**: Green shield icon for secure transactions
- **Action Buttons**: 
  - **Make Your Offer** - Navigates to `/offer/:id`
  - **Make a Bundle** - Navigates to `/bundle/:id`
- **Heart Button**: Purple hover with white heart animation
- **Username Button**: Circular hover effect with purple color

### 4. **Profile (`/profile/:username`)**
User profile page displaying user info and listings.
- **Profile Header Card** (`.elite-tech`):
  - Animated gradient border with glow
  - User avatar, name, verification badge
  - Reviews (gem ratings), location, followers/following stats
  - Bio section
- **Stats Display**: Followers, Following, Items Sold
- **User Listings**:
  - Grid of user's active items with images
  - Toggle between "Listings" and "Sold Items"
  - Empty state with centered "Start Selling" button
  - Only shows items with images
- **Community Reviews Slider**: Carousel of user reviews
- **Action Buttons**: Follow, Message, Edit Profile (own profile)

### 5. **Messages (`/messages`)**
Full messaging system with chat interface.
- **Black Theme**: All components black background
  - `.messages-page`: #000000
  - `.chat-window`: #000000
  - `.chat-history`: #000000
  - `.chat-input-area`: #000000
- **Inbox Sidebar** (`.inbox-sidebar`): #111111
- **Messages Layout** (`.messages-layout`): #1a1a1a
- **Conversation List**: Seller avatars, last message preview, unread dots
- **Chat Window**: 
  - Product context card at top
  - Sent/Received message bubbles
  - Auto-scroll disabled (stays at top)
  - Unread yellow dot disappears when chat opens
- **Offer/Bundle Messages**: 
  - 📩 Emoji prefix for offers
  - 📦 Emoji prefix for bundles
  - Stored in localStorage `retroConversations`

### 6. **Make an Offer (`/offer/:id`)**
Dedicated page for submitting offers.
- Pre-filled product info (image, title, current price)
- Input for offer amount (€)
- Optional message to seller
- Sends "📩 Offer: €amount" message to seller's conversation
- Creates conversation if it doesn't exist

### 7. **Create Bundle (`/bundle/:id`)**
Multi-step bundle creation flow.
- **Step 1**: Confirm first item (from Product Detail page)
- **Step 2**: Add more items
  - Browse marketplace items
  - Add items from ANY seller (not just one)
  - Remove items from bundle
  - Live total calculation
- **Send Bundle**: Creates "📦 Bundle Offer: €total (items)" message
- Uses `onClickOverride` prop in ProductCard to prevent navigation during selection

### 8. **Sell (`/sell`)**
Page for posting new listings.
- **Gradient Title**: White → Purple → Gold gradient text
- **Form Fields**: Title, price, category, condition, description, shipping options
- **Image Upload**: Supports multiple images (stored as base64/data URLs)
- **Storage**: Saves to localStorage `meusAnunciosRetro`
- **Normalization**: `normalizeProduct()` ensures consistent data structure

### 9. **My Orders (`/my-orders`)**
User's order history.
- **Black Background**: #000000
- **H1 Styling**: 2em font-size, 0.5px letter-spacing, Google Sans
- **Order Cards**: Glass-morphism effect with order details
- **Filter**: Active vs Sold orders

### 10. **Wishlist (`/wishlist`)**
Saved/favorited items.
- **H1 Styling**: 2em, 0.5px letter-spacing
- **Remove Button**: Trash icon to remove from wishlist
- **Product Cards**: Same as marketplace with heart animation

### 11. **Settings (`/settings`)**
User settings and preferences.
- **H1**: "USER SETTINGS" - 2em, 0.5px letter-spacing
- **Sections**: Profile info, password, notifications, privacy
- **Avatar Upload**: Update profile picture
- **Bio/Location**: Edit personal information

### 12. **Notifications (`/notifications`)**
User notifications center.
- **H1 Styling**: 2em, 0.5px letter-spacing
- **Notification Cards**: Unread indicators, timestamp
- **Mark All Read**: Bulk action button
- **Types**: Offers, messages, followers, system alerts

### 13. **Donations (`/donations`)**
Support the platform.
- **H1 Styling**: 2em, 0.5px letter-spacing
- **Donation Tiers**: Visual selection with amounts
- **Gradient Cards**: Purple-themed donation options

### 14. **Login (`/login`) & Register (`/register`)**
Authentication pages.
- **Form Validation**: Email, username, password
- **Session Management**: localStorage `activeSession`
- **User Registry**: localStorage `userRegistry`
- **Redirect**: Authenticated users redirected to home/market

### 15. **Invite Friends (`/invite-friends`)**
Referral system page.
- **Elite-Tech Card**: Same styling as profile header
- **Referral Link**: Copy to clipboard functionality
- **Share Options**: Social media sharing placeholders

### 16. **Retro Rules (`/retro-rules`)**
Platform rules and guidelines.
- **Elite-Tech Card**: Purple gradient header
- **Rules List**: Community guidelines
- **Enforcement**: Violation consequences

### 17. **404 Not Found (`/*`)**
Custom 404 page.
- Retro-themed design
- Navigation back to home

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/retro-gaming-marketplace.git

# Navigate to project directory
cd retro-gaming-marketplace

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📂 Project Structure

```
retro-gaming/
├── public/
│   ├── images/              # Static images (gameboy.jpg, ps2.jpg, etc.)
│   ├── favicon.svg
│   └── index.html          # Entry HTML with Google Fonts
├── src/
│   ├── components/
│   │   ├── Header.jsx      # Navigation header
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx  # Reusable product card
│   │   ├── ScrollToTop.jsx  # Auto-scroll to top on route change
│   │   └── ErrorBoundary.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Market.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Profile.jsx      # With user listings & elite-tech card
│   │   ├── Messages.jsx
│   │   ├── Offer.jsx        # Make an offer page
│   │   ├── Bundle.jsx       # Create bundle page
│   │   ├── Sell.jsx
│   │   ├── MyOrders.jsx
│   │   ├── Wishlist.jsx
│   │   ├── Settings.jsx
│   │   ├── Notifications.jsx
│   │   ├── Donations.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ...
│   ├── utils/
│   │   ├── auth.js         # Authentication utilities
│   │   ├── marketStorage.js # Marketplace localStorage
│   │   ├── userListings.js  # User listings management
│   │   ├── normalizeProduct.js
│   │   ├── fallbackImage.js
│   │   └── shared.js
│   ├── context/
│   │   └── WishlistContext.jsx
│   ├── hooks/
│   │   └── useMarketListings.js
│   ├── styles/
│   │   ├── design-tokens.css  # CSS variables & fonts
│   │   └── utilities.css
│   ├── App.jsx             # Main app with routes
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
└── README.md
```

## 🔧 Key Implementations

### Scroll Management
```jsx
// ScrollToTop.jsx - Resets scroll position on route change
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
```

### Offer/Bundle Flow
1. User clicks "Make Your Offer" on ProductDetail
2. Navigates to `/offer/:id` with product context
3. Submits offer → Creates message in Messages with 📩 emoji
4. Seller receives notification in inbox

### localStorage Data Keys
- `activeSession` - Current user session
- `userRegistry` - All registered users
- `meusAnunciosRetro` - Marketplace listings
- `userListings` - User-specific listings
- `retroConversations` - Message conversations
- `socialGraph` - Followers/following relationships
- `wishlist_[username]` - User wishlists

### CSS Architecture
- **Design Tokens**: CSS variables in `design-tokens.css`
- **Font Stack**: `'Google Sans', 'Kanit', -apple-system, sans-serif`
- **H1 Standard**: `font-size: 2em; letter-spacing: 0.5px;`
- **Color Palette**:
  - Background: `#000000`
  - Purple Accent: `#9d50bb`
  - Yellow: `#ffd700`
  - Text: `#f5f5ff`

## 🚧 Future Enhancements

Since this is a frontend-only demo, here's what would be needed for production:

- [ ] **Backend Integration**: Node.js/Express or similar
- [ ] **Database**: MongoDB/PostgreSQL for persistent storage
- [ ] **Real Authentication**: JWT tokens, password hashing (bcrypt)
- [ ] **Image Upload**: Cloud storage (AWS S3, Cloudinary)
- [ ] **Real-time Messaging**: WebSockets (Socket.io)
- [ ] **Payment Processing**: Stripe/PayPal integration
- [ ] **Search Engine**: Elasticsearch or Algolia
- [ ] **User Verification**: Email verification, KYC
- [ ] **Admin Dashboard**: User management, reporting
- [ ] **Unit Tests**: Jest + React Testing Library
- [ ] **E2E Tests**: Cypress or Playwright

## 📸 Screenshots

(Add screenshots/GIFs of key flows here)

- Home page with banner
- Marketplace grid view
- Product detail with offer/bundle buttons
- Profile page with elite-tech card
- Messages interface (dark theme)
- Offer submission flow
- Bundle creation steps

## ⚠️ Important Notes

**This is a FRONTEND-ONLY demo.** All data is stored in the browser's localStorage:
- Data persists only in the current browser
- Clearing localStorage will reset all data
- No real backend or database
- No real user authentication
- Images uploaded are converted to base64 (not suitable for production)

This project is intended to demonstrate frontend development skills, UI/UX design, and React proficiency.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Portfolio: [yourportfolio.com](https://yourportfolio.com)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

⭐ **Star this repo if you found it useful for learning React!**

Built with ❤️ and lots of ☕ by a passionate frontend developer.
