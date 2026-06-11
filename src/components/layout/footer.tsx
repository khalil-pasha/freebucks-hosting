import Link from "next/link"
import Image from "next/image"
import { Shield, DiscIcon as Discord, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full bg-[#0a0f14] border-t-4 border-[#1f2937] pt-20 pb-10 relative overflow-hidden">
      
      {/* Subtle bedrock/dirt pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAyIi8+PC9zdmc+')] z-0 pointer-events-none opacity-50" />
      
      <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center group">
              <div className="relative h-10 w-32 md:h-16 md:w-56 overflow-hidden transition-transform hover:scale-105 duration-200">
                <Image src="/logo2.png" alt="Free Bucks Logo" fill className="object-contain object-left" />
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm font-medium">
              Enterprise-grade Minecraft server hosting powered by a fair credit economy. High performance, DDoS protected, and accessible for everyone.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://discord.com" className="w-10 h-10 rounded-sm bg-[#111827] border-2 border-[#1f2937] flex items-center justify-center hover:bg-[#5865F2] hover:border-[#4752C4] hover:text-white text-gray-400 transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.1),2px_2px_0_rgba(0,0,0,0.5)] active:translate-y-[2px] active:shadow-none">
                <Discord className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-sm bg-[#111827] border-2 border-[#1f2937] flex items-center justify-center hover:bg-[#1DA1F2] hover:border-[#1a91da] hover:text-white text-gray-400 transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.1),2px_2px_0_rgba(0,0,0,0.5)] active:translate-y-[2px] active:shadow-none">
                <MessageCircle className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-gray-200 tracking-widest uppercase border-b-2 border-[#1f2937] pb-2 inline-block">Platform</h4>
            <ul className="space-y-4 text-sm font-semibold text-gray-400">
              <li><Link href="/" className="hover:text-[#55FF55] transition-colors">Home</Link></li>
              <li><Link href="/features" className="hover:text-[#55FF55] transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-[#55FF55] transition-colors">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-[#55FF55] transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-gray-200 tracking-widest uppercase border-b-2 border-[#1f2937] pb-2 inline-block">Community</h4>
            <ul className="space-y-4 text-sm font-semibold text-gray-400">
              <li><Link href="#" className="hover:text-[#5865F2] transition-colors">Discord Server</Link></li>
              <li><Link href="/dashboard/support" className="hover:text-[#55FF55] transition-colors">Support Center</Link></li>
              <li><Link href="#" className="hover:text-[#55FF55] transition-colors">Knowledge Base</Link></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-gray-200 tracking-widest uppercase border-b-2 border-[#1f2937] pb-2 inline-block">Legal</h4>
            <ul className="space-y-4 text-sm font-semibold text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t-2 border-[#1f2937] flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-bold text-gray-500 uppercase tracking-wide">
          <p>© {new Date().getFullYear()} Free Bucks Hosting. All rights reserved.</p>
          <div className="flex items-center gap-2 bg-[#111827] px-4 py-2 rounded-sm border-2 border-[#1f2937] shadow-[inset_1px_1px_0_rgba(255,255,255,0.05)]">
            <Shield className="h-4 w-4 text-[#55FF55]" /> Secured by Enterprise DDoS Protection
          </div>
        </div>
      </div>
    </footer>
  )
}
