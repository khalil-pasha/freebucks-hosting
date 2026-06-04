"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, PlayCircle, PauseCircle, FastForward, ArrowUp, ArrowDown, Trash2 } from "lucide-react"

export default function AdminQueuePage() {
  const [isQueuePaused, setIsQueuePaused] = React.useState(false)

  // Mock Starting Servers (Processing)
  const startingServers = [
    { id: "srv-002", name: "Create Modpack", owner: "MinecraftPro", progress: 85 },
    { id: "srv-010", name: "Lobby 2", owner: "ServerHost99", progress: 40 },
    { id: "srv-015", name: "Factions", owner: "PvP_Master99", progress: 12 },
  ]

  // Mock Waiting Queue
  const waitingQueue = [
    { pos: 1, name: "Pixelmon Hub", owner: "RedstoneGenius", isPremium: false, wait: "2m" },
    { pos: 2, name: "Bedwars Node 1", owner: "_NightBlade_", isPremium: false, wait: "3m" },
    { pos: 3, name: "Skyblock", owner: "BuilderBob", isPremium: false, wait: "5m" },
    { pos: 4, name: "SMP Vanilla", owner: "SteveNew", isPremium: false, wait: "7m" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Queue Manager</h1>
          <p className="text-foreground/60 mt-1">Live simulation and controls for the node allocator.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsQueuePaused(!isQueuePaused)}
            variant="outline" 
            className={`border ${isQueuePaused ? "border-success text-success hover:bg-success/10" : "border-red-500 text-red-500 hover:bg-red-500/10"}`}
          >
            {isQueuePaused ? <PlayCircle className="w-4 h-4 mr-2" /> : <PauseCircle className="w-4 h-4 mr-2" />}
            {isQueuePaused ? "Resume Allocator" : "Pause Allocator"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Processing Node (Starting) */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Currently Starting <span className="text-sm font-normal text-foreground/50">({startingServers.length}/5 capacity)</span>
          </h2>
          
          <div className="space-y-4">
            {startingServers.map((s, i) => (
              <Card key={i} className="bg-card border-orange-500/30 overflow-hidden relative">
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-orange-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${s.progress}%` }}
                />
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500 animate-spin-slow" /> {s.name}
                    </div>
                    <div className="text-xs text-foreground/50 mt-1">{s.owner}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-orange-500">{s.progress}%</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="p-4 bg-background border border-border/50 rounded-xl text-center">
            <p className="text-sm text-foreground/60">Node allocator is currently <strong>running normally</strong>.</p>
          </div>
        </div>

        {/* Waiting Queue Table */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold">Waiting Queue</h2>
          
          <Card className="bg-card border-border/50 overflow-hidden">
             <table className="w-full text-sm text-left">
               <thead className="text-xs text-foreground/50 uppercase bg-background/50 border-b border-border/50">
                 <tr>
                   <th className="px-6 py-4 font-medium w-16">Pos</th>
                   <th className="px-6 py-4 font-medium">Server & Owner</th>
                   <th className="px-6 py-4 font-medium">Wait Time</th>
                   <th className="px-6 py-4 font-medium text-right">Controls</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                 {waitingQueue.map((item, i) => (
                   <tr key={i} className="hover:bg-foreground/5 transition-colors">
                     <td className="px-6 py-4 font-black text-lg text-foreground/30">#{item.pos}</td>
                     <td className="px-6 py-4">
                       <div className="font-bold">{item.name}</div>
                       <div className="text-xs text-foreground/50">User: {item.owner}</div>
                     </td>
                     <td className="px-6 py-4 font-mono text-orange-400">{item.wait}</td>
                     <td className="px-6 py-4 text-right flex justify-end gap-1">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/50 hover:text-foreground" title="Move Up"><ArrowUp className="w-4 h-4" /></Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/50 hover:text-foreground" title="Move Down"><ArrowDown className="w-4 h-4" /></Button>
                       <Button variant="outline" size="icon" className="h-8 w-8 border-success/30 text-success hover:bg-success hover:text-white" title="Force Start"><FastForward className="w-4 h-4" /></Button>
                       <Button variant="outline" size="icon" className="h-8 w-8 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white" title="Kick from Queue"><Trash2 className="w-4 h-4" /></Button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </Card>
        </div>
      </div>
    </div>
  )
}
