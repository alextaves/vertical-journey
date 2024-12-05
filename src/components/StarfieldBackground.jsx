import React, { useState, useEffect } from 'react';

const StarfieldBackground = () => {
  // Increased star count but with more subtle animations
  const ambientStars = Array.from({ length: 150 }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 0.6 + 0.2, // Smaller size range
    animationDuration: `${Math.random() * 5 + 8}s`, // Slower pulse
    opacity: Math.random() * 0.2 + 0.1 // More subtle
  }));

  const breathingStars = Array.from({ length: 20 }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 1.4 + 0.8,
    animationDuration: `${Math.random() * 8 + 10}s`, // Slower breathing
    delay: `${Math.random() * -10}s`,
    baseOpacity: Math.random() * 0.2 + 0.6
  }));

  // Occasional shooting stars
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    const createShootingStar = () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 40}%`,
      duration: Math.random() * 1.5 + 1,
      delay: Math.random() * 2,
      id: Math.random()
    });

    const interval = setInterval(() => {
      setShootingStars(prev => [...prev, createShootingStar()]);
      setTimeout(() => {
        setShootingStars(prev => prev.slice(1));
      }, 3000);
    }, 15000); // Less frequent shooting stars

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black pointer-events-none">
      {ambientStars.map((star, index) => (
        <div
          key={`ambient-${index}`}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `subtlePulse ${star.animationDuration} ease-in-out infinite`
          }}
        />
      ))}

      {breathingStars.map((star, index) => (
        <div
          key={`breathing-${index}`}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `gentleBreathe ${star.animationDuration} ease-in-out infinite`,
            animationDelay: star.delay,
            opacity: star.baseOpacity
          }}
        />
      ))}

      {shootingStars.map(star => (
        <div
          key={star.id}
          className="absolute h-px w-12 bg-white"
          style={{
            left: star.left,
            top: star.top,
            animation: `shoot ${star.duration}s linear forwards`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}

      <style jsx>{`
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        @keyframes gentleBreathe {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
        @keyframes shoot {
          0% { transform: translateX(0) translateY(0) rotate(45deg); opacity: 0.8; }
          100% { transform: translateX(40vw) translateY(40vh) rotate(45deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default StarfieldBackground;