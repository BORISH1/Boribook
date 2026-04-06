import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Facebook, Github, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export function Login() {
  const { user, signInWithGoogle, signInWithFacebook, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 rounded-3xl border bg-white p-8 shadow-2xl shadow-indigo-500/10 dark:bg-zinc-900 dark:border-zinc-800 transition-colors duration-300"
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <BookOpen size={32} />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Sign in to your account to continue
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={signInWithGoogle}
            className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-700 transition-all duration-300"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="h-5 w-5"
            />
            Continue with Google
          </button>

          <button
            onClick={signInWithFacebook}
            className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-[#1877F2] px-4 py-3.5 text-sm font-bold text-white hover:bg-[#166fe5] shadow-lg shadow-blue-500/20 transition-all duration-300"
          >
            <Facebook size={20} fill="currentColor" />
            Continue with Facebook
          </button>
          
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-zinc-500 dark:bg-zinc-900">Or continue with</span>
            </div>
          </div>

          <button
            disabled
            className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm font-bold text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-500 transition-all duration-300"
          >
            <Mail size={20} />
            Email & Password (Coming Soon)
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-500">
          By signing in, you agree to our{' '}
          <a href="#" className="font-bold text-indigo-600 hover:underline dark:text-indigo-400">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="font-bold text-indigo-600 hover:underline dark:text-indigo-400">
            Privacy Policy
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
}
