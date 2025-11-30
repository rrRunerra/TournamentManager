import React, { useState } from "react";
import "../styles/contactModal.css";

const ContactModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const [questionType, setQuestionType] = useState("Technický problém");
    const [otherQuestionType, setOtherQuestionType] = useState("");
    const [description, setDescription] = useState("");
    const [replyEmail, setReplyEmail] = useState(false);
    const [email, setEmail] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const finalQuestionType = questionType === "Iné" ? otherQuestionType : questionType;
        const subject = `[TournamentManager] Nová správa: ${finalQuestionType}`;

        const body = `
Meno: ${name}

Typ otázky: ${finalQuestionType}

Podrobný popis otázky: ${description}

${replyEmail ? `Mailová adresa: ${email}` : ""}
    `.trim();

        const mailtoLink = `mailto:lukassalaj12@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Use a hidden link to trigger the mailto action, which is often more reliable
        const link = document.createElement('a');
        link.href = mailtoLink;
        link.click();

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-header">Kontaktujte nás</h3>

                <form onSubmit={handleSubmit}>
                    {/* 1. Vaše meno */}
                    <div className="form-control">
                        <label>Vaše meno: *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* 2. Aký typ otázky máte? */}
                    <div className="form-control">
                        <label>Aký typ otázky máte? *</label>
                        <div className="radio-group">
                            {[
                                "Technický problém",
                                "Otázka o funkcii / použití stránky",
                                "Nápad / návrh na vylepšenie",
                                "Spolupráca / partnerstvo",
                                "Iné"
                            ].map((type) => (
                                <label key={type} className="radio-option">
                                    <input
                                        type="radio"
                                        name="questionType"
                                        value={type}
                                        checked={questionType === type}
                                        onChange={(e) => setQuestionType(e.target.value)}
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Iné - text input */}
                    {questionType === "Iné" && (
                        <div className="form-control">
                            <label>Špecifikujte iné:</label>
                            <input
                                type="text"
                                value={otherQuestionType}
                                onChange={(e) => setOtherQuestionType(e.target.value)}
                                placeholder="Prosím uveďte..."
                            />
                        </div>
                    )}

                    {/* 3. Podrobný popis */}
                    <div className="form-control">
                        <label>Prosím, uveďte podrobný popis vašej otázky, problému alebo návrhu: *</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    {/* 4. Odpoveď e-mailom */}
                    <div className="form-control">
                        <label className="checkbox-group">
                            <input
                                type="checkbox"
                                checked={replyEmail}
                                onChange={(e) => setReplyEmail(e.target.checked)}
                            />
                            Chcete, aby sme vám odpovedali e‑mailom?
                        </label>

                        {replyEmail && (
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Zadajte svoju e-mailovú adresu"
                                required={replyEmail}
                                style={{ marginTop: '8px' }}
                            />
                        )}
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Zrušiť
                        </button>
                        <button type="submit" className="btn-submit">
                            Odoslať
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactModal;
