import styles from "../styles/cards.module.css";

function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={`${styles.card} ${className ?? ""}`.trim()}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={`${styles["card-header"]} ${className ?? ""}`.trim()}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={`${styles["card-title"]} ${className ?? ""}`.trim()}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description"
      className={`${styles["card-description"]} ${className ?? ""}`.trim()}
      {...props}
    />
  );
}

function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={`${styles["card-action"]} ${className ?? ""}`.trim()}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={`${styles["card-content"]} ${className ?? ""}`.trim()}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={`${styles["card-footer"]} ${className ?? ""}`.trim()}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
