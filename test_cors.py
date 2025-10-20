#!/usr/bin/env python3
"""
Script para probar la configuración de CORS
"""
import requests

def test_cors():
    """Prueba la configuración de CORS"""
    url = "http://127.0.0.1:8000/health"
    
    # Simular una petición desde localhost:8080
    headers = {
        'Origin': 'http://localhost:8080',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
    }
    
    try:
        print("Probando configuración de CORS...")
        print(f"Origen: {headers['Origin']}")
        
        # Hacer petición OPTIONS (preflight)
        response = requests.options(url, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print("Headers de respuesta:")
        for header, value in response.headers.items():
            if 'access-control' in header.lower():
                print(f"  {header}: {value}")
        
        # Verificar si CORS está configurado
        cors_origin = response.headers.get('Access-Control-Allow-Origin')
        if cors_origin:
            print(f"\nCORS configurado correctamente: {cors_origin}")
            return True
        else:
            print("\nCORS no configurado correctamente")
            return False
            
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    success = test_cors()
    if success:
        print("\nCORS funcionando correctamente!")
    else:
        print("\nHay problemas con CORS")
