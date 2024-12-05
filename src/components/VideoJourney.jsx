import React, { useState, useRef, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import CosmicRhythmCover from './CosmicRhythmCover';

const StarfieldBackground = () => {
  const ambientStars = Array.from({ length: 150 }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 0.6 + 0.2,
    animationDuration: `${Math.random() * 5 + 8}s`,
    opacity: Math.random() * 0.2 + 0.1
  }));

  const breathingStars = Array.from({ length: 20 }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 1.4 + 0.8,
    animationDuration: `${Math.random() * 8 + 10}s`,
    delay: `${Math.random() * -10}s`,
    baseOpacity: Math.random() * 0.2 + 0.6
  }));

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
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes subtlePulse {
            0%, 100% { 
              opacity: 0.1;
              transform: scale(1);
            }
            50% { 
              opacity: 0.3;
              transform: scale(1.1);
            }
          }

          @keyframes gentleBreathe {
            0%, 100% { 
              opacity: 0.3; 
              transform: scale(1);
            }
            50% { 
              opacity: 0.8; 
              transform: scale(1.3);
            }
          }

          @keyframes shoot {
            0% { 
              transform: translateX(0) translateY(0) rotate(45deg);
              opacity: 0.8;
            }
            100% { 
              transform: translateX(40vw) translateY(40vh) rotate(45deg);
              opacity: 0;
            }
          }
        `
      }} />

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
      </div>
    </>
  );
};

const VideoJourney = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScrollGuide, setShowScrollGuide] = useState(false);
  const assetsLoaded = true;
  const audioRef = useRef(null);

  const tracks = [
    { id: 'track1', title: 'Your Cosmic Rhythm', src: '/audio/Your-Cosmic-Rhythm.mp3' },
    { id: 'track2', title: "I'd Rather Lie", src: '/audio/Id-Rather-Lie.mp3' },
    { id: 'track3', title: 'Simdi', src: '/audio/Simdi.mp3' }
  ];

  const videoSections = [
    { id: 'chair', title: 'Chair', src: '/videos/01-chair.mp4' },
    { id: 'feet', title: 'Feet', src: '/videos/02-feet.mp4' },
    { id: 'mid', title: 'Middle', src: '/videos/03-mid.mp4' },
    { id: 'head', title: 'Head', src: '/videos/04-head.mp4' }
  ].map(section => ({
    ...section,
    ref: useRef(null)
  }));

  useEffect(() => {
    if (journeyStarted) {
      setShowScrollGuide(true);
      const timer = setTimeout(() => {
        setShowScrollGuide(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [journeyStarted]);

  useEffect(() => {
    if (journeyStarted) {
      videoSections.forEach(section => {
        const video = section.ref.current;
        if (video) {
          const handleLoadedMetadata = () => {
            video.playbackRate = -0.8;
            video.currentTime = video.duration;
          };

          const handleTimeUpdate = () => {
            if (video.currentTime <= 0) {
              video.currentTime = video.duration;
            }
          };

          video.addEventListener('loadedmetadata', handleLoadedMetadata);
          video.addEventListener('timeupdate', handleTimeUpdate);

          return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('timeupdate', handleTimeUpdate);
          };
        }
      });
    }
  }, [journeyStarted]);

  const handleTrackSelect = async (track) => {
    try {
      if (selectedTrack?.id === track.id) {
        if (isPlaying) {
          await audioRef.current?.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current?.play();
          setIsPlaying(true);
        }
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setSelectedTrack(track);
        setIsPlaying(true);
        
        if (audioRef.current) {
          audioRef.current.src = track.src;
          try {
            await audioRef.current.play();
          } catch (e) {
            console.log('Audio playback adjustment needed:', e);
          }
        }
      }
      setIsMenuOpen(false);
    } catch (error) {
      console.log('Track selection needs attention:', error);
    }
  };

  const startJourney = async () => {
    try {
      if (isPlaying && audioRef.current) {
        const currentSrc = audioRef.current.src;
        const currentTime = audioRef.current.currentTime;
        const wasPlaying = !audioRef.current.paused;
        
        setJourneyStarted(true);
        
        requestAnimationFrame(async () => {
          if (audioRef.current) {
            audioRef.current.src = currentSrc;
            audioRef.current.currentTime = currentTime;
            if (wasPlaying) {
              try {
                await audioRef.current.play();
              } catch (e) {
                console.log('Playback continuation adjustment needed:', e);
              }
            }
          }
        });
      } else {
        setJourneyStarted(true);
      }
    } catch (error) {
      console.log('Journey initiation needs attention:', error);
    }
  };

  const audioElement = (
    <audio
      ref={audioRef}
      loop
      onEnded={() => setIsPlaying(false)}
      onError={() => {
        // Handle gracefully
      }}
    />
  );

  if (!journeyStarted) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <StarfieldBackground />
        <div className="relative max-w-[1225px] w-full px-4 md:px-8 z-10">
          <div className="relative mx-auto w-full max-w-[80vw] lg:max-w-[50vw] aspect-square">
            <CosmicRhythmCover />
            
            <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4">
              {isMenuOpen && (
                <div className="bg-black/95 p-6 rounded-lg mb-4 min-w-64">
                  <div className="space-y-6">
                    {tracks.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => handleTrackSelect(track)}
                        className={`block text-xl ${
                          selectedTrack?.id === track.id 
                            ? 'text-white' 
                            : 'text-white/50 hover:text-white'
                        } transition-colors`}
                      >
                        {track.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                className="bg-white/10 backdrop-blur-sm rounded-full p-4 hover:bg-white/20 transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
            
            {audioElement}
          </div>
        </div>
        <button
          className={`absolute top-8 right-8 text-white/50 hover:text-white transition-colors ${
            !assetsLoaded ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={startJourney}
          disabled={!assetsLoaded}
        >
          ENTER THE DANCE
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      <StarfieldBackground />
      {showScrollGuide && (
        <div 
          className="fixed top-8 right-8 text-white/50 transition-opacity duration-1000 z-50"
          
        >
          SCROLL UPWARDS
        </div>
      )}
      <div className="h-screen overflow-y-auto snap-y snap-mandatory" style={{ transform: 'scaleY(-1)' }}>
        {videoSections.map((section) => (
          <section 
            key={section.id} 
            className="relative h-screen w-full snap-start"
            style={{ transform: 'scaleY(-1)' }}
          >
            <video
              ref={section.ref}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              playsInline
              autoPlay
              muted
            >
              <source src={section.src} type="video/mp4" />
            </video>
          </section>
        ))}
      </div>

      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-50">
        {isMenuOpen && (
          <div className="bg-black/95 p-6 rounded-lg mb-4 min-w-64">
            <div className="space-y-6">
              {tracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackSelect(track)}
                  className={`block text-xl ${
                    selectedTrack?.id === track.id 
                      ? 'text-white' 
                      : 'text-white/50 hover:text-white'
                  } transition-colors`}
                >
                  {track.title}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <button
          className="bg-white/10 backdrop-blur-sm rounded-full p-4 hover:bg-white/20 transition-all duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {audioElement}
    </div>
  );
};

export default VideoJourney;