export const BRAND_CONFIG = {
  name: 'Saaaj by Mahi',
  logoPath: '/logo.jpg',
  contact: {
    whatsapp: '+918954371958', // Editable default phone number
    instagram: 'saaaj_by_mahi',  // Editable default instagram username
    email: 'saaajbymahi@gmail.com',
    location: 'Almora, Uttarakhand',
    workingHours: '10 AM - 7 PM, Mon - Sat',
  },
  socialLinks: {
    instagram: 'https://www.instagram.com/saaaj_by_mahi',
    whatsapp: 'https://wa.me/918954371958',
  },
  meta: {
    title: 'Saaaj by Mahi | Premium Handmade Canvas Art & Decor',
    description: 'Explore premium hand-painted canvas paintings, mini easel art, and custom home decor designed by Mahi. Crafted with love to bring warmth to your space.',
    url: 'https://saaajbymahi.com',
  }
};

export function getWhatsAppProductLink(productName: string): string {
  const cleanNumber = BRAND_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '');
  const message = `Hi! I'm interested in this product: ${productName}. Could you share more details about pricing and availability?`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppCustomOrderLink(details: string): string {
  const cleanNumber = BRAND_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '');
  const message = `Hi Mahi! I'm interested in placing a custom art order. Details:\n\n${details}`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function getInstagramDMLink(): string {
  return `https://instagram.com/${BRAND_CONFIG.contact.instagram}`;
}
