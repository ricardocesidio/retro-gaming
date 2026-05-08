// src/pages/Settings.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Settings.css";
import { DEFAULT_AVATAR_FALLBACK } from "../utils/fallbackImage";

const countries = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda",
  "Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain",
  "Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan",
  "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria",
  "Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada",
  "Central African Republic","Chad","Chile","China","Colombia","Comoros",
  "Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark",
  "Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador",
  "Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji",
  "Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece",
  "Grenada","Guatemala","Guinea","Guyana","Haiti","Honduras","Hungary",
  "Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
  "Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait",
  "Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya",
  "Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia",
  "Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova",
  "Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia",
  "Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria",
  "North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Panama",
  "Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia",
  "Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe",
  "Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore",
  "Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea",
  "South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland",
  "Syria","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga",
  "Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda",
  "Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay",
  "Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen",
  "Zambia","Zimbabwe",
];

const sortedCountries = [...countries].sort((a, b) => a.localeCompare(b));

const EMAIL_CHANGE_LIMIT = 2;

export default function Settings() {
  const { user, updateGlobalUser } = useAuth();

  // ─── Derive the stored avatar from any of the possible field names ──────
  const storedAvatar = user?.avatar || user?.profilePic || user?.profileImage || DEFAULT_AVATAR_FALLBACK;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    about: "",
    country: "Portugal",
    language: "English",
    avatar: DEFAULT_AVATAR_FALLBACK,
  });

  const [isSaving,                  setIsSaving]                  = useState(false);
  const [saveSuccess,               setSaveSuccess]               = useState(false);
  const [usernameError,             setUsernameError]             = useState("");
  const [showUsernameInfo,          setShowUsernameInfo]          = useState(false);
  const [showEmailInfo,             setShowEmailInfo]             = useState(false);
  const [emailChangeError,          setEmailChangeError]          = useState("");
  const [emailChangeSuccess,        setEmailChangeSuccess]        = useState("");
  const [isEmailConfirmationSending,setIsEmailConfirmationSending]= useState(false);

  // username change lock — set to true when backend integration is ready
  const canChangeUsernameThisMonth = false;

  const emailChangeCount    = user?.emailChangeCount || 0;
  const hasReachedEmailLimit = emailChangeCount >= EMAIL_CHANGE_LIMIT;

  // ─── Sync form whenever the user object changes ──────────────────────────
  useEffect(() => {
    if (!user) return;
    setFormData({
      username: user.username || "",
      email:    user.email    || "",
      about:    user.about    || "",
      country:  user.country  || "Portugal",
      language: user.language || "English",
      // Read from any possible field name
      avatar: user.avatar || user.profilePic || user.profileImage || DEFAULT_AVATAR_FALLBACK,
    });
    setUsernameError("");
    setShowUsernameInfo(false);
    setShowEmailInfo(false);
    setEmailChangeError("");
    setEmailChangeSuccess("");
  }, [user]);

  if (!user) return null;

  // ─── Character count for bio ─────────────────────────────────────────────
  const charCount = formData.about.length;
  const MAX_ABOUT_CHARS = 1000;

  // ─── Validators ──────────────────────────────────────────────────────────
  const validateUsername = (value) => {
    if (!value || value.trim() === "") return "The username is required.";
    if (value.length < 5)  return "The username must be at least 5 characters.";
    if (value.length > 15) return "The username must be at most 15 characters.";
    if (!/^[a-z0-9]+$/.test(value))
      return "The username can only contain lowercase letters and numbers (no spaces, accents or symbols).";
    return null;
  };

  const validateEmail = (value) => {
    if (!value || value.trim() === "") return "The email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email address.";
    return null;
  };

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleUsernameChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, username: val }));
    const formatError = validateUsername(val);
    if (formatError) {
      setUsernameError(formatError);
    } else if (val !== user.username && !canChangeUsernameThisMonth) {
      setUsernameError(
        "You have already changed your username this month. You can only change it once per month and only if you have no active shipments or deliveries in progress."
      );
    } else {
      setUsernameError("");
    }
  };

  const handleEmailChange = (e) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
    setEmailChangeError("");
    setEmailChangeSuccess("");
  };

  // ─── FIXED: handleImageChange is now INSIDE the component ────────────────
  // BUG WAS: it was defined after the return statement (outside the component
  // body) so it captured stale closure values for `user`, `setFormData` and
  // `updateGlobalUser`. Moving it here gives it a fresh, live closure.
  // FIXED: handleImageChange only updates LOCAL form preview.
  // The global user (and header avatar) is only updated on "Update Profile" click.
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      // Only update local form state — header avatar does NOT change yet.
      setFormData((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (charCount > MAX_ABOUT_CHARS) return;

    const formatError = validateUsername(formData.username);
    if (formatError) { setUsernameError(formatError); return; }

    if (formData.username !== user.username && !canChangeUsernameThisMonth) {
      setUsernameError(
        "You have already changed your username this month. You can only change it once per month and only if you have no active shipments or deliveries in progress."
      );
      return;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) { setEmailChangeError(emailError); return; }

    const isEmailChanging = formData.email !== user.email;
    if (isEmailChanging && hasReachedEmailLimit) {
      setEmailChangeError(
        "You have reached the maximum of 2 email changes. For security reasons, further changes are not allowed."
      );
      return;
    }

    setIsSaving(true);
    setEmailChangeError("");
    setEmailChangeSuccess("");
    setIsEmailConfirmationSending(false);

    setTimeout(() => {
      const nextEmailChangeCount =
        isEmailChanging && !hasReachedEmailLimit
          ? emailChangeCount + 1
          : emailChangeCount;

      // ─── FIXED: also persist `avatar` so Header reads the right field ────
      updateGlobalUser({
        ...user,
        ...formData,
        avatar:           formData.avatar,
        profilePic:       formData.avatar, // backward-compat
        emailChangeCount: nextEmailChangeCount,
      });

      setIsSaving(false);
      setSaveSuccess(true);

      if (isEmailChanging) {
        setIsEmailConfirmationSending(true);
        setTimeout(() => {
          setIsEmailConfirmationSending(false);
          setEmailChangeSuccess(
            "A confirmation email has been sent to your new address. Please check your inbox."
          );
        }, 600);
      }

      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="settings-wrapper">
      <div className="settings-glass-card">
        <header className="settings-v2-header">
          <div className="header-badge">ACCOUNT SYSTEM v2.0</div>
          <h1>USER SETTINGS</h1>
          <p>Customize your presence in the Vault</p>
        </header>

        <form onSubmit={handleSave} className="settings-v2-form">
          {/* ── Avatar upload ── */}
          <div className="avatar-section-v2">
            <div className="avatar-container">
              <img
                src={formData.avatar}
                alt="Avatar"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_AVATAR_FALLBACK;
                }}
              />
              <label htmlFor="upload-photo" className="edit-overlay" title="Change profile picture">
                <i className="fa-solid fa-pen" />
              </label>
              <input
                type="file"
                id="upload-photo"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <p className="avatar-hint">Click the pencil to change your profile picture</p>
          </div>

          {/* ── Banners ── */}
          {emailChangeError && (
            <div className="settings-banner settings-banner-error">{emailChangeError}</div>
          )}
          {emailChangeSuccess && (
            <div className="settings-banner settings-banner-success">{emailChangeSuccess}</div>
          )}
          {isEmailConfirmationSending && (
            <div className="settings-banner settings-banner-info">
              <i className="fa-solid fa-spinner fa-spin" /> Sending confirmation email…
            </div>
          )}

          <div className="form-grid-v2">
            {/* USERNAME */}
            <div className="input-box-v2">
              <label className="input-label-group">
                <div className="label-left-side">
                  <span>USERNAME</span>
                  <button
                    type="button"
                    onClick={() => setShowUsernameInfo(!showUsernameInfo)}
                    className="username-info-button"
                    title="Username change rules"
                  >
                    <i className="fa-solid fa-info-circle" />
                  </button>
                </div>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={handleUsernameChange}
                placeholder="Enter username"
                maxLength={15}
              />
              {usernameError && <p className="username-error-text">{usernameError}</p>}
              {showUsernameInfo && (
                <div className="username-info-box">
                  You can change your username only once per month and only if you have no active
                  shipments or deliveries in progress.
                  <br />
                  <span className="username-info-hint">
                    (This restriction will be fully enforced by the backend)
                  </span>
                </div>
              )}
            </div>

            {/* EMAIL */}
            <div className="input-box-v2">
              <label className="input-label-group">
                <div className="label-left-side">
                  <span>EMAIL ADDRESS</span>
                  <button
                    type="button"
                    onClick={() => setShowEmailInfo(!showEmailInfo)}
                    className="username-info-button"
                    title="Email change rules"
                  >
                    <i className="fa-solid fa-info-circle" />
                  </button>
                </div>
                <span className="input-subtext">
                  {hasReachedEmailLimit
                    ? "Change limit reached (2/2)"
                    : `Changes used: ${emailChangeCount}/${EMAIL_CHANGE_LIMIT}`}
                </span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={handleEmailChange}
                placeholder="Enter email"
                disabled={hasReachedEmailLimit}
              />
              {showEmailInfo && (
                <div className="username-info-box">
                  You can change your email address only twice. For security reasons, further changes
                  will require manual support.
                  <br />
                  <span className="username-info-hint">
                    (This restriction will be fully enforced by the backend)
                  </span>
                </div>
              )}
            </div>

            {/* ABOUT */}
            <div className="input-box-v2 full-width">
              <label className="input-label-group">
                <span className="label-left-side">
                  <span>ABOUT YOU</span>
                </span>
                <span className={`counter ${charCount > MAX_ABOUT_CHARS ? "limit-error" : ""}`}>
                  {charCount}/{MAX_ABOUT_CHARS} characters
                </span>
              </label>
              <textarea
                rows="4"
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                placeholder="Write your collector bio…"
                maxLength={MAX_ABOUT_CHARS}
              />
            </div>

            {/* COUNTRY */}
            <div className="input-box-v2">
              <label>COUNTRY</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              >
                {sortedCountries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* LANGUAGE */}
            <div className="input-box-v2">
              <label>LANGUAGE</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              >
                <option value="English">English</option>
                <option value="Portuguese">Português</option>
                <option value="Spanish">Español</option>
              </select>
            </div>
          </div>

          <div className="settings-v2-actions">
            <button
              type="submit"
              className={`btn-v2-save ${saveSuccess ? "success" : ""}`}
              disabled={isSaving || charCount > MAX_ABOUT_CHARS}
            >
              {isSaving ? (
                <><i className="fa-solid fa-spinner fa-spin" /> SYNCING…</>
              ) : saveSuccess ? (
                <><i className="fa-solid fa-check" /> CHANGES SAVED!</>
              ) : (
                <><i className="fa-solid fa-floppy-disk" /> UPDATE PROFILE</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
