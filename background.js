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
      console.log("Native application disconnected");
    }
    port = null;
  });

  // Send a test message to verify the connection
  port.postMessage({action: "hello"});
  console.log("Test message sent to native application");
}

connectNative();

function readLocalFile(filePath) {
  return new Promise((resolve, reject) => {
    if (!port) {
      connectNative();  // Attempt to reconnect if port is null
    }

    if (!port) {
      console.error("Failed to connect to native application");
      reject(new Error("Failed to connect to native application"));
      return;
    }

    console.log(`Sending request to read file: ${filePath}`);
    port.postMessage({ action: "read_file", path: filePath });
    
    function messageListener(response) {
      console.log("Received response from native application:", response);
      port.onMessage.removeListener(messageListener);
      if (response.success) {
        resolve(response);
      } else {
        reject(new Error(response.error));
      }
    }

    port.onMessage.addListener(messageListener);
  });
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message in background script:", request);
  if (request.action === "readFile") {
    readLocalFile(request.filePath)
      .then(response => {
        console.log("File read successfully:", response);
        sendResponse(response);
      })
      .catch(error => {
        console.error("Error reading file:", error);
        sendResponse({ success: false, error: error.toString() });
      });
    return true;  // Indicates we will send a response asynchronously
  }
});

console.log('Background script initialized');