const express = require('express');
const multer = require('multer');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs/promises');

const app = express();
const port = 5000;

app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/process-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const existingPdfBytes = req.file.buffer;
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=processed.pdf');
    res.send(pdfBytes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process PDF.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
