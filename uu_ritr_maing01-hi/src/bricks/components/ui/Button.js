import "../../../styles/bricks/components/ui/Button.css";

export const ButtonTypes = ["primary-fill", "primary-outline", "secondary", "fab-primary", "danger", "success", "info"];

/**
 *
 * @param {type: ButtonTypes}
 * @returns
 */

export function Button({ children, className = "", type = "primary-fill", size = "medium", ...props }) {
  const sizeClass = size === "small" ? "button-small" : "";
  return (
    <button className={`button-${type} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
