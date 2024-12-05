// src/utils/mediaUtils.js
export const getAudioPath = (filename) => {
  // Handle both development and production paths
  const base = import.meta.env.PROD ? '/' : '/';
  return `${base}audio/${filename}`;
};

