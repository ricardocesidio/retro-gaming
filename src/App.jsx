import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
} from "react-router-dom";
import {
   Suspense,
   lazy,
} from "react";
import "./App.css";
import "./styles/utilities.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// CONTEXT
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { resolveAvatar } from "./utils/shared.js";

// PAGES - Lazy loaded for code splitting
const Home = lazy(() => import("./pages/Home.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Messages = lazy(() => import("./pages/Messages.jsx"));
const Sell = lazy(() => import("./pages/Sell.jsx"));
const Market = lazy(() => import("./pages/Market.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const Offer = lazy(() => import("./pages/Offer.jsx"));
const Bundle = lazy(() => import("./pages/Bundle.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const Notifications = lazy(() => import("./pages/Notifications.jsx"));
const RetroRules = lazy(() => import("./pages/retro-rules.jsx"));
const InviteFriends = lazy(() => import("./pages/Invite-friends.jsx"));
const Donations = lazy(() => import("./pages/Donations.jsx"));
const MyOrders = lazy(() => import("./pages/MyOrders.jsx"));
const OrderDetails = lazy(() => import("./pages/OrderDetails.jsx"));
const Wallet = lazy(() => import("./pages/Wallet.jsx"));
const Auction = lazy(() => import("./pages/Auction.jsx"));
const NotFound = lazy(() => import("./components/NotFound.jsx"));

// COMPONENTS
import Header from "./components/Header";
import Footer from "./components/footer";
import ScrollToTop from "./components/ScrollToTop";

// Loading fallback for lazy routes
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader-spinner" />
      <p>Loading...</p>
    </div>
  );
}

// ====================== APP CONTENT ======================
function AppContent() {
  const { user, logout } = useAuth();

  // ─── FIXED: resolveAvatar reads `avatar` first, then `profilePic`, then
  // `profileImage`. Previously App.jsx only read `avatar || profileImage`,
  // missing the `profilePic` field that Settings used to save — so changing
  // your photo in Settings never updated the Header dropdown.
  const currentAvatar = resolveAvatar(user);

  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Header
          isLoggedIn={!!user}
          currentUser={user?.username || ""}
          currentAvatar={currentAvatar}
          onLogout={logout}
        />
        <main className="main-content">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/market"      element={user ? <Market />        : <Navigate to="/login" replace />} />
                <Route path="/marketplace" element={user ? <Navigate to="/market" replace /> : <Navigate to="/login" replace />} />
                <Route path="/consoles"    element={user ? <Navigate to={{ pathname: "/market", search: "?category=Consoles" }}    replace /> : <Navigate to="/login" replace />} />
                <Route path="/games"       element={user ? <Navigate to={{ pathname: "/market", search: "?category=Games" }}       replace /> : <Navigate to="/login" replace />} />
                <Route path="/collectibles" element={user ? <Navigate to={{ pathname: "/market", search: "?category=Collectibles" }} replace /> : <Navigate to="/login" replace />} />
                <Route path="/arcade"      element={user ? <Navigate to={{ pathname: "/market", search: "?category=Retro%20Arcade" }} replace /> : <Navigate to="/login" replace />} />
                <Route path="/auction"     element={user ? <Auction /> : <Navigate to="/login" replace />} />

                <Route path="/product/:id" element={user ? <ProductDetail /> : <Navigate to="/login" replace />} />
                <Route path="/offer/:id" element={user ? <Offer /> : <Navigate to="/login" replace />} />
                <Route path="/bundle/:id" element={user ? <Bundle /> : <Navigate to="/login" replace />} />

                <Route path="/register" element={<Register />} />
                <Route path="/login"    element={user ? <Navigate to="/" replace /> : <Login />} />

                <Route path="/sell"          element={user ? <Sell />          : <Navigate to="/login" replace />} />
                <Route path="/profile"       element={user ? <Profile />       : <Navigate to="/login" replace />} />
                <Route path="/profile/:name" element={user ? <Profile />       : <Navigate to="/login" replace />} />
                <Route path="/reviews"       element={user ? <Profile />       : <Navigate to="/login" replace />} />
                <Route path="/followers"     element={user ? <Profile />       : <Navigate to="/login" replace />} />
                <Route path="/following"     element={user ? <Profile />       : <Navigate to="/login" replace />} />
                <Route path="/settings"      element={user ? <Settings />      : <Navigate to="/login" replace />} />
                <Route path="/messages"      element={user ? <Messages />      : <Navigate to="/login" replace />} />
                <Route path="/wishlist"      element={user ? <Wishlist />      : <Navigate to="/login" replace />} />
                <Route path="/my-collections" element={user ? <Navigate to="/wishlist" replace /> : <Navigate to="/login" replace />} />
                <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" replace />} />
                <Route path="/invite"        element={user ? <InviteFriends /> : <Navigate to="/login" replace />} />
                <Route path="/retro-rules"   element={user ? <RetroRules />   : <Navigate to="/login" replace />} />
                <Route path="/my-orders"     element={user ? <MyOrders />     : <Navigate to="/login" replace />} />
                <Route path="/order-details/:id" element={user ? <OrderDetails /> : <Navigate to="/login" replace />} />
                <Route path="/donations"     element={user ? <Donations />    : <Navigate to="/login" replace />} />
                <Route path="/wallet"        element={user ? <Wallet />       : <Navigate to="/login" replace />} />

                {["/cart", "/rules", "/community", "/blog"].map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={user ? <Navigate to="/market" replace /> : <Navigate to="/login" replace />}
                  />
                ))}

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          <Footer />
        </main>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <AppContent />
      </WishlistProvider>
    </AuthProvider>
  );
}
