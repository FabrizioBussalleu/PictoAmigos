"""Test directo del predictor sin FastAPI"""
import sys
import os
sys.path.append('.')
sys.path.append('./backend')

# Test directo del predictor
try:
    print("Probando predictor actualizado...")
    from backend.models.predict import ChatPredictor
    from pathlib import Path
    
    # Crear predictor con ruta correcta
    model_path = Path("backend/models/baseline_nb.joblib")
    predictor = ChatPredictor(model_path=str(model_path))
    
    result = predictor.process_message("hola quiero jugar")
    print(f"✅ Éxito: {result['decided_intent']} ({result['best_prob']:.3f})")
    print(f"Respuesta: {result['response']}")
    print(f"Pictogramas: {len(result.get('pictos', []))} encontrados")
    print(f"URLs ejemplo: {result.get('pictos', [])[:3]}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()