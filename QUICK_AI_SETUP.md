# 🚀 Configuración Rápida del Generador de Efemérides con IA

## ⚡ Setup de 5 Minutos

### 1. Obtener API Key de OpenAI
1. Ve a: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copia la key (empieza con `sk-`)

### 2. Configurar Variables de Entorno
Edita tu archivo `.env.local`:
```bash
# Agrega esta línea con tu API key real
OPENAI_API_KEY=sk-tu-api-key-aqui

# Opcional: Para proteger el endpoint
CRON_SECRET=mi-secreto-super-seguro-123
```

### 3. Probar el Sistema
```bash
# Reiniciar el servidor
npm run dev

# En la aplicación, usar el comando:
generate
```

## 🎮 Comandos Nuevos en la Terminal

- **`generate`** - Genera una nueva efeméride usando IA
- **`generar`** - Alias en español del comando anterior

## 🔧 Testing Manual

### Desde la Terminal de la App
```
user@ephemeris-terminal:~$ generate
```

### Desde el Navegador (API directa)
```javascript
// Abre la consola del navegador (F12) y ejecuta:
fetch('/api/generate-ephemeris', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

### Desde cURL
```bash
curl -X POST http://localhost:3000/api/generate-ephemeris
```

## 📅 Automatización (Opcional)

### Vercel (Automático)
Si deployeas en Vercel, ya está configurado para ejecutarse diariamente a las 23:00.

### Manual (Cron Job)
```bash
# Editar crontab
crontab -e

# Agregar línea (ejecuta diariamente a las 23:00)
0 23 * * * curl -X POST https://tu-app.vercel.app/api/generate-ephemeris
```

## ⚠️ Notas Importantes

### 💰 Costos
- Aproximadamente $0.002-0.003 USD por efeméride
- ~$0.10 USD por mes (30 efemérides)
- Necesitas créditos en tu cuenta de OpenAI

### 🎯 Precisión
- El sistema valida dos veces cada evento histórico
- GPT-4 verifica que la fecha sea correcta
- Aún así, siempre puedes revisar las efemérides generadas

### 🔄 Respaldo
- Si falla la generación con IA, la app sigue funcionando
- Usa las efemérides hardcodeadas como respaldo
- Puedes generar manualmente cuando quieras

## 🚨 Solución de Problemas

### Error: "OpenAI API key not configured"
- Verifica que `OPENAI_API_KEY` esté en `.env.local`
- Reinicia el servidor: `npm run dev`

### Error: "Insufficient credits"
- Agrega créditos a tu cuenta de OpenAI
- Mínimo $5 USD recomendado

### Error: "Failed to generate valid ephemeris"
- La IA no encontró un evento histórico válido para esa fecha
- Es normal, algunos días tienen pocos eventos tecnológicos
- Puedes intentar de nuevo o usar `random` en su lugar

## 🎉 ¡Listo!

Ahora tu aplicación puede generar efemérides históricas automáticamente usando inteligencia artificial. Cada día tendrás contenido fresco y verificado! 🚀
