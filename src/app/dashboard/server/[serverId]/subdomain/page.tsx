"use client"

import { useContext, useEffect, useState } from "react"
import { ServerContext } from "../layout"
import api, { handleApiError } from "@/lib/api"
import { Globe, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SubdomainPage() {
  const { server } = useContext(ServerContext)
  const [subdomain, setSubdomain] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [requestedSub, setRequestedSub] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const fetchSubdomain = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/servers/${server.id}/panel/subdomain`)
      setSubdomain(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (server) fetchSubdomain()
  }, [server])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const regex = /^[a-z0-9]+$/
    if (!regex.test(requestedSub)) {
      alert("Subdomain can only contain lowercase letters and numbers.")
      return
    }

    try {
      setSubmitting(true)
      await api.post(`/servers/${server.id}/panel/subdomain`, {
        requestedSubdomain: requestedSub
      })
      alert("Subdomain requested successfully!")
      fetchSubdomain()
    } catch (err: any) {
      alert(handleApiError(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className="max-w-2xl flex flex-col gap-8 h-full">
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> FreeBucks Subdomain</h2>
        
        {subdomain ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-background border border-border/50 flex flex-col gap-2">
              <span className="text-sm text-foreground/60">Your current subdomain:</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold font-mono text-primary">{subdomain.subdomain}.freebucks.host</span>
              </div>
            </div>

            <div className={`p-4 rounded-lg border flex items-start gap-3 ${
              subdomain.status === 'ACTIVE' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
              subdomain.status.startsWith('FAILED') ? 'bg-red-500/10 border-red-500/30 text-red-500' :
              'bg-orange-500/10 border-orange-500/30 text-orange-500'
            }`}>
              {subdomain.status === 'ACTIVE' ? <CheckCircle2 className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
              <div>
                <p className="font-bold">
                  {subdomain.status === 'ACTIVE' ? 'DNS Active' :
                   subdomain.status.startsWith('FAILED') ? 'DNS Failed' :
                   'DNS Pending'}
                </p>
                <p className="text-sm opacity-80 mt-1">
                  {subdomain.status === 'ACTIVE' 
                    ? "Your subdomain is active. Use this address in Minecraft to connect directly to your server." 
                    : subdomain.status.startsWith('FAILED') 
                      ? subdomain.status.replace('FAILED:', 'Error:')
                      : "Your subdomain is pending DNS provisioning."}
                </p>
              </div>
            </div>

            <p className="text-sm text-foreground/50 mt-4">
              To change your subdomain, please contact support. You can only have one active subdomain per server.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-foreground/70 mb-2">Claim a free custom `.freebucks.host` subdomain for your server to make it easier for players to join.</p>
            <div>
              <label className="text-sm font-medium mb-1 block">Desired Subdomain</label>
              <div className="flex items-center">
                <Input 
                  required 
                  value={requestedSub} 
                  onChange={e => setRequestedSub(e.target.value.toLowerCase())} 
                  placeholder="myserver" 
                  className="rounded-r-none font-mono text-right"
                />
                <div className="bg-foreground/5 border border-l-0 border-border/50 px-4 h-10 flex items-center rounded-r-md font-mono text-foreground/60">
                  .freebucks.host
                </div>
              </div>
              <p className="text-xs text-foreground/50 mt-2">Only lowercase letters and numbers allowed. No spaces or symbols.</p>
            </div>
            <Button type="submit" disabled={submitting} className="mt-2 w-full md:w-auto">
              {submitting ? "Claiming..." : "Claim Subdomain"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
