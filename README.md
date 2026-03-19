# NovaPivot - AI-Driven Career Transition Platform

NovaPivot is a comprehensive, multi-service platform designed to guide professionals through career transitions. Built with modern web technologies and powered by Amazon Nova LLM, it provides personalized career advice, resume analysis, interview simulation, and job market insights through multiple user interfaces.

## Live Demo
https://nova-pivot-jive.vercel.app/

## Architecture

NovaPivot consists of four main services:

- **React Frontend**: Modern TypeScript/Vite-based UI with authentication
- **Node.js Auth Server**: Express.js authentication service with JWT and MongoDB
- **FastAPI Backend**: Python LLM service with Amazon Nova integration  
- **Streamlit UI**: Original Python-based interface for rapid prototyping

## Features

- **User Authentication**: Secure JWT-based authentication with password reset functionality
- **Personalized Career Chat**: Interact with an AI agent that understands your professional background and goals.
- **Hybrid Resume Parsing**: Extract skills from PDF and DOCX files using a combination of LLM-based analysis and local keyword fallback.
- **Skill Performance Dashboard**: Visualize your skill coverage and transition readiness with interactive radar and gauge charts.
- **Career Roadmap**: Generate a structured, step-by-step learning path to bridge the gap to your target role.
- **Live Job Discovery**: Scrapes real-time job listings from LinkedIn, Indeed, and more based on your target role.
- **Mock Interview Simulator**: Practice with an AI recruiter that asks challenging, role-specific questions and provides performance feedback.
- **Offline Resilience**: Automatically switches to an "Offline Mode" with local intelligence if the LLM API is unreachable.

## Tech Stack

- **React Frontend**: TypeScript, Vite, Tailwind CSS
- **Auth Server**: Node.js, Express.js, MongoDB, JWT
- **FastAPI Backend**: Python, Amazon Nova LLM, OpenAI SDK
- **Streamlit UI**: Python-based interface for prototyping
- **Data Visualization**: Plotly & Pandas
- **Job Scraping**: JobSpy
- **Resume Parsing**: PyPDF2, python-docx, pdfminer.six

## Prerequisites

- **Node.js 16+** (for React frontend and auth server)
- **Python 3.9+** (for FastAPI backend and Streamlit UI)
- **MongoDB Atlas** account and connection string
- **Amazon Nova API Key** from Novita AI platform
- **Gmail account** for email notifications (optional)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd NovaPivot
   ```

2. **Set up FastAPI Backend**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up Node.js Auth Server**:
   ```bash
   cd ../auth-server
   npm install
   ```

4. **Set up React Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

5. **Set up Streamlit UI** (optional):
   ```bash
   cd ../backend  # Same environment as backend
   # Requirements already installed
   ```

## Running the Project

### Development Mode

Start each service in separate terminals:

1. **FastAPI Backend** (Terminal 1):
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn api:app --reload --host 0.0.0.0 --port 8000
   ```
   Accessible at: http://localhost:8000

2. **Node.js Auth Server** (Terminal 2):
   ```bash
   cd auth-server
   npm run dev
   ```
   Accessible at: http://localhost:5002

3. **React Frontend** (Terminal 3):
   ```bash
   cd frontend
   npm run dev
   ```
   Accessible at: http://localhost:3000

4. **Streamlit UI** (Terminal 4, optional):
   ```bash
   cd backend
   source venv/bin/activate
   streamlit run app.py
   ```
   Accessible at: http://localhost:8501

### Production Mode

- **Auth Server**: Deploy to Vercel/Netlify with MongoDB Atlas
- **React Frontend**: Deploy to Vercel/Netlify 
- **FastAPI Backend**: Deploy to Railway/Render with persistent storage

## Project Structure

```
├── auth-server/               # Node.js authentication service
│   ├── config/                # Database configuration
│   ├── controllers/           # Auth controllers (register, login, etc.)
│   ├── middleware/            # JWT authentication middleware
│   ├── models/                # MongoDB user models
│   ├── routes/                # API routes (auth, chat)
│   ├── utils/                 # Validation and JWT utilities
│   ├── server.js              # Express server entry point
│   └── package.json           # Node.js dependencies
├── backend/                   # FastAPI Python service
│   ├── api.py                 # FastAPI application
│   ├── pages/                 # Streamlit sub-pages
│   ├── utils/                 # LLM and helper functions
│   ├── data/                  # Mock data for offline mode
│   └── requirements.txt       # Python dependencies
├── frontend/                  # React TypeScript frontend
│   ├── src/                   # Source code
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service functions
│   │   └── types/             # TypeScript type definitions
│   ├── public/                # Static assets
│   └── package.json           # Node.js dependencies
└── README.md                  # This file
```

## Environment Variables

### Auth Server (.env)
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/novapivot
JWT_SECRET=your-super-secret-jwt-key
NOVA_API_KEY=your-novita-api-key
NOVA_API_URL=https://api.novita.ai/v3/openai
NOVA_MODEL=nova-lite-v1
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@novapivot.com
```

### Backend (.env)
```bash
NOVA_API_KEY=your-novita-api-key
NOVA_API_URL=https://api.novita.ai/v3/openai
NOVA_MODEL=nova-lite-v1
JWT_SECRET=your-jwt-secret
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/novapivot
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5002/api
```

## Resilience and Fallbacks

This project is built to be robust. If the Nova API returns a `403 Forbidden` or any other error, the system will:
1. Switch to a **Mock Intelligence Mode** for chat and interviews.
2. Use a **Local Skill Extractor** to identify keywords in resumes without an LLM.
3. Utilize **Cached/Mock Job Data** if scraping fails.
4. Provide **Fallback Authentication** with local session management.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test all services
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
