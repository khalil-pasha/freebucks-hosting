"use client"
import React, { useState, useEffect, useRef } from "react"
import { Search, User, Server, MessageSquare, Activity, X } from "lucide-react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

export function AdminSearchbar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any>({ users: [], servers: [], tickets: [], logs: [] })
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ users: [], servers: [], tickets: [], logs: [] })
      setIsOpen(false)
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await api.get(`/admin/search?q=${encodeURIComponent(query)}`)
        setResults(res.data)
        setIsOpen(true)
      } catch (err) {
        console.error("Search failed:", err)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const hasResults = results.users.length > 0 || results.servers.length > 0 || results.tickets.length > 0 || results.logs.length > 0

  const navigateTo = (path: string) => {
    setIsOpen(false)
    setQuery("")
    router.push(path)
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm hidden sm:block z-50">
      <div className="flex items-center gap-2 bg-background border border-border/50 rounded-full px-4 py-2 w-full transition-colors focus-within:border-primary/50">
        <Search className="w-4 h-4 text-foreground/50" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users, servers, logs..." 
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-foreground/50"
        />
        {query && (
          <button onClick={() => { setQuery(""); setIsOpen(false); }} className="text-foreground/50 hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-foreground/50">Searching...</div>
          ) : !hasResults ? (
            <div className="p-4 text-center text-sm text-foreground/50">No results found for "{query}"</div>
          ) : (
            <div className="py-2">
              {results.users.length > 0 && (
                <div className="px-3 py-2">
                  <h3 className="text-xs font-bold text-foreground/50 uppercase mb-2 px-2">Users</h3>
                  {results.users.map((u: any) => (
                    <button key={u.id} onClick={() => navigateTo(`/admin/users/${u.id}`)} className="w-full text-left flex items-center gap-3 px-2 py-2 hover:bg-foreground/5 rounded-lg transition-colors">
                      <User className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-sm font-semibold">{u.username}</div>
                        <div className="text-xs text-foreground/50">{u.email || 'No email'}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.servers.length > 0 && (
                <div className="px-3 py-2 border-t border-border/50">
                  <h3 className="text-xs font-bold text-foreground/50 uppercase mb-2 px-2">Servers</h3>
                  {results.servers.map((s: any) => (
                    <button key={s.id} onClick={() => navigateTo(`/admin/servers`)} className="w-full text-left flex items-center gap-3 px-2 py-2 hover:bg-foreground/5 rounded-lg transition-colors">
                      <Server className="w-4 h-4 text-orange-500" />
                      <div>
                        <div className="text-sm font-semibold">{s.name}</div>
                        <div className="text-xs text-foreground/50">Owner: {s.user?.username || 'Unknown'}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.tickets.length > 0 && (
                <div className="px-3 py-2 border-t border-border/50">
                  <h3 className="text-xs font-bold text-foreground/50 uppercase mb-2 px-2">Support Tickets</h3>
                  {results.tickets.map((t: any) => (
                    <button key={t.id} onClick={() => navigateTo(`/admin/support`)} className="w-full text-left flex items-center gap-3 px-2 py-2 hover:bg-foreground/5 rounded-lg transition-colors">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-sm font-semibold">{t.subject}</div>
                        <div className="text-xs text-foreground/50">By {t.user?.username || 'Unknown'}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.logs.length > 0 && (
                <div className="px-3 py-2 border-t border-border/50">
                  <h3 className="text-xs font-bold text-foreground/50 uppercase mb-2 px-2">System Logs</h3>
                  {results.logs.map((l: any) => (
                    <button key={l.id} onClick={() => navigateTo(`/admin/logs`)} className="w-full text-left flex items-center gap-3 px-2 py-2 hover:bg-foreground/5 rounded-lg transition-colors">
                      <Activity className="w-4 h-4 text-foreground/70" />
                      <div>
                        <div className="text-sm font-semibold truncate">{l.action}</div>
                        <div className="text-xs text-foreground/50 truncate">Target: {l.resource}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
