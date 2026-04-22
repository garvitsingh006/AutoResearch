# 🔬 Auto Research — Multi-Agent Research Paper Generator

A LangGraph-powered multi-agent pipeline wrapped in a **FastAPI backend** that autonomously generates a full research paper from a single query. Users authenticate, submit a topic, and the system plans, researches, writes, and assembles a structured academic paper — end to end.

---

## How It Works

The pipeline is orchestrated as a **LangGraph state machine** with five sequential nodes:

```
START → Planner → Researcher → Combine → Writer (parallel fan-out) → Finalize → END
```

### Agent Nodes

| Node | Role |
|------|------|
| **Planner** | Takes the user query and produces a structured research plan: sections, word budgets, research questions, audience, and citation style |
| **Researcher** | Runs each research question through the Tavily Search API and collects sources (title, URL, snippet) |
| **Combine** | Merges all sourced results into a single global research context |
| **Writer** | Spins up a **parallel fan-out** — each paper section is written concurrently by a separate writer agent using its own word budget |
| **Finalize** | Assembles all drafted sections in order and returns the final paper |

---

## Architecture

```
Client
  │
  ▼
FastAPI (app.py)
  ├── /users/signup       → Register a new user
  ├── /users/login        → Authenticate & receive session cookie
  ├── /users/logout       → Clear session
  ├── /me                 → Get current user info
  └── /me/new             → Submit a query → triggers LangGraph pipeline
          │
          ▼
    LangGraph Workflow (PostgresSaver checkpoint)
          │
          ▼
    PostgreSQL (two databases)
      ├── FastAPI DB  → users, research_papers tables
      └── LangGraph DB → graph checkpoints
```

The workflow is initialized once at **startup** and shared across requests. Each paper run is keyed by a unique `thread_id` (`user_{id}_paper_{id}`), enabling **resumable runs** via LangGraph checkpointing.

---

## Tech Stack

| Component | Library / Service |
|-----------|-------------------|
| API Framework | `FastAPI` + `Uvicorn` |
| Agent Orchestration | `langgraph` |
| LLM | `DeepSeek-V3` via HuggingFace Inference (Novita provider) |
| Web Search | `Tavily` (`langchain-community`) |
| Output Parsing | `PydanticOutputParser` + `OutputFixingParser` |
| Graph Checkpointing | `PostgresSaver` (`langgraph-checkpoint-postgres`) |
| App Database | `SQLAlchemy` + `PostgreSQL` |
| Auth | JWT via `python-jose`, cookies, `passlib[argon2]` |
| Config | `python-dotenv` |

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | No | Health check |
| `POST` | `/users/signup` | No | Register a new user |
| `POST` | `/users/login` | No | Login, sets `session_token` cookie |
| `POST` | `/users/logout` | No | Clears session cookie |
| `GET` | `/me` | Yes | Returns current user info |
| `POST` | `/me/new` | Yes | Submit a research query, returns paper title + abstract |

### Request / Response Examples

**POST `/users/signup`**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret" }
```

**POST `/me/new`**
```json
{ "query": "Does Sleep Deprivation Make You More Creative?" }
```
Response:
```json
{ "title": "Does Sleep Deprivation Make You More Creative?", "abstract": "..." }
```

---

## Database Models

**`users`** — stores registered users with hashed passwords and a paper count.

**`research_papers`** — stores generated papers linked to a user, with title and abstract (the full paper content).

---

## State Schema

The shared LangGraph state object tracks the full lifecycle of the paper:

```python
class State(TypedDict):
    query: str                          # Input research topic
    step: str                           # Current pipeline stage
    plan: Plan                          # Planner output
    research: Research                  # Sources + combined context
    writing: Writing                    # Section write status
    section_drafts: Dict[str, str]      # Parallel writer outputs (merged)
    answer: str                         # Final assembled paper
    meta: Meta                          # Step history + errors
```

---

## Prerequisites

- Python 3.11+
- Two running **PostgreSQL** databases — one for the app (users/papers), one for LangGraph checkpoints
- API keys for:
  - [HuggingFace](https://huggingface.co/settings/tokens) (DeepSeek-V3 inference via Novita)
  - [Tavily](https://tavily.com/) (web search)

---

## Setup

1. **Create and activate a virtual environment**:
    ```bash
    python -m venv myvenv
    .\myvenv\Scripts\Activate
    ```

2. **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3. **Create a `.env` file** in the project root:
    ```env
    HUGGINGFACEHUB_API_TOKEN=your_hf_token
    TAVILY_API_KEY=your_tavily_key
    DB_URI_FASTAPI=postgresql+psycopg://user:password@localhost:5432/app_db
    DB_URI_GRAPH=postgresql://user:password@localhost:5432/graph_db
    SECRET_KEY=your_jwt_secret_key
    ```

4. **Run the server**:
    ```bash
    uvicorn app:app --reload
    ```

    The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

---

## Notes

- If a paper with the same query already exists for a user, the workflow **resumes from its last checkpoint** rather than restarting — useful for recovering interrupted runs.
- The writer node uses a **fan-out pattern** (`Send`) to write all sections in parallel, significantly reducing total generation time.
- The `OutputFixingParser` provides automatic retry/repair if the LLM returns malformed structured output.
- Session auth uses **HTTP-only cookies** with a 7-day expiry.
