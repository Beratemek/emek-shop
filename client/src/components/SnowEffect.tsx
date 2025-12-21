import { useEffect, useState } from 'react';
import './SnowEffect.css';

const SnowEffect = () => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false);
    }, 8000); // Snows for 8 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isActive) return null;

  return (
    <div className="snow-container">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
            opacity: Math.random(),
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
          }}
        />
      ))}
    </div>
  );
};

export default SnowEffect;
