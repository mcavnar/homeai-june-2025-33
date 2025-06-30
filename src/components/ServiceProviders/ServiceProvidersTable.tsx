
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
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
              <TableRow key={provider.id} className="hover:bg-gray-50">
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
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      Details
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ServiceProvidersTable;
