"""Orquestador de conversación que combina el clasificador NB con (opcionalmente) un LLM."""
from __future__ import annotations

from collections import deque
from datetime import datetime
from typing import Deque, Dict, List, Optional
from uuid import uuid4

from backend.config import get_settings
from backend.models.predict import ChatPredictor
from backend.schemas import (
    AssistantResponse,
    ChatRequest,
    ChatResponse,
    IntentBreakdown,
    IntentProbability,
    OrchestratorInfo,
    PictogramSuggestion,
)


class BaseLLMResponder:
    """Interfaz mínima para clientes LLM opcionales."""

    def generate(self, history: List[Dict[str, str]], message: str, intent: str) -> Optional[str]:  # pragma: no cover - para implementar en subclases
        raise NotImplementedError


class ConversationOrchestrator:
    """Gestiona el pipeline de conversación, historial y selección de respuesta."""

    def __init__(
        self,
        predictor: ChatPredictor,
        *,
        max_history: Optional[int] = None,
        fallback_threshold: Optional[float] = None,
        intent_thresholds: Optional[Dict[str, float]] = None,
        llm_responder: Optional[BaseLLMResponder] = None,
    ) -> None:
        settings = get_settings()
        self.predictor = predictor
        self.max_history = max_history or settings.orchestrator_history_size
        self.fallback_threshold = fallback_threshold or settings.fallback_threshold
        self.intent_thresholds = intent_thresholds or {}
        self.llm_responder = llm_responder
        self.sessions: Dict[str, Deque[Dict[str, str]]] = {}

    def handle_message(self, payload: ChatRequest) -> ChatResponse:
        session_id = payload.session_id or str(uuid4())
        history = self.sessions.setdefault(session_id, deque(maxlen=self.max_history))

        prediction = self.predictor.predict_intent(
            payload.message.text,
            include_pictos=payload.message.include_pictograms,
            max_pictos=get_settings().max_pictograms,
        )

        predictions = [IntentProbability(**item) for item in prediction.get('predictions', [])]
        alternatives = predictions

        decided_intent = prediction.get('decided_intent', 'FALLBACK')
        confidence = float(prediction.get('confidence', 0.0))
        threshold = self._threshold_for_intent(decided_intent)

        tone = 'enthusiastic' if confidence >= 0.75 else 'supportive'
        llm_used = False
        response_text = self.predictor.get_response_for_intent(decided_intent)

        if confidence < threshold and self.llm_responder is not None:
            llm_reply = self.llm_responder.generate(list(history), payload.message.text, decided_intent)
            if llm_reply:
                response_text = llm_reply
                tone = 'conversational'
                llm_used = True

        pictograms_payload = []
        if payload.message.include_pictograms:
            pictograms_payload = [
                PictogramSuggestion(**picto)
                for picto in prediction.get('pictograms', [])
            ]

        intent_info = IntentBreakdown(
            decided=decided_intent,
            confidence=confidence,
            alternatives=alternatives,
        )

        assistant_response = AssistantResponse(
            text=response_text,
            tone=tone,
            pictograms=pictograms_payload,
        )

        orchestrator_info = OrchestratorInfo(
            pipeline='nb+llm' if llm_used else 'nb',
            llm_used=llm_used,
            threshold=threshold,
        )

        turn_id = str(uuid4())
        received_at = datetime.utcnow()

        history.append(
            {
                'role': 'user',
                'text': payload.message.text,
            }
        )
        history.append(
            {
                'role': 'assistant',
                'text': assistant_response.text,
            }
        )

        return ChatResponse(
            session_id=session_id,
            turn_id=turn_id,
            received_at=received_at,
            intent=intent_info,
            response=assistant_response,
            orchestrator=orchestrator_info,
        )

    def _threshold_for_intent(self, intent: str) -> float:
        return float(self.intent_thresholds.get(intent, self.fallback_threshold))
