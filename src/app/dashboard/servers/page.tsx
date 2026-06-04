"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Server, Power, RefreshCw, Zap, Clock, Coins, MapPin, CheckCircle2, ShieldAlert, Activity } from "lucide-react"

const servers = [
  {
    id: "fb-192a",
    name: "Survival SMP",
    status: "Online",
    ip: "smp.freebucks.host",
    ram: "6GB",
    cost: "6 credits/hr",
    location: "Mumbai, India",
    uptime: "4d 12h 30m",
  },
  {
    id: "fb-88bb",
    name: "Modded Create Network",
    status: "In Queue",
    ip: "create.freebucks.host",
    ram: "8GB Premium",
    cost: "Free (Premium)",
    location: "Mumbai, India",
    queuePos: "#5",
    queueTime: "2m 30s",
  },
  {
    id: "fb-33cc",
    name: "Test Lobby",
    status: "Offline",
    ip: "lobby.freebucks.host",
    ram: "2GB",
    cost: "1.5 credits/hr",
    location: "Mumbai, India",
  }
]

export default function ServersPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Online": return "text-success bg-success/10 border-success/20";
      case "Offline": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "In Queue": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "Starting": return "text-primary bg-primary/10 border-primary/20";
      default: return "text-foreground bg-background";
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Servers</h1>
          <p className="text-foreground/60 mt-1">Manage your instances and hardware resources.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" /> Create Server
        </Button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 xl:grid-cols-2 gap-6"
      >
        {servers.map((server, i) => (
          <motion.div key={server.id} variants={itemVariants}>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 relative overflow-hidden flex flex-col h-full hover:border-primary/30 transition-colors">
              {server.ram.includes("Premium") && (
                <div className="absolute top-0 left-0 w-full h-1 bg-[#FFD700]" />
              )}
              
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Server className="w-5 h-5 text-primary" /> {server.name}
                    </CardTitle>
                    <p className="text-sm font-mono text-foreground/50 mt-1">{server.id}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(server.status)}`}>
                    {server.status}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4">
                {/* IP Bar */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                  <span className="font-mono text-sm text-primary">{server.ip}</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Copy IP</Button>
                </div>

                {/* Queue Timer display if In Queue */}
                {server.status === "In Queue" && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 flex items-center justify-between animate-pulse">
                     <div className="flex items-center gap-3">
                       <Clock className="w-5 h-5 text-orange-500" />
                       <div>
                         <p className="text-sm font-bold text-orange-500">Starting...</p>
                         <p className="text-xs text-orange-500/80">Queue Position: {server.queuePos}</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-xs text-orange-500/80 mb-1">Estimated Wait</p>
                       <p className="text-lg font-mono font-bold text-orange-500">{server.queueTime}</p>
                     </div>
                  </div>
                )}

                {/* Hardware Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/50 mb-1 flex items-center gap-1"><Zap className="w-3 h-3"/> RAM</span>
                    <span className={`text-sm font-bold ${server.ram.includes("Premium") ? 'text-[#FFD700]' : 'text-foreground'}`}>{server.ram}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/50 mb-1 flex items-center gap-1"><Coins className="w-3 h-3"/> Cost</span>
                    <span className="text-sm font-bold text-success">{server.cost}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/50 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Node</span>
                    <span className="text-sm font-bold truncate">{server.location}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/50 mb-1 flex items-center gap-1"><Activity className="w-3 h-3"/> Uptime</span>
                    <span className="text-sm font-bold">{server.uptime || "—"}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t border-border/50 bg-card/30 flex flex-wrap gap-2">
                {server.status === "Offline" ? (
                  <Button size="sm" className="bg-success hover:bg-success/90 text-white shadow-lg shadow-success/20 flex-1 sm:flex-none">
                    <Power className="w-4 h-4 mr-2" /> Start
                  </Button>
                ) : (
                  <>
                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white flex-1 sm:flex-none">
                      <Power className="w-4 h-4 mr-2" /> Stop
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none border-primary/50 text-primary hover:bg-primary/10">
                      <RefreshCw className="w-4 h-4 mr-2" /> Restart
                    </Button>
                  </>
                )}
                <Button size="sm" variant="secondary" className="flex-1 sm:flex-none ml-auto">
                  <Zap className="w-4 h-4 mr-2" /> Upgrade
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function Plus(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
