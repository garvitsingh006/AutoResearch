from fastapi import APIRouter, Depends, status, HTTPException, Response
from db import get_db
from db_models import User
from sqlalchemy.orm import Session
import schemas
from utils import hash, verify_pwd, create_token

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOutput)
def create_new_user(user: schemas.UserSignup, db: Session = Depends(get_db)):
    user.password = hash(user.password)
    new_user = User(**user.model_dump())

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login", status_code=status.HTTP_200_OK, response_model=schemas.UserOutput)
def login(user: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if not existing_user:
        raise HTTPException(status_code=404, detail=f'User with email {user.email} not found!')
    
    isPasswordCorrect = verify_pwd(plain_password=user.password, hashed_password=existing_user.password)

    if not isPasswordCorrect:
        raise HTTPException(status_code=400, detail='Incorrect password!')

    token = create_token(existing_user.email)

    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60*60*24*7
    )

    return existing_user


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("session_token")
    return {"message": "Logged out"}
