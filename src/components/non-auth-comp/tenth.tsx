"use client";

import Image from "next/image";
import { useState } from "react";
import { landing } from "@/lib/text/landing";

interface TenthProps {
  companyName?: string;
  companyDescription?: string;
  contactInfo?: {
    address: string[];
    phone: string;
    email: string;
  };
  // newsletterTitle?: string;
  // newsletterDescription?: string;
  // showNewsletter?: boolean;
  copyrightText?: string;
}

const Tenth: React.FC<TenthProps> = ({
  companyName = "Lawyer",
  companyDescription = "Lawyer is a leading law firm in the India, providing legal services & corporates in commercial & family matters.",
  contactInfo = {
    address: [
      "Space No. 2/2, MD Tower",
      "Awas Vikas Colony 1st",
      "Ward 2(3)(2)",
      "Bulandshahr, Uttar Pradesh 203001",
    ],
    phone: "+91 9876543210",
    email: "hello@lawyer.com",
  },
  // newsletterTitle = "Sign Up For Our Newsletter",
  // newsletterDescription = "Stay updated with our latest legal insights and services.",
  // showNewsletter = false,
  copyrightText = "",
}) => {
  const data = landing;
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", { email, agreed });
  };

  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <Image
                src="/tick.png"
                width={60}
                height={60}
                alt={`${companyName} Logo`}
              />
              <span className="text-2xl font-bold font-['Lora']">
                {data.tenth.companyName}
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl lg:text-xl font-bold leading-tight font-['Lora']">
                {data.tenth.headline}
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md font-['Lora']">
                {data.tenth.companyDescription}
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold font-['Lora'] mb-6 text-white">
              {data.tenth.contactLabel}
            </h3>
            <div className="space-y-4">
              {/* <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                  <svg
                    className="w-full h-full text-cyan-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <div className="text-gray-400 text-sm">
                  {data.tenth.contact.address.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div> */}

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex-shrink-0">
                  <svg
                    className="w-full h-full text-cyan-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </div>
                <span className="text-gray-400 text-sm">
                  {data.tenth.contact.phone}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex-shrink-0">
                  <svg
                    className="w-full h-full text-cyan-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <span className="text-gray-400 text-sm">
                  {data.tenth.contact.email}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold font-['Lora'] mb-6 text-white">
              Quick Links
            </h3>
            <div className="flex flex-col gap-4">
              <a
                href="/about"
                className="text-gray-400 text-sm hover:text-amber-400 transition-colors duration-300"
              >
                About Us
              </a>
              <a
                href="/contact"
                className="text-gray-400 text-sm hover:text-amber-400 transition-colors duration-300"
              >
                Contact Us
              </a>
              <a
                href="/privacy"
                className="text-gray-400 text-sm hover:text-amber-400 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-gray-400 text-sm hover:text-amber-400 transition-colors duration-300"
              >
                Terms of Use
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex justify-center">
          <p className="text-gray-400 text-sm">
            {data.tenth.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Tenth;
