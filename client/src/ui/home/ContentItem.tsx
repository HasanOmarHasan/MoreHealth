
// ContentItem.tsx
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type ContentItemProps = {
  videoSrc: string;
  title: string;
  disc: string;
  reverseLayout?: boolean;
};

export default function ContentItem({ videoSrc, title, disc, reverseLayout }: ContentItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Animations
  const textOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <motion.div
      ref={containerRef}
      className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 relative"
    >
      <div className={`grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center`}>
        {/* Text Content - Always on left */}
        <motion.div 
          className="relative z-10 md:order-1"
          style={{
            opacity: textOpacity,
            y: textY
          }}
        >
          <div className="max-w-lg md:max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl relative">
              {title}
              <motion.span
                className="absolute top-0 right-[-20px] h-full w-[5px] bg-[#008dda] origin-top rounded-full"
                style={{ 
                  scaleY: progressWidth,
                  transformOrigin: 'top right' // Fixed right position
                }}
              />
            </h2>
            <p className="mt-4 text-gray-700">{disc}</p>
          </div>
        </motion.div>

        {/* Video Content - Reversed with order */}
        <motion.div 
          className={`relative ${reverseLayout ? 'md:order-0' : 'md:order-2'}`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.video
            width="750"
            height="500"
            autoPlay
            muted
            loop
            className="rounded-lg shadow-xl relative z-10"
            style={{
              scale: videoScale,
            }}
          >
            <source src={videoSrc} type="video/mp4" />
          </motion.video>
          <div className="absolute inset-0 rounded-lg shadow-xl border-2 border-[#008dda]" />
        </motion.div>
      </div>
    </motion.div>
  );
}