"""Memoria semántica ligera para recuperar intenciones conocidas.

Utiliza RapidFuzz para encontrar frases similares en el dataset sintético y
sugerir la intención más probable cuando el clasificador estadístico duda.
"""
from __future__ import annotations

import csv
import random
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Sequence, Tuple

from rapidfuzz import fuzz, process


@dataclass
class SemanticMatch:
    intent: str
    text: str
    score: float  # rango 0.0 - 1.0
    source: str


class SemanticIntentMemory:
    """Pequeña base de conocimientos para recuperar ejemplos por similitud."""

    def __init__(
        self,
        dataset_path: str | Path = "data/processed/dialogos_train_kids.csv",
        *,
        per_intent: int = 400,
        score_cutoff: int = 78,
        seed: int = 42,
    ) -> None:
        self.dataset_path = Path(dataset_path)
        self.per_intent = per_intent
        self.score_cutoff = score_cutoff
        self.seed = seed
        self._entries: Sequence[Tuple[str, Dict[str, str]]] = ()
        self._loaded = False

    def is_ready(self) -> bool:
        self._ensure_loaded()
        return bool(self._entries)

    def match(self, text: str) -> Optional[SemanticMatch]:
        if not text:
            return None
        self._ensure_loaded()
        if not self._entries:
            return None

        normalized = text.lower().strip()
        if not normalized:
            return None

        result = process.extractOne(
            normalized,
            self._entries,
            scorer=fuzz.token_set_ratio,
            score_cutoff=self.score_cutoff,
        )

        if not result:
            return None

        matched_text, score, meta = result
        return SemanticMatch(
            intent=meta["intent"],
            text=matched_text,
            score=score / 100.0,
            source=meta["source"],
        )

    # ------------------------------------------------------------------
    # Helpers
    def _ensure_loaded(self) -> None:
        if self._loaded:
            return
        if not self.dataset_path.exists():
            self._loaded = True
            return

        per_intent_bucket: Dict[str, List[Tuple[str, str]]] = {}
        try:
            with self.dataset_path.open(encoding="utf-8") as handle:
                reader = csv.DictReader(handle)
                for row in reader:
                    text = (row.get("texto") or row.get("text") or "").strip()
                    intent = (row.get("intent") or "").strip()
                    if not text or not intent:
                        continue
                    per_intent_bucket.setdefault(intent, []).append((text.lower(), text))
        except Exception:
            self._loaded = True
            return

        rng = random.Random(self.seed)
        entries: List[Tuple[str, Dict[str, str]]] = []
        for intent, sentences in per_intent_bucket.items():
            rng.shuffle(sentences)
            limited = sentences[: self.per_intent] if self.per_intent > 0 else sentences
            for normalized, original in limited:
                entries.append(
                    (
                        normalized,
                        {
                            "intent": intent,
                            "source": original,
                        },
                    )
                )

        self._entries = tuple(entries)
        self._loaded = True


__all__ = ["SemanticIntentMemory", "SemanticMatch"]
