import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ProgressRing from './ProgressRing';
import './ParentDashboard.css';

function ParentDashboard({ device }) {
  const { childProfile, connectionHeartbeat, sessionLogs, metrics } = device;

  const percentage = (sessionLogs.consecutiveMinutes / childProfile.dailyLimitMinutes) * 100;

  const chartData = Object.entries(metrics).map(([appName, data]) => ({
    name: appName,
    minutes: data.trueTime,
  }));

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{childProfile.deviceName}</h1>
        {connectionHeartbeat.isOffline && (
          <div className="offline-banner">
            🔴 Aerolog Offline / Connection Interrupted
          </div>
        )}
      </header>

      <div className="dashboard-top">
        <div className="ring-card">
          <ProgressRing percentage={percentage} />
          <p className="ring-label">
            {sessionLogs.consecutiveMinutes} / {childProfile.dailyLimitMinutes} min today
          </p>
        </div>

        <div className="stats-card">
          <div className="stat">
            <span className="stat-value">{sessionLogs.lifetimeMinutesTotal}</span>
            <span className="stat-label">Lifetime minutes</span>
          </div>
          <div className="stat">
            <span className="stat-value">{Object.keys(metrics).length}</span>
            <span className="stat-label">Apps tracked</span>
          </div>
          <div className="stat">
            <span className={`stat-value ${connectionHeartbeat.isOffline ? 'status-offline' : 'status-online'}`}>
              {connectionHeartbeat.isOffline ? 'Offline' : 'Connected'}
            </span>
            <span className="stat-label">Status</span>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <h2>App Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" fill="#4a90d9" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ParentDashboard;