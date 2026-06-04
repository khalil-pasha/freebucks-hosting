"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free Tier",
    price: "0",
    description: "Perfect for getting started and testing.",
    features: ["2GB RAM", "1 CPU Core", "10GB SSD Storage", "Basic Support", "Shared IP"],
    popular: false,
    button: "Get Started Free"
  },
  {
    name: "Iron Plan",
    price: "500",
    description: "Great for small communities and friends.",
    features: ["4GB RAM", "2 CPU Cores", "30GB NVMe Storage", "Priority Support", "Dedicated IP", "Free MySQL Database"],
    popular: true,
    button: "Purchase for 500 Bucks"
  },
  {
    name: "Diamond Plan",
    price: "1500",
    description: "Ultimate performance for large servers.",
    features: ["8GB RAM", "4 CPU Cores", "80GB NVMe Storage", "24/7 Priority Support", "Dedicated IP", "Unlimited Databases", "DDoS Protection+"],
    popular: false,
    button: "Purchase for 1500 Bucks"
  }
]

export default function PricingPage() {
  return (
    <div className="flex flex-col items-center w-full py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 text-lg"
          >
            Use your earned Bucks to purchase premium hosting plans. No hidden fees.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className={`relative h-full flex flex-col ${plan.popular ? 'border-primary shadow-lg shadow-primary/20' : 'border-border/50'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6 flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold">{plan.price}</span>
                    <span className="text-foreground/70 font-medium">Bucks/mo</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="rounded-full bg-success/20 p-1">
                          <Check className="h-4 w-4 text-success" />
                        </div>
                        <span className="text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "primary" : "outline"}
                    size="lg"
                  >
                    {plan.button}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
