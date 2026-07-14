'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle, ShieldCheck, Truck, Sparkles, Scale } from 'lucide-react';
import Instagram from '@/components/icons/Instagram';
import Image from 'next/image';
import { Product } from '@/data/products';
import { getWhatsAppProductLink, getInstagramDMLink } from '@/config/brand';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorited: boolean;
  onToggleWishlist: (id: string) => void;
}

export default function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  isFavorited,
  onToggleWishlist,
}: ProductDetailsModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  if (!product) return null;

  const whatsappUrl = getWhatsAppProductLink(product.name);
  const instagramUrl = getInstagramDMLink();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Lightbox Container */}
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-brand-bg-primary w-full max-w-5xl rounded-brand shadow-2xl border border-brand-gold/15 overflow-hidden grid grid-cols-1 md:grid-cols-12 pointer-events-auto relative max-h-[90vh] md:max-h-[85vh]"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-brand-bg-primary/80 backdrop-blur-md text-brand-text-primary hover:text-brand-accent shadow-sm border border-brand-gold/10 transition-colors"
                title="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Image Viewer (md:col-span-6) */}
              <div className="md:col-span-6 p-6 sm:p-8 bg-brand-bg-secondary/20 flex flex-col justify-center border-b md:border-b-0 md:border-r border-brand-gold/10 max-h-[45vh] md:max-h-full overflow-hidden">
                {/* Main Image View */}
                <div
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHoveringImage(true)}
                  onMouseLeave={() => setIsHoveringImage(false)}
                  className="relative w-full aspect-square rounded-xl overflow-hidden border border-brand-gold/15 cursor-zoom-in bg-brand-bg-secondary"
                >
                  <Image
                    src={product.images[activeImageIndex]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-200"
                    style={{
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                      transform: isHoveringImage ? 'scale(1.8)' : 'scale(1)',
                    }}
                    sizes="(max-w-768px) 100vw, 400px"
                    priority
                  />
                  
                  {/* Status labels */}
                  {!product.available && (
                    <div className="absolute top-4 left-4 bg-brand-button/90 backdrop-blur-sm text-brand-bg-primary text-[10px] tracking-widest uppercase font-semibold py-1 px-3 rounded-full">
                      Sold Out
                    </div>
                  )}
                  {product.available && product.newArrival && (
                    <div className="absolute top-4 left-4 bg-brand-accent text-white text-[10px] tracking-widest uppercase font-semibold py-1 px-3 rounded-full">
                      New Arrival
                    </div>
                  )}
                </div>

                {/* Thumbnails list if there are multiple images */}
                {product.images.length > 1 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${
                          idx === activeImageIndex ? 'border-brand-accent' : 'border-brand-gold/15'
                        }`}
                      >
                        <Image src={img} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Information Panel (md:col-span-6) */}
              <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-full">
                {/* Meta details */}
                <div className="space-y-6">
                  {/* Header info */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">
                        {product.category}
                      </span>
                      <button
                        onClick={() => onToggleWishlist(product.id)}
                        className="text-xs text-brand-text-muted hover:text-brand-accent flex items-center gap-1.5 transition-colors"
                      >
                        <Heart className={`w-4.5 h-4.5 ${isFavorited ? 'fill-brand-accent text-brand-accent' : ''}`} />
                        <span>{isFavorited ? 'Saved to Favorites' : 'Add to Favorites'}</span>
                      </button>
                    </div>

                    <h2 className="font-serif text-3xl font-bold text-brand-text-primary mb-2">
                      {product.name}
                    </h2>
                    
                    <p className="font-serif text-2xl text-brand-accent font-semibold mt-1">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="w-full h-[1px] bg-brand-gold/15" />

                  {/* Description */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                      Description
                    </h4>
                    <p className="text-sm text-brand-text-muted font-light leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Bullet features */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                      Artisan Details
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-text-primary">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 font-light">
                          <Sparkles className="w-3.5 h-3.5 text-brand-gold mt-0.5 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="w-full h-[1px] bg-brand-gold/15" />

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs bg-brand-bg-secondary/40 rounded-xl p-4 border border-brand-gold/10">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-brand-text-muted block mb-1">Dimensions</span>
                      <span className="font-medium text-brand-text-primary">{product.dimensions}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-brand-text-muted block mb-1">Materials</span>
                      <span className="font-medium text-brand-text-primary">{product.materials}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] uppercase font-semibold text-brand-text-muted block mb-1">Occasion / Gifting</span>
                      <span className="font-medium text-brand-text-primary">{product.occasions.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Block */}
                <div className="mt-8 pt-6 border-t border-brand-gold/15 space-y-4">
                  {/* Delivery & Trust badges */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3 text-[10px] text-brand-text-muted font-light pb-2">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-brand-gold" />
                      <span>Delivery in {product.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-brand-gold" />
                      <span>Secure Direct-to-Artist Purchase</span>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {product.available ? (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-grow bg-brand-button hover:bg-brand-accent text-brand-bg-primary text-xs font-semibold py-4 px-6 rounded-brand text-center tracking-widest uppercase flex items-center justify-center gap-2 shadow-md transition-colors duration-300"
                      >
                        <MessageCircle className="w-4 h-4 fill-white text-brand-button group-hover:text-brand-accent" />
                        Inquire on WhatsApp
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-grow bg-brand-bg-secondary text-brand-text-muted text-xs font-semibold py-4 px-6 rounded-brand text-center tracking-widest uppercase cursor-not-allowed"
                      >
                        Currently Unavailable
                      </button>
                    )}

                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-brand-gold hover:border-brand-accent hover:bg-brand-accent/5 text-brand-text-primary hover:text-brand-accent text-xs font-semibold py-4 px-6 rounded-brand text-center tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      <Instagram className="w-4 h-4" />
                      DM on Instagram
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
