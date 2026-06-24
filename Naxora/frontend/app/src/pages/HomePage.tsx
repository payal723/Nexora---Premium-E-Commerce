import Hero from '@/sections/Hero';
import TrustBadges from '@/sections/TrustBadges';
import Categories from '@/sections/Categories';
import FeaturedProducts from '@/sections/FeaturedProducts';
import OfferBanner from '@/sections/OfferBanner';
import Testimonials from '@/sections/Testimonials';
import Newsletter from '@/sections/Newsletter';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustBadges />
      <Categories />
      <FeaturedProducts />
      <OfferBanner />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
