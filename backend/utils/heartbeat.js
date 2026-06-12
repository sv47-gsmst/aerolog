const OFFLINE_THRESHOLD_MS = 45 * 60 * 1000; // 45 minutes

function checkOfflineStatus(device) {
  const lastSync = new Date(device.connectionHeartbeat.lastSyncTimestamp).getTime();
  const now = Date.now();
  const isOffline = (now - lastSync) > OFFLINE_THRESHOLD_MS;

  device.connectionHeartbeat.isOffline = isOffline;
  return device;
}

module.exports = { checkOfflineStatus, OFFLINE_THRESHOLD_MS };