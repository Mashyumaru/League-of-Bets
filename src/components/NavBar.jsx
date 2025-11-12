import { useState, useEffect } from 'react';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`
      sticky top-0 z-50 
      transition-all duration-300 
      ${scrolled ? 'max-w-[70rem] py-2.5 shadow-md mx-auto' : 'max-w-[75rem] py-5 mx-auto'} 
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
        
        <div className="flex items-center gap-2.5 text-xl font-bold cursor-pointer transition-transform hover:scale-105">
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            League of Bets
          </span>
        </div>

        <div className="flex gap-1 flex-1 justify-center">
          {[
            { name: 'Matchs', active: true },
            { name: 'Mes Paris', active: false },
            { name: 'Classement', active: false },
            { name: 'Règles', active: false }
          ].map(link => (
            <a
              key={link.name}
              href="#"
              className={`
                px-5 py-2.5 
                rounded-lg 
                text-sm font-medium 
                transition-all duration-200
                ${link.active 
                  ? 'text-white bg-primary-500' 
                  : 'text-gray-400 hover:text-gray-100 hover:bg-dark-border'
                }
              `}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Bouton de connexion Twitch */}
        <div className="flex items-center">
          <button className="flex items-center gap-2.5 px-6 py-2.5 bg-[#9146ff] text-white rounded-lg text-sm font-semibold transition-all hover:bg-[#772ce8] hover:-translate-y-0.5 hover:shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
            </svg>
            Connexion avec Twitch
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;