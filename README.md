# 🖥️ Programming Ephemeris Terminal

> Un terminal interactivo retro que muestra efemérides de programación e historia tecnológica, con generación automática mediante IA usando GPT-4o a través de OpenRouter.ai. Sistema refactorizado con **arquitectura enterprise-level** modular, base de datos Supabase y automatización con Vercel Cron Jobs.

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-orange)](https://openrouter.ai)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 Descripción

Programming Ephemeris Terminal es una aplicación web interactiva que simula un terminal retro y muestra eventos históricos relevantes sobre programación, tecnología e informática. El proyecto combina nostalgia visual con tecnología moderna para crear una experiencia educativa única que genera automáticamente contenido histórico verificado.

### ✨ Características Principales

- **🖥️ Terminal Retro**: Interfaz que simula una terminal clásica con efectos typewriter animados
- **📅 Efemérides Diarias**: Eventos históricos de programación mostrados automáticamente cada día
- **🤖 IA Integrada**: Generación automática de efemérides mediante GPT-4o con validación histórica
- **🔄 Sistema Híbrido**: Base de conocimiento verificado + generación inteligente con IA
- **⏰ Automatización Completa**: Cron jobs que generan nuevas efemérides diariamente a las 00:00 UTC
- **💾 Persistencia**: Almacenamiento en Supabase PostgreSQL con políticas RLS
- **📱 Responsive**: Optimizado para dispositivos móviles y desktop
- **🔒 Seguridad**: Autenticación de Cron Jobs y validación de API Keys
- **🏗️ Arquitectura Modular**: Código refactorizado con separación de responsabilidades
- **📊 Logging Profesional**: Sistema de logs centralizado con niveles y emojis

## 🚀 Demo en Vivo

**[🌐 Ver Demo](https://programming-ephemeris-terminal.vercel.app)**

### Comandos Disponibles del Terminal
```bash
help      # Mostrar todos los comandos disponibles
refresh   # Generar nueva efeméride del día actual
history   # Ver historial completo de comandos ejecutados
clear     # Limpiar pantalla del terminal
exit      # Mostrar mensaje de despedida
```

## 🛠️ Stack Tecnológico

### Frontend
- **[Next.js 15](https://nextjs.org)** - Framework React con App Router
- **[React 19](https://react.dev)** - Biblioteca de UI con Server Components
- **[TypeScript](https://www.typescriptlang.org)** - Tipado estático
- **[Tailwind CSS](https://tailwindcss.com)** - Framework de CSS utility-first
- **[Shadcn/ui](https://ui.shadcn.com)** - Componentes de UI con Radix UI

### Backend
- **[Supabase](https://supabase.com)** - Base de datos PostgreSQL + Auth
- **[OpenRouter](https://openrouter.ai)** - API Gateway para modelos de IA
- **[GPT-4o](https://openai.com)** - Modelo de IA para generación de contenido

### Infraestructura
- **[Vercel](https://vercel.com)** - Hosting y despliegue automático
- **Vercel Cron Jobs** - Automatización de tareas programadas

## 📦 Instalación Local

### Prerequisitos
- Node.js 18+ 
- npm o pnpm
- Cuenta de Supabase
- API Key de OpenRouter

### 1. Clonar Repositorio
```bash
git clone https://github.com/davidcaroo/programming-ephemeris-terminal.git
cd programming-ephemeris-terminal
```

### 2. Instalar Dependencias
```bash
npm install --legacy-peer-deps
# o
pnpm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# OpenRouter Configuration
OPENAI_API_KEY=sk-or-v1-tu-api-key

# Cron Job Security
CRON_SECRET=tu-secreto-para-cron
```

### 4. Configurar Base de Datos
Ejecuta en Supabase SQL Editor:

```sql
-- Crear tabla de efemérides
CREATE TABLE ephemerides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  event TEXT NOT NULL,
  display_date VARCHAR(5) NOT NULL,
  category VARCHAR(50) DEFAULT 'programming',
  language VARCHAR(5) DEFAULT 'es',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurar políticas RLS
ALTER TABLE ephemerides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON ephemerides
  FOR SELECT USING (true);

CREATE POLICY "Public insert access" ON ephemerides
  FOR INSERT WITH CHECK (true);

-- Crear índices
CREATE INDEX idx_ephemerides_display_date ON ephemerides(display_date);
CREATE INDEX idx_ephemerides_date ON ephemerides(date);
```

### 5. Ejecutar en Desarrollo
```bash
npm run dev
# o
pnpm dev
```

Visita [http://localhost:3000](http://localhost:3000)

## 🎯 Arquitectura del Sistema

### Estructura Modular Refactorizada

```
├── app/
│   ├── api/generate-ephemeris/     # API para generación con IA
│   │   └── route.ts               # Endpoint principal refactorizado
│   ├── layout.tsx                  # Layout principal
│   └── page.tsx                    # Página principal
├── components/
│   ├── terminal-ephemeris.tsx      # Componente principal del terminal
│   ├── typewriter-text.tsx         # Efecto de texto typewriter
│   └── ui/                         # Componentes de Shadcn/ui
├── lib/                           # 🆕 Módulos refactorizados
│   ├── date-utils.ts              # Utilidades de fechas y validaciones
│   ├── verified-events.ts         # Base de conocimiento verificado
│   ├── logger.ts                  # Sistema de logging centralizado
│   └── supabase.ts                # Cliente Supabase optimizado
├── hooks/                         # React hooks personalizados
├── database/                      # Scripts SQL
└── vercel.json                    # Configuración de cron jobs
```

### Módulos de Utilidades

#### 📅 `/lib/date-utils.ts`
```typescript
// Funciones centralizadas para manejo de fechas
formatDisplayDate(date)    // MM-DD format
formatHumanDate(date)      // "D de mes" format  
formatFullDate(date)       // YYYY-MM-DD format
isValidDate(dateString)    // Validación de fechas
validateEventContent(text) // Validación de contenido
```

#### 📚 `/lib/verified-events.ts`
```typescript
// Base de conocimiento curado manualmente
const VERIFIED_EVENTS = {
  "08-16": "Se lanza Internet Explorer...",
  "08-15": "IBM anuncia retiro System/390...",
  // Eventos históricos verificados
}
getVerifiedEventForDate(date) // Obtener evento verificado
```

#### 📊 `/lib/logger.ts`
```typescript
// Sistema de logging profesional
logger.debug("🐞 Debug info")    // Solo en desarrollo
logger.info("ℹ️ General info")   // Siempre visible
logger.warn("⚠️ Warning")        // Advertencias
logger.error("❌ Error")         // Errores críticos
```

#### 🗄️ `/lib/supabase.ts` (Optimizado)
```typescript
// Funciones de base de datos optimizadas
getEphemerides()              // Todas las efemérides
getEphemerisByDisplayDate()   // Por fecha MM-DD
getTodayRandomEphemeris()     // Aleatoria del día
getRandomEphemeris()          // Aleatoria global (RANDOM() + LIMIT)
addEphemeris()                // Insertar nueva
```

### Flujo de Datos Refactorizado

1. **📥 Carga Inicial**: Terminal obtiene efeméride desde `getTodayRandomEphemeris()`
2. **🔄 Comando Refresh**: Llama a `/api/generate-ephemeris` con validación mejorada
3. **⏰ Cron Job Diario**: Genera automáticamente para el día siguiente a las 00:00 UTC
4. **🎯 Sistema Híbrido**: 
   - 1️⃣ Verifica eventos en `verified-events.ts`
   - 2️⃣ Si no existe → Genera con IA
   - 3️⃣ Valida contenido con `validateEventContent()`
   - 4️⃣ Guarda con `addEphemeris()`

## 🔧 API Reference

### POST `/api/generate-ephemeris`

Genera una nueva efeméride para el día actual (refactorizado).

**Headers:**
```http
Authorization: Bearer tu-cron-secret  # Para cron jobs
Content-Type: application/json
```

**Response:**
```json
{
  "ephemeris": {
    "id": "uuid",
    "date": "2025-08-17",
    "event": "Se lanza la primera versión del navegador...",
    "display_date": "08-17",
    "category": "programming",
    "language": "es"
  },
  "date": "2025-08-17",
  "displayDate": "08-17",
  "message": "Efeméride generada y consultada para el día actual."
}
```

### GET `/api/generate-ephemeris`

Información sobre el endpoint.

**Query Parameters:**
```http
?date=2025-08-17  # Opcional: fecha específica (YYYY-MM-DD)
```

**Response:**
```json
{
  "message": "Use POST method to generate ephemeris",
  "targetDate": "2025-08-17",
  "displayDate": "08-17",
  "usage": {
    "post": "Generates ephemeris for current day",
    "description": "This endpoint generates programming history ephemeris"
  }
}
```

### 🤖 Proceso de Generación con IA

1. **🔍 Verificación**: Busca en `VERIFIED_EVENTS[displayDate]`
2. **🎲 IA Backup**: Si no existe → `withRetries()` con 3 intentos
3. **✅ Validación**: `validateEventContent()` asegura calidad
4. **💾 Persistencia**: `addEphemeris()` guarda en Supabase
5. **📊 Logging**: Sistema centralizado registra todo el proceso

### Cron Job Automático

**Schedule**: Diario a las 00:00 UTC  
**Endpoint**: `/api/generate-ephemeris`  
**Función**: Genera efeméride del día siguiente  
**Auth**: Requiere `CRON_SECRET` en Authorization header

## 🚀 Despliegue en Vercel

### 1. Conectar Repositorio
1. Ve a [vercel.com](https://vercel.com)
2. Conecta con GitHub
3. Importa `programming-ephemeris-terminal`

### 2. Configurar Variables de Entorno
En Vercel Settings → Environment Variables:

```env
OPENAI_API_KEY=sk-or-v1-tu-api-key
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
CRON_SECRET=tu-secreto-para-cron
```

### 3. Desplegar
El archivo `vercel.json` está preconfigurado para el cron job diario.

## 📊 Monitoreo y Logs

### Vercel Functions
- Revisa logs en Vercel Dashboard → Functions
- Monitorea ejecución de cron jobs
- Analiza errores de API

### Supabase Dashboard
- Monitorea inserciones en tabla `ephemerides`
- Revisa políticas RLS
- Analiza consultas SQL

## 🧪 Testing

### Probar Localmente
```bash
# Generar efeméride manualmente
curl -X POST http://localhost:3000/api/generate-ephemeris \
  -H "Content-Type: application/json" \
  -d '{"forceGenerate": true}'

# Probar comando refresh en terminal
# Visita http://localhost:3000 y escribe 'refresh'
```

### Probar en Producción
```bash
# Probar API endpoint
curl -X POST https://tu-app.vercel.app/api/generate-ephemeris \
  -H "Authorization: Bearer tu-cron-secret" \
  -H "Content-Type: application/json"
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit changes: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

### Agregar Nuevos Eventos Verificados

Edita `/lib/verified-events.ts`:

```typescript
const VERIFIED_EVENTS: Record<string, string> = {
  "MM-DD": "Tu evento tecnológico verificado (YYYY)",
  "08-17": "Nuevo evento para mañana...",
}
```

### Extender Utilidades de Fecha

Agrega funciones en `/lib/date-utils.ts`:

```typescript
export function tuNuevaFuncion(date: Date): string {
  // Tu lógica personalizada
  return formatDisplayDate(date)
}
```

### Personalizar Sistema de Logs

Modifica `/lib/logger.ts` para agregar nuevos niveles:

```typescript
export const logger = {
  debug: (msg: string, ...args: any[]) => log('debug', msg, ...args),
  trace: (msg: string, ...args: any[]) => log('trace', msg, ...args), // Nuevo
  // ... otros niveles
}
```

## 📝 Changelog

### v1.1.0 (2025-08-16) - 🏗️ REFACTORIZACIÓN ENTERPRISE-LEVEL

#### 🚀 Arquitectura Modular Implementada
- ✅ **Separación de responsabilidades**: Código dividido en módulos especializados
- ✅ **`/lib/date-utils.ts`**: Utilidades centralizadas de fechas y validaciones
- ✅ **`/lib/verified-events.ts`**: Base de conocimiento verificado independiente
- ✅ **`/lib/logger.ts`**: Sistema de logging profesional con niveles y emojis
- ✅ **Reducción 66% código**: De 388 a 130 líneas en route.ts principal

#### 🔧 Optimizaciones de Rendimiento  
- ✅ **Helper `withRetries()`**: Manejo elegante de reintentos con delays
- ✅ **Supabase optimizado**: `getRandomEphemeris()` usa `RANDOM() + LIMIT 1`
- ✅ **Prompt IA simplificado**: De 25+ líneas a 10 líneas concisas
- ✅ **Logging condicional**: Solo debug en desarrollo, errores siempre visibles

#### 🎯 Mejoras de Calidad
- ✅ **TypeScript interfaces**: `ApiResponse`, `ApiError` para tipado fuerte
- ✅ **Configuración centralizada**: Constantes CONFIG para magic values
- ✅ **Validación mejorada**: `validateEventContent()` con múltiples checks
- ✅ **Try-catch comprehensive**: Manejo de errores en todas las funciones

#### 📊 Sistema de Logging Profesional
- ✅ **Niveles estructurados**: debug 🐞, info ℹ️, warn ⚠️, error ❌
- ✅ **Timestamps automáticos**: Logging con fecha/hora para debugging
- ✅ **Environment-aware**: Comportamiento diferente en dev vs production

### v1.0.0 (2025-08-16) - 🎯 LANZAMIENTO INICIAL
- ✅ Terminal interactivo con comandos funcionales (help, refresh, history, clear, exit)
- ✅ Sistema híbrido de efemérides (eventos verificados + generación con IA)
- ✅ Integración completa con Supabase PostgreSQL
- ✅ Generación automática con GPT-4o mediante OpenRouter
- ✅ Cron jobs diarios automatizados en Vercel (00:00 UTC)
- ✅ Base de conocimiento de 20+ eventos tecnológicos verificados
- ✅ Validación histórica mejorada y eliminación de código redundante
- ✅ Corrección de eventos incorrectos (ej: Wikipedia fecha corregida)
- ✅ Diseño responsive y retro con efectos typewriter
- ✅ Autenticación de API con CRON_SECRET para seguridad
- ✅ Sistema de logs detallado para debugging y monitoreo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**David Caro**
- Website: [davidcaro.me](https://davidcaro.me)
- GitHub: [@davidcaroo](https://github.com/davidcaroo)

---

⭐ **¡Dale una estrella si te gusta el proyecto!** ⭐

## 🙏 Agradecimientos

- **MoureDev** por la inspiración original con su ejemplo de VIBE CODING que motivó este proyecto
- [Shadcn/ui](https://ui.shadcn.com) por los componentes de UI elegantes y accesibles
- [Vercel](https://vercel.com) por el hosting gratuito y los cron jobs automatizados
- [Supabase](https://supabase.com) por la base de datos PostgreSQL y autenticación
- [OpenRouter](https://openrouter.ai) por el acceso simplificado a GPT-4o
- **GitHub Copilot** por la asistencia en depuración y optimización del código

---

💻 **Desarrollado con pasión por la historia de la programación** 💻
