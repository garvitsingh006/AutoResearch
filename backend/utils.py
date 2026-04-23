from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
import os
from models.research_paper_generator import State
import schemas as schemas
from db_models import User, ResearchPaper, PaperStatus
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
        existing_paper.status = PaperStatus.processing
        final_state = None

        try:
            final_state = workflow.invoke(None, config)
        except Exception as e:
            existing_paper.abstract = f"Generation Failed! The backend couldn't return back the research paper, pls try again.\n\nError: {e}"
            existing_paper.status = PaperStatus.failed
            db.commit()
            db.refresh(existing_paper)
            return existing_paper

        if final_state and "answer" in final_state:
            existing_paper.title = final_state.get("title", existing_paper.title)
            existing_paper.abstract = final_state["answer"]
            existing_paper.status = PaperStatus.completed
            db.commit()
            db.refresh(existing_paper)
        else:
            existing_paper.abstract = "Generation Failed! The backend couldn't return back the research paper, pls try again."
            existing_paper.status = PaperStatus.failed
            db.commit()
            db.refresh(existing_paper)

        return existing_paper


    # otherwise create new paper
    new_paper = ResearchPaper(
        title=payload.query,
        author_id=current_user.id
    )
    new_paper.status = PaperStatus.processing

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
    
    final_state = None

    try:
        final_state = workflow.invoke(initial_state, config)
    except Exception as e:
        new_paper.abstract = f"Generation Failed! The backend couldn't return back the research paper, pls try again.\n\nError: {e}"
        new_paper.status = PaperStatus.failed
        db.commit()
        db.refresh(new_paper)
        return new_paper
    
    if final_state and "answer" in final_state:
        new_paper.title = final_state.get("title", payload.query)
        new_paper.abstract = final_state["answer"]
        new_paper.status = PaperStatus.completed
        db.commit()
        db.refresh(new_paper)
    else:
        new_paper.abstract = "Generation Failed! The backend couldn't return back the research paper, pls try again."
        new_paper.status = PaperStatus.failed
        db.commit()
        db.refresh(new_paper)

    return new_paper