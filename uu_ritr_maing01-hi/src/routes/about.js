import React from "react";

const team = [
  { initials: "SS", name: "Sebastián Savary", role: "", bio: "" },
  { initials: "BB", name: "Branislav Bobrik", role: "", bio: "" },
  { initials: "LS", name: "Lukáš Salaj", role: "", bio: "" },
];

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#000",
    color: "#fff",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  headerSection: {
    textAlign: "center",
    marginBottom: "4rem",
  },
  mainTitle: {
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "1rem",
    lineHeight: "1",
  },
  orangeText: {
    color: "#f97316",
  },
  subtitle: {
    color: "#d1d5db",
    maxWidth: "48rem",
    margin: "0 auto",
    fontSize: "1.125rem",
    lineHeight: "1.75rem",
  },
  missionVisionContainer: {
    maxWidth: "64rem",
    margin: "0 auto 5rem",
    display: "flex",
    flexDirection: "column",
    gap: "2.5rem",
  },
  missionVisionItem: {
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    lineHeight: "2rem",
  },
  description: {
    color: "#9ca3af",
    maxWidth: "32rem",
    margin: "0 auto",
    fontSize: "1rem",
    lineHeight: "1.5rem",
  },
  teamHeaderSection: {
    textAlign: "center",
    marginBottom: "4rem",
  },
  teamTitle: {
    fontSize: "1.875rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
    lineHeight: "2.25rem",
  },
  teamSubtitle: {
    color: "#d1d5db",
    maxWidth: "32rem",
    margin: "0 auto 2.5rem",
    fontSize: "1.125rem",
    lineHeight: "1.75rem",
  },
  teamGrid: {
    justifyContent: "center",
  },
  teamCard: {
    backgroundColor: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "1rem",
    padding: "2rem 1rem",
    height: "100%",
    width: "16rem",
    textAlign: "center",
    margin: "1rem",
    transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  teamCardHover: {
    borderColor: "#f97316",
  },
  avatar: {
    width: "4rem",
    height: "4rem",
    borderRadius: "9999px",
    backgroundColor: "#1f2937",
    color: "#f97316",
    fontSize: "1.5rem",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
  },
  memberName: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#fb923c",
    marginBottom: "0.5rem",
    lineHeight: "1.75rem",
  },
  memberRole: {
    fontSize: "0.875rem",
    color: "#9ca3af",
    marginBottom: "0.5rem",
    lineHeight: "1.25rem",
  },
  memberBio: {
    fontSize: "0.875rem",
    color: "#d1d5db",
    lineHeight: "1.25rem",
    maxWidth: "20rem",
    margin: "0 auto",
  },
};

// Add hover effect with inline styles
const TeamCard = ({ member }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      style={{
        ...styles.teamCard,
        borderColor: isHovered ? "#f97316" : "#1f2937",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.avatar}>{member.initials}</div>
      <h3 style={styles.memberName}>{member.name}</h3>
      <p style={styles.memberRole}>{member.role}</p>
      <p style={styles.memberBio}>{member.bio}</p>
    </div>
  );
};

const AboutPageWithHover = () => {
  return (
    <div style={styles.container}>
      {/* Nadpis */}
      <div style={styles.headerSection}>
        <h1 style={styles.mainTitle}>
          O našom <span style={styles.orangeText}>tíme</span>
        </h1>
        <p style={styles.subtitle}>
          MatchUP je študentský projekt v spolupráci s firmou Unicorn. Náš tím je zložený z troch žiakov Strednej Priemyslenej školy v Snine.
        </p>
      </div>

      {/* Sekcia tímu */}
      <div style={styles.teamHeaderSection}>
        <h2 style={styles.teamTitle}>Náš tím</h2>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {team.map((member, index) => (
            <TeamCard key={index} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPageWithHover;
