import React from "react";
import "../../../styles/bricks/components/ui/Grid.css";

/**
 * Reusable Grid component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Grid items
 * @param {string} props.type - Grid type (e.g., "2x2", "3x1", "4x4", "5x6")
 * @param {string} props.className - Additional CSS classes
 */
const Grid = ({ children, type = "default", className = "" }) => {
  return <div className={`grid-container grid-${type} ${className}`}>{children}</div>;
};

export default Grid;
