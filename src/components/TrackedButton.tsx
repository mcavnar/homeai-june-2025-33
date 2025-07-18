
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAnalyticsContext } from './AnalyticsProvider';

interface TrackedButtonProps extends React.ComponentProps<typeof Button> {
  trackingLabel?: string;
  metaEventName?: string;
  metaValue?: number;
  metaContentName?: string;
  children: React.ReactNode;
}

export const TrackedButton: React.FC<TrackedButtonProps> = ({ 
  trackingLabel, 
  metaEventName,
  metaValue,
  metaContentName,
  children, 
  onClick,
  id,
  className,
  ...props 
}) => {
  const { trackButtonClick, trackMetaEvent } = useAnalyticsContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Track the button click in analytics
    const buttonText = trackingLabel || (typeof children === 'string' ? children : 'Button clicked');
    trackButtonClick(buttonText, id, className);

    // Track Meta event if specified
    if (metaEventName) {
      trackMetaEvent({
        eventName: metaEventName,
        value: metaValue,
        contentName: metaContentName || buttonText,
      });
    }

    // Call original onClick if provided
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Button
      {...props}
      id={id}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};
