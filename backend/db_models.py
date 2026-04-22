from sqlalchemy import TIMESTAMP, Column, ForeignKey, Integer, String, Numeric, Boolean, text, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, index=True, primary_key=True)
    email = Column(String(100), nullable=False, unique=True)
    name = Column(String(100), nullable=False)
    password = Column(String, nullable=False)
    research_papers = Column(Integer, nullable=False, server_default=text("0"))
    created_at=Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    papers = relationship("ResearchPaper", back_populates="author", order_by="ResearchPaper.created_at.desc()")

class ResearchPaper(Base):
    __tablename__ = "research_papers"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    abstract = Column(Text, nullable=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at=Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    author = relationship("User", back_populates="papers")