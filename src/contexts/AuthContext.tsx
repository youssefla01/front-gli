import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types/user';
import api from '../config/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUserInfo: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const refreshAccessToken = async () => {
    try {
      const response = await api.post('/auth/refresh', {}, { withCredentials: true });
      const { user } = response.data;
      setUser(user);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me', { withCredentials: true });
        if (isMounted) {
          setUser(response.data);
          if (location.pathname === '/login') {
            navigate('/app');
          }
        }
      } catch (error:any) {
        if (isMounted) {
          if (error.response?.status === 401) {
            await refreshAccessToken();
          } else {
            setUser(null);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false; // Nettoyage pour éviter les effets indésirables
    };
  }, [navigate, location]); 

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    try {
      await api.post('/auth/login', { email, mot_de_passe: password }, { withCredentials: true });
      const response = await api.get('/auth/me', { withCredentials: true });
      setUser(response.data);
      navigate('/app');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la connexion';
      throw new Error(errorMessage);
    }
  };
  

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  // Mise à jour des informations utilisateur
  const updateUserInfo = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
