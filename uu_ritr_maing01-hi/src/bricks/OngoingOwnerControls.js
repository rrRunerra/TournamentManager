import Calls from "../calls.js";
import "../styles/ownerControls.css"; // Reusing existing styles

export default function OngoingOwnerControls({ info, id, setInfo, setRoute }) {
    return (
        <div className="owner-controls-panel" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h3 className="owner-controls-title">Tournament Controls</h3>
            <div className="owner-controls-actions" style={{ justifyContent: "center" }}>
                <button
                    className="owner-controls-btn owner-controls-btn--primary"
                    onClick={async () => {
                        if (window.confirm("End this tournament? This will mark it as finished.")) {
                            try {
                                await Calls.updateTournament({ id, status: "finished" });
                                setInfo(await Calls.getTournament({ id }));
                                alert("Tournament ended!");
                            } catch (error) {
                                console.error("Error ending tournament:", error);
                                alert("Failed to end tournament.");
                            }
                        }
                    }}
                >
                    End Tournament
                </button>
                <button
                    className="owner-controls-btn owner-controls-btn--danger"
                    onClick={async () => {
                        if (window.confirm("Delete this tournament? This cannot be undone.")) {
                            try {
                                await Calls.deleteTournament({ id });
                                alert("Tournament deleted!");
                                setRoute("tournaments");
                            } catch (error) {
                                console.error("Error deleting tournament:", error);
                                alert("Failed to delete tournament.");
                            }
                        }
                    }}
                >
                    Delete Tournament
                </button>
            </div>
        </div>
    );
}
