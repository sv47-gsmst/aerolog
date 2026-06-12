const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const DeviceData = require('./models/DeviceData');
const syncRoutes = require('./routes/sync');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'Aerolog backend running' });
});

app.use('/api', syncRoutes);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});