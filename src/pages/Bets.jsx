import { useState, useEffect } from 'react';
import { betService } from '../services/betService';
import { useAuth } from '../context/AuthContext';
import NavBar from './NavBar';

function Bets() {
  const { user, isAuthenticated } = useAuth();
  const [bets, setBets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, won, lost

  useEffect(() => {
    if (isAuthenticated) {
      loadBetsAndStats();
    }
  }, [isAuthenticated]);

  const loadBetsAndStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const [betsResult, statsResult] = await Promise.all([
        betService.getUserBets(),
        betService.getUserBetStats()
      ]);

      if (betsResult.success) {
        setBets(betsResult.bets);
      } else {
        setError(betsResult.error);
      }

      if (statsResult.success) {
        setStats(statsResult.stats);
      }
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    }

    setLoading(false);
  };

  const getFilteredBets = () => {
    if (filter === 'all') return bets;
    return bets.filter(bet => bet.status === filter);
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { text: 'EN ATTENTE', color: 'bg-yellow-500' },
      won: { text: 'GAGNÉ', color: 'bg-green-500' },
      lost: { text: 'PERDU', color: 'bg-red-500' }
    };
    
    const statusInfo = config[status] || config.pending;
    
    return (
      <span className={`${statusInfo.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
        {statusInfo.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Si non connecté
  if (!isAuthenticated) {
    return (
      <div className="max-w-[75rem] mx-auto px-5 pb-5">
        <NavBar />
        <div className="text-center mt-12 p-10 bg-dark-card rounded-xl border-2 border-dark-border">
          <span className="text-6xl mb-4 block">🔒</span>
          <h2 className="text-2xl font-bold mb-4">Connexion requise</h2>
          <p className="text-gray-400">Connectez-vous pour voir vos paris</p>
        </div>
      </div>
    );
  }

  // Chargement
  if (loading) {
    return (
      <div className="max-w-[75rem] mx-auto px-5 pb-5">
        <NavBar />
        <div className="text-center mt-12 text-white">
          <h2 className="text-2xl">Chargement de vos paris...</h2>
        </div>
      </div>
    );
  }

  // Erreur
  if (error) {
    return (
      <div className="max-w-[75rem] mx-auto px-5 pb-5">
        <NavBar />
        <div className="text-center mt-12 p-5 bg-red-500 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Erreur</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={loadBetsAndStats}
            className="px-5 py-2.5 bg-white text-red-500 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const filteredBets = getFilteredBets();

  return (
    <div className="max-w-[75rem] mx-auto px-5 pb-5">
      <NavBar />
      
      {/* Header */}
      <header className="text-center mb-10 pb-5 border-b-2 border-dark-border">
        <h1 className="
          text-2xl md:text-5xl font-bold 
          mb-2.5 
          bg-gradient-to-r from-primary-500 to-secondary-500 
          bg-clip-text text-transparent
          pb-1
        ">
          Mes Paris
        </h1>
        <p className="text-gray-400">
          Suivez vos performances et historique de paris
        </p>
      </header>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          <div className="bg-dark-card rounded-xl p-5 border-2 border-dark-border text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-white mb-1">{stats.totalBets}</div>
            <div className="text-sm text-gray-400">Paris total</div>
          </div>

          <div className="bg-dark-card rounded-xl p-5 border-2 border-green-500/30 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.totalWon}</div>
            <div className="text-sm text-gray-400">Paris gagnés</div>
          </div>

          <div className="bg-dark-card rounded-xl p-5 border-2 border-dark-border text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-accent mb-1">{stats.winRate}%</div>
            <div className="text-sm text-gray-400">Taux de réussite</div>
          </div>

          <div className="bg-dark-card rounded-xl p-5 border-2 border-dark-border text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className={`text-2xl font-bold mb-1 ${stats.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.roi > 0 ? '+' : ''}{stats.roi}%
            </div>
            <div className="text-sm text-gray-400">ROI</div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
            filter === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-dark-card border-2 border-dark-border text-gray-400 hover:text-white'
          }`}
        >
          Tous ({bets.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
            filter === 'pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-dark-card border-2 border-dark-border text-gray-400 hover:text-white'
          }`}
        >
          En attente ({bets.filter(b => b.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('won')}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
            filter === 'won'
              ? 'bg-green-500 text-white'
              : 'bg-dark-card border-2 border-dark-border text-gray-400 hover:text-white'
          }`}
        >
          Gagnés ({bets.filter(b => b.status === 'won').length})
        </button>
        <button
          onClick={() => setFilter('lost')}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
            filter === 'lost'
              ? 'bg-red-500 text-white'
              : 'bg-dark-card border-2 border-dark-border text-gray-400 hover:text-white'
          }`}
        >
          Perdus ({bets.filter(b => b.status === 'lost').length})
        </button>
      </div>

      {/* Liste des paris */}
      {filteredBets.length === 0 ? (
        <div className="text-center p-10 bg-dark-card rounded-xl border-2 border-dark-border">
          <span className="text-6xl mb-4 block">🎲</span>
          <p className="text-gray-400 text-lg mb-2.5">
            {filter === 'all' 
              ? "Vous n'avez pas encore placé de paris"
              : `Aucun pari ${filter === 'pending' ? 'en attente' : filter === 'won' ? 'gagné' : 'perdu'}`
            }
          </p>
          {filter === 'all' && (
            <a href="/" className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-bold hover:scale-105 transition-transform">
              Voir les matchs
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBets.map(bet => {
            const match = bet.expand?.match;
            
            return (
              <div key={bet.id} className="bg-dark-card rounded-xl p-5 border-2 border-dark-border hover:border-primary-500/50 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Info du match */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusBadge(bet.status)}
                      <span className="text-xs text-gray-500">
                        {formatDate(bet.created)}
                      </span>
                    </div>
                    
                    {match ? (
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl mb-1">{match.logo1 || '🎮'}</div>
                          <div className="text-sm text-gray-400">{match.team1}</div>
                        </div>
                        <div className="text-gray-500 font-bold">VS</div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">{match.logo2 || '🎮'}</div>
                          <div className="text-sm text-gray-400">{match.team2}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">Match supprimé</div>
                    )}
                  </div>

                  {/* Info du pari */}
                  <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="text-center bg-dark-border rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Pari sur</div>
                      <div className="text-white font-bold">{bet.teamBet}</div>
                    </div>

                    <div className="text-center bg-dark-border rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Mise</div>
                      <div className="text-accent font-bold">{bet.amount} pts</div>
                    </div>

                    {bet.status === 'pending' && (
                      <div className="text-center bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Gain potentiel</div>
                        <div className="text-blue-400 font-bold">{bet.potentialWin} pts</div>
                      </div>
                    )}

                    {bet.status === 'won' && (
                      <div className="text-center bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Gain</div>
                        <div className="text-green-400 font-bold">+{bet.result} pts</div>
                      </div>
                    )}

                    {bet.status === 'lost' && (
                      <div className="text-center bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Perte</div>
                        <div className="text-red-400 font-bold">-{bet.amount} pts</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Bets;