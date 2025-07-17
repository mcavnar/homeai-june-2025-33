
import React from 'react';
import LandingNavigation from '@/components/landing/LandingNavigation';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import WhyWeBuildSection from '@/components/landing/WhyWeBuildSection';
// import BenefitsSection from '@/components/landing/BenefitsSection';
import ProcessSection from '@/components/landing/ProcessSection';
import LandingFooter from '@/components/landing/LandingFooter';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavigation />
      <HeroSection />
      <FeaturesSection />
      <WhyWeBuildSection />
      {/* <BenefitsSection /> */}
      <ProcessSection />
      <LandingFooter />
    </div>
  );
};

export default Landing;
