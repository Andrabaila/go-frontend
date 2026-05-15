interface Props {
  onClick: () => void;
  userEmail: string | null;
  isOpen: boolean;
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
      className="bottom-35 absolute right-2 z-[1000] cursor-pointer rounded-md bg-gray-600/80 px-3 py-2 font-bold text-white"
    >
      {userEmail ?? 'Sign in / Register'}
    </button>
  );
}
