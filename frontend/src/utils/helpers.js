export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function generateId(prefix = '') {
  return `${prefix}${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}

export function getHealthColor(score) {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

export function getHealthBarColor(score) {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

export function getSeverityColor(severity) {
  switch (severity) {
    case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400/30';
    case 'Warning': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    case 'Info': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  }
}

export function getPriorityColor(priority) {
  switch (priority) {
    case 'High': return 'text-red-400 bg-red-400/10';
    case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
    case 'Low': return 'text-green-400 bg-green-400/10';
    default: return 'text-gray-400 bg-gray-400/10';
  }
}

export function getStatusColor(status) {
  switch (status) {
    case 'Running': return 'text-green-400 bg-green-400/10 border-green-400/30';
    case 'Stopped': return 'text-red-400 bg-red-400/10 border-red-400/30';
    case 'Maintenance': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    case 'Faulty': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  }
}
