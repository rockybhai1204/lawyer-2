"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import ContactFormRenderer from "@/components/contact-form-renderer";

interface ContactForm {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  schemaJson: any;
  createdAt: string;
  updatedAt: string;
}

// Loading skeleton component
const FormLoadingSkeleton = memo(() => (
  <div className="bg-white/80 rounded-lg p-6 animate-pulse">
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
    </div>
  </div>
));

FormLoadingSkeleton.displayName = "FormLoadingSkeleton";

// Prefetch function to start loading data immediately
const prefetchContactForm = () => {
  // Start prefetching immediately
  fetch("/api/forms/contact", {
    method: "GET",
    headers: {
      "Cache-Control": "max-age=300",
    },
  }).catch(() => {
    // Silently fail for prefetch
  });
};

const C2 = () => {
  const [contactForm, setContactForm] = useState<ContactForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize the form schema to prevent unnecessary re-renders
  const memoizedSchema = useMemo(() => {
    return contactForm?.schemaJson || null;
  }, [contactForm?.schemaJson]);

  // Fetch contact form with optimized loading
  useEffect(() => {
    const fetchContactForm = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch("/api/forms/contact", {
          signal: controller.signal,
          headers: {
            "Cache-Control": "max-age=300",
          },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setContactForm(data.data);
          // Set loading to false immediately when we get the data
          setIsLoading(false);
        } else {
          console.error("Failed to fetch contact form");
          setIsLoading(false);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.error("Request timeout");
        } else {
          console.error("Error fetching contact form:", error);
        }
        setIsLoading(false);
      }
    };

    fetchContactForm();
  }, []);

  // Start prefetching immediately when component mounts
  useEffect(() => {
    prefetchContactForm();
  }, []);

  // Memoize the form completion handler
  const handleFormComplete = useCallback(
    async (result: any) => {
      console.log("Contact form completed:", result);
      setFormData(result);

      setIsSubmitting(true);

      try {
        const response = await fetch("/api/forms/contact/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formId: contactForm?.id,
            rawJson: result,
          }),
        });

        if (response.ok) {
          toast.success(
            "Contact form submitted successfully! We'll get back to you soon."
          );
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to submit form");
        }
      } catch (error) {
        console.error("Error submitting contact form:", error);
        toast.error("Failed to submit form. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [contactForm?.id]
  );

  // Memoize the form renderer component
  const FormRenderer = useMemo(() => {
    if (!memoizedSchema) return null;

    return (
      <div className="bg-white/80 rounded-lg p-6">
        <ContactFormRenderer
          schema={memoizedSchema as Record<string, any>}
          onComplete={handleFormComplete}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }, [memoizedSchema, handleFormComplete, isSubmitting]);

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single Container with Dull Golden Background */}
        <div className="relative rounded-3xl bg-gradient-to-br bg-white shadow-2xl p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Side - Sticky Image */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden">
                <Image
                  src="/cbg2.webp"
                  alt="Justice statue"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Right Side - Contact Form and Info */}
            <div className="lg:pl-4">
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-['Lora'] mb-4">
                  Contact With Lawyer
                </h2>
                <p className="text-lg text-gray-600">
                  Have a question or need legal assistance? Fill out the form
                  below and we'll get back to you as soon as possible.
                </p>
              </div>

              {/* Contact Form */}
              <div className="bg-white/90 rounded-xl p-6 border border-gray-200 mb-8">
                {/* <h3 className="text-xl font-semibold text-gray-800 mb-4 font-['Lora']">
                  Send us a Message
                </h3> */}
                {isLoading ? (
                  <FormLoadingSkeleton />
                ) : contactForm && memoizedSchema ? (
                  FormRenderer
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">
                      No contact form available at the moment.
                    </p>
                    <p className="text-sm text-gray-400">
                      Please contact us directly using the information below.
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                {/* <h3 className="text-2xl font-bold text-gray-800 mb-6 font-['Lora'] text-center">
                  Get in Touch
                </h3> */}
                
                <div className="space-y-6">
                  {/* Office Address */}
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">Office Address</h4>
                      <p className="text-gray-600 leading-relaxed">
                        2nd Floor, MD Tower, Plot No. 2C2, Awas Vikas 1st, DM Road, Bulandshahr
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">Email ID</h4>
                      <a 
                        href="mailto:hello@lawyer.com"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-lg"
                      >
                        hello@lawyer.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">Phone Number</h4>
                      <a 
                        href="tel:+918979096507"
                        className="text-green-600 hover:text-green-800 transition-colors duration-200 text-lg"
                      >
                        +91 8979096507
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(C2);
