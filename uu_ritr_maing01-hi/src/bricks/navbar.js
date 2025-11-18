import "../styles/navbar.css";
import { useEffect, useState } from "react";
import { useRoute } from "uu5g05";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("tournaments");
  const [route, setRoute] = useRoute();
  const [user, setUser] = useState(); // Initialize user from mock state

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
      
      {/* Cards Section */}
      <section className="cards-section">
        <div className="cards-container">
          

          {/* Card 2: Turnaje (tournaments) */}
          <div 
            className={`card ${activeLink === 'tournaments' ? 'active' : ''}`} 
            onClick={() => handleCardClick('tournaments')}
          >
            <span className="card-icon">🚀</span>
            <h2>Turnaje</h2>
          </div>

          {/* Card 3: História (history) */}
          <div 
            className={`card ${activeLink === 'history' ? 'active' : ''}`} 
            onClick={() => handleCardClick('history')}
          >
            <span className="card-icon">📱</span>
            <h2>Historia</h2>
          </div>

          {/* Card 1: O nás (about) */}
          <div 
            className={`card ${activeLink === 'about' ? 'active' : ''}`} 
            onClick={() => handleCardClick('about')}
          >
            <span className="card-icon">👥</span>
            <h2>O nás</h2>
          </div>

          {/* Card 4: Odhlásiť sa */}
          <div className="card card-logout" onClick={() => handleLogout()}>
            <span className="card-icon">🚪</span>
            <h2>Odhlásiť sa</h2>
          </div>
        </div>
      </section>
    </div>
  );
}