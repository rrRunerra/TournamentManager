import { useLsi } from "uu5g05";
import importLsi from "../../../lsi/import-lsi.js";

const MatchCard = ({ match, onClick, style }) => {
  const { participants, id, startTime, name } = match;
  const topParticipant = participants[0] || {};
  const bottomParticipant = participants[1] || {};

  const isTopWinner = topParticipant.isWinner;
  const isBottomWinner = bottomParticipant.isWinner;
  const lsi = useLsi(importLsi, ["CustomBracket"]);

  return (
    <div className="match-card" style={style} onClick={() => onClick && onClick(match)}>
      <div className="match-header">
        <span>
          {lsi.matchPrefix}
          {id}
        </span>
        {/* <span>{startTime ? new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}</span> */}
      </div>

      <div className={`match-team ${isTopWinner ? "winner" : ""} ${!topParticipant.name ? "placeholder" : ""}`}>
        <span>{topParticipant.name || lsi.tbd}</span>
        {topParticipant.resultText && <span className="team-score-box">{topParticipant.resultText}</span>}
      </div>

      <div className={`match-team ${isBottomWinner ? "winner" : ""} ${!bottomParticipant.name ? "placeholder" : ""}`}>
        <span>{bottomParticipant.name || lsi.tbd}</span>
        {bottomParticipant.resultText && <span className="team-score-box">{bottomParticipant.resultText}</span>}
      </div>
    </div>
  );
};

export default MatchCard;
