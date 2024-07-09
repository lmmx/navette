document.getElementById('attachFile').addEventListener('click', () => {
  browser.tabs.query({active: true, currentWindow: true})
    .then(tabs => {
      if (tabs[0]) {
        return browser.tabs.sendMessage(tabs[0].id, { action: "triggerFileUpload" });
      } else {
        throw new Error("No active tab found");
      }
    })
    .then(response => {
      console.log("Message sent successfully", response);
    })
    .catch(error => {
      console.error("Error sending message:", error);
      if (error.message.includes("Receiving end does not exist")) {
        console.log("Content script might not be injected. Check if you're on the correct page.");
      }
    });
});

console.log("Popup script loaded");