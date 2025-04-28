// Initial blocked sites from storage or default
let blockedSites = [];

// DOM elements
const blockedSitesList = document.getElementById("blockedSitesList");
const newSiteInput = document.getElementById("newSite");
const addSiteBtn = document.getElementById("addSiteBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const showNotificationsCheckbox = document.getElementById("showNotifications");
const autoStartTimerCheckbox = document.getElementById("autoStartTimer");

// Load settings from storage
async function loadSettings() {
  try {
    // Get stored settings
    const result = await chrome.storage.sync.get({
      blockedSites: ["youtube.com", "instagram.com", "netflix.com"], // Default sites
      showNotifications: true,
      autoStartTimer: false
    });
    
    blockedSites = result.blockedSites;
    showNotificationsCheckbox.checked = result.showNotifications;
    autoStartTimerCheckbox.checked = result.autoStartTimer;
    
    // Display current blocked sites
    renderBlockedSites();
  } catch (err) {
    console.error("Failed to load settings:", err);
  }
}

// Save settings to storage
async function saveSettings() {
  try {
    await chrome.storage.sync.set({
      blockedSites: blockedSites,
      showNotifications: showNotificationsCheckbox.checked,
      autoStartTimer: autoStartTimerCheckbox.checked
    });
    
    // Show confirmation
    showFeedback("Settings saved successfully!");
    
    // Send message to background script to update rules
    chrome.runtime.sendMessage({ command: "UPDATE_BLOCKED_SITES", sites: blockedSites });
  } catch (err) {
    console.error("Failed to save settings:", err);
    showFeedback("Error saving settings.", true);
  }
}

// Render the list of blocked sites
function renderBlockedSites() {
  blockedSitesList.innerHTML = "";
  
  if (blockedSites.length === 0) {
    blockedSitesList.innerHTML = "<p class='no-sites'>No websites added yet</p>";
    return;
  }
  
  blockedSites.forEach((site, index) => {
    const siteEl = document.createElement("div");
    siteEl.className = "site-item";
    
    const siteText = document.createElement("span");
    siteText.className = "site-text";
    siteText.textContent = site;
    
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn-remove";
    removeBtn.innerHTML = "<i class='fas fa-times'></i>";
    removeBtn.addEventListener("click", () => removeSite(index));
    
    siteEl.appendChild(siteText);
    siteEl.appendChild(removeBtn);
    blockedSitesList.appendChild(siteEl);
  });
}

// Add a new site to the blocked list
function addSite() {
  const newSite = newSiteInput.value.trim().toLowerCase();
  
  // Validate input
  if (!newSite) {
    showFeedback("Please enter a website.", true);
    return;
  }
  
  // Basic URL cleanup - remove http://, https://, www.
  let cleanSite = newSite.replace(/^(https?:\/\/)?(www\.)?/, '');
  
  // Check if site is already in the list
  if (blockedSites.includes(cleanSite)) {
    showFeedback("This website is already in your list.", true);
    return;
  }
  
  // Add to array
  blockedSites.push(cleanSite);
  
  // Update UI
  renderBlockedSites();
  newSiteInput.value = "";
  showFeedback("Website added to block list!");
}

// Remove a site from the blocked list
function removeSite(index) {
  blockedSites.splice(index, 1);
  renderBlockedSites();
  showFeedback("Website removed from block list.");
}

// Show feedback message to user
function showFeedback(message, isError = false) {
  // Check if a feedback element already exists
  let feedbackEl = document.querySelector('.feedback');
  
  if (!feedbackEl) {
    feedbackEl = document.createElement('div');
    feedbackEl.className = 'feedback';
    document.body.appendChild(feedbackEl);
  }
  
  // Set message and style
  feedbackEl.textContent = message;
  feedbackEl.className = isError ? 'feedback error' : 'feedback success';
  
  // Show the feedback
  feedbackEl.classList.add('show');
  
  // Hide after 3 seconds
  setTimeout(() => {
    feedbackEl.classList.remove('show');
  }, 3000);
}

// Event listeners
addSiteBtn.addEventListener("click", addSite);
saveSettingsBtn.addEventListener("click", saveSettings);

// Allow adding by pressing Enter
newSiteInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addSite();
  }
});

// Load settings when page opens
document.addEventListener("DOMContentLoaded", loadSettings);