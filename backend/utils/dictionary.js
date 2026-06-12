const bundleDictionary = {
  "com.zhiliaoapp.musically": "TikTok",
  "com.google.ios.youtube": "YouTube",
  "com.apple.Music": "Apple Music",
  "com.spotify.client": "Spotify",
  "com.netflix.Netflix": "Netflix"
};

function translateBundle(bundleId) {
  return bundleDictionary[bundleId] || "Uncategorized App";
}

module.exports = { translateBundle, bundleDictionary };