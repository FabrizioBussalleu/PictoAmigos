import json
import re
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List, Optional, Set

from unidecode import unidecode

try:
    import spacy  # type: ignore
except ImportError:  # pragma: no cover - spaCy es opcional
    spacy = None  # type: ignore[assignment]

_SPACY_MODEL = None

# Archivos de datasets ARASAAC - usar rutas relativas al archivo actual
_current_dir = Path(__file__).parent.parent  # Ir al directorio backend
DATASET_PICTO_FILE = str(_current_dir / "dataset_picto.json")
DATASET_WORDS_FILE = str(_current_dir / "dataset_words.json")
MAPPING_FILE = str(_current_dir / "pictos_mapping.json")  # Fallback file

# Mapeo de fallback para casos donde no hay archivo o falla la carga
DEFAULT_MAPPING = {
    "hola": [6522, 6009],
    "adios": [2321, 6523],
    "gracias": [2417, 6533],
    "ayuda": [2280, 6487],
    "agua": [2248, 6889],
    "casa": [2317, 6964],
    "comida": [4610, 4611],
    "niño": [2485, 7176],
    "jugar": [2439, 6537],
    "feliz": [9907, 32123],
    "triste": [2606, 11959],
    "dolor": [2368, 6478],
    "dormir": [2369, 6479],
}

STOP_WORDS = {"por", "la", "el", "de", "a", "y", "en", "un", "una", "al", "lo", "con", "que", "es", "se"}


def normalize_token(token: str) -> str:
    """Normaliza un token usando reglas básicas."""
    cleaned = token.lower().strip()
    cleaned = unidecode(cleaned)
    cleaned = re.sub(r"[^a-z0-9]", "", cleaned)
    return cleaned


@lru_cache(maxsize=1)
def _load_spacy_model():
    """Carga perezosamente el modelo de spaCy si está disponible."""
    global _SPACY_MODEL
    if spacy is None:
        return None
    if _SPACY_MODEL is not None:
        return _SPACY_MODEL
    try:
        _SPACY_MODEL = spacy.load("es_core_news_sm", disable=["ner", "parser", "tok2vec"])  # type: ignore[attr-defined]
    except Exception:
        _SPACY_MODEL = None
    return _SPACY_MODEL


def tokenize_text(text: str) -> List[str]:
    """Tokeniza y lematiza texto priorizando spaCy cuando esté disponible."""
    model = _load_spacy_model()
    if model is not None:
        doc = model(text)
        lemmas: List[str] = []
        for token in doc:
            if token.is_space or token.is_punct or token.is_stop:
                continue
            lemma = token.lemma_ or token.text
            normalized = normalize_token(lemma)
            if normalized and normalized not in STOP_WORDS:
                lemmas.append(normalized)
        if lemmas:
            return lemmas

    # Fallback sin spaCy
    tokens = re.findall(r"[\wáéíóúñ]+", text.lower())
    results: List[str] = []
    for token in tokens:
        normalized = normalize_token(token)
        if normalized and normalized not in STOP_WORDS:
            results.append(normalized)
    return results

class PictosMapper:
    """Mapeador de texto a pictogramas ARASAAC"""

    _mapping_cache: Optional[Dict[str, List[int]]] = None
    _mapping_source: Optional[str] = None
    
    def __init__(self, mapping_file: Optional[str] = None):
        """
        Inicializar el mapeador
        
        Args:
            mapping_file: Ruta al archivo JSON con el mapeo. Si None, usa MAPPING_FILE por defecto
        """
        self.mapping = self._load_mapping(mapping_file or MAPPING_FILE)
    
    def _load_mapping(self, mapping_file: str) -> Dict[str, List[int]]:
        """Cargar mapeo desde archivo JSON o construir desde datasets ARASAAC"""

        if PictosMapper._mapping_cache is not None:
            if PictosMapper._mapping_source in {'datasets', 'default'}:
                return PictosMapper._mapping_cache
            if PictosMapper._mapping_source == mapping_file:
                return PictosMapper._mapping_cache
        
        # Prioridad 1: Intentar cargar desde datasets ARASAAC completos
        arasaac_mapping = self._build_from_arasaac_datasets()
        if arasaac_mapping:
            print(f"Mapeo construido desde datasets ARASAAC: {len(arasaac_mapping)} términos")
            PictosMapper._mapping_cache = arasaac_mapping
            PictosMapper._mapping_source = 'datasets'
            return arasaac_mapping
        
        # Prioridad 2: Intentar cargar desde archivo de mapeo existente
        try:
            if Path(mapping_file).exists():
                with open(mapping_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                mapping = data.get('mapping', {})
                print(f"Mapeo cargado desde {mapping_file}: {len(mapping)} términos")
                PictosMapper._mapping_cache = mapping
                PictosMapper._mapping_source = mapping_file
                return mapping
            else:
                print(f"Archivo {mapping_file} no encontrado")
        except Exception as e:
            print(f"Error cargando mapeo desde {mapping_file}: {e}")
        
        # Prioridad 3: Usar mapeo por defecto
        print("Usando mapeo por defecto")
        PictosMapper._mapping_cache = DEFAULT_MAPPING
        PictosMapper._mapping_source = 'default'
        return DEFAULT_MAPPING
    
    def _build_from_arasaac_datasets(self) -> Optional[Dict[str, List[int]]]:
        """Construir mapeo desde los datasets completos de ARASAAC"""
        try:
            # Verificar si los archivos existen y no están vacíos
            picto_file = Path(DATASET_PICTO_FILE)
            words_file = Path(DATASET_WORDS_FILE)
            
            if not (picto_file.exists() and picto_file.stat().st_size > 0):
                return None
            if not (words_file.exists() and words_file.stat().st_size > 0):
                return None
            
            print("🔍 Construyendo mapeo desde datasets ARASAAC...")
            
            # Cargar pictogramas
            with open(picto_file, 'r', encoding='utf-8') as f:
                pictos_data = json.load(f)
            
            if not isinstance(pictos_data, list):
                return None
            
            # Construir mapeo
            mapping = {}
            processed_pictos = 0
            
            for picto in pictos_data:
                if not isinstance(picto, dict):
                    continue
                
                # Obtener ID del pictograma
                picto_id = picto.get('_id') or picto.get('id') or picto.get('idPictogram')
                if not picto_id:
                    continue
                
                # Obtener keywords asociadas
                keywords = self._extract_keywords_from_picto(picto)
                
                # Mapear cada keyword al pictograma
                for keyword in keywords:
                    keyword_clean = self.normalize(keyword)
                    if keyword_clean and keyword_clean not in STOP_WORDS:
                        if keyword_clean not in mapping:
                            mapping[keyword_clean] = []
                        mapping[keyword_clean].append(picto_id)
                
                processed_pictos += 1
                if processed_pictos % 10000 == 0:
                    print(f"  Procesados {processed_pictos} pictogramas...")
            
            # Limpiar duplicados y limitar
            for keyword in mapping:
                mapping[keyword] = sorted(list(set(mapping[keyword]))[:5])  # Max 5 pictos por palabra
            
            print(f"✅ Mapeo construido: {len(mapping)} términos únicos")
            return mapping
            
        except Exception as e:
            print(f"Error construyendo desde datasets ARASAAC: {e}")
            return None
    
    def _extract_keywords_from_picto(self, picto: Dict) -> List[str]:
        """Extraer keywords de un pictograma"""
        keywords = []
        
        # Buscar en diferentes campos posibles
        keyword_fields = ['keywords', 'tags', 'synsets']
        
        for field in keyword_fields:
            if field not in picto:
                continue
                
            field_data = picto[field]
            
            if isinstance(field_data, list):
                for item in field_data:
                    if isinstance(item, dict) and 'keyword' in item:
                        keywords.append(item['keyword'])
                    elif isinstance(item, str):
                        keywords.append(item)
            elif isinstance(field_data, str):
                keywords.append(field_data)
        
        # Filtrar keywords apropiadas para niños
        filtered_keywords = []
        for kw in keywords:
            if isinstance(kw, str) and len(kw.strip()) > 1:
                kw_clean = kw.strip().lower()
                # Filtrar palabras apropiadas para niños
                if (len(kw_clean) <= 20 and 
                    not any(char in kw_clean for char in ['@', '#', '$', '%', '^', '&', '*']) and
                    len(kw_clean.split()) <= 2):
                    filtered_keywords.append(kw_clean)
        
        return filtered_keywords
    
    @staticmethod
    def normalize(token: str) -> str:
        """Normalizar token para búsqueda"""
        return normalize_token(token)
    
    def get_pictos(self, term: str, limit: int = 3) -> List[int]:
        """Obtener pictogramas para un término específico"""
        normalized = self.normalize(term)
        if not normalized or normalized in STOP_WORDS:
            return []
        return self.mapping.get(normalized, [])[:limit]
    
    def map_tokens(self, tokens: List[str], max_pictos: int = 10) -> List[int]:
        """Mapear lista de tokens a pictogramas"""
        results: List[int] = []
        seen: Set[int] = set()
        
        for token in tokens:
            pictos = self.get_pictos(token)
            for picto_id in pictos:
                if picto_id not in seen:
                    results.append(picto_id)
                    seen.add(picto_id)
                if len(results) >= max_pictos:
                    return results
        
        return results
    
    def map_text(self, text: str, max_pictos: int = 10) -> List[int]:
        """Mapear texto completo a pictogramas"""
        tokens = tokenize_text(text)
        return self.map_tokens(tokens, max_pictos=max_pictos)
    
    def get_picto_url(self, picto_id: int, size: str = "300") -> str:
        """Generar URL de imagen del pictograma"""
        return f"https://static.arasaac.org/pictograms/{picto_id}/{picto_id}_{size}.png"
    
    def map_text_with_metadata(
        self,
        text: str,
        max_pictos: int = 10,
        size: str = "300",
    ) -> List[Dict[str, Any]]:
        """Mapea texto a pictogramas incluyendo metadatos básicos."""
        tokens = tokenize_text(text)
        results: List[Dict[str, Any]] = []
        seen: Set[int] = set()

        for token in tokens:
            pictos = self.get_pictos(token)
            for rank, picto_id in enumerate(pictos, start=1):
                if picto_id in seen:
                    continue
                results.append(
                    {
                        "id": picto_id,
                        "label": token,
                        "url": self.get_picto_url(picto_id, size),
                        "confidence": max(0.0, 1.0 - (rank - 1) * 0.1),
                        "token": token,
                    }
                )
                seen.add(picto_id)
                if len(results) >= max_pictos:
                    return results

        return results

    def map_text_with_urls(self, text: str, max_pictos: int = 10, size: str = "300") -> List[Dict[str, any]]:
        """Mapear texto a pictogramas con URLs"""
        return [
            {
                "id": item["id"],
                "url": item["url"],
                "label": item["label"],
            }
            for item in self.map_text_with_metadata(text, max_pictos=max_pictos, size=size)
        ]
    
    def save_mapping(self, path: str):
        """Guardar mapeo actual"""
        payload = {
            'language': 'es',
            'generated_terms': len(self.mapping),
            'mapping_size': sum(len(v) for v in self.mapping.values()),
            'mapping': self.mapping
        }
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
    
    @classmethod
    def load_from_file(cls, path: str):
        """Cargar mapeador desde archivo específico"""
        return cls(mapping_file=path)

# Mantener compatibilidad con código anterior
class PictoMapper(PictosMapper):
    """Alias para compatibilidad con versiones anteriores"""
    def __init__(self, mapping: Dict[str, List[str]] = None):
        # Convertir mapeo antiguo a nuevo formato si es necesario
        if mapping:
            # Convertir ids string a enteros si es posible
            converted_mapping = {}
            for key, values in mapping.items():
                converted_values = []
                for val in values:
                    try:
                        # Intentar convertir a int si es un número
                        converted_values.append(int(val))
                    except (ValueError, TypeError):
                        # Mantener como string si no se puede convertir
                        converted_values.append(val)
                converted_mapping[key] = converted_values
            
            # Crear instancia temporal para extraer el mapping
            temp_mapper = PictosMapper()
            temp_mapper.mapping = converted_mapping
            self.mapping = temp_mapper.mapping
        else:
            super().__init__()

# Funciones de compatibilidad
def get_pictos_for_text(text: str) -> List[int]:
    """Función de compatibilidad"""
    mapper = PictosMapper()
    return mapper.map_text(text)

def get_picto_objs(text: str) -> List[Dict[str, any]]:
    """Función de compatibilidad"""
    mapper = PictosMapper()
    return mapper.map_text_with_urls(text)

if __name__ == "__main__":
    # Prueba del mapeador
    mapper = PictosMapper()
    
    # Pruebas básicas
    test_phrases = [
        "hola quiero jugar",
        "tengo sed y hambre", 
        "me duele la cabeza",
        "estoy triste y cansado",
        "gracias por la ayuda"
    ]
    
    print("=== PRUEBAS DEL MAPEADOR DE PICTOGRAMAS ===")
    for phrase in test_phrases:
        pictos = mapper.map_text(phrase, max_pictos=5)
        urls = mapper.map_text_with_urls(phrase, max_pictos=3)
        print(f"\nTexto: '{phrase}'")
        print(f"Pictogramas: {pictos}")
        print(f"URLs: {[u['url'] for u in urls]}")
