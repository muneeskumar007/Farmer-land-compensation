// Format currency in INR
export const formatCurrency = (amount) => {
  if (!amount) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number with Indian system
export const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

// Get initials from name
export const getInitials = (name = '') => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Status badge class
export const getStatusClass = (status) => {
  return {
    pending: 'badge-yellow',
    approved: 'badge-green',
    rejected: 'badge-red',
  }[status] || 'badge-blue';
};

// Local storage helpers with auto-save
export const saveFormDraft = (key, data) => {
  try { localStorage.setItem(`draft_${key}`, JSON.stringify(data)); } catch {}
};
export const loadFormDraft = (key) => {
  try {
    const d = localStorage.getItem(`draft_${key}`);
    return d ? JSON.parse(d) : null;
  } catch { return null; }
};
export const clearFormDraft = (key) => {
  localStorage.removeItem(`draft_${key}`);
};

// Debounce helper
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
