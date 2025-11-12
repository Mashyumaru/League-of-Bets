import { useState, useEffect } from 'react';
import { betService } from '../services/betService';
import pb from '../lib/pocketbase';
import BetModal from './BetModal';

function MatchCard({ match }) {
  const [canBet, setCanBet] = useState(true);
  const [betReason, setBetReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [existingBet, setExistingBet] = useState(null);

  const matchDate = new Date(match.date);
  const dateStr = matchDate.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit' 
  });
  const timeStr = matchDate.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  useEffect(() => {
    checkBetEligibility();
  }, [match.id]);

  const checkBetEligibility = async () => {
    const userId = pb.authStore.record?.id;
    setIsAuthenticated(!!userId);

    if (!userId) {
      setCanBet(false);
      setBetReason('Vous devez être connecté');
      setExistingBet(null);
      return;
    }

    const result = await betService.canUserBet(match.id);
    setCanBet(result.canBet);
    setBetReason(result.reason || '');
    setExistingBet(result.existingBet);
  };

  const handleBetClick = () => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour parier');
      return;
    }

    setShowModal(true);
  };

  const handleBetPlaced = (bet) => {
    setExistingBet(bet);
    
    const successMessage = existingBet 
      ? `Pari augmenté avec succès ! Nouvelle mise: ${bet.amount} points.`
      : `Pari placé avec succès ! Vous avez misé ${bet.amount} points.`;
    
    alert(successMessage);
    
    checkBetEligibility();
  };

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
    if (!isAuthenticated) {
      return 'Connectez-vous pour parier';
    }

    if (existingBet) {
      return `Augmenter la mise (${existingBet.amount}pts)`;
    }

    return 'Parier sur ce match';
  };

  const isButtonDisabled = () => {
    return !isAuthenticated || match.status === 'finished';
  };

  return (
    <>
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
          <div className={`flex-1 text-center transition-opacity duration-300 ${
            match.winner && match.winner !== match.team1 ? 'opacity-50' : ''
          }`}>
            <div className="text-3xl mb-2">{match.logo1 || '🎮'}</div>
            <div className="text-sm font-bold mb-2">{match.team1}</div>
            <div className="bg-dark-border px-1.5 py-1.5 rounded-md text-xs text-accent">
              Cote: {match.coteTeam1}
            </div>
          </div>

          {/* VS */}
          <div className="text-base font-bold text-gray-500">VS</div>

          {/* Team 2 */}
          <div className={`flex-1 text-center transition-opacity duration-300 ${
            match.winner && match.winner !== match.team2 ? 'opacity-50' : ''
          }`}>
            <div className="text-3xl mb-2">{match.logo2 || '🎮'}</div>
            <div className="text-sm font-bold mb-2">{match.team2}</div>
            <div className="bg-dark-border px-1.5 py-1.5 rounded-md text-xs text-accent">
              Cote: {match.coteTeam2}
            </div>
          </div>
        </div>

        {/* Action button */}
        {match.status !== 'finished' && (
          <button 
            onClick={handleBetClick}
            disabled={isButtonDisabled()}
            className={`w-full py-2.5 rounded-lg font-semibold transition-all text-sm ${
              existingBet
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                : isAuthenticated
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:scale-105'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }`}
          >
            {getButtonContent()}
          </button>
        )}

        {/* Winner display */}
        {match.status === 'finished' && match.winner && (
          <div className="px-2.5 py-2.5 bg-green-900 rounded-lg text-center font-bold text-sm">
            🏆 Victoire de {match.winner}
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