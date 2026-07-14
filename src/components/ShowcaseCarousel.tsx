'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ShowcaseItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  active: boolean;
  order: number;
}

interface ShowcaseCarouselProps {
  items: ShowcaseItem[];
  autoPlay?: boolean;
  interval?: number;
}

export default function ShowcaseCarousel({
  items,
  autoPlay = true,
  interval = 6000,
}: ShowcaseCarouselProps) {
  const activeItems = items
    .filter((i) => i.active)
    .sort((a, b) => a.order - b.order);

  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % activeItems.length);
  }, [activeItems.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + activeItems.length) % activeItems.length);
  }, [activeItems.length]);

  useEffect(() => {
    if (!autoPlay || activeItems.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, next, activeItems.length]);

  if (activeItems.length === 0) return null;

  return (
    <section id="home" className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-brand-bg-primary">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeItems[current].id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={activeItems[current].image}
            alt={activeItems[current].title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-button/70 via-brand-button/30 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-xl"
              >
                <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold mb-3 inline-block">
                  Featured
                </span>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-bg-primary mb-4 leading-tight">
                  {activeItems[current].title}
                </h2>
                <p className="text-sm md:text-base text-brand-bg-secondary/90 font-light mb-8 max-w-md">
                  {activeItems[current].subtitle}
                </p>
                <a
                  href="#collections"
                  className="inline-block bg-brand-bg-primary text-brand-text-primary text-xs font-semibold py-3 px-8 rounded-brand tracking-widest uppercase shadow-lg hover:bg-brand-accent hover:text-white transition-all duration-300"
                >
                  Explore Collection
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {activeItems.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 md:left-6 bottom-6 z-20 p-2.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-black/50 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 md:right-6 bottom-6 z-20 p-2.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-black/50 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {activeItems.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === current
                    ? 'bg-brand-gold w-6'
                    : 'bg-white/50 hover:bg-white/80 w-2'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}