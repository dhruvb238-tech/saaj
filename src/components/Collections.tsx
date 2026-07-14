'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { CollectionItem, SEED_COLLECTIONS } from '@/data/content';

interface CollectionsProps {
  onSelectCategory: (category: string) => void;
  onScrollToCustom: () => void;
  /** Admin-managed items; falls back to seed data when not provided. */
  items?: CollectionItem[];
}

export default function Collections({ onSelectCategory, onScrollToCustom, items }: CollectionsProps) {
  // Use admin items if provided, else seed. Filter active + sort by order.
  const categories = (items && items.length > 0 ? items : SEED_COLLECTIONS)
    .filter((cat) => cat.active)
    .sort((a, b) => a.order - b.order);

  const handleCardClick = (tag: string) => {
    if (tag === 'Custom') {
      onScrollToCustom();
    } else {
      onSelectCategory(tag);
    }
  };

  return (
    <section id="collections" className="py-24 bg-brand-bg-secondary/40 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold mb-3 inline-block">
            Curated Categories
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-brand-text-primary mb-4">
            Explore Our Collections
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold mx-auto mb-4" />
          <p className="text-sm md:text-base text-brand-text-muted font-light">
            Indulge in a premium catalogue of handcrafted original works designed to inspire.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
              onClick={() => handleCardClick(cat.tag)}
              className={`cursor-pointer group relative overflow-hidden rounded-brand luxury-shadow bg-brand-bg-primary border border-brand-gold/10 flex flex-col aspect-[4/3] ${
                cat.tag === 'Custom' ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              {/* Image Container */}
              <div className="relative w-full h-full overflow-hidden flex-grow">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 33vw"
                />
                {/* Elegant Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-button/85 via-brand-button/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />
              </div>

              {/* Text Content Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end text-white z-10">
                <span className="text-[10px] uppercase tracking-widest text-brand-gold mb-1 font-semibold">
                  {cat.tag === 'Custom' ? 'Bespoke Art' : 'Showcase'}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-brand-bg-primary mb-2 font-medium">
                  {cat.name}
                </h3>
                <p className="text-xs md:text-sm text-brand-bg-secondary/80 font-light max-w-md line-clamp-2">
                  {cat.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-brand-gold font-medium uppercase tracking-widest opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span>{cat.tag === 'Custom' ? 'Request Commission' : 'View Catalog'}</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
