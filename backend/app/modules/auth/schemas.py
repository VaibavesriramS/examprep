from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, UUID4

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    institution_id: UUID4
    role: Optional[str] = "faculty"

class UserResponse(BaseModel):
    id: UUID4
    email: EmailStr
    role: str
    institution_id: UUID4
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    tenant_id: Optional[str] = None
    type: Optional[str] = None

class GoogleLoginRequest(BaseModel):
    id_token: str
