"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LifeBuoy, MessageSquare, BookOpen, ExternalLink, HelpCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

const faqShortcuts = [
  { q: "How do I install modpacks?", a: "Go to your server panel, navigate to 'Software', select your modpack provider (CurseForge/Modrinth), and click install." },
  { q: "Why is my server stuck in queue?", a: "We limit concurrent server starts to 5. If it takes longer than 10 minutes, open a ticket on Discord." },
  { q: "How do I upgrade my RAM?", a: "Stop your server, click the 'Upgrade' button on the Servers page, and select your new tier." },
]

export default function SupportPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
        <p className="text-foreground/60 mt-1">Need help with your server? We've got you covered.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-1 space-y-6">
          {/* Discord Support Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-[#5865F2]/10 border-[#5865F2]/30 relative overflow-hidden h-full hover:bg-[#5865F2]/20 transition-colors">
              <CardHeader className="text-center pb-2 pt-8">
                <div className="mx-auto w-16 h-16 bg-[#5865F2] rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg shadow-[#5865F2]/20 rotate-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                </div>
                <CardTitle className="text-xl font-bold">Discord Community</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-foreground/70 mb-6">The fastest way to get help. Join 85,000+ other users and our dedicated 24/7 support staff.</p>
                <Button className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white">Join Discord Server</Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Knowledge Base */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Knowledge Base</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/60 mb-4">Read our comprehensive guides on setting up domains, installing plugins, and more.</p>
                <Button variant="outline" className="w-full flex justify-between items-center group">
                  Browse Guides <ExternalLink className="w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* FAQ Shortcuts */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-secondary" /> Common Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqShortcuts.map((faq, i) => (
                  <div key={i} className="p-4 bg-background border border-border/50 rounded-xl">
                    <h4 className="font-bold mb-2 flex items-start gap-2">
                      <span className="text-secondary mt-0.5">Q:</span> {faq.q}
                    </h4>
                    <p className="text-sm text-foreground/70 ml-6">{faq.a}</p>
                  </div>
                ))}
                <div className="pt-2 text-center">
                  <Link href="/faq" className="text-sm text-primary hover:underline font-medium">View all Frequently Asked Questions</Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Support Form */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-start gap-3 text-orange-500 text-sm mb-6">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>For urgent server down issues, please ping the @Support team directly in our Discord server for immediate assistance.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="e.g., Server stuck starting" className="bg-background border-border/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Server ID (Optional)</label>
                    <Input placeholder="fb-192a" className="bg-background border-border/50 font-mono" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    placeholder="Describe your issue in detail..." 
                    className="min-h-[120px] bg-background border-border/50"
                  />
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8">Submit Ticket</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
