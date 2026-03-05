import os
import sys
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

# Load .env from the same directory as this file
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Debug: Check if API key is loaded
if not os.getenv("NOVA_API_KEY"):
    print("WARNING: NOVA_API_KEY not found in environment variables", file=sys.stderr)

# Initialize Nova Client
client = OpenAI(
    api_key=os.getenv("NOVA_API_KEY"),
    base_url=os.getenv("NOVA_API_URL")
)

SYSTEM_PROMPT = """You are CareerNova, a highly experienced career coach and tech recruiter with 15+ years in the industry. Your goal is to provide personalized, realistic, and empathetic career guidance, resume feedback, skill-building advice, and mock interview simulations.

Guidelines:
1. Always respond like a human professional: clear, actionable, and engaging
2. Use examples, analogies, and step-by-step recommendations
3. If a question is vague, ask clarifying questions before answering
4. Tailor your answer to the user's profile and career goal
5. Provide actionable steps, realistic scenarios, and examples
6. If simulating an interview, ask role-specific questions and give constructive feedback
7. Keep tone professional, human-like, and empathetic
8. If a resource or skill is suggested, briefly explain why it's relevant
9. If you are unsure or need more info, ask clarifying questions before answering
10. Be encouraging but realistic about timelines and challenges
11. Use markdown for better formatting

User Profile:
- Target Role: {target_role}
- Current Skills: {skills}
- Experience Level: Based on resume analysis

Remember: You are a trusted career advisor. Your advice should be practical, actionable, and tailored to the individual's specific situation."""


def local_skill_extractor(text):
    """
    Keyword-based skill extraction for use as a fallback if LLM is unavailable.
    """
    common_skills = [
        "Python", "Java", "SQL", "Javascript", "React", "Docker", "AWS", "Machine Learning",
        "Communication", "Leadership", "Project Management", "Data Analysis", "C++", "C#",
        "HTML", "CSS", "Git", "Excel", "Tableau", "Power BI", "Scrum", "Agile", "Statistics",
        "Doctor", "Nursing", "Surgery", "Clinical", "Patient Care", "Healthcare"
    ]
    extracted = [skill for skill in common_skills if skill.lower() in text.lower()]
    return list(set(extracted))

def mock_process_query(query, user_profile):
    """
    Provides a simple intelligent response when the LLM is unavailable.
    """
    target = user_profile.get("target_role") or "your goal"
    skills = user_profile.get("skills", [])
    
    if "hello" in query.lower() or "hi" in query.lower():
        return f"Hello! I'm NovaPivot. I'm currently running in **offline mode** because I couldn't connect to Amazon Nova. However, I can still help analyze your resume and target role locally!"
    
    if target and target != "Not specified yet":
        response = f"Targeting **{target}** is a great move. "
        if skills:
            response += f"Your background in {', '.join(skills[:3])} provides a good foundation. "
        response += "\n\nI recommend checking your **Performance Dashboard** for a gap analysis or looking at your **Personalized Roadmap** to see the next steps!"
        return response
    
    return "I'm currently in offline mode. Tell me what role you're aiming for, or upload your resume so I can help map your path!"

def process_query(query, user_profile):
    """
    Processes the user query using Amazon Nova LLM with a fallback system.
    """
    try:
        # Prepare Context
        target_role = user_profile.get("target_role") or "Not specified yet"
        current_skills = ", ".join(user_profile.get("skills", [])) or "No skills extracted yet"
        resume_text = user_profile.get("resume_text", "")
        
        # Build enhanced system prompt with full context
        prompt = SYSTEM_PROMPT.replace("{target_role}", target_role).replace("{skills}", current_skills)
        
        # Add resume context if available
        if resume_text:
            prompt += f"\n\nResume Summary:\n{resume_text[:500]}..."

        # Chat Completion with Nova API
        response = client.chat.completions.create(
            model=os.getenv("NOVA_MODEL", "amazon.nova-lite-v1:0"),
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": query}
            ],
            temperature=0.7,
            max_tokens=1000,
            timeout=15
        )
        
        content = response.choices[0].message.content
        if not content or content.strip() == "":
            raise ValueError("Empty response from Nova API")
            
        return content

    except Exception as e:
        error_msg = str(e)
        print(f"Nova API Error: {error_msg}", file=sys.stderr)
        if "403" in error_msg or "401" in error_msg:
            return mock_process_query(query, user_profile) + "\n\n[Note: Nova API authentication failed. Running in offline mode.]"
        return f"Error: {error_msg}\n\nRunning in basic assistance mode."

def extract_skills_with_llm(text):
    """
    Uses the LLM to pull out structured skill names, with keyword fallback.
    """
    try:
        print(f"Extracting skills using Nova API...", file=sys.stderr)
        response = client.chat.completions.create(
            model=os.getenv("NOVA_MODEL", "nova-2-lite-v1"),
            messages=[
                {"role": "system", "content": "You are a professional recruiting assistant. Extract a list of up to 15 technical and soft skills from the following resume text. Output ONLY a comma-separated list of skills."},
                {"role": "user", "content": text}
            ],
            temperature=0.0,
            timeout=10
        )
        skills_text = response.choices[0].message.content
        skills = [s.strip() for s in skills_text.split(",") if s.strip()]
        print(f"Successfully extracted {len(skills)} skills via Nova API", file=sys.stderr)
        return skills
    except Exception as e:
        print(f"Nova skill extraction failed: {e}. Using local fallback.", file=sys.stderr)
        # Fallback to local extraction if API fails
        return local_skill_extractor(text)


def generate_interview_question(target_role: str, question_type: str = "technical", conversation_history: str = "", user_skills: str = ""):
    """
    Generates a contextual interview question using Nova API.
    Falls back to static questions if API fails.
    """
    try:
        print(f"Generating {question_type} interview question for {target_role} using Nova API...", file=sys.stderr)
        
        # Build context from user skills and conversation
        context = ""
        if user_skills:
            context += f"\n\nCandidate has these skills: {user_skills}"
        if conversation_history:
            context += f"\n\nPrevious conversation:\n{conversation_history}"
        
        prompt = f"""You are an experienced technical interviewer conducting a mock interview for a {target_role} position.{context}
        
Generate ONE {question_type} interview question that is:
- Relevant to the {target_role} role
- Challenging but fair
- Open-ended to allow detailed response
- Professional and realistic for actual interviews
- Builds upon the conversation flow naturally
- Takes into account the candidate's background when relevant

For technical questions: Focus on specific technologies, problem-solving approaches, or system design relevant to {target_role}.
For behavioral questions: Focus on soft skills, teamwork, leadership, or professional situations.

If there's conversation history, ask a follow-up question that flows naturally. If it's the first question, start with an appropriate opening question.

Output ONLY the question text, no additional commentary."""

        response = client.chat.completions.create(
            model=os.getenv("NOVA_MODEL", "nova-2-lite-v1"),
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": f"Generate a {question_type} interview question for a {target_role} position."}
            ],
            temperature=0.8,
            timeout=10
        )
        
        question = response.choices[0].message.content.strip()
        print(f"Successfully generated interview question via Nova API", file=sys.stderr)
        return question
        
    except Exception as e:
        print(f"Nova interview question generation failed: {e}. Using fallback.", file=sys.stderr)
        # Return None to trigger fallback in api.py
        return None
