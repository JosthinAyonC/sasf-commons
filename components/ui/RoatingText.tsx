import React, { useEffect, useState } from 'react';

interface RotatingTextProps {
  texts: string[];
  interval?: number;
}

const RotatingText: React.FC<RotatingTextProps> = ({ texts, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts, interval]);

  return <span className="text-sm text-neutral-700">{texts[currentIndex]}</span>;
};

export default RotatingText;
