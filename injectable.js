// Webpage script (to be injected or already present on the target page)
document.addEventListener('fileUploaded', (event) => {
  const { name, data } = event.detail;
  console.log(`File uploaded: ${name}`);
  // Handle the uploaded file data here
  // For example, you could send it to a server or process it client-side
});