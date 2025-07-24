import { useState, useEffect, useCallback } from 'react';

const POPUP_STORAGE_KEY = 'anonymous_upload_popup_shown';
const SHOW_DELAY_MS = 10000; // 10 seconds

export const useAnonymousUploadPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [uploadInteracted, setUploadInteracted] = useState(false);

  // Check if popup has been shown in this session
  useEffect(() => {
    const hasShownBefore = sessionStorage.getItem(POPUP_STORAGE_KEY) === 'true';
    setHasShown(hasShownBefore);
  }, []);

  // Timer to show popup after 10 seconds
  useEffect(() => {
    if (hasShown || uploadInteracted) return;

    const timer = setTimeout(() => {
      if (!uploadInteracted) {
        setShowPopup(true);
        setHasShown(true);
        sessionStorage.setItem(POPUP_STORAGE_KEY, 'true');
      }
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [hasShown, uploadInteracted]);

  // Function to call when user interacts with upload module
  const handleUploadInteraction = useCallback(() => {
    setUploadInteracted(true);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  return {
    showPopup,
    closePopup,
    handleUploadInteraction,
  };
};