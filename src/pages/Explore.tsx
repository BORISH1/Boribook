import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Book } from '../types';
import { BookCard } from '../components/BookCard';
import { motion, AnimatePresence } from 'motion/react';

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  // Filter states
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'All');
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || 'All');

  const categories = ['All', 'Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Children', 'Self-Help', 'Textbook'];
  const conditions = ['All', 'New', 'Used'];
  const types = ['All', 'Buy', 'Rent'];
  const priceRanges = ['All', 'Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', 'Over ₹2000'];

  useEffect(() => {
    async function fetchBooks() {
      setIsLoading(true);
      try {
        let query = supabase
          .from('books')
          .select('*, seller:profiles(*)')
          .eq('is_sold', false);

        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`);
        }

        if (category !== 'All') {
          query = query.eq('category', category);
        }

        if (condition !== 'All') {
          query = query.eq('condition', condition);
        }

        if (type === 'Rent') {
          query = query.eq('is_for_rent', true);
        } else if (type === 'Buy') {
          query = query.eq('is_for_rent', false);
        }

        if (priceRange !== 'All') {
          if (priceRange === 'Under ₹500') query = query.lt('price', 500);
          else if (priceRange === '₹500 - ₹1000') query = query.gte('price', 500).lte('price', 1000);
          else if (priceRange === '₹1000 - ₹2000') query = query.gte('price', 1000).lte('price', 2000);
          else if (priceRange === 'Over ₹2000') query = query.gt('price', 2000);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setBooks(data || []);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBooks();
  }, [searchTerm, category, condition, type, priceRange]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });
  };

  const clearFilters = () => {
    setCategory('All');
    setCondition('All');
    setType('All');
    setPriceRange('All');
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        {/* Header & Search */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 dark:text-white">Explore Books</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Find your next favorite story among thousands of listings.</p>
          </div>
          
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 bg-white py-4 pl-12 pr-4 text-sm font-medium text-zinc-900 shadow-xl shadow-zinc-500/5 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:shadow-none transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          </form>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center justify-between border-y py-4 dark:border-zinc-800">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800 transition-all"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
            
            <div className="hidden h-6 w-px bg-zinc-200 dark:bg-zinc-800 sm:block" />
            
            <div className="flex items-center gap-2">
              {category !== 'All' && (
                <span className="flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {category}
                  <X size={14} className="cursor-pointer" onClick={() => setCategory('All')} />
                </span>
              )}
              {condition !== 'All' && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {condition}
                  <X size={14} className="cursor-pointer" onClick={() => setCondition('All')} />
                </span>
              )}
              {type !== 'All' && (
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  {type}
                  <X size={14} className="cursor-pointer" onClick={() => setType('All')} />
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={clearFilters}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Clear All
          </button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-8 dark:bg-zinc-900/50 dark:border-zinc-800 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                          category === c
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">Condition</h3>
                  <div className="flex flex-wrap gap-2">
                    {conditions.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCondition(c)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                          condition === c
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {types.map((t) => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                          type === t
                            ? "bg-amber-600 text-white"
                            : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">Price Range</h3>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriceRange(p)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                          priceRange === p
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
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
        ) : books.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-900">
              <Search size={40} />
            </div>
            <h3 className="mt-6 text-xl font-bold text-zinc-900 dark:text-white">No books found</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Try adjusting your filters or search term.</p>
            <button
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function for cn in this file
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
