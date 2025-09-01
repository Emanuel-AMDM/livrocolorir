// src/app/login/submit-buttons.tsx
'use client'

import { useFormStatus } from 'react-dom'

// Spinner...
function Spinner() {
  return (
    <svg 
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

// O componente agora recebe as ações como props
interface SubmitButtonsProps {
  loginAction: (payload: FormData) => void;
  signupAction: (payload: FormData) => void;
  disabled: boolean;
}

export function SubmitButtons({ loginAction, signupAction, disabled }: SubmitButtonsProps) {
  const { pending } = useFormStatus();

  return (
    <div className="flex gap-2">
      <button
        type="submit"
        formAction={loginAction} // Usa a prop loginAction
        disabled={disabled || pending}
        className="flex-1 flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {pending ? <Spinner /> : 'Entrar'}
      </button>
      <button
        type="submit"
        formAction={signupAction} // Usa a prop signupAction
        disabled={disabled || pending}
        className="flex-1 flex justify-center items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {pending ? <Spinner /> : 'Cadastrar'}
      </button>
    </div>
  );
}