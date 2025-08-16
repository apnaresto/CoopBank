export const formatCurrency = (value: number) => 
  new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0 
  }).format(value);

export const formatCurrencyShort = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
}

export const getStatusBadgeStyle = (status: 'Active' | 'Corrected' | 'Pending' | 'Missing') => {
  const styles = {
    Active: 'bg-emerald-100 text-emerald-800',
    Corrected: 'bg-amber-100 text-amber-800',
    Pending: 'bg-rose-100 text-rose-800',
    Missing: 'bg-slate-200 text-slate-600'
  };
  return `px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`;
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} years ago`;
  
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} months ago`;
  
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} days ago`;

  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hours ago`;

  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minutes ago`;

  return `${Math.floor(seconds)} seconds ago`;
};