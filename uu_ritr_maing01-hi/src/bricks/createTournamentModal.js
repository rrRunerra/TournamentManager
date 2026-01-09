import { useState, useEffect, useRef } from "react";
import "../styles/bricks/createTournamentModal.css";
import { useNotification } from "../hooks/useNotification.js";
import { useLsi, useLanguage } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import Calls from "../calls.js";
import useUser from "../hooks/useUser.js";
import DateTimePicker from "./components/input/DateTimePicker.js";
import Input from "./components/ui/Input.js";
import { Button } from "./components/ui/Button.js";
import Select from "./components/ui/Select.js";
import MultiSelect from "./components/ui/MultiSelect.js";
import GridPlaceholder from "./components/ui/GridPlaceholder.js";
import Combobox from "./components/ui/Combobox.js";

export default function CreateModal({ isOpen, onClose, onSave, owner }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamSize, setTeamSize] = useState("4");
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [bracketType, setBracketType] = useState("single");
  const { showError } = useNotification();
  const lsi = useLsi(importLsi, ["CreateTournament"]);
  const [user, setUser] = useUser();
  const descriptionRef = useRef(null);
  const [lang] = useLanguage();
  const [classes, setClasses] = useState([]);
  const [classRoom, setClassRoom] = useState("");
  const [userClassRooms, setUserClassRooms] = useState([]);

  // Auto-resize description textarea
  useEffect(() => {
    if (currentStep === 1 && descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
    }
  }, [description, currentStep]);

  // Check if user is teacher in db
  useEffect(() => {
    if (!isOpen) return;

    if (user) {
      try {
        Calls.player
          .get({ id: user.id })
          .then((pDb) => {
            if (pDb.role.toLowerCase() !== "teacher" && pDb.role.toLowerCase() !== "admin") {
              showError(lsi.errorTitle, lsi.errorUnauthorized);
              onClose();
            }
            setClasses(pDb.classes);
            setUserClassRooms(pDb.classRooms);
          })
          .catch((error) => {
            console.error("Failed to verify user role:", error);
          });
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    }
  }, [isOpen, lsi, showError, onClose, user]);

  // Reset state when modal is closed or opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      // Optional: Reset other fields if needed when reopening,
      // but usually keeping draft state is fine until save.
      // If complete reset is desired on open, do it here.
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const addTeam = () => {
    if (!teamName.trim()) return;
    setTeams([...teams, { name: teamName.trim(), allowedClasses: [] }]);
    setTeamName("");
  };

  const updateTeam = (index, newData) => {
    const newTeams = [...teams];
    newTeams[index] = { ...newTeams[index], ...newData };
    setTeams(newTeams);
  };

  const removeTeam = (index) => {
    setTeams(teams.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    // Validation for current step
    if (currentStep === 1) {
      if (!name.trim()) {
        showError(lsi.errorTitle, lsi.errorName);
        return;
      }
      if (!description.trim()) {
        showError(lsi.errorTitle, lsi.errorDescription);
        return;
      }
    } else if (currentStep === 2) {
      if (!startDate) {
        showError(lsi.errorTitle, lsi.errorStartDate);
        return;
      }
      if (!endDate) {
        showError(lsi.errorTitle, lsi.errorEndDate);
        return;
      }
      if (startDate > endDate) {
        showError(lsi.errorTitle, lsi.errorInvalidDate);
        return;
      }
    } else if (currentStep === 3) {
      if (!teamSize) {
        showError(lsi.errorTitle, lsi.errorTeamSize);
        return;
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFinalSave = () => {
    // Final Step Validation (Step 4)
    if (teams.length < 3) {
      showError(lsi.errorTitle, lsi.errorTeams);
      return;
    }
    if (bracketType === "robin" && teams.length % 2 === 1) {
      showError(lsi.errorTitle, lsi.errorRobin);
      return;
    }
    if (bracketType === "double" && teams.length % 4 !== 0) {
      showError(lsi.errorTitle, lsi.errorDouble);
      return;
    }

    onSave({ name, description, startDate, endDate, teamSize, teams, owner, bracketType, classRoom });
    handleClose();
  };

  const handleClose = () => {
    onClose();
    // Reset form state
    setCurrentStep(1);
    setTeams([]);
    setTeamName("");
    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setTeamSize("4");
    setBracketType("single");
    setClassRoom("");
    setClasses("");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Input label={lsi.name} type="text" value={name} onChange={setName} required autoFocus />

            <Input
              label={lsi.description}
              type="textarea"
              inputRef={descriptionRef}
              value={description}
              onChange={setDescription}
              required
              style={{ overflow: "hidden" }}
            />
            <Combobox
              label={lsi.classRoom}
              value={classRoom}
              onChange={setClassRoom}
              options={(userClassRooms || []).map((c) => c.name).sort((a, b) => a.localeCompare(b))}
              required
            />
          </>
        );
      case 2:
        return (
          <>
            <DateTimePicker label={lsi.startDate} value={startDate} onChange={setStartDate} locale={lang} />

            <DateTimePicker label={lsi.endDate} value={endDate} onChange={setEndDate} locale={lang} direction="up" />
          </>
        );
      case 3:
        return (
          <>
            <Select
              label={lsi.bracketType}
              value={bracketType}
              onChange={setBracketType}
              options={[
                { value: "single", label: lsi.singleElimination },
                { value: "double", label: lsi.doubleElimination },
                { value: "robin", label: lsi.roundRobin },
              ]}
            />

            <label style={{ color: "#e0e0e0" }}>{lsi.teamSize}</label>
            <Input type="number" value={teamSize} onChange={setTeamSize} min="1" required />
          </>
        );
      case 4:
        return (
          <>
            <label style={{ color: "#e0e0e0" }}>{lsi.teams}</label>
            <div className="helper-text">
              {bracketType === "single" && (lsi.helperSingle || "Minimum 3 teams required.")}
              {bracketType === "double" && (lsi.helperDouble || "Number of teams must be a multiple of 4.")}
              {bracketType === "robin" && (lsi.helperRobin || "Number of teams must be a multiple of 2.")}
            </div>
            <div className="team-input-container">
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Input
                  type="text"
                  value={teamName}
                  onChange={setTeamName}
                  placeholder={lsi.teamPlaceholder}
                  className="team-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addTeam();
                  }}
                  noMargin
                />
                <Button onClick={addTeam} type="primary-fill" style={{ height: "fit-content", alignSelf: "flex-end" }}>
                  {lsi.add}
                </Button>
              </div>
            </div>

            <ul className="teams-list">
              {teams.map((team, index) => (
                <li key={index} className="team-item">
                  <div className="team-info">
                    <span className="team-name">{team.name}</span>
                    <MultiSelect
                      value={team.allowedClasses || []}
                      onChange={(newClasses) => updateTeam(index, { allowedClasses: newClasses })}
                      options={classes.map((c) => ({ value: c.short, label: c.short }))}
                      noMargin
                      minimal
                    />
                  </div>
                  <Button onClick={() => removeTeam(index)} type="danger" size="small">
                    ✕
                  </Button>
                </li>
              ))}
              {(() => {
                let placeholdersNeeded = 0;
                const count = teams.length;

                if (bracketType === "single") {
                  if (count < 3) {
                    placeholdersNeeded = 3 - count;
                  }
                } else if (bracketType === "double") {
                  const remainder = count % 4;
                  placeholdersNeeded = 4 - remainder;
                } else if (bracketType === "robin") {
                  const remainder = count % 2;
                  placeholdersNeeded = 2 - remainder;
                }

                return Array.from({ length: placeholdersNeeded }).map((_, i) => (
                  <li key={`placeholder-${i}`} className="team-item placeholder">
                    <GridPlaceholder type="3x1" className="team-placeholder" />
                  </li>
                ));
              })()}
            </ul>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className={`modal-content ${currentStep === 4 ? "modal-content-large" : ""}`}>
        <h3 className="modal-header">
          {lsi.header} - {lsi.step || "Step"} {currentStep}/4
        </h3>

        <div className="modal-body">{renderStepContent()}</div>

        <div className="modal-actions">
          {currentStep > 1 && (
            <Button onClick={handleBack} type="secondary">
              {lsi.back || "Back"}
            </Button>
          )}

          <Button onClick={handleClose} type="secondary">
            {lsi.cancel}
          </Button>

          {currentStep < 4 ? (
            <Button onClick={handleNext} type="primary-fill">
              {lsi.next || "Next"}
            </Button>
          ) : (
            <Button onClick={handleFinalSave} type="primary-fill">
              {lsi.save}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
