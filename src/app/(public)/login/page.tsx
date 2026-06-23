"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Image from "next/image"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

function LoginContent() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://api.freebucks.host/auth/discord' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/auth/discord'
  const authUrl = redirectUrl ? `${baseUrl}?redirect=${encodeURIComponent(redirectUrl)}` : baseUrl

  const [isManualLogout, setIsManualLogout] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const manualLogout = typeof window !== 'undefined' && localStorage.getItem('freebucks_manual_logout') === 'true';
    
    if (manualLogout) {
      console.log("[Login] manual logout mode detected");
      setIsManualLogout(true);
      setChecking(false);
    } else {
      console.log("[Login] auto-redirecting to discord");
      window.location.href = authUrl;
    }
  }, [authUrl]);

  const handleLoginClick = () => {
    console.log("[Login] manual Discord login clicked");
    localStorage.removeItem('freebucks_manual_logout');
    window.location.href = authUrl;
  };

  if (checking) {
    return <div className="flex min-h-[80vh] items-center justify-center p-4 relative z-10"><p className="text-white">Redirecting to login...</p></div>;
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 bg-card/80 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5865F2] via-primary to-secondary" />
          <CardHeader className="text-center pb-2 pt-8">
            <div className="relative h-16 md:h-20 w-[140px] md:w-[220px] mb-6 mx-auto">
              <Image src="/logo2.png" alt="Free Bucks Logo" fill className="object-contain" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-base">
              Sign in to manage your servers and earn Bucks.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Button onClick={handleLoginClick} size="lg" className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center justify-center gap-3 h-12 text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
              Login with Discord
            </Button>
            <p className="mt-6 text-center text-sm text-foreground/60">
              By logging in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
