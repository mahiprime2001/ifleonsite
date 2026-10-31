import type { Metadata } from "next";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { HowWeWork } from "@/components/HowWeWork";
import { Metrics } from "@/components/Metrics";
import { Newsletter } from "@/components/Newsletter";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { TrustStrip } from "@/components/TrustStrip";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { SectionCut } from "@/components/animations/SectionCut";
import { getTestimonials } from "@/lib/content";
import { jsonLd, ORGANIZATION, pageMetadata } from "@/lib/seo";

export const revalidate = 60; // seconds; keep in step with REVALIDATE_SECONDS in lib/content.ts
export const metadata: Metadata = pageMetadata("/");

export default async function HomePage() {
  const testimonials = await getTestimonials();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({ "@context": "https://schema.org", ...ORGANIZATION })} />
      <Hero />
      <TrustStrip />
      {/* Sections below the first screen are skipped by the browser until they scroll near the viewport. */}
      <div className="cv-auto">
        <SectionCut variant="blade" accent="emerald" label="What We Do" />
        <Services />
        <SectionCut variant="diagonal" accent="blue" label="By the Numbers" />
        <Metrics />
        <About />
        <SectionCut variant="blade" accent="purple" label="Experience" />
        <Experience />
        <WhyChooseUs />
        <SectionCut variant="flip" accent="emerald" label="Our Process" />
        <HowWeWork />
        <SectionCut variant="iris" accent="teal" label="Voices" />
        <Testimonials testimonials={testimonials} />
        <Newsletter />
        <SectionCut variant="diagonal" accent="orange" label="Let's Talk" />
        <Contact />
      </div>
    </>
  );
}
