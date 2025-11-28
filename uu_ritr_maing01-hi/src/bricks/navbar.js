import "../styles/navbar.css";
import { useEffect, useState } from "react";
import { useRoute, Utils, Environment, useLanguage } from "uu5g05";

const LANGUAGES = [
  { code: "cs", label: "CS", icon: "🇨🇿" },
  { code: "en", label: "EN", icon: "🇬🇧" }
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
    setRoute("login");
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("player"));
    setUser(user);

    // if (!user) {
    //   setRoute("login");
    //   return;
    // }

    // Load language from localStorage
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const handleLanguageChange = (lang) => {
    setLang(lang);
    localStorage.setItem("language", lang);
    setIsLangOpen(false);
  };

  console.log(lang)

  useEffect(() => {
    // Sync activeLink with the current route
    if (route.uu5Route) {
      setActiveLink(route.uu5Route);
    }
  }, [route]);


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
            <h2>Domov</h2>
          </div>

          <div
            className={`card ${(activeLink === 'tournaments' || activeLink === 'tournamentDetail') ? 'active' : ''}`}
            onClick={() => handleCardClick('tournaments')}
          >
            <span className="card-icon">🏆</span>
            <h2>Turnaje</h2>
          </div>

          <div
            className={`card ${activeLink === 'history' ? 'active' : ''}`}
            onClick={() => handleCardClick('history')}
          >
            <span className="card-icon">📜</span>
            <h2>História</h2>
          </div>

          <div
            className={`card ${activeLink === 'about' ? 'active' : ''}`}
            onClick={() => handleCardClick('about')}
          >
            <span className="card-icon">👥</span>
            <h2>O nás</h2>
          </div>

          <div className="card card-logout" onClick={handleLogout}>
            <span className="card-icon">🚪</span>
            <h2>Odhlásiť sa</h2>
          </div>

        </div>
      </section>

    </div>
  );
}