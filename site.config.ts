import type { SiteConfig } from './types'

export const siteConfig: SiteConfig = {
  clientName: 'Cafe am Petriplatz-Frühstück',
  tenantId: 'pizzeria-brava',

  theme: {
    primary: '#C8102E',
    accent: '#F1A208',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
    heroStyle: 'split', // <-- просто меняй значение: 'split' | 'centered' | 'video' | 'slider' | 'image-bg'
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
    email: 'hello@cafeampetriplatz.de',
    hours: 'Пн–Пт 11:00–22:00, Сб–Вс 12:00–23:00',
    googleMapsUrl: 'https://maps.google.com/?q=Cafe+am+Petriplatz-Frühstück+Berlin',
  },

  seo: {
    title: 'Cafe am Petriplatz-Frühstück — лучший грузинский ресторан в Кракове',
    description:
      'Свежие грузинские блюда, пиццы и напитки в сердце Кракова. Бронирование столов онлайн.',
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