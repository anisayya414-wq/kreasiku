import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Language, TestimonialItem } from '../types/studio';
import { TESTIMONIALS_DATA, type StudioCopy } from '../data/translations';
import { DieCutSticker, Starburst } from './SvgMotifs';
import { TestimonialScrapSlider } from './TestimonialScrapSlider';

interface AboutSectionProps {
  lang: Language;
  copy: StudioCopy['about'];
  testimonials?: TestimonialItem[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  lang,
  copy,
  testimonials,
}) => {
  const prefersReduced = useReducedMotion();
  const [activeSticker, setActiveSticker] = useState<string | null>(null);

  const stickers = [
    {
      id: 'strawberry',
      variant: 'strawberry' as const,
      label: copy.callouts.postcard,
      rotate: -7,
    },
    {
      id: 'vintage-frame',
      variant: 'vintage-frame' as const,
      label: copy.callouts.letter,
      rotate: 5,
    },
    {
      id: 'lucky-card',
      variant: 'lucky-card' as const,
      label: copy.callouts.sticker,
      rotate: -4,
    },
    {
      id: 'bouquet',
      variant: 'bouquet' as const,
      label: copy.valuesList[0],
      rotate: 6,
    },
    {
      id: 'heart-seal',
      variant: 'heart-seal' as const,
      label: copy.callouts.seal,
      rotate: -5,
    },
    {
      id: 'flip-phone',
      variant: 'flip-phone' as const,
      label: copy.valuesList[1],
      rotate: 5,
    },
    {
      id: 'sparkle-wand',
      variant: 'sparkle-wand' as const,
      label: copy.valuesList[2],
      rotate: -6,
    },
  ];

  return (
    <section
      id="about"
      className="relative bg-[#F6FCF9] py-14 sm:py-20 overflow-hidden scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col items-start mb-10">
          <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#1E2B58] [text-wrap:balance]">
            {copy.title}
          </h2>
          <p className="mt-1.5 text-sm text-[#1E2B58]/75">{copy.subtitle}</p>
        </div>

        {/* Interactive Charm Playground + Studio Story, Vision, Mission, Values */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: Interactive Floating Pastel Charm Board */}
          <div className="lg:col-span-6 relative">
            <div
              className="relative rounded-3xl border border-[#4A69CE]/20 p-5 sm:p-7 shadow-pastel"
              style={{
                background:
                  'linear-gradient(145deg, rgba(229,248,240,0.85) 0%, rgba(255,255,255,0.9) 52%, rgba(233,223,253,0.65) 100%)',
              }}
            >
              <Starburst
                className="w-9 h-9 absolute -top-4 -left-4"
                color="#81CFFF"
                points={4}
              />
              <Starburst
                className="w-7 h-7 absolute -bottom-3 -right-3"
                color="#4A69CE"
                points={4}
              />

              {/* Clean callout header */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#1E2B58]">
                  <Starburst className="w-3.5 h-3.5" color="#4A69CE" points={4} />
                  {copy.callouts.postcard}
                </span>
                <span className="inline-block bg-[#4A69CE] text-white text-xs font-editorial italic px-4 py-1.5 rounded-full -rotate-2 shadow-xs">
                  {copy.callouts.seal}
                </span>
                <span className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#1E2B58]">
                  <Starburst className="w-3.5 h-3.5" color="#BCA4F5" points={4} />
                  {copy.callouts.sticker}
                </span>
              </div>

              {/* Interactive Hover/Tap Die-Cut Pastel Charms */}
              <div className="flex flex-wrap items-start justify-center gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-5 py-2">
                {stickers.map((item) => {
                  const isActive = activeSticker === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setActiveSticker(isActive ? null : item.id)
                      }
                      initial={{ rotate: item.rotate }}
                      whileHover={
                        prefersReduced
                          ? undefined
                          : { y: -8, rotate: item.rotate * -0.6, scale: 1.08 }
                      }
                      whileTap={prefersReduced ? undefined : { scale: 0.96 }}
                      transition={{
                        type: 'spring',
                        stiffness: 320,
                        damping: 18,
                      }}
                      className="group relative flex flex-col items-center w-[calc(50%-0.5rem)] sm:w-[calc(25%-0.85rem)] max-w-[132px] p-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4A69CE] rounded-2xl"
                      aria-label={item.label}
                    >
                      <div className="sticker-shadow">
                        <DieCutSticker
                          variant={item.variant}
                          label="Kreasiku"
                          className="w-20 h-24 sm:w-24 sm:h-28"
                        />
                      </div>
                      <span
                        className={`mt-1.5 text-[11px] font-hand font-semibold text-[#1E2B58] text-center transition-opacity ${
                          isActive
                            ? 'opacity-100 underline text-[#4A69CE]'
                            : 'opacity-80 group-hover:opacity-100'
                        }`}
                      >
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Studio Story, Vision, Creative Values, Mission */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-2xl border border-[#4A69CE]/20 bg-white/90 p-5 sm:p-6 shadow-pastel-sm">
              <h3 className="font-editorial text-xl font-semibold text-[#1E2B58] mb-2">
                {copy.storyTitle}
              </h3>
              <p className="text-sm sm:text-[15px] leading-relaxed text-[#1E2B58]/85">
                {copy.storyText}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#4A69CE]/20 bg-[#D7F0FF]/70 p-5 shadow-pastel-sm">
                <h3 className="font-editorial text-lg font-semibold text-[#1E2B58] mb-2">
                  {copy.visionTitle}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#1E2B58]/90">
                  {copy.visionText}
                </p>
              </div>

              <div className="rounded-2xl border border-[#4A69CE]/20 bg-[#E9DFFD]/75 p-5 shadow-pastel-sm">
                <h3 className="font-editorial text-lg font-semibold text-[#1E2B58] mb-2">
                  {copy.valuesTitle}
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#1E2B58]/90">
                  {copy.valuesList.map((val) => (
                    <li key={val} className="flex items-center gap-2">
                      <Starburst
                        className="w-3 h-3 shrink-0"
                        color="#4A69CE"
                        points={4}
                      />
                      <span>{val}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-[#4A69CE]/20 bg-[#ECFFBE]/75 p-5 shadow-pastel-sm">
              <h3 className="font-editorial text-lg font-semibold text-[#1E2B58] mb-2">
                {copy.missionTitle}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#1E2B58]/90">
                {copy.missionItems.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-editorial font-bold text-[#4A69CE] tabular-nums">
                      0{idx + 1}.
                    </span>
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Client Praise Dispatch Slider */}
        <TestimonialScrapSlider
          lang={lang}
          copy={copy.testimonials}
          items={
            testimonials && testimonials.length > 0
              ? testimonials
              : TESTIMONIALS_DATA
          }
        />
      </div>
    </section>
  );
};
