import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Componente que monitora eventos de storage para detectar logout
 * em outras abas/janelas do navegador
 */
const SessionMonitor = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Função que monitora mudanças no localStorage
    const handleStorageChange = (e) => {
      // Se o item 'funcionario' foi removido em outra aba
      if (e.key === 'funcionario' && e.newValue === null && isAuthenticated) {
        console.log('🔄 Logout detectado em outra aba');
        logout();
        navigate('/login');
      }
    };

    // Adiciona listener para mudanças no storage
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, logout, navigate]);

  return children; // Renderiza os filhos normalmente
};

export default SessionMonitor;