#!/usr/bin/env python3
"""
Script para ejecutar el servidor desde la raíz del proyecto
"""
import sys
import os
from pathlib import Path

# Agregar el directorio backend al path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

# Cambiar al directorio backend
os.chdir(backend_dir)

# Importar y ejecutar
if __name__ == "__main__":
    import uvicorn
    from api import app
    
    print("=== Servidor de Chat con IA ===")
    print("Iniciando servidor...")
    print("Servidor disponible en: http://localhost:8000")
    print("Documentacion API: http://localhost:8000/docs")
    print("Health check: http://localhost:8000/health")
    print("Para probar el chat: http://localhost:8000/chat")
    print("\nPara detener el servidor presiona Ctrl+C")
    print("=" * 40)
    
    try:
        uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)
    except KeyboardInterrupt:
        print("\nServidor detenido")

