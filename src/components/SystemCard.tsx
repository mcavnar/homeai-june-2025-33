
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';
import { useToast } from '@/hooks/use-toast';
import ProvidersModal from '@/components/ServiceProviders/ProvidersModal';
import { extractZipFromAddress, getDemoZipCode, isDemoMode } from '@/utils/thumbtackUtils';
import { supabase } from '@/integrations/supabase/client';
import SystemHeader from './SystemCard/SystemHeader';
import SystemSpecs from './SystemCard/SystemSpecs';
import SystemDetails from './SystemCard/SystemDetails';
import SystemCTA from './SystemCard/SystemCTA';

interface ThumbTackProvider {
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  image?: string;
  profileUrl: string;
  requestFlowUrl?: string;
  phone?: string;
  description?: string;
}

interface SystemCardProps {
  title: string;
  status: string;
  description: string;
  repairCost?: {
    min: number;
    max: number;
  };
  maintenanceTips?: string[];
  ctaText: string;
  ctaType: 'hvac' | 'roofing' | 'plumbing' | 'electrical' | 'recommended_providers';
  propertyAddress?: string;
  // Additional props for detailed information
  age?: string;
  yearsLeft?: string;
  type?: string;
  replacementCost?: {
    min: number;
    max: number;
  };
  maintenanceCosts?: {
    fiveYear: {
      min: number;
      max: number;
    };
    tenYear: {
      min: number;
      max: number;
    };
  };
  anticipatedRepairs?: {
    fiveYear: string[];
    tenYear: string[];
  };
}

const SystemCard: React.FC<SystemCardProps> = ({
  title,
  status,
  description,
  repairCost,
  maintenanceTips,
  ctaText,
  ctaType,
  propertyAddress,
  age,
  yearsLeft,
  type,
  replacementCost,
  maintenanceCosts,
  anticipatedRepairs
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDemoModeActive = isDemoMode(location.pathname);
  const { trackEvent } = useGoogleAnalytics();
  const { toast } = useToast();

  // Provider search state
  const [isProvidersModalOpen, setIsProvidersModalOpen] = useState(false);
  const [thumbtackProviders, setThumbTackProviders] = useState<ThumbTackProvider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [providersError, setProvidersError] = useState<string>('');

  const getSearchQuery = (type: string): string => {
    switch (type) {
      case 'hvac': return 'HVAC experts';
      case 'roofing': return 'Roof experts';
      case 'plumbing': return 'Plumbing experts';
      case 'electrical': return 'Electrical experts';
      case 'recommended_providers': return 'Foundation experts';
      default: return 'Home experts';
    }
  };

  const handleGetProviders = async () => {
    console.log('Get providers clicked for:', ctaType);
    
    // Track Google Analytics event
    trackEvent('system_cta_click', {
      event_category: 'engagement',
      event_label: ctaType,
      value: 1,
      service_type: ctaType,
      is_demo: isDemoModeActive,
      has_property_address: !!propertyAddress
    });
    
    // Determine zip code based on mode
    let zipCode: string | null = null;
    
    if (isDemoModeActive) {
      zipCode = getDemoZipCode();
      console.log('Demo mode: Using demo zip code:', zipCode);
    } else if (propertyAddress) {
      zipCode = extractZipFromAddress(propertyAddress);
      console.log('Extracted zip code from property address:', zipCode);
    }

    if (!zipCode) {
      toast({
        title: "Location required",
        description: "We need your property address to find local providers.",
        variant: "destructive",
      });
      return;
    }

    const searchQuery = getSearchQuery(ctaType);
    console.log('Searching for providers:', { searchQuery, zipCode });

    setIsLoadingProviders(true);
    setProvidersError('');
    setIsProvidersModalOpen(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('thumbtack-search', {
        body: { searchQuery, zipCode }
      });

      if (error) {
        console.error('Thumbtack search error:', error);
        throw new Error(error.message || 'Failed to search for providers');
      }

      console.log('Thumbtack search results:', data);
      setThumbTackProviders(data.providers || []);
      
      if (data.providers && data.providers.length > 0) {
        toast({
          title: "Providers found!",
          description: `Found ${data.providers.length} ${searchQuery.toLowerCase()} in your area.`,
        });
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to find providers';
      setProvidersError(errorMessage);
      
      toast({
        title: "Search failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoadingProviders(false);
    }
  };

  const handleCTAClick = () => {
    if (isDemoModeActive) {
      navigate('/auth');
      return;
    }

    handleGetProviders();
  };

  // Check if we have detailed information to show
  const hasDetailedInfo = description || repairCost || maintenanceTips || maintenanceCosts || anticipatedRepairs;

  return (
    <>
      <Card className="border-gray-200 h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6 flex flex-col h-full">
          <SystemHeader title={title} status={status} />
          
          <SystemSpecs
            type={type}
            age={age}
            yearsLeft={yearsLeft}
            replacementCost={replacementCost}
          />

          {/* Flexible spacer to push content to bottom */}
          <div className="flex-grow"></div>

          {/* Bottom Section - Accordion and CTA */}
          <div className="mt-auto space-y-4">
            {/* More Details Accordion */}
            {hasDetailedInfo && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details" className="border border-gray-200 rounded-lg">
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 rounded-lg hover:no-underline transition-colors">
                    <span className="font-medium text-gray-900 text-sm">More Details</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <SystemDetails
                      description={description}
                      repairCost={repairCost}
                      maintenanceTips={maintenanceTips}
                      maintenanceCosts={maintenanceCosts}
                      anticipatedRepairs={anticipatedRepairs}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            
            {/* CTA Button */}
            <SystemCTA
              ctaText={ctaText}
              ctaType={ctaType}
              onClick={handleCTAClick}
            />
          </div>
        </CardContent>
      </Card>

      <ProvidersModal
        isOpen={isProvidersModalOpen}
        onClose={() => setIsProvidersModalOpen(false)}
        providers={thumbtackProviders}
        serviceType={getSearchQuery(ctaType)}
        isLoading={isLoadingProviders}
        error={providersError}
      />
    </>
  );
};

export default SystemCard;
