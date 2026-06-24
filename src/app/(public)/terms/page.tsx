import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Free Bucks",
  description: "Terms of Service for Free Bucks Minecraft Hosting",
}

export default function TermsPage() {
  return (
    <div className="w-full bg-[#0a0f14] py-20 min-h-screen relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxZjI5MzciIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] z-0 pointer-events-none opacity-50" />
      
      <div className="max-w-4xl mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
        <div className="bg-[#111827] border-4 border-[#1f2937] p-8 md:p-12 rounded-sm shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),inset_-4px_-4px_0_rgba(0,0,0,0.3),8px_8px_0_rgba(0,0,0,0.4)]">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md mb-8 border-b-4 border-[#1f2937] pb-6">
            Terms of Service
          </h1>
          
          <div className="space-y-8 text-gray-300 font-medium leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">1. Acceptance of Terms</h2>
              <p>By accessing or using Free Bucks Hosting ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">2. Account Registration via Discord</h2>
              <p>You must authenticate using Discord to use our services. By doing so, you grant us permission to access your basic profile information (username, avatar, email, and ID). You are responsible for maintaining the security of your Discord account. Any actions taken through your account are your sole responsibility.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">3. Acceptable Use and Server Abuse</h2>
              <p>Our infrastructure is strictly for hosting Minecraft servers and related gaming services. You agree NOT to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-400">
                <li>Host malicious files, malware, or engage in DDoS activities.</li>
                <li>Utilize your server for cryptocurrency mining or distributed computing.</li>
                <li>Host unauthorized bots, scrapers, or illegal content.</li>
                <li>Attempt to bypass resource limits, isolate virtualization, or disrupt the network.</li>
              </ul>
              <p className="mt-3">Violation of these rules will result in immediate and permanent account suspension without warning or refund.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">4. Hosting Credit System</h2>
              <p>Free Bucks operates on an internal Hosting Credit system. Hosting Credits are internal platform units used only for service management and resource allocation. Hosting Credits hold no real-world monetary value, cannot be exchanged, transferred, redeemed, withdrawn, or converted into cash. We reserve the right to modify credit earning rates, server burn rates, and daily limits at any time to preserve platform stability.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">5. Payments & Hosting Services</h2>
              <p className="mb-4">Free Bucks provides Minecraft server hosting services and related infrastructure resources.</p>
              <p className="mb-2">Payments made through the platform are solely for:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-400">
                <li>Premium Hosting Plans</li>
                <li>Server Resource Upgrades</li>
                <li>RAM Allocation</li>
                <li>CPU Allocation</li>
                <li>Storage Resources</li>
                <li>Hosting Features</li>
              </ul>
              <p className="mb-4">Hosting Credits are internal platform units used only for service management and resource allocation.</p>
              <p>Hosting Credits cannot be exchanged, transferred, redeemed, withdrawn, or converted into cash.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">6. Limitation of Liability</h2>
              <p>While we employ daily automated backups and enterprise hardware, Free Bucks is provided "as is" without warranties of any kind. We are not liable for data loss, server downtime, or corruption of Minecraft worlds. You are heavily encouraged to maintain your own off-site backups.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">7. Contact & Support</h2>
              <p>For any questions regarding these Terms, please contact us by joining our official Discord Server or emailing support@freebucks.host.</p>
            </section>

            <p className="text-sm text-gray-500 pt-8 border-t border-[#1f2937] mt-12">Last Updated: June 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}
