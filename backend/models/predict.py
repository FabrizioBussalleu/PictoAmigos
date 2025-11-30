import joblib
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence

from sklearn.pipeline import Pipeline

from backend.utils.pictos_mapping import PictosMapper


def load_model(path: str) -> Pipeline:
    """Carga un modelo entrenado desde un archivo joblib"""
    return joblib.load(path)


def predict(model: Pipeline, text: str, top_k: int = 3) -> List[tuple]:
    """Realiza predicción con el modelo y retorna top-k resultados."""

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
        self.picto_mapper = PictosMapper()
        self.fallback_threshold = 0.45
        self.supported_intents: Sequence[str] = (
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
            "FALLBACK",
        )
        self.intent_responses = self._build_intent_responses()
        
    def load_model(self):
        """Carga el modelo si no está cargado"""
        if self.model is None:
            if Path(self.model_path).exists():
                self.model = load_model(self.model_path)
                try:
                    classes = getattr(self.model, 'classes_', None) or getattr(self.model[-1], 'classes_', None)
                    if classes is not None:
                        self.supported_intents = tuple(str(cls) for cls in classes)
                except Exception:
                    pass
            else:
                print(f"Modelo no encontrado en {self.model_path}, creando modelo básico...")
                self._create_basic_model()
    
    def predict_intent(
        self,
        text: str,
        include_pictos: bool = True,
        max_pictos: int = 5,
    ) -> Dict[str, Any]:
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
        top_predictions = predict(self.model, text, top_k=3) if self.model else []

        if top_predictions:
            best_intent, best_prob = top_predictions[0]
        else:
            best_intent, best_prob = "FALLBACK", 0.0
        
        # Determinar si es fallback
        status = 'OK' if best_prob >= self.fallback_threshold else 'FALLBACK'
        decided_intent = best_intent if status == 'OK' else 'FALLBACK'
        
        # Construir respuesta
        predictions_payload = [
            {'intent': str(intent), 'confidence': float(prob)}
            for intent, prob in top_predictions
        ]

        result = {
            'input': text,
            'predictions': predictions_payload,
            'decided_intent': decided_intent,
            'confidence': float(best_prob),
            'status': status,
        }
        
        # Agregar pictogramas si se solicita
        if include_pictos:
            result['pictograms'] = self.picto_mapper.map_text_with_metadata(
                text,
                max_pictos=max_pictos,
            )
        
        return result
    
    def get_response_for_intent(self, intent: str) -> str:
        """
        Genera una respuesta apropiada para cada intención
        
        Args:
            intent: Intención detectada
            
        Returns:
            Respuesta del asistente
        """
        return self.intent_responses.get(intent, self.intent_responses["FALLBACK"])

    def _build_intent_responses(self) -> Dict[str, str]:
        return {
            "SALUDAR": "¡Hola! Qué gusto verte, ¿cómo te sientes hoy?",
            "DESPEDIR": "¡Hasta luego! Aquí estaré cuando quieras seguir hablando.",
            "JUGAR": "¡Me encanta jugar! ¿Qué juego te gustaría ahora?",
            "PEDIR_AYUDA": "Claro que sí, cuéntame en qué necesitas ayuda y lo resolvemos juntos.",
            "EXPRESAR_NECESIDAD": "Entiendo, ¿qué puedo hacer para ayudarte con eso que necesitas?",
            "EXPRESAR_EMOCION": "Gracias por compartir cómo te sientes. ¿Quieres que pensemos en algo que te ayude?",
            "COMER_BEBER": "Puedo ayudarte con la comida o bebida. ¿Qué te gustaría tomar o comer?",
            "DESCRIBIR_DOLOR": "Lo siento, ¿dónde sientes ese dolor? Vamos a buscar una solución.",
            "IR_LUGAR": "Perfecto, ¿quieres que te acompañe o que avise a alguien para ir al lugar?",
            "AGRADECER": "¡De nada! Estoy aquí para ayudarte siempre.",
            "FALLBACK": "No estoy seguro de entenderte. ¿Puedes repetirlo con otras palabras?",
        }

    def get_supported_intents(self) -> Sequence[str]:
        return self.supported_intents
    
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
            'response_text': response,
        }
    
    def _create_basic_model(self):
        """Crea un modelo básico para casos donde no existe el modelo entrenado"""
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.naive_bayes import MultinomialNB
        from sklearn.pipeline import Pipeline
        
        # Crear un modelo básico con datos mínimos
        # Datos básicos alineados con las intenciones soportadas por el sistema
        basic_data = [
            ("hola", "SALUDAR"),
            ("buenos días", "SALUDAR"),
            ("buenas tardes", "SALUDAR"),
            ("adiós", "DESPEDIR"),
            ("hasta luego", "DESPEDIR"),
            ("quiero jugar", "JUGAR"),
            ("juguemos", "JUGAR"),
            ("necesito ayuda", "PEDIR_AYUDA"),
            ("ayuda por favor", "PEDIR_AYUDA"),
            ("tengo hambre", "EXPRESAR_NECESIDAD"),
            ("quiero comer", "COMER_BEBER"),
            ("quiero beber", "COMER_BEBER"),
            ("me duele la cabeza", "DESCRIBIR_DOLOR"),
            ("me duele", "DESCRIBIR_DOLOR"),
            ("estoy feliz", "EXPRESAR_EMOCION"),
            ("estoy triste", "EXPRESAR_EMOCION"),
            ("vamos al parque", "IR_LUGAR"),
            ("quiero ir a casa", "IR_LUGAR"),
            ("gracias", "AGRADECER"),
            ("muchas gracias", "AGRADECER"),
        ]
        
        texts = [item[0] for item in basic_data]
        labels = [item[1] for item in basic_data]
        
        # Crear pipeline básico
        pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=300, ngram_range=(1,2))),
            ('nb', MultinomialNB())
        ])
        
        # Entrenar modelo básico
        pipeline.fit(texts, labels)
        
        # Guardar modelo básico
        Path(self.model_path).parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(pipeline, self.model_path)
        
        self.model = pipeline
        # Ajustar el umbral por defecto para ser menos estricto con datos básicos
        self.fallback_threshold = 0.35
        print("Modelo básico creado y guardado exitosamente (intenciones alineadas)")
