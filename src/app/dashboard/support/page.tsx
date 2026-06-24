"use client"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LifeBuoy, MessageSquare, BookOpen, ExternalLink, HelpCircle, AlertCircle, RefreshCw, Send, Plus, ChevronLeft } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  const [subject, setSubject] = useState("")
  const [serverId, setServerId] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const [replyText, setReplyText] = useState("")
  const [replyLoading, setReplyLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchTickets = async () => {
    try {
      const res = await api.get('/support/tickets')
      console.log("[Support] tickets loaded", res.data);
      setTickets(res.data)
      
      if (res.data.length > 0 && !isCreating) {
        // If we don't have a selected ticket, try to pick one
        if (!selectedTicketId) {
          const stored = localStorage.getItem('freebucks_last_ticket');
          const exists = res.data.find((t: any) => t.id === stored);
          
          let selectedId;
          if (stored && exists) {
            selectedId = stored;
          } else {
            // Pick latest OPEN/PENDING or just the first one
            const active = res.data.find((t: any) => t.status !== 'CLOSED');
            selectedId = active ? active.id : res.data[0].id;
          }
          console.log("[Support] selected ticket", selectedId);
          setSelectedTicketId(selectedId);
        }
      } else if (res.data.length === 0) {
        setIsCreating(true)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchSelectedTicket = async (id: string) => {
    try {
      const res = await api.get(`/support/tickets/${id}`)
      console.log("[Support] messages loaded", res.data.messages);
      setSelectedTicket(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTickets()
    // Poll ticket list every 3 seconds
    const interval = setInterval(() => {
      fetchTickets()
    }, 3000)
    return () => clearInterval(interval)
  }, [isCreating, selectedTicketId])

  useEffect(() => {
    if (selectedTicketId && !isCreating) {
      localStorage.setItem('freebucks_last_ticket', selectedTicketId);
      fetchSelectedTicket(selectedTicketId)
      // Poll active ticket every 3 seconds
      const interval = setInterval(() => {
        fetchSelectedTicket(selectedTicketId)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [selectedTicketId, isCreating])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedTicket?.messages])

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!subject || subject.length < 3) {
      setErrorMsg("Subject must be at least 3 characters.");
      return;
    }
    if (!message || message.length < 10) {
      setErrorMsg("Message must be at least 10 characters.");
      return;
    }

    setLoading(true);
    try {
      const fullMessage = serverId ? `Server ID: ${serverId}\n\n${message}` : message;
      const res = await api.post('/support/tickets', {
        subject,
        message: fullMessage
      });
      setSuccessMsg("Ticket submitted successfully! Redirecting to chat...");
      setSubject("");
      setServerId("");
      setMessage("");
      
      // Auto switch to chat view
      setTimeout(() => {
        setIsCreating(false)
        setSelectedTicketId(res.data.id)
      }, 1000)
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || "Failed to submit ticket.");
    } finally {
      setLoading(false);
    }
  }

  const handleReply = async () => {
    if (!replyText || replyText.trim().length === 0 || !selectedTicketId) return;
    setReplyLoading(true);
    try {
      // Optimistic UI update
      setSelectedTicket((prev: any) => ({
        ...prev,
        messages: [...(prev?.messages || []), { id: 'temp', message: replyText, isStaffReply: false, createdAt: new Date().toISOString() }]
      }))
      await api.post(`/support/tickets/${selectedTicketId}/reply`, { message: replyText })
      setReplyText("")
      await fetchSelectedTicket(selectedTicketId)
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.error || "Failed to send reply.")
    } finally {
      setReplyLoading(false);
    }
  }

  const handleCreateNew = () => {
    setSelectedTicketId(null)
    setIsCreating(true)
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
          <p className="text-foreground/60 mt-1">Need help with your server? We've got you covered.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Left Pane: Ticket List */}
        <Card className="bg-card border-border/50 col-span-1 flex flex-col overflow-hidden hidden lg:flex">
          <div className="p-4 border-b border-border/50">
            <Button onClick={handleCreateNew} className="w-full bg-primary hover:bg-primary/90 text-white"><Plus className="w-4 h-4 mr-2"/> New Ticket</Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {tickets.length === 0 ? (
              <div className="flex justify-center items-center h-32 text-foreground/50 text-sm">
                No tickets found.
              </div>
            ) : tickets.map((t) => (
              <div 
                key={t.id} 
                onClick={() => { 
                  setSelectedTicketId(t.id); 
                  localStorage.setItem('freebucks_last_ticket', t.id);
                  setIsCreating(false); 
                }}
                className={`p-4 rounded-xl cursor-pointer border transition-colors ${
                  t.id === selectedTicketId && !isCreating ? "bg-primary/10 border-primary/30" : "bg-background border-border/50 hover:bg-foreground/5"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-bold text-sm truncate pr-2 ${t.id === selectedTicketId && !isCreating ? "text-primary" : ""}`}>{t.subject}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    t.status === 'OPEN' ? 'bg-success/20 text-success' :
                    t.status === 'PENDING' ? 'bg-orange-500/20 text-orange-500' :
                    'bg-foreground/10 text-foreground/50'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-foreground/50">#{t.id.slice(-4)}</span>
                  <span className="text-[10px] text-foreground/50">{new Date(t.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Pane: Chat or Create Form */}
        <Card className="bg-card border-border/50 col-span-1 lg:col-span-2 flex flex-col overflow-hidden">
          {isCreating ? (
            <div className="flex-1 overflow-y-auto p-6 bg-background">
              <div className="flex items-center gap-2 mb-6 lg:hidden">
                <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}><ChevronLeft className="w-4 h-4 mr-1"/> Back</Button>
              </div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary" /> Create New Ticket
              </h2>
              
              <div className="space-y-4 max-w-2xl">
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-start gap-3 text-orange-500 text-sm mb-6">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>For urgent server down issues, please ping the @Support team directly in our Discord server for immediate assistance.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input 
                      placeholder="e.g., Server stuck starting" 
                      className="bg-card border-border/50" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Server ID (Optional)</label>
                    <Input 
                      placeholder="fb-192a" 
                      className="bg-card border-border/50 font-mono" 
                      value={serverId}
                      onChange={(e) => setServerId(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    placeholder="Describe your issue in detail..." 
                    className="min-h-[120px] bg-card border-border/50"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                
                {errorMsg && <p className="text-red-500 text-sm font-medium">{errorMsg}</p>}
                {successMsg && <p className="text-emerald-500 text-sm font-medium">{successMsg}</p>}

                <div className="flex justify-end pt-2">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading} 
                    className="bg-primary hover:bg-primary/90 text-white px-8"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Submit Ticket
                  </Button>
                </div>
              </div>
            </div>
          ) : selectedTicket ? (
            <>
              <div className="p-4 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-background/50 gap-4">
                <div className="flex items-center gap-2 lg:hidden">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTicketId(null)} className="-ml-2"><ChevronLeft className="w-4 h-4 mr-1"/> Tickets</Button>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold truncate max-w-sm">{selectedTicket.subject}</h2>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      selectedTicket.status === 'OPEN' ? 'bg-success/20 text-success' :
                      selectedTicket.status === 'PENDING' ? 'bg-orange-500/20 text-orange-500' :
                      'bg-foreground/10 text-foreground/50'
                    }`}>{selectedTicket.status}</span>
                  </div>
                  <p className="text-xs text-foreground/50 mt-1">Ticket #{selectedTicket.id.slice(-4)} • Opened {new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-background">
                {selectedTicket.messages?.map((msg: any) => {
                  const isUser = !msg.isStaffReply;
                  return (
                    <div key={msg.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-xs font-bold text-foreground/70">{isUser ? 'You' : 'Support Staff'}</span>
                          <span className="text-[10px] text-foreground/40">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className={`p-3 md:p-4 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${
                          isUser 
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
                      placeholder="Type your reply..."
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
                          handleReply();
                        }
                      }}
                    ></textarea>
                    <Button 
                      onClick={handleReply} 
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
              <p>Select a ticket from the left or create a new one.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
