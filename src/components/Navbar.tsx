'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, Heart, MessageCircle, Settings } from 'lucide-react';
import Instagram from '@/components/icons/Instagram';
import { BRAND_CONFIG, getInstagramDMLink } from '@/config/brand';

interface NavbarProps {
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  isAdmin: boolean;
}

export default function Navbar({ wishlistCount, onOpenWishlist, onOpenAdmin, isAdmin }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Collections', href: '#collections' },
    { name: 'New Arrivals', href: '#new-arrivals' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500  ${
          isScrolled
            ? 'bg-brand-bg-primary/95 backdrop-blur-md py-3 shadow-md border-brand-gold/15'
            : 'bg-gradient-to-b from-black/40 to-transparent py-5 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className={`relative w-10 h-10 overflow-hidden rounded-full border transition-colors duration-300 ${isScrolled ? 'border-brand-gold/30 group-hover:border-brand-accent' : 'border-white/40 group-hover:border-white'}`}>
              <Image
                src={BRAND_CONFIG.logoPath}
                alt={BRAND_CONFIG.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className={`font-serif text-2xl tracking-wide transition-colors duration-300 ${isScrolled ? 'text-brand-text-primary group-hover:text-brand-accent' : 'text-white group-hover:text-brand-gold drop-shadow'}`}>
              Saaaj <span className="font-serif-italic font-light">by Mahi</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`relative text-sm tracking-widest uppercase font-medium transition-colors duration-300 group py-1 ${isScrolled ? 'text-brand-text-primary/80 hover:text-brand-accent' : 'text-white/90 hover:text-white drop-shadow'}`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="hidden md:flex items-center gap-5">
            {/* Admin trigger button */}
            <button
              onClick={onOpenAdmin}
              title="Admin Panel"
              className={`p-2 rounded-full transition-colors duration-300 ${
                isAdmin
                  ? 'text-brand-accent bg-brand-accent/10'
                  : isScrolled
                    ? 'text-brand-text-primary/75 hover:text-brand-gold hover:bg-brand-bg-secondary'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className={`relative p-2 rounded-full transition-all duration-300 ${isScrolled ? 'text-brand-text-primary/75 hover:text-brand-accent hover:bg-brand-bg-secondary' : 'text-white/85 hover:text-white hover:bg-white/10'}`}
              title="View Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-brand-accent text-brand-accent' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Social Direct Links */}
            <a
              href={getInstagramDMLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full transition-colors duration-300 ${isScrolled ? 'text-brand-text-primary/75 hover:text-[#E1306C] hover:bg-brand-bg-secondary' : 'text-white/85 hover:text-white hover:bg-white/10'}`}
              title="Instagram Direct Message"
            >
              <Instagram className="w-5 h-5" />
            </a>

            <a
              href={`https://wa.me/${BRAND_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full transition-colors duration-300 ${isScrolled ? 'text-brand-text-primary/75 hover:text-[#25D366] hover:bg-brand-bg-secondary' : 'text-white/85 hover:text-white hover:bg-white/10'}`}
              title="WhatsApp Chat"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile Actions & Menu Toggle */}
          <div className="flex md:hidden items-center gap-3">
            {/* Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className={`relative p-2 rounded-full transition-colors duration-300 ${isScrolled ? 'text-brand-text-primary/75 hover:text-brand-accent' : 'text-white/85 hover:text-white'}`}
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-brand-accent text-brand-accent' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Open */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-full transition-colors duration-300 ${isScrolled ? 'text-brand-text-primary hover:bg-brand-bg-secondary' : 'text-white hover:bg-white/10'}`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 w-[80vw] sm:w-[350px] h-screen bg-brand-bg-primary z-50 shadow-2xl transition-transform duration-500 ease-in-out luxury-border border-l flex flex-col justify-between p-8 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-8 border-b border-brand-gold/15">
            <span className="font-serif text-xl tracking-wide text-brand-text-primary">
              Saaaj <span className="font-serif-italic font-light">by Mahi</span>
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-full text-brand-text-primary hover:bg-brand-bg-secondary"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-6 mt-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg tracking-widest uppercase font-serif text-brand-text-primary hover:text-brand-accent transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        <div className="border-t border-brand-gold/15 pt-8">
          <div className="flex justify-around items-center mb-6">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex flex-col items-center gap-1 text-xs text-brand-text-primary/70 hover:text-brand-accent"
            >
              <Settings className="w-5 h-5" />
              <span>Admin</span>
            </button>
            <a
              href={getInstagramDMLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-xs text-brand-text-primary/70 hover:text-[#E1306C]"
            >
              <Instagram className="w-5 h-5" />
              <span>Instagram</span>
            </a>
            <a
              href={`https://wa.me/${BRAND_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-xs text-brand-text-primary/70 hover:text-[#25D366]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
          </div>
          <p className="text-[10px] text-center text-brand-text-muted">
            &copy; {new Date().getFullYear()} {BRAND_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </div>

      {/* Overlay behind mobile drawer */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/25 z-40 backdrop-blur-xs md:hidden"
        />
      )}
    </>
  );
}
