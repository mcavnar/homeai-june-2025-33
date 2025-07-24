
import React from 'react';
import LandingNavigation from '@/components/landing/LandingNavigation';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import WhyWeBuildSection from '@/components/landing/WhyWeBuildSection';
// import BenefitsSection from '@/components/landing/BenefitsSection';
import ProcessSection from '@/components/landing/ProcessSection';
import LandingFooter from '@/components/landing/LandingFooter';
import { HomepageEmailPopup } from '@/components/HomepageEmailPopup';
import { useHomepageEmailPopup } from '@/hooks/useHomepageEmailPopup';

const Landing = () => {
  const { showPopup, closePopup } = useHomepageEmailPopup();

  return (
    <div className="min-h-screen bg-white">
      <LandingNavigation />
      <HeroSection />
      <FeaturesSection />
      <WhyWeBuildSection />
      {/* <BenefitsSection /> */}
      <ProcessSection />
      <LandingFooter />
      
      <HomepageEmailPopup 
        isOpen={showPopup} 
        onClose={closePopup}
      />
    </div>
  );
};

export default Landing;
