import React from "react";
import "../../../styles/bricks/components/ui/GridPlaceholder.css";

/**
 * Reusable GridPlaceholder component for loading states or empty slots
 * @param {Object} props
 * @param {string} props.type - Grid type (e.g., "3x1", "4x4")
 * @param {string} props.className - Additional CSS classes
 */
const GridPlaceholder = ({ type = "default", className = "" }) => {
  return (
    <div className={`grid-placeholder grid-placeholder-${type} ${className}`}>
      <div className="placeholder-title" />
      <div className="placeholder-line" />
      <div className="placeholder-team-container">
        <div className="placeholder-line" style={{ width: "30%", height: "0.8rem" }} />
        <div className="placeholder-team" />
      </div>
    </div>
  );
};

export default GridPlaceholder;
