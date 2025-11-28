import Calls from "../calls.js";
import "../styles/ownerControls.css"; // Reusing existing styles
import { useNotification } from "./NotificationProvider.js";

export default function OngoingOwnerControls({ info, id, setInfo, setRoute }) {
    const { showSuccess, showError } = useNotification();

    return (
        <div className="owner-controls-panel" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h3 className="owner-controls-title">Ovládanie turnaja</h3>
            <div className="owner-controls-actions" style={{ justifyContent: "center" }}>
                <button
                    className="owner-controls-btn owner-controls-btn--primary"
                    onClick={async () => {
                        if (window.confirm("Ukončiť tento turnaj? Toto ho označí ako dokončený.")) {
                            try {
                                await Calls.updateTournament({ id, status: "finished" });
                                setInfo(await Calls.getTournament({ id }));
                                showSuccess("Turnaj ukončený!", "Turnaj bol úspešne dokončený.");
                            } catch (error) {
                                console.error("Error ending tournament:", error);
                                showError("Nepodarilo sa ukončiť turnaj.", "Skúste to prosím znova.");
                            }
                        }
                    }}
                >
                    Ukončiť turnaj
                </button>
                <button
                    className="owner-controls-btn owner-controls-btn--danger"
                    onClick={async () => {
                        if (window.confirm("Vymazať tento turnaj? Táto akcia je nevratná.")) {
                            try {
                                await Calls.deleteTournament({ id });
                                showSuccess("Turnaj vymazaný!", "Turnaj bol úspešne odstránený.");
                                setRoute("tournaments");
                            } catch (error) {
                                console.error("Error deleting tournament:", error);
                                showError("Nepodarilo sa vymazať turnaj.", "Skúste to prosím znova.");
                            }
                        }
                    }}
                >
                    Vymazať turnaj
                </button>
            </div>
        </div>
    );
}
