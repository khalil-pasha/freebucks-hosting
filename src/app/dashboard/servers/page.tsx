"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Server, Power, RefreshCw, Zap, Clock, Coins, MapPin, Activity, ExternalLink, X, Cpu, HardDrive, ShieldAlert, Settings } from "lucide-react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import api, { handleApiError } from "@/lib/api"
import { useAuth } from "@/components/AuthProvider"

export default function ServersPage() {
  const { user, loading: authLoading, refetchUser } = useAuth()
  const router = useRouter()
  const [servers, setServers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [startingServers, setStartingServers] = useState<Record<string, { startedAt: number, isStarting: boolean }>>({})
  const [now, setNow] = useState(Date.now())
  const searchParams = useSearchParams()

  // Modal States
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [upgradeTarget, setUpgradeTarget] = useState<any>(null)
  
  // Rates State
  const [serverRates, setServerRates] = useState({
    serverRate2GB: 1.5,
    serverRate4GB: 3,
    serverRate6GB: 6
  })
  
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
    password: '',
    selectedEgg: 'paper'
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

  const fetchRates = async () => {
    try {
      const res = await api.get('/servers/rates')
      if (res.data) {
        setServerRates({
          serverRate2GB: res.data.serverRate2GB ?? 1.5,
          serverRate4GB: res.data.serverRate4GB ?? 3,
          serverRate6GB: res.data.serverRate6GB ?? 6
        })
      }
    } catch (err) {
      console.error('Failed to load server rates', err)
    }
  }

  useEffect(() => {
    fetchServers()
    fetchRates()
    const interval = setInterval(fetchServers, 3000)
    
    if (searchParams.get('premium_success') === '1') {
      setToastMessage("Premium activated successfully. You can now create premium servers.")
      setTimeout(() => setToastMessage(null), 5000)
      // Cleanup URL
      const url = new URL(window.location.href)
      url.searchParams.delete('premium_success')
      window.history.replaceState({}, '', url.toString())
    }
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setStartingServers(prev => {
      const newState = { ...prev }
      let changed = false
      servers.forEach(s => {
        const isRunning = s.status === 'RUNNING' || s.status === 'running'
        const local = newState[s.id]
        
        if (isRunning && local?.isStarting) {
          setToastMessage("Server started successfully")
          setTimeout(() => setToastMessage(null), 4000)
          delete newState[s.id]
          changed = true
        }
      })
      return changed ? newState : prev
    })
  }, [servers])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const handleAction = async (action: 'start-server' | 'restart-server' | 'cancel', serverId: string) => {
    try {
      setActionLoading(serverId)
      
      let powerAction = ''
      if (action === 'start-server') powerAction = 'start'
      else if (action === 'restart-server') powerAction = 'restart'
      else if (action === 'cancel') powerAction = 'stop'

      // Instantly trigger local UI state
      if (action === 'start-server' || action === 'restart-server') {
        setStartingServers(prev => ({ 
          ...prev, 
          [serverId]: { startedAt: Date.now(), isStarting: true } 
        }))
        // Optimistically update the servers array to prevent stale flashes
        setServers(prev => prev.map(s => s.id === serverId ? { ...s, status: 'STARTING' } : s))
      } else if (action === 'cancel') {
        setStartingServers(prev => {
          const newState = { ...prev }
          delete newState[serverId]
          return newState
        })
      }
      
      await api.post(`/servers/${serverId}/panel/power`, { action: powerAction })
      
      // Update local state and restart polling immediately
      fetchServers()
      if (powerAction === 'start' || powerAction === 'restart') {
        refetchUser()
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || handleApiError(err) || 'Failed to execute power action'
      alert(`Error: ${errorMsg}`)
      
      // Revert optimistic UI state on failure
      setStartingServers(prev => {
        const newState = { ...prev }
        delete newState[serverId]
        return newState
      })
      fetchServers()
    } finally {
      setActionLoading(null)
    }
  }

  const handlePlanSelect = (plan: any) => {
    if (plan.isPremium) {
      handlePremiumPurchase()
      return
    }
    setSelectedPlan(plan)
  }

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false);
        return;
      }
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePremiumPurchase = async () => {
    const token = localStorage.getItem('freebucks_token') || localStorage.getItem('token') || localStorage.getItem('authToken');
    const manualLogout = localStorage.getItem('freebucks_manual_logout');
    
    console.log("[PaymentAuth] user", !!user);
    console.log("[PaymentAuth] token exists", !!token);
    console.log("[PaymentAuth] authLoading", authLoading);

    if (manualLogout === 'true' || !token) {
      router.push('/login?redirect=/dashboard/servers');
      return;
    }

    if (authLoading) {
      return;
    }

    console.log("[Dashboard Premium] Buy clicked");
    if (!user) {
      router.push('/login?redirect=/dashboard/servers');
      return;
    }

    try {
      setLoading(true);
      
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay failed to load. Please refresh and try again.");
        setLoading(false);
        return;
      }

      console.log('[Dashboard Premium] create-order called');
      let res;
      try {
        res = await api.post('/premium/create-order', {
          plan: 'premium'
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (err: any) {
        console.error('[ServersPage] premium create-order API failed:', err);
        const errorMsg = err.response?.data?.error || err.response?.data || handleApiError(err) || 'Failed to initialize payment';
        alert(`Payment initialization failed: ${errorMsg}`);
        setLoading(false);
        return;
      }
      
      const { id, amount, currency } = res.data;

      if (!id || !amount) {
        alert('Received invalid payment data from server. Please try again.');
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "FreeBucks Hosting",
        description: "Premium Minecraft Server Plan",
        order_id: id,
        handler: async function (response: any) {
          try {
            await api.post('/premium/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setToastMessage("Premium activated successfully!");
            setTimeout(() => setToastMessage(null), 5000);
            setIsPlanModalOpen(false);
            await refetchUser();
          } catch (err: any) {
            alert(handleApiError(err) || 'Payment verification failed');
          }
        },
        prefill: {
          name: user.username,
          email: user.email,
        },
        theme: {
          color: "#3b82f6"
        },
        modal: {
          ondismiss: function() {
            alert("Payment cancelled. You can try again.");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
      console.log("[Dashboard Premium] Razorpay opening", amount);
      rzp.open();
    } catch (err: any) {
      alert(handleApiError(err) || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomPlanPurchase = async () => {
    const token = localStorage.getItem('freebucks_token') || localStorage.getItem('token') || localStorage.getItem('authToken');
    const manualLogout = localStorage.getItem('freebucks_manual_logout');
    
    console.log("[PaymentAuth] user", !!user);
    console.log("[PaymentAuth] token exists", !!token);
    console.log("[PaymentAuth] authLoading", authLoading);

    if (manualLogout === 'true' || !token) {
      router.push('/login?redirect=/dashboard/servers');
      return;
    }

    if (authLoading) {
      return;
    }

    console.log("[CustomPlan] Buy clicked", { ram: customRAM, cpu: customCPU, disk: customDisk, calculatedPrice: customPrice });
    if (!user) {
      router.push('/login?redirect=/dashboard/servers');
      return;
    }

    try {
      setLoading(true);
      
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay failed to load. Please refresh and try again.");
        setLoading(false);
        return;
      }

      console.log('[CustomPlan] create-order called');
      let res;
      try {
        res = await api.post('/premium/create-order', {
          plan: 'custom',
          ram: customRAM,
          cpu: customCPU,
          disk: customDisk
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (err: any) {
        console.error('[ServersPage] create-order API failed:', err);
        const errorMsg = err.response?.data?.error || err.response?.data || handleApiError(err) || 'Failed to initialize payment';
        alert(`Payment initialization failed: ${errorMsg}`);
        setLoading(false);
        return;
      }
      
      const { id, amount, currency } = res.data;

      if (!id || !amount) {
        alert('Received invalid payment data from server. Please try again.');
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "FreeBucks Hosting",
        description: `Custom Plan (${customRAM}GB RAM, ${customCPU}% CPU, ${customDisk}GB Disk)`,
        order_id: id,
        handler: async function (response: any) {
          try {
            await api.post('/premium/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setToastMessage("Custom Plan payment successful!");
            setTimeout(() => setToastMessage(null), 5000);
            setIsPlanModalOpen(false);
            await refetchUser();
          } catch (err: any) {
            alert(handleApiError(err) || 'Payment verification failed');
          }
        },
        prefill: {
          name: user.username,
          email: user.email,
        },
        theme: {
          color: "#3b82f6"
        },
        modal: {
          ondismiss: function() {
            alert("Payment cancelled. You can try again.");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
      console.log("[CustomPlan] Razorpay opening", amount);
      rzp.open();
    } catch (err: any) {
      alert(handleApiError(err) || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload: any = {
        name: formData.serverName,
        ramGB: selectedPlan.ram,
        cpu: selectedPlan.cpu,
        disk: selectedPlan.disk,
        selectedEgg: formData.selectedEgg,
      }

      if (upgradeTarget) {
        await api.patch(`/servers/${upgradeTarget.id}/upgrade`, payload)
        alert("Server upgraded successfully!")
      } else {
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
      }
      
      await refetchUser()
      fetchServers()
      setIsPlanModalOpen(false)
      setSelectedPlan(null)
      setUpgradeTarget(null)
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
    { name: "Free Starter", ram: 2, cpu: 100, disk: 5, cost: `${serverRates.serverRate2GB} credits/hr`, isPremium: false },
    { name: "Advanced", ram: 4, cpu: 150, disk: 10, cost: `${serverRates.serverRate4GB} credits/hr`, isPremium: false },
    { name: "Pro", ram: 6, cpu: 200, disk: 15, cost: `${serverRates.serverRate6GB} credits/hr`, isPremium: false },
    { name: "Premium", ram: 8, cpu: 300, disk: 30, cost: "₹549/month", isPremium: true, desc: "Dedicated CPU & NVMe" },
  ]

  const customPrice = (customRAM * 30) + ((customCPU / 50) * 30) + ((customDisk / 5) * 10)

  const isPremiumExpiringSoon = () => {
    if (!user?.premiumExpiresAt) return false;
    const expiresAt = new Date(user.premiumExpiresAt);
    const now = new Date();
    const daysLeft = (expiresAt.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return daysLeft > 0 && daysLeft <= 7;
  }

  return (
    <div className="space-y-8 relative">
      {isPremiumExpiringSoon() && (
        <div className="bg-[#FFD700]/10 border border-[#FFD700]/50 rounded-lg p-4 flex items-center justify-between mb-6 shadow-lg shadow-[#FFD700]/5">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-[#FFD700] flex-shrink-0" />
            <span className="font-bold text-[#FFD700]">Your Premium Subscription is expiring in less than 7 days.</span>
          </div>
          <Button size="sm" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black" onClick={() => router.push('/pricing')}>
            Renew Now
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Servers</h1>
          <p className="text-foreground/60 mt-1">Manage your instances and hardware resources.</p>
        </div>
        <Button onClick={() => { setUpgradeTarget(null); setIsPlanModalOpen(true); }} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" /> New Server
        </Button>
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-success text-white px-4 py-3 rounded-lg shadow-xl font-bold flex items-center gap-3 z-50 border border-success/50"
          >
            <Zap className="w-5 h-5 fill-white" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {user && user.balance <= 0 && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-500 mb-6 shadow-lg shadow-red-500/5">
          <ShieldAlert className="w-6 h-6 flex-shrink-0" />
          <span className="font-bold">Your balance is 0 credits. Add credits to continue running servers.</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {servers.map((server, i) => {
          const localState = startingServers[server.id];
          const isLocallyStarting = !!localState?.isStarting;
          const displayStatus = isLocallyStarting && server.status !== 'RUNNING' ? 'STARTING' : server.status;
          const elapsedSecs = isLocallyStarting ? Math.floor((now - localState.startedAt) / 1000) : 0;
          const remainingSecs = Math.max(0, 60 - elapsedSecs);

          const finalStatus = isLocallyStarting && server.liveStatus !== 'ONLINE' ? 'STARTING' : (server.liveStatus || displayStatus);
          const finalIndicatorColor = finalStatus === 'ONLINE' ? 'bg-success' : finalStatus === 'STARTING' ? 'bg-orange-500' : 'bg-destructive';

          return (
          <motion.div key={server.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <Card onClick={() => router.push(`/dashboard/server/${server.id}/console`)} className="bg-card/50 backdrop-blur-sm border-border/50 relative overflow-hidden flex flex-col h-full hover:border-primary/30 transition-colors cursor-pointer hover:shadow-[0_0_15px_rgba(var(--primary),0.1)]">
              {server.costPerHour >= 8 && (
                <div className="absolute top-0 left-0 w-full h-1 bg-[#FFD700]" />
              )}
              
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Server className="w-5 h-5 text-primary" /> {server.name}
                      {server.isShared && (
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary/20 text-primary uppercase tracking-wider ml-2">Shared</span>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-mono text-foreground/50">{server.id}</p>
                      <span className="px-2 py-0.5 bg-foreground/5 rounded text-xs font-bold uppercase border border-border/50 text-foreground/70">
                        {server.eggType || 'PAPER'}
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(finalStatus)}`}>
                    <div className={`w-2 h-2 rounded-full ${finalIndicatorColor} animate-pulse`} />
                    {finalStatus}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                  <span className="font-mono text-sm text-primary">
                    {server.allocationAlias ? `${server.allocationAlias}:${server.allocationPort}` : server.allocationIp ? `${server.allocationIp}:${server.allocationPort}` : 'Pending...'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(server.allocationAlias ? `${server.allocationAlias}:${server.allocationPort}` : server.allocationIp ? `${server.allocationIp}:${server.allocationPort}` : '')}}>Copy IP</Button>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs border-primary/50 text-primary hover:bg-primary/10" onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/server/${server.id}/console`)}}>
                      <Settings className="w-3 h-3 mr-1" /> Manage Server
                    </Button>
                  </div>
                </div>

                {isLocallyStarting && (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 flex flex-col gap-3 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-orange-500/20">
                       <motion.div className="h-full bg-orange-500" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2, repeat: Infinity }} />
                     </div>
                     <div className="flex items-start justify-between">
                       <div className="flex items-center gap-3">
                         <RefreshCw className="w-5 h-5 text-orange-500 animate-spin" />
                         <div>
                           <p className="text-sm font-bold text-orange-500">
                             {remainingSecs === 0 
                               ? "Still starting... please wait."
                               : "Server is starting..."}
                           </p>
                           <p className="text-xs text-orange-500/80 mt-0.5">
                             {remainingSecs === 0 ? "This may take a little longer." : "Estimated wait: 60 seconds"}
                           </p>
                         </div>
                       </div>
                       <span className="text-[10px] font-black text-orange-500 uppercase px-2 py-1 bg-orange-500/20 rounded shadow-sm">STARTING</span>
                     </div>
                     <div className="bg-background/50 rounded p-2 text-center border border-orange-500/10">
                       <span className="text-xs font-medium text-orange-500/70 mr-2 uppercase tracking-wider">Estimated time remaining:</span>
                       <span className="font-mono font-bold text-orange-500 text-sm">00:{remainingSecs.toString().padStart(2, '0')}</span>
                     </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/50 mb-1 flex items-center gap-1"><Zap className="w-3 h-3"/> RAM</span>
                    <span className={`text-sm font-bold ${server.costPerHour >= 8 ? 'text-[#FFD700]' : 'text-foreground'}`}>
                      {server.liveUsage ? (server.liveUsage.memory_bytes / 1024 / 1024).toFixed(0) : 0}MB <span className="text-xs font-normal text-foreground/50">/ {server.ramGB}GB</span>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/50 mb-1 flex items-center gap-1"><Cpu className="w-3 h-3"/> CPU</span>
                    <span className="text-sm font-bold">
                      {server.liveUsage ? server.liveUsage.cpu.toFixed(2) : 0}% <span className="text-xs font-normal text-foreground/50">/ {server.cpu}%</span>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/50 mb-1 flex items-center gap-1"><HardDrive className="w-3 h-3"/> Disk</span>
                    <span className="text-sm font-bold">
                      {server.liveUsage ? (server.liveUsage.disk_bytes / 1024 / 1024).toFixed(0) : 0}MB <span className="text-xs font-normal text-foreground/50">/ {server.disk}GB</span>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/50 mb-1 flex items-center gap-1"><Coins className="w-3 h-3"/> Cost</span>
                    <span className="text-sm font-bold text-success">{server.costPerHour}/hr</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t border-border/50 bg-card/30 flex flex-wrap gap-2">
                {displayStatus === "STOPPED" || displayStatus === "OFFLINE" ? (
                  <Button disabled={actionLoading === server.id || !!(user && user.balance < server.costPerHour)} onClick={(e) => { e.stopPropagation(); handleAction('start-server', server.id)}} size="sm" className="bg-success hover:bg-success/90 text-white shadow-lg shadow-success/20 flex-1 sm:flex-none">
                    {actionLoading === server.id ? (
                      <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Starting...</>
                    ) : (
                      <><Power className="w-4 h-4 mr-2" /> Start</>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button disabled={!!(isLocallyStarting && elapsedSecs <= 120)} onClick={(e) => { e.stopPropagation(); handleAction('cancel', server.id)}} size="sm" className="bg-red-500 hover:bg-red-600 text-white flex-1 sm:flex-none">
                      <Power className="w-4 h-4 mr-2" /> Stop
                    </Button>
                    <Button disabled={!!((isLocallyStarting && elapsedSecs <= 120) || (user && user.balance < server.costPerHour))} onClick={(e) => { e.stopPropagation(); handleAction('restart-server', server.id)}} size="sm" variant="outline" className="flex-1 sm:flex-none border-primary/50 text-primary hover:bg-primary/10">
                      <RefreshCw className="w-4 h-4 mr-2" /> Restart
                    </Button>
                  </>
                )}
                {!server.isShared && (
                  <Button size="sm" variant="secondary" className="flex-1 sm:flex-none ml-auto" onClick={(e) => { e.stopPropagation(); setUpgradeTarget(server); setIsPlanModalOpen(true); setSelectedPlan(null); }}>
                    <Zap className="w-4 h-4 mr-2" /> Upgrade
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
          )}
        )}
      </div>

      {/* Plan Selection Modal */}
      <AnimatePresence>
        {isPlanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border/50 rounded-xl w-full max-w-5xl shadow-2xl relative max-h-[calc(100vh-2rem)] overflow-y-auto"
            >
              <Button variant="ghost" size="icon" className="absolute right-4 top-4 z-10" onClick={() => { setIsPlanModalOpen(false); setSelectedPlan(null); setUpgradeTarget(null); }}>
                <X className="w-5 h-5" />
              </Button>

              <div className="p-6 sm:p-8">
                {!selectedPlan ? (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold tracking-tight">{upgradeTarget ? 'Upgrade Your Plan' : 'Choose Your Plan'}</h2>
                      <p className="text-foreground/60 mt-2">{upgradeTarget ? `Select a new plan for ${upgradeTarget.name}.` : 'Deploy your Minecraft server instantly.'}</p>
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
                        <Button type="button" className="mt-4 sm:mt-0 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-8" onClick={handleCustomPlanPurchase} disabled={loading}>
                          {loading ? 'Processing...' : 'Buy Custom Plan'}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleCreateSubmit} className="max-w-xl mx-auto py-4">
                    <Button type="button" variant="ghost" className="mb-6 -ml-4 text-foreground/60 hover:text-foreground" onClick={() => setSelectedPlan(null)}>
                      ← Back to Plans
                    </Button>
                    
                    <h2 className="text-2xl font-bold mb-2">{upgradeTarget ? 'Upgrade to' : 'Deploy'} {selectedPlan.name}</h2>
                    <p className="text-foreground/60 mb-6">{upgradeTarget ? 'Confirm your upgrade details below.' : 'Complete the setup to provision your server.'}</p>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Server Name</label>
                        <Input required disabled={!!upgradeTarget} value={upgradeTarget ? upgradeTarget.name : formData.serverName} onChange={e => !upgradeTarget && setFormData({...formData, serverName: e.target.value})} placeholder="My Awesome Server" />
                      </div>

                      {!upgradeTarget && (
                        <div>
                          <label className="text-sm font-medium mb-1 block">Server Software</label>
                          {user?.isPremium ? (
                            <select 
                              className="w-full bg-background border border-border/50 rounded-md p-2 text-sm focus:outline-none focus:border-primary"
                              value={formData.selectedEgg}
                              onChange={e => setFormData({...formData, selectedEgg: e.target.value})}
                            >
                              <option value="paper">Paper (Default Minecraft)</option>
                              <option value="forge">Forge (Modded Minecraft)</option>
                              <option value="vanilla">Vanilla (Pure Minecraft)</option>
                              <option value="bungeecord">Bungeecord (Proxy)</option>
                              <option value="sponge">Sponge (SpongeVanilla)</option>
                            </select>
                          ) : (
                            <div className="w-full bg-background/50 border border-border/50 rounded-md p-2 text-sm text-foreground/60 flex items-center justify-between">
                              <span>Paper (Default Minecraft)</span>
                              <span className="text-[10px] uppercase font-bold bg-[#FFD700]/20 text-[#FFD700] px-2 py-0.5 rounded">Premium Required to change</span>
                            </div>
                          )}
                        </div>
                      )}

                      {!user?.pterodactylUserId && !upgradeTarget && (
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
                        {isSubmitting ? (upgradeTarget ? "Upgrading..." : "Deploying...") : (upgradeTarget ? "Upgrade Server" : "Deploy Server")}
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
