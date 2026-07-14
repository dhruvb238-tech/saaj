'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import Instagram from '@/components/icons/Instagram';
import { Product } from '@/data/products';
import { getWhatsAppProductLink, getInstagramDMLink } from '@/config/brand';

interface ProductCardProps {
  product: Product;
  isFavorited: boolean;
  onToggleWishlist: (id: string) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({
  product,
  isFavorited,
  onToggleWishlist,
  onViewDetails,
}: ProductCardProps) {
  const whatsappUrl = getWhatsAppProductLink(product.name);
  const instagramUrl = getInstagramDMLink();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="group relative bg-brand-bg-primary rounded-brand overflow-hidden luxury-border border luxury-shadow hover:luxury-shadow-hover flex flex-col justify-between transition-all duration-500"
    >
      {/* Favorite Heart Trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product.id);
        }}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-brand-bg-primary/90 backdrop-blur-md border border-brand-gold/15 text-brand-text-primary hover:text-brand-accent shadow-sm transition-all duration-300 transform active:scale-90"
        title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart
          className={`w-4.5 h-4.5 transition-colors ${
            isFavorited ? 'fill-brand-accent text-brand-accent' : 'text-brand-text-primary/70'
          }`}
        />
      </button>

      {/* Image Container */}
      <div
        onClick={() => onViewDetails(product)}
        className="relative w-full aspect-square overflow-hidden bg-brand-bg-secondary cursor-pointer"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 25vw"
          loading="lazy"
        />
        
        {/* Out of Stock Ribbon */}
        {!product.available && (
          <div className="absolute top-4 left-4 bg-brand-button/90 backdrop-blur-sm text-brand-bg-primary text-[10px] tracking-widest uppercase font-semibold py-1 px-3 rounded-full">
            Sold Out
          </div>
        )}

        {/* New Arrival Badge */}
        {product.available && product.newArrival && (
          <div className="absolute top-4 left-4 bg-brand-accent text-white text-[10px] tracking-widest uppercase font-semibold py-1 px-3 rounded-full shadow-sm">
            New
          </div>
        )}

        {/* View Details Hover Mask */}
        <div className="absolute inset-0 bg-brand-button/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-brand-bg-primary text-brand-text-primary text-xs font-semibold py-3 px-6 rounded-brand shadow-lg tracking-widest uppercase flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <Eye className="w-4 h-4" />
            Quick View
          </span>
        </div>
      </div>

      {/* Info details */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          {/* Category & Title */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <span className="text-[9px] uppercase tracking-widest text-brand-gold font-bold">
              {product.category}
            </span>
            <span className="font-serif text-sm text-brand-accent font-semibold">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <h3
            onClick={() => onViewDetails(product)}
            className="font-serif text-lg font-semibold text-brand-text-primary group-hover:text-brand-accent transition-colors duration-300 cursor-pointer line-clamp-1 mb-2"
          >
            {product.name}
          </h3>

          <p className="text-xs text-brand-text-muted font-light line-clamp-2 leading-relaxed mb-6">
            {product.description}
          </p>
        </div>

        {/* Call to Actions (WhatsApp & DM) */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {product.available ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-button hover:bg-brand-accent text-brand-bg-primary text-[10px] font-semibold py-3 rounded-brand text-center tracking-widest uppercase shadow-sm flex items-center justify-center gap-1.5 transition-colors duration-300"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white text-brand-button group-hover:text-brand-accent" />
              WhatsApp
            </a>
          ) : (
            <button
              disabled
              className="bg-brand-bg-secondary text-brand-text-muted text-[10px] font-semibold py-3 rounded-brand text-center tracking-widest uppercase cursor-not-allowed"
            >
              Unavailable
            </button>
          )}

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-brand-gold/40 hover:border-brand-accent hover:bg-brand-accent/5 text-brand-text-primary hover:text-brand-accent text-[10px] font-semibold py-3 rounded-brand text-center tracking-widest uppercase flex items-center justify-center gap-1.5 transition-all duration-300"
          >
            <Instagram className="w-3.5 h-3.5" />
            Instagram DM
          </a>
        </div>
      </div>
    </motion.div>
  );
}
