import csv
from pathlib import Path
from typing import List, Dict, Tuple


def load_split(path: str) -> Tuple[List[str], List[str]]:
    textos, intents = [], []
    with open(path, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            textos.append(row['texto'])
            intents.append(row['intent'])
    return textos, intents


def load_dataset(processed_dir: str):
    base = Path(processed_dir)
    # Usar los nuevos archivos optimizados para niños
    train_file = base / 'dialogos_train_kids.csv'
    val_file = base / 'dialogos_val_kids.csv'
    test_file = base / 'dialogos_test_kids.csv'
    
    # Fallback a archivos originales si los nuevos no existen
    if not train_file.exists():
        train_file = base / 'dialogos_train.csv'
    if not val_file.exists():
        val_file = base / 'dialogos_val.csv'
    if not test_file.exists():
        test_file = base / 'dialogos_test.csv'
    
    X_train, y_train = load_split(str(train_file))
    X_val, y_val = load_split(str(val_file))
    X_test, y_test = load_split(str(test_file))
    return (X_train, y_train), (X_val, y_val), (X_test, y_test)


def dataset_stats(intents: List[str]) -> Dict[str, int]:
    counts: Dict[str, int] = {}
    for i in intents:
        counts[i] = counts.get(i, 0) + 1
    return counts
