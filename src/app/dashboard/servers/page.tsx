"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Server, Power, RefreshCw, Zap, Clock, Coins, MapPin, Activity, ExternalLink, X, Cpu, HardDrive, ShieldAlert } from "lucide-react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api, { handleApiError } from "@/lib/api"
import { useAuth } from "@/components/AuthProvider"

export default function ServersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [servers, setServers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modal States
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  
  // Custom Plan States
  const [customRAM, setCustomRAM] = useState(1)
  const [customCPU, setCustomCPU] = useState(50)
  const [customDisk, setCustomDisk] = useState(5)

  // Form State
  const [formData, setFormData] = useState({
    serverName: '',
    email: user?.email || '',
    username: user?.username || '',
    firstName: '',
    lastName: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchServers = async () => {
    try {
      const res = await api.get('/servers/my-servers')
      setServers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServers()
    const interval = setInterval(fetchServers, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleAction = async (action: 'start-server' | 'restart-server' | 'cancel', serverId: string) => {
    try {
      await api.post(`/queue/${action}`, { serverId })
      fetchServers()
    } catch (err: any) {
      alert(handleApiError(err))
    }
  }

  const handlePlanSelect = (plan: any) => {
    if (plan.isPremium) {
      router.push('/dashboard/premium')
      return
    }
    setSelectedPlan(plan)
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload: any = {
        name: formData.serverName,
        ramGB: selectedPlan.ram,
        cpu: selectedPlan.cpu,
        disk: selectedPlan.disk,
      }

      if (!user?.pterodactylUserId) {
        payload.pterodactyl = {
          email: formData.email,
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password
        }
      }

      await api.post('/servers/create', payload)
      fetchServers()
      setIsPlanModalOpen(false)
      setSelectedPlan(null)
    } catch (err: any) {
      alert(handleApiError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "RUNNING": return "text-success bg-success/10 border-success/20";
      case "STOPPED": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "STARTING":
      case "RESTARTING": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      default: return "text-foreground bg-background";
    }
  }

  const fixedPlans = [
    { name: "Free Starter", ram: 2, cpu: 100, disk: 5, cost: "1.5 credits/hr", isPremium: false },
    { name: "Advanced", ram: 4, cpu: 150, disk: 10, cost: "3 credits/hr", isPremium: false },
    { name: "Pro", ram: 6, cpu: 200, disk: 15, cost: "6 credits/hr", isPremium: false },
    { name: "Premium", ram: 8, cpu: 300, disk: 30, cost: "₹499/month", isPremium: true, desc: "Dedicated CPU & NVMe" },
  ]

  const customPrice = (customRAM * 20) + ((customCPU / 50) * 30) + ((customDisk / 5) * 10)

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Servers</h1>
          <p className="text-foreground/60 mt-1">Manage your instances and hardware resources.</p>
        </div>
        <Button onClick={() => setIsPlanModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" /> New Server
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {servers.map((server, i) => (
          <motion.div key={server.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 relative overflow-hidden flex flex-col h-full hover:border-primary/30 transition-colors">
              {server.costPerHour >= 8 && (
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
                <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                  <span className="font-mono text-sm text-primary">{server.pterodactylIdentifier ? `${server.nodeLocation}-${server.pterodactylIdentifier.substring(0,8)}.freebucks.host` : 'Pending...'}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Copy IP</Button>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs border-primary/50 text-primary hover:bg-primary/10" onClick={() => window.open('https://panel.freebucks.host', '_blank')}>
                      <ExternalLink className="w-3 h-3 mr-1" /> Panel Access
                    </Button>
                  </div>
                </div>

                {(server.status === "STARTING" || server.status === "RESTARTING") && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 flex items-center justify-between animate-pulse">
                     <div className="flex items-center gap-3">
                       <Clock className="w-5 h-5 text-orange-500" />
                       <div>
                         <p className="text-sm font-bold text-orange-500">In Queue...</p>
                         <p className="text-xs text-orange-500/80">Wait for your turn</p>
                       </div>
                     </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/50 mb-1 flex items-center gap-1"><Zap className="w-3 h-3"/> RAM</span>
                    <span className={`text-sm font-bold ${server.costPerHour >= 8 ? 'text-[#FFD700]' : 'text-foreground'}`}>{server.ramGB}GB</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/50 mb-1 flex items-center gap-1"><Cpu className="w-3 h-3"/> CPU</span>
                    <span className="text-sm font-bold">{server.cpu}%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/50 mb-1 flex items-center gap-1"><HardDrive className="w-3 h-3"/> Disk</span>
                    <span className="text-sm font-bold">{server.disk}GB</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/50 mb-1 flex items-center gap-1"><Coins className="w-3 h-3"/> Cost</span>
                    <span className="text-sm font-bold text-success">{server.costPerHour}/hr</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t border-border/50 bg-card/30 flex flex-wrap gap-2">
                {server.status === "STOPPED" ? (
                  <Button onClick={() => handleAction('start-server', server.id)} size="sm" className="bg-success hover:bg-success/90 text-white shadow-lg shadow-success/20 flex-1 sm:flex-none">
                    <Power className="w-4 h-4 mr-2" /> Start
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => handleAction('cancel', server.id)} size="sm" className="bg-red-500 hover:bg-red-600 text-white flex-1 sm:flex-none">
                      <Power className="w-4 h-4 mr-2" /> Stop
                    </Button>
                    <Button onClick={() => handleAction('restart-server', server.id)} size="sm" variant="outline" className="flex-1 sm:flex-none border-primary/50 text-primary hover:bg-primary/10">
                      <RefreshCw className="w-4 h-4 mr-2" /> Restart
                    </Button>
                  </>
                )}
                <Button size="sm" variant="secondary" className="flex-1 sm:flex-none ml-auto" onClick={() => router.push('/dashboard/premium')}>
                  <Zap className="w-4 h-4 mr-2" /> Upgrade
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Plan Selection Modal */}
      <AnimatePresence>
        {isPlanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border/50 rounded-xl w-full max-w-5xl shadow-2xl relative my-8"
            >
              <Button variant="ghost" size="icon" className="absolute right-4 top-4 z-10" onClick={() => { setIsPlanModalOpen(false); setSelectedPlan(null) }}>
                <X className="w-5 h-5" />
              </Button>

              <div className="p-6 sm:p-8">
                {!selectedPlan ? (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold tracking-tight">Choose Your Plan</h2>
                      <p className="text-foreground/60 mt-2">Deploy your Minecraft server instantly.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                      {fixedPlans.map((plan, i) => (
                        <Card key={i} className={`relative flex flex-col ${plan.isPremium ? 'border-[#FFD700]/50 shadow-[0_0_30px_rgba(255,215,0,0.1)]' : 'border-border/50 hover:border-primary/50'} transition-all`}>
                          {plan.isPremium && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#FFD700] text-black text-xs font-bold rounded-full">BEST VALUE</div>}
                          <CardHeader className="text-center pb-2">
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <CardDescription className="text-2xl font-bold text-foreground mt-2">{plan.cost}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col gap-3 py-4 text-sm text-foreground/80">
                            <div className="flex justify-between border-b border-border/50 pb-2"><span>RAM</span><span className="font-bold text-foreground">{plan.ram} GB</span></div>
                            <div className="flex justify-between border-b border-border/50 pb-2"><span>CPU</span><span className="font-bold text-foreground">{plan.cpu}%</span></div>
                            <div className="flex justify-between pb-2"><span>Disk</span><span className="font-bold text-foreground">{plan.disk} GB</span></div>
                            {plan.desc && <div className="text-[#FFD700] font-semibold text-center mt-2">{plan.desc}</div>}
                          </CardContent>
                          <CardFooter>
                            <Button 
                              onClick={() => handlePlanSelect(plan)}
                              className={`w-full ${plan.isPremium ? 'bg-[#FFD700] hover:bg-[#FFD700]/90 text-black' : 'bg-primary hover:bg-primary/90 text-white'}`}
                            >
                              {plan.isPremium ? 'Buy Premium' : 'Deploy Server'}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>

                    <div className="mt-8 p-6 bg-background rounded-xl border border-border/50 shadow-inner">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Zap className="text-primary w-5 h-5"/> Custom Plan Builder</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                          <label className="text-sm font-medium flex justify-between mb-2">RAM <span className="text-primary">{customRAM} GB</span></label>
                          <input type="range" min="1" max="32" step="1" value={customRAM} onChange={(e) => setCustomRAM(Number(e.target.value))} className="w-full accent-primary" />
                        </div>
                        <div>
                          <label className="text-sm font-medium flex justify-between mb-2">CPU <span className="text-primary">{customCPU}%</span></label>
                          <input type="range" min="50" max="800" step="50" value={customCPU} onChange={(e) => setCustomCPU(Number(e.target.value))} className="w-full accent-primary" />
                        </div>
                        <div>
                          <label className="text-sm font-medium flex justify-between mb-2">Disk <span className="text-primary">{customDisk} GB</span></label>
                          <input type="range" min="5" max="100" step="5" value={customDisk} onChange={(e) => setCustomDisk(Number(e.target.value))} className="w-full accent-primary" />
                        </div>
                      </div>
                      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between p-4 bg-card/50 rounded-lg border border-border/50">
                        <div>
                          <p className="text-sm text-foreground/60">Calculated Price</p>
                          <p className="text-3xl font-bold text-foreground">₹{customPrice}<span className="text-lg text-foreground/50 font-normal">/month</span></p>
                        </div>
                        <Button className="mt-4 sm:mt-0 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-8" onClick={() => router.push('/dashboard/premium')}>
                          Buy Custom Plan
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleCreateSubmit} className="max-w-xl mx-auto py-4">
                    <Button type="button" variant="ghost" className="mb-6 -ml-4 text-foreground/60 hover:text-foreground" onClick={() => setSelectedPlan(null)}>
                      ← Back to Plans
                    </Button>
                    
                    <h2 className="text-2xl font-bold mb-2">Deploy {selectedPlan.name}</h2>
                    <p className="text-foreground/60 mb-6">Complete the setup to provision your server.</p>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Server Name</label>
                        <Input required value={formData.serverName} onChange={e => setFormData({...formData, serverName: e.target.value})} placeholder="My Awesome Server" />
                      </div>

                      {!user?.pterodactylUserId && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-4 mt-6">
                          <h3 className="font-semibold text-primary flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Game Panel Account Setup</h3>
                          <p className="text-xs text-foreground/60">Since this is your first server, we need to create an account for you on the game panel (Pterodactyl).</p>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-medium mb-1 block">First Name</label>
                              <Input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="John" />
                            </div>
                            <div>
                              <label className="text-xs font-medium mb-1 block">Last Name</label>
                              <Input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Doe" />
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-xs font-medium mb-1 block">Username</label>
                            <Input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="johndoe" />
                          </div>
                          
                          <div>
                            <label className="text-xs font-medium mb-1 block">Email</label>
                            <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                          </div>

                          <div>
                            <label className="text-xs font-medium mb-1 block">Panel Password</label>
                            <Input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Min 8 characters" minLength={8} />
                          </div>
                        </div>
                      )}

                      <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white mt-8 h-12 text-lg">
                        {isSubmitting ? "Deploying..." : "Deploy Server"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
