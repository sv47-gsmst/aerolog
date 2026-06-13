import { useEffect, useState } from 'react';
import ParentDashboard from './components/ParentDashboard';

const DEVICE_ID = 'test-iphone-01';
const API_BASE = 'http://localhost:5000';
const WS_URL = 'ws://localhost:5000';

function App() {
  const [device, setDevice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/device/${DEVICE_ID}`)
      .then((res) => {
        if (!res.ok) throw new Error('Device not found');
        return res.json();
      })
      .then(setDevice)
      .catch((err) => setError(err.message));

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

  if (error) return <p style={{ padding: 24 }}>Error: {error}</p>;
  if (!device) return <p style={{ padding: 24 }}>Loading...</p>;

  return <ParentDashboard device={device} />;
}

export default App;