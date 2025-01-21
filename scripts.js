document.getElementById("uploadForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fileInput = document.getElementById("fileUpload");
  const output = document.getElementById("resultText");

  if (!fileInput.files.length) {
    alert("Please select a file to upload.");
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  output.textContent = "Analyzing your file, please wait...";

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to analyze the file.");

    const result = await response.json();
    output.textContent = result.extractedText || "No text found in the file.";
  } catch (error) {
    output.textContent = "Error analyzing the file. Please try again.";
  }
});
