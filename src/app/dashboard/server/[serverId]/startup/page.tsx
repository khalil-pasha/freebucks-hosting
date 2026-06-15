"use client"

import { useContext, useState, useEffect } from "react"
import { ServerContext } from "../layout"
import api, { handleApiError } from "@/lib/api"
import { PlayCircle, AlertCircle, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function StartupPage() {
  const { server } = useContext(ServerContext)
  const [saving, setSaving] = useState(false)

  const [variables, setVariables] = useState<any[]>([])
  const [dockerImage, setDockerImage] = useState<string>("")
  const [savingImage, setSavingImage] = useState(false)

  useEffect(() => {
    if (!server) return
    const fetchVars = async () => {
      try {
        const res = await api.get(`/servers/${server.id}/panel/startup`)
        setVariables(res.data.variables.map((v: any) => ({ env_variable: v.env_variable, name: v.name, val: v.server_value })))
        if (res.data.dockerImage) {
          setDockerImage(res.data.dockerImage)
        }
      } catch (err: any) {
        if (err.response && err.response.status === 403) return // Ignore if not permitted
        console.error(handleApiError(err))
      }
    }
    fetchVars()
  }, [server])

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const v of variables) {
        await api.post(`/servers/${server.id}/panel/startup`, { key: v.env_variable, value: v.val })
      }
      alert("Startup variables saved! Please restart the server.")
    } catch (err: any) {
      alert(handleApiError(err))
    }
    setSaving(false)
  }

  const handleChange = (env_var: string, newVal: string) => {
    setVariables(prev => prev.map(v => v.env_variable === env_var ? { ...v, val: newVal } : v))
  }

  const handleUpdateDockerImage = async (imageToSet: string = dockerImage) => {
    setSavingImage(true)
    try {
      await api.put(`/servers/${server.id}/panel/docker-image`, { dockerImage: imageToSet })
      setDockerImage(imageToSet)
      alert("Docker image updated! Please restart the server.")
    } catch (err: any) {
      alert(handleApiError(err))
    }
    setSavingImage(false)
  }

  const handleFixJava = async () => {
    await handleUpdateDockerImage("ghcr.io/pterodactyl/yolks:java_25")
    try {
      await api.post(`/servers/${server.id}/panel/power`, { signal: 'restart' })
    } catch(err) {
      // Ignored if power action fails
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full max-w-4xl">
      <div className="flex items-center gap-2 mb-2">
        <PlayCircle className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Startup Configuration</h2>
      </div>

      <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex gap-3 text-orange-500 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p>Changes to startup variables require a server restart to take effect. Incorrect variables can prevent the server from starting.</p>
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-6 flex flex-col gap-4">
        <h3 className="text-lg font-bold">Docker Image</h3>
        <p className="text-sm text-foreground/70 mb-2">
          Select the Docker image used to run your server. Note: Minecraft 1.20.5+ requires Java 21/25.
        </p>
        <div className="flex gap-4 items-center flex-wrap">
          <select 
            className="flex h-10 w-full md:w-64 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={dockerImage}
            onChange={(e) => setDockerImage(e.target.value)}
          >
            <option value="ghcr.io/pterodactyl/yolks:java_17">Java 17 (Legacy)</option>
            <option value="ghcr.io/pterodactyl/yolks:java_21">Java 21</option>
            <option value="ghcr.io/pterodactyl/yolks:java_25">Java 25 (Latest)</option>
          </select>
          <Button onClick={() => handleUpdateDockerImage()} disabled={savingImage}>
            {savingImage ? "Saving..." : "Apply Image"}
          </Button>
          <Button variant="secondary" onClick={handleFixJava} disabled={savingImage}>
            Fix Java Version (Auto Restart)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variables.map(v => (
          <div key={v.env_variable} className="bg-card border border-border/50 p-4 rounded-xl">
            <label className="text-sm font-bold mb-1 block">{v.name}</label>
            <p className="text-xs font-mono text-foreground/50 mb-3">{v.env_variable}</p>
            <Input 
              value={v.val} 
              onChange={e => handleChange(v.env_variable, e.target.value)} 
              className="font-mono bg-background"
            />
          </div>
        ))}
      </div>

      <div>
        <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
          <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Variables"}
        </Button>
      </div>
    </div>
  )
}
