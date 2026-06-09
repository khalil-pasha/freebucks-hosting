"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Save, Server, Users, Coins } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-foreground/60 mt-1">Configure global variables for the Free Bucks ecosystem.</p>
      </div>

      <div className="space-y-6">
        {/* Economy Settings */}
        <Card className="bg-card border-border/50">
          <CardHeader className="bg-background/50 border-b border-border/50">
            <CardTitle className="text-lg flex items-center gap-2"><Coins className="w-5 h-5 text-success" /> Economy & Rewards</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Daily Credit Cap</label>
                <Input type="number" defaultValue="35" className="bg-background" />
                <p className="text-xs text-foreground/50">Max credits a free user can earn per day.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hourly Claim Amount</label>
                <Input type="number" defaultValue="1.5" className="bg-background" />
                <p className="text-xs text-foreground/50">Credits given per hourly click.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Referral Reward (Sender)</label>
                <Input type="number" defaultValue="25" className="bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Referral Reward (Receiver)</label>
                <Input type="number" defaultValue="50" className="bg-background" />
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white"><Save className="w-4 h-4 mr-2" /> Save Economy Settings</Button>
          </CardContent>
        </Card>

        {/* Server Pricing */}
        <Card className="bg-card border-border/50">
          <CardHeader className="bg-background/50 border-b border-border/50">
            <CardTitle className="text-lg flex items-center gap-2"><Server className="w-5 h-5 text-secondary" /> Server Pricing (Credits/hr)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">2GB Server Rate</label>
                <Input type="number" defaultValue="1.5" className="bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">4GB Server Rate</label>
                <Input type="number" defaultValue="3.0" className="bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">6GB Server Rate</label>
                <Input type="number" defaultValue="6.0" className="bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">8GB+ Server Rate</label>
                <Input disabled defaultValue="Premium Only" className="bg-background/50 text-foreground/50" />
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white"><Save className="w-4 h-4 mr-2" /> Save Server Pricing</Button>
          </CardContent>
        </Card>

        {/* Queue Limits */}
        <Card className="bg-card border-border/50">
          <CardHeader className="bg-background/50 border-b border-border/50">
            <CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5 text-orange-500" /> Queue & Node Limits</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Concurrent Starts</label>
                <Input type="number" defaultValue="5" className="bg-background" />
                <p className="text-xs text-foreground/50">How many servers the allocator can start simultaneously.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Global Server Cap</label>
                <Input type="number" defaultValue="5000" className="bg-background" />
                <p className="text-xs text-foreground/50">Hard limit on total running free servers.</p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white"><Save className="w-4 h-4 mr-2" /> Save Queue Settings</Button>
          </CardContent>
        </Card>
        {/* Security Settings */}
        <Card className="bg-card border-border/50">
          <CardHeader className="bg-background/50 border-b border-border/50">
            <CardTitle className="text-lg flex items-center gap-2"><Settings className="w-5 h-5 text-zinc-400" /> Security</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const currentPassword = (form.elements.namedItem('currentPassword') as HTMLInputElement).value;
              const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
              const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
              
              if (newPassword !== confirmPassword) {
                alert("Passwords do not match");
                return;
              }
              try {
                const api = (await import('@/lib/api')).default;
                await api.post('/admin/auth/change-password', { currentPassword, newPassword });
                alert("Password changed successfully");
                form.reset();
              } catch(err: any) {
                alert(err.response?.data?.error || "Failed to change password");
              }
            }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-full md:col-span-1">
                <label className="text-sm font-medium">Current Password</label>
                <Input name="currentPassword" type="password" required className="bg-background" />
              </div>
              <div className="space-y-2 col-span-full md:col-span-1">
                <label className="text-sm font-medium">New Password</label>
                <Input name="newPassword" type="password" required className="bg-background" />
              </div>
              <div className="space-y-2 col-span-full md:col-span-1">
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input name="confirmPassword" type="password" required className="bg-background" />
              </div>
              <div className="col-span-full">
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white"><Save className="w-4 h-4 mr-2" /> Update Password</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
