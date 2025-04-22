let sessionId = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startBtn").addEventListener("click", async () => {
    const res = await fetch("http://localhost:5000/focus/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    sessionId = data._id;

    chrome.runtime.sendMessage({ command: "START_FOCUS" });
    console.log("Focus Started:", sessionId);
  });

  document.getElementById("stopBtn").addEventListener("click", async () => {
    if (!sessionId) {
      alert("No focus session found.");
      return;
    }

    await fetch(`http://localhost:5000/focus/stop/${sessionId}`, {
      method: "POST"
    });

    chrome.runtime.sendMessage({ command: "STOP_FOCUS" });
    console.log("Focus Stopped and Session Logged");
    sessionId = null;
  });
});
