import { MelaNav } from "@/components/mela/MelaNav";
import { MelaHero } from "@/components/mela/MelaHero";
import { MelaReel } from "@/components/mela/MelaReel";
import { MelaServices } from "@/components/mela/MelaServices";
import { MelaWork } from "@/components/mela/MelaWork";
import { MelaPackages } from "@/components/mela/MelaPackages";
import { MelaQuote } from "@/components/mela/MelaQuote";
import { MelaProcess } from "@/components/mela/MelaProcess";
import { MelaAbout } from "@/components/mela/MelaAbout";
import { MelaTestimonial } from "@/components/mela/MelaTestimonial";
import { MelaFaq } from "@/components/mela/MelaFaq";
import { MelaContact } from "@/components/mela/MelaContact";
import { MelaFooter } from "@/components/mela/MelaFooter";

export default function MelaPage() {
  return (
    <>
      <MelaNav />
      <main>
        <MelaHero />
        <MelaReel />
        <MelaServices />
        <MelaWork />
        <MelaPackages />
        <MelaQuote />
        <MelaProcess />
        <MelaAbout />
        <MelaTestimonial />
        <MelaFaq />
        <MelaContact />
      </main>
      <MelaFooter />
    </>
  );
}
