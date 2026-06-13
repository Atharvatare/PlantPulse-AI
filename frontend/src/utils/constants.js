export const ASSET_CATEGORIES = ['Motor', 'Pump', 'Compressor', 'Transformer', 'Conveyor', 'Other'];

export const ASSET_STATUSES = ['Running', 'Stopped', 'Maintenance', 'Faulty'];

export const USER_ROLES = ['Admin', 'Engineer', 'Manager', 'Operator', 'Technician', 'Viewer'];

export const SEVERITY_LEVELS = ['Critical', 'Warning', 'Info'];

export const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];

export const WORK_ORDER_STATUSES = ['Open', 'In Progress', 'Completed'];

export const ALERT_TYPES = ['Temperature', 'Vibration', 'Pressure', 'Current', 'Voltage', 'Other'];

export const COLORS = {
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  secondary: '#06b6d4',
  accent: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#0ea5e9',
  purple: '#8b5cf6',
  orange: '#f97316',
  industrial: {
    50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
    400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
    750: '#1e293b', 800: '#1a1f2e', 850: '#151923', 900: '#0f1219', 950: '#0a0d14'
  },
  chart: {
    primary: '#6366f1', secondary: '#06b6d4', accent: '#10b981',
    warning: '#f59e0b', danger: '#ef4444', purple: '#8b5cf6',
    pink: '#ec4899', orange: '#f97316'
  }
};

export const QUICK_QUERIES = [
  'Why is Motor MTR-101 overheating?',
  'Suggest maintenance for Compressor C-201',
  'Analyze Transformer TR-301',
  'Show me failure prediction trends',
  'What are the current alerts?',
  'Generate a monthly maintenance report'
];
