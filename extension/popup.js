let sessionId = null;
const dot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

// Check if there's an active session on load
async function checkActiveSession() {
  try {
    const res = await fetch("http://localhost:5000/focus/last");
    const data = await res.json();
    
    if (data && data.endTime === null) {
      // Active session found
      sessionId = data._id;
      dot.classList.remove("red");
      dot.classList.add("green");
      statusText.textContent = "ON";
    }
  } catch (err) {
    console.error("Failed to check active sessions:", err);
  }
}

document.getElementById("startBtn").addEventListener("click", async () => {
  try {
    // Animated feedback
    dot.classList.add("pulsing");
    
    // Backend session start
    const res = await fetch("http://localhost:5000/focus/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    
    if (!res.ok) {
      throw new Error("Failed to start focus session");
    }
    
    const data = await res.json();
    sessionId = data._id;

    // Update UI status
    dot.classList.remove("pulsing");
    dot.classList.remove("red");
    dot.classList.add("green");
    statusText.textContent = "ON";

    // Notify background script
    chrome.runtime.sendMessage({ command: "START_FOCUS" });
  } catch (err) {
    dot.classList.remove("pulsing");
    console.error("Error starting focus:", err);
    alert("Failed to start focus session. Please try again.");
  }
});

document.getElementById("stopBtn").addEventListener("click", async () => {
  try {
    // Check if we have an active session
    if (!sessionId) {
      const activeCheck = await fetch("http://localhost:5000/focus/last");
      const activeData = await activeCheck.json();
      
      if (activeData && activeData.endTime === null) {
        sessionId = activeData._id;
      } else {
        // No active session to stop
        return;
      }
    }

    // Animated feedback
    dot.classList.add("pulsing");
    
    // Stop the session
    const res = await fetch(`http://localhost:5000/focus/stop/${sessionId}`, {
      method: "POST"
    });
    
    if (!res.ok) {
      throw new Error("Failed to stop focus session");
    }

    // Update UI status
    dot.classList.remove("pulsing");
    dot.classList.remove("green");
    dot.classList.add("red");
    statusText.textContent = "OFF";

    // Notify background script
    chrome.runtime.sendMessage({ command: "STOP_FOCUS" });
    sessionId = null;
  } catch (err) {
    dot.classList.remove("pulsing");
    console.error("Error stopping focus:", err);
    alert("Failed to stop focus session. Please try again.");
  }
});

// Run on popup open
checkActiveSession();

