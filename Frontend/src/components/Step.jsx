import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const Step = ({ index, active, completed, label, icon: Icon }) => {
    return (
        <div className="flex items-center">
            <div className="flex flex-col items-center">
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        completed
                            ? 'bg-[#FF860B] text-white'
                            : active
                            ? 'bg-[#002970] text-white shadow-lg scale-110'
                            : 'bg-gray-200 text-gray-500'
                    }`}
                >
                    {completed ? <CheckCircle2 size={24} /> : Icon ? <Icon size={24} /> : index}
                </div>
                <span className={`text-xs mt-2 font-medium ${active ? 'text-[#002970]' : 'text-gray-500'}`}>
                    {label}
                </span>
            </div>
        </div>
    );
};

export default Step;