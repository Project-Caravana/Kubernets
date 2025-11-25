import React from 'react';
import useForm from '../hooks/useForm';
import Input from './form/Input';

const FormRegister2 = ({ formData, updateFormData }) => {
    const empresa = useForm();
    const cnpj = useForm('cnpj');
    const telefoneEmpresa = useForm('telefone');
    const empresaEnderecoRua = useForm();
    const empresaEnderecoNumero = useForm();
    const empresaEnderecoBairro = useForm();
    const empresaEnderecoCidade = useForm();
    const empresaEnderecoEstado = useForm();
    const empresaEnderecoCep = useForm();

    React.useEffect(() => {
        if (formData.empresa) empresa.setValue(formData.empresa);
        if (formData.cnpj) cnpj.setValue(formData.cnpj);
        if (formData.telefoneEmpresa) telefoneEmpresa.setValue(formData.telefoneEmpresa);
        if (formData.empresaEnderecoRua) empresaEnderecoRua.setValue(formData.empresaEnderecoRua);
        if (formData.empresaEnderecoNumero) empresaEnderecoNumero.setValue(formData.empresaEnderecoNumero);
        if (formData.empresaEnderecoBairro) empresaEnderecoBairro.setValue(formData.empresaEnderecoBairro);
        if (formData.empresaEnderecoCidade) empresaEnderecoCidade.setValue(formData.empresaEnderecoCidade);
        if (formData.empresaEnderecoEstado) empresaEnderecoEstado.setValue(formData.empresaEnderecoEstado);
        if (formData.empresaEnderecoCep) empresaEnderecoCep.setValue(formData.empresaEnderecoCep);
    }, []);

    React.useEffect(() => {
        updateFormData({
            empresa: empresa.value,
            cnpj: cnpj.value,
            telefoneEmpresa: telefoneEmpresa.value,
            empresaEnderecoRua: empresaEnderecoRua.value,
            empresaEnderecoNumero: empresaEnderecoNumero.value,
            empresaEnderecoBairro: empresaEnderecoBairro.value,
            empresaEnderecoCidade: empresaEnderecoCidade.value,
            empresaEnderecoEstado: empresaEnderecoEstado.value,
            empresaEnderecoCep: empresaEnderecoCep.value
        });
    }, [empresa.value, cnpj.value, telefoneEmpresa.value, empresaEnderecoRua.value, empresaEnderecoNumero.value, empresaEnderecoBairro.value, empresaEnderecoCidade.value, empresaEnderecoEstado.value, empresaEnderecoCep.value]);

    return (
        <div className="space-y-1">
            <Input type="text" id="empresa" label="Nome da Empresa" required placeholder="Digite o nome da empresa" {...empresa} />
            <Input type="text" id="cnpj" label="CNPJ" required placeholder="00.000.000/0000-00" {...cnpj} />
            <Input type="text" id="telefoneEmpresa" label="Telefone da Empresa" required placeholder="(00) 0000-0000" {...telefoneEmpresa} />
            <Input type="text" id="empresaEnderecoRua" label="Rua" required placeholder="Digite a rua" {...empresaEnderecoRua} />
            <Input type="text" id="empresaEnderecoNumero" label="Número" required placeholder="99" {...empresaEnderecoNumero} />
            <Input type="text" id="empresaEnderecoBairro" label="Bairro" required placeholder="Jd Ibirapuera" {...empresaEnderecoBairro} />
            <Input type="text" id="empresaEnderecoCidade" label="Cidade" required placeholder="São Paulo" {...empresaEnderecoCidade} />
            <Input type="text" id="empresaEnderecoEstado" label="Estado" required placeholder="SP" {...empresaEnderecoEstado} />
            <Input type="text" id="empresaEnderecoCep" label="CEP" required placeholder="25102-111" {...empresaEnderecoCep} />
        </div>
    );
};

export default FormRegister2;