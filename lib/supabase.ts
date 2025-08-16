import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Ephemeris {
  id: string
  date: string
  event: string
  display_date?: string
  category?: string
  language?: string
  created_at?: string
  updated_at?: string
}

// ---- Helpers ----
async function queryEphemerides(query: any): Promise<Ephemeris[]> {
  const { data, error } = await query
  if (error) {
    console.error('Supabase query error:', error)
    return []
  }
  return data || []
}

// ---- CRUD ----

// Todas las efemérides
export async function getEphemerides(): Promise<Ephemeris[]> {
  return queryEphemerides(
    supabase.from('ephemerides').select('*').order('date', { ascending: true })
  )
}

// Por fecha exacta YYYY-MM-DD
export async function getEphemerisByDate(date: string): Promise<Ephemeris[]> {
  return queryEphemerides(
    supabase.from('ephemerides').select('*').eq('date', date)
  )
}

// Por display_date (MM-DD)
export async function getEphemerisByDisplayDate(displayDate: string): Promise<Ephemeris[]> {
  return queryEphemerides(
    supabase.from('ephemerides').select('*').eq('display_date', displayDate).order('date', { ascending: true })
  )
}

// Hoy (MM-DD)
export async function getTodayEphemerides(): Promise<Ephemeris[]> {
  const today = new Date()
  const displayDate = `${(today.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
  
  return getEphemerisByDisplayDate(displayDate)
}

// Una aleatoria de hoy
export async function getTodayRandomEphemeris(): Promise<Ephemeris | null> {
  const todayEphemerides = await getTodayEphemerides()
  if (todayEphemerides.length === 0) return getRandomEphemeris()
  return todayEphemerides[Math.floor(Math.random() * todayEphemerides.length)]
}

// Aleatoria global (más eficiente que traer todas)
export async function getRandomEphemeris(): Promise<Ephemeris | null> {
  const { data, error } = await supabase
    .from('ephemerides')
    .select('*')
    .order('RANDOM()')
    .limit(1)

  if (error) {
    console.error('Error fetching random ephemeris:', error)
    return null
  }

  return data?.[0] || null
}

// Insertar
export async function addEphemeris(
  ephemeris: Omit<Ephemeris, 'id' | 'created_at' | 'updated_at'>
): Promise<Ephemeris | null> {
  const newEphemeris = {
    ...ephemeris,
    display_date:
      ephemeris.display_date ??
      (ephemeris.date
        ? `${(new Date(ephemeris.date).getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${new Date(ephemeris.date)
            .getDate()
            .toString()
            .padStart(2, '0')}`
        : undefined),
  }

  const { data, error } = await supabase
    .from('ephemerides')
    .insert([newEphemeris])
    .select()
    .single()

  if (error) {
    console.error('Error adding ephemeris:', error)
    return null
  }

  return data
}

// Todas las fechas disponibles (MM-DD únicas)
export async function getAvailableDates(): Promise<string[]> {
  const { data, error } = await supabase
    .from('ephemerides')
    .select('display_date')
    .not('display_date', 'is', null)

  if (error) {
    console.error('Error fetching available dates:', error)
    return []
  }

  const uniqueDates = [...new Set(data.map(item => item.display_date))] as string[]
  return uniqueDates.sort()
}
