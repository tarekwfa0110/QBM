import sys
import json
import re
import os
import logging
import fitz
import pytesseract
from pdf2image import convert_from_path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Paths for both Poppler and Tesseract
POPPLER_PATH = r"C:\Users\Dell\Downloads\poppler-24.08.0\Library\bin"
TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Set Tesseract path
pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

def extract_text_from_pdf(pdf_path):
    """Extract text using both PDF text extraction and OCR"""
    try:
        # Try normal PDF text extraction first
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text("text", sort=True) + "\n"
        
        # If no text found, use OCR
        if not text.strip():
            logger.info("No text found in PDF, trying OCR...")
            images = convert_from_path(pdf_path, poppler_path=POPPLER_PATH)
            text = ""
            for img in images:
                text += pytesseract.image_to_string(img) + "\n"
        
        return text
    except Exception as e:
        logger.error(f"Error extracting text: {e}")
        raise

def process_pdf(pdf_path):
    """Main function to process PDF and extract Q&A"""
    try:
        logger.info(f"Processing PDF: {pdf_path}")
        text = extract_text_from_pdf(pdf_path)
        logger.info(f"Extracted text length: {len(text)}")
        
        # For testing, return a sample question
        questions = [{
            "question": "Sample Question",
            "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
            "answer": "A) Option 1",
            "pdfSource": os.path.basename(pdf_path)
        }]
        
        print(json.dumps(questions))
        return json.dumps(questions)
        
    except Exception as e:
        error = {"error": str(e)}
        print(json.dumps(error))
        return json.dumps(error)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "PDF path required"}))
        sys.exit(1)
    process_pdf(sys.argv[1])