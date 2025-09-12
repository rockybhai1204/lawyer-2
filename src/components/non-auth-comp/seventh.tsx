"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const Seventh = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const caseStudies = [
        {
            id: 1,
            image: "/img1.webp",
            title: "Corporate Merger",
            subtitle: "Business Law Case Study",
            description: "Successfully handled a complex corporate merger involving multiple stakeholders and regulatory compliance requirements."
        },
        {
            id: 2,
            image: "/img2.webp",
            title: "Insider Trading",
            subtitle: "Securities Law Case Study",
            description: "Defended client in high-profile insider trading case with focus on regulatory compliance and ethical standards."
        },
        {
            id: 3,
            image: "/img1.webp",
            title: "Criminal Defense",
            subtitle: "Criminal Law Case Study",
            description: "Achieved favorable outcome in complex criminal defense case through strategic legal arguments and evidence presentation."
        },
        {
            id: 4,
            image: "/img2.webp",
            title: "Family Dispute",
            subtitle: "Family Law Case Study",
            description: "Resolved sensitive family dispute through mediation and negotiation, protecting client's interests and family relationships."
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % caseStudies.length);
                setIsAnimating(false);
            }, 600); // animation time
        }, 5000);

        return () => clearInterval(interval);
    }, [caseStudies.length]);

    const getVisibleCases = () => {
        const cases = [];
        for (let i = -1; i <= 1; i++) {
            const index = (currentIndex + i + caseStudies.length) % caseStudies.length;
            cases.push({
                ...caseStudies[index],
                position: i // -1 left, 0 center, 1 right
            });
        }
        return cases;
    };

    return (
        <section className="relative bg-black py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 px-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 text-cyan-400 font-semibold mb-6">
                                <Image src="/icon.webp" width={32} height={32} alt="case studies icon" className="invert" />
                                <span className="text-2xl font-['Lora']">Case Studies</span>
                            </div>
                            <h2 className="text-3xl lg:text-5xl font-bold text-white font-['Lora'] leading-tight">
                                Our Recent Case
                            </h2>
                        </div>

                        <div className="mt-4">
                            <InteractiveHoverButton
                                onClick={() => { }}
                                className="!bg-gray-800 !border-gray-700 !text-white hover:!bg-cyan-400 hover:!text-black hover:!border-cyan-400 [&>div>div]:!bg-cyan-400 [&>div:last-child]:!text-black"
                            >
                                <span className="flex items-center gap-2">
                                    More Studies
                                </span>
                            </InteractiveHoverButton>
                        </div>
                    </div>
                </div>

                {/* Mobile/Tablet Carousel - Below lg screens */}
                <div className="block lg:hidden">
                    <div className="relative w-full h-96 mb-32">
                        <div 
                            className="relative w-full h-full overflow-visible transition-all duration-700 ease-in-out"
                            style={{
                                transform: isAnimating ? "scale(0.97)" : "scale(1)",
                                opacity: isAnimating ? 0.8 : 1
                            }}
                        >
                            <Image
                                src={caseStudies[currentIndex].image}
                                alt={caseStudies[currentIndex].title}
                                fill
                                className="object-cover"
                            />

                            {/* Content Card - Same as desktop center card */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4/5 max-w-md z-30">
                                <div className="bg-black/95 backdrop-blur-sm p-6 text-center shadow-2xl border border-gray-700 rounded-lg">
                                    <h3 className="text-2xl lg:text-3xl font-bold font-['Lora'] mb-3 text-white">
                                        {caseStudies[currentIndex].title}
                                    </h3>
                                    <p className="text-yellow-600 text-base font-medium mb-4 font-['Lora']">
                                        {caseStudies[currentIndex].subtitle}
                                    </p>
                                    <div className="w-12 h-px bg-gray-500 mx-auto mb-4"></div>
                                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                                        {caseStudies[currentIndex].description}
                                    </p>
                                    <InteractiveHoverButton
                                        onClick={() => { }}
                                        className="!bg-cyan-400 !border-cyan-400 !text-black hover:!bg-black hover:!text-cyan-400 hover:!border-cyan-400 [&>div>div]:!bg-black [&>div:last-child]:!text-cyan-400"
                                    >
                                        <span className="flex items-center gap-2">
                                            Read More
                                        </span>
                                    </InteractiveHoverButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Carousel */}
            </div>
            <div className="hidden lg:block relative h-96 w-full mb-32">
                <div className="flex w-full h-full -space-x-20">
                    {getVisibleCases().map((caseStudy) => (
                        <div
                            key={`${caseStudy.id}-${currentIndex}`}
                            className={`relative transition-all duration-700 ease-in-out h-full flex-1 z-10`}
                            style={{
                                clipPath:
                                    caseStudy.position === -1
                                        ? "inset(0 20% 0 0)"
                                        : caseStudy.position === 1
                                            ? "inset(0 0 0 20%)"
                                            : "none",
                                transform: isAnimating ? "scale(0.97)" : "scale(1)",
                                opacity: isAnimating ? 0.8 : 1
                            }}
                        >
                            <div className="relative w-full h-full overflow-visible cursor-pointer">
                                <div className="group w-full h-full">
                                    <Image
                                        src={caseStudy.image}
                                        alt={caseStudy.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Card only on center */}
                                {caseStudy.position === 0 && (
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4/5 max-w-md z-30">
                                        <div className="bg-black/95 backdrop-blur-sm p-6 text-center shadow-2xl border border-gray-700 rounded-lg">
                                            <h3 className="text-2xl lg:text-3xl font-bold font-['Lora'] mb-3 text-white">
                                                {caseStudy.title}
                                            </h3>
                                            <p className="text-yellow-600 text-base font-medium mb-4 font-['Lora']">
                                                {caseStudy.subtitle}
                                            </p>
                                            <div className="w-12 h-px bg-gray-500 mx-auto mb-4"></div>
                                            <p className="text-gray-300 text-sm leading-relaxed mb-6">
                                                {caseStudy.description}
                                            </p>
                                            <InteractiveHoverButton
                                                onClick={() => { }}
                                                className="!bg-cyan-400 !border-cyan-400 !text-black hover:!bg-black hover:!text-cyan-400 hover:!border-cyan-400 [&>div>div]:!bg-black [&>div:last-child]:!text-cyan-400"
                                            >
                                                <span className="flex items-center gap-2">
                                                    Read More
                                                </span>
                                            </InteractiveHoverButton>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"></div>
        </section>
    );
};

export default Seventh;
