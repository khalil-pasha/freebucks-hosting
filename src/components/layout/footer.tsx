import Link from "next/link"
import Image from "next/image"
import { Shield, LifeBuoy, MapPin, MessageCircle, DiscIcon as Discord } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
      {/* Premium ambient footer glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/5 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-16 w-48 overflow-hidden transition-transform group-hover:scale-105">
                <Image src="/logo2.png" alt="Free Bucks Logo" fill className="object-contain object-left" />
              </div>
            </Link>
            <p className="text-base text-white/50 leading-relaxed max-w-md font-medium">
              Enterprise-grade Minecraft server hosting powered by a fair credit economy. High performance, DDoS protected, and accessible for everyone. Stop paying for lag.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://discord.com" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#5865F2] hover:border-[#5865F2] transition-all group">
                <Discord className="w-5 h-5 text-white/70 group-hover:text-white" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1DA1F2] hover:border-[#1DA1F2] transition-all group">
                <MessageCircle className="w-5 h-5 text-white/70 group-hover:text-white" />
              </Link>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white tracking-wide">Platform</h4>
            <ul className="space-y-4 text-sm font-medium text-white/50">
              <li><Link href="/" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Home</Link></li>
              <li><Link href="/features" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-primary hover:translate-x-1 inline-block transition-all">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white tracking-wide">Community</h4>
            <ul className="space-y-4 text-sm font-medium text-white/50">
              <li><Link href="#" className="hover:text-[#5865F2] hover:translate-x-1 inline-flex items-center gap-2 transition-all">Discord Server</Link></li>
              <li><Link href="/dashboard/support" className="hover:text-primary hover:translate-x-1 inline-flex items-center gap-2 transition-all">Support Center</Link></li>
              <li><Link href="#" className="hover:text-primary hover:translate-x-1 inline-flex items-center gap-2 transition-all">Knowledge Base</Link></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white tracking-wide">Legal</h4>
            <ul className="space-y-4 text-sm font-medium text-white/50">
              <li><Link href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">Refund Policy</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-medium text-white/40">
          <p>© {new Date().getFullYear()} Free Bucks Hosting. All rights reserved.</p>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Shield className="h-4 w-4 text-success" /> Secured by Enterprise DDoS Protection
          </div>
        </div>
      </div>
    </footer>
  )
}
