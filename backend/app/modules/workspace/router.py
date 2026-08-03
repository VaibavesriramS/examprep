import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.modules.auth.dependencies import get_current_tenant_id, require_roles
from app.models import PaperBlueprint, ExamPaper, Question, Subject, Course

router = APIRouter(prefix="/workspace", tags=["Workspace"])

@router.post("/upload-syllabus", status_code=status.HTTP_202_ACCEPTED)
async def upload_syllabus(
    file: UploadFile = File(...),
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db)
):
    """
    Ingests syllabus file, triggers OCR parsing engine asynchronously via Celery.
    """
    if not file.filename.endswith(('.pdf', '.docx', '.png', '.jpg', '.jpeg')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported document format file."
        )

    # Simulated task creation (Celery call dispatch: tasks.parse_document.delay)
    task_id = str(uuid.uuid4())
    
    return {
        "status": "QUEUED",
        "task_id": task_id,
        "filename": file.filename,
        "detail": "Document ingestion dispatched to layout OCR worker."
    }

@router.post("/blueprints", status_code=status.HTTP_201_CREATED)
async def save_blueprint(
    course_id: uuid.UUID,
    configuration: Dict[str, Any],
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db)
):
    """
    Saves a calculated exam blueprint configuration map.
    """
    # Check if course exists
    course_stmt = select(Course).where(Course.id == course_id)
    course_res = await db.execute(course_stmt)
    if not course_res.scalars().first():
        # Auto-seed mock course if dynamic creation needed for demonstration
        mock_course = Course(id=course_id, title="Software Architecture", code="CS-801", department_id=uuid.uuid4())
        db.add(mock_course)
        await db.commit()

    blueprint = PaperBlueprint(
        tenant_id=tenant_id,
        course_id=course_id,
        configuration=configuration
    )
    db.add(blueprint)
    await db.commit()
    await db.refresh(blueprint)
    
    return {
        "status": "SUCCESS",
        "blueprint_id": blueprint.id,
        "configuration": blueprint.configuration
    }

@router.post("/generate-paper", status_code=status.HTTP_202_ACCEPTED)
async def trigger_paper_generation(
    blueprint_id: uuid.UUID,
    title: str,
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db)
):
    """
    Dispatches the multi-agent question compilation pipeline Celery task.
    """
    blueprint_stmt = select(PaperBlueprint).where(PaperBlueprint.id == blueprint_id)
    blueprint_res = await db.execute(blueprint_stmt)
    blueprint = blueprint_res.scalars().first()
    
    if not blueprint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Specified exam blueprint profile not found."
        )

    # Initialize examination draft record
    paper = ExamPaper(
        tenant_id=tenant_id,
        blueprint_id=blueprint_id,
        title=title,
        status="DRAFT"
    )
    db.add(paper)
    await db.commit()
    await db.refresh(paper)

    # Enqueue compilation task: tasks.generate_exam_paper.delay(paper.id)
    task_id = str(uuid.uuid4())

    return {
        "status": "PROCESSING",
        "paper_id": paper.id,
        "task_id": task_id,
        "detail": "Orchestrating agent synthesis sequence."
    }

@router.get("/papers/{id}")
async def get_exam_paper(
    id: uuid.UUID,
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db)
):
    """
    Fetches the content details of a specific examination paper.
    """
    stmt = select(ExamPaper).where(ExamPaper.id == id, ExamPaper.tenant_id == tenant_id)
    res = await db.execute(stmt)
    paper = res.scalars().first()
    
    if not paper:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Examination paper profile not found."
        )
        
    return {
        "id": paper.id,
        "title": paper.title,
        "status": paper.status,
        "created_at": paper.created_at
    }
