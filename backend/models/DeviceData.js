const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  trueTime: { type: Number, default: 0 } // minutes
}, { _id: false });

const deviceDataSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  childProfile: {
    deviceId: { type: String, required: true, unique: true },
    deviceName: { type: String, required: true },
    timezone: { type: String, default: 'America/New_York' },
    dailyLimitMinutes: { type: Number, default: 180 }
  },
  connectionHeartbeat: {
    lastSyncTimestamp: { type: Date, default: Date.now },
    isOffline: { type: Boolean, default: false }
  },
  metrics: {
    type: Map,
    of: metricSchema,
    default: {}
  },
  sessionLogs: {
    consecutiveMinutes: { type: Number, default: 0 },
    lifetimeMinutesTotal: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('DeviceData', deviceDataSchema);