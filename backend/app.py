from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from auth import get_current_user
from routers import research_paper
from routers import user
from db import get_db, engine
from db_models import Base, User
import schemas as schemas
from utils import create_research_paper
from models.research_paper_generator import build_graph
from langgraph.checkpoint.postgres import PostgresSaver
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173"), "https://auto-research-tan.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
DB_URI_GRAPH = os.getenv("DB_URI_GRAPH")

@app.on_event("startup")
def startup():
    global workflow
    # setup the checkpoint tables once using a short-lived connection
    with PostgresSaver.from_conn_string(DB_URI_GRAPH) as checkpointer:
        checkpointer.setup()
    workflow = build_graph(DB_URI_GRAPH)

@app.get("/")
def home():
    return {
        "response": "Welcome to Research Paper Generator made by Garvit Singh"
    }

app.include_router(user.router)
# app.include_router(research_paper.router)

@app.get("/me", response_model=schemas.UserOutput)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return current_user

@app.post("/me/new", response_model=schemas.ResearchPaperOutput)
def new_paper(payload: schemas.ResearchPaperInput, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    paper = create_research_paper(payload, current_user, db, workflow)
    return paper