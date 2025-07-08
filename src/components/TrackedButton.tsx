
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAnalyticsContext } from './AnalyticsProvider';

interface TrackedButtonProps extends React.ComponentProps<typeof Button> {
  trackingLabel?: string;
  children: React.ReactNode;
}

export const TrackedButton: React.FC<TrackedButtonProps> = ({ 
  trackingLabel, 
  children, 
  onClick,
  id,
  className,
  ...props 
}) => {
  const { trackButtonClick } = useAnalyticsContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Track the button click
    const buttonText = trackingLabel || (typeof children === 'string' ? children : 'Button clicked');
    trackButtonClick(buttonText, id, className);

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
