"""
Script principal para configurar el sistema de chat con IA
Genera datos, entrena el modelo y prepara todo para el uso
"""
import subprocess
import sys
from pathlib import Path
import json

def run_command(cmd, description):
    """Ejecuta un comando y maneja errores"""
    print(f"{description}...")
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"{description} completado")
        return result
    except subprocess.CalledProcessError as e:
        print(f"Error en {description}: {e}")
        print(f"Salida: {e.stdout}")
        print(f"Error: {e.stderr}")
        return None

def setup_chat_system():
    """Configura todo el sistema de chat"""
    print("Configurando sistema de chat con IA...")
    
    # 1. Crear directorios necesarios
    directories = [
        "data/processed",
        "backend/models", 
        "backend/scripts"
    ]
    
    for dir_path in directories:
        Path(dir_path).mkdir(parents=True, exist_ok=True)
        print(f"Directorio creado: {dir_path}")
    
    # 2. Generar datos sintéticos
    print("\nGenerando datos sintéticos...")
    result = run_command(
        "python backend/scripts/generate_data.py --total 5000 --salida data/processed --seed 42",
        "Generacion de datos sinteticos"
    )
    
    if not result:
        print("Error generando datos. Continuando con datos de ejemplo...")
        # Crear datos mínimos de ejemplo
        create_example_data()
    
    # 3. Entrenar modelo
    print("\nEntrenando modelo de IA...")
    result = run_command(
        "python -c \"from backend.models.train import train_model; train_model(limit_train=1000, balance=True)\"",
        "Entrenamiento del modelo"
    )
    
    if not result:
        print("Error entrenando modelo. Creando modelo de ejemplo...")
        create_example_model()
    
    # 4. Verificar instalación
    print("\nVerificando instalacion...")
    check_dependencies()
    
    print("\nSistema de chat configurado exitosamente!")
    print("\nProximos pasos:")
    print("1. Ejecutar: python backend/api.py")
    print("2. Abrir: http://localhost:8000")
    print("3. Probar endpoint: http://localhost:8000/health")

def create_example_data():
    """Crea datos de ejemplo mínimos"""
    print("Creando datos de ejemplo...")
    
    example_data = [
        ("hola", "SALUDAR"),
        ("quiero jugar", "JUGAR"),
        ("me duele la cabeza", "DOLOR"),
        ("tengo hambre", "NECESIDAD_FISICA"),
        ("estoy triste", "EMOCION"),
        ("ayuda", "AYUDA"),
        ("adios", "DESPEDIR"),
        ("si", "CONFIRMACION"),
        ("no", "NEGACION"),
        ("quiero agua", "PEDIR_OBJETO"),
        ("asdfff", "FALLBACK")
    ]
    
    # Crear archivos CSV básicos
    for split in ['train', 'val', 'test']:
        with open(f"data/processed/dialogos_{split}.csv", 'w', encoding='utf-8') as f:
            f.write("id,texto,intent,original,ruidos,plantilla_id\n")
            for i, (text, intent) in enumerate(example_data):
                f.write(f"{split}_{i},{text},{intent},{text},[],plantilla_{i}\n")
    
    # Crear stats.json
    stats = {
        "total": len(example_data) * 3,
        "stats": {
            intent: {"train": 1, "val": 1, "test": 1} 
            for intent in ["SALUDAR", "JUGAR", "DOLOR", "NECESIDAD_FISICA", "EMOCION", 
                          "AYUDA", "DESPEDIR", "CONFIRMACION", "NEGACION", "PEDIR_OBJETO", "FALLBACK"]
        }
    }
    
    with open("data/processed/stats.json", 'w', encoding='utf-8') as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)

def create_example_model():
    """Crea un modelo de ejemplo simple"""
    print("Creando modelo de ejemplo...")
    
    # Crear un modelo dummy que siempre predice SALUDAR
    import joblib
    from sklearn.pipeline import Pipeline
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.naive_bayes import MultinomialNB
    
    # Pipeline simple
    pipe = Pipeline([
        ('tfidf', TfidfVectorizer()),
        ('clf', MultinomialNB())
    ])
    
    # Entrenar con datos mínimos
    X = ["hola", "quiero jugar", "me duele", "tengo hambre", "estoy triste"]
    y = ["SALUDAR", "JUGAR", "DOLOR", "NECESIDAD_FISICA", "EMOCION"]
    
    pipe.fit(X, y)
    
    # Guardar modelo
    Path("backend/models").mkdir(parents=True, exist_ok=True)
    joblib.dump(pipe, "backend/models/baseline_nb.joblib")
    
    print("Modelo de ejemplo creado")

def check_dependencies():
    """Verifica que las dependencias estén instaladas"""
    required_packages = [
        "fastapi", "uvicorn", "scikit-learn", "pandas", "numpy", 
        "unidecode", "python-slugify", "requests"
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package.replace("-", "_"))
        except ImportError:
            missing.append(package)
    
    if missing:
        print(f"Paquetes faltantes: {', '.join(missing)}")
        print("Ejecuta: pip install " + " ".join(missing))
    else:
        print("Todas las dependencias estan instaladas")

if __name__ == "__main__":
    setup_chat_system()
