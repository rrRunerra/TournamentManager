import { useState, useEffect } from "react";
import Calls from "../calls.js";
import "../styles/bricks/ownerControls.css";
import { useNotification } from "../hooks/useNotification.js";
import { useConfirm } from "./components/confirm/ConfirmProvider.js";
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import { Button } from "./components/ui/Button.js";
import { ScrollContainer } from "./components/ui/ScrollContainer.js";

export default function OwnerControls({ info, id, setInfo, setRoute, onTournamentStart }) {
  const { showSuccess, showError } = useNotification();
  const { confirm } = useConfirm();
  const lsi = useLsi(importLsi, ["OwnerControls"]);
  const [playersData, setPlayersData] = useState({});

  useEffect(() => {
    async function fetchPlayers() {
      const uniquePlayerIds = new Set();
      info.teams.forEach((team) => {
        if (team.players) {
          team.players.forEach((playerId) => uniquePlayerIds.add(playerId));
        }
      });

      if (uniquePlayerIds.size === 0) return;

      const newPlayersData = { ...playersData };
      const promises = [];

      uniquePlayerIds.forEach((playerId) => {
        if (!newPlayersData[playerId]) {
          promises.push(
            Calls.player
              .get({ id: playerId })
              .then((data) => {
                newPlayersData[playerId] = data.name || data.username || "Unknown";
              })
              .catch(() => {
                newPlayersData[playerId] = "Unknown";
              }),
          );
        }
      });

      if (promises.length > 0) {
        await Promise.all(promises);
        setPlayersData(newPlayersData);
      }
    }

    fetchPlayers();
  }, [info.teams]);

  return (
    <div className="owner-controls-panel">
      <h3 className="owner-controls-title">{lsi.title}</h3>
      <div className="owner-controls-actions">
        {info.status === "upcoming" && (
          <Button
            type="primary-fill"
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
          </Button>
        )}
        <Button
          type="danger"
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
        </Button>
      </div>

      <div className="owner-controls-team-management">
        <h4>{lsi.manageTeams}</h4>
        <ScrollContainer maxHeight={350}>
          {info.teams.map((team) => (
            <div key={team.id} className="owner-controls-team-management-item">
              <div className="owner-controls-team-info">
                <strong>{team.name}</strong>
                <span className="owner-controls-player-count">
                  ({team.players?.length || 0}/{info.teamSize} {lsi.players})
                </span>
                {team.players && team.players.length > 0 && (
                  <div className="owner-controls-player-list">
                    {team.players.map((playerId) => (
                      <span
                        key={playerId}
                        className="owner-controls-player-badge clickable"
                        title={lsi.removePlayer || "Remove player"}
                        onClick={async () => {
                          const playerName = playersData[playerId] || "Unknown";
                          const confirmed = await confirm({
                            title: lsi.removePlayer || "Remove Player",
                            message: `${lsi.removePlayerMessage || "Are you sure you want to remove"} "${playerName}" ${lsi.fromTeam || "from"} "${team.name}"?`,
                            confirmText: lsi.remove,
                            cancelText: lsi.cancel,
                            danger: true,
                          });

                          if (confirmed) {
                            try {
                              await Calls.team.removePlayer({
                                teamId: team.id,
                                playerId: playerId,
                              });

                              setInfo(await Calls.tournament.get({ id: id }));
                              showSuccess(
                                lsi.playerRemoved || "Player removed",
                                lsi.playerRemovedMessage || "Player has been removed from the team.",
                              );
                            } catch (error) {
                              console.error("Error removing player:", error);
                              showError(lsi.removePlayerError || "Error removing player", lsi.tryAgain);
                            }
                          }
                        }}
                      >
                        {playersData[playerId] || "Loading..."} ✕
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Button
                type="primary-outline"
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
              </Button>
            </div>
          ))}
        </ScrollContainer>
      </div>
    </div>
  );
}
