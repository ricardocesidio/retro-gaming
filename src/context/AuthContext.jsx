import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { upsertUser } from "../utils/auth.js";
import { safeJsonParse as safeParse } from "../utils/shared.js";

const SESSION_KEY = "activeSession";
const SOCIAL_GRAPH_KEY = "socialGraph";

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

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socialGraph, setSocialGraph] = useState(() =>
    safeParse(localStorage.getItem(SOCIAL_GRAPH_KEY), {})
  );

  useEffect(() => {
    try {
      const session = sessionStorage.getItem(SESSION_KEY);
      if (session) setUser(JSON.parse(session));
    } catch (err) {
      if (import.meta.env.DEV) console.error("Failed to parse activeSession:", err);
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
        next[currentUserId].following = uniq(
          next[currentUserId].following.filter((id) => id !== targetId)
        );
        next[targetId].followers = uniq(
          next[targetId].followers.filter((id) => id !== currentUserId)
        );
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
