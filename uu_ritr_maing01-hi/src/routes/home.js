import React, { useEffect, useState } from "react";
import { useRoute, Lsi, useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import "../styles/routes/home.css";
import heroGif from "../assets/gif.gif";
import { Button } from "../bricks/components/ui/Button.js";
import emailjs from "emailjs-com";

export default function Home() {
  const [, setRoute] = useRoute();
  const lsi = useLsi(importLsi);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

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
        rootMargin: "0px 0px -50px 0px", // Offset slightly so it triggers before bottom
      },
    );

    const hiddenElements = document.querySelectorAll(".animate-on-scroll");
    hiddenElements.forEach((el) => observer.observe(el));

    // Load saved rating from localStorage
    const savedRating = localStorage?.getItem("matchup_rating");
    const savedFeedback = localStorage?.getItem("matchup_feedback");
    if (savedRating) {
      setRating(parseInt(savedRating));
      setHasRated(true);
    }
    if (savedFeedback) {
      setFeedback(savedFeedback);
    }

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleRating = (value) => {
    if (rating === value) {
      // Toggle off if same star clicked
      setRating(0);
      setHasRated(false);
      setShowFeedback(false);
      setFeedback("");
      localStorage.removeItem("matchup_rating");
      localStorage.removeItem("matchup_feedback");
    } else {
      setRating(value);
      setHasRated(false); // Reset to show feedback form
      setShowFeedback(true);
      localStorage.setItem("matchup_rating", value.toString());
    }
  };

  const handleSubmitFeedback = () => {
    setHasRated(true);
    setShowFeedback(false);
    if (feedback.trim()) {
      localStorage.setItem("matchup_feedback", feedback);
    }
    emailjs.send(
      "service_mekjy8j",              // 👈 tvoj service ID
      "template_tr4crjo",      // 👈 tvoj template ID
      {
        rating: `${rating}/5`,
        feedback: feedback.trim() || lsi?.Home?.noFeedback || "No feedback"
      },
      "KvZ1fkPgcBSFTuJDw"              // 👈 tvoj public key
    ).catch((err) => {
      console.error("EmailJS rating error:", err);
    });
  };

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
            <Button onClick={() => setRoute("tournaments")} type="primary-fill">
              <Lsi import={importLsi} path={["Home", "tournamentsBtn"]} />
            </Button>
            <Button
              onClick={() => setRoute("about")}
              type="secondary"
              style={{ backgroundColor: "#1a1a1a", color: "#ff8e53", border: "1px solid #2a2a2a" }}
            >
              <Lsi import={importLsi} path={["Home", "aboutBtn"]} />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-home-title animate-on-scroll">
          <Lsi import={importLsi} path={["Home", "whyTitle"]} />
        </h2>
        <div className="features-grid">
          <div className="feature-card animate-on-scroll delay-1">
            <div className="feature-icon">⚡</div>
            <h3>
              <Lsi import={importLsi} path={["Home", "fastTitle"]} />
            </h3>
            <p>
              <Lsi import={importLsi} path={["Home", "fastDesc"]} />
            </p>
          </div>

          <div className="feature-card animate-on-scroll delay-2">
            <div className="feature-icon">📊</div>
            <h3>
              <Lsi import={importLsi} path={["Home", "resultsTitle"]} />
            </h3>
            <p>
              <Lsi import={importLsi} path={["Home", "resultsDesc"]} />
            </p>
          </div>

          <div className="feature-card animate-on-scroll delay-3">
            <div className="feature-icon">🎯</div>
            <h3>
              <Lsi import={importLsi} path={["Home", "flexibleTitle"]} />
            </h3>
            <p>
              <Lsi import={importLsi} path={["Home", "flexibleDesc"]} />
            </p>
          </div>

          <div className="feature-card animate-on-scroll delay-4">
            <div className="feature-icon">📜</div>
            <h3>
              <Lsi import={importLsi} path={["Home", "historyTitle"]} />
            </h3>
            <p>
              <Lsi import={importLsi} path={["Home", "historyDesc"]} />
            </p>
          </div>
        </div>
      </section>

      {/* Rating Section */}
      <section className="rating-section">
        <div className="rating-content animate-on-scroll">
          <h2 className="rating-title">
            <Lsi import={importLsi} path={["Home", "ratingTitle"]} />
          </h2>
          <p className="rating-subtitle">
            <Lsi import={importLsi} path={["Home", "ratingSubtitle"]} />
          </p>
          <div className="stars-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star-button ${star <= (hoverRating || rating) ? "active" : ""}`}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={lsi?.Home?.ratingStarAriaLabel?.replace("{star}", star) || `Rate ${star} stars`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
          {showFeedback && !hasRated && (
            <div className="feedback-form">
              <textarea
                className="feedback-textarea"
                placeholder={lsi?.Home?.feedbackPlaceholder}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
              <Button onClick={handleSubmitFeedback} type="primary-fill" style={{ marginTop: "1rem" }}>
                <Lsi import={importLsi} path={["Home", "submitFeedback"]} />
              </Button>
            </div>
          )}
          {hasRated && (
            <p className="rating-thanks">
              <Lsi import={importLsi} path={["Home", "ratingThanks"]} />
            </p>
          )}
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="sponsors-section">
        <h3 className="sponsors-title animate-on-scroll">
          <Lsi import={importLsi} path={["Home", "partnersTitle"]} />
        </h3>
        <div className="sponsors-grid animate-on-scroll delay-1">
          <a href="https://sps-snina.edupage.org/" target="_blank" rel="noopener noreferrer" className="sponsor-link">
            <img src="../assets/SPS_Snina.png" alt="SPŠ SNINA" className="sponsor-logo" />
          </a>
          <a href="https://unicorn.com/sk" target="_blank" rel="noopener noreferrer" className="sponsor-link">
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
