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

interface ServiceProvidersTableProps {
  providers: ServiceProvider[];
}

const ServiceProvidersTable: React.FC<ServiceProvidersTableProps> = ({ providers: initialProviders }) => {
  const [providers, setProviders] = useState<ServiceProvider[]>(initialProviders);
  const [openDetails, setOpenDetails] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
  const isDemoMode = location.pathname.includes('/demo/');

  const handleAddProviderClick = () => {
    if (isDemoMode) {
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Service Provider Overview</CardTitle>
            <p className="text-gray-600 mt-2">
              We've analyzed your property and recommend the following service types. We've pre-populated the list with estimated costs for your area. You can add your own service providers or request information about existing providers from the seller.
            </p>
          </div>
          <Dialog open={!isDemoMode && isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button variant="green" size="lg" onClick={handleAddProviderClick}>
                <Plus className="mr-2 h-4 w-4" />
                Add Service Provider
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Service Provider</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-service-type">Service Type</Label>
                    <Input 
                      id="new-service-type" 
                      value={newProvider.serviceType}
                      onChange={(e) => setNewProvider({...newProvider, serviceType: e.target.value})}
                      placeholder="e.g., Lawn Care, Plumbing"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-company">Company Name</Label>
                    <Input 
                      id="new-company" 
                      value={newProvider.company}
                      onChange={(e) => setNewProvider({...newProvider, company: e.target.value})}
                      placeholder="Company name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-frequency">Frequency</Label>
                    <Input 
                      id="new-frequency" 
                      value={newProvider.frequency}
                      onChange={(e) => setNewProvider({...newProvider, frequency: e.target.value})}
                      placeholder="e.g., Weekly, Monthly, As-needed"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-rating">Rating</Label>
                    <Input 
                      id="new-rating" 
                      type="number" 
                      min="0" 
                      max="5" 
                      step="0.1"
                      value={newProvider.rating}
                      onChange={(e) => setNewProvider({...newProvider, rating: parseFloat(e.target.value) || 0})}
                      placeholder="0.0 - 5.0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-monthly-cost">Monthly Cost</Label>
                    <Input 
                      id="new-monthly-cost" 
                      type="number" 
                      min="0"
                      value={newProvider.monthlyCost}
                      onChange={(e) => setNewProvider({...newProvider, monthlyCost: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-annual-cost">Annual Cost</Label>
                    <Input 
                      id="new-annual-cost" 
                      type="number" 
                      min="0"
                      value={newProvider.annualCost}
                      onChange={(e) => setNewProvider({...newProvider, annualCost: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-contact">Main Contact</Label>
                    <Input 
                      id="new-contact" 
                      value={newProvider.contact}
                      onChange={(e) => setNewProvider({...newProvider, contact: e.target.value})}
                      placeholder="Contact name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-phone">Phone Number</Label>
                    <Input 
                      id="new-phone" 
                      type="tel"
                      value={newProvider.phone}
                      onChange={(e) => setNewProvider({...newProvider, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-email">Email</Label>
                    <Input 
                      id="new-email" 
                      type="email"
                      value={newProvider.email}
                      onChange={(e) => setNewProvider({...newProvider, email: e.target.value})}
                      placeholder="contact@company.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-website">Website</Label>
                    <Input 
                      id="new-website" 
                      type="url"
                      value={newProvider.website}
                      onChange={(e) => setNewProvider({...newProvider, website: e.target.value})}
                      placeholder="https://company.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-notes">Notes</Label>
                  <Textarea 
                    id="new-notes"
                    value={newProvider.notes}
                    onChange={(e) => setNewProvider({...newProvider, notes: e.target.value})}
                    placeholder="Additional notes about this service provider..."
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProvider}>
                    Add Provider
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                </TableRow>
                
                {!isPlaceholderProvider(provider) && (
                  <TableRow>
                    <TableCell colSpan={4} className="p-0">
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
  );
};

export default ServiceProvidersTable;
