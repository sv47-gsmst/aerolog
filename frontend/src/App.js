import { useEffect, useState } from 'react';
import './App.css';

const DEVICE_ID = 'test-iphone-01';
const API_BASE = 'http://localhost:5000';
const WS_URL = 'ws://localhost:5000';

function App() {
  const [device, setDevice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial fetch
    fetch(`${API_BASE}/api/device/${DEVICE_ID}`)
      .then((res) => {
        if (!res.ok) throw new Error('Device not found');
        return res.json();
      })
      .then(setDevice)
      .catch((err) => setError(err.message));

    // Live updates via WebSocket
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'device-update' && msg.device.childProfile.deviceId === DEVICE_ID) {
        setDevice(msg.device);
      }
    };
    ws.onopen = () => console.log('WebSocket connected');

    return () => ws.close();
  }, []);

  if (error) return <div className="App"><p>Error: {error}</p></div>;
  if (!device) return <div className="App"><p>Loading...</p></div>;

  const { childProfile, connectionHeartbeat, sessionLogs, metrics } = device;

  return (
    <div className="App">
      <h1>{childProfile.deviceName}</h1>

      <p>
        Status:{' '}
        {connectionHeartbeat.isOffline
          ? '🔴 Aerolog Offline / Connection Interrupted'
          : '🟢 Connected'}
      </p>

      <h2>Daily Limit: {childProfile.dailyLimitMinutes} min</h2>
      <p>Used today (consecutive): {sessionLogs.consecutiveMinutes} min</p>
      <p>Lifetime total: {sessionLogs.lifetimeMinutesTotal} min</p>

      <h3>App Breakdown</h3>
      <ul>
        {Object.entries(metrics).map(([appName, data]) => (
          <li key={appName}>
            {appName}: {data.trueTime} min
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;