# Deploy en Vercel - Chat con IA

## Configuración para Vercel

Este proyecto está configurado para funcionar tanto en desarrollo local como en producción en Vercel.

### Archivos de configuración

- `vercel.json`: Configuración de Vercel para el backend Python
- `api.py`: Punto de entrada para Vercel
- `.vercelignore`: Archivos a ignorar en el deploy
- `requirements.txt`: Dependencias de Python

### URLs de la aplicación

- **Frontend**: `https://tp-ia.vercel.app` (o tu dominio de Vercel)
- **Backend**: `https://tp-ia.vercel.app/api` (mismo dominio, ruta `/api`)

### Configuración de CORS

El backend está configurado para aceptar peticiones desde:
- `http://localhost:3000` (desarrollo React)
- `http://localhost:5173` (desarrollo Vite)
- `http://localhost:8080` (desarrollo local)
- `https://*.vercel.app` (producción Vercel)

### Modelo de IA

- Si no existe el modelo entrenado, se crea automáticamente un modelo básico
- El modelo básico incluye intenciones comunes: SALUDAR, DESPEDIR, JUGAR, etc.
- Para un modelo más completo, ejecuta `python backend/setup.py` localmente

### Deploy

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente la configuración
3. El frontend y backend se desplegarán juntos
4. Las rutas `/api/*` se dirigirán al backend Python

### Endpoints disponibles

- `GET /api/health` - Estado del sistema
- `POST /api/chat` - Procesar mensajes del chat
- `GET /api/intents` - Lista de intenciones soportadas

### Troubleshooting

Si el chat no funciona en Vercel:

1. Verifica que el backend esté funcionando: `https://tu-dominio.vercel.app/api/health`
2. Revisa los logs de Vercel para errores
3. Asegúrate de que el modelo se esté creando correctamente
4. Verifica que las URLs en el frontend sean correctas
