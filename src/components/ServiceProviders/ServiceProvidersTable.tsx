import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, Star, Plus, Trash2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatters';
import { supabase } from '@/integrations/supabase/client';
import { extractZipFromAddress, getDemoZipCode, getThumbTackCategoryId, isDemoMode } from '@/utils/thumbtackUtils';
import ProvidersModal from './ProvidersModal';

interface ServiceProvider {
  id: number;
  serviceType: string;
  company: string;
  frequency: string;
  rating?: number; // Made optional to support placeholder providers
  monthlyCost: number;
  annualCost: number;
  contact?: string;
  phone?: string;
  email?: string;
  website?: string;
  notes?: string;
}

interface ThumbTackProvider {
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  image?: string;
  profileUrl: string;
  phone?: string;
  description?: string;
}

interface ServiceProvidersTableProps {
  providers: ServiceProvider[];
  propertyAddress?: string;
}

const ServiceProvidersTable: React.FC<ServiceProvidersTableProps> = ({ 
  providers: initialProviders, 
  propertyAddress 
}) => {
  const [providers, setProviders] = useState<ServiceProvider[]>(initialProviders);
  const [openDetails, setOpenDetails] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProvidersModalOpen, setIsProvidersModalOpen] = useState(false);
  const [thumbtackProviders, setThumbTackProviders] = useState<ThumbTackProvider[]>([]);
  const [currentServiceType, setCurrentServiceType] = useState<string>('');
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [providersError, setProvidersError] = useState<string>('');
  const [loadingServiceType, setLoadingServiceType] = useState<string>('');
  const [newProvider, setNewProvider] = useState({
    serviceType: '',
    company: '',
    frequency: '',
    rating: 0,
    monthlyCost: 0,
    annualCost: 0,
    contact: '',
    phone: '',
    email: '',
    website: '',
    notes: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isDemoModeActive = isDemoMode(location.pathname);

  const handleAddProviderClick = () => {
    if (isDemoModeActive) {
      navigate('/auth');
      return;
    }
    setIsAddModalOpen(true);
  };

  const toggleDetails = (providerId: number) => {
    setOpenDetails(openDetails === providerId ? null : providerId);
  };

  const handleAddProvider = () => {
    const newId = Math.max(...providers.map(p => p.id)) + 1;
    const providerToAdd: ServiceProvider = {
      ...newProvider,
      id: newId
    };
    setProviders([...providers, providerToAdd]);
    setNewProvider({
      serviceType: '',
      company: '',
      frequency: '',
      rating: 0,
      monthlyCost: 0,
      annualCost: 0,
      contact: '',
      phone: '',
      email: '',
      website: '',
      notes: ''
    });
    setIsAddModalOpen(false);
    toast({
      title: "Provider Added",
      description: "Service provider has been successfully added.",
    });
  };

  const handleDeleteProvider = (providerId: number) => {
    const updatedProviders = providers.filter(provider => provider.id !== providerId);
    setProviders(updatedProviders);
    setOpenDetails(null);
    toast({
      title: "Provider Deleted",
      description: "Service provider has been successfully removed.",
    });
  };

  const handleGetProviders = async (serviceType: string) => {
    console.log('Get providers clicked for:', serviceType);
    
    // Determine zip code based on mode
    let zipCode: string | null = null;
    
    if (isDemoModeActive) {
      zipCode = getDemoZipCode();
    } else if (propertyAddress) {
      zipCode = extractZipFromAddress(propertyAddress);
    }

    if (!zipCode) {
      toast({
        title: "Location Required",
        description: "Unable to determine location for provider search.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingProviders(true);
    setLoadingServiceType(serviceType);
    setProvidersError('');
    setCurrentServiceType(serviceType);

    try {
      console.log('Sending to Thumbtack API:', { searchQuery: serviceType, zipCode });

      const { data, error } = await supabase.functions.invoke('thumbtack-search', {
        body: {
          searchQuery: serviceType,
          zipCode: zipCode
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to search providers');
      }

      if (!data.success) {
        throw new Error(data.error || 'Provider search failed');
      }

      setThumbTackProviders(data.providers || []);
      setIsProvidersModalOpen(true);

      toast({
        title: "Providers Found",
        description: `Found ${data.providers?.length || 0} ${serviceType.toLowerCase()} providers in your area.`,
      });

    } catch (error) {
      console.error('Provider search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to search for providers';
      setProvidersError(errorMessage);
      
      toast({
        title: "Search Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoadingProviders(false);
      setLoadingServiceType('');
    }
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      </div>
    );
  };

  const isPlaceholderProvider = (provider: ServiceProvider) => {
    return provider.rating === undefined || provider.rating === null;
  };

  const formatProviderCost = (cost: number, isPlaceholder: boolean) => {
    if (cost === 0) return '-';
    const formattedCost = formatCurrency(cost);
    
    if (isPlaceholder) {
      return (
        <span>
          <span className="text-gray-500 font-normal">Est. </span>
          <span className="text-gray-900 font-bold">{formattedCost}</span>
        </span>
      );
    }
    
    return <span className="text-gray-900 font-bold">{formattedCost}</span>;
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Service Provider Overview</CardTitle>
              <p className="text-gray-600 mt-2">
                We've analyzed your property and recommend the following service types. We've pre-populated the list with estimated costs for your area. Hit Get Provider to be connected to a vetted local service provider.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-500 font-medium">Service Type</TableHead>
                <TableHead className="text-gray-500 font-medium">Frequency</TableHead>
                <TableHead className="text-gray-500 font-medium text-right">Monthly Cost</TableHead>
                <TableHead className="text-gray-500 font-medium text-right">Annual Cost</TableHead>
                <TableHead className="text-gray-500 font-medium text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <React.Fragment key={provider.id}>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className="border-gray-300 text-black bg-white rounded-full px-3 py-1"
                        >
                          {provider.serviceType}
                        </Badge>
                        {!isPlaceholderProvider(provider) && (
                          <Collapsible open={openDetails === provider.id} onOpenChange={() => toggleDetails(provider.id)}>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                Details
                                {openDetails === provider.id ? 
                                  <ChevronUp className="ml-1 h-4 w-4" /> : 
                                  <ChevronDown className="ml-1 h-4 w-4" />
                                }
                              </Button>
                            </CollapsibleTrigger>
                          </Collapsible>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">{provider.frequency}</TableCell>
                    <TableCell className="text-right">
                      {formatProviderCost(provider.monthlyCost, isPlaceholderProvider(provider))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatProviderCost(provider.annualCost, isPlaceholderProvider(provider))}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        onClick={() => handleGetProviders(provider.serviceType)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={loadingServiceType === provider.serviceType}
                      >
                        {loadingServiceType === provider.serviceType ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Loading...
                          </div>
                        ) : (
                          'Get Provider'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {!isPlaceholderProvider(provider) && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <Collapsible open={openDetails === provider.id}>
                          <CollapsibleContent className="bg-gray-50 border-t">
                            <div className="p-6 space-y-4">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Details</h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`company-${provider.id}`}>Company Name</Label>
                                  <Input id={`company-${provider.id}`} defaultValue={provider.company} />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`contact-${provider.id}`}>Main Contact</Label>
                                  <Input id={`contact-${provider.id}`} defaultValue={provider.contact} placeholder="Contact name" />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`phone-${provider.id}`}>Phone Number</Label>
                                  <Input id={`phone-${provider.id}`} type="tel" defaultValue={provider.phone} placeholder="(555) 123-4567" />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`email-${provider.id}`}>Email</Label>
                                  <Input id={`email-${provider.id}`} type="email" defaultValue={provider.email} placeholder="contact@company.com" />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`website-${provider.id}`}>Website</Label>
                                  <Input id={`website-${provider.id}`} type="url" defaultValue={provider.website} placeholder="https://company.com" />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`monthly-cost-${provider.id}`}>Monthly Cost</Label>
                                  <Input 
                                    id={`monthly-cost-${provider.id}`} 
                                    type="number" 
                                    defaultValue={provider.monthlyCost} 
                                    placeholder="0.00" 
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`notes-${provider.id}`}>Notes</Label>
                                <Textarea 
                                  id={`notes-${provider.id}`} 
                                  defaultValue={provider.notes}
                                  placeholder="Additional notes about this service provider..."
                                  rows={3}
                                />
                              </div>
                              
                              <div className="flex justify-between pt-4">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Service Provider</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {provider.company}? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteProvider(provider.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                
                                <div className="flex space-x-2">
                                  <Button variant="outline" onClick={() => setOpenDetails(null)}>
                                    Cancel
                                  </Button>
                                  <Button>
                                    Save Changes
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProvidersModal
        isOpen={isProvidersModalOpen}
        onClose={() => setIsProvidersModalOpen(false)}
        providers={thumbtackProviders}
        serviceType={currentServiceType}
        isLoading={isLoadingProviders}
        error={providersError}
      />
    </>
  );
};

export default ServiceProvidersTable;
