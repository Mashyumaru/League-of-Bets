import { useState, useEffect } from 'react';
import { betService } from '../services/betService';
import pb from '../lib/pocketbase';

function BetModal({ match, existingBet, onClose, onBetPlaced }) {
  const [selectedTeam, setSelectedTeam] = useState(existingBet?.teamBet || null);
  const [amount, setAmount] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isIncreasingBet = !!existingBet;

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const userId = pb.authStore.record?.id;
        if (userId) {
          const user = await pb.collection('users').getOne(userId);
          setUserPoints(user.points || 0);
        }
      } catch (err) {
        console.error('Erreur récupération points:', err);
      }
    };
    fetchUserPoints();
  }, []);

  // Calcul du gain potentiel
  const getCurrentOdds = () => {
    if (!selectedTeam) return 0;
    return selectedTeam === match.team1 ? match.coteTeam1 : match.coteTeam2;
  };

  const potentialWin = isIncreasingBet && amount
    ? betService.calculatePotentialWin(
        existingBet.amount + parseFloat(amount),
        getCurrentOdds()
      )
    : selectedTeam && amount
    ? betService.calculatePotentialWin(parseFloat(amount), getCurrentOdds())
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!selectedTeam) {
      setError('Veuillez sélectionner une équipe');
      return;
    }

    const betAmount = parseFloat(amount);
    if (!betAmount || betAmount <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    if (betAmount > userPoints) {
      setError(`Vous n'avez que ${userPoints} points disponibles`);
      return;
    }

    setLoading(true);

    try {
      let result;

      if (isIncreasingBet) {
        // Augmentation d'un pari existant
        result = await betService.increaseBet(existingBet.id, betAmount);
      } else {
        // Nouveau pari
        result = await betService.placeBet(
          match.id,
          selectedTeam,
          betAmount,
          potentialWin
        );
      }

      if (result.success) {
        setUserPoints(userPoints - betAmount);
        
        if (onBetPlaced) {
          onBetPlaced(result.bet);
        }
        
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Une erreur est survenue lors du pari');
      console.error('Erreur pari:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-card border-2 border-dark-border rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isIncreasingBet ? 'Augmenter votre pari' : 'Placer un pari'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6 p-4 bg-dark-border rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">{match.team1}</span>
            <span className="text-white font-bold">VS</span>
            <span className="text-gray-400">{match.team2}</span>
          </div>
        </div>

        {isIncreasingBet && (
          <div className="mb-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <div className="text-sm text-gray-300 mb-2">Votre pari actuel :</div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-white font-bold">{existingBet.teamBet}</div>
                <div className="text-xs text-gray-400">Mise: {existingBet.amount} pts</div>
              </div>
              <div className="text-right">
                <div className="text-accent font-bold">{existingBet.potentialWin} pts</div>
                <div className="text-xs text-gray-400">Gain potentiel</div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 text-center">
          <span className="text-gray-400 text-sm">Solde disponible: </span>
          <span className="text-accent font-bold text-lg">{userPoints} points</span>
        </div>

        <form onSubmit={handleSubmit}>
          {!isIncreasingBet && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Sélectionnez une équipe
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedTeam(match.team1)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTeam === match.team1
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-dark-border hover:border-primary-500/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{match.logo1 || '🎮'}</div>
                  <div className="text-sm font-bold text-white mb-1">{match.team1}</div>
                  <div className="text-xs text-accent">Cote: {match.coteTeam1}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTeam(match.team2)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTeam === match.team2
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-dark-border hover:border-primary-500/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{match.logo2 || '🎮'}</div>
                  <div className="text-sm font-bold text-white mb-1">{match.team2}</div>
                  <div className="text-xs text-accent">Cote: {match.coteTeam2}</div>
                </button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {isIncreasingBet ? 'Montant supplémentaire' : 'Montant du pari'}
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 100"
                min="1"
                max={userPoints}
                className="w-full px-4 py-3 bg-dark-border border-2 border-dark-border rounded-lg text-white focus:border-primary-500 focus:outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                points
              </span>
            </div>
            
            <div className="flex gap-2 mt-2">
              {[25, 50, 100, 'Max'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset === 'Max' ? userPoints.toString() : preset.toString())}
                  className="flex-1 px-3 py-1.5 bg-dark-border hover:bg-primary-500/20 text-xs text-gray-400 hover:text-white rounded transition-colors"
                >
                  {preset === 'Max' ? 'Max' : `${preset}pts`}
                </button>
              ))}
            </div>
          </div>

          {isIncreasingBet && amount && (
            <div className="mb-4 p-3 bg-dark-border rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Mise actuelle:</span>
                <span className="text-white">{existingBet.amount} pts</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-400">+ Ajout:</span>
                <span className="text-accent">+{parseFloat(amount) || 0} pts</span>
              </div>
              <div className="border-t border-dark-bg my-2"></div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-white">Nouvelle mise:</span>
                <span className="text-accent">{existingBet.amount + (parseFloat(amount) || 0)} pts</span>
              </div>
            </div>
          )}

          {potentialWin > 0 && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">
                  {isIncreasingBet ? 'Nouveau gain potentiel' : 'Gain potentiel'}
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {potentialWin} points
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {isIncreasingBet 
                    ? `(Mise totale: ${existingBet.amount + (parseFloat(amount) || 0)} × Cote: ${getCurrentOdds()})`
                    : `(Mise: ${amount} × Cote: ${getCurrentOdds()})`
                  }
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-dark-border text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !selectedTeam || !amount}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading 
                ? 'Validation...' 
                : isIncreasingBet 
                  ? 'Augmenter le pari' 
                  : 'Confirmer le pari'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BetModal;