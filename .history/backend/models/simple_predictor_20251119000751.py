"""Predictor simple basado en reglas para reducir el tamaño del deploy."""
from datetime import datetime
from typing import Any, Dict, List

from backend.utils.pictos_mapping import PictoMapper


class SimpleChatPredictor:
    """Predictor simple basado en reglas para Vercel"""
    
    def __init__(self):
        self.picto_mapper = PictoMapper()
        self.fallback_threshold = 0.45
        
        # Diccionario de reglas simples
        self.intent_rules = {
            "SALUDAR": [
                "hola", "buenos días", "buenas tardes", "buenas noches",
                "hey", "hi", "saludos", "qué tal", "cómo estás"
            ],
            "DESPEDIR": [
                "adiós", "hasta luego", "hasta pronto", "nos vemos",
                "chao", "bye", "hasta la vista"
            ],
            "JUGAR": [
                "jugar", "juego", "diversión", "entretenimiento",
                "quiero jugar", "vamos a jugar", "juguemos"
            ],
            "NECESIDAD_FISICA": [
                "hambre", "sed", "sueño", "cansado", "tengo hambre",
                "tengo sed", "quiero comer", "quiero beber"
            ],
            "DOLOR": [
                "dolor", "duele", "me duele", "herida", "lesión",
                "malestar", "molestia"
            ],
            "AYUDA": [
                "ayuda", "socorro", "auxilio", "necesito ayuda",
                "puedes ayudarme", "no sé qué hacer"
            ],
            "CONFIRMACION": [
                "sí", "si", "correcto", "exacto", "claro",
                "por supuesto", "obvio", "vale"
            ],
            "NEGACION": [
                "no", "nunca", "jamás", "nada", "ninguno",
                "incorrecto", "falso", "mentira"
            ],
            "EMOCION": [
                "feliz", "triste", "enojado", "contento", "alegre",
                "deprimido", "emocionado", "nervioso"
            ],
            "PEDIR_OBJETO": [
                "quiero", "necesito", "dame", "pásame", "trae",
                "busco", "donde está", "dónde está"
            ]
        }
        
        # Respuestas por intención
        self.responses = {
            "SALUDAR": "¡Hola! ¿Cómo estás hoy?",
            "DESPEDIR": "¡Hasta luego! Que tengas un buen día.",
            "JUGAR": "¡Qué divertido! ¿A qué te gustaría jugar?",
            "NECESIDAD_FISICA": "Entiendo que tienes una necesidad física. ¿Puedo ayudarte?",
            "DOLOR": "Lamento que tengas dolor. ¿Te duele mucho?",
            "AYUDA": "Por supuesto, estoy aquí para ayudarte. ¿En qué necesitas ayuda?",
            "CONFIRMACION": "Perfecto, entiendo que estás de acuerdo.",
            "NEGACION": "Entiendo que no estás de acuerdo o no quieres.",
            "EMOCION": "Veo que tienes emociones. ¿Quieres hablar sobre cómo te sientes?",
            "PEDIR_OBJETO": "Entiendo que necesitas algo. ¿Qué es lo que buscas?",
            "FALLBACK": "No estoy seguro de entenderte completamente. ¿Puedes explicarme mejor?"
        }

    def load_model(self) -> None:
        """Compatibilidad con la interfaz del predictor principal."""
        return None
    
    def predict_intent(
        self,
        text: str,
        include_pictos: bool = True,
        max_pictos: int = 5,
    ) -> Dict[str, Any]:
        """Predice la intención usando reglas simples."""
        text_lower = text.lower().strip()
        
        # Buscar coincidencias en las reglas
        best_intent = "FALLBACK"
        best_score = 0.0
        all_scores = []
        
        for intent, keywords in self.intent_rules.items():
            score = 0.0
            matches = 0
            
            for keyword in keywords:
                if keyword in text_lower:
                    matches += 1
                    score += 1.0
            
            if matches > 0:
                # Normalizar score por número de keywords
                score = score / len(keywords)
                all_scores.append((intent, score))
                
                if score > best_score:
                    best_score = score
                    best_intent = intent
        
        # Si no hay coincidencias, usar FALLBACK
        if best_score == 0.0:
            best_intent = "FALLBACK"
            best_score = 0.0
        
        # Crear lista de probabilidades
        predictions = [
            {'intent': intent, 'confidence': float(score)}
            for intent, score in sorted(all_scores, key=lambda item: item[1], reverse=True)
        ]

        if not any(item['intent'] == 'FALLBACK' for item in predictions):
            predictions.append({'intent': 'FALLBACK', 'confidence': 0.0})

        pictos: List[Dict[str, Any]] = []
        if include_pictos:
            pictos = self.picto_mapper.map_text_with_metadata(text, max_pictos=max_pictos)

        return {
            'input': text,
            'predictions': predictions,
            'decided_intent': best_intent,
            'confidence': float(best_score),
            'status': 'OK' if best_score >= self.fallback_threshold else 'FALLBACK',
            'pictograms': pictos,
        }
    
    def get_response_for_intent(self, intent: str) -> str:
        """Obtiene la respuesta para una intención"""
        return self.responses.get(intent, self.responses["FALLBACK"])
    
    def process_message(self, text: str) -> Dict[str, Any]:
        """
        Procesa un mensaje completo y retorna la respuesta
        
        Args:
            text: Mensaje del usuario
            
        Returns:
            Dict con predicción, respuesta y pictogramas
        """
        # Obtener predicción
        prediction_result = self.predict_intent(text, include_pictos=True)

        return {
            **prediction_result,
            'response_text': self.get_response_for_intent(prediction_result['decided_intent']),
            'generated_at': datetime.utcnow().isoformat(),
        }
