"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, PlayCircle, PauseCircle, FastForward, ArrowUp, ArrowDown, Trash2, RefreshCw } from "lucide-react"
import api from "@/lib/api"

export default function AdminQueuePage() {
  const [isQueuePaused, setIsQueuePaused] = React.useState(false)
  const [startingServers, setStartingServers] = React.useState<any[]>([])
  const [waitingQueue, setWaitingQueue] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchQueue = async () => {
    try {
      const res = await api.get('/admin/queue/active')
      // Map API response to our states
      const active = res.data.active || []
      const waiting = res.data.waiting || []
      
      setStartingServers(active)
      setWaitingQueue(waiting.map((item: any, i: number) => ({
        ...item,
        pos: i + 1,
        wait: 'Calculating...' // Can implement real wait time logic later
      })))
      setIsQueuePaused(res.data.isPaused || false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchQueue()
    const interval = setInterval(fetchQueue, 5000)
    return () => clearInterval(interval)
  }, [])

  const handlePauseResume = async () => {
    try {
      if (isQueuePaused) {
        await api.post('/admin/queue/resume')
      } else {
        await api.post('/admin/queue/pause')
      }
      setIsQueuePaused(!isQueuePaused)
      fetchQueue()
    } catch (err) {
      console.error('Failed to toggle queue pause state:', err)
      alert('Failed to toggle allocator state.')
    }
  }

  const handleAction = async (serverId: string, action: string) => {
    if (!confirm(`Are you sure you want to ${action} this server in the queue?`)) return
    try {
      await api.post(`/admin/queue/${action}`, { serverId })
      fetchQueue()
    } catch (err) {
      console.error(`Failed to ${action} server:`, err)
      alert(`Failed to ${action} server.`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Queue Manager</h1>
          <p className="text-foreground/60 mt-1">Live simulation and controls for the node allocator.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={fetchQueue}
            variant="outline" 
            className="border"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={handlePauseResume}
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
            {loading && startingServers.length === 0 ? (
              <div className="p-4 text-center text-foreground/50">Loading...</div>
            ) : startingServers.length === 0 ? (
              <div className="p-4 bg-background border border-border/50 rounded-xl text-center text-foreground/50">
                No servers currently starting.
              </div>
            ) : startingServers.map((s, i) => (
              <Card key={i} className="bg-card border-orange-500/30 overflow-hidden relative">
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-orange-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${s.progress || 50}%` }}
                />
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500 animate-spin-slow" /> {s.name || s.id}
                    </div>
                    <div className="text-xs text-foreground/50 mt-1">{s.owner || s.userId || 'Unknown'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-orange-500">{s.progress || 50}%</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="p-4 bg-background border border-border/50 rounded-xl text-center">
            <p className="text-sm text-foreground/60">Node allocator is currently <strong>{isQueuePaused ? 'paused' : 'running normally'}</strong>.</p>
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
                 {loading && waitingQueue.length === 0 ? (
                   <tr>
                     <td colSpan={4} className="px-6 py-8 text-center text-foreground/50">
                       <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                       Loading queue...
                     </td>
                   </tr>
                 ) : waitingQueue.length === 0 ? (
                   <tr>
                     <td colSpan={4} className="px-6 py-8 text-center text-foreground/50">
                       Queue is empty.
                     </td>
                   </tr>
                 ) : waitingQueue.map((item, i) => (
                   <tr key={i} className="hover:bg-foreground/5 transition-colors">
                     <td className="px-6 py-4 font-black text-lg text-foreground/30">#{item.pos}</td>
                     <td className="px-6 py-4">
                       <div className="font-bold">{item.name || item.id}</div>
                       <div className="text-xs text-foreground/50">User: {item.owner || item.userId || 'Unknown'}</div>
                     </td>
                     <td className="px-6 py-4 font-mono text-orange-400">{item.wait}</td>
                     <td className="px-6 py-4 text-right flex justify-end gap-1">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/50 hover:text-foreground" title="Move Up"><ArrowUp className="w-4 h-4" /></Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/50 hover:text-foreground" title="Move Down"><ArrowDown className="w-4 h-4" /></Button>
                       <Button variant="outline" size="icon" className="h-8 w-8 border-success/30 text-success hover:bg-success hover:text-white" title="Force Start"><FastForward className="w-4 h-4" /></Button>
                       <Button onClick={() => handleAction(item.id, 'cancel')} variant="outline" size="icon" className="h-8 w-8 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white" title="Kick from Queue"><Trash2 className="w-4 h-4" /></Button>
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
