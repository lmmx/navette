async function readLocalFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    return { success: true, content };
  } catch (error) {
    console.error("Error reading file:", error);
    return { success: false, error: error.toString() };
  }
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "readFile") {
    readLocalFile(request.filePath)
      .then(sendResponse);
    return true;  // Indicates we will send a response asynchronously
  }
});

console.log('Background script initialized');