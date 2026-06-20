"use client"

import { useContext, useEffect, useState } from "react"
import { ServerContext } from "../layout"
import api, { handleApiError } from "@/lib/api"
import { Settings2, AlertCircle, Save, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function OptionsPage() {
  const { server } = useContext(ServerContext)
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showRestartNotice, setShowRestartNotice] = useState(false)

  // Options state
  const [options, setOptions] = useState<Record<string, any>>({})

  // Original state to detect changes
  const [originalOptions, setOriginalOptions] = useState<Record<string, any>>({})

  const fetchOptions = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get(`/servers/${server.id}/panel/options`)
      
      // Parse values
      const parsed = {
        'gamemode': res.data['gamemode'] || 'survival',
        'difficulty': res.data['difficulty'] || 'easy',
        'white-list': res.data['white-list'] === 'true',
        'cracked': res.data['online-mode'] === 'false',
        'allow-flight': res.data['allow-flight'] === 'true',
        'pvp': res.data['pvp'] !== 'false',
        'force-gamemode': res.data['force-gamemode'] === 'true',
        'hardcore': res.data['hardcore'] === 'true',
        'max-players': parseInt(res.data['max-players'] || '20', 10),
        'spawn-protection': parseInt(res.data['spawn-protection'] || '16', 10),
        'view-distance': parseInt(res.data['view-distance'] || '10', 10),
        'simulation-distance': parseInt(res.data['simulation-distance'] || '10', 10),
        'motd': res.data['motd'] || 'A Minecraft Server'
      }

      setOptions(parsed)
      setOriginalOptions(parsed)
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("server.properties was not found on this server. Options management is available only for Minecraft servers.")
      } else {
        setError(handleApiError(err) || "Failed to load options")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (server) fetchOptions()
  }, [server])

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Validate Number inputs
      const payload = { ...options }
      if (isNaN(payload['max-players']) || payload['max-players'] < 1) payload['max-players'] = 20
      if (isNaN(payload['spawn-protection']) || payload['spawn-protection'] < 0) payload['spawn-protection'] = 16
      if (isNaN(payload['view-distance']) || payload['view-distance'] < 2) payload['view-distance'] = 10
      if (isNaN(payload['simulation-distance']) || payload['simulation-distance'] < 2) payload['simulation-distance'] = 10

      // Convert booleans back to string
      const stringifiedPayload: Record<string, string> = {
        'gamemode': payload['gamemode'],
        'difficulty': payload['difficulty'],
        'white-list': payload['white-list'] ? 'true' : 'false',
        'online-mode': payload['cracked'] ? 'false' : 'true',
        'allow-flight': payload['allow-flight'] ? 'true' : 'false',
        'pvp': payload['pvp'] ? 'true' : 'false',
        'force-gamemode': payload['force-gamemode'] ? 'true' : 'false',
        'hardcore': payload['hardcore'] ? 'true' : 'false',
        'max-players': payload['max-players'].toString(),
        'spawn-protection': payload['spawn-protection'].toString(),
        'view-distance': payload['view-distance'].toString(),
        'simulation-distance': payload['simulation-distance'].toString(),
        'motd': payload['motd'].replace(/\n/g, '') // Sanitize multiline
      }

      await api.post(`/servers/${server.id}/panel/options`, stringifiedPayload)
      
      alert("Server options updated successfully.")
      setShowRestartNotice(true)
      setOriginalOptions(payload)
      setOptions(payload)
    } catch (err: any) {
      alert(`Error: ${handleApiError(err) || "Failed to save options"}`)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key: string, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertCircle className="w-16 h-16 text-foreground/20 mb-4" />
        <h2 className="text-xl font-bold mb-2">Unavailable</h2>
        <p className="text-foreground/60">{error}</p>
        <Button variant="outline" className="mt-6" onClick={() => fetchOptions()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const ToggleCard = ({ title, desc, objKey }: { title: string, desc: string, objKey: string }) => {
    const isEnabled = options[objKey] === true
    return (
      <div className="bg-card border border-border/50 rounded-xl p-4 flex items-center justify-between gap-4">
        <div>
          <div className="font-bold">{title}</div>
          <div className="text-xs text-foreground/50">{desc}</div>
        </div>
        <button 
          className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${isEnabled ? 'bg-green-500' : 'bg-red-500'}`}
          onClick={() => handleChange(objKey, !isEnabled)}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isEnabled ? 'left-7' : 'left-1'}`} />
        </button>
      </div>
    )
  }

  const hasChanges = JSON.stringify(options) !== JSON.stringify(originalOptions)

  return (
    <div className="flex flex-col h-full relative pb-20">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Options</h2>
        </div>
        <Button variant="outline" onClick={() => fetchOptions()} disabled={loading || saving}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {showRestartNotice && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6 flex gap-3 text-orange-500 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>Some changes require a <strong>server restart</strong> to take effect.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        
        {/* Core Settings */}
        <div className="space-y-4">
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <label className="block text-sm font-bold mb-1">Gamemode</label>
            <select 
              className="w-full bg-background border border-border/50 rounded-md p-2 text-sm focus:outline-none focus:border-primary"
              value={options['gamemode']}
              onChange={e => handleChange('gamemode', e.target.value)}
            >
              <option value="survival">Survival</option>
              <option value="creative">Creative</option>
              <option value="adventure">Adventure</option>
              <option value="spectator">Spectator</option>
            </select>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-4">
            <label className="block text-sm font-bold mb-1">Difficulty</label>
            <select 
              className="w-full bg-background border border-border/50 rounded-md p-2 text-sm focus:outline-none focus:border-primary"
              value={options['difficulty']}
              onChange={e => handleChange('difficulty', e.target.value)}
            >
              <option value="peaceful">Peaceful</option>
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <ToggleCard title="Whitelist" desc="Only let approved players join" objKey="white-list" />
          <ToggleCard 
            title="Cracked" 
            desc={options['cracked'] ? "Allows players without premium Minecraft accounts to join." : "Only authentic Minecraft accounts can join."} 
            objKey="cracked" 
          />
          <ToggleCard title="Allow Flight" desc="Allow flying in survival mode" objKey="allow-flight" />
          <ToggleCard title="PvP" desc="Player versus Player combat" objKey="pvp" />
          <ToggleCard title="Force Gamemode" desc="Force players into default gamemode on join" objKey="force-gamemode" />
          <ToggleCard title="Hardcore" desc="Death is permanent" objKey="hardcore" />
        </div>

        {/* Numeric & Text Settings */}
        <div className="space-y-4">
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <label className="block text-sm font-bold mb-1">Max Players</label>
            <Input 
              type="number" 
              value={options['max-players']} 
              onChange={e => handleChange('max-players', parseInt(e.target.value))} 
              min={1}
            />
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-4">
            <label className="block text-sm font-bold mb-1">Spawn Protection</label>
            <Input 
              type="number" 
              value={options['spawn-protection']} 
              onChange={e => handleChange('spawn-protection', parseInt(e.target.value))} 
              min={0}
            />
            <p className="text-xs text-foreground/50 mt-1">Radius in blocks</p>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-4">
            <label className="block text-sm font-bold mb-1">View Distance</label>
            <Input 
              type="number" 
              value={options['view-distance']} 
              onChange={e => handleChange('view-distance', parseInt(e.target.value))} 
              min={2} max={32}
            />
            <p className="text-xs text-foreground/50 mt-1">Chunks rendered around player</p>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-4">
            <label className="block text-sm font-bold mb-1">Simulation Distance</label>
            <Input 
              type="number" 
              value={options['simulation-distance']} 
              onChange={e => handleChange('simulation-distance', parseInt(e.target.value))} 
              min={2} max={32}
            />
            <p className="text-xs text-foreground/50 mt-1">Chunks where entities are ticked</p>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-4">
            <label className="block text-sm font-bold mb-1">MOTD</label>
            <Input 
              type="text" 
              value={options['motd']} 
              onChange={e => handleChange('motd', e.target.value)} 
              maxLength={59}
            />
            <p className="text-xs text-foreground/50 mt-1">Message of the day shown in server list</p>
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      <div className={`fixed bottom-0 right-0 lg:left-64 left-0 p-4 bg-background/80 backdrop-blur border-t border-border/50 flex justify-end transition-transform duration-300 z-40 ${hasChanges ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex items-center gap-4 max-w-7xl mx-auto w-full justify-end pr-8">
          <span className="text-sm text-orange-500 font-medium">You have unsaved changes.</span>
          <Button onClick={handleSave} disabled={saving} size="lg" className="shadow-xl">
            {saving ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
