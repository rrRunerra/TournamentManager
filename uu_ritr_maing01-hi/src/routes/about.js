import React from "react";

const AboutPage = () => {
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
    <div className="about-page" style={{
      backgroundColor: '#0d0d0d',
      color: '#d1d5db',
      fontFamily: "'Space Mono', monospace",
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Nadpis */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
          padding: '0 1rem'
        }}>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            O našom <span style={{
              color: '#ff8e53',
              background: 'linear-gradient(90deg, #ff8e53, #ffd166)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>tíme</span>
          </h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '1.25rem',
            lineHeight: '1.8',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            MatchUP je študentský projekt v spolupráci s firmou Unicorn. Náš tím je zložený z troch žiakov Strednej Priemyslenej školy v Snine.
          </p>
        </div>

        {/* Sekcia tímu */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#ff8e53',
            background: 'linear-gradient(90deg, #ff8e53, #ffd166)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>
            Náš tím
          </h2>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          padding: '0 1rem'
        }}>
          {team.map((member, index) => (
            <TeamCard key={index} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TeamCard = ({ member }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      style={{
        backgroundColor: '#141414',
        border: `1px solid ${isHovered ? '#ff6b35' : '#2a2a2a'}`,
        borderRadius: '12px',
        padding: '2rem 1.5rem',
        width: '280px',
        textAlign: 'center',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 12px 24px -6px rgba(255, 107, 53, 0.3)' : 'none',
        backgroundColor: isHovered ? '#1a1a1a' : '#141414'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top gradient line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #ff6b35, #ffd166)',
        transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.3s ease',
        borderRadius: '12px 12px 0 0'
      }} />
      
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: isHovered 
          ? 'linear-gradient(135deg, #1f1f1f, #3a3a3a)' 
          : 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
        color: '#ff8e53',
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '2rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        border: `2px solid ${isHovered ? '#ff6b35' : '#2a2a2a'}`,
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
        boxShadow: isHovered ? '0 0 20px rgba(255, 138, 83, 0.3)' : 'none'
      }}>
        {member.initials}
      </div>
      
      <h3 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '1.3rem',
        fontWeight: '600',
        color: isHovered ? '#ffd166' : '#ff8e53',
        marginBottom: '0.5rem',
        transition: 'all 0.3s ease',
        textShadow: isHovered ? '0 0 8px rgba(255, 209, 102, 0.4)' : 'none'
      }}>
        {member.name}
      </h3>
      
      <p style={{
        color: '#9ca3af',
        fontSize: '0.95rem',
        marginBottom: '0.8rem',
        fontStyle: 'italic'
      }}>
        {member.role}
      </p>
      
      <p style={{
        color: '#d1d5db',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        opacity: '0.9'
      }}>
        {member.bio}
      </p>
    </div>
  );
};

export default AboutPage;
