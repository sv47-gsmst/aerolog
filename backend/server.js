const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const WebSocket = require('ws');
const session = require('express-session');
require('dotenv').config();

const DeviceData = require('./models/DeviceData');
const syncRoutes = require('./routes/sync');
const authRoutes = require('./routes/auth');
const userAuthRoutes = require('./routes/userAuth');
const sessionExtender = require('./utils/sessionExtender');

const app = express();
app.use(cors());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 4 * 60 * 60 * 1000,
    httpOnly: true
  }
}));

app.use(sessionExtender);

app.get('/', (req, res) => {
  res.json({ status: 'Aerolog backend running' });
});

app.use('/api', syncRoutes);
app.use('/api', authRoutes);
app.use('/api', userAuthRoutes);

// TEMPORARY test route - creates a sample device record
app.post('/test/create-device', async (req, res) => {
  try {
    const device = await DeviceData.create({
      parentId: new mongoose.Types.ObjectId(),
      childProfile: {
        deviceId: 'test-iphone-01',
        deviceName: 'Test iPhone',
        dailyLimitMinutes: 180
      }
    });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TEMPORARY test route - lists all device records
app.get('/test/devices', async (req, res) => {
  try {
    const devices = await DeviceData.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- HTTP + WebSocket server setup ---
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Dashboard client connected via WebSocket');
  ws.on('close', () => console.log('Dashboard client disconnected'));
});

function broadcastDeviceUpdate(device) {
  const payload = JSON.stringify({ type: 'device-update', device });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

app.set('broadcastDeviceUpdate', broadcastDeviceUpdate);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});