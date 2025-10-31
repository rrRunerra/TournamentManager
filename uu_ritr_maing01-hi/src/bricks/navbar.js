import "../styles/navbar.css";
import { useEffect, useState } from "react";
import { useRoute } from "uu5g05";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("tournaments");
  const [route, setRoute] = useRoute();

  const user = JSON.parse(sessionStorage.getItem("player"));

  if (!user) {
    return 
  }
  useEffect(() => {
    setActiveLink(route.uu5Route);
  }, []);



  return (
    <header className="panel-header">
      <div>
        <img
          src="/assets/MatchUPlogo.png"
          alt="Logo"
          className="logo-image"
          style={{ width: "25px", height: "auto" }}
        />
      </div>
      <nav className="nav">
        <p
          className={activeLink === "tournaments" ? "active" : ""}
          onClick={() => {
            setActiveLink("tournaments");
            setRoute("tournaments");
          }}
        >
          Turnaje
        </p>
        <p
          className={activeLink === "about" ? "active" : ""}
          onClick={() => {
            setActiveLink("about");
            setRoute("about");
          }}
        >
          O nás
        </p>
      </nav>
    </header>
  );
}
