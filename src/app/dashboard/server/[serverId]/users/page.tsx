"use client"

import { useContext, useEffect, useState } from "react"
import { ServerContext } from "../layout"
import api, { handleApiError } from "@/lib/api"
import { Users, UserPlus, Trash, Shield, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function UsersPage() {
  const { server } = useContext(ServerContext)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [inviteIdentifier, setInviteIdentifier] = useState("")
  const [invitePerms, setInvitePerms] = useState<string[]>(['console', 'activity'])
  const [inviting, setInviting] = useState(false)

  const availablePerms = [
    { id: 'console', name: 'Console Access' },
    { id: 'files', name: 'File Manager' },
    { id: 'settings', name: 'Manage Settings' },
    { id: 'activity', name: 'View Activity' }
  ]

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/servers/${server.id}/panel/users`)
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (server) fetchUsers()
  }, [server])

  const togglePerm = (perm: string) => {
    setInvitePerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm])
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteIdentifier.trim()) return
    try {
      setInviting(true)
      await api.post(`/servers/${server.id}/panel/users`, {
        emailOrDiscord: inviteIdentifier,
        permissions: invitePerms
      })
      alert("User invited successfully!")
      setInviteIdentifier("")
      fetchUsers()
    } catch (err: any) {
      alert(handleApiError(err))
    } finally {
      setInviting(false)
    }
  }

  const handleRemove = async (accessId: string) => {
    if (!confirm("Remove this user's access?")) return
    try {
      await api.delete(`/servers/${server.id}/panel/users/${accessId}`)
      fetchUsers()
    } catch (err: any) {
      alert(handleApiError(err))
    }
  }

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><UserPlus className="w-5 h-5 text-primary" /> Invite Subuser</h2>
        <form onSubmit={handleInvite} className="flex flex-col gap-4 max-w-xl">
          <div>
            <label className="text-sm font-medium mb-1 block">Email or Discord ID</label>
            <Input 
              required 
              value={inviteIdentifier} 
              onChange={e => setInviteIdentifier(e.target.value)} 
              placeholder="user@example.com" 
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Permissions</label>
            <div className="grid grid-cols-2 gap-2">
              {availablePerms.map(p => (
                <label key={p.id} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${invitePerms.includes(p.id) ? 'border-primary bg-primary/10' : 'border-border/50 hover:bg-foreground/5'}`}>
                  <input type="checkbox" className="hidden" checked={invitePerms.includes(p.id)} onChange={() => togglePerm(p.id)} />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${invitePerms.includes(p.id) ? 'bg-primary border-primary' : 'border-foreground/30'}`}>
                    {invitePerms.includes(p.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm font-medium">{p.name}</span>
                </label>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={inviting} className="w-full mt-2">
            {inviting ? "Inviting..." : "Send Invite"}
          </Button>
        </form>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-background/50">
          <h2 className="font-bold flex items-center gap-2"><Users className="w-4 h-4" /> Authorized Users</h2>
        </div>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-background/20 border-b border-border/50">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Permissions</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((access, i) => (
              <tr key={i} className="border-b border-border/10">
                <td className="px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {access.user.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{access.user.username}</p>
                    <p className="text-xs text-foreground/50">{access.user.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {JSON.parse(access.permissions).map((p: string) => (
                      <span key={p} className="px-2 py-0.5 rounded text-xs font-bold bg-foreground/10 uppercase tracking-wider">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10" onClick={() => handleRemove(access.id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-foreground/50">No subusers added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
