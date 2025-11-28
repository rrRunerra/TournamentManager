import Calls from "../calls.js"
import "../styles/ownerControls.css"
import { useNotification } from "./NotificationProvider.js"

export default function OwnerControls({ info, id, setInfo, setRoute, onTournamentStart }) {
  const { showSuccess, showError } = useNotification();

  return (
    <div className="owner-controls-panel">
      <h3 className="owner-controls-title">Ovládanie turnaja</h3>
      <div className="owner-controls-actions">
        {info.status === "upcoming" && (
          <button
            className="owner-controls-btn owner-controls-btn--primary"
            onClick={async () => {
              if (window.confirm("Spustiť tento turnaj? Tímy budú uzamknuté.")) {
                try {
                  await Calls.updateTournament({ id, status: "ongoing" });
                  setInfo(await Calls.getTournament({ id }));
                  if (onTournamentStart) {
                    await onTournamentStart();
                  }
                  showSuccess("Turnaj spustený!", "Tímy boli uzamknuté a turnaj bol spustený.");
                } catch (error) {
                  console.error("Error starting tournament:", error);
                  showError("Nepodarilo sa spustiť turnaj.", "Skúste to prosím znova.");
                }
              }
            }}
          >
            Spustiť turnaj
          </button>
        )}
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

      <div className="owner-controls-team-management">
        <h4>Spravovať tímy</h4>
        {info.teams.map(team => (
          <div key={team.id} className="owner-controls-team-management-item">
            <div className="owner-controls-team-info">
              <strong>{team.name}</strong>
              <span className="owner-controls-player-count">
                ({team.players?.length || 0}/{info.teamSize} hráčov)
              </span>
            </div>
            <button
              className="owner-controls-btn owner-controls-btn--outline"
              onClick={async () => {
                if (window.confirm(`Odstrániť tím "${team.name}"?`)) {
                  try {
                    await Calls.removeTeam({ tournamentId: id, teamId: team.id });
                    setInfo(await Calls.getTournament({ id }));
                  } catch (error) {
                    console.error("Error removing team:", error);
                    showError("Nepodarilo sa odstrániť tím.", "Skúste to prosím znova.");
                  }
                }
              }}
            >
              Odstrániť
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}