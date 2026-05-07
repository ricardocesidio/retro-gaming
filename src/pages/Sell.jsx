import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Sell.css";
import {
  publishMarketListing,
  readDraftListings,
  writeDraftListings,
  isStorageQuotaError,
} from "../utils/marketStorage";
import { useAuth } from "../App";

const formatFieldLabel = (name) => {
  const labels = {
    title: "Title",
    category: "Category",
    subCategory: "Subcategory",
    condition: "Condition",
    price: "Price",
    description: "Description",
    images: "Images",
    parcelSize: "Parcel size",
  };
  return labels[name] || name.charAt(0).toUpperCase() + name.slice(1);
};

const MIN_TITLE_CHARS = 3;
const MAX_TITLE_CHARS = 80;
const MIN_DESC_CHARS = 20;
const MAX_IMAGES = 10;
const IMAGE_MAX_SIDE = 1200;
const IMAGE_QUALITY = 0.7;
const DRAFT_MAX_IMAGES = 3;
const DRAFT_IMAGE_MAX_SIDE = 720;
const DRAFT_IMAGE_QUALITY = 0.55;
const MAX_DRAFT_COUNT = 6;

const validateTitle = (val) => {
  const value = String(val || "");
  if (value.trim().length === 0) return "Title is required.";
  const allowed = /^[\p{L}\p{N}\s.,'()\-]+$/u;
  if (!allowed.test(value)) {
    return "Only letters, numbers, spaces and basic punctuation are allowed.";
  }
  if (value.trim().length < MIN_TITLE_CHARS) {
    return `Title must be at least ${MIN_TITLE_CHARS} characters.`;
  }
  if (value.length > MAX_TITLE_CHARS) {
    return `Title must be at most ${MAX_TITLE_CHARS} characters.`;
  }
  return "";
};

const isDataImage = (value) =>
  typeof value === "string" && /^data:image\//i.test(String(value || "").trim());

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const compressStoredImage = async (
  src,
  maxSide = DRAFT_IMAGE_MAX_SIDE,
  quality = DRAFT_IMAGE_QUALITY
) => {
  if (!isDataImage(src) || typeof document === "undefined") return src;

  try {
    const img = await loadImage(src);
    const width = img.naturalWidth || img.width || 0;
    const height = img.naturalHeight || img.height || 0;
    const largestSide = Math.max(width, height);
    if (!largestSide || largestSide <= maxSide) return src;

    const scale = Math.min(1, maxSide / largestSide);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));

    const ctx = canvas.getContext("2d");
    if (!ctx) return src;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    try {
      return canvas.toDataURL("image/webp", quality);
    } catch {
      try {
        return canvas.toDataURL("image/jpeg", quality);
      } catch {
        return src;
      }
    }
  } catch {
    return src;
  }
};

const normalizeDraftImageList = (images = []) =>
  Array.from(
    new Set(
      (Array.isArray(images) ? images : [])
        .map((img) => String(img || "").trim())
        .filter(Boolean)
    )
  );

const buildDraftRecord = async ({
  title,
  category,
  subCategory,
  condition,
  price,
  description,
  parcelSize,
  images,
}) => {
  const compressedImages = await Promise.all(
    normalizeDraftImageList(images)
      .slice(0, DRAFT_MAX_IMAGES)
      .map((src) => compressStoredImage(src))
  );

  const cleanedImages = Array.from(new Set(compressedImages.filter(Boolean)));
  const hero = cleanedImages[0] || "";

  return {
    id: `draft-${Date.now()}`,
    title,
    category,
    subCategory,
    condition,
    price,
    description,
    parcelSize,
    image: hero,
    images: cleanedImages,
    isDraft: true,
    updatedAt: Date.now(),
  };
};

const saveDraftsSafely = (nextDrafts) => writeDraftListings(nextDrafts);
const loadStoredDrafts = () => readDraftListings();

const sanitizePriceInput = (value) => {
  const raw = String(value ?? "");
  if (!raw) return "";

  const cleaned = raw.replace(/[^\d.,]/g, "").replace(/,/g, ".");
  const parts = cleaned.split(".");

  if (parts.length === 1) return parts[0];
  return `${parts[0]}.${parts.slice(1).join("")}`;
};

const formatPriceValue = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const normalized = raw.replace(/,/g, ".");
  const num = Number(normalized);
  if (Number.isNaN(num) || num <= 0) return "";
  return num.toFixed(2);
};

export default function Sell() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [parcelSize, setParcelSize] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [publishHover, setPublishHover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishAttempted, setPublishAttempted] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const titleRef = useRef(null);
  const categoryRef = useRef(null);
  const subCategoryRef = useRef(null);
  const conditionRef = useRef(null);
  const priceRef = useRef(null);
  const descriptionRef = useRef(null);
  const imagesRef = useRef(null);
  const parcelSizeRef = useRef(null);

  const subCategories = {
    Consoles: [
      "3DO Interactive Multiplayer",
      "Amiga CD32",
      "Anbernic RG35XX",
      "Asus ROG Ally",
      "Atari 2600",
      "Atari 5200",
      "Atari Jaguar",
      "Ayaneo",
      "Commodore 64",
      "Game Boy",
      "Game Boy Advance",
      "GameCube",
      "Mega Drive/Genesis",
      "Miyoo Mini",
      "Neo Geo AES",
      "Nintendo 3DS",
      "Nintendo 64",
      "Nintendo DS",
      "Nintendo Entertainment System (NES)",
      "Nintendo Switch",
      "Nintendo Switch Lite",
      "Nintendo Switch OLED",
      "Nintendo Wii",
      "Nintendo Wii U",
      "Original Xbox",
      "PC Engine/TurboGrafx-16",
      "PlayStation 1",
      "PlayStation 2",
      "PlayStation 3",
      "PlayStation 4",
      "PlayStation 5",
      "PlayStation Portable (PSP)",
      "PlayStation Vita",
      "Powkiddy",
      "PSVR",
      "PSVR2",
      "Retroid Pocket",
      "Sega Dreamcast",
      "Sega Master System",
      "Sega Saturn",
      "Steam Deck",
      "Super Nintendo (SNES)",
      "Xbox 360",
      "Xbox One",
      "Xbox One S",
      "Xbox One X",
      "Xbox Series S",
      "Xbox Series X",
      "No brand indicated",
    ],
    Games: [
      "3DO Interactive Multiplayer",
      "Amiga CD32",
      "Atari 2600",
      "Atari 5200",
      "Atari Jaguar",
      "Atari Lynx",
      "ColecoVision",
      "Commodore 64",
      "Game Boy",
      "Game Boy Advance",
      "Game Boy Color",
      "GameCube",
      "Intellivision",
      "Mega Drive/Genesis",
      "N-Gage",
      "Neo Geo AES",
      "Neo Geo Pocket Color",
      "Nintendo 3DS",
      "Nintendo 64",
      "Nintendo DS",
      "Nintendo DS Lite",
      "Nintendo DSi",
      "Nintendo Entertainment System (NES)",
      "Nintendo Switch",
      "Nintendo Switch Lite",
      "Nintendo Switch OLED",
      "Nintendo Wii",
      "Nintendo Wii U",
      "Odyssey",
      "Original Xbox",
      "PC Engine/TurboGrafx-16",
      "PlayStation 1",
      "PlayStation 2",
      "PlayStation 3",
      "PlayStation 4",
      "PlayStation 5",
      "PlayStation Portable (PSP)",
      "PlayStation Vita",
      "Sega Dreamcast",
      "Sega Game Gear",
      "Sega Master System",
      "Sega Saturn",
      "Sega SG-1000",
      "Super Nintendo (SNES)",
      "Vectrex",
      "Virtual Boy",
      "Xbox 360",
      "Xbox One",
      "Xbox One S",
      "Xbox One X",
      "Xbox Series S",
      "Xbox Series X",
      "No brand indicated",
    ],
    Controllers: [
      "8BitDo Pro 2",
      "8BitDo SN30 Pro",
      "DualSense (PS5)",
      "DualSense Edge",
      "DualShock 4",
      "GameSir G8 Galileo",
      "Logitech F310",
      "NACON Revolution",
      "Nintendo Pro Controller",
      "PowerA Enhanced",
      "Razer Wolverine",
      "SteelSeries Stratus+",
      "Xbox Controller",
      "Xbox Elite Series 2",
      "No brand indicated",
    ],
    "Gaming Headsets": [
      "Corsair HS60",
      "Corsair HS70",
      "HyperX Cloud Alpha",
      "HyperX Cloud II",
      "JBL Quantum 400",
      "Logitech G Pro X",
      "Razer BlackShark V2",
      "Sony Pulse 3D",
      "SteelSeries Arctis 1",
      "SteelSeries Arctis 7",
      "Turtle Beach Stealth 600",
      "Turtle Beach Stealth 700",
      "No brand indicated",
    ],
    Simulators: [
      "Fanatec CSL DD",
      "Fanatec GT DD Pro",
      "Logitech G29",
      "Logitech G920",
      "MOZA R3",
      "MOZA R5",
      "PXN V900",
      "Thrustmaster T248",
      "Thrustmaster T300RS",
      "No brand indicated",
    ],
    "Virtual Reality": [
      "HTC Vive",
      "HTC Vive Pro",
      "Meta Quest 2",
      "Meta Quest 3",
      "Meta Quest Pro",
      "Oculus Rift S",
      "PSVR",
      "PSVR2",
      "Valve Index",
      "VR Accessories",
      "VR Controllers",
      "No brand indicated",
    ],
    Books: [
      "Artbooks",
      "D&D Dungeon Master's Guide",
      "D&D Monster Manual",
      "D&D Player's Handbook",
      "Graphic Novels",
      "Magic: The Gathering Rulebooks",
      "Manga",
      "Strategy Guides",
      "Warhammer Codex",
      "No brand indicated",
    ],
    "Trading Cards": [
      "Digimon TCG",
      "Disney Lorcana",
      "Flesh and Blood",
      "Magic: The Gathering",
      "Magic: The Gathering Commander",
      "One Piece TCG",
      "Pokémon TCG Booster Packs",
      "Pokémon TCG Elite Trainer Box",
      "Pokémon TCG Singles",
      "Yu-Gi-Oh! Booster Packs",
      "Yu-Gi-Oh! Structure Decks",
      "No brand indicated",
    ],
    Collectibles: [
      "amiibo Figures",
      "Bandai SH Figuarts",
      "Funko Pop Vinyls",
      "Good Smile Company",
      "Hot Toys 1/6 Scale",
      "LEGO Nintendo Sets",
      "LEGO Star Wars",
      "Nendoroid Figures",
      "S.H.Figuarts",
      "Statues",
      "Busts",
      "Display Cases",
      "No brand indicated",
    ],
    "Retro Arcade": [
      "Arcade Machines",
      "Arcade Sticks",
      "CRT Monitors",
      "Light Guns",
      "Mini Arcade Consoles",
      "Raspberry Pi Cases",
      "Retro Handhelds",
      "No brand indicated",
    ],
    Apparel: [
      "Backpacks",
      "Beanies",
      "Caps & Hats",
      "Hoodies",
      "Keychains",
      "Pin Badges",
      "Socks",
      "T-Shirts",
      "No brand indicated",
    ],
    "PC Gaming": [
      "CPUs & Processors",
      "GPUs & Graphics Cards",
      "Intel i7",
      "Mechanical Keyboards",
      "Gaming Mice",
      "Mouse Pads",
      "PC Cases",
      "RAM Memory",
      "SSD Drives",
      "No brand indicated",
    ],
    Tabletop: [
      "Board Games",
      "Card Games",
      "Dice Sets",
      "Dungeons & Dragons",
      "Miniatures",
      "Pathfinder RPG",
      "Playing Cards",
      "RPG Books",
      "Warhammer 40K",
      "No brand indicated",
    ],
    Accessories: [
      "Cables & Adapters",
      "Cartridges & Discs",
      "Cases & Skins",
      "Chargers",
      "Controller Grips",
      "Controller Skins",
      "Cooling Fans",
      "Docking Stations",
      "HDMI Cables",
      "Headset Stands",
      "Memory Cards",
      "Phone Mounts",
      "Screen Protectors",
      "USB Hubs",
      "No brand indicated",
    ],
  };

  const categories = Object.keys(subCategories);

  const shippingTiers = [
    { id: "100g-500g", label: "100g - 500g", color: "bronze", desc: "Cards, singles, small accessories", weightRange: "0.1-0.5kg" },
    { id: "500g-1kg", label: "500g - 1kg", color: "silver", desc: "Controllers, compact games", weightRange: "0.5-1kg" },
    { id: "1kg-2kg", label: "1kg - 2kg", color: "gold", desc: "Portable consoles, boxed games", weightRange: "1-2kg" },
    { id: "2kg-3kg", label: "2kg - 3kg", color: "pink", desc: "Modern consoles, medium bundles", weightRange: "2-3kg" },
    { id: "3kg-4kg", label: "3kg - 4kg", color: "bronze", desc: "Retro setups, heavier boxes", weightRange: "3-4kg" },
    { id: "4kg-5kg", label: "4kg - 5kg", color: "silver", desc: "Multiple items, larger bundles", weightRange: "4-5kg" },
    { id: "5kg-10kg", label: "5kg - 10kg", color: "gold", desc: "Large consoles, multiple boxes", weightRange: "5-10kg" },
    { id: "10kg-30kg", label: "10kg - 30kg", color: "pink", desc: "Bulky items, full setups", weightRange: "10-30kg" },
  ];

  const parcelPalette = {
    bronze: { border: "1px solid #CD7F32", background: "linear-gradient(135deg, rgba(205,127,50,0.14) 0%, rgba(0,0,0,0.2) 100%)", badgeBg: "rgba(205,127,50,0.18)", badgeText: "#CD7F32", heading: "#F2D8B8", shadow: "0 18px 40px rgba(205,127,50,0.16)", selectedShadow: "0 0 0 2px rgba(205,127,50,0.45), 0 18px 45px rgba(205,127,50,0.2)" },
    silver: { border: "1px solid #C0C0C0", background: "linear-gradient(135deg, rgba(192,192,192,0.12) 0%, rgba(0,0,0,0.2) 100%)", badgeBg: "rgba(192,192,192,0.18)", badgeText: "#C0C0C0", heading: "#F5F5F5", shadow: "0 18px 40px rgba(192,192,192,0.12)", selectedShadow: "0 0 0 2px rgba(192,192,192,0.42), 0 18px 45px rgba(192,192,192,0.18)" },
    gold: { border: "1px solid #FFD700", background: "linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(0,0,0,0.2) 100%)", badgeBg: "rgba(255,215,0,0.18)", badgeText: "#FFD700", heading: "#FFF0A6", shadow: "0 18px 40px rgba(255,215,0,0.14)", selectedShadow: "0 0 0 2px rgba(255,215,0,0.42), 0 18px 45px rgba(255,215,0,0.18)" },
    pink: { border: "1px solid #FF4FD8", background: "linear-gradient(135deg, rgba(255,79,216,0.12) 0%, rgba(0,0,0,0.2) 100%)", badgeBg: "rgba(255,79,216,0.18)", badgeText: "#FF4FD8", heading: "#FFD3F3", shadow: "0 18px 40px rgba(255,79,216,0.14)", selectedShadow: "0 0 0 2px rgba(255,79,216,0.4), 0 18px 45px rgba(255,79,216,0.18)" },
  };

  useEffect(() => {
    try {
      setDrafts(loadStoredDrafts());
    } catch {
      setDrafts([]);
    }
  }, []);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  }, []);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (touched.title) setErrors((prev) => ({ ...prev, title: validateTitle(val) }));
  };

  const handleTitleBlur = (e) => {
    setTouched((prev) => ({ ...prev, title: true }));
    setErrors((prev) => ({ ...prev, title: validateTitle(e.target.value) }));
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val);
    setSubCategory("");
    setErrors((prev) => ({ ...prev, category: "", subCategory: "" }));
  };

  const handleSubCategoryChange = (e) => {
    const val = e.target.value;
    setSubCategory(val);
    if (touched.subCategory) setErrors((prev) => ({ ...prev, subCategory: val.trim() ? "" : "Subcategory is required." }));
  };

  const handleConditionChange = (e) => {
    const val = e.target.value;
    setCondition(val);
    if (touched.condition) setErrors((prev) => ({ ...prev, condition: val.trim() ? "" : "Condition is required." }));
  };

  const handlePriceChange = (e) => {
    setPrice(sanitizePriceInput(e.target.value));
  };

  const handlePriceBlur = () => {
    setTouched((prev) => ({ ...prev, price: true }));
    const formatted = formatPriceValue(price);
    const finalValue = formatted || "0.00";
    setPrice(finalValue);
    const num = Number(finalValue);
    setErrors((prev) => ({
      ...prev,
      price: !finalValue || Number.isNaN(num) || num <= 0 ? "Price must be greater than 0." : "",
    }));
  };

  const handleDescriptionChange = (e) => {
    const val = e.target.value;
    setDescription(val);
    if (touched.description) {
      let err = "";
      if (!val.trim()) err = "Description is required.";
      else if (val.trim().length < MIN_DESC_CHARS) err = `Description needs at least ${MIN_DESC_CHARS} characters.`;
      setErrors((prev) => ({ ...prev, description: err }));
    }
  };

  const handleDescriptionBlur = () => {
    setTouched((prev) => ({ ...prev, description: true }));
    let err = "";
    if (!description.trim()) err = "Description is required.";
    else if (description.trim().length < MIN_DESC_CHARS) err = `Description needs at least ${MIN_DESC_CHARS} characters.`;
    setErrors((prev) => ({ ...prev, description: err }));
  };

  const handleFieldBlur = (name) => () => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldMap = { category, subCategory, condition };
    const val = fieldMap[name] ?? "";
    if (!String(val).trim()) {
      setErrors((prev) => ({ ...prev, [name]: `${formatFieldLabel(name)} is required.` }));
    }
  };

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const readAndCompressImage = async (file) => {
    const dataUrl = await readFileAsDataURL(file);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;
        const scale = Math.min(1, IMAGE_MAX_SIDE / Math.max(width, height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(dataUrl);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        try {
          resolve(canvas.toDataURL("image/webp", IMAGE_QUALITY));
        } catch {
          try {
            resolve(canvas.toDataURL("image/jpeg", IMAGE_QUALITY));
          } catch {
            resolve(dataUrl);
          }
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleFiles = async (files) => {
    const incoming = Array.from(files || []).filter((f) => f.type.startsWith("image/"));
    if (incoming.length === 0) return showToast("Please upload valid image files.", "error");
    if (incoming.length + images.length > MAX_IMAGES) return showToast(`Maximum ${MAX_IMAGES} images allowed!`, "error");
    try {
      const newPreviews = await Promise.all(
        incoming.map(async (file) => ({ file, preview: await readAndCompressImage(file) }))
      );
      setImages((prev) => [...prev, ...newPreviews]);
      setErrors((prev) => {
        const { images: _removed, ...rest } = prev;
        return rest;
      });
    } catch {
      showToast("Could not read one or more images.", "error");
    }
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    const titleError = validateTitle(title);
    if (titleError) newErrors.title = titleError;
    if (!category.trim()) newErrors.category = "Category is required.";
    if (!subCategory.trim()) newErrors.subCategory = "Subcategory is required.";
    if (!condition.trim()) newErrors.condition = "Condition is required.";
    const priceNum = parseFloat(price);
    if (!price || Number.isNaN(priceNum) || priceNum <= 0) newErrors.price = "Price must be greater than 0.";
    if (!description.trim()) newErrors.description = "Description is required.";
    else if (description.trim().length < MIN_DESC_CHARS) newErrors.description = `Description needs at least ${MIN_DESC_CHARS} characters.`;
    if (images.length === 0) newErrors.images = "Add at least 1 photo.";
    if (!parcelSize) newErrors.parcelSize = "Select a parcel size.";

    setTouched({
      title: true,
      category: true,
      subCategory: true,
      condition: true,
      price: true,
      description: true,
      images: true,
      parcelSize: true,
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstField = Object.keys(newErrors)[0];
      const refs = { title: titleRef, category: categoryRef, subCategory: subCategoryRef, condition: conditionRef, price: priceRef, description: descriptionRef, images: imagesRef, parcelSize: parcelSizeRef };
      refs[firstField]?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  }, [title, category, subCategory, condition, price, description, images, parcelSize]);

  const isFormValid =
    !validateTitle(title) &&
    !!category &&
    !!subCategory &&
    !!condition &&
    !!price &&
    !Number.isNaN(parseFloat(price)) &&
    parseFloat(price) > 0 &&
    description.trim().length >= MIN_DESC_CHARS &&
    images.length >= 1 &&
    !!parcelSize;

  const handleSaveDraft = async () => {
    const hasContent =
      title.trim() || category || subCategory || condition || price || description.trim() || images.length > 0 || parcelSize;

    if (!hasContent) return showToast("Add some content before saving a draft.", "error");

    try {
      const draft = await buildDraftRecord({
        title: title.trim(),
        category: category.trim(),
        subCategory: subCategory.trim(),
        condition: condition.trim(),
        price: price.trim(),
        description: description.trim(),
        parcelSize: parcelSize.trim(),
        images: images.map((i) => i.preview),
      });

      const existing = loadStoredDrafts();
      const updated = [draft, ...existing.filter((d) => String(d.id ?? "") !== draft.id)].slice(0, MAX_DRAFT_COUNT);
      const saved = saveDraftsSafely(updated);
      setDrafts(saved);
      showToast("Draft saved!");
    } catch (error) {
      const message = isStorageQuotaError(error?.cause || error)
        ? "Your browser storage is full. Try removing older drafts or fewer images."
        : "Could not save draft. Please try again.";
      showToast(message, "error");
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (isSubmitting) return;

    setPublishAttempted(true);
    if (!validateForm()) {
      showToast("Please fill in all highlighted fields before publishing.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const now = Date.now();
      const sellerName = user?.username || user?.name || "Anonymous";
      const sellerAvatar = user?.avatar || user?.profilePic || user?.profileImage || "";

      const newListing = {
        id: String(now),
        title: title.trim(),
        category: category.trim(),
        subCategory: subCategory.trim(),
        condition: condition.trim(),
        price: Number(parseFloat(price).toFixed(2)),
        description: description.trim(),
        parcelSize: parcelSize.trim(),
        weightRange: shippingTiers.find((t) => t.id === parcelSize)?.weightRange || "",
        image: images[0]?.preview || "",
        images: images.map((i) => i.preview),
        date: new Date(now).toISOString(),
        createdAt: now,
        publishedAt: now,
        status: "active",
        seller: sellerName,
        sellerAvatar,
        sellerId: user?.id || user?._id || user?.username || "",
      };

      const result = await publishMarketListing(newListing);
      if (!result?.ok) {
        if (isStorageQuotaError(result?.error)) {
          const trimmedDrafts = loadStoredDrafts()
            .map((draft) => ({
              ...draft,
              images: Array.isArray(draft.images) ? draft.images.slice(0, 1) : [],
              image: draft.image || draft.images?.[0] || "",
            }))
            .slice(0, 3);

          saveDraftsSafely(trimmedDrafts);
          const retry = await publishMarketListing(newListing);
          if (!retry?.ok) throw retry?.error || result?.error || new Error("Unable to persist the listing.");
        } else {
          throw result?.error || new Error("Unable to persist the listing.");
        }
      }

      showToast("Ad published to the Market!");
      await new Promise((resolve) => setTimeout(resolve, 900));
      navigate("/market", { replace: true, state: { publishedAt: now } });
    } catch (err) {
      const message =
        /quota|storage/i.test(String(err?.message || err?.cause?.message || ""))
          ? "Your browser storage is full. Try fewer or smaller images."
          : "Failed to publish. Please try again.";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sell-page">
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <i className={`fa-solid ${toast.type === "error" ? "fa-circle-exclamation" : "fa-circle-check"}`} />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="sell-container">
        <div className="sell-card">
          <header className="sell-header">
            <h1>Post Ad</h1>
            <p>List your items in the premium geek marketplace.</p>
          </header>

          <form className="sell-form" onSubmit={handleSubmit} noValidate>
            <div className="form-split-layout">
              <div className="form-left-col">
                <div className="form-group" ref={titleRef}>
                  <label htmlFor="sell-title">Ad Title *</label>
                  <input
                    id="sell-title"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    placeholder="Enter a clear, descriptive title"
                    name="title"
                    className={errors.title ? "input-error" : ""}
                    maxLength={MAX_TITLE_CHARS}
                  />
                  <div className="char-counter-inline">{title.length}/{MAX_TITLE_CHARS}</div>
                  {errors.title && <span className="error-text">{errors.title}</span>}
                </div>

                <div className="form-group" ref={categoryRef}>
                  <label htmlFor="sell-category">Category *</label>
                  <select
                    id="sell-category"
                    value={category}
                    onChange={handleCategoryChange}
                    onBlur={handleFieldBlur("category")}
                    name="category"
                    className={errors.category ? "input-error" : ""}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <span className="error-text">{errors.category}</span>}
                </div>

                <div className="form-group" ref={subCategoryRef}>
                  <label htmlFor="sell-subcategory">Subcategory *</label>
                  <select
                    id="sell-subcategory"
                    value={subCategory}
                    onChange={handleSubCategoryChange}
                    onBlur={handleFieldBlur("subCategory")}
                    disabled={!category}
                    name="subCategory"
                    className={errors.subCategory ? "input-error" : ""}
                  >
                    <option value="">Select</option>
                    {category && subCategories[category]?.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  {errors.subCategory && <span className="error-text">{errors.subCategory}</span>}
                </div>

                <div className="form-group" ref={priceRef}>
                  <label htmlFor="sell-price">Price (€) *</label>
                  <input
                    id="sell-price"
                    type="text"
                    inputMode="decimal"
                    value={price}
                    onChange={handlePriceChange}
                    onBlur={handlePriceBlur}
                    placeholder="Ex: 149.99"
                    name="price"
                    autoComplete="off"
                    className={errors.price ? "input-error" : ""}
                  />
                  {errors.price && <span className="error-text">{errors.price}</span>}
                </div>

                <div className="form-group" ref={conditionRef}>
                  <label htmlFor="sell-condition">Condition *</label>
                  <select
                    id="sell-condition"
                    value={condition}
                    onChange={handleConditionChange}
                    onBlur={handleFieldBlur("condition")}
                    name="condition"
                    className={errors.condition ? "input-error" : ""}
                  >
                    <option value="">Select Condition</option>
                    <option value="new">New (sealed)</option>
                    <option value="like-new">Like new</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="for-parts">For parts</option>
                  </select>
                  {errors.condition && <span className="error-text">{errors.condition}</span>}
                </div>
              </div>

              <div className="form-right-col">
                <div className="desc-group" ref={descriptionRef}>
                  <label htmlFor="sell-description">Description *</label>
                  <textarea
                    id="sell-description"
                    value={description}
                    onChange={handleDescriptionChange}
                    onBlur={handleDescriptionBlur}
                    placeholder="Detail the condition, history and what is included..."
                    maxLength={1000}
                    name="description"
                    className={errors.description ? "input-error" : ""}
                  />
                  <div className="char-counter">
                    {description.length}/1000 characters
                    {description.trim().length > 0 &&
                      description.trim().length < MIN_DESC_CHARS && (
                        <span className="char-counter-hint">
                          {" "}
                          ({MIN_DESC_CHARS - description.trim().length} more needed)
                        </span>
                      )}
                  </div>
                  {errors.description && <span className="error-text">{errors.description}</span>}
                </div>
              </div>
            </div>

            <div className="form-group upload-section" ref={imagesRef}>
              <label>Images (max {MAX_IMAGES}) *</label>
              <div
                className={`upload-area ${dragActive ? "drag-active" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  handleFiles(e.dataTransfer.files);
                }}
              >
                <i className="fa-solid fa-cloud-arrow-up upload-icon" />
                <p>Drag images or click to select</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFiles(e.target.files)}
                  id="image-upload"
                  hidden
                />
                <label htmlFor="image-upload" className="upload-btn">
                  Upload Photos
                </label>
              </div>

              <div className="upload-grid">
                {images.map((img, index) => (
                  <div key={index} className="preview-item">
                    <img src={img.preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                      aria-label={`Remove image ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {errors.images && <span className="error-text">{errors.images}</span>}
            </div>

            <div className="parcel-size-section" ref={parcelSizeRef}>
              <h2>Select Your Parcel Size</h2>
              <p className="parcel-subtitle">Choose the exact range for precise shipping.</p>

              <div className="parcel-divider">
                <span>Small Parcels</span>
              </div>

              <div className="parcel-options">
                {shippingTiers.slice(0, 4).map((tier) => {
                  const theme = parcelPalette[tier.color];
                  const selected = parcelSize === tier.id;

                  return (
                    <div
                      key={tier.id}
                      className={`parcel-card border-${tier.color} ${selected ? "selected" : ""}`}
                      onClick={() => {
                        setParcelSize(tier.id);
                        setErrors((p) => ({ ...p, parcelSize: "" }));
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setParcelSize(tier.id);
                      }}
                      aria-pressed={selected}
                      style={{
                        border: theme.border,
                        background: theme.background,
                        boxShadow: selected ? theme.selectedShadow : theme.shadow,
                        transform: selected ? "translateY(-2px)" : "translateY(0)",
                      }}
                    >
                      <div
                        className={`weight-badge badge-${tier.color}`}
                        style={{ background: theme.badgeBg, color: theme.badgeText }}
                      >
                        {tier.label}
                      </div>
                      <h3 style={{ color: theme.heading }}>{tier.label}</h3>
                      <p>{tier.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="parcel-divider">
                <span>Heavy Parcels</span>
              </div>

              <div className="parcel-options">
                {shippingTiers.slice(4).map((tier) => {
                  const theme = parcelPalette[tier.color];
                  const selected = parcelSize === tier.id;

                  return (
                    <div
                      key={tier.id}
                      className={`parcel-card border-${tier.color} ${selected ? "selected" : ""}`}
                      onClick={() => {
                        setParcelSize(tier.id);
                        setErrors((p) => ({ ...p, parcelSize: "" }));
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setParcelSize(tier.id);
                      }}
                      aria-pressed={selected}
                      style={{
                        border: theme.border,
                        background: theme.background,
                        boxShadow: selected ? theme.selectedShadow : theme.shadow,
                        transform: selected ? "translateY(-2px)" : "translateY(0)",
                      }}
                    >
                      <div
                        className={`weight-badge badge-${tier.color}`}
                        style={{ background: theme.badgeBg, color: theme.badgeText }}
                      >
                        {tier.label}
                      </div>
                      <h3 style={{ color: theme.heading }}>{tier.label}</h3>
                      <p>{tier.desc}</p>
                    </div>
                  );
                })}
              </div>

              {errors.parcelSize && <span className="error-text">{errors.parcelSize}</span>}
            </div>

              <div className="form-actions-container">
                <button type="button" onClick={handleSaveDraft} className="btn-save-draft">
                  Save Draft
                </button>

                <button
                  type="submit"
                  className={`btn-publish-ad ${!isFormValid ? "btn-publish-disabled" : ""}`}
                  disabled={isSubmitting}
                  aria-disabled={!isFormValid || isSubmitting}
                  onMouseEnter={() => setPublishHover(true)}
                  onMouseLeave={() => setPublishHover(false)}
                  style={
                    publishHover && isFormValid && !isSubmitting
                      ? { background: "#FFD700", color: "#000", borderColor: "#FFD700" }
                      : undefined
                  }
                  aria-label="Publish your ad to the marketplace"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }} />
                      <span>Publishing…</span>
                    </>
                  ) : (
                    <span>Publish Ad</span>
                  )}
                </button>

                <button
                  type="button"
                  className="btn-publish-auction"
                  disabled={!isFormValid || isSubmitting}
                  onClick={() => navigate("/auction")}
                  aria-label="Publish in Auction"
                >
                  <i className="fa-solid fa-gavel" style={{ marginRight: 8 }} />
                  <span>Publish in Auction</span>
                </button>
              </div>

              {!isFormValid && publishAttempted && (
                <div className="publish-hint publish-hint-warning" role="status" aria-live="polite">
                  <i className="fa-solid fa-circle-info" style={{ marginRight: 6 }} />
                  Fill in all required fields to publish the listing.
                </div>
              )}

              {isFormValid && !isSubmitting && (
                <div className="publish-hint" role="status" aria-live="polite" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: -8 }}>
                  <i className="fa-solid fa-circle-check" style={{ marginRight: 6, color: 'var(--success)' }} />
                  All fields complete — ready to publish!
                </div>
              )}
          </form>

          {drafts.length > 0 && (
            <div className="drafts-section">
              <h3>Drafts ({drafts.length})</h3>
              <div className="drafts-list">
                {drafts.slice(0, 3).map((draft) => (
                  <div key={draft.id} className="draft-item">
                    {draft.title || "Untitled Draft"} —{" "}
                    {new Date(draft.updatedAt).toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 