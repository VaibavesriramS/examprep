from celery import Celery
from app.core.config import settings

# Initialize Celery app instance bound to redis queues
celery_app = Celery(
    "examforge_tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

# Celery task configuration defaults
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=1800, # Max execution: 30 minutes
    # Task routing lists matching target queue profiles
    task_routes={
        "app.queue.tasks.parse_document": {"queue": "ocr_queue"},
        "app.queue.tasks.generate_exam_paper": {"queue": "ai_queue"},
        "app.queue.tasks.verify_exam_paper": {"queue": "critical_queue"},
    }
)
