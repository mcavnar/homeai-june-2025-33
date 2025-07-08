
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareReportModal: React.FC<ShareReportModalProps> = ({ isOpen, onClose }) => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const generateShareLink = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-share-link', {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        throw error;
      }

      setShareUrl(data.shareUrl);
      toast({
        title: "Share link generated",
        description: "Your report is now ready to share!",
      });
    } catch (error) {
      console.error('Error generating share link:', error);
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Share link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const openInNewTab = () => {
    window.open(shareUrl, '_blank');
  };

  React.useEffect(() => {
    if (isOpen && !shareUrl) {
      generateShareLink();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) {
      setShareUrl('');
      setCopied(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Share your inspection report with anyone. They'll be able to view all sections without needing to log in.
          </p>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <span className="ml-2 text-sm text-gray-600">Generating share link...</span>
            </div>
          ) : shareUrl ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openInNewTab}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Preview
                </Button>
                <Button onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareReportModal;
