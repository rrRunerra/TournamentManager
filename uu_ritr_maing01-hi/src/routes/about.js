import React, { useState } from "react";
import "../styles/about.css"; // Import your new CSS file
import FlappyBird from "../bricks/flappy-bird";

const AboutPage = () => {
  const [showGame, setShowGame] = useState(false);
  const team = [
    {
      initials: "SS",
      name: "Sebastián Savary",
      role: "Backend Developer",
      bio: "Spravuje serverovú logiku, databázy a API integrácie pre našu aplikáciu."
    },
    {
      initials: "BB",
      name: "Branislav Bobrik",
      role: "Frontend Developer",
      bio: "Zodpovedný za vývoj používateľského rozhrania a interaktívnych komponentov."
    },
    {
      initials: "LS",
      name: "Lukáš Salaj",
      role: "UI/UX Designer",
      bio: "Navrhuje používateľské rozhrania a zabezpečuje optimálnu používateľskú skúsenosť."
    },
  ];

  return (
    <div className="about-page">
      <div className="about-container">

        {/* --- HEADER SECTION --- */}
        <div className="about-header">
          <h1 className="main-title">
            O našom <span className="text-gradient">tíme</span>
          </h1>
          <p className="subtitle">
            Sme trojica študentov zo Strednej priemyselnej školy v Snine, ktorí spájajú vášeň pre technológie, kódovanie a tvorbu. Naším cieľom je rozvíjať projekty, ktoré majú význam nielen pre nás, ale aj pre našu školu a komunitu okolo nej. Spoločne tvoríme MatchUP – študentský projekt, ktorý vznikol v spolupráci s firmou Unicorn a ktorý nás posúva vpred nielen vo vedomostiach, ale aj v tímovej spolupráci a reálnom riešení úloh.

            Veríme, že aj malý tím s veľkými nápadmi môže niečo zmeniť.
          </p>
        </div>

        {/* --- TEAM SECTION --- */}
        <div className="section-header">
          <h2 className="section-title">Náš tím</h2>
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
          <h2 className="section-title">Čo nás motivuje</h2>
        </div>

        <div className="motivation-grid">
          <MotivationCard
            title="Spolupráca"
            text="Veríme, že spolupráca je kľúčom k úspechu. Každý člen tímu prispieva svojimi silnými stránkami a spoločne vytvárame niečo veľké."
          />
          <MotivationCard
            title="Inovácia"
            text="Neustále hľadáme nové riešenia a technológie, ktoré by mohli zlepšiť našu aplikáciu a užívateľské zážitky."
          />
        </div>

        {/* --- CTA SECTION --- */}
        <CtaSection />

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

const CtaSection = () => {
  return (
    <div className="cta-section">
      <h2 className="cta-title">
        Chceš sa zapojiť?
      </h2>
      <p className="cta-text">
        Máš nápady alebo chceš pomôcť? Nechaj nám správu a staneš sa súčasťou našej komunity!
      </p>
      <button className="cta-button">
        Kontaktuj nás
      </button>
    </div>
  );
};

export default AboutPage;