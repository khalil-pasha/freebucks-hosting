"use client"

import { useContext, useEffect, useRef, useState } from "react"
import { ServerContext } from "../layout"
import api, { handleApiError } from "@/lib/api"
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Square, RotateCcw, AlertTriangle } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"

export default function ConsolePage() {
  const { server, status, refetch } = useContext(ServerContext)
  const { user } = useAuth()
  const terminalRef = useRef<HTMLDivElement>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [command, setCommand] = useState("")
  const [showEulaModal, setShowEulaModal] = useState(false)
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
        term.writeln('\x1b[33m[FreeBucks]\x1b[0m Fetching daemon credentials...')
        const res = await api.get(`/servers/${server.id}/panel/websocket`)
        const { token, socket: socketUrl } = res.data

        term.writeln('\x1b[33m[FreeBucks]\x1b[0m Connecting to server daemon...')
        ws = new WebSocket(socketUrl)
        setSocket(ws)

        ws.onopen = () => {
          ws!.send(JSON.stringify({ event: 'auth', args: [token] }))
        }

        ws.onmessage = (e) => {
          const msg = JSON.parse(e.data)
          if (msg.event === 'auth success') {
            term.writeln('\x1b[32m[FreeBucks]\x1b[0m Connected and authenticated with server daemon.')
          } else if (msg.event === 'console output') {
            msg.args.forEach((line: string) => {
              term.writeln(line)
              if (line.includes('You need to agree to the EULA') || line.includes('eula.txt')) {
                setShowEulaModal(true)
              }
            })
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
          term.writeln('\x1b[31m[FreeBucks]\x1b[0m Connection error.')
          const isWss = socketUrl.startsWith('wss://');
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
      if (refetch) refetch()
    } catch (err) {
      console.error(err)
    }
  }

  const handleAcceptEula = async () => {
    try {
      await api.post(`/servers/${server.id}/panel/eula/accept`)
      if (terminalRef.current) {
        // Backend now handles the restart automatically
      }
      setShowEulaModal(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className="flex flex-col h-full gap-4">
      {user && user.balance <= 0 && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-3 text-red-500">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium text-sm">Your balance is 0 credits. Add credits to continue running servers.</span>
        </div>
      )}
      <div className="flex gap-2 mb-2">
        <Button onClick={() => handlePower('start')} disabled={status?.currentState === 'running' || !!(user && user.balance <= 0)} variant="outline" className="text-success border-success/30 hover:bg-success/10"><Play className="w-4 h-4 mr-2" /> Start</Button>
        <Button onClick={() => handlePower('stop')} disabled={status?.currentState === 'offline'} variant="outline" className="text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/10"><Square className="w-4 h-4 mr-2" /> Stop</Button>
        <Button onClick={() => handlePower('restart')} disabled={status?.currentState === 'offline' || !!(user && user.balance <= 0)} variant="outline" className="text-primary border-primary/30 hover:bg-primary/10"><RotateCcw className="w-4 h-4 mr-2" /> Restart</Button>
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

    {showEulaModal && (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-background border border-border rounded-lg max-w-md w-full p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-2">Accept Minecraft® EULA</h2>
          <p className="text-muted-foreground mb-6">
            By pressing I Accept, you agree to the Minecraft EULA.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEulaModal(false)}>Cancel</Button>
            <Button onClick={handleAcceptEula} className="bg-primary text-primary-foreground hover:bg-primary/90">I Accept</Button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
