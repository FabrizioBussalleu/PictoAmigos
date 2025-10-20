#!/usr/bin/env python3
"""
Generador de diálogos sintéticos optimizado para niños
Utiliza los datasets completos de ARASAAC (palabras y pictogramas)
"""

import json
import csv
import random
import argparse
from pathlib import Path
from typing import List, Dict, Any, Tuple
import itertools

class DialogueGeneratorForKids:
    """Generador de diálogos sintéticos específico para niños usando ARASAAC"""
    
    def __init__(self, words_file: str = "dataset_words.json", pictos_file: str = "dataset_picto.json"):
        self.words_file = words_file
        self.pictos_file = pictos_file
        self.available_words = []
        self.pictogram_mapping = {}
        self.load_datasets()
        
        # Intenciones específicas para niños
        self.intents = {
            "SALUDAR": {
                "weight": 15,
                "templates": [
                    "hola {persona}", "hola", "hola {persona} {emocion}",
                    "buenos días", "buenas tardes", "hey {persona}",
                    "hola cómo estás", "hola {persona} cómo estás"
                ]
            },
            "DESPEDIR": {
                "weight": 10,
                "templates": [
                    "adiós", "chau", "adiós {persona}", "chau {persona}",
                    "nos vemos", "hasta luego", "me voy"
                ]
            },
            "PEDIR_AYUDA": {
                "weight": 20,
                "templates": [
                    "ayuda", "ayúdame", "necesito ayuda", "ayuda por favor",
                    "no puedo {accion}", "me ayudas", "ayuda con {objeto}",
                    "no sé {accion}", "ayuda {persona}"
                ]
            },
            "EXPRESAR_NECESIDAD": {
                "weight": 25,
                "templates": [
                    "tengo {necesidad}", "quiero {objeto}", "necesito {objeto}",
                    "me da {objeto}", "quiero {accion}", "tengo ganas de {accion}",
                    "dame {objeto}", "busco {objeto}", "donde está {objeto}"
                ]
            },
            "EXPRESAR_EMOCION": {
                "weight": 15,
                "templates": [
                    "estoy {emocion}", "me siento {emocion}", "estoy muy {emocion}",
                    "hoy estoy {emocion}", "soy {emocion}", "me pone {emocion}"
                ]
            },
            "DESCRIBIR_DOLOR": {
                "weight": 10,
                "templates": [
                    "me duele {parte_cuerpo}", "dolor en {parte_cuerpo}",
                    "tengo dolor", "me duele", "duele {parte_cuerpo}",
                    "me lastimé {parte_cuerpo}", "me pegué en {parte_cuerpo}"
                ]
            },
            "JUGAR": {
                "weight": 20,
                "templates": [
                    "quiero jugar", "vamos a jugar", "juguemos {juego}",
                    "jugar con {juguete}", "me gusta jugar {juego}",
                    "jugamos", "quiero {juguete}", "juego con {juguete}"
                ]
            },
            "COMER_BEBER": {
                "weight": 15,
                "templates": [
                    "tengo hambre", "quiero comer", "tengo sed", "quiero agua",
                    "quiero {comida}", "comer {comida}", "beber {bebida}",
                    "me da {comida}", "más {comida}"
                ]
            },
            "IR_LUGAR": {
                "weight": 8,
                "templates": [
                    "vamos al {lugar}", "quiero ir al {lugar}", "ir a {lugar}",
                    "donde está {lugar}", "busco {lugar}", "al {lugar}"
                ]
            },
            "AGRADECER": {
                "weight": 5,
                "templates": [
                    "gracias", "gracias {persona}", "muchas gracias",
                    "gracias por {accion}", "te doy las gracias"
                ]
            }
        }
        
        # Vocabulario específico para niños
        self.vocabulary = {
            "persona": ["mamá", "papá", "abuela", "abuelo", "hermana", "hermano", "maestra", "amigo", "amiga", "tía", "tío"],
            "emocion": ["feliz", "triste", "enojado", "asustado", "cansado", "emocionado", "contento", "nervioso", "tranquilo"],
            "necesidad": ["hambre", "sed", "sueño", "frío", "calor", "ganas de jugar", "aburrimiento"],
            "objeto": ["agua", "comida", "juguete", "pelota", "libro", "crayones", "tablet", "muñeca", "auto", "bloques"],
            "accion": ["jugar", "comer", "dormir", "dibujar", "correr", "saltar", "cantar", "bailar", "estudiar", "leer"],
            "parte_cuerpo": ["cabeza", "barriga", "brazo", "pierna", "mano", "pie", "espalda", "rodilla", "dedo"],
            "juego": ["fútbol", "escondidas", "tag", "rayuela", "memoria", "puzzles", "videojuegos"],
            "juguete": ["pelota", "muñeca", "auto", "bloques", "rompecabezas", "crayones", "peluche", "bicicleta"],
            "comida": ["galletas", "fruta", "sandwich", "yogur", "cereal", "pizza", "helado", "verduras"],
            "bebida": ["agua", "leche", "jugo", "chocolate caliente"],
            "lugar": ["parque", "escuela", "casa", "baño", "cocina", "jardín", "plaza", "hospital"]
        }
    
    def load_datasets(self):
        """Cargar datasets de ARASAAC"""
        try:
            # Cargar palabras
            if Path(self.words_file).exists() and Path(self.words_file).stat().st_size > 0:
                with open(self.words_file, 'r', encoding='utf-8') as f:
                    words_data = json.load(f)
                
                if isinstance(words_data, dict) and 'words' in words_data:
                    all_words = words_data['words']
                    # Filtrar palabras apropiadas para niños
                    self.available_words = self.filter_kid_friendly_words(all_words)
                    print(f"✅ Cargadas {len(self.available_words)} palabras apropiadas para niños")
                else:
                    print("⚠️ Formato de palabras inesperado, usando vocabulario base")
            else:
                print("⚠️ Archivo de palabras no disponible, usando vocabulario base")
                
            # Cargar pictogramas  
            if Path(self.pictos_file).exists() and Path(self.pictos_file).stat().st_size > 0:
                with open(self.pictos_file, 'r', encoding='utf-8') as f:
                    pictos_data = json.load(f)
                
                self.pictogram_mapping = self.build_picto_mapping(pictos_data)
                print(f"✅ Cargados {len(self.pictogram_mapping)} pictogramas")
            else:
                print("⚠️ Archivo de pictogramas no disponible")
                
        except Exception as e:
            print(f"⚠️ Error cargando datasets: {e}")
            print("Usando vocabulario base predefinido")
    
    def filter_kid_friendly_words(self, words: List[str]) -> List[str]:
        """Filtrar palabras apropiadas para niños desde los datasets ARASAAC"""
        kid_friendly = []
        
        # Palabras clave que queremos para niños
        kid_keywords = {
            'agua', 'casa', 'mama', 'papá', 'mamá', 'papa', 'jugar', 'comer', 'feliz', 'triste',
            'hola', 'adiós', 'gracias', 'ayuda', 'dolor', 'cabeza', 'mano', 'pie', 'ojo', 'boca',
            'perro', 'gato', 'pelota', 'auto', 'coche', 'bicicleta', 'libro', 'lápiz', 'color',
            'rojo', 'azul', 'verde', 'amarillo', 'grande', 'pequeño', 'caliente', 'frío',
            'escuela', 'parque', 'jardín', 'cocina', 'baño', 'dormitorio', 'comida', 'fruta',
            'leche', 'pan', 'huevo', 'pollo', 'pescado', 'arroz', 'sopa', 'dulce', 'chocolate',
            'juguete', 'muñeca', 'oso', 'bloque', 'puzzle', 'música', 'cantar', 'bailar',
            'correr', 'caminar', 'saltar', 'sentado', 'parado', 'acostado', 'dormir', 'despertar'
        }
        
        for word in words:
            if not isinstance(word, str):
                continue
                
            word_clean = word.strip().lower()
            
            # Filtros básicos
            if not word_clean or len(word_clean) > 20:
                continue
            if word_clean.startswith((' ', '!', '"', '#', '$', '%')):
                continue
            if any(char in word_clean for char in ['@', '~', '^', '`', '|', '\\']):
                continue
            
            # Solo palabras sencillas (máximo 2 palabras)
            if len(word_clean.split()) > 2:
                continue
                
            # Incluir si coincide con palabras clave para niños
            if (word_clean in kid_keywords or 
                any(kw in word_clean for kw in kid_keywords) or
                any(common in word_clean for common in ['niño', 'niña', 'bebé', 'hijo', 'hija'])):
                kid_friendly.append(word_clean)
        
        # Tomar máximo 500 palabras apropiadas
        return kid_friendly[:500]
    
    def build_picto_mapping(self, pictos_data: List[Dict]) -> Dict[str, List[int]]:
        """Construir mapeo de palabras a pictogramas"""
        mapping = {}
        
        if not isinstance(pictos_data, list):
            return mapping
            
        for picto in pictos_data:
            if not isinstance(picto, dict):
                continue
                
            # Obtener ID del pictograma
            picto_id = picto.get('_id') or picto.get('id') or picto.get('idPictogram')
            if not picto_id:
                continue
                
            # Obtener keywords/palabras asociadas
            keywords = []
            if 'keywords' in picto:
                kw_data = picto['keywords']
                if isinstance(kw_data, list):
                    for kw in kw_data:
                        if isinstance(kw, dict) and 'keyword' in kw:
                            keywords.append(kw['keyword'].lower())
                        elif isinstance(kw, str):
                            keywords.append(kw.lower())
            
            # Mapear cada keyword al pictograma
            for keyword in keywords:
                if keyword not in mapping:
                    mapping[keyword] = []
                mapping[keyword].append(picto_id)
        
        return mapping
    
    def expand_vocabulary_with_arasaac(self):
        """Expandir vocabulario con palabras de ARASAAC apropiadas para niños"""
        if not self.available_words:
            return
            
        # Categorizar palabras de ARASAAC
        for word in self.available_words[:200]:  # Limitar para eficiencia
            word_lower = word.lower()
            
            # Categorizar automáticamente
            if any(emotion in word_lower for emotion in ['feliz', 'triste', 'enojado', 'asustado']):
                if word_lower not in self.vocabulary['emocion']:
                    self.vocabulary['emocion'].append(word_lower)
            elif any(food in word_lower for food in ['come', 'fruta', 'pan', 'leche']):
                if word_lower not in self.vocabulary['comida']:
                    self.vocabulary['comida'].append(word_lower)
            elif any(toy in word_lower for toy in ['pelota', 'muñeca', 'juguete']):
                if word_lower not in self.vocabulary['juguete']:
                    self.vocabulary['juguete'].append(word_lower)
    
    def generate_kid_dialogue(self, intent: str, template: str) -> str:
        """Generar un diálogo específico para niños"""
        dialogue = template
        
        # Reemplazar placeholders con vocabulario apropiado
        for placeholder, options in self.vocabulary.items():
            if f"{{{placeholder}}}" in dialogue:
                chosen = random.choice(options)
                dialogue = dialogue.replace(f"{{{placeholder}}}", chosen)
        
        # Agregar variaciones naturales de niños
        dialogue = self.add_kid_variations(dialogue)
        
        return dialogue
    
    def add_kid_variations(self, text: str) -> str:
        """Agregar variaciones naturales del habla infantil"""
        variations = []
        
        # 20% de probabilidad de agregar muletillas
        if random.random() < 0.2:
            muletillas = ["eh", "mm", "este", "bueno"]
            text = random.choice(muletillas) + " " + text
        
        # 15% de probabilidad de repetir palabras importantes
        if random.random() < 0.15:
            words = text.split()
            if len(words) > 1:
                important_word = random.choice(words)
                if len(important_word) > 3:
                    text = text.replace(important_word, important_word + " " + important_word, 1)
        
        # 10% de probabilidad de agregar "por favor"
        if random.random() < 0.1 and any(word in text for word in ["quiero", "dame", "necesito"]):
            text = text + " por favor"
        
        # 10% de probabilidad de simplificar gramática
        if random.random() < 0.1:
            text = text.replace("estoy muy", "muy")
            text = text.replace("me siento", "soy")
        
        return text
    
    def generate_dialogue_dataset(self, 
                                num_samples: int = 50000,
                                train_split: float = 0.7,
                                val_split: float = 0.15,
                                test_split: float = 0.15) -> Tuple[List[Dict], List[Dict], List[Dict]]:
        """Generar dataset completo de diálogos para niños"""
        
        print(f"🎭 Generando {num_samples} diálogos para niños...")
        
        # Expandir vocabulario con ARASAAC si está disponible
        self.expand_vocabulary_with_arasaac()
        
        dialogues = []
        intent_counts = {intent: 0 for intent in self.intents.keys()}
        
        # Generar diálogos
        for i in range(num_samples):
            # Seleccionar intención basada en pesos
            intent = self.select_weighted_intent()
            intent_counts[intent] += 1
            
            # Seleccionar template
            template = random.choice(self.intents[intent]["templates"])
            
            # Generar diálogo
            dialogue_text = self.generate_kid_dialogue(intent, template)
            
            # Crear entrada
            dialogue_entry = {
                'id': f"kid_{intent.lower()}_{i}",
                'texto': dialogue_text,
                'intent': intent,
                'original': dialogue_text,
                'template': template,
                'is_kid_optimized': True
            }
            
            dialogues.append(dialogue_entry)
            
            if (i + 1) % 10000 == 0:
                print(f"  Generados {i + 1}/{num_samples} diálogos...")
        
        # Mostrar estadísticas
        print(f"\n📊 Distribución de intenciones:")
        for intent, count in intent_counts.items():
            percentage = (count / num_samples) * 100
            print(f"  {intent}: {count} ({percentage:.1f}%)")
        
        # Dividir dataset
        random.shuffle(dialogues)
        
        train_end = int(num_samples * train_split)
        val_end = train_end + int(num_samples * val_split)
        
        train_set = dialogues[:train_end]
        val_set = dialogues[train_end:val_end]
        test_set = dialogues[val_end:]
        
        print(f"\n📋 División del dataset:")
        print(f"  Entrenamiento: {len(train_set)} diálogos")
        print(f"  Validación: {len(val_set)} diálogos")
        print(f"  Prueba: {len(test_set)} diálogos")
        
        return train_set, val_set, test_set
    
    def select_weighted_intent(self) -> str:
        """Seleccionar intención basada en pesos"""
        intents = list(self.intents.keys())
        weights = [self.intents[intent]["weight"] for intent in intents]
        return random.choices(intents, weights=weights)[0]
    
    def save_datasets(self, train_set: List[Dict], val_set: List[Dict], test_set: List[Dict], 
                     output_dir: str = "data/processed"):
        """Guardar datasets en archivos CSV"""
        
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        datasets = [
            (train_set, "dialogos_train_kids.csv"),
            (val_set, "dialogos_val_kids.csv"),
            (test_set, "dialogos_test_kids.csv")
        ]
        
        for dataset, filename in datasets:
            filepath = Path(output_dir) / filename
            
            with open(filepath, 'w', newline='', encoding='utf-8') as f:
                if dataset:
                    fieldnames = dataset[0].keys()
                    writer = csv.DictWriter(f, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(dataset)
            
            print(f"💾 Guardado: {filepath} ({len(dataset)} registros)")

def main():
    parser = argparse.ArgumentParser(description="Generar diálogos sintéticos para niños usando ARASAAC")
    parser.add_argument('--samples', type=int, default=50000, help='Número de diálogos a generar')
    parser.add_argument('--words-file', default='dataset_words.json', help='Archivo de palabras ARASAAC')
    parser.add_argument('--pictos-file', default='dataset_picto.json', help='Archivo de pictogramas ARASAAC')
    parser.add_argument('--output-dir', default='data/processed', help='Directorio de salida')
    
    args = parser.parse_args()
    
    print("🚀 GENERADOR DE DIÁLOGOS PARA NIÑOS CON ARASAAC")
    print("=" * 60)
    
    # Crear generador
    generator = DialogueGeneratorForKids(args.words_file, args.pictos_file)
    
    # Generar datasets
    train_set, val_set, test_set = generator.generate_dialogue_dataset(args.samples)
    
    # Guardar datasets
    generator.save_datasets(train_set, val_set, test_set, args.output_dir)
    
    print(f"\n✅ Generación completada exitosamente!")
    print(f"📁 Archivos guardados en: {args.output_dir}")

if __name__ == '__main__':
    main()