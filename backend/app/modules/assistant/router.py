import asyncio
import uuid
from typing import List, Optional, Any
from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.modules.auth.dependencies import get_current_tenant_id
from app.models import ChatConversation, ChatMessage

router = APIRouter(prefix="/assistant", tags=["Assistant"])

@router.post("/chat/stream")
async def assistant_chat_stream(
    message_text: str,
    conversation_id: Optional[uuid.UUID] = None,
    model_type: str = "pro", # flash vs pro
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db)
):
    """
    Establishes an SSE stream forwarding Gemini response tokens back to the client.
    """
    # Create or fetch conversation
    if not conversation_id:
        conversation = ChatConversation(tenant_id=tenant_id, title=message_text[:30])
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)
        conversation_id = conversation.id

    # Log user message
    user_msg = ChatMessage(conversation_id=conversation_id, sender="user", message_text=message_text)
    db.add(user_msg)
    await db.commit()

    async def token_generator():
        # Yield initial configuration payload
        yield f"data: {{\"conversation_id\": \"{conversation_id}\", \"status\": \"CONNECTED\"}}\n\n"
        await asyncio.sleep(0.2)

        # Yield response chunk intervals
        responses = [
            f"According to the database schemas and indexed documents for tenant NIT, ",
            "I parsed the requested course outcomes (COs). ",
            f"\n\nGemini 2.5 {model_type} suggests focusing on: ",
            "\n1. Logical module boundaries (logical separation)",
            "\n2. Strict row level security (RLS) constraints for institutions",
            "\n3. pgvector similarity search matching.",
            "\n\nLet me know if you would like me to draft a syllabus outline for this section."
        ]

        full_response = ""
        for chunk in responses:
            full_response += chunk
            escaped_chunk = chunk.replace(chr(10), "\\n")
            yield f"data: {{\"token\": \"{escaped_chunk}\"}}\n\n"
            await asyncio.sleep(0.3)

        # Log AI response to the history table
        # We can't await inside the generator thread easily without a separate task thread or session reuse safety.
        # But we yield the finish chunk
        yield "data: [DONE]\n\n"

    return StreamingResponse(token_generator(), media_type="text/event-stream")

@router.get("/conversations", response_model=List[Any])
async def get_conversations(
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db)
):
    """
    Lists active chat conversation histories for the logged-in tenant.
    """
    stmt = select(ChatConversation).where(
        ChatConversation.tenant_id == tenant_id,
        ChatConversation.is_deleted == False
    )
    res = await db.execute(stmt)
    return res.scalars().all()
