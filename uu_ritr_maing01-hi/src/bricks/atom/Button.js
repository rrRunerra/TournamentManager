import "../../styles/bricks/atom/Button.css";

export const ButtonTypes = ["primary-fill", "primary-outline", "secondary", "fab-primary", "danger"];

/**
 *
 * @param {type: ButtonTypes}
 * @returns
 */

export function Button({ children, className, type = "primary-fill", ...props }) {
  return (
    <button className={`button-${type} ${className}`} {...props}>
      {children}
    </button>
  );
}
