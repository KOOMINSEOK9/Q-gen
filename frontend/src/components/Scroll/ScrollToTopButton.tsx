import { useEffect, useState } from 'react';
import { FiChevronUp } from 'react-icons/fi';

export default function ScrollToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className='fixed bottom-8 right-8 z-50 bg-white border border-gray-200 rounded-full p-3 shadow-md hover:scale-110 transition-all duration-200 flex items-center justify-center cursor-pointer'
      aria-label='맨 위로'
    >
      <FiChevronUp className='text-2xl text-gray-800' />
    </button>
  );
}
