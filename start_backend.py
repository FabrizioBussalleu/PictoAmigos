#!/usr/bin/env python3
"""
Script de inicio para el backend del sistema de chat con IA
"""
import subprocess
import sys
import os
from pathlib import Path

def check_python_version():
    """Verifica que la versión de Python sea compatible"""
    if sys.version_info < (3, 8):
        print("❌ Se requiere Python 3.8 o superior")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detectado")

def install_dependencies():
    """Instala las dependencias de Python"""
    print("📦 Instalando dependencias...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        print("✅ Dependencias instaladas correctamente")
    except subprocess.CalledProcessError:
        print("❌ Error instalando dependencias")
        sys.exit(1)

def setup_backend():
    """Configura el backend si es necesario"""
    print("🔧 Configurando backend...")
    try:
        # Ejecutar setup del backend
        subprocess.run([sys.executable, "backend/setup.py"], check=True)
        print("✅ Backend configurado correctamente")
    except subprocess.CalledProcessError:
        print("⚠️  Error en configuración, continuando...")

def start_server():
    """Inicia el servidor FastAPI"""
    print("🚀 Iniciando servidor...")
    print("📍 Servidor disponible en: http://localhost:8000")
    print("📖 Documentación API: http://localhost:8000/docs")
    print("🔍 Health check: http://localhost:8000/health")
    print("\n💡 Para detener el servidor presiona Ctrl+C")
    
    try:
        # Cambiar al directorio del backend
        os.chdir("backend")
        subprocess.run([sys.executable, "api.py"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Servidor detenido")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error iniciando servidor: {e}")
        sys.exit(1)

def main():
    """Función principal"""
    print("🤖 Sistema de Chat con IA - Backend")
    print("=" * 50)
    
    # Verificar que estamos en el directorio correcto
    if not Path("backend").exists():
        print("❌ No se encontró la carpeta 'backend'")
        print("💡 Asegúrate de ejecutar este script desde la raíz del proyecto")
        sys.exit(1)
    
    check_python_version()
    install_dependencies()
    setup_backend()
    start_server()

if __name__ == "__main__":
    main()

