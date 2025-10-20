"""
API entry point para Vercel - Versión simplificada
"""
from backend.simple_api import app

# Exportar la aplicación para Vercel
handler = app
