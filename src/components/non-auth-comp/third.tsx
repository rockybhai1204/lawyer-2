"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

// Counter component for animated numbers
const AnimatedCounter = ({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
          
          let start = 0;
          const increment = target / (duration / 16); // 60fps
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, duration, hasStarted]);

  const formatNumber = () => {
    if (target === 1000) {
      if (count >= 1000) {
        return `1k${suffix}`;
      } else {
        return `${count}${count < 1000 ? suffix : ''}`;
      }
    }
    return `${count}${suffix}`;
  };

  return (
    <div ref={ref} className="text-4xl lg:text-5xl font-bold text-white mb-2 font-['Lora']">
      {formatNumber()}
    </div>
  );
};

const Third = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const legalServices = [
    { title: "Litigation Law", image: "/bg4.avif" },
    { title: "Civil Law", image: "/bg4.avif" },
    { title: "Arbitration Law", image: "/bg4.avif" },
    { title: "Prevention Law", image: "/bg4.avif" },
    { title: "Corporate Law", image: "/bg4.avif" },
    { title: "Family Law", image: "/bg4.avif" },
    { title: "Criminal Law", image: "/bg4.avif" },
  ];

  const statistics = [
    { target: 1000, suffix: "+", label: "Completed Project" },
    { target: 358, suffix: "+", label: "Happy Clients" },
    { target: 25, suffix: "+", label: "Winning Awards" },
    { target: 10, suffix: "+", label: "Worldwide Offices" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const cardGap = 24; // gap-6 in Tailwind = 1.5rem = 24px

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(2);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(3);
      } else {
        setCardsPerView(4);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % legalServices.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + legalServices.length) % legalServices.length);
  };

  const getTransformValue = () => {
    const containerWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const totalGap = (cardsPerView - 1) * cardGap;
    const cardWidth = (containerWidth - totalGap) / cardsPerView;
    const moveX = currentIndex * (cardWidth + cardGap);
    return moveX;
  };

  const visibleServices = [...legalServices, ...legalServices, ...legalServices];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Statistics and Video Section */}
        <div className="mb-20">
          <div className="relative rounded-2xl overflow-hidden bg-black">
            <div className="absolute inset-0">
              <Image
                src="/bg4.avif"
                alt="Legal background"
                fill
                className="object-cover opacity-40"
              />
            </div>

            <div className="relative z-10 p-8 lg:p-12">
              {/* Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {statistics.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="border-2 border-white/30 rounded-lg p-6">
                      <AnimatedCounter 
                        target={stat.target} 
                        suffix={stat.suffix}
                        duration={2000 + index * 200}
                      />
                      <div className="text-white/80 text-sm lg:text-base font-['Lora']">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Video Section */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="lg:w-1/2">
                  <h3 className="text-3xl lg:text-4xl font-bold text-white font-['Lora'] leading-tight">
                    We ensure clear communication and accountability at every
                    stage of the legal process.
                  </h3>
                </div>

                <div className="hidden lg:block w-0.5 h-24 bg-white/30"></div>

                <div className="lg:w-1/2 flex justify-center lg:justify-end">
                  <button
                    onClick={() => setIsVideoPlaying(true)}
                    className="flex items-center gap-4 group hover:gap-6 transition-all duration-300"
                  >
                    <div className="relative w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 group-hover:from-orange-500 group-hover:to-orange-700 overflow-hidden">
                      <Play
                        className="w-6 h-6 text-white ml-1 group-hover:scale-110 transition-transform duration-300"
                        fill="currentColor"
                      />
                      <div className="absolute inset-0 rounded-full bg-orange-400/30 animate-ping group-hover:animate-pulse"></div>
                    </div>
                    <span className="text-white text-lg font-medium font-['Lora'] group-hover:text-orange-200 transition-colors duration-300">
                      Let's Take Video Tour
                    </span>
                  </button>
                </div>
              </div>

              {/* Video Modal */}
              {isVideoPlaying && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                  <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
                    <button
                      onClick={() => setIsVideoPlaying(false)}
                      className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <iframe
                      src="https://www.youtube.com/embed/TdTudAOl37s?start=1&autoplay=1"
                      title="Video Tour"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
          </div>
        </div>

        {/* Legal Practice Areas Section */}
        <div>
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 text-cyan-500 font-semibold mb-4">
                <Image
                  src="/icon.webp"
                  width={40}
                  height={40}
                  alt="service icon"
                />
                <span className="text-3xl">Our Services</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-black font-['Lora']">
                Legal Practice Areas
              </h2>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-cyan-500 hover:text-cyan-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-cyan-500 hover:text-cyan-500"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Slider */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${getTransformValue()}px)`,
              }}
            >
              {visibleServices.map((service, i) => (
                <div
                  key={i}
                  className="group relative h-96 flex-shrink-0"
                  style={{
                    flex: `0 0 calc((100% - ${(cardsPerView - 1) * 1.5}rem) / ${cardsPerView})`,
                  }}
                >
                  <div className="relative h-full w-full rounded-2xl overflow-hidden [perspective:1000px]">
                    <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(-180deg)] rounded-2xl">
                      {/* Front */}
                      <div className="absolute inset-0 h-full w-full rounded-2xl bg-gray-900 shadow-lg [backface-visibility:hidden] overflow-hidden">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover opacity-60 grayscale"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-10 h-10 text-white"
                          >
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm8 2c-1.5 0-4.5.75-4.5 2.25V18h9v-2.75C20.5 13.75 17.5 13 16 13zm-8 0c-1.5 0-4.5.75-4.5 2.25V18h9v-2.75C12.5 13.75 9.5 13 8 13z" />
                          </svg>
                        </div>
                        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                          <h3 className="text-3xl font-bold text-white font-['Lora']">
                            {service.title}
                          </h3>
                        </div>
                        <div
                          className="absolute bottom-0 left-0 w-40 h-32"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at bottom left, rgba(249,115,22,0.9) 0%, rgba(249,115,22,0.6) 40%, rgba(249,115,22,0.2) 70%, transparent 100%)",
                            maskImage:
                              "radial-gradient(circle at bottom left, black 0%, transparent 100%)",
                            WebkitMaskImage:
                              "radial-gradient(circle at bottom left, black 0%, transparent 100%)",
                          }}
                        ></div>
                      </div>

                      {/* Back */}
                      <div className="absolute inset-0 h-full w-full rounded-2xl bg-white shadow-lg overflow-hidden [backface-visibility:hidden] [transform:rotateY(-180deg)] border border-gray-200">
                        <div
                          className="absolute top-0 right-0 w-full h-full opacity-50 pointer-events-none"
                          style={{
                            background:
                              "radial-gradient(ellipse 120px 120px at top right, rgba(249,115,22,0.8) 0%, rgba(249,115,22,0.5) 25%, rgba(249,115,22,0.2) 50%, rgba(249,115,22,0.1) 75%, transparent 100%)",
                          }}
                        ></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-10 h-10 text-white"
                          >
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm8 2c-1.5 0-4.5.75-4.5 2.25V18h9v-2.75C20.5 13.75 17.5 13 16 13zm-8 0c-1.5 0-4.5.75-4.5 2.25V18h9v-2.75C12.5 13.75 9.5 13 8 13z" />
                          </svg>
                        </div>
                        <div className="absolute bottom-8 left-8 right-8 text-center">
                          <h3 className="text-3xl font-bold text-black font-['Lora'] mb-6">
                            {service.title}
                          </h3>
                          <div className="flex justify-center">
                            <InteractiveHoverButton
                              onClick={() => {}}
                              className="!bg-white !border-black !text-black hover:!bg-black hover:!text-white hover:!border-black [&>div>div]:!bg-black [&>div:last-child]:!text-white"
                            >
                              Read More
                            </InteractiveHoverButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-cyan-500 hover:text-cyan-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-cyan-500 hover:text-cyan-500"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Third;
