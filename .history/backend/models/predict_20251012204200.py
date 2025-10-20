import json
import joblib
from pathlib import Path
from typing import List, Dict, Any
from sklearn.pipeline import Pipeline
from utils.pictos_mapping import PictosMapper


def load_model(path: str) -> Pipeline:
    """Carga un modelo entrenado desde un archivo joblib"""
    return joblib.load(path)


def predict(model: Pipeline, text: str, top_k: int = 3) -> List[tuple]:
    """Realiza predicción con el modelo y retorna top-k resultados"""
    probs = model.predict_proba([text])[0]
    classes = model.classes_
    paired = list(zip(classes, probs))
    paired.sort(key=lambda x: x[1], reverse=True)
    return paired[:top_k]


class ChatPredictor:
    """Clase principal para el sistema de predicción del chat"""
    
    def __init__(self, model_path: str = "backend/models/baseline_nb.joblib"):
        self.model_path = model_path
        self.model = None
        self.picto_mapper = PictoMapper()
        self.fallback_threshold = 0.45
        
    def load_model(self):
        """Carga el modelo si no está cargado"""
        if self.model is None:
            if Path(self.model_path).exists():
                self.model = load_model(self.model_path)
            else:
                print(f"Modelo no encontrado en {self.model_path}, creando modelo básico...")
                self._create_basic_model()
    
    def predict_intent(self, text: str, include_pictos: bool = True) -> Dict[str, Any]:
        """
        Predice la intención de un texto y opcionalmente incluye pictogramas
        
        Args:
            text: Texto a analizar
            include_pictos: Si incluir pictogramas en la respuesta
            
        Returns:
            Dict con predicción, probabilidades y pictogramas
        """
        self.load_model()
        
        # Obtener predicciones
        top_predictions = predict(self.model, text, top_k=3)
        best_intent, best_prob = top_predictions[0]
        
        # Determinar si es fallback
        status = 'OK' if best_prob >= self.fallback_threshold else 'FALLBACK'
        decided_intent = best_intent if status == 'OK' else 'FALLBACK'
        
        # Construir respuesta
        result = {
            'input': text,
            'prediction': [{'intent': intent, 'prob': float(prob)} for intent, prob in top_predictions],
            'decided_intent': decided_intent,
            'best_prob': float(best_prob),
            'status': status
        }
        
        # Agregar pictogramas si se solicita
        if include_pictos:
            result['pictos'] = self.picto_mapper.map_text(text)
        
        return result
    
    def get_response_for_intent(self, intent: str) -> str:
        """
        Genera una respuesta apropiada para cada intención
        
        Args:
            intent: Intención detectada
            
        Returns:
            Respuesta del asistente
        """
        responses = {
            "SALUDAR": "¡Hola! ¿Cómo estás hoy?",
            "PEDIR_OBJETO": "Te ayudo a conseguir lo que necesitas. ¿Qué objeto quieres?",
            "EMOCION": "Entiendo cómo te sientes. ¿Quieres hablar sobre eso?",
            "NECESIDAD_FISICA": "Te ayudo con eso. ¿Necesitas ir al baño o tienes hambre?",
            "DOLOR": "Me preocupas. ¿Dónde te duele? ¿Necesitas que llamemos a alguien?",
            "JUGAR": "¡Qué divertido! ¿A qué quieres jugar?",
            "DESPEDIR": "¡Hasta luego! Que tengas un buen día.",
            "AYUDA": "Por supuesto, te ayudo. ¿En qué necesitas ayuda?",
            "CONFIRMACION": "Perfecto, entendido.",
            "NEGACION": "Está bien, no hay problema.",
            "FALLBACK": "No estoy seguro de entenderte. ¿Puedes repetirlo de otra manera?"
        }
        
        return responses.get(intent, "No estoy seguro de cómo ayudarte.")
    
    def process_message(self, text: str) -> Dict[str, Any]:
        """
        Procesa un mensaje completo y retorna respuesta del asistente
        
        Args:
            text: Mensaje del usuario
            
        Returns:
            Dict con predicción, respuesta y pictogramas
        """
        # Obtener predicción
        prediction_result = self.predict_intent(text, include_pictos=True)
        
        # Generar respuesta
        response = self.get_response_for_intent(prediction_result['decided_intent'])
        
        # Combinar resultados
        return {
            **prediction_result,
            'response': response,
            'timestamp': json.dumps({'timestamp': 'now'})  # Se puede mejorar con datetime
        }
    
    def _create_basic_model(self):
        """Crea un modelo básico para casos donde no existe el modelo entrenado"""
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.naive_bayes import MultinomialNB
        from sklearn.pipeline import Pipeline
        
        # Crear un modelo básico con datos mínimos
        basic_data = [
            ("hola", "SALUDAR"),
            ("buenos días", "SALUDAR"),
            ("adiós", "DESPEDIR"),
            ("hasta luego", "DESPEDIR"),
            ("quiero jugar", "JUGAR"),
            ("tengo hambre", "NECESIDAD_FISICA"),
            ("me duele", "DOLOR"),
            ("ayuda", "AYUDA"),
            ("sí", "CONFIRMACION"),
            ("no", "NEGACION")
        ]
        
        texts = [item[0] for item in basic_data]
        labels = [item[1] for item in basic_data]
        
        # Crear pipeline básico
        pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=100)),
            ('nb', MultinomialNB())
        ])
        
        # Entrenar modelo básico
        pipeline.fit(texts, labels)
        
        # Guardar modelo básico
        Path(self.model_path).parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(pipeline, self.model_path)
        
        self.model = pipeline
        print("Modelo básico creado y guardado exitosamente")
