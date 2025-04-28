// Default blocked sites (will be loaded from storage)
let blockedSites = ["youtube.com", "instagram.com", "netflix.com"];
let focusMode = false;
let showNotifications = true;

// Load settings from storage
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get({
      blockedSites: ["youtube.com", "instagram.com", "netflix.com"],
      showNotifications: true,
      autoStartTimer: false
    });
    
    blockedSites = result.blockedSites;
    showNotifications = result.showNotifications;
    
    // If autoStart is enabled, start focus mode on browser startup
    if (result.autoStartTimer) {
      startFocusMode();
    }
    
    console.log("Settings loaded, blocked sites:", blockedSites);
  } catch (err) {
    console.error("Failed to load settings:", err);
  }
}

// Update blocking rules based on user's site list
function updateBlockRules(shouldBlock) {
  // First remove any existing rules
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: blockedSites.map((_, index) => index + 1)
  }).then(() => {
    // If we should block sites, add new rules
    if (shouldBlock) {
      const rules = blockedSites.map((site, index) => {
        return {
          id: index + 1,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: `||${site}`,
            resourceTypes: ["main_frame"]
          }
        };
      });
      
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules
      }).then(() => {
        console.log("Blocking rules updated for:", blockedSites);
        
        // Show notification if enabled
        if (showNotifications) {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: "TaskLokr Focus Mode Active",
            message: `${blockedSites.length} distracting sites are now blocked. Stay focused!`
          });
        }
      });
    }
  });
}

// Start focus mode
function startFocusMode() {
  focusMode = true;
  updateBlockRules(true);
  console.log("Focus mode activated");
  return { status: "Focus mode ON" };
}

// Stop focus mode
function stopFocusMode() {
  focusMode = false;
  updateBlockRules(false);
  console.log("Focus mode deactivated");
  return { status: "Focus mode OFF" };
}

// Handle messages from popup and settings pages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === "START_FOCUS") {
    sendResponse(startFocusMode());
  } 
  else if (msg.command === "STOP_FOCUS") {
    sendResponse(stopFocusMode());
  }
  else if (msg.command === "UPDATE_BLOCKED_SITES") {
    blockedSites = msg.sites;
    console.log("Updated blocked sites list:", blockedSites);
    
    // If focus mode is active, update the rules immediately
    if (focusMode) {
      updateBlockRules(true);
    }
    
    sendResponse({ status: "Blocked sites updated" });
  }
  return true; // Keep the message channel open for async response
});

// Check for active session on startup
async function checkActiveSession() {
  try {
    const res = await fetch("http://localhost:5000/focus/last");
    const data = await res.json();
    
    if (data && data.endTime === null) {
      // Active session found
      startFocusMode();
    }
  } catch (err) {
    console.error("Failed to check active sessions:", err);
  }
}

// Initialize on extension startup
chrome.runtime.onStartup.addListener(() => {
  loadSettings().then(checkActiveSession);
});

// Initialize on extension installation
chrome.runtime.onInstalled.addListener(() => {
  loadSettings();
});

