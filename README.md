# NovaPivot

A comprehensive, AI-driven platform designed to guide professionals through career transitions. This application leverages the **Amazon Nova LLM** (via an OpenAI-compatible interface) to provide personalized advice, analyze resumes, and simulate interviews.
##Live Demo:  https://nova-pivot-jive.vercel.app/
## Features

- **Personalized Career Chat**: Interact with an AI agent that understands your professional background and goals.
- **Hybrid Resume Parsing**: Extract skills from PDF and DOCX files using a combination of LLM-based analysis and local keyword fallback.
- **Skill Performance Dashboard**: Visualize your skill coverage and transition readiness with interactive radar and gauge charts.
- **Career Roadmap**: Generate a structured, step-by-step learning path to bridge the gap to your target role.
- **Live Job Discovery**: Scrapes real-time job listings from LinkedIn, Indeed, and more based on your target role.
- **Mock Interview Simulator**: Practice with an AI recruiter that asks challenging, role-specific questions and provides performance feedback.
- **Offline Resilience**: Automatically switches to an "Offline Mode" with local intelligence if the LLM API is unreachable.

## Tech Stack

- **Frontend/UI**: Streamlit
- **LLM**: Amazon Nova (via OpenAI SDK)
- **Data Visualization**: Plotly & Pandas
- **Job Scraping**: JobSpy
- **Resume Parsing**: PyPDF2, python-docx, pdfminer.six

## Prerequisites

- Python 3.9+
- An Amazon Nova API Key (or an OpenAI-compatible endpoint)
- Access to Amazon Bedrock models (specifically `nova-2-lite-v1`) if using the live API.

## Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd career_transition_assistant
   ```

2. **Create a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```


## Running the Project

To start the application, run the following command from the project root:

```bash
streamlit run app.py
```

The application will be accessible in your browser at `http://localhost:8501`.

## Project Structure

```text
├── app.py                     # Main application entry point
├── pages/                     # Sub-pages for specific tools
│   ├── career_assessment.py   # Deep-dive readiness analysis
│   ├── job_recommendations.py # Scraped job listings
│   ├── mock_interview.py      # AI interview simulation
│   ├── performance_dashboard.py # Skill visualization
│   └── roadmap.py             # Career learning paths
├── utils/                     # Logic & Helper functions
│   ├── agent_logic.py         # LLM interaction & Fallback logic
│   ├── job_scraper.py         # Scraper integration
│   ├── resume_parser.py       # Text extraction from documents
│   └── roadmap_generator.py   # Template-based roadmap logic
├── data/                      # Mock data for offline use
└── requirements.txt           # Python dependencies
```

## Resilience and Fallbacks

This project is built to be robust. If the Nova API returns a `403 Forbidden` or any other error, the system will:
1. Switch to a **Mock Intelligence Mode** for chat and interviews.
2. Use a **Local Skill Extractor** to identify keywords in resumes without an LLM.
3. Utilize **Cached/Mock Job Data** if scraping fails.
