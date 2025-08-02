
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

export const getStatusBadgeStyle = (status: 'Active' | 'Corrected' | 'Pending') => {
  const styles = {
    Active: 'bg-emerald-100 text-emerald-800',
    Corrected: 'bg-amber-100 text-amber-800',
    Pending: 'bg-rose-100 text-rose-800',
  };
  return `px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`;
};
