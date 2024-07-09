browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "triggerFileUpload") {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.click();

    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      // Here you would implement the logic to attach the file to Claude's interface
      console.log('File selected:', file.name);
      // You'll need to implement the actual file attachment logic based on Claude's API
    };
  }
});
