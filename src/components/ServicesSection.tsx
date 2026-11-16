import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import type { Language, ServiceId, ServiceItem } from '../types/studio';
import { SERVICES_DATA, getBilingual, type StudioCopy } from '../data/translations';
import {
  REFERENCE_ICON_BADGE_CYCLE,
  REFERENCE_PALETTE_CYCLE,
  resolvePastelSurface,
} from '../utils/pastelTheme';
import { DieCutSticker, ServiceStampIcon, Starburst } from './SvgMotifs';

interface ServicesSectionProps {
  lang: Language;
  copy: StudioCopy['services'];
  services?: ServiceItem[];
  onCommissionService: (serviceId: ServiceId) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  lang,
  copy,
  services,
  onCommissionService,
}) => {
  const [expandedId, setExpandedId] = useState<ServiceId | null>('video-editing');
  const prefersReduced = useReducedMotion();
  const serviceList = services && services.length > 0 ? services : SERVICES_DATA;

  const toggleService = (id: ServiceId) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getStickerForService = (id: ServiceId) => {
    switch (id) {
      case 'video-editing':
        return 'flip-phone' as const;
      case 'poster-design':
        return 'vintage-frame' as const;
      case 'graphic-design':
        return 'lucky-card' as const;
      case 'social-media-design':
        return 'strawberry' as const;
      case 'custom-creative-projects':
        return 'sparkle-wand' as const;
      case 'digital-illustration':
      default:
        return 'bouquet' as const;
    }
  };

  return (
    <section
      id="services"
      className="relative bg-pastel-stripes py-16 sm:py-22 border-b border-[#4A69CE]/15 scroll-mt-24"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Header on frosted pearl glass */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 glass-pastel rounded-3xl px-6 py-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4A69CE] mb-1.5">
            {copy.eyebrow}
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#1E2B58] [text-wrap:balance]">
            {copy.title}
          </h2>
          <p className="mt-2.5 text-sm sm:text-[15px] text-[#1E2B58]/85 leading-relaxed">
            {copy.subtitle}
          </p>
        </div>

        {/* Stack of 6 Rounded Pastel Accordion Bars inspired by Reference Panel 4 */}
        <div className="space-y-4">
          {serviceList.map((service, idx) => {
            const isOpen = expandedId === service.id;
            const badgeTone =
              REFERENCE_ICON_BADGE_CYCLE[idx % REFERENCE_ICON_BADGE_CYCLE.length];
            const cardBg = resolvePastelSurface(
              service.bgColor,
              REFERENCE_PALETTE_CYCLE[idx % REFERENCE_PALETTE_CYCLE.length]
            );

            return (
              <div
                key={service.id}
                className={`border border-[#4A69CE]/20 rounded-3xl shadow-pastel transition-all duration-200 overflow-hidden ${
                  isOpen ? '' : 'hover:-translate-y-0.5'
                }`}
                style={{ backgroundColor: cardBg }}
              >
                <button
                  type="button"
                  onClick={() => toggleService(service.id)}
                  aria-expanded={isOpen}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#4A69CE]"
                >
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    {/* Rounded square luminous icon badge inspired by Panel 4 */}
                    <div
                      className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-white/80 shadow-pastel-sm flex items-center justify-center relative"
                      style={{ backgroundColor: badgeTone.bg }}
                    >
                      <ServiceStampIcon serviceId={service.id} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-[#4A69CE]">
                        <span className="tabular-nums">{service.code}</span>
                        <span aria-hidden="true">·</span>
                        <span>{getBilingual(service.turnaround, lang)}</span>
                      </div>
                      <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-[#1E2B58] mt-0.5">
                        {getBilingual(service.title, lang)}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#1E2B58]/80 mt-1 line-clamp-2">
                        {getBilingual(service.shortDesc, lang)}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="hidden md:inline text-[11px] font-semibold uppercase tracking-wider text-[#4A69CE]">
                      {copy.expandHint}
                    </span>
                    <span
                      className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/90 border border-[#4A69CE]/20 text-[#4A69CE] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={
                        prefersReduced ? { opacity: 1 } : { height: 0, opacity: 0 }
                      }
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={
                        prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }
                      }
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-7 pb-6 pt-5 border-t border-[#4A69CE]/15 bg-white/85">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                          {/* Deliverables List */}
                          <div className="md:col-span-7 space-y-4">
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#4A69CE] mb-2">
                                {copy.deliverablesLabel}
                              </p>
                              <ul className="space-y-2">
                                {service.deliverables[lang].map((item) => (
                                  <li
                                    key={item}
                                    className="flex items-start gap-2.5 text-sm text-[#1E2B58]"
                                  >
                                    <Starburst
                                      className="w-3.5 h-3.5 mt-1 shrink-0"
                                      color="#BCA4F5"
                                      points={4}
                                    />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="pt-2 flex flex-wrap items-center gap-4">
                              <button
                                type="button"
                                onClick={() => onCommissionService(service.id)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A69CE] hover:bg-[#334FA8] text-white rounded-xl text-xs font-semibold uppercase tracking-[0.1em] transition-colors cursor-pointer shadow-pastel-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#1E2B58]"
                              >
                                <span>{copy.commissionBtn}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs text-[#1E2B58]/75">
                                {copy.turnaroundLabel}:{' '}
                                <strong className="font-semibold text-[#1E2B58]">
                                  {getBilingual(service.turnaround, lang)}
                                </strong>
                              </span>
                            </div>
                          </div>

                          {/* Custom Pastel Charm Preview */}
                          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl border border-[#4A69CE]/20 bg-[#E5F8F0]/60">
                            <div className="sticker-shadow">
                              <DieCutSticker
                                variant={getStickerForService(service.id)}
                                label={service.code}
                                className="w-28 h-28 sm:w-32 sm:h-32"
                              />
                            </div>
                            <span className="mt-2 font-hand text-lg text-[#4A69CE]">
                              {getBilingual(service.previewCaption, lang)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
