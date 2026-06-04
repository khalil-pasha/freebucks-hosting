"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Calendar, Shield, Activity, LogOut, Key } from "lucide-react"

const loginHistory = [
  { id: 1, ip: "192.168.1.1", location: "Mumbai, India", date: "Today, 10:42 AM", device: "Windows • Chrome" },
  { id: 2, ip: "192.168.1.1", location: "Mumbai, India", date: "Yesterday, 08:15 PM", device: "Windows • Chrome" },
  { id: 3, ip: "10.0.0.45", location: "Delhi, India", date: "May 10, 2026", device: "iOS • Safari" },
]

export default function ProfilePage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Profile</h1>
        <p className="text-foreground/60 mt-1">Manage your connected accounts and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Discord Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-[#5865F2]/30 shadow-lg shadow-[#5865F2]/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#5865F2]" />
            <CardContent className="pt-8 flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-card overflow-hidden">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Steve" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-success rounded-full border-4 border-card" />
              </div>
              <h2 className="text-xl font-bold mt-4">_NightBlade_</h2>
              <p className="text-sm text-foreground/50 mb-6">nightblade</p>
              
              <div className="w-full space-y-3">
                <div className="flex justify-between text-sm p-3 bg-background rounded-lg border border-border/50">
                  <span className="text-foreground/60 flex items-center gap-2"><Calendar className="w-4 h-4"/> Joined</span>
                  <span className="font-medium">March 15, 2026</span>
                </div>
                <div className="flex justify-between text-sm p-3 bg-background rounded-lg border border-border/50">
                  <span className="text-foreground/60 flex items-center gap-2"><Shield className="w-4 h-4"/> Status</span>
                  <span className="font-medium text-success">Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Lifetime Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground/60">Total Credits Earned</span>
                  <span className="font-bold">142.5</span>
                </div>
                <div className="w-full h-1 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-success w-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground/60">Servers Created</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="w-full h-1 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Security & API */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border/50 rounded-xl bg-background/50">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2"><Key className="w-4 h-4 text-primary" /> Panel Password</h4>
                    <p className="text-sm text-foreground/60 mt-1">Used to login to your Pterodactyl game panel directly.</p>
                  </div>
                  <Button variant="outline">Reset Password</Button>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border/50 rounded-xl bg-background/50">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> Email Notifications</h4>
                    <p className="text-sm text-foreground/60 mt-1">Receive alerts when your server is about to expire.</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login History */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="w-5 h-5 text-foreground/60" /> Login Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loginHistory.map((login) => (
                  <div key={login.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-background border border-border/50 rounded-xl gap-4">
                    <div>
                      <p className="font-bold flex items-center gap-2">
                        {login.device}
                        {login.id === 1 && <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-success/20 text-success border border-success/30">Current</span>}
                      </p>
                      <p className="text-xs text-foreground/50 mt-1">{login.location} • {login.ip}</p>
                    </div>
                    <div className="text-sm text-foreground/60 whitespace-nowrap">
                      {login.date}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Sign Out from All Devices
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
