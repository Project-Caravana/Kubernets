import React from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Step from '../components/Step';
import FormRegister from '../components/FormRegister';
import FormRegister2 from '../components/FormRegister2';
import { registerAdmin } from '../api/caravana.js';
import { toast } from 'react-toastify';

const Register = () => {
    const [step, setStep] = React.useState(1);
    const [formData, setFormData] = React.useState({});
    const [registering, setRegistering] = React.useState(false);

    const navigate = useNavigate();

    const updateFormData = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const getCompStep = () => {
        switch(step) {
            case 1:
                return <FormRegister formData={formData} updateFormData={updateFormData} />;
            case 2:
                return <FormRegister2 formData={formData} updateFormData={updateFormData} />;
            default:
                return null;
        }
    };

    const validateStep1 = () => {
        const { nome, cpf, email, telefone, senha, confirm } = formData;
        
        // Validação completa usando os validators do useForm (necessário usar refs ou passar os objetos useForm para cá)
        // Por hora, mantenho a lógica simples de preenchimento, mas idealmente seria validar o formato aqui também.

        if (!nome || !cpf || !email || !telefone || !senha || !confirm) {
            toast.error('Por favor, preencha todos os campos', 'error');
            return false;
        }
        if (senha !== confirm) {
            toast.error('As senhas não coincidem', 'error');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        const { empresa, cnpj, telefoneEmpresa, empresaEnderecoRua, empresaEnderecoNumero, empresaEnderecoBairro, empresaEnderecoCidade, empresaEnderecoEstado, empresaEnderecoCep } = formData;

        // Idealmente, adicionar validação de formato aqui também.

        if (!empresa || !cnpj || !telefoneEmpresa || !empresaEnderecoRua || !empresaEnderecoNumero || !empresaEnderecoBairro || !empresaEnderecoCidade || !empresaEnderecoEstado || !empresaEnderecoCep) {
            toast.error('Por favor, preencha todos os campos da empresa', 'error');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
            toast.success('Primeira etapa concluída!', 'success');
        }
    };

    const handleSubmit = async () => {
        if (!validateStep2()) return;
        
        setRegistering(true);
        
        try {
            // ✅ Preparar dados com os nomes EXATOS que o backend espera
            const payload = {
                // Dados do funcionário
                nome: formData.nome,
                // Remove a máscara antes de enviar
                cpf: formData.cpf.replace(/\D/g, ''),
                email: formData.email,
                // Remove a máscara antes de enviar
                telefone: formData.telefone.replace(/\D/g, ''),
                senha: formData.senha,
                
                // Dados da empresa (nomes corretos do backend)
                empresaNome: formData.empresa,
                // Remove a máscara antes de enviar
                empresaCnpj: formData.cnpj.replace(/\D/g, ''),
                // Remove a máscara antes de enviar
                empresaTelefone: formData.telefoneEmpresa.replace(/\D/g, ''),
                
                empresaEnderecoRua: formData.empresaEnderecoRua,
                empresaEnderecoNumero: formData.empresaEnderecoNumero,
                empresaEnderecoBairro: formData.empresaEnderecoBairro,
                empresaEnderecoCidade: formData.empresaEnderecoCidade,
                empresaEnderecoEstado: formData.empresaEnderecoEstado,
                empresaEnderecoCep: formData.empresaEnderecoCep
            };
            
            console.log('Dados enviados:', payload);
            const response = await registerAdmin(payload);
            console.log('✅ Resposta:', response.data);
            
            toast.success('Cadastro realizado com sucesso!', 'success');
            
            // Resetar formulário
            setTimeout(() => {
                setStep(1);
                setFormData({});
                navigate("/login");
            }, 100);
            
        } catch (error) {
            console.error('❌ Erro:', error);
            console.error('❌ Response:', error.response?.data);
            
            const errorMessage = error.response?.data?.message 
                || error.response?.data?.erro
                || error.message 
                || 'Erro desconhecido';
            toast.error('Falha ao registrar: ' + errorMessage, 'error');
        } finally {
            setRegistering(false);
        }
    };

    const steps = [
        { index: 1, label: 'Seus Dados', icon: () => <span className="text-lg">👤</span> },
        { index: 2, label: 'Dados da Empresa', icon: () => <span className="text-lg">🏢</span> }
    ];

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-[#FF860B]/10 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-[#002970] mb-2">Criar Conta</h1>
                        <p className="text-gray-600">Preencha os dados para se cadastrar</p>
                    </div>

                    <div className="flex justify-center items-center mb-8 relative">
                        {steps.map((item, idx) => (
                            <React.Fragment key={item.index}>
                                <Step
                                    index={item.index}
                                    label={item.label}
                                    icon={item.icon}
                                    active={step === item.index}
                                    completed={step > item.index}
                                />
                                {idx < steps.length - 1 && (
                                    <div className={`w-24 h-1 mx-4 transition-all duration-300 ${
                                        step > item.index ? 'bg-[#FF860B]' : 'bg-gray-200'
                                    }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="mb-6">{getCompStep()}</div>

                    <div className="flex gap-4">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                disabled={registering}
                                className="flex-1 py-3 px-6 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft size={20} />
                                Voltar
                            </button>
                        )}
                        {step === 1 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex-1 py-3 px-6 rounded-lg bg-[#FF860B] text-white font-medium hover:bg-orange-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                Próximo
                                <ArrowRight size={20} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={registering}
                                className={`flex-1 py-3 px-6 rounded-lg ${
                                    registering ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF860B] hover:bg-orange-600'
                                } text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl`}
                            >
                                <CheckCircle2 size={20} />
                                {registering ? 'Cadastrando...' : 'Cadastrar'}
                            </button>
                        )}
                    </div>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Já possui uma conta?</span>
                        </div>
                    </div>
                    <Link 
                        to="/login"
                        className="w-full py-3 px-6 rounded-lg border-2 border-[#002970] text-[#002970] font-medium hover:bg-[#002970] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        Fazer Login
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Register;