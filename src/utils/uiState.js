import { safeStorageGet, safeStorageSet } from "./marketStorage";

export const NOTIFICATIONS_KEY = "retroNotifications";
export const CONVERSATIONS_KEY = "retroConversations";
export const RECENTLY_VIEWED_KEY = "retroRecentlyViewed";
export const CONVERSATIONS_UPDATED_EVENT = "retroConversationsUpdated";

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
      img: "/images/gameboy.jpg",
    },
    history: [
      { type: "received", text: "Hi! Does the screen have scratches?", time: "14:10" },
      { type: "sent", text: "It's flawless! New lens.", time: "14:15" },
      { type: "received", text: "Do you ship via MBWay?", time: "14:20" },
      { type: "received", text: "Is the Gameboy still available?", time: "14:30" },
    ],
  },
  {
    id: 3,
    name: "João Gaming",
    avatar: "https://i.pravatar.cc/150?img=12",
    lastMsg: "Can you do 120€ for the PS2?",
    time: "2h ago",
    unread: 2,
    product: {
      id: "ps2-slim",
      name: "PlayStation 2 Slim",
      price: "130€",
      img: "/images/ps2.jpg",
    },
    history: [
      { type: "sent", text: "PS2 Slim in excellent condition, 2 controllers included", time: "1h ago" },
      { type: "received", text: "Can you do 120€ for the PS2?", time: "2h ago" },
      { type: "received", text: "Also, does it come with AV cables?", time: "2h ago" },
    ],
  },
  {
    id: 4,
    name: "Sofia Pixels",
    avatar: "https://i.pravatar.cc/150?img=45",
    lastMsg: "The N64 is amazing! Thanks!",
    time: "3h ago",
    unread: 0,
    product: {
      id: "n64-atomic-purple",
      name: "Nintendo 64 - Atomic Purple",
      price: "95€",
      img: "/images/n64.jpg",
    },
    history: [
      { type: "received", text: "The N64 is amazing! Thanks!", time: "3h ago" },
      { type: "sent", text: "Glad you like it! Enjoy your games!", time: "3h ago" },
    ],
  },
  {
    id: 5,
    name: "Pedro Games",
    avatar: "https://i.pravatar.cc/150?img=23",
    lastMsg: "Is the controller original?",
    time: "5h ago",
    unread: 1,
    product: {
      id: "nintendo-64-controller",
      name: "N64 Controller - Atomic Purple",
      price: "25€",
      img: "/images/controller.jpg",
    },
    history: [
      { type: "received", text: "Is the controller original?", time: "5h ago" },
      { type: "sent", text: "Yes, it's official Nintendo!", time: "4h ago" },
    ],
  },
  {
    id: 6,
    name: "Lucia RetroLover",
    avatar: "https://i.pravatar.cc/150?img=58",
    lastMsg: "Can you ship to Spain?",
    time: "1d ago",
    unread: 0,
    product: {
      id: "sega-genesis",
      name: "Sega Genesis Model 1",
      price: "75€",
      img: "/images/sega.jpg",
    },
    history: [
      { type: "received", text: "Can you ship to Spain?", time: "1d ago" },
      { type: "sent", text: "Yes, shipping to Spain is 12€ extra", time: "1d ago" },
    ],
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
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CONVERSATIONS_UPDATED_EVENT));
  }
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
