# PictoAmigos - Red Social de Pictogramas con IA

Una aplicación moderna de chat con pictogramas e inteligencia artificial diseñada para niños, construida con React, TypeScript, Python y Machine Learning.

## 🚀 Características

- 🤖 **Inteligencia Artificial**: Modelo de ML que entiende 11 intenciones diferentes (SALUDAR, JUGAR, PEDIR_AYUDA, etc.)
- 🎨 **Pictogramas ARASAAC**: Sistema con 18,000+ pictogramas para comunicación visual
- 💬 **Chat Inteligente**: Respuestas contextuales con pictogramas automáticos
- 🔐 **Autenticación Segura**: Sistema completo con Supabase Auth
- ✨ **Interfaz Moderna**: Efectos glassmorphism y animaciones fluidas
- 👥 **Lista de Amigos**: Estados online/offline en tiempo real
- 📱 **Responsive**: Optimizado para móvil y escritorio
- 🧠 **Memoria Semántica**: Recuperación de intenciones usando similitud de texto

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite 7** - Build tool ultrarrápido
- **Supabase Client** - Autenticación y base de datos
- **CSS3** - Estilos modernos con variables CSS

### Backend (IA)
- **Python 3.11** - Lenguaje principal
- **FastAPI** - API REST de alto rendimiento
- **scikit-learn** - Modelo Naive Bayes + TF-IDF
- **RapidFuzz** - Búsqueda semántica de intenciones
- **pandas/numpy** - Procesamiento de datos
- **Supabase Python** - Cliente de base de datos

### Infraestructura
- **Supabase** - PostgreSQL + Auth + Storage
- **Vercel** - Hosting del frontend y API serverless

## 📦 Estructura del Proyecto

```
PictoAmigos/
├── src/                          # Frontend React
│   ├── components/               # Componentes UI
│   │   ├── ChatArea.tsx         # Chat con IA integrada
│   │   ├── LoginScreen.tsx      # Login con Supabase
│   │   ├── RegisterScreen.tsx   # Registro de usuarios
│   │   └── ...
│   ├── config/                  # Configuración
│   │   ├── supabase.ts         # Cliente Supabase
│   │   └── index.ts            # Config general
│   ├── hooks/                   # React Hooks
│   │   └── useChatService.ts   # Hook para API de chat
│   └── services/                # Servicios
│       └── apiClient.ts        # Cliente HTTP
├── backend/                     # Backend Python (IA)
│   ├── api.py                  # API FastAPI principal
│   ├── models/                 # Modelos de ML
│   │   ├── baseline_nb.joblib  # Modelo entrenado
│   │   ├── predict.py          # Predictor de intenciones
│   │   └── train.py            # Script de entrenamiento
│   ├── services/               # Lógica de negocio
│   │   ├── orchestrator.py     # Orquestador de conversación
│   │   └── semantic_memory.py  # Memoria semántica
│   ├── utils/                  # Utilidades
│   │   ├── pictos_mapping.py   # Mapeo de pictogramas
│   │   └── dataset_utils.py    # Procesamiento de datos
│   └── config.py               # Configuración del backend
├── data/                        # Datasets de entrenamiento
│   └── processed/              # Datos procesados
│       └── dialogos_train_kids.csv
├── api/                         # Vercel serverless
│   └── api.py                  # Entry point para Vercel
└── requirements.txt             # Dependencias Python
```

## 🧠 Sistema de IA

### Intenciones Soportadas
El modelo puede clasificar 11 intenciones diferentes:
- **SALUDAR** - Saludos y presentaciones
- **DESPEDIR** - Despedidas
- **JUGAR** - Propuestas de juego
- **PEDIR_AYUDA** - Solicitudes de ayuda
- **EXPRESAR_NECESIDAD** - Necesidades básicas
- **EXPRESAR_EMOCION** - Estados emocionales
- **COMER_BEBER** - Relacionado con comida
- **DESCRIBIR_DOLOR** - Dolor o malestar
- **IR_LUGAR** - Desplazamientos
- **AGRADECER** - Agradecimientos
- **FALLBACK** - Mensajes no clasificados

### Pipeline de IA
1. **Entrada** → Mensaje del usuario
2. **Clasificador NB** → Predice intención con confianza
3. **Memoria Semántica** → Busca frases similares si confianza < 45%
4. **Pictogramas** → Mapea palabras clave a 18,000+ pictogramas ARASAAC
5. **Respuesta** → Texto + pictogramas + metadata

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/FabrizioBussalleu/PictoAmigos.git
cd PictoAmigos
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz:
```env
# Frontend
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
VITE_API_URL=http://localhost:8001

# Backend (opcional, solo si usas Supabase desde Python)
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_clave_service_role
```

### 3. Configurar Supabase
Ve al SQL Editor en tu dashboard de Supabase y ejecuta:
```sql
-- Tabla de usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    nombre TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar autenticación
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política: usuarios pueden leer sus propios datos
CREATE POLICY "Usuarios pueden ver su perfil"
ON usuarios FOR SELECT
USING (auth.uid()::text = id::text);
```

### 4. Instalar Dependencias

**Frontend:**
```bash
npm install
```

**Backend (IA):**
```bash
pip install -r requirements.txt
```

### 5. Ejecutar en Local

**Opción A - Todo en uno (Recomendado):**
```bash
npm run dev:all
```
Esto inicia frontend y backend simultáneamente con colores diferenciados.

**Opción B - Por separado:**
```bash
# Terminal 1 - Backend
python run.py

# Terminal 2 - Frontend
npm run dev
```

**Opción C - Comando completo manual:**
```bash
python -m uvicorn backend.api:app --reload --port 8001
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:8080
- **Backend API**: http://127.0.0.1:8001
- **API Docs**: http://127.0.0.1:8001/docs

## 🌐 Despliegue en Producción

### Opción 1: Vercel (Recomendado)
1. Conecta tu repositorio GitHub a Vercel
2. Configura las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Vercel desplegará automáticamente frontend + backend serverless

### Opción 2: Render (Backend) + Vercel (Frontend)
**Backend en Render:**
- Runtime: Python 3.11
- Build: `pip install -r requirements.txt`
- Start: `uvicorn backend.api:app --host 0.0.0.0 --port $PORT`

**Frontend en Vercel:**
- Actualiza `VITE_API_URL` con la URL de Render

## 🧪 Endpoints de la API

### Health Check
```bash
GET /health
```
Verifica que el modelo de IA esté cargado.

### Chat
```bash
POST /chat
Content-Type: application/json

{
  "session_id": "uuid-opcional",
  "message": {
    "text": "hola quiero jugar",
    "include_pictos": true
  }
}
```

### Intenciones Disponibles
```bash
GET /intents
```

## 📊 Características Técnicas

- **Modelo de IA**: Naive Bayes con TF-IDF (scikit-learn)
- **Dataset**: 18,143 pictogramas de ARASAAC
- **Precisión**: ~85-90% en intenciones comunes
- **Memoria Semántica**: RapidFuzz con score_cutoff=78
- **Umbral de Confianza**: 45% (configurable)
- **CORS**: Habilitado para localhost y dominios Vercel

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver el archivo LICENSE para más detalles

## 👥 Equipo

Proyecto desarrollado para el curso de Inteligencia Artificial - UPC 2025
