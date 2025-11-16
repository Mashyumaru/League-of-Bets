import { useState, useEffect } from 'react';
import { betService } from '../services/betService';
import { useAuth } from '../context/AuthContext';
import BetModal from './BetModal';
import pb from '../lib/pocketbase';

function MatchCard({ match }) {
  const { isAuthenticated } = useAuth();
  const [canBet, setCanBet] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [existingBet, setExistingBet] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour obtenir le logo 
  const getLogo = (match, logoField) => {
    return `https://aurelien.pb.andy-cinquin.fr/api/files/matches/${match.id}/${match[logoField]}`;
  };

  // Format de date et heure
  const matchDate = new Date(match.date);
  const dateStr = matchDate.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit' 
  });
  const timeStr = matchDate.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Verification si l'utilisateur est connecté
  useEffect(() => {
    checkBetEligibility();
  }, [match.id, isAuthenticated]);

  // Verification si l'utilisateur peut parier sur un match
  const checkBetEligibility = async () => {

    setLoading(true);

    if (!isAuthenticated) {
      setCanBet(false);
      setExistingBet(null);
      setLoading(false);
      return;
    }

    if (match.status === 'finished') {
      setCanBet(false);
      setExistingBet(null);
      setLoading(false);
      return;
    }

    try {
      const result = await betService.canUserBet(match.id);      
      setCanBet(result.canBet);
      setExistingBet(result.existingBet || null);
    } catch (error) {
      setCanBet(false);
      setExistingBet(null);
    }

    setLoading(false);
  };

  // Affichage de la modal de pari
  const handleBetClick = () => {
    setShowModal(true);
  };

  const handleBetPlaced = async (bet) => {
    setExistingBet(bet);
    await checkBetEligibility();
  };

  // Affichage du statut du match
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

  const getButtonContent = () => {
    if (loading) {
      return 'Chargement...';
    }

    if (!isAuthenticated) {
      return 'Connectez-vous pour parier';
    }

    if (match.status === 'finished') {
      return 'Match terminé';
    }

    if (existingBet) {
      return `Augmenter la mise (${existingBet.amount}pts)`;
    }

    return 'Parier sur ce match';
  };

  const isButtonDisabled = () => {
    if (loading) return true;
    if (!isAuthenticated) return true;
    if (match.status === 'finished') return true;
    return false;
  };

  return (
    <>
      <div className="card">
        {/* Affichage statut + date/heure */}
        <div className="flex justify-between items-center mb-4">
          {getStatusBadge()}
          <div className="text-xs text-gray-400 text-right leading-tight">
            {dateStr}<br />{timeStr}
          </div>
        </div>

        {/* Affichage equipes */}
        <div className="flex justify-between items-center gap-2.5 mb-4">
          {/* Equipe 1 */}
          <div className={`flex-1 text-center transition-opacity duration-300 ${
            match.winner && match.winner !== match.team1 ? 'opacity-50' : ''
          }`}>
            <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
              {getLogo(match, 'logoTeam1') ? (
                <img 
                  src={getLogo(match, 'logoTeam1')} 
                  alt={match.team1}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="text-3xl">🎮</div>';
                  }}
                />
              ) : (
                <div className="text-3xl">🎮</div>
              )}
            </div>
            <div className="text-sm font-bold mb-2">{match.team1}</div>
            <div className="bg-dark-border px-1.5 py-1.5 rounded-md text-xs text-accent">
              Cote: {match.coteTeam1}
            </div>
          </div>

          <div className="text-base font-bold text-gray-500">VS</div>

          {/* Equipe 2 */}
          <div className={`flex-1 text-center transition-opacity duration-300 ${
            match.winner && match.winner !== match.team2 ? 'opacity-50' : ''
          }`}>
            <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
              {getLogo(match, 'logoTeam2') ? (
                <img 
                  src={getLogo(match, 'logoTeam2')} 
                  alt={match.team2}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="text-3xl">🎮</div>';
                  }}
                />
              ) : (
                <div className="text-3xl">🎮</div>
              )}
            </div>
            <div className="text-sm font-bold mb-2">{match.team2}</div>
            <div className="bg-dark-border px-1.5 py-1.5 rounded-md text-xs text-accent">
              Cote: {match.coteTeam2}
            </div>
          </div>
        </div>

        {/* Affichage boutton pari */}
        {match.status !== 'finished' && (
          <button 
            onClick={handleBetClick}
            disabled={isButtonDisabled()}
            className={`w-full py-2.5 rounded-lg font-semibold transition-all text-sm ${
              existingBet
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                : isAuthenticated && !loading
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:scale-105'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            } ${loading ? 'opacity-50 cursor-wait' : ''}`}
          >
            {getButtonContent()}
          </button>
        )}

        {/* Affichage en cas de match fini avec un vainqueur */}
        {match.status === 'finished' && match.winner && (
          <div className="px-2.5 py-2.5 bg-green-900 rounded-lg text-center font-bold text-sm">
            Victoire de {match.winner}
          </div>
        )}
      </div>

      {/* Modale de pari */}
      {showModal && (
        <BetModal
          match={match}
          existingBet={existingBet}
          onClose={() => setShowModal(false)}
          onBetPlaced={handleBetPlaced}
        />
      )}
    </>
  );
}

export default MatchCard;