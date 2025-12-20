import { useMemo } from "react";
import "../../../styles/bricks/components/brackets/confetti.css";

const Confetti = ({ isFadingOut }) => {
  const confettiPieces = useMemo(() => {
    const colors = [
      "#ff8e53",
      "#ffa733",
      "#ffcc00",
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#a29bfe",
      "#fd79a8",
      "#fdcb6e",
      "#00b894",
      "#e17055",
      "#74b9ff",
      "#ff7675",
      "#fab1a0",
      "#55efc4",
      "#81ecec",
      "#ffeaa7",
      "#dfe6e9",
    ];
    const shapes = ["square", "circle", "triangle", "rectangle"];

    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: (Math.random() * 12).toFixed(2),
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));
  }, []);

  return (
    <div className={`confetti-container ${isFadingOut ? "confetti-fade-out" : ""}`}>
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className={`confetti-piece confetti-${piece.shape}`}
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.animationDelay}s`,
            ...(piece.shape === "triangle"
              ? { borderBottomColor: piece.backgroundColor }
              : { backgroundColor: piece.backgroundColor }),
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
