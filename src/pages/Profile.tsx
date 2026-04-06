import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, LogOut, Mail, Save, Trash2, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export function Profile() {
  const { user, profile, signOut, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
    bio: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
      });
      setPreviewUrl(profile.avatar_url || '');
    }
  }, [profile]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const uploadAvatar = async (file: File) => {
    const fileExt = file.name.split('.').pop() ?? 'jpg';
    const fileName = `${user!.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      let avatarUrl = formData.avatar_url;

      if (selectedFile) {
        avatarUrl = await uploadAvatar(selectedFile);
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          avatar_url: avatarUrl,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action is irreversible and all your listings, orders, and chats will be deleted.')) return;

    setIsDeleting(true);
    try {
      // In a real app, you might want to call a Supabase Edge Function to delete the user from auth.users
      // For now, we'll just delete the profile and sign out.
      // Note: RLS policies should handle cascading deletes if configured correctly.
      const { error } = await supabase.from('profiles').delete().eq('id', user!.id);
      if (error) throw error;
      
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border bg-white p-8 shadow-2xl shadow-indigo-500/10 dark:bg-zinc-900 dark:border-zinc-800 transition-colors duration-300"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Profile Settings</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Manage your account information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-start">
            <div className="relative group">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar"
                  className="h-32 w-32 rounded-3xl object-cover ring-4 ring-indigo-500/20"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <User size={48} />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="text-white" size={24} />
              </button>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    disabled
                    type="email"
                    value={user?.email || ''}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 pl-10 text-sm font-medium text-zinc-400 cursor-not-allowed dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-500 transition-all"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Profile Photo</label>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Upload a photo file instead of pasting an image link.</p>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Bio</label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us a bit about yourself and your reading preferences..."
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Save size={24} />
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={signOut}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-8 py-4 text-lg font-bold text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-700 transition-all"
            >
              <LogOut size={24} />
              Sign Out
            </button>
          </div>

          <div className="mt-12 border-t pt-8 dark:border-zinc-800">
            <h3 className="text-lg font-black text-red-600 dark:text-red-400">Danger Zone</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 transition-all"
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
              ) : (
                <Trash2 size={18} />
              )}
              Delete My Account
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
