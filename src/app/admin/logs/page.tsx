"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ScrollText, Filter } from "lucide-react"

const logs = [
  { id: "L-9921", time: "2026-06-03 10:22:15", type: "ADMIN_ACTION", actor: "SuperAdmin", target: "_NightBlade_", action: "Killed stuck server process & granted 5 Credits", ip: "192.168.1.1" },
  { id: "L-9920", time: "2026-06-03 10:15:02", type: "QUEUE_EVENT", actor: "System", target: "Node-Mumbai-03", action: "Node locked up due to IO wait", ip: "Internal" },
  { id: "L-9919", time: "2026-06-03 10:12:44", type: "CREDIT_GRANT", actor: "System", target: "PvP_Master99", action: "Hourly claim (+1.5 Credits)", ip: "Internal" },
  { id: "L-9918", time: "2026-06-03 09:55:10", type: "VOUCHER_CLAIM", actor: "SteveNew", target: "DISCORD10K", action: "Successfully claimed voucher (+250 Credits)", ip: "45.22.11.9" },
  { id: "L-9917", time: "2026-06-03 09:30:00", type: "SERVER_START", actor: "MinecraftPro", target: "srv-002", action: "Started server Create Modpack", ip: "104.28.1.1" },
  { id: "L-9916", time: "2026-06-03 09:00:05", type: "ADMIN_LOGIN", actor: "SuperAdmin", target: "System", action: "Successful admin dashboard authentication", ip: "192.168.1.1" },
  { id: "L-9915", time: "2026-06-03 08:45:22", type: "USER_BAN", actor: "SupportMod", target: "Scammer123", action: "Banned user for abusing referral system", ip: "10.0.0.5" },
]

export default function AdminLogsPage() {
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
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <button className="p-2 bg-card border border-border/50 rounded-lg hover:bg-foreground/5 text-foreground/70">
            <Filter className="w-5 h-5" />
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
                <th className="px-6 py-4 font-medium">Actor</th>
                <th className="px-6 py-4 font-medium w-1/3">Action Details</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-foreground/5 transition-colors font-mono text-[13px]">
                  <td className="px-6 py-4 text-foreground/50">{log.id}</td>
                  <td className="px-6 py-4 text-foreground/70">{log.time}</td>
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
                  <td className="px-6 py-4 font-bold">{log.actor}</td>
                  <td className="px-6 py-4 text-foreground/90 font-sans">{log.action}</td>
                  <td className="px-6 py-4 text-foreground/50">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
