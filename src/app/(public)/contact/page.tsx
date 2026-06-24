import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contact Us | Free Bucks",
  description: "Get in touch with Free Bucks support for help with your Minecraft server hosting.",
}

export default function ContactPage() {
  return (
    <div className="w-full bg-[#0a0f14] py-20 min-h-screen relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxZjI5MzciIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] z-0 pointer-events-none opacity-50" />
      
      <div className="max-w-4xl mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
        <div className="bg-[#111827] border-4 border-[#1f2937] p-8 md:p-12 rounded-sm shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),inset_-4px_-4px_0_rgba(0,0,0,0.3),8px_8px_0_rgba(0,0,0,0.4)]">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md mb-8 border-b-4 border-[#1f2937] pb-6">
            Contact & Support
          </h1>
          
          <div className="space-y-8 text-gray-300 font-medium leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">We're Here to Help</h2>
              <p>Need assistance with your server, billing, or account? Our support team and community are ready to help you get back to building your Minecraft world.</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-[#0a0f14] border-2 border-[#1f2937] p-6 rounded-sm text-center">
                <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-2">Community Discord</h3>
                <p className="text-gray-400 text-sm mb-6">Join our active Discord community for quick questions, announcements, and peer support.</p>
                <Link href="https://discord.gg/XY25Xgr5fV" target="_blank" className="inline-block bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-6 rounded-sm transition-colors w-full uppercase tracking-wider text-sm shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.2)]">
                  Join Discord Server
                </Link>
              </div>

              <div className="bg-[#0a0f14] border-2 border-[#1f2937] p-6 rounded-sm text-center">
                <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-2">Support Center</h3>
                <p className="text-gray-400 text-sm mb-6">Create a support ticket for account issues, premium upgrades, or technical assistance.</p>
                <Link href="/dashboard/support" className="inline-block bg-[#55FF55] hover:bg-[#44cc44] text-[#0a0f14] font-bold py-3 px-6 rounded-sm transition-colors w-full uppercase tracking-wider text-sm shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.2)]">
                  Open Support Ticket
                </Link>
              </div>
            </div>

            <section className="pt-8 border-t border-[#1f2937] mt-8">
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">Business Information</h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-xs">Business Name:</span>
                  <p className="font-medium text-white">Free Bucks Hosting</p>
                </div>
                <div>
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-xs">Business Location:</span>
                  <p className="font-medium text-white">E-151/1, Shaheen Bagh,<br/>New Delhi, Delhi - 110025<br/>India</p>
                </div>
                <div>
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-xs">Business Email:</span>
                  <p className="font-medium text-white"><a href="mailto:freebuckshost@gmail.com" className="hover:underline">freebuckshost@gmail.com</a></p>
                </div>
                <div>
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-xs">Business Type:</span>
                  <p className="font-medium text-white">Minecraft Server Hosting & Infrastructure Services</p>
                </div>
                <div>
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-xs">Support Hours:</span>
                  <p className="font-medium text-white">Monday – Saturday<br/>10:00 AM – 7:00 PM IST</p>
                </div>
              </div>
              <p className="mt-8">For billing issues, technical support, premium hosting plans, or business inquiries, please contact us via email or Discord.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
