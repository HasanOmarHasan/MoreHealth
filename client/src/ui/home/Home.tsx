import ContentSection from "./ContentSection";
import Testimonials from "./Testimonials";
import FQA from "./FQA";
import Hero from "./Hero";

export default function Home() {
  const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12";
  return (
    <div>
      <div className={container}>
        <Hero />
      </div>

      <div className="bg-gray-100  px-4 sm:px-6 lg:px-8 py-12">
        <ContentSection />
      </div>

      <div className={container}>
        <Testimonials />
        <FQA />
      </div>
    </div>
  );
}
