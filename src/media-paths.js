// src/media-paths.js

export const getMediaPath = (path) => {
  const baseUrl = import.meta.env.PROD 
    ? import.meta.env.VITE_PUBLIC_URL || ''
    : '';
  return `${baseUrl}${path}`;
};

// Then modify VideoJourney.jsx to use these paths:
const tracks = [
  { 
    id: 'track1', 
    title: 'Your Cosmic Rhythm', 
    src: getMediaPath('/audio/Your-Cosmic-Rhythm.mp3')
  },
  // ... other tracks
];

const videoSections = [
  { 
    id: 'chair', 
    title: 'Chair', 
    src: getMediaPath('/videos/01-chair.mp4')
  },
  // ... other sections
];