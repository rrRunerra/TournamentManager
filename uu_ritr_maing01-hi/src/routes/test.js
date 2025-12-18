import React, { useState } from "react";
import { Button } from "../bricks/atom/Button.js";
import { useNotification } from "../bricks/NotificationProvider.js";
import { useConfirm } from "../bricks/ConfirmProvider.js";
import Pagination from "../bricks/pagination.js";
import DateTimePicker from "../bricks/DateTimePicker.js";
import WelcomeRow from "../bricks/welcome-row.js";
import CasinoPage from "./casino.js";
import Calls from "../calls";
import {
  Card,
  CardTitle,
  CardTopLine,
  CardAvatar,
  CardRole,
  CardText,
  CardIcon,
  CardDetails,
  CardStatus,
} from "../bricks/atom/Card.js";

export default function TestPage(props) {
  const { showSuccess, showError } = useNotification();
  const { confirm } = useConfirm();
  const [page, setPage] = useState(1);
  const [date, setDate] = useState(new Date());

  const id = props.qwerty || new URLSearchParams(window.location.search).get("qwerty");

  if (id == "hesoyam") {
    return <CasinoPage {...props}></CasinoPage>;
  }

  const sectionStyle = {
    marginBottom: "3rem",
    padding: "2rem",
    border: "1px solid #333",
    borderRadius: "12px",
    background: "#1a1a1a",
  };

  const headerStyle = {
    marginBottom: "1.5rem",
    color: "#ff8e53",
    borderBottom: "1px solid #333",
    paddingBottom: "0.5rem",
    fontFamily: "Space Grotesk, sans-serif",
  };

  const rowStyle = {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    alignItems: "center",
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        color: "white",
        fontFamily: "Space Grotesk, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "2rem",
          background: "linear-gradient(90deg, #ff8e53, #ff6b6b)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Component Showcase
      </h1>

      {/* Buttons Section */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Buttons</h2>
        <div style={rowStyle}>
          <Button type="primary-fill">Primary Fill</Button>
          <Button type="primary-outline">Primary Outline</Button>
          <Button type="secondary">Secondary</Button>
          <Button type="danger">Danger</Button>
        </div>
        <div style={{ marginTop: "2rem" }}>
          <p style={{ marginBottom: "0.5rem", color: "#888" }}>Floating Action Button (Fixed Position Demo)</p>
          <div style={{ position: "relative", height: "60px", border: "1px dashed #444", borderRadius: "8px" }}>
            <Button type="fab-primary" style={{ position: "absolute", bottom: "5px", right: "5px" }}>
              +
            </Button>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Feedback & Dialogs</h2>
        <div style={rowStyle}>
          <Button type="primary-fill" onClick={() => showSuccess("Operation successful! This is a success message.")}>
            Trigger Success
          </Button>

          <Button type="danger" onClick={() => showError("Operation failed! This is an error message.")}>
            Trigger Error
          </Button>

          <Button
            type="secondary"
            onClick={async () => {
              const result = await confirm({
                title: "Confirmation Required",
                message: "Are you sure you want to proceed with this action?",
                confirmText: "Yes, Proceed",
                cancelText: "Cancel",
              });
              if (result) showSuccess("Confirmed!");
              else showError("Cancelled!");
            }}
          >
            Trigger Confirm Dialog
          </Button>
        </div>
      </section>

      {/* Data Entry Section */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Data Entry</h2>
        <div style={{ maxWidth: "300px" }}>
          <p style={{ marginBottom: "1rem" }}>Selected Date: {date.toLocaleString()}</p>
          <DateTimePicker value={date} onChange={setDate} label="Select Date & Time" />
        </div>
      </section>

      {/* Navigation Section */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Pagination</h2>
        <p style={{ marginBottom: "1rem" }}>Current Page: {page}</p>
        <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
      </section>

      {/* Cards Section */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Cards</h2>
        <div style={rowStyle}>
          {/* Tournament Card */}
          <Card type="tournament" style={{ width: "300px", cursor: "pointer" }}>
            <CardIcon>🏆</CardIcon>
            <CardTitle type="tournament">Tournament Name</CardTitle>
            <CardDetails>
              📅 12. - 14. Dec 2025
              <br />
              👥 8 Teams
            </CardDetails>
            <CardStatus>
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#4ade80",
                  borderRadius: "50%",
                  marginRight: "0.5rem",
                  boxShadow: "0 0 0.5rem rgba(74, 222, 128, 0.6)",
                }}
              ></span>
              Ongoing
            </CardStatus>
          </Card>

          {/* Team Card */}
          <Card type="team" style={{ width: "300px", padding: "1rem" }}>
            <CardAvatar>T</CardAvatar>
            <CardTitle>Team Card</CardTitle>
            <p>This is a team card description.</p>
          </Card>

          {/* About Card */}
          <Card type="about" style={{ width: "300px", padding: "1rem" }}>
            <CardTopLine />
            <CardAvatar>LD</CardAvatar>
            <CardTitle>About Card</CardTitle>
            <CardRole>Lead Developer</CardRole>
            <CardText type="bio">Passionate about building great user experiences and robust applications.</CardText>
          </Card>

          {/* Motivation Card */}
          <Card type="motivation" style={{ width: "300px" }}>
            <CardTitle>Motivation</CardTitle>
            <CardText type="motivation">
              "Innovation distinguishes between a leader and a follower." - Steve Jobs
            </CardText>
          </Card>
        </div>
      </section>
    </div>
  );
}
