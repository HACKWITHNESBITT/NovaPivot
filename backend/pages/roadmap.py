import streamlit as st
from utils.roadmap_generator import generate_roadmap
from utils.ui_styles import apply_custom_ui, premium_card, render_sidebar, render_page_nav

st.set_page_config(page_title="Career Roadmap", layout="wide")
apply_custom_ui()
render_sidebar()

st.title("NovaPivot Roadmap")

# Initialize Session State if accessed directly
if "user_profile" not in st.session_state:
    st.session_state.user_profile = {
        "skills": [],
        "resume_uploaded": False,
        "target_role": "",
        "resume_text": ""
    }

user_profile = st.session_state.user_profile
target_role = user_profile.get("target_role") or "Not Specified"
skills = user_profile.get("skills", [])

if not user_profile.get("resume_uploaded"):
    st.warning("Please upload your resume in the chat to generate a personalized roadmap.")
    if st.button("Go to Chat"):
        st.switch_page("app.py")
else:
    st.subheader(f"Next Steps to become a **{target_role}**")
    
    # Generate the roadmap data
    roadmap_data = generate_roadmap(skills, target_role)
    
    # CSS for Timeline
    st.markdown("""
        <style>
        .roadmap-container {
            border-left: 3px solid #00d4ff;
            padding-left: 20px;
            margin-left: 10px;
        }
        .roadmap-item {
            position: relative;
            margin-bottom: 25px;
        }
        .roadmap-item::before {
            content: '';
            position: absolute;
            left: -28px;
            top: 5px;
            width: 14px;
            height: 14px;
            background-color: #00d4ff;
            border-radius: 50%;
        }
        </style>
    """, unsafe_allow_html=True)
    
    for item in roadmap_data:
        content = f"**Task:** {item['task']}<br>{item['details']}"
        premium_card(item['time'], content)
        st.checkbox("Mark as complete", key=f"check_{item['task']}")
        st.markdown("<br>", unsafe_allow_html=True)

render_page_nav(
    prev_page="pages/performance_dashboard.py", prev_title="Dashboard",
    next_page="pages/job_recommendations.py", next_title="Insights"
)

