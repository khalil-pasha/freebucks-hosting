"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Power, Trash2, RefreshCw, StopCircle } from "lucide-react"
import api from "@/lib/api"

export default function AdminServersPage() {
  const [servers, setServers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchServers = async () => {
    try {
      const res = await api.get('/admin/core/servers')
      setServers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServers()
  }, [])

  const handleAction = async (serverId: string, action: 'stop' | 'suspend' | 'delete') => {
    if (!confirm(`Are you sure you want to ${action} this server?`)) return;
    try {
      let endpoint = '';
      if (action === 'stop') endpoint = '/admin/servers/force-stop';
      if (action === 'suspend') endpoint = '/admin/servers/suspend';
      if (action === 'delete') endpoint = '/admin/servers/delete';
      
      await api.post(endpoint, { serverId });
      fetchServers();
    } catch (err) {
      console.error(err)
      alert(`Failed to ${action} server.`)
    }
  }

  const filteredServers = servers.filter(server => 
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    server.id.includes(searchTerm) ||
    server.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Servers Management</h1>
          <p className="text-foreground/60 mt-1">Control all running instances on the network.</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border/50 rounded-lg px-3 py-2 w-full sm:w-64">
          <Search className="w-4 h-4 text-foreground/50" />
          <input 
            type="text" 
            placeholder="Search servers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
      </div>

      <Card className="bg-card border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-foreground/50 uppercase bg-background/50 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Server ID & Name</th>
                <th className="px-6 py-4 font-medium">Owner</th>
                <th className="px-6 py-4 font-medium">RAM / Location</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Burn Rate</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-foreground/50">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading servers...
                  </td>
                </tr>
              ) : filteredServers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-foreground/50">
                    No servers found.
                  </td>
                </tr>
              ) : filteredServers.map((server) => (
                <tr key={server.id} className="hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold">{server.name}</div>
                    <div className="font-mono text-[10px] text-foreground/50">{server.id}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">{server.user?.username || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <div>{server.ramGB}GB</div>
                    <div className="text-xs text-foreground/50">{server.nodeLocation}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide ${
                      server.status === "RUNNING" ? "text-success" :
                      server.status === "STOPPED" ? "text-foreground/50" :
                      server.status === "STARTING" ? "text-orange-500 animate-pulse" :
                      "text-yellow-500"
                    }`}>
                      {server.status === "RUNNING" && <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_10px_#00AA00]" />}
                      {server.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">{server.costPerHour} cr/hr</td>
                  <td className="px-6 py-4 text-foreground/70">{new Date(server.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {server.status === 'RUNNING' && (
                       <Button onClick={() => handleAction(server.id, 'stop')} variant="outline" size="sm" className="h-8 border-red-500/50 text-red-500 hover:bg-red-500/10"><StopCircle className="w-3 h-3 mr-1"/> Force Stop</Button>
                    )}
                    <Button onClick={() => handleAction(server.id, 'suspend')} variant="outline" size="icon" className="h-8 w-8 text-orange-500 hover:text-white hover:bg-orange-500" title="Suspend"><Power className="w-3 h-3" /></Button>
                    <Button onClick={() => handleAction(server.id, 'delete')} variant="outline" size="icon" className="h-8 w-8 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white" title="Delete"><Trash2 className="w-3 h-3" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
