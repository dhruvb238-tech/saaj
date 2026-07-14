'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, HeartHandshake, Award } from 'lucide-react';
import { BTSImage, SEED_BTS } from '@/data/content';

interface BehindTheScenesProps {
  /** Admin-managed collage images; falls back to seed data when not provided. */
  images?: BTSImage[];
}

export default function BehindTheScenes({ images }: BehindTheScenesProps) {
  // Use admin images if provided, else seed. Keep exactly the first two
  // for the two-slot collage layout (filter active + sort by order).
  const collage = (images && images.length > 0 ? images : SEED_BTS)
    .filter((img) => img.active)
    .sort((a, b) => a.order - b.order)
    .slice(0, 2);
  const [img1, img2] = collage;

  const steps = [
    {
      icon: <Award className="w-5 h-5 text-brand-accent" />,
      title: 'Premium Raw Materials',
      description: 'Sourcing archival heavy-weight cotton canvas and professional artist-grade acrylics and oil paints.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-brand-accent" />,
      title: 'Palette Knife Textures',
      description: 'Applying thick, layered impasto strokes and delicate gold leaf detailing that reflect shadows uniquely.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-brand-accent" />,
      title: 'Protective Varnish Coat',
      description: 'Every finished painting is sealed with a dual-coat UV varnish to preserve color brilliance for decades.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-brand-bg-secondary/35 border-t border-brand-gold/15 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-[-15%] w-[45vw] h-[45vw] rounded-full bg-brand-gold/3 blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: The Narrative (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold mb-3 inline-block">
                The Creative Process
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-brand-text-primary mb-4">
                Behind the Canvas
              </h2>
              <div className="w-12 h-[1px] bg-brand-gold mb-4" />
              <p className="text-sm md:text-base text-brand-text-muted font-light leading-relaxed">
                Mahi believes that art should speak directly to the soul. Each brush stroke is a meditative expression of thoughts, landscapes, and natural textures, crafted painstakingly to bring a piece of the artist’s studio into your home.
              </p>
            </div>

            {/* Steps list */}
            <div className="space-y-6">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="flex gap-4 items-start"
                >
                  <div className="p-2.5 bg-brand-bg-primary rounded-xl border border-brand-gold/20 flex-shrink-0 shadow-sm">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-brand-text-primary mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-brand-text-muted leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mini Blockquote */}
            <div className="border-l-2 border-brand-accent pl-4 py-1 italic text-sm text-brand-text-muted font-light">
              &ldquo;Saaaj by Mahi is a celebration of handmade creativity where every brush stroke tells a story, and every painting carries a piece of my heart.&rdquo;
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-text-primary not-italic mt-2">
                &mdash; Mahi, Founder & Lead Artist
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Photo Collage (lg:col-span-6) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-6 relative">
            {/* Image 1: Artist Painting */}
            {img1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative w-full aspect-[3/4] rounded-brand overflow-hidden shadow-lg border border-brand-gold/15 bg-brand-bg-secondary"
              >
                <Image
                  src={img1.image}
                  alt={img1.alt}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-w-768px) 50vw, 300px"
                />
                {img1.caption && (
                  <span className="absolute bottom-3 left-3 bg-brand-button/85 text-brand-bg-primary text-[9px] tracking-widest uppercase font-semibold py-1.5 px-3 rounded-full backdrop-blur-sm">
                    {img1.caption}
                  </span>
                )}
              </motion.div>
            )}

            {/* Image 2: Mixing Paint Closeup */}
            {img2 && (
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="relative w-full aspect-[3/4] rounded-brand overflow-hidden shadow-lg border border-brand-gold/15 mt-10 bg-brand-bg-secondary"
              >
                <Image
                  src={img2.image}
                  alt={img2.alt}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-w-768px) 50vw, 300px"
                />
                {img2.caption && (
                  <span className="absolute bottom-3 left-3 bg-brand-button/85 text-brand-bg-primary text-[9px] tracking-widest uppercase font-semibold py-1.5 px-3 rounded-full backdrop-blur-sm">
                    {img2.caption}
                  </span>
                )}
              </motion.div>
            )}

            {/* Small decorative label */}
            <div className="absolute top-[40%] left-[40%] bg-brand-button text-brand-bg-primary text-[10px] tracking-widest uppercase font-semibold py-3 px-6 rounded-full shadow-lg border border-brand-gold/25 transform -translate-x-1/2 -translate-y-1/2">
              100% Handcrafted
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
