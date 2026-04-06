import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, MessageSquare, Send, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Chat as ChatType, Message, Profile, Book } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export function Chat() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [chat, setChat] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!id || !user) return;

    async function fetchChat() {
      try {
        const { data, error } = await supabase
          .from('chats')
          .select('*, book:books(*), buyer:profiles!chats_buyer_id_fkey(*), seller:profiles!chats_seller_id_fkey(*)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setChat(data);

        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', id)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;
        setMessages(messagesData || []);
      } catch (error) {
        console.error('Error fetching chat:', error);
        navigate('/chats');
      } finally {
        setIsLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    }

    fetchChat();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          setTimeout(scrollToBottom, 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user, navigate]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !id) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: id,
          sender_id: user.id,
          content: messageContent,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!chat) return null;

  const otherParticipant = chat.buyer_id === user?.id ? chat.seller : chat.buyer;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex h-[75vh] flex-col overflow-hidden rounded-3xl border bg-white shadow-2xl shadow-indigo-500/10 dark:bg-zinc-900 dark:border-zinc-800 transition-colors duration-300">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b bg-zinc-50/50 p-4 dark:bg-zinc-800/50 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              {otherParticipant?.avatar_url ? (
                <img
                  src={otherParticipant.avatar_url}
                  alt={otherParticipant.full_name || 'User'}
                  className="h-10 w-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <User size={20} />
                </div>
              )}
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white">{otherParticipant?.full_name || 'Anonymous'}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">Active now</p>
              </div>
            </div>
          </div>

          <Link
            to={`/book/${chat.book_id}`}
            className="flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-zinc-900 hover:bg-zinc-50 border dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-700 transition-all"
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">View Book</span>
          </Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {messages.length > 0 ? (
            messages.map((message, index) => {
              const isMe = message.sender_id === user?.id;
              const showDate = index === 0 || 
                format(new Date(message.created_at), 'yyyy-MM-dd') !== 
                format(new Date(messages[index-1].created_at), 'yyyy-MM-dd');

              return (
                <React.Fragment key={message.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500">
                        {format(new Date(message.created_at), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  <div className={cn(
                    "flex flex-col max-w-[80%]",
                    isMe ? "ml-auto items-end" : "mr-auto items-start"
                  )}>
                    <div className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                      isMe 
                        ? "bg-indigo-600 text-white rounded-tr-none" 
                        : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white rounded-tl-none"
                    )}>
                      {message.content}
                    </div>
                    <span className="mt-1 text-[10px] text-zinc-400">
                      {format(new Date(message.created_at), 'h:mm a')}
                    </span>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                <MessageSquare size={32} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">No messages yet</h3>
              <p className="text-sm text-zinc-500">Start the conversation about "{chat.book?.title}"</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="border-t bg-zinc-50/50 p-4 dark:bg-zinc-800/50 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
