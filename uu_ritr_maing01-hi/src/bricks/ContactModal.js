import { useState, useRef, useEffect } from "react";
import "../styles/bricks/createTournamentModal.css";
import { useNotification } from "./NotificationProvider.js";
import { useLsi, useRoute } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import emailjs from "emailjs-com";
import { Button } from "./atom/Button.js";

const MIN_SUBMIT_TIME = 3000;
const MAX_DESCRIPTION_LENGTH = 2000;
const COOLDOWN_TIME = 10 * 60 * 1000;
const LAST_SEND_KEY = "contactFormLastSend";

export default function ContactModal({ isOpen, onClose }) {
    const [name, setName] = useState("");
    const [questionType, setQuestionType] = useState("technical");
    const [otherType, setOtherType] = useState("");
    const [description, setDescription] = useState("");
    const [replyByEmail, setReplyByEmail] = useState(false);
    const [email, setEmail] = useState("");
    const [openedAt, setOpenedAt] = useState(Date.now());

    const { showError, showSuccess } = useNotification();
    const lsi = useLsi(importLsi, ["ContactModal"]);
    const [, setRoute] = useRoute();
    const descriptionRef = useRef(null);

    // Auto-resize textarea + reset open time
    useEffect(() => {
        if (isOpen && descriptionRef.current) {
            descriptionRef.current.style.height = "auto";
            descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
            setOpenedAt(Date.now());
        }
    }, [description, isOpen]);

    // Reset form on close
    useEffect(() => {
        if (!isOpen) {
            setName("");
            setQuestionType("technical");
            setOtherType("");
            setDescription("");
            setReplyByEmail(false);
            setEmail("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSend = () => {
        // ⛔ Cooldown check
        const lastSend = localStorage.getItem(LAST_SEND_KEY);
        if (lastSend && Date.now() - Number(lastSend) < COOLDOWN_TIME) {
            const remaining = Math.ceil(
                (COOLDOWN_TIME - (Date.now() - Number(lastSend))) / 60000
            );
            showError(
                lsi.errorTitle,
                `Formulár bol nedávno odoslaný. Skús to znova o ${remaining} minút.`
            );
            return;
        }

        // ⏱️ Anti-bot time limit
        if (Date.now() - openedAt < MIN_SUBMIT_TIME) {
            showError(lsi.errorTitle, "Formulár bol odoslaný príliš rýchlo.");
            return;
        }

        // 🎰 Easter egg
        if (questionType === "other" && otherType.toLowerCase().includes("hesoyam")) {
            setRoute("casino");
            onClose();
            return;
        }

        // Validation
        if (!name.trim()) {
            showError(lsi.errorTitle, lsi.errorName);
            return;
        }

        if (!description.trim()) {
            showError(lsi.errorTitle, lsi.errorDescription);
            return;
        }

        if (description.length > MAX_DESCRIPTION_LENGTH) {
            showError(
                lsi.errorTitle,
                `Správa je príliš dlhá (max. ${MAX_DESCRIPTION_LENGTH} znakov).`
            );
            return;
        }

        if (replyByEmail && !email.trim()) {
            showError(lsi.errorTitle, lsi.errorEmail);
            return;
        }

        const typeLabel =
            questionType === "other"
                ? `${lsi.typeOther} ${otherType}`
                : getQuestionTypeLabel(questionType, lsi);

        const templateParams = {
            name: name,
            question_type: typeLabel,
            description: description,
            email: replyByEmail ? email : ""
        };

        emailjs
            .send(
                "service_mekjy8j",
                "template_xp66azq",
                templateParams,
                "KvZ1fkPgcBSFTuJDw"
            )
            .then(() => {
                localStorage.setItem(LAST_SEND_KEY, Date.now().toString());
                showSuccess(lsi.successTitle, lsi.successMessage);
                onClose();
            })
            .catch((err) => {
                console.error("EmailJS error:", err);
                showError(lsi.errorTitle, lsi.errorSend);
            });
    };

    const getQuestionTypeLabel = (type, lsi) => {
        switch (type) {
            case "technical": return lsi.typeTechnical;
            case "function": return lsi.typeFunction;
            case "idea": return lsi.typeIdea;
            case "partnership": return lsi.typePartnership;
            case "other": return lsi.typeOther;
            default: return type;
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content contact-modal" style={{ maxWidth: "600px" }}>
                <h3 className="modal-header">{lsi.header}</h3>

                <div className="modal-body">
                    <label>{lsi.name}</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        autoFocus
                    />

                    <label style={{ marginTop: "16px" }}>{lsi.questionType}</label>
                    <div className="radio-group">
                        <label><input type="radio" value="technical" checked={questionType === "technical"} onChange={(e) => setQuestionType(e.target.value)} /> {lsi.typeTechnical}</label>
                        <label><input type="radio" value="function" checked={questionType === "function"} onChange={(e) => setQuestionType(e.target.value)} /> {lsi.typeFunction}</label>
                        <label><input type="radio" value="idea" checked={questionType === "idea"} onChange={(e) => setQuestionType(e.target.value)} /> {lsi.typeIdea}</label>
                        <label><input type="radio" value="partnership" checked={questionType === "partnership"} onChange={(e) => setQuestionType(e.target.value)} /> {lsi.typePartnership}</label>
                        <label><input type="radio" value="other" checked={questionType === "other"} onChange={(e) => setQuestionType(e.target.value)} /> {lsi.typeOther}</label>
                    </div>

                    {questionType === "other" && (
                        <input
                            type="text"
                            value={otherType}
                            onChange={(e) => setOtherType(e.target.value)}
                            placeholder={lsi.typeOtherPlaceholder}
                            className="form-control"
                            style={{ marginTop: "8px" }}
                        />
                    )}

                    <label style={{ marginTop: "16px" }}>
                        {lsi.description} ({description.length}/{MAX_DESCRIPTION_LENGTH})
                    </label>
                    <textarea
                        ref={descriptionRef}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-control"
                        style={{ minHeight: "100px" }}
                    />

                    <div style={{ marginTop: "16px" }}>
                        <label>
                            <input
                                type="checkbox"
                                checked={replyByEmail}
                                onChange={(e) => setReplyByEmail(e.target.checked)}
                                style={{ marginRight: "8px" }}
                            />
                            {lsi.replyEmailQuestion}
                        </label>
                    </div>

                    {replyByEmail && (
                        <div style={{ marginTop: "8px" }}>
                            <label>{lsi.emailLabel}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <Button onClick={onClose} type="secondary">
                        {lsi.cancel}
                    </Button>
                    <Button onClick={handleSend} type="primary-fill">
                        {lsi.send}
                    </Button>
                </div>
            </div>
        </div>
    );
}
