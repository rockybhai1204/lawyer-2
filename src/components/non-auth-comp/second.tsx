"use client";

import Image from "next/image";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Facebook, Instagram, Linkedin, X as XIcon } from "lucide-react";
import { COMPANY_CONFIG } from "./company-config";

const Second = () => {
  const handleAboutClick = () => {};

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg2.webp"
          alt="Background"
          fill
          className="object-cover opacity-70"
          priority
        />
      </div>

      <div className="mx-auto w-[1200px] max-w-[95%] py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Left textual content */}
          <div className="lg:col-span-6 text-black">
            <div className="flex items-center gap-3 text-cyan-600 font-semibold font-['Lora'] tracking-wide mb-4">
              <Image
                src="/icon.webp"
                width={28}
                height={28}
                alt="welcome icon"
              />
              <span className="text-3xl">Welcome To Vakilfy</span>
            </div>
            <h2 className="font-['Lora'] text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-black mb-6">
              Experts In Law
              <br />
              Business
            </h2>
            <p className="text-gray-700 leading-7 mb-8 max-w-2xl first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:pr-3 first-letter:leading-[0.8]">
              Vakilfy Advocates and Legal Consultants is a trusted law firm with
              deep expertise and a steadfast commitment to navigating all facets
              of U.S. law and regulations.
            </p>

            <div className="flex items-start gap-4 mb-10">
              <div className="text-cyan-600 text-7xl lg:text-8xl leading-none select-none font-serif">
                “
              </div>
              <div>
                <p className="text-gray-800 font-medium">
                  Experience A Specialized And Dedicated Legal Representation.
                </p>
                <div className="mt-4 text-cyan-700 font-['Dancing_Script'] text-2xl">
                  {COMPANY_CONFIG.ceo.name}
                </div>
                <div className="text-gray-500 text-sm">
                  {COMPANY_CONFIG.ceo.title}
                </div>
              </div>
            </div>

            <InteractiveHoverButton
              onClick={handleAboutClick}
              className="!bg-white !border-black !text-black hover:!bg-black hover:!text-white hover:!border-black [&>div>div]:!bg-black [&>div:last-child]:!text-white"
            >
              About Us
            </InteractiveHoverButton>
          </div>

          {/* Right side - Vision/Mission/Value cards and Image */}
          <div className="lg:col-span-6 w-full mt-8 lg:mt-0">
            <div className="flex flex-col lg:flex-row w-full gap-0">
              {/* Cards column - Top on mobile, Left side on desktop */}
              <div className="w-full lg:w-1/2">
                {/* Card 1 - Vision (White background by default) */}
                <div className="group relative bg-white text-gray-800 transition-all duration-300 hover:bg-cyan-500 hover:text-white">
                  <div className="absolute left-2 lg:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-cyan-500 shadow-lg flex items-center justify-center group-hover:bg-white transition-colors">
                    {/* Eye icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:text-cyan-500 transition-colors drop-shadow-md"
                      fill="currentColor"
                      style={{
                        filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))",
                      }}
                    >
                      <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    </svg>
                  </div>
                  <div className="p-6 pl-16 lg:p-8 lg:pl-12">
                    <div className="text-xl lg:text-2xl font-['Lora'] font-bold mb-3 lg:mb-4 text-black group-hover:text-white">
                      Our Vision
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white/90">
                      Our vision is to be a trusted leader in the legal
                      profession and client-focused solutions.
                    </p>
                  </div>
                </div>

                {/* Card 2 - Mission (White background by default) */}
                <div className="group relative bg-white text-gray-800 transition-all duration-300 hover:bg-cyan-500 hover:text-white">
                  <div className="absolute left-2 lg:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-cyan-500 shadow-lg flex items-center justify-center group-hover:bg-white transition-colors">
                    {/* Target icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:text-cyan-500 transition-colors drop-shadow-md"
                      fill="currentColor"
                      style={{
                        filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))",
                      }}
                    >
                      <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 17a7 7 0 1 1 7-7 7.008 7.008 0 0 1-7 7Zm0-11a4 4 0 1 0 4 4 4.005 4.005 0 0 0-4-4Zm0 5a1 1 0 1 1 1-1 1 1 0 0 1-1 1Z" />
                    </svg>
                  </div>
                  <div className="p-6 pl-16 lg:p-8 lg:pl-12">
                    <div className="text-xl lg:text-2xl font-['Lora'] font-bold mb-3 lg:mb-4 text-black group-hover:text-white">
                      Our Mission
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white/90">
                      Provide exceptional legal services with integrity,
                      expertise, and a client-focused approach.
                    </p>
                  </div>
                </div>

                {/* Card 3 - Value (White background by default) */}
                <div className="group relative bg-white text-gray-800 transition-all duration-300 hover:bg-cyan-500 hover:text-white">
                  <div className="absolute left-2 lg:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-cyan-500 shadow-lg flex items-center justify-center group-hover:bg-white transition-colors">
                    {/* Diamond icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:text-cyan-500 transition-colors drop-shadow-md"
                      fill="currentColor"
                      style={{
                        filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))",
                      }}
                    >
                      <path d="M7 4h10l3 4-8 12L4 8l3-4zm1.6 2L6 8l6 9 6-9-2.6-2H8.6z" />
                    </svg>
                  </div>
                  <div className="p-6 pl-16 lg:p-8 lg:pl-12">
                    <div className="text-xl lg:text-2xl font-['Lora'] font-bold mb-3 lg:mb-4 text-black group-hover:text-white">
                      Our Value
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white/90">
                      Upholding the highest standards of honesty,
                      confidentiality, and ethical conduct in legal matter.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image column - Bottom on mobile, Right side on desktop */}
              <div className="w-full lg:w-1/2 overflow-hidden shadow-2xl mt-4 lg:mt-0">
                <div className="relative h-full min-h-[400px] lg:min-h-[520px]">
                  <Image
                    src="/img4.webp"
                    alt="Lawyer portrait"
                    fill
                    className="object-cover grayscale"
                  />

                  {/* Contact panel at bottom */}
                  <div className="absolute left-0 bottom-0 w-[85%] bg-neutral-800/95 text-white px-6 py-5">
                    {/* Decorative notch */}
                    <div
                      className="absolute -top-8 left-0 w-40 h-10 bg-neutral-800/95"
                      style={{ clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)" }}
                    />
                    <div className="text-sm">
                      Tel: <span className="font-semibold">+91 8979096507</span>
                    </div>
                    <div className="text-sm">Email: info@vakilfy.com</div>
                    <div className="mt-3 text-xs tracking-wider">
                      LET'S CONNECT
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-sm bg-black flex items-center justify-center">
                        <Facebook className="w-4 h-4 text-white" />
                      </span>
                      <span className="w-8 h-8 rounded-sm bg-black flex items-center justify-center">
                        <XIcon className="w-4 h-4 text-white" />
                      </span>
                      <span className="w-8 h-8 rounded-sm bg-black flex items-center justify-center">
                        <Instagram className="w-4 h-4 text-white" />
                      </span>
                      <span className="w-8 h-8 rounded-sm bg-black flex items-center justify-center">
                        <Linkedin className="w-4 h-4 text-white" />
                      </span>
                    </div>
                  </div>

                  {/* Cyan and purple accent squares */}
                  <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-cyan-500 rounded-sm" />
                  <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-purple-500 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Second;
