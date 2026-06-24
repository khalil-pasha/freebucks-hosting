import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Free Bucks",
  description: "Privacy Policy for Free Bucks Minecraft Hosting",
}

export default function PrivacyPage() {
  return (
    <div className="w-full bg-[#0a0f14] py-20 min-h-screen relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxZjI5MzciIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] z-0 pointer-events-none opacity-50" />
      
      <div className="max-w-4xl mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
        <div className="bg-[#111827] border-4 border-[#1f2937] p-8 md:p-12 rounded-sm shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),inset_-4px_-4px_0_rgba(0,0,0,0.3),8px_8px_0_rgba(0,0,0,0.4)]">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md mb-8 border-b-4 border-[#1f2937] pb-6">
            Privacy Policy
          </h1>
          
          <div className="space-y-8 text-gray-300 font-medium leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">1. Information We Collect</h2>
              <p>When you use Free Bucks, we collect certain information to provide and improve our service:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-400">
                <li><strong>Discord Data:</strong> Username, Avatar URL, Discord ID, and Email Address, acquired securely via Discord OAuth.</li>
                <li><strong>Usage Data:</strong> Server uptime, resource utilization (CPU/RAM), credit balances, and dashboard activity.</li>
                <li><strong>Log Data:</strong> IP addresses, browser types, and access timestamps for security and abuse prevention.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">2. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. We use strictly necessary cookies to maintain your login session.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">3. Google Ads & Third-Party Advertising</h2>
              <p>We use Google AdSense and Google Analytics to monetize the free tier and analyze traffic. Third party vendors, including Google, use cookies to serve ads based on your prior visits to our website. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our sites and/or other sites on the Internet.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">4. Payment Processing</h2>
              <p className="mb-4">All financial transactions are handled securely via Razorpay. We do not store or process your credit card numbers, UPI IDs, or direct bank details on our servers. Razorpay's privacy policy governs the processing of your billing information.</p>
              <p className="mb-4">Free Bucks processes payments exclusively for hosting services, server infrastructure resources, and premium hosting plans.</p>
              <p>Free Bucks does not provide financial services, money transfer services, cryptocurrency services, gambling services, betting services, or cash-equivalent products.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">5. Data Retention & Deletion</h2>
              <p>Your data is retained as long as your account is active. If you wish to permanently delete your account, server data, and associated Discord metadata, please contact support via Discord. Please note that Minecraft worlds are irreversibly deleted 7 days after a server runs out of credits.</p>
            </section>

            <p className="text-sm text-gray-500 pt-8 border-t border-[#1f2937] mt-12">Last Updated: June 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}
