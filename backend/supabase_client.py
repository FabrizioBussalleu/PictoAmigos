"""
Cliente de Supabase para PictoAmigos
"""
import os
from typing import Optional
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

class SupabaseClient:
    """Cliente singleton para Supabase"""
    
    _instance: Optional[Client] = None
    
    @classmethod
    def get_client(cls) -> Client:
        """
        Obtiene la instancia del cliente de Supabase.
        Crea una nueva instancia si no existe.
        """
        if cls._instance is None:
            url = os.environ.get("SUPABASE_URL")
            key = os.environ.get("SUPABASE_KEY")
            
            if not url or not key:
                raise ValueError(
                    "SUPABASE_URL y SUPABASE_KEY deben estar configuradas en las variables de entorno"
                )
            
            cls._instance = create_client(url, key)
        
        return cls._instance

# Instancia global para uso directo
supabase: Client = SupabaseClient.get_client()
