
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Star, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hover:bg-gray-50">
                Details
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white border shadow-lg z-50">
              <div className="p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3">Provider Details</h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                      Price
                    </Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="Enter price"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mainContact" className="text-sm font-medium text-gray-700">
                      Main Contact
                    </Label>
                    <Input
                      id="mainContact"
                      value={formData.mainContact}
                      onChange={(e) => handleInputChange('mainContact', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                      Notes
                    </Label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="mt-1 w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Add any additional notes..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <Button 
                    onClick={handleSaveDetails}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    Save Details
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ServiceProviderRow;
