import React, { useState } from 'react';

const CosmicRhythmCover = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Define handleMouseMove within the component
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative">
        {/* Cyan layer */}
        <div 
          className="absolute inset-0 mix-blend-screen opacity-40 transition-transform duration-700"
          style={{
            transform: isHovering
              ? `translate(${mousePosition.x * -5}px, ${mousePosition.y * -5}px)`
              : 'translate(0, 0)',
          }}
        >
          <img 
            src="/images/album-cover.png"
            alt="Cosmic Rhythm - Cyan Layer"
            className="w-full h-full object-cover"
            style={{ filter: 'url(#cyan)' }}
          />
        </div>

        {/* Magenta layer */}
        <div 
          className="absolute inset-0 mix-blend-screen opacity-40 transition-transform duration-700"
          style={{
            transform: isHovering
              ? `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`
              : 'translate(0, 0)',
          }}
        >
          <img 
            src="/images/album-cover.png"
            alt="Cosmic Rhythm - Magenta Layer"
            className="w-full h-full object-cover"
            style={{ filter: 'url(#magenta)' }}
          />
        </div>

        {/* Main image */}
        <div 
          className="relative z-10 transition-transform duration-700"
          style={{
            transform: isHovering
              ? `perspective(1000px) 
                 rotateX(${mousePosition.y * -8}deg) 
                 rotateY(${mousePosition.x * 8}deg)
                 translateZ(30px)`
              : 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)',
          }}
        >
          <img 
            src="/images/album-cover.png"
            alt="Cosmic Rhythm"
            className="w-full h-full object-cover shadow-[0_10px_30px_rgba(0,0,0,0.8)]
                     group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.9)]
                     transition-all duration-700"
          />
        </div>
      </div>

      {/* Ambient glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 
                   transition-opacity duration-700 pointer-events-none
                   mix-blend-soft-light"
        style={{
          background: `radial-gradient(circle at ${
            50 + mousePosition.x * 30
          }% ${
            50 + mousePosition.y * 30
          }%, rgba(137, 221, 255, 0.2) 0%, rgba(145, 0, 255, 0.1) 50%, transparent 70%)`
        }}
      />

      {/* SVG Filters */}
      <svg className="absolute -z-50 opacity-0 w-0 h-0">
        <defs>
          <filter id="cyan">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="magenta">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default CosmicRhythmCover;