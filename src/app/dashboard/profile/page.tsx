"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Calendar, Shield, Activity, LogOut, Key, Edit2, Loader2, X } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"
import { useState, useRef } from "react"
import api from "@/lib/api"

const loginHistory = [
  { id: 1, ip: "192.168.1.1", location: "Mumbai, India", date: "Today, 10:42 AM", device: "Windows • Chrome" },
  { id: 2, ip: "192.168.1.1", location: "Mumbai, India", date: "Yesterday, 08:15 PM", device: "Windows • Chrome" },
  { id: 3, ip: "10.0.0.45", location: "Delhi, India", date: "May 10, 2026", device: "iOS • Safari" },
]

export default function ProfilePage() {
  const { user, logout, refetchUser } = useAuth()
  
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [resetStep, setResetStep] = useState<1 | 2>(1)
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [isSavingEmail, setIsSavingEmail] = useState(false)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB")
      return
    }

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert("Unsupported file format. Use PNG, JPG, JPEG, or WEBP.")
      return
    }

    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64 = event.target?.result as string
      try {
        setIsUploading(true)
        await api.post('/profile/avatar', { imageBase64: base64 })
        await refetchUser()
        alert("Avatar updated successfully")
      } catch (error: any) {
        alert(error.response?.data?.error || "Failed to update avatar")
      } finally {
        setIsUploading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      return alert("Please enter a valid email.")
    }
    try {
      setIsSavingEmail(true)
      await api.patch('/profile/email', { email: newEmail })
      await refetchUser()
      setIsEditingEmail(false)
      alert("Email updated successfully.")
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to update email.")
    } finally {
      setIsSavingEmail(false)
    }
  }

  const handleSendOtp = async () => {
    try {
      setIsSendingOtp(true)
      const res = await api.post('/profile/send-password-otp')
      alert(res.data.message || "OTP sent to your email.")
      setResetStep(2)
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to send OTP.")
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      return alert("Password must be at least 8 characters long.")
    }
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match.")
    }
    if (!otp) {
      return alert("Please enter the OTP.")
    }

    try {
      setIsResetting(true)
      const res = await api.post('/profile/reset-panel-password', {
        otp,
        newPassword,
        confirmPassword
      })
      alert(res.data.message || "Panel password updated successfully.")
      setIsResetModalOpen(false)
      // Reset state
      setResetStep(1)
      setOtp("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to reset password.")
    } finally {
      setIsResetting(false)
    }
  }

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
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <div className="w-24 h-24 rounded-full bg-background border-4 border-card overflow-hidden relative">
                   {isUploading ? (
                     <div className="w-full h-full flex items-center justify-center bg-black/50">
                       <Loader2 className="w-6 h-6 animate-spin text-white" />
                     </div>
                   ) : (
                     <>
                       <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Steve'}`} alt="Avatar" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Edit2 className="w-6 h-6 text-white" />
                       </div>
                     </>
                   )}
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-success rounded-full border-4 border-card" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
              />
              <h2 className="text-xl font-bold mt-4 mb-2">{user?.username || "Loading..."}</h2>
              
              {isEditingEmail ? (
                <div className="flex flex-col gap-2 w-full max-w-xs mb-6 mx-auto">
                  <Input 
                    value={newEmail} 
                    onChange={(e) => setNewEmail(e.target.value)} 
                    placeholder="Email address" 
                    className="h-8 text-sm" 
                  />
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" onClick={handleSaveEmail} disabled={isSavingEmail}>
                      {isSavingEmail ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null} Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingEmail(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-6 justify-center">
                  <p className="text-sm text-foreground/50">{user?.email || "No email linked"}</p>
                  <button onClick={() => { setNewEmail(user?.email || ""); setIsEditingEmail(true); }} className="text-foreground/50 hover:text-foreground">
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              <div className="w-full space-y-3">
                <div className="flex justify-between text-sm p-3 bg-background rounded-lg border border-border/50">
                  <span className="text-foreground/60 flex items-center gap-2"><Calendar className="w-4 h-4"/> Joined</span>
                  <span className="font-medium">{user ? new Date(user.createdAt).toLocaleDateString() : '...'}</span>
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
                  <Button variant="outline" onClick={() => setIsResetModalOpen(true)}>Reset Password</Button>
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
            <Button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Sign Out from All Devices
            </Button>
          </div>
        </div>
      </div>

      {/* Custom Password Reset Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border/50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Reset Panel Password</h3>
                <button onClick={() => { setIsResetModalOpen(false); setResetStep(1); }} className="text-foreground/50 hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-foreground/60 mb-6">
                {resetStep === 1 
                  ? "We will send a 6-digit OTP to your registered email address to verify your identity." 
                  : "Enter the OTP sent to your email along with your new password."}
              </p>

              {resetStep === 1 ? (
                <div className="py-2">
                  {user?.email ? (
                    <p className="text-sm text-foreground/80">
                      Email: <strong className="text-foreground">{user?.email}</strong>
                    </p>
                  ) : (
                    <p className="text-sm text-red-500 font-medium">
                      Please add your email before resetting panel password.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">OTP Code</label>
                    <Input 
                      placeholder="123456" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)} 
                      maxLength={6}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">New Password</label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-background/50 border-t border-border/50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setIsResetModalOpen(false)
                setResetStep(1)
              }}>
                Cancel
              </Button>
              {resetStep === 1 ? (
                <Button onClick={handleSendOtp} disabled={isSendingOtp || !user?.email}>
                  {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Send OTP
                </Button>
              ) : (
                <Button onClick={handleResetPassword} disabled={isResetting}>
                  {isResetting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Reset Password
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
