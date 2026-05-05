import { safeStorageGet, safeStorageSet } from "./marketStorage";

export const NOTIFICATIONS_KEY = "retroNotifications";
export const CONVERSATIONS_KEY = "retroConversations";
export const RECENTLY_VIEWED_KEY = "retroRecentlyViewed";

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const clone = (value) => safeParse(JSON.stringify(value), value);

export const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    type: "follow",
    icon: "fa-user-plus",
    color: "#22c55e",
    message: "Someone started following you",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    type: "shipment",
    icon: "fa-truck",
    color: "#3b82f6",
    message: "Your package has been shipped",
    time: "45m ago",
    unread: false,
  },
  {
    id: 3,
    type: "sale",
    icon: "fa-sack-dollar",
    color: "#eab308",
    message: "Your item was sold",
    time: "3h ago",
    unread: true,
  },
  {
    id: 4,
    type: "listing",
    icon: "fa-plus",
    color: "#a855f7",
    message: "A user listed a new item you might like",
    time: "5h ago",
    unread: false,
  },
];

export const DEFAULT_CONVERSATIONS = [
  {
    id: 1,
    name: "Miguel Silva",
    avatar: "https://i.pravatar.cc/150?img=11",
    lastMsg: "Is the Gameboy still available?",
    time: "14:30",
    unread: 1,
    product: {
      id: "gameboy-color-berry",
      name: "GameBoy Color - Berry",
      price: "85€",
      img: "https://m.media-amazon.com/images/I/81s7-YfS9EL._SL1500_.jpg",
    },
    history: [
      { type: "received", text: "Hi! Does the screen have scratches?", time: "14:10" },
      { type: "sent", text: "It's flawless! New lens.", time: "14:15" },
      { type: "received", text: "Do you ship via MBWay?", time: "14:20" },
      { type: "received", text: "Is the Gameboy still available?", time: "14:30" },
    ],
  },
  {
    id: 2,
    name: "Ana Retro",
    avatar: "https://i.pravatar.cc/150?img=32",
    lastMsg: "The package arrived perfectly!",
    time: "Yesterday",
    unread: 0,
    product: null,
    history: [{ type: "received", text: "The package arrived perfectly! Thank you so much!", time: "Yesterday" }],
  },
];

const normalizeNotification = (item) => ({
  id: item?.id ?? Date.now(),
  type: item?.type ?? "info",
  icon: item?.icon ?? "fa-bell",
  color: item?.color ?? "var(--accent-purple)",
  message: String(item?.message ?? "New notification"),
  time: String(item?.time ?? "Just now"),
  unread: item?.unread !== false,
});

const normalizeConversation = (item) => ({
  id: item?.id ?? Date.now(),
  name: String(item?.name ?? "Conversation"),
  avatar: String(item?.avatar ?? ""),
  lastMsg: String(item?.lastMsg ?? ""),
  time: String(item?.time ?? "Now"),
  unread: Number(item?.unread ?? 0),
  product: item?.product || null,
  history: Array.isArray(item?.history) ? item.history : [],
});

export const readNotifications = () => {
  const stored = safeStorageGet(NOTIFICATIONS_KEY, null);
  if (Array.isArray(stored) && stored.length > 0) {
    return stored.map(normalizeNotification);
  }
  return clone(DEFAULT_NOTIFICATIONS);
};

export const writeNotifications = (notifications) => {
  const next = Array.isArray(notifications) ? notifications.map(normalizeNotification) : [];
  safeStorageSet(NOTIFICATIONS_KEY, next);
  return next;
};

export const unreadNotificationsCount = () => readNotifications().filter((n) => n.unread).length;

export const markNotificationRead = (notificationId) => {
  const id = String(notificationId ?? "");
  const next = readNotifications().map((n) => (String(n.id) === id ? { ...n, unread: false } : n));
  writeNotifications(next);
  return next;
};

export const markAllNotificationsRead = () => {
  const next = readNotifications().map((n) => ({ ...n, unread: false }));
  writeNotifications(next);
  return next;
};

export const readConversations = () => {
  const stored = safeStorageGet(CONVERSATIONS_KEY, null);
  if (Array.isArray(stored) && stored.length > 0) {
    return stored.map(normalizeConversation);
  }
  return clone(DEFAULT_CONVERSATIONS);
};

export const writeConversations = (conversations) => {
  const next = Array.isArray(conversations) ? conversations.map(normalizeConversation) : [];
  safeStorageSet(CONVERSATIONS_KEY, next);
  return next;
};

export const upsertConversation = (conversation) => {
  const next = readConversations();
  const normalized = normalizeConversation(conversation);
  const index = next.findIndex((item) => String(item.id) === String(normalized.id));
  if (index >= 0) next[index] = { ...next[index], ...normalized };
  else next.unshift(normalized);
  writeConversations(next);
  return next;
};

export const appendConversationMessage = (conversationId, message) => {
  const next = readConversations().map((chat) => {
    if (String(chat.id) !== String(conversationId)) return chat;
    const history = Array.isArray(chat.history) ? [...chat.history, message] : [message];
    return {
      ...chat,
      history,
      lastMsg: String(message?.text ?? chat.lastMsg ?? ""),
      time: String(message?.time ?? chat.time ?? "Now"),
      unread: chat.unread,
    };
  });
  writeConversations(next);
  return next;
};

export const readRecentlyViewed = () => safeStorageGet(RECENTLY_VIEWED_KEY, []);

export const addRecentlyViewed = (product) => {
  if (!product?.id) return [];
  const current = Array.isArray(readRecentlyViewed()) ? readRecentlyViewed() : [];
  const next = [
    {
      id: product.id,
      title: product.title,
      image: product.image || product.images?.[0] || "",
      price: product.price,
      category: product.category,
      viewedAt: Date.now(),
    },
    ...current.filter((item) => String(item?.id) !== String(product.id)),
  ].slice(0, 12);
  safeStorageSet(RECENTLY_VIEWED_KEY, next);
  return next;
};
