from email.policy import default
import enum
from sqlalchemy import TIMESTAMP, Column, ForeignKey, Integer, String, Numeric, Boolean, text, Text, UniqueConstraint, Enum
from sqlalchemy.orm import declarative_base, relationship

class PaperStatus(enum.Enum):
    processing = "processing"
    completed = "completed"
    failed = "failed"

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, index=True, primary_key=True)
    email = Column(String(100), nullable=False, unique=True)
    name = Column(String(100), nullable=False)
    password = Column(String, nullable=False)
    created_at=Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    papers = relationship("ResearchPaper", back_populates="author", order_by="ResearchPaper.created_at.desc()")

class ResearchPaper(Base):
    __tablename__ = "research_papers"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    abstract = Column(Text, nullable=False, default="Generating...")
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(PaperStatus, name="paper_status", create_type=False), nullable=False, server_default="processing")
    created_at=Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    author = relationship("User", back_populates="papers")

    __table_args__ = (
        UniqueConstraint('author_id', 'title', name='unique_user_title'),
    )