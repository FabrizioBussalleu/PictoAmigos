# Sistema de Chat con IA - PictoAmigos

## 🚀 Descripción

Sistema de chat inteligente que integra un modelo de IA para procesar mensajes de niños y generar respuestas apropiadas con pictogramas. El sistema incluye:

- **Frontend React**: Interfaz moderna y amigable
- **Backend FastAPI**: API REST para procesamiento de mensajes
- **Modelo de IA**: Clasificador Naive Bayes con TF-IDF
- **Sistema de Pictogramas**: Mapeo automático de texto a pictogramas
- **11 Intenciones**: SALUDAR, PEDIR_OBJETO, EMOCION, etc.

## 🏗️ Arquitectura

```
├── src/                    # Frontend React
│   ├── components/
│   │   └── ChatArea.tsx    # Componente de chat con IA
│   └── index.css           # Estilos actualizados
├── backend/                # Backend Python
│   ├── api.py             # API FastAPI
│   ├── models/            # Modelos de IA
│   ├── utils/             # Utilidades
│   └── scripts/           # Scripts de generación
├── data/                   # Datos de entrenamiento
└── requirements.txt        # Dependencias Python
```

## 🚀 Instalación y Uso

### 1. Configurar Backend (IA)

```bash
# Instalar dependencias Python
pip install -r requirements.txt

# Configurar y entrenar el modelo
python backend/setup.py

# Iniciar servidor backend
python start_backend.py
```

El backend estará disponible en:
- **API**: http://localhost:8000
- **Documentación**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### 2. Configurar Frontend

```bash
# Instalar dependencias Node.js
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en:
- **Aplicación**: http://localhost:5173

## 🤖 Funcionalidades de IA

### Intenciones Soportadas

1. **SALUDAR**: "hola", "buenos días", "hey"
2. **PEDIR_OBJETO**: "quiero agua", "me das la pelota"
3. **EMOCION**: "estoy triste", "me siento feliz"
4. **NECESIDAD_FISICA**: "tengo hambre", "quiero ir al baño"
5. **DOLOR**: "me duele la cabeza", "dolor de barriga"
6. **JUGAR**: "quiero jugar", "vamos a jugar futbol"
7. **DESPEDIR**: "adiós", "hasta luego"
8. **AYUDA**: "necesito ayuda", "no entiendo"
9. **CONFIRMACION**: "sí", "está bien", "de acuerdo"
10. **NEGACION**: "no", "no quiero", "no me gusta"
11. **FALLBACK**: Respuestas para entrada no reconocida

### Características del Chat

- **Toggle de IA**: Activar/desactivar procesamiento inteligente
- **Pictogramas Automáticos**: Mapeo de texto a pictogramas
- **Información de Intención**: Muestra la intención detectada
- **Confianza**: Porcentaje de confianza de la predicción
- **Fallback Inteligente**: Respuestas apropiadas cuando no se entiende

## 🔧 API Endpoints

### POST /chat
Procesa un mensaje y retorna respuesta del asistente

**Request:**
```json
{
  "text": "hola quiero jugar",
  "include_pictos": true
}
```

**Response:**
```json
{
  "input": "hola quiero jugar",
  "prediction": [
    {"intent": "SALUDAR", "prob": 0.8},
    {"intent": "JUGAR", "prob": 0.6}
  ],
  "decided_intent": "SALUDAR",
  "best_prob": 0.8,
  "status": "OK",
  "response": "¡Hola! ¿Cómo estás hoy?",
  "pictos": ["saludo1", "jugar1"]
}
```

### GET /health
Verificación de salud del sistema

### GET /intents
Lista de intenciones soportadas

## 🎨 Interfaz de Usuario

### Características del Chat

- **Indicador de IA**: Muestra si la IA está activa
- **Botón Toggle**: Activar/desactivar IA fácilmente
- **Badges de Intención**: Muestra la intención detectada
- **Confianza**: Porcentaje de confianza de la predicción
- **Pictogramas**: Muestra pictogramas relacionados
- **Estados de Carga**: Indicadores visuales durante procesamiento

### Controles

- **Toggle IA**: Botón 🤖 para activar/desactivar IA
- **Pictogramas**: Botones para agregar pictogramas
- **Envío**: Botón de envío con estados de carga

## 📊 Modelo de IA

### Arquitectura
- **Vectorizador**: TF-IDF con n-gramas (1,2)
- **Clasificador**: Naive Bayes Multinomial
- **Características**: 30,000 features máximo
- **Preprocesamiento**: Normalización, stopwords, acentos

### Métricas
- **Accuracy**: ~96%
- **F1 Macro**: ~95%
- **Vocabulario**: 1,358 tokens únicos
- **Latencia**: ~300ms promedio

## 🛠️ Desarrollo

### Estructura del Proyecto

```
backend/
├── api.py                 # API FastAPI principal
├── setup.py              # Configuración automática
├── models/
│   ├── predict.py        # Sistema de predicción
│   └── train.py          # Entrenamiento del modelo
├── utils/
│   ├── dataset_utils.py  # Utilidades de datos
│   └── pictos_mapping.py # Mapeo de pictogramas
└── scripts/
    └── generate_data.py   # Generación de datos sintéticos
```

### Comandos Útiles

```bash
# Entrenar modelo
python backend/models/train.py

# Generar datos sintéticos
python backend/scripts/generate_data.py --total 10000

# Probar API
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"text": "hola quiero jugar", "include_pictos": true}'
```

## 🐛 Solución de Problemas

### Backend no inicia
1. Verificar que Python 3.8+ esté instalado
2. Instalar dependencias: `pip install -r requirements.txt`
3. Ejecutar configuración: `python backend/setup.py`

### Frontend no conecta con Backend
1. Verificar que el backend esté corriendo en puerto 8000
2. Revisar CORS en `backend/api.py`
3. Verificar URL en `src/components/ChatArea.tsx`

### Modelo no carga
1. Verificar que existe `backend/models/baseline_nb.joblib`
2. Ejecutar entrenamiento: `python backend/models/train.py`
3. Revisar logs del servidor

## 📝 Notas Técnicas

- **CORS**: Configurado para localhost:3000 y localhost:5173
- **Fallback**: Sistema de respuestas cuando la IA falla
- **Pictogramas**: Mapeo simbólico (extensible a ARASAAC)
- **Datos**: Generación sintética para entrenamiento
- **Modelo**: Entrenado con 600k ejemplos balanceados

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para facilitar la comunicación inclusiva**

