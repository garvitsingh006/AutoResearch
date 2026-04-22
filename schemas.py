from pydantic import BaseModel, EmailStr
from decimal import Decimal
from datetime import datetime
from typing import Optional

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOutput(BaseModel):
    name: str
    email: EmailStr
    created_at: datetime
    class Config:
        from_attributes = True

class ResearchPaperInput(BaseModel):
    query: str

class ResearchPaperOutput(BaseModel):
    title: str
    abstract: str

    class Config:
        from_attributes = True