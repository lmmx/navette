console.log('Claude Navette content script loaded');

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);
  if (request.action === "triggerFileUpload") {
    console.log('Triggering file upload');
    
    // Find the hidden file input
    const fileInput = document.querySelector('input[data-testid="project-doc-upload"]');
    if (!fileInput) {
      console.error('File input not found');
      return;
    }

    // Create a new File object
    const file = new File(['Hello, this is a test file'], 'test.txt', { type: 'text/plain' });

    // Create a DataTransfer object and add the file
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    // Set the file input's files
    fileInput.files = dataTransfer.files;

    // Dispatch a change event on the file input
    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);

    console.log('File upload triggered');
  }
});

console.log('Claude Navette content script setup complete');