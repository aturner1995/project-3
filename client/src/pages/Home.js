import React from 'react';
import Hero from '../components/Hero';
import Awards from '../components/Awards';
import PopularServices from '../components/PopularServices';
import AppFeatures from '../components/AppFeatures';

const Home = () => {
  return (
    <>
      <Hero />
      <Awards />
      <PopularServices />
      <AppFeatures />
    </>
  )
}

export default Home;