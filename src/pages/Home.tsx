import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Search, ShoppingBag, Star, TrendingUp, Truck, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Book } from '../types';
import { BookCard } from '../components/BookCard';
import { motion } from 'motion/react';

export function Home() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedBooks() {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*, seller:profiles(*)')
          .eq('is_sold', false)
          .limit(8)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFeaturedBooks(data || []);
      } catch (error) {
        console.error('Error fetching featured books:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedBooks();
  }, []);

  const features = [
    {
      title: 'Fast Delivery',
      description: 'Get your books delivered within 2-3 business days across the country.',
      icon: Truck,
      color: 'bg-blue-500',
    },
    {
      title: 'Secure Payments',
      description: 'Multiple payment options with end-to-end encryption for your safety.',
      icon: Zap,
      color: 'bg-amber-500',
    },
    {
      title: 'Verified Sellers',
      description: 'All our sellers are verified to ensure quality and authenticity of books.',
      icon: Star,
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-50 pt-20 pb-32 dark:bg-zinc-950 transition-colors duration-300">
        <div className="absolute top-0 left-0 h-full w-full opacity-10 dark:opacity-5">
          <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <TrendingUp size={16} />
                #1 Marketplace for Readers
              </span>
              <h1 className="mt-6 text-5xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-7xl">
                Your Next <span className="text-indigo-600">Adventure</span> Starts Here.
              </h1>
              <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed">
                Buy, sell, and rent new or used books. Join thousands of readers finding their next favorite story at unbeatable prices.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/explore"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all hover:scale-105"
                >
                  Explore Books
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/sell"
                  className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-zinc-900 hover:bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 dark:hover:bg-zinc-800 transition-all hover:scale-105"
                >
                  Start Selling
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/150?u=${i}`}
                      alt="User"
                      className="h-10 w-10 rounded-full border-2 border-white dark:border-zinc-950"
                    />
                  ))}
                </div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  <span className="font-bold text-zinc-900 dark:text-white">10k+</span> Readers joined this week
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-zinc-200 dark:bg-zinc-900 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop"
                  alt="Bookshelf"
                  className="h-full w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent" />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-2xl dark:bg-zinc-900 border dark:border-zinc-800 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Recent Sale</p>
                    <p className="text-sm font-black text-zinc-900 dark:text-white">The Great Gatsby</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 rounded-2xl bg-white p-4 shadow-2xl dark:bg-zinc-900 border dark:border-zinc-800 animate-bounce-slow delay-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">New Listing</p>
                    <p className="text-sm font-black text-zinc-900 dark:text-white">Atomic Habits</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-4xl">Featured Books</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Handpicked stories for your reading pleasure.</p>
          </div>
          <Link
            to="/explore"
            className="hidden sm:flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            View All
            <ArrowRight size={20} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="mt-4 h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="mt-2 h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-zinc-900 py-24 dark:bg-zinc-950 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white sm:text-4xl">Why Choose BookBound?</h2>
            <p className="mt-4 text-zinc-400">We make book trading simple, safe, and social.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl bg-zinc-800/50 p-8 border border-zinc-700/50 hover:bg-zinc-800 transition-all duration-300"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.color} text-white shadow-lg mb-6`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-8 py-16 text-center shadow-2xl shadow-indigo-500/20 sm:px-16 sm:py-24">
          <div className="absolute top-0 left-0 h-full w-full opacity-20">
            <div className="absolute top-[-20%] left-[-20%] h-[400px] w-[400px] rounded-full bg-white blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-20%] h-[400px] w-[400px] rounded-full bg-white blur-[100px]" />
          </div>
          
          <div className="relative">
            <h2 className="text-3xl font-black text-white sm:text-5xl">Have Books to Sell?</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-indigo-100">
              Turn your old books into cash or rent them out to other readers. It takes less than 2 minutes to list your first book.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/sell"
                className="rounded-xl bg-white px-8 py-4 text-lg font-bold text-indigo-600 hover:bg-zinc-50 transition-all hover:scale-105"
              >
                List Your Book Now
              </Link>
              <Link
                to="/explore"
                className="rounded-xl bg-indigo-700 px-8 py-4 text-lg font-bold text-white hover:bg-indigo-800 transition-all hover:scale-105"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
