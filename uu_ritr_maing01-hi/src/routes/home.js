import React, { useEffect } from "react";
import { useRoute, Lsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import "../styles/routes/home.css";
import heroGif from "../assets/gif.gif";

export default function Home() {
  const [, setRoute] = useRoute();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // Only animate once
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Offset slightly so it triggers before bottom
      }
    );

    const hiddenElements = document.querySelectorAll(".animate-on-scroll");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="home-container">
      <div className="home-hero">
        <img src={heroGif} alt="" className="hero-background-gif" />
        <div className="hero-content">
          <h1 className="hero-title animate-on-scroll">
            <Lsi import={importLsi} path={["Home", "welcome"]} /> <span className="brand-highlight">MatchUP</span>
          </h1>
          <p className="hero-subtitle animate-on-scroll delay-1">
            <Lsi import={importLsi} path={["Home", "subtitle"]} />
          </p>



          <div className="hero-buttons animate-on-scroll delay-2">
            <button
              className="hero-btn primary"
              onClick={() => setRoute("tournaments")}
            >
              <Lsi import={importLsi} path={["Home", "tournamentsBtn"]} />
            </button>
            <button
              className="hero-btn secondary"
              onClick={() => setRoute("about")}
            >
              <Lsi import={importLsi} path={["Home", "aboutBtn"]} />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-home-title animate-on-scroll"><Lsi import={importLsi} path={["Home", "whyTitle"]} /></h2>
        <div className="features-grid">
          <div className="feature-card animate-on-scroll delay-1">
            <div className="feature-icon">⚡</div>
            <h3><Lsi import={importLsi} path={["Home", "fastTitle"]} /></h3>
            <p><Lsi import={importLsi} path={["Home", "fastDesc"]} /></p>
          </div>

          <div className="feature-card animate-on-scroll delay-2">
            <div className="feature-icon">📊</div>
            <h3><Lsi import={importLsi} path={["Home", "resultsTitle"]} /></h3>
            <p><Lsi import={importLsi} path={["Home", "resultsDesc"]} /></p>
          </div>

          <div className="feature-card animate-on-scroll delay-3">
            <div className="feature-icon">🎯</div>
            <h3><Lsi import={importLsi} path={["Home", "flexibleTitle"]} /></h3>
            <p><Lsi import={importLsi} path={["Home", "flexibleDesc"]} /></p>
          </div>

          <div className="feature-card animate-on-scroll delay-4">
            <div className="feature-icon">📜</div>
            <h3><Lsi import={importLsi} path={["Home", "historyTitle"]} /></h3>
            <p><Lsi import={importLsi} path={["Home", "historyDesc"]} /></p>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="sponsors-section">
        <h3 className="sponsors-title animate-on-scroll"><Lsi import={importLsi} path={["Home", "partnersTitle"]} /></h3>
        <div className="sponsors-grid animate-on-scroll delay-1">
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
