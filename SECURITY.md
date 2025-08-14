# 🔒 Seguridad y Variables de Entorno

## ⚠️ **IMPORTANTE: No exponer credenciales en el código**

### ❌ **Incorrecto** (vulnerabilidad de seguridad):
```typescript
const supabaseUrl = 'https://tu-proyecto.supabase.co'
const supabaseAnonKey = 'tu-clave-aqui'
```

### ✅ **Correcto** (usando variables de entorno):
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 🔧 **Configuración Segura**

### 1. Archivo `.env.local`
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
```

### 2. Validación de Variables
```typescript
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}
```

### 3. Gitignore
El archivo `.gitignore` ya incluye:
```ignore
# env files
.env*
```

## 🛡️ **Buenas Prácticas de Seguridad**

### ✅ **Hacer:**
- Usar variables de entorno para credenciales
- Validar que las variables existan al inicio
- Incluir `.env*` en `.gitignore`
- Usar diferentes credenciales para dev/staging/prod
- Rotar claves periódicamente

### ❌ **No hacer:**
- Hardcodear credenciales en el código
- Subir archivos `.env*` al repositorio
- Compartir credenciales por chat/email
- Usar las mismas credenciales en todos los ambientes
- Exponer service keys en el frontend

## 🔑 **Tipos de Claves en Supabase**

### **Anon Key** (pública - frontend)
- ✅ Segura para usar en frontend
- ✅ Puede estar en variables `NEXT_PUBLIC_*`
- ✅ Respeta las políticas RLS
- ⚠️ Limitada por las políticas de seguridad

### **Service Role Key** (privada - backend)
- ❌ NUNCA usar en frontend
- ❌ NUNCA en variables `NEXT_PUBLIC_*`
- ✅ Solo en API routes o backend
- ⚠️ Acceso completo a la base de datos

## 🌍 **Variables por Ambiente**

### Desarrollo (`.env.local`)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://dev-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev-anon-key
```

### Producción (Vercel/Deploy)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://prod-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
```

## 🚨 **Si las credenciales se exponen:**

1. **Regenerar claves** en el dashboard de Supabase
2. **Actualizar variables** de entorno
3. **Revisar logs** de acceso por actividad sospechosa
4. **Implementar RLS** más estrictas si es necesario

## 📋 **Checklist de Seguridad**

- [ ] Variables de entorno configuradas
- [ ] `.env.local` en `.gitignore`
- [ ] Validación de variables implementada
- [ ] RLS habilitado en Supabase
- [ ] Políticas de seguridad configuradas
- [ ] Claves diferentes por ambiente
- [ ] Documentación de seguridad actualizada
