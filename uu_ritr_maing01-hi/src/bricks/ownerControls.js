import Calls from "../calls.js"
import "../styles/ownerControls.css"
import { useNotification } from "./NotificationProvider.js"
import { useConfirm } from "./ConfirmProvider.js"

export default function OwnerControls({ info, id, setInfo, setRoute, onTournamentStart }) {
  const { showSuccess, showError } = useNotification();
  const { confirm } = useConfirm();

  return (
    <div className="owner-controls-panel">
      <h3 className="owner-controls-title">Ovládanie turnaja</h3>
      <div className="owner-controls-actions">
        {info.status === "upcoming" && (
          <button
            className="owner-controls-btn owner-controls-btn--primary"
            onClick={async () => {
              const confirmed = await confirm({
                title: "Spustiť turnaj",
                message: "Spustiť tento turnaj? Tímy budú uzamknuté.",
                confirmText: "Spustiť",
                cancelText: "Zrušiť"
              });

              if (confirmed) {
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
            const confirmed = await confirm({
              title: "Vymazať turnaj",
              message: "Vymazať tento turnaj? Táto akcia je nevratná.",
              confirmText: "Vymazať",
              cancelText: "Zrušiť",
              danger: true
            });

            if (confirmed) {
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
                const confirmed = await confirm({
                  title: "Odstrániť tím",
                  message: `Odstrániť tím "${team.name}"?`,
                  confirmText: "Odstrániť",
                  cancelText: "Zrušiť",
                  danger: true
                });

                if (confirmed) {
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