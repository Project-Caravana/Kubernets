import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Plus, Edit, Trash2, Eye, X, Gauge, Fuel, User, UserX } from 'lucide-react';
import { getVeiculos, deleteVeiculo, createVeiculo, updateVeiculo, getEmpresaId, getFuncionariosDisponiveis, vincularFuncionario, desvincularFuncionario } from '../api/caravana.js';
import { toast } from 'react-toastify';
import { useSocket } from '../hooks/useSocket';

// FormModal - SEU CÓDIGO ORIGINAL COMPLETO
const FormModal = ({ 
    showFormModal, 
    handleCloseForm, 
    handleSubmit, 
    handleInputChange, 
    formData, 
    editingVeiculo,
    funcionariosDisponiveis,
    funcionarioAtual,
    handleVincularFuncionario,
    handleDesvincularFuncionario
}) => {
    if (!showFormModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-[#002970] to-[#FF860B] p-6 text-white sticky top-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">
                            {editingVeiculo ? 'Editar Veículo' : 'Novo Veículo'}
                        </h2>
                        <button onClick={handleCloseForm} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Placa <span className="text-red-500">*</span></label>
                            <input type="text" name="placa" value={formData.placa} onChange={handleInputChange} placeholder="ABC-1234" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF860B] focus:border-transparent uppercase" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo <span className="text-red-500">*</span></label>
                            <input type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} placeholder="Ônix" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF860B] focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marca <span className="text-red-500">*</span></label>
                            <input type="text" name="marca" value={formData.marca} onChange={handleInputChange} placeholder="Chevrolet" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF860B] focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ano <span className="text-red-500">*</span></label>
                            <input type="number" name="ano" value={formData.ano} onChange={handleInputChange} min="1900" max={new Date().getFullYear() + 1} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF860B] focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Veículo</label>
                            <select name="tipoVeiculo" value={formData.tipoVeiculo} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF860B] focus:border-transparent">
                                <option value="Passeio">Passeio</option>
                                <option value="Caminhão">Caminhão</option>
                                <option value="Van">Van</option>
                                <option value="Caminhonete">Caminhonete</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Combustível</label>
                            <select name="tipoCombustivel" value={formData.tipoCombustivel} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF860B] focus:border-transparent">
                                <option value="Flex">Flex</option>
                                <option value="Gasolina">Gasolina</option>
                                <option value="Etanol">Etanol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Elétrico">Elétrico</option>
                                <option value="Híbrido">Híbrido</option>
                                <option value="GNV">GNV</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                            <input type="text" name="cor" value={formData.cor} onChange={handleInputChange} placeholder="Preto" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF860B] focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chassi</label>
                            <input type="text" name="chassi" value={formData.chassi} onChange={handleInputChange} placeholder="234561231" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF860B] focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">KM Total</label>
                            <input type="text" name="kmTotal" value={formData.kmTotal} onChange={handleInputChange} min="0" placeholder="125500" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF860B] focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Próxima Manutenção</label>
                            <input type="date" name="proxManutencao" value={formData.proxManutencao} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF860B] focus:border-transparent" />
                        </div>
                    </div>

                    {editingVeiculo && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <User size={20} /> Funcionário Responsável
                            </h3>
                            {funcionarioAtual ? (
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800">{funcionarioAtual.nome}</p>
                                            <p className="text-sm text-gray-600">CPF: {funcionarioAtual.cpf}</p>
                                            <p className="text-sm text-gray-600">Email: {funcionarioAtual.email}</p>
                                        </div>
                                        <button type="button" onClick={handleDesvincularFuncionario} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                                            <UserX size={16} /> Desvincular
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Selecione um funcionário disponível</label>
                                    <div className="flex gap-2">
                                        <select name="funcionarioSelecionado" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF860B] focus:border-transparent" defaultValue="">
                                            <option value="" disabled>Escolha um funcionário</option>
                                            {funcionariosDisponiveis.map(func => (
                                                <option key={func._id} value={func._id}>{func.nome} - CPF: {func.cpf}</option>
                                            ))}
                                        </select>
                                        <button type="button" onClick={(e) => {
                                            const select = e.target.closest('div').querySelector('select');
                                            const funcionarioId = select.value;
                                            if (funcionarioId) {
                                                handleVincularFuncionario(funcionarioId);
                                                select.value = '';
                                            } else {
                                                toast.warning('Selecione um funcionário');
                                            }
                                        }} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap">
                                            <User size={16} /> Vincular
                                        </button>
                                    </div>
                                    {funcionariosDisponiveis.length === 0 && (
                                        <p className="text-sm text-gray-500 mt-2">Nenhum funcionário disponível no momento</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-4 mt-6">
                        <button type="button" onClick={handleCloseForm} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            Cancelar
                        </button>
                        <button type="submit" className="flex-1 px-6 py-3 bg-[#FF860B] text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-lg hover:shadow-xl">
                            {editingVeiculo ? 'Atualizar' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// COMPONENTE PRINCIPAL
const Vehicles = () => {
    const [veiculos, setVeiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedVeiculo, setSelectedVeiculo] = useState(null);
    const [editingVeiculo, setEditingVeiculo] = useState(null);
    const [funcionariosDisponiveis, setFuncionariosDisponiveis] = useState([]);
    const [funcionarioAtual, setFuncionarioAtual] = useState(null);
    const [formData, setFormData] = useState({
        placa: '', modelo: '', marca: '', ano: new Date().getFullYear(),
        tipoVeiculo: 'Passeio', tipoCombustivel: 'Flex', cor: '', chassi: '',
        kmTotal: 0, proxManutencao: ''
    });

    const { socket, isConnected } = useSocket();

    const dataHoje = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    useEffect(() => { fetchVeiculos(); }, []);

    useEffect(() => {
        if (!socket || !isConnected) return;
        veiculos.carros?.forEach(veiculo => { socket.emit('subscribe', veiculo._id); });
        socket.on('obd:atualizado', (data) => {
            setVeiculos(prevVeiculos => ({
                ...prevVeiculos,
                carros: prevVeiculos.carros?.map(veiculo => 
                    veiculo._id === data.carroId ? { ...veiculo, dadosOBD: data.dadosOBD, kmTotal: data.kmTotal } : veiculo
                ) || []
            }));
        });
        return () => { socket.off('obd:atualizado'); };
    }, [socket, isConnected, veiculos.carros]);

    const fetchVeiculos = async () => {
        setLoading(true);
        try {
            const empresaId = getEmpresaId();
            const response = await getVeiculos(empresaId);
            setVeiculos(response.data || []);
        } catch (error) {
            console.error('Erro ao buscar veículos:', error);
            toast.error('Erro ao carregar veículos');
        } finally { setLoading(false); }
    };

    const fetchFuncionariosDisponiveis = async () => {
        try {
            const response = await getFuncionariosDisponiveis();
            setFuncionariosDisponiveis(response.data.funcionarios || []);
        } catch (error) {
            console.error('Erro ao buscar funcionários disponíveis:', error);
            toast.error('Erro ao carregar funcionários');
        }
    };

    const handleVincularFuncionario = async (funcionarioId) => {
        try {
            await vincularFuncionario(editingVeiculo._id, funcionarioId);
            toast.success('Funcionário vinculado com sucesso!');
            const funcionario = funcionariosDisponiveis.find(f => f._id === funcionarioId);
            setFuncionarioAtual(funcionario);
            await fetchFuncionariosDisponiveis();
            await fetchVeiculos();
        } catch (error) {
            console.error('Erro ao vincular funcionário:', error);
            toast.error(error.response?.data?.message || 'Erro ao vincular funcionário');
        }
    };

    const handleDesvincularFuncionario = async () => {
        if (!window.confirm('Deseja realmente desvincular este funcionário?')) return;
        try {
            await desvincularFuncionario(editingVeiculo._id);
            toast.success('Funcionário desvinculado com sucesso!');
            setFuncionarioAtual(null);
            await fetchFuncionariosDisponiveis();
            await fetchVeiculos();
        } catch (error) {
            console.error('Erro ao desvincular funcionário:', error);
            toast.error(error.response?.data?.message || 'Erro ao desvincular funcionário');
        }
    };

    const calcularConsumoMedio = (veiculo) => {
        if (!veiculo.dadosOBD?.consumoInstantaneo) return 'N/A';
        return `${veiculo.dadosOBD.consumoInstantaneo.toFixed(1)} km/L`;
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este veículo?')) return;
        try {
            await deleteVeiculo(id);
            toast.success('Veículo excluído com sucesso!');
            fetchVeiculos();
        } catch (error) {
            console.error('Erro ao excluir veículo:', error);
            toast.error(error.response?.data?.message || 'Erro ao excluir veículo');
        }
    };

    const handleOpenForm = async (veiculo = null) => {
        if (veiculo) {
            setEditingVeiculo(veiculo);
            setFuncionarioAtual(veiculo.funcionarioAtual || null);
            setFormData({
                placa: veiculo.placa || '', modelo: veiculo.modelo || '', marca: veiculo.marca || '',
                ano: veiculo.ano || new Date().getFullYear(), tipoVeiculo: veiculo.tipoVeiculo || 'Passeio',
                tipoCombustivel: veiculo.tipoCombustivel || 'Flex', cor: veiculo.cor || '', chassi: veiculo.chassi || '',
                kmTotal: veiculo.kmTotal || 0,
                proxManutencao: veiculo.proxManutencao ? new Date(veiculo.proxManutencao).toISOString().split('T')[0] : ''
            });
            await fetchFuncionariosDisponiveis();
        } else {
            setEditingVeiculo(null);
            setFuncionarioAtual(null);
            setFormData({
                placa: '', modelo: '', marca: '', ano: new Date().getFullYear(), tipoVeiculo: 'Passeio',
                tipoCombustivel: 'Flex', cor: '', chassi: '', kmTotal: 0, proxManutencao: ''
            });
        }
        setShowFormModal(true);
    };

    const handleCloseForm = () => {
        setShowFormModal(false);
        setEditingVeiculo(null);
        setFuncionarioAtual(null);
        setFuncionariosDisponiveis([]);
        setFormData({
            placa: '', modelo: '', marca: '', ano: new Date().getFullYear(), tipoVeiculo: 'Passeio',
            tipoCombustivel: 'Flex', cor: '', chassi: '', kmTotal: 0, proxManutencao: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, ano: parseInt(formData.ano), kmTotal: parseFloat(formData.kmTotal) };
            if (editingVeiculo) {
                await updateVeiculo(editingVeiculo._id, payload);
                toast.success('Veículo atualizado com sucesso!');
            } else {
                const empresaId = getEmpresaId();
                await createVeiculo({ ...payload, empresa: empresaId });
                toast.success('Veículo cadastrado com sucesso!');
            }
            handleCloseForm();
            fetchVeiculos();
        } catch (error) {
            console.error('Erro ao salvar veículo:', error);
            const message = error.response?.data?.message || error.response?.data?.erros?.[0] || 'Erro ao salvar veículo';
            toast.error(message);
        }
    };

    const handleViewDetails = (veiculo) => {
        setSelectedVeiculo(veiculo);
        setShowModal(true);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'disponivel': return 'bg-green-500';
            case 'em_uso': return 'bg-blue-500';
            case 'manutencao': return 'bg-yellow-500';
            case 'inativo': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'disponivel': return 'Disponível';
            case 'em_uso': return 'Em Uso';
            case 'manutencao': return 'Manutenção';
            case 'inativo': return 'Inativo';
            default: return 'N/A';
        }
    };

    // Modal de Detalhes com CARD COMPLETO
    const DetailsModal = () => {
        if (!showModal || !selectedVeiculo) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="bg-gradient-to-r from-[#002970] to-[#FF860B] p-6 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-bold">{selectedVeiculo.modelo}</h2>
                                <p className="text-xl opacity-90 mt-1">{selectedVeiculo.placa}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b">Informações do Veículo</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-sm text-gray-500">Marca</p><p className="text-lg font-semibold">{selectedVeiculo.marca}</p></div>
                                <div><p className="text-sm text-gray-500">Modelo</p><p className="text-lg font-semibold">{selectedVeiculo.modelo}</p></div>
                                <div><p className="text-sm text-gray-500">Ano</p><p className="text-lg font-semibold">{selectedVeiculo.ano}</p></div>
                                <div><p className="text-sm text-gray-500">Cor</p><p className="text-lg font-semibold">{selectedVeiculo.cor}</p></div>
                                <div><p className="text-sm text-gray-500">Tipo</p><p className="text-lg font-semibold">{selectedVeiculo.tipoVeiculo}</p></div>
                                <div><p className="text-sm text-gray-500">Combustível</p><p className="text-lg font-semibold">{selectedVeiculo.tipoCombustivel}</p></div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedVeiculo.status)}`}></div>
                                        <span className="text-lg font-semibold">{getStatusText(selectedVeiculo.status)}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center gap-1"><Gauge size={16} /> KM Total</p>
                                    <p className="text-lg font-semibold text-blue-600">{selectedVeiculo.kmTotal?.toLocaleString('pt-BR')} km</p>
                                </div>
                            </div>
                        </div>

                        {selectedVeiculo.funcionarioAtual && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b flex items-center gap-2">
                                    <User size={20} /> Funcionário Responsável
                                </h3>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="font-semibold text-gray-800">{selectedVeiculo.funcionarioAtual.nome}</p>
                                    <p className="text-sm text-gray-600">CPF: {selectedVeiculo.funcionarioAtual.cpf}</p>
                                    <p className="text-sm text-gray-600">Email: {selectedVeiculo.funcionarioAtual.email}</p>
                                </div>
                            </div>
                        )}

                        {selectedVeiculo.dadosOBD && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b">📡 Dados em Tempo Real (OBD)</h3>
                                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><p className="text-sm text-gray-600 flex items-center gap-1"><Fuel size={14} /> Consumo Instantâneo</p><p className="text-2xl font-bold text-green-700">{calcularConsumoMedio(selectedVeiculo)}</p></div>
                                        <div><p className="text-sm text-gray-600">Velocidade</p><p className="text-2xl font-bold text-blue-700">{selectedVeiculo.dadosOBD.velocidade} km/h</p></div>
                                        <div><p className="text-sm text-gray-600">Temperatura</p><p className="text-2xl font-bold text-orange-600">{selectedVeiculo.dadosOBD.temperatura?.toFixed(1)}°C</p></div>
                                        <div><p className="text-sm text-gray-600">Combustível</p><p className="text-2xl font-bold text-purple-600">{selectedVeiculo.dadosOBD.nivelCombustivel}%</p></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-blue-200">
                                        Última atualização: {new Date(selectedVeiculo.dadosOBD.ultimaAtualizacao).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Lista de Veículos</h1>
                        <p className="text-sm text-gray-600 capitalize mt-1">{dataHoje}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-xs text-gray-500">{isConnected ? 'Tempo real ativo' : 'Reconectando...'}</span>
                        </div>
                    </div>
                    <button onClick={() => handleOpenForm()} className="flex items-center gap-2 px-6 py-3 bg-[#FF860B] text-white rounded-lg hover:bg-orange-600 transition-colors shadow-lg">
                        <Plus size={20} /> Novo Veículo
                    </button>
                </div>

                <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-md">
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500"></div><span className="text-sm">Disponível</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-blue-500"></div><span className="text-sm">Em Uso</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-yellow-500"></div><span className="text-sm">Manutenção</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500"></div><span className="text-sm">Inativo</span></div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#FF860B] rounded-full animate-spin"></div>
                    </div>
                ) : veiculos.carros?.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-[#002970] to-[#FF860B] text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Placa</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Modelo</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Marca</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Ano</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Funcionário</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">KM Total</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {veiculos.carros.map((veiculo, index) => (
                                        <tr key={veiculo._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-semibold text-gray-800">{veiculo.placa}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700">{veiculo.modelo}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700">{veiculo.marca}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700">{veiculo.ano}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(veiculo.status)}`}></div>
                                                    <span className="text-sm font-medium">{getStatusText(veiculo.status)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {veiculo.funcionarioAtual ? (
                                                    <div className="flex items-center gap-2">
                                                        <User size={14} className="text-blue-600" />
                                                        <span className="text-sm text-gray-700">{veiculo.funcionarioAtual.nome}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">Sem funcionário</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <Gauge size={14} className="text-blue-600" />
                                                    <span className="font-semibold text-blue-600">
                                                        {veiculo.kmTotal?.toLocaleString('pt-BR')} km
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(veiculo)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                        title="Ver Detalhes"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenForm(veiculo)}
                                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(veiculo._id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum veículo cadastrado</h3>
                        <p className="text-gray-500 mb-6">Comece adicionando o primeiro veículo da frota</p>
                        <button
                            onClick={() => handleOpenForm()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF860B] text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            <Plus size={20} /> Adicionar Veículo
                        </button>
                    </div>
                )}
            </div>

            <DetailsModal />
            <FormModal 
                showFormModal={showFormModal}
                handleCloseForm={handleCloseForm}
                handleSubmit={handleSubmit}
                handleInputChange={handleInputChange}
                formData={formData}
                editingVeiculo={editingVeiculo}
                funcionariosDisponiveis={funcionariosDisponiveis}
                funcionarioAtual={funcionarioAtual}
                handleVincularFuncionario={handleVincularFuncionario}
                handleDesvincularFuncionario={handleDesvincularFuncionario}
            />
        </Layout>
    );
};

export default Vehicles;