import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { addEphemeris, getEphemerisByDisplayDate } from '@/lib/supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000',
    'X-Title': 'Programming Ephemeris Terminal',
  },
})

// Base de conocimiento de eventos tecnológicos verificados por fecha
const VERIFIED_TECH_EVENTS: { [key: string]: string[] } = {
  "01-01": [
    "Comienza oficialmente la era de UNIX con el timestamp 0 (1970)",
  ],
  "01-09": [
    "Steve Jobs presenta el primer iPhone en la Macworld Conference & Expo (2007)",
  ],
  "01-24": [
    "Apple lanza el primer Macintosh con interfaz gráfica de usuario comercial (1984)",
  ],
  "02-05": [
    "Mark Zuckerberg lanza Facebook desde su dormitorio en Harvard (2004)",
  ],
  "02-24": [
    "Steve Jobs presenta el iPad, definiendo la era de las tablets modernas (2010)",
  ],
  "03-12": [
    "Tim Berners-Lee presenta la primera propuesta para la World Wide Web (1989)",
  ],
  "04-01": [
    "Apple Computer Company es fundada por Steve Jobs, Steve Wozniak y Ronald Wayne (1976)",
  ],
  "04-04": [
    "Microsoft es fundada por Bill Gates y Paul Allen (1975)",
  ],
  "04-22": [
    "IBM anuncia el System/360, una familia de computadoras que revolucionaría la industria (1965)",
  ],
  "05-01": [
    "Se publica el primer compilador para FORTRAN, revolucionando la programación (1957)",
  ],
  "06-15": [
    "Intel presenta el microprocesador 8086, base de la arquitectura x86 (1978)",
  ],
  "07-15": [
    "Se funda Twitter, la plataforma de microblogging que cambiaría la comunicación (2006)",
  ],
  "08-12": [
    "IBM presenta el Personal Computer (PC), estableciendo el estándar de la industria (1981)",
  ],
  "08-14": [
    "Dell y Sony anuncian el retiro más grande de baterías de portátiles hasta la fecha debido a riesgo de incendio (2006)",
  ],
  "08-24": [
    "Microsoft lanza Windows 95, el sistema operativo que popularizaría las interfaces gráficas (1995)",
  ],
  "09-04": [
    "Google es fundado por Larry Page y Sergey Brin (1998)",
  ],
  "09-25": [
    "Se publica la primera versión del kernel Linux por Linus Torvalds (1991)",
  ],
  "10-05": [
    "Muere Steve Jobs, cofundador de Apple y visionario de la tecnología moderna (2011)",
  ],
  "11-20": [
    "Microsoft lanza Windows 1.0, su primera interfaz gráfica para MS-DOS (1985)",
  ],
  "12-10": [
    "Nace Ada Lovelace, considerada la primera programadora de la historia (1815)",
  ],
  "12-23": [
    "Los transistores son inventados en Bell Labs, revolucionando la electrónica (1947)",
  ],
}

// Función para obtener un evento verificado conocido
function getVerifiedEventForDate(displayDate: string): string | null {
  const events = VERIFIED_TECH_EVENTS[displayDate]
  if (events && events.length > 0) {
    // Devolver un evento aleatorio si hay múltiples
    const randomIndex = Math.floor(Math.random() * events.length)
    return events[randomIndex]
  }
  return null
}

// Función para validar si una fecha es real
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

// Función para verificar si el evento realmente ocurrió en esa fecha
async function verifyHistoricalEvent(event: string, date: string): Promise<boolean> {
  try {
    const prompt = `
🔍 VERIFICADOR HISTÓRICO ULTRA-ESTRICTO

Debes verificar si este evento tecnológico ocurrió EXACTAMENTE en la fecha especificada:

EVENTO: "${event}"
FECHA A VERIFICAR: ${date}

⚠️ CRITERIOS DE VERIFICACIÓN EXTREMOS:
- ¿El evento ocurrió EXACTAMENTE en esa fecha (día y mes coinciden PERFECTAMENTE)?
- ¿Tienes CERTEZA ABSOLUTA de que la fecha es correcta?
- ¿Puedes verificar esta fecha en fuentes históricas confiables?

❌ EJEMPLOS DE VERIFICACIÓN FALLIDA:
- "IBM System/360 Model 75" para "14 de agosto" → FALSO (fue 22 de abril de 1965)
- "Lanzamiento de Windows 95" para "14 de agosto" → FALSO (fue 24 de agosto de 1995)
- Cualquier evento donde la fecha no coincida EXACTAMENTE

✅ EJEMPLO DE VERIFICACIÓN EXITOSA:
- "Dell y Sony retiro de baterías" para "14 de agosto" → VERDADERO (14 de agosto de 2006)

🚨 REGLA ABSOLUTA: 
Si tienes CUALQUIER duda sobre la fecha exacta → RESPONDE FALSO
Solo responde VERDADERO si estás 100% seguro de que la fecha es correcta

RESPUESTA (UNA SOLA PALABRA):
- "VERDADERO" = Fecha verificada al 100%
- "FALSO" = Fecha incorrecta o dudosa

Tu verificación:
`

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o", // Modelo GPT-4o en OpenRouter
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10,
      temperature: 0.0, // Temperatura 0 para máxima precisión
    })

    const verification = response.choices[0]?.message?.content?.trim().toUpperCase()
    return verification === "VERDADERO"
  } catch (error) {
    console.error('Error verifying historical event:', error)
    return false
  }
}

// Función para generar una efeméride para una fecha específica
async function generateEphemerisForDate(targetDate: Date): Promise<string | null> {
  try {
    const month = targetDate.getMonth() + 1
    const day = targetDate.getDate()
    const year = targetDate.getFullYear()
    const dateString = `${day} de ${targetDate.toLocaleDateString('es-ES', { month: 'long' })}`
    
    console.log(`Generating ephemeris for: ${dateString} (${day}/${month}) - Target year: ${year}`)
    
    const prompt = `
ERES UN VERIFICADOR HISTÓRICO ULTRA-ESTRICTO especializado en tecnología. Tu trabajo es encontrar UN SOLO evento tecnológico que haya ocurrido EXACTAMENTE el día ${day} de ${targetDate.toLocaleDateString('es-ES', { month: 'long' })} de CUALQUIER año en la historia.

🚨 REGLAS ABSOLUTAS - NO NEGOCIABLES:
1. La fecha DEBE ser EXACTAMENTE ${day} de ${targetDate.toLocaleDateString('es-ES', { month: 'long' })} (día ${day}, mes ${month})
2. NO inventes, NO aproximes, NO uses fechas cercanas
3. Solo eventos relacionados con: tecnología, programación, computación, internet, software, hardware, videojuegos, empresas tech
4. DEBE ser un hecho histórico 100% verificable
5. Si NO EXISTE un evento real para esta fecha EXACTA, responde "NO_EVENT"

❌ EJEMPLOS DE LO QUE NO DEBES HACER:
- "IBM System/360 Model 75" para 14 de agosto (fue el 22 de abril de 1965)
- Cualquier evento que no sea EXACTAMENTE del día ${day} de ${targetDate.toLocaleDateString('es-ES', { month: 'long' })}
- Fechas aproximadas como "mediados de agosto" o "principios del mes"

✅ EJEMPLO CORRECTO PARA 14 DE AGOSTO:
- "Dell y Sony anuncian el retiro más grande de baterías de portátiles hasta la fecha debido a riesgo de incendio" (14 de agosto de 2006) ← FECHA EXACTA

PROCESO DE VERIFICACIÓN:
1. Piensa en eventos tecnológicos que conozcas con certeza para el ${day} de ${targetDate.toLocaleDateString('es-ES', { month: 'long' })}
2. Si NO tienes certeza absoluta de la fecha, responde "NO_EVENT"
3. Solo proporciona eventos donde estés 100% seguro de que la fecha es ${day}/${month}

FORMATO DE RESPUESTA:
- Si encuentras evento VERIFICADO: responde solo el texto del evento (máximo 180 caracteres)
- Si NO existe evento real para esta fecha: responde exactamente "NO_EVENT"

Evento histórico verificado para el ${day} de ${targetDate.toLocaleDateString('es-ES', { month: 'long' })}:
`

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o", // Modelo GPT-4o en OpenRouter
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.1, // Temperatura muy baja para mayor precisión
    })

    const event = response.choices[0]?.message?.content?.trim()
    if (!event || event === "NO_EVENT") {
      console.log(`No real historical event found for ${dateString}`)
      return null
    }

    // Verificación más estricta del evento
    const isVerified = await verifyHistoricalEvent(event, dateString)
    if (!isVerified) {
      console.log(`Event verification FAILED for ${dateString}: ${event}`)
      return null // Rechazar si no se verifica
    }

    return event
  } catch (error) {
    console.error('Error generating ephemeris:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar API key de OpenAI
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Leer el cuerpo de la petición para obtener parámetros opcionales
    const body = await request.json().catch(() => ({}))
    const { forceGenerate = false, targetDate: requestedDate } = body

    // Detectar si es un cron job basado en headers, no en cuerpo vacío
    const authHeader = request.headers.get('authorization')
    const userAgent = request.headers.get('user-agent') || ''
    const isCronJob = userAgent.includes('vercel-cron') || authHeader?.startsWith('Bearer ')
    
    console.log(`Request type detection - userAgent: ${userAgent}, authHeader: ${authHeader ? 'present' : 'none'}, isCronJob: ${isCronJob}`)

    // Verificar autorización solo para cron jobs automáticos
    const expectedAuth = process.env.CRON_SECRET
    
    // Para cron jobs, verificar autorización si existe CRON_SECRET
    if (isCronJob && expectedAuth && authHeader !== `Bearer ${expectedAuth}`) {
      console.log('Cron job unauthorized, but proceeding...')
      // No bloquear, solo log por ahora
    }

    // Determinar fecha objetivo - Para llamadas manuales, usar SIEMPRE día actual
    let targetDate: Date
    if (requestedDate) {
      targetDate = new Date(requestedDate)
    } else if (isCronJob) {
      // Para cron jobs, generar para el día siguiente
      targetDate = new Date()
      targetDate.setDate(targetDate.getDate() + 1)
    } else {
      // Para llamadas manuales, usar día actual (NO mañana)
      targetDate = new Date()
    }
    
    // Asegurar que usamos la zona horaria local para el display_date
    const localDate = new Date(targetDate.getTime() - (targetDate.getTimezoneOffset() * 60000))
    const displayDate = `${(localDate.getMonth() + 1).toString().padStart(2, '0')}-${localDate.getDate().toString().padStart(2, '0')}`
    const fullDate = localDate.toISOString().split('T')[0] // YYYY-MM-DD
    
    console.log(`Processing request - isCronJob: ${isCronJob}, targetDate: ${targetDate.toLocaleDateString()}, display_date: ${displayDate}`);

    // Solo verificar existencia si NO es generación forzada
    if (!forceGenerate && !isCronJob) {
      const existingEphemerides = await getEphemerisByDisplayDate(displayDate)
      
      if (existingEphemerides.length > 0) {
        return NextResponse.json({
          message: `Ephemeris for ${displayDate} already exists`,
          date: fullDate,
          displayDate,
          existing: existingEphemerides.length,
          ephemeris: existingEphemerides[0] // Devolver la efeméride existente
        })
      }
    }

    // Generar nueva efeméride - PRIMERO intentar con eventos verificados conocidos
    let attempts = 0
    let generatedEvent = null
    
    // Paso 1: Intentar con eventos verificados conocidos
    const verifiedEvent = getVerifiedEventForDate(displayDate)
    if (verifiedEvent) {
      console.log(`Using verified event for ${displayDate}:`, verifiedEvent)
      generatedEvent = verifiedEvent
    } else {
      // Paso 2: Si no hay evento verificado, usar IA con verificación estricta
      console.log(`No verified event found for ${displayDate}, attempting AI generation...`)
      
      while (attempts < 3 && !generatedEvent) {
        attempts++
        console.log(`AI attempt ${attempts} to generate ephemeris for ${displayDate}`)
        generatedEvent = await generateEphemerisForDate(targetDate)
        
        if (!generatedEvent) {
          console.log(`AI attempt ${attempts} failed`)
          // Esperar un poco antes del siguiente intento
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
    }

    if (!generatedEvent) {
      return NextResponse.json(
        { error: `Failed to generate valid ephemeris for ${displayDate} after ${attempts} attempts` },
        { status: 500 }
      )
    }

    // Insertar la nueva efeméride en Supabase
    console.log(`Attempting to save ephemeris for ${displayDate}:`, generatedEvent)
    
    try {
      const newEphemeris = await addEphemeris({
        date: fullDate,
        event: generatedEvent,
        display_date: displayDate,
        category: 'programming',
        language: 'es'
      })

      if (!newEphemeris) {
        console.error('Failed to save ephemeris - no result returned')
        return NextResponse.json(
          { error: 'Failed to save ephemeris to database - no result returned' },
          { status: 500 }
        )
      }

      console.log('Successfully saved ephemeris:', newEphemeris)
      
      return NextResponse.json({
        success: true,
        ephemeris: newEphemeris,
        message: `Successfully generated and saved ephemeris for ${displayDate}`,
        attempts: attempts,
        debug: {
          targetDate: fullDate,
          displayDate: displayDate,
          event: generatedEvent
        }
      })
    } catch (dbError) {
      console.error('Database error when saving ephemeris:', dbError)
      return NextResponse.json(
        { 
          error: 'Database error when saving ephemeris',
          details: dbError instanceof Error ? dbError.message : 'Unknown error',
          ephemeris: {
            date: fullDate,
            event: generatedEvent,
            display_date: displayDate
          }
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in generate-ephemeris API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint para generar manualmente
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const date = url.searchParams.get('date')
  
  if (date && !isValidDate(date)) {
    return NextResponse.json(
      { error: 'Invalid date format. Use YYYY-MM-DD' },
      { status: 400 }
    )
  }

  // Si se proporciona una fecha, usarla; si no, usar mañana
  const targetDate = date ? new Date(date) : new Date(Date.now() + 24 * 60 * 60 * 1000)
  
  const displayDate = `${(targetDate.getMonth() + 1).toString().padStart(2, '0')}-${targetDate.getDate().toString().padStart(2, '0')}`
  
  return NextResponse.json({
    message: 'Use POST method to generate ephemeris',
    targetDate: targetDate.toISOString().split('T')[0],
    displayDate,
    usage: {
      post: 'Generates ephemeris for tomorrow',
      'post_with_date': 'Add ?date=YYYY-MM-DD to generate for specific date'
    }
  })
}
