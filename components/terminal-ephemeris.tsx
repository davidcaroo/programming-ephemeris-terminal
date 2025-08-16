"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { TypewriterText } from "./typewriter-text"
import { getTodayRandomEphemeris, getRandomEphemeris, type Ephemeris } from "@/lib/supabase"


export function TerminalEphemeris() {
  const [currentTime, setCurrentTime] = useState("")
  const [showPrompt, setShowPrompt] = useState(false)
  const [showEphemeris, setShowEphemeris] = useState(false)
  const [todayEphemeris, setTodayEphemeris] = useState("")
  const [currentCommand, setCurrentCommand] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [ephemerisKey, setEphemerisKey] = useState(0) // Para forzar re-render del typewriter
  const [isShowingTodayEphemeris, setIsShowingTodayEphemeris] = useState(true) // Nuevo estado
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    // Simular secuencia de inicio
    setTimeout(() => setShowPrompt(true), 1500)
    setTimeout(() => setShowEphemeris(true), 3000)

    // Cargar efeméride del día actual al inicio
    loadTodayEphemeris()

    return () => clearInterval(interval)
  }, [])

  // Función para cargar efeméride del día actual
  const loadTodayEphemeris = async () => {
    try {
      // Primero intentar obtener efeméride existente
      const todayEphemeris = await getTodayRandomEphemeris()
      if (todayEphemeris) {
        setTodayEphemeris(todayEphemeris.event)
        setIsShowingTodayEphemeris(true)
        return
      }

      // Si no hay efeméride para hoy, generar una nueva llamando a la API
      console.log('No hay efeméride para hoy, generando una nueva...')
      const response = await fetch('/api/generate-ephemeris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceGenerate: true })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.ephemeris) {
          setTodayEphemeris(result.ephemeris.event)
          setIsShowingTodayEphemeris(true)
          return
        }
      } else {
        console.error('Error al generar efeméride:', await response.text())
      }

      setTodayEphemeris("No se pudo cargar ni generar efeméride para hoy.")
      setIsShowingTodayEphemeris(true)
    } catch (error) {
      console.error('Error fetching today ephemeris:', error)
      setTodayEphemeris("Error al cargar efeméride del día.")
      setIsShowingTodayEphemeris(true)
    }
  }

  // Función para cargar efeméride aleatoria (cualquier día)
  const selectRandomEphemeris = async () => {
    try {
      const randomEphemeris = await getRandomEphemeris()
      if (randomEphemeris) {
        setTodayEphemeris(randomEphemeris.event)
        setIsShowingTodayEphemeris(false)
      } else {
        setTodayEphemeris("No hay efeméride  disponible.")
        setIsShowingTodayEphemeris(false)
      }
    } catch (error) {
      console.error('Error fetching random ephemeris:', error)
      setTodayEphemeris("No hay efeméride disponible.")
      setIsShowingTodayEphemeris(false)
    }
  }

  const handleCommand = (command: string) => {
    const trimmedCommand = command.trim().toLowerCase()
    setCommandHistory((prev) => [...prev, `user@ephemeris-terminal:~$ ${command}`])

    switch (trimmedCommand) {
      case "refresh":
        setIsRefreshing(true)
        setCommandHistory((prev) => [...prev, "Generando nueva efeméride del día..."])
        setTimeout(async () => {
          try {
            // Llamar directamente al endpoint POST para generar nueva efeméride
            const response = await fetch('/api/generate-ephemeris', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              }
            })

            const result = await response.json()

            if (response.ok && result.ephemeris) {
              setTodayEphemeris(result.ephemeris.event)
              setIsShowingTodayEphemeris(false)
              setCommandHistory((prev) => [...prev, "✓ Nueva efeméride generada y guardada"])
            } else {
              // Si falla, usar efeméride del día como respaldo
              await loadTodayEphemeris()
              setCommandHistory((prev) => [...prev, "✓ Efeméride del día cargada (respaldo)"])
            }
          } catch (error) {
            console.error('Error generating ephemeris:', error)
            // Si falla, usar efeméride del día como respaldo
            await loadTodayEphemeris()
            setCommandHistory((prev) => [...prev, "✓ Efeméride del día cargada (respaldo)"])
          }
          setEphemerisKey((prev) => prev + 1)
          setIsRefreshing(false)
        }, 1500)
        break
      case "help":
        setCommandHistory((prev) => [
          ...prev,
          "Comandos disponibles:",
          "  help     - Mostrar ayuda",
          "  refresh  - Refrescar y mostrar una nueva efeméride del día",
          "  history  - Ver historial",
          "  clear    - Limpiar pantalla",
          "  exit     - Salir del sistema",
        ])
        break
        break
      case "history":
        setCommandHistory((prev) => [
          ...prev,
          "Historial de comandos:",
          ...commandHistory.filter((h) => h.includes("$")),
        ])
        break
      case "clear":
        setCommandHistory([])
        break
      case "exit":
        setCommandHistory((prev) => [...prev, "Cerrando terminal... ¡Hasta luego!"])
        break
      default:
        if (command.trim()) {
          setCommandHistory((prev) => [...prev, `bash: ${command}: comando no encontrado`])
        }
    }
    setCurrentCommand("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentCommand.trim()) {
      handleCommand(currentCommand)
    }
  }

  return (
    <div className="min-h-screen p-6 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Header de terminal */}
        <div className="mb-8">
          <div className="text-orange-400 text-sm mb-2">
            ╭─────────────────────────────────────────────────────────────╮
          </div>
          <div className="text-orange-400 text-sm mb-2">│ PROGRAMMING EPHEMERIS TERMINAL v1.0 │</div>
          <div className="text-orange-400 text-sm mb-2">│ Sistema de Efemérides de Programación │</div>
          <div className="text-orange-400 text-sm mb-4">
            ╰─────────────────────────────────────────────────────────────╯
          </div>
        </div>

        {/* Información del sistema */}
        <div className="mb-6 space-y-2">
          <div className="text-green-400">
            <span className="text-orange-400">user@ephemeris-terminal</span>:<span className="text-blue-400">~</span>$
            systeminfo
          </div>
          <div className="text-green-300 text-sm ml-4">Sistema iniciado correctamente...</div>
          <div className="text-green-300 text-sm ml-4">Fecha y hora: {currentTime}</div>
          <div className="text-green-300 text-sm ml-4">Módulo de efemérides: ACTIVO</div>
        </div>

        {/* Prompt principal */}
        {showPrompt && (
          <div className="mb-6">
            <div className="text-green-400 mb-2">
              <span className="text-orange-400">user@ephemeris-terminal</span>:<span className="text-blue-400">~</span>$
              get-daily-ephemeris --programming
            </div>
            <div className="text-green-300 text-sm ml-4 mb-4">Consultando base de datos de efemérides...</div>
            <div className="text-green-300 text-sm ml-4 mb-4">
              <span className="animate-pulse">█</span> Procesando información histórica...
            </div>
          </div>
        )}

        {/* Efeméride del día */}
        {showEphemeris && (
          <div className="bg-gray-900 border border-green-400 rounded-lg p-6 mb-6">
            <div className="text-orange-400 text-lg font-bold mb-4 flex items-center">
              <span className="mr-2">📅</span>
              {isShowingTodayEphemeris ? "EFEMÉRIDE DEL DÍA" : "EFEMÉRIDE DE TECNOLOGÍA"}
              {isRefreshing && <span className="ml-2 text-sm animate-pulse">Actualizando...</span>}
            </div>
            <div className="text-green-400 mb-4">
              ┌─ {isShowingTodayEphemeris ? "Dato histórico del día actual" : "Dato histórico aleatorio"} ─┐
            </div>
            <div className="text-green-300 leading-relaxed mb-4">
              <TypewriterText key={ephemerisKey} text={todayEphemeris} speed={50} />
            </div>
            <div className="text-green-400">└─────────────────────────────────────┘</div>
          </div>
        )}

        {commandHistory.length > 0 && (
          <div className="mb-4 space-y-1">
            {commandHistory.map((line, index) => (
              <div key={index} className={line.includes("$") ? "text-green-400" : "text-green-300 ml-4 text-sm"}>
                {line}
              </div>
            ))}
          </div>
        )}

        {/* Footer con comandos */}
        <div className="mt-8 text-green-600 text-sm">
          <div className="mb-2">Comandos disponibles:</div>
          <div className="ml-4 space-y-1">
            <div>
              <span className="text-orange-400">help</span> - Mostrar ayuda
            </div>
            <div>
              <span className="text-orange-400">refresh</span> - Generar nueva efeméride del día
            </div>
            <div>
              <span className="text-orange-400">history</span> - Ver historial
            </div>
            <div>
              <span className="text-orange-400">clear</span> - Limpiar pantalla
            </div>
            <div>
              <span className="text-orange-400">exit</span> - Salir del sistema
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex items-center">
          <span className="text-orange-400">user@ephemeris-terminal</span>:<span className="text-blue-400">~</span>$
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            className="ml-2 bg-transparent text-green-400 outline-none flex-1 font-mono"
            placeholder="Escribe un comando..."
            autoFocus
            disabled={isRefreshing}
          />
          <span className="ml-1 animate-pulse text-green-400">█</span>
        </form>
        {/* footer with link to my web https://davidcaro.me/ */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          Hecho con ❤️ por{" "}
          <a
            href="https://davidcaro.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:underline"
          >
            David Caro
          </a>
        </div>
      </div>
    </div >
  )
}

export default TerminalEphemeris