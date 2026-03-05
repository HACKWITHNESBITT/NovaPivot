import streamlit as st
from utils.agent_logic import handle_resume_upload

# ===================
#  FULL-WINDOW UI STYLING
# ===================
def apply_custom_ui():
    """
    Applies a modern full-window UI without sidebar toggles.
    """
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');

    html, body, [class*="st-"] {
        font-family: 'Outfit', sans-serif;
    }

    /* Remove Streamlit overhead elements */
    #MainMenu {visibility: hidden;}
    /* Hide native sidebar navigation to prevent flashing */
    [data-testid="stSidebarNav"] {display: none !important;}

    /* Glassmorphic Cards with Animation */
    .stApp {
        background: radial-gradient(circle at top right, #0F172A, #1E293B, #334155);
        background-attachment: fixed;
        background-size: cover;
        padding: 1rem 2rem;
    }

    /* Main content columns */
    .main-content {
        display: flex;
        flex-direction: row;
        gap: 2rem;
    }

    .left-panel, .right-panel {
        flex: 1;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }

    @media (max-width: 1000px) {
        .main-content {
            flex-direction: column;
        }
    }

    /* Buttons */
    div.stButton > button {
        background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 8px;
        padding: 12px 20px;
        font-weight: 500;
        width: 100%;
        transition: all 0.3s ease;
    }

    div.stButton > button:hover {
        background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 128, 255, 0.2));
        border: 1px solid rgba(0, 212, 255, 0.5);
        box-shadow: 0 4px 15px rgba(0, 212, 255, 0.2);
        transform: scale(1.02);
    }

    /* Inputs */
    .stTextInput > div > div > input {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        color: white !important;
    }

    h1, h2, h3 {
        background: linear-gradient(90deg, #00D4FF, #0080FF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700 !important;
    }

    </style>
    """, unsafe_allow_html=True)


def premium_card(title, content, footer=None):
    """
    Renders a styled glass card.
    """
    st.markdown(f"""
    <div style="
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 24px;
        border-radius: 16px;
        margin-bottom: 20px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    ">
        <h3 style="margin-top: 0; color: #00D4FF;">{title}</h3>
        <div style="color: #FFFFFF; font-size: 1.1rem; line-height: 1.6;">{content}</div>
        {f'<div style="margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; font-size: 0.95rem; color: #B0BEC5;">{footer}</div>' if footer else ''}
    </div>
    """, unsafe_allow_html=True)


# ===================
#  FULL-WINDOW LAYOUT
# ===================
def full_window_layout(left_renderer, right_renderer=None):
    """
    Renders the main content in two panels: left and right.
    """
    st.markdown('<div class="main-content">', unsafe_allow_html=True)

    # Left Panel
    st.markdown('<div class="left-panel">', unsafe_allow_html=True)
    left_renderer()
    st.markdown('</div>', unsafe_allow_html=True)

    # Right Panel (optional)
    if right_renderer:
        st.markdown('<div class="right-panel">', unsafe_allow_html=True)
        right_renderer()
        st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)


# ===================
#  LEFT PANEL: PROFILE SETUP
# ===================
def render_resume_upload_panel():
    st.subheader("Profile Setup")

    uploaded_file = st.file_uploader("Upload PDF/DOCX", type=["pdf", "docx"])
    if uploaded_file:
        response = handle_resume_upload(uploaded_file)
        st.success("Resume uploaded successfully!")

    target_role = st.text_input("Target Role")
    if target_role:
        st.success(f"Target role set to: {target_role}")


# ===================
#  RIGHT PANEL: JOB RECOMMENDATIONS
# ===================
def render_recommendations_panel():
    st.subheader("Job Recommendations")
    jobs = [
        {"title": "Project Manager", "skills": "Leadership, Communication"},
        {"title": "Data Analyst", "skills": "Analytical, Technical"},
        {"title": "UX Designer", "skills": "Creative, Technical"},
        {"title": "Marketing Specialist", "skills": "Creativity, Analytics"}
    ]

    for job in jobs:
        st.markdown(f"""
        <div style="
            background: rgba(255,255,255,0.05);
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 12px;
        ">
            <b>{job['title']}</b><br>
            Skills: {job['skills']}
        </div>
        """, unsafe_allow_html=True)


def render_sidebar(extra_renderer=None):
    """
    Renders a unified navigation sidebar.
    """
    with st.sidebar:
        st.markdown("<h2 style='text-align: center; color: #00D4FF; margin-bottom: 20px;'>NovaPivot</h2>", unsafe_allow_html=True)
        
        # Profile Progress
        user_profile = st.session_state.get("user_profile", {})
        has_resume = user_profile.get("resume_uploaded", False)
        has_role = bool(user_profile.get("target_role"))
        
        progress = 0
        if has_resume: progress += 50
        if has_role: progress += 50
        
        st.markdown(f"""
        <div style="background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 8px; padding: 15px; margin-bottom: 20px;">
            <div style="font-size: 0.9rem; color: #E0E0E0; margin-bottom: 10px;"><b>Profile Setup:</b> {progress}%</div>
            <div style="font-size: 0.8rem; color: #888;">
                {'✅' if has_resume else '❌'} Resume Uploaded<br>
                {'✅' if has_role else '❌'} Target Role Set
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("### Core Journey")
        st.page_link("app.py", label="1. Home (Chat & Setup)")
        st.page_link("pages/career_assessment.py", label="2. Detailed Assessment")
        st.page_link("pages/performance_dashboard.py", label="3. Skill Dashboard")
        st.page_link("pages/roadmap.py", label="4. Career Roadmap")
        st.page_link("pages/job_recommendations.py", label="5. Job Insights")
        st.page_link("pages/mock_interview.py", label="6. Mock Interview")
        
        st.markdown("""
        <style>
            [data-testid="stPageLink-NavLink"] {
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.05);
                border-radius: 8px;
                padding: 10px;
                margin-bottom: 8px;
                transition: all 0.3s ease;
            }
            [data-testid="stPageLink-NavLink"]:hover {
                background: rgba(0,212,255,0.1);
                border-color: rgba(0,212,255,0.3);
            }
        </style>
        """, unsafe_allow_html=True)

        if "user_profile" not in st.session_state:
            st.session_state.user_profile = {
                "skills": [],
                "resume_uploaded": False,
                "target_role": "",
                "resume_text": ""
            }

        st.markdown("---")
        st.title("Profile Setup")
        st.caption("Tell us about your background and goals so we can tailor your experience.")
        st.markdown("---")

        st.subheader("Resume Upload")
        uploaded_file = st.file_uploader("Upload PDF/DOCX", type=["pdf", "docx"], label_visibility="collapsed")

        if uploaded_file and not st.session_state.user_profile.get("resume_uploaded"):
            response = handle_resume_upload(uploaded_file)
            if "messages" in st.session_state:
                st.session_state.messages.append({"role": "assistant", "content": response})
            st.rerun()

        st.markdown("---")
        st.subheader("Target Role")
        target_role = st.text_input(
            "What is your goal?",
            value=st.session_state.user_profile.get("target_role", "")
        )
        if target_role != st.session_state.user_profile.get("target_role", ""):
            st.session_state.user_profile["target_role"] = target_role
            if "messages" in st.session_state:
                st.session_state.messages.append(
                    {
                        "role": "assistant",
                        "content": f"Understood! We're targeting **{target_role}**. Let's look at your path."
                    }
                )
            st.rerun()

        if extra_renderer:
            st.markdown("---")
            extra_renderer()


def render_sidebar_toggle():
    """
    Renders a visible toggle button to control sidebar visibility.
    This button is clearly visible in the main content area.
    """
    # Initialize sidebar collapsed state
    if "sidebar_collapsed" not in st.session_state:
        st.session_state.sidebar_collapsed = False
    
    # Initialize user_profile if not exists
    if "user_profile" not in st.session_state:
        st.session_state.user_profile = {
            "skills": [],
            "resume_uploaded": False,
            "target_role": "",
            "resume_text": ""
        }
    
    # Check if mobile and auto-collapse
    is_mobile = st.query_params.get("mobile", "false").lower() == "true"
    if is_mobile and "mobile_collapsed" not in st.session_state:
        st.session_state.sidebar_collapsed = True
        st.session_state.mobile_collapsed = True
    
    # Apply CSS to control sidebar visibility based on state
    sidebar_css = """
    <style>
    /* Sidebar expanded state (default) */
    [data-testid="stSidebar"] {
        transform: translateX(0) !important;
        transition: transform 0.3s ease !important;
        min-width: 300px !important;
        width: 300px !important;
    }
    
    /* Sidebar collapsed state */
    .sidebar-collapsed [data-testid="stSidebar"] {
        transform: translateX(-100%) !important;
        min-width: 0 !important;
        width: 0 !important;
        visibility: hidden !important;
    }
    
    /* Main content shift when sidebar collapsed */
    .sidebar-collapsed .main .block-container {
        max-width: 100% !important;
        padding-left: 2rem !important;
    }
    
    /* Hide native sidebar toggle text */
    [data-testid="stSidebarCollapsedControl"] {
        visibility: hidden !important;
    }
    
    /* Hide the icon name text */
    .st-emotion-cache-1cypd47,
    [data-testid="stIconMaterial"] {
        font-size: 0 !important;
    }
    
    /* Mobile responsive - collapse sidebar on small screens */
    @media (max-width: 768px) {
        [data-testid="stSidebar"] {
            min-width: 280px !important;
            width: 280px !important;
        }
    }
    
    @media (max-width: 480px) {
        .sidebar-collapsed [data-testid="stSidebar"] {
            transform: translateX(-100%) !important;
        }
    }
    </style>
    """
    
    # Add class to body based on sidebar state
    if st.session_state.sidebar_collapsed:
        sidebar_css += '<script>document.body.classList.add("sidebar-collapsed");</script>'
    else:
        sidebar_css += '<script>document.body.classList.remove("sidebar-collapsed");</script>'
    
    # Auto-collapse on mobile
    sidebar_css += """
    <script>
    // Auto-collapse sidebar on mobile devices
    if (window.innerWidth <= 768 && !document.body.classList.contains('sidebar-collapsed')) {
        document.body.classList.add('sidebar-collapsed');
    }
    </script>
    """
    
    st.markdown(sidebar_css, unsafe_allow_html=True)
    
    # Render visible toggle button
    col1, col2 = st.columns([1, 10])
    with col1:
        icon = "➡️" if st.session_state.sidebar_collapsed else "⬅️"
        label = "Show" if st.session_state.sidebar_collapsed else "Hide"
        if st.button(f"{icon} {label} Sidebar", key="sidebar_toggle_btn", 
                     help="Click to show or hide the sidebar",
                     use_container_width=True):
            st.session_state.sidebar_collapsed = not st.session_state.sidebar_collapsed
            st.rerun()
    with col2:
        st.empty()
    
    st.markdown("---")


def render_page_nav(prev_page=None, prev_title=None, next_page=None, next_title=None):
    """
    Renders double-left and double-right back/next buttons for linear pagination at the bottom of the page.
    """
    st.markdown("<br><br><br>", unsafe_allow_html=True)
    st.markdown("---")
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col1:
        if prev_page and prev_title:
            if st.button(f"« {prev_title}", use_container_width=True):
                st.switch_page(prev_page)
                
    with col3:
        if next_page and next_title:
            if st.button(f"{next_title} »", use_container_width=True):
                st.switch_page(next_page)


# ===================
#  MAIN APP EXECUTION
# ===================
if __name__ == "__main__":
    apply_custom_ui()
    full_window_layout(
        left_renderer=render_resume_upload_panel,
        right_renderer=render_recommendations_panel
    )