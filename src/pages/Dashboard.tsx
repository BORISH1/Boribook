import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, ChevronRight, Edit3, MessageSquare, Package, Plus, Settings, ShoppingBag, Trash2, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Book as BookType, Order, Chat } from '../types';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

export function Dashboard() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'chats'>('listings');
  const [listings, setListings] = useState<BookType[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  async function fetchDashboardData() {
    setIsLoading(true);
    try {
      // Fetch Listings
      const { data: listingsData } = await supabase
        .from('books')
        .select('*')
        .eq('seller_id', user!.id)
        .order('created_at', { ascending: false });
      
      setListings(listingsData || []);

      // Fetch Orders (where user is buyer or seller)
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, book:books(*), buyer:profiles!orders_buyer_id_fkey(*), seller:profiles!orders_seller_id_fkey(*)')
        .or(`buyer_id.eq.${user!.id},seller_id.eq.${user!.id}`)
        .order('created_at', { ascending: false });
      
      setOrders(ordersData || []);

      // Fetch Chats
      const { data: chatsData } = await supabase
        .from('chats')
        .select('*, book:books(*), buyer:profiles!chats_buyer_id_fkey(*), seller:profiles!chats_seller_id_fkey(*)')
        .or(`buyer_id.eq.${user!.id},seller_id.eq.${user!.id}`)
        .order('created_at', { ascending: false });
      
      setChats(chatsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteListing = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (error) throw error;
      setListings(listings.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const tabs = [
    { id: 'listings', name: 'My Listings', icon: Book, count: listings.length },
    { id: 'orders', name: 'Orders', icon: ShoppingBag, count: orders.length },
    { id: 'chats', name: 'Chats', icon: MessageSquare, count: chats.length },
  ];

  if (isLoading || authLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10">
        {/* Profile Header */}
        <div className="flex flex-col gap-6 rounded-3xl bg-indigo-600 p-8 text-white shadow-2xl shadow-indigo-500/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'User'}
                className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white/20"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md">
                <User size={48} />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-black">{profile?.full_name || 'Book Lover'}</h1>
              <p className="text-indigo-100">{profile?.email}</p>
              <div className="mt-4 flex gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-md hover:bg-white/30 transition-all"
                >
                  <Settings size={14} />
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 sm:flex-col sm:items-end">
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-100">Total Earnings</p>
              <p className="text-3xl font-black">{formatCurrency(orders.filter(o => o.seller_id === user?.id && o.status === 'completed').reduce((acc, curr) => acc + curr.total_price, 0))}</p>
            </div>
            <Link
              to="/sell"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-indigo-600 hover:bg-zinc-50 transition-all shadow-lg"
            >
              <Plus size={20} />
              New Listing
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 text-sm font-bold transition-all",
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
              )}
            >
              <tab.icon size={18} />
              {tab.name}
              <span className={cn(
                "ml-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'listings' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.length > 0 ? (
                listings.map((listing) => (
                  <div key={listing.id} className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={listing.image_url || 'https://images.unsplash.com/photo-1543005120-8145e593c1ad?q=80&w=800&auto=format&fit=crop'}
                        alt={listing.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-zinc-900 dark:text-white line-clamp-1">{listing.title}</h3>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">{formatCurrency(listing.price)}</p>
                        </div>
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                          listing.is_sold ? "bg-zinc-100 text-zinc-500" : "bg-emerald-100 text-emerald-600"
                        )}>
                          {listing.is_sold ? 'Sold' : 'Active'}
                        </span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link
                          to={`/sell?edit=${listing.id}`}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-zinc-100 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-all"
                        >
                          <Edit3 size={14} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                  <Book size={48} className="text-zinc-300 dark:text-zinc-700" />
                  <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">No listings yet</h3>
                  <p className="text-zinc-500">Start selling your books today!</p>
                  <Link to="/sell" className="mt-6 rounded-xl bg-indigo-600 px-6 py-2 font-bold text-white hover:bg-indigo-700">
                    Create Listing
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="flex flex-col gap-4 rounded-2xl border bg-white p-4 dark:bg-zinc-900 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        <img
                          src={order.book?.image_url || ''}
                          alt={order.book?.title}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white">{order.book?.title}</h3>
                        <p className="text-sm text-zinc-500">
                          {order.buyer_id === user?.id ? `Bought from ${order.seller?.full_name}` : `Sold to ${order.buyer?.full_name}`}
                        </p>
                        <p className="text-xs text-zinc-400">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      <div className="text-right">
                        <p className="font-black text-zinc-900 dark:text-white">{formatCurrency(order.total_price)}</p>
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                          order.status === 'completed' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <Link
                        to={`/chats/${chats.find(c => c.book_id === order.book_id)?.id}`}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 hover:bg-indigo-600 hover:text-white dark:bg-zinc-800 dark:text-white dark:hover:bg-indigo-600 transition-all"
                      >
                        <MessageSquare size={18} />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Package size={48} className="text-zinc-300 dark:text-zinc-700" />
                  <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">No orders yet</h3>
                  <p className="text-zinc-500">Your order history will appear here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'chats' && (
            <div className="space-y-4">
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <Link
                    key={chat.id}
                    to={`/chats/${chat.id}`}
                    className="flex items-center justify-between rounded-2xl border bg-white p-4 hover:border-indigo-600 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-indigo-600 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {chat.buyer_id === user?.id ? (
                          chat.seller?.avatar_url ? (
                            <img src={chat.seller.avatar_url} alt="Seller" className="h-12 w-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"><User size={20} /></div>
                          )
                        ) : (
                          chat.buyer?.avatar_url ? (
                            <img src={chat.buyer.avatar_url} alt="Buyer" className="h-12 w-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"><User size={20} /></div>
                          )
                        )}
                        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white p-1 dark:bg-zinc-900">
                          <img src={chat.book?.image_url || ''} className="h-full w-full rounded-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white">
                          {chat.buyer_id === user?.id ? chat.seller?.full_name : chat.buyer?.full_name}
                        </h3>
                        <p className="text-sm text-zinc-500 line-clamp-1">Re: {chat.book?.title}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-zinc-400" size={20} />
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <MessageSquare size={48} className="text-zinc-300 dark:text-zinc-700" />
                  <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">No chats yet</h3>
                  <p className="text-zinc-500">Messages with buyers and sellers will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function for cn in this file
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
