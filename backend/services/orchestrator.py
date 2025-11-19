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
from backend.services.semantic_memory import SemanticIntentMemory


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
        semantic_memory: Optional[SemanticIntentMemory] = None,
    ) -> None:
        settings = get_settings()
        self.predictor = predictor
        self.max_history = max_history or settings.orchestrator_history_size
        self.fallback_threshold = fallback_threshold or settings.fallback_threshold
        self.intent_thresholds = intent_thresholds or {}
        self.llm_responder = llm_responder
        self.sessions: Dict[str, Deque[Dict[str, str]]] = {}
        self.max_pictograms = settings.max_pictograms
        if semantic_memory is not None:
            self.semantic_memory = semantic_memory
        elif settings.semantic_memory_enabled:
            self.semantic_memory = SemanticIntentMemory(
                dataset_path=settings.semantic_memory_dataset,
                per_intent=settings.semantic_memory_samples_per_intent,
                score_cutoff=settings.semantic_memory_score_cutoff,
            )
        else:
            self.semantic_memory = None

    def handle_message(self, payload: ChatRequest) -> ChatResponse:
        session_id = payload.session_id or str(uuid4())
        history = self.sessions.setdefault(session_id, deque(maxlen=self.max_history))

        prediction = self.predictor.predict_intent(
            payload.message.text,
            include_pictos=payload.message.include_pictograms,
            max_pictos=self.max_pictograms,
        )

        predictions = [IntentProbability(**item) for item in prediction.get('predictions', [])]
        alternatives = predictions.copy()

        decided_intent = prediction.get('decided_intent', 'FALLBACK')
        confidence = float(prediction.get('confidence', 0.0))
        threshold = self._threshold_for_intent(decided_intent)

        memory_used = False
        if self.semantic_memory is not None and (
            decided_intent == 'FALLBACK' or confidence < threshold
        ):
            match = self.semantic_memory.match(payload.message.text)
            if match is not None:
                decided_intent = match.intent
                confidence = max(confidence, match.score)
                memory_used = True
                candidate = IntentProbability(intent=match.intent, confidence=match.score)
                if not any(item.intent == candidate.intent for item in alternatives):
                    alternatives.insert(0, candidate)

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

        pipeline_label = 'nb'
        if memory_used:
            pipeline_label += '+memory'
        if llm_used:
            pipeline_label += '+llm'

        orchestrator_info = OrchestratorInfo(
            pipeline=pipeline_label,
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
