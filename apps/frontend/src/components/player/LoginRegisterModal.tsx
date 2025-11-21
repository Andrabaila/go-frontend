import { useState } from 'react';
import type { LoginRequest, RegisterRequest } from '@shared/types/auth';
import { loginUser, registerUser } from '../../api/auth';

type Mode = 'login' | 'register';

interface LoginRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (email: string) => void;
}

// Тип ошибки с сервера
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const LoginRegisterModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginRegisterModalProps) => {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        const data: LoginRequest = { email, password };
        await loginUser(data);
        onLoginSuccess?.(email);
      } else {
        const data: RegisterRequest = { email, password };
        await registerUser(data);
        onLoginSuccess?.(email);
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      const apiError = err as ApiError;
      const message =
        apiError.response?.data?.message ?? 'Не удалось выполнить запрос';
      setError(message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-5000">
      <div className="bg-white rounded-xl p-6 w-80 relative">
        <h2 className="text-xl font-bold mb-4 text-center">
          {mode === 'login' ? 'Войти' : 'Регистрация'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 rounded"
          />

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 rounded"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="mt-3 text-sm text-center">
          {mode === 'login' ? (
            <>
              Нет аккаунта?{' '}
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={() => setMode('register')}
              >
                Регистрация
              </button>
            </>
          ) : (
            <>
              Уже есть аккаунт?{' '}
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={() => setMode('login')}
              >
                Войти
              </button>
            </>
          )}
        </p>

        <button
          type="button"
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
