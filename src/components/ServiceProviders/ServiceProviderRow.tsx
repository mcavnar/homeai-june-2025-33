
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    phoneNumber: provider.phone,
    price: provider.monthlyCost > 0 ? provider.monthlyCost.toString() : '',
    website: '',
    email: '',
    companyName: provider.company,
    mainContact: '',
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
      description: "Provider information has been updated successfully.",
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <TableRow className="hover:bg-gray-50">
        <TableCell>
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {provider.serviceType}
          </Badge>
        </TableCell>
        <TableCell>
          <div>
            <div className="font-medium text-gray-900">{provider.company}</div>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{provider.rating}</span>
              <span>({provider.reviews} reviews)</span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="text-gray-900">{provider.frequency}</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700">
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <span className="font-semibold text-green-600">
            {provider.monthlyCost > 0 ? formatCurrency(provider.monthlyCost) : '-'}
          </span>
        </TableCell>
        <TableCell className="text-right">
          <span className="font-semibold text-green-600">
            {formatCurrency(provider.annualCost)}
          </span>
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
          <TableCell colSpan={6} className="bg-gray-50 border-t">
            <div className="p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">Provider Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`companyName-${provider.id}`} className="text-sm font-medium text-gray-700">
                    Company Name
                  </Label>
                  <Input
                    id={`companyName-${provider.id}`}
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
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
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`website-${provider.id}`} className="text-sm font-medium text-gray-700">
                    Website
                  </Label>
                  <Input
                    id={`website-${provider.id}`}
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`price-${provider.id}`} className="text-sm font-medium text-gray-700">
                    Price
                  </Label>
                  <Input
                    id={`price-${provider.id}`}
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Enter price"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`mainContact-${provider.id}`} className="text-sm font-medium text-gray-700">
                    Main Contact
                  </Label>
                  <Input
                    id={`mainContact-${provider.id}`}
                    value={formData.mainContact}
                    onChange={(e) => handleInputChange('mainContact', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`notes-${provider.id}`} className="text-sm font-medium text-gray-700">
                  Notes
                </Label>
                <textarea
                  id={`notes-${provider.id}`}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="mt-1 w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSaveDetails}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
