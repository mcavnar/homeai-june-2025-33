import { useState, useEffect, useCallback } from 'react';

const POPUP_STORAGE_KEY = 'homepage_email_popup_shown';
const ENGAGEMENT_TIME_MS = 25000; // 25 seconds (middle of 20-30 range)
const SCROLL_THRESHOLD = 0.75; // 75% scroll

export const useHomepageEmailPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // Check if popup has been shown in this session
  useEffect(() => {
    const hasShownBefore = sessionStorage.getItem(POPUP_STORAGE_KEY) === 'true';
    setHasShown(hasShownBefore);
  }, []);

  // Scroll tracking
  const handleScroll = useCallback(() => {
    if (hasShown) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
    
    if (scrollPercentage >= SCROLL_THRESHOLD) {
      setShowPopup(true);
      setHasShown(true);
      sessionStorage.setItem(POPUP_STORAGE_KEY, 'true');
    }
  }, [hasShown]);

  // Timer for engagement time
  useEffect(() => {
    if (hasShown) return;

    const timer = setTimeout(() => {
      setShowPopup(true);
      setHasShown(true);
      sessionStorage.setItem(POPUP_STORAGE_KEY, 'true');
    }, ENGAGEMENT_TIME_MS);

    return () => clearTimeout(timer);
  }, [hasShown]);

  // Scroll event listener
  useEffect(() => {
    if (hasShown) return;

    let ticking = false;
    
    const scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, [handleScroll, hasShown]);

  const closePopup = () => {
    setShowPopup(false);
  };

  return {
    showPopup,
    closePopup,
  };
};