"use client"

import { useContext, useEffect, useRef, useState } from "react"
import { ServerContext } from "../layout"
import api, { handleApiError } from "@/lib/api"
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
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!server || !terminalRef.current) return

    let term: Terminal
    let fitAddon: FitAddon
    try {
      term = new Terminal({
        theme: { background: '#09090b', foreground: '#e4e4e7' },
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: 13,
      })
      fitAddon = new FitAddon()
      term.loadAddon(fitAddon)
      term.open(terminalRef.current)
      fitAddon.fit()
    } catch (err) {
      console.error("Xterm Init Error:", err)
      return
    }

    let ws: WebSocket | null = null

    const connectWs = async () => {
      try {
        term.writeln('\x1b[33m[FreeBucks]\x1b[0m Fetching websocket credentials...')
        console.log(`[FreeBucks] Fetching websocket credentials from backend for server: ${server.id}`)
        const res = await api.get(`/servers/${server.id}/panel/websocket`)
        const { token, socket: wssUrl } = res.data

        term.writeln(`\x1b[33m[FreeBucks]\x1b[0m Connecting to daemon at ${wssUrl}...`)
        ws = new WebSocket(wssUrl)
        setSocket(ws)

        ws.onopen = () => {
          ws?.send(JSON.stringify({ event: 'auth', args: [token] }))
        }

        ws.onmessage = (e) => {
          const msg = JSON.parse(e.data)
          if (msg.event === 'auth success') {
            term.writeln('\x1b[32m[FreeBucks]\x1b[0m Connected and authenticated with server daemon.')
          } else if (msg.event === 'console output') {
            msg.args.forEach((line: string) => term.writeln(line))
          } else if (msg.event === 'status') {
            term.writeln(`\x1b[34m[FreeBucks]\x1b[0m Server status: ${msg.args[0]}`)
          } else if (msg.event === 'stats') {
            // Optional: log stats or use them to update state
          } else if (msg.event === 'token expiring') {
            term.writeln('\x1b[33m[FreeBucks]\x1b[0m Token expiring soon, reconnecting...')
            connectWs()
          } else if (msg.event === 'token expired') {
            term.writeln('\x1b[31m[FreeBucks]\x1b[0m Token expired. Reconnecting...')
            connectWs()
          } else if (msg.event === 'jwt error') {
            term.writeln(`\x1b[31m[FreeBucks]\x1b[0m JWT Error: ${msg.args ? msg.args.join(' ') : 'Authentication failed'}`)
          } else if (msg.event === 'daemon error') {
            term.writeln(`\x1b[31m[FreeBucks]\x1b[0m Daemon Error: ${msg.args ? msg.args.join(' ') : 'Unknown'}`)
          }
        }

        ws.onclose = (e) => {
          let reason = e.reason || 'Unknown reason';
          if (e.code === 1006) reason = 'Abnormal Closure (Daemon unreachable, SSL error, or proxy block)';
          term.writeln(`\x1b[31m[FreeBucks]\x1b[0m Disconnected from server daemon. Reason: ${reason} (Code: ${e.code}). Reconnecting in 5s...`)
          setSocket(null)
          reconnectTimeoutRef.current = setTimeout(() => {
            if (terminalRef.current) connectWs()
          }, 5000)
        }

        ws.onerror = (e) => {
          term.writeln(`\x1b[31m[FreeBucks]\x1b[0m Connection error. URL: ${wssUrl.split('?')[0]}`)
          const isWss = wssUrl.startsWith('wss://');
          const isHttps = window.location.protocol === 'https:';
          if (isHttps && !isWss) {
             term.writeln('\x1b[31m[FreeBucks]\x1b[0m Mixed content blocked: trying to connect to ws:// from https:// page.');
          }
        }

      } catch (err: any) {
        const msg = handleApiError(err);
        term.writeln(`\x1b[31m[FreeBucks]\x1b[0m ${msg}`);
        console.error("Websocket Credential Error:", msg)
      }
    }

    connectWs()

    const handleResize = () => fitAddon.fit()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
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
        <Button onClick={() => handlePower('stop')} disabled={status?.currentState === 'offline'} variant="outline" className="text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/10"><Square className="w-4 h-4 mr-2" /> Stop</Button>
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
