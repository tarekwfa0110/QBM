import PyPDF2
import re
import json
import sys

def extract_questions(pdf_path):
    reader = PyPDF2.PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    
    # Split into questions section and answers section
    sections = text.split("Answers")
    questions_text = sections[0]
    answers_text = sections[1] if len(sections) > 1 else ""
    
    # Extract answers first
    answers = {}
    answer_pattern = r"(\d+)\.\s*([a-d])\)"
    answer_matches = re.finditer(answer_pattern, answers_text, re.IGNORECASE)
    for match in answer_matches:
        q_num, ans = match.groups()
        answers[q_num] = ans.lower()
    
    # Extract questions and options
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
            "answer": answers.get(q_num, ""),
            "pdfSource": pdf_path
        })
    
    return json.dumps(questions)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python pdfProcessor.py <pdf_path>")
        sys.exit(1)
    
    try:
        result = extract_questions(sys.argv[1])
        print(result)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
