

// ContentSection.tsx
import { motion } from "framer-motion";
import ContentItem from "./ContentItem";
import digtalHealth from "../../assets/video/digtal-health-info.mp4";
import stor from "../../assets/video/online-pharmacy-store.mp4";
import medicalConcept from "../../assets/video/pharmacy-and-medical-concept.mp4";

export default function ContentSection() {
  return (
    <motion.section
      id="contentSection"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20%" }}
      className="my-16"
    >
      <ContentItem
        videoSrc={digtalHealth}
        title="The AI Health Assistant"
        disc="An intelligent assistant available 24/7 to answer health-related questions, provide guidance, and offer quick support based on your symptoms."
      />
      <ContentItem
        videoSrc={stor}
        title="Patient Communities"
        disc="Join secure, moderated group chats where you can share experiences and advice with peers, building emotional support networks that reduce isolation."
        reverseLayout
      />
      <ContentItem
        videoSrc={medicalConcept}
        title="Smart Medication Reminders"
        disc="Never miss a dose with our customizable notification system designed for chronic disease management and enhanced treatment adherence."
      />
    </motion.section>
  );
}

