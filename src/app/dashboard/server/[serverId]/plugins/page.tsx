"use client"

import { useContext, useEffect, useState, useRef } from "react"
import { ServerContext } from "../layout"
import api, { handleApiError } from "@/lib/api"
import { Puzzle, Download, Trash, RefreshCw, Upload, AlertCircle, Link as LinkIcon, MoreVertical, Search, Store, Server as ServerIcon, X, CheckCircle2, ChevronRight, DownloadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"

export default function PluginsPage() {
  const { server } = useContext(ServerContext)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [activeTab, setActiveTab] = useState<'installed' | 'marketplace'>('installed')
  
  const [plugins, setPlugins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [showRestartNotice, setShowRestartNotice] = useState(false)
  
  const [activeModal, setActiveModal] = useState<{type: 'install-url'|'rename'|'delete', plugin?: any} | null>(null)
  const [modalInput, setModalInput] = useState("")
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // Marketplace states
  const [loaders, setLoaders] = useState<string[]>(['paper', 'spigot', 'purpur', 'bukkit'])
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [marketplaceError, setMarketplaceError] = useState<string | null>(null)
  
  const [pluginDetailsModal, setPluginDetailsModal] = useState<any | null>(null)
  const [pluginVersions, setPluginVersions] = useState<any[]>([])
  const [versionsLoading, setVersionsLoading] = useState(false)
  const [installingVersionId, setInstallingVersionId] = useState<string | null>(null)

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

  const detectSoftware = async () => {
    try {
      const res = await api.get(`/servers/${server.id}/panel/software`)
      if (res.data.loaders && res.data.loaders.length > 0) {
        setLoaders(res.data.loaders)
      }
    } catch (err) {
      console.error("Failed to detect server software", err)
    }
  }

  useEffect(() => {
    if (server) {
      fetchPlugins()
      detectSoftware()
    }
  }, [server])

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null)
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  // Modrinth Search
  const searchModrinth = async (query: string = searchQuery) => {
    try {
      setSearching(true)
      setMarketplaceError(null)
      // Create facets string: [["project_type:plugin"], ["categories:paper", "categories:spigot", ...]]
      const loaderFacets = loaders.map(l => `categories:${l}`)
      const facets = `[["project_type:plugin"], [${loaderFacets.map(l => `"${l}"`).join(',')}]]`
      
      const res = await axios.get(`https://api.modrinth.com/v2/search`, {
        params: {
          query: query,
          facets: facets,
          limit: 20
        }
      })
      setSearchResults(res.data.hits)
    } catch (err: any) {
      setMarketplaceError(err.message || "Failed to search Modrinth")
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'marketplace' && searchResults.length === 0 && !searching) {
      searchModrinth("")
    }
  }, [activeTab])

  const openPluginDetails = async (project: any) => {
    setPluginDetailsModal(project)
    setPluginVersions([])
    try {
      setVersionsLoading(true)
      const res = await axios.get(`https://api.modrinth.com/v2/project/${project.project_id}/version`)
      // Filter versions by compatible loaders
      const validVersions = res.data.filter((v: any) => v.loaders.some((l: string) => loaders.includes(l)))
      setPluginVersions(validVersions)
    } catch (err) {
      alert("Failed to load versions")
    } finally {
      setVersionsLoading(false)
    }
  }

  const installModrinthVersion = async (project: any, version: any) => {
    // Duplicate check
    const isInstalled = plugins.some(p => p.name.includes(`[MR-${project.project_id}`))
    if (isInstalled) {
      alert(`You already have ${project.title} installed. Please delete the old version from the Installed tab first to avoid conflicts.`)
      return
    }

    try {
      setInstallingVersionId(version.id)
      const primaryFile = version.files.find((f: any) => f.primary) || version.files[0]
      const rawName = primaryFile.filename.replace('.jar', '')
      const safeFilename = `${rawName}_[MR-${project.project_id}-${version.id}].jar`

      await api.post(`/servers/${server.id}/panel/plugins/install-url`, { 
        url: primaryFile.url,
        filename: safeFilename
      })
      
      alert(`Installed ${project.title} (${version.version_number}) successfully!`)
      setShowRestartNotice(true)
      fetchPlugins()
      setPluginDetailsModal(null)
      setActiveTab('installed')
    } catch (err: any) {
      alert(handleApiError(err) || "Installation failed")
    } finally {
      setInstallingVersionId(null)
    }
  }

  // File Utilities
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

  const cleanPluginName = (name: string) => {
    // Remove the [MR-...] metadata from display
    return name.replace(/_\[MR-[a-zA-Z0-9]+-[a-zA-Z0-9]+\]/g, '')
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
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Plugin Manager</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
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

      {/* Tabs */}
      <div className="flex border-b border-border/50 mb-6">
        <button 
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'installed' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'}`}
          onClick={() => setActiveTab('installed')}
        >
          <ServerIcon className="w-4 h-4 inline-block mr-2" /> Installed Plugins
        </button>
        <button 
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'marketplace' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'}`}
          onClick={() => setActiveTab('marketplace')}
        >
          <Store className="w-4 h-4 inline-block mr-2" /> Marketplace (Modrinth)
        </button>
      </div>

      {activeTab === 'installed' && (
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
              {plugins.map((plugin, i) => {
                const isModrinth = plugin.name.includes('[MR-')
                const displayName = cleanPluginName(plugin.name)

                return (
                  <tr key={i} className="border-b border-border/10 hover:bg-foreground/5">
                    <td className="px-4 py-3 flex items-center gap-2">
                      <Puzzle className="w-4 h-4 text-primary" />
                      <div className="flex flex-col">
                        <span>{displayName}</span>
                        {isModrinth && <span className="text-[10px] text-green-500 uppercase tracking-wider font-bold">Modrinth</span>}
                      </div>
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
                          <button className="px-4 py-2 hover:bg-foreground/10 text-sm flex items-center gap-2" onClick={(e) => { e.stopPropagation(); setActiveModal({type: 'rename', plugin}); setModalInput(plugin.name); setOpenDropdownId(null); }}>Rename</button>
                          <button className="px-4 py-2 hover:bg-red-500/10 text-red-500 text-sm flex items-center gap-2" onClick={(e) => { e.stopPropagation(); setActiveModal({type: 'delete', plugin}); setOpenDropdownId(null); }}><Trash className="w-4 h-4" /> Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
              {!loading && plugins.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-foreground/50">No plugins installed. Browse the Marketplace or upload a .jar file.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'marketplace' && (
        <div className="flex flex-col h-full gap-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
              <Input 
                placeholder="Search Modrinth plugins..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchModrinth()}
              />
            </div>
            <Button variant="secondary" onClick={() => searchModrinth()} disabled={searching}>
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          <div className="text-xs text-foreground/50 px-1">
            Filtering for compatible software: {loaders.join(', ')}
          </div>

          {marketplaceError ? (
            <div className="p-8 text-center text-red-400 bg-red-400/10 rounded-xl border border-red-400/20">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p>{marketplaceError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-8">
              {searchResults.map((project: any) => (
                <div key={project.project_id} className="bg-card border border-border/50 rounded-xl p-4 flex flex-col hover:border-primary/50 transition-colors cursor-pointer" onClick={() => openPluginDetails(project)}>
                  <div className="flex gap-3 mb-3">
                    {project.icon_url ? (
                      <img src={project.icon_url} alt="Icon" className="w-12 h-12 rounded-lg bg-background object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                        <Puzzle className="w-6 h-6 text-foreground/30" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold line-clamp-1">{project.title}</h3>
                      <p className="text-xs text-foreground/50">By {project.author}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/70 line-clamp-2 flex-1 mb-4">{project.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-xs text-foreground/50 flex items-center gap-1">
                      <DownloadCloud className="w-3 h-3" /> {project.downloads.toLocaleString()}
                    </div>
                    <Button size="sm" variant="secondary" className="h-8">View Versions</Button>
                  </div>
                </div>
              ))}
              {!searching && searchResults.length === 0 && (
                <div className="col-span-full py-12 text-center text-foreground/50">
                  No plugins found matching your query.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {pluginDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setPluginDetailsModal(null)}>
          <div className="bg-card border border-border/50 p-6 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                {pluginDetailsModal.icon_url ? (
                  <img src={pluginDetailsModal.icon_url} alt="Icon" className="w-16 h-16 rounded-xl bg-background object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-background flex items-center justify-center">
                    <Puzzle className="w-8 h-8 text-foreground/30" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">{pluginDetailsModal.title}</h2>
                  <div className="flex gap-2 mt-1">
                    {pluginDetailsModal.display_categories.map((c: string) => (
                      <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/10 text-foreground/70 uppercase">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPluginDetailsModal(null)}><X className="w-5 h-5" /></Button>
            </div>
            
            <p className="text-foreground/80 mb-6">{pluginDetailsModal.description}</p>
            
            <h3 className="font-bold mb-3 border-b border-border/50 pb-2">Available Versions</h3>
            <div className="flex-1 overflow-y-auto pr-2">
              {versionsLoading ? (
                <div className="py-8 text-center text-foreground/50">Loading versions...</div>
              ) : pluginVersions.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {pluginVersions.map((version) => {
                    const isInstalling = installingVersionId === version.id
                    return (
                      <div key={version.id} className="flex items-center justify-between p-3 bg-background/50 border border-border/30 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{version.name}</div>
                          <div className="text-xs text-foreground/50 mt-1">
                            Minecraft {version.game_versions[0]} {version.game_versions.length > 1 ? ` - ${version.game_versions[version.game_versions.length-1]}` : ''} 
                            &nbsp;•&nbsp; {new Date(version.date_published).toLocaleDateString()}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => installModrinthVersion(pluginDetailsModal, version)}
                          disabled={isInstalling || actionLoading}
                        >
                          {isInstalling ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                          {isInstalling ? 'Installing...' : 'Install'}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-foreground/50 border border-dashed border-border/50 rounded-xl">
                  No versions found compatible with your server software ({loaders.join(', ')}).
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Existing Action Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={() => setActiveModal(null)}>
          <div className="bg-card border border-border/50 p-6 rounded-lg w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 capitalize">
              {activeModal.type.replace('-', ' ')} {activeModal.plugin ? `"${cleanPluginName(activeModal.plugin.name)}"` : ''}
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
                <p className="text-xs text-foreground/50 mt-1">Warning: Renaming a Modrinth plugin will break automatic update detection.</p>
              </div>
            )}

            {activeModal.type === 'delete' && (
              <p className="mb-6 text-foreground/80">Are you sure you want to delete <strong>{cleanPluginName(activeModal.plugin.name)}</strong>? This action cannot be undone.</p>
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
