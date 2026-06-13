"use client"

import { useContext, useState } from "react"
import { ServerContext } from "../layout"
import { Puzzle, Download, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const PLUGINS = [
  { id: 'essentialsx', name: 'EssentialsX', description: 'Essential commands and features for your server.', version: '2.20.1' },
  { id: 'luckperms', name: 'LuckPerms', description: 'Advanced permissions plugin.', version: '5.4.102' },
  { id: 'viaversion', name: 'ViaVersion', description: 'Allow newer clients to connect to older server versions.', version: '4.8.1' },
  { id: 'worldedit', name: 'WorldEdit', description: 'In-game voxel map editor.', version: '7.2.15' },
  { id: 'placeholderapi', name: 'PlaceholderAPI', description: 'Unified placeholder system for plugins.', version: '2.11.4' },
  { id: 'vault', name: 'Vault', description: 'Permissions, Chat, & Economy API.', version: '1.7.3' },
]

export default function PluginsPage() {
  const { server } = useContext(ServerContext)
  const [installing, setInstalling] = useState<string | null>(null)
  const [installed, setInstalled] = useState<string[]>([])

  const handleInstall = async (pluginId: string) => {
    try {
      setInstalling(pluginId)
      // Mock API call since actual plugin repo integration requires backend downloader.
      await new Promise(r => setTimeout(r, 2000)) // Simulate download
      setInstalled(prev => [...prev, pluginId])
      alert(`${pluginId} installed successfully! Please restart the server.`)
    } catch (err: any) {
      alert("Failed to install plugin.")
    } finally {
      setInstalling(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center gap-2 mb-2">
        <Puzzle className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">1-Click Plugin Installer</h2>
      </div>

      <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex gap-3 text-orange-500 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p>After installing a plugin, you must restart your server for it to take effect. Only approved, stable versions are provided here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLUGINS.map(plugin => (
          <div key={plugin.id} className="bg-card border border-border/50 rounded-xl p-5 flex flex-col hover:border-primary/50 transition-colors">
            <h3 className="font-bold text-lg">{plugin.name}</h3>
            <p className="text-sm text-foreground/50 mt-1 mb-4 flex-1">{plugin.description}</p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/20">
              <span className="text-xs text-foreground/40 font-mono">v{plugin.version}</span>
              <Button 
                size="sm" 
                variant={installed.includes(plugin.id) ? "secondary" : "default"}
                disabled={installing === plugin.id || installed.includes(plugin.id)}
                onClick={() => handleInstall(plugin.id)}
              >
                {installing === plugin.id ? (
                  "Installing..."
                ) : installed.includes(plugin.id) ? (
                  <><Check className="w-4 h-4 mr-2" /> Installed</>
                ) : (
                  <><Download className="w-4 h-4 mr-2" /> Install</>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
