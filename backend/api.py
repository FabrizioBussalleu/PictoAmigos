from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import json
from models.predict import ChatPredictor

# Crear aplicación FastAPI
app = FastAPI(
    title="Chat IA API",
    description="API para el sistema de chat con inteligencia artificial",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://localhost:8080",
        "https://*.vercel.app",  # Vercel deployments
        "https://tp-ia.vercel.app",  # Tu dominio específico de Vercel
        "https://tp-ia-git-main-usuario.vercel.app"  # URL típica de Vercel
    ],  # React dev server y producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar predictor
predictor = ChatPredictor()

# Modelos Pydantic
class ChatMessage(BaseModel):
    text: str
    include_pictos: bool = True

class ChatResponse(BaseModel):
    input: str
    prediction: list
    decided_intent: str
    best_prob: float
    status: str
    response: str
    pictos: Optional[list] = None
    timestamp: str

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool

# Endpoints
@app.get("/", response_model=HealthResponse)
async def root():
    """Endpoint de salud básico"""
    try:
        predictor.load_model()
        return HealthResponse(status="ok", model_loaded=True)
    except Exception as e:
        return HealthResponse(status="error", model_loaded=False)

@app.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """
    Procesa un mensaje del chat y retorna la respuesta del asistente
    
    Args:
        message: Mensaje del usuario con texto y opciones
        
    Returns:
        Respuesta del asistente con predicción e intención
    """
    try:
        # Procesar mensaje
        result = predictor.process_message(message.text)
        
        # Construir respuesta
        response = ChatResponse(
            input=result['input'],
            prediction=result['prediction'],
            decided_intent=result['decided_intent'],
            best_prob=result['best_prob'],
            status=result['status'],
            response=result['response'],
            pictos=result.get('pictos', []) if message.include_pictos else None,
            timestamp=result.get('timestamp', 'now')
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando mensaje: {str(e)}")

@app.get("/intents")
async def get_intents():
    """Retorna la lista de intenciones soportadas"""
    intents = [
        "SALUDAR", "PEDIR_OBJETO", "EMOCION", "NECESIDAD_FISICA", 
        "DOLOR", "JUGAR", "DESPEDIR", "AYUDA", "CONFIRMACION", 
        "NEGACION", "FALLBACK"
    ]
    return {"intents": intents}

@app.get("/health")
async def health_check():
    """Verificación de salud del sistema"""
    try:
        predictor.load_model()
        return {
            "status": "healthy",
            "model_loaded": True,
            "message": "Sistema funcionando correctamente"
        }
    except Exception as e:
        return {
            "status": "unhealthy", 
            "model_loaded": False,
            "error": str(e)
        }

# Función para ejecutar el servidor
def run_server(host: str = "127.0.0.1", port: int = 8000):
    """Ejecuta el servidor FastAPI"""
    import uvicorn
    uvicorn.run(app, host=host, port=port)

if __name__ == "__main__":
    run_server()
