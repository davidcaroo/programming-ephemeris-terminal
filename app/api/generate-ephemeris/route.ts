// src/app/api/generate-ephemeris/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { addEphemeris, getEphemerisByDisplayDate, type Ephemeris } from '@/lib/supabase'
import { 
  formatDisplayDate, 
  formatFullDate, 
  formatHumanDate, 
  validateEventContent, 
  isValidDate 
} from '@/lib/date-utils'
import { getVerifiedEventForDate } from '@/lib/verified-events'
import { logger } from '@/lib/logger'

// ---------------- CONFIG ----------------
const CONFIG = {
  MAX_AI_ATTEMPTS: 3,
  AI_RETRY_DELAY: 2000, // ms
  AI_TEMPERATURE: 0.1,
  AI_MAX_TOKENS: 200,
  AI_MODEL: 'openai/gpt-4o',
} as const

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000',
    'X-Title': 'Programming Ephemeris Terminal',
  },
})

// ---------------- TYPES ----------------
interface ApiResponse {
  ephemeris: Ephemeris | null
  date: string
  displayDate: string
  message: string
}

interface ApiError {
  error: string
}

// ---------------- HELPERS ----------------
async function generateEphemerisForDate(date: Date): Promise<string | null> {
  try {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const dateString = formatHumanDate(date)

    logger.debug(`🤖 Generando con IA para: ${dateString}`)

    const prompt = `
ERES UN VERIFICADOR HISTÓRICO ULTRA-ESTRICTO especializado en tecnología. Encuentra UN SOLO evento tecnológico que haya ocurrido EXACTAMENTE el día ${dateString}.

🚨 REGLAS:
1. Fecha exacta: ${day}/${month}.
2. Sin inventar ni aproximar.
3. Solo eventos tecnológicos verificables.
4. Si no existe: responde "NO_EVENT".

Formato: Solo el evento (máx. 180 caracteres, sin fecha).
`

    const response = await openai.chat.completions.create({
      model: CONFIG.AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: CONFIG.AI_MAX_TOKENS,
      temperature: CONFIG.AI_TEMPERATURE,
    })

    const event = response.choices[0]?.message?.content?.trim()
    if (!event || event === "NO_EVENT") return null
    if (!validateEventContent(event)) return null

    return event
  } catch (error) {
    logger.error('Error generating ephemeris:', error)
    return null
  }
}

async function withRetries<T>(
  fn: () => Promise<T | null>, 
  retries = CONFIG.MAX_AI_ATTEMPTS
): Promise<T | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const result = await fn()
    if (result) return result
    logger.debug(`🔄 Reintento ${attempt} falló`)
    await new Promise(r => setTimeout(r, CONFIG.AI_RETRY_DELAY))
  }
  return null
}

// ---------------- ROUTES ----------------
export async function POST(request: NextRequest) {
  logger.info('🚀 POST /api/generate-ephemeris called')

  // 🔐 Validar cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json<ApiError>({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json<ApiError>({ error: 'OpenAI API key not configured' }, { status: 500 })
  }

  const now = new Date()
  const displayDate = formatDisplayDate(now)
  const fullDate = formatFullDate(now)

  logger.debug(`📅 Fecha objetivo: ${displayDate} (${fullDate})`)

  // 1. Buscar evento verificado o generar con IA
  const verifiedEvent = getVerifiedEventForDate(displayDate)
  const generatedEvent = verifiedEvent || await withRetries(() => generateEphemerisForDate(now))

  if (!generatedEvent) {
    return NextResponse.json<ApiError>(
      { error: `No se pudo generar efeméride válida para ${displayDate}` },
      { status: 500 }
    )
  }

  // 2. Guardar en Supabase
  try {
    await addEphemeris({
      date: fullDate,
      event: generatedEvent,
      display_date: displayDate,
      category: 'programming',
      language: 'es',
    })
    logger.debug('💾 Efeméride guardada en Supabase')
  } catch (err) {
    logger.error('❌ Error guardando en Supabase', err)
  }

  // 3. Consultar efeméride final
  const ephemerides = await getEphemerisByDisplayDate(displayDate)
  const result: ApiResponse = {
    ephemeris: ephemerides[0] ?? null,
    date: fullDate,
    displayDate,
    message: 'Efeméride generada y consultada para el día actual.',
  }

  return NextResponse.json<ApiResponse>(result)
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const date = url.searchParams.get('date')

  if (date && !isValidDate(date)) {
    return NextResponse.json<ApiError>(
      { error: 'Invalid date format. Use YYYY-MM-DD' },
      { status: 400 }
    )
  }

  const targetDate = date ? new Date(date) : new Date()

  return NextResponse.json({
    message: 'Use POST method to generate ephemeris',
    targetDate: formatFullDate(targetDate),
    displayDate: formatDisplayDate(targetDate),
    usage: {
      post: 'Generates ephemeris for current day',
      description: 'This endpoint generates programming history ephemeris',
    },
  })
}
