from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional


class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ResearchPaperInput(BaseModel):
    query: str


class ResearchPaperOutput(BaseModel):
    id: int
    title: str
    abstract: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserOutput(BaseModel):
    name: str
    email: EmailStr
    created_at: datetime
    papers: List[ResearchPaperOutput] = []

    class Config:
        from_attributes = True
