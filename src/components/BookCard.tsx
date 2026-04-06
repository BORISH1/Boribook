import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Heart, ShoppingCart, Star, Tag, User } from 'lucide-react';
import { Book as BookType } from '../types';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

interface BookCardProps {
  book: BookType;
  key?: string;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white dark:bg-zinc-900 dark:border-zinc-800 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
    >
      <Link to={`/book/${book.id}`} className="relative aspect-[3/4] overflow-hidden">
        <img
          src={book.image_url || 'https://images.unsplash.com/photo-1543005120-8145e593c1ad?q=80&w=800&auto=format&fit=crop'}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={cn(
            "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm",
            book.condition === 'New' 
              ? "bg-emerald-500 text-white" 
              : "bg-amber-500 text-white"
          )}>
            {book.condition}
          </span>
          {book.is_for_rent && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white rounded-full shadow-sm">
              Rent
            </span>
          )}
        </div>

        <button className="absolute top-3 right-3 rounded-full bg-white/20 p-2 text-white backdrop-blur-md hover:bg-white/40 transition-colors">
          <Heart size={18} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <Tag size={12} />
          {book.category}
        </div>
        
        <Link to={`/book/${book.id}`} className="mb-1 block">
          <h3 className="line-clamp-1 text-base font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {book.title}
          </h3>
        </Link>
        
        <p className="mb-3 line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">
          by {book.author}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-black text-zinc-900 dark:text-white">
              {formatCurrency(book.price)}
            </span>
            {book.is_for_rent && book.rent_duration && (
              <span className="text-[10px] text-zinc-500 dark:text-zinc-500">
                per {book.rent_duration}
              </span>
            )}
          </div>
          
          <Link
            to={`/book/${book.id}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 hover:bg-indigo-600 hover:text-white dark:bg-zinc-800 dark:text-white dark:hover:bg-indigo-600 transition-all duration-300"
          >
            <ShoppingCart size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Helper function for cn in this file
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
