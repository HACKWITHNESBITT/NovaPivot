import streamlit as st
import plotly.graph_objects as go
import pandas as pd
from utils.ui_styles import apply_custom_ui, premium_card, render_sidebar, render_page_nav

st.set_page_config(page_title="Skill Performance Dashboard", layout="wide")
apply_custom_ui()
render_sidebar()

st.title("NovaPivot Dashboard")

# Get data from session state
# Initialize Session State if accessed directly
if "user_profile" not in st.session_state:
    st.session_state.user_profile = {
        "skills": [],
        "resume_uploaded": False,
        "target_role": "",
        "resume_text": ""
    }

user_profile = st.session_state.user_profile
user_skills = user_profile.get("skills", [])
target_role = user_profile.get("target_role", "Not Specified")

# Mock data for comparative analysis if no real data is available
# In a real app, these would come from the LLM analysis of the job market
market_skills_map = {
    "Data Scientist": ["Python", "SQL", "Machine Learning", "Statistics", "Data Visualization"],
    "Software Engineer": ["Python", "Java", "System Design", "Algorithms", "Git"],
    "Product Manager": ["Strategy", "Roadmapping", "SQL", "Agile", "User Research"]
}

required_skills = market_skills_map.get(target_role, ["Communication", "Problem Solving", "Leadership", "Technical Proficiency"])

st.subheader(f"Analysis for: **{target_role}**")

col1, col2 = st.columns([1, 1])

with col1:
    st.write("### Skill Coverage")
    if not user_skills:
        st.info("Upload your resume to see your skill coverage.")
    else:
        # Calculate coverage
        found = [s for s in required_skills if any(s.lower() in us.lower() for us in user_skills)]
        missing = [s for s in required_skills if s not in found]
        
        # Radar Chart
        categories = required_skills
        # Simulation of skill levels (0-10)
        user_levels = [8 if s in found else 2 for s in categories]
        target_levels = [10 for _ in categories]
        
        fig = go.Figure()
        fig.add_trace(go.Scatterpolar(
            r=user_levels,
            theta=categories,
            fill='toself',
            name='Your Skills',
            line_color='#00D4FF',
            fillcolor='rgba(0, 212, 255, 0.3)'
        ))
        fig.add_trace(go.Scatterpolar(
            r=target_levels,
            theta=categories,
            fill='none',
            name='Market Standard',
            line_color='#FF4B4B',
            line=dict(dash='dash')
        ))
        
        fig.update_layout(
            polar=dict(radialaxis=dict(visible=True, range=[0, 10])),
            showlegend=True,
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color="white")
        )
        st.plotly_chart(fig, use_container_width=True)

with col2:
    st.write("### Transition Readiness")
    match_score = len([s for s in required_skills if any(s.lower() in us.lower() for us in user_skills)]) / len(required_skills) * 100
    
    # Gauge Chart
    fig_gauge = go.Figure(go.Indicator(
        mode = "gauge+number",
        value = match_score,
        domain = {'x': [0, 1], 'y': [0, 1]},
        title = {'text': "Readiness Score (%)"},
        gauge = {
            'axis': {'range': [None, 100], 'tickwidth': 1, 'tickcolor': "white"},
            'bar': {'color': "#00d4ff"},
            'bgcolor': "rgba(0,0,0,0)",
            'borderwidth': 2,
            'bordercolor': "gray",
            'steps': [
                {'range': [0, 40], 'color': '#ff4b4b'},
                {'range': [40, 70], 'color': '#ffa500'},
                {'range': [70, 100], 'color': '#00ff00'}],
        }
    ))
    fig_gauge.update_layout(paper_bgcolor='rgba(0,0,0,0)', font=dict(color="white"))
    st.plotly_chart(fig_gauge, width='stretch')

st.divider()

# Skill Gap List
st.subheader("Recommendations")
if user_skills:
    missing = [s for s in required_skills if not any(s.lower() in us.lower() for us in user_skills)]
    if missing:
        st.write(f"To reach **{target_role}** level, focus on these areas:")
        for m in missing:
            st.markdown(f"- **{m}**: Consider taking a course or working on a project involving this skill.")
    else:
        st.success("You are a great match! Start applying for roles.")
else:
    st.write("Please process your resume in the chat to see detailed recommendations.")

render_page_nav(
    prev_page="pages/career_assessment.py", prev_title="Assessment",
    next_page="pages/roadmap.py", next_title="Roadmap"
)
