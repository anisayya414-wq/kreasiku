import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { Language } from '../types/studio';
import type { StudioCopy } from '../data/translations';
import { HeartIcon, Starburst } from './SvgMotifs';

interface NavbarAndMarqueeProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  copy: StudioCopy;
  brandName?: string;
}

export const NavbarAndMarquee: React.FC<NavbarAndMarqueeProps> = ({
  lang,
  onToggleLang,
  copy,
  brandName,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const navLinks = [
    { href: '#about', label: copy.nav.about },
    { href: '#services', label: copy.nav.services },
    { href: '#portfolio', label: copy.nav.portfolio },
    { href: '#team', label: copy.nav.team },
    { href: '#order', label: copy.nav.order },
  ];

  const repeatedMarquee = [...copy.marqueeTop, ...copy.marqueeTop];

  return (
    <div className="sticky top-0 z-40 w-full">
      {/* Top Announcement Ribbon in Honeydew – Sky Blue – Mauve */}
      <div
        className="marquee-wrapper w-full border-b border-[#4A69CE]/20 h-7 sm:h-8 flex items-center overflow-hidden"
        style={{
          background:
            'linear-gradient(90deg, #E5F8F0 0%, #D7F0FF 48%, #E9DFFD 100%)',
        }}
      >
        <div className="animate-marquee items-center">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center shrink-0">
              {repeatedMarquee.map((text, idx) => (
                <span
                  key={`${dup}-${idx}`}
                  className="inline-flex items-center gap-4 px-4 text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] text-[#1E2B58] uppercase whitespace-nowrap"
                >
                  <span>{text}</span>
                  <HeartIcon className="w-3 h-3 shrink-0" color="#4A69CE" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Frosted Glass Header */}
      <header className="w-full bg-[#F6FCF9]/88 backdrop-blur-md border-b border-[#4A69CE]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Left: Uppercase micro-links on desktop, mobile menu button on smaller viewports */}
          <div className="flex items-center gap-5 flex-1">
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileOpen ? copy.nav.closeMenu : copy.nav.menuLabel}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 -ml-2 rounded-xl text-[#1E2B58] hover:bg-[#81CFFF]/25 focus-visible:outline-2 focus-visible:outline-[#4A69CE]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <nav
              aria-label="Primary navigation"
              className="hidden lg:flex items-center gap-6"
            >
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-[11px] font-semibold tracking-[0.15em] text-[#1E2B58] uppercase whitespace-nowrap shrink-0 hover:text-[#4A69CE] transition-colors focus-visible:outline-2 focus-visible:outline-[#4A69CE] rounded"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Center: Kreasiku Serif Wordmark with 4-point pastel sparkles */}
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 font-editorial text-2xl sm:text-[26px] font-bold tracking-tight text-[#1E2B58] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#4A69CE] rounded"
          >
            <Starburst className="w-3.5 h-3.5 -mt-2" color="#BCA4F5" points={4} />
            <span>{brandName || 'Kreasiku'}</span>
            <Starburst className="w-3 h-3 mt-1" color="#4A69CE" points={4} />
          </a>

          {/* Right: Pastel Frosted ID / EN Bilingual Switch */}
          <div className="flex items-center justify-end gap-3 flex-1">
            <div
              role="group"
              aria-label="Language switcher"
              className="inline-flex items-center border border-[#4A69CE]/25 rounded-xl bg-white/85 p-0.5 shadow-pastel-sm"
            >
              <button
                type="button"
                onClick={() => onToggleLang('id')}
                aria-pressed={lang === 'id'}
                className={`px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-[28px] ${
                  lang === 'id'
                    ? 'bg-[#4A69CE] text-white'
                    : 'text-[#1E2B58] hover:bg-[#E5F8F0]'
                }`}
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => onToggleLang('en')}
                aria-pressed={lang === 'en'}
                className={`px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-[28px] ${
                  lang === 'en'
                    ? 'bg-[#4A69CE] text-white'
                    : 'text-[#1E2B58] hover:bg-[#81CFFF]/25'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <nav
            id="mobile-nav-drawer"
            aria-label="Mobile navigation"
            className="lg:hidden border-t border-[#4A69CE]/20 bg-[#F6FCF9]/95 backdrop-blur-md px-4 py-3 flex flex-col gap-1"
          >
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold tracking-[0.15em] uppercase text-[#1E2B58] hover:bg-[#E5F8F0] transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold tracking-[0.15em] uppercase text-[#1E2B58] hover:bg-[#D7F0FF] transition-colors"
            >
              {copy.nav.contact}
            </a>
          </nav>
        )}
      </header>
    </div>
  );
};
