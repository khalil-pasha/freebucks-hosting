"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ScrollText, Filter, RefreshCw } from "lucide-react"
import api from "@/lib/api"

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/core/logs')
      setLogs(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.targetId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actorId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-foreground/60 mt-1">Global audit trail of all platform actions.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-card border border-border/50 rounded-lg px-3 py-2 w-full sm:w-64">
            <Search className="w-4 h-4 text-foreground/50" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <button onClick={fetchLogs} className="p-2 bg-card border border-border/50 rounded-lg hover:bg-foreground/5 text-foreground/70" title="Refresh">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Card className="bg-card border-border/50 overflow-hidden">
        <CardHeader className="bg-background/50 border-b border-border/50 pb-4">
          <CardTitle className="text-lg flex items-center gap-2"><ScrollText className="w-5 h-5 text-primary" /> Audit Trail</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-foreground/50 uppercase bg-background/50 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Log ID</th>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Event Type</th>
                <th className="px-6 py-4 font-medium">Actor ID</th>
                <th className="px-6 py-4 font-medium w-1/3">Action Details</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                 <tr>
                   <td colSpan={6} className="px-6 py-8 text-center text-foreground/50">
                     <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                     Loading logs...
                   </td>
                 </tr>
              ) : filteredLogs.length === 0 ? (
                 <tr>
                   <td colSpan={6} className="px-6 py-8 text-center text-foreground/50">No logs found.</td>
                 </tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-foreground/5 transition-colors font-mono text-[13px]">
                  <td className="px-6 py-4 text-foreground/50">{log.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-foreground/70">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wide ${
                      log.type.includes('ADMIN') ? 'bg-red-500/20 text-red-500' :
                      log.type.includes('QUEUE') ? 'bg-orange-500/20 text-orange-500' :
                      log.type.includes('CREDIT') ? 'bg-success/20 text-success' :
                      'bg-primary/20 text-primary'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">{log.actorId || 'System'}</td>
                  <td className="px-6 py-4 text-foreground/90 font-sans">{log.action} {log.targetId ? `(Target: ${log.targetId})` : ''}</td>
                  <td className="px-6 py-4 text-foreground/50">{log.ipAddress || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
