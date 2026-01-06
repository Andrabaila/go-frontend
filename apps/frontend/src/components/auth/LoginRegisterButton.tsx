interface Props {
  onClick: () => void;
  userEmail: string | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Кнопка для открытия модального окна входа/регистрации.
 * Отображается только при активном профиле в меню.
 * @param onClick - Обработчик клика для открытия модалки
 * @param userEmail - Email авторизованного пользователя или null
 * @param isOpen - Флаг видимости кнопки
 * @param onClose - Не используется (для совместимости интерфейса)
 */
export default function LoginRegisterButton({
  onClick,
  userEmail,
  isOpen,
}: Props) {
  if (!isOpen) return null;
  return (
    <button
      onClick={onClick}
      className="absolute bottom-10 right-2 z-[1000] cursor-pointer rounded-md bg-gray-600/80 px-3 py-2 font-bold text-white"
    >
      {userEmail ?? 'Войти / Зарегистрироваться'}
    </button>
  );
}
