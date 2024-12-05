import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AudioPlayer = () => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  const toggleAudio = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        audioRef.current.volume = 0;
        audioRef.current.play();
        // Gentle fade in
        const fadeIn = setInterval(() => {
          if (audioRef.current.volume < 0.95) {
            audioRef.current.volume += 0.05;
          } else {
            audioRef.current.volume = 1;
            clearInterval(fadeIn);
          }
        }, 50);
      } else {
        // Gentle fade out then mute
        const fadeOut = setInterval(() => {
          if (audioRef.current.volume > 0.05) {
            audioRef.current.volume -= 0.05;
          } else {
            audioRef.current.volume = 0;
            audioRef.current.muted = true;
            clearInterval(fadeOut);
          }
        }, 50);
      }
    }
  };

  return (
    <>
      <div className="fixed top-8 right-8 z-50">
        <button
          onClick={toggleAudio}
          className="bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all duration-300"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
      <audio
        ref={audioRef}
        src="/Your-Cosmic-Rhythm.wav"
        loop
        muted={isMuted}
      />
    </>
  );
};

export default AudioPlayer;