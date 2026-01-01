import React from "react";
import { Card, CardTitle, CardTopLine, CardAvatar, CardRole, CardText } from "../ui/Card.js";
import SocialIcons from "../ui/SocialIcons.js";

const TeamCard = ({ member, onClick, className }) => {
  return (
    <div className={className}>
      <Card type="about" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default", height: "100%" }}>
        <CardTopLine />
        <CardAvatar>{member.initials}</CardAvatar>
        <CardTitle>{member.name}</CardTitle>
        <CardRole>{member.role}</CardRole>
        <CardText type="bio">{member.bio}</CardText>
        {member.socials && <SocialIcons socials={member.socials} />}
      </Card>
    </div>
  );
};

export default TeamCard;
