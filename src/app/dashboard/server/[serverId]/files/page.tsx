"use client"

import { useContext, useEffect, useState } from "react"
import { ServerContext } from "../layout"
import api, { handleApiError } from "@/lib/api"
import { Folder, FileText, File, Download, Trash, Edit, RefreshCw, Upload, Plus, ChevronRight, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function FilesPage() {
  const { server } = useContext(ServerContext)
  const [files, setFiles] = useState<any[]>([])
  const [currentPath, setCurrentPath] = useState("/")
  const [loading, setLoading] = useState(true)
  const [editingFile, setEditingFile] = useState<{ name: string, content: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchFiles = async (dir: string = "/") => {
    try {
      setLoading(true)
      const res = await api.get(`/servers/${server.id}/panel/files?directory=${encodeURIComponent(dir)}`)
      setFiles(res.data)
      setCurrentPath(dir)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (server) fetchFiles("/")
  }, [server])

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
      alert(handleApiError(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (file: any) => {
    if (!confirm(`Are you sure you want to delete ${file.name}?`)) return
    try {
      await api.post(`/servers/${server.id}/panel/files/delete`, {
        root: currentPath,
        files: [file.name]
      })
      fetchFiles(currentPath)
    } catch (err: any) {
      alert(handleApiError(err))
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
    <div className="flex flex-col h-full">
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
          <Button variant="outline" size="icon" onClick={() => fetchFiles(currentPath)} disabled={loading}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto border border-border/50 rounded-lg bg-card relative">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-background/50 border-b border-border/50 sticky top-0">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Size</th>
              <th className="px-4 py-3 font-medium">Modified</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPath !== '/' && (
              <tr className="border-b border-border/10 hover:bg-foreground/5 cursor-pointer" onClick={navigateUp}>
                <td className="px-4 py-3 flex items-center gap-2"><Folder className="w-4 h-4 text-blue-400" /> ..</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3"></td>
              </tr>
            )}
            {files.map((file, i) => (
              <tr key={i} className="border-b border-border/10 hover:bg-foreground/5">
                <td className="px-4 py-3 flex items-center gap-2 cursor-pointer" onClick={() => file.isFile ? handleEdit(file) : navigateTo(file.name)}>
                  {file.isFile ? <FileText className="w-4 h-4 text-foreground/60" /> : <Folder className="w-4 h-4 text-blue-400" />}
                  {file.name}
                </td>
                <td className="px-4 py-3 text-foreground/70">{file.isFile ? formatSize(file.size) : '-'}</td>
                <td className="px-4 py-3 text-foreground/70">{new Date(file.modifiedAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {file.isFile && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/60" onClick={() => handleEdit(file)}><Edit className="w-4 h-4" /></Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500/70 hover:text-red-500 hover:bg-red-500/10" onClick={() => handleDelete(file)}><Trash className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && files.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-foreground/50">This directory is empty.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
