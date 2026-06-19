const bundleDictionary = {
  // Bundle IDs
  "com.zhiliaoapp.musically": "TikTok",
  "com.google.ios.youtube": "YouTube",
  "com.apple.Music": "Apple Music",
  "com.spotify.client": "Spotify",
  "com.netflix.Netflix": "Netflix",
  "com.instagram.instagram": "Instagram",
  "com.facebook.Facebook": "Facebook",
  "com.atebits.Tweetie2": "Twitter/X",
  "com.snapchat.snapchat": "Snapchat",
  "com.discord.discord": "Discord",
  "com.hammerandchisel.discord": "Discord",
  "com.amazon.Amazon": "Amazon Prime Video",
  "com.google.ios.youtube.kids": "YouTube Kids",
  "com.roblox.roblox": "Roblox",
  "com.mojang.minecraftpe": "Minecraft",
  "com.unknown.app": "Other"
};

// Friendly name lookup - so typing "youtube" works too
const friendlyNames = {
  "youtube": "YouTube",
  "tiktok": "TikTok",
  "spotify": "Spotify",
  "netflix": "Netflix",
  "instagram": "Instagram",
  "facebook": "Facebook",
  "twitter": "Twitter/X",
  "x": "Twitter/X",
  "snapchat": "Snapchat",
  "discord": "Discord",
  "amazon": "Amazon Prime Video",
  "prime": "Amazon Prime Video",
  "roblox": "Roblox",
  "minecraft": "Minecraft",
  "apple music": "Apple Music",
  "music": "Apple Music",
  "youtube kids": "YouTube Kids",
  "other": "Other"
};

function translateBundle(input) {
  if (!input) return "Uncategorized App";

  // First try exact bundle ID match
  if (bundleDictionary[input]) return bundleDictionary[input];

  // Then try friendly name match (case insensitive)
  const lower = input.toLowerCase().trim();
  if (friendlyNames[lower]) return friendlyNames[lower];

  // Return the input capitalized as a fallback
  return input.charAt(0).toUpperCase() + input.slice(1);
}

module.exports = { translateBundle, bundleDictionary, friendlyNames };