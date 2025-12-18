import "../styles/bricks/navbar.css";
import { useEffect, useState, useRef } from "react";
import { useRoute, Utils, Environment, useLanguage, Lsi, useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import { useConfirm } from "./ConfirmProvider.js";
import useUser from "../hooks/useUser.js";
import ContactModal from "./ContactModal.js";
import { Card, CardIcon } from "./atom/Card.js";
import OfficialShopPopup from "./OfficialShopPopup.js";

const LANGUAGES = [
  { code: "en", label: "EN", icon: "🇬🇧" },
  { code: "cz", label: "CZ", icon: "🇨🇿" },
  { code: "sk", label: "SK", icon: "🇸🇰" },
  { code: "de", label: "DE", icon: "🇩🇪" },
  { code: "pl", label: "PL", icon: "🇵🇱" },
  { code: "hu", label: "HU", icon: "🇭🇺" },
  { code: "ru", label: "RU", icon: "🇷🇺" },
  { code: "ja", label: "JA", icon: "🇯🇵" },
  { code: "zh", label: "ZH", icon: "🇨🇳" },
];

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("home");
  const [route, setRoute] = useRoute();
  const [user, setUser] = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isOfficialShopOpen, setIsOfficialShopOpen] = useState(false);
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("fontSize");
    return saved ? parseInt(saved, 10) : 100;
  });
  const [lang, setLang] = useLanguage();
  const { confirm } = useConfirm();
  const lsi = useLsi(importLsi, ["Navbar"]);
  const [avatar, setAvatar] = useState(null);
  const accountPopupRef = useRef(null);
  const mobileAccountRef = useRef(null);
  const langPopupRef = useRef(null);
  const settingsPopupRef = useRef(null);

  useEffect(() => {
    const updateAvatar = () => {
      if (user) {
        const stored = localStorage.getItem(`user_avatar_${user.id}`);
        setAvatar(stored);
      } else {
        setAvatar(null);
      }
    };

    // Update initially
    updateAvatar();

    window.addEventListener("avatarUpdated", updateAvatar);
    return () => window.removeEventListener("avatarUpdated", updateAvatar);
  }, [user]);

  // Handler to update route
  const handleCardClick = (newRoute) => {
    setActiveLink(newRoute);
    setRoute(newRoute);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: lsi.logoutConfirmTitle,
      message: lsi.logoutConfirmMessage,
      confirmText: lsi.logoutConfirm,
      cancelText: lsi.logoutCancel,
      danger: true,
    });

    if (confirmed) {
      setUser(null);
      localStorage.removeItem("player");
      setAvatar(null);
      setRoute("home");
    }
  };

  useEffect(() => {
    // Load language from localStorage
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      setLang(savedLang);
    }

    // Sync activeLink with the current route
    if (route.uu5Route) {
      setActiveLink(route.uu5Route);
    }
  }, [route]);

  // Close account popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDesktop = accountPopupRef.current && !accountPopupRef.current.contains(event.target);
      const isOutsideMobile = mobileAccountRef.current && !mobileAccountRef.current.contains(event.target);

      if (isOutsideDesktop && isOutsideMobile) {
        setIsAccountOpen(false);
      }
    };

    if (isAccountOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAccountOpen]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langPopupRef.current && !langPopupRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };

    if (isLangOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLangOpen]);

  // Close settings popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsPopupRef.current && !settingsPopupRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen]);

  // Apply font size to document
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem("fontSize", fontSize.toString());
  }, [fontSize]);

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
  };

  const handleLanguageChange = (lang) => {
    setLang(lang);
    localStorage.setItem("language", lang);
    setIsLangOpen(false);
  };

  if (route.uu5Route === "login") {
    // If the route is 'login', hide the navbar
    return null;
  }

  return (
    <div>
      {/* Mobile Header */}
      <div className="mobile-navbar">
        <div className="nav-logo-mobile" onClick={() => handleCardClick("home")}>
          <img src="../assets/MatchUPlogo.png" alt="MatchUP" />
        </div>

        <div className="mobile-controls">
          {user && (
            <div className="account-icon-wrapper mobile-account-icon" ref={mobileAccountRef}>
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="account-icon"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="account-icon"
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              )}

              {isAccountOpen && user && (
                <div className="account-popup mobile-account-popup">
                  <div className="account-popup-header">
                    <Lsi import={importLsi} path={["Navbar", "loggedInAs"]} />
                  </div>
                  <div className="account-popup-name">{user.name || user.username || "User"}</div>
                  <div className="account-popup-divider"></div>
                  <div
                    className="account-popup-item"
                    onClick={() => {
                      setActiveLink("home");
                      setIsAccountOpen(false);
                      setRoute("profile", { id: user.id });
                    }}
                  >
                    <span className="account-popup-icon">👤</span>
                    <Lsi import={importLsi} path={["Navbar", "profile"]} />
                  </div>
                  <div
                    className="account-popup-item"
                    onClick={() => {
                      setIsAccountOpen(false);
                      setIsOfficialShopOpen(true);
                    }}
                  >
                    <span className="account-popup-icon">🛒</span>
                    <Lsi import={importLsi} path={["Navbar", "shop"]} />
                  </div>
                  <div
                    className="account-popup-item"
                    onClick={() => {
                      setIsAccountOpen(false);
                      setIsSettingsOpen(true);
                    }}
                  >
                    <span className="account-popup-icon">🔤</span>
                    <Lsi import={importLsi} path={["Navbar", "fontSize"]} />
                  </div>
                  <div
                    className="account-popup-item"
                    onClick={() => {
                      setIsAccountOpen(false);
                      setIsContactOpen(true);
                    }}
                  >
                    <span className="account-popup-icon">❓</span>
                    <Lsi import={importLsi} path={["Navbar", "contactUs"]} />
                  </div>
                </div>
              )}
            </div>
          )}
          <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            <div className={`hamburger-icon ${isOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      {/* Cards Section */}
      <section className={`cards-section ${isOpen ? "mobile-open" : ""}`}>
        <div className="nav-logo-wrapper desktop-only" onClick={() => handleCardClick("home")}>
          <img src="../assets/MatchUPlogo.png" />
        </div>

        {/* Language Switcher (Desktop) */}
        <div className="language-selector-wrapper desktop-only" ref={langPopupRef}>
          <div className="lang-btn" onClick={() => setIsLangOpen(!isLangOpen)}>
            <span className="lang-icon">{LANGUAGES.find((l) => l.code === lang)?.icon || "🌐"}</span>
            <span className="lang-text">{LANGUAGES.find((l) => l.code === lang)?.label || lang.toUpperCase()}</span>
            <span className={`lang-arrow ${isLangOpen ? "open" : ""}`}>▼</span>
          </div>

          {isLangOpen && (
            <div className="lang-dropdown">
              {LANGUAGES.map((l) => (
                <div
                  key={l.code}
                  className={`lang-option ${lang === l.code ? "active" : ""}`}
                  onClick={() => handleLanguageChange(l.code)}
                >
                  <span className="lang-icon">{l.icon}</span> {l.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Icon (Desktop) */}
        {user && (
          <div className="account-icon-wrapper desktop-only" ref={accountPopupRef}>
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="account-icon"
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                onClick={() => setIsAccountOpen(!isAccountOpen)}
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="account-icon"
                onClick={() => setIsAccountOpen(!isAccountOpen)}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            )}

            {isAccountOpen && user && (
              <div className="account-popup">
                <div className="account-popup-header">
                  <Lsi import={importLsi} path={["Navbar", "loggedInAs"]} />
                </div>
                <div className="account-popup-name">{user.name || user.username || "User"}</div>
                <div className="account-popup-divider"></div>
                <div
                  className="account-popup-item"
                  onClick={() => {
                    setActiveLink("home");
                    setIsAccountOpen(false);
                    setRoute("profile", { id: user.id });
                  }}
                >
                  <span className="account-popup-icon">👤</span>
                  <Lsi import={importLsi} path={["Navbar", "profile"]} />
                </div>
                <div
                  className="account-popup-item"
                  onClick={() => {
                    setIsAccountOpen(false);
                    setIsOfficialShopOpen(true);
                  }}
                >
                  <span className="account-popup-icon">🛒</span>
                  <Lsi import={importLsi} path={["Navbar", "shop"]} />
                </div>
                <div
                  className="account-popup-item"
                  onClick={() => {
                    setIsAccountOpen(false);
                    setIsSettingsOpen(true);
                  }}
                >
                  <span className="account-popup-icon">🔤</span>
                  <Lsi import={importLsi} path={["Navbar", "fontSize"]} />
                </div>
                <div
                  className="account-popup-item"
                  onClick={() => {
                    setIsAccountOpen(false);
                    setIsContactOpen(true);
                  }}
                >
                  <span className="account-popup-icon">❓</span>
                  <Lsi import={importLsi} path={["Navbar", "contactUs"]} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Popup */}
        {isSettingsOpen && (
          <div className="settings-popup-overlay">
            <div className="settings-popup" ref={settingsPopupRef}>
              <div className="settings-popup-header">
                <span className="settings-popup-title">
                  <Lsi import={importLsi} path={["Navbar", "settings"]} />
                </span>
                <button className="settings-close-btn" onClick={() => setIsSettingsOpen(false)}>
                  ✕
                </button>
              </div>
              <div className="settings-popup-content">
                <div className="settings-item">
                  <label className="settings-label">
                    <Lsi import={importLsi} path={["Navbar", "fontSize"]} />
                  </label>
                  <div className="font-size-control">
                    <button
                      className="font-size-btn"
                      onClick={() => handleFontSizeChange(Math.max(50, fontSize - 10))}
                      disabled={fontSize <= 50}
                    >
                      A-
                    </button>
                    <span className="font-size-value">{fontSize}%</span>
                    <button
                      className="font-size-btn"
                      onClick={() => handleFontSizeChange(Math.min(150, fontSize + 10))}
                      disabled={fontSize >= 150}
                    >
                      A+
                    </button>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    step="10"
                    value={fontSize}
                    onChange={(e) => handleFontSizeChange(parseInt(e.target.value, 10))}
                    className="font-size-slider"
                  />
                  <div className="font-size-labels">
                    <span>
                      <Lsi import={importLsi} path={["Navbar", "fontSmall"]} />
                    </span>
                    <span>
                      <Lsi import={importLsi} path={["Navbar", "fontNormal"]} />
                    </span>
                    <span>
                      <Lsi import={importLsi} path={["Navbar", "fontLarge"]} />
                    </span>
                  </div>
                </div>
                <button className="settings-reset-btn" onClick={() => handleFontSizeChange(100)}>
                  <Lsi import={importLsi} path={["Navbar", "resetDefault"]} />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="cards-container">
          <Card type="navbar" className={activeLink === "home" ? "active" : ""} onClick={() => handleCardClick("home")}>
            <CardIcon>🏠</CardIcon>
            <h2>
              <Lsi import={importLsi} path={["Navbar", "home"]} />
            </h2>
          </Card>

          <Card
            type="navbar"
            className={activeLink === "tournaments" || activeLink === "tournamentDetail" ? "active" : ""}
            onClick={() => handleCardClick("tournaments")}
          >
            <CardIcon>🏆</CardIcon>
            <h2>
              <Lsi import={importLsi} path={["Navbar", "tournaments"]} />
            </h2>
          </Card>

          <Card
            type="navbar"
            className={activeLink === "history" ? "active" : ""}
            onClick={() => handleCardClick("history")}
          >
            <CardIcon>📜</CardIcon>
            <h2>
              <Lsi import={importLsi} path={["Navbar", "history"]} />
            </h2>
          </Card>

          <Card
            type="navbar"
            className={activeLink === "about" ? "active" : ""}
            onClick={() => handleCardClick("about")}
          >
            <CardIcon>👥</CardIcon>
            <h2>
              <Lsi import={importLsi} path={["Navbar", "about"]} />
            </h2>
          </Card>

          <Card
            type="navbar"
            className={`${user ? "card-logout" : ""} ${activeLink === "login" ? "active" : ""}`}
            onClick={user ? handleLogout : () => setRoute("login")}
          >
            <CardIcon>{user ? "🚪" : "🔑"}</CardIcon>
            <h2>
              <Lsi import={importLsi} path={user ? ["Navbar", "logout"] : ["Login", "login"]} />
            </h2>
          </Card>
        </div>
      </section>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <OfficialShopPopup isOpen={isOfficialShopOpen} onClose={() => setIsOfficialShopOpen(false)} user={user} />
    </div>
  );
}
