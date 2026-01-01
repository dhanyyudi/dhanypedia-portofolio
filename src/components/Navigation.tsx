'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe2, Home, User, Mail } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: User },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Don't show navigation on admin/login pages
  if (pathname?.startsWith('/login') || pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="glass-card flex items-center justify-between px-4 md:px-6 py-2.5 md:py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Globe2 
                className="w-7 h-7 md:w-8 md:h-8 text-[var(--accent-primary)] group-hover:rotate-12 transition-transform duration-300" 
              />
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                Dhanypedia
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu - Compact, slides from right */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop - tap to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[55] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Compact Menu Panel - Right side, auto height */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed top-20 right-4 w-48 glass-card z-[60] md:hidden overflow-hidden"
            >
              <div className="py-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-all ${
                        isActive
                          ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
                          : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
