import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Plus, Edit, Trash2, Eye, X, User, Mail, Phone, CreditCard, Briefcase } from 'lucide-react';
import { getFuncionarios, deleteFuncionario, addFuncionario, updateFuncionario, getEmpresaId } from '../api/caravana.js';
import { toast } from 'react-toastify';
import useForm from '../hooks/useForm';
import Input from '../components/form/Input';

// Modal de Formulário
const FormModal = ({ 
    showFormModal, 
    handleCloseForm, 
    handleSubmit, 
    editingFuncionario,
    userRole
}) => {
    const nome = useForm();
    const cpf = useForm('cpf');
    const email = useForm('email');
    const telefone = useForm('telefone');
    const senha = useForm();
    const [perfil, setPerfil] = useState('funcionario');

    useEffect(() => {
        if (editingFuncionario) {
            nome.setValue(editingFuncionario.nome || '');
            cpf.setValue(editingFuncionario.cpf || '');
            email.setValue(editingFuncionario.email || '');
            telefone.setValue(editingFuncionario.telefone || '');
            const perfilValue = editingFuncionario.perfil || (userRole === 'admin' ? 'funcionario' : 'motorista');
            if (perfil !== perfilValue) {
                setPerfil(perfilValue);
            }
        } else {
            nome.setValue('');
            cpf.setValue('');
            email.setValue('');
            telefone.setValue('');
            senha.setValue('');
            const perfilDefault = userRole === 'admin' ? 'funcionario' : 'motorista';
            if (perfil !== perfilDefault) {
                setPerfil(perfilDefault);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingFuncionario, userRole]);

    const onSubmit = (e) => {
        e.preventDefault();
        
        if (!nome.validate() || !cpf.validate() || !email.validate() || !telefone.validate()) {
            toast.error('Preencha todos os campos corretamente');
            return;
        }

        if (!editingFuncionario && senha.value.length < 6) {
            toast.error('Senha deve ter no mínimo 6 caracteres');
            return;
        }

        const formData = {
            nome: nome.value,
            cpf: cpf.value,
            email: email.value,
            telefone: telefone.value,
            perfil: perfil
        };

        if (!editingFuncionario) {
            formData.senha = senha.value;
        }

        handleSubmit(formData);
    };

    if (!showFormModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-[#002970] to-[#FF860B] p-6 text-white sticky top-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">
                            {editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
                        </h2>
                        <button onClick={handleCloseForm} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        <Input type="text" id="nome" label="Nome Completo" placeholder="João Silva" {...nome} required />
                        <Input type="text" id="cpf" label="CPF" placeholder="000.000.000-00" {...cpf} required />
                        <Input type="email" id="email" label="E-mail" placeholder="joao@email.com" {...email} required />
                        <Input type="text" id="telefone" label="Telefone" placeholder="(11) 98765-4321" {...telefone} required />
                        
                        {!editingFuncionario && (
                            <Input type="password" id="senha" label="Senha" placeholder="Mínimo 6 caracteres" {...senha} required />
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Perfil <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={perfil}
                                onChange={(e) => setPerfil(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF860B] focus:outline-none"
                            >
                                {userRole === 'admin' ? (
                                    <>
                                        <option value="funcionario">Funcionário</option>
                                        <option value="motorista">Motorista</option>
                                        <option value="admin">Administrador</option>
                                    </>
                                ) : (
                                    <option value="motorista">Motorista</option>
                                )}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                {userRole === 'admin' 
                                    ? 'Administradores podem gerenciar toda a empresa'
                                    : 'Motoristas podem apenas visualizar seus dados'}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            type="button"
                            onClick={handleCloseForm}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={onSubmit}
                            className="flex-1 px-6 py-3 bg-[#FF860B] text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-lg hover:shadow-xl"
                        >
                            {editingFuncionario ? 'Atualizar' : 'Cadastrar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Modal de Detalhes
const DetailsModal = ({ showModal, selectedFuncionario, handleClose }) => {
    if (!showModal || !selectedFuncionario) return null;

    const getPerfilBadge = (perfil) => {
        const perfilTexto = perfil || 'funcionario';
        const colors = {
            admin: 'bg-purple-100 text-purple-800',
            funcionario: 'bg-blue-100 text-blue-800',
            motorista: 'bg-green-100 text-green-800'
        };
        const labels = {
            admin: 'Administrador',
            funcionario: 'Funcionário',
            motorista: 'Motorista'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[perfilTexto]}`}>
                {labels[perfilTexto]}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-[#002970] to-[#FF860B] p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold">{selectedFuncionario.nome}</h2>
                            <p className="text-xl opacity-90 mt-1">{selectedFuncionario.email}</p>
                        </div>
                        <button onClick={handleClose} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b">Informações Pessoais</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <User size={14} /> Nome Completo
                                </p>
                                <p className="text-lg font-semibold">{selectedFuncionario.nome}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <CreditCard size={14} /> CPF
                                </p>
                                <p className="text-lg font-semibold">{selectedFuncionario.cpf}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Mail size={14} /> E-mail
                                </p>
                                <p className="text-lg font-semibold">{selectedFuncionario.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Phone size={14} /> Telefone
                                </p>
                                <p className="text-lg font-semibold">{selectedFuncionario.telefone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Briefcase size={14} /> Perfil
                                </p>
                                <div className="mt-2">
                                    {getPerfilBadge(selectedFuncionario.perfil)}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className={`w-3 h-3 rounded-full ${selectedFuncionario.ativo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="font-semibold">{selectedFuncionario.ativo ? 'Ativo' : 'Inativo'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedFuncionario.carroAtual && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b">Veículo Vinculado</h3>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="font-semibold text-gray-800">{selectedFuncionario.carroAtual.modelo}</p>
                                <p className="text-sm text-gray-600">Placa: {selectedFuncionario.carroAtual.placa}</p>
                            </div>
                        </div>
                    )}

                    <div className="text-xs text-gray-500 pt-4 border-t">
                        Cadastrado em: {new Date(selectedFuncionario.createdAt).toLocaleString('pt-BR')}
                    </div>
                </div>
            </div>
        </div>
    );
};

// COMPONENTE PRINCIPAL
const Employee = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedFuncionario, setSelectedFuncionario] = useState(null);
    const [editingFuncionario, setEditingFuncionario] = useState(null);
    const [userRole, setUserRole] = useState('funcionario');

    const dataHoje = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    useEffect(() => {
        fetchFuncionarios();
        checkUserRole();
    }, []);

    const checkUserRole = () => {
        try {
            const funcionarioStr = localStorage.getItem('funcionario');
            if (funcionarioStr) {
                const funcionario = JSON.parse(funcionarioStr);
                setUserRole(funcionario.perfil || 'funcionario');
            }
        } catch (error) {
            console.error('Erro ao verificar perfil:', error);
        }
    };

    const fetchFuncionarios = async () => {
        setLoading(true);
        try {
            const empresaId = getEmpresaId();
            const response = await getFuncionarios(empresaId);
            setFuncionarios(response.data.funcionarios || []);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
            toast.error('Erro ao carregar funcionários');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este funcionário?')) return;
        try {
            await deleteFuncionario(id);
            toast.success('Funcionário excluído com sucesso!');
            fetchFuncionarios();
        } catch (error) {
            console.error('Erro ao excluir funcionário:', error);
            toast.error(error.response?.data?.message || 'Erro ao excluir funcionário');
        }
    };

    const handleOpenForm = (funcionario = null) => {
        setEditingFuncionario(funcionario);
        setShowFormModal(true);
    };

    const handleCloseForm = () => {
        setShowFormModal(false);
        setEditingFuncionario(null);
    };

    const handleSubmit = async (formData) => {
        try {
            const empresaId = getEmpresaId();
            const payload = { ...formData, empresaId: empresaId };

            if (editingFuncionario) {
                await updateFuncionario(editingFuncionario._id, payload);
                toast.success('Funcionário atualizado com sucesso!');
            } else {
                await addFuncionario(payload);
                toast.success('Funcionário cadastrado com sucesso!');
            }
            
            handleCloseForm();
            fetchFuncionarios();
        } catch (error) {
            console.error('Erro ao salvar funcionário:', error);
            const message = error.response?.data?.message || error.response?.data?.erros?.[0] || 'Erro ao salvar funcionário';
            toast.error(message);
        }
    };

    const handleViewDetails = (funcionario) => {
        setSelectedFuncionario(funcionario);
        setShowModal(true);
    };

    const getPerfilBadge = (perfil) => {
        const perfilTexto = perfil || 'funcionario';
        const colors = {
            admin: 'bg-purple-100 text-purple-800',
            funcionario: 'bg-blue-100 text-blue-800',
            motorista: 'bg-green-100 text-green-800'
        };
        const labels = {
            admin: 'Admin',
            funcionario: 'Funcionário',
            motorista: 'Motorista'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[perfilTexto]}`}>
                {labels[perfilTexto]}
            </span>
        );
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Funcionários</h1>
                        <p className="text-sm text-gray-600 capitalize mt-1">{dataHoje}</p>
                    </div>
                    <button onClick={() => handleOpenForm()} className="flex items-center gap-2 px-6 py-3 bg-[#FF860B] text-white rounded-lg hover:bg-orange-600 transition-colors shadow-lg">
                        <Plus size={20} /> Novo Funcionário
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#FF860B] rounded-full animate-spin"></div>
                    </div>
                ) : funcionarios.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-[#002970] to-[#FF860B] text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Nome</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">CPF</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">E-mail</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Telefone</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Perfil</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {funcionarios.map((funcionario, index) => (
                                        <tr key={funcionario._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-gray-800">{funcionario.nome}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700 font-mono text-sm">{funcionario.cpf}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700 text-sm">{funcionario.email}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700 text-sm">{funcionario.telefone}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getPerfilBadge(funcionario.perfil)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${funcionario.ativo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    <span className="text-sm font-medium">{funcionario.ativo ? 'Ativo' : 'Inativo'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleViewDetails(funcionario)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Ver Detalhes">
                                                        <Eye size={18} />
                                                    </button>
                                                    <button onClick={() => handleOpenForm(funcionario)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Editar">
                                                        <Edit size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(funcionario._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Excluir">
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
                            <User className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum funcionário cadastrado</h3>
                        <p className="text-gray-500 mb-6">Comece adicionando o primeiro funcionário</p>
                        <button onClick={() => handleOpenForm()} className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF860B] text-white rounded-lg hover:bg-orange-600 transition-colors">
                            <Plus size={20} /> Adicionar Funcionário
                        </button>
                    </div>
                )}
            </div>

            <DetailsModal showModal={showModal} selectedFuncionario={selectedFuncionario} handleClose={() => setShowModal(false)} />
            <FormModal 
                showFormModal={showFormModal}
                handleCloseForm={handleCloseForm}
                handleSubmit={handleSubmit}
                editingFuncionario={editingFuncionario}
                userRole={userRole}
            />
        </Layout>
    );
};

export default Employee;