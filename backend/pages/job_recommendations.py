import streamlit as st
import pandas as pd
from utils.job_scraper import get_jobs
from utils.ui_styles import apply_custom_ui, premium_card, render_sidebar, render_page_nav

st.set_page_config(page_title="Job Recommendations", page_icon=None, layout="wide")
apply_custom_ui()
render_sidebar()

st.title("NovaPivot Insights")

# Initialize Session State if accessed directly
if "user_profile" not in st.session_state:
    st.session_state.user_profile = {
        "skills": [],
        "resume_uploaded": False,
        "target_role": "",
        "resume_text": ""
    }

user_profile = st.session_state.user_profile
target_role = user_profile.get("target_role") or "Data Scientist"
skills = user_profile.get("skills", [])

st.write(f"Finding top opportunities for you in **{target_role}**")

# Get jobs
with st.spinner("Scanning global markets..."):
    jobs = get_jobs(target_role, "Remote")

if isinstance(jobs, pd.DataFrame):
    if not jobs.empty:
        for idx, row in jobs.iterrows():
            title = row.get('title', 'Unknown Title')
            company = row.get('company', 'Unknown')
            loc = row.get('location', 'Remote')
            link = row.get('job_url', '#')
            desc = str(row.get('description', 'No description available...'))[:250]
            
            content = f"""
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="color:#888;">{company}</span> • <span style="color:#00D4FF;">{loc}</span>
                    <p style="margin-top:10px;">{desc}...</p>
                </div>
            </div>
            """
            premium_card(title, content, footer=f'<a href="{link}" target="_blank" style="color:#00D4FF; text-decoration:none; font-weight:bold;">Apply on Official Site →</a>')
    else:
        st.info("No live jobs found. Showing mock data for reference.")
        # ... (mock data handling)
else:
    for job in jobs:
        premium_card(
            job['title'], 
            f"**{job['company']}** • {job['location']}<br><br>{job['description']}",
            footer=f'<a href="{job["link"]}" target="_blank" style="color:#00D4FF; text-decoration:none; font-weight:bold;">Apply Now →</a>'
        )

render_page_nav(
    prev_page="pages/roadmap.py", prev_title="Roadmap",
    next_page="pages/mock_interview.py", next_title="Mock Interview"
)

