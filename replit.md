# AutoResearch — Multi-Agent Research Paper Generator

## Overview
A full-stack application that autonomously generates complete, structured research papers from a single query. Uses a LangGraph multi-agent pipeline (Planner → Researcher → Combine → parallel Writer → Finalize) on the backend and React + Vite on the frontend.

## Design System — Maximalist Bauhaus
The entire frontend uses a Maximalist Bauhaus design system:
- **Fonts**: Bebas Neue (headings/display), Archivo Black (logo/numbers), Inter (body)
- **Colors**: Black bg, `#FF0055` (hot pink CTA), `#0055FF` (blue), `#FF5500` (orange), `#EBFF00` (yellow)
- **Elements**: `border-4 border-black` hard edges, `shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]` hard shadows, clip-diagonal sections, skewed Bebas Neue text, no border-radius
- **CSS classes**: `.font-bebas`, `.font-archivo`, `.bauhaus-input`, `.clip-diagonal`, `.clip-diagonal-reverse`, `.animate-gradient`
- **Pages**: `/` Landing (public), `/login`, `/signup`, `/dashboard`, `/new`, `/paper`

## Architecture
- **Frontend**: React 19 + Vite + Tailwind CSS, runs on port 5000
- **Backend**: FastAPI + LangGraph, runs on port 8000 (proxied via Vite `/api` path)
- **Database**: Replit PostgreSQL (helium) — used for both app data and LangGraph checkpoints
- **Auth**: JWT via python-jose, HTTP-only cookies

## Project Structure
```
/
├── backend/                    # FastAPI + LangGraph pipeline
│   ├── models/
│   │   └── research_paper_generator.py   # LangGraph graph & agents
│   ├── routers/
│   │   └── user.py                       # /users/signup, /users/login, /users/logout
│   ├── app.py                            # FastAPI app, CORS, startup
│   ├── auth.py                           # JWT + cookie auth dependency
│   ├── db.py                             # SQLAlchemy engine + session
│   ├── db_models.py                      # User + ResearchPaper ORM models
│   ├── schemas.py                        # Pydantic schemas
│   ├── utils.py                          # create_research_paper() orchestrator
│   └── requirements.txt
│
├── frontend/                   # React + Vite + Tailwind
│   ├── src/
│   │   ├── api.js              # Centralized fetch wrapper (uses /api proxy)
│   │   ├── App.jsx             # Router + auth state + protected routes
│   │   ├── pages/              # Login, Signup, Dashboard, NewPaper, PaperView
│   │   └── components/         # Navbar, Loader, PaperCard, QueryInput
│   ├── vite.config.js          # Proxy /api → localhost:8000, host 0.0.0.0, port 5000
│   └── package.json
│
└── start.sh                    # Dev startup: backend (8000) + frontend (5000)
```

## Environment Variables (set in Replit Secrets/Env)
| Variable | Description |
|----------|-------------|
| `DB_URI_FASTAPI` | `postgresql+psycopg://postgres:password@helium:5432/heliumdb` |
| `DB_URI_GRAPH` | `postgresql://postgres:password@helium:5432/heliumdb` |
| `FRONTEND_URL` | Replit dev domain URL |
| `SECRET_KEY` | JWT signing secret (auto-generated) |
| `USER_AGENT` | `AutoResearch/1.0` |
| `VITE_BACKEND_URL` | `/api` (uses Vite proxy) |
| `HUGGINGFACEHUB_API_TOKEN` | HuggingFace token for DeepSeek-V3 inference |
| `TAVILY_API_KEY` | Tavily API key for web search |

## Required API Keys (not yet configured)
The app requires these secrets to generate research papers:
- `HUGGINGFACEHUB_API_TOKEN` — HuggingFace token for DeepSeek-V3 via Novita provider
- `TAVILY_API_KEY` — Tavily web search API key

## Database Schema
- `users`: id, email, name, password (argon2 hashed), created_at
- `research_papers`: id, title, abstract, author_id (FK→users), status (enum), created_at

## Dev Workflow
- `bash start.sh` — starts both backend (port 8000) and frontend (port 5000)
- Frontend proxies `/api/*` → `http://localhost:8000/*`
- Backend CORS is open (`allow_origins: ["*"]`) for development

## API Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | Health check |
| POST | `/users/signup` | No | Register |
| POST | `/users/login` | No | Login (sets session_token cookie) |
| POST | `/users/logout` | No | Logout |
| GET | `/me` | Yes | Current user + paper history |
| POST | `/me/new` | Yes | Generate a new research paper |

## Key Behaviours
- Papers are resumable — same query resumes from LangGraph checkpoint
- Parallel section writing via LangGraph Send fan-out
- OutputFixingParser auto-repairs malformed LLM output
- HTTP-only cookie auth with 7-day expiry
