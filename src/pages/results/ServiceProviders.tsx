
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Star, ExternalLink, Calendar, Calculator, TrendingUp, ChevronDown } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface ServiceProvidersContextType {
  analysis: any;
  propertyData: any;
}

const ServiceProviders = () => {
  const { analysis, propertyData } = useOutletContext<ServiceProvidersContextType>();

  // Calculate estimated costs based on analysis data
  const calculateCostSummary = () => {
    if (!analysis?.issues) {
      return {
        monthlyAverage: 820,
        annualTotal: 14790,
        marketDifference: 6170
      };
    }

    // Calculate total estimated costs from analysis
    const totalCosts = analysis.issues.reduce((sum: number, issue: any) => {
      return sum + ((issue.estimatedCost?.min || 0) + (issue.estimatedCost?.max || 0)) / 2;
    }, 0);

    // Estimate monthly and annual costs based on repair urgency
    const monthlyAverage = Math.round(totalCosts * 0.05); // 5% of total per month for maintenance
    const annualTotal = Math.round(totalCosts * 0.6); // 60% of issues addressed annually
    const marketDifference = Math.round(annualTotal * 0.42); // 42% above market average

    return { monthlyAverage, annualTotal, marketDifference };
  };

  const costSummary = calculateCostSummary();

  // Mock service providers data organized by service type
  const getServiceProviders = (address?: string) => {
    const serviceProviders = [
      {
        id: 1,
        serviceType: "Lawn Care",
        company: "PerfectLawn Care",
        frequency: "Weekly",
        monthlyCost: 320,
        annualCost: 3840,
        rating: 4.8,
        reviews: 245,
        phone: "(555) 123-4567",
        distance: "2.3 miles",
      },
      {
        id: 2,
        serviceType: "House Cleaning",
        company: "Spotless Home Cleaning",
        frequency: "Bi-weekly",
        monthlyCost: 250,
        annualCost: 3000,
        rating: 4.9,
        reviews: 189,
        phone: "(555) 234-5678",
        distance: "1.8 miles",
      },
      {
        id: 3,
        serviceType: "Plumbing",
        company: "AquaFlow Plumbing",
        frequency: "As-needed",
        monthlyCost: 0,
        annualCost: 1200,
        rating: 4.7,
        reviews: 156,
        phone: "(555) 345-6789",
        distance: "3.1 miles",
      },
      {
        id: 4,
        serviceType: "HVAC",
        company: "Climate Control Experts",
        frequency: "Quarterly",
        monthlyCost: 100,
        annualCost: 1200,
        rating: 4.6,
        reviews: 198,
        phone: "(555) 456-7890",
        distance: "2.7 miles",
      },
      {
        id: 5,
        serviceType: "Electrical",
        company: "Elite Electrical Solutions",
        frequency: "As-needed",
        monthlyCost: 0,
        annualCost: 800,
        rating: 4.9,
        reviews: 167,
        phone: "(555) 567-8901",
        distance: "2.1 miles",
      },
    ];

    return serviceProviders;
  };

  const providers = getServiceProviders(analysis?.propertyInfo?.address);

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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Provider Overview</h1>
        <p className="text-gray-600">Recommended service schedules and cost estimates for your property</p>
      </div>

      {/* Cost Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-8 w-8 text-blue-100" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-100">Monthly Average</h3>
              <p className="text-3xl font-bold">{formatCurrency(costSummary.monthlyAverage)}</p>
              <p className="text-sm text-blue-100">Based on scheduled services only</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Calculator className="h-8 w-8 text-purple-100" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-purple-100">Annual Total</h3>
              <p className="text-3xl font-bold">{formatCurrency(costSummary.annualTotal)}</p>
              <p className="text-sm text-purple-100">Excludes as-needed services</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-red-100" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-red-100">Difference vs Market Average</h3>
              <p className="text-3xl font-bold">+{formatCurrency(costSummary.marketDifference)}</p>
              <p className="text-sm text-red-100">Based on service providers in your area</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Providers Table */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left font-semibold text-gray-900">Service Type</TableHead>
                <TableHead className="text-left font-semibold text-gray-900">Company</TableHead>
                <TableHead className="text-left font-semibold text-gray-900">Frequency</TableHead>
                <TableHead className="text-right font-semibold text-gray-900">Monthly Cost</TableHead>
                <TableHead className="text-right font-semibold text-gray-900">Annual Cost</TableHead>
                <TableHead className="text-center font-semibold text-gray-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.id} className="hover:bg-gray-50">
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need More Options?</h3>
            <p className="text-blue-700 mb-4">
              We can help you find additional qualified contractors in your area.
            </p>
            <Button className="bg-green-400 hover:bg-green-500 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              Find More Providers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceProviders;
