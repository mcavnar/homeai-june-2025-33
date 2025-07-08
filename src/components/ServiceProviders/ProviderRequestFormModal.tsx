
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TrackedButton } from '@/components/TrackedButton';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Copy, Mail, Eye, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProviderRequestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProviderRequestFormModal: React.FC<ProviderRequestFormModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [shareableUrl] = useState('https://id-preview--dc955417-b386-4eae-90f7-f400ab3ea040.lovable.app/forms/provider-request/m9q7dmxh1hisugas5hbkp');
  
  const emailTemplate = `I hope this message finds you well. I am interested in purchasing your property and would greatly appreciate your assistance in understanding the ongoing maintenance and service provider relationships.

To help me make an informed decision and ensure a smooth transition, could you please fill out this brief form about your current service providers? This information will help me understand the cost and upkeep requirements for maintaining the home.

Please click the link below to access the form:
https://id-preview--dc955417-b386-4eae-90f7-f400ab3ea040.lovable.app/forms/provider-request/m9q7dmxh1hisugas5hbkp

The form should only take a few minutes to complete and will help both of us ensure a successful property transfer.`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const openEmailClient = () => {
    const subject = encodeURIComponent('Service Provider Information Request');
    const body = encodeURIComponent(emailTemplate);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <CheckCircle className="h-6 w-6" />
            <DialogTitle className="text-2xl font-bold text-green-600">
              Form Generated Successfully!
            </DialogTitle>
          </div>
          <TrackedButton
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
            onClick={onClose}
            trackingLabel="Provider Request Modal - Close"
          >
            <X className="h-4 w-4" />
          </TrackedButton>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-gray-600">
            Your service provider request form has been created and is ready to share. Use the tools below to send it to the seller or their agent.
          </p>

          <div className="space-y-2">
            <Label className="text-lg font-semibold text-gray-700">Shareable Form URL</Label>
            <div className="flex gap-2">
              <Input
                value={shareableUrl}
                readOnly
                className="flex-1 bg-gray-50"
              />
              <TrackedButton
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(shareableUrl, 'Form URL')}
                className="px-3"
                trackingLabel="Provider Request Modal - Copy Form URL"
              >
                <Copy className="h-4 w-4" />
              </TrackedButton>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-lg font-semibold text-gray-700">Email Template</Label>
            <Textarea
              value={emailTemplate}
              readOnly
              className="min-h-[200px] bg-gray-50 resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <TrackedButton
              variant="outline"
              onClick={() => copyToClipboard(emailTemplate, 'Email template')}
              className="flex items-center gap-2"
              trackingLabel="Provider Request Modal - Copy Email Template"
            >
              <Copy className="h-4 w-4" />
              Copy Email
            </TrackedButton>
            <TrackedButton
              onClick={openEmailClient}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
              trackingLabel="Provider Request Modal - Open Email Client"
            >
              <Mail className="h-4 w-4" />
              Open in Email Client
            </TrackedButton>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <TrackedButton
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.open(shareableUrl, '_blank')}
              trackingLabel="Provider Request Modal - Preview Form"
            >
              <Eye className="h-4 w-4" />
              Preview Form
            </TrackedButton>
            <TrackedButton 
              variant="outline" 
              onClick={onClose}
              trackingLabel="Provider Request Modal - Close Bottom"
            >
              Close
            </TrackedButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderRequestFormModal;
