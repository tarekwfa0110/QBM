import PyPDF2
import re
import json
import sys
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file."""
    try:
        reader = PyPDF2.PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        logging.error(f"Error reading PDF: {e}")
        raise

def extract_answers(answers_text):
    """Extract answers from the answers section."""
    answers = {}
    answer_pattern = r"(\d+)\.\s*([a-d])\)"
    answer_matches = re.finditer(answer_pattern, answers_text, re.IGNORECASE)
    for match in answer_matches:
        q_num, ans = match.groups()
        answers[q_num] = ans.lower()
    return answers

def extract_questions(questions_text):
    """Extract questions and options from the questions section."""
    questions = []
    question_pattern = r"Question\s*(\d+)[.\s]*(.*?)(?=Question\s*\d+|$)"
    q_matches = re.finditer(question_pattern, questions_text, re.MULTILINE | re.DOTALL)
    
    for match in q_matches:
        q_num, q_text = match.groups()
        q_parts = q_text.strip().split('\n')
        
        # Extract options
        options = []
        for line in q_parts[1:]:
            if line.strip().startswith(('a)', 'b)', 'c)', 'd)')):
                options.append(line.strip())
        
        questions.append({
            "question": q_parts[0].strip(),
            "options": options,
            "question_number": q_num  # Add question number for reference
        })
    
    return questions

def process_pdf(pdf_path):
    """Process the PDF and extract questions and answers."""
    try:
        text = extract_text_from_pdf(pdf_path)
        
        # Split into questions and answers sections
        sections = text.split("Answers")
        questions_text = sections[0]
        answers_text = sections[1] if len(sections) > 1 else ""
        
        # Extract answers and questions
        answers = extract_answers(answers_text)
        questions = extract_questions(questions_text)
        
        # Combine questions with their answers
        for q in questions:
            q["answer"] = answers.get(q["question_number"], "")
            q["pdfSource"] = pdf_path
        
        return json.dumps(questions, indent=2)
    except Exception as e:
        logging.error(f"Error processing PDF: {e}")
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python pdfProcessor.py <pdf_path>")
        sys.exit(1)
    
    result = process_pdf(sys.argv[1])
    print(result)