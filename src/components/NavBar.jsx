import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, loginWithTwitch, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // Detecte la page courante

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Connexion
  const handleLogin = async () => {
    await loginWithTwitch();
  };

  // Deconnexion
  const handleLogout = () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
    }
  };

  return (
    <nav className={`
      sticky top-0 z-50 
      bg-dark-bg 
      transition-all duration-300 
      ${scrolled ? 'py-2.5 shadow-2xl' : 'py-5'} 
      mb-7
    `}>
      <div className={`
        max-w-[75rem] mx-auto 
        px-6 py-4 
        bg-dark-card 
        rounded-2xl 
        border-2 border-dark-border 
        flex justify-between items-center 
        gap-7 
        transition-all duration-300 
        ${scrolled ? 'py-3 shadow-lg shadow-primary-500/20' : ''}
      `}>
        
        {/* Logo de l'application */}
        <Link to="/" className="flex items-center gap-2.5 text-xl font-bold cursor-pointer transition-transform hover:scale-105">
          <span className="text-3xl">⚔️</span>
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            LoL Bets
          </span>
        </Link>

        {/* Lien vers les autres pages */}
        <div className="flex gap-1 flex-1 justify-center">
          <Link
            to="/"
            className={`
              px-5 py-2.5 
              rounded-lg 
              text-sm font-medium 
              transition-all duration-200
              ${location.pathname === '/' 
                ? 'text-white bg-primary-500' 
                : 'text-gray-400 hover:text-gray-100 hover:bg-dark-border'
              }
            `}
          >
            Matchs
          </Link>
          
          <Link
            to="/mes-paris"
            className={`
              px-5 py-2.5 
              rounded-lg 
              text-sm font-medium 
              transition-all duration-200
              ${location.pathname === '/mes-paris' 
                ? 'text-white bg-primary-500' 
                : 'text-gray-400 hover:text-gray-100 hover:bg-dark-border'
              }
            `}
          >
            Mes Paris
          </Link>
          
          <Link
            to="/regles"
            className={`
              px-5 py-2.5 
              rounded-lg 
              text-sm font-medium 
              transition-all duration-200
              ${location.pathname === '/regles' 
                ? 'text-white bg-primary-500' 
                : 'text-gray-400 hover:text-gray-100 hover:bg-dark-border'
              }
            `}
          >
            Règles
          </Link>
        </div>

        {/* Bouton de connexion/deconnexion */}
        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {/* Nombre de points */}
              <span className="text-accent font-bold text-base">
                {user.points || 0} pts
              </span>
              
              {/* Profil utilisateur */}
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold transition-all hover:bg-red-700 hover:-translate-y-0.5"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <button
            onClick={handleLogin}
            className="flex items-center gap-2.5 px-6 py-2.5 bg-[#9146ff] text-white rounded-lg text-sm font-semibold transition-all hover:bg-[#772ce8] hover:-translate-y-0.5 hover:shadow-lg"
            >
              <img src="https://cdn.simpleicons.org/twitch/ffffff" alt="Twitch" className="w-5 h-5"/>
              Connexion avec Twitch
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;