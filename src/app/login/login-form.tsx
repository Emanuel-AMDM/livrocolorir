// src/app/login/login-form.tsx
'use client';

import { useState } from 'react';
import { useActionState } from 'react';

import { login, signup } from './actions';
import { SubmitButtons } from './submit-buttons';

export default function LoginForm() {
  const [loginState, loginAction] = useActionState(login, undefined);
  const [signupState, signupAction] = useActionState(signup, undefined);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setEmailError('Por favor, insira um e-mail válido.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length > 0 && newPassword.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres.');
    } else {
      setPasswordError('');
    }
  };
  
  const formState = loginState || signupState;

  return (
    <form className="bg-gray-700 p-8 rounded-lg w-full max-w-sm">
      <h1 className="text-2xl text-white font-bold mb-6 text-center">
        Acessar Plataforma
      </h1>
      
      {formState?.error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-md mb-4 text-center">
          {formState.error}
        </div>
      )}

      {formState?.success && (
        <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded-md mb-4 text-center">
          {formState.success}
        </div>
      )}

      {/* Os campos de input continuam iguais... */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-white mb-2">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={handleEmailChange}
          className={`w-full p-2 rounded bg-gray-800 text-white border ${emailError ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-blue-500`}
        />
        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-white mb-2">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={handlePasswordChange}
          className={`w-full p-2 rounded bg-gray-800 text-white border ${passwordError ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-blue-500`}
        />
        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
      </div>

      {/* Passamos as ações do hook para o componente de botões */}
      <SubmitButtons 
        loginAction={loginAction}
        signupAction={signupAction}
        disabled={!!emailError || !!passwordError} 
      />
    </form>
  );
}