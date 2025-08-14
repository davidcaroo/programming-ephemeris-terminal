# 🖥️ Programming Ephemeris Terminal

> Un terminal interactivo retro que muestra efemérides de programación e historia tecnológica, con generación automática mediante IA basado en un ejemplo de VIBE CODING mostrado por MoureDev, este sistema usa la API de GPT-4 mediante Openrouter.ai. 

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-orange)](https://openrouter.ai)



## 📖 Descripción

Programming Ephemeris Terminal es una aplicación web interactiva que simula un terminal retro y muestra datos históricos relevantes sobre programación, tecnología e informática. El proyecto combina nostalgia visual con tecnología moderna para crear una experiencia educativa única.

### ✨ Características Principales

- **🖥️ Terminal Retro**: Interfaz que simula una terminal clásica con efectos typewriter
- **📅 Efemérides Diarias**: Eventos históricos de programación mostrados cada día
- **🤖 IA Integrada**: Generación automática de efemérides mediante GPT-4o
- **🔄 Sistema Híbrido**: Eventos verificados manualmente + generación con IA
- **⏰ Automatización**: Cron jobs que generan nuevas efemérides diariamente
- **💾 Base de Datos**: Almacenamiento persistente en Supabase
- **📱 Responsive**: Optimizado para dispositivos móviles y desktop

## 🚀 Demo en Vivo

**[🌐 Ver Demo](https://programming-ephemeris-terminal.vercel.app)**

### Comandos Disponibles
- `help` - Mostrar ayuda
- `refresh` - Generar nueva efeméride del día
- `history` - Ver historial de comandos
- `clear` - Limpiar pantalla
- `exit` - Salir del sistema

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

### Componentes Principales

```
├── app/
│   ├── api/generate-ephemeris/     # API para generación con IA
│   ├── layout.tsx                  # Layout principal
│   └── page.tsx                    # Página principal
├── components/
│   ├── terminal-ephemeris.tsx      # Componente principal del terminal
│   ├── typewriter-text.tsx         # Efecto de texto typewriter
│   └── ui/                         # Componentes de Shadcn/ui
├── lib/
│   └── supabase.ts                 # Cliente y funciones de Supabase
└── database/                       # Scripts SQL
```

### Flujo de Datos

1. **Carga Inicial**: Terminal muestra efeméride del día actual desde Supabase
2. **Comando Refresh**: Genera nueva efeméride usando IA o eventos verificados
3. **Cron Job Diario**: Genera automáticamente efeméride para el día siguiente
4. **Sistema Híbrido**: Prioriza eventos verificados, usa IA como respaldo

### Base de Eventos Verificados

El sistema incluye 20+ eventos tecnológicos verificados:
- 01 enero: Era UNIX (1970)
- 09 enero: Presentación iPhone (2007) 
- 24 enero: Apple Macintosh (1984)
- 05 febrero: Facebook (2004)
- 01 abril: Apple fundada (1976)
- 04 abril: Microsoft fundada (1975)
- **14 agosto: Dell/Sony retiro baterías (2006)**
- 24 agosto: Windows 95 (1995)
- 04 septiembre: Google fundado (1998)
- 05 octubre: Muerte Steve Jobs (2011)

## 🔧 API Reference

### POST `/api/generate-ephemeris`

Genera una nueva efeméride para una fecha específica.

**Request Body:**
```json
{
  "forceGenerate": true,
  "targetDate": "2025-08-14"
}
```

**Response:**
```json
{
  "success": true,
  "ephemeris": {
    "id": "uuid",
    "date": "2025-08-14",
    "event": "Dell y Sony anuncian el retiro más grande...",
    "display_date": "08-14",
    "category": "programming",
    "language": "es"
  },
  "attempts": 0
}
```

### Cron Job Automático

**Schedule**: Diario a las 00:00 UTC  
**Endpoint**: `/api/generate-ephemeris`  
**Función**: Genera efeméride del día siguiente

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

Edita `app/api/generate-ephemeris/route.ts`:

```typescript
const VERIFIED_TECH_EVENTS: { [key: string]: string[] } = {
  "MM-DD": [
    "Tu evento tecnológico verificado (YYYY)",
  ],
}
```

## 📝 Changelog

### v1.0.0 (2025-08-14)
- ✅ Terminal interactivo con comandos
- ✅ Sistema híbrido de efemérides (verificadas + IA)
- ✅ Integración con Supabase
- ✅ Generación automática con GPT-4o
- ✅ Cron jobs diarios en Vercel
- ✅ Base de datos de eventos verificados
- ✅ Diseño responsive y retro

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**David Caro**
- Website: [davidcaro.me](https://davidcaro.me)
- GitHub: [@davidcaroo](https://github.com/davidcaroo)

---

⭐ **¡Dale una estrella si te gusta el proyecto!** ⭐

## 🙏 Agradecimientos

- [Shadcn/ui](https://ui.shadcn.com) por los componentes de UI
- [Vercel](https://vercel.com) por el hosting gratuito
- [Supabase](https://supabase.com) por la base de datos
- [OpenRouter](https://openrouter.ai) por el acceso a GPT-4o
- La comunidad de desarrolladores por la inspiración retro
