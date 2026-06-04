"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Power, Trash2, RefreshCw, StopCircle } from "lucide-react"

const servers = [
  { id: "srv-001", name: "Survival SMP", owner: "_NightBlade_", ram: "6GB", location: "Mumbai, India", status: "Online", burn: "6.0", uptime: "4d 12h" },
  { id: "srv-002", name: "Create Modpack", owner: "MinecraftPro", ram: "8GB Premium", location: "Mumbai, India", status: "Starting", burn: "Free", uptime: "—" },
  { id: "srv-003", name: "Test Lobby", owner: "_NightBlade_", ram: "2GB", location: "Mumbai, India", status: "Offline", burn: "1.5", uptime: "—" },
  { id: "srv-004", name: "Pixelmon Hub", owner: "RedstoneGenius", ram: "4GB", location: "Mumbai, India", status: "In Queue", burn: "3.0", uptime: "—" },
  { id: "srv-005", name: "Vanilla 1.20", owner: "PvP_Master99", ram: "2GB", location: "Mumbai, India", status: "Online", burn: "1.5", uptime: "12d 1h" },
]

export default function AdminServersPage() {
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
                <th className="px-6 py-4 font-medium">Uptime</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {servers.map((server) => (
                <tr key={server.id} className="hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold">{server.name}</div>
                    <div className="font-mono text-[10px] text-foreground/50">{server.id}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">{server.owner}</td>
                  <td className="px-6 py-4">
                    <div>{server.ram}</div>
                    <div className="text-xs text-foreground/50">{server.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide ${
                      server.status === "Online" ? "text-success" :
                      server.status === "Offline" ? "text-foreground/50" :
                      server.status === "Starting" ? "text-orange-500 animate-pulse" :
                      "text-yellow-500"
                    }`}>
                      {server.status === "Online" && <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_10px_#00AA00]" />}
                      {server.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">{server.burn} cr/hr</td>
                  <td className="px-6 py-4 text-foreground/70">{server.uptime}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {server.status === 'Offline' ? (
                       <Button variant="outline" size="sm" className="h-8 border-success/50 text-success hover:bg-success/10"><Power className="w-3 h-3 mr-1"/> Start</Button>
                    ) : (
                       <Button variant="outline" size="sm" className="h-8 border-red-500/50 text-red-500 hover:bg-red-500/10"><StopCircle className="w-3 h-3 mr-1"/> Stop</Button>
                    )}
                    <Button variant="outline" size="icon" className="h-8 w-8"><RefreshCw className="w-3 h-3" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3" /></Button>
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
