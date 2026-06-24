import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | Free Bucks",
  description: "Learn more about Free Bucks, the premium Minecraft server hosting platform powered by a virtual credit economy.",
}

export default function AboutPage() {
  return (
    <div className="w-full bg-[#0a0f14] py-20 min-h-screen relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxZjI5MzciIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] z-0 pointer-events-none opacity-50" />
      
      <div className="max-w-4xl mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
        <div className="bg-[#111827] border-4 border-[#1f2937] p-8 md:p-12 rounded-sm shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),inset_-4px_-4px_0_rgba(0,0,0,0.3),8px_8px_0_rgba(0,0,0,0.4)]">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md mb-8 border-b-4 border-[#1f2937] pb-6">
            About Free Bucks
          </h1>
          
          <div className="space-y-8 text-gray-300 font-medium leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">Who We Are</h2>
              <p className="mb-4">Free Bucks Hosting is a Minecraft server hosting platform built to provide reliable, high-performance game server infrastructure for players, communities, and content creators.</p>
              <p>Our platform enables users to deploy and manage Minecraft servers using enterprise-grade hardware, high-speed NVMe storage, and DDoS-protected networking. We are committed to delivering stable, scalable, and affordable hosting solutions for gamers worldwide.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">Our Services</h2>
              <p className="mb-4">Free Bucks provides Minecraft server hosting and related infrastructure services.</p>
              <p className="mb-4">Users can deploy and manage Minecraft servers using allocated hosting resources such as RAM, CPU, storage, bandwidth, and premium hosting features.</p>
              <p className="mb-4">Payments made on our platform are solely for hosting services and infrastructure resources.</p>
              <p>Free Bucks does not provide gambling, betting, cryptocurrency services, money transfers, financial products, or cash-equivalent services.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">Hosting Credit System</h2>
              <p className="mb-4">To make hosting more accessible, Free Bucks uses an internal Hosting Credit system.</p>
              <p className="mb-4">Hosting Credits can be earned through platform participation and may be used exclusively for operating Minecraft servers on the Free Bucks platform.</p>
              <p className="mb-2">Hosting Credits:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Have no real-world monetary value</li>
                <li>Cannot be exchanged for cash</li>
                <li>Cannot be withdrawn</li>
                <li>Cannot be transferred</li>
                <li>Cannot be sold</li>
                <li>Can only be used for hosting-related services within Free Bucks</li>
              </ul>
              <p>The Hosting Credit system exists solely to manage server resource allocation and platform usage.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">Our Mission</h2>
              <p className="mb-4">Our mission is to make Minecraft server hosting accessible to everyone.</p>
              <p className="mb-4">We believe players should be able to create communities, play with friends, and build multiplayer experiences without requiring expensive monthly hosting commitments.</p>
              <p>By combining efficient infrastructure with fair resource allocation, we aim to provide dependable hosting for both casual players and growing gaming communities.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">Enterprise Infrastructure</h2>
              <p className="mb-4">Free Bucks operates on enterprise-grade infrastructure designed for performance and reliability.</p>
              <p className="mb-2">Our hosting environment includes:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>High-performance CPUs</li>
                <li>NVMe SSD storage</li>
                <li>DDoS protection</li>
                <li>Automated monitoring</li>
                <li>Reliable uptime systems</li>
              </ul>
              <p>This ensures low-latency gameplay, fast server response times, and a consistent hosting experience for all users.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
