import { useEffect, useState } from "react";
import "../../styles/bricks/customBracket.css";
import { useLsi } from "uu5g05";
import importLsi from "../../lsi/import-lsi.js";

// Extracted components
import Confetti from "./confetti.js";
import MatchCard from "./MatchCard.js";
import MatchDetailPopup from "./MatchDetailPopup.js";
import TreeBracketView from "./TreeBracketView.js";

export default function CustomBracket({ matches, bracketType, isOwner, currentUserId, tournamentInfo, onMatchUpdate }) {
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const lsi = useLsi(importLsi, ["CustomBracket"]);

    // Check if current user won the Grand Finals
    useEffect(() => {
        if (!matches || !currentUserId || !tournamentInfo) return;

        const allMatches = bracketType === 'double'
            ? [...(matches.upper || []), ...(matches.lower || [])]
            : matches;

        // Find all Final matches (nextMatchId === null)
        const finalMatches = allMatches.filter(match => match.nextMatchId === null);

        let shouldShowConfetti = false;

        for (const finalMatch of finalMatches) {
            if (finalMatch && finalMatch.participants) {
                const winningParticipant = finalMatch.participants.find(p => p.isWinner);

                if (winningParticipant && winningParticipant.id) {
                    // Find the winning team from tournament info
                    const winningTeam = tournamentInfo.teams?.find(team => team.id === winningParticipant.id);

                    if (winningTeam && winningTeam.players) {
                        // Check if current user is in the winning team
                        if (winningTeam.players.includes(currentUserId)) {
                            shouldShowConfetti = true;
                            break; // Found a win, no need to check other matches
                        }
                    }
                }
            }
        }

        if (shouldShowConfetti) {
            setShowConfetti(true);
            setIsFadingOut(false);
            // Start fade-out after 13 seconds, then hide after fade completes
            setTimeout(() => setIsFadingOut(true), 13000);
            setTimeout(() => setShowConfetti(false), 15000);
        }
    }, [matches, currentUserId, bracketType, tournamentInfo]);

    if (!matches) return null;

    const handleMatchClick = (match) => {
        setSelectedMatch(match);
    };

    const handleClosePopup = () => {
        setSelectedMatch(null);
    };

    if (bracketType === 'robin') {
        // Group matches by round
        const rounds = {};
        matches.forEach(match => {
            const roundName = match.tournamentRoundText;
            if (!rounds[roundName]) {
                rounds[roundName] = [];
            }
            rounds[roundName].push(match);
        });

        return (
            <div className="bracket-container" style={{ flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                {showConfetti && <Confetti isFadingOut={isFadingOut} />}
                {selectedMatch && (
                    <MatchDetailPopup
                        match={selectedMatch}
                        onClose={() => setSelectedMatch(null)}
                        onMatchUpdate={onMatchUpdate}
                        isOwner={isOwner}
                        tournamentInfo={tournamentInfo}
                    />
                )}


                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '2rem', width: '100%', marginTop: '2rem', padding: '0 2rem' }}>
                    {Object.entries(rounds).map(([roundName, roundMatches]) => (
                        <div key={roundName} style={{ minWidth: '250px', maxWidth: '250px', flex: '0 0 auto' }}>
                            <h3 style={{ color: '#ff8e53', marginBottom: '1rem', textAlign: 'center' }}>{roundName}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {roundMatches.map(match => (
                                    <div key={match.id} onClick={() => handleMatchClick(match)} style={{ cursor: 'pointer' }}>
                                        <MatchCard match={match} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            {showConfetti && <Confetti isFadingOut={isFadingOut} />}

            {selectedMatch && (
                <MatchDetailPopup
                    match={selectedMatch}
                    onClose={handleClosePopup}
                    isOwner={isOwner}
                    onMatchUpdate={onMatchUpdate}
                    tournamentInfo={tournamentInfo}
                />
            )}

            {bracketType === 'double' ? (
                <div className="custom-bracket-container">
                    <div className="bracket-section">
                        <h3 className="bracket-title">{lsi.upperBracket}</h3>
                        <TreeBracketView matches={matches.upper || []} onMatchClick={handleMatchClick} />
                    </div>
                    <div className="bracket-section">
                        <h3 className="bracket-title">{lsi.lowerBracket}</h3>
                        <TreeBracketView matches={matches.lower || []} onMatchClick={handleMatchClick} />
                    </div>
                </div>
            ) : (
                <TreeBracketView matches={matches} onMatchClick={handleMatchClick} />
            )}
        </>
    );
}