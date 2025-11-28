import "../styles/navbar.css";
import { useEffect, useState } from "react";
import { useRoute, Utils, Environment, useLanguage, Lsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";

const LANGUAGES = [
  { code: "en", label: "EN", icon: "🇬🇧" },
  { code: "cz", label: "CZ", icon: "🇨🇿" },
  { code: "sk", label: "SK", icon: "🇸🇰" },
  { code: "uk", label: "UK", icon: "🇺🇦" },
  { code: "de", label: "DE", icon: "🇩🇪" },
  { code: "pl", label: "PL", icon: "🇵🇱" },
  { code: "hu", label: "HU", icon: "🇭🇺" },
  { code: "ru", label: "RU", icon: "🇷🇺" },
  { code: "ja", label: "JA", icon: "🇯🇵" },
  { code: "zh", label: "ZH", icon: "🇨🇳" }
];

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("home");
  const [route, setRoute] = useRoute();
  const [user, setUser] = useState(); // Initialize user from mock state
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [lang, setLang] = useLanguage();

  // Handler to update route
  const handleCardClick = (newRoute) => {
    setActiveLink(newRoute)
    setRoute(newRoute);
    setIsOpen(false); // Close mobile menu when a card is clicked
  };

  const handleLogout = () => {
    localStorage.removeItem("player");
    setRoute("home");
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("player"));
    setUser(user);

    // if (!user) {
    //   setRoute("login");
    //   return;
    // }

    // Load language from localStorage (only on mount)
    if (!route.uu5Route) {
      const savedLang = localStorage.getItem("language");
      if (savedLang) {
        setLang(savedLang);
      }
    }

    // Sync activeLink with the current route
    if (route.uu5Route) {
      setActiveLink(route.uu5Route);
    }
  }, [route]);

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
        <div className="nav-logo-mobile" onClick={() => handleCardClick('home')}>
          <img src="../assets/MatchUPlogo.png" alt="MatchUP" />
        </div>
        <button
          className="hamburger-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className={`hamburger-icon ${isOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Cards Section */}
      <section className={`cards-section ${isOpen ? 'mobile-open' : ''}`}>

        <div className="nav-logo-wrapper desktop-only" onClick={() => handleCardClick('home')}>
          <img src="../assets/MatchUPlogo.png" />
        </div>

        {/* Language Switcher (Desktop) */}
        <div className="language-selector-wrapper desktop-only">
          <div className="lang-btn" onClick={() => setIsLangOpen(!isLangOpen)}>
            <span className="lang-icon">
              {LANGUAGES.find(l => l.code === lang)?.icon || "�"}
            </span>
            <span className="lang-text">
              {LANGUAGES.find(l => l.code === lang)?.label || lang.toUpperCase()}
            </span>
            <span className={`lang-arrow ${isLangOpen ? 'open' : ''}`}>▼</span>
          </div>

          {isLangOpen && (
            <div className="lang-dropdown">
              {LANGUAGES.map((l) => (
                <div
                  key={l.code}
                  className={`lang-option ${lang === l.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(l.code)}
                >
                  <span className="lang-icon">{l.icon}</span> {l.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cards-container">

          <div
            className={`card ${activeLink === 'home' ? 'active' : ''}`}
            onClick={() => handleCardClick('home')}
          >
            <span className="card-icon">🏠</span>
            <h2><Lsi import={importLsi} path={["Navbar", "home"]} /></h2>
          </div>

          <div
            className={`card ${(activeLink === 'tournaments' || activeLink === 'tournamentDetail') ? 'active' : ''}`}
            onClick={() => handleCardClick('tournaments')}
          >
            <span className="card-icon">🏆</span>
            <h2><Lsi import={importLsi} path={["Navbar", "tournaments"]} /></h2>
          </div>

          <div
            className={`card ${activeLink === 'history' ? 'active' : ''}`}
            onClick={() => handleCardClick('history')}
          >
            <span className="card-icon">📜</span>
            <h2><Lsi import={importLsi} path={["Navbar", "history"]} /></h2>
          </div>

          <div
            className={`card ${activeLink === 'about' ? 'active' : ''}`}
            onClick={() => handleCardClick('about')}
          >
            <span className="card-icon">👥</span>
            <h2><Lsi import={importLsi} path={["Navbar", "about"]} /></h2>
          </div>

          <div
            className={`card ${user ? 'card-logout' : ''} ${activeLink === 'login' ? 'active' : ''}`}
            onClick={user ? handleLogout : () => setRoute("login")}
          >
            <span className="card-icon">{user ? "🚪" : "🔑"}</span>
            <h2><Lsi import={importLsi} path={user ? ["Navbar", "logout"] : ["Login", "login"]} /></h2>
          </div>

        </div>
      </section>

    </div>
  );
}