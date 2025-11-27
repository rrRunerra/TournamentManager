import React from "react";
import { useRoute } from "uu5g05";
import "../styles/home.css";

export default function Home() {
  const [, setRoute] = useRoute();

  return (
    <div className="home-container">
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Vitajte v <span className="brand-highlight">MatchUP</span>
          </h1>
          <p className="hero-subtitle">
            Organizujte svoje turnaje jednoducho a efektívne.
            <br />
            Všetko čo potrebujete na jednom mieste.
          </p>

          <div className="hero-buttons">
            <button
              className="hero-btn primary"
              onClick={() => setRoute("tournaments")}
            >
              <span className="btn-icon">🏆</span>
              Prehľad turnajov
            </button>
            <button
              className="hero-btn secondary"
              onClick={() => setRoute("about")}
            >
              <span className="btn-icon">👥</span>
              O nás
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Prečo MatchUP?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Rýchle a jednoduché</h3>
            <p>Vytvorte turnaj za pár kliknutí a začnite okamžite</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Prehľadné výsledky</h3>
            <p>Sledujte priebeh turnaja v reálnom čase</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Flexibilné formáty</h3>
            <p>Single a double elimination turnaje</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📜</div>
            <h3>História turnajov</h3>
            <p>Všetky vaše turnaje na jednom mieste</p>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="sponsors-section">
        <h3 className="sponsors-title">Partneri</h3>
        <div className="sponsors-grid">
          <a
            href="https://sps-snina.edupage.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="sponsor-link"
          >
            <img
              src="../assets/SPS_Snina.png"
              alt="SPŠ SNINA"
              className="sponsor-logo"
            />
          </a>
          <a
            href="https://unicorn.com/sk"
            target="_blank"
            rel="noopener noreferrer"
            className="sponsor-link"
          >
            <img
              src="https://uuapp.plus4u.net/uu-appbinarystore-maing02/8c84c39b5ef84fa2acba4fe8b05a0f42/binary/getData?accessKey=7d7d62c73e9e0d0b428db10242fca111.27436112.a2ec90f90ee597d5ea466446608e4b88d6d55c1d&clientAwid=d2a80094d8d24287befb333201f98edb&dataKey=prod2-small_logo_unicorn_552x60"
              alt="UNICORN"
              className="sponsor-logo"
            />
          </a>
        </div>
      </section>
    </div>
  );
}
