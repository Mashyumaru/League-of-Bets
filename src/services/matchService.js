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

  async getMatchesByStatus(status) {
    try {
      const validStatuses = ['upcoming', 'live', 'finished'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Statut invalide: ${status}`);
      }

      const matches = await pb.collection('matches').getFullList({
        filter: `status = "${status}"`, 
        sort: '-date',
      });
      return { success: true, matches };
    } catch (error) {
      console.error(`Erreur lors de la récupération des matchs ${status}:`, error);
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

  // Uniquement ADMIN
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

  // Uniquement ADMIN
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

  // Uniquement ADMIN
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

  async getUpcomingMatches() {
    try {
      const now = new Date();
      const oneDay = 24 * 60 * 60 * 1000;
      const tomorrow = new Date(now.getTime() + oneDay);

      const matches = await pb.collection('matches').getFullList({
        filter: `status = "upcoming" && date >= "${now.toISOString()}" && date <= "${tomorrow.toISOString()}"`,
        sort: 'date', 
      });
      return { success: true, matches };
    } catch (error) {
      console.error('Erreur lors de la récupération des matchs à venir:', error);
      return { success: false, error: error.message };
    }
  },

  async getLiveMatches() {
    return this.getMatchesByStatus('live');
  },

  async getFinishedMatches(limit = 50) {
    try {
      const matches = await pb.collection('matches').getList(1, limit, {
        filter: 'status = "finished"',
        sort: '-date', 
      });
      return { success: true, matches: matches.items };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      return { success: false, error: error.message };
    }
  }
};