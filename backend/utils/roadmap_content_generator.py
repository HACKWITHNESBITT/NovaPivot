"""
Role-Specific Roadmap Content Generator

Generates realistic career roadmaps with phases, steps, and documentation
for any target role using Nova API.
"""

import os
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

# System prompt for roadmap generation
ROADMAP_GENERATOR_PROMPT = """You are an expert career coach and technical educator specializing in creating realistic, actionable career transition roadmaps.

Your task is to generate a comprehensive, phase-based roadmap for a specific target role.

For each roadmap, you MUST provide:

1. ROLE OVERVIEW
- Brief description of the role
- Key responsibilities
- Industry context and demand

2. REALISTIC PHASES (4-6 phases)
Each phase must include:
- Phase name (e.g., "Foundation", "Core Skills", "Advanced Concepts", "Professional Portfolio")
- Duration (e.g., "Weeks 1-4", "Months 2-3")
- Clear objectives
- Specific, actionable steps
- Resources to use
- Deliverables/outcomes

3. SKILL PROGRESSION
- Technical skills to learn in order
- Soft skills needed
- Tools and technologies
- Certification recommendations

4. PROJECT IDEAS
- Beginner projects
- Intermediate projects  
- Advanced/portfolio projects

5. MILESTONES
- Key achievements that mark progress
- Checkpoints for self-assessment

6. RESOURCES
- Documentation links
- Courses
- Books
- Communities

Rules:
- Be specific and realistic
- Order skills from foundational to advanced
- Include practical project ideas
- Mention real tools and technologies actually used in the industry
- Tailor difficulty to the target role level (entry/junior/mid/senior)
- Always provide actionable steps, not vague advice

Output format: Valid JSON only
"""


def generate_role_roadmap(
    target_role: str,
    current_skills: List[str] = None,
    experience_level: str = "entry",  # entry, junior, mid, senior
    timeframe_months: int = 6
) -> Dict[str, Any]:
    """
    Generate a comprehensive, role-specific roadmap with phases and documentation.
    
    Args:
        target_role: The role the user wants to achieve (e.g., "Frontend Developer")
        current_skills: List of skills the user already has
        experience_level: Target experience level for the role
        timeframe_months: How many months to complete the roadmap
    
    Returns:
        Dictionary containing the full roadmap structure
    """
    try:
        current_skills_str = ", ".join(current_skills) if current_skills else "None"
        
        prompt = f"""TARGET_ROLE: {target_role}
CURRENT_SKILLS: {current_skills_str}
TARGET_EXPERIENCE_LEVEL: {experience_level}
TIMEFRAME: {timeframe_months} months

Generate a complete career transition roadmap in this exact JSON format:

{{
    "role_overview": {{
        "title": "{target_role}",
        "description": "Brief role description",
        "responsibilities": ["responsibility 1", "responsibility 2"],
        "industry_demand": "high/medium/low",
        "average_salary_range": "$X - $Y"
    }},
    "phases": [
        {{
            "id": "phase-1",
            "name": "Phase Name",
            "order": 1,
            "duration": "Weeks 1-4",
            "objective": "What learner will achieve",
            "skills": ["skill 1", "skill 2"],
            "steps": [
                {{
                    "id": "step-1",
                    "title": "Step title",
                    "description": "Detailed action",
                    "deliverable": "What to produce",
                    "resources": ["resource 1", "resource 2"],
                    "time_estimate": "X hours"
                }}
            ],
            "checkpoint": "How to verify completion",
            "deliverables": ["deliverable 1", "deliverable 2"]
        }}
    ],
    "skill_progression": {{
        "technical": [
            {{
                "skill": "skill name",
                "level": "beginner/intermediate/advanced",
                "phase": 1,
                "resources": ["resource links"],
                "projects": ["project idea 1"]
            }}
        ],
        "soft_skills": ["communication", "teamwork", etc],
        "tools": ["tool 1", "tool 2"],
        "certifications": ["cert name if applicable"]
    }},
    "projects": {{
        "beginner": [
            {{
                "name": "Project name",
                "description": "What to build",
                "skills_practiced": ["skill 1", "skill 2"],
                "time_estimate": "X hours"
            }}
        ],
        "intermediate": [...],
        "advanced": [...]
    }},
    "milestones": [
        {{
            "name": "Milestone name",
            "description": "What this represents",
            "phase": 1,
            "criteria": ["criterion 1", "criterion 2"]
        }}
    ],
    "resources": {{
        "documentation": ["link 1", "link 2"],
        "courses": ["course 1", "course 2"],
        "books": ["book 1", "book 2"],
        "communities": ["community 1", "community 2"],
        "practice_platforms": ["platform 1", "platform 2"]
    }},
    "timeline": {{
        "total_duration": "{timeframe_months} months",
        "weekly_commitment": "15-20 hours",
        "milestones_count": 4
    }}
}}

Generate realistic content for {target_role}. Be specific about technologies, tools, and deliverables actually used in the industry."""

        response = client.chat.completions.create(
            model=os.getenv("NOVA_MODEL", "amazon.nova-lite-v1:0"),
            messages=[
                {"role": "system", "content": ROADMAP_GENERATOR_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=4000,
            timeout=30
        )
        
        content = response.choices[0].message.content
        
        # Parse JSON
        try:
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            result = json.loads(content.strip())
            return result
            
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}")
            return generate_fallback_roadmap(target_role, timeframe_months)
            
    except Exception as e:
        print(f"Roadmap generation error: {e}")
        return generate_fallback_roadmap(target_role, timeframe_months)


def generate_phase_assessment(
    phase_name: str,
    target_role: str,
    phase_skills: List[str]
) -> Dict[str, Any]:
    """
    Generate assessment questions for a specific phase of the roadmap.
    """
    try:
        from utils.assessment_engine import generate_assessment_questions
        
        # Use the topic from the phase name
        topic = f"{phase_name} - {target_role}"
        
        result = generate_assessment_questions(
            topic=topic,
            skill_area=", ".join(phase_skills),
            target_role=target_role
        )
        
        return result
        
    except Exception as e:
        print(f"Phase assessment error: {e}")
        return {
            "questions": [
                {
                    "id": "q1",
                    "type": "explanation",
                    "difficulty": "medium",
                    "question": f"Explain the core concepts covered in {phase_name} for {target_role}",
                    "expected_criteria": ["Clear explanation", "Practical examples", "Understanding demonstrated"]
                }
            ]
        }


def generate_fallback_roadmap(target_role: str, timeframe_months: int = 6) -> Dict[str, Any]:
    """Generate a fallback roadmap when API fails."""
    
    # Role-specific fallback content
    role_templates = {
        "frontend": {
            "phases": [
                {
                    "id": "phase-1",
                    "name": "Foundation",
                    "order": 1,
                    "duration": "Weeks 1-4",
                    "objective": "Master HTML, CSS, and JavaScript fundamentals",
                    "skills": ["HTML5", "CSS3", "JavaScript ES6+"],
                    "steps": [
                        {
                            "id": "step-1",
                            "title": "Learn HTML Structure",
                            "description": "Master semantic HTML, forms, accessibility",
                            "deliverable": "Build a responsive landing page",
                            "resources": ["MDN HTML Guide", "HTML5 Specification"],
                            "time_estimate": "20 hours"
                        },
                        {
                            "id": "step-2",
                            "title": "CSS Styling & Layout",
                            "description": "Learn Flexbox, Grid, responsive design",
                            "deliverable": "Style the landing page with modern CSS",
                            "resources": ["CSS Tricks Flexbox Guide", "CSS Grid Garden"],
                            "time_estimate": "25 hours"
                        }
                    ],
                    "checkpoint": "Can build a responsive, accessible webpage from scratch",
                    "deliverables": ["Responsive landing page", "CSS animations demo"]
                },
                {
                    "id": "phase-2",
                    "name": "JavaScript Core",
                    "order": 2,
                    "duration": "Weeks 5-8",
                    "objective": "Become proficient in modern JavaScript",
                    "skills": ["JavaScript", "DOM Manipulation", "Async Programming"],
                    "steps": [
                        {
                            "id": "step-1",
                            "title": "JS Fundamentals",
                            "description": "Variables, functions, objects, arrays, ES6+ features",
                            "deliverable": "Interactive web application",
                            "resources": ["JavaScript.info", "Eloquent JavaScript"],
                            "time_estimate": "30 hours"
                        }
                    ],
                    "checkpoint": "Can build interactive web apps with vanilla JS",
                    "deliverables": ["Todo app", "Weather app using API"]
                },
                {
                    "id": "phase-3",
                    "name": "Framework Mastery",
                    "order": 3,
                    "duration": "Weeks 9-12",
                    "objective": "Learn React and modern frontend tools",
                    "skills": ["React", "State Management", "Build Tools"],
                    "steps": [
                        {
                            "id": "step-1",
                            "title": "React Fundamentals",
                            "description": "Components, props, state, hooks, JSX",
                            "deliverable": "React portfolio website",
                            "resources": ["React Docs", "Epic React Course"],
                            "time_estimate": "35 hours"
                        }
                    ],
                    "checkpoint": "Can build complete React applications",
                    "deliverables": ["E-commerce UI", "Dashboard with data visualization"]
                }
            ],
            "projects": {
                "beginner": [
                    {
                        "name": "Personal Portfolio",
                        "description": "Build a responsive portfolio site",
                        "skills_practiced": ["HTML", "CSS", "Responsive Design"],
                        "time_estimate": "10 hours"
                    }
                ],
                "intermediate": [
                    {
                        "name": "Task Manager App",
                        "description": "Full CRUD app with React",
                        "skills_practiced": ["React", "State Management", "LocalStorage"],
                        "time_estimate": "20 hours"
                    }
                ],
                "advanced": [
                    {
                        "name": "E-commerce Platform",
                        "description": "Full-featured shopping site",
                        "skills_practiced": ["React", "API Integration", "Authentication"],
                        "time_estimate": "40 hours"
                    }
                ]
            },
            "resources": {
                "documentation": ["MDN Web Docs", "React Documentation", "Can I Use"],
                "courses": ["freeCodeCamp", "Frontend Masters", "Egghead.io"],
                "books": ["Eloquent JavaScript", "You Don't Know JS"],
                "communities": ["Dev.to", "Hashnode", "Frontend Focus"],
                "practice_platforms": ["CodePen", "Frontend Mentor", "CSS Battle"]
            }
        }
    }
    
    # Default to frontend template
    template = role_templates.get("frontend", {})
    
    return {
        "role_overview": {
            "title": target_role,
            "description": f"A {target_role} builds user-facing web applications",
            "responsibilities": ["Build UI components", "Implement designs", "Optimize performance"],
            "industry_demand": "high",
            "average_salary_range": "$70,000 - $120,000"
        },
        "phases": template.get("phases", []),
        "skill_progression": {
            "technical": [
                {"skill": "HTML/CSS", "level": "beginner", "phase": 1, "resources": ["MDN"]},
                {"skill": "JavaScript", "level": "intermediate", "phase": 2, "resources": ["JavaScript.info"]},
                {"skill": "React", "level": "advanced", "phase": 3, "resources": ["React Docs"]}
            ],
            "soft_skills": ["Communication", "Problem-solving", "Attention to detail"],
            "tools": ["VS Code", "Chrome DevTools", "Git", "npm"],
            "certifications": ["Meta Frontend Developer Certificate"]
        },
        "projects": template.get("projects", {}),
        "milestones": [
            {"name": "First Responsive Page", "description": "Built without frameworks", "phase": 1},
            {"name": "Interactive App", "description": "JavaScript functionality", "phase": 2},
            {"name": "React Application", "description": "Component-based architecture", "phase": 3}
        ],
        "resources": template.get("resources", {}),
        "timeline": {
            "total_duration": f"{timeframe_months} months",
            "weekly_commitment": "15-20 hours",
            "milestones_count": 3
        }
    }


# Role-specific templates for fallback
ROLE_TEMPLATES = {
    "frontend developer": "frontend",
    "frontend engineer": "frontend",
    "react developer": "frontend",
    "ui developer": "frontend",
    "backend developer": "backend",
    "full stack developer": "fullstack",
    "devops engineer": "devops",
    "data engineer": "data",
    "mobile developer": "mobile"
}
