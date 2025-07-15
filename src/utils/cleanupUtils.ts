
export const clearStaleData = () => {
  try {
    // Clear any stale analytics data that might cause 409 errors
    const keysToCheck = ['analytics_session', 'analytics_page_visit'];
    
    keysToCheck.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          // If data is older than 1 hour, remove it
          if (parsedData.timestamp && Date.now() - parsedData.timestamp > 3600000) {
            localStorage.removeItem(key);
            console.log(`Removed stale ${key} data`);
          }
        } catch (e) {
          // If parsing fails, remove the item
          localStorage.removeItem(key);
          console.log(`Removed invalid ${key} data`);
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning stale data:', error);
  }
};
