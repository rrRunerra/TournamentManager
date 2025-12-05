import React, { useState, useEffect, useRef } from "react";
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
      bio: lsi.bios.backend,
      socials: [
        { name: "hakushi@runerra.org", url: "", icon: "email" },
        { name: "runerra.hakushii", url: "https://discord.com/", icon: "discord" },
        { name: "Instagram", url: "https://www.instagram.com/hkshi555/", icon: "instagram" }
      ]
    },
    {
      initials: "BB",
      name: "Branislav Bobrik",
      role: lsi.roles.frontend,
      bio: lsi.bios.frontend,
      socials: [
        { name: "bobrikbrano@gmail.com", url: "", icon: "email" },
        { name: "demozzz", url: "https://discord.com/", icon: "discord" },
        { name: "Instagram", url: "https://www.instagram.com/brano_bobrik/", icon: "instagram" }
      ]
    },
    {
      initials: "LS",
      name: "Lukáš Salaj",
      role: lsi.roles.uiux,
      bio: lsi.bios.uiux,
      socials: [
        { name: "lukassalaj12@gmail.com", url: "", icon: "email" },
        { name: "lukas8160", url: "https://discord.com/", icon: "discord" },
        { name: "Instagram", url: "https://www.instagram.com/lukassalaj/", icon: "instagram" }
      ]
    },
  ];

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
    <div className="about-page">
      <div className="about-container">

        {/* --- HEADER SECTION --- */}
        <div className="about-header">
          <h1 className="main-title animate-on-scroll">
            {lsi.title} <span className="text-gradient">{lsi.team}</span>
          </h1>
          <p className="subtitle animate-on-scroll delay-1">
            {lsi.subtitle}
            <br /><br />
            {lsi.subtitle2}
          </p>
        </div>

        {/* --- TEAM SECTION --- */}
        <div className="section-header">
          <h2 className="section-title animate-on-scroll">{lsi.ourTeam}</h2>
        </div>

        <div className="team-grid">
          {team.map((member, index) => (
            <TeamCard
              key={index}
              member={member}
              onClick={member.name === "Branislav Bobrik" ? () => setShowGame(true) : undefined}
              className={`animate-on-scroll delay-${index + 1}`}
            />
          ))}
        </div>

        {/* --- MOTIVATION SECTION --- */}
        <div className="section-header">
          <h2 className="section-title animate-on-scroll">{lsi.motivationTitle}</h2>
        </div>

        <div className="motivation-grid">
          <MotivationCard
            title={lsi.collaborationTitle}
            text={lsi.collaborationText}
            className="animate-on-scroll delay-1"
          />
          <MotivationCard
            title={lsi.innovationTitle}
            text={lsi.innovationText}
            className="animate-on-scroll delay-2"
          />
        </div>

        {/* --- THANKS SECTION --- */}
        <ThanksSection lsi={lsi} className="animate-on-scroll" />

        {showGame && <FlappyBird onClose={() => setShowGame(false)} />}



      </div>
    </div>
  );
};

// --- COMPONENTS ---

const TeamCard = ({ member, onClick, className }) => {
  return (
    <div className={`team-card ${className || ''}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
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
      {member.socials && <SocialIcons socials={member.socials} />}
    </div>
  );
};

const SocialIcons = ({ socials }) => {
  return (
    <ul className="social-icons">
      {socials.map((social, index) => (
        <li key={index} className="icon-content">
          <a
            href={social.url}
            aria-label={social.name}
            data-social={social.icon}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="filled" />
            {social.icon === 'discord' && (
              <svg viewBox="0 0 16 16" className="bi bi-discord" fill="currentColor" height={16} width={16} xmlns="http://www.w3.org/2000/svg">
                <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
              </svg>
            )}
            {social.icon === 'email' && (
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
              </svg>
            )}
            {social.icon === 'instagram' && (
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
              </svg>
            )}
          </a>
          <div className="tooltip">{social.name}</div>
        </li>
      ))}
    </ul>
  );
};

const MotivationCard = ({ title, text, className }) => {
  return (
    <div className={`motivation-card ${className || ''}`}>
      <h3 className="motivation-title">{title}</h3>
      <p className="motivation-text">{text}</p>
    </div>
  );
};

const ThanksSection = ({ lsi, className }) => {
  return (
    <div className={`thanks-section ${className || ''}`}>
      <h2 className="thanks-title">
        {lsi.thanksTitle}
      </h2>
      <p className="thanks-text">
        {lsi.thanksText}
      </p>
      <div className="special-thanks">
        <p className="thanks-people">
          {lsi.specialThanks || "Špeciálne poďakovanie patri:"}{" "}
          <a
            href="https://www.linkedin.com/in/ali-al-alawin/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            target="_blank"
            rel="noopener noreferrer"
            className="thanks-link"
          >
            Ali Al Alawin
          </a>
          {", "}
          <a
            href="https://www.linkedin.com/in/vanesa-smoľakov%C3%A1-962abb39b/"
            target="_blank"
            rel="noopener noreferrer"
            className="thanks-link"
          >
            Vanesa Smoľaková
          </a>
          {" a "}
          <br />
          <a
            href="https://www.linkedin.com/in/mária-ortutayová-466229ba/?originalSubdomain=sk"
            target="_blank"
            rel="noopener noreferrer"
            className="thanks-link"
          >
            Ing. Mária Ortutayová
          </a>
        </p>
        <p className="thanks-appreciation">
          {lsi.thanksAppreciation || "Bez nich by nič z toho nebolo možné. 💛"}
        </p>
      </div>
    </div>
  );
};

export default AboutPage;