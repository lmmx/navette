// Simulated file content
const simulatedFileContent = `
// This is the simulated content of background.js
console.log('Background script loaded');

browser.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Add any other background script logic here
`;

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "readFile") {
    // Simulate reading the file by returning the hardcoded content
    sendResponse(simulatedFileContent);
  }
});

console.log('Background script initialized');