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
} from "react";
import "./App.css";
import "./elite.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// CONTEXT
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { upsertUser } from "./utils/auth.js";

// PAGES
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Messages from "./pages/Messages.jsx";
import Sell from "./pages/Sell.jsx";
import Market from "./pages/Market.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Login from "./pages/Login.jsx";
import Settings from "./pages/Settings.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Notifications from "./pages/Notifications.jsx";
import RetroRules from "./pages/retro-rules.jsx";
import InviteFriends from "./pages/Invite-friends.jsx";
import Donations from "./pages/Donations.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import NotFound from "./components/NotFound.jsx";

// COMPONENTS
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/footer";

const SESSION_KEY = "activeSession";
const THEME_KEY = "theme";
const SOCIAL_GRAPH_KEY = "socialGraph";

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
const uniq = (arr) => Array.from(new Set((arr || []).map(normalizeId).filter(Boolean)));

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

const resolveAvatar = (u) => u?.avatar || u?.profilePic || u?.profileImage || "";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socialGraph, setSocialGraph] = useState(() => safeParse(localStorage.getItem(SOCIAL_GRAPH_KEY), {}));

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
      if (e.key === SESSION_KEY) setUser(safeParse(e.newValue, null));
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

  const persistSession = useCallback((nextUser) => {
    if (nextUser) sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    else sessionStorage.removeItem(SESSION_KEY);
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
      const id = normalizeId(targetUserId);
      const node = socialGraph[id] || { followers: [], following: [] };
      return { followers: uniq(node.followers), following: uniq(node.following) };
    },
    [socialGraph]
  );

  const isFollowing = useCallback(
    (targetUserId) => {
      const currentUserId = getUserId();
      const targetId = normalizeId(targetUserId);
      if (!currentUserId || !targetId) return false;
      const currentNode = socialGraph[currentUserId];
      return uniq(currentNode?.following).includes(targetId);
    },
    [getUserId, socialGraph]
  );

  const followUser = useCallback(
    (targetUserId) => {
      const currentUserId = getUserId();
      const targetId = normalizeId(targetUserId);
      if (!currentUserId || !targetId) return;
      setSocialGraph((prev) => {
        const next = structuredClone(prev || {});
        ensureNode(next, currentUserId);
        ensureNode(next, targetId);
        next[currentUserId].following = uniq([...next[currentUserId].following, targetId]);
        next[targetId].followers = uniq([...next[targetId].followers, currentUserId]);
        return next;
      });
    },
    [getUserId]
  );

  const unfollowUser = useCallback(
    (targetUserId) => {
      const currentUserId = getUserId();
      const targetId = normalizeId(targetUserId);
      if (!currentUserId || !targetId) return;
      setSocialGraph((prev) => {
        const next = structuredClone(prev || {});
        ensureNode(next, currentUserId);
        ensureNode(next, targetId);
        next[currentUserId].following = uniq(next[currentUserId].following.filter((id) => id !== targetId));
        next[targetId].followers = uniq(next[targetId].followers.filter((id) => id !== currentUserId));
        return next;
      });
    },
    [getUserId]
  );

  const toggleFollow = useCallback(
    (targetUserId) => {
      if (isFollowing(targetUserId)) unfollowUser(targetUserId);
      else followUser(targetUserId);
    },
    [followUser, isFollowing, unfollowUser]
  );

  const getFollowersCount = useCallback((targetUserId) => getFollowData(targetUserId).followers.length, [getFollowData]);
  const getFollowingCount = useCallback((targetUserId) => getFollowData(targetUserId).following.length, [getFollowData]);

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
      user,
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
    ]
  );

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

function AppContent() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem(THEME_KEY) || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const currentAvatar = resolveAvatar(user);

  return (
    <Router>
      <div className="app">
        <Header
          isLoggedIn={!!user}
          currentUser={user?.username || ""}
          currentAvatar={currentAvatar}
          theme={theme}
          toggleTheme={toggleTheme}
          onLogout={logout}
        />
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/market" element={user ? <Market /> : <Navigate to="/login" replace />} />
            <Route path="/marketplace" element={user ? <Navigate to="/market" replace /> : <Navigate to="/login" replace />} />
            <Route path="/consoles" element={user ? <Navigate to={{ pathname: "/market", search: "?category=Consoles" }} replace /> : <Navigate to="/login" replace />} />
            <Route path="/games" element={user ? <Navigate to={{ pathname: "/market", search: "?category=Games" }} replace /> : <Navigate to="/login" replace />} />
            <Route path="/collectibles" element={user ? <Navigate to={{ pathname: "/market", search: "?category=Collectibles" }} replace /> : <Navigate to="/login" replace />} />
            <Route path="/arcade" element={user ? <Navigate to={{ pathname: "/market", search: "?category=Retro%20Arcade" }} replace /> : <Navigate to="/login" replace />} />
            <Route path="/product/:id" element={user ? <ProductDetail /> : <Navigate to="/login" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/sell" element={user ? <Sell /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
            <Route path="/profile/:name" element={user ? <Profile /> : <Navigate to="/login" replace />} />
            <Route path="/reviews" element={user ? <Profile /> : <Navigate to="/login" replace />} />
            <Route path="/followers" element={user ? <Profile /> : <Navigate to="/login" replace />} />
            <Route path="/following" element={user ? <Profile /> : <Navigate to="/login" replace />} />
            <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" replace />} />
            <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" replace />} />
            <Route path="/wishlist" element={user ? <Wishlist /> : <Navigate to="/login" replace />} />
            <Route path="/my-collections" element={user ? <Navigate to="/wishlist" replace /> : <Navigate to="/login" replace />} />
            <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" replace />} />
            <Route path="/invite" element={user ? <InviteFriends /> : <Navigate to="/login" replace />} />
            <Route path="/retro-rules" element={user ? <RetroRules /> : <Navigate to="/login" replace />} />
            <Route path="/my-orders" element={user ? <MyOrders /> : <Navigate to="/login" replace />} />
            <Route path="/order-details/:id" element={user ? <OrderDetails /> : <Navigate to="/login" replace />} />
            <Route path="/donations" element={user ? <Donations /> : <Navigate to="/login" replace />} />
            {["/cart", "/rules", "/community", "/blog"].map((path) => (
              <Route key={path} path={path} element={user ? <Navigate to="/market" replace /> : <Navigate to="/login" replace />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
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
