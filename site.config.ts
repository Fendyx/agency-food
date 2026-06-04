import type { SiteConfig } from './types'

export const siteConfig: SiteConfig = {
  clientName: 'Café Oliv',
  tenantId: 'cafe-oliv',

  theme: {
    primary: '#C8102E',
    accent: '#F1A208',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
    heroStyle: 'slider', // <-- просто меняй значение: 'split' | 'centered' | 'video' | 'slider' | 'image-bg'
  },

  features: {
    hasMenu: true,
    hasBooking: true,
    hasDelivery: false,
    hasClickCollect: true,
    hasGallery: true,
  },

  contact: {
    phone: '+48 123 456 789',
    address: 'Kraków, Floriańska 15',
    email: 'info@cafeoliv.de',
    hours: 'Pn–Pt 11:00–22:00, Sb–Nd 12:00–23:00',
    googleMapsUrl: 'https://maps.app.goo.gl/P7xg2sXH4MjssYMVA',
  },

  seo: {
  title: 'Café Oliv — Espresso & modernes Bistro',
  description: 'Gemütliches Café im Herzen Berlins mit industriellem Flair. Genießen Sie fachmännisch zubereiteten Kaffee, frisches Gebäck und angesagte Bistro-Gerichte.',
},

  menuStyle: 'grid',
  galleryStyle: 'bento',
  // === Новые поля для Hero ===
  // Для варианта 'video'
  heroVideoUrl: '/video/hero-bg.mp4',
  heroPosterUrl: '/video/hero-poster.jpg',

  // Для варианта 'slider' (3-4 изображения)
  heroSliderImages: [
    '/images/slider-1.jpg',
    '/images/slider-2.jpg',
    '/images/slider-3.jpg',
  ],

  // Для варианта 'image-bg'
  heroBgImage: '/images/hero-bg.jpg',
}