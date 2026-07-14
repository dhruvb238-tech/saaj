export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Canvas Paintings' | 'Mini Easel Art' | 'Home Decor' | 'Festive Collection';
  description: string;
  images: string[];
  features: string[];
  dimensions: string;
  materials: string;
  deliveryTime: string;
  available: boolean;
  featured: boolean;
  newArrival: boolean;
  occasions: string[];
}

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Symphony of Terracotta Canvas',
    price: 4499,
    category: 'Canvas Paintings',
    description: 'An elegant textured acrylic masterpiece featuring warm earthy clay tones, rich cream layers, and delicate hand-applied gold leaf strokes. This painting brings a sophisticated organic warmth and depth to modern minimal interiors.',
    images: ['/images/painting-abstract.png'],
    features: [
      '100% hand-painted by Mahi',
      'Premium 380GSM archival cotton canvas',
      'Heavy body acrylic textures with palette knife finish',
      'Finished with a satin UV-protective varnish',
      'Stretched on premium pinewood bars, ready to hang'
    ],
    dimensions: '18 x 24 inches',
    materials: 'Cotton Canvas, Heavy Body Acrylics, 24K Gold Leaf',
    deliveryTime: '7-10 business days',
    available: true,
    featured: true,
    newArrival: true,
    occasions: ['Housewarming', 'Wedding Gifts', 'Corporate Gifting']
  },
  {
    id: 'prod-2',
    name: 'Miniature Cosmic Starry Sky',
    price: 1199,
    category: 'Mini Easel Art',
    description: 'A charming pocket-sized oil painting capturing the cosmic beauty and deep indigo swirls of a starry night. Perfect for adding a small touch of handcrafted magic to a study desk, bookshelf, or bedside table.',
    images: ['/images/easel-starry.png'],
    features: [
      'Individually hand-painted mini canvas',
      'Comes with an elegant 6-inch pine wood table easel',
      'Rich oil textures with glowing paint strokes',
      'Coated with protective glossy varnish',
      'Signed by the artist on the back'
    ],
    dimensions: '4 x 4 inches (Canvas), 6 inches (Easel height)',
    materials: 'Mini Stretched Canvas, Premium Oil Paints, Pine Wood',
    deliveryTime: '5-7 business days',
    available: true,
    featured: true,
    newArrival: false,
    occasions: ['Birthday', 'Desk Decor', 'Wedding Gifts']
  },
  {
    id: 'prod-3',
    name: 'Aura Wooden Coasters (Set of 4)',
    price: 899,
    category: 'Home Decor',
    description: 'A set of four rustic wooden slab coasters featuring minimalist organic line art and terracotta details. Each piece highlights the natural wood grain and adds a rustic bohemian touch to your coffee table rituals.',
    images: ['/images/decor-coasters.png'],
    features: [
      '100% natural sustainably-sourced wood slabs',
      'Hand-painted abstract line-work design',
      'Coated with heat and water-resistant food-safe resin',
      'Durable non-slip backing to protect furniture',
      'Due to natural wood, each coaster is uniquely shaped'
    ],
    dimensions: '3.8 to 4.2 inches diameter each',
    materials: 'Natural Acacia Wood Slabs, Acrylic Ink, Protective Resin',
    deliveryTime: '4-6 business days',
    available: true,
    featured: true,
    newArrival: true,
    occasions: ['Housewarming', 'Corporate Gifting', 'Hostess Gift']
  },
  {
    id: 'prod-4',
    name: 'Heritage Crimson & Gold Diyas',
    price: 699,
    category: 'Festive Collection',
    description: 'A premium pair of hand-sculpted terracotta clay diyas, elaborately hand-painted with traditional Indian motifs in vibrant crimson, soft white, and brilliant gold dust, perfect for festive celebrations.',
    images: ['/images/festive-diyas.png'],
    features: [
      'Handcrafted and painted traditional terracotta clay',
      'Adorned with gold dust and acrylic line art detailing',
      'Eco-friendly, reusable, and washable',
      'Arrives in a beautiful velvet-lined handmade gifting box',
      'Ideal for festive decor or traditional ceremonies'
    ],
    dimensions: '3.5 x 3.5 inches each',
    materials: 'Natural Terracotta Clay, Premium Acrylics, Gold Dust',
    deliveryTime: '3-5 business days',
    available: true,
    featured: true,
    newArrival: false,
    occasions: ['Diwali', 'Festive Decor', 'Housewarming']
  }
];
