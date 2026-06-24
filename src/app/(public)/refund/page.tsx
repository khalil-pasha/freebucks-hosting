import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Refund Policy | Free Bucks",
  description: "Refund and Cancellation Policy for Free Bucks",
}

export default function RefundPage() {
  return (
    <div className="w-full bg-[#0a0f14] py-20 min-h-screen relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxZjI5MzciIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] z-0 pointer-events-none opacity-50" />
      
      <div className="max-w-4xl mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
        <div className="bg-[#111827] border-4 border-[#1f2937] p-8 md:p-12 rounded-sm shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),inset_-4px_-4px_0_rgba(0,0,0,0.3),8px_8px_0_rgba(0,0,0,0.4)]">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md mb-8 border-b-4 border-[#1f2937] pb-6">
            Refund & Cancellation Policy
          </h1>
          
          <div className="space-y-8 text-gray-300 font-medium leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">1. Digital Goods</h2>
              <p className="mb-4">Free Bucks provides digital services, specifically Minecraft Hosting Services, Premium Hosting Plans, and Infrastructure Resource Upgrades, allowing users to provision Minecraft hosting servers.</p>
              <p className="mb-4">Payments are made solely for hosting services and infrastructure resources.</p>
              <p>Due to the immediate delivery and digital nature of these services, all sales are considered final once the credits or perks have been applied to your account.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">2. Eligibility for Refunds</h2>
              <p>Refunds are heavily restricted but may be granted at the sole discretion of the Free Bucks Administration under the following conditions:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-400">
                <li>A duplicate payment was made accidentally.</li>
                <li>The credits or VIP perks failed to apply to your account within 24 hours of payment.</li>
                <li>There is a major, verifiable outage affecting only your Premium node lasting longer than 48 hours.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">3. Non-Refundable Scenarios</h2>
              <p>We will NOT issue refunds under the following circumstances:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-400">
                <li>You changed your mind after purchasing.</li>
                <li>You violated our Terms of Service (e.g., server abuse, DDoS activity) resulting in an account ban.</li>
                <li>You are unable to configure your Minecraft server or install a specific modpack.</li>
                <li>You experienced minor network lag or normal scheduled maintenance downtime.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">4. How to Request a Refund</h2>
              <p>If you believe you meet the criteria for a refund, you must submit a request within 3 days (72 hours) of the original transaction date. Please contact us via our <Link href="https://discord.gg/XY25Xgr5fV" className="text-[#5865F2] hover:underline font-bold">Discord Server</Link> and open a billing support ticket with your Razorpay transaction ID and Discord username.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">5. Chargebacks</h2>
              <p>Initiating a chargeback or payment dispute through your bank or payment provider without contacting us first will result in an immediate, permanent, and irreversible ban of your Free Bucks account and deletion of all associated server data.</p>
            </section>

            <p className="text-sm text-gray-500 pt-8 border-t border-[#1f2937] mt-12">Last Updated: June 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}
