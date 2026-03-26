# 🔬 Auto Research — Multi-Agent Research Paper Generator

A LangGraph-powered multi-agent pipeline that autonomously generates a full research paper from a single query. Given a topic, the system plans, researches, writes, and assembles a structured academic paper — end to end.

---

## How It Works

The pipeline is orchestrated as a **LangGraph state machine** with five sequential nodes:

```
START → Planner → Researcher → Combine → Writer (parallel) → Finalize → END
```

### Agents

| Node | Role |
|------|------|
| **Planner** | Takes the user query and produces a structured research plan: sections, word budgets, research questions, audience, and citation style |
| **Researcher** | Runs each research question through the Tavily Search API and collects sources (title, URL, snippet) |
| **Combine** | Merges all sourced results into a single global research context |
| **Writer** | Spins up a **parallel fan-out** — each paper section is written concurrently by a separate writer agent using its own word budget |
| **Finalize** | Assembles all drafted sections in order and saves the final paper to `research_paper.md` |

---

## Tech Stack

| Component | Library / Service |
|-----------|-------------------|
| Agent Orchestration | `langgraph` |
| LLM | `DeepSeek-V3` via HuggingFace Inference (Novita provider) |
| Web Search | `Tavily` (`langchain-community`) |
| Output Parsing | `PydanticOutputParser` + `OutputFixingParser` |
| State Persistence | `PostgresSaver` (LangGraph checkpoint backend) |
| Config | `python-dotenv` |

---

## Prerequisites

- Python 3.14+
- A running **PostgreSQL** database (for graph checkpointing)
- API keys for:
  - [HuggingFace](https://huggingface.co/settings/tokens) (for DeepSeek-V3 inference via Novita)
  - [Tavily](https://tavily.com/) (for web search)

---

## Setup

1. **Setup Virtual Environment**:
    ```bash
    python -m venv myvenv
    ```
    ```bash
    .\myvenv\Scripts\Activate
    ```

2. **Clone the repo** and install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. **Create a `.env` file** in the project root:

   ```env
   HUGGINGFACEHUB_API_TOKEN=your_hf_token
   TAVILY_API_KEY=your_tavily_key
   DB_URI_GRAPH=postgresql://user:password@localhost:5432/your_db
   ```

4. **Open and run** `auto_research.ipynb` in Jupyter.

---

## Usage

Update the `initial_state` in the notebook with your topic of interest:

```python
initial_state: State = {
    "query": "Does Sleep Deprivation Make You More Creative?"
}
```

Run all cells. The pipeline will:

1. Generate a structured research plan (sections, word budgets, research questions)
2. Search the web for relevant sources per question
3. Compile the context
4. Write each section in parallel
5. Save the final paper to **`research_paper.md`**

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

## Output

The final research paper is written to `research_paper.md` in the working directory, formatted in **Markdown** with headings, in-text citations, and structured sections as defined by the planner.

---

## Notes

- The graph uses **PostgreSQL checkpointing**, which enables resumable runs via `thread_id` — you can inspect or replay any intermediate state.
- The writer node uses a **fan-out pattern** (`Send`) to write all sections in parallel, which significantly reduces total generation time.
- The `OutputFixingParser` provides automatic retry/repair if the LLM returns malformed structured output.
