from typing import List, TypedDict, Dict
from pydantic import BaseModel, Field
from typing import Annotated
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_classic.output_parsers import OutputFixingParser
from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send
from dotenv import load_dotenv

load_dotenv()

## ESSENTIALS

config = {
    "configurable": {
        "thread_id": "Test_Changed_State"
    }
}

def merge_dict(a: dict, b: dict) -> dict:
    return {**a, **b}

class Source(TypedDict):
    title: str
    url: str
    snippet: str
    # citation: str

class Plan(TypedDict):
    title: str
    goal: str
    target_words: int
    section_word_budget: Dict[str, int]
    audience: str
    citation_style: str
    research_questions: List[str]
    sections: List[str]
    constraints: List[str]

class Research(TypedDict):
    sources: Dict[str, List[Source]]
    section_context: Dict[str, str]

class Writing(TypedDict):
    section_status: Dict[str, str]

class Meta(TypedDict):
    step_history: List[str]
    errors: List[str]

class State(TypedDict):
    query: str
    title: str
    step: str
    section_drafts: Annotated[Dict[str, str], merge_dict]

    plan: Plan
    research: Research
    writing: Writing

    answer: str
    meta: Meta

## Planner
planner_llm = HuggingFaceEndpoint(
    repo_id="deepseek-ai/DeepSeek-V3.2",
    task="text-generation",
    temperature=0.2,
    max_new_tokens=2000,
    provider="novita"
)
planner_model = ChatHuggingFace(llm=planner_llm)

class PlannerSchema(BaseModel):
    title: str = Field(description="A concise, academic title for the research paper based on the query.")
    goal: str = Field(description="The research goal or thesis statement of the paper.")
    target_words: int = Field(description="The target length of the paper in words.")
    section_word_budget: Dict[str, int] = Field(description="A mapping of section names to their allocated word counts.")
    audience: str = Field(description="The intended audience for the paper (e.g., academics, general public, policymakers).")
    citation_style: str = Field(description="The citation style to be used (e.g., APA, MLA, Chicago).")
    research_questions: List[str] = Field(description="A list of 4–7 specific research questions that will guide the research agent.")
    sections: List[str] = Field(description="The section names in order, which will be the structure of the paper.")
    constraints: List[str] = Field(description="Any important research constraints or guidelines that should be followed.")

planner_parser = PydanticOutputParser(pydantic_object=PlannerSchema)

fixing_parser = OutputFixingParser.from_llm(
    parser=planner_parser,
    llm=planner_model
)

planner_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
                You are a Planner Agent in a multi-agent research system.
                Your job is to convert the user's query into a clear research plan that other agents can execute.
                You must produce a structured plan that fits the provided system state.
                The goal is to make the work of the research and writing agents easier by clearly defining the objective, structure, and constraints of the paper.
                Responsibilities:

                1. Generate a concise, academic title for the paper based on the query.
                2. Define the research goal clearly.
                3. Determine the target length of the paper.
                4. Identify the intended audience.
                5. Choose an appropriate citation style.
                6. Break the topic into 4–7 research questions.
                7. Design the full paper structure (sections).
                8. Allocate word counts to each section.
                9. Define any important research constraints.

                Guidelines:

                • Paper structure should follow common academic conventions where possible:
                    Abstract
                    Introduction
                    Literature Review
                    Methodology (if relevant)
                    Analysis / Findings
                    Discussion
                    Conclusion
                • Section word budgets must approximately sum to the target_words.
                • Research questions should be specific and guide the research agent.
                • Constraints should improve quality (example: peer-reviewed sources, recent publications, avoid opinion blogs).

                Output Requirements:
                Give output in the following format JSON only: {format_instructions}
            """
        ),
        (
            "human",
            "Query: {query}"
        )
    ]
).partial(format_instructions=planner_parser.get_format_instructions())
planner_chain = planner_prompt | planner_model | fixing_parser

def planner(state: State) -> State:
    print("STATE:", state)
    print("Planning...")
    query = state.get("query")
    response = planner_chain.invoke({"query": query})
    return {
        "title": response.title,
        "plan": {
            "title": response.title,
            "goal": response.goal,
            "target_words": response.target_words,
            "section_word_budget": response.section_word_budget,
            "audience": response.audience,
            "citation_style": response.citation_style,
            "research_questions": response.research_questions,
            "sections": response.sections,
            "constraints": response.constraints,
        },
        "step": "researcher"
    }

## Researcher
def tavily_search(query: str, max_results: int = 2) -> List[dict]:
    print("Searching on Web")
    tool = TavilySearchResults(max_results=max_results)
    results = tool.invoke({"query": query})

    normalized: List[dict] = []
    for r in results or []:
        normalized.append(
            {
                "title": r.get("title") or "",
                "url": r.get("url") or "",
                "snippet": r.get("content") or r.get("snippet") or ""
            }
        )
    return normalized

def researcher(state: State) -> State:
    research_results = {}
    for question in state["plan"]["research_questions"]:
        research_results[question] = tavily_search(query=question, max_results=2) or []

    return {
        "research": {
            "sources": research_results
        },
        "step": "Combine"
    }

## Combine Research
def combine(state: State):
    print("Combining...")
    blocks = []

    for question in state["plan"]["research_questions"]:
        blocks.append(f"### Research Question: {question}\n")

        for item in state["research"]["sources"][question]:
            blocks.append(
                f"- **{item['title']}**\n"
                f"  URL: {item['url']}\n"
                f"  Summary: {item['snippet']}\n"
            )

    research_context = "\n".join(blocks)

    return {
        "research": {
            **state["research"],
            "section_context": {"global": research_context}
        },
        "step": "writer"
    }

## Writer
def fanout(state: State):
    print("Writing...")
    return [
        Send(
            "writer",
            {
                **state,
                "section_word_budget": state["plan"]["section_word_budget"][section],
                "section": section,
            }
        )
        for section in state["plan"]["sections"]
    ]

writer_llm = HuggingFaceEndpoint(
    repo_id="deepseek-ai/DeepSeek-V3.2",
    task="text-generation",
    temperature=0.2,
    max_new_tokens=2000,
    provider="novita"
)
writer_model = ChatHuggingFace(llm=writer_llm)

class WriterSchema(BaseModel):
    section_output: Annotated[str, Field(description="The text of this particular section in this research paper")]

writer_parser = PydanticOutputParser(pydantic_object=WriterSchema)
writer_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            '''
                You are an academic research writer.

                Your task is to write a single section of a research paper based on the provided inputs.

                Guidelines:
                - Write ONLY the requested section.
                - Target the provided word budget as closely as possible.
                - Write for the specified audience.
                - Follow the specified citation style.
                - Use the research context when forming arguments.
                - Respect any constraints given.

                Formatting rules:
                - The section text MUST be written in Markdown.
                - Use Markdown headings, paragraphs, and lists where appropriate.
                - Include in-text citations if required by the citation style.
                - Do NOT include explanations or commentary outside the output schema.
                - Include sources if available in the context

                You MUST format your response according to this schema:

                {format_instructions}
            '''
        ),
        (
            "human",
            '''
                Goal: {goal}\n
                Word Budget: {word_budget} +-5%\n
                Audience: {audience}\n
                Citation Style: {citation_style}\n
                Section: {section}\n
                Context:\n{research_context}\n
                Constraints:\n{constraints}
            '''
        )
    ]
).partial(format_instructions=writer_parser.get_format_instructions())
writer_chain = writer_prompt | writer_model | writer_parser

def writer(payload: dict) -> dict:
    goal = payload["plan"]["goal"]
    audience = payload["plan"]["audience"]
    citation_style = payload["plan"]["citation_style"]
    constraints = payload["plan"]["constraints"]
    research_context = payload["research"]["section_context"]["global"]
    section_word_budget = payload["section_word_budget"]
    section = payload["section"]

    section_md = writer_chain.invoke({
        "goal": goal,
        "word_budget": section_word_budget,
        "audience": audience,
        "citation_style": citation_style,
        "section": section,
        "research_context": research_context,
        "constraints": constraints
    }).section_output

    return {
        "section_drafts": {
            section: section_md
        }
    }

## Finalise
def finalize(state: State) -> State:
    print("Finalizing")
    drafts = state["section_drafts"]

    paper = "\n\n".join(
        drafts[s] for s in state["plan"]["sections"]
    )

    with open("research_paper.md", "w", encoding="utf-8") as f:
        f.write(paper)

    return {"answer": paper, "step": "Successfully Completed"}

## Graph Building
def build_graph(checkpointer):
    print("Building Graph")

    g = StateGraph(State)

    g.add_node("planner", planner)
    g.add_node("researcher", researcher)
    g.add_node("combine", combine)
    g.add_node("writer", writer)
    g.add_node("finalize", finalize)

    g.add_edge(START, "planner")
    g.add_edge("planner", "researcher")
    g.add_edge("researcher", "combine")
    g.add_conditional_edges("combine", fanout, ["writer"])
    g.add_edge("writer", "finalize")
    g.add_edge("finalize", END)

    return g.compile(checkpointer=checkpointer)


    # initial_state : State = {
    #     "query": "Does Sleep Deprivation Make You More Creative?"
    # }
    # workflow.update_state(
    #     config,
    #     {},                # no state change
    #     as_node="combine"  # resume from this node
    # )
    # final_state = workflow.invoke(None, config)
