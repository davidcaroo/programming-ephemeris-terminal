import { TerminalEphemeris } from "@/components/terminal-ephemeris"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      <TerminalEphemeris />
    </main>
  )
}
