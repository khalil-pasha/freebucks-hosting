"use client"

import { useContext, useEffect, useState, useRef } from "react"
import { ServerContext } from "../layout"
import api, { handleApiError } from "@/lib/api"
import { Folder, FileText, Upload, Plus, ChevronRight, Save, X, MoreVertical, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"

export default function FilesPage() {
  const { server } = useContext(ServerContext)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<any[]>([])
  const [currentPath, setCurrentPath] = useState("/")
  const [loading, setLoading] = useState(true)
  const [editingFile, setEditingFile] = useState<{ name: string, content: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const [activeModal, setActiveModal] = useState<{type: 'rename'|'move'|'chmod'|'archive'|'unarchive'|'delete'|'create-folder'|'bulk-delete', file?: any} | null>(null)
  const [modalInput, setModalInput] = useState("")
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const fetchFiles = async (dir: string = "/") => {
    try {
      setLoading(true)
      const res = await api.get(`/servers/${server.id}/panel/files?directory=${encodeURIComponent(dir)}`)
      setFiles(res.data)
      setCurrentPath(dir)
      setSelectedFiles([])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (server) fetchFiles("/")
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

  const navigateTo = (folder: string) => {
    const newPath = currentPath === '/' ? `/${folder}` : `${currentPath}/${folder}`
    fetchFiles(newPath)
  }

  const navigateUp = () => {
    if (currentPath === '/') return
    const parts = currentPath.split('/').filter(Boolean)
    parts.pop()
    const newPath = parts.length === 0 ? '/' : `/${parts.join('/')}`
    fetchFiles(newPath)
  }

  const handleEdit = async (file: any) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("File too large to edit in browser (Limit 2MB). Please download it instead.")
      return
    }
    const editableExts = ['.txt', '.yml', '.yaml', '.json', '.properties', '.conf']
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    if (!editableExts.includes(ext) && file.name.indexOf('.') !== -1) {
      alert("This file type is not editable in the browser.")
      return
    }

    try {
      setLoading(true)
      const filePath = currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`
      const res = await api.get(`/servers/${server.id}/panel/files/content?file=${encodeURIComponent(filePath)}`)
      setEditingFile({ name: file.name, content: res.data.content })
    } catch (err: any) {
      alert(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    if (!editingFile) return
    try {
      setSaving(true)
      const filePath = currentPath === '/' ? `/${editingFile.name}` : `${currentPath}/${editingFile.name}`
      await api.post(`/servers/${server.id}/panel/files/write`, {
        file: filePath,
        content: editingFile.content
      })
      alert("Saved successfully!")
      setEditingFile(null)
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || handleApiError(err) || "Failed to save file"
      alert(`Error: ${errorMsg}`)
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files
    if (!filesList || filesList.length === 0) return
    try {
      setLoading(true)
      const res = await api.get(`/servers/${server.id}/panel/files/upload`)
      const uploadUrl = res.data.url

      const formData = new FormData()
      for (let i = 0; i < filesList.length; i++) {
        formData.append('files', filesList[i])
      }

      await axios.post(`${uploadUrl}&directory=${currentPath}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert("Files uploaded successfully")
      fetchFiles(currentPath)
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || handleApiError(err) || "Upload failed"
      alert(`Error: ${errorMsg}`)
      setLoading(false)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const executeModalAction = async () => {
    if (!activeModal) return
    try {
      setLoading(true)
      const { type, file } = activeModal
      
      if (type === 'create-folder') {
        if (!modalInput) return
        await api.post(`/servers/${server.id}/panel/files/create-folder`, { root: currentPath, name: modalInput })
        alert("Folder created successfully")
      } else if (type === 'rename') {
        if (!modalInput || modalInput === file.name) return
        await api.post(`/servers/${server.id}/panel/files/rename`, {
          root: currentPath,
          files: [{ from: file.name, to: modalInput }]
        })
        alert("Renamed successfully")
      } else if (type === 'move') {
        if (!modalInput) return
        // Pterodactyl moves via rename: from "file.txt" to "../newdir/file.txt" or similar
        // Since the root is currentPath, we must provide absolute paths from root or relative paths
        // Pterodactyl natively supports renaming across directories if you provide full path from root? 
        // Actually, Pterodactyl rename uses `root` as base, and `from` and `to` are relative to root.
        // If we want to move, we can provide `to` as a path relative to root, e.g. `../newFolder/file.txt` or absolute `/newFolder/file.txt`
        // Let's assume modalInput is the full absolute destination path: e.g. `/newFolder/file.txt`
        // Pterodactyl rename `to` field can just be the new absolute path if it starts with /? Actually it's relative to `root`.
        // If the user inputs an absolute path like `/world/data`, we can do root: `/` and from: `${currentPath}/${file.name}`
        const absoluteFrom = currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`
        let absoluteTo = modalInput
        if (!absoluteTo.startsWith('/')) absoluteTo = `/${absoluteTo}`
        if (!absoluteTo.endsWith(`/${file.name}`) && !absoluteTo.endsWith(file.name)) {
             absoluteTo = absoluteTo === '/' ? `/${file.name}` : `${absoluteTo}/${file.name}`
        }

        await api.post(`/servers/${server.id}/panel/files/rename`, {
          root: '/',
          files: [{ from: absoluteFrom, to: absoluteTo }]
        })
        alert("Moved successfully")
      } else if (type === 'chmod') {
        if (!modalInput) return
        await api.post(`/servers/${server.id}/panel/files/chmod`, {
          root: currentPath,
          files: [{ file: file.name, mode: modalInput }]
        })
        alert("Permissions updated successfully")
      } else if (type === 'archive') {
        await api.post(`/servers/${server.id}/panel/files/archive`, {
          root: currentPath,
          files: [file.name]
        })
        alert("Archive created successfully")
      } else if (type === 'unarchive') {
        await api.post(`/servers/${server.id}/panel/files/decompress`, {
          root: currentPath,
          file: file.name
        })
        alert("Extracted successfully")
      } else if (type === 'delete') {
        await api.post(`/servers/${server.id}/panel/files/delete`, {
          root: currentPath,
          files: [file.name]
        })
        alert("Deleted successfully")
      } else if (type === 'bulk-delete') {
        await api.post(`/servers/${server.id}/panel/files/delete`, {
          root: currentPath,
          files: selectedFiles
        })
        alert("Deleted successfully")
        setSelectedFiles([])
      }

      fetchFiles(currentPath)
      setActiveModal(null)
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || handleApiError(err) || "Failed to execute action"
      alert(`Error: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  if (editingFile) {
    return (
      <div className="flex flex-col h-full gap-4">
        <div className="flex justify-between items-center bg-card p-4 rounded-lg border border-border/50">
          <h2 className="font-bold font-mono">{editingFile.name}</h2>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setEditingFile(null)}><X className="w-4 h-4 mr-2" /> Cancel</Button>
            <Button onClick={saveContent} disabled={saving} className="bg-primary text-white"><Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save File'}</Button>
          </div>
        </div>
        <textarea 
          value={editingFile.content}
          onChange={(e) => setEditingFile({ ...editingFile, content: e.target.value })}
          className="flex-1 w-full p-4 font-mono text-sm bg-[#09090b] text-foreground border border-border/50 rounded-lg resize-none focus:outline-none focus:border-primary/50"
          spellCheck={false}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 bg-background border border-border/50 rounded-lg px-4 py-2 font-mono text-sm overflow-x-auto">
          <span className="cursor-pointer hover:text-primary" onClick={() => fetchFiles("/")}>/</span>
          {currentPath !== '/' && currentPath.split('/').filter(Boolean).map((part, i, arr) => (
            <div key={i} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-foreground/40" />
              <span 
                className="cursor-pointer hover:text-primary whitespace-nowrap"
                onClick={() => {
                  const newPath = '/' + arr.slice(0, i + 1).join('/')
                  fetchFiles(newPath)
                }}
              >{part}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {selectedFiles.length > 0 && (
            <Button variant="default" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => setActiveModal({type: 'bulk-delete'})}>
              <Trash className="w-4 h-4 mr-2" /> Delete Selected ({selectedFiles.length})
            </Button>
          )}
          <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
          <Button variant="outline" onClick={() => { setActiveModal({type: 'create-folder'}); setModalInput("new_folder") }}><Plus className="w-4 h-4 mr-2" /> New Folder</Button>
          <Button variant="default" onClick={() => fileInputRef.current?.click()}><Upload className="w-4 h-4 mr-2" /> Upload</Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto border border-border/50 rounded-lg bg-card relative">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-background/50 border-b border-border/50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 w-10">
                <input 
                  type="checkbox" 
                  className="accent-primary w-4 h-4 rounded cursor-pointer"
                  checked={files.length > 0 && selectedFiles.length === files.length}
                  onChange={(e) => setSelectedFiles(e.target.checked ? files.map(f => f.name) : [])}
                />
              </th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Size</th>
              <th className="px-4 py-3 font-medium">Permissions</th>
              <th className="px-4 py-3 font-medium">Modified</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPath !== '/' && (
              <tr className="border-b border-border/10 hover:bg-foreground/5 cursor-pointer" onClick={navigateUp}>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 flex items-center gap-2"><Folder className="w-4 h-4 text-blue-400" /> ..</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3"></td>
              </tr>
            )}
            {files.map((file, i) => (
              <tr key={i} className={`border-b border-border/10 hover:bg-foreground/5 ${selectedFiles.includes(file.name) ? 'bg-primary/10 hover:bg-primary/20' : ''}`}>
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    className="accent-primary w-4 h-4 rounded cursor-pointer"
                    checked={selectedFiles.includes(file.name)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => { 
                      e.stopPropagation(); 
                      setSelectedFiles(prev => e.target.checked ? [...prev, file.name] : prev.filter(n => n !== file.name)) 
                    }}
                  />
                </td>
                <td className="px-4 py-3 flex items-center gap-2 cursor-pointer" onClick={() => file.isFile ? handleEdit(file) : navigateTo(file.name)}>
                  {file.isFile ? <FileText className="w-4 h-4 text-foreground/60" /> : <Folder className="w-4 h-4 text-blue-400" />}
                  {file.name}
                </td>
                <td className="px-4 py-3 text-foreground/70">{file.isFile ? formatSize(file.size) : '-'}</td>
                <td className="px-4 py-3 text-foreground/70 font-mono text-xs">{file.mode}</td>
                <td className="px-4 py-3 text-foreground/70">{new Date(file.modifiedAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-right relative">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/60" onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === file.name ? null : file.name) }}>
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                  {openDropdownId === file.name && (
                    <div className="absolute right-12 top-2 w-40 bg-[#18181b] border border-border/50 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col py-1 text-left">
                      <button className="px-4 py-2 hover:bg-foreground/10 text-sm" onClick={(e) => { e.stopPropagation(); setActiveModal({type: 'rename', file}); setModalInput(file.name); setOpenDropdownId(null); }}>Rename</button>
                      <button className="px-4 py-2 hover:bg-foreground/10 text-sm" onClick={(e) => { e.stopPropagation(); setActiveModal({type: 'move', file}); setModalInput('/'); setOpenDropdownId(null); }}>Move</button>
                      <button className="px-4 py-2 hover:bg-foreground/10 text-sm" onClick={(e) => { e.stopPropagation(); setActiveModal({type: 'chmod', file}); setModalInput(file.mode || "644"); setOpenDropdownId(null); }}>Permissions</button>
                      <button className="px-4 py-2 hover:bg-foreground/10 text-sm" onClick={(e) => { e.stopPropagation(); setActiveModal({type: 'archive', file}); setOpenDropdownId(null); }}>Archive</button>
                      {/\.(zip|tar|tar\.gz|gz|rar)$/i.test(file.name) && (
                        <button className="px-4 py-2 hover:bg-foreground/10 text-sm" onClick={(e) => { e.stopPropagation(); setActiveModal({type: 'unarchive', file}); setOpenDropdownId(null); }}>Unarchive</button>
                      )}
                      <button className="px-4 py-2 hover:bg-red-500/10 text-red-500 text-sm" onClick={(e) => { e.stopPropagation(); setActiveModal({type: 'delete', file}); setOpenDropdownId(null); }}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!loading && files.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-foreground/50">This directory is empty.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setActiveModal(null)}>
          <div className="bg-card border border-border/50 p-6 rounded-lg w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 capitalize">
              {activeModal.type.replace('-', ' ')} {activeModal.file ? `"${activeModal.file.name}"` : ''}
            </h3>
            
            {activeModal.type !== 'delete' && activeModal.type !== 'archive' && activeModal.type !== 'unarchive' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-foreground/70">
                  {activeModal.type === 'rename' ? 'New Name' : activeModal.type === 'move' ? 'Destination Path' : activeModal.type === 'chmod' ? 'Permissions (e.g. 644, 755)' : 'Name'}
                </label>
                <Input value={modalInput} onChange={(e) => setModalInput(e.target.value)} autoFocus />
                {activeModal.type === 'move' && <p className="text-xs text-foreground/50 mt-1">Example: /plugins or /world/data</p>}
              </div>
            )}

            {activeModal.type === 'delete' && (
              <p className="mb-6 text-foreground/80">Are you sure you want to delete <strong>{activeModal.file.name}</strong>? This action cannot be undone.</p>
            )}
            
            {activeModal.type === 'bulk-delete' && (
              <p className="mb-6 text-foreground/80">Are you sure you want to delete <strong>{selectedFiles.length}</strong> selected item(s)? This action cannot be undone.</p>
            )}
            
            {activeModal.type === 'archive' && (
              <p className="mb-6 text-foreground/80">Are you sure you want to archive <strong>{activeModal.file.name}</strong>?</p>
            )}

            {activeModal.type === 'unarchive' && (
              <p className="mb-6 text-foreground/80">Are you sure you want to extract <strong>{activeModal.file.name}</strong> into the current directory?</p>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button 
                variant="default"
                className={(activeModal.type === 'delete' || activeModal.type === 'bulk-delete') ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
                onClick={executeModalAction}
                disabled={loading}
              >
                {loading ? 'Processing...' : (activeModal.type === 'delete' || activeModal.type === 'bulk-delete') ? 'Delete' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
