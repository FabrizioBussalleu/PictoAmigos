import jsonimport json

import reimport re

from pathlib import Pathfrom pathlib import Path

from typing import List, Dict, Set, Optionalfrom typing import List, Dict, Set, Optional

from unidecode import unidecodefrom unidecode import unidecode



# Archivos de datasets ARASAAC# Archivos de datasets ARASAAC

DATASET_PICTO_FILE = "dataset_picto.json"DATASET_PICTO_FILE = "dataset_picto.json"

DATASET_WORDS_FILE = "dataset_words.json"DATASET_WORDS_FILE = "dataset_words.json"

MAPPING_FILE = "pictos_mapping.json"  # Fallback fileMAPPING_FILE = "pictos_mapping.json"  # Fallback file



# Mapeo de fallback para casos donde no hay archivo o falla la carga# Mapeo de fallback para casos donde no hay archivo o falla la carga

DEFAULT_MAPPING = {DEFAULT_MAPPING = {

    "hola": [6522, 6009],    "hola": [6522, 6009],

    "adios": [2321, 6523],    "adios": [2321, 6523],

    "gracias": [2417, 6533],    "gracias": [2417, 6533],

    "ayuda": [2280, 6487],    "ayuda": [2280, 6487],

    "agua": [2248, 6889],    "agua": [2248, 6889],

    "casa": [2317, 6964],    "casa": [2317, 6964],

    "comida": [4610, 4611],    "comida": [4610, 4611],

    "niño": [2485, 7176],    "niño": [2485, 7176],

    "jugar": [2439, 6537],    "jugar": [2439, 6537],

    "feliz": [9907, 32123],    "feliz": [9907, 32123],

    "triste": [2606, 11959],    "triste": [2606, 11959],

    "dolor": [2368, 6478],    "dolor": [2368, 6478],

    "dormir": [2369, 6479],    "dormir": [2369, 6479],

}}



STOP_WORDS = {"por", "la", "el", "de", "a", "y", "en", "un", "una", "al", "lo", "con", "que", "es", "se"}STOP_WORDS = {"por", "la", "el", "de", "a", "y", "en", "un", "una", "al", "lo", "con", "que", "es", "se"}



class PictosMapper:class PictosMapper:

    """Mapeador de texto a pictogramas ARASAAC"""    """Mapeador de texto a pictogramas ARASAAC"""

        

    def __init__(self, mapping_file: Optional[str] = None):    def __init__(self, mapping_file: Optional[str] = None):

        """        """

        Inicializar el mapeador        Inicializar el mapeador

                

        Args:        Args:

            mapping_file: Ruta al archivo JSON con el mapeo. Si None, usa MAPPING_FILE por defecto            mapping_file: Ruta al archivo JSON con el mapeo. Si None, usa MAPPING_FILE por defecto

        """        """

        self.mapping = self._load_mapping(mapping_file or MAPPING_FILE)        self.mapping = self._load_mapping(mapping_file or MAPPING_FILE)

        

    def _load_mapping(self, mapping_file: str) -> Dict[str, List[int]]:    def _load_mapping(self, mapping_file: str) -> Dict[str, List[int]]:

        """Cargar mapeo desde archivo JSON o construir desde datasets ARASAAC"""        """Cargar mapeo desde archivo JSON o construir desde datasets ARASAAC"""

                

        # Prioridad 1: Intentar cargar desde datasets ARASAAC completos        # Prioridad 1: Intentar cargar desde datasets ARASAAC completos

        arasaac_mapping = self._build_from_arasaac_datasets()        arasaac_mapping = self._build_from_arasaac_datasets()

        if arasaac_mapping:        if arasaac_mapping:

            print(f"Mapeo construido desde datasets ARASAAC: {len(arasaac_mapping)} términos")            print(f"Mapeo construido desde datasets ARASAAC: {len(arasaac_mapping)} términos")

            return arasaac_mapping            return arasaac_mapping

                

        # Prioridad 2: Intentar cargar desde archivo de mapeo existente        # Prioridad 2: Intentar cargar desde archivo de mapeo existente

        try:        try:

            if Path(mapping_file).exists():            if Path(mapping_file).exists():

                with open(mapping_file, 'r', encoding='utf-8') as f:                with open(mapping_file, 'r', encoding='utf-8') as f:

                    data = json.load(f)                    data = json.load(f)

                mapping = data.get('mapping', {})                mapping = data.get('mapping', {})

                print(f"Mapeo cargado desde {mapping_file}: {len(mapping)} términos")                print(f"Mapeo cargado desde {mapping_file}: {len(mapping)} términos")

                return mapping                return mapping

            else:            else:

                print(f"Archivo {mapping_file} no encontrado")                print(f"Archivo {mapping_file} no encontrado")

        except Exception as e:        except Exception as e:

            print(f"Error cargando mapeo desde {mapping_file}: {e}")            print(f"Error cargando mapeo desde {mapping_file}: {e}")

                

        # Prioridad 3: Usar mapeo por defecto        # Prioridad 3: Usar mapeo por defecto

        print("Usando mapeo por defecto")        print("Usando mapeo por defecto")

        return DEFAULT_MAPPING        return DEFAULT_MAPPING

        

    def _build_from_arasaac_datasets(self) -> Optional[Dict[str, List[int]]]:    def _build_from_arasaac_datasets(self) -> Optional[Dict[str, List[int]]]:

        """Construir mapeo desde los datasets completos de ARASAAC"""        """Construir mapeo desde los datasets completos de ARASAAC"""

        try:        try:

            # Verificar si los archivos existen y no están vacíos            # Verificar si los archivos existen y no están vacíos

            picto_file = Path(DATASET_PICTO_FILE)            picto_file = Path(DATASET_PICTO_FILE)

            words_file = Path(DATASET_WORDS_FILE)            words_file = Path(DATASET_WORDS_FILE)

                        

            if not (picto_file.exists() and picto_file.stat().st_size > 0):            if not (picto_file.exists() and picto_file.stat().st_size > 0):

                return None                return None

            if not (words_file.exists() and words_file.stat().st_size > 0):            if not (words_file.exists() and words_file.stat().st_size > 0):

                return None                return None

                        

            print("🔍 Construyendo mapeo desde datasets ARASAAC...")            print("🔍 Construyendo mapeo desde datasets ARASAAC...")

                        

            # Cargar pictogramas            # Cargar pictogramas

            with open(picto_file, 'r', encoding='utf-8') as f:            with open(picto_file, 'r', encoding='utf-8') as f:

                pictos_data = json.load(f)                pictos_data = json.load(f)

                        

            if not isinstance(pictos_data, list):            if not isinstance(pictos_data, list):

                return None                return None

                        

            # Construir mapeo            # Construir mapeo

            mapping = {}            mapping = {}

            processed_pictos = 0            processed_pictos = 0

                        

            for picto in pictos_data:            for picto in pictos_data:

                if not isinstance(picto, dict):                if not isinstance(picto, dict):

                    continue                    continue

                                

                # Obtener ID del pictograma                # Obtener ID del pictograma

                picto_id = picto.get('_id') or picto.get('id') or picto.get('idPictogram')                picto_id = picto.get('_id') or picto.get('id') or picto.get('idPictogram')

                if not picto_id:                if not picto_id:

                    continue                    continue

                                

                # Obtener keywords asociadas                # Obtener keywords asociadas

                keywords = self._extract_keywords_from_picto(picto)                keywords = self._extract_keywords_from_picto(picto)

                                

                # Mapear cada keyword al pictograma                # Mapear cada keyword al pictograma

                for keyword in keywords:                for keyword in keywords:

                    keyword_clean = self.normalize(keyword)                    keyword_clean = self.normalize(keyword)

                    if keyword_clean and keyword_clean not in STOP_WORDS:                    if keyword_clean and keyword_clean not in STOP_WORDS:

                        if keyword_clean not in mapping:                        if keyword_clean not in mapping:

                            mapping[keyword_clean] = []                            mapping[keyword_clean] = []

                        mapping[keyword_clean].append(picto_id)                        mapping[keyword_clean].append(picto_id)

                                

                processed_pictos += 1                processed_pictos += 1

                if processed_pictos % 10000 == 0:                if processed_pictos % 10000 == 0:

                    print(f"  Procesados {processed_pictos} pictogramas...")                    print(f"  Procesados {processed_pictos} pictogramas...")

                        

            # Limpiar duplicados y limitar            # Limpiar duplicados y limitar

            for keyword in mapping:            for keyword in mapping:

                mapping[keyword] = sorted(list(set(mapping[keyword]))[:5])  # Max 5 pictos por palabra                mapping[keyword] = sorted(list(set(mapping[keyword]))[:5])  # Max 5 pictos por palabra

                        

            print(f"✅ Mapeo construido: {len(mapping)} términos únicos")            print(f"✅ Mapeo construido: {len(mapping)} términos únicos")

            return mapping            return mapping

                        

        except Exception as e:        except Exception as e:

            print(f"Error construyendo desde datasets ARASAAC: {e}")            print(f"Error construyendo desde datasets ARASAAC: {e}")

            return None            return None

        

    def _extract_keywords_from_picto(self, picto: Dict) -> List[str]:    def _extract_keywords_from_picto(self, picto: Dict) -> List[str]:

        """Extraer keywords de un pictograma"""        """Extraer keywords de un pictograma"""

        keywords = []        keywords = []

                

        # Buscar en diferentes campos posibles        # Buscar en diferentes campos posibles

        keyword_fields = ['keywords', 'tags', 'synsets']        keyword_fields = ['keywords', 'tags', 'synsets']

                

        for field in keyword_fields:        for field in keyword_fields:

            if field not in picto:            if field not in picto:

                continue                continue

                                

            field_data = picto[field]            field_data = picto[field]

                        

            if isinstance(field_data, list):            if isinstance(field_data, list):

                for item in field_data:                for item in field_data:

                    if isinstance(item, dict) and 'keyword' in item:                    if isinstance(item, dict) and 'keyword' in item:

                        keywords.append(item['keyword'])                        keywords.append(item['keyword'])

                    elif isinstance(item, str):                    elif isinstance(item, str):

                        keywords.append(item)                        keywords.append(item)

            elif isinstance(field_data, str):            elif isinstance(field_data, str):

                keywords.append(field_data)                keywords.append(field_data)

                

        # Filtrar keywords apropiadas para niños        # Filtrar keywords apropiadas para niños

        filtered_keywords = []        filtered_keywords = []

        for kw in keywords:        for kw in keywords:

            if isinstance(kw, str) and len(kw.strip()) > 1:            if isinstance(kw, str) and len(kw.strip()) > 1:

                kw_clean = kw.strip().lower()                kw_clean = kw.strip().lower()

                # Filtrar palabras apropiadas para niños                # Filtrar palabras apropiadas para niños

                if (len(kw_clean) <= 20 and                 if (len(kw_clean) <= 20 and 

                    not any(char in kw_clean for char in ['@', '#', '$', '%', '^', '&', '*']) and                    not any(char in kw_clean for char in ['@', '#', '$', '%', '^', '&', '*']) and

                    len(kw_clean.split()) <= 2):                    len(kw_clean.split()) <= 2):

                    filtered_keywords.append(kw_clean)                    filtered_keywords.append(kw_clean)

                

        return filtered_keywords        return filtered_keywords

        

    @staticmethod    @staticmethod

    def normalize(token: str) -> str:    def normalize(token: str) -> str:

        """Normalizar token para búsqueda"""        """Normalizar token para búsqueda"""

        token = token.lower().strip()        token = token.lower().strip()

        token = unidecode(token)        token = unidecode(token)

        token = re.sub(r"[^a-z0-9áéíóúñ]", "", token)        token = re.sub(r"[^a-z0-9áéíóúñ]", "", token)

        return token        return token

    

    def get_pictos(self, term: str, limit: int = 3) -> List[int]:    def map_tokens(self, tokens: List[str], max_pictos: int = 10) -> List[str]:

        """Obtener pictogramas para un término específico"""        results: List[str] = []

        normalized = self.normalize(term)        seen: Set[str] = set()

        if not normalized or normalized in STOP_WORDS:        for t in tokens:

            return []            if t in STOP:

        return self.mapping.get(normalized, [])[:limit]                continue

                norm = self.normalize(t)

    def map_tokens(self, tokens: List[str], max_pictos: int = 10) -> List[int]:            if not norm:

        """Mapear lista de tokens a pictogramas"""                continue

        results: List[int] = []            pictos = self.mapping.get(norm, [])

        seen: Set[int] = set()            for p in pictos:

                        if p not in seen:

        for token in tokens:                    results.append(p)

            pictos = self.get_pictos(token)                    seen.add(p)

            for picto_id in pictos:            if len(results) >= max_pictos:

                if picto_id not in seen:                break

                    results.append(picto_id)        return results

                    seen.add(picto_id)

                if len(results) >= max_pictos:    def map_text(self, text: str, max_pictos: int = 10) -> List[str]:

                    return results        tokens = text.split()

                return self.map_tokens(tokens, max_pictos=max_pictos)

        return results

        def save(self, path: str):

    def map_text(self, text: str, max_pictos: int = 10) -> List[int]:        with open(path, 'w', encoding='utf-8') as f:

        """Mapear texto completo a pictogramas"""            json.dump(self.mapping, f, ensure_ascii=False, indent=2)

        tokens = text.split()

        return self.map_tokens(tokens, max_pictos=max_pictos)    @classmethod

        def load(cls, path: str):

    def get_picto_url(self, picto_id: int, size: str = "300") -> str:        with open(path, encoding='utf-8') as f:

        """Generar URL de imagen del pictograma"""            mapping = json.load(f)

        return f"https://static.arasaac.org/pictograms/{picto_id}/{picto_id}_{size}.png"        return cls(mapping)

    

    def map_text_with_urls(self, text: str, max_pictos: int = 10, size: str = "300") -> List[Dict[str, any]]:if __name__ == "__main__":

        """Mapear texto a pictogramas con URLs"""    mapper = PictoMapper()

        picto_ids = self.map_text(text, max_pictos)    print(mapper.map_text("hola quiero jugar con la pelota por favor"))

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