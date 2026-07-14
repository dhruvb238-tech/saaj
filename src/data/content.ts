// ─────────────────────────────────────────────────────────────────
// Editable homepage content: interfaces + seed data.
//
// All four sections (Hero showcase, Collections, Behind the Canvas,
// Instagram) are admin-editable. Seeds mirror what was previously
// hardcoded so first-load visuals are unchanged. Edits persist in
// localStorage and override these seeds (see useCatalog).
// ─────────────────────────────────────────────────────────────────

export interface ShowcaseItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  active: boolean;
  order: number;
}

export interface CollectionItem {
  id: string;
  name: string;
  description: string;
  tag: string;
  image: string;
  active: boolean;
  order: number;
}

export interface BTSImage {
  id: string;
  image: string;
  alt: string;
  caption: string;
  active: boolean;
  order: number;
}

export interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  postUrl: string;
  active: boolean;
  order: number;
}

// ── Hero / top showcase carousel ──────────────────────────────────

export const SEED_SHOWCASE: ShowcaseItem[] = [
  {
    id: 'show-1',
    image: '/images/painting-abstract.png',
    title: 'Handmade Art That Feels Personal',
    subtitle:
      'Every piece is carefully handcrafted with love to bring warmth, textures, and a timeless aesthetic to your space.',
    active: true,
    order: 0,
  },
  {
    id: 'show-2',
    image: '/images/easel-starry.png',
    title: 'Miniature Worlds, Hand-Painted',
    subtitle:
      'Pocket-sized cosmic easels and floral miniatures — perfect little pieces of handcrafted magic.',
    active: true,
    order: 1,
  },
  {
    id: 'show-3',
    image: '/images/festive-diyas.png',
    title: 'Festive Pieces Made With Devotion',
    subtitle:
      'Hand-sculpted terracotta and gold-dust detailing for your celebrations and gifting.',
    active: true,
    order: 2,
  },
];

// ── Collections showcase cards (mirrors Collections.tsx) ──────────

export const SEED_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-1',
    name: 'Canvas Paintings',
    description: 'Original textured acrylics and gold leaf art canvases.',
    tag: 'Canvas Paintings',
    image: '/images/painting-abstract.png',
    active: true,
    order: 0,
  },
  {
    id: 'col-2',
    name: 'Mini Easel Art',
    description: 'Cosmic and floral miniatures complete with wooden easels.',
    tag: 'Mini Easel Art',
    image: '/images/easel-starry.png',
    active: true,
    order: 1,
  },
  {
    id: 'col-3',
    name: 'Home Decor',
    description: 'Hand-painted wooden coasters and unique accent pieces.',
    tag: 'Home Decor',
    image: '/images/decor-coasters.png',
    active: true,
    order: 2,
  },
  {
    id: 'col-4',
    name: 'Festive Collection',
    description: 'Hand-painted terracotta diyas and candle holders.',
    tag: 'Festive Collection',
    image: '/images/festive-diyas.png',
    active: true,
    order: 3,
  },
  {
    id: 'col-5',
    name: 'Custom Orders',
    description: 'Personalized paintings tailored to your space.',
    tag: 'Custom',
    image: '/images/artist-mahi.png',
    active: true,
    order: 4,
  },
];

// ── Behind the Canvas collage images ──────────────────────────────

export const SEED_BTS: BTSImage[] = [
  {
    id: 'bts-1',
    image: '/images/artist-mahi.png',
    alt: 'Mahi painting in her studio',
    caption: 'In the Studio',
    active: true,
    order: 0,
  },
  {
    id: 'bts-2',
    image: '/images/bts-mixing.png',
    alt: 'Mixing acrylic paints on palette',
    caption: 'Mixing the Palette',
    active: true,
    order: 1,
  },
];

// ── Instagram feed posts (mirrors page.tsx inline grid) ───────────

export const SEED_INSTAGRAM: InstagramPost[] = [
  { id: 'ig-1', image: '/images/painting-abstract.png', caption: 'Symphony of Terracotta — textured acrylics.', postUrl: '', active: true, order: 0 },
  { id: 'ig-2', image: '/images/easel-starry.png', caption: 'Mini cosmic easel, starry nights.', postUrl: '', active: true, order: 1 },
  { id: 'ig-3', image: '/images/decor-coasters.png', caption: 'Aura wooden coasters set.', postUrl: '', active: true, order: 2 },
  { id: 'ig-4', image: '/images/festive-diyas.png', caption: 'Heritage crimson & gold diyas.', postUrl: '', active: true, order: 3 },
  { id: 'ig-5', image: '/images/artist-mahi.png', caption: 'Behind the canvas with Mahi.', postUrl: '', active: true, order: 4 },
  { id: 'ig-6', image: '/images/bts-mixing.png', caption: 'Palette knife textures in progress.', postUrl: '', active: true, order: 5 },
];
