"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import api from "@/lib/api";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/admin/auth/login", { username, password });
      router.push("/admin");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative z-50">
      <div className="absolute inset-0 bg-background z-40"></div>
      <Card className="w-full max-w-md bg-card border-border/50 shadow-2xl relative z-50">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Login</CardTitle>
          <CardDescription>Enter your admin credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Authenticating..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
