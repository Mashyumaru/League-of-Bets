import pb from '../lib/pocketbase';

export const authService = {

  // Connexion avec Twitch
  async loginWithTwitch() {
    try {
      
      // Récupérer la liste des méthodes d'authentification disponibles
      const authMethods = await pb.collection('users').listAuthMethods();
      
      // Vérifie la structure de la réponse
      const providers = authMethods.authProviders || authMethods.oauth2?.providers || [];
      
      if (!providers || providers.length === 0) {
        throw new Error('Les providers OAuth ne sont pas configurés sur le serveur');
      }
      
      // Trouver le provider Twitch
      const twitchProvider = providers.find(
        provider => provider.name === 'twitch'
      );

      if (!twitchProvider) {
        throw new Error('Le provider Twitch n\'est pas configuré dans PocketBase');
      }

      // Creer l'utilisateur s'il n'existe pas
      const authData = await pb.collection('users').authWithOAuth2({
        provider: 'twitch',
        createData: {
          points: 100,
          totalBets: 0,
          wonBets: 0,
          totalWatchTime: 0
        }
      });

     
      return { 
        success: true, 
        user: authData.record,
        isNewUser: authData.meta?.isNew || false
      };
    } catch (error) {
      let errorMessage = 'Erreur lors de la connexion';
      
      if (error.message?.includes('OAuth') || error.message?.includes('provider')) {
        errorMessage = 'L\'authentification Twitch n\'est pas configurée sur le serveur. Contactez l\'administrateur.';
      } else if (error.message?.includes('not configured')) {
        errorMessage = 'L\'authentification Twitch n\'est pas activée.';
      } else if (error.message?.includes('cancelled')) {
        errorMessage = 'Connexion annulée.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  },

  // Déconnexion
  logout() {
    pb.authStore.clear();
  },

  // Vérifie si l'utilisateur est connecté
  isAuthenticated() {
    return pb.authStore.isValid && !!pb.authStore.record;
  },

  // Récupère l'utilisateur actuel
  getCurrentUser() {
    return pb.authStore.record;
  },

  // Rafraîchit les données de l'utilisateur depuis PocketBase
  async refreshUser() {
    try {
      const userId = pb.authStore.record?.id;
      if (!userId) {
        return null;
      }
      
      const user = await pb.collection('users').getOne(userId);
      
      // Mettre à jour le store
      pb.authStore.save(pb.authStore.token, user);
      
      return user;
    } catch (error) {
      return null;
    }
  },

  // Écoute les changements d'authentification
  onAuthChange(callback) {
    return pb.authStore.onChange((token, record) => {
      callback(record);
    });
  }
};