"use client"

import { useContext, useState, useEffect } from "react"
import { ServerContext } from "../layout"
import api, { handleApiError } from "@/lib/api"
import { Settings, Save, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const { server, refetch } = useContext(ServerContext)
  const [name, setName] = useState(server?.name || "")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (server) setName(server.name)
  }, [server])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      await api.patch(`/servers/${server.id}/panel/settings`, { name })
      alert("Settings saved successfully!")
      refetch()
    } catch (err: any) {
      alert(handleApiError(err))
    } finally {
      setSaving(false)
    }
  }

  const handleReinstall = async () => {
    if (!confirm("WARNING: This will wipe all files and reinstall the server. Are you sure?")) return
    alert("Reinstall API is not yet implemented.")
  }

  return (
    <div className="max-w-2xl flex flex-col gap-8 h-full">
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-primary" /> General Settings</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Server Name</label>
            <Input 
              required 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          </div>
          <Button type="submit" disabled={saving} className="w-full md:w-auto self-start mt-2">
            <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-red-500"><AlertTriangle className="w-5 h-5" /> Danger Zone</h2>
        <p className="text-foreground/70 text-sm mb-6">These actions are destructive and cannot be undone.</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white" onClick={handleReinstall}>
            Reinstall Server
          </Button>
        </div>
      </div>
    </div>
  )
}
