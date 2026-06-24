"use client"
import { useEffect, useState, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MessageSquare, Send, XCircle, MoreVertical, RefreshCw } from "lucide-react"
import api from "@/lib/api"

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [filter, setFilter] = useState<'OPEN' | 'PENDING' | 'CLOSED'>('OPEN')
  const [replyText, setReplyText] = useState("")
  const [replyLoading, setReplyLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchTickets = async () => {
    try {
      const res = await api.get('/admin/core/tickets')
      setTickets(res.data)
      if (res.data.length > 0 && !selectedTicketId) {
        setSelectedTicketId(res.data[0].id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSelectedTicket = async (id: string) => {
    try {
      const res = await api.get(`/admin/support/tickets/${id}`)
      setSelectedTicket(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTickets()
    const interval = setInterval(() => {
      fetchTickets()
    }, 3000)
    return () => clearInterval(interval)
  }, [selectedTicketId])

  useEffect(() => {
    if (selectedTicketId) {
      fetchSelectedTicket(selectedTicketId)
      const interval = setInterval(() => {
        fetchSelectedTicket(selectedTicketId)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [selectedTicketId])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedTicket?.messages])

  const filteredTickets = tickets.filter(t => t.status === filter)

  const handleClose = async (id: string) => {
    if (!confirm("Are you sure you want to close this ticket?")) return;
    try {
      await api.post(`/admin/support/tickets/${id}/close`)
      fetchTickets()
      fetchSelectedTicket(id)
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.error || "Failed to close ticket.")
    }
  }

  const handleReply = async (id: string) => {
    if (!replyText || replyText.trim().length === 0) return;
    setReplyLoading(true);
    try {
      // Optimistic UI update
      setSelectedTicket((prev: any) => ({
        ...prev,
        messages: [...(prev?.messages || []), { id: 'temp', message: replyText, isStaffReply: true, createdAt: new Date().toISOString() }]
      }))
      await api.post(`/admin/support/tickets/${id}/reply`, { message: replyText })
      setReplyText("")
      await fetchSelectedTicket(id)
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.error || "Failed to send reply.")
    } finally {
      setReplyLoading(false);
    }
  }

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
               <Button size="sm" variant={filter === 'PENDING' ? 'default' : 'ghost'} onClick={() => setFilter('PENDING')} className={filter === 'PENDING' ? "bg-primary/20 text-primary hover:bg-primary/30 flex-1 text-xs" : "text-foreground/60 hover:text-foreground flex-1 text-xs"}>Wait Admin</Button>
               <Button size="sm" variant={filter === 'OPEN' ? 'default' : 'ghost'} onClick={() => setFilter('OPEN')} className={filter === 'OPEN' ? "bg-primary/20 text-primary hover:bg-primary/30 flex-1 text-xs" : "text-foreground/60 hover:text-foreground flex-1 text-xs"}>Wait User</Button>
               <Button size="sm" variant={filter === 'CLOSED' ? 'default' : 'ghost'} onClick={() => setFilter('CLOSED')} className={filter === 'CLOSED' ? "bg-primary/20 text-primary hover:bg-primary/30 flex-1 text-xs" : "text-foreground/60 hover:text-foreground flex-1 text-xs"}>Closed</Button>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loading ? (
              <div className="flex justify-center items-center h-32 text-foreground/50">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading...
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="flex justify-center items-center h-32 text-foreground/50">
                No tickets found.
              </div>
            ) : filteredTickets.map((t) => (
              <div 
                key={t.id} 
                onClick={() => setSelectedTicketId(t.id)}
                className={`p-4 rounded-xl cursor-pointer border transition-colors ${
                  t.id === selectedTicketId ? "bg-primary/10 border-primary/30" : "bg-background border-border/50 hover:bg-foreground/5"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-bold text-sm truncate pr-2 ${t.id === selectedTicketId ? "text-primary" : ""}`}>{t.user?.username}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    t.status === 'PENDING' ? 'bg-orange-500/20 text-orange-500' :
                    t.status === 'OPEN' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-foreground/10 text-foreground/50'
                  }`}>
                    {t.status === 'PENDING' ? 'WAIT ADMIN' : t.status === 'OPEN' ? 'WAIT USER' : t.status}
                  </span>
                </div>
                <p className={`text-sm mb-2 truncate ${t.id === selectedTicketId ? "text-foreground" : "text-foreground/70"}`}>
                  {t.subject}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-foreground/50 font-mono">#{t.id.slice(-4)}</span>
                  <span className="text-[10px] text-foreground/50">{new Date(t.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Conversation Pane */}
        <Card className="bg-card border-border/50 col-span-1 md:col-span-2 flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              <div className="p-4 border-b border-border/50 flex justify-between items-center bg-background/50">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold">{selectedTicket.subject}</h2>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      selectedTicket.status === 'PENDING' ? 'bg-orange-500/20 text-orange-500' :
                      selectedTicket.status === 'OPEN' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-foreground/10 text-foreground/50'
                    }`}>{selectedTicket.status === 'PENDING' ? 'WAIT ADMIN' : selectedTicket.status === 'OPEN' ? 'WAIT USER' : selectedTicket.status}</span>
                  </div>
                  <p className="text-xs text-foreground/50 mt-1">Ticket #{selectedTicket.id.slice(-4)} • {selectedTicket.user?.username}</p>
                </div>
                <div className="flex gap-2">
                  {selectedTicket.status !== 'CLOSED' && (
                    <Button onClick={() => handleClose(selectedTicket.id)} variant="outline" size="sm" className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"><XCircle className="w-4 h-4 mr-2"/> Close Ticket</Button>
                  )}
                  <Button variant="ghost" size="icon" className="w-8 h-8"><MoreVertical className="w-4 h-4"/></Button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-background">
                {selectedTicket.messages?.map((msg: any) => {
                  const isAdmin = msg.isStaffReply;
                  return (
                    <div key={msg.id} className={`flex w-full ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isAdmin ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-xs font-bold text-foreground/70">{isAdmin ? 'You' : selectedTicket.user?.username}</span>
                          <span className="text-[10px] text-foreground/40">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className={`p-3 md:p-4 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${
                          isAdmin 
                            ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                            : 'bg-card border border-border/50 text-card-foreground rounded-tl-sm'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
                {selectedTicket.status !== 'CLOSED' ? (
                  <div className="flex gap-2">
                    <textarea 
                      className="flex-1 bg-card border border-border/50 rounded-xl p-3 text-sm resize-none outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/50"
                      placeholder="Type your reply here..."
                      rows={1}
                      style={{ minHeight: '52px', maxHeight: '120px' }}
                      value={replyText}
                      onChange={(e) => {
                        setReplyText(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleReply(selectedTicket.id);
                        }
                      }}
                    ></textarea>
                    <Button 
                      onClick={() => handleReply(selectedTicket.id)} 
                      disabled={replyLoading}
                      className="bg-primary hover:bg-primary/90 text-white h-[52px] w-[52px] rounded-xl shrink-0"
                    >
                      {replyLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-3 bg-foreground/5 rounded-xl border border-border/50 text-foreground/50 text-sm">
                    This ticket has been closed. You cannot reply.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-background text-foreground/50 flex-col gap-4">
              <MessageSquare className="w-12 h-12 text-border" />
              <p>Select a ticket to view details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
