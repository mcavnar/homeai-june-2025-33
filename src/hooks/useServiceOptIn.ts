
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ServiceType } from '@/components/ServiceOptInModal';

interface ServiceConfig {
  title: string;
  description: string;
  columnName: string;
}

const serviceConfigs: Record<ServiceType, ServiceConfig> = {
  recommended_providers: {
    title: 'Get Recommended Providers',
    description: 'We\'ll send you a curated list of top-rated service providers in your area based on quality ratings, pricing, and local market conditions.',
    columnName: 'recommended_providers_opted_in_at'
  },
  hvac_technicians: {
    title: 'Connect with HVAC Technicians',
    description: 'We\'ll connect you with qualified HVAC technicians in your local area who specialize in your system type and needs.',
    columnName: 'hvac_technicians_opted_in_at'
  },
  roofing_experts: {
    title: 'Find Roofing Experts',
    description: 'We\'ll provide you with trusted roofing professionals near you who have experience with your roof type and repair needs.',
    columnName: 'roofing_experts_opted_in_at'
  },
  plumbers: {
    title: 'Get Local Plumbers',
    description: 'We\'ll share recommended plumbers in your neighborhood who can handle your specific plumbing issues and maintenance needs.',
    columnName: 'plumbers_opted_in_at'
  },
  electricians: {
    title: 'Find Licensed Electricians',
    description: 'We\'ll connect you with licensed electricians in your area who can safely handle your electrical repairs and upgrades.',
    columnName: 'electricians_opted_in_at'
  },
  concierge_negotiation: {
    title: 'Get Negotiation Help',
    description: 'We\'ll have our experienced negotiation specialists reach out to provide personalized assistance and guide you through every step of the negotiation process.',
    columnName: 'concierge_negotiation_opted_in_at'
  }
};

export const useServiceOptIn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceType | null>(null);
  const { toast } = useToast();

  const openOptInModal = (serviceType: ServiceType) => {
    setCurrentService(serviceType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentService(null);
  };

  const confirmOptIn = async () => {
    if (!currentService) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue.",
        variant: "destructive",
      });
      return;
    }

    const config = serviceConfigs[currentService];
    const updateData = {
      [config.columnName]: new Date().toISOString()
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Success!",
      description: "We'll be in touch soon with your requested information.",
    });
  };

  const getCurrentServiceConfig = () => {
    return currentService ? serviceConfigs[currentService] : null;
  };

  return {
    isModalOpen,
    currentService,
    openOptInModal,
    closeModal,
    confirmOptIn,
    getCurrentServiceConfig
  };
};
