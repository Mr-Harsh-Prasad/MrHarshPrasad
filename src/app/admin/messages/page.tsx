'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Search,
  Loader2,
  Trash2,
  Mail,
  MailOpen,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Check,
} from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface PaginatedResponse {
  success: boolean;
  data: Message[];
  total: number;
  unread: number;
  page: number;
  limit: number;
  totalPages: number;
  error?: string;
}

export default function MessagesPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [unread, setUnread] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/admin/messages?${params}`);
      const data: PaginatedResponse = await res.json();
      if (data.success) {
        setMessages(data.data);
        setTotal(data.total);
        setUnread(data.unread);
        setTotalPages(data.totalPages);
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to fetch messages', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast({ title: 'Error', description: 'Failed to fetch messages', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, searchQuery]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Deleted', description: 'Message deleted successfully', variant: 'success' });
        fetchMessages();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to delete message', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast({ title: 'Error', description: 'Failed to delete message', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
        setUnread(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleView = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.isRead) handleMarkAsRead(msg.id);
  };

  const closeModal = () => setSelectedMessage(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Messages
          </h1>
          <p className="text-gray-400 mt-1">Contact form submissions</p>
        </div>
        {unread > 0 && (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm">
            <MessageSquare className="w-4 h-4" />
            {unread} unread
          </span>
        )}
      </div>

      <Card>
        <CardContent className="p-4 pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-lime-400" /></div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No messages yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-10">Status</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">From</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subject</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Preview</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {messages.map((msg) => (
                    <tr key={msg.id} className={`hover:bg-white/5 transition-colors cursor-pointer ${!msg.isRead ? 'bg-lime-400/5' : ''}`} onClick={() => handleView(msg)}>
                      <td className="p-4">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${!msg.isRead ? 'bg-lime-400' : 'bg-gray-600'}`}>
                          {!msg.isRead ? <Mail className="w-3 h-3 text-black" /> : <Check className="w-3 h-3 text-gray-400" />}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-white">{msg.name}</p>
                          <p className="text-sm text-gray-500">{msg.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-white truncate max-w-xs">{msg.subject || '(No subject)'}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="text-sm text-gray-400 truncate max-w-xs">{msg.message}</p>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-sm text-gray-500">
                        {format(new Date(msg.createdAt), 'MMM d, yyyy HH:mm')}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                          disabled={deletingId === msg.id}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                          title="Delete"
                        >
                          {deletingId === msg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-white/10">
              <p className="text-sm text-gray-400">Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} messages</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
          <div className="glass-strong max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{selectedMessage.subject || '(No subject)'}</h2>
                  <p className="text-gray-400 mt-1">From {selectedMessage.name} {`<`}{selectedMessage.email}{`>`}</p>
                  <p className="text-sm text-gray-500 mt-1">{format(new Date(selectedMessage.createdAt), 'MMMM d, yyyy HH:mm')}</p>
                </div>
                <button onClick={closeModal} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="whitespace-pre-wrap text-gray-300">{selectedMessage.message}</p>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                {!selectedMessage.isRead && (
                  <Button onClick={() => handleMarkAsRead(selectedMessage.id)} variant="outline" className="gap-2">
                    <MailOpen className="w-4 h-4" />
                    Mark as Read
                  </Button>
                )}
                <Button onClick={closeModal} variant="outline">Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}