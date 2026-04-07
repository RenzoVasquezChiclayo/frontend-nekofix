import { Suspense } from "react";
import { AppleFocusSection } from "@/components/landing/AppleFocusSection";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { Promotions } from "@/components/landing/Promotions";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { GoogleReviewsSection } from "@/components/landing/GoogleReviewsSection";
import { GoogleReviewsSkeleton } from "@/components/landing/GoogleReviewsSkeleton";
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
      <Suspense fallback={<GoogleReviewsSkeleton />}>
        <GoogleReviewsSection />
      </Suspense>
      <AppleFocusSection />
      <Location />
      <div className="pb-16">
        <MapEmbed />
      </div>
      <CTAWhatsApp />
    </>
  );
}
