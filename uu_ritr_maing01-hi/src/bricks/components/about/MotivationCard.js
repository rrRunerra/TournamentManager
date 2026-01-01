import React from "react";
import { Card, CardTitle, CardText } from "../ui/Card.js";

const MotivationCard = ({ title, text, className }) => {
  return (
    <div className={className}>
      <Card type="motivation" style={{ height: "100%" }}>
        <CardTitle>{title}</CardTitle>
        <CardText type="motivation">{text}</CardText>
      </Card>
    </div>
  );
};

export default MotivationCard;
