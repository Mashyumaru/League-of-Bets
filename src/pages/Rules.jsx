import NavBar from '../components/NavBar';

function Rules() {
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
          Règles du jeu
        </h1>
        <p className="text-gray-400">
          Tout ce que vous devez savoir pour parier et gagner des points
        </p>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        
        <section className="bg-dark-card rounded-xl p-6 border-2 border-dark-border">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-white">Comment ça marche ?</h2>
          </div>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong className="text-white">League of Bets</strong> est une plateforme de paris virtuels sur les matchs League of Legends. 
              Pariez vos points sur vos équipes favorites et tentez de multiplier vos gains !
            </p>
          </div>
        </section>

        <section className="bg-dark-card rounded-xl p-6 border-2 border-primary-500/30">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-white">Comment gagner des points ?</h2>
          </div>
          <div className="space-y-4">
            
            <div className="bg-dark-border p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Cadeau de bienvenue</h3>
                  <p className="text-gray-300">
                    <span className="text-accent font-bold">100 points offerts</span> pour votre première connexion !
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/20 to-primary-500/20 p-4 rounded-lg border border-purple-500/30">
              <div className="flex items-start gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Regarder les streams Twitch</h3>
                  <p className="text-gray-300 mb-2">
                    Gagnez automatiquement des points en regardant les streams de League of Legends sur Twitch !
                  </p>
                  <ul className="m-5 space-y-1 text-sm text-gray-400 list-disc">
                    <li><span className="text-accent font-bold">10 points</span> toutes les 10 minutes de visionnage</li>
                    <li>Connectez votre compte Twitch pour commencer</li>
                    <li>Les points s'accumulent automatiquement</li>
                  </ul>
                  <p className="text-red-300 mb-2">
                    Pas encore implementé
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-dark-border p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Gagner des paris</h3>
                  <p className="text-gray-300">
                    Pariez sur la bonne équipe et multipliez votre mise selon la cote du match !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-dark-card rounded-xl p-6 border-2 border-dark-border">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-white">Comment parier ?</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Choisissez un match</h3>
                <p className="text-gray-400 text-sm">Parcourez les matchs disponibles et sélectionnez celui sur lequel vous voulez parier.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Sélectionnez une équipe</h3>
                <p className="text-gray-400 text-sm">Cliquez sur l'équipe pour laquelle vous voulez parier. Consultez les cotes pour voir les gains potentiels.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Misez vos points</h3>
                <p className="text-gray-400 text-sm">Entrez le montant que vous souhaitez parier. Votre gain potentiel s'affiche automatiquement !</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Confirmez et attendez</h3>
                <p className="text-gray-400 text-sm">Validez votre pari et suivez le match ! Si votre équipe gagne, vous recevez vos gains automatiquement.</p>
                <p className="text-red-300 text-sm">Pas encore implementé</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-dark-card rounded-xl p-6 border-2 border-dark-border">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-white">Augmenter sa mise</h2>
          </div>
          <div className="space-y-3 text-gray-300">
            <p>
              Vous avez déjà parié sur un match mais vous voulez miser plus ? Pas de problème !
            </p>
            <p><strong className="text-white">Une seule règle :</strong></p>
            <div className="bg-dark-border p-4 rounded-lg space-y-2">
              <p>Vous ne pouvez <strong className="text-white">pas changer d'équipe</strong> une fois un pari placé</p>
            </div>
          </div>
        </section>

        <section className="bg-dark-card rounded-xl p-6 border-2 border-red-500/30">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-white">Règles importantes</h2>
          </div>
          <ul className="list-disc m-5 marker:text-red-400">
            <li>Les paris sont <strong className="text-white">définitifs</strong> une fois validés</li>
            <li>Vous ne pouvez pas parier si vous n'avez <strong className="text-white">pas assez de points</strong></li>
            <li>Les paris se ferment <strong className="text-white">au début du match</strong></li>
            <li>En cas de perte, vous <strong className="text-white">perdez votre mise</strong></li>
            <li>Les points ne peuvent pas être <strong className="text-white">échangés contre de l'argent réel</strong></li>
          </ul>
        </section>

        
        <section className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Prêt à commencer ?
          </h2>
          <p className="text-white/90 mb-6">
            Connectez-vous avec Twitch et commencez à parier dès maintenant !
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/"
              className="px-6 py-3 bg-white text-primary-500 rounded-lg font-bold hover:scale-105 transition-transform"
            >
              Voir les matchs
            </a>
            <a
              href="/mes-paris"
              className="px-6 py-3 bg-dark-card text-white rounded-lg font-bold hover:scale-105 transition-transform border-2 border-white"
            >
              Mes paris
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Rules;