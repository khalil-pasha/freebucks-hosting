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
              <p>Free Bucks Hosting is a platform dedicated to making premium Minecraft server hosting accessible to everyone. By leveraging modern infrastructure and enterprise-grade hardware, we provide high-performance, DDoS-protected servers that keep your communities running smoothly.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">The Credit Economy</h2>
              <p>Unlike traditional hosts, Free Bucks operates on a unique virtual credit economy. Users can earn credits through daily claims, hourly rewards, and referrals. These credits fuel your servers, meaning you can host your dream Minecraft world entirely for free just by remaining an active part of our community.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">Our Mission</h2>
              <p>We believe that setting up and running a multiplayer server shouldn't require a monthly subscription. Our mission is to democratize gaming by giving players the tools and resources they need to deploy robust, reliable, and scalable servers at zero upfront cost.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">Enterprise Infrastructure</h2>
              <p>Just because it's free doesn't mean we compromise on quality. Our nodes are equipped with powerful CPUs, fast NVMe storage, and top-tier DDoS mitigation to ensure low-latency gameplay and maximum uptime.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
