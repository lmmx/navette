document.getElementById('attachFile').addEventListener('click', () => {
  const filePath = 'file:///home/louis/dev/navette/background.js';
  
  browser.runtime.sendMessage({ action: "readFile", filePath: filePath })
    .then(response => {
      if (response.success) {
        return browser.tabs.query({active: true, currentWindow: true})
          .then(tabs => {
            if (tabs[0]) {
              return browser.tabs.sendMessage(tabs[0].id, { 
                action: "triggerFileUpload",
                fileName: 'background.js',
                fileContent: response.content
              });
            } else {
              throw new Error("No active tab found");
            }
          });
      } else {
        throw new Error(response.error);
      }
    })
    .then(response => {
      console.log("File upload triggered successfully", response);
    })
    .catch(error => {
      console.error("Error:", error);
    });
});

console.log("Popup script loaded");