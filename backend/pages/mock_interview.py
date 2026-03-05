import os
import streamlit as st
from openai import OpenAI
from dotenv import load_dotenv
from utils.ui_styles import apply_custom_ui, premium_card, render_sidebar, render_page_nav

load_dotenv()

st.set_page_config(page_title="Mock Interview Simulator", layout="wide")
apply_custom_ui()

st.title("NovaPivot Interview")

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
skills = ", ".join(user_profile.get("skills", ["General Technical Skills"]))
if not skills.strip():
    skills = "General Technical Skills"

# Interview Session State
if "interview_messages" not in st.session_state:
    st.session_state.interview_messages = []
    st.session_state.interview_started = False

# Initialize Nova Client
client = OpenAI(
    api_key=os.getenv("NOVA_API_KEY"),
    base_url=os.getenv("NOVA_API_URL")
)

def render_interview_controls():
    if not st.session_state.get("interview_started"):
        return
    if "interview_messages" not in st.session_state:
        return

    st.header("Session Control")
    if st.button("End & Get Feedback"):
        with st.spinner("Analyzing your performance..."):
            feedback_prompt = (
                f"Analyze the following interview transcript for a {target_role} role and give 3 pros, 3 cons, and a score out of 10. \n\n"
            )
            transcript = "\n".join(
                [f"{m['role']}: {m['content']}" for m in st.session_state.interview_messages]
            )

            feedback_response = client.chat.completions.create(
                model=os.getenv("NOVA_MODEL", "nova-2-lite-v1"),
                messages=[{"role": "user", "content": feedback_prompt + transcript}],
            )
            st.session_state.interview_feedback = feedback_response.choices[0].message.content
            st.session_state.interview_started = False
            st.rerun()

    if st.button("Reset Session"):
        st.session_state.interview_messages = []
        st.session_state.interview_started = False
        st.rerun()

render_sidebar(extra_renderer=render_interview_controls)

if not user_profile.get("resume_uploaded"):
    st.warning("Please upload your resume in the main chat first so I can tailor the questions to your background!")
    if st.button("Go to Chat"):
        st.switch_page("app.py")
    st.stop()

def mock_interviewer_response(messages):
    """
    Simulates a recruiter when the LLM is down.
    """
    if not messages:
        return f"Nice to meet you! Let's start the interview for the **{target_role}** position. To begin, can you tell me why you're interested in transitioning into this field?"
    
    last_user_msg = ""
    for m in reversed(messages):
        if m["role"] == "user":
            last_user_msg = m["content"].lower()
            break
            
    questions = [
        f"That's interesting. Given your skills in {skills.split(',')[0]}, how would you handle a high-pressure deadline?",
        f"In a technical role like {target_role}, communication is key. Describe a time you had to explain a complex idea to a non-technical stakeholder.",
        f"What is your greatest technical achievement so far that relates to the {target_role} role?",
        f"Where do you see yourself in 3 years within this career path?"
    ]
    # Simple rotation or random choice based on message count
    idx = (len(messages) // 2) % len(questions)
    return questions[idx]

def get_interviewer_response(messages):
    try:
        system_role = f"""
        You are a Senior Technical Recruiter at a top-tier company. 
        You are interviewing a candidate for the role of: {target_role}.
        The candidate's skills are: {skills}.
        
        INSTRUCTIONS:
        1. Ask ONE challenging question at a time.
        2. Stay in character. Do not break character.
        3. Start by introducing yourself and asking a behavioral or technical question relevant to {target_role}.
        4. If the candidate answers, provide a very brief reaction and then ask the next follow-up question.
        5. Keep responses professional and slightly formal.
        """
        
        if messages and messages[0]["role"] == "assistant":
            # Prepend a dummy greeting if the history starts with an assistant message
            messages = [{"role": "user", "content": "Hello."}] + messages
        elif not messages:
            # If no messages, send a start command
            messages = [{"role": "user", "content": "Please start the interview."}]
            
        api_messages = [{"role": "system", "content": system_role}] + messages
        
        response = client.chat.completions.create(
            model=os.getenv("NOVA_MODEL", "nova-2-lite-v1"),
            messages=api_messages,
            temperature=0.8,
            timeout=8
        )
        return response.choices[0].message.content
    except Exception as e:
        if "403" in str(e):
             return mock_interviewer_response(messages) + "\n\n*(Note: Running in offline simulation mode due to connection issues)*"
        return f"⚠️ Interviewer Error: {str(e)}"

# Start Button
if not st.session_state.interview_started:
    st.info(f"Ready to start your practice for **{target_role}**?")
    if st.button("Start Interview"):
        st.session_state.interview_started = True
        first_q = get_interviewer_response([])
        st.session_state.interview_messages.append({"role": "assistant", "content": first_q})
        st.rerun()
else:
    # Display Transcript
    for msg in st.session_state.interview_messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    # Chat Input
    if not st.session_state.get("interview_feedback"):
        if prompt := st.chat_input("Your answer..."):
            st.session_state.interview_messages.append({"role": "user", "content": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)
                
            with st.chat_message("assistant"):
                # Clean history for API (last 6 messages for context)
                context = st.session_state.interview_messages[-6:]
                response = get_interviewer_response(context)
                st.markdown(response)
                st.session_state.interview_messages.append({"role": "assistant", "content": response})

# Show Feedback if available
if "interview_feedback" in st.session_state and not st.session_state.interview_started:
    st.markdown("---")
    st.subheader("Interview Performance Analysis")
    st.markdown(st.session_state.interview_feedback)
    if st.button("Start New Session"):
        del st.session_state.interview_feedback
        st.session_state.interview_messages = []
        st.rerun()

render_page_nav(
    prev_page="pages/job_recommendations.py", prev_title="Insights"
)
