import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const bgImages = [
  {
    image: '/images/dog-walk.webp',
    color: 'purple',
  },
  {
    image: '/images/carpenter.webp',
    color: 'blue',
  },
  {
    image: '/images/lawn.webp',
    color: 'grey',
  },
  {
    image: '/images/moving.webp',
    color: 'green',
  },
  {
    image: '/images/massage.webp',
    color: 'red',
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
