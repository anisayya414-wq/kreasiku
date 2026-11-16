import React from 'react';
import type { PortfolioItem, ServiceId, TeamMember } from '../types/studio';
import { resolvePastelSurface } from '../utils/pastelTheme';

export const Starburst: React.FC<{
  className?: string;
  color?: string;
  points?: 4 | 6 | 8;
}> = ({ className = 'w-6 h-6', color = '#4A69CE', points = 6 }) => {
  if (points === 4) {
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M16 2L18.9 13.1L30 16L18.9 18.9L16 30L13.1 18.9L2 16L13.1 13.1L16 2Z"
          fill={color}
        />
      </svg>
    );
  }
  if (points === 8) {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M20 2L22.5 13.5L32.7 7.3L26.5 17.5L38 20L26.5 22.5L32.7 32.7L22.5 26.5L20 38L17.5 26.5L7.3 32.7L13.5 22.5L2 20L13.5 17.5L7.3 7.3L17.5 13.5L20 2Z"
          fill={color}
        />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 2L23.2 14.4L35.6 11L26.4 20L35.6 29L23.2 25.6L20 38L16.8 25.6L4.4 29L13.6 20L4.4 11L16.8 14.4L20 2Z"
        fill={color}
      />
    </svg>
  );
};

export const HeartIcon: React.FC<{
  className?: string;
  color?: string;
  outline?: boolean;
}> = ({ className = 'w-3.5 h-3.5', color = '#4A69CE', outline = false }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 20.5C12 20.5 3.5 15.1 3.5 8.9C3.5 5.9 5.8 3.8 8.5 3.8C10.2 3.8 11.4 4.7 12 5.9C12.6 4.7 13.8 3.8 15.5 3.8C18.2 3.8 20.5 5.9 20.5 8.9C20.5 15.1 12 20.5 12 20.5Z"
      fill={outline ? 'none' : color}
      stroke={color}
      strokeWidth={outline ? '1.8' : '1'}
      strokeLinejoin="round"
    />
  </svg>
);

export const CurvedArrow: React.FC<{
  className?: string;
  variant?: 'up-right' | 'down-left' | 'loop-up' | 'loop-right';
}> = ({ className = 'w-12 h-10', variant = 'up-right' }) => {
  const strokeColor = '#4A69CE';
  if (variant === 'loop-up') {
    return (
      <svg
        viewBox="0 0 60 52"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M10 46C18 42 29 36 27 25C25 16 14 21 17 29C20 36 37 28 45 10"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M38 13L45.5 9L48 17"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (variant === 'loop-right') {
    return (
      <svg
        viewBox="0 0 64 46"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M6 32C15 38 30 37 30 25C30 16 20 18 22 25C24 32 43 31 56 18"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M49 16.5L57 17.5L54.5 25"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (variant === 'down-left') {
    return (
      <svg
        viewBox="0 0 60 46"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M50 8C34 10 22 18 14 36"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M10 29L13.5 37.5L21 33.5"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 60 46"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 38C18 30 28 24 46 14"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M38 11L47.5 13.5L43 22"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* Flowing translucent pastel silk ribbons inspired by reference top-left panel */
export const FlowingPastelRibbons: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 1440 420"
    fill="none"
    preserveAspectRatio="none"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ribbon-pink-mauve" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FADCE8" stopOpacity="0.82" />
        <stop offset="50%" stopColor="#BCA4F5" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#81CFFF" stopOpacity="0.35" />
      </linearGradient>
      <linearGradient id="ribbon-mint-sky" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ECFFBE" stopOpacity="0.72" />
        <stop offset="48%" stopColor="#E5F8F0" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#81CFFF" stopOpacity="0.48" />
      </linearGradient>
    </defs>
    <path
      d="M-40 310C220 220 420 90 710 170C980 245 1210 110 1490 40C1320 150 1050 285 730 230C450 180 210 300 -40 365Z"
      fill="url(#ribbon-pink-mauve)"
    />
    <path
      d="M-40 375C280 285 520 355 830 245C1080 155 1280 210 1490 140C1290 250 1040 215 800 305C510 410 240 335 -40 410Z"
      fill="url(#ribbon-mint-sky)"
    />
    <path
      d="M900 -10C1060 95 1240 120 1480 70C1300 165 1090 135 860 35Z"
      fill="#81CFFF"
      fillOpacity="0.22"
    />
  </svg>
);

/* Hanging jeweled pastel tassel ornament inspired by reference panels 2 & 5 */
export const HangingTasselCharm: React.FC<{
  className?: string;
  tone?: 'jade' | 'mauve' | 'sakura';
}> = ({ className = 'w-14 h-36', tone = 'jade' }) => {
  const palette =
    tone === 'mauve'
      ? { gem: '#BCA4F5', knot: '#4A69CE', tailTop: '#81CFFF', tailBot: '#E5F8F0' }
      : tone === 'sakura'
        ? { gem: '#FADCE8', knot: '#BCA4F5', tailTop: '#FADCE8', tailBot: '#ECFFBE' }
        : { gem: '#81CFFF', knot: '#4A69CE', tailTop: '#81CFFF', tailBot: '#ECFFBE' };

  return (
    <svg
      viewBox="0 0 64 160"
      fill="none"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`tassel-${tone}`} x1="32" y1="74" x2="32" y2="152" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={palette.tailTop} stopOpacity="0.92" />
          <stop offset="100%" stopColor={palette.tailBot} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* Top silk cord */}
      <path d="M32 0V20" stroke="#4A69CE" strokeWidth="1.6" strokeOpacity="0.55" />
      {/* Oval gem bead */}
      <ellipse cx="32" cy="34" rx="11" ry="15" fill={palette.gem} fillOpacity="0.85" stroke="#4A69CE" strokeWidth="1.4" strokeOpacity="0.65" />
      <ellipse cx="29" cy="30" rx="3.5" ry="6" fill="#FFFFFF" fillOpacity="0.7" />
      {/* Decorative bow knot */}
      <path
        d="M17 58C13 52 22 49 27 56L32 61L37 56C42 49 51 52 47 58C43 63 36 65 32 65C28 65 21 63 17 58Z"
        fill="#E5F8F0"
        stroke={palette.knot}
        strokeWidth="1.5"
        strokeOpacity="0.7"
      />
      <circle cx="32" cy="60" r="4" fill={palette.knot} fillOpacity="0.85" />
      {/* Flowing tassel fan */}
      <path
        d="M27 65L16 146C22 152 38 153 48 144L37 65Z"
        fill={`url(#tassel-${tone})`}
      />
      <path d="M30 70L24 146" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />
      <path d="M34 70L38 144" stroke="#4A69CE" strokeWidth="1" strokeOpacity="0.28" strokeLinecap="round" />
    </svg>
  );
};

/* Layered Tea Green hills + swirling Sakura pastel clouds divider (matches reference panels 2 & 5) */
export const ScallopedAwningDivider: React.FC = () => {
  return (
    <div
      className="relative w-full overflow-hidden select-none bg-[#F6FCF9] -mt-2"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 128"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-20 sm:h-28 block"
      >
        <defs>
          <linearGradient id="div-hill-back" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#81CFFF" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#E5F8F0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#BCA4F5" stopOpacity="0.42" />
          </linearGradient>
          <linearGradient id="div-hill-mid" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ECFFBE" />
            <stop offset="50%" stopColor="#B8F0D4" />
            <stop offset="100%" stopColor="#81CFFF" />
          </linearGradient>
          <linearGradient id="div-cloud-sakura" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FADCE8" />
          </linearGradient>
        </defs>

        {/* Soft rolling back mountain mist */}
        <path
          d="M0 78C140 24 270 28 410 68C550 108 690 22 860 54C1030 86 1190 18 1440 62V128H0V78Z"
          fill="url(#div-hill-back)"
        />
        {/* Sculpted Tea-Green & Mint ridged hills */}
        <path
          d="M0 96C110 46 210 50 320 82C440 116 560 40 700 72C840 104 970 36 1120 74C1250 106 1350 56 1440 78V128H0V96Z"
          fill="url(#div-hill-mid)"
          fillOpacity="0.82"
        />
        {/* Delicate highlight crest along hills */}
        <path
          d="M0 96C110 46 210 50 320 82C440 116 560 40 700 72C840 104 970 36 1120 74C1250 106 1350 56 1440 78"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeOpacity="0.75"
        />

        {/* Swirling Sakura & Cloud Puffs along bottom edge */}
        <path
          d="M-20 128C-20 102 18 86 48 96C66 78 106 76 128 96C156 80 198 84 218 106C252 94 288 106 300 128H-20Z"
          fill="url(#div-cloud-sakura)"
          stroke="#BCA4F5"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <path
          d="M420 128C434 102 472 90 502 102C528 76 582 78 606 102C640 88 684 98 698 128H420Z"
          fill="url(#div-cloud-sakura)"
          stroke="#BCA4F5"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <path
          d="M840 128C858 98 906 88 940 104C972 78 1026 82 1052 106C1090 92 1130 104 1144 128H840Z"
          fill="url(#div-cloud-sakura)"
          stroke="#BCA4F5"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <path
          d="M1190 128C1210 98 1254 90 1286 104C1316 78 1378 82 1408 104C1428 94 1448 104 1456 128H1190Z"
          fill="url(#div-cloud-sakura)"
          stroke="#BCA4F5"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        {/* Decorative swirl curl accents inside clouds */}
        <path d="M98 112C106 104 120 106 118 116C116 122 106 122 105 116" stroke="#4A69CE" strokeOpacity="0.28" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M548 112C556 104 570 106 568 116C566 122 556 122 555 116" stroke="#4A69CE" strokeOpacity="0.28" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M986 112C994 104 1008 106 1006 116C1004 122 994 122 993 116" stroke="#4A69CE" strokeOpacity="0.28" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

/* Hero Collage Scene Artworks (luminous pastel illustrations matching Honeydew-Mauve-Royal Blue) */
export const HeroPostcardArt: React.FC<{ sceneIndex: number }> = ({
  sceneIndex,
}) => {
  if (sceneIndex === 1) {
    // Motion & Video Reels Scene
    return (
      <svg viewBox="0 0 220 290" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="hero-vid-bg" x1="0" y1="0" x2="220" y2="290" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E5F8F0" />
            <stop offset="55%" stopColor="#D7F0FF" />
            <stop offset="100%" stopColor="#E9DFFD" />
          </linearGradient>
        </defs>
        <rect width="220" height="290" fill="url(#hero-vid-bg)" />
        {/* Filmstrip outer frame */}
        <rect
          x="16"
          y="22"
          width="188"
          height="246"
          rx="14"
          fill="#81CFFF"
          fillOpacity="0.45"
          stroke="#4A69CE"
          strokeWidth="1.8"
        />
        {/* Clapperboard */}
        <g transform="translate(36, 76)">
          <rect
            x="0"
            y="24"
            width="148"
            height="104"
            rx="10"
            fill="#FFFFFF"
            stroke="#4A69CE"
            strokeWidth="1.8"
          />
          <rect
            x="0"
            y="0"
            width="148"
            height="26"
            rx="6"
            fill="#4A69CE"
          />
          <path d="M18 0L32 26H14L0 0H18Z" fill="#ECFFBE" />
          <path d="M58 0L72 26H54L40 0H58Z" fill="#FADCE8" />
          <path d="M98 0L112 26H94L80 0H98Z" fill="#81CFFF" />
          <path d="M138 0L148 18V26H134L120 0H138Z" fill="#BCA4F5" />
          {/* Play triangle */}
          <circle
            cx="74"
            cy="76"
            r="26"
            fill="#E5F8F0"
            stroke="#4A69CE"
            strokeWidth="1.8"
          />
          <path
            d="M68 65L86 76L68 87V65Z"
            fill="#4A69CE"
            stroke="#4A69CE"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
        {/* Timeline bar */}
        <rect
          x="36"
          y="218"
          width="148"
          height="18"
          rx="9"
          fill="#FFFFFF"
          stroke="#4A69CE"
          strokeWidth="1.6"
        />
        <rect x="42" y="222" width="66" height="10" rx="5" fill="#ECFFBE" />
        <circle cx="112" cy="227" r="6" fill="#BCA4F5" />
        {/* 4-point sparkles */}
        <path
          d="M44 46L47 54L55 57L47 60L44 68L41 60L33 57L41 54L44 46Z"
          fill="#ECFFBE"
          stroke="#4A69CE"
          strokeWidth="1.2"
        />
        <path
          d="M174 44L176 50L182 52L176 54L174 60L172 54L166 52L172 50L174 44Z"
          fill="#BCA4F5"
        />
      </svg>
    );
  }

  if (sceneIndex === 2) {
    // Stickers & Brand Illustration Scene
    return (
      <svg viewBox="0 0 220 290" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="hero-ill-bg" x1="0" y1="0" x2="220" y2="290" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ECFFBE" />
            <stop offset="55%" stopColor="#E5F8F0" />
            <stop offset="100%" stopColor="#81CFFF" />
          </linearGradient>
        </defs>
        <rect width="220" height="290" fill="url(#hero-ill-bg)" />
        {/* Pastel arch */}
        <path
          d="M28 265V115C28 69 65 32 110 32C155 32 192 69 192 115V265H28Z"
          fill="#FFFFFF"
          fillOpacity="0.92"
          stroke="#4A69CE"
          strokeWidth="1.8"
        />
        <rect
          x="54"
          y="86"
          width="112"
          height="120"
          rx="14"
          fill="#E9DFFD"
          stroke="#4A69CE"
          strokeWidth="1.8"
        />
        <rect
          x="66"
          y="98"
          width="88"
          height="64"
          rx="8"
          fill="#FFFFFF"
          stroke="#4A69CE"
          strokeWidth="1.6"
        />
        {/* Smiling botanical blossom */}
        <circle cx="94" cy="122" r="9" fill="#81CFFF" stroke="#4A69CE" strokeWidth="1.4" />
        <circle cx="126" cy="122" r="9" fill="#81CFFF" stroke="#4A69CE" strokeWidth="1.4" />
        <circle cx="100" cy="144" r="9" fill="#E5F8F0" stroke="#4A69CE" strokeWidth="1.4" />
        <circle cx="120" cy="144" r="9" fill="#E5F8F0" stroke="#4A69CE" strokeWidth="1.4" />
        <circle cx="110" cy="130" r="11" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.5" />
        <circle cx="106.5" cy="128" r="1.5" fill="#1E2B58" />
        <circle cx="113.5" cy="128" r="1.5" fill="#1E2B58" />
        <path d="M107 133C109 135 111 135 113 133" stroke="#1E2B58" strokeWidth="1.5" strokeLinecap="round" />
        {/* Palette Swatches */}
        <circle cx="82" cy="184" r="9" fill="#E5F8F0" stroke="#4A69CE" strokeWidth="1.4" />
        <circle cx="110" cy="184" r="9" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.4" />
        <circle cx="138" cy="184" r="9" fill="#81CFFF" stroke="#4A69CE" strokeWidth="1.4" />
        <rect x="64" y="226" width="92" height="16" rx="8" fill="#4A69CE" fillOpacity="0.85" />
      </svg>
    );
  }

  // Scene 0: Luminous Lotus & Serenity Sky Showcase
  return (
    <svg viewBox="0 0 220 290" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="hero-main-bg" x1="0" y1="0" x2="220" y2="290" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E5F8F0" />
          <stop offset="52%" stopColor="#D7F0FF" />
          <stop offset="100%" stopColor="#FADCE8" />
        </linearGradient>
      </defs>
      <rect width="220" height="290" fill="url(#hero-main-bg)" />
      <rect x="12" y="12" width="196" height="266" rx="14" fill="#FFFFFF" fillOpacity="0.72" stroke="#4A69CE" strokeOpacity="0.35" strokeWidth="1.5" />
      {/* Floating sparkles */}
      <path d="M40 52L43 60L51 62L43 64L40 72L37 64L29 62L37 60L40 52Z" fill="#BCA4F5" />
      <path d="M168 48L171 57L180 59L171 61L168 70L165 61L156 59L165 57L168 48Z" fill="#4A69CE" />
      {/* Silk Ribbon Curve */}
      <path d="M18 104C70 124 150 124 202 104" stroke="#4A69CE" strokeOpacity="0.55" strokeWidth="1.6" />
      {/* Mini pastel cards on ribbon */}
      <g transform="translate(46, 114) rotate(-6)">
        <rect width="38" height="48" rx="6" fill="#FADCE8" stroke="#4A69CE" strokeWidth="1.4" />
        <circle cx="19" cy="20" r="9" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.2" />
      </g>
      <g transform="translate(96, 118) rotate(4)">
        <rect width="42" height="52" rx="6" fill="#81CFFF" stroke="#4A69CE" strokeWidth="1.4" />
        <path d="M10 38L19 22L27 32L32 25L36 38H10Z" fill="#E5F8F0" stroke="#4A69CE" strokeWidth="1.2" />
      </g>
      <g transform="translate(148, 108) rotate(8)">
        <rect width="34" height="44" rx="6" fill="#E9DFFD" stroke="#4A69CE" strokeWidth="1.4" />
        <circle cx="17" cy="22" r="7" fill="#FFFFFF" stroke="#4A69CE" strokeWidth="1.2" />
      </g>
      {/* Tea Green wave hills + lotus clouds along bottom */}
      <path d="M12 220C44 198 78 214 110 202C146 188 182 210 208 196V278H12V220Z" fill="#ECFFBE" stroke="#4A69CE" strokeOpacity="0.45" strokeWidth="1.5" />
      {[
        { cx: 52, cy: 222, r: 22, fill: '#81CFFF' },
        { cx: 92, cy: 236, r: 24, fill: '#E5F8F0' },
        { cx: 146, cy: 218, r: 26, fill: '#BCA4F5' },
        { cx: 180, cy: 242, r: 20, fill: '#FADCE8' },
      ].map((b, i) => (
        <g key={i}>
          <circle cx={b.cx} cy={b.cy} r={b.r} fill={b.fill} fillOpacity="0.88" stroke="#4A69CE" strokeOpacity="0.45" strokeWidth="1.4" />
          <circle cx={b.cx - 5} cy={b.cy - 4} r="5" fill="#FFFFFF" opacity="0.7" />
        </g>
      ))}
    </svg>
  );
};

/* Pastel Charm Stickers for Hero & About Playground */
export const DieCutSticker: React.FC<{
  variant:
    | 'hydrangea'
    | 'strawberry'
    | 'vintage-frame'
    | 'lucky-card'
    | 'bouquet'
    | 'heart-seal'
    | 'flip-phone'
    | 'sparkle-wand';
  label?: string;
  className?: string;
}> = ({ variant, label, className = 'w-28 h-28' }) => {
  switch (variant) {
    case 'hydrangea':
      return (
        <svg viewBox="0 0 130 130" fill="none" className={className}>
          <circle cx="65" cy="65" r="54" fill="#FFFFFF" stroke="#4A69CE" strokeOpacity="0.45" strokeWidth="1.8" />
          <circle cx="65" cy="65" r="46" fill="#E5F8F0" />
          <ellipse cx="42" cy="84" rx="20" ry="12" transform="rotate(-25 42 84)" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.6" />
          <ellipse cx="88" cy="82" rx="20" ry="12" transform="rotate(25 88 82)" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.6" />
          <circle cx="52" cy="54" r="20" fill="#81CFFF" stroke="#4A69CE" strokeWidth="1.6" />
          <circle cx="78" cy="56" r="18" fill="#BCA4F5" stroke="#4A69CE" strokeWidth="1.6" />
          <circle cx="65" cy="72" r="20" fill="#D7F0FF" stroke="#4A69CE" strokeWidth="1.6" />
          <circle cx="52" cy="52" r="5" fill="#FFFFFF" stroke="#4A69CE" strokeWidth="1.2" />
          <circle cx="78" cy="54" r="5" fill="#FFFFFF" stroke="#4A69CE" strokeWidth="1.2" />
          <circle cx="65" cy="71" r="5" fill="#FFFFFF" stroke="#4A69CE" strokeWidth="1.2" />
        </svg>
      );

    case 'strawberry':
      return (
        <svg viewBox="0 0 130 140" fill="none" className={className}>
          <path
            d="M65 14C86 14 114 34 110 68C106 104 82 128 65 128C48 128 24 104 20 68C16 34 44 14 65 14Z"
            fill="#FFFFFF"
            stroke="#4A69CE"
            strokeOpacity="0.5"
            strokeWidth="1.8"
          />
          <path
            d="M65 28C82 28 102 44 98 68C94 96 77 116 65 116C53 116 36 96 32 68C28 44 48 28 65 28Z"
            fill="#FADCE8"
            stroke="#4A69CE"
            strokeWidth="1.6"
          />
          <path d="M44 34L56 20L65 30L74 20L86 34L65 40L44 34Z" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.6" />
          <rect x="20" y="62" width="90" height="22" rx="8" fill="#81CFFF" stroke="#4A69CE" strokeWidth="1.6" />
          <text x="65" y="77" textAnchor="middle" fill="#1E2B58" fontSize="10" fontWeight="700" fontFamily="Fraunces, serif">
            {label || 'KREASIKU'}
          </text>
        </svg>
      );

    case 'vintage-frame':
      return (
        <svg viewBox="0 0 130 155" fill="none" className={className}>
          <rect x="10" y="10" width="110" height="135" rx="14" fill="#FFFFFF" stroke="#4A69CE" strokeOpacity="0.5" strokeWidth="1.8" />
          <rect x="18" y="18" width="94" height="119" rx="10" fill="#E9DFFD" stroke="#4A69CE" strokeWidth="1.5" />
          <rect x="28" y="28" width="74" height="99" rx="34" fill="#81CFFF" stroke="#4A69CE" strokeWidth="1.6" />
          <path d="M28 96C46 84 82 88 102 98V127H28V96Z" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.5" />
          <circle cx="65" cy="60" r="14" fill="#FADCE8" stroke="#4A69CE" strokeWidth="1.5" />
        </svg>
      );

    case 'lucky-card':
      return (
        <svg viewBox="0 0 130 130" fill="none" className={className}>
          <rect x="12" y="12" width="106" height="106" rx="18" fill="#FFFFFF" stroke="#4A69CE" strokeOpacity="0.5" strokeWidth="1.8" />
          <rect x="20" y="20" width="90" height="90" rx="14" fill="#E5F8F0" stroke="#4A69CE" strokeWidth="1.6" />
          <rect x="28" y="28" width="74" height="74" rx="10" fill="#BCA4F5" fillOpacity="0.55" stroke="#4A69CE" strokeWidth="1.4" />
          <path d="M65 36L71 54L89 54L75 65L80 83L65 72L50 83L55 65L41 54L59 54L65 36Z" fill="#FFFFFF" stroke="#4A69CE" strokeWidth="1.5" />
          <text x="65" y="70" textAnchor="middle" fill="#1E2B58" fontSize="13" fontWeight="700" fontFamily="Fraunces, serif">
            {label || 'Craft'}
          </text>
        </svg>
      );

    case 'bouquet':
      return (
        <svg viewBox="0 0 110 140" fill="none" className={className}>
          <rect x="16" y="10" width="78" height="120" rx="34" fill="#FFFFFF" stroke="#4A69CE" strokeOpacity="0.5" strokeWidth="1.8" />
          <path d="M55 58V118M45 64L55 114M65 64L55 114" stroke="#4A69CE" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M38 92C48 86 62 86 72 92L64 102L55 96L46 102L38 92Z" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.5" />
          <circle cx="44" cy="48" r="14" fill="#FADCE8" stroke="#4A69CE" strokeWidth="1.6" />
          <circle cx="66" cy="46" r="14" fill="#BCA4F5" stroke="#4A69CE" strokeWidth="1.6" />
          <circle cx="55" cy="36" r="15" fill="#81CFFF" stroke="#4A69CE" strokeWidth="1.6" />
          <circle cx="55" cy="36" r="5" fill="#ECFFBE" />
        </svg>
      );

    case 'heart-seal':
      return (
        <svg viewBox="0 0 140 125" fill="none" className={className}>
          <path
            d="M70 112C70 112 14 78 14 40C14 21 29 10 46 10C58 10 66 17 70 25C74 17 82 10 94 10C111 10 126 21 126 40C126 78 70 112 70 112Z"
            fill="#FFFFFF"
            stroke="#4A69CE"
            strokeOpacity="0.5"
            strokeWidth="1.8"
          />
          <path
            d="M70 102C70 102 24 72 24 41C24 27 35 18 48 18C58 18 65 24 70 32C75 24 82 18 92 18C105 18 116 27 116 41C116 72 70 102 70 102Z"
            fill="#E9DFFD"
            stroke="#4A69CE"
            strokeWidth="1.6"
          />
          <text x="70" y="56" textAnchor="middle" fill="#1E2B58" fontSize="16" fontWeight="700" fontFamily="Fraunces, serif" fontStyle="italic">
            Kreasiku
          </text>
          <text x="70" y="72" textAnchor="middle" fill="#4A69CE" fontSize="8.5" fontWeight="700" letterSpacing="1.5">
            STUDIO
          </text>
        </svg>
      );

    case 'flip-phone':
      return (
        <svg viewBox="0 0 110 150" fill="none" className={className}>
          <rect x="20" y="12" width="70" height="126" rx="18" fill="#FFFFFF" stroke="#4A69CE" strokeOpacity="0.5" strokeWidth="1.8" />
          <rect x="28" y="20" width="54" height="52" rx="10" fill="#81CFFF" stroke="#4A69CE" strokeWidth="1.6" />
          <rect x="35" y="27" width="40" height="36" rx="6" fill="#E5F8F0" stroke="#4A69CE" strokeWidth="1.4" />
          <circle cx="55" cy="45" r="8" fill="#BCA4F5" stroke="#4A69CE" strokeWidth="1.4" />
          <rect x="28" y="78" width="54" height="52" rx="10" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.6" />
          <circle cx="55" cy="95" r="9" fill="#FFFFFF" stroke="#4A69CE" strokeWidth="1.4" />
          <rect x="36" y="110" width="10" height="6" rx="2" fill="#FFFFFF" stroke="#4A69CE" strokeWidth="1.2" />
          <rect x="50" y="110" width="10" height="6" rx="2" fill="#FFFFFF" stroke="#4A69CE" strokeWidth="1.2" />
          <rect x="64" y="110" width="10" height="6" rx="2" fill="#FFFFFF" stroke="#4A69CE" strokeWidth="1.2" />
        </svg>
      );

    case 'sparkle-wand':
    default:
      return (
        <svg viewBox="0 0 120 130" fill="none" className={className}>
          <path d="M58 46L34 114" stroke="#4A69CE" strokeWidth="5" strokeLinecap="round" />
          <path d="M58 46L34 114" stroke="#E5F8F0" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M52 60C36 58 26 70 30 78C34 84 46 76 52 60Z" fill="#81CFFF" stroke="#4A69CE" strokeWidth="1.5" />
          <path d="M54 60C70 60 80 72 74 80C68 86 58 76 54 60Z" fill="#FADCE8" stroke="#4A69CE" strokeWidth="1.5" />
          <path
            d="M64 14L70 32L88 32L74 43L79 61L64 50L49 61L54 43L40 32L58 32L64 14Z"
            fill="#ECFFBE"
            stroke="#4A69CE"
            strokeWidth="1.8"
          />
          <circle cx="64" cy="39" r="5" fill="#BCA4F5" stroke="#4A69CE" strokeWidth="1.3" />
        </svg>
      );
  }
};

/* Service Folder Stamp Badge SVG */
export const ServiceStampIcon: React.FC<{ serviceId: ServiceId }> = ({
  serviceId,
}) => {
  switch (serviceId) {
    case 'video-editing':
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
          <rect x="6" y="10" width="36" height="28" rx="7" fill="#E5F8F0" stroke="#4A69CE" strokeWidth="1.8" />
          <path d="M6 18H42" stroke="#4A69CE" strokeWidth="1.8" />
          <path d="M14 10L18 18M26 10L30 18" stroke="#4A69CE" strokeWidth="1.8" />
          <path d="M21 23L31 28.5L21 34V23Z" fill="#4A69CE" />
        </svg>
      );
    case 'poster-design':
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
          <rect x="10" y="6" width="28" height="36" rx="5" fill="#FFFFFF" stroke="#4A69CE" strokeWidth="1.8" />
          <rect x="15" y="12" width="18" height="16" rx="4" fill="#FADCE8" stroke="#4A69CE" strokeWidth="1.5" />
          <circle cx="24" cy="20" r="4" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.4" />
          <path d="M15 34H33" stroke="#4A69CE" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'graphic-design':
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
          <circle cx="24" cy="24" r="17" fill="#E5F8F0" stroke="#4A69CE" strokeWidth="1.8" />
          <path d="M24 12L34 30H14L24 12Z" fill="#81CFFF" stroke="#4A69CE" strokeWidth="1.6" />
          <circle cx="24" cy="25" r="4" fill="#BCA4F5" stroke="#4A69CE" strokeWidth="1.4" />
        </svg>
      );
    case 'social-media-design':
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
          <rect x="8" y="8" width="22" height="28" rx="6" fill="#FFFFFF" stroke="#4A69CE" strokeWidth="1.8" />
          <rect x="18" y="14" width="22" height="26" rx="6" fill="#81CFFF" stroke="#4A69CE" strokeWidth="1.8" />
          <circle cx="29" cy="24" r="4.5" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.4" />
          <path d="M23 33H35" stroke="#4A69CE" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'custom-creative-projects':
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
          <rect x="8" y="12" width="32" height="26" rx="7" fill="#E5F8F0" stroke="#4A69CE" strokeWidth="1.8" />
          <path d="M8 20L24 29L40 20" stroke="#4A69CE" strokeWidth="1.8" />
          <circle cx="24" cy="28" r="5" fill="#BCA4F5" stroke="#4A69CE" strokeWidth="1.5" />
        </svg>
      );
    case 'digital-illustration':
    default:
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
          <circle cx="24" cy="24" r="17" fill="#E9DFFD" stroke="#4A69CE" strokeWidth="1.8" />
          <path d="M16 32L29 14L34 19L21 37L14 38L16 32Z" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.6" />
        </svg>
      );
  }
};

/* Portfolio Archive Luminous Pastel Vector Artworks (inspired by Bottom-Right filmstrip reference cards) */
export const PortfolioArtwork: React.FC<{
  variant: PortfolioItem['artVariant'];
}> = ({ variant }) => {
  switch (variant) {
    case 'poster-flora':
      return (
        <svg viewBox="0 0 280 340" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="pf-flora" x1="0" y1="0" x2="280" y2="340" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E5F8F0" />
              <stop offset="55%" stopColor="#ECFFBE" />
              <stop offset="100%" stopColor="#81CFFF" />
            </linearGradient>
          </defs>
          <rect width="280" height="340" fill="url(#pf-flora)" />
          <rect x="18" y="18" width="244" height="304" rx="14" fill="#FFFFFF" fillOpacity="0.7" stroke="#4A69CE" strokeOpacity="0.4" strokeWidth="1.8" />
          <rect x="36" y="36" width="208" height="196" rx="104" fill="#D7F0FF" stroke="#4A69CE" strokeOpacity="0.45" strokeWidth="1.6" />
          <path d="M140 86V220" stroke="#4A69CE" strokeWidth="2.2" />
          <ellipse cx="114" cy="176" rx="24" ry="12" transform="rotate(-25 114 176)" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.6" />
          <ellipse cx="166" cy="176" rx="24" ry="12" transform="rotate(25 166 176)" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.6" />
          <circle cx="140" cy="108" r="24" fill="#FADCE8" stroke="#4A69CE" strokeWidth="1.6" />
          <circle cx="118" cy="116" r="16" fill="#BCA4F5" stroke="#4A69CE" strokeWidth="1.5" />
          <circle cx="162" cy="116" r="16" fill="#BCA4F5" stroke="#4A69CE" strokeWidth="1.5" />
          <circle cx="140" cy="108" r="9" fill="#FFFFFF" stroke="#4A69CE" strokeWidth="1.5" />
          <rect x="50" y="254" width="180" height="14" rx="7" fill="#4A69CE" />
          <rect x="78" y="278" width="124" height="10" rx="5" fill="#81CFFF" />
        </svg>
      );

    case 'video-reel':
      return (
        <svg viewBox="0 0 280 280" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="pf-reel" x1="0" y1="0" x2="280" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FADCE8" />
              <stop offset="45%" stopColor="#BCA4F5" />
              <stop offset="100%" stopColor="#81CFFF" />
            </linearGradient>
          </defs>
          <rect width="280" height="280" fill="url(#pf-reel)" />
          <rect x="24" y="26" width="232" height="170" rx="14" fill="#4A69CE" />
          <rect x="36" y="38" width="208" height="146" rx="10" fill="#E5F8F0" />
          <circle cx="140" cy="110" r="34" fill="#FFFFFF" stroke="#4A69CE" strokeWidth="2" />
          <path d="M132 95L156 110L132 125V95Z" fill="#4A69CE" />
          <rect x="24" y="212" width="232" height="44" rx="12" fill="#FFFFFF" fillOpacity="0.92" stroke="#4A69CE" strokeOpacity="0.4" strokeWidth="1.6" />
          <rect x="34" y="222" width="76" height="10" rx="5" fill="#BCA4F5" />
          <rect x="116" y="222" width="60" height="10" rx="5" fill="#ECFFBE" />
          <rect x="182" y="222" width="64" height="10" rx="5" fill="#81CFFF" />
          <rect x="34" y="238" width="144" height="8" rx="4" fill="#4A69CE" fillOpacity="0.35" />
        </svg>
      );

    case 'brand-stamp':
      return (
        <svg viewBox="0 0 280 280" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="pf-brand" x1="0" y1="0" x2="280" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ECFFBE" />
              <stop offset="100%" stopColor="#E5F8F0" />
            </linearGradient>
          </defs>
          <rect width="280" height="280" fill="url(#pf-brand)" />
          <rect x="26" y="34" width="228" height="212" rx="18" fill="#FFFFFF" fillOpacity="0.88" stroke="#4A69CE" strokeOpacity="0.45" strokeWidth="1.8" />
          <circle cx="140" cy="126" r="56" fill="#81CFFF" fillOpacity="0.45" stroke="#4A69CE" strokeWidth="1.8" strokeDasharray="6 4" />
          <circle cx="140" cy="126" r="40" fill="#BCA4F5" stroke="#4A69CE" strokeWidth="1.8" />
          <path d="M140 98L147 119L168 126L147 133L140 154L133 133L112 126L133 119L140 98Z" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.5" />
          <rect x="74" y="200" width="132" height="22" rx="11" fill="#4A69CE" />
        </svg>
      );

    case 'social-grid':
      return (
        <svg viewBox="0 0 280 320" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="pf-social" x1="0" y1="0" x2="280" y2="320" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D7F0FF" />
              <stop offset="100%" stopColor="#FADCE8" />
            </linearGradient>
          </defs>
          <rect width="280" height="320" fill="url(#pf-social)" />
          <rect x="22" y="24" width="154" height="202" rx="14" fill="#FFFFFF" stroke="#4A69CE" strokeOpacity="0.5" strokeWidth="1.8" />
          <rect x="104" y="92" width="154" height="202" rx="14" fill="#E9DFFD" stroke="#4A69CE" strokeOpacity="0.55" strokeWidth="1.8" />
          <rect x="118" y="108" width="126" height="84" rx="10" fill="#FFFFFF" stroke="#4A69CE" strokeOpacity="0.4" strokeWidth="1.5" />
          <circle cx="181" cy="150" r="24" fill="#81CFFF" stroke="#4A69CE" strokeWidth="1.6" />
          <rect x="122" y="206" width="118" height="12" rx="6" fill="#4A69CE" />
          <rect x="122" y="226" width="88" height="10" rx="5" fill="#ECFFBE" />
        </svg>
      );

    case 'sticker-sheet':
      return (
        <svg viewBox="0 0 280 280" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="pf-sticker" x1="0" y1="0" x2="280" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FADCE8" />
              <stop offset="50%" stopColor="#ECFFBE" />
              <stop offset="100%" stopColor="#E5F8F0" />
            </linearGradient>
          </defs>
          <rect width="280" height="280" fill="url(#pf-sticker)" />
          <rect x="24" y="22" width="232" height="236" rx="18" fill="#FFFFFF" fillOpacity="0.88" stroke="#4A69CE" strokeOpacity="0.45" strokeWidth="1.8" />
          <circle cx="88" cy="88" r="34" fill="#FADCE8" stroke="#4A69CE" strokeWidth="1.6" />
          <rect x="148" y="54" width="76" height="68" rx="16" fill="#81CFFF" stroke="#4A69CE" strokeWidth="1.6" />
          <path d="M186 70L198 104H174L186 70Z" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.5" />
          <rect x="52" y="148" width="90" height="72" rx="36" fill="#E5F8F0" stroke="#4A69CE" strokeWidth="1.6" />
          <circle cx="192" cy="184" r="34" fill="#BCA4F5" stroke="#4A69CE" strokeWidth="1.6" />
          <circle cx="192" cy="184" r="12" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.4" />
        </svg>
      );

    case 'zine-spread':
    default:
      return (
        <svg viewBox="0 0 280 280" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="pf-zine" x1="0" y1="0" x2="280" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E9DFFD" />
              <stop offset="100%" stopColor="#81CFFF" />
            </linearGradient>
          </defs>
          <rect width="280" height="280" fill="url(#pf-zine)" />
          <rect x="20" y="42" width="118" height="196" rx="8" fill="#FFFFFF" stroke="#4A69CE" strokeOpacity="0.5" strokeWidth="1.6" />
          <rect x="138" y="42" width="122" height="196" rx="8" fill="#FFFFFF" stroke="#4A69CE" strokeOpacity="0.5" strokeWidth="1.6" />
          <rect x="34" y="60" width="90" height="86" rx="8" fill="#FADCE8" stroke="#4A69CE" strokeWidth="1.4" />
          <circle cx="79" cy="103" r="20" fill="#ECFFBE" stroke="#4A69CE" strokeWidth="1.4" />
          <rect x="34" y="160" width="88" height="10" rx="5" fill="#4A69CE" />
          <rect x="34" y="178" width="72" height="8" rx="4" fill="#81CFFF" />
          <rect x="154" y="60" width="90" height="10" rx="5" fill="#4A69CE" />
          <rect x="154" y="80" width="82" height="8" rx="4" fill="#BCA4F5" />
          <rect x="154" y="102" width="90" height="114" rx="10" fill="#E5F8F0" stroke="#4A69CE" strokeWidth="1.4" />
        </svg>
      );
  }
};

/* Luminous Pastel Team Avatar SVG */
export const TeamStampPortrait: React.FC<{
  variant: TeamMember['avatarVariant'];
  bgColor: string;
}> = ({ variant, bgColor }) => {
  const pastelBg = resolvePastelSurface(bgColor, '#E5F8F0');
  return (
    <svg viewBox="0 0 180 180" fill="none" className="w-full h-full">
      <rect width="180" height="180" fill={pastelBg} />
      {/* Floating light bokeh circles */}
      <circle cx="32" cy="34" r="7" fill="#FFFFFF" opacity="0.7" />
      <circle cx="148" cy="40" r="9" fill="#FFFFFF" opacity="0.65" />
      {/* Shoulders */}
      <path
        d="M36 180C36 142 60 124 90 124C120 124 144 142 144 180H36Z"
        fill="#FFFFFF"
        stroke="#4A69CE"
        strokeWidth="2"
      />
      {/* Head */}
      <circle cx="90" cy="84" r="34" fill="#FFFFFF" stroke="#4A69CE" strokeWidth="2" />
      {/* Role styling */}
      {variant === 'director' && (
        <path
          d="M54 78C54 50 72 38 92 38C114 38 128 54 126 78C112 64 72 64 54 78Z"
          fill="#4A69CE"
        />
      )}
      {variant === 'editor' && (
        <>
          <path
            d="M56 76C58 50 74 42 90 42C106 42 122 50 124 76C108 66 72 66 56 76Z"
            fill="#1E2B58"
          />
          <rect x="64" y="76" width="22" height="14" rx="4" stroke="#4A69CE" strokeWidth="2" fill="#81CFFF" fillOpacity="0.45" />
          <rect x="94" y="76" width="22" height="14" rx="4" stroke="#4A69CE" strokeWidth="2" fill="#81CFFF" fillOpacity="0.45" />
          <path d="M86 83H94" stroke="#4A69CE" strokeWidth="2" />
        </>
      )}
      {variant === 'designer' && (
        <>
          <ellipse cx="90" cy="50" rx="34" ry="14" fill="#BCA4F5" stroke="#4A69CE" strokeWidth="2" />
          <circle cx="90" cy="36" r="5" fill="#4A69CE" />
        </>
      )}
      {variant === 'illustrator' && (
        <>
          <circle cx="56" cy="64" r="14" fill="#4A69CE" />
          <circle cx="124" cy="64" r="14" fill="#4A69CE" />
          <path
            d="M56 74C58 50 74 42 90 42C106 42 122 50 124 74C108 64 72 64 56 74Z"
            fill="#4A69CE"
          />
        </>
      )}
      {/* Friendly expression */}
      <circle cx="78" cy="85" r="2.6" fill="#1E2B58" />
      <circle cx="102" cy="85" r="2.6" fill="#1E2B58" />
      <circle cx="71" cy="93" r="4.5" fill="#FADCE8" />
      <circle cx="109" cy="93" r="4.5" fill="#FADCE8" />
      <path d="M83 97C86 102 94 102 97 97" stroke="#1E2B58" strokeWidth="2" strokeLinecap="round" />
      <circle cx="90" cy="148" r="10" fill={pastelBg} stroke="#4A69CE" strokeWidth="1.8" />
    </svg>
  );
};
