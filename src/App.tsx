import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { BookDetails } from './pages/BookDetails';
import { Login } from './pages/Login';
import { SellBook } from './pages/SellBook';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Chat } from './pages/Chat';
import { Contact } from './pages/Contact';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex min-h-screen flex-col bg-white text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sell" element={<SellBook />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/orders" element={<Dashboard />} />
                <Route path="/chats" element={<Dashboard />} />
                <Route path="/chats/:id" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
