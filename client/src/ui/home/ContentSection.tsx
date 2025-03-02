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
        title="Virtual Medical Consultations Made Simple"
        disc="Connect instantly with licensed healthcare professionals through our secure video platform. Get personalized advice from the comfort of your home."
      />
      <ContentItem
        videoSrc={stor}
        title="Digital Pharmacy at Your Fingertips"
        disc="Order prescription refills and healthcare essentials with our integrated pharmacy service. Automatic insurance processing and door-to-door delivery."
        reverseLayout
      />
      <ContentItem
        videoSrc={medicalConcept}
        title="AI-Powered Health Insights"
        disc="Upload your medical reports for instant AI analysis combined with expert physician review. Secure, confidential, and clinically validated."
      />
    </motion.section>
  );
}
