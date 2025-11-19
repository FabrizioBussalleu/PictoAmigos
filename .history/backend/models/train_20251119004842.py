import argparse
import json
import random
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from backend.utils.dataset_utils import load_dataset, dataset_stats
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score, f1_score, confusion_matrix
import joblib
import numpy as np


def build_pipeline(max_features: int = 30000) -> Pipeline:
    return Pipeline([
        ('tfidf', TfidfVectorizer(
            lowercase=True,
            strip_accents='unicode',
            ngram_range=(1,2),
            max_features=max_features,
            min_df=2,
            max_df=0.95
        )),
        ('clf', MultinomialNB(alpha=0.5))
    ])


def train_model(
    data_dir: str = 'data/processed',
    model_out: str = 'backend/models/baseline_nb.joblib',
    max_features: int = 30000,
    limit_train: Optional[int] = None,
    seed: int = 42,
    balance: bool = False,
    metrics_out: Optional[str] = None,
) -> Dict[str, Any]:
    """Entrena el modelo Naive Bayes base y retorna las métricas."""

    random.seed(seed)
    np.random.seed(seed)

    (X_train, y_train), (X_val, y_val), (X_test, y_test) = load_dataset(data_dir)

    # Barajar entrenamiento completo primero
    indices = list(range(len(X_train)))
    random.shuffle(indices)
    X_train = [X_train[i] for i in indices]
    y_train = [y_train[i] for i in indices]

    if limit_train:
        if balance:
            # Agrupar por intent y muestrear uniformemente hasta completar limit
            by_intent: Dict[str, List[int]] = {}
            for idx, intent in enumerate(y_train):
                by_intent.setdefault(intent, []).append(idx)
            intents = list(by_intent.keys())
            per_intent = limit_train // len(intents)
            seleccion_indices: List[int] = []
            sobra = limit_train - per_intent * len(intents)
            for intent in intents:
                random.shuffle(by_intent[intent])
                take = per_intent + (1 if sobra > 0 else 0)
                if sobra > 0:
                    sobra -= 1
                seleccion_indices.extend(by_intent[intent][:take])
            random.shuffle(seleccion_indices)
            X_train = [X_train[i] for i in seleccion_indices]
            y_train = [y_train[i] for i in seleccion_indices]
        else:
            X_train = X_train[:limit_train]
            y_train = y_train[:limit_train]

    pipe = build_pipeline(max_features)
    pipe.fit(X_train, y_train)

    def evaluate(split_name: str, X, y):
        pred = pipe.predict(X)
        acc = accuracy_score(y, pred)
        f1m = f1_score(y, pred, average='macro')
        rpt = classification_report(y, pred, output_dict=True, zero_division=0)
        labels_order = sorted(list(set(y)))
        cm = confusion_matrix(y, pred, labels=labels_order).tolist()
        return {
            'accuracy': acc,
            'f1_macro': f1m,
            'report': rpt,
            'labels': labels_order,
            'confusion_matrix': cm
        }

    metrics = {
        'train': evaluate('train', X_train, y_train),
        'val': evaluate('val', X_val, y_val),
        'test': evaluate('test', X_test, y_test),
        'train_intent_distribution': dataset_stats(y_train),
        'params': {
            'max_features': max_features,
            'limit_train': limit_train,
            'balanced': balance,
            'seed': seed
        }
    }

    model_out_path = Path(model_out)
    model_out_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipe, model_out_path)

    metrics_path = Path(metrics_out) if metrics_out else model_out_path.with_name('metrics_baseline.json')
    with open(metrics_path, 'w', encoding='utf-8') as f:
        json.dump(metrics, f, ensure_ascii=False, indent=2)

    print('Guardado modelo en', model_out_path)
    print('Accuracy test:', metrics['test']['accuracy'])
    print('F1 macro test:', metrics['test']['f1_macro'])

    return metrics

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--data-dir', type=str, default='data/processed')
    parser.add_argument('--model-out', type=str, default='backend/models/baseline_nb.joblib')
    parser.add_argument('--max-features', type=int, default=30000)
    parser.add_argument('--limit-train', type=int, default=None, help='Número total de ejemplos (balanceado) para entrenamiento rápido')
    parser.add_argument('--seed', type=int, default=42)
    parser.add_argument('--balance', action='store_true', help='Forzar muestreo balanceado por intent cuando se limite el train')
    parser.add_argument('--metrics-out', type=str, default=None, help='Ruta opcional para guardar métricas')
    args = parser.parse_args()

    train_model(
        data_dir=args.data_dir,
        model_out=args.model_out,
        max_features=args.max_features,
        limit_train=args.limit_train,
        seed=args.seed,
        balance=args.balance,
        metrics_out=args.metrics_out,
    )
