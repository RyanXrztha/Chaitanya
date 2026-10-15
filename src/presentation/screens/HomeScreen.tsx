import { PreFooterCta } from "@/presentation/components/layout/PreFooterCta";
import { AboutIntro } from "@/presentation/components/features/home/AboutIntro";
import { AwardBand } from "@/presentation/components/features/home/AwardBand";
import { GalleryEssence } from "@/presentation/components/features/home/GalleryEssence";
import { HeroSection } from "@/presentation/components/features/home/HeroSection";
import { HomeLoader } from "@/presentation/components/features/home/HomeLoader";
import { MembershipShowcase } from "@/presentation/components/features/home/MembershipShowcase";
import { PartnerLogos } from "@/presentation/components/features/home/PartnerLogos";
import { ProductShowcase } from "@/presentation/components/features/home/ProductShowcase";
import { RitualStory } from "@/presentation/components/features/home/RitualStory";
import { RoomTour } from "@/presentation/components/features/home/RoomTour";
import { SignatureTreatments } from "@/presentation/components/features/home/SignatureTreatments";
import { Testimonials } from "@/presentation/components/features/home/Testimonials";
import { VisitEnquiry } from "@/presentation/components/features/home/VisitEnquiry";
import { getHomeData } from "@/presentation/lib/home-data";

/** Home page (index.html), sections in prototype order. */
export async function HomeScreen() {
  const data = await getHomeData();

  return (
    <>
      {/* index.html sets headings to +0.008em tracking; other pages keep the base -0.015em. */}
      <style href="chy-home-heading-tracking" precedence="default">{":root{--heading-tracking:0.008em}"}</style>
      <HomeLoader />
      <HeroSection />
      <AboutIntro />
      <SignatureTreatments tabs={data.treatmentTabs} />
      <RitualStory />
      <RoomTour />
      <ProductShowcase products={data.products} />
      <MembershipShowcase />
      <Testimonials reviews={data.testimonials} />
      <GalleryEssence />
      <AwardBand />
      <VisitEnquiry treatments={data.enquiryTreatments} />
      <PartnerLogos />
      <PreFooterCta expandOnReveal />
    </>
  );
}
