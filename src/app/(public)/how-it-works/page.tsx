import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "How Free Bucks Works | Minecraft Hosting Powered By Credits",
  description: "Learn how Free Bucks lets players earn credits, deploy Minecraft servers, upgrade resources and unlock premium hosting.",
}

export default function HowItWorksPage() {
  return (
    <div className="w-full bg-[#0a0f14] py-20 min-h-screen relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxZjI5MzciIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] z-0 pointer-events-none opacity-50" />
      
      <div className="max-w-4xl mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md mb-6">
            How Free Bucks Works
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
            Learn how to earn credits, deploy Minecraft servers, upgrade resources, and unlock premium hosting.
          </p>
        </div>

        <div className="space-y-12">
          
          {/* Section 1 */}
          <div className="bg-[#111827] border-4 border-[#1f2937] p-8 md:p-10 rounded-sm shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),8px_8px_0_rgba(0,0,0,0.4)]">
            <h2 className="text-2xl font-bold text-[#55FF55] uppercase tracking-wide mb-4 flex items-center gap-3">
              <span className="bg-[#1f2937] text-white w-10 h-10 flex items-center justify-center rounded-sm text-lg border-2 border-gray-600">1</span>
              Step 1 – Create Your Account
            </h2>
            <div className="text-gray-300 ml-0 md:ml-13">
              <ul className="list-disc pl-5 space-y-2">
                <li>Login with Discord.</li>
                <li>Access your dashboard instantly.</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-[#111827] border-4 border-[#1f2937] p-8 md:p-10 rounded-sm shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),8px_8px_0_rgba(0,0,0,0.4)]">
            <h2 className="text-2xl font-bold text-[#55FF55] uppercase tracking-wide mb-4 flex items-center gap-3">
              <span className="bg-[#1f2937] text-white w-10 h-10 flex items-center justify-center rounded-sm text-lg border-2 border-gray-600">2</span>
              Step 2 – Earn Credits
            </h2>
            <div className="text-gray-300 ml-0 md:ml-13">
              <ul className="list-disc pl-5 space-y-2">
                <li>Hourly rewards.</li>
                <li>Referral rewards.</li>
                <li>Promotional vouchers.</li>
                <li>Community activities.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-[#111827] border-4 border-[#1f2937] p-8 md:p-10 rounded-sm shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),8px_8px_0_rgba(0,0,0,0.4)]">
            <h2 className="text-2xl font-bold text-[#55FF55] uppercase tracking-wide mb-4 flex items-center gap-3">
              <span className="bg-[#1f2937] text-white w-10 h-10 flex items-center justify-center rounded-sm text-lg border-2 border-gray-600">3</span>
              Step 3 – Deploy a Server
            </h2>
            <div className="text-gray-300 ml-0 md:ml-13">
              <ul className="list-disc pl-5 space-y-2">
                <li>Choose a plan.</li>
                <li>Deploy using earned credits.</li>
                <li>Manage resources from dashboard.</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-[#111827] border-4 border-[#1f2937] p-8 md:p-10 rounded-sm shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),8px_8px_0_rgba(0,0,0,0.4)]">
            <h2 className="text-2xl font-bold text-[#55FF55] uppercase tracking-wide mb-4 flex items-center gap-3">
              <span className="bg-[#1f2937] text-white w-10 h-10 flex items-center justify-center rounded-sm text-lg border-2 border-gray-600">4</span>
              Step 4 – Upgrade Resources
            </h2>
            <div className="text-gray-300 ml-0 md:ml-13">
              <ul className="list-disc pl-5 space-y-2">
                <li>Use credits to unlock more RAM, CPU and storage.</li>
                <li>Scale as your community grows.</li>
              </ul>
            </div>
          </div>

          {/* Section 5: Premium Membership */}
          <div className="bg-gradient-to-br from-[#1f2937] to-[#111827] border-4 border-[#FFD700] p-8 md:p-10 rounded-sm shadow-[inset_4px_4px_0_rgba(255,255,255,0.05),8px_8px_0_rgba(255,215,0,0.2)] mt-12">
            <h2 className="text-2xl font-bold text-[#FFD700] uppercase tracking-wide mb-4">
              Premium Membership
            </h2>
            <div className="text-gray-300">
              <ul className="list-disc pl-5 space-y-2">
                <li>Dedicated CPU</li>
                <li>NVMe storage</li>
                <li>Priority resources</li>
                <li>Premium performance</li>
              </ul>
            </div>
          </div>

          {/* Section 6: FAQ */}
          <div className="bg-[#111827] border-4 border-[#1f2937] p-8 md:p-10 rounded-sm shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),8px_8px_0_rgba(0,0,0,0.4)] mt-16">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-8 border-b-2 border-[#1f2937] pb-4">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="font-bold text-white text-lg mb-2">How do credits work?</h3>
                <p className="text-gray-400">Credits are the virtual currency of Free Bucks. They are consumed hourly based on your server plan. As long as you have credits, your server stays online.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-white text-lg mb-2">How often can I claim rewards?</h3>
                <p className="text-gray-400">You can claim your hourly rewards every 60 minutes directly from your dashboard.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-white text-lg mb-2">Can I upgrade later?</h3>
                <p className="text-gray-400">Yes! You can upgrade your server's RAM, CPU, and storage at any time using your earned credits.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-white text-lg mb-2">Do I need a credit card?</h3>
                <p className="text-gray-400">No credit card is required to use the free tier. You can earn and host entirely for free.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-white text-lg mb-2">How do premium plans work?</h3>
                <p className="text-gray-400">Premium plans are monthly paid subscriptions that provide dedicated resources, bypassing the need to claim hourly credits.</p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center pt-12 pb-8 mt-12">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-8">
              Ready to Start Your Minecraft Server?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/login?redirect=/dashboard/servers" className="inline-block bg-[#55FF55] hover:bg-[#44cc44] text-[#0a0f14] font-bold py-4 px-8 rounded-sm transition-colors uppercase tracking-wider text-lg shadow-[inset_-3px_-3px_0_rgba(0,0,0,0.2)] w-full sm:w-auto">
                Get Started
              </Link>
              <Link href="https://discord.gg/XY25Xgr5fV" target="_blank" className="inline-block bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 px-8 rounded-sm transition-colors uppercase tracking-wider text-lg shadow-[inset_-3px_-3px_0_rgba(0,0,0,0.2)] w-full sm:w-auto">
                Join Discord
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
