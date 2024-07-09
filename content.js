browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "triggerFileUpload") {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.click();

    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      console.log('File selected:', file.name);
      
      // Implement file attachment logic here
      // This is a placeholder and needs to be replaced with actual Claude-specific logic
      const claudeInterface = document.querySelector('#claude-interface'); // Replace with actual selector
      if (claudeInterface) {
        const fileAttachment = document.createElement('div');
        fileAttachment.textContent = `Attached: ${file.name}`;
        claudeInterface.appendChild(fileAttachment);
        
        // You might need to trigger an event or call a function in Claude's interface
        // to properly handle the file attachment
        // For example: claudeInterface.dispatchEvent(new CustomEvent('fileAttached', { detail: file }));
      } else {
        console.error('Claude interface not found');
      }
    };
  }
});