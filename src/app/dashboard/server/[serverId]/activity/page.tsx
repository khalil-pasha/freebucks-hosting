"use client"

import { useContext, useEffect, useState } from "react"
import { ServerContext } from "../layout"
import api from "@/lib/api"
import { Activity, Clock } from "lucide-react"

export default function ActivityPage() {
  const { server } = useContext(ServerContext)
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/servers/${server.id}/panel/activity`)
      setLogs(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (server) fetchLogs()
  }, [server])

  if (loading) return null

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Activity Log</h2>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-background/20 border-b border-border/50">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Details</th>
              <th className="px-4 py-3 font-medium">IP Address</th>
              <th className="px-4 py-3 font-medium text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-b border-border/10 hover:bg-foreground/5 transition-colors">
                <td className="px-4 py-3 font-medium text-primary">{log.user.username}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-foreground/10">{log.action}</span>
                </td>
                <td className="px-4 py-3 text-foreground/70 truncate max-w-[200px]">{log.details || '-'}</td>
                <td className="px-4 py-3 text-foreground/50 font-mono text-xs">{log.ipAddress || '-'}</td>
                <td className="px-4 py-3 text-right text-foreground/50 text-xs">
                  <div className="flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> {new Date(log.createdAt).toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-foreground/50">No activity logged yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
