from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.modules.auth.router import router as auth_router
from app.modules.workspace.router import router as workspace_router
from app.modules.assistant.router import router as assistant_router

# Initialize FastAPI instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI Assessment Operating System Backend Service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Apply CORS headers
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register API endpoint domains
app.include_router(auth_router, prefix="/api/v1")
app.include_router(workspace_router, prefix="/api/v1")
app.include_router(assistant_router, prefix="/api/v1")

@app.get("/")
async def root():
    """
    Root status landing endpoint.
    """
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENV
    }

@app.get("/health")
async def health_check():
    """
    Basic health assessment check for backend readiness.
    """
    return {
        "status": "healthy",
        "database": "unverified",  # Verified dynamically in DB middleware checks
        "cache": "unverified"
    }

