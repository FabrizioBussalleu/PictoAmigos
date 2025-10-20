"""Test simple de la API actualizada"""
import sys
sys.path.append('.')

from backend.simple_api import predictor

# Test del predictor
try:
    print("Probando predictor actualizado...")
    result = predictor.process_message("hola quiero jugar")
    print(f"✅ Éxito: {result['decided_intent']} ({result['best_prob']:.3f})")
    print(f"Respuesta: {result['response']}")
    print(f"Pictogramas: {len(result.get('pictos', []))} encontrados")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()