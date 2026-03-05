import json
import os
import random
import urllib.parse

# Profession categories with their specific skills and requirements
PROFESSIONS = {
    # Tech/IT
    "software developer": {
        "companies": ["Google", "Microsoft", "Amazon", "Meta", "Stripe", "Shopify", "Spotify", "GitLab", "Canva", "Atlassian", "Safaricom", "Andela", "Turing", "Remote.com"],
        "skills": ["Python", "JavaScript", "React", "Node.js", "SQL", "AWS", "Docker", "Git", "TypeScript", "MongoDB"],
        "remote_friendly": True,
        "job_boards": ["weworkremotely", "remotive", "remoteok", "wellfound", "himalayas", "linkedin", "indeed"]
    },
    "web developer": {
        "companies": ["Digital Solutions", "Vercel", "Netlify", "Automattic", "Wix", "Squarespace", "PixelPerfect", "WebStudio", "Sednai", "Craft Silicon"],
        "skills": ["HTML", "CSS", "JavaScript", "React", "WordPress", "PHP", "Figma", "UI/UX"],
        "remote_friendly": True,
        "job_boards": ["weworkremotely", "remoteok", "wellfound", "linkedin", "indeed", "upwork"]
    },
    "data analyst": {
        "companies": ["DataDynamics", "Snowflake", "Databricks", "Tableau", "KPMG", "PwC", "Deloitte", "EY", "McKinsey"],
        "skills": ["SQL", "Python", "R", "Tableau", "Power BI", "Excel", "Statistics", "Machine Learning"],
        "remote_friendly": True,
        "job_boards": ["remotive", "himalayas", "linkedin", "indeed", "glassdoor"]
    },
    # Healthcare
    "doctor": {
        "companies": ["Mayo Clinic", "Johns Hopkins", "Cleveland Clinic", "Aga Khan Hospital", "Nairobi Hospital", "Kenyatta National Hospital", "Zipline", "Babylon Health"],
        "skills": ["Clinical Diagnosis", "Patient Care", "Surgery", "Emergency Medicine", "Medical Research"],
        "remote_friendly": False,
        "job_boards": ["linkedin", "indeed", "practicematch"]
    },
    "nurse": {
        "companies": ["NHS", "Kaiser Permanente", "Aga Khan Hospital", "Nairobi Hospital", "Mater Hospital", "Teladoc Health"],
        "skills": ["Patient Care", "Vital Signs", "Medication Administration", "Emergency Response", "Care Planning"],
        "remote_friendly": False,
        "job_boards": ["linkedin", "indeed", "nurse.com"]
    },
    "pharmacist": {
        "companies": ["CVS Health", "Walgreens", "Boots", "Goodlife Pharmacy", "Haltons Pharmacy", "Aga Khan Hospital Pharmacy"],
        "skills": ["Pharmaceutical Knowledge", "Patient Counseling", "Inventory Management", "Prescription Review"],
        "remote_friendly": False,
        "job_boards": ["linkedin", "indeed", "glassdoor"]
    },
    # Education
    "teacher": {
        "companies": ["EF Education First", "Coursera", "Udemy", "Brookhouse School", "International School of Kenya", "VIPKid"],
        "skills": ["Lesson Planning", "Classroom Management", "Curriculum Development", "Student Assessment", "Teaching"],
        "remote_friendly": True,
        "job_boards": ["tes", "teachaway", "linkedin", "indeed"]
    },
    "lecturer": {
        "companies": ["Stanford University", "MIT", "Oxford University", "University of Nairobi", "Strathmore University", "USIU Africa"],
        "skills": ["Research", "Curriculum Design", "Academic Writing", "Student Mentorship", "Lecturing"],
        "remote_friendly": True,
        "job_boards": ["higheredjobs", "linkedin", "indeed"]
    },
    # Aviation
    "pilot": {
        "companies": ["Emirates", "Qatar Airways", "Lufthansa", "Kenya Airways", "Fly540", "Safarilink"],
        "skills": ["Flight Operations", "Navigation", "Air Traffic Control", "Safety Protocols", "Aircraft Systems"],
        "remote_friendly": False,
        "job_boards": ["climbto350", "linkedin", "indeed"]
    },
    # Business/Sales
    "sales manager": {
        "companies": ["Salesforce", "HubSpot", "Unilever", "Procter & Gamble", "Coca-Cola", "Safaricom", "KCB Bank", "Equity Bank"],
        "skills": ["Sales Strategy", "Team Leadership", "Client Relations", "Negotiation", "Market Analysis", "CRM"],
        "remote_friendly": True,
        "job_boards": ["linkedin", "indeed", "glassdoor", "remotive"]
    },
    "marketing manager": {
        "companies": ["Red Bull", "Nike", "WPP ScanGroup", "Ogilvy", "Meta", "Google", "TikTok", "Salaris"],
        "skills": ["Digital Marketing", "Brand Strategy", "Social Media", "Content Creation", "Analytics", "SEO"],
        "remote_friendly": True,
        "job_boards": ["linkedin", "indeed", "glassdoor", "himalayas"]
    },
    "accountant": {
        "companies": ["KPMG", "PwC", "Deloitte", "EY", "Expensify", "QuickBooks", "PKF"],
        "skills": ["Financial Reporting", "Taxation", "Audit", "QuickBooks", "Excel", "Financial Analysis"],
        "remote_friendly": True,
        "job_boards": ["linkedin", "indeed", "glassdoor", "workingnomads"]
    },
    # Engineering
    "civil engineer": {
        "companies": ["AECOM", "Bechtel", "Kenya Power", "KENHA", "KURA", "Mota-Engil", "CRBC"],
        "skills": ["AutoCAD", "Project Management", "Structural Analysis", "Construction Management", "Surveying"],
        "remote_friendly": False,
        "job_boards": ["linkedin", "indeed", "glassdoor"]
    },
    "electrical engineer": {
        "companies": ["Tesla", "Siemens", "General Electric", "Kenya Power", "Schneider Electric", "ABB"],
        "skills": ["Circuit Design", "Power Systems", "AutoCAD", "PLC Programming", "Electrical Installation"],
        "remote_friendly": False,
        "job_boards": ["linkedin", "indeed", "glassdoor"]
    },
    # General/Other
    "human resources": {
        "companies": ["LinkedIn", "Workday", "Deel", "Remote.com", "OysterHR", "Corporate Staffing", "BrighterMonday"],
        "skills": ["Recruitment", "Employee Relations", "Performance Management", "HRIS", "Training & Development"],
        "remote_friendly": True,
        "job_boards": ["wellfound", "himalayas", "linkedin", "indeed"]
    },
    "project manager": {
        "companies": ["Asana", "Monday.com", "Trello", "KPMG", "Deloitte", "UN", "World Bank"],
        "skills": ["Project Planning", "Agile/Scrum", "Risk Management", "Stakeholder Management", "Budgeting"],
        "remote_friendly": True,
        "job_boards": ["weworkremotely", "remotive", "linkedin", "indeed"]
    },
    "customer service": {
        "companies": ["Zendesk", "Intercom", "Safaricom", "KCB Bank", "Airtel", "Amazon Support"],
        "skills": ["Communication", "Problem Solving", "CRM Software", "Conflict Resolution", "Multilingual"],
        "remote_friendly": True,
        "job_boards": ["weworkremotely", "remotive", "linkedin", "indeed"]
    },
    "content writer": {
        "companies": ["Medium", "BuzzFeed", "New York Times", "Squad Digital", "Pulse Live", "Freelance"],
        "skills": ["Copywriting", "SEO", "Social Media", "Research", "Editing", "WordPress"],
        "remote_friendly": True,
        "job_boards": ["problogger", "workingnomads", "weworkremotely", "remotive", "upwork"]
    },
    "graphic designer": {
        "companies": ["Adobe", "Canva", "Figma", "WPP ScanGroup", "Ogilvy Africa", "Freelance", "99designs"],
        "skills": ["Adobe Creative Suite", "Figma", "Illustrator", "Photoshop", "Brand Design", "Typography"],
        "remote_friendly": True,
        "job_boards": ["dribbble", "behance", "weworkremotely", "wellfound"]
    },
    "freelancer": {
        "companies": ["Upwork", "Fiverr", "Toptal", "Freelancer.com", "PeoplePerHour"],
        "skills": ["Self-Management", "Client Communication", "Time Management", "Multiple Skills", "Portfolio Building"],
        "remote_friendly": True,
        "job_boards": ["upwork", "fiverr", "toptal", "freelancer"]
    },
    "virtual assistant": {
        "companies": ["Time Etc", "Belay", "WoodBows", "MyTasker", "Freelance"],
        "skills": ["Calendar Management", "Email Management", "Data Entry", "Customer Support", "Research"],
        "remote_friendly": True,
        "job_boards": ["weworkremotely", "upwork", "indeed", "linkedin"]
    }
}

# Job board URLs
JOB_BOARDS = {
    "linkedin": "https://www.linkedin.com/jobs/search?keywords={}&location={}",
    "indeed": "https://www.indeed.com/jobs?q={}&l={}",
    "glassdoor": "https://www.glassdoor.com/Job/jobs.htm?sc.keyword={}",
    "weworkremotely": "https://weworkremotely.com/?search={}",
    "remotive": "https://remotive.com/?search={}",
    "upwork": "https://www.upwork.com/search/jobs/?q={}",
    "fiverr": "https://www.fiverr.com/search/gigs?query={}",
    "toptal": "https://www.toptal.com/freelance-jobs/{}-jobs",
    "freelancer": "https://www.freelancer.com/jobs/{}",
    "remoteok": "https://remoteok.com/remote-{}-jobs",
    "wellfound": "https://wellfound.com/jobs?q={}",
    "himalayas": "https://himalayas.app/jobs?q={}",
    "flexjobs": "https://www.flexjobs.com/search?search={}",
    "workingnomads": "https://www.workingnomads.com/jobs?q={}",
    "simplyhired": "https://www.simplyhired.com/search?q={}&l={}"
}

def get_profession_config(role):
    """Get profession configuration based on role name"""
    role_lower = role.lower().strip()
    
    # Direct match
    if role_lower in PROFESSIONS:
        return PROFESSIONS[role_lower]
    
    # Partial match
    for prof_name, config in PROFESSIONS.items():
        if prof_name in role_lower or any(keyword in role_lower for keyword in prof_name.split()):
            return config
    
    # Default to generic tech
    return {
        "companies": ["TechCorp", "Innovate Labs", "Future Systems", "Digital Solutions"],
        "skills": ["Communication", "Problem Solving", "Project Management", "Microsoft Office"],
        "remote_friendly": True,
        "job_boards": ["linkedin", "indeed"]
    }

def get_jobs(role, location, user_skills=None):
    """
    Generate contextual job listings based on profession and user skills.
    
    Args:
        role: Target job role
        location: Job location
        user_skills: Optional list of user's skills to match
    """
    try:
        # Get profession-specific config
        prof_config = get_profession_config(role)
        
        # Determine job level based on experience indicators in role
        job_levels = ["Junior", "Mid-Level", "Senior", "Lead", "Manager"]
        detected_level = None
        for level in job_levels:
            if level.lower() in role.lower():
                detected_level = level
                break
        
        # Generate 6-10 contextual jobs
        jobs = []
        num_jobs = random.randint(6, 10)
        
        for i in range(num_jobs):
            company = random.choice(prof_config["companies"])
            
            # Create job title
            if detected_level:
                title = f"{detected_level} {role.title()}"
            else:
                title = f"{random.choice(job_levels)} {role.title()}"
            
            # Location handling - prioritize remote for remote-friendly roles
            is_remote_query = any(kw in location.lower() for kw in ["remote", "anywhere", "global", "worldwide", "world"])
            
            if prof_config["remote_friendly"] and (is_remote_query or location.lower() in ["nairobi", "kenya"]):
                if random.random() > 0.3:  # 70% chance of remote for remote-friendly roles
                    loc = random.choice(["Remote", "Worldwide", "Global", "Anywhere"])
                else:
                    loc = location if location.lower() not in ["remote", "anywhere", "global", "worldwide"] else "Nairobi, Kenya"
            elif is_remote_query:
                loc = random.choice(["Global", "Remote", "Worldwide"])
            else:
                loc = location
            
            # Match skills to requirements
            if user_skills and len(user_skills) > 0:
                # Prioritize user's skills in job requirements
                matched_skills = [skill for skill in prof_config["skills"] if any(user_skill.lower() in skill.lower() for user_skill in user_skills)]
                other_skills = [skill for skill in prof_config["skills"] if skill not in matched_skills]
                
                # Combine: user's skills first, then random others
                selected_skills = matched_skills[:3] + random.sample(other_skills, min(2, len(other_skills)))
                skill_match_score = len(matched_skills)
            else:
                selected_skills = random.sample(prof_config["skills"], min(4, len(prof_config["skills"])))
                skill_match_score = 0
            
            # Create description based on matched skills
            if skill_match_score > 0:
                match_note = f"Your skills match {skill_match_score} key requirements! "
            else:
                match_note = ""
            
            description = f"{match_note}Looking for a {title} to join our global team. Requirements: {', '.join(selected_skills)}. Competitive global salary and remote-first culture."
            
            # Select job board based on role type and location
            if loc in ["Remote", "Worldwide", "Global", "Anywhere"]:
                # Use remote-focused job boards
                remote_boards = prof_config.get("job_boards", ["weworkremotely", "remotive", "remoteok", "himalayas", "wellfound"])
                board_key = random.choice(remote_boards)
            else:
                board_key = random.choice(["linkedin", "indeed", "glassdoor", "simplyhired"])
            
            # Create search URL
            search_title = urllib.parse.quote(title)
            search_loc = urllib.parse.quote(loc)
            
            if board_key in JOB_BOARDS:
                # Handle boards that don't take location
                if "{}" in JOB_BOARDS[board_key] and JOB_BOARDS[board_key].count("{}") == 1:
                    link = JOB_BOARDS[board_key].format(search_title)
                else:
                    link = JOB_BOARDS[board_key].format(search_title, search_loc)
            else:
                link = f"https://www.google.com/search?q={search_title}+jobs+in+{search_loc}"
            
            jobs.append({
                "title": title,
                "company": company,
                "location": loc,
                "link": link,
                "description": description,
                "skill_match": skill_match_score,
                "required_skills": selected_skills
            })
        
        # Sort by skill match score (highest first)
        jobs.sort(key=lambda x: x.get("skill_match", 0), reverse=True)
        
        return jobs
        
    except Exception as e:
        print(f"Job generation failed: {e}. Using fallback.")
        # Fallback to mock data
        current_dir = os.path.dirname(os.path.abspath(__file__))
        mock_path = os.path.join(current_dir, "..", "data", "mock_jobs.json")
        try:
            with open(mock_path) as f:
                return json.load(f)
        except:
            # Ultimate fallback
            return [{
                "title": f"{role} Position",
                "company": "Hiring Company",
                "location": location or "Nairobi, Kenya",
                "link": f"https://www.linkedin.com/jobs/search?keywords={urllib.parse.quote(role)}",
                "description": f"Opportunity for {role}. Apply now!"
            }]
