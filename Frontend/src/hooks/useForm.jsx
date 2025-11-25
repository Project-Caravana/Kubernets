/* eslint-disable no-useless-escape */
import React from 'react';

// Função para aplicar máscaras
const applyMask = (value, type) => {
  if (!value) return '';
  
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  switch(type) {
    case 'cpf':
      // 000.000.000-00
      return numbers
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    
    case 'cnpj':
      // 00.000.000/0000-00
      return numbers
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    
    case 'telefone':
      // (00) 00000-0000 ou (00) 0000-0000
      if (numbers.length <= 10) {
        return numbers
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        return numbers
          .slice(0, 11)
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');
      }
    
    default:
      return value;
  }
};

const types = {
    email: {
        regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'E-mail inválido'
    },
    cpf: {
        regex: /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/,
        message: 'CPF Inválido (formato: 000.000.000-00)'
    },
    cnpj: {
        regex: /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/,
        message: 'CNPJ Inválido (formato: 00.000.000/0000-00)'
    },
    telefone: {
        regex: /^\(\d{2}\)\s\d{4,5}\-\d{4}$/,
        message: 'Telefone inválido'
    }
};

const useForm = (type) => {
    const [value, setValue] = React.useState('');
    const [error, setError] = React.useState(null);

    function validate(value) {
        if(type === false) return true;
        if(value.length === 0){
            setError('Preencha um valor');
            return false;
        } else if(types[type] && !types[type].regex.test(value)) {
            setError(types[type].message);
            return false;
        } else {
            setError(null);
            return true;
        }
    }

    function onChange({target}) {
        let newValue = target.value;
        
        // Aplica máscara se for CPF, CNPJ ou telefone
        if (['cpf', 'cnpj', 'telefone'].includes(type)) {
            newValue = applyMask(newValue, type);
        }
        
        if (error) validate(newValue);
        setValue(newValue);
    }

    return {
        value,
        setValue,
        error,
        onChange,
        onBlur: () => validate(value),
        validate: () => validate(value)
    };
};

export default useForm;