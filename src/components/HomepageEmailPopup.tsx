import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getSessionId } from '@/utils/sessionUtils';

interface HomepageEmailPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HomepageEmailPopup: React.FC<HomepageEmailPopupProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const sessionId = getSessionId();

      // Save email to database
      const { error: insertError } = await supabase
        .from('popup_email_capture')
        .insert({
          email: email.toLowerCase().trim(),
          session_id: sessionId,
          source: 'homepage_popup',
          user_agent: navigator.userAgent,
          referrer_url: document.referrer,
          current_page_url: window.location.href,
        });

      if (insertError) {
        console.error('Error saving email:', insertError);
        throw new Error('Failed to save email');
      }

      // Send welcome email
      const { error: emailError } = await supabase.functions.invoke('send-homepage-welcome-email', {
        body: {
          email: email.toLowerCase().trim(),
          sessionId,
          currentUrl: window.location.href,
        },
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        // Don't throw error here - email capture is still successful
      }

      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "Thanks for signing up! Check your email for a welcome message.",
      });

    } catch (error) {
      console.error('Error in email capture:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full mx-4 sm:mx-auto max-h-[80vh] p-0 overflow-hidden border-0 bg-background shadow-2xl">
        <div className="relative p-8">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Stay in the loop.
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Get product updates and home buying insights — straight to your inbox.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-12 text-base border-border focus:border-primary"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full h-12 text-base font-medium"
                >
                  {isLoading ? "Signing you up..." : "Keep Me Posted"}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  You're all set!
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Check your email for a welcome message with everything you need to get started.
                </p>

                <Button
                  onClick={handleClose}
                  className="w-full h-12 text-base font-medium"
                >
                  Got It
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};