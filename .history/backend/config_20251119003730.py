"""Configuración centralizada para el backend de PictoAmigos."""
from functools import lru_cache
from typing import List, Optional

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuración de la aplicación."""

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=False,
        extra='ignore',
    )

    api_host: str = '127.0.0.1'
    api_port: int = 8000
    cors_origins: List[str] = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:8080',
    ]
    cors_origin_regex: Optional[str] = r'https://.*\.vercel\.app'
    fallback_threshold: float = 0.45
    max_pictograms: int = 5
    orchestrator_history_size: int = 10
    llm_provider: Optional[str] = None
    openai_api_key: Optional[str] = None
    log_level: str = 'info'

    @field_validator('cors_origins', mode='before')
    @classmethod
    def _parse_origins(cls, value):
        if isinstance(value, str):
            if not value.strip():
                return []
            if value.startswith('[') and value.endswith(']'):
                cleaned = value.strip('[]')
                return [item.strip().strip('"\'') for item in cleaned.split(',') if item.strip()]
            return [item.strip() for item in value.split(',') if item.strip()]
        return value


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Retorna la configuración cacheada."""

    return Settings()  # type: ignore[call-arg]
