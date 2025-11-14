import Calls from "../calls.js"
import "../styles/ownerControls.css"

export default function OwnerControls({ info, id, setInfo, setRoute }) {
    return ( 
        <div className="owner-panel">
          <h3 className="owner-title">Tournament Controls</h3>
          <div className="owner-actions">
            {info.status == "upcoming" && (
              <button
                className="btn btn-primary"
                onClick={async () => {
                  if (window.confirm("Start this tournament? Teams will be locked.")) {
                    try {
                      await Calls.updateTournament({ id, status: "ongoing" });

                      setInfo(await Calls.getTournament({ id }));
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
              className="btn btn-danger"
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

          <div className="team-management">
            <h4>Manage Teams</h4>
            {info.teams.map(team => (
              <div key={team.id} className="team-management-item">
                <div className="team-info">
                  <strong>{team.name}</strong>
                  <span className="player-count">({team.players?.length || 0}/{info.teamSize} players)</span>
                </div>
                <button
                  className="btn btn-small btn-outline"
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