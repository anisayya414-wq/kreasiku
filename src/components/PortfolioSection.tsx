import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { X, ArrowRight, Play } from 'lucide-react';
import type {
  Language,
  PortfolioCategory,
  PortfolioItem,
  ServiceId,
} from '../types/studio';
import {
  PORTFOLIO_ITEMS,
  getBilingual,
  type StudioCopy,
} from '../data/translations';
import { filterPortfolioItems } from '../utils/studioLogic';
import {
  parsePortfolioVideoUrl,
  resolvePortfolioCardThumbnail,
} from '../utils/portfolioVideo';
import {
  FlowingPastelRibbons,
  PortfolioArtwork,
  Starburst,
} from './SvgMotifs';

interface PortfolioSectionProps {
  lang: Language;
  copy: StudioCopy['portfolio'];
  items?: PortfolioItem[];
  onOrderSimilar: (serviceId: ServiceId) => void;
}

const FILM_FRAME_ACCENTS = [
  'from-[#E5F8F0] to-[#D7F0FF]',
  'from-[#FADCE8] to-[#E9DFFD]',
  'from-[#ECFFBE] to-[#E5F8F0]',
  'from-[#D7F0FF] to-[#E9DFFD]',
];

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  lang,
  copy,
  items,
  onOrderSimilar,
}) => {
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [brokenThumbs, setBrokenThumbs] = useState<Record<string, boolean>>({});
  const prefersReduced = useReducedMotion();

  const visibleItems = filterPortfolioItems(
    items && items.length > 0 ? items : PORTFOLIO_ITEMS,
    activeFilter
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedItem) {
        setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedItem]);

  const mapCategoryToService = (
    cat: PortfolioItem['category']
  ): ServiceId => {
    if (cat === 'other-projects') {
      return 'custom-creative-projects';
    }
    return cat;
  };

  const selectedIsVideo = selectedItem?.media_type === 'video';
  const parsedSelectedVideo =
    selectedItem && selectedIsVideo
      ? parsePortfolioVideoUrl(selectedItem.video_url ?? '')
      : null;
  const selectedModalThumb = selectedItem
    ? selectedIsVideo
      ? resolvePortfolioCardThumbnail(selectedItem)
      : selectedItem.imageUrl?.trim() ?? ''
    : '';
  const showSelectedModalThumb =
    Boolean(selectedItem) &&
    Boolean(selectedModalThumb) &&
    !brokenThumbs[`modal:${selectedItem?.id}:${selectedModalThumb}`];

  return (
    <section
      id="portfolio"
      className="relative bg-dreamy-pastel py-16 sm:py-22 border-b border-[#4A69CE]/15 overflow-hidden scroll-mt-24"
    >
      <FlowingPastelRibbons className="absolute inset-x-0 bottom-0 w-full h-64 opacity-50 rotate-180" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4A69CE] mb-1.5">
            {copy.eyebrow}
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#1E2B58] [text-wrap:balance]">
            {copy.title}
          </h2>
          <p className="mt-2.5 text-sm sm:text-[15px] text-[#1E2B58]/85 leading-relaxed">
            {copy.subtitle}
          </p>
          {copy.placeholderNotice.trim() && (
            <p className="mt-2 text-xs text-[#4A69CE]/80 italic">
              {copy.placeholderNotice}
            </p>
          )}
        </div>

        {/* Interactive Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter portfolio archive"
          className="flex flex-wrap items-center gap-2 mb-9"
        >
          {copy.filters.map((filter) => {
            const isSelected = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 text-xs font-semibold border rounded-full transition-colors cursor-pointer whitespace-nowrap min-h-[40px] focus-visible:outline-2 focus-visible:outline-[#4A69CE] ${
                  isSelected
                    ? 'bg-[#4A69CE] text-white border-[#4A69CE] shadow-pastel-sm'
                    : 'bg-white/90 text-[#1E2B58] border-[#4A69CE]/25 hover:bg-[#E5F8F0]'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Cinema Perforated Filmstrip Showcase Shell (inspired by reference Bottom-Right panel) */}
        <div className="filmstrip-shell rounded-3xl p-2 sm:p-3 border border-[#4A69CE]/40">
          <div className="filmstrip-sprocket-row w-full opacity-95" aria-hidden="true" />

          <div className="my-2 px-1 sm:px-3 py-3 sm:py-4 rounded-2xl bg-[#F6FCF9]/92 backdrop-blur-xs border border-white/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-start">
              {visibleItems.map((item, idx) => {
                const isVideo = item.media_type === 'video';
                const cardThumb = isVideo
                  ? resolvePortfolioCardThumbnail(item)
                  : item.imageUrl?.trim() ?? '';
                const cardThumbKey = `card:${item.id}:${cardThumb}`;
                const showThumbImg =
                  Boolean(cardThumb) && !brokenThumbs[cardThumbKey];
                const frameGradient =
                  FILM_FRAME_ACCENTS[idx % FILM_FRAME_ACCENTS.length];

                return (
                  <motion.article
                    key={item.id}
                    layout={!prefersReduced}
                    initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className="relative"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      aria-label={
                        isVideo
                          ? `${copy.playVideoAria}: ${getBilingual(item.title, lang)}`
                          : undefined
                      }
                      className={`group relative w-full text-left bg-gradient-to-br ${frameGradient} rounded-2xl border border-[#4A69CE]/25 p-3 shadow-pastel transition-all duration-200 hover:-translate-y-1.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4A69CE]`}
                    >
                      {/* Mini perforated film border accents on video cards */}
                      {isVideo && (
                        <div
                          aria-hidden="true"
                          className="mb-2 rounded-lg bg-[#4A69CE] px-2 py-0.5 flex items-center justify-between gap-1"
                        >
                          <div className="flex items-center gap-1.5">
                            {Array.from({ length: 6 }).map((_, sIdx) => (
                              <span
                                key={sIdx}
                                className="w-2.5 h-1.5 rounded-[2px] bg-[#F6FCF9]/95"
                              />
                            ))}
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#ECFFBE] tabular-nums">
                            REEL · 0{idx + 1}
                          </span>
                        </div>
                      )}

                      {/* Artwork / Video Thumbnail Container */}
                      <div
                        className={`relative w-full overflow-hidden rounded-xl border border-[#4A69CE]/20 bg-white ${
                          item.variant === 'postcard' && !isVideo
                            ? 'aspect-[4/5]'
                            : 'aspect-square'
                        }`}
                      >
                        {showThumbImg ? (
                          <img
                            src={cardThumb}
                            alt={getBilingual(item.title, lang)}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setBrokenThumbs((prev) => ({
                                ...prev,
                                [cardThumbKey]: true,
                              }))
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <PortfolioArtwork variant={item.artVariant} />
                        )}

                        {isVideo && (
                          <>
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 bg-[#1E2B58]/15 group-hover:bg-[#1E2B58]/25 transition-colors"
                            />
                            <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#4A69CE] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                              <Play className="w-2.5 h-2.5 fill-current" />
                              <span>{copy.videoBadge}</span>
                            </span>
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <span className="w-14 h-14 rounded-full bg-white/95 group-hover:bg-[#E5F8F0] border-2 border-[#4A69CE] shadow-pastel flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                                <Play className="w-6 h-6 text-[#4A69CE] fill-[#4A69CE] ml-0.5" />
                              </span>
                            </span>
                          </>
                        )}
                      </div>

                      {/* Clean unboxed editorial metadata */}
                      <div className="mt-3.5 px-1">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-[#4A69CE] uppercase tracking-wider">
                          <span>{getBilingual(item.categoryLabel, lang)}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{item.yearPlaceholder}</span>
                        </div>
                        <h3 className="mt-1 font-editorial text-lg font-semibold text-[#1E2B58] group-hover:text-[#4A69CE] transition-colors">
                          {getBilingual(item.title, lang)}
                        </h3>
                        <p className="mt-1.5 text-xs text-[#1E2B58]/80 line-clamp-2 leading-relaxed">
                          {getBilingual(item.summary, lang)}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A69CE]">
                          <span>
                            {isVideo ? copy.playVideoAria : copy.openPreview}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </button>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <div className="filmstrip-sprocket-row w-full opacity-95" aria-hidden="true" />
        </div>
      </div>

      {/* Archive Preview & Video Player Modal */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2B58]/65"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className={`relative w-full max-h-[90vh] overflow-y-auto bg-[#F6FCF9] border border-[#4A69CE]/30 rounded-3xl shadow-pastel p-5 sm:p-8 ${
              selectedIsVideo ? 'max-w-4xl' : 'max-w-3xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#4A69CE]/20">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#4A69CE]">
                  <span>{copy.archiveTag}</span>
                  <span aria-hidden="true">·</span>
                  <span>{getBilingual(selectedItem.categoryLabel, lang)}</span>
                </div>
                <h3
                  id="portfolio-modal-title"
                  className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1E2B58] mt-1"
                >
                  {getBilingual(selectedItem.title, lang)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label={copy.closeModal}
                className="shrink-0 w-10 h-10 rounded-xl inline-flex items-center justify-center border border-[#4A69CE]/25 bg-[#E9DFFD] hover:bg-[#BCA4F5]/65 text-[#1E2B58] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4A69CE]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content: Artwork / Video Player + Notes */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div
                className={`rounded-2xl border border-[#4A69CE]/25 p-2 bg-[#E5F8F0] ${
                  selectedIsVideo ? 'md:col-span-7' : 'md:col-span-6'
                }`}
              >
                {selectedIsVideo ? (
                  parsedSelectedVideo ? (
                    <div className="aspect-video w-full overflow-hidden rounded-xl border border-[#4A69CE]/30 bg-[#1E2B58]">
                      <iframe
                        key={`${selectedItem.id}-${parsedSelectedVideo.embedUrl}`}
                        src={parsedSelectedVideo.embedUrl}
                        title={getBilingual(selectedItem.title, lang)}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="aspect-video w-full overflow-hidden rounded-xl border border-[#4A69CE]/25">
                        {showSelectedModalThumb ? (
                          <img
                            src={selectedModalThumb}
                            alt={getBilingual(selectedItem.title, lang)}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setBrokenThumbs((prev) => ({
                                ...prev,
                                [`modal:${selectedItem.id}:${selectedModalThumb}`]:
                                  true,
                              }))
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <PortfolioArtwork variant={selectedItem.artVariant} />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#8A1C2B] bg-[#FADCE8] rounded-xl border border-[#8A1C2B]/40 px-3 py-2">
                        {copy.videoUnavailable}
                      </p>
                    </div>
                  )
                ) : (
                  <div className="aspect-[4/4.5] w-full overflow-hidden rounded-xl border border-[#4A69CE]/25">
                    {showSelectedModalThumb ? (
                      <img
                        src={selectedModalThumb}
                        alt={getBilingual(selectedItem.title, lang)}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setBrokenThumbs((prev) => ({
                            ...prev,
                            [`modal:${selectedItem.id}:${selectedModalThumb}`]:
                              true,
                          }))
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PortfolioArtwork variant={selectedItem.artVariant} />
                    )}
                  </div>
                )}
              </div>

              <div
                className={`space-y-5 ${
                  selectedIsVideo ? 'md:col-span-5' : 'md:col-span-6'
                }`}
              >
                <div className="p-4 rounded-2xl bg-white border border-[#4A69CE]/20 shadow-pastel-sm">
                  <p className="text-sm leading-relaxed text-[#1E2B58]">
                    {getBilingual(selectedItem.summary, lang)}
                  </p>
                  <p className="mt-3 text-xs text-[#1E2B58]/75">
                    {copy.dimensionsLabel}:{' '}
                    <strong className="font-semibold text-[#4A69CE]">
                      {selectedItem.dimensions}
                    </strong>
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#4A69CE] mb-2">
                    {copy.deliverablesTitle}
                  </p>
                  <ul className="space-y-2">
                    {selectedItem.deliverables[lang].map((del) => (
                      <li
                        key={del}
                        className="flex items-center gap-2 text-sm text-[#1E2B58]"
                      >
                        <Starburst
                          className="w-3.5 h-3.5 shrink-0"
                          color="#BCA4F5"
                          points={4}
                        />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const targetService = mapCategoryToService(
                        selectedItem.category
                      );
                      setSelectedItem(null);
                      onOrderSimilar(targetService);
                    }}
                    className="w-full py-3 px-5 bg-[#4A69CE] hover:bg-[#334FA8] text-white rounded-xl text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer shadow-pastel-sm transition-colors"
                  >
                    {copy.orderSimilarBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
