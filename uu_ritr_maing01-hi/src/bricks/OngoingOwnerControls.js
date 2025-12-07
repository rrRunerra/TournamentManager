import Calls from "../calls.js";
import "../styles/bricks/ownerControls.css"; // Reusing existing styles
import { useNotification } from "./NotificationProvider.js";
import { useConfirm } from "./ConfirmProvider.js";
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";

export default function OngoingOwnerControls({ info, id, setInfo, setRoute }) {
  const { showSuccess, showError } = useNotification();
  const { confirm } = useConfirm();
  const lsi = useLsi(importLsi, ["OngoingOwnerControls"]);

  return (
    <div className="owner-controls-panel" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h3 className="owner-controls-title">{lsi.title}</h3>
      <div className="owner-controls-actions" style={{ justifyContent: "center" }}>
        <button
          className="owner-controls-btn owner-controls-btn--primary"
          onClick={async () => {
            const confirmed = await confirm({
              title: lsi.endTournament,
              message: lsi.endTournamentMessage,
              confirmText: lsi.end,
              cancelText: lsi.cancel,
            });

            if (confirmed) {
              try {
                const response = await Calls.tournament.updateStatus({ id, status: "finished" });
                await Calls.player.incrementTournamentPlayedCount({ tournamentId: id });

                setInfo(response);
                showSuccess(lsi.tournamentEnded, lsi.tournamentEndedMessage);
              } catch (error) {
                console.error("Error ending tournament:", error);
                showError(lsi.endError, lsi.tryAgain);
              }
            }
          }}
        >
          {lsi.endTournament}
        </button>
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
    </div>
  );
}
