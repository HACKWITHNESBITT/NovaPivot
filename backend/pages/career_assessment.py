import streamlit as st
from utils.agent_logic import extract_skills_with_llm
from utils.resume_parser import parse_resume
from utils.ui_styles import apply_custom_ui, premium_card, render_sidebar, render_page_nav

st.set_page_config(page_title="Career Assessment", page_icon=None, layout="wide")
apply_custom_ui()
render_sidebar()

st.title("NovaPivot Assessment")

# Initialize Session State if accessed directly
if "user_profile" not in st.session_state:
    st.session_state.user_profile = {
        "skills": [],
        "resume_uploaded": False,
        "target_role": "",
        "resume_text": ""
    }

user_profile = st.session_state.user_profile
current_skills = user_profile.get("skills", [])
target_role = user_profile.get("target_role", "")

st.markdown("""
This assessment evaluates your readiness for your target role based on your current skill set. 
Upload a new resume below if you want to update your profile.
""")

col1, col2 = st.columns([1, 1])

with col1:
    st.subheader("Your Current Profile")
    if current_skills:
        st.write("**Current Skills:**")
        for skill in current_skills:
            st.markdown(f"- {skill}")
    else:
        st.info("No skills detected yet. Upload your resume to start.")

    uploaded_file = st.file_uploader("Update Resume", type=["pdf", "docx"])
    if uploaded_file:
        with st.spinner("Analyzing updated resume..."):
            data = parse_resume(uploaded_file)
            new_skills = extract_skills_with_llm(data.get("text", ""))
            if new_skills:
                st.session_state.user_profile["skills"] = list(set(new_skills))
                st.success("Skills updated! Please refresh the page.")
                st.rerun()

with col2:
    st.subheader("Target Role Insight")
    new_target = st.text_input("Change Target Role", value=target_role)
    if new_target != target_role:
        st.session_state.user_profile["target_role"] = new_target
        st.rerun()
    
    if target_role:
        st.write(f"Evaluating for: **{target_role}**")
        # In a real app, this would call the LLM for a deep dive
        st.info("Generating deep dive assessment...")
        # Placeholder for deeper analysis
        st.markdown(f"""
        ### Potential Career Paths:
        1. **{target_role}** (Direct Match)
        2. Senior {target_role} (3-5 years)
        3. Managerial Role in AI/Data
        
        ### Upskilling Priority:
        - Master the top 3 missing skills shown in the [Dashboard](performance_dashboard).
        - Update your LinkedIn to highlight {', '.join(current_skills[:3]) if current_skills else 'your core skills'}.
        """)
    else:
        st.warning("Please set a target role to see insights.")

render_page_nav(
    prev_page="app.py", prev_title="Home (Chat)",
    next_page="pages/performance_dashboard.py", next_title="Dashboard"
)
