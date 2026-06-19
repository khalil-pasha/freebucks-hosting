"use client"

import { useContext, useEffect, useState, useRef } from "react"
import { ServerContext } from "../layout"
import api, { handleApiError } from "@/lib/api"
import { Puzzle, Download, Trash, RefreshCw, Upload, AlertCircle, Link as LinkIcon, MoreVertical, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"

export default function PluginsPage() {
  const { server } = useContext(ServerContext)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [plugins, setPlugins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [showRestartNotice, setShowRestartNotice] = useState(false)
  
  const [activeModal, setActiveModal] = useState<{type: 'install-url'|'rename'|'delete', plugin?: any} | null>(null)
  const [modalInput, setModalInput] = useState("")
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const fetchPlugins = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get(`/servers/${server.id}/panel/plugins`)
      setPlugins(res.data)
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Plugins are available only for Paper/Spigot/Bukkit servers.")
      } else {
        setError(handleApiError(err) || "Failed to load plugins")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (server) fetchPlugins()
  }, [server])

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null)
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files
    if (!filesList || filesList.length === 0) return
    const file = filesList[0]
    
    if (!file.name.endsWith('.jar')) {
      alert("Only .jar plugin files are allowed.")
      return
    }

    try {
      setActionLoading(true)
      const res = await api.get(`/servers/${server.id}/panel/files/upload`)
      const uploadUrl = res.data.url

      const formData = new FormData()
      formData.append('files', file)

      await axios.post(`${uploadUrl}&directory=/plugins`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert("Plugin uploaded successfully")
      setShowRestartNotice(true)
      fetchPlugins()
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || handleApiError(err) || "Upload failed"
      alert(`Error: ${errorMsg}`)
    } finally {
      setActionLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDownload = async (plugin: any) => {
    try {
      const res = await api.get(`/servers/${server.id}/panel/files/download?file=${encodeURIComponent('/plugins/' + plugin.name)}`)
      window.open(res.data.url, '_blank')
    } catch (err: any) {
      alert(handleApiError(err) || "Failed to get download URL")
    }
  }

  const executeModalAction = async () => {
    if (!activeModal) return
    try {
      setActionLoading(true)
      const { type, plugin } = activeModal
      
      if (type === 'install-url') {
        if (!modalInput) return
        await api.post(`/servers/${server.id}/panel/plugins/install-url`, { url: modalInput })
        alert("Plugin installed successfully")
        setShowRestartNotice(true)
      } else if (type === 'rename') {
        if (!modalInput || modalInput === plugin.name) return
        if (!modalInput.endsWith('.jar')) {
          alert("Plugin name must end with .jar")
          setActionLoading(false)
          return
        }
        await api.post(`/servers/${server.id}/panel/plugins/rename`, {
          file: plugin.name,
          newName: modalInput
        })
        alert("Plugin renamed successfully")
        setShowRestartNotice(true)
      } else if (type === 'delete') {
        await api.post(`/servers/${server.id}/panel/plugins`, {
          file: plugin.name
        })
        alert("Plugin deleted successfully")
        setShowRestartNotice(true)
      }

      fetchPlugins()
      setActiveModal(null)
      setModalInput("")
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || handleApiError(err) || "Action failed"
      alert(`Error: ${errorMsg}`)
    } finally {
      setActionLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Puzzle className="w-16 h-16 text-foreground/20 mb-4" />
        <h2 className="text-xl font-bold mb-2">Unsupported Server</h2>
        <p className="text-foreground/60">{error}</p>
        <Button variant="outline" className="mt-6" onClick={() => fetchPlugins()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Plugin Manager</h2>
        </div>
        <div className="flex gap-2">
          <input type="file" accept=".jar" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
          <Button variant="outline" onClick={() => fetchPlugins()} disabled={loading}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></Button>
          <Button variant="outline" onClick={() => { setActiveModal({type: 'install-url'}); setModalInput("") }}><LinkIcon className="w-4 h-4 mr-2" /> Install from URL</Button>
          <Button variant="default" onClick={() => fileInputRef.current?.click()} disabled={actionLoading}><Upload className="w-4 h-4 mr-2" /> Upload .jar</Button>
        </div>
      </div>

      {showRestartNotice && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6 flex gap-3 text-orange-500 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>You have made changes to your plugins. <strong>Restart your server</strong> to apply these changes.</p>
        </div>
      )}

      <div className="flex-1 overflow-auto border border-border/50 rounded-lg bg-card relative">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-background/50 border-b border-border/50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 font-medium">Plugin Name</th>
              <th className="px-4 py-3 font-medium">Size</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Modified</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plugins.map((plugin, i) => (
              <tr key={i} className="border-b border-border/10 hover:bg-foreground/5">
                <td className="px-4 py-3 flex items-center gap-2">
                  <Puzzle className="w-4 h-4 text-primary" />
                  {plugin.name}
                </td>
                <td className="px-4 py-3 text-foreground/70">{formatSize(plugin.size)}</td>
                <td className="px-4 py-3">
                  <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded text-xs font-medium">Installed</span>
                </td>
                <td className="px-4 py-3 text-foreground/70">{new Date(plugin.modifiedAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-right relative">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/60" onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === plugin.name ? null : plugin.name) }}>
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                  {openDropdownId === plugin.name && (
                    <div className="absolute right-12 top-2 w-40 bg-[#18181b] border border-border/50 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col py-1 text-left">
                      <button className="px-4 py-2 hover:bg-foreground/10 text-sm flex items-center gap-2" onClick={(e) => { e.stopPropagation(); handleDownload(plugin); setOpenDropdownId(null); }}><Download className="w-4 h-4" /> Download</button>
                      <button className="px-4 py-2 hover:bg-foreground/10 text-sm" onClick={(e) => { e.stopPropagation(); setActiveModal({type: 'rename', plugin}); setModalInput(plugin.name); setOpenDropdownId(null); }}>Rename</button>
                      <button className="px-4 py-2 hover:bg-red-500/10 text-red-500 text-sm flex items-center gap-2" onClick={(e) => { e.stopPropagation(); setActiveModal({type: 'delete', plugin}); setOpenDropdownId(null); }}><Trash className="w-4 h-4" /> Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!loading && plugins.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-foreground/50">No plugins installed. Upload a .jar file or install from a URL.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setActiveModal(null)}>
          <div className="bg-card border border-border/50 p-6 rounded-lg w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 capitalize">
              {activeModal.type.replace('-', ' ')} {activeModal.plugin ? `"${activeModal.plugin.name}"` : ''}
            </h3>
            
            {activeModal.type === 'install-url' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-foreground/70">Direct Plugin URL (.jar)</label>
                <Input value={modalInput} onChange={(e) => setModalInput(e.target.value)} autoFocus placeholder="https://example.com/plugin.jar" />
                <p className="text-xs text-foreground/50 mt-1">Maximum file size: 50MB</p>
              </div>
            )}

            {activeModal.type === 'rename' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-foreground/70">New Name</label>
                <Input value={modalInput} onChange={(e) => setModalInput(e.target.value)} autoFocus />
              </div>
            )}

            {activeModal.type === 'delete' && (
              <p className="mb-6 text-foreground/80">Are you sure you want to delete <strong>{activeModal.plugin.name}</strong>? This action cannot be undone.</p>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button 
                variant="default"
                className={activeModal.type === 'delete' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
                onClick={executeModalAction}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : activeModal.type === 'delete' ? 'Delete' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
