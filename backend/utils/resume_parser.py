from docx import Document
from PyPDF2 import PdfReader

def parse_resume(file):
    """
    Extracts text from PDF or DOCX files.
    """
    text = ""
    try:
        if file.type == "application/pdf":
            reader = PdfReader(file)
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        elif file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            doc = Document(file)
            for para in doc.paragraphs:
                text += para.text + "\n"
        
        # Clean up text
        text = " ".join(text.split())
        return {"text": text}
    except Exception as e:
        return {"text": "", "error": str(e)}
