
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { formatCurrency } from '@/utils/formatters';

interface ServiceProvider {
  id: number;
  serviceType: string;
  company: string;
  frequency: string;
  monthlyCost: number;
  annualCost: number;
}

interface ServiceProvidersTableProps {
  providers: ServiceProvider[];
}

const ServiceProvidersTable: React.FC<ServiceProvidersTableProps> = ({ providers }) => {
  const [openDetails, setOpenDetails] = useState<number | null>(null);

  const getServiceTypeBadgeColor = (serviceType: string) => {
    const colors: { [key: string]: string } = {
      'Lawn Care': 'bg-pink-100 text-pink-800 border-pink-200',
      'House Cleaning': 'bg-blue-100 text-blue-800 border-blue-200',
      'Plumbing': 'bg-green-100 text-green-800 border-green-200',
      'HVAC': 'bg-purple-100 text-purple-800 border-purple-200',
      'Electrical': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[serviceType] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const toggleDetails = (providerId: number) => {
    setOpenDetails(openDetails === providerId ? null : providerId);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Service Provider Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-500 font-medium">Service Type</TableHead>
              <TableHead className="text-gray-500 font-medium">Company</TableHead>
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
                    <Badge 
                      variant="outline" 
                      className={`${getServiceTypeBadgeColor(provider.serviceType)} border rounded-full px-3 py-1`}
                    >
                      {provider.serviceType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{provider.company}</span>
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
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{provider.frequency}</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
                    {provider.monthlyCost > 0 ? formatCurrency(provider.monthlyCost) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
                    {formatCurrency(provider.annualCost)}
                  </TableCell>
                </TableRow>
                
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
                              <Input id={`contact-${provider.id}`} placeholder="Contact name" />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`phone-${provider.id}`}>Phone Number</Label>
                              <Input id={`phone-${provider.id}`} type="tel" placeholder="(555) 123-4567" />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`email-${provider.id}`}>Email</Label>
                              <Input id={`email-${provider.id}`} type="email" placeholder="contact@company.com" />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`website-${provider.id}`}>Website</Label>
                              <Input id={`website-${provider.id}`} type="url" placeholder="https://company.com" />
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
                              placeholder="Additional notes about this service provider..."
                              rows={3}
                            />
                          </div>
                          
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setOpenDetails(null)}>
                              Cancel
                            </Button>
                            <Button>
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ServiceProvidersTable;
