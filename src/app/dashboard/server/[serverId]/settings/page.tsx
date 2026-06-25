"use client"

import { useContext, useState, useEffect } from "react"
import { ServerContext } from "../layout"
import api, { handleApiError } from "@/lib/api"
import { Settings, Save, AlertTriangle, Server, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const { server, refetch } = useContext(ServerContext)
  const [name, setName] = useState(server?.name || "")
  const [saving, setSaving] = useState(false)
  const [sftpDetails, setSftpDetails] = useState<any>(null)

  useEffect(() => {
    if (server) {
      setName(server.name)
      api.get(`/servers/${server.id}/panel/sftp`)
        .then(res => setSftpDetails(res.data))
        .catch(console.error)
    }
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
    try {
      await api.post(`/servers/${server.id}/panel/reinstall`, {})
      alert("Reinstallation triggered! Please check the console.")
    } catch (err: any) {
      alert(handleApiError(err))
    }
  }

  const handleResetWorld = async () => {
    if (!confirm("WARNING: This will generate a fresh world. Old world will be backed up by renaming.\nAre you sure you want to proceed?")) return
    try {
      await api.post(`/servers/${server.id}/panel/settings/reset-world`)
      if (confirm("World reset successfully! Your old world has been backed up.\nDo you want to start the server now to generate the new world?")) {
        await api.post(`/servers/${server.id}/panel/power`, { action: 'start' })
      }
    } catch (err: any) {
      alert(handleApiError(err))
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    // Optional: could add toast here, simple alert for now
    alert(`${type} copied to clipboard!`)
  }

  const handleLaunchSftp = () => {
    if (!sftpDetails) return
    const url = sftpDetails.sftpUsername 
      ? `sftp://${sftpDetails.sftpUsername}@${sftpDetails.sftpHost}:${sftpDetails.sftpPort}`
      : `sftp://${sftpDetails.sftpHost}:${sftpDetails.sftpPort}`
    window.open(url, '_self')
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

      <div className="bg-card border border-border/50 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Server className="w-5 h-5 text-primary" /> SFTP Access</h2>
        <p className="text-foreground/70 text-sm mb-6">
          Use SFTP to transfer large files, upload worlds, manage plugins, and edit server files with external tools like WinSCP or FileZilla.
        </p>

        {sftpDetails ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Server Address</label>
              <div className="flex gap-2">
                <Input readOnly value={`sftp://${sftpDetails.sftpHost}:${sftpDetails.sftpPort}`} className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(`sftp://${sftpDetails.sftpHost}:${sftpDetails.sftpPort}`, 'Server Address')}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Username</label>
              <div className="flex gap-2">
                <Input readOnly value={sftpDetails.sftpUsername} className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(sftpDetails.sftpUsername, 'Username')}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <Input readOnly value="Use your server panel password." className="font-mono text-sm text-foreground/50" />
              <p className="text-xs text-foreground/50 mt-1">
                Your SFTP password is the same as your panel password. FreeBucks never displays passwords for security reasons.
              </p>
            </div>

            <Button onClick={handleLaunchSftp} className="w-full md:w-auto mt-2">
              <ExternalLink className="w-4 h-4 mr-2" /> Launch SFTP
            </Button>
          </div>
        ) : (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-foreground/10 rounded w-3/4"></div>
              <div className="h-4 bg-foreground/10 rounded"></div>
              <div className="h-4 bg-foreground/10 rounded w-5/6"></div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-red-500"><AlertTriangle className="w-5 h-5" /> Danger Zone</h2>
        <p className="text-foreground/70 text-sm mb-6">These actions are destructive and cannot be undone.</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white" onClick={handleResetWorld}>
            Reset World
          </Button>
          <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white" onClick={handleReinstall}>
            Reinstall Server
          </Button>
        </div>
      </div>
    </div>
  )
}
