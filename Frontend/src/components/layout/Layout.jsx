import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Truck, Users, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Veículos', href: '/veiculos', icon: Truck },
    { name: 'Funcionários', href: '/funcionarios', icon: Users },
];

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isExpanded, setIsExpanded] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Função para pegar as iniciais do nome
    const getInitials = (name) => {
        if (!name) return 'U';
        const names = name.trim().split(' ');
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`flex flex-col bg-white border-r border-gray-200 shadow-xl transition-all duration-300 ${
                isExpanded ? 'w-64' : 'w-20'
            }`}>
                
                {/* Header com Logo e Toggle */}
                <div className={`flex items-center border-b border-gray-200 px-4 transition-all duration-300 ${
                    isExpanded ? 'justify-between py-4 h-auto' : 'justify-center py-4'
                }`}>
                    {isExpanded && (
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <img 
                                src={logo}
                                alt="Caravana Logo" 
                                className="h-12 w-auto object-contain"
                            />
                            <span className="text-sm font-semibold text-gray-600 truncate w-full text-center">
                                {user?.empresa || 'Sistema'}
                            </span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-[#002970] transition-colors ${
                            isExpanded ? '' : 'mx-auto'
                        }`}
                        title={isExpanded ? 'Retrair menu' : 'Expandir menu'}
                    >
                        {isExpanded ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                
                {/* Seção de Perfil do Usuário */}
                {isExpanded && (
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Foto de Perfil com Iniciais */}
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#002970] to-[#FF860B] rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                                {getInitials(user?.nome)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-800 truncate" title={user?.nome}>
                                    {user?.nome || 'Usuário'}
                                </p>
                                <p className="text-xs text-gray-500 truncate" title={user?.email}>
                                    {user?.email || 'usuario@app.com'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Avatar compacto quando retraído */}
                {!isExpanded && (
                    <div className="p-4 border-b border-gray-200 flex justify-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#002970] to-[#FF860B] rounded-full flex items-center justify-center text-white font-semibold shadow-md text-sm">
                            {getInitials(user?.nome)}
                        </div>
                    </div>
                )}

                {/* Links de Navegação */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 font-medium ${
                                    isActive
                                        ? 'bg-[#002970] text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-[#002970]'
                                } ${!isExpanded ? 'justify-center' : ''}`}
                                title={!isExpanded ? item.name : ''}
                            >
                                <item.icon size={20} className="flex-shrink-0" />
                                {isExpanded && <span className="truncate">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Botão de Sair/Logout */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 font-medium ${
                            !isExpanded ? 'justify-center' : ''
                        }`}
                        title={!isExpanded ? 'Sair' : ''}
                    >
                        <LogOut size={20} className="flex-shrink-0" />
                        {isExpanded && <span>Sair</span>}
                    </button>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </div>
    );
};

export default Layout;