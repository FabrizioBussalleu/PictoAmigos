#!/usr/bin/env python3
"""
Script para iniciar el servidor backend de PictoAmigos
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "backend.api:app",
        host="127.0.0.1",
        port=8001,
        reload=True
    )
