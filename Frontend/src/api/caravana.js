import axios from "axios";

// Usa variável de ambiente para a URL da API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
});

let isLoggingOut = false;

// Função para fazer logout e limpar estado
const handleLogout = () => {
    if (isLoggingOut) return;
    
    isLoggingOut = true;
    
    localStorage.removeItem('funcionario');
    window.location.href = '/login';
    
    setTimeout(() => {
        isLoggingOut = false;
    }, 1000);
};

// Interceptor de resposta
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        
        console.error('Erro na requisição:', status, message);
        
        if (status === 401) {
            console.warn('🔒 Sessão expirada ou inválida. Fazendo logout...');
            
            if (!error.config.url.includes('/auth/login')) {
                handleLogout();
            }
        }
        
        return Promise.reject(error);
    }
);

// ============================================
// AUTENTICAÇÃO
// ============================================

export const login = async (payload) => {
    return await api.post('/auth/login', payload);
};

export const register = async (payload) => {
    return await api.post('/auth/register', payload);
};

export const logout = () => {
    return api.post('/auth/logout');
};

// ============================================
// EMPRESA
// ============================================

export const getEmpresaById = async (empresaId) => {
    return await api.get(`/empresa/${empresaId}`);
};

export const updateEmpresa = async (empresaId, data) => {
    return await api.put(`/empresa/${empresaId}`, data);
};

export const getEmpresaDashboard = async (empresaId) => {
    return await api.get(`/empresa/${empresaId}/dashboard`);
};

// ============================================
// VEÍCULOS
// ============================================

export const getVeiculos = async (empresaId) => {
    return await api.get('/vehicle', {
        params: empresaId ? { empresaId } : {}
    });
};

export const getVeiculoById = async (veiculoId) => {
    return await api.get(`/vehicle/${veiculoId}`);
};

export const createVeiculo = async (veiculoData) => {
    return await api.post('/vehicle/create', veiculoData);
};

export const updateVeiculo = async (veiculoId, veiculoData) => {
    return await api.put(`/vehicle/${veiculoId}`, veiculoData);
};

export const deleteVeiculo = async (veiculoId) => {
    return await api.delete(`/vehicle/${veiculoId}`);
};

export const getFuncionariosDisponiveis = async () => {
    const response = await api.get('/user/disponiveis');
    return response;
};

export const vincularFuncionario = async (carroId, funcionarioId) => {
    return await api.post(`/vehicle/${carroId}/vincular-funcionario`, {
        funcionarioId
    });
};

export const desvincularFuncionario = async (carroId) => {
    return await api.post(`/vehicle/${carroId}/desvincular-funcionario`);
};

export const atualizarDadosOBD = async (carroId, dadosOBD) => {
    return await api.put(`/vehicle/${carroId}/dados-obd`, dadosOBD);
};

export const getHistoricoOBD = async (carroId, params = {}) => {
    return await api.get(`/vehicle/${carroId}/historico-obd`, { params });
};

export const getAlertasOBD = async (carroId, params = {}) => {
    return await api.get(`/vehicle/${carroId}/alertas`, { params });
};

// ============================================
// FUNCIONÁRIOS
// ============================================

export const getMe = async () => {
    return await api.get('/auth/me');
};

export const getFuncionarios = async (empresaId) => {
    return await api.get('/user', {
        params: empresaId ? { empresaId } : {}
    });
};

export const registerAdmin = async (payload)=> {
    return await api.post("/auth/register", payload);
}

export const getFuncionarioById = async (funcionarioId) => {
    return await api.get(`/user/${funcionarioId}`);
};

export const addFuncionario = async (funcionarioData) => {
    return await api.post('/user/create', funcionarioData);
};

export const updateFuncionario = async (id, data) => {
    return await api.put(`/user/${id}`, data);
};

export const deleteFuncionario = async (funcionarioId) => {
    return await api.delete(`/user/${funcionarioId}`);
};

export const getMeuCarro = async (funcionarioId) => {
    return await api.get(`/user/${funcionarioId}/meu-carro`);
};

// ============================================
// HELPERS
// ============================================

export const getEmpresaId = () => {
    try {
        const funcionarioString = localStorage.getItem('funcionario');
        if (funcionarioString) {
            const funcionario = JSON.parse(funcionarioString);
            return funcionario.empresaId; 
        }
        console.warn('⚠️ Nenhum funcionário encontrado no localStorage');
        return null;
    } catch (error) {
        console.error('❌ Erro ao buscar empresaId:', error);
        return null;
    }
};

export default api;