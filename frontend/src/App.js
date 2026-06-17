import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ParentDashboard from './components/ParentDashboard';
import LoginPage from './components/LoginPage';
import VerifyPage from './components/VerifyPage';

const DEVICE_ID = 'test-iphone-01';
const API_BASE = 'http://localhost:5000';
const WS_URL = 'ws://localhost:5000';

function DashboardWrapper() {
  const [device, setDevice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/device/${DEVICE_ID}`, { credentials: 'include' })
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardWrapper />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/verify" element={<VerifyPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;