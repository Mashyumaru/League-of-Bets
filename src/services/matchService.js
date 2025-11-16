  import pb from '../lib/pocketbase';

  export const matchService = {
    
    async getAllMatches() {
      try {
        const matches = await pb.collection('matches').getFullList({
          sort: '-date', // Tri par date 
        });
        return { success: true, matches };
      } catch (error) {
        console.error('Erreur lors de la récupération des matchs:', error);
        return { success: false, error: error.message };
      }
    },

    async getMatchById(id) {
      try {
        if (!id) {
          throw new Error('ID de match invalide');
        }

        const match = await pb.collection('matches').getOne(id);
        return { success: true, match };
      } catch (error) {
        console.error(`Erreur lors de la récupération du match ${id}:`, error);
        return { success: false, error: error.message };
      }
    },

    async createMatch(matchData) {
      try {
        const requiredFields = ['team1', 'team2', 'date', 'status', 'coteTeam1', 'coteTeam2'];
        for (const field of requiredFields) {
          if (!matchData[field]) {
            throw new Error(`Le champ ${field} est requis`);
          }
        }

        const validStatuses = ['upcoming', 'live', 'finished'];
        if (!validStatuses.includes(matchData.status)) {
          throw new Error('Statut invalide');
        }

        const match = await pb.collection('matches').create(matchData);
        return { success: true, match };
      } catch (error) {
        console.error('Erreur lors de la création du match:', error);
        return { success: false, error: error.message };
      }
    },

    async updateMatch(id, matchData) {
      try {
        if (!id) {
          throw new Error('ID de match invalide');
        }

        if (matchData.status) {
          const validStatuses = ['upcoming', 'live', 'finished'];
          if (!validStatuses.includes(matchData.status)) {
            throw new Error('Statut invalide');
          }
        }

        const match = await pb.collection('matches').update(id, matchData);
        return { success: true, match };
      } catch (error) {
        console.error(`Erreur lors de la mise à jour du match ${id}:`, error);
        return { success: false, error: error.message };
      }
    },

    async deleteMatch(id) {
      try {
        if (!id) {
          throw new Error('ID de match invalide');
        }

        await pb.collection('matches').delete(id);
        return { success: true };
      } catch (error) {
        console.error(`Erreur lors de la suppression du match ${id}:`, error);
        return { success: false, error: error.message };
      }
    },
  };