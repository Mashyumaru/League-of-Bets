function MatchCard({ match }) {
  const matchDate = new Date(match.date);
  const dateStr = matchDate.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit' 
  });
  const timeStr = matchDate.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const getStatusBadge = () => {
    const statusConfig = {
      live: { text: 'EN DIRECT', color: 'bg-red-500' },
      finished: { text: 'TERMINÉ', color: 'bg-gray-600' },
      upcoming: { text: 'À VENIR', color: 'bg-green-500' }
    };
    
    const config = statusConfig[match.status] || statusConfig.upcoming;
    
    return (
      <span className={`${config.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {getStatusBadge()}
        <div className="text-xs text-gray-400 text-right leading-tight">
          {dateStr}<br />{timeStr}
        </div>
      </div>

      {/* Teams */}
      <div className="flex justify-between items-center gap-2.5 mb-4">
        {/* Team 1 */}
        <div className={`flex-1 text-center transition-opacity ${match.winner && match.winner !== match.team1 ? 'opacity-50' : ''}`}>
          <div className="text-3xl mb-2">{match.logo1 || '🎮'}</div>
          <div className="text-sm font-bold mb-2">{match.team1}</div>
          <div className="bg-dark-border px-1.5 py-1.5 rounded-md text-xs text-accent">
            Cote: {match.coteTeam1}
          </div>
        </div>

        {/* VS */}
        <div className="text-base font-bold text-gray-500">VS</div>

        {/* Team 2 */}
        <div className={`flex-1 text-center transition-opacity ${match.winner && match.winner !== match.team2 ? 'opacity-50' : ''}`}>
          <div className="text-3xl mb-2">{match.logo2 || '🎮'}</div>
          <div className="text-sm font-bold mb-2">{match.team2}</div>
          <div className="bg-dark-border px-1.5 py-1.5 rounded-md text-xs text-accent">
            Cote: {match.coteTeam2}
          </div>
        </div>
      </div>

      {/* Action button */}
      {match.status !== 'finished' && (
        <button className="btn-primary w-full">
          Parier sur ce match
        </button>
      )}

      {/* Winner display */}
      {match.status === 'finished' && match.winner && (
        <div className="px-2.5 py-2.5 bg-green-900 rounded-lg text-center font-bold text-sm">
          🏆 Victoire de {match.winner}
        </div>
      )}
    </div>
  );
}

export default MatchCard;