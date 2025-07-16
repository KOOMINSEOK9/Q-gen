import React, { useEffect, useState } from 'react';

const DOTS = ['.', '..', '...'];

const CreatingLoader: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % DOTS.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className='text-purple-600 font-bold text-lg animate-pulse'>
      생성중{DOTS[step]}
    </span>
  );
};

export default CreatingLoader;
