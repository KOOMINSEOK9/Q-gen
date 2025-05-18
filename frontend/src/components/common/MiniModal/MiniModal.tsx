interface MiniModalAction {
  text: string;
  href: string;
  onClick?: (id: number | null) => void;
}

interface MiniModalProps {
  isOpen: boolean;
  // onClose: () => void;
  actions: MiniModalAction[];
  selectedId: number | null;
}

function MiniModal({ isOpen, actions, selectedId }: MiniModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className='absolute right-0 top-0 bg-white rounded-xl shadow-xl p-2 min-w-[120px] flex flex-col gap-2'
      onClick={(e) => e.stopPropagation()}
    >
      {actions.map((action, idx) => (
        <a
          key={idx}
          href={action.href}
          onClick={(e) => {
            if (action.onClick) {
              e.preventDefault();
              action.onClick(selectedId);
            }
          }}
          className='block text-center text-gray-700 text-lg hover:text-purple-500 transition-colors py-2 rounded-lg'
        >
          {action.text}
        </a>
      ))}
    </div>
  );
}

export default MiniModal;
