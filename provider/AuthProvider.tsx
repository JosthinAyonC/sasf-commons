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
  const token = useSelector((state: RootState) => state.auth.token);
  const exp = useSelector((state: RootState) => state.auth.exp);
  const navigate = useNavigate();

  // Usar `useQuery` para el endpoint de refresh
  const { data, error, refetch } = useQuery<AuthResponse>(`${process.env.AUTH_URL}${process.env.REFRESH_TOKEN_PATH || ''}`);

  // Lógica para refrescar el token
  const refreshSession = useCallback(() => {
    if (token) {
      console.log('Intentando refrescar el token...');
      refetch();
    }
  }, [token, refetch]);

  // Manejar el resultado del refresh
  useEffect(() => {
    if (data) {
      const decodedToken = jwtDecode<{ sub: string; roles: string[] } & JwtPayload>(data.access_token);
      dispatch(refreshToken({ token: data.access_token, exp: Number(decodedToken.exp) }));
      console.log('Token refrescado exitosamente.');
    }
    if (error) {
      console.error('Error refreshing token:', error);
      dispatch(logout());
      navigate('/auth/login');
    }
  }, [navigate, data, error, dispatch]);

  // Verificar si el token está por expirar y ejecutar el refresh
  useEffect(() => {
    if (exp) {
      const interval = setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = exp - currentTime;

        if (timeLeft <= 180) {
          // Refrescar cuando falten 3 minutos (180 segundos)
          console.log('Refrescando token...');
          refreshSession();
        }
      }, 60000); // Revisar cada 60 segundos

      return () => clearInterval(interval);
    }
  }, [exp, refreshSession]);

  return <AuthContext.Provider value={{ refreshSession }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
