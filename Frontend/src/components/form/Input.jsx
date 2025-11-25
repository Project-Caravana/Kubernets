import React from 'react';

const Input = ({id, label, onChange, value, type, onBlur, placeholder, error, required, maxLength}) => {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input 
                id={id} 
                name={id} 
                onChange={onChange} 
                placeholder={placeholder} 
                onBlur={onBlur} 
                type={type} 
                value={value}
                maxLength={maxLength}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                    // NOVO: Borda e Ring de erro em Vermelho Alaranjado
                    error ? 'border-[#ED4424] focus:ring-[#ED4424]' 
                    // NOVO: Ring de foco em Laranja
                    : 'border-gray-300 focus:ring-[#FF860B]'
                } focus:ring-2 focus:outline-none transition-all duration-200`}
            />
            {/* NOVO: Mensagem de erro em Vermelho Alaranjado */}
            {error && <p className="text-[#ED4424] text-sm mt-1">{error}</p>}
        </div>
    );
};

export default Input;