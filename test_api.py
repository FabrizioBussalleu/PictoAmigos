#!/usr/bin/env python3
"""
Script de prueba para verificar que la API funciona
"""
import requests
import time
import subprocess
import sys
from pathlib import Path

def test_api():
    """Prueba la API del sistema de chat"""
    print("Probando API del sistema de chat...")
    
    # Verificar que el modelo existe
    model_path = Path("backend/models/baseline_nb.joblib")
    if not model_path.exists():
        print("Error: Modelo no encontrado")
        return False
    
    print("Modelo encontrado:", model_path)
    
    # Probar importación del predictor
    try:
        from backend.models.predict import ChatPredictor
        predictor = ChatPredictor()
        print("Predictor importado correctamente")
    except Exception as e:
        print(f"Error importando predictor: {e}")
        return False
    
    # Probar predicción
    try:
        result = predictor.predict_intent("hola quiero jugar", include_pictos=True)
        print("Predicción exitosa:")
        print(f"  Input: {result['input']}")
        print(f"  Intent: {result['decided_intent']}")
        print(f"  Confidence: {result['best_prob']:.2f}")
        print(f"  Pictos: {result.get('pictos', [])}")
        return True
    except Exception as e:
        print(f"Error en predicción: {e}")
        return False

if __name__ == "__main__":
    success = test_api()
    if success:
        print("\nSistema funcionando correctamente!")
        print("Puedes iniciar el servidor con: python backend/api.py")
    else:
        print("\nHay problemas con el sistema")
        sys.exit(1)
