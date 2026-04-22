# 🔬 AutoResearch — Multi-Agent Research Paper Generator

A full-stack application that autonomously generates a complete, structured research paper from a single query. A **LangGraph multi-agent pipeline** handles planning, web research, and parallel section writing on the backend. A **React + Vite** frontend lets users sign up, submit topics, and read their generated papers.

---

## How It Works

The user submits a research topic. The backend runs it through a five-stage LangGraph pipeline:

```
START → Planner → Researcher → Combine → Writer (parallel fan-out) → Finalize → END
```

| Stage | What it does |
|-------|-------------|
| **Planner** | Generates an academic title, research goal, section structure, word budgets, research questions, audience, and citation style |
| **Researcher** | Runs each research question through the Tavily Search API and collects sources |
| **Combine** | Merges all sources into a single global research context |
| **Writer** | Fan-out — each section is written concurrently by a separate agent using its own word budget |
| **Finalize** | Assembles all sections in order into the final paper |

The result is stored in PostgreSQL and returned to the frontend as a rendered markdown paper.

---

## Project Structure

```
/
├── backend/                        # FastAPI + LangGraph pipeline
│   ├── models/
│   │   └── research_paper_generator.py   # LangGraph graph, agents, state schema
│   ├── routers/
│   │   └── user.py                       # /users/signup, /users/login, /users/logout
│   ├── app.py                            # FastAPI app, CORS, startup/shutdown
│   ├── auth.py                           # JWT creation + cookie auth dependency
│   ├── db.py                             # SQLAlchemy engine + session
│   ├── db_models.py                      # User + ResearchPaper ORM models
│   ├── schemas.py                        # Pydantic request/response schemas
│   ├── utils.py                          # create_research_paper() orchestrator
│   └── requirements.txt
│
└── frontend/                       # React + Vite + Tailwind
    ├── src/
    │   ├── api.js                        # Centralized fetch wrapper (credentials: include)
    │   ├── App.jsx                       # Router + auth state + protected routes
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx             # Paper history + create button
    │   │   ├── NewPaper.jsx              # Query input + loading state
    │   │   └── PaperView.jsx            # Rendered markdown paper + resume button
    │   └── components/
    │       ├── Navbar.jsx
    │       ├── Loader.jsx                # Spinner + fake pipeline step messages
    │       ├── PaperCard.jsx             # History card with title, abstract, date
    │       └── QueryInput.jsx
    ├── .env                              # VITE_BACKEND_URL
    └── package.json
```

---

## Tech Stack

### Backend

| Component | Library / Service |
|-----------|-------------------|
| API Framework | `FastAPI` + `Uvicorn` |
| Agent Orchestration | `LangGraph` |
| LLM | `DeepSeek-V3` via HuggingFace Inference (Novita provider) |
| Web Search | `Tavily` (`langchain-community`) |
| Output Parsing | `PydanticOutputParser` + `OutputFixingParser` |
| Graph Checkpointing | `PostgresSaver` (`langgraph-checkpoint-postgres`) |
| Database ORM | `SQLAlchemy` + `PostgreSQL` |
| Auth | JWT via `python-jose`, HTTP-only cookies, `passlib[argon2]` |
| Config | `python-dotenv` |

### Frontend

| Component | Library |
|-----------|---------|
| Framework | `React 19` + `Vite` |
| Routing | `react-router-dom` |
| Styling | `Tailwind CSS` |
| Markdown Rendering | `react-markdown` |
| Auth | HTTP-only cookie (set by backend, sent via `credentials: include`) |

---

## Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- Two running **PostgreSQL** databases:
  - one for the app (`users`, `research_papers` tables)
  - one for LangGraph checkpoints
- API keys:
  - [HuggingFace](https://huggingface.co/settings/tokens) — DeepSeek-V3 inference via Novita
  - [Tavily](https://tavily.com/) — web search

---

## Setup

### 1. Clone the repo

```bash
git clone <repo-url>
cd "Research Paper Writer (P2)"
```

### 2. Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv myvenv
.\myvenv\Scripts\Activate       # Windows
# source myvenv/bin/activate    # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
DB_URI_FASTAPI=postgresql+psycopg://user:password@localhost:5432/app_db
DB_URI_GRAPH=postgresql://user:password@localhost:5432/graph_db

FRONTEND_URL=http://localhost:5173

HUGGINGFACEHUB_API_TOKEN=your_hf_token
TAVILY_API_KEY=your_tavily_key
SECRET_KEY=your_jwt_secret_key

USER_AGENT=AutoResearch/1.0
```

Start the backend:

```bash
uvicorn app:app --reload
```

API available at `http://localhost:8000` — interactive docs at `http://localhost:8000/docs`.

---

### 3. Frontend

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

App available at `http://localhost:5173`.

---

## API Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | No | Health check |
| `POST` | `/users/signup` | No | Register a new user |
| `POST` | `/users/login` | No | Login — sets `session_token` HTTP-only cookie |
| `POST` | `/users/logout` | No | Clears session cookie |
| `GET` | `/me` | Yes | Returns current user + their paper history |
| `POST` | `/me/new` | Yes | Submit a query — runs pipeline, returns paper |

### Example Requests

**POST `/users/signup`**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret" }
```

**POST `/me/new`**
```json
{ "query": "Does sleep deprivation make you more creative?" }
```

Response:
```json
{
  "id": 3,
  "title": "Sleep Deprivation and Creative Cognition: An Empirical Review",
  "abstract": "## Introduction\n\n...",
  "created_at": "2025-06-12T10:30:00Z"
}
```

---

## Database Models

**`users`**

| Column | Type | Notes |
|--------|------|-------|
| `id` | integer | Primary key |
| `name` | string | |
| `email` | string | Unique |
| `password` | string | Argon2 hashed |
| `research_papers` | integer | Count |
| `created_at` | timestamp | |

**`research_papers`**

| Column | Type | Notes |
|--------|------|-------|
| `id` | integer | Primary key |
| `title` | string | LLM-generated academic title |
| `abstract` | text | Full paper in markdown |
| `author_id` | integer | FK → users |
| `created_at` | timestamp | |

---

## LangGraph State Schema

```python
class State(TypedDict):
    query: str                       # User's input topic
    title: str                       # LLM-generated academic title (from Planner)
    step: str                        # Current pipeline stage
    plan: Plan                       # Title, goal, sections, word budgets, etc.
    research: Research               # Sources + combined context
    writing: Writing                 # Section write status
    section_drafts: Dict[str, str]   # Parallel writer outputs (merged)
    answer: str                      # Final assembled paper (markdown)
    meta: Meta                       # Step history + errors
```

---

## Key Behaviours

- **Resumable runs** — if a paper with the same query already exists for a user, the workflow resumes from its last LangGraph checkpoint instead of restarting from scratch. The frontend's "Resume / Continue" button triggers this explicitly.
- **Parallel writing** — the Writer node uses LangGraph's `Send` fan-out to write all sections concurrently, significantly reducing generation time.
- **LLM-generated titles** — the Planner agent generates a proper academic title from the query; the raw query is never used as the paper title.
- **Output repair** — `OutputFixingParser` automatically retries and repairs malformed LLM output before it hits the pipeline.
- **Cookie auth** — sessions use HTTP-only cookies with a 7-day expiry. The frontend sends `credentials: "include"` on every request so cookies are forwarded correctly.

---

## Environment Variables Reference

### `backend/.env`

| Variable | Description |
|----------|-------------|
| `DB_URI_FASTAPI` | SQLAlchemy connection string for the app database |
| `DB_URI_GRAPH` | psycopg connection string for LangGraph checkpoints |
| `FRONTEND_URL` | Allowed CORS origin (e.g. `http://localhost:5173`) |
| `HUGGINGFACEHUB_API_TOKEN` | HuggingFace token for DeepSeek-V3 inference |
| `TAVILY_API_KEY` | Tavily API key for web search |
| `SECRET_KEY` | Secret used to sign JWT tokens |
| `USER_AGENT` | Optional user agent string for HTTP requests |

### `frontend/.env`

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Base URL of the FastAPI backend (e.g. `http://localhost:8000`) |
