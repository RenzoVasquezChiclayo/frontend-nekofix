import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { Promotions } from "@/components/landing/Promotions";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { Testimonials } from "@/components/landing/Testimonials";
import { Brands } from "@/components/landing/Brands";
import { Location } from "@/components/landing/Location";
import { MapEmbed } from "@/components/landing/MapEmbed";
import { CTAWhatsApp } from "@/components/landing/CTAWhatsApp";
import { getFeaturedProducts } from "@/services/product.service";

export default async function HomePage() {
  const featured = await getFeaturedProducts().catch(() => []);

  return (
    <>
      <Hero />
      <Services />
      <Promotions />
      <FeaturedProducts products={featured} />
      <Testimonials />
      <Brands />
      <Location />
      <div className="pb-16">
        <MapEmbed />
      </div>
      <CTAWhatsApp />
    </>
  );
}
