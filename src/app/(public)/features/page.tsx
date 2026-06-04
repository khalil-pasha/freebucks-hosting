"use client"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

const featureList = [
  "NVMe SSD Storage",
  "High Clock Speed CPUs",
  "DDoS Protection up to 480Gbps",
  "99.9% Uptime Guarantee",
  "Custom Control Panel",
  "Full FTP Access",
  "Free MySQL Databases",
  "Modpack Installer",
  "Plugin Manager",
  "Automated Backups",
  "Free Subdomain",
  "24/7 Discord Support"
]

export default function FeaturesPage() {
  return (
    <div className="flex flex-col items-center w-full py-20">
      <div className="container px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Everything You Need
          </motion.h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Our platform is built from the ground up for Minecraft players, by Minecraft players. 
            Enjoy premium features without the premium price tag.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 shadow-sm"
            >
              <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
              <span className="font-medium text-lg">{feature}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
