//FQA.tsx
import React from "react";

export default function FQA() {
  return (
    <div className="mx-auto max-w-xl" id="fqaSection"> 
      <div className="pb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8"> 
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900">
              <h3 className="font-medium"> 
                What is Super Doc and what services do you offer?
              </h3>

              <svg
                className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>

            <p className="mt-4 px-4 leading-relaxed text-gray-700">
              Super Doc is a digital healthcare platform designed to provide you
              with convenient access to a range of medical services. We offer
              online consultations with healthcare professionals, symptom
              analysis tools, access to medical laboratories, and an online
              pharmacy for your prescription needs. Our goal is to make
              healthcare more accessible and improve your overall well-being.
            </p>
          </details>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900">
              <h3 className="font-medium"> {/* Changed h2 to h3 for FAQ question */}
                Is my personal and health information secure with Super Doc?
              </h3>

              <svg
                className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>

            <p className="mt-4 px-4 leading-relaxed text-gray-700">
              Yes, we take the security and privacy of your personal and health
              information very seriously. Super Doc employs industry-standard
              security measures to protect your data. All communication within
              the platform is encrypted, and we adhere to strict privacy
              policies to ensure your information remains confidential. For more
              details, please refer to our Privacy Policy.
            </p>
          </details>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900">
              <h3 className="font-medium"> {/* Changed h2 to h3 for FAQ question */}
                How do online consultations work?
              </h3>

              <svg
                className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>

            <p className="mt-4 px-4 leading-relaxed text-gray-700">
              Our online consultations connect you with licensed healthcare
              professionals through secure video or messaging. Simply book an
              appointment, describe your symptoms or health concerns, and
              receive expert medical advice, diagnoses, and treatment plans
              without needing to visit a clinic in person. It's a convenient way
              to get healthcare from wherever you are.
            </p>
          </details>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900">
              <h3 className="font-medium"> {/* Changed h2 to h3 for FAQ question */}
                Can I get prescriptions through Super Doc?
              </h3>

              <svg
                className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>

            <p className="mt-4 px-4 leading-relaxed text-gray-700">
              Yes, in many cases, healthcare professionals on Super Doc can issue
              prescriptions online if deemed medically necessary. These
              prescriptions can be fulfilled through our integrated online
              pharmacy, allowing you to order and receive your medication
              discreetly and efficiently. Please note that prescription
              availability may vary based on regulations and the nature of your
              consultation.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}