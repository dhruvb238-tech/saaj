'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

export default function FloatingWhatsApp() {
  const whatsappNumber = BRAND_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '');
  const message = encodeURIComponent("Hi Mahi! I visited your portfolio and would love to ask about your custom paintings and current available catalog.");
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-colors duration-300 group"
      title="Contact Mahi on WhatsApp"
    >
      {/* Tooltip */}
      <span className="absolute right-14 bg-brand-bg-primary text-brand-text-primary text-xs font-medium py-2 px-3 rounded-lg shadow-md border border-brand-gold/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden sm:inline-block pointer-events-none">
        Chat with Mahi
      </span>
      {/* Pulse Rings */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping -z-10" />
      
      <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
    </motion.a>
  );
}
