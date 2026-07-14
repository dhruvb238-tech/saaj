'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

// Custom Instagram icon (Lucide removed brand icons)
function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  postUrl: string;
  active: boolean;
  order: number;
}

interface InstagramFeedProps {
  posts: InstagramPost[];
  instagramHandle?: string;
}

export default function InstagramFeed({ posts, instagramHandle = 'your_instagram_handle' }: InstagramFeedProps) {
  const activePosts = posts
    .filter((p) => p.active)
    .sort((a, b) => a.order - b.order);

  if (activePosts.length === 0) return null;

  return (
    <section id="instagram" className="py-24 bg-brand-bg-secondary/30 border-t border-brand-gold/15">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold mb-3 inline-block">
            Follow the Journey
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-brand-text-primary mb-4">
            On the Gram
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold mx-auto mb-4" />
          <p className="text-sm md:text-base text-brand-text-muted font-light">
            Peek behind the canvas and discover Mahi&apos;s latest creations, studio moments, and artistic process.
          </p>
          <a
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-xs font-semibold text-brand-accent hover:underline uppercase tracking-widest"
          >
            <InstagramIcon className="w-4 h-4" />
            @{instagramHandle}
          </a>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {activePosts.map((post, idx) => (
            <motion.a
              key={post.id}
              href={post.postUrl || `https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative aspect-square rounded-xl overflow-hidden border border-brand-gold/15 bg-brand-bg-secondary shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-w-768px) 50vw, 25vw"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-brand-button/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <ExternalLink className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-xs font-medium line-clamp-2">{post.caption}</p>
                </div>
              </div>
              {/* Instagram Icon Badge */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C]" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}