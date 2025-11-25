import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import Input from '../components/form/Input';
import useForm from '../hooks/useForm';
import { login as loginApi } from '../api/caravana.js'
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
 
const Login = () => {
    const email = useForm('email');
    const senha = useForm();
    const [logging, setLogging] = React.useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();



    const handleSubmit = async() => {
        setLogging(true);
        try {
            const payload = {
                email: email.value,
                senha: senha.value
            }
            
            const response = await loginApi(payload);

            // Lógica Nova (CORRETA com HttpOnly):
            // O backend define o cookie. O frontend só precisa do objeto funcionário.
            if (response.data.funcionario) {
                // O perfil (role) é crucial para renderização, salve no localStorage
                localStorage.setItem('funcionario', JSON.stringify(response.data.funcionario));

                // Atualiza o contexto de autenticação com o objeto funcionario
                login(response.data.funcionario); // Função que atualiza o estado em AuthContext
            }
            
            toast.success('Login realizado com sucesso!');
            
            navigate('/dashboard');
            
        } catch (error) {
            const message = error.response?.data?.message || 'Dados Inválidos.';
            toast.error(message);
        } finally {
            setLogging(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-[#FF860B]/10 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#002970] to-[#FF860B] rounded-full mb-4">
                            <LogIn size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#002970] mb-2">Bem-vindo de volta!</h1>
                        <p className="text-gray-600">Entre com suas credenciais para acessar</p>
                    </div>

                    {/* Form */}
                    <div className="space-y-4" onKeyPress={handleKeyPress}>
                        <Input 
                            type="email" 
                            id="email" 
                            label="E-mail" 
                            required 
                            placeholder="seu@email.com"
                            icon={<Mail size={20} />}
                            {...email} 
                        />
                        <Input 
                            type="password" 
                            id="senha" 
                            label="Senha" 
                            required 
                            placeholder="••••••••••"
                            icon={<Lock size={20} />}
                            {...senha} 
                        />

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link 
                                to="/esqueci-senha" 
                                className="text-sm text-[#FF860B] hover:text-orange-600 font-medium transition-colors duration-200"
                            >
                                Esqueceu a senha?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button 
                            type="button"
                            disabled={logging} 
                            onClick={handleSubmit}
                            className={`w-full py-3 px-6 rounded-lg ${
                                logging ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF860B] hover:bg-orange-600'
                            } text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl`}
                        >
                            {logging ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Entrar
                                </>
                            )}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Não tem uma conta?</span>
                        </div>
                    </div>

                    {/* Register Link */}
                    <Link 
                        to="/register"
                        className="w-full py-3 px-6 rounded-lg border-2 border-[#002970] text-[#002970] font-medium hover:bg-[#002970] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        Criar nova conta
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Login