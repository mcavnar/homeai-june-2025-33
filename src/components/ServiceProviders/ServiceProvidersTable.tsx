
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ServiceProviderRow from './ServiceProviderRow';

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

interface ServiceProvidersTableProps {
  providers: ServiceProvider[];
}

const ServiceProvidersTable: React.FC<ServiceProvidersTableProps> = ({ providers }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left font-semibold text-gray-900">Service Type</TableHead>
              <TableHead className="text-left font-semibold text-gray-900">Company</TableHead>
              <TableHead className="text-left font-semibold text-gray-900">Frequency</TableHead>
              <TableHead className="text-center font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((provider) => (
              <ServiceProviderRow key={provider.id} provider={provider} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ServiceProvidersTable;
