# 🤖 Sistema de Generación Automática de Efemérides con IA

Este sistema genera automáticamente efemérides históricas de programación usando OpenAI GPT-4 y las almacena en Supabase.

## 🎯 **Características Principales**

### ✅ **Verificación de Precisión Histórica**
- **Doble validación**: Genera el evento y luego verifica su veracidad histórica
- **Fecha exacta**: Asegura que el evento realmente ocurrió en esa fecha específica
- **Fuentes confiables**: Usa GPT-4 con prompts específicos para datos históricos

### 🔄 **Generación Automática**
- **Cron diario**: Genera efemérides para el día siguiente cada noche a las 23:00
- **Prevención de duplicados**: Verifica si ya existe una efeméride para esa fecha
- **Reintentos inteligentes**: Hasta 3 intentos si la primera generación falla

### 🛡️ **Seguridad y Validación**
- **Autenticación**: Endpoint protegido con `CRON_SECRET`
- **Validación de fechas**: Verifica formato y validez de fechas
- **Manejo de errores**: Logging completo y manejo de fallos

## 🚀 **Configuración**

### 1. Variables de Entorno
```bash
# .env.local
OPENAI_API_KEY=sk-your-openai-key-here
CRON_SECRET=your-secret-key-for-cron-jobs
```

### 2. Obtener API Key de OpenAI
1. Ve a [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Crea una nueva API key
3. Agrega créditos a tu cuenta (mínimo $5 USD)
4. Agrega la key a tu `.env.local`

### 3. Configurar Cron Secret (Opcional)
```bash
# Genera un string aleatorio seguro
openssl rand -base64 32
```

## 📡 **API Endpoints**

### POST `/api/generate-ephemeris`
Genera una efeméride para el día siguiente.

```bash
curl -X POST \
  -H "Authorization: Bearer your-cron-secret" \
  -H "Content-Type: application/json" \
  http://localhost:3000/api/generate-ephemeris
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "ephemeris": {
    "id": "uuid",
    "date": "2025-08-15",
    "event": "Evento histórico generado",
    "display_date": "08-15"
  },
  "message": "Successfully generated and saved ephemeris for 08-15",
  "attempts": 1
}
```

### GET `/api/generate-ephemeris`
Información sobre el endpoint.

### POST `/api/generate-ephemeris?date=YYYY-MM-DD`
Genera efeméride para fecha específica.

## ⚙️ **Automatización**

### Opción 1: Vercel Cron (Recomendado para producción)
El archivo `vercel.json` ya está configurado:
```json
{
  "crons": [
    {
      "path": "/api/generate-ephemeris",
      "schedule": "0 23 * * *"
    }
  ]
}
```

### Opción 2: Cron Job Tradicional
```bash
# Editar crontab
crontab -e

# Agregar línea para ejecutar diariamente a las 23:00
0 23 * * * /path/to/your/scripts/generate-daily-ephemeris.sh
```

### Opción 3: GitHub Actions
```yaml
# .github/workflows/generate-ephemeris.yml
name: Generate Daily Ephemeris
on:
  schedule:
    - cron: '0 23 * * *'  # Diariamente a las 23:00 UTC
  workflow_dispatch:  # Permite ejecución manual

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Generate Ephemeris
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json" \
            ${{ secrets.APP_URL }}/api/generate-ephemeris
```

## 🧪 **Testing y Desarrollo**

### Testing Manual
```javascript
// En la consola del navegador
import { testEphemerisGeneration } from '@/lib/ephemeris-testing'

// Generar para mañana
await testEphemerisGeneration()

// Generar para fecha específica
await generateEphemerisForSpecificDate('2025-12-25')

// Verificar existentes
await checkExistingEphemerides()

// Agregar manualmente
await addManualEphemeris('2025-08-14', 'Evento histórico manual')
```

### Testing con cURL
```bash
# Test local
curl -X POST http://localhost:3000/api/generate-ephemeris

# Test con autenticación
curl -X POST \
  -H "Authorization: Bearer your-secret" \
  http://localhost:3000/api/generate-ephemeris

# Test para fecha específica
curl -X POST "http://localhost:3000/api/generate-ephemeris?date=2025-12-25"
```

## 📊 **Proceso de Validación**

### 1. Generación Inicial
```
Prompt: "Encuentra un evento histórico REAL que ocurrió el [fecha]"
↓
GPT-4 genera evento específico
↓
Extrae texto limpio (sin fechas, máximo 200 caracteres)
```

### 2. Verificación Histórica
```
Prompt: "Verifica si este evento ocurrió exactamente en esta fecha"
↓
GPT-4 responde "VERDADERO" o "FALSO"
↓
Solo se acepta si la verificación es "VERDADERO"
```

### 3. Almacenamiento
```
Si pasa verificación:
↓
Calcula display_date (MM-DD)
↓
Inserta en Supabase con metadata completa
```

## 🔍 **Monitoring y Logs**

### Logs de Desarrollo
```bash
# Ver logs en desarrollo
npm run dev
# Los logs aparecerán en la consola
```

### Logs de Producción (Vercel)
```bash
# Ver logs de funciones
vercel logs
```

### Logs del Script Bash
```bash
# Ver logs del cron job
tail -f /var/log/ephemeris-generator.log
```

## ⚠️ **Consideraciones Importantes**

### 💰 **Costos de OpenAI**
- Cada generación usa ~150-200 tokens
- Verificación usa ~50 tokens adicionales
- Costo aproximado: $0.002-0.003 USD por efeméride
- Costo mensual estimado: ~$0.10 USD (30 efemérides)

### 🎯 **Precisión Histórica**
- Sistema de doble validación minimiza errores
- GPT-4 es más preciso que GPT-3.5 para datos históricos
- Aún así, revisar ocasionalmente las efemérides generadas

### 🔄 **Manejo de Fallos**
- Si falla 3 veces, no se genera nada para ese día
- Logs detallados para debugging
- Posibilidad de regeneración manual

### 📅 **Fechas Especiales**
- Algunos días pueden tener pocos eventos históricos
- El sistema intentará encontrar eventos relacionados
- Como respaldo, siempre tienes las efemérides hardcodeadas

## 🚀 **Deployment**

### Variables de Entorno en Producción
```bash
# Vercel
vercel env add OPENAI_API_KEY
vercel env add CRON_SECRET

# Netlify
netlify env:set OPENAI_API_KEY sk-your-key
netlify env:set CRON_SECRET your-secret
```

### Testing en Producción
```bash
# Verificar que funciona después del deploy
curl -X POST https://your-app.vercel.app/api/generate-ephemeris
```

Este sistema asegura que siempre tengas contenido fresco y históricamente preciso para tu aplicación de efemérides! 🎉
