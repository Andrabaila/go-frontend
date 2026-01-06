import { useState } from 'react';
import type { LoginRequest, RegisterRequest } from '@shared/types/auth';
import { loginUser, registerUser } from '../../api/auth';

type Mode = 'login' | 'register';

interface LoginRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (email: string) => void;
}

/**
 * Модальное окно для входа и регистрации пользователей.
 * Интегрирует API аутентификации с обработкой ошибок.
 * @param isOpen - Флаг видимости модального окна
 * @param onClose - Функция закрытия модального окна
 * @param onLoginSuccess - Колбэк при успешном входе с email пользователя
 */

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
    <div className="z-5000 fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="relative w-80 rounded-xl bg-white p-6">
        <h2 className="mb-4 text-center text-xl font-bold">
          {mode === 'login' ? 'Войти' : 'Регистрация'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded border p-2"
          />

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded border p-2"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600"
          >
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="mt-3 text-center text-sm">
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
          className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
