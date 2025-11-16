import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifie si un utilisateur est déjà connecté
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      }
      setLoading(false);
    };

    checkAuth();

    // Ecoute les changements d'authentification
    const unsubscribe = authService.onAuthChange((record) => {
      setUser(record);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const loginWithTwitch = async () => {
    try {
      const result = await authService.loginWithTwitch();
      
      if (result.success) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: 'Une erreur est survenue lors de la connexion' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    const updatedUser = await authService.refreshUser();
    if (updatedUser) {
      setUser(updatedUser);
    }
    return updatedUser;
  };

  const value = {
    user,
    loading,
    loginWithTwitch,
    logout,
    refreshUser,
    isAuthenticated: !!user
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}