
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Star, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/utils/formatters';

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
            <DropdownMenuContent align="end" className="w-64 bg-white border shadow-lg">
              <DropdownMenuItem className="flex-col items-start p-3">
                <div className="font-medium text-gray-900 mb-1">Contact Information</div>
                <div className="text-sm text-gray-600">Phone: {provider.phone}</div>
                <div className="text-sm text-gray-600">Distance: {provider.distance}</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex-col items-start p-3">
                <div className="font-medium text-gray-900 mb-1">Service Details</div>
                <div className="text-sm text-gray-600">Service Type: {provider.serviceType}</div>
                <div className="text-sm text-gray-600">Frequency: {provider.frequency}</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex-col items-start p-3">
                <div className="font-medium text-gray-900 mb-1">Pricing</div>
                <div className="text-sm text-gray-600">
                  Monthly: {provider.monthlyCost > 0 ? formatCurrency(provider.monthlyCost) : 'As needed'}
                </div>
                <div className="text-sm text-gray-600">Annual: {formatCurrency(provider.annualCost)}</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex-col items-start p-3">
                <div className="font-medium text-gray-900 mb-1">Reviews</div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{provider.rating} out of 5</span>
                </div>
                <div className="text-sm text-gray-600">{provider.reviews} customer reviews</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ServiceProviderRow;
