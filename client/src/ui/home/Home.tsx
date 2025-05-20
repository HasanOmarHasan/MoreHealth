import React from "react";
import ContentSection from "./ContentSection";
import Testimonials from "./Testimonials";
import FQA from "./FQA";
import Hero from "./Hero";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <ContentSection />

      <Testimonials />

      <FQA/> 
     
    </div>
  );
}
