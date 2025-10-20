import json
import re
from pathlib import Path
from typing import List, Dict, Set, Optional
from unidecode import unidecode

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

class PictosMapper:
    """Mapeador de texto a pictogramas ARASAAC"""
    
    def __init__(self, mapping_file: Optional[str] = None):
        """
        Inicializar el mapeador
        
        Args:
            mapping_file: Ruta al archivo JSON con el mapeo. Si None, usa MAPPING_FILE por defecto
        """
        self.mapping = self._load_mapping(mapping_file or MAPPING_FILE)
    
    def _load_mapping(self, mapping_file: str) -> Dict[str, List[int]]:
        """Cargar mapeo desde archivo JSON o construir desde datasets ARASAAC"""
        
        # Prioridad 1: Intentar cargar desde datasets ARASAAC completos
        arasaac_mapping = self._build_from_arasaac_datasets()
        if arasaac_mapping:
            print(f"Mapeo construido desde datasets ARASAAC: {len(arasaac_mapping)} términos")
            return arasaac_mapping
        
        # Prioridad 2: Intentar cargar desde archivo de mapeo existente
        try:
            if Path(mapping_file).exists():
                with open(mapping_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                mapping = data.get('mapping', {})
                print(f"Mapeo cargado desde {mapping_file}: {len(mapping)} términos")
                return mapping
            else:
                print(f"Archivo {mapping_file} no encontrado")
        except Exception as e:
            print(f"Error cargando mapeo desde {mapping_file}: {e}")
        
        # Prioridad 3: Usar mapeo por defecto
        print("Usando mapeo por defecto")
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
        token = token.lower().strip()
        token = unidecode(token)
        token = re.sub(r"[^a-z0-9áéíóúñ]", "", token)
        return token
    
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
        tokens = text.split()
        return self.map_tokens(tokens, max_pictos=max_pictos)
    
    def get_picto_url(self, picto_id: int, size: str = "300") -> str:
        """Generar URL de imagen del pictograma"""
        return f"https://static.arasaac.org/pictograms/{picto_id}/{picto_id}_{size}.png"
    
    def map_text_with_urls(self, text: str, max_pictos: int = 10, size: str = "300") -> List[Dict[str, any]]:
        """Mapear texto a pictogramas con URLs"""
        picto_ids = self.map_text(text, max_pictos)
        return [
            {
                "id": picto_id,
                "url": self.get_picto_url(picto_id, size)
            }
            for picto_id in picto_ids
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
