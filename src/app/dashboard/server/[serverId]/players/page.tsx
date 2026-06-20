"use client"

import { useContext, useEffect, useState } from "react"
import { ServerContext } from "../layout"
import api, { handleApiError } from "@/lib/api"
import { Users, UserX, UserCheck, Shield, AlertCircle, RefreshCw, X, Crosshair, Heart, Utensils, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function PlayersPage() {
  const { server, status } = useContext(ServerContext)
  
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [whitelist, setWhitelist] = useState<any[]>([])
  const [ops, setOps] = useState<any[]>([])
  const [bannedPlayers, setBannedPlayers] = useState<any[]>([])
  const [bannedIps, setBannedIps] = useState<any[]>([])
  
  // Modals
  const [activeListModal, setActiveListModal] = useState<{type: string, data: any[]} | null>(null)
  const [playerActionModal, setPlayerActionModal] = useState<string | null>(null)
  const [manualInputUsername, setManualInputUsername] = useState("")

  const [tpX, setTpX] = useState("")
  const [tpY, setTpY] = useState("")
  const [tpZ, setTpZ] = useState("")
  const [showTp, setShowTp] = useState(false)

  const isOnline = status?.currentState === 'ONLINE'

  const fetchPlayersData = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/servers/${server.id}/panel/players`)
      setWhitelist(res.data.whitelist || [])
      setOps(res.data.ops || [])
      setBannedPlayers(res.data.bannedPlayers || [])
      setBannedIps(res.data.bannedIps || [])
    } catch (err: any) {
      setError(handleApiError(err) || "Failed to load player data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (server) fetchPlayersData()
  }, [server])

  const sendCommand = async (action: string, username?: string, ip?: string, extraArgs: any = {}) => {
    if (!isOnline) {
      alert("Server must be online to run player commands.")
      return
    }
    
    if (username && !/^[a-zA-Z0-9_]{3,16}$/.test(username)) {
      alert("Invalid Minecraft username. Only A-Z, 0-9, and underscores (3-16 chars) allowed.")
      return
    }

    if (ip && !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip)) {
      alert("Invalid IP address.")
      return
    }

    try {
      setActionLoading(true)
      await api.post(`/servers/${server.id}/panel/players/command`, {
        action,
        username,
        ip,
        ...extraArgs
      })
      alert(`Command sent successfully.`)
      fetchPlayersData()
      
      // Update modal lists if active
      if (activeListModal) {
        if (action.includes('whitelist')) setActiveListModal(null)
        if (action.includes('op')) setActiveListModal(null)
        if (action.includes('ban') || action.includes('pardon')) setActiveListModal(null)
      }
      
      if (action !== 'tp') {
        setPlayerActionModal(null)
        setShowTp(false)
      }
    } catch (err: any) {
      alert(`Error: ${err.response?.data?.error || handleApiError(err) || "Command failed"}`)
    } finally {
      setActionLoading(false)
    }
  }

  const ListModal = ({ title, items, icon: Icon, type }: any) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setActiveListModal(null)}>
        <div className="bg-card border border-border/50 p-6 rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Icon className="w-5 h-5 text-primary" /> {title}
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setActiveListModal(null)}><X className="w-5 h-5" /></Button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2">
            {items.length === 0 ? (
              <p className="text-center text-foreground/50 py-8">No records found.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {items.map((item: any, i: number) => {
                  const isIp = type === 'Banned IPs'
                  const display = item.name || item.ip || 'Unknown'
                  return (
                    <div key={i} className="flex items-center justify-between p-3 bg-background/50 border border-border/30 rounded-lg">
                      <div>
                        <div className="font-medium">{display}</div>
                        {item.uuid && <div className="text-[10px] font-mono text-foreground/50">{item.uuid}</div>}
                        {item.reason && <div className="text-xs text-foreground/50 mt-1">Reason: {item.reason}</div>}
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                        onClick={() => {
                          if (type === 'Whitelist') sendCommand('whitelist_remove', display)
                          if (type === 'OPs') sendCommand('deop', display)
                          if (type === 'Banned Players') sendCommand('pardon', display)
                          if (type === 'Banned IPs') sendCommand('pardon_ip', undefined, display)
                        }}
                        disabled={actionLoading}
                      >
                        Remove
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const PlayerActionModal = () => {
    if (!playerActionModal) return null
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => {setPlayerActionModal(null); setShowTp(false)}}>
        <div className="bg-card border border-border/50 p-6 rounded-xl w-full max-w-sm shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <img src={`https://minotar.net/helm/${playerActionModal}/32.png`} className="rounded bg-background" alt="" />
              {playerActionModal}
            </h2>
            <Button variant="ghost" size="icon" onClick={() => {setPlayerActionModal(null); setShowTp(false)}}><X className="w-5 h-5" /></Button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button variant="outline" className="text-red-400 hover:text-red-500 hover:bg-red-500/10" onClick={() => sendCommand('kick', playerActionModal)} disabled={actionLoading}>Kick</Button>
            <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => sendCommand('kill', playerActionModal)} disabled={actionLoading}>Kill</Button>
            <Button variant="outline" onClick={() => sendCommand('heal', playerActionModal)} disabled={actionLoading}><Heart className="w-4 h-4 mr-2 text-green-500" /> Heal</Button>
            <Button variant="outline" onClick={() => sendCommand('feed', playerActionModal)} disabled={actionLoading}><Utensils className="w-4 h-4 mr-2 text-orange-500" /> Feed</Button>
            <Button variant="outline" onClick={() => sendCommand('op', playerActionModal)} disabled={actionLoading}>OP</Button>
            <Button variant="outline" onClick={() => sendCommand('deop', playerActionModal)} disabled={actionLoading}>De-OP</Button>
            <Button variant="outline" onClick={() => sendCommand('whitelist_add', playerActionModal)} disabled={actionLoading}>Whitelist</Button>
            <Button variant="outline" className="text-red-400" onClick={() => sendCommand('ban', playerActionModal)} disabled={actionLoading}>Ban</Button>
          </div>

          {!showTp ? (
            <Button className="w-full" onClick={() => setShowTp(true)} variant="secondary"><Crosshair className="w-4 h-4 mr-2" /> Teleport</Button>
          ) : (
            <div className="flex gap-2">
              <Input placeholder="X" value={tpX} onChange={e => setTpX(e.target.value)} type="number" />
              <Input placeholder="Y" value={tpY} onChange={e => setTpY(e.target.value)} type="number" />
              <Input placeholder="Z" value={tpZ} onChange={e => setTpZ(e.target.value)} type="number" />
              <Button onClick={() => sendCommand('tp', playerActionModal, undefined, { x: tpX, y: tpY, z: tpZ })} disabled={actionLoading}><Send className="w-4 h-4" /></Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertCircle className="w-16 h-16 text-foreground/20 mb-4" />
        <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
        <p className="text-foreground/60">{error}</p>
        <Button variant="outline" className="mt-6" onClick={() => fetchPlayersData()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Player Management</h2>
        </div>
        <Button variant="outline" onClick={() => fetchPlayersData()} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {!isOnline && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6 flex gap-3 text-orange-500 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p><strong>Server is offline.</strong> You must start the server to run live player commands (kick, heal, feed). You can still view offline JSON lists below.</p>
        </div>
      )}

      {/* Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div 
          className="bg-card border border-border/50 rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors flex flex-col items-center text-center gap-3"
          onClick={() => setActiveListModal({ type: 'Whitelist', data: whitelist })}
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold">Whitelist</h3>
            <p className="text-xs text-foreground/50">{whitelist.length} players</p>
          </div>
        </div>

        <div 
          className="bg-card border border-border/50 rounded-xl p-6 cursor-pointer hover:border-red-500/50 transition-colors flex flex-col items-center text-center gap-3"
          onClick={() => setActiveListModal({ type: 'OPs', data: ops })}
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold">Operators (OPs)</h3>
            <p className="text-xs text-foreground/50">{ops.length} players</p>
          </div>
        </div>

        <div 
          className="bg-card border border-border/50 rounded-xl p-6 cursor-pointer hover:border-red-500/50 transition-colors flex flex-col items-center text-center gap-3"
          onClick={() => setActiveListModal({ type: 'Banned Players', data: bannedPlayers })}
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold">Banned Players</h3>
            <p className="text-xs text-foreground/50">{bannedPlayers.length} players</p>
          </div>
        </div>

        <div 
          className="bg-card border border-border/50 rounded-xl p-6 cursor-pointer hover:border-red-500/50 transition-colors flex flex-col items-center text-center gap-3"
          onClick={() => setActiveListModal({ type: 'Banned IPs', data: bannedIps })}
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold">Banned IPs</h3>
            <p className="text-xs text-foreground/50">{bannedIps.length} IPs</p>
          </div>
        </div>
      </div>

      {/* Manual User Input */}
      <div className="bg-card border border-border/50 rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <h3 className="font-bold mb-1">Manual Action</h3>
          <p className="text-xs text-foreground/50 mb-3">Type a username to quickly manage them</p>
          <Input 
            placeholder="Minecraft Username..." 
            value={manualInputUsername}
            onChange={(e) => setManualInputUsername(e.target.value)}
            className="w-full max-w-xs"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" disabled={!manualInputUsername} onClick={() => setPlayerActionModal(manualInputUsername)}>Manage Player</Button>
          <Button variant="outline" disabled={!manualInputUsername} onClick={() => sendCommand('whitelist_add', manualInputUsername)}>Whitelist</Button>
          <Button variant="outline" disabled={!manualInputUsername} onClick={() => sendCommand('op', manualInputUsername)}>OP</Button>
          <Button variant="outline" className="text-red-500 border-red-500/50 hover:bg-red-500 hover:text-white" disabled={!manualInputUsername} onClick={() => sendCommand('ban', manualInputUsername)}>Ban</Button>
        </div>
      </div>

      {/* Online Players Table Fallback */}
      <h3 className="font-bold mb-4">Live Players</h3>
      <div className="flex-1 border border-border/50 rounded-xl bg-card overflow-hidden flex flex-col items-center justify-center p-8 text-center min-h-[250px]">
        <Users className="w-12 h-12 text-foreground/20 mb-4" />
        <h4 className="font-bold mb-2">Live Tracking Unavailable</h4>
        <p className="text-sm text-foreground/60 max-w-md">
          Advanced player details (live online status, health, inventory, location) require a server-side plugin/API and will be available soon. Use the manual action bar above to run commands on online players.
        </p>
      </div>

      {activeListModal && (
        <ListModal 
          title={activeListModal.type} 
          items={activeListModal.data} 
          type={activeListModal.type}
          icon={
            activeListModal.type === 'Whitelist' ? UserCheck :
            activeListModal.type === 'OPs' ? Shield :
            activeListModal.type === 'Banned Players' ? UserX : AlertCircle
          } 
        />
      )}

      <PlayerActionModal />
    </div>
  )
}
