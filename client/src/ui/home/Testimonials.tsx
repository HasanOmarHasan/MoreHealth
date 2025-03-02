// testmoies.tsx
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Avatar from "./../../assets/img/avatar.svg"; // Adjust the path as needed

// Define the testimonial data type
interface Testimonial {
  id: number;
  name: string;
  text: string;
}

// Array of testimonial data
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Paul Starr 1",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa sit rerum incidunt, a consequuntur recusandae ab saepe illo est quia obcaecati neque.",
  },
  {
    id: 2,
    name: "Paul Starr 2",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa sit rerum incidunt, a consequuntur recusandae ab saepe illo est quia obcaecati neque.",
  },
  {
    id: 3,
    name: "Paul Starr 3",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa sit rerum incidunt, a consequuntur recusandae ab saepe illo est quia obcaecati neque.",
  },
];

// A reusable Testimonial Card component
const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
  testimonial,
}) => {
  return (
    <motion.div
      className="keen-slider__slide snap-start w-full flex-none mr-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <blockquote className="rounded-lg bg-gray-50 p-6 shadow-xs sm:p-8">
        <div className="flex items-center gap-4">
          <img
            src={Avatar}
            alt={`${testimonial.name}'s avatar`}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <div className="flex justify-center gap-0.5 text-green-500">
              {/* You can add star icons here if needed */}
            </div>
            <p className="mt-0.5 text-lg font-medium text-gray-900">
              {testimonial.name}
            </p>
          </div>
        </div>
        <p className="mt-4 text-gray-700">{testimonial.text}</p>
      </blockquote>
    </motion.div>
  );
};

export default function Testimonials() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const activeSlideRef = useRef<HTMLSpanElement>(null);
  const slidesCount = testimonials.length;

  // Functions to scroll to the next/previous slide
  const nextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += sliderRef.current.offsetWidth;
      updateActiveSlide();
    }
  };

  const prevSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= sliderRef.current.offsetWidth;
      updateActiveSlide();
    }
  };

  // Update the active slide indicator
  const updateActiveSlide = () => {
    if (sliderRef.current && activeSlideRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const slideWidth = sliderRef.current.offsetWidth;
      const activeIndex = Math.round(scrollLeft / slideWidth);
      activeSlideRef.current.innerText = String(activeIndex + 1);
    }
  };

  // Update the active slide on manual scroll
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const handleScroll = () => updateActiveSlide();
    slider.addEventListener("scroll", handleScroll);
    return () => slider.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="testSection" className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 ">
        <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Read trusted reviews from our customers
        </h2>

        <div className="mt-8 relative">
          <div
            id="keen-slider"
            className="testimonial-slider flex overflow-x-auto scroll-smooth snap-x snap-mandatory pb-5 mb-5"
            ref={sliderRef}
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 absolute left-0 right-0 bottom-0">
            <button
              aria-label="Previous slide"
              id="keen-slider-previous"
              className="text-gray-600 transition-colors hover:text-[#008dda]"
              onClick={prevSlide}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            <p className="w-16 text-center text-sm text-gray-700">
              <span id="keen-slider-active" ref={activeSlideRef}>
                1
              </span>
              /<span id="keen-slider-count">{slidesCount}</span>
            </p>

            <button
              aria-label="Next slide"
              id="keen-slider-next"
              className="text-gray-600 transition-colors hover:text-[#008dda]"
              onClick={nextSlide}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
