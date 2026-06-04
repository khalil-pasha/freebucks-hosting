"use client"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MoreVertical, Ban, Coins, Eye } from "lucide-react"

const users = [
  { id: "1001", discordId: "123456789", username: "_NightBlade_", credits: 142.5, servers: 2, joinDate: "Jan 15, 2026", status: "Active" },
  { id: "1002", discordId: "987654321", username: "PvP_Master99", credits: 5.0, servers: 1, joinDate: "Feb 02, 2026", status: "Active" },
  { id: "1003", discordId: "456123789", username: "BuilderBob", credits: 0.0, servers: 0, joinDate: "Mar 10, 2026", status: "Banned" },
  { id: "1004", discordId: "321654987", username: "RedstoneGenius", credits: 35.0, servers: 1, joinDate: "Apr 20, 2026", status: "Active" },
  { id: "1005", discordId: "789123456", username: "MinecraftPro", credits: 1200.0, servers: 3, joinDate: "Dec 05, 2025", status: "Active" },
]

export default function AdminUsersPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-foreground/60 mt-1">View and manage all registered users.</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border/50 rounded-lg px-3 py-2 w-full sm:w-64">
          <Search className="w-4 h-4 text-foreground/50" />
          <input 
            type="text" 
            placeholder="Search by Discord ID or Username..." 
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
      </div>

      <Card className="bg-card border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-foreground/50 uppercase bg-background/50 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Discord ID</th>
                <th className="px-6 py-4 font-medium">Username</th>
                <th className="px-6 py-4 font-medium">Credits</th>
                <th className="px-6 py-4 font-medium">Servers</th>
                <th className="px-6 py-4 font-medium">Join Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{user.discordId}</td>
                  <td className="px-6 py-4 font-medium">{user.username}</td>
                  <td className="px-6 py-4 font-bold text-success flex items-center gap-1">
                    <Coins className="w-3 h-3" /> {user.credits}
                  </td>
                  <td className="px-6 py-4">{user.servers}</td>
                  <td className="px-6 py-4 text-foreground/70">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      user.status === "Active" ? "bg-success/20 text-success" : "bg-red-500/20 text-red-500"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link href={`/admin/users/${user.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/50 hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
