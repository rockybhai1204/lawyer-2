"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const TOTAL_FRAMES = 6;
const FRAME_HEIGHT_VH = 100; // height each frame takes in scroll

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Eighth = () => {
  const [currentChess, setCurrentChess] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // For step 1 title visibility control
  const step1Ref = useRef<HTMLDivElement>(null);
  const isStep1InView = useInView(step1Ref, { amount: 0.2 }); // fade in/out

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const containerHeight = rect.height;
      
      // Calculate scroll progress within the container
      const scrollYInside = Math.min(
        Math.max(-rect.top, 0),
        containerHeight
      );

      // Slower progress calculation to ensure animation completes
      const progress = Math.min(1, scrollYInside / containerHeight);
      
      // Map progress to frame index with proper timing
      // This ensures the last frame appears before the component scrolls away
      // Doubled the frame progression to maintain sync with half the scroll distance
      const frameProgress = progress * TOTAL_FRAMES * 2;
      const frameIndex = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.ceil(frameProgress))
      );

      setCurrentChess(frameIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative bg-black">
      <div
        ref={containerRef}
        style={{
          height: `${(TOTAL_FRAMES * FRAME_HEIGHT_VH)/2}vh`,
        }}
      >
        <div className="sticky top-0 h-screen flex flex-col justify-between">
          {/* Header */}
          <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-6 pt-32 relative z-10">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 md:gap-3 text-cyan-400 font-semibold mb-6">
                <Image
                  src="/icon.webp"
                  width={28}
                  height={28}
                  alt="process icon"
                  className="invert md:w-9 md:h-9"
                />
                <span className="text-2xl md:text-3xl font-['Lora']">Easy Steps</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white font-['Lora'] leading-tight mb-12 md:mb-16">
                Your Way To Us
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20">
                {/* Step 1 */}
                <div className="text-center px-2">
                  <motion.div
                    ref={step1Ref}
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isStep1InView ? "visible" : "hidden"}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <div className="flex items-center justify-center mb-4 md:mb-6">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-cyan-400 rounded-full flex items-center justify-center text-black font-bold mr-3 md:mr-4 text-sm md:text-lg">
                        1
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold text-white font-['Lora']">
                        Books A Call
                      </h3>
                    </div>
                  </motion.div>
                  <motion.p
                    className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-xs md:max-w-sm mx-auto"
                    variants={fadeInUp}
                    initial="hidden"
                    animate={currentChess >= 2 ? "visible" : "hidden"}
                    transition={{ duration: 0.5 }}
                  >
                    Book an appointment for a free initial consultation - it's
                    simple and straightforward.
                  </motion.p>
                </div>

                {/* Step 2 */}
                <div className="text-center px-2">
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate={currentChess >= 3 ? "visible" : "hidden"}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-center mb-4 md:mb-6">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-cyan-400 rounded-full flex items-center justify-center text-black font-bold mr-3 md:mr-4 text-sm md:text-lg">
                        2
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold text-white font-['Lora']">
                        Strategy Session
                      </h3>
                    </div>
                  </motion.div>
                  <motion.p
                    className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-xs md:max-w-sm mx-auto"
                    variants={fadeInUp}
                    initial="hidden"
                    animate={currentChess >= 4 ? "visible" : "hidden"}
                    transition={{ duration: 0.5 }}
                  >
                    We will contact you by telephone on the scheduled date to
                    discuss your individual situation.
                  </motion.p>
                </div>

                {/* Step 3 */}
                <div className="text-center px-2">
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate={currentChess >= 5 ? "visible" : "hidden"}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-center mb-4 md:mb-6">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-cyan-400 rounded-full flex items-center justify-center text-black font-bold mr-3 md:mr-4 text-sm md:text-lg">
                        3
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold text-white font-['Lora']">
                        Consultation
                      </h3>
                    </div>
                  </motion.div>
                  <motion.p
                    className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-xs md:max-w-sm mx-auto"
                    variants={fadeInUp}
                    initial="hidden"
                    animate={currentChess >= 6 ? "visible" : "hidden"}
                    transition={{ duration: 0.5 }}
                  >
                    We book in your serious consultation and advice that will
                    really help you.
                  </motion.p>
                </div>
              </div>
            </div>
          </div>

          {/* Chess Animation */}
          <div className="relative flex-1 flex items-end justify-center">
            {Array.from({ length: TOTAL_FRAMES }, (_, index) => {
              const chessNumber = index + 1;
              const isActive = chessNumber === currentChess;

              return (
                <Image
                  key={chessNumber}
                  src={`/chess${chessNumber}.svg`}
                  alt={`Chess Board ${chessNumber}`}
                  width={1200}
                  height={300}
                  className={`absolute w-full h-auto object-contain transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"
                    }`}
                  style={{
                    filter: "brightness(0.8) contrast(1.2)",
                    bottom: 0,
                  }}
                />
              );
            })}
            {/* Black to invisible gradient overlay for SVG area */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-[30vh] pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                zIndex: 1,
                marginTop: "auto",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Eighth;