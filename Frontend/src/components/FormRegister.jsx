import React from 'react';
import useForm from '../hooks/useForm';
import Input from './form/Input';

const FormRegister = ({ formData, updateFormData }) => {
    const nome = useForm();
    const cpf = useForm('cpf');
    const email = useForm('email');
    const telefone = useForm('telefone');
    const senha = useForm();
    const confirm = useForm();

    React.useEffect(() => {
        if (formData.nome) nome.setValue(formData.nome);
        if (formData.cpf) cpf.setValue(formData.cpf);
        if (formData.email) email.setValue(formData.email);
        if (formData.telefone) telefone.setValue(formData.telefone);
        if (formData.senha) senha.setValue(formData.senha);
        if (formData.confirm) confirm.setValue(formData.confirm);
    }, []);

    React.useEffect(() => {
        updateFormData({
            nome: nome.value,
            cpf: cpf.value,
            email: email.value,
            telefone: telefone.value,
            senha: senha.value,
            confirm: confirm.value
        });
    }, [nome.value, cpf.value, email.value, telefone.value, senha.value, confirm.value]);

    return (
        <div className="space-y-1">
            <Input type="text" id="nome" label="Nome Completo" required placeholder="Digite seu nome" {...nome} />
            <Input type="text" id="cpf" label="CPF" required placeholder="000.000.000-00" {...cpf} />
            <Input type="email" id="email" label="E-mail" required placeholder="seu@email.com" {...email} />
            <Input type="text" id="telefone" label="Telefone" required placeholder="(00) 00000-0000" {...telefone} />
            <Input type="password" id="senha" label="Senha" required placeholder="Mínimo 6 caracteres" {...senha} />
            <Input type="password" id="confirm" label="Confirmar Senha" required placeholder="Digite a senha novamente" {...confirm} />
        </div>
    );
};

export default FormRegister;