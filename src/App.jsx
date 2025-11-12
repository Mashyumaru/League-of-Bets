import { useState, useEffect } from 'react';
import MatchCard from './components/MatchCard';
import NavBar from './components/NavBar';
import { matchService } from './services/matchService';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMatches();
  }, []);const loadMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await matchService.getAllMatches();
      
      if (result.success) {
        setMatches(result.matches);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  // Chargement
  if (loading) {
    return (
      <div className="max-w-[75rem] mx-auto px-5 pb-5">
        <NavBar />
        <div className="text-center mt-12 text-white">
          <h2 className="text-2xl">Chargement des matchs...</h2>
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
            onClick={loadMatches}
            className="px-5 py-2.5 bg-white text-red-500 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Affichage des matchs
  return (
    <div className="max-w-[75rem] mx-auto px-5 pb-5">
      <NavBar />
      <header className="text-center mb-10 pb-5 border-b-2 border-dark-border">
        <h1 className="
          text-2xl md:text-5xl font-bold 
          mb-2.5 
          bg-gradient-to-r from-primary-500 to-secondary-500 
          bg-clip-text text-transparent
          pb-1
        ">
          Bienvenue dans League of Bets 
        </h1>
        <p className="text-gray-400">
          Pariez sur vos équipes favorites
        </p>
      </header>

      {/* Section des matchs */}
      <div className="mb-10">
        <h2 className="text-2xl mb-5 text-gray-100">
          Tous les matchs ({matches.length})
        </h2>
        
        {matches.length === 0 ? (
          // Aucun match disponible
          <div className="text-center p-10 bg-dark-card rounded-xl border-2 border-dark-border">
            <p className="text-gray-400 text-lg mb-2.5">
              Aucun match disponible pour le moment
            </p>
          </div>
        ) : (
          // Grille de matchs
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {matches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;