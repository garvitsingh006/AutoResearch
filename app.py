from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session
from auth import get_current_user
from routers import user, research_paper
from db import get_db, engine
from db_models import Base, User
import schemas
from utils import create_research_paper
from models.research_paper_generator import build_graph
from langgraph.checkpoint.postgres import PostgresSaver
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()
DB_URI_GRAPH = os.getenv("DB_URI_GRAPH")

@app.on_event("startup")
def startup():
    global workflow
    global checkpointer_cm
    global checkpointer

    
    checkpointer_cm = PostgresSaver.from_conn_string(DB_URI_GRAPH)
    checkpointer = checkpointer_cm.__enter__()
    checkpointer.setup()

    workflow = build_graph(checkpointer)

@app.on_event("shutdown")
def shutdown():
    checkpointer_cm.__exit__(None, None, None)

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