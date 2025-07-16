interface SmallBtnProps {
  text: string;
  onClick?: () => void;
  outline?: boolean;
}

function SmallBtn({ text, onClick, outline = false }: SmallBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded-full cursor-pointer ${
        outline
          ? 'border border-black text-black bg-white'
          : 'bg-black text-white'
      }`}
    >
      {text}
    </button>
  );
}

export default SmallBtn;
