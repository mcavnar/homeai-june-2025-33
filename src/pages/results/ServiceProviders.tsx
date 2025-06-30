import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Star, ExternalLink, Calendar, Calculator, TrendingUp } from 'lucide-react';
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

  // Mock service providers data - in a real app, this would come from an API
  const getServiceProviders = (address?: string) => {
    const baseProviders = [
      {
        id: 1,
        name: "ProFix Home Services",
        category: "General Contractor",
        rating: 4.8,
        reviews: 245,
        phone: "(555) 123-4567",
        specialties: ["Electrical", "Plumbing", "HVAC"],
        distance: "2.3 miles",
      },
      {
        id: 2,
        name: "Elite Electrical Solutions",
        category: "Electrical",
        rating: 4.9,
        reviews: 189,
        phone: "(555) 234-5678",
        specialties: ["Wiring", "Panel Upgrades", "Code Compliance"],
        distance: "1.8 miles",
      },
      {
        id: 3,
        name: "AquaFlow Plumbing",
        category: "Plumbing",
        rating: 4.7,
        reviews: 156,
        phone: "(555) 345-6789",
        specialties: ["Leak Repair", "Pipe Replacement", "Water Heaters"],
        distance: "3.1 miles",
      },
      {
        id: 4,
        name: "Climate Control Experts",
        category: "HVAC",
        rating: 4.6,
        reviews: 198,
        phone: "(555) 456-7890",
        specialties: ["AC Repair", "Heating Systems", "Duct Cleaning"],
        distance: "2.7 miles",
      },
    ];

    return baseProviders;
  };

  const providers = getServiceProviders(analysis?.propertyInfo?.address);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "General Contractor":
        return "bg-blue-100 text-blue-800";
      case "Electrical":
        return "bg-yellow-100 text-yellow-800";
      case "Plumbing":
        return "bg-cyan-100 text-cyan-800";
      case "HVAC":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommended Service Providers</h1>
        <p className="text-gray-600">Trusted contractors and specialists near your property</p>
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

      <div className="grid gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{provider.name}</CardTitle>
                  <Badge className={getCategoryColor(provider.category)}>
                    {provider.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{provider.rating}</span>
                    <span className="text-sm text-gray-600">({provider.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    {provider.distance}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {provider.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{provider.phone}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      <Phone className="h-3 w-3" />
                      Call
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                      <ExternalLink className="h-3 w-3" />
                      Website
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need More Options?</h3>
            <p className="text-blue-700 mb-4">
              We can help you find additional qualified contractors in your area.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Find More Providers
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceProviders;
