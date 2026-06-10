import { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FiDownload, FiCalendar } from 'react-icons/fi';
import ChartCard from '../../components/ChartCard';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';

const mockHealth = {
  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  datasets: [
    { label: 'Motor', data: [88,85,82,86,84,80,78,82,85,83,86,89], borderColor: '#6366f1', tension: 0.4, pointRadius: 2 },
    { label: 'Pump', data: [92,90,88,91,89,87,85,88,90,91,93,94], borderColor: '#22c55e', tension: 0.4, pointRadius: 2 },
    { label: 'Compressor', data: [78,75,72,70,74,71,68,72,75,77,80,82], borderColor: '#f59e0b', tension: 0.4, pointRadius: 2 },
  ]
};

const mockFailure = {
  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  datasets: [
    { label: 'Failure Rate (%)', data: [12,15,18,14,11,20,22,17,13,10,8,6], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4 }
  ]
};

const mockCost = {
  labels: ['Q1','Q2','Q3','Q4'],
  datasets: [
    { label: 'Preventive', data: [120,110,95,80], backgroundColor: '#6366f1', borderRadius: 4 },
    { label: 'Corrective', data: [80,95,70,45], backgroundColor: '#ef4444', borderRadius: 4 },
    { label: 'Predictive', data: [30,40,55,70], backgroundColor: '#22c55e', borderRadius: 4 },
  ]
};

const mockDowntime = {
  labels: ['Planned', 'Unplanned', 'Maintenance', 'Other'],
  datasets: [{ data: [35,25,25,15], backgroundColor: ['#6366f1','#ef4444','#f59e0b','#94a3b8'], borderWidth: 0 }]
};

const chartOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#94a3b8', usePointStyle: true, boxWidth: 6 } } },
  scales: { x: { grid: { color: '#1e293b' }, ticks: { color: '#64748b' } }, y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b' } } }
};

export default function Analytics() {
  const [dateRange, setDateRange] = useState('YTD');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-industrial-400 mt-0.5">Comprehensive analytics and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-industrial-800/60 rounded-lg p-1">
            {['7d','30d','90d','YTD','1y'].map((r) => (
              <button key={r} onClick={() => setDateRange(r)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${dateRange === r ? 'bg-primary-600 text-white' : 'text-industrial-400 hover:text-white'}`}>{r}</button>
            ))}
          </div>
          <button className="p-2 rounded-lg text-industrial-400 hover:text-white hover:bg-industrial-700/60 transition-colors"><FiDownload size={16} /></button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Health Score" value="84.2%" icon={null} color="primary" trend={{ direction: 'up', value: '2.1%' }} />
        <StatCard title="Total Incidents" value="47" icon={null} color="danger" trend={{ direction: 'down', value: '12%' }} />
        <StatCard title="MTBF" value="2,847h" icon={null} color="secondary" trend={{ direction: 'up', value: '8.3%' }} />
        <StatCard title="Compliance Rate" value="96.5%" icon={null} color="info" trend={{ direction: 'up', value: '1.2%' }} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Health Score Trends by Asset Type" timeframes={['7d','30d','90d']}>
          <div className="h-72"><Line data={mockHealth} options={chartOpts} /></div>
        </ChartCard>
        <ChartCard title="Failure Rate Trend" timeframes={['7d','30d','90d']}>
          <div className="h-72"><Line data={mockFailure} options={{ ...chartOpts, plugins: { ...chartOpts.plugins, legend: { display: false } } }} /></div>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Maintenance Costs Breakdown">
          <div className="h-72"><Bar data={mockCost} options={chartOpts} /></div>
        </ChartCard>
        <ChartCard title="Downtime Analysis">
          <div className="h-72 flex items-center justify-center"><Doughnut data={mockDowntime} options={{ cutout: '60%', plugins: { ...chartOpts.plugins, legend: { position: 'bottom', labels: { color: '#94a3b8', usePointStyle: true, boxWidth: 8, padding: 12 } } } }} /></div>
        </ChartCard>
        <div className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Summary</h3>
          <div className="space-y-3">
            {[
              ['Total Assets', '156', '+12 this quarter'],
              ['Avg Uptime', '94.3%', '+2.1% improvement'],
              ['Open Issues', '23', '8 critical'],
              ['Scheduled Tasks', '45', 'Next 30 days'],
            ].map(([l, v, s]) => (
              <div key={l} className="flex items-center justify-between p-2.5 rounded-lg bg-industrial-900/50">
                <div>
                  <p className="text-xs text-industrial-400">{l}</p>
                  <p className="text-sm font-semibold text-white">{v}</p>
                </div>
                <span className="text-[10px] text-industrial-500">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
