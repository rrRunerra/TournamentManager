import Calls from "../calls.js";
import "../styles/bricks/ownerControls.css";
import { useNotification } from "./NotificationProvider.js";
import { useConfirm } from "./ConfirmProvider.js";
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";

export default function OwnerControls({ info, id, setInfo, setRoute, onTournamentStart }) {
  const { showSuccess, showError } = useNotification();
  const { confirm } = useConfirm();
  const lsi = useLsi(importLsi, ["OwnerControls"]);

  return (
    <div className="owner-controls-panel">
      <h3 className="owner-controls-title">{lsi.title}</h3>
      <div className="owner-controls-actions">
        {info.status === "upcoming" && (
          <button
            className="owner-controls-btn owner-controls-btn--primary"
            onClick={async () => {
              const confirmed = await confirm({
                title: lsi.startTournament,
                message: lsi.startTournamentMessage,
                confirmText: lsi.start,
                cancelText: lsi.cancel,
              });

              if (confirmed) {
                try {
                  const response = await Calls.tournament.updateStatus({ id: id, status: "ongoing" });

                  setInfo(response);
                  if (onTournamentStart) {
                    await onTournamentStart();
                  }
                  showSuccess(lsi.tournamentStarted, lsi.tournamentStartedMessage);
                } catch (error) {
                  console.error("Error starting tournament:", error);
                  showError(lsi.startError, lsi.tryAgain);
                }
              }
            }}
          >
            {lsi.startTournament}
          </button>
        )}
        <button
          className="owner-controls-btn owner-controls-btn--danger"
          onClick={async () => {
            const confirmed = await confirm({
              title: lsi.deleteTournament,
              message: lsi.deleteTournamentMessage,
              confirmText: lsi.delete,
              cancelText: lsi.cancel,
              danger: true,
            });

            if (confirmed) {
              try {
                await Calls.tournament.delete({ id: id });

                showSuccess(lsi.tournamentDeleted, lsi.tournamentDeletedMessage);
                setRoute("tournaments");
              } catch (error) {
                console.error("Error deleting tournament:", error);
                showError(lsi.deleteError, lsi.tryAgain);
              }
            }
          }}
        >
          {lsi.deleteTournament}
        </button>
      </div>

      <div className="owner-controls-team-management">
        <h4>{lsi.manageTeams}</h4>
        {info.teams.map((team) => (
          <div key={team.id} className="owner-controls-team-management-item">
            <div className="owner-controls-team-info">
              <strong>{team.name}</strong>
              <span className="owner-controls-player-count">
                ({team.players?.length || 0}/{info.teamSize} {lsi.players})
              </span>
            </div>
            <button
              className="owner-controls-btn owner-controls-btn--outline"
              onClick={async () => {
                const confirmed = await confirm({
                  title: lsi.removeTeam,
                  message: `${lsi.removeTeamMessage} "${team.name}"?`,
                  confirmText: lsi.remove,
                  cancelText: lsi.cancel,
                  danger: true,
                });

                if (confirmed) {
                  try {
                    await Calls.team.remove({ tournamentId: id, teamId: team.id });

                    setInfo(await Calls.tournament.get({ id: id }));
                  } catch (error) {
                    console.error("Error removing team:", error);
                    showError(lsi.removeTeamError, lsi.tryAgain);
                  }
                }
              }}
            >
              {lsi.remove}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
