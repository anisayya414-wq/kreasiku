import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Language, TestimonialItem } from '../types/studio';
import { getBilingual, type StudioCopy } from '../data/translations';
import { stepSlideIndex, wrapSlideIndex } from '../utils/studioLogic';
import { resolvePastelSurface } from '../utils/pastelTheme';
import { HeartIcon, Starburst } from './SvgMotifs';

interface TestimonialScrapSliderProps {
  lang: Language;
  copy: StudioCopy['about']['testimonials'];
  items: TestimonialItem[];
}

export const TestimonialScrapSlider: React.FC<TestimonialScrapSliderProps> = ({
  lang,
  copy,
  items,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const prefersReduced = useReducedMotion();

  if (items.length === 0) {
    return null;
  }

  const goStep = (delta: 1 | -1) => {
    setDirection(delta);
    setActiveIndex((prev) => stepSlideIndex(prev, delta, items.length));
  };

  const goToIndex = (target: number) => {
    const wrapped = wrapSlideIndex(target, items.length);
    setDirection(wrapped >= activeIndex ? 1 : -1);
    setActiveIndex(wrapped);
  };

  const primaryItem = items[activeIndex];
  const secondaryItem = items[wrapSlideIndex(activeIndex + 1, items.length)];

  const slideVariants = {
    enter: (dir: number) =>
      prefersReduced
        ? { opacity: 0 }
        : { opacity: 0, x: dir > 0 ? 48 : -48, rotate: dir > 0 ? 1.5 : -1.5 },
    center: {
      opacity: 1,
      x: 0,
      rotate: 0,
    },
    exit: (dir: number) =>
      prefersReduced
        ? { opacity: 0 }
        : { opacity: 0, x: dir > 0 ? -48 : 48, rotate: dir > 0 ? -1.5 : 1.5 },
  };

  const renderCard = (item: TestimonialItem, isSecondaryDesktop = false) => {
    const isTelegram = item.style === 'telegram';
    const surfaceBg = resolvePastelSurface(item.paperTone, '#E5F8F0');
    const tapeBg = resolvePastelSurface(item.tapeColor, '#D7F0FF');

    return (
      <div
        className={`relative h-full ${
          isSecondaryDesktop ? 'hidden md:block' : 'block'
        }`}
      >
        {/* Backing soft translucent pastel card */}
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-3xl bg-[#81CFFF]/35 border border-[#4A69CE]/20"
          style={{
            transform: prefersReduced
              ? undefined
              : `rotate(${item.tiltDeg * -1.05}deg)`,
          }}
        />

        {isTelegram ? (
          <article
            className="relative h-full rounded-3xl border border-[#4A69CE]/25 p-3 sm:p-4 shadow-pastel flex flex-col justify-between"
            style={{
              backgroundColor: surfaceBg,
              transform: prefersReduced
                ? undefined
                : `rotate(${item.tiltDeg}deg)`,
            }}
          >
            {/* Pastel ribbon tape accent */}
            <span
              aria-hidden="true"
              className="absolute -top-2.5 right-6 w-16 h-5 rounded-md border border-[#4A69CE]/25 rotate-3 opacity-90"
              style={{ backgroundColor: tapeBg }}
            />

            {/* Header strip */}
            <div
              className="rounded-2xl border border-[#4A69CE]/20 px-3.5 py-2 flex items-center justify-between gap-2"
              style={{ backgroundColor: tapeBg }}
            >
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-[#1E2B58]">
                {copy.telegramBadge}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#4A69CE] tabular-nums">
                {item.dispatchCode}
              </span>
            </div>

            {/* Inner translucent slip */}
            <div className="my-3 p-4 rounded-2xl border border-[#4A69CE]/20 bg-white/90 flex-1 flex flex-col justify-between relative">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4A69CE] pb-2 border-b border-[#4A69CE]/15">
                <span>{item.dateLabel}</span>
                <span>{getBilingual(item.projectTag, lang)}</span>
              </div>

              <p className="my-3.5 text-xs sm:text-[13px] font-semibold tracking-[0.04em] leading-relaxed text-[#1E2B58] uppercase">
                {getBilingual(item.quote, lang)}
              </p>

              <div className="pt-2 border-t border-[#4A69CE]/15 flex items-end justify-between gap-3">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#4A69CE] font-bold">
                    {getBilingual(item.senderPlaceholder, lang)}
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="shrink-0 w-16 h-16 rounded-full border-2 border-dashed border-[#4A69CE]/50 flex flex-col items-center justify-center -rotate-12 text-[#4A69CE] px-1 bg-[#E5F8F0]/60"
                >
                  <HeartIcon className="w-3 h-3" color="#4A69CE" />
                  <span className="text-[7.5px] font-bold tracking-[0.12em] leading-none mt-1 text-center">
                    {copy.stampedLabel}
                  </span>
                </div>
              </div>
            </div>
          </article>
        ) : (
          <article
            className="relative h-full rounded-3xl border border-[#4A69CE]/25 p-5 sm:p-6 shadow-pastel flex flex-col justify-between"
            style={{
              backgroundColor: surfaceBg,
              backgroundImage:
                'repeating-linear-gradient(transparent, transparent 27px, rgba(74, 105, 206, 0.1) 28px)',
              transform: prefersReduced
                ? undefined
                : `rotate(${item.tiltDeg}deg)`,
            }}
          >
            {/* Centered top ribbon strip */}
            <span
              aria-hidden="true"
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full border border-[#4A69CE]/25 -rotate-2 opacity-90"
              style={{ backgroundColor: tapeBg }}
            />

            <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#4A69CE] pt-1">
              <span className="inline-flex items-center gap-1.5">
                <Starburst className="w-3 h-3" color="#BCA4F5" points={4} />
                {copy.noteBadge}
              </span>
              <span className="tabular-nums text-[#1E2B58]/70">
                {item.dispatchCode}
              </span>
            </div>

            <blockquote className="my-4 font-hand text-2xl sm:text-[26px] leading-[28px] text-[#1E2B58] font-semibold">
              {getBilingual(item.quote, lang)}
            </blockquote>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#4A69CE]/15 text-xs">
              <span className="font-editorial italic font-semibold text-[#1E2B58]">
                — {getBilingual(item.senderPlaceholder, lang)}
              </span>
              <span className="text-[11px] font-semibold text-[#4A69CE] whitespace-nowrap">
                {getBilingual(item.projectTag, lang)}
              </span>
            </div>
          </article>
        )}
      </div>
    );
  };

  return (
    <div
      className="mt-14 pt-10 border-t border-[#4A69CE]/20"
      aria-roledescription="carousel"
      aria-label={copy.title}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          goStep(-1);
        } else if (e.key === 'ArrowRight') {
          goStep(1);
        }
      }}
    >
      {/* Slider Header + Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4A69CE] mb-1">
            {copy.eyebrow}
          </p>
          <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1E2B58] [text-wrap:balance]">
            {copy.title}
          </h3>
          {copy.placeholderNote.trim() && (
            <p className="mt-1 text-xs text-[#1E2B58]/70 italic">
              {copy.placeholderNote}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span
            className="text-xs font-bold tracking-widest text-[#4A69CE] tabular-nums mr-1"
            aria-live="polite"
          >
            0{activeIndex + 1} / 0{items.length}
          </span>
          <button
            type="button"
            onClick={() => goStep(-1)}
            aria-label={copy.prevLabel}
            className="w-10 h-10 rounded-xl inline-flex items-center justify-center bg-white hover:bg-[#E5F8F0] border border-[#4A69CE]/25 text-[#1E2B58] shadow-pastel-sm cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#4A69CE]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => goStep(1)}
            aria-label={copy.nextLabel}
            className="w-10 h-10 rounded-xl inline-flex items-center justify-center bg-[#D7F0FF] hover:bg-[#81CFFF]/55 border border-[#4A69CE]/25 text-[#1E2B58] shadow-pastel-sm cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#4A69CE]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Animated Pastel Slider Stage */}
      <div className="relative overflow-hidden py-5 px-2.5 sm:px-3">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={primaryItem.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            drag={prefersReduced ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) {
                goStep(1);
              } else if (info.offset.x > 50) {
                goStep(-1);
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 cursor-grab active:cursor-grabbing"
          >
            {renderCard(primaryItem, false)}
            {items.length > 1 && renderCard(secondaryItem, true)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Selector */}
      <div
        className="mt-4 flex flex-wrap items-center justify-center gap-2"
        role="tablist"
        aria-label={copy.title}
      >
        {items.map((item, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-label={`${copy.selectNotePrefix} 0${idx + 1}`}
              onClick={() => goToIndex(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold tracking-wider uppercase border transition-colors cursor-pointer tabular-nums min-h-[36px] focus-visible:outline-2 focus-visible:outline-[#4A69CE] ${
                isSelected
                  ? 'bg-[#4A69CE] text-white border-[#4A69CE] shadow-xs'
                  : 'bg-white/90 text-[#1E2B58] border-[#4A69CE]/20 hover:bg-[#E5F8F0]'
              }`}
            >
              0{idx + 1} · {item.style === 'telegram' ? 'WIRE' : 'NOTE'}
            </button>
          );
        })}
      </div>
    </div>
  );
};
