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
        </div>
      </div>
    </div>
  );
}