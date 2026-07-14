'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowDown, MessageCircle } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

export default function Hero() {
  const whatsappNumber = BRAND_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '');
  const chatMessage = encodeURIComponent("Hi Mahi! I visited your website and would love to learn more about your handmade art collections.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${chatMessage}`;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-bg-primary pt-20"
    >
      {/* Background Soft Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-gold/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-accent/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 py-12 md:py-20">
        {/* Left Column: Heading & Copy */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold mb-4 inline-block">
              Saaaj by Mahi &bull; Original Fine Art
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight text-brand-text-primary mb-6"
          >
            Handmade Art <br />
            <span className="font-serif-italic font-light text-brand-gold">That Feels Personal</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-base md:text-lg text-brand-text-muted max-w-xl mb-10 leading-relaxed font-light"
          >
            Every piece is carefully handcrafted with love to bring warmth, textures, and a timeless aesthetic to your space.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
          >
            <a
              href="#collections"
              className="bg-brand-button hover:bg-brand-accent text-brand-bg-primary text-sm font-medium py-4 px-8 rounded-brand text-center tracking-widest uppercase shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Explore Collections
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-brand-button hover:border-brand-accent hover:bg-brand-accent/5 text-brand-button hover:text-brand-accent text-sm font-medium py-4 px-8 rounded-brand flex items-center justify-center gap-2 tracking-widest uppercase transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </motion.div>
        </div>

        {/* Right Column: High-End Mockup */}
        <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative w-full max-w-[480px] aspect-[4/5] rounded-brand overflow-hidden shadow-2xl border-[12px] border-brand-bg-secondary"
          >
            <Image
              src="/images/painting-abstract.png"
              alt="Symphony of Terracotta Canvas Painting"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-w-770px) 100vw, 480px"
              priority
            />
            {/* Elegant Caption Overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-brand-bg-primary/90 backdrop-blur-md p-4 rounded-xl border border-brand-gold/10">
              <p className="font-serif text-sm font-medium text-brand-text-primary">Featured Release</p>
              <p className="text-xs text-brand-text-muted italic">Symphony of Terracotta &mdash; 18x24" Canvas</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10">
        <a href="#collections" className="flex flex-col items-center text-brand-text-muted hover:text-brand-accent transition-colors duration-300">
          <span className="text-[10px] tracking-widest uppercase font-medium mb-1">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-4 h-4 text-brand-accent" />
          </motion.div>
        </a>
      </div>
    </section>
  );
}
