
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('id-ID').format(number);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

// Format number input with thousand separators for display
export const formatNumberInput = (value: number | string): string => {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  
  // Convert to string and remove any non-numeric characters
  const numericValue = String(value).replace(/[^\d]/g, '');
  
  if (!numericValue) {
    return "";
  }
  
  // Format with thousand separators
  return new Intl.NumberFormat('id-ID').format(parseInt(numericValue));
};

// Clean number input by removing formatting and returning numeric value
export const cleanNumberInput = (value: string): number => {
  if (!value) {
    return 0;
  }
  
  // Remove all non-numeric characters and convert to number
  const cleaned = value.replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned) : 0;
};

// Parse formatted number (remove separators and return number)
export const parseFormattedNumber = (value: string): number => {
  if (!value) {
    return 0;
  }
  
  // Remove all non-numeric characters and convert to number
  const cleaned = value.replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned) : 0;
};
