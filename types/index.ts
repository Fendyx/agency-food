// Тема оформления
export type HeroStyle = 'centered' | 'split' | 'video' | 'slider' | 'image-bg'

export type Theme = {
  primary: string
  accent: string
  fontHeading: string
  fontBody: string
  heroStyle: HeroStyle
}

// Что включено на сайте
export type Features = {
  hasMenu: boolean
  hasBooking: boolean
  hasDelivery: boolean
  hasClickCollect: boolean
  hasGallery: boolean
}

// Контакты клиента
export type Contact = {
  phone: string
  address: string
  email: string
  hours: string
  googleMapsUrl?: string
}

// SEO мета-теги
export type Seo = {
  title: string
  description: string
}

// Главный тип конфига
export type SiteConfig = {
  clientName: string
  tenantId: string
  theme: Theme
  features: Features
  contact: Contact
  seo: Seo
  menuStyle?: 'grid' | 'list'
  galleryStyle: 'bento' | 'masonry'
  heroVideoUrl?: string
  heroPosterUrl?: string
  heroSliderImages?: string[]
  heroBgImage?: string
}

// Данные меню
export type MenuItem = {
  _id?: string          // MongoDB document id
  id?: string           // оставим для совместимости, если где-то используется
  name: string
  description: string
  price: number
  category: string;        // оставь для обратной совместимости
  categoryKey?: string; // новый ключ категории для фильтрации
  image?: string
  isVegetarian?: boolean
  isSpicy?: boolean
  order?: number
  translations?: Record<string, {
    name?: string;
    description?: string;
  }>;
}

export type MenuCategory = {
  id: string
  label: string
  items: MenuItem[]
}

// Бронирование
export type Reservation = {
  id?: string
  name: string
  phone: string
  email?: string
  date: string
  time: string
  guests: number
  comment?: string
  status?: 'pending' | 'confirmed' | 'cancelled'
  createdAt?: string
}

// Галерея
export type GalleryItem = {
  _id?: string
  image: string
  caption?: string
  order?: number
}
export interface Branch {
  _id: string;
  tenantId: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  workingHours?: Record<string, string>; // { "mon": "09:00-22:00", ... }
  coordinates?: { lat: number; lng: number };
  isActive: boolean;
  settingsOverride?: {
    phone?: string;
    email?: string;
    address?: string;
    googleMapsUrl?: string;
    hours?: string;
    hoursI18n?: Record<string, string>;
    seoTitle?: string;
    seoTitleI18n?: Record<string, string>;
    seoDescription?: string;
    seoDescriptionI18n?: Record<string, string>;
    primaryLanguage?: string;
    primaryCurrency?: string;
  };
  createdAt: string;
  updatedAt: string;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}