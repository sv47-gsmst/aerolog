const express = require('express');
const router = express.Router();
const DeviceData = require('../models/DeviceData');
const { translateBundle } = require('../utils/dictionary');

// POST /api/sync
// Expected body shape:
// {
//   deviceId: "test-iphone-01",
//   entries: [
//     { bundleId: "com.zhiliaoapp.musically", minutes: 12 },
//     { bundleId: "com.google.ios.youtube", minutes: 8 }
//   ]
// }
router.post('/sync', async (req, res) => {
  try {
    const { deviceId, entries } = req.body;

    if (!deviceId || !Array.isArray(entries)) {
      return res.status(400).json({ error: 'deviceId and entries[] are required' });
    }

    const device = await DeviceData.findOne({ 'childProfile.deviceId': deviceId });
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    let totalNewMinutes = 0;

    for (const entry of entries) {
      const appName = translateBundle(entry.bundleId);
      const minutes = Number(entry.minutes) || 0;
      totalNewMinutes += minutes;

      const current = device.metrics.get(appName) || { trueTime: 0 };
      current.trueTime += minutes;
      device.metrics.set(appName, current);
    }

    // Update session logs
    device.sessionLogs.lifetimeMinutesTotal += totalNewMinutes;
    device.sessionLogs.consecutiveMinutes += totalNewMinutes;

    // Update heartbeat
    device.connectionHeartbeat.lastSyncTimestamp = new Date();
    device.connectionHeartbeat.isOffline = false;

    await device.save();

    res.json({ status: 'synced', device });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;