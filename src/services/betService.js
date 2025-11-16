import pb from '../lib/pocketbase';
    
export const betService = {

  async placeBet(matchId, teamBet, amount, potentialWin) {
    try {
      if (!matchId || !teamBet || !amount || !potentialWin) {
        throw new Error('Tous les paramètres sont requis');
      }

      if (amount <= 0) {
        throw new Error('Le montant doit être positif');
      }

      const userId = pb.authStore.record?.id;
      if (!userId) {
        throw new Error('Vous devez être connecté pour parier');
      }

      const currentUser = await pb.collection('users').getOne(userId);

      if (currentUser.points < amount) {
        return { 
          success: false, 
          error: `Points insuffisants. Vous avez ${currentUser.points} points, mais ${amount} sont requis.` 
        };
      }

      const bet = await pb.collection('bets').create({
        user: userId,
        match: matchId,
        teamBet: teamBet,
        amount: amount,
        potentialWin: potentialWin,
        status: 'pending',
        result: 0
      });

      await pb.collection('users').update(userId, {
        points: currentUser.points - amount,
        totalBets: (currentUser.totalBets || 0) + 1
      });

      return { success: true, bet };
    } catch (error) {
      console.error('Erreur lors du placement du pari:', error);
      return { success: false, error: error.message };
    }
  },

  async increaseBet(betId, additionalAmount) {
    try {
      if (!betId || !additionalAmount || additionalAmount <= 0) {
        throw new Error('Paramètres invalides');
      }

      const userId = pb.authStore.record?.id;
      if (!userId) {
        throw new Error('Vous devez être connecté');
      }

      // Récupérer le pari existant
      const existingBet = await pb.collection('bets').getOne(betId);
      
      // Vérifier que l'utilisateur est propriétaire du pari
      if (existingBet.user !== userId) {
        throw new Error('Ce pari ne vous appartient pas');
      }

      // Vérifier les points disponibles
      const currentUser = await pb.collection('users').getOne(userId);
      if (currentUser.points < additionalAmount) {
        return { 
          success: false, 
          error: `Points insuffisants. Vous avez ${currentUser.points} points.` 
        };
      }

      // Calculer le nouveau montant total et le nouveau gain potentiel
      const newAmount = existingBet.amount + additionalAmount;
      
      // Récupérer le match pour obtenir la cote
      const match = await pb.collection('matches').getOne(existingBet.match);
      const odds = existingBet.teamBet === match.team1 ? match.coteTeam1 : match.coteTeam2;
      const newPotentialWin = this.calculatePotentialWin(newAmount, odds);

      // Mettre à jour le pari
      const updatedBet = await pb.collection('bets').update(betId, {
        amount: newAmount,
        potentialWin: newPotentialWin
      });

      // Déduire les points de l'utilisateur
      await pb.collection('users').update(userId, {
        points: currentUser.points - additionalAmount
      });

      return { success: true, bet: updatedBet };
    } catch (error) {
      console.error('Erreur lors de l\'augmentation du pari:', error);
      return { success: false, error: error.message };
    }
  },

  async getUserBets() {
    try {
      const userId = pb.authStore.record?.id;
      if (!userId) {
        throw new Error('Vous devez être connecté');
      }

      const bets = await pb.collection('bets').getFullList({
        filter: `user = "${userId}"`,
        sort: '-created',
        expand: 'match'
      });

      return { success: true, bets };
    } catch (error) {
      console.error('Erreur lors de la récupération des paris:', error);
      return { success: false, error: error.message };
    }
  },

  calculatePotentialWin(amount, odds) {
    if (!amount || !odds || amount <= 0 || odds <= 0) {
      return 0;
    }
    return Math.round(amount * odds);
  },

  async canUserBet(matchId) {
    try {
      const userId = pb.authStore.record?.id;
      if (!userId) {
        return { canBet: false, reason: 'Non connecté', existingBet: null };
      }

      const match = await pb.collection('matches').getOne(matchId);
      
      if (match.status === 'finished') {
        return { canBet: false, reason: 'Le match est terminé', existingBet: null };
      }
      
      const existingBets = await pb.collection('bets').getFullList({
        filter: `user = "${userId}" && match = "${matchId}" && status = "pending"`
      });
      if (existingBets.length > 0) {
        // L'utilisateur a déjà un pari sur ce match
        // Il peut seulement augmenter sa mise sur la MÊME équipe
        return { 
          canBet: true, 
          reason: 'Vous avez déjà parié sur ce match',
          existingBet: existingBets[0],
          canOnlyIncrease: true // Nouveau flag
        };
      }

      return { canBet: true, existingBet: null, canOnlyIncrease: false };
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      return { canBet: false, reason: 'Erreur de vérification', existingBet: null };
    }
  },

  async getUserBetStats() {
    try {
      const userId = pb.authStore.record?.id;
      if (!userId) {
        throw new Error('Vous devez être connecté');
      }

      const [allBets, wonBets, user] = await Promise.all([
        pb.collection('bets').getFullList({ filter: `user = "${userId}"` }),
        pb.collection('bets').getFullList({ filter: `user = "${userId}" && status = "won"` }),
        pb.collection('users').getOne(userId)
      ]);

      const totalBets = allBets.length;
      const totalWon = wonBets.length;
      const totalLost = allBets.filter(b => b.status === 'lost').length;
      const pending = allBets.filter(b => b.status === 'pending').length;
      
      const totalAmountBet = allBets.reduce((sum, bet) => sum + bet.amount, 0);
      const totalAmountWon = wonBets.reduce((sum, bet) => sum + bet.result, 0);
      
      const winRate = totalBets > 0 ? (totalWon / totalBets * 100).toFixed(1) : 0;
      const roi = totalAmountBet > 0 ? ((totalAmountWon - totalAmountBet) / totalAmountBet * 100).toFixed(1) : 0;

      const stats = {
        totalBets,
        totalWon,
        totalLost,
        pending,
        winRate: parseFloat(winRate),
        totalAmountBet,
        totalAmountWon,
        roi: parseFloat(roi),
        currentPoints: user.points
      };

      return { success: true, stats };
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      return { success: false, error: error.message };
    }
  },

  async updateBetResult(betId, status, result) {
    try {
      if (!betId || !status) {
        throw new Error('ID du pari et statut requis');
      }

      const validStatuses = ['won', 'lost'];
      if (!validStatuses.includes(status)) {
        throw new Error('Statut invalide (won ou lost)');
      }

      const bet = await pb.collection('bets').update(betId, {
        status: status,
        result: result || 0
      });

      if (status === 'won' && result > 0) {
        const betData = await pb.collection('bets').getOne(betId);
        const user = await pb.collection('users').getOne(betData.user);
        
        await pb.collection('users').update(betData.user, {
          points: user.points + result,
          wonBets: (user.wonBets || 0) + 1
        });
      }

      return { success: true, bet };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du résultat:', error);
      return { success: false, error: error.message };
    }
  }
};