import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, type = 'button', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 rounded-md font-semibold transition-colors duration-300 ${className || 'bg-blue-600 text-white hover:bg-blue-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;