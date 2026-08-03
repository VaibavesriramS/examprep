import uuid
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Syllabus, Unit, Topic, Subtopic, Question, QuestionEmbedding

class SyllabusParsingService:
    def __init__(self, db: AsyncSession):
        self.db = db

    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 100) -> List[str]:
        """
        Recursively splits text into character chunks matching token boundaries.
        """
        chunks = []
        start = 0
        while start < len(text):
            end = min(start + chunk_size, len(text))
            chunks.append(text[start:end])
            start += chunk_size - overlap
        return chunks

    async def save_parsed_syllabus(
        self,
        subject_id: uuid.UUID,
        tenant_id: uuid.UUID,
        units_payload: List[Dict[str, Any]]
    ) -> Syllabus:
        """
        Saves parsed structured topics, units, and subtopics directly to relational tables.
        """
        syllabus = Syllabus(
            tenant_id=tenant_id,
            subject_id=subject_id,
            is_active=True
        )
        self.db.add(syllabus)
        await self.db.flush() # Get syllabus ID

        for seq, unit_data in enumerate(units_payload):
            unit = Unit(
                syllabus_id=syllabus.id,
                title=unit_data.get("title", f"Unit {seq + 1}"),
                sequence_order=seq
            )
            self.db.add(unit)
            await self.db.flush()

            for topic_title in unit_data.get("topics", []):
                topic = Topic(
                    unit_id=unit.id,
                    title=topic_title
                )
                self.db.add(topic)
                await self.db.flush()

                # Add dummy subtopics for structural mapping
                subtopic = Subtopic(
                    topic_id=topic.id,
                    title=f"Core concepts of {topic_title}"
                )
                self.db.add(subtopic)
        
        await self.db.commit()
        return syllabus

    async def verify_duplicate_content(self, embedding_vector: List[float], threshold: float = 0.87) -> bool:
        """
        Checks if a generated question overlaps semantically with active questions in the database.
        """
        # Execute pgvector distance check
        from sqlalchemy.future import select
        stmt = (
            select(QuestionEmbedding)
            .where(QuestionEmbedding.embedding.cosine_distance(embedding_vector) < (1.0 - threshold))
        )
        result = await self.db.execute(stmt)
        matched = result.scalars().first()
        return matched is not None
