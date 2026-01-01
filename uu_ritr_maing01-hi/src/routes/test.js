import React, { useState } from "react";
import { Button } from "../bricks/components/ui/Button.js";
import { useNotification } from "../hooks/useNotification.js";
import { useConfirm } from "../bricks/components/confirm/ConfirmProvider.js";
import Pagination from "../bricks/pagination.js";
import DateTimePicker from "../bricks/components/input/DateTimePicker.js";
import WelcomeRow from "../bricks/welcome-row.js";
import CasinoPage from "./casino.js";
import Calls from "../calls";
import Grid from "../bricks/components/ui/Grid.js";
import Input from "../bricks/components/ui/Input.js";
import Select from "../bricks/components/ui/Select.js";
import MultiSelect from "../bricks/components/ui/MultiSelect.js";
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
  CardDescription,
  CardFooter,
} from "../bricks/components/ui/Card.js";
import { ScrollContainer } from "../bricks/components/ui/ScrollContainer.js";

export default function TestPage(props) {
  const { showSuccess, showError } = useNotification();
  const { confirm } = useConfirm();
  const [page, setPage] = useState(1);
  const [date, setDate] = useState(new Date());
  const [textInput, setTextInput] = useState("");
  const [numberInput, setNumberInput] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [multiSelectValue, setMultiSelectValue] = useState([]);

  const selectOptions = [
    { value: "single", label: "Single Elimination" },
    { value: "double", label: "Double Elimination" },
    { value: "round-robin", label: "Round Robin" },
  ];

  const multiSelectOptions = [
    { value: "1A", label: "Class 1.A" },
    { value: "1B", label: "Class 1.B" },
    { value: "2A", label: "Class 2.A" },
    { value: "2B", label: "Class 2.B" },
    { value: "3A", label: "Class 3.A" },
  ];

  const id = props.qwerty || new URLSearchParams(window.location.search).get("%E2%80%8B%E2%80%8D%E2%81%A0%E2%80%AE");

  if (id == "%F0%9F%91%A8%E2%80%8D%F0%9F%91%A9%E2%80%8D%F0%9F%91%A7%E2%80%8D%F0%9F%91%A6") {
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
        <p style={{ marginBottom: "1rem", color: "#888" }}>
          Available types: primary-fill, primary-outline, secondary, danger, success, info, fab-primary
        </p>
        <div style={rowStyle}>
          <Button type="primary-fill">Primary Fill</Button>
          <Button type="primary-outline">Primary Outline</Button>
          <Button type="secondary">Secondary</Button>
          <Button type="danger">Danger</Button>
          <Button type="success">Success</Button>
          <Button type="info">Info</Button>
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <p style={{ marginBottom: "0.5rem", color: "#aaa" }}>Size Variants</p>
          <div style={rowStyle}>
            <Button type="primary-fill" size="medium">
              Medium (default)
            </Button>
            <Button type="primary-fill" size="small">
              Small
            </Button>
          </div>
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <p style={{ marginBottom: "0.5rem", color: "#aaa" }}>Disabled State</p>
          <div style={rowStyle}>
            <Button type="primary-fill" disabled>
              Disabled
            </Button>
            <Button type="danger" disabled>
              Disabled Danger
            </Button>
          </div>
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <p style={{ marginBottom: "0.5rem", color: "#aaa" }}>Floating Action Button (FAB)</p>
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

      {/* Grid Section */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Grid</h2>
        <p style={{ marginBottom: "1rem", color: "#888" }}>Responsive grid layouts with different configurations</p>
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ marginBottom: "0.5rem", color: "#aaa" }}>Default Grid</p>
          <Grid type="default">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ padding: "1rem", background: "#252525", borderRadius: "8px", textAlign: "center" }}>
                Item {i}
              </div>
            ))}
          </Grid>
        </div>
      </section>

      {/* Input Components Section */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Input Components</h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "280px" }}>
            <h3 style={{ color: "#aaa", marginBottom: "1rem", fontSize: "1rem" }}>Text Input</h3>
            <Input
              type="text"
              label="Username"
              value={textInput}
              onChange={setTextInput}
              placeholder="Enter your username..."
            />
            <p style={{ color: "#666", fontSize: "0.85rem" }}>Value: "{textInput}"</p>
          </div>
          <div style={{ flex: "1", minWidth: "280px" }}>
            <h3 style={{ color: "#aaa", marginBottom: "1rem", fontSize: "1rem" }}>Number Input</h3>
            <Input
              type="number"
              label="Team Size"
              value={numberInput}
              onChange={setNumberInput}
              placeholder="Enter team size..."
              min={1}
              max={10}
            />
            <p style={{ color: "#666", fontSize: "0.85rem" }}>Value: "{numberInput}"</p>
          </div>
          <div style={{ flex: "1", minWidth: "280px" }}>
            <h3 style={{ color: "#aaa", marginBottom: "1rem", fontSize: "1rem" }}>Textarea</h3>
            <Input
              type="textarea"
              label="Description"
              value={textInput}
              onChange={setTextInput}
              placeholder="Enter description..."
            />
          </div>
        </div>
      </section>

      {/* Select Components Section */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Select Components</h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "280px" }}>
            <h3 style={{ color: "#aaa", marginBottom: "1rem", fontSize: "1rem" }}>Single Select</h3>
            <Select label="Bracket Type" value={selectValue} onChange={setSelectValue} options={selectOptions} />
            <p style={{ color: "#666", fontSize: "0.85rem" }}>Selected: "{selectValue}"</p>
          </div>
          <div style={{ flex: "1", minWidth: "280px" }}>
            <h3 style={{ color: "#aaa", marginBottom: "1rem", fontSize: "1rem" }}>Multi Select</h3>
            <MultiSelect
              label="Allowed Classes"
              value={multiSelectValue}
              onChange={setMultiSelectValue}
              options={multiSelectOptions}
            />
            <p style={{ color: "#666", fontSize: "0.85rem" }}>Selected: [{multiSelectValue.join(", ")}]</p>
          </div>
          <div style={{ flex: "1", minWidth: "280px" }}>
            <h3 style={{ color: "#aaa", marginBottom: "1rem", fontSize: "1rem" }}>Minimal Multi Select</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <MultiSelect
                value={multiSelectValue}
                onChange={setMultiSelectValue}
                options={multiSelectOptions}
                minimal
              />
              <span style={{ color: "#666" }}>Icon-only variant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Cards</h2>
        <p style={{ marginBottom: "1rem", color: "#888" }}>
          Available types: tournament, team, about, motivation, navbar
        </p>
        <div style={{ ...rowStyle, alignItems: "flex-start" }}>
          {/* Tournament Card */}
          <Card type="tournament" style={{ width: "280px", cursor: "pointer" }}>
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
          <Card type="team" style={{ width: "280px", padding: "1rem" }}>
            <CardAvatar>T</CardAvatar>
            <CardTitle>Team Alpha</CardTitle>
            <CardDescription>A competitive team ready for action.</CardDescription>
            <CardFooter>4/4 Players</CardFooter>
          </Card>

          {/* About Card */}
          <Card type="about" style={{ width: "280px", padding: "1rem" }}>
            <CardTopLine />
            <CardAvatar>LD</CardAvatar>
            <CardTitle>About Card</CardTitle>
            <CardRole>Lead Developer</CardRole>
            <CardText type="bio">Passionate about building great user experiences.</CardText>
          </Card>

          {/* Motivation Card */}
          <Card type="motivation" style={{ width: "280px" }}>
            <CardTitle>Motivation</CardTitle>
            <CardText type="motivation">
              "Innovation distinguishes between a leader and a follower." - Steve Jobs
            </CardText>
          </Card>

          {/* Navbar Card */}
          <Card type="navbar" style={{ width: "280px", padding: "1rem" }}>
            <CardTitle>Navbar Card</CardTitle>
            <CardText>Used for navigation-related components.</CardText>
          </Card>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ color: "#aaa", marginBottom: "1rem", fontSize: "1rem" }}>Card Subcomponents</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", color: "#666", fontSize: "0.9rem" }}>
            <code style={{ background: "#252525", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>CardTitle</code>
            <code style={{ background: "#252525", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>CardTopLine</code>
            <code style={{ background: "#252525", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>CardAvatar</code>
            <code style={{ background: "#252525", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>CardRole</code>
            <code style={{ background: "#252525", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>CardText</code>
            <code style={{ background: "#252525", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>CardIcon</code>
            <code style={{ background: "#252525", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>CardDetails</code>
            <code style={{ background: "#252525", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>CardStatus</code>
            <code style={{ background: "#252525", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
              CardDescription
            </code>
            <code style={{ background: "#252525", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>CardFooter</code>
          </div>
        </div>
      </section>

      {/* Scroll Container Section */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Scroll Container</h2>
        <p style={{ marginBottom: "1rem", color: "#888" }}>
          A reusable scrollable container with custom themed scrollbar
        </p>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ marginBottom: "0.5rem", color: "#aaa" }}>maxHeight={200}</p>
            <ScrollContainer
              maxHeight={200}
              style={{ width: "300px", background: "#141414", padding: "1rem", borderRadius: "8px" }}
            >
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    padding: "0.75rem",
                    marginBottom: "0.5rem",
                    background: "#1a1a1a",
                    borderRadius: "6px",
                    border: "1px solid #333",
                  }}
                >
                  Item {i + 1}
                </div>
              ))}
            </ScrollContainer>
          </div>
          <div>
            <p style={{ marginBottom: "0.5rem", color: "#aaa" }}>maxHeight={300}</p>
            <ScrollContainer
              maxHeight={300}
              style={{ width: "300px", background: "#141414", padding: "1rem", borderRadius: "8px" }}
            >
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    padding: "0.75rem",
                    marginBottom: "0.5rem",
                    background: "#1a1a1a",
                    borderRadius: "6px",
                    border: "1px solid #333",
                  }}
                >
                  Team {i + 1} - (0/4 players)
                </div>
              ))}
            </ScrollContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
