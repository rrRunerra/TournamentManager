import React, { useState, useEffect } from "react";
import "../styles/routes/about.css"; // Import your new CSS file
import FlappyBird from "../bricks/flappy-bird";
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import TeamCard from "../bricks/components/about/TeamCard.js";
import MotivationCard from "../bricks/components/about/MotivationCard.js";
import ThanksSection from "../bricks/components/about/ThanksSection.js";

const AboutPage = () => {
  const [showGame, setShowGame] = useState(false);

  const lsi = useLsi(importLsi, ["AboutPage"]);
  const team = [
    {
      initials: "SS",
      name: "Sebastián Savary",
      role: lsi.roles.fullstack,
      bio: lsi.bios.fullstack,
      socials: [
        { name: "akaryth@runerra.org", url: "", icon: "email" },
        { name: "akaryth.runerra", url: "", icon: "discord" },
        { name: "GitHub", url: "https://github.com/Akaryth", icon: "github" },
      ],
    },
    {
      initials: "BB",
      name: "Branislav Bobrik",
      role: lsi.roles.frontend,
      bio: lsi.bios.frontend,
      socials: [
        { name: "bobrikbrano@gmail.com", url: "", icon: "email" },
        { name: "demozzz", url: "", icon: "discord" },
        { name: "Instagram", url: "https://www.instagram.com/brano_bobrik/", icon: "instagram" },
      ],
    },
    {
      initials: "LS",
      name: "Lukáš Salaj",
      role: lsi.roles.uiux,
      bio: lsi.bios.uiux,
      socials: [
        { name: "lukassalaj12@gmail.com", url: "", icon: "email" },
        { name: "lukas8160", url: "", icon: "discord" },
        { name: "Instagram", url: "https://www.instagram.com/lukassalaj/", icon: "instagram" },
      ],
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
        rootMargin: "0px 0px -50px 0px", // Offset slightly so it triggers before bottom
      },
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
            <br />
            <br />
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
          <MotivationCard title={lsi.innovationTitle} text={lsi.innovationText} className="animate-on-scroll delay-2" />
        </div>

        {/* --- THANKS SECTION --- */}
        <ThanksSection lsi={lsi} className="animate-on-scroll" />

        {showGame && <FlappyBird onClose={() => setShowGame(false)} />}
      </div>
    </div>
  );
};

export default AboutPage;
