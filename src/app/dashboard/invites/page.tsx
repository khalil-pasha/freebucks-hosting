"use client"

import { useEffect, useState } from "react"
import api, { handleApiError } from "@/lib/api"
import { Mail, Check, X, Server } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InvitesPage() {
  const [invites, setInvites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInvites = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get('/servers/invites')
      setInvites(res.data)
    } catch (err: any) {
      console.error(err)
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvites()
  }, [])

  const handleAction = async (inviteId: string, action: 'accept' | 'decline') => {
    try {
      await api.post(`/servers/invites/${inviteId}/${action}`)
      fetchInvites()
      if (action === 'accept') {
        alert("Invite accepted! You can now access the server.")
      }
    } catch (err: any) {
      alert(handleApiError(err))
    }
  }

  if (loading) return <div className="p-8 text-center text-foreground/50">Loading invites...</div>

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 h-full">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center flex flex-col items-center">
          <X className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-500 mb-2">Error loading invites</h2>
          <p className="text-red-500/80">{error}</p>
          <Button variant="outline" className="mt-4 border-red-500/30 text-red-500 hover:bg-red-500/10" onClick={fetchInvites}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Mail className="w-6 h-6 text-primary" /> Pending Invites
        </h1>
        <p className="text-foreground/60 mt-2">Manage server access invitations from other users.</p>
      </div>

      {invites.length === 0 ? (
        <div className="bg-card border border-border/50 rounded-xl p-12 text-center flex flex-col items-center">
          <Mail className="w-12 h-12 text-foreground/20 mb-4" />
          <h2 className="text-xl font-bold mb-2">No pending invites</h2>
          <p className="text-foreground/50">You don't have any pending server invitations at the moment.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {invites.map(invite => (
            <div key={invite.id} className="bg-card border border-border/50 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{invite.server.name}</h3>
                  <p className="text-sm text-foreground/60 mb-2">
                    Invited by <span className="font-medium text-foreground">{invite.server.user.username}</span>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {JSON.parse(invite.permissions).map((p: string) => (
                      <span key={p} className="px-2 py-0.5 rounded text-xs font-bold bg-foreground/5 uppercase tracking-wider">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <Button variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10" onClick={() => handleAction(invite.id, 'decline')}>
                  <X className="w-4 h-4 mr-2" /> Decline
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleAction(invite.id, 'accept')}>
                  <Check className="w-4 h-4 mr-2" /> Accept
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
