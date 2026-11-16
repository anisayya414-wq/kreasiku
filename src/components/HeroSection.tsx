import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Minus, Plus } from 'lucide-react';
import type { StudioCopy } from '../data/translations';
import {
  CurvedArrow,
  DieCutSticker,
  FlowingPastelRibbons,
  HangingTasselCharm,
  HeroPostcardArt,
  Starburst,
} from './SvgMotifs';
import {
  REFERENCE_ICON_BADGE_CYCLE,
  REFERENCE_PALETTE_CYCLE,
  resolvePastelSurface,
} from '../utils/pastelTheme';

interface HeroSectionProps {
  copy: StudioCopy['hero'];
  sceneImages?: [string, string, string];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ copy, sceneImages }) => {
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(
    copy.accordions[0]?.id ?? null
  );
  const prefersReduced = useReducedMotion();
  const activeScene = copy.scenes[activeSceneIdx] ?? copy.scenes[0];

  const toggleAccordion = (id: string) => {
    setOpenAccordionId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="top"
      className="relative bg-dreamy-pastel pt-8 pb-12 sm:pt-12 sm:pb-16 overflow-hidden"
    >
      {/* Flowing translucent pastel silk ribbons backdrop */}
      <FlowingPastelRibbons className="absolute inset-x-0 top-0 w-full h-72 sm:h-96 opacity-75" />

      {/* Hanging jeweled tassels in top desktop corners (matches reference top-right & bottom-left) */}
      <HangingTasselCharm
        tone="jade"
        className="hidden xl:block absolute top-0 left-6 w-12 h-32 opacity-85"
      />
      <HangingTasselCharm
        tone="mauve"
        className="hidden xl:block absolute top-0 right-10 w-12 h-36 opacity-85"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Dreamy Collage Showcase + Perforated Cinema Filmstrip Scene Switcher */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full max-w-[600px] min-h-[400px] sm:min-h-[465px] flex items-center justify-center py-4 px-2">
              {/* Handwritten annotation: Postcard (bottom left) */}
              <div className="hidden sm:flex items-center gap-1.5 absolute bottom-2 left-8 z-30 pointer-events-none">
                <span className="font-hand text-xl text-[#4A69CE] -rotate-6">
                  {copy.collageNotes.postcardLabel}
                </span>
                <CurvedArrow variant="loop-up" className="w-10 h-9 -mt-3" />
              </div>

              {/* Handwritten annotation: Manifesto Letter (top center) */}
              <div className="hidden sm:flex flex-col items-center absolute top-1 left-[40%] z-30 pointer-events-none">
                <span className="font-hand text-xl text-[#4A69CE] -rotate-3">
                  {copy.collageNotes.letterLabel}
                </span>
                <CurvedArrow
                  variant="loop-right"
                  className="w-12 h-8 rotate-12 -mt-1"
                />
              </div>

              {/* Handwritten annotation: Die-Cut Sticker (bottom right) */}
              <div className="hidden sm:flex items-center gap-1 absolute bottom-2 right-12 z-30 pointer-events-none">
                <span className="font-hand text-xl text-[#4A69CE] rotate-3 leading-none text-center">
                  {copy.collageNotes.stickerLabel}
                </span>
                <CurvedArrow variant="loop-up" className="w-10 h-9 -mt-3" />
              </div>

              {/* 4-point sparkles */}
              <Starburst
                className="w-9 h-9 sm:w-11 sm:h-11 absolute top-6 left-10 sm:left-16 z-30"
                color="#BCA4F5"
                points={4}
              />
              <Starburst
                className="w-8 h-8 sm:w-10 sm:h-10 absolute bottom-7 left-[34%] z-30"
                color="#4A69CE"
                points={4}
              />

              {/* Collage Stage */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScene.id}
                  initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="relative w-full h-[370px] sm:h-[420px]"
                >
                  {/* 1. Back Frosted Postcard Reverse */}
                  <div
                    className="hidden sm:block absolute left-[28%] bottom-6 w-[210px] h-[145px] bg-white/90 border border-[#4A69CE]/30 rounded-2xl p-3 shadow-pastel rotate-[14deg] z-10"
                    aria-hidden="true"
                  >
                    <div className="w-full h-full border border-[#4A69CE]/20 rounded-xl flex">
                      <div className="w-1/2 border-r border-[#4A69CE]/20 p-2 flex flex-col justify-end">
                        <span className="font-editorial text-[9px] text-[#4A69CE]/80">
                          {copy.collageNotes.stampLabel}
                        </span>
                      </div>
                      <div className="w-1/2 p-2 flex flex-col justify-between items-end">
                        <div className="w-8 h-9 border border-dashed border-[#4A69CE]/45 bg-[#E5F8F0] rounded" />
                        <div className="w-full space-y-2 pb-1">
                          <div className="h-[1px] bg-[#4A69CE]/30 w-full" />
                          <div className="h-[1px] bg-[#4A69CE]/30 w-full" />
                          <div className="h-[1px] bg-[#4A69CE]/30 w-3/4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Main Featured Artwork Card (supports CMS sceneImages slot) */}
                  <div className="absolute left-0 sm:left-8 top-4 sm:top-6 w-[156px] sm:w-[228px] h-[214px] sm:h-[304px] bg-white border border-[#4A69CE]/30 rounded-2xl p-2 shadow-pastel -rotate-[6deg] sm:-rotate-[7deg] z-20 transition-transform duration-200 hover:-translate-y-1">
                    <div className="relative w-full h-full overflow-hidden rounded-xl border border-[#4A69CE]/20 bg-[#E5F8F0]">
                      {sceneImages?.[activeSceneIdx] ? (
                        <img
                          src={sceneImages[activeSceneIdx]}
                          alt={activeScene.postcardTitle}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <HeroPostcardArt sceneIndex={activeSceneIdx} />
                      )}
                      <div className="absolute top-2.5 sm:top-3 inset-x-1.5 sm:inset-x-2 text-center pointer-events-none">
                        <div className="inline-block px-2.5 py-1 rounded-xl bg-white/80 backdrop-blur-xs">
                          <p className="font-editorial italic text-xs sm:text-base font-semibold text-[#1E2B58] leading-tight">
                            {activeScene.postcardTitle}
                          </p>
                          <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.12em] font-semibold text-[#4A69CE] mt-0.5">
                            {activeScene.postcardSub}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Translucent Sky-Blue Envelope + Studio Manifesto Letter (Right) */}
                  <div className="absolute right-0 sm:right-6 top-12 sm:top-6 w-[198px] sm:w-[255px] z-20 sm:z-10">
                    <div className="relative mx-auto w-full h-[205px] sm:h-[245px]">
                      <div
                        className="absolute top-0 inset-x-0 h-14 sm:h-16 bg-[#81CFFF]/75 border border-[#4A69CE]/30"
                        style={{
                          clipPath: 'polygon(0 100%, 50% 0%, 100% 100%)',
                        }}
                      />
                      {/* Manifesto Card */}
                      <div className="relative z-10 mx-auto w-[88%] sm:w-[86%] mt-3 bg-white/95 border border-[#4A69CE]/25 rounded-2xl p-2.5 sm:p-4 pb-5 sm:pb-6 shadow-pastel-sm">
                        <Starburst
                          className="w-6 h-6 sm:w-7 sm:h-7 absolute -top-3 -right-3"
                          color="#BCA4F5"
                          points={4}
                        />
                        <p className="font-editorial text-xs sm:text-base font-bold text-[#1E2B58] mb-1 sm:mb-1.5">
                          <span className="text-lg sm:text-2xl text-[#4A69CE] mr-0.5">
                            {activeScene.letterHeading.charAt(0)}
                          </span>
                          {activeScene.letterHeading.slice(1)}
                        </p>
                        <p className="text-[9.5px] sm:text-[11px] leading-relaxed text-[#1E2B58]/85">
                          {activeScene.letterBody}
                        </p>
                      </div>
                      {/* Envelope front pocket */}
                      <div
                        className="relative z-20 -mt-4 h-14 sm:h-20 rounded-b-2xl border border-[#4A69CE]/30 shadow-pastel-sm flex items-end justify-center pb-2 sm:pb-2.5"
                        style={{
                          background:
                            'linear-gradient(135deg, #D7F0FF 0%, #E5F8F0 55%, #E9DFFD 100%)',
                        }}
                      >
                        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.14em] font-bold text-[#4A69CE]">
                          {activeScene.stickerTag}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4. Floating Pastel Die-Cut Charm overlapping bottom right */}
                  <motion.div
                    whileHover={prefersReduced ? undefined : { scale: 1.07, rotate: 6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-4 sm:right-10 bottom-4 sm:bottom-5 z-30 sticker-shadow cursor-default"
                  >
                    <DieCutSticker
                      variant={
                        activeSceneIdx === 0
                          ? 'hydrangea'
                          : activeSceneIdx === 1
                            ? 'lucky-card'
                            : 'strawberry'
                      }
                      label="KREASIKU"
                      className="w-24 h-24 sm:w-32 sm:h-32"
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Hero Mini Cinema Filmstrip Showcase Switcher (matching reference bottom-right filmstrip) */}
            <div className="mt-3 w-full max-w-[460px]">
              <div className="filmstrip-shell rounded-2xl p-1.5 border border-[#4A69CE]/40 -rotate-[0.7deg]">
                <div className="filmstrip-sprocket-row w-full opacity-95" aria-hidden="true" />
                <div
                  className="grid grid-cols-3 gap-2 px-2 py-1.5"
                  role="tablist"
                  aria-label="Creative studio collage previews"
                >
                  {copy.scenes.map((scene, idx) => {
                    const isSelected = idx === activeSceneIdx;
                    return (
                      <button
                        key={scene.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        aria-label={scene.thumbLabel}
                        onClick={() => setActiveSceneIdx(idx)}
                        className={`group relative rounded-xl p-1 bg-white/95 border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-white ${
                          isSelected
                            ? 'border-[#4A69CE] ring-2 ring-[#ECFFBE] -translate-y-0.5 shadow-md'
                            : 'border-white/70 opacity-85 hover:opacity-100 hover:-translate-y-0.5'
                        }`}
                      >
                        <div className="w-full h-14 sm:h-16 overflow-hidden rounded-lg bg-[#E5F8F0] mb-1">
                          {sceneImages?.[idx] ? (
                            <img
                              src={sceneImages[idx]}
                              alt={scene.thumbLabel}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <HeroPostcardArt sceneIndex={idx} />
                          )}
                        </div>
                        <span className="block text-[9.5px] sm:text-[10px] font-bold text-[#1E2B58] truncate px-0.5">
                          {scene.thumbLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="filmstrip-sprocket-row w-full opacity-95" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Headline, Overview, Royal Blue CTAs, & Reference Palette-Style Accordions */}
          <div className="lg:col-span-5 flex flex-col">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4A69CE] mb-2">
              {copy.studioLabel}
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl xl:text-[42px] font-semibold leading-[1.14] text-[#1E2B58] [text-wrap:balance]">
              {copy.headline}
            </h1>
            <p className="mt-2 font-editorial italic text-base sm:text-lg text-[#4A69CE]">
              {copy.tagline}
            </p>
            <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-[#1E2B58]/85">
              {copy.overview}
            </p>

            {/* Two Full-Width Stacked CTA Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="#portfolio"
                className="w-full py-3 px-5 bg-[#E5F8F0] hover:bg-[#D7F0FF] text-[#1E2B58] border border-[#4A69CE]/30 rounded-xl text-center text-xs sm:text-sm font-semibold tracking-[0.1em] uppercase transition-colors shadow-pastel-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#4A69CE]"
              >
                {copy.ctaExplore}
              </a>
              <a
                href="#order"
                className="w-full py-3 px-5 bg-[#4A69CE] hover:bg-[#334FA8] text-white border border-[#4A69CE] rounded-xl text-center text-xs sm:text-sm font-semibold tracking-[0.1em] uppercase transition-colors shadow-pastel whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#1E2B58]"
              >
                {copy.ctaStart}
              </a>
            </div>

            {/* Three Pastel Accordions Styled Directly After Reference Panel 4 */}
            <div className="mt-6 flex flex-col gap-3">
              {copy.accordions.map((acc, idx) => {
                const isOpen = openAccordionId === acc.id;
                const badgePalette =
                  REFERENCE_ICON_BADGE_CYCLE[
                    idx % REFERENCE_ICON_BADGE_CYCLE.length
                  ];
                const barSurface = resolvePastelSurface(
                  acc.bg,
                  REFERENCE_PALETTE_CYCLE[idx % REFERENCE_PALETTE_CYCLE.length]
                );

                return (
                  <div
                    key={acc.id}
                    className="border border-[#4A69CE]/20 rounded-2xl shadow-pastel-sm overflow-hidden transition-transform duration-150"
                    style={{ backgroundColor: barSurface }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(acc.id)}
                      aria-expanded={isOpen}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#4A69CE]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="shrink-0 w-9 h-9 rounded-xl border border-white/80 shadow-xs flex items-center justify-center"
                          style={{ backgroundColor: badgePalette.bg }}
                          aria-hidden="true"
                        >
                          <Starburst
                            className="w-5 h-5"
                            color={badgePalette.star}
                            points={4}
                          />
                        </span>
                        <span className="font-editorial text-sm sm:text-[15px] font-semibold text-[#1E2B58] truncate">
                          {acc.title}
                        </span>
                      </div>

                      <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/75 text-[#4A69CE]">
                        {isOpen ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={
                            prefersReduced
                              ? { opacity: 1 }
                              : { height: 0, opacity: 0 }
                          }
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={
                            prefersReduced
                              ? { opacity: 0 }
                              : { height: 0, opacity: 0 }
                          }
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-3.5 pt-2.5 border-t border-[#4A69CE]/15 bg-white/80 text-xs sm:text-[13px] leading-relaxed text-[#1E2B58]">
                            {acc.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
