import React, { useState } from "react";
import "../styles/about.css"; // Import your new CSS file
import FlappyBird from "../bricks/flappy-bird";
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";

const AboutPage = () => {
  const [showGame, setShowGame] = useState(false);
  const lsi = useLsi(importLsi, ["AboutPage"]);
  const team = [
    {
      initials: "SS",
      name: "Sebastián Savary",
      role: lsi.roles.backend,
      bio: lsi.bios.backend
    },
    {
      initials: "BB",
      name: "Branislav Bobrik",
      role: lsi.roles.frontend,
      bio: lsi.bios.frontend
    },
    {
      initials: "LS",
      name: "Lukáš Salaj",
      role: lsi.roles.uiux,
      bio: lsi.bios.uiux
    },
  ];

  return (
    <div className="about-page">
      <div className="about-container">

        {/* --- HEADER SECTION --- */}
        <div className="about-header">
          <h1 className="main-title">
            {lsi.title} <span className="text-gradient">{lsi.team}</span>
          </h1>
          <p className="subtitle">
            {lsi.subtitle}
            <br /><br />
            {lsi.subtitle2}
          </p>
        </div>

        {/* --- TEAM SECTION --- */}
        <div className="section-header">
          <h2 className="section-title">{lsi.ourTeam}</h2>
        </div>

        <div className="team-grid">
          {team.map((member, index) => (
            <TeamCard
              key={index}
              member={member}
              onClick={member.name === "Branislav Bobrik" ? () => setShowGame(true) : undefined}
            />
          ))}
        </div>

        {/* --- MOTIVATION SECTION --- */}
        <div className="section-header">
          <h2 className="section-title">{lsi.motivationTitle}</h2>
        </div>

        <div className="motivation-grid">
          <MotivationCard
            title={lsi.collaborationTitle}
            text={lsi.collaborationText}
          />
          <MotivationCard
            title={lsi.innovationTitle}
            text={lsi.innovationText}
          />
        </div>

        {/* --- CTA SECTION --- */}
        <CtaSection lsi={lsi} />

        {showGame && <FlappyBird onClose={() => setShowGame(false)} />}

      </div>
    </div>
  );
};

// --- COMPONENTS ---

const TeamCard = ({ member, onClick }) => {
  return (
    <div className="team-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="card-top-line" />
      <div className="team-avatar">
        {member.initials}
      </div>
      <h3 className="team-name">
        {member.name}
      </h3>
      <p className="team-role">
        {member.role}
      </p>
      <p className="team-bio">
        {member.bio}
      </p>
    </div>
  );
};

const MotivationCard = ({ title, text }) => {
  return (
    <div className="motivation-card">
      <h3 className="motivation-title">{title}</h3>
      <p className="motivation-text">{text}</p>
    </div>
  );
};

const CtaSection = ({ lsi }) => {
  return (
    <div className="cta-section">
      <h2 className="cta-title">
        {lsi.ctaTitle}
      </h2>
      <p className="cta-text">
        {lsi.ctaText}
      </p>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLScoSv7pvaFvQ1Dw8a9N9KOQJ-QluWAXdGMUT9pXPaSQucKaTw/viewform?usp=dialog"
        target="_blank"
        rel="noopener noreferrer"
        className="cta-button"
        style={{ textDecoration: 'none', display: 'inline-block' }}
      >
        {lsi.contactUs}
      </a>
    </div>
  );
};

export default AboutPage;