// Mock user data generator — deterministic per username
// Provides unique avatars, bios, reviews, listings for every user

const hashStr = (str, seed = 0) => {
  let h = seed;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

const pick = (arr, index) => arr[index % arr.length];

const pool = {
  countries: ["Portugal", "Spain", "France", "Italy", "Germany", "United Kingdom", "Netherlands", "Sweden", "Brazil", "Japan"],
  bios: [
    "Retro collector since 1998. Specializing in Nintendo handhelds and rare cartridges.",
    "Passionate about vintage gaming. I restore and sell authentic retro consoles.",
    "PS2 and GameCube era enthusiast. All items tested and cleaned before shipping.",
    "Retro gaming is my life. Fast shipping, honest descriptions, no reproductions.",
    "Collecting since childhood. Now sharing the joy with other retro fans worldwide.",
    "Console modder and restorer. Every item gets a full clean and test before listing.",
    "SEGA fanatic since the Genesis days. Authentic hardware only, no clones.",
    "Vintage game cartridge specialist. All items are original and in great condition.",
    "Gaming nostalgia curator. I find, restore, and sell the best retro gems.",
    "Retro marketplace veteran. Hundreds of happy buyers. Quality guaranteed.",
  ],
  bannerColors: ["#1a0a2e", "#16213e", "#1b0a1a", "#0a2e1a", "#2e1a0a", "#0a1a2e", "#1a1a2e", "#2e0a1a", "#0a2e2e", "#2e2e0a"],
  allReviewers: [
    "RetroKing", "PixelHunter", "GameMaster99", "ConsoleQueen", "BossFighter",
    "ArcadeWizard", "NostalgiaPro", "VintagePlayer", "CartridgeKing", "BitBlaster",
    "SpeedRunnerX", "MegaFanatic", "ClassicGamer", "GoldJoystick", "LevelUpPro",
    "PowerUpDude", "ResetButton", "HighScoreBen", "TurboMode", "ScreenSaver",
    "CRT_Lover", "DiskReader", "ROM_Collector", "JoystickJedi", "ButtonMasher",
    "SpawnPoint", "GameGenieX", "TokenMaster", "BossRush", "InsertCoin",
  ],
  listingPools: [
    [
      { title: "GameBoy Advance SP", price: "95€", category: "Consoles", status: "active" },
      { title: "Pokémon Emerald", price: "55€", category: "Games", status: "active" },
      { title: "Nintendo DS Lite", price: "45€", category: "Consoles", status: "active" },
      { title: "Zelda Minish Cap", price: "65€", category: "Games", status: "sold" },
      { title: "GameBoy Micro", price: "120€", category: "Consoles", status: "sold" },
    ],
    [
      { title: "PS2 Slim Silver", price: "75€", category: "Consoles", status: "active" },
      { title: "GTA San Andreas", price: "18€", category: "Games", status: "active" },
      { title: "DualShock 2 Black", price: "22€", category: "Accessories", status: "active" },
      { title: "Final Fantasy X", price: "15€", category: "Games", status: "sold" },
      { title: "PS2 Memory Card 8MB", price: "8€", category: "Accessories", status: "active" },
    ],
    [
      { title: "GameCube Indigo", price: "85€", category: "Consoles", status: "active" },
      { title: "Mario Kart Double Dash", price: "45€", category: "Games", status: "active" },
      { title: "WaveBird Controller", price: "38€", category: "Accessories", status: "sold" },
      { title: "Zelda Wind Waker", price: "55€", category: "Games", status: "active" },
      { title: "GameCube Memory Card", price: "12€", category: "Accessories", status: "sold" },
    ],
    [
      { title: "Nintendo 64 Console", price: "90€", category: "Consoles", status: "active" },
      { title: "Super Mario 64", price: "35€", category: "Games", status: "active" },
      { title: "GoldenEye 007", price: "25€", category: "Games", status: "sold" },
      { title: "N64 Controller Grey", price: "20€", category: "Accessories", status: "active" },
      { title: "Zelda Ocarina of Time", price: "45€", category: "Games", status: "active" },
    ],
    [
      { title: "Sega Genesis Model 1", price: "80€", category: "Consoles", status: "active" },
      { title: "Sonic the Hedgehog 2", price: "20€", category: "Games", status: "active" },
      { title: "Street Fighter II", price: "28€", category: "Games", status: "sold" },
      { title: "Genesis 6-Button Pad", price: "25€", category: "Accessories", status: "active" },
      { title: "Mortal Kombat II", price: "18€", category: "Games", status: "sold" },
    ],
    [
      { title: "SNES Console", price: "100€", category: "Consoles", status: "active" },
      { title: "Super Mario World", price: "30€", category: "Games", status: "active" },
      { title: "Donkey Kong Country", price: "28€", category: "Games", status: "sold" },
      { title: "SNES Controller", price: "22€", category: "Accessories", status: "active" },
      { title: "Zelda Link to the Past", price: "50€", category: "Games", status: "active" },
    ],
  ],
  reviewTexts: [
    "Amazing seller! Fast shipping and item exactly as described.",
    "Very professional. Would buy again without hesitation.",
    "Item arrived in perfect condition. Highly recommended!",
    "Great communication throughout the whole process.",
    "Packaged with extreme care. The item looks brand new.",
    "Fair price and quick delivery. Definitely coming back.",
    "Shipped internationally and arrived in just 4 days. Impressive!",
    "Exactly what I was looking for. Great condition, honest seller.",
    "Smooth transaction from start to finish. Trusted seller.",
    "The item was even better than the photos. Very happy!",
    "Quick responses and very helpful. Perfect transaction.",
    "A true retro gaming expert. Items are always authentic.",
    "Best packaging I've ever seen. Console arrived pristine.",
    "Seller answered all my questions patiently. Great experience.",
    "My go-to seller for retro games. Never disappointed.",
  ],
  joinDates: ["Jan 2023", "Mar 2022", "Jun 2024", "Sep 2021", "Nov 2023", "Feb 2022", "Aug 2024", "Apr 2021", "Jul 2023", "Dec 2022"],
};

export const generateAvatar = (username) => {
  const initials = (username || "??").slice(0, 2).toUpperCase();
  const colorIndex = hashStr(username, 0) % 360;
  const hue1 = (colorIndex) % 360;
  const hue2 = (hue1 + 40) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
    <rect width="256" height="256" rx="128" fill="hsl(${hue1},60%,18%)"/>
    <circle cx="128" cy="102" r="46" fill="hsl(${hue2},55%,55%)" opacity="0.92"/>
    <path d="M48 220c12-44 50-70 80-70s68 26 80 70" fill="hsl(${hue2},55%,55%)" opacity="0.92"/>
    <text x="128" y="30" text-anchor="middle" fill="#fff" font-family="Arial" font-size="20" font-weight="700">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const getReviewRating = (username, reviewerName) => {
  // Deterministic review rating 3-5 based on both usernames
  const h = hashStr(username + reviewerName, 7);
  const base = (h % 30) / 10; // 0.0 - 2.9
  return Math.max(3, Math.min(5, Math.round(3 + base)));
};

export const getMockUser = (username) => {
  if (!username) return null;
  const h = hashStr(username, 1);
  const name = String(username).trim();

  return {
    id: name.toLowerCase(),
    username: name,
    name,
    avatar: generateAvatar(name),
    profilePic: null,
    profileImage: null,
    about: pick(pool.bios, h),
    country: pick(pool.countries, hashStr(name, 2)),
    createdAt: pick(pool.joinDates, hashStr(name, 3)),
    bannerColor: pick(pool.bannerColors, hashStr(name, 4)),
    tier: null,
  };
};

export const getMockReviews = (username) => {
  if (!username) return [];
  const h = hashStr(username, 5);
  const count = 5 + (h % 5); // 5-9 reviews
  const selectedReviewers = [];
  const usedIndices = new Set();

  for (let i = 0; i < count; i++) {
    const idx = hashStr(username + i, 10) % pool.allReviewers.length;
    if (!usedIndices.has(idx)) {
      usedIndices.add(idx);
      selectedReviewers.push(pool.allReviewers[idx]);
    }
  }

  return selectedReviewers.slice(0, count).map((reviewer, i) => ({
    id: hashStr(username + reviewer, 6),
    name: reviewer,
    text: pick(pool.reviewTexts, hashStr(username + reviewer, 8)),
    gems: getReviewRating(username, reviewer),
    country: pick(pool.countries, hashStr(reviewer, 9)),
  }));
};

export const getMockListings = (username) => {
  if (!username) return [];
  const h = hashStr(username, 11);
  const poolIdx = h % pool.listingPools.length;
  const listings = pool.listingPools[poolIdx].map((item) => ({
    ...item,
    id: `${username.toLowerCase()}-${item.title.toLowerCase().replace(/\s+/g, "-")}`,
    seller: username,
    image: "",
    images: [],
    description: `Authentic retro ${item.category.toLowerCase().slice(0, -1)} — ${item.title}`,
    condition: pick(["Mint", "Excellent", "Very Good", "Good"], h + poolIdx),
    createdAt: Date.now() - (h * 86400000) % (90 * 86400000),
    price: typeof item.price === "string" ? parseFloat(item.price.replace("€", "")) : item.price,
  }));
  return listings;
};

// Aggregate mock user data — full profile object for Profile.jsx
export const getMockUserProfile = (username) => {
  const user = getMockUser(username);
  if (!user) return null;
  const reviews = getMockReviews(username);
  const listings = getMockListings(username);
  const activeListings = listings.filter((l) => l.status === "active");
  const soldListings = listings.filter((l) => l.status === "sold");
  const totalRating = reviews.reduce((s, r) => s + r.gems, 0);
  const avgRating = reviews.length > 0 ? totalRating / reviews.length : 5.0;

  return {
    ...user,
    // Seller stats
    stats: {
      totalListings: listings.length,
      soldItems: soldListings.length,
      activeItems: activeListings.length,
      reviewsCount: reviews.length,
      rating: Math.round(avgRating * 10) / 10,
      itemsListed: activeListings.length,
    },
    // For Profile.jsx review slider
    reviews,
    // For listings grid
    listings: activeListings,
    soldListings,
    // Follower counts
    followers: 50 + hashStr(username, 20) % 500,
    following: 20 + hashStr(username, 21) % 200,
  };
};
