import { useState, useEffect } from 'react';
import { FiServer, FiActivity, FiAlertTriangle, FiClipboard, FiZap, FiTool } from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import AlertBadge from '../../components/AlertBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getKPIs, getCharts, getRecentAlerts } from '../../services/dashboardService';
import { formatDate } from '../../utils/helpers';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const kpiDefaults = [
  { title: 'Total Assets', value: '...', icon: FiServer, color: 'primary' },
  { title: 'Running Assets', value: '...', icon: FiActivity, color: 'secondary' },
  { title: 'Faulty Assets', value: '...', icon: FiAlertTriangle, color: 'danger' },
  { title: 'Open Work Orders', value: '...', icon: FiClipboard, color: 'warning' },
  { title: 'Energy Consumption', value: '...', icon: FiZap, color: 'info' },
  { title: 'Maintenance Tasks', value: '...', icon: FiTool, color: 'purple' },
];

export default function Dashboard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: isDark ? '#94a3b8' : '#475569', usePointStyle: true, boxWidth: 6, padding: 12 } },
      tooltip: { backgroundColor: isDark ? '#1a1f2e' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0', borderWidth: 1, titleColor: isDark ? '#f8fafc' : '#0f172a', bodyColor: isDark ? '#94a3b8' : '#475569', cornerRadius: 8, padding: 10 }
    },
    scales: {
      x: { grid: { color: isDark ? '#1e293b' : '#f1f5f9', drawBorder: false }, ticks: { color: isDark ? '#64748b' : '#475569', maxTicksLimit: 8 } },
      y: { grid: { color: isDark ? '#1e293b' : '#f1f5f9', drawBorder: false }, ticks: { color: isDark ? '#64748b' : '#475569' } }
    }
  };
  const [kpis, setKpis] = useState(kpiDefaults);
  const [alerts, setAlerts] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getKPIs(), getCharts(), getRecentAlerts()])
      .then(([kpiRes, chartRes, alertRes]) => {
        const d = kpiRes.data?.data || kpiRes.data || {};
        setKpis([
          { title: 'Total Assets', value: d.totalAssets || 0, icon: FiServer, color: 'primary', trend: d.assetTrend },
          { title: 'Running Assets', value: d.runningAssets || 0, icon: FiActivity, color: 'secondary', trend: d.runningTrend },
          { title: 'Faulty Assets', value: d.faultyAssets || 0, icon: FiAlertTriangle, color: 'danger', trend: d.faultyTrend },
          { title: 'Open Work Orders', value: d.openWorkOrders || 0, icon: FiClipboard, color: 'warning', trend: d.workOrderTrend },
          { title: 'Energy Consumption', value: d.energyConsumption || '0 kWh', icon: FiZap, color: 'info', subtitle: d.energyChange },
          { title: 'Maintenance Tasks', value: d.maintenanceTasks || 0, icon: FiTool, color: 'purple', subtitle: d.tasksDue },
        ]);
        setChartData(chartRes.data?.data || chartRes.data);
        setAlerts(alertRes.data?.data?.alerts || alertRes.data?.alerts || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const healthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      { label: 'Health Score', data: chartData?.healthTrend || [88, 85, 82, 86, 84, 80, 78, 82, 85, 83, 86, 89], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', fill: true, tension: 0.4, pointRadius: 3 },
      { label: 'Target', data: chartData?.healthTarget || [85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85], borderColor: '#22c55e', borderDash: [5, 5], pointRadius: 0, borderWidth: 1.5 },
    ]
  };

  const failureData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Failure Probability (%)', data: chartData?.failureTrend || [12, 15, 18, 14, 11, 20, 22, 17, 13, 10, 8, 6], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4, pointRadius: 3
    }]
  };

  const costData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Maintenance Cost', data: chartData?.costTrend || [45, 52, 38, 41, 55, 48, 35, 42, 39, 33, 28, 25], backgroundColor: '#f59e0b', borderRadius: 4
    }]
  };

  const downtimeData = {
    labels: ['Planned', 'Unplanned', 'Maintenance', 'Other'],
    datasets: [{
      data: chartData?.downtimeBreakdown || [35, 25, 25, 15], backgroundColor: ['#6366f1', '#ef4444', '#f59e0b', '#94a3b8'], borderWidth: 0, hoverOffset: 8
    }]
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-industrial-400 mt-0.5">Real-time overview of your industrial operations</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <StatCard key={i} title={kpi.title} value={kpi.value} icon={kpi.icon} color={kpi.color} trend={kpi.trend} subtitle={kpi.subtitle} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Asset Health Trend" timeframes={['7d', '30d', '90d']}>
          <div className="h-64"><Line data={healthData} options={{ ...chartOpts, plugins: { ...chartOpts.plugins, legend: { display: false } } }} /></div>
        </ChartCard>
        <ChartCard title="Failure Prediction Trend" timeframes={['7d', '30d', '90d']}>
          <div className="h-64"><Line data={failureData} options={{ ...chartOpts, plugins: { ...chartOpts.plugins, legend: { display: false } } }} /></div>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Maintenance Cost Trend">
          <div className="h-64"><Bar data={costData} options={{ ...chartOpts, plugins: { ...chartOpts.plugins, legend: { display: false } } }} /></div>
        </ChartCard>
        <ChartCard title="Downtime Analytics">
          <div className="h-64 flex items-center justify-center"><Doughnut data={downtimeData} options={{ cutout: '65%', plugins: { ...chartOpts.plugins, legend: { position: 'bottom', labels: { color: '#94a3b8', usePointStyle: true, boxWidth: 8, padding: 12 } } } }} /></div>
        </ChartCard>
        <div className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-5 hover:border-industrial-600/60 transition-all">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-sm text-industrial-500 text-center py-8">No recent alerts</p>
            ) : (
              alerts.slice(0, 6).map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-industrial-700/30 transition-colors">
                  <AlertBadge severity={alert.severity} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{alert.assetId || alert.asset}</p>
                    <p className="text-[11px] text-industrial-400 truncate">{alert.type}</p>
                    <p className="text-[10px] text-industrial-500">{formatDate(alert.timestamp || alert.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
