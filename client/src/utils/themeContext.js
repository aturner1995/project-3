import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const bgImages = [
  {
    image: '/images/dog-walk.avif',
    color: 'purple',
  },
  {
    image: '/images/carpenter.avif',
    color: 'blue',
  },
  {
    image: '/images/lawn.avif',
    color: 'red',
  },
  {
    image: '/images/moving.avif',
    color: 'red2',
  },
  {
    image: '/images/massage.avif',
    color: 'plum',
  },
];

export const ThemeProvider = ({ children }) => {
  const [bgImageIndex, setBgImageIndex] = useState(0);
  const currentImage = bgImages[bgImageIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgImageIndex(prevIndex =>
        prevIndex === bgImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const value = {
    currentImage,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
