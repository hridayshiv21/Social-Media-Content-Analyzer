const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

// File processing logic
exports.processFile = async (req, res) => {
  const filePath = path.join(__dirname, '../../public/uploads', req.file.filename);

  try {
    if (req.file.mimetype === 'application/pdf') {
      // PDF text extraction
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      res.json({ success: true, text: pdfData.text });
    } else if (req.file.mimetype.startsWith('image/')) {
      // OCR for image files
      const { data } = await Tesseract.recognize(filePath, 'eng');
      res.json({ success: true, text: data.text });
    } else {
      res.status(400).json({ success: false, message: 'Unsupported file type' });
    }
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ success: false, message: 'Error processing file' });
  } finally {
    // Clean up uploaded file
    fs.unlinkSync(filePath);
  }
};
