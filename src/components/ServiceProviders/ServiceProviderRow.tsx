
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Star, ExternalLink, ChevronDown } from 'lucide-react';
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
  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case "Lawn Care":
        return "bg-green-100 text-green-800";
      case "House Cleaning":
        return "bg-purple-100 text-purple-800";
      case "Electrical":
        return "bg-yellow-100 text-yellow-800";
      case "Plumbing":
        return "bg-cyan-100 text-cyan-800";
      case "HVAC":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <Badge className={getServiceTypeColor(provider.serviceType)}>
          {provider.serviceType}
        </Badge>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium text-gray-900">{provider.company}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{provider.rating}</span>
              <span>({provider.reviews} reviews)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{provider.distance}</span>
            </div>
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
          <Button variant="outline" size="sm" className="hover:bg-gray-50">
            <ExternalLink className="h-3 w-3 mr-1" />
            Details
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ServiceProviderRow;
