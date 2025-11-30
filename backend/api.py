from pathlib import Path
from typing import Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.config import get_settings
from backend.models.predict import ChatPredictor
from backend.schemas import ChatRequest, ChatResponse, HealthResponse
from backend.services.orchestrator import ConversationOrchestrator

# Importar cliente de Supabase
try:
    from backend.supabase_client import supabase
    SUPABASE_AVAILABLE = True
except Exception:
    SUPABASE_AVAILABLE = False
    supabase = None

SUPPORTED_INTENTS = [
    "SALUDAR",
    "DESPEDIR",
    "JUGAR",
    "PEDIR_AYUDA",
    "EXPRESAR_NECESIDAD",
    "EXPRESAR_EMOCION",
    "COMER_BEBER",
    "DESCRIBIR_DOLOR",
    "IR_LUGAR",
    "AGRADECER",
]


def _build_predictor() -> ChatPredictor:
    settings = get_settings()
    model_path = Path(__file__).parent / 'models' / 'baseline_nb.joblib'
    predictor = ChatPredictor(model_path=str(model_path))
    predictor.fallback_threshold = settings.fallback_threshold
    return predictor


def create_app(predictor: ChatPredictor | None = None) -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Chat IA API",
        description="API para el sistema de chat con inteligencia artificial",
        version="1.1.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_origin_regex=settings.cors_origin_regex,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )

    predictor_instance = predictor or _build_predictor()
    if hasattr(predictor_instance, 'fallback_threshold'):
        predictor_instance.fallback_threshold = settings.fallback_threshold

    orchestrator = ConversationOrchestrator(predictor=predictor_instance)

    app.state.predictor = predictor_instance
    app.state.orchestrator = orchestrator

    @app.on_event("startup")
    async def _load_model() -> None:  # pragma: no cover - se ejecuta al levantar FastAPI
        try:
            predictor_instance.load_model()
        except Exception as exc:  # pragma: no cover - log de arranque
            app.logger.error("No se pudo cargar el modelo al iniciar: %s", exc)

    @app.get("/", response_model=HealthResponse)
    async def root() -> HealthResponse:
        try:
            predictor_instance.load_model()
            return HealthResponse(status="healthy", model_loaded=True)
        except Exception:
            return HealthResponse(status="error", model_loaded=False)

    @app.get("/health", response_model=HealthResponse)
    async def health_check() -> HealthResponse:
        try:
            predictor_instance.load_model()
            return HealthResponse(status="healthy", model_loaded=True)
        except Exception as exc:
            app.logger.exception("Fallo en health check", exc_info=exc)
            return HealthResponse(status="unhealthy", model_loaded=False)

    @app.get("/intents")
    async def get_intents() -> Dict[str, List[str]]:
        if hasattr(predictor_instance, 'get_supported_intents'):
            intents = list(predictor_instance.get_supported_intents())  # type: ignore[attr-defined]
        else:
            intents = SUPPORTED_INTENTS
        return {"intents": intents}

    @app.post("/chat", response_model=ChatResponse)
    async def chat_endpoint(payload: ChatRequest) -> ChatResponse:
        try:
            return orchestrator.handle_message(payload)
        except Exception as exc:
            app.logger.exception("Error procesando mensaje", exc_info=exc)
            raise HTTPException(status_code=500, detail="Error procesando mensaje") from exc

    return app


app = create_app()


def run_server(host: str | None = None, port: int | None = None) -> None:
    """Ejecuta el servidor FastAPI utilizando uvicorn."""

    settings = get_settings()
    import uvicorn

    uvicorn.run(
        "backend.api:app",
        host=host or settings.api_host,
        port=port or settings.api_port,
        reload=False,
    )


if __name__ == "__main__":
    run_server()
