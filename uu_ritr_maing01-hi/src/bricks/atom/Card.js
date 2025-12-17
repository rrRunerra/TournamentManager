import "../../styles/bricks/atom/Card.css";

export const CardTypes = ["team", "tournament", "about"];
export const CardTitleTypes = ["orange"];
export const CardTextTypes = ["bio", ""];

/**
 *
 * @param {type: CardTypes}
 * @returns
 */

export function Card({ children, className, type = "tournament", ...props }) {
  return (
    <div className={`card-${type} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, type = "orange", ...props }) {
  return (
    <h3 className={`card-title-${type} ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardTopLine({ className, ...props }) {
  return <div className={`card-top-line ${className}`} {...props}></div>;
}

export function CardAvatar({ children, className, ...props }) {
  return (
    <div className={`card-avatar ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardRole({ children, className, ...props }) {
  return (
    <p className={`card-role ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardText({ children, className, type, ...props }) {
  return (
    <p className={`card-text-${type} ${className}`} {...props}>
      {children}
    </p>
  );
}
