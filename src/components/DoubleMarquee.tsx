import React from 'react';
import type { StudioCopy } from '../data/translations';
import { HeartIcon, Starburst } from './SvgMotifs';

interface DoubleMarqueeProps {
  copy: StudioCopy['doubleMarquee'];
}

export const DoubleMarquee: React.FC<DoubleMarqueeProps> = ({ copy }) => {
  const topBlocks = [
    ...copy.topItems,
    ...copy.topItems,
    ...copy.topItems,
    ...copy.topItems,
  ];
  const bottomBlocks = [
    ...copy.bottomItems,
    ...copy.bottomItems,
    ...copy.bottomItems,
  ];

  const topPastels = ['#E5F8F0', '#FADCE8', '#D7F0FF', '#E9DFFD'];

  return (
    <div
      className="marquee-wrapper w-full border-y border-[#4A69CE]/20 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Top Band: Alternating Honeydew, Sakura, Sky Blue, Mauve pastel blocks */}
      <div className="w-full h-9 sm:h-10 border-b border-[#4A69CE]/20 flex items-center overflow-hidden bg-[#E5F8F0]">
        <div className="animate-marquee items-center h-full">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center h-full shrink-0">
              {topBlocks.map((text, idx) => (
                <div
                  key={`${dup}-${idx}`}
                  className="h-full px-5 flex items-center gap-4 border-r border-[#4A69CE]/15 shrink-0"
                  style={{
                    backgroundColor: topPastels[idx % topPastels.length],
                  }}
                >
                  <span className="text-xs sm:text-[13px] font-semibold text-[#1E2B58] whitespace-nowrap">
                    {text}
                  </span>
                  {idx % 2 === 0 ? (
                    <HeartIcon className="w-3.5 h-3.5 shrink-0" color="#4A69CE" />
                  ) : (
                    <Starburst
                      className="w-3.5 h-3.5 shrink-0"
                      color="#BCA4F5"
                      points={4}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Band: Luminous Royal Blue with Honeydew text, outlined Sky hearts, and Tea Green 4-point sparkles */}
      <div
        className="w-full h-9 sm:h-10 flex items-center overflow-hidden"
        style={{
          background:
            'linear-gradient(90deg, #4A69CE 0%, #3E5EC2 50%, #4A69CE 100%)',
        }}
      >
        <div className="animate-marquee-reverse items-center">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center shrink-0">
              {bottomBlocks.map((text, idx) => (
                <span
                  key={`${dup}-${idx}`}
                  className="inline-flex items-center gap-5 px-5 text-xs sm:text-[13px] font-medium text-[#E5F8F0] whitespace-nowrap"
                >
                  <span>{text}</span>
                  {idx % 2 === 0 ? (
                    <HeartIcon
                      className="w-3.5 h-3.5 shrink-0"
                      color="#81CFFF"
                      outline
                    />
                  ) : (
                    <Starburst
                      className="w-3.5 h-3.5 shrink-0"
                      color="#ECFFBE"
                      points={4}
                    />
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
