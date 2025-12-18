interface Props {
  onClick: () => void;
  userEmail: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRegisterButton({
  onClick,
  userEmail,
  isOpen,
}: Props) {
  if (!isOpen) return null;
  return (
    <button
      onClick={onClick}
      className="
    absolute bottom-10 left-30 z-[1000]
    px-3 py-2
    bg-gray-600 text-white
    rounded-md
    font-bold
    cursor-pointer
    "
    >
      {userEmail ?? 'Войти / Зарегистрироваться'}
    </button>
  );
}
