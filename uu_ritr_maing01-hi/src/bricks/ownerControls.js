import Calls from "../calls.js"
import "../styles/ownerControls.css"

export default function OwnerControls({ info, id, setInfo, setRoute, onTournamentStart }) {
  return (
    <div className="owner-controls-panel">
      <h3 className="owner-controls-title">Tournament Controls</h3>
      <div className="owner-controls-actions">
        {info.status === "upcoming" && (
          <button
            className="owner-controls-btn owner-controls-btn--primary"
            onClick={async () => {
              if (window.confirm("Start this tournament? Teams will be locked.")) {
                try {
                  await Calls.updateTournament({ id, status: "ongoing" });
                  setInfo(await Calls.getTournament({ id }));
                  if (onTournamentStart) {
                    await onTournamentStart();
                  }
                  alert("Tournament started!");
                } catch (error) {
                  console.error("Error starting tournament:", error);
                  alert("Failed to start tournament.");
                }
              }
            }}
          >
            Start Tournament
          </button>
        )}
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

      <div className="owner-controls-team-management">
        <h4>Manage Teams</h4>
        {info.teams.map(team => (
          <div key={team.id} className="owner-controls-team-management-item">
            <div className="owner-controls-team-info">
              <strong>{team.name}</strong>
              <span className="owner-controls-player-count">
                ({team.players?.length || 0}/{info.teamSize} players)
              </span>
            </div>
            <button
              className="owner-controls-btn owner-controls-btn--outline"
              onClick={async () => {
                if (window.confirm(`Remove team "${team.name}"?`)) {
                  try {
                    await Calls.removeTeam({ tournamentId: id, teamId: team.id });
                    setInfo(await Calls.getTournament({ id }));
                  } catch (error) {
                    console.error("Error removing team:", error);
                    alert("Failed to remove team.");
                  }
                }
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}