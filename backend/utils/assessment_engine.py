"""
AI Assessment Engine for NovaPivot Career Platform

STRICT EVALUATION ENGINE - Enforces mastery before progression
- Generates EXACTLY 3 questions per topic
- 70% pass threshold (21/30 points minimum)
- Blocks advancement unless competence demonstrated
- Generates replacement questions on failure focusing on weak areas
"""

import os
import sys
import json
from typing import List, Dict, Any
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path

# Load environment
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Initialize Nova Client
client = OpenAI(
    api_key=os.getenv("NOVA_API_KEY"),
    base_url=os.getenv("NOVA_API_URL")
)

# STRICT ASSESSMENT SYSTEM PROMPT
ASSESSMENT_SYSTEM_PROMPT = """You are an AI Assessment Engine inside a professional career acceleration platform.

Your job is NOT to casually teach.

Your job is to:

Assess mastery.

Enforce progression.

Block advancement unless competence is demonstrated.

You operate as a strict, structured evaluation engine.

INPUT VARIABLES

You will always receive:

TARGET_ROLE: {role}

SKILL_AREA: {skill_area}

TOPIC_NAME: {topic}

STEP 1 — GENERATE EXAM

When a topic is activated:

Generate EXACTLY 3 questions.

Rules:

Questions must be practical and role-relevant.

Difficulty must reflect real interview or real job expectations.

Questions must progressively increase in difficulty.

At least one question must involve scenario-based reasoning.

If technical, at least one must require code or command examples.

For each question include:

Question X:
Type: (Explanation | Code | Scenario | Architecture | Multiple Choice)
Difficulty: (Easy / Medium / Hard)
Question:
Expected Answer Criteria:

Bullet points describing what must be present for a correct answer.

Do NOT provide answers yet.
Do NOT evaluate yet.
Wait for user responses.

STEP 2 — EVALUATION MODE

When the user submits answers:

Evaluate each question individually using this format:

Question X Evaluation:
Result: ✅ Correct OR ❌ Incorrect
Score: X/10
Feedback:

What was correct

What was missing

What was incorrect

If incorrect:
Provide a model answer example.

STEP 3 — PASS LOGIC

After evaluating all 3:

If total score >= 70%:
Status: ✅ PASSED
Action: Unlock next topic.

If total score < 70%:
Status: ❌ FAILED
Action: User must retry.
Generate 2 new replacement questions focusing on weak areas only.

You must strictly enforce this.
Never unlock if score < 70%.

BEHAVIOR RULES

Be professional and realistic.

Do not over-praise.

Do not simplify excessively.

Do not provide answers before user attempts.

Always align questions to TARGET_ROLE.

Always test applied knowledge, not definitions only.
"""


def generate_assessment_questions(
    topic: str,
    skill_area: str,
    target_role: str,
    weak_areas: List[str] = None
) -> Dict[str, Any]:
    """
    Generate EXACTLY 3 exam questions for a topic.
    
    If weak_areas provided, generates 2 replacement questions focusing on those areas.
    
    Returns structured exam with questions, evaluation criteria, and metadata.
    """
    try:
        # Determine if this is a retry (weak areas provided)
        is_retry = weak_areas and len(weak_areas) > 0
        
        # Build prompt context
        context = f"""TARGET_ROLE: {target_role}
SKILL_AREA: {skill_area}
TOPIC_NAME: {topic}"""

        if is_retry:
            context += f"""

RETRY MODE - User previously failed. Weak areas identified:
{chr(10).join(f"- {area}" for area in weak_areas)}

Generate 2 NEW replacement questions focusing ONLY on these weak areas.
These must be different from previous questions but test the same concepts more thoroughly."""

        user_prompt = f"""{context}

Generate EXACTLY {2 if is_retry else 3} exam questions following the strict format.

Format your response as JSON:
{{
    "questions": [
        {{
            "id": "q1",
            "type": "Explanation|Code|Scenario|Architecture|Multiple Choice",
            "difficulty": "Easy|Medium|Hard",
            "question": "Question text here",
            "expected_criteria": [
                "Criterion 1: what must be present",
                "Criterion 2: specific requirement",
                "Criterion 3: another requirement"
            ]
        }}
    ],
    "exam_metadata": {{
        "total_questions": {2 if is_retry else 3},
        "passing_threshold_percent": 70,
        "target_role": "{target_role}",
        "skill_area": "{skill_area}",
        "topic": "{topic}",
        "is_retry": {str(is_retry).lower()}
    }}
}}"""

        response = client.chat.completions.create(
            model=os.getenv("NOVA_MODEL", "amazon.nova-lite-v1:0"),
            messages=[
                {"role": "system", "content": ASSESSMENT_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.4,  # Lower temperature for consistency
            max_tokens=2500,
            timeout=20
        )
        
        content = response.choices[0].message.content
        
        # Parse JSON response
        try:
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            result = json.loads(content.strip())
            
            # Ensure exactly 3 questions (or 2 for retry)
            expected_count = 2 if is_retry else 3
            if len(result.get("questions", [])) != expected_count:
                print(f"Warning: Expected {expected_count} questions, got {len(result.get('questions', []))}", file=sys.stderr)
            
            return result
            
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}", file=sys.stderr)
            return generate_fallback_questions(topic, skill_area, target_role, is_retry)
            
    except Exception as e:
        print(f"Assessment generation error: {e}", file=sys.stderr)
        return generate_fallback_questions(topic, skill_area, target_role, is_retry)


def evaluate_submission(
    questions: List[Dict],
    answers: List[str],
    target_role: str
) -> Dict[str, Any]:
    """
    Evaluate all 3 answers with strict scoring.
    
    Returns individual evaluations and pass/fail status.
    Minimum 70% (21/30) required to pass.
    """
    evaluations = []
    
    for i, (question, answer) in enumerate(zip(questions, answers)):
        evaluation = evaluate_single_answer(question, answer, target_role, i + 1)
        evaluations.append(evaluation)
    
    # Calculate total score
    total_score = sum(e.get("score", 0) for e in evaluations)
    max_possible = len(evaluations) * 10
    percentage = (total_score / max_possible) * 100 if max_possible > 0 else 0
    
    # STRICT PASS LOGIC: 70% minimum
    passed = percentage >= 70
    
    # Identify weak areas for retry
    weak_areas = []
    for i, e in enumerate(evaluations):
        if e.get("score", 0) < 7:  # Score below 7/10 is weak
            weak_areas.append(f"Question {i+1}: {e.get('weak_area_topic', 'Concept understanding')}")
    
    return {
        "evaluations": evaluations,
        "total_score": total_score,
        "max_possible": max_possible,
        "percentage": round(percentage, 1),
        "passed": passed,
        "weak_areas": weak_areas,
        "status": "✅ PASSED - Next topic unlocked" if passed else "❌ FAILED - Must retry weak areas",
        "action": "unlock" if passed else "retry",
        "pass_threshold": 70,
        "strict_enforcement": True
    }


def evaluate_single_answer(
    question: Dict,
    user_answer: str,
    target_role: str,
    question_num: int
) -> Dict[str, Any]:
    """
    Evaluate a single answer with detailed scoring.
    
    Scoring:
    - 9-10: Excellent, complete, accurate
    - 7-8: Good, minor gaps
    - 5-6: Partial, significant gaps
    - 3-4: Poor, major issues
    - 0-2: Incorrect or irrelevant
    """
    try:
        user_prompt = f"""TARGET_ROLE: {target_role}
QUESTION {question_num}:
Type: {question.get('type', 'Explanation')}
Difficulty: {question.get('difficulty', 'Medium')}
Question: {question.get('question', '')}

Expected Answer Criteria:
{chr(10).join(f"- {c}" for c in question.get('expected_criteria', []))}

USER'S ANSWER:
{user_answer}

Evaluate using the strict format from your instructions.
Provide specific score 0-10 with detailed justification.

Format as JSON:
{{
    "question_num": {question_num},
    "result": "✅ Correct" or "❌ Incorrect",
    "score": 0-10,
    "feedback": "Detailed feedback",
    "what_was_correct": "What user got right",
    "what_was_missing": "What was missing",
    "what_was_incorrect": "What was wrong",
    "model_answer": "Example of correct answer if score < 7",
    "weak_area_topic": "Specific topic/concept user struggled with"
}}"""

        response = client.chat.completions.create(
            model=os.getenv("NOVA_MODEL", "amazon.nova-lite-v1:0"),
            messages=[
                {"role": "system", "content": ASSESSMENT_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,  # Low temperature for consistent scoring
            max_tokens=1500,
            timeout=15
        )
        
        content = response.choices[0].message.content
        
        # Parse JSON
        try:
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            result = json.loads(content.strip())
            
            # Validate score is 0-10
            score = result.get("score", 0)
            if not isinstance(score, (int, float)) or score < 0 or score > 10:
                score = max(0, min(10, int(score) if isinstance(score, (int, float)) else 0))
                result["score"] = score
            
            return result
            
        except json.JSONDecodeError:
            return parse_evaluation_text(content, question_num, user_answer)
            
    except Exception as e:
        print(f"Evaluation error for Q{question_num}: {e}", file=sys.stderr)
        return {
            "question_num": question_num,
            "result": "❌ Error",
            "score": 0,
            "feedback": "Technical error during evaluation. Please retry.",
            "what_was_correct": "N/A",
            "what_was_missing": "Unable to evaluate",
            "what_was_incorrect": "System error",
            "model_answer": "",
            "weak_area_topic": "Evaluation failed"
        }


def generate_fallback_questions(
    topic: str,
    skill_area: str,
    target_role: str,
    is_retry: bool = False
) -> Dict[str, Any]:
    """Generate fallback questions when API fails."""
    
    count = 2 if is_retry else 3
    
    base_questions = [
        {
            "id": "q1",
            "type": "Explanation",
            "difficulty": "Easy",
            "question": f"Explain the core principles of {topic} and their practical application in {target_role} work.",
            "expected_criteria": [
                "Clear explanation of core concepts",
                "Practical examples relevant to role",
                "Demonstration of understanding, not just definitions"
            ]
        },
        {
            "id": "q2",
            "type": "Scenario",
            "difficulty": "Medium",
            "question": f"Describe a real-world scenario where you'd apply {topic} in a {target_role} position. Walk through your approach step-by-step.",
            "expected_criteria": [
                "Realistic scenario relevant to role",
                "Clear step-by-step approach",
                "Consideration of edge cases or challenges",
                "Professional reasoning for decisions"
            ]
        },
        {
            "id": "q3",
            "type": "Code" if "Developer" in target_role or "Engineer" in target_role else "Architecture",
            "difficulty": "Hard",
            "question": f"What are common pitfalls when working with {topic}? How would you avoid or resolve them? Provide specific examples.",
            "expected_criteria": [
                "Identification of realistic pitfalls",
                "Practical prevention strategies",
                "Resolution approaches for when issues occur",
                "Code examples if technical, diagrams if architectural"
            ]
        }
    ]
    
    questions = base_questions[:count]
    
    return {
        "questions": questions,
        "exam_metadata": {
            "total_questions": count,
            "passing_threshold_percent": 70,
            "target_role": target_role,
            "skill_area": skill_area,
            "topic": topic,
            "is_retry": is_retry,
            "fallback": True
        }
    }


def parse_evaluation_text(content: str, question_num: int, user_answer: str) -> Dict[str, Any]:
    """Parse evaluation from non-JSON text response."""
    content_lower = content.lower()
    
    # Determine correctness
    if "correct" in content_lower and "incorrect" not in content_lower:
        result = "✅ Correct"
        score = 8
    elif "partial" in content_lower:
        result = "⚠️ Partial"
        score = 5
    elif "incorrect" in content_lower:
        result = "❌ Incorrect"
        score = 3
    else:
        result = "❌ Incorrect"
        score = 0
    
    return {
        "question_num": question_num,
        "result": result,
        "score": score,
        "feedback": content,
        "what_was_correct": "See feedback above",
        "what_was_missing": "See feedback above",
        "what_was_incorrect": "See feedback above",
        "model_answer": "See feedback for example" if score < 7 else "",
        "weak_area_topic": "Review feedback"
    }


# Topic difficulty mapping by role (for reference)
TOPIC_DIFFICULTY_MAP = {
    "Frontend Engineer": {
        "HTML/CSS": "beginner",
        "JavaScript": "intermediate",
        "React": "intermediate",
        "TypeScript": "intermediate",
        "State Management": "advanced",
        "Performance Optimization": "advanced"
    },
    "Backend Engineer": {
        "API Design": "intermediate",
        "Database Management": "intermediate",
        "Microservices": "advanced",
        "Caching Strategies": "advanced",
        "Authentication": "intermediate"
    },
    "Full-Stack Developer": {
        "Frontend Basics": "beginner",
        "Backend Basics": "beginner",
        "Database Design": "intermediate",
        "API Integration": "intermediate",
        "Deployment": "intermediate",
        "System Architecture": "advanced"
    },
    "DevOps Engineer": {
        "CI/CD": "intermediate",
        "Containerization": "intermediate",
        "Infrastructure as Code": "advanced",
        "Monitoring": "intermediate",
        "Cloud Platforms": "advanced"
    },
    "Data Engineer": {
        "SQL": "intermediate",
        "ETL Pipelines": "intermediate",
        "Data Modeling": "advanced",
        "Big Data Tools": "advanced",
        "Data Quality": "intermediate"
    }
}
