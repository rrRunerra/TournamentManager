import "../styles/navbar.css";
import { useEffect, useState } from "react";
import { useRoute } from "uu5g05";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("tournaments");
  const [route, setRoute] = useRoute();
  const [user, setUser] = useState(); // Initialize user from mock state
  const [isOpen, setIsOpen] = useState(false);

  // Handler to update route
  const handleCardClick = (newRoute) => {
    setActiveLink(newRoute)
    setRoute(newRoute);
  };

  const handleLogout = () => {
    localStorage.removeItem("player");
    setRoute("login");
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("player"));
    setUser(user);

    if (!user) {
      setRoute("login");
      return;
    }

    // Sync activeLink with the current route
    if (route && route.uu5Route) {
      setActiveLink(route.uu5Route);
    }
  }, []);


  if (route.uu5Route === "login") {
    // If the route is 'login', hide the navbar
    return null;
  }


  return (
    <div>

      {/* Mobile Header */}
      <div className="mobile-navbar">
        <div className="nav-logo-mobile">
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

        <div className="nav-logo-wrapper desktop-only">
          <img src="../assets/MatchUPlogo.png" />
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
            className={`card ${activeLink === 'tournaments' ? 'active' : ''}`}
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
            <h2>Historia</h2>
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