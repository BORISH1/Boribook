import React, { useState } from 'react';
import { Mail, MessageSquare, Send, User } from 'lucide-react';
import { motion } from 'motion/react';

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white sm:text-5xl">Get in <span className="text-indigo-600">Touch</span></h1>
          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Have a question about a listing? Need help with your order? Or just want to say hi? We're here to help.
          </p>
          
          <div className="mt-12 space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Email Us</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">contact@bookbound.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Live Chat</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">Available 24/7 for members</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 rounded-3xl bg-zinc-900 p-8 text-white dark:bg-zinc-950 shadow-2xl shadow-indigo-500/10">
            <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Developer Info</p>
            <h3 className="text-xl font-black mb-4">Borish Ningombam</h3>
            <p className="text-zinc-400 text-sm mb-6">Senior Full-Stack Developer & UI/UX Designer</p>
            <a 
              href="https://borishningombam.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition-all"
            >
              Visit Portfolio
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl border bg-white p-8 shadow-2xl shadow-indigo-500/10 dark:bg-zinc-900 dark:border-zinc-800 transition-colors duration-300"
        >
          {isSubmitted ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Send size={40} />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-white">Message Sent!</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">Thank you for reaching out. We'll get back to you shortly.</p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-8 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white hover:bg-indigo-700 transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Your Name</label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pl-10 text-sm font-medium text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pl-10 text-sm font-medium text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Message</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Send size={24} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
