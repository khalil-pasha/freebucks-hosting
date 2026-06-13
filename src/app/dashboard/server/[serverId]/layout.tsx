"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import api from "@/lib/api"
import { Terminal, Folder, Users, Puzzle, PlayCircle, Settings, Globe, Activity, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const ServerContext = createContext<any>(null)

export default function ServerPanelLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const serverId = params.serverId as string
  const pathname = usePathname()
  const router = useRouter()
  
  const [server, setServer] = useState<any>(null)
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const tabs = [
    { name: "Console", icon: Terminal, href: `/dashboard/server/${serverId}/console` },
    { name: "Files", icon: Folder, href: `/dashboard/server/${serverId}/files` },
    { name: "Users", icon: Users, href: `/dashboard/server/${serverId}/users` },
    { name: "Plugins", icon: Puzzle, href: `/dashboard/server/${serverId}/plugins` },
    { name: "Startup", icon: PlayCircle, href: `/dashboard/server/${serverId}/startup` },
    { name: "Settings", icon: Settings, href: `/dashboard/server/${serverId}/settings` },
    { name: "Subdomain", icon: Globe, href: `/dashboard/server/${serverId}/subdomain` },
    { name: "Activity", icon: Activity, href: `/dashboard/server/${serverId}/activity` },
  ]

  const fetchServer = async () => {
    try {
      const res = await api.get(`/servers/my-servers`)
      const s = res.data.find((x: any) => x.id === serverId)
      if (!s) {
        router.push('/dashboard/servers')
        return
      }
      setServer(s)
      
      const statusRes = await api.get(`/servers/${serverId}/panel/status`)
      setStatus(statusRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServer()
    const interval = setInterval(() => {
      api.get(`/servers/${serverId}/panel/status`).then(res => setStatus(res.data)).catch(console.error)
    }, 10000)
    return () => clearInterval(interval)
  }, [serverId])

  if (loading) return <div className="p-8 text-center animate-pulse">Loading panel...</div>

  return (
    <ServerContext.Provider value={{ server, status, refetch: fetchServer }}>
      <div className="flex flex-col h-full gap-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/servers')} className="h-8 w-8 text-foreground/60 hover:text-foreground">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">{server?.name}</h1>
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${status?.currentState === 'running' ? 'bg-success/20 text-success' : 'bg-foreground/10'}`}>
                {status?.currentState || 'offline'}
              </span>
            </div>
            <p className="text-foreground/60 font-mono text-sm ml-11">
              {server?.allocationAlias ? `${server.allocationAlias}:${server.allocationPort}` : server?.allocationIp ? `${server.allocationIp}:${server.allocationPort}` : 'Pending...'}
            </p>
          </div>
          
          <div className="flex gap-6 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-foreground/50 text-xs">CPU</span>
              <span className="font-bold">{status?.usage?.cpu?.toFixed(2) || 0}%</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-foreground/50 text-xs">RAM</span>
              <span className="font-bold">{(status?.usage?.memory_bytes / 1024 / 1024 || 0).toFixed(0)} MB</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-foreground/50 text-xs">Disk</span>
              <span className="font-bold">{(status?.usage?.disk_bytes / 1024 / 1024 || 0).toFixed(0)} MB</span>
            </div>
          </div>
        </div>

        {/* Navigation & Content Wrapper */}
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-16rem)] min-h-[600px]">
          {/* Sidebar Nav */}
          <div className="w-full lg:w-64 flex-shrink-0 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {tabs.map(tab => {
              const active = pathname === tab.href
              const Icon = tab.icon
              return (
                <Link key={tab.name} href={tab.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${active ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-foreground/5 text-foreground/70'}`}>
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </Link>
              )
            })}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-card/30 rounded-xl border border-border/50 overflow-hidden relative">
            <div className="absolute inset-0 overflow-y-auto p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </ServerContext.Provider>
  )
}
