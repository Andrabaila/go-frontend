interface Props {
  onClick: () => void;
}

export default function BackpackButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="
    absolute bottom-10 left-3 z-[1000]
    px-3 py-2
    bg-gray-600 text-white
    rounded-md
    font-bold
    cursor-pointer
    "
    >
      Рюкзак
    </button>
  );
}
