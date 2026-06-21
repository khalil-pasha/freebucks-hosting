"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { useAuth } from "@/components/AuthProvider"
import Script from "next/script"
import api, { handleApiError } from "@/lib/api"

const fixedPlans = [
  { name: "Free Starter", ram: 2, cpu: 100, disk: 5, cost: "1.5 credits/hr", isPremium: false },
  { name: "Advanced", ram: 4, cpu: 150, disk: 10, cost: "3 credits/hr", isPremium: false },
  { name: "Pro", ram: 6, cpu: 200, disk: 15, cost: "6 credits/hr", isPremium: false },
  { name: "Premium", ram: 8, cpu: 300, disk: 30, cost: "₹549/month", isPremium: true, desc: "Dedicated CPU & NVMe" },
]

function PricingContent() {
  const router = useRouter()
  const { user } = useAuth()

  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && searchParams.get('buyPremium') === 'true') {
      handlePremiumPurchase()
    }
  }, [user, searchParams])

  const handlePlanSelect = (plan: any) => {
    if (plan.isPremium) {
      handlePremiumPurchase()
      return
    }
    if (user) {
      router.push('/dashboard/servers')
    } else {
      localStorage.setItem('post_login_redirect', '/dashboard/servers')
      router.push('/login')
    }
  }

  const handlePremiumPurchase = async () => {
    if (!user) {
      localStorage.setItem('post_login_redirect', '/pricing?buyPremium=true')
      router.push('/login')
      return
    }

    try {
      setLoading(true)
      const res = await api.post('/premium/create-order')
      const { id, amount, currency } = res.data

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
            })
            router.push('/dashboard/servers?premium_success=1')
          } catch (err: any) {
            alert(handleApiError(err) || 'Payment verification failed')
          }
        },
        prefill: {
          name: user.username,
          email: user.email,
        },
        theme: {
          color: "#3b82f6"
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        alert("Payment failed: " + response.error.description)
      })
      rzp.open()
    } catch (err: any) {
      alert(handleApiError(err) || 'Failed to initialize payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    <div className="flex flex-col items-center w-full py-20 min-h-[80vh]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
          >
            Choose Your Plan
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/60 text-lg"
          >
            Deploy your Minecraft server instantly.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto"
        >
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
                  disabled={loading && plan.isPremium}
                  className={`w-full ${plan.isPremium ? 'bg-[#FFD700] hover:bg-[#FFD700]/90 text-black' : 'bg-primary hover:bg-primary/90 text-white'}`}
                >
                  {plan.isPremium && loading ? 'Processing...' : plan.isPremium ? 'Buy Premium' : 'Deploy Server'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mt-8 p-8 bg-background rounded-xl border border-border/50 shadow-inner"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Zap className="text-primary w-6 h-6" /> Custom Plans Available
              </h3>
              <p className="text-foreground/70 text-lg">
                Need specific hardware? You can fully customize RAM, CPU, and Disk allocations directly from the dashboard to perfectly match your community's needs.
              </p>
            </div>
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/20 whitespace-nowrap" onClick={handlePlanSelect}>
              Customize in Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading plans...</div>}>
      <PricingContent />
    </Suspense>
  )
}
