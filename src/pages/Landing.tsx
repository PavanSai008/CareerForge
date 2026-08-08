import Hero from "@/components/landing/Hero";
import LogosBar from "@/components/landing/LogosBar";
import HowItWorks from "@/components/landing/HowItWorks";
// import Testimonials from '@/components/landing/Testimonials';
import CallToAction from "@/components/landing/CallToAction";
import Footer from "@/components/Footer";

export default function Landing() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </>
  );
}
