import React from "react";
import { useRoute } from "uu5g05";
import DarkVeil from "../bricks/DarkVeil.js";
import "../styles/home.css";

export default function Home() {
  const [, setRoute] = useRoute();

  return (
    <div className="home-container">
      <div className="home-background-wrapper">
        <div className="home-background-layer">
          <DarkVeil
            speed={1.5}
            hueShift={213}
            noiseIntensity={0}
            scanlineFrequency={0.5}
            scanlineIntensity={0}
            warpAmount={0}
          />
        </div>

        <div className="home-content">
          <div className="home-panel">
            <div className="home-hero">
              <h1 className="home-title">Vitajte v MatchUP</h1>
              <p className="home-subtitle">
                Organizujte svoje turnaje jednoducho a efektívne.
                <br />
                Všetko čo potrebujete na jednom mieste.
              </p>

              <div className="home-cta-buttons">
                <button
                  className="home-button primary"
                  onClick={() => setRoute("tournaments")}
                >
                  Prehľad turnajov
                </button>
                <button
                  className="home-button secondary"
                  onClick={() => setRoute("about")}
                >
                  O nás
                </button>
              </div>

            </div>

            <div className="sponsor-container">
              <a href="https://sps-snina.edupage.org/" target="_blank" rel="noopener noreferrer">
                <img
                  src="../assets/SPS_Snina.png"
                  alt="SPŠ SNINA"
                  className="sponsor-logo"
                />
              </a>
              <a href="https://unicorn.com/sk" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://uuapp.plus4u.net/uu-appbinarystore-maing02/8c84c39b5ef84fa2acba4fe8b05a0f42/binary/getData?accessKey=7d7d62c73e9e0d0b428db10242fca111.27436112.a2ec90f90ee597d5ea466446608e4b88d6d55c1d&clientAwid=d2a80094d8d24287befb333201f98edb&dataKey=prod2-small_logo_unicorn_552x60"
                  alt="UNICORN"
                  className="sponsor-logo"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}