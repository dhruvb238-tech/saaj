'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/data/products';
import { BRAND_CONFIG } from '@/config/brand';

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  onToggleWishlist: (id: string) => void;
  onViewDetails: (product: Product) => void;
}

export default function Wishlist({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onToggleWishlist,
  onViewDetails,
}: WishlistProps) {
  // Find favorited products
  const favoritedProducts = products.filter((p) => wishlistIds.includes(p.id));

  // WhatsApp link for whole wishlist
  const getWhatsAppWishlistLink = () => {
    const listNames = favoritedProducts.map((p) => p.name).join(', ');
    const whatsappNumber = BRAND_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '');
    const message = `Hi Mahi! I visited your store and favorited these artworks: ${listNames}. Are they currently available for purchase?`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
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
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xs"
          />

          {/* Drawer Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full sm:w-[450px] bg-brand-bg-primary z-50 shadow-2xl flex flex-col justify-between border-l border-brand-gold/15"
          >
            {/* Header */}
            <div className="p-6 border-b border-brand-gold/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-brand-accent fill-brand-accent animate-pulse" />
                <h3 className="font-serif text-xl text-brand-text-primary font-semibold">
                  Your Favorites ({favoritedProducts.length})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-brand-text-primary hover:bg-brand-bg-secondary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {favoritedProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <div className="w-16 h-16 rounded-full bg-brand-bg-secondary flex items-center justify-center text-brand-text-muted">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-brand-text-primary">
                    Your wishlist is empty
                  </h4>
                  <p className="text-xs text-brand-text-muted max-w-[250px]">
                    Browse the collections and add your favorite handmade artworks here.
                  </p>
                  <button
                    onClick={onClose}
                    className="text-xs uppercase tracking-widest text-brand-accent font-semibold flex items-center gap-1 hover:underline pt-2"
                  >
                    <span>Browse Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                favoritedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-4 border-b border-brand-gold/10 pb-4 last:border-b-0 group"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => {
                        onClose();
                        onViewDetails(product);
                      }}
                      className="relative w-20 h-20 overflow-hidden rounded-xl border border-brand-gold/15 cursor-pointer bg-brand-bg-secondary flex-shrink-0"
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="80px"
                      />
                    </div>

                    {/* Meta info */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h4
                          onClick={() => {
                            onClose();
                            onViewDetails(product);
                          }}
                          className="font-serif text-base font-semibold text-brand-text-primary hover:text-brand-accent cursor-pointer transition-colors duration-300 line-clamp-1"
                        >
                          {product.name}
                        </h4>
                        <p className="text-xs text-brand-accent font-medium mt-0.5">
                          ₹{product.price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] text-brand-text-muted mt-1">
                          Category: {product.category}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onToggleWishlist(product.id)}
                        className="text-[10px] text-brand-text-muted hover:text-brand-accent flex items-center gap-1 mt-2 self-start transition-colors duration-300"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            {favoritedProducts.length > 0 && (
              <div className="p-6 border-t border-brand-gold/15 bg-brand-bg-secondary/40 space-y-4">
                <div className="flex justify-between items-center text-sm font-medium text-brand-text-primary">
                  <span>Total Items</span>
                  <span>{favoritedProducts.length}</span>
                </div>
                <a
                  href={getWhatsAppWishlistLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold py-4 px-6 rounded-brand flex items-center justify-center gap-2 tracking-widest uppercase transition-all duration-300 shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  Inquire on WhatsApp
                </a>
                <p className="text-[10px] text-center text-brand-text-muted">
                  Mahi will chat with you directly to organize secure payment and shipping.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
