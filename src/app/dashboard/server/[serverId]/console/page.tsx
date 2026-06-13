"use client"

import { useContext, useEffect, useRef, useState } from "react"
import { ServerContext } from "../layout"
import api from "@/lib/api"
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Square, RotateCcw } from "lucide-react"

export default function ConsolePage() {
  const { server, status } = useContext(ServerContext)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [command, setCommand] = useState("")

  useEffect(() => {
    if (!server || !terminalRef.current) return

    const term = new Terminal({
      theme: { background: '#09090b', foreground: '#e4e4e7' },
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 13,
    })
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(terminalRef.current)
    fitAddon.fit()

    let ws: WebSocket | null = null

    const connectWs = async () => {
      try {
        const res = await api.get(`/servers/${server.id}/panel/websocket`)
        const { token, socket: wssUrl } = res.data

        ws = new WebSocket(wssUrl)
        setSocket(ws)

        ws.onopen = () => {
          ws?.send(JSON.stringify({ event: 'auth', args: [token] }))
          term.writeln('\x1b[32m[FreeBucks]\x1b[0m Connected to server daemon.')
        }

        ws.onmessage = (e) => {
          const msg = JSON.parse(e.data)
          if (msg.event === 'console output') {
            msg.args.forEach((line: string) => term.writeln(line))
          }
        }

        ws.onclose = () => {
          term.writeln('\x1b[31m[FreeBucks]\x1b[0m Disconnected from server daemon.')
        }

        ws.onerror = () => {
          term.writeln('\x1b[31m[FreeBucks]\x1b[0m Connection error.')
        }

      } catch (err) {
        term.writeln('\x1b[31m[FreeBucks]\x1b[0m Failed to get websocket credentials.')
      }
    }

    connectWs()

    const handleResize = () => fitAddon.fit()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      ws?.close()
      term.dispose()
    }
  }, [server])

  const sendCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return
    
    // We can send directly to Pterodactyl daemon if websocket is active, 
    // but the prompt says: "All other Pterodactyl actions must continue through backend APIs."
    // Websocket is ONLY for logs and maybe direct console if needed, but wait:
    // User requested command.sent to be logged in backend Activity logger.
    // So we MUST send commands through the backend API.
    try {
      await api.post(`/servers/${server.id}/panel/command`, { command })
      setCommand("")
    } catch (err) {
      console.error(err)
    }
  }

  const handlePower = async (action: string) => {
    try {
      await api.post(`/servers/${server.id}/panel/power`, { action })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex gap-2 mb-2">
        <Button onClick={() => handlePower('start')} disabled={status?.currentState === 'running'} variant="outline" className="text-success border-success/30 hover:bg-success/10"><Play className="w-4 h-4 mr-2" /> Start</Button>
        <Button onClick={() => handlePower('restart')} disabled={status?.currentState === 'offline'} variant="outline" className="text-primary border-primary/30 hover:bg-primary/10"><RotateCcw className="w-4 h-4 mr-2" /> Restart</Button>
        <Button onClick={() => handlePower('kill')} disabled={status?.currentState === 'offline'} variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10"><Square className="w-4 h-4 mr-2" /> Kill</Button>
      </div>

      <div className="flex-1 bg-[#09090b] rounded-lg border border-border/50 p-2 overflow-hidden relative">
        <div ref={terminalRef} className="w-full h-full" />
      </div>

      <form onSubmit={sendCommand} className="flex gap-2">
        <Input 
          value={command}
          onChange={e => setCommand(e.target.value)}
          placeholder="Type a command..." 
          className="font-mono bg-background"
        />
        <Button type="submit" variant="secondary">Send</Button>
      </form>
    </div>
  )
}
