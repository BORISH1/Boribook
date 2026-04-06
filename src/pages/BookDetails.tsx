import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Book as BookIcon, Calendar, Check, MessageSquare, Shield, ShoppingCart, Star, Tag, User, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Book, Profile } from '../types';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

export function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBook() {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*, seller:profiles(*)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setBook(data);
      } catch (error) {
        console.error('Error fetching book:', error);
        setError('Book not found or an error occurred.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBook();
  }, [id]);

  const handleOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!book) return;

    setIsOrdering(true);
    try {
      // 1. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          seller_id: book.seller_id,
          book_id: book.id,
          total_price: book.price,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Chat
      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .upsert({
          buyer_id: user.id,
          seller_id: book.seller_id,
          book_id: book.id,
        }, { onConflict: 'buyer_id,seller_id,book_id' })
        .select()
        .single();

      if (chatError) throw chatError;

      // 3. Mark book as sold (optional, maybe wait for confirmation)
      // await supabase.from('books').update({ is_sold: true }).eq('id', book.id);

      navigate(`/chats/${chat.id}`);
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  const handleChat = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!book) return;

    try {
      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .upsert({
          buyer_id: user.id,
          seller_id: book.seller_id,
          book_id: book.id,
        }, { onConflict: 'buyer_id,seller_id,book_id' })
        .select()
        .single();

      if (chatError) throw chatError;
      navigate(`/chats/${chat.id}`);
    } catch (error) {
      console.error('Error opening chat:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle size={40} />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-white">{error || 'Book not found'}</h2>
        <Link to="/explore" className="mt-6 inline-block rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white hover:bg-indigo-700 transition-all">
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 shadow-2xl"
        >
          <img
            src={book.image_url || 'https://images.unsplash.com/photo-1543005120-8145e593c1ad?q=80&w=800&auto=format&fit=crop'}
            alt={book.title}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className={cn(
              "px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full shadow-lg",
              book.condition === 'New' 
                ? "bg-emerald-500 text-white" 
                : "bg-amber-500 text-white"
            )}>
              {book.condition}
            </span>
            {book.is_for_rent && (
              <span className="px-4 py-1.5 text-xs font-black uppercase tracking-widest bg-indigo-600 text-white rounded-full shadow-lg">
                Available for Rent
              </span>
            )}
          </div>
        </motion.div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Tag size={16} />
            {book.category}
          </div>
          
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white sm:text-5xl leading-tight">
            {book.title}
          </h1>
          <p className="mt-2 text-xl text-zinc-500 dark:text-zinc-400">
            by <span className="font-bold text-zinc-900 dark:text-white">{book.author}</span>
          </p>

          <div className="mt-8 flex items-center gap-4 border-y py-6 dark:border-zinc-800">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">Price</span>
              <span className="text-4xl font-black text-zinc-900 dark:text-white">
                {formatCurrency(book.price)}
              </span>
            </div>
            {book.is_for_rent && book.rent_duration && (
              <div className="flex flex-col border-l pl-6 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">Duration</span>
                <span className="text-xl font-bold text-zinc-900 dark:text-white">
                  {book.rent_duration}
                </span>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">Description</h3>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {book.description || 'No description provided for this book.'}
            </p>
          </div>

          {/* Seller Info */}
          <div className="mt-10 rounded-3xl bg-zinc-50 p-6 dark:bg-zinc-900/50 border dark:border-zinc-800">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-4">Seller Information</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {book.seller?.avatar_url ? (
                  <img
                    src={book.seller.avatar_url}
                    alt={book.seller.full_name || 'Seller'}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <User size={24} />
                  </div>
                )}
                <div>
                  <p className="font-bold text-zinc-900 dark:text-white">{book.seller?.full_name || 'Anonymous Seller'}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">Member since {new Date(book.seller?.created_at || '').getFullYear()}</p>
                </div>
              </div>
              
              {user?.id !== book.seller_id && (
                <button
                  onClick={handleChat}
                  className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-zinc-900 hover:bg-zinc-50 border dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-700 transition-all"
                >
                  <MessageSquare size={18} />
                  Chat
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap gap-4">
            {user?.id === book.seller_id ? (
              <Link
                to={`/sell?edit=${book.id}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 text-lg font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all shadow-xl shadow-zinc-500/10"
              >
                Edit Listing
              </Link>
            ) : (
              <>
                <button
                  onClick={handleOrder}
                  disabled={isOrdering || book.is_sold}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOrdering ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <ShoppingCart size={24} />
                      {book.is_for_rent ? 'Rent Now' : 'Buy Now'}
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white">Secure Transaction</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-500">Your money is safe with us</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Check size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white">Quality Check</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-500">Verified book condition</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for cn in this file
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
