
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Phone, ExternalLink } from 'lucide-react';

interface ThumbTackProvider {
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  image?: string;
  profileUrl: string;
  phone?: string;
  description?: string;
}

interface ProvidersModalProps {
  isOpen: boolean;
  onClose: () => void;
  providers: ThumbTackProvider[];
  serviceType: string;
  isLoading: boolean;
  error?: string;
}

const ProvidersModal: React.FC<ProvidersModalProps> = ({
  isOpen,
  onClose,
  providers,
  serviceType,
  isLoading,
  error
}) => {
  const renderRating = (rating: number, reviewCount: number) => {
    if (!rating || rating === 0) {
      return <span className="text-gray-500 text-sm">No rating yet</span>;
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-gray-900 ml-1">{rating.toFixed(1)}</span>
        </div>
        <span className="text-gray-500 text-sm">({reviewCount} reviews)</span>
      </div>
    );
  };

  const handleViewOnThumbtack = (profileUrl: string) => {
    window.open(profileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {serviceType} Providers Near You
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Finding providers...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          )}

          {!isLoading && !error && providers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No providers found for {serviceType} in your area.</p>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          )}

          {!isLoading && !error && providers.length > 0 && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Found {providers.length} {serviceType.toLowerCase()} providers in your area
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((provider, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {provider.name}
                          </h3>
                          {renderRating(provider.rating, provider.reviewCount)}
                        </div>
                        {provider.image && (
                          <img 
                            src={provider.image} 
                            alt={provider.name}
                            className="w-16 h-16 rounded-lg object-cover ml-4"
                          />
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{provider.location}</span>
                        </div>
                        
                        {provider.phone && (
                          <div className="flex items-center text-gray-600 text-sm">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{provider.phone}</span>
                          </div>
                        )}
                      </div>

                      {provider.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {provider.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {serviceType}
                        </Badge>
                        
                        <Button
                          onClick={() => handleViewOnThumbtack(provider.profileUrl)}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on Thumbtack
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProvidersModal;
