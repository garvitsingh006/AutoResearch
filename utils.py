from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
import os
from models.research_paper_generator import State
import schemas
from db_models import User, ResearchPaper
from sqlalchemy.orm import Session

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
SECRET_KEY=os.getenv("SECRET_KEY")

def hash(pwd: str):
    return pwd_context.hash(pwd)

def verify_pwd(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_token(email: str):
    now = datetime.now(timezone.utc)
    payload = {
        "sub": email,
        "iat": now,
        "exp": now + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def create_research_paper(payload: schemas.ResearchPaperInput, current_user: User, db: Session, workflow):

    # check if paper already exists for this user + query
    existing_paper = db.query(ResearchPaper).filter(
        ResearchPaper.title == payload.query,
        ResearchPaper.author_id == current_user.id
    ).first()

    if existing_paper:

        config = {
            "configurable": {
                "thread_id": f"user_{current_user.id}_paper_{existing_paper.id}"
            }
        }

        # resume the workflow
        final_state = workflow.invoke(None, config)

        if final_state and "answer" in final_state:
            existing_paper.abstract = final_state["answer"]
            db.commit()
            db.refresh(existing_paper)

        return existing_paper


    # otherwise create new paper
    new_paper = ResearchPaper(
        title=payload.query,
        author_id=current_user.id
    )

    db.add(new_paper)
    db.commit()
    db.refresh(new_paper)

    config = {
        "configurable": {
            "thread_id": f"user_{current_user.id}_paper_{new_paper.id}"
        }
    }

    initial_state: State = {
        "query": payload.query
    }

    final_state = workflow.invoke(initial_state, config)

    new_paper.abstract = final_state["answer"]
    db.commit()
    db.refresh(new_paper)

    return new_paper

    