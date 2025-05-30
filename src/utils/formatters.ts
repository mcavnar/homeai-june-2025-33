
export const formatCurrency = (amount: number | null) => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number | null) => {
  if (!num) return 'N/A';
  return num.toLocaleString();
};

export const formatPercentage = (value: number | null) => {
  if (!value) return 'N/A';
  return `${(value * 100).toFixed(1)}%`;
};

export const calculateDaysOnMarket = (saleDate: string | null, listingDate: string | null): number | null => {
  if (!saleDate || !listingDate) return null;
  
  const sale = new Date(saleDate);
  const listing = new Date(listingDate);
  const diffTime = Math.abs(sale.getTime() - listing.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const calculateSaleToListRatio = (salePrice: number | null, listPrice: number | null): number | null => {
  if (!salePrice || !listPrice || listPrice === 0) return null;
  return salePrice / listPrice;
};
