import os
import io
import json
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from utils.agent_logic import process_query, extract_skills_with_llm, local_skill_extractor
from utils.assessment_engine import (
    generate_assessment_questions,
    evaluate_single_answer,
    evaluate_submission,
    generate_fallback_questions
)
from utils.resume_parser import parse_resume
from utils.job_scraper import get_jobs
from utils.roadmap_generator import generate_roadmap

# Authentication imports
from models.User import User
from bson import ObjectId
import jwt
from datetime import datetime, timedelta
import secrets

load_dotenv()

def generate_token(user_id):
    payload = {'user_id': user_id, 'exp': datetime.utcnow() + timedelta(hours=24)}
    return jwt.encode(payload, os.getenv('JWT_SECRET'), algorithm='HS256')

app = FastAPI(
    title="NovaPivot AI API",
    description="Backend API for NovaPivot AI Career Transition Platform - powered by FastAPI",
    version="1.0.0"
)

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "http://localhost:3003",
        "http://127.0.0.1:3003",
        "http://localhost:3004",
        "http://127.0.0.1:3004",
        "http://localhost:3005",
        "http://127.0.0.1:3005",
        "http://localhost:3006",
        "http://127.0.0.1:3006",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://192.168.1.9:3000",
        "http://192.168.1.9:3004",
        "http://192.168.1.9:3005",
        "http://192.168.1.9:3006",
        "http://192.168.1.9:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class ChatRequest(BaseModel):
    message: str
    target_role: Optional[str] = None
    skills: List[str] = []


class ChatResponse(BaseModel):
    response: str


class ResumeResponse(BaseModel):
    skills: List[str]
    resume_text: str
    message: str


class JobSearchRequest(BaseModel):
    role: str
    location: str = "Remote"
    skills: List[str] = []


class RoadmapRequest(BaseModel):
    skills: List[str]
    target_role: str


# Endpoints
@app.get("/")
def root():
    return {"message": "NovaPivot API is running", "version": "1.0.0"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """Process a chat message and return AI response"""
    user_profile = {
        "target_role": request.target_role or "Not specified yet",
        "skills": request.skills
    }
    response = process_query(request.message, user_profile)
    return ChatResponse(response=response)


@app.post("/upload-resume", response_model=ResumeResponse)
async def upload_resume(file: UploadFile = File(...), target_role: Optional[str] = Form(None)):
    """Upload and parse resume, extract skills"""
    try:
        # Read file content
        content = await file.read()
        
        # Create file-like object for parser
        file_obj = io.BytesIO(content)
        file_obj.name = file.filename
        file_obj.type = file.content_type
        
        # Parse resume text
        data = parse_resume(file_obj)
        resume_text = data.get("text", "")
        
        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from resume")
        
        # Extract skills
        skills = extract_skills_with_llm(resume_text)
        
        if not skills:
            skills = local_skill_extractor(resume_text)
        
        # Generate detailed feedback message
        target_display = target_role if target_role else "your goal role"
        message = f"Resume analyzed successfully! Found {len(skills)} skills."
        if skills:
            message += f" Top skills: {', '.join(skills[:5])}"
        
        return ResumeResponse(
            skills=list(set(skills)),
            resume_text=resume_text,
            message=message
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/jobs")
def search_jobs(request: JobSearchRequest):
    """Search for jobs based on role and location"""
    try:
        # Pass user skills if available in request
        user_skills = request.skills if hasattr(request, 'skills') else []
        jobs = get_jobs(request.role, request.location, user_skills)
        if isinstance(jobs, list):
            return {"jobs": jobs}
        return {"jobs": jobs.to_dict('records') if hasattr(jobs, 'to_dict') else []}
    except Exception as e:
        # Return mock data on error
        with open("data/mock_jobs.json") as f:
            return {"jobs": json.load(f), "source": "mock"}


class RoadmapRequest(BaseModel):
    skills: List[str]
    target_role: str

class AssessmentRequest(BaseModel):
    week_label: str
    target_role: str

# Endpoints
@app.post("/roadmap/assessment")
def get_assessment(request: AssessmentRequest):
    """Get exam questions for a specific roadmap milestone"""
    from utils.roadmap_generator import generate_week_exam
    questions = generate_week_exam(request.week_label, request.target_role)
    return {"questions": questions}

@app.post("/roadmap")
def get_roadmap(request: RoadmapRequest):
    """Generate career roadmap based on skills and target role"""
    roadmap = generate_roadmap(request.skills, request.target_role)
    return {"roadmap": roadmap, "target_role": request.target_role}


@app.post("/interview-question")
def get_interview_question(
    target_role: str = Form(...), 
    question_type: str = Form("technical"),
    conversation_history: str = Form(""),
    user_skills: str = Form("")
):
    """Generate a mock interview question using Nova API"""
    # Try to generate question using Nova API
    from utils.agent_logic import generate_interview_question
    question = generate_interview_question(target_role, question_type, conversation_history, user_skills)
    
    if question:
        return {"question": question, "type": question_type, "source": "nova"}
    
    # Fallback to static questions if Nova fails
    static_questions = {
        "technical": [
            f"Explain a challenging {target_role} project you worked on.",
            f"What technologies are essential for a {target_role}?",
            f"How do you approach debugging in {target_role} work?",
            f"Describe your experience with system design."
        ],
        "behavioral": [
            "Tell me about a time you had a conflict with a teammate.",
            "How do you handle tight deadlines?",
            "Describe a failure and what you learned from it.",
            "How do you prioritize multiple projects?"
        ]
    }
    
    import random
    question = random.choice(static_questions.get(question_type, static_questions["technical"]))
    return {"question": question, "type": question_type, "source": "fallback"}


@app.post("/evaluate-answer")
def evaluate_answer(question: str = Form(...), answer: str = Form(...), target_role: str = Form(...)):
    """Evaluate a mock interview answer with detailed feedback"""
    answer_length = len(answer.split())
    
    # Analyze answer quality metrics
    has_star_method = any(word in answer.lower() for word in ["situation", "task", "action", "result", "context"])
    has_numbers = any(char.isdigit() for char in answer)
    has_technical_terms = any(word in answer.lower() for word in ["implemented", "developed", "designed", "optimized", "managed", "led", "created", "built"])
    
    # Build detailed feedback
    feedback_parts = []
    
    if answer_length < 20:
        score = 3
        feedback_parts.append("**⚠️ Answer Length:** Your response is quite brief. Interviewers expect detailed answers that showcase your experience.")
    elif answer_length < 50:
        score = 6
        feedback_parts.append("**✅ Answer Length:** Good length, but there's room to add more depth and specific examples.")
    else:
        score = 8
        feedback_parts.append("**✅ Answer Length:** Excellent! You've provided a comprehensive response.")
    
    # Structure feedback
    feedback_parts.append(f"\n**📊 Performance Metrics for {target_role} Role:**")
    
    if has_star_method:
        feedback_parts.append("| ✅ **STAR Method** | Well-structured narrative with clear context and actions |")
        score = min(10, score + 1)
    else:
        feedback_parts.append("| ⚠️ **STAR Method** | Missing structured storytelling. Try: Situation → Task → Action → Result |")
    
    if has_numbers:
        feedback_parts.append("| ✅ **Quantified Impact** | Great job including metrics! Numbers make achievements concrete |")
        score = min(10, score + 1)
    else:
        feedback_parts.append("| ⚠️ **Quantified Impact** | Add metrics (e.g., 'improved performance by 40%', 'led team of 5') |")
    
    if has_technical_terms:
        feedback_parts.append("| ✅ **Action Verbs** | Strong use of technical/action words that show ownership |")
        score = min(10, score + 1)
    else:
        feedback_parts.append("| ⚠️ **Action Verbs** | Use stronger verbs: implemented, optimized, architected, spearheaded |")
    
    # Role-specific recommendations
    feedback_parts.append(f"\n**🎯 Recommendations for {target_role} Interviews:**")
    
    suggestions = [
        "**Structure:** Use STAR method - set the context, explain your specific actions, quantify results",
        "**Technical Depth:** Reference specific technologies, methodologies, or frameworks relevant to the role",
        "**Impact Focus:** Always tie your actions to business outcomes (revenue, efficiency, user experience)",
    ]
    
    if not has_star_method:
        suggestions.insert(0, "**Priority:** Practice structuring answers with STAR method before the real interview")
    if not has_numbers:
        suggestions.insert(1, "**Priority:** Review your past projects and identify 3-5 quantifiable achievements")
    
    feedback = "\n".join(feedback_parts)
    
    return {
        "feedback": feedback,
        "score": score,
        "suggestions": suggestions
    }


import hashlib
from datetime import datetime

# Certificate storage (mock database using JSON)
CERT_DB_PATH = "data/certificates.json"

def ensure_cert_db():
    if not os.path.exists("data"):
        os.makedirs("data")
    if not os.path.exists(CERT_DB_PATH):
        with open(CERT_DB_PATH, "w") as f:
            json.dump({}, f)

def save_cert(cert_id, data):
    ensure_cert_db()
    with open(CERT_DB_PATH, "r") as f:
        db = json.load(f)
    db[cert_id] = data
    with open(CERT_DB_PATH, "w") as f:
        json.dump(db, f)

def get_cert(cert_id):
    ensure_cert_db()
    with open(CERT_DB_PATH, "r") as f:
        db = json.load(f)
    return db.get(cert_id)

class CertResponse(BaseModel):
    id: str
    key: str
    user_name: str
    role: str
    date: str

@app.post("/generate-certificate", response_model=CertResponse)
def create_certificate(user_name: str = Form(...), target_role: str = Form(...)):
    cert_id = str(uuid.uuid4())
    verification_key = hashlib.sha256(f"{cert_id}{user_name}{target_role}".encode()).hexdigest()
    date = datetime.now().strftime("%Y-%m-%d")
    
    cert_data = {
        "id": cert_id,
        "key": verification_key,
        "user_name": user_name,
        "role": target_role,
        "date": date
    }
    
    save_cert(cert_id, cert_data)
    return cert_data

@app.get("/verify-certificate/{cert_id}")
def verify_certificate(cert_id: str):
    cert = get_cert(cert_id)
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return {"valid": True, "certificate": cert}


# ============================================================================
# SKILL ASSESSMENT ENDPOINTS
# ============================================================================

class AssessmentRequest(BaseModel):
    topic: str
    skill_area: str
    target_role: str

class AnswerSubmission(BaseModel):
    question: dict
    user_answer: str
    target_role: str

class BatchEvaluationRequest(BaseModel):
    questions: list
    answers: list
    target_role: str

@app.post("/assessment/generate-questions")
def create_assessment_questions(request: AssessmentRequest):
    """
    Generate 2-3 exam-style questions for a specific topic and role.
    """
    try:
        # Determine experience level based on role and skill area
        experience_level = get_experience_level(request.target_role, request.skill_area)
        
        # Generate questions using Nova API
        result = generate_assessment_questions(
            topic=request.topic,
            skill_area=request.skill_area,
            target_role=request.target_role,
            experience_level=experience_level
        )
        
        return {
            "success": True,
            "data": result,
            "experience_level": experience_level
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate questions: {str(e)}")

@app.post("/assessment/evaluate-answer")
def assess_answer(submission: AnswerSubmission):
    """
    Evaluate a user's answer to an assessment question.
    """
    try:
        result = evaluate_single_answer(
            question=submission.question,
            user_answer=submission.user_answer,
            target_role=submission.target_role,
            question_num=submission.question.get("id", "q1")
        )
        
        return {
            "success": True,
            "evaluation": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to evaluate answer: {str(e)}")

@app.post("/assessment/calculate-mastery")
def calculate_mastery(request: BatchEvaluationRequest):
    """
    Calculate overall mastery status based on all question evaluations.
    """
    try:
        result = evaluate_submission(
            questions=request.questions,
            answers=request.answers,
            target_role=request.target_role
        )
        
        return {
            "success": True,
            "mastery_status": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate mastery: {str(e)}")

# GATED CERTIFICATION API ENDPOINTS
# These endpoints enforce strict progression through the roadmap

class GenerateAssessmentRequest(BaseModel):
    targetRole: str
    roadmapPhase: str
    weekRange: str
    skillArea: str
    topicName: str

class SubmitAssessmentRequest(BaseModel):
    topicId: str
    targetRole: str
    questions: list
    answers: list

class CompleteTopicRequest(BaseModel):
    userId: str
    topicId: str
    score: int
    percentage: float
    passed: bool

# In-memory storage for user progress (use database in production)
user_roadmap_progress = {}

@app.post("/assessment/generate")
def generate_certification_assessment(request: GenerateAssessmentRequest):
    """
    Generate EXACTLY 3 assessment questions for a certification topic.
    Questions are role-specific and progressively increase in difficulty.
    """
    try:
        from utils.assessment_engine import generate_assessment_questions
        
        result = generate_assessment_questions(
            topic=request.topicName,
            skill_area=request.skillArea,
            target_role=request.targetRole
        )
        
        # Ensure exactly 3 questions with proper format
        questions = result.get("questions", [])
        
        # Validate response format
        formatted_questions = []
        for i, q in enumerate(questions[:3], 1):
            formatted_questions.append({
                "id": i,
                "type": q.get("type", "explanation").lower(),
                "difficulty": q.get("difficulty", "medium").lower(),
                "question": q.get("question", ""),
                "expectedCriteria": q.get("expected_criteria", [])
            })
        
        return {
            "questions": formatted_questions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate assessment: {str(e)}")

@app.post("/assessment/evaluate")
def evaluate_certification_assessment(request: SubmitAssessmentRequest):
    """
    Evaluate all 3 answers with strict scoring.
    Returns total score, percentage, and pass/fail status.
    70% minimum required to pass.
    """
    try:
        from utils.assessment_engine import evaluate_submission
        
        result = evaluate_submission(
            questions=request.questions,
            answers=request.answers,
            target_role=request.targetRole
        )
        
        # Format evaluations for frontend
        formatted_evaluations = []
        for i, e in enumerate(result.get("evaluations", [])):
            formatted_evaluations.append({
                "questionId": i + 1,
                "score": e.get("score", 0),
                "result": "correct" if e.get("score", 0) >= 7 else "incorrect",
                "feedback": e.get("feedback", ""),
                "modelAnswer": e.get("model_answer", "") if e.get("score", 0) < 7 else ""
            })
        
        return {
            "totalScore": result.get("total_score", 0),
            "percentage": result.get("percentage", 0),
            "status": "passed" if result.get("passed", False) else "failed",
            "evaluations": formatted_evaluations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to evaluate assessment: {str(e)}")

@app.post("/roadmap/complete-topic")
def complete_certification_topic(request: CompleteTopicRequest):
    """
    Mark topic as complete and unlock next topic.
    Only unlocks if percentage >= 70%.
    """
    try:
        user_id = request.userId
        topic_id = request.topicId
        
        # Initialize user progress if not exists
        if user_id not in user_roadmap_progress:
            user_roadmap_progress[user_id] = {"topics": []}
        
        # Update topic status
        topics = user_roadmap_progress[user_id].get("topics", [])
        
        # Find current topic and mark complete
        current_topic = None
        current_order = None
        for topic in topics:
            if topic.get("id") == topic_id:
                topic["isCompleted"] = True
                topic["score"] = request.percentage
                current_topic = topic
                current_order = topic.get("order")
                break
        
        # Unlock next topic if passed
        next_topic_unlocked = None
        if request.passed and current_order is not None:
            for topic in topics:
                if topic.get("order") == current_order + 1:
                    topic["isLocked"] = False
                    next_topic_unlocked = topic
                    break
        
        user_roadmap_progress[user_id]["topics"] = topics
        
        return {
            "success": True,
            "topicCompleted": topic_id,
            "passed": request.passed,
            "nextTopicUnlocked": next_topic_unlocked
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to complete topic: {str(e)}")

@app.post("/roadmap/store-attempt")
def store_assessment_attempt(request: dict):
    """
    Store a failed attempt for retry tracking.
    """
    try:
        user_id = request.get("userId")
        topic_id = request.get("topicId")
        
        if user_id not in user_roadmap_progress:
            user_roadmap_progress[user_id] = {"topics": []}
        
        topics = user_roadmap_progress[user_id].get("topics", [])
        for topic in topics:
            if topic.get("id") == topic_id:
                topic["attempts"] = topic.get("attempts", 0) + 1
                topic["lastAttemptAt"] = request.get("timestamp")
                break
        
        user_roadmap_progress[user_id]["topics"] = topics
        
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store attempt: {str(e)}")

@app.get("/roadmap/progress")
def get_roadmap_progress(userId: str, targetRole: str):
    """
    Get user's roadmap progress with topic states.
    """
    try:
        if userId not in user_roadmap_progress:
            # Return default structure with first topic unlocked
            return {
                "userId": userId,
                "targetRole": targetRole,
                "topics": [
                    {
                        "id": "topic-1",
                        "title": "Getting Started",
                        "skillArea": "Fundamentals",
                        "phase": "Foundation",
                        "weekRange": "Week 1",
                        "order": 1,
                        "isLocked": False,
                        "isCompleted": False
                    }
                ],
                "overallProgress": 0
            }
        
        return user_roadmap_progress[userId]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get progress: {str(e)}")

@app.post("/roadmap/detailed")
def generate_detailed_roadmap(request: dict):
    """
    Generate a comprehensive, role-specific roadmap with phases, documentation, and realistic steps.
    """
    try:
        from utils.roadmap_content_generator import generate_role_roadmap
        
        target_role = request.get("target_role", "Software Developer")
        current_skills = request.get("skills", [])
        experience_level = request.get("experience_level", "entry")
        timeframe_months = request.get("timeframe_months", 6)
        
        result = generate_role_roadmap(
            target_role=target_role,
            current_skills=current_skills,
            experience_level=experience_level,
            timeframe_months=timeframe_months
        )
        
        return {
            "success": True,
            "roadmap": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate detailed roadmap: {str(e)}")


# Authentication Endpoints

@app.post("/api/auth/register")
def register(request: dict):
    email = request.get('email')
    password = request.get('password')
    name = request.get('name', '')
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
    if User.find_by_email(email):
        raise HTTPException(status_code=409, detail="User already exists")
    user_id = User.create(email, password, name)
    token = generate_token(user_id)
    user = User.find_by_email(email)
    return {"success": True, "token": token, "user": User.to_public_json(user)}

@app.post("/api/auth/login")
def login(request: dict):
    email = request.get('email')
    password = request.get('password')
    user = User.find_by_email(email)
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = generate_token(str(user['_id']))
    return {"success": True, "token": token, "user": User.to_public_json(user)}

@app.post("/api/auth/forgot-password")
def forgot_password(request: dict):
    email = request.get('email')
    user = User.find_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    token = secrets.token_urlsafe(32)
    expiry = datetime.utcnow() + timedelta(hours=1)
    User.update_reset_token(email, token, expiry)
    # Simulate email
    return {"success": True, "message": "Reset email sent"}

@app.post("/api/auth/reset-password")
def reset_password(request: dict):
    token = request.get('token')
    new_password = request.get('new_password')
    user = User.find_by_reset_token(token)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    User.update_password(str(user['_id']), hashed)
    return {"success": True, "message": "Password reset successful"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
