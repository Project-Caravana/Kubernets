import { createContext, useContext, useState, useEffect } from 'react';
import { logout as logoutApi, getMe } from '../api/caravana';

const AuthContext = createContext();

//eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error('useAuth must be used within AuthProvider');
  return c;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para limpar o estado
  const clearState = () => {
    console.log('🧹 Limpando estado...');
    localStorage.removeItem('funcionario');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Logout - chama a API e limpa o estado
  const logout = async () => {
    try {
      await logoutApi(); 
      console.log('✅ Logout realizado com sucesso');
    } catch(error) {
      console.error("❌ Erro ao fazer logout no servidor:", error);
    } finally {
      clearState();
    }
  };

  // Valida sessão com o backend
  const validateSession = async () => {
    try {
      const response = await getMe();
      
      if (!response.data || !response.data.funcionario) {
        console.error('❌ Resposta inválida do backend');
        return false;
      }
      
      const funcionario = response.data.funcionario;
      
      console.log('✅ Sessão validada:', {
        nome: funcionario.nome,
        perfil: funcionario.perfil,
        empresaId: funcionario.empresaId
      });
      
      // Atualiza o localStorage com dados frescos do backend
      localStorage.setItem('funcionario', JSON.stringify(funcionario));
      
      setIsAuthenticated(true);
      setUser(funcionario);
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao validar sessão:', error.response?.data?.message || error.message);
      clearState();
      return false;
    }
  };

  // Verifica autenticação ao carregar o app
  useEffect(() => {
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    console.log('🔐 Iniciando verificação de autenticação...');
    
    try {
      const funcionarioStr = localStorage.getItem('funcionario');
      
      if (!funcionarioStr) {
        console.log('ℹ️ Nenhum usuário autenticado no localStorage');
        setLoading(false);
        return;
      }
      
      console.log('📦 Dados encontrados no localStorage, validando com backend...');
      
      // Valida com o backend
      const isValid = await validateSession();
      
      if (!isValid) {
        console.warn('⚠️ Sessão inválida, usuário será deslogado');
      }
    } catch (err) {
      console.error('❌ Erro ao verificar autenticação:', err);
      clearState();
    } finally {
      console.log('✅ Verificação de autenticação concluída');
      setLoading(false);
    }
  };

  const login = (funcionario) => {
    console.log('✅ Login realizado:', funcionario.nome);
    localStorage.setItem('funcionario', JSON.stringify(funcionario));
    setIsAuthenticated(true);
    setUser(funcionario);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      login, 
      logout, 
      validateSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
};