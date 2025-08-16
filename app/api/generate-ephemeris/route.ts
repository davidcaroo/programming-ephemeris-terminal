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
  "08-15": [
    "IBM anuncia el retiro de su mainframe System/390 modelo G5 y G6 para dar paso a la nueva serie zSeries (2000)",
  ],
  "08-16": [
    "Se lanza la primera versión del navegador web Internet Explorer incluido con Windows 95 Plus! Pack (1995)",
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

// Función para generar una efeméride para una fecha específica
async function generateEphemerisForDate(targetDate: Date): Promise<string | null> {
  try {
    const month = targetDate.getMonth() + 1
    const day = targetDate.getDate()
    const dateString = `${day} de ${targetDate.toLocaleDateString('es-ES', { month: 'long' })}`
    
    console.log(`🤖 Generando con IA para: ${dateString} (${day}/${month})`)
    
    const prompt = `
ERES UN VERIFICADOR HISTÓRICO ULTRA-ESTRICTO especializado en tecnología. Tu trabajo es encontrar UN SOLO evento tecnológico que haya ocurrido EXACTAMENTE el día ${day} de ${targetDate.toLocaleDateString('es-ES', { month: 'long' })} de CUALQUIER año en la historia.

🚨 REGLAS ABSOLUTAS - NO NEGOCIABLES:
1. La fecha DEBE ser EXACTAMENTE ${day} de ${targetDate.toLocaleDateString('es-ES', { month: 'long' })} (día ${day}, mes ${month})
2. NO inventes, NO aproximes, NO uses fechas cercanas
3. Solo eventos relacionados con: tecnología, programación, computación, internet, software, hardware, videojuegos, empresas tech
4. DEBE ser un hecho histórico 100% verificable
5. Si NO EXISTE un evento real para esta fecha EXACTA, responde "NO_EVENT"

❌ EJEMPLOS DE LO QUE NO DEBES HACER:
- "Wikipedia se lanza" para 15 de agosto (fue el 15 de enero de 2001)
- "IBM System/360" para 15 de agosto (fue el 22 de abril de 1965)
- Cualquier evento que no sea EXACTAMENTE del día ${day} de ${targetDate.toLocaleDateString('es-ES', { month: 'long' })}
- Fechas aproximadas como "mediados de agosto" o "principios del mes"

⚠️ VERIFICACIÓN ADICIONAL:
- NO menciones meses diferentes a ${targetDate.toLocaleDateString('es-ES', { month: 'long' })} en tu respuesta
- NO incluyas fechas específicas en el texto del evento
- Solo describe el evento sin mencionar la fecha completa

PROCESO DE VERIFICACIÓN:
1. Piensa en eventos tecnológicos que conozcas con certeza para el ${day} de ${targetDate.toLocaleDateString('es-ES', { month: 'long' })}
2. Si NO tienes certeza absoluta de la fecha, responde "NO_EVENT"
3. Solo proporciona eventos donde estés 100% seguro de que la fecha es ${day}/${month}

FORMATO DE RESPUESTA:
- Si encuentras evento VERIFICADO: responde solo el texto del evento (máximo 180 caracteres, SIN mencionar la fecha)
- Si NO existe evento real para esta fecha: responde exactamente "NO_EVENT"

REGLA FINAL: Si el evento NO ocurrió exactamente el ${day} de ${targetDate.toLocaleDateString('es-ES', { month: 'long' })}, responde "NO_EVENT".

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
      console.log(`❌ No se encontró evento real para ${dateString}`)
      return null
    }

    // Validar que el evento NO contenga fechas incorrectas en el texto
    const eventLower = event.toLowerCase()
    const incorrectDates = [
      'enero', 'january', 'febrero', 'february', 'marzo', 'march',
      'abril', 'april', 'mayo', 'may', 'junio', 'june',
      'julio', 'july', 'septiembre', 'september', 'octubre', 'october',
      'noviembre', 'november', 'diciembre', 'december'
    ]
    
    const containsIncorrectDate = incorrectDates.some(incorrectDate => 
      eventLower.includes(incorrectDate)
    )
    
    if (containsIncorrectDate) {
      console.log('❌ Evento contiene fecha incorrecta, descartando:', event)
      return null
    }

    console.log('✅ Evento generado por IA:', event)
    return event
  } catch (error) {
    console.error('Error generating ephemeris:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  console.log('🚀 POST /api/generate-ephemeris called')
  try {
    // Verificar autorización para cron jobs de Vercel
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    // Si viene de Vercel cron, verificar secreto
    if (authHeader) {
      if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        console.error('❌ Unauthorized cron request')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      console.log('✅ Authorized cron request')
    }

    // Verificar API key de OpenAI
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not configured')
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // Determinar fecha objetivo: SIEMPRE día actual
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const displayDate = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const fullDate = `${now.getFullYear()}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    console.log(`📅 Generando efeméride para: ${displayDate} (${fullDate})`);

    // 1. Generar efeméride (evento verificado o IA)
    let attempts = 0;
    let generatedEvent = null;
    const verifiedEvent = getVerifiedEventForDate(displayDate);
    if (verifiedEvent) {
      console.log(`✅ Usando evento verificado para ${displayDate}:`, verifiedEvent);
      generatedEvent = verifiedEvent;
    } else {
      console.log(`🤖 No hay evento verificado para ${displayDate}, intentando generar con IA...`);
      while (attempts < 3 && !generatedEvent) {
        attempts++;
        console.log(`🔄 Intento ${attempts} de IA para ${displayDate}`);
        generatedEvent = await generateEphemerisForDate(now);
        if (!generatedEvent) {
          console.log(`❌ Intento ${attempts} falló`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          console.log(`✅ Intento ${attempts} exitoso:`, generatedEvent);
        }
      }
    }
    if (!generatedEvent) {
      console.error(`💥 No se pudo generar efeméride válida para ${displayDate} después de ${attempts} intentos`);
      return NextResponse.json({ error: `No se pudo generar efeméride válida para ${displayDate}` }, { status: 500 });
    }

    // 2. Guardar efeméride en Supabase
    let newEphemeris = null;
    try {
      console.log('💾 Guardando efeméride en Supabase...');
      newEphemeris = await addEphemeris({
        date: fullDate,
        event: generatedEvent,
        display_date: displayDate,
        category: 'programming',
        language: 'es'
      });
      console.log('✅ Efeméride guardada exitosamente:', newEphemeris);
    } catch (dbError) {
      console.error('❌ Error guardando efeméride:', dbError);
    }

    // 3. Consultar y devolver la efeméride del día actual (la recién creada o la existente)
    console.log('🔍 Consultando efemérides del día...');
    const ephemerides = await getEphemerisByDisplayDate(displayDate);
    console.log(`📊 Encontradas ${ephemerides.length} efemérides para ${displayDate}`);
    
    const result = {
      ephemeris: ephemerides[0] || newEphemeris,
      date: fullDate,
      displayDate,
      attempts,
      message: 'Efeméride generada y consultada para el día actual.'
    };
    console.log('📤 Enviando respuesta:', result);
    return NextResponse.json(result);

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
