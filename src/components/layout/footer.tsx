import Link from "next/link"
import Image from "next/image"
import { Shield, LifeBuoy } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-card/30 backdrop-blur-md pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-12 w-12 overflow-hidden transition-transform group-hover:scale-105">
                <Image src="/logo.png" alt="Free Bucks Logo" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight leading-none truncate">FREE BUCKS</span>
                <span className="text-[10px] text-foreground/50 uppercase tracking-widest font-bold mt-1">Minecraft Hosting</span>
              </div>
            </Link>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Premium Minecraft server hosting powered by credits. High performance, DDoS protected, and accessible for everyone.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Platform</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Community</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><Link href="#" className="hover:text-[#5865F2] transition-colors flex items-center gap-2">Discord Server</Link></li>
              <li><Link href="/dashboard/support" className="hover:text-primary transition-colors flex items-center gap-2">Support Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2">Knowledge Base</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-foreground/50">
          <p>© {new Date().getFullYear()} Free Bucks Hosting. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4" /> Secured by Enterprise DDoS Protection
          </div>
        </div>
      </div>
    </footer>
  )
}
