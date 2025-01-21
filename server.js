const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Multer configuration for file uploads
const upload = multer({ dest: path.join(__dirname, "public/uploads") });

// Route to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const fileType = req.file.mimetype;

  try {
    if (fileType === "application/pdf") {
      // PDF Parsing
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      res.json({ extractedText: pdfData.text });
    } else if (fileType.startsWith("image/")) {
      // OCR for images
      const result = await Tesseract.recognize(filePath, "eng");
      res.json({ extractedText: result.data.text });
    } else {
      res.status(400).json({ error: "Unsupported file type." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error processing file." });
  } finally {
    fs.unlinkSync(filePath); // Clean up uploaded file
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
