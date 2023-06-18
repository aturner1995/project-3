import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const bgImages = [
  {
    image: '/images/dog-walk.png',
    color: 'purple',
  },
  {
    image: '/images/carpenter.png',
    color: 'blue',
  },
  {
    image: '/images/lawn.png',
    color: 'red',
  },
  {
    image: '/images/moving.png',
    color: 'red2',
  },
  {
    image: '/images/massage.png',
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
