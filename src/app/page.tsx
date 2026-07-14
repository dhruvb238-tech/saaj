'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Sparkles, Shield, Compass, HeartHandshake, MapPin,
  Mail, Phone, ChevronDown, Search, SlidersHorizontal
} from 'lucide-react';

import { BRAND_CONFIG, getInstagramDMLink } from '@/config/brand';
import { useCatalog } from '@/hooks/useCatalog';
import { Product } from '@/data/products';

import Navbar from '@/components/Navbar';
import ShowcaseCarousel from '@/components/ShowcaseCarousel';
import Collections from '@/components/Collections';
import ProductCard from '@/components/ProductCard';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import BehindTheScenes from '@/components/BehindTheScenes';
import CustomInquiryForm from '@/components/CustomInquiryForm';
import AdminPanel from '@/components/AdminPanel';
import Wishlist from '@/components/Wishlist';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import InstagramFeed from '@/components/InstagramFeed';

export default function Home() {
  const {
    products,
    wishlist,
    toggleWishlist,
    addProduct,
    updateProduct,
    deleteProduct,
    isAdmin,
    toggleAdmin,
    showcaseItems,
    updateShowcase,
    collectionItems,
    updateCollections,
    behindScenesImages,
    updateBehindScenes,
    instagramPosts,
    updateInstagram,
  } = useCatalog();

  // State Management
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [maxPrice, setMaxPrice] = useState(6000);
  const [showFilters, setShowFilters] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // List of Categories
  const categories = ['All', 'Canvas Paintings', 'Mini Easel Art', 'Home Decor', 'Festive Collection'];
  
  // List of Occasions
  const occasions = ['All', 'Housewarming', 'Diwali', 'Wedding Gifts', 'Corporate Gifting'];

  // FAQ Seed Data
  const faqs = [
    {
      q: 'How do I place an order?',
      a: 'Since all our art pieces are handcrafted and personal, we do not have a traditional checkout. Simply browse our catalogue, click "Inquire on WhatsApp" or "DM on Instagram" for the product you like, and we will guide you through ordering, custom requests, secure payment, and shipping.',
    },
    {
      q: 'Do you take custom commissions?',
      a: 'Yes, absolutely! Mahi specializes in customized art pieces. Scroll down to our "Commission Custom Art" form, fill in your specifications (canvas size, theme, colors), and submit it. Mahi will connect with you to align on details and pricing.',
    },
    {
      q: 'What are the delivery timelines?',
      a: 'Seeded items ready in stock are shipped in 3-5 days. Custom paintings take 7-14 business days depending on size, paint layers, and varnish drying times. We will keep you updated with progress photos along the way.',
    },
    {
      q: 'How are the paintings shipped?',
      a: 'Paintings are gallery-wrapped, bubble-wrapped extensively, and shipped inside solid wooden crates or reinforced cardboard boxes to ensure zero damage during transit. Shipping details are provided immediately after dispatch.',
    },
    {
      q: 'What payment options do you support?',
      a: 'We accept secure UPI payments, Bank Transfers, and GPAY. We will share the payment details directly with you on WhatsApp/Instagram once we finalize your order details.',
    },
  ];

  // Testimonials Data
  const testimonials = [
    {
      name: 'Rohan Sharma',
      role: 'Pune, India',
      rating: 5,
      text: 'The terracotta canvas brings so much warmth to our drawing room. The heavy acrylic textures look stunning in day light, and Mahi was very helpful in packaging it safely!',
      avatar: '/images/artist-mahi.png', // Fallback or reuse
    },
    {
      name: 'Aditi Patel',
      role: 'Mumbai, India',
      rating: 5,
      text: 'Ordered mini easels as diwali return gifts for my team. Everyone loved the personalized starry details. They look premium on desks. Highly recommend Saaaj!',
      avatar: '/images/artist-mahi.png',
    },
  ];

  // Key that increments each time the admin panel opens, forcing a fresh
  // mount so the local state picks up the latest persisted data.
  const [adminOpenCount, setAdminOpenCount] = useState(0);
  const openAdmin = () => {
    setIsAdminOpen(true);
    setAdminOpenCount((c) => c + 1);
  };

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Visibility Check: Only show available or visible products, unless in admin view
      // Match category
      const matchCat = selectedCategory === 'All' || prod.category === selectedCategory;
      // Match occasion
      const matchOcc = selectedOccasion === 'All' || prod.occasions.includes(selectedOccasion);
      // Match price
      const matchPrice = prod.price <= maxPrice;
      // Match search
      const matchSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchOcc && matchPrice && matchSearch;
    });
  }, [products, searchQuery, selectedCategory, selectedOccasion, maxPrice]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    const element = document.getElementById('catalog');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToCustom = () => {
    const element = document.getElementById('custom-inquiry');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewDetails = (prod: Product) => {
    setSelectedProduct(prod);
    setIsDetailOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-brand-bg-primary">
      {/* Global Navbar */}
      <Navbar
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAdmin={openAdmin}
        isAdmin={isAdmin}
      />

      {/* Hero / Top Showcase Carousel (admin-managed slides) */}
      <ShowcaseCarousel items={showcaseItems} />

      {/* Collections Section */}
      <Collections
        items={collectionItems}
        onSelectCategory={handleSelectCategory}
        onScrollToCustom={handleScrollToCustom}
      />

      {/* Product Showcase Catalog Section */}
      <section id="new-arrivals" className="py-24 bg-brand-bg-primary relative border-t border-brand-gold/15">
        <div id="catalog" className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold mb-3 inline-block">
              Art Catalogue
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-brand-text-primary mb-4">
              Our Artworks
            </h2>
            <div className="w-12 h-[1px] bg-brand-gold mx-auto mb-4" />
            <p className="text-sm md:text-base text-brand-text-muted font-light">
              Filter by Category, Occasion, or Price to locate the perfect masterpiece for your walls or gifting needs.
            </p>
          </div>

          {/* Search, Filter Controls & Sliders */}
          <div className="bg-brand-bg-secondary/40 rounded-brand p-6 mb-12 border border-brand-gold/10 luxury-shadow space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-grow max-w-lg">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-gold" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search painting names, keywords, materials..."
                  className="w-full bg-brand-bg-primary border border-brand-gold/15 rounded-xl pl-11 pr-4 py-3 text-xs focus:border-brand-accent focus:outline-none transition-colors"
                />
              </div>

              {/* Filter Display Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 border border-brand-gold/40 hover:border-brand-accent text-brand-text-primary hover:text-brand-accent text-xs font-semibold py-3 px-6 rounded-brand tracking-widest uppercase transition-all"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expandable Filter Grid */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-brand-gold/10 overflow-hidden"
                >
                  {/* Category Buttons */}
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-text-muted mb-3">Categories</span>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            selectedCategory === cat
                              ? 'bg-brand-button text-brand-bg-primary border-brand-button'
                              : 'bg-brand-bg-primary text-brand-text-primary border-brand-gold/25 hover:border-brand-accent'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Occasion Filters */}
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-text-muted mb-3">Filter by Occasion</span>
                    <div className="flex flex-wrap gap-2">
                      {occasions.map((occ) => (
                        <button
                          key={occ}
                          onClick={() => setSelectedOccasion(occ)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            selectedOccasion === occ
                              ? 'bg-brand-button text-brand-bg-primary border-brand-button'
                              : 'bg-brand-bg-primary text-brand-text-primary border-brand-gold/25 hover:border-brand-accent'
                          }`}
                        >
                          {occ}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Slider */}
                  <div className="flex flex-col justify-center">
                    <div className="flex justify-between items-center text-xs font-bold text-brand-text-muted uppercase mb-3">
                      <span>Max Price Limit</span>
                      <span className="text-brand-accent">₹{maxPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="6000"
                      step="100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-1.5 bg-brand-bg-primary rounded-lg appearance-none cursor-pointer accent-brand-accent border border-brand-gold/15"
                    />
                    <div className="flex justify-between text-[9px] text-brand-text-muted font-medium mt-2">
                      <span>₹500</span>
                      <span>₹6,000+</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pinterest/Masonry Art Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <Compass className="w-12 h-12 text-brand-gold mx-auto animate-spin" />
              <h3 className="font-serif text-2xl text-brand-text-primary">No Artworks Found</h3>
              <p className="text-sm text-brand-text-muted max-w-sm mx-auto">
                We couldn&apos;t find any artworks matching your search filters. Try adjusting them or checking another category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedOccasion('All');
                  setMaxPrice(6000);
                  setSearchQuery('');
                }}
                className="text-xs uppercase tracking-widest text-brand-accent font-semibold hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorited={wishlist.includes(product.id)}
                    onToggleWishlist={toggleWishlist}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-brand-bg-secondary/40 border-t border-brand-gold/15 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold mb-3 inline-block">
              Made with Care
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-brand-text-primary mb-4">
              Why Choose Saaaj?
            </h2>
            <div className="w-12 h-[1px] bg-brand-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                icon: <Sparkles className="w-6 h-6 text-brand-accent" />,
                title: '100% Handmade',
                desc: 'Every single canvas is hand-painted in Mahi’s home art studio, making each piece unique.',
              },
              {
                icon: <Compass className="w-6 h-6 text-brand-accent" />,
                title: 'Made in India',
                desc: 'Proudly crafted using local Indian materials, celebrating indigenous craftsmanship.',
              },
              {
                icon: <Shield className="w-6 h-6 text-brand-accent" />,
                title: 'Premium Materials',
                desc: 'Dual coated varnished canvases, natural heavy pinewood bars, and archival acrylics.',
              },
              {
                icon: <HeartHandshake className="w-6 h-6 text-brand-accent" />,
                title: 'Unique Designs',
                desc: 'Specializing in customized textures, fine abstract patterns, and miniature collectibles.',
              },
              {
                icon: <Heart className="w-6 h-6 text-brand-accent" />,
                title: 'Made with Love',
                desc: 'Crafted deliberately and with patience, designed specifically to fill your rooms with warmth.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-brand-bg-primary rounded-brand p-6 border border-brand-gold/15 luxury-shadow text-center flex flex-col items-center justify-between"
              >
                <div className="p-3 bg-brand-bg-secondary rounded-xl mb-4 border border-brand-gold/10">
                  {card.icon}
                </div>
                <h3 className="font-serif text-lg font-semibold text-brand-text-primary mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-brand-text-muted leading-relaxed font-light">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Behind The Scenes Narrative */}
      <BehindTheScenes images={behindScenesImages} />

      {/* Custom Inquiry Commission Form */}
      <CustomInquiryForm />

      {/* Testimonials Review Cards */}
      <section className="py-24 bg-brand-bg-secondary/35 border-t border-brand-gold/15 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold mb-3 inline-block">
              Collector Stories
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-brand-text-primary mb-4">
              Reviews & Feedback
            </h2>
            <div className="w-12 h-[1px] bg-brand-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testi, idx) => (
              <div
                key={idx}
                className="bg-brand-bg-primary rounded-brand p-8 border border-brand-gold/15 luxury-shadow relative flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: testi.rating }).map((_, i) => (
                      <span key={i} className="text-brand-gold text-lg">&bull;</span>
                    ))}
                    <span className="text-brand-gold text-xs tracking-widest font-semibold ml-1">★★★★★</span>
                  </div>
                  <p className="text-xs md:text-sm text-brand-text-muted leading-relaxed font-light italic">
                    &ldquo;{testi.text}&rdquo;
                  </p>
                </div>
                
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-brand-gold/10">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-brand-gold/25">
                    <Image src={testi.avatar} alt={testi.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-brand-text-primary">{testi.name}</h4>
                    <p className="text-[10px] text-brand-text-muted">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Instagram Feed Integration Grid (admin-managed posts) */}
      <InstagramFeed
        posts={instagramPosts}
        instagramHandle={BRAND_CONFIG.contact.instagram}
      />

      {/* FAQ Accordion Section */}
      <section className="py-24 bg-brand-bg-secondary/35 border-t border-brand-gold/15 relative">
        <div className="max-w-3xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold mb-3 inline-block">
              Inquiries
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-brand-text-primary mb-4">
              Frequently Asked Questions
            </h2>
            <div className="w-12 h-[1px] bg-brand-gold mx-auto" />
          </div>

          {/* Accordion list */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-brand-bg-primary rounded-xl border border-brand-gold/15 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-brand-text-primary focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-brand-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-brand-text-muted leading-relaxed border-t border-brand-gold/10 font-light">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Footer Area */}
      <footer id="contact" className="bg-brand-button text-brand-bg-primary py-16 border-t border-brand-gold/25 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-brand-gold/5 blur-[90px]" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
          {/* Col 1: Brand Info (md:col-span-4) */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 overflow-hidden rounded-full border border-brand-gold/45">
                <Image src={BRAND_CONFIG.logoPath} alt={BRAND_CONFIG.name} fill className="object-cover" />
              </div>
              <span className="font-serif text-xl tracking-wide text-brand-bg-primary">
                Saaaj <span className="font-serif-italic font-light text-brand-gold">by Mahi</span>
              </span>
            </div>
            
            <p className="text-xs text-brand-bg-secondary/70 font-light leading-relaxed max-w-sm">
              Saaaj by Mahi is an artisan collection of hand-painted canvas artworks, miniatures, and creative home decor. Each piece is handmade with devotion and designed to make your spaces breathe with luxury and warmth.
            </p>
          </div>

          {/* Col 2: Quick Links (md:col-span-3) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-brand-gold">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-brand-bg-secondary/80 font-light">
              <li><a href="#home" className="hover:text-brand-accent transition-colors">Home</a></li>
              <li><a href="#collections" className="hover:text-brand-accent transition-colors">Collections</a></li>
              <li><a href="#new-arrivals" className="hover:text-brand-accent transition-colors">New Arrivals</a></li>
              <li><a href="#about" className="hover:text-brand-accent transition-colors">About Artist</a></li>
              <li><a href="#custom-inquiry" className="hover:text-brand-accent transition-colors">Commission Request</a></li>
            </ul>
          </div>

          {/* Col 3: Direct Contact (md:col-span-5) */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-brand-gold">Get In Touch</h4>
            <ul className="space-y-3.5 text-xs text-brand-bg-secondary/80 font-light">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-gold" />
                <span>{BRAND_CONFIG.contact.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-gold" />
                <span>{BRAND_CONFIG.contact.whatsapp}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-gold" />
                <span>{BRAND_CONFIG.contact.location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <span>Studio Hours: {BRAND_CONFIG.contact.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-brand-gold/15 relative z-10 flex flex-col sm:flex-row justify-between items-center text-[10px] text-brand-bg-secondary/50 font-light gap-4">
          <span>&copy; {new Date().getFullYear()} {BRAND_CONFIG.name}. All rights reserved.</span>
          <div className="flex gap-4">
            <a href={getInstagramDMLink()} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold">Instagram</a>
            <span>&bull;</span>
            <a href={`https://wa.me/${BRAND_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold">WhatsApp</a>
          </div>
        </div>
      </footer>

      {/* Slide-out Wishlist Sidebar Drawer */}
      <Wishlist
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={products}
        onToggleWishlist={toggleWishlist}
        onViewDetails={handleViewDetails}
      />

      {/* Product Details Modal Lightbox */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isFavorited={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={toggleWishlist}
      />

      {/* Admin Panel Modal Overlay — key forces fresh mount each open */}
      {isAdminOpen && (
      <AdminPanel
        key={adminOpenCount}
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAddProduct={addProduct}
        onUpdateProduct={updateProduct}
        onDeleteProduct={deleteProduct}
        isAdmin={isAdmin}
        onToggleAdmin={toggleAdmin}
        showcaseItems={showcaseItems}
        onUpdateShowcase={updateShowcase}
        collectionItems={collectionItems}
        onUpdateCollections={updateCollections}
        behindScenesImages={behindScenesImages}
        onUpdateBehindScenes={updateBehindScenes}
        instagramPosts={instagramPosts}
        onUpdateInstagram={updateInstagram}
      />
      )}
      <FloatingWhatsApp />
    </div>
  );
}
