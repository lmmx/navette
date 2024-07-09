document.getElementById('attachFile').addEventListener('click', () => {
  browser.runtime.sendMessage({ action: "readFile" })
    .then(fileContent => {
      return browser.tabs.query({active: true, currentWindow: true})
        .then(tabs => {
          if (tabs[0]) {
            return browser.tabs.sendMessage(tabs[0].id, { 
              action: "triggerFileUpload",
              fileContent: fileContent
            });
          } else {
            throw new Error("No active tab found");
          }
        });
    })
    .then(response => {
      console.log("File upload triggered successfully", response);
    })
    .catch(error => {
      console.error("Error:", error);
    });
});

console.log("Popup script loaded");