browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "triggerFileUpload") {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.click();

    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileData = e.target.result;
        // Create a custom event to send the file data to the webpage
        const uploadEvent = new CustomEvent('fileUploaded', { 
          detail: { name: file.name, data: fileData }
        });
        document.dispatchEvent(uploadEvent);
      };

      reader.readAsDataURL(file);
    };
  }
});