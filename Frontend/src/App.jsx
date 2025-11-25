import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"
import Register from "./pages/Register";
import Vehicles from "./pages/Vehicles";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Employee from "./pages/Employee";
import SessionMonitor from "./components/SessionMonitor";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF860B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log('❌ Usuário não autenticado, redirecionando para /login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF860B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (user) {
    console.log('✅ Usuário já autenticado, redirecionando para /dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      if (loading) return;

      if (!isAuthenticated || !user) {
        console.log('❌ Não autenticado ou sem user');
        setHasAccess(false);
        setChecking(false);
        return;
      }

      // ⭐ Perfil agora é string
      const isAdmin = user.perfil === 'admin';

      console.log('🔐 Verificando acesso admin:', {
        nome: user.nome,
        perfil: user.perfil,
        isAdmin
      });

      setHasAccess(isAdmin);
      setChecking(false);
    };

    checkAccess();
  }, [loading, isAuthenticated, user]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF860B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.warn('⚠️ Usuário não autenticado, redirecionando...');
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    console.warn('⚠️ Acesso negado - usuário não é admin');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-10 h-10 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center">
            Acesso Negado
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Você não tem permissão para acessar esta página. 
            Apenas administradores podem visualizar este conteúdo.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Seu perfil:</p>
            <p className="font-semibold text-gray-800 capitalize">
              {user?.perfil || 'Desconhecido'}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1 py-3 px-6 bg-[#002970] text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('✅ Acesso admin concedido');
  return children;
};

function App() {
  return (
    <>
      <AuthProvider>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
        />
        <BrowserRouter>
          <SessionMonitor>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/veiculos" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
              <Route path="/funcionarios" element={<ProtectedRoute><Employee /></ProtectedRoute>} />
            </Routes>
          </SessionMonitor>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App;