import React from 'react';
import Layout from '../layout/Layout';
import Announcement from '../home/Announcement';
import Hero from '../home/Hero';
import Features from '../home/Features';
import HowItWorks from '../home/HowItWorks';
import QuickAccess from '../home/QuickAccess';
import Testimonials from '../home/Testimonials';
import CallToAction from '../home/CallToAction';

const HomePage = () => {
  return (
    <Layout>
      <Announcement />
      <Hero />
      <Features />
      <HowItWorks />
      <QuickAccess />
      <Testimonials />
      <CallToAction />
    </Layout>
  );
};

export default HomePage;
