const blockedSites = ["youtube.com", "instagram.com", "netflix.com"];
let focusMode = false;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === "START_FOCUS") {
    focusMode = true;
    sendResponse({ status: "Focus mode ON" });
  } else if (msg.command === "STOP_FOCUS") {
    focusMode = false;
    sendResponse({ status: "Focus mode OFF" });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1, 2, 3],
    addRules: [
      {
        id: 1,
        priority: 1,
        action: { type: "block" },
        condition: {
          urlFilter: "||youtube.com",
          resourceTypes: ["main_frame"]
        }
      },
      {
        id: 2,
        priority: 1,
        action: { type: "block" },
        condition: {
          urlFilter: "||instagram.com",
          resourceTypes: ["main_frame"]
        }
      },
      {
        id: 3,
        priority: 1,
        action: { type: "block" },
        condition: {
          urlFilter: "||netflix.com",
          resourceTypes: ["main_frame"]
        }
      }
    ]
  });
});

