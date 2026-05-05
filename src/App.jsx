import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
} from "react-router-dom";
import {
   useState,
   useEffect,
   createContext,
   useContext,
   useMemo,
   useCallback,
   Suspense,
   lazy,
} from "react";
import "./App.css";
import "./styles/utilities.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// CONTEXT
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { upsertUser } from "./utils/auth.js";
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
const NotFound = lazy(() => import("./components/NotFound.jsx"));

// COMPONENTS
import Header from "./components/Header";
import Footer from "./components/footer";
import ScrollToTop from "./components/ScrollToTop";

// ====================== STORAGE KEYS ======================
const SESSION_KEY    = "activeSession";
const SOCIAL_GRAPH_KEY = "socialGraph";

// ====================== AUTH CONTEXT ======================
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export { lookupUser, readRegistry, saveUser, upsertUser } from "./utils/auth.js";

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeId = (value) => String(value ?? "").trim();

const uniq = (arr) =>
  Array.from(new Set((arr || []).map(normalizeId).filter(Boolean)));

const ensureNode = (graph, userId) => {
  const id = normalizeId(userId);
  if (!id) return graph;
  if (!graph[id]) graph[id] = { followers: [], following: [] };
  if (!Array.isArray(graph[id].followers)) graph[id].followers = [];
  if (!Array.isArray(graph[id].following)) graph[id].following = [];
  graph[id].followers = uniq(graph[id].followers);
  graph[id].following = uniq(graph[id].following);
  return graph;
};

// Loading fallback for lazy routes
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader-spinner" />
      <p>Loading...</p>
    </div>
  );
}

function AuthProvider({ children }) {
  const [user,        setUser]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [socialGraph, setSocialGraph] = useState(() =>
    safeParse(localStorage.getItem(SOCIAL_GRAPH_KEY), {})
  );

  useEffect(() => {
    try {
      const session = sessionStorage.getItem(SESSION_KEY);
      if (session) setUser(JSON.parse(session));
    } catch (err) {
      console.error("Failed to parse activeSession:", err);
      sessionStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SOCIAL_GRAPH_KEY, JSON.stringify(socialGraph));
  }, [socialGraph]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === SOCIAL_GRAPH_KEY) setSocialGraph(safeParse(e.newValue, {}));
      if (e.key === SESSION_KEY)      setUser(safeParse(e.newValue, null));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const getUserId = useCallback(
    (u = user) => {
      if (!u) return "";
      return normalizeId(u.id || u._id || u.username || u.email);
    },
    [user]
  );

  const persistSession  = useCallback((nextUser) => {
    if (nextUser) sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    else          sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const persistRegistry = useCallback((partial) => {
    if (!partial || typeof partial !== "object") return;
    upsertUser(partial);
  }, []);

  const updateGlobalUser = useCallback(
    (newData) => {
      setUser((prev) => {
        const updated = { ...(prev || {}), ...(newData || {}) };
        persistSession(updated);
        persistRegistry(updated);
        return updated;
      });
    },
    [persistRegistry, persistSession]
  );

  const login = useCallback(
    (userData) => {
      const normalized = userData || {};
      persistSession(normalized);
      upsertUser(normalized);
      setUser(normalized);
      window.dispatchEvent(new Event("authChange"));
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    persistSession(null);
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
  }, [persistSession]);

  const getFollowData = useCallback(
    (targetUserId) => {
      const id   = normalizeId(targetUserId);
      const node = socialGraph[id] || { followers: [], following: [] };
      return { followers: uniq(node.followers), following: uniq(node.following) };
    },
    [socialGraph]
  );

  const isFollowing = useCallback(
    (targetUserId) => {
      const currentUserId = getUserId();
      const targetId      = normalizeId(targetUserId);
      if (!currentUserId || !targetId) return false;
      const currentNode = socialGraph[currentUserId];
      return uniq(currentNode?.following).includes(targetId);
    },
    [getUserId, socialGraph]
  );

  const followUser = useCallback(
    (targetUserId) => {
      const currentUserId = getUserId();
      const targetId      = normalizeId(targetUserId);
      if (!currentUserId || !targetId) return;
      setSocialGraph((prev) => {
        const next = structuredClone(prev || {});
        ensureNode(next, currentUserId);
        ensureNode(next, targetId);
        next[currentUserId].following = uniq([...next[currentUserId].following, targetId]);
        next[targetId].followers      = uniq([...next[targetId].followers,      currentUserId]);
        return next;
      });
    },
    [getUserId]
  );

  const unfollowUser = useCallback(
    (targetUserId) => {
      const currentUserId = getUserId();
      const targetId      = normalizeId(targetUserId);
      if (!currentUserId || !targetId) return;
      setSocialGraph((prev) => {
        const next = structuredClone(prev || {});
        ensureNode(next, currentUserId);
        ensureNode(next, targetId);
        next[currentUserId].following = uniq(next[currentUserId].following.filter((id) => id !== targetId));
        next[targetId].followers      = uniq(next[targetId].followers.filter((id) => id !== currentUserId));
        return next;
      });
    },
    [getUserId]
  );

  const toggleFollow = useCallback(
    (targetUserId) => {
      if (isFollowing(targetUserId)) unfollowUser(targetUserId);
      else                           followUser(targetUserId);
    },
    [followUser, isFollowing, unfollowUser]
  );

  const getFollowersCount = useCallback(
    (targetUserId) => getFollowData(targetUserId).followers.length,
    [getFollowData]
  );

  const getFollowingCount = useCallback(
    (targetUserId) => getFollowData(targetUserId).following.length,
    [getFollowData]
  );

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      login,
      logout,
      updateGlobalUser,
      socialGraph,
      followUser,
      unfollowUser,
      toggleFollow,
      isFollowing,
      getFollowersCount,
      getFollowingCount,
      getFollowData,
      getUserId,
    }),
    [
      user, loading, login, logout, updateGlobalUser, socialGraph,
      followUser, unfollowUser, toggleFollow, isFollowing,
      getFollowersCount, getFollowingCount, getFollowData, getUserId,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
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
                <Route path="/auction"     element={user ? <Navigate to={{ pathname: "/market", search: "?category=Auction" }} replace /> : <Navigate to="/login" replace />} />

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
