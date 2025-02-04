import { JwtPayload, jwtDecode } from 'jwt-decode';
import React, { createContext, useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import useQuery from '~/hooks/useQuery';
import { RootState } from '~/store';
import { logout, refreshToken } from '~/store/authSlice';

/**
 * Lógica para refrescar el token de autenticación.
 * Perosnalizada por el momento para cglass.
 * TODO: adaptar para que sea generalizado para cualquier servicio
 * Al implementar este contexto, se debe definir el endpoint de refresh en el archivo .env
 * AUTH_URL y REFRESH_TOKEN_PATH, es obligatorio
 */
export interface AuthResponse {
  access_token: string;
}

// Define la estructura del contexto
interface AuthContextType {
  refreshSession: () => void;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Crear el proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { token, exp, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const { data, error, refetch } = useQuery<AuthResponse>(`${process.env.AUTH_URL}${process.env.REFRESH_TOKEN_PATH || ''}`, {}, {}, false);

  const refreshSession = useCallback(() => {
    if (!isAuthenticated || !token || !exp) return;

    const currentTime = Math.floor(Date.now() / 1000);
    if (exp <= currentTime) {
      console.warn('El token ya ha expirado, evitando refresh.');
      return;
    }

    console.log('Refrescando el token...');
    refetch();
  }, [isAuthenticated, token, exp, refetch]);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (data) {
      const decodedToken = jwtDecode<{ sub: string; roles: string[] } & JwtPayload>(data.access_token);
      dispatch(refreshToken({ token: data.access_token, exp: Number(decodedToken.exp) }));
      console.log('Token refrescado exitosamente.');
    }

    if (error && isAuthenticated) {
      console.error('Error al refrescar el token:', error);
      dispatch(logout());
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate, data, error, dispatch]);

  useEffect(() => {
    if (!isAuthenticated || !exp) return;

    const interval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = exp - currentTime;

      if (timeLeft <= 180) {
        // 🔥 Refrescar cuando falten 3 minutos (180 segundos)
        console.log('Refrescando token automáticamente...');
        refreshSession();
      }
    }, 90000); // 🔄 Revisar cada 90 segundos

    return () => clearInterval(interval);
  }, [isAuthenticated, exp, refreshSession]);

  return <AuthContext.Provider value={{ refreshSession }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
