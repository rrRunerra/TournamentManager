import "../styles/OngoingTournamentNav.css"

export default function OngoingTournamentNav({ activeTab, onTabChange, isOwner}) {

  return (
    <div className="nav-wrapper-small">
      <nav className="pill-nav-small">
        <button
          onClick={() => onTabChange('current-match')}
          className={`pill-button-small ${
            activeTab === 'current-match' ? 'pill-button-small--active' : ''
          }`}
        >
          Current Match
        </button>
        <button
          onClick={() => onTabChange('brackets')}
          className={`pill-button-small ${
            activeTab === 'brackets' ? 'pill-button-small--active' : ''
          }`}
        >
          Brackets
        </button>

          {isOwner && (
            <button 
                onClick={() => onTabChange('owner-controls')}
                className={`pill-button-small ${
                  activeTab === 'owner-controls' ? 'pill-button-small--active' : ''
                }`}
            >
                Owner Controls
            </button>
          )}

      </nav>
    </div>
  );
}