let port = null;

function connectNative() {
  console.log("Attempting to connect to native application");
  port = browser.runtime.connectNative("claude_navette_native");
  
  port.onMessage.addListener((response) => {
    console.log("Received message from native application:", response);
  });

  port.onDisconnect.addListener((p) => {
    if (p.error) {
      console.error(`Disconnected from native application due to an error: ${p.error.message}`);
    } else {
      console.log("Disconnected from native application");
    }
    port = null;
  });
}

connectNative();

function readLocalFile(filePath) {
  return new Promise((resolve, reject) => {
    if (!port) {
      console.error("Native application not connected");
      reject(new Error("Native application not connected"));
      return;
    }

    console.log(`Sending request to read file: ${filePath}`);
    port.postMessage({ action: "read_file", path: filePath });
    
    port.onMessage.addListener(function listener(response) {
      port.onMessage.removeListener(listener);
      console.log("Received response from native application:", response);
      if (response.success) {
        resolve(response);
      } else {
        reject(new Error(response.error));
      }
    });
  });
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message in background script:", request);
  if (request.action === "readFile") {
    readLocalFile(request.filePath)
      .then(sendResponse)
      .catch(error => {
        console.error("Error reading file:", error);
        sendResponse({ success: false, error: error.toString() });
      });
    return true;  // Indicates we will send a response asynchronously
  }
});

console.log('Background script initialized');