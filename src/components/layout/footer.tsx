import Link from "next/link"
import Image from "next/image"
import { Shield, DiscIcon as Discord, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full bg-[#09090b] border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
      <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center group">
              <div className="relative h-14 w-44 overflow-hidden transition-opacity hover:opacity-80">
                <Image src="/logo2.png" alt="Free Bucks Logo" fill className="object-contain object-left" />
              </div>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm font-medium">
              Enterprise-grade Minecraft server hosting powered by a fair credit economy. High performance, DDoS protected, and accessible for everyone.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://discord.com" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#5865F2] hover:border-[#5865F2] hover:text-white text-zinc-400 transition-colors">
                <Discord className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1DA1F2] hover:border-[#1DA1F2] hover:text-white text-zinc-400 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-zinc-100 tracking-wide uppercase">Platform</h4>
            <ul className="space-y-4 text-sm font-medium text-zinc-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-zinc-100 tracking-wide uppercase">Community</h4>
            <ul className="space-y-4 text-sm font-medium text-zinc-400">
              <li><Link href="#" className="hover:text-white transition-colors">Discord Server</Link></li>
              <li><Link href="/dashboard/support" className="hover:text-white transition-colors">Support Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Knowledge Base</Link></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-zinc-100 tracking-wide uppercase">Legal</h4>
            <ul className="space-y-4 text-sm font-medium text-zinc-400">
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-medium text-zinc-500">
          <p>© {new Date().getFullYear()} Free Bucks Hosting. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-zinc-400" /> Secured by Enterprise DDoS Protection
          </div>
        </div>
      </div>
    </footer>
  )
}
