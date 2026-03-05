import streamlit as st
from utils.agent_logic import process_query
# handle_resume_upload removed - backend only now
from utils.ui_styles import apply_custom_ui, render_sidebar, render_page_nav, render_sidebar_toggle

st.set_page_config(
    page_title="NovaPivot (DEPRECATED - Use React Frontend)",
    page_icon=None,
    layout="wide",
    initial_sidebar_state="collapsed"
)
st.warning("This Streamlit UI is deprecated. Please use the React frontend at http://localhost:3002")
st.info("Run: cd novapivot-react && npm run dev")
apply_custom_ui()
render_sidebar()
render_sidebar_toggle()

# Initialize Session State
if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "assistant", "content": "Welcome! I'm NovaPivot, your AI Career Transition partner. Upload your resume in the sidebar to get started, or just tell me about your career goals."}
    ]

if "user_profile" not in st.session_state:
    st.session_state.user_profile = {
        "skills": [],
        "resume_uploaded": False,
        "target_role": "",
        "resume_text": ""
    }

# Main Chat Interface
st.title("NovaPivot")
st.caption("Your personalized AI guide for navigating career changes, analyzing your skills, and charting a new professional path.")

if not st.session_state.user_profile.get("resume_uploaded") or not st.session_state.user_profile.get("target_role"):
    st.info("👈 **Welcome!** Please use the **Profile Setup** sidebar on the left to upload your resume and enter your Target Role to unlock personalized insights.")

# Display Messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Chat Input
if prompt := st.chat_input("Ask me about your career transition..."):
    # Add user message
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Generate Response
    with st.chat_message("assistant"):
        response = process_query(prompt, st.session_state.user_profile)
        st.markdown(response)
        st.session_state.messages.append({"role": "assistant", "content": response})

render_page_nav(
    next_page="pages/career_assessment.py", 
    next_title="Detailed Assessment"
)
