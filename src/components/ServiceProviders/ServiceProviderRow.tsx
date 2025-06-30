import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { formatCurrency } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';

interface ServiceProvider {
  id: number;
  serviceType: string;
  company: string;
  frequency: string;
  monthlyCost: number;
  annualCost: number;
  rating: number;
  reviews: number;
  phone: string;
  distance: string;
}

interface ServiceProviderRowProps {
  provider: ServiceProvider;
}

const ServiceProviderRow: React.FC<ServiceProviderRowProps> = ({ provider }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: provider.serviceType,
    companyName: provider.company,
    contactPerson: '',
    phoneNumber: provider.phone,
    email: '',
    serviceFrequency: provider.frequency,
    monthlyCost: provider.monthlyCost > 0 ? provider.monthlyCost.toString() : '',
    annualCost: provider.annualCost.toString(),
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDetails = () => {
    console.log('Saving provider details:', formData);
    toast({
      title: "Details Saved",
      description: "Service provider information has been updated successfully.",
    });
  };

  const serviceTypes = [
    "Lawn Care",
    "House Cleaning",
    "Plumbing",
    "HVAC",
    "Electrical",
    "Roofing",
    "Painting",
    "Pest Control",
    "Pool Maintenance",
    "Landscaping"
  ];

  const frequencies = [
    "Weekly",
    "Bi-weekly",
    "Monthly",
    "Quarterly",
    "Semi-annually",
    "Annually",
    "As-needed"
  ];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <TableRow className="hover:bg-gray-50">
        <TableCell>
          <div className="space-y-2">
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              {provider.serviceType}
            </Badge>
            <div>
              <div className="font-medium text-gray-900">{provider.company}</div>
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{provider.rating}</span>
                <span>({provider.reviews} reviews)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-900">{provider.frequency}</span>
              <div className="text-sm text-gray-600">
                <div className="font-semibold text-green-600">
                  {provider.monthlyCost > 0 ? `${formatCurrency(provider.monthlyCost)}/mo` : '-'}
                </div>
                <div className="font-semibold text-green-600">
                  {formatCurrency(provider.annualCost)}/yr
                </div>
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex justify-center gap-2">
            <Button size="sm" className="bg-green-400 hover:bg-green-500 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="hover:bg-gray-50">
                Details
                {isOpen ? (
                  <ChevronUp className="h-3 w-3 ml-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 ml-1" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </TableCell>
      </TableRow>
      
      <CollapsibleContent asChild>
        <TableRow>
          <TableCell colSpan={2} className="bg-gray-50 border-t">
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Provider Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor={`serviceType-${provider.id}`} className="text-sm font-medium text-gray-700">
                    Service Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      {serviceTypes.map((type) => (
                        <SelectItem key={type} value={type} className="hover:bg-gray-100">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`companyName-${provider.id}`} className="text-sm font-medium text-gray-700">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`companyName-${provider.id}`}
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Enter company name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`contactPerson-${provider.id}`} className="text-sm font-medium text-gray-700">
                    Contact Person
                  </Label>
                  <Input
                    id={`contactPerson-${provider.id}`}
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="Enter contact person name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`phoneNumber-${provider.id}`} className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id={`phoneNumber-${provider.id}`}
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`email-${provider.id}`} className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id={`email-${provider.id}`}
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`serviceFrequency-${provider.id}`} className="text-sm font-medium text-gray-700">
                    Service Frequency
                  </Label>
                  <Select value={formData.serviceFrequency} onValueChange={(value) => handleInputChange('serviceFrequency', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      {frequencies.map((freq) => (
                        <SelectItem key={freq} value={freq} className="hover:bg-gray-100">
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`monthlyCost-${provider.id}`} className="text-sm font-medium text-gray-700">
                    Monthly Cost
                  </Label>
                  <Input
                    id={`monthlyCost-${provider.id}`}
                    value={formData.monthlyCost}
                    onChange={(e) => handleInputChange('monthlyCost', e.target.value)}
                    placeholder="$0.00"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`annualCost-${provider.id}`} className="text-sm font-medium text-gray-700">
                    Annual Cost
                  </Label>
                  <Input
                    id={`annualCost-${provider.id}`}
                    value={formData.annualCost}
                    onChange={(e) => handleInputChange('annualCost', e.target.value)}
                    placeholder="$0.00"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`notes-${provider.id}`} className="text-sm font-medium text-gray-700">
                  Additional Notes
                </Label>
                <Textarea
                  id={`notes-${provider.id}`}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter any additional notes or comments about this service provider..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSaveDetails}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  size="sm"
                >
                  Save Details
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ServiceProviderRow;
