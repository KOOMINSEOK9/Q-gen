import React, { useEffect } from 'react';
import HeroSection from '@/components/Landing/HeroSection';
import FeatureSection from '@/components/Landing/FeatureSection';
import QuizPreviewSection from '@/components/Landing/QuizPreviewSection';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ScrollToTopButton from '@/components/Scroll/ScrollToTopButton';

export default function Landing() {
  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  return (
    <div className='min-h-screen'>
      <div data-aos='fade-up' className='mb-12'>
        <HeroSection />
      </div>
      <div data-aos='fade-up' data-aos-delay='100' className='mb-12'>
        <QuizPreviewSection />
      </div>
      <div data-aos='fade-up' data-aos-delay='200'>
        <FeatureSection />
      </div>
      <ScrollToTopButton />
    </div>
  );
}
