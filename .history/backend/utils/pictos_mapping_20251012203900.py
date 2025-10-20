import json
import re
from pathlib import Path
from typing import List, Dict, Set, Optional
from unidecode import unidecode

# Archivos de datasets ARASAAC
DATASET_PICTO_FILE = "dataset_picto.json"
DATASET_WORDS_FILE = "dataset_words.json"
MAPPING_FILE = "pictos_mapping.json"  # Fallback file

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

    def map_tokens(self, tokens: List[str], max_pictos: int = 10) -> List[str]:
        results: List[str] = []
        seen: Set[str] = set()
        for t in tokens:
            if t in STOP:
                continue
            norm = self.normalize(t)
            if not norm:
                continue
            pictos = self.mapping.get(norm, [])
            for p in pictos:
                if p not in seen:
                    results.append(p)
                    seen.add(p)
            if len(results) >= max_pictos:
                break
        return results

    def map_text(self, text: str, max_pictos: int = 10) -> List[str]:
        tokens = text.split()
        return self.map_tokens(tokens, max_pictos=max_pictos)

    def save(self, path: str):
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(self.mapping, f, ensure_ascii=False, indent=2)

    @classmethod
    def load(cls, path: str):
        with open(path, encoding='utf-8') as f:
            mapping = json.load(f)
        return cls(mapping)

if __name__ == "__main__":
    mapper = PictoMapper()
    print(mapper.map_text("hola quiero jugar con la pelota por favor"))

