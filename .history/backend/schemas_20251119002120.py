from __future__ import annotations

# Esquemas Pydantic compartidos para la API de chat.

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, HttpUrl, model_validator


class MessageMetadata(BaseModel):
    channel: Optional[str] = None
    language: Optional[str] = None
    raw: Dict[str, Any] = Field(default_factory=dict)


class IncomingMessage(BaseModel):
    text: str = Field(..., min_length=1, max_length=280)
    include_pictograms: bool = Field(default=True, alias='include_pictos')
    metadata: MessageMetadata = Field(default_factory=MessageMetadata)


class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: IncomingMessage

    """Esquemas Pydantic compartidos para la API de chat."""
    from __future__ import annotations

    from datetime import datetime
    from typing import Any, Dict, List, Optional

    from pydantic import BaseModel, Field, HttpUrl, model_validator


    class MessageMetadata(BaseModel):
        channel: Optional[str] = None
        language: Optional[str] = None
        raw: Dict[str, Any] = Field(default_factory=dict)


    class IncomingMessage(BaseModel):
        text: str = Field(..., min_length=1, max_length=280)
        include_pictograms: bool = Field(default=True, alias='include_pictos')
        metadata: MessageMetadata = Field(default_factory=MessageMetadata)


    class ChatRequest(BaseModel):
        session_id: Optional[str] = None
        message: IncomingMessage

        @model_validator(mode='before')
        @classmethod
        def adapt_legacy_payload(cls, value: Any):  # type: ignore[override]
            if isinstance(value, dict):
                if 'message' not in value and 'text' in value:
                    message_payload = {
                        'text': value.get('text'),
                        'include_pictograms': value.get('include_pictos', value.get('include_pictograms', True)),
                        'metadata': value.get('metadata', {}),
                    }
                    return {
                        'session_id': value.get('session_id'),
                        'message': message_payload,
                    }
            return value


    class IntentProbability(BaseModel):
        intent: str
        confidence: float = Field(ge=0.0, le=1.0)


    class PictogramSuggestion(BaseModel):
        id: str | int
        label: str
        url: HttpUrl
        confidence: Optional[float] = Field(default=None, ge=0.0, le=1.0)
        token: Optional[str] = None


    class IntentBreakdown(BaseModel):
        decided: str
        confidence: float = Field(ge=0.0, le=1.0)
        alternatives: List[IntentProbability] = Field(default_factory=list)


    class AssistantResponse(BaseModel):
        text: str
        tone: str = 'neutral'
        pictograms: List[PictogramSuggestion] = Field(default_factory=list)


    class OrchestratorInfo(BaseModel):
        pipeline: str = 'nb'
        llm_used: bool = False
        threshold: float = Field(ge=0.0, le=1.0, default=0.45)


    class ChatResponse(BaseModel):
        session_id: str
        turn_id: str
        received_at: datetime
        intent: IntentBreakdown
        response: AssistantResponse
        orchestrator: OrchestratorInfo


    class HealthResponse(BaseModel):
        status: str
        model_loaded: bool