
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { TrackedButton } from '@/components/TrackedButton';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ServiceType } from '@/hooks/useServiceOptIn';

interface ServiceOptInModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: ServiceType;
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
}

const ServiceOptInModal: React.FC<ServiceOptInModalProps> = ({
  isOpen,
  onClose,
  serviceType,
  title,
  description,
  onConfirm
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error confirming service opt-in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base leading-relaxed mt-3">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          <TrackedButton
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full"
            trackingLabel={`Confirm ${serviceType} opt-in`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Confirming...
              </>
            ) : (
              'Yes, Contact Me'
            )}
          </TrackedButton>
          
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceOptInModal;
