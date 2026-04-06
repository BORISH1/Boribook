import React from 'react';
import { BookOpen, Github, Globe, Linkedin, Mail, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-50 border-t dark:bg-zinc-950 dark:border-zinc-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="md:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <BookOpen size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                Book<span className="text-indigo-600">Bound</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 max-w-xs">
              A modern marketplace for book lovers. Buy, sell, and rent new or used books with ease and security.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-zinc-400 hover:text-indigo-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-indigo-600 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-indigo-600 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/explore" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">All Books</Link></li>
              <li><Link to="/explore?condition=New" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">New Arrivals</Link></li>
              <li><Link to="/explore?type=Rent" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">Rent Books</Link></li>
              <li><Link to="/explore?condition=Used" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">Used Books</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/contact" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">Contact Us</Link></li>
              <li><a href="#" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">FAQ</a></li>
              <li><a href="#" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">Shipping</a></li>
              <li><a href="#" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">Developer</h3>
            <div className="mt-4 space-y-3">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Developed by Borish Ningombam</p>
              <div className="flex flex-col space-y-2">
                <a href="https://borishningombam.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                  <Globe size={16} />
                  Website
                </a>
                <a href="mailto:contact@borishningombam.in" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                  <Mail size={16} />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 dark:border-zinc-800 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            &copy; {currentYear} BookBound. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
