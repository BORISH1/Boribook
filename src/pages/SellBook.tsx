import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Camera, Check, Plus, Tag, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export function SellBook() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    condition: 'Used',
    category: 'Fiction',
    image_url: '',
    is_for_rent: false,
    rent_duration: '',
  });

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Children', 'Self-Help', 'Textbook'];
  const conditions = ['New', 'Used'];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (editId && user) {
      async function fetchBook() {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('id', editId)
          .eq('seller_id', user.id)
          .single();

        if (data) {
          setFormData({
            title: data.title,
            author: data.author,
            description: data.description || '',
            price: data.price.toString(),
            condition: data.condition,
            category: data.category,
            image_url: data.image_url || '',
            is_for_rent: data.is_for_rent,
            rent_duration: data.rent_duration || '',
          });
        }
      }
      fetchBook();
    }
  }, [editId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        seller_id: user.id,
      };

      if (editId) {
        const { error } = await supabase
          .from('books')
          .update(payload)
          .eq('id', editId)
          .eq('seller_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('books')
          .insert(payload);
        if (error) throw error;
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Failed to save book listing.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editId || !user) return;
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', editId)
        .eq('seller_id', user.id);
      
      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete listing.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border bg-white p-8 shadow-2xl shadow-indigo-500/10 dark:bg-zinc-900 dark:border-zinc-800 transition-colors duration-300"
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
              <Plus size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
                {editId ? 'Edit Listing' : 'List Your Book'}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                {editId ? 'Update your book details' : 'Reach thousands of readers today'}
              </p>
            </div>
          </div>
          
          {editId && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20 transition-all"
            >
              {isDeleting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" /> : <Trash2 size={18} />}
              Delete
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-2">Book Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The Great Gatsby"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-2">Author</label>
                <input
                  required
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g. F. Scott Fitzgerald"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-2">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all"
                  >
                    {conditions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-2">Price (₹)</label>
                <input
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 499"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-2">Image URL</label>
                <div className="relative">
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all"
                  />
                  <Camera className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                </div>
                <p className="mt-2 text-[10px] text-zinc-500">Provide a direct link to the book image.</p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-6 dark:bg-zinc-800/50 border dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                      <Tag size={16} />
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">Rental Option</span>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_for_rent}
                      onChange={(e) => setFormData({ ...formData, is_for_rent: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-zinc-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-zinc-700"></div>
                  </label>
                </div>
                
                {formData.is_for_rent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <label className="block text-xs font-bold text-zinc-500 mb-2">Rent Duration</label>
                    <input
                      type="text"
                      value={formData.rent_duration}
                      onChange={(e) => setFormData({ ...formData, rent_duration: e.target.value })}
                      placeholder="e.g. 1 month, 2 weeks"
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 focus:border-indigo-600 focus:outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-2">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the condition, edition, and any other details..."
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 rounded-2xl border border-zinc-200 bg-white px-8 py-4 text-lg font-bold text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Check size={24} />
                  {editId ? 'Update Listing' : 'Post Listing'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
