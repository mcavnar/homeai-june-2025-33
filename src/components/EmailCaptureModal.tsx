
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getSessionId } from '@/utils/sessionUtils';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailCaptureModal: React.FC<EmailCaptureModalProps> = ({
  isOpen,
  onClose
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Insert the email into the upload_reminder_emails table
      const sessionId = getSessionId();
      const { error: insertError } = await supabase
        .from('upload_reminder_emails')
        .insert({
          email,
          session_id: sessionId,
          user_agent: navigator.userAgent,
          referrer_url: document.referrer,
          current_page_url: window.location.href,
        });

      if (insertError) {
        throw insertError;
      }

      // Send the reminder email
      const { error: emailError } = await supabase.functions.invoke('send-upload-reminder-email', {
        body: {
          email,
          sessionId,
          currentUrl: window.location.href,
        },
      });

      if (emailError) {
        throw emailError;
      }

      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "We'll send you a link when you're ready to upload your report.",
      });
    } catch (error) {
      console.error('Error sending reminder email:', error);
      toast({
        title: "Error",
        description: "There was a problem sending the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            Don't Have Your Report?
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base leading-relaxed mt-3">
            {isSubmitted 
              ? "Perfect! We'll send you a link to analyze your report when you're ready."
              : "No problem! Enter your email below and we'll send you a link to come back and analyze your report when you have it."
            }
          </DialogDescription>
        </DialogHeader>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send Me the Link'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-6">
            <Button onClick={handleClose} className="w-full">
              Got It
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailCaptureModal;
