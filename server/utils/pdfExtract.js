const pdfParse = require('pdf-parse');

/**
 * Extracts raw text from a PDF buffer and cleans it up.
 * @param {Buffer} pdfBuffer - The buffer of the PDF file.
 * @returns {Promise<string>} The cleaned plain text from the PDF.
 */
const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const parsedData = await pdfParse(pdfBuffer);
    
    // Perform cleanup to make text prompt-ready
    let cleanedText = parsedData.text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/ +/g, ' ')
      .replace(/\n\s*\n/g, '\n');

    return cleanedText.trim();
  } catch (error) {
    console.error('[pdfExtract] PDF text extraction failed:', error.message);
    throw new Error('Failed to extract text from PDF resume. Please ensure it is not scanned or corrupted.');
  }
};

module.exports = { extractTextFromPDF };
