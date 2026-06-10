import Hero from '@/components/Hero';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import BookingSection from '@/components/sections/BookingSection';
import StickyCallBtn from '@/components/ui/StickyCallBtn';
import AnimatedSection from '@/components/ui/AnimatedSection';
import MenuClient from '@/components/MenuClient';
import GalleryClient from '@/components/sections/GalleryClient';
import { siteConfig } from '@/site.config';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return (
    <>
      <Hero />

      <AnimatedSection><About /></AnimatedSection>

      <AnimatedSection><MenuClient /></AnimatedSection>

      <AnimatedSection><BookingSection /></AnimatedSection>

      <AnimatedSection><GalleryClient /></AnimatedSection>

      <AnimatedSection><Contact /></AnimatedSection>

      <StickyCallBtn phone={siteConfig.contact.phone} />
    </>
  );
}