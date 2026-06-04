"use client"
import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MessageSquare, Send, XCircle, MoreVertical } from "lucide-react"

const tickets = [
  { id: "T-8812", user: "_NightBlade_", subject: "Server stuck on starting", status: "Open", time: "10m ago", active: true },
  { id: "T-8811", user: "MinecraftPro", subject: "How to install plugins?", status: "Pending", time: "1h ago", active: false },
  { id: "T-8810", user: "PvP_Master99", subject: "Upgrade to Pro missing", status: "Closed", time: "3h ago", active: false },
  { id: "T-8809", user: "SteveNew", subject: "Lost my credits", status: "Closed", time: "1d ago", active: false },
]

export default function AdminSupportPage() {
  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-foreground/60 mt-1">Manage user issues and inquiries.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {/* Ticket List Pane */}
        <Card className="bg-card border-border/50 col-span-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border/50 space-y-4">
             <div className="flex items-center gap-2 bg-background border border-border/50 rounded-lg px-3 py-2 w-full">
               <Search className="w-4 h-4 text-foreground/50" />
               <input 
                 type="text" 
                 placeholder="Search tickets..." 
                 className="bg-transparent border-none outline-none text-sm w-full"
               />
             </div>
             <div className="flex gap-2">
               <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30 flex-1">Open</Button>
               <Button size="sm" variant="ghost" className="text-foreground/60 hover:text-foreground flex-1">Pending</Button>
               <Button size="sm" variant="ghost" className="text-foreground/60 hover:text-foreground flex-1">Closed</Button>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {tickets.map((t) => (
              <div 
                key={t.id} 
                className={`p-4 rounded-xl cursor-pointer border transition-colors ${
                  t.active ? "bg-primary/10 border-primary/30" : "bg-background border-border/50 hover:bg-foreground/5"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm">{t.user}</span>
                  <span className="text-[10px] text-foreground/50 font-mono">{t.id}</span>
                </div>
                <p className={`text-sm mb-2 truncate ${t.active ? "text-foreground" : "text-foreground/70"}`}>
                  {t.subject}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    t.status === 'Open' ? 'bg-success/20 text-success' :
                    t.status === 'Pending' ? 'bg-orange-500/20 text-orange-500' :
                    'bg-foreground/10 text-foreground/50'
                  }`}>
                    {t.status}
                  </span>
                  <span className="text-[10px] text-foreground/50">{t.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Conversation Pane */}
        <Card className="bg-card border-border/50 col-span-1 md:col-span-2 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border/50 flex justify-between items-center bg-background/50">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Server stuck on starting</h2>
                <span className="bg-success/20 text-success px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Open</span>
              </div>
              <p className="text-xs text-foreground/50 mt-1">Ticket T-8812 • _NightBlade_</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"><XCircle className="w-4 h-4 mr-2"/> Close Ticket</Button>
              <Button variant="ghost" size="icon" className="w-8 h-8"><MoreVertical className="w-4 h-4"/></Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background">
            {/* User Message */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">N</div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold">_NightBlade_</span>
                  <span className="text-xs text-foreground/50">Today at 10:15 AM</span>
                </div>
                <div className="bg-card border border-border/50 p-3 rounded-xl text-sm text-foreground/80 rounded-tl-none">
                  Hi, I tried to start my server "Survival SMP" but it's been stuck on "Starting" for like 20 minutes now. It's not moving out of the queue. Can you please check?
                </div>
              </div>
            </div>

            {/* Admin Reply */}
            <div className="flex gap-4 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center font-bold text-red-500 shrink-0">A</div>
              <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-2 mb-1 flex-row-reverse">
                  <span className="font-bold text-red-500">SuperAdmin</span>
                  <span className="text-xs text-foreground/50">Today at 10:22 AM</span>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-sm text-foreground/90 rounded-tr-none max-w-lg">
                  Hello! There was a brief lockup on node-mumbai-03. I have manually killed the stuck process and bumped you to the front of the queue. Your server should be online within 30 seconds.
                  <br/><br/>
                  I've also credited your account with 5 Credits for the inconvenience. Let me know if you need anything else!
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border/50 bg-background/50">
            <div className="flex gap-2">
              <textarea 
                className="flex-1 bg-card border border-border/50 rounded-xl p-3 text-sm resize-none outline-none focus:border-primary transition-colors"
                placeholder="Type your reply here..."
                rows={2}
              ></textarea>
              <Button className="bg-primary hover:bg-primary/90 text-white h-auto px-6">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
