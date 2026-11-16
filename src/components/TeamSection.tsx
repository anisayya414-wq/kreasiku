import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Language, TeamMember } from '../types/studio';
import {
  TEAM_MEMBERS,
  getBilingual,
  type StudioCopy,
} from '../data/translations';
import { resolvePastelSurface } from '../utils/pastelTheme';
import { Starburst, TeamStampPortrait } from './SvgMotifs';

interface TeamSectionProps {
  lang: Language;
  copy: StudioCopy['team'];
  members?: TeamMember[];
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  lang,
  copy,
  members,
}) => {
  const prefersReduced = useReducedMotion();
  const teamList = members && members.length > 0 ? members : TEAM_MEMBERS;

  return (
    <section
      id="team"
      className="relative bg-[#E5F8F0]/55 py-16 sm:py-22 border-b border-[#4A69CE]/15 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4A69CE] mb-1.5">
            {copy.eyebrow}
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#1E2B58] [text-wrap:balance]">
            {copy.title}
          </h2>
          <p className="mt-2.5 text-sm sm:text-[15px] text-[#1E2B58]/85 leading-relaxed">
            {copy.subtitle}
          </p>
          {copy.placeholderNote.trim() && (
            <p className="mt-2 text-xs text-[#4A69CE]/80 italic">
              {copy.placeholderNote}
            </p>
          )}
        </div>

        {/* Luminous Pastel Team Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {teamList.map((member, idx) => (
            <motion.article
              key={member.id}
              whileHover={
                prefersReduced
                  ? undefined
                  : { y: -5, rotate: idx % 2 === 0 ? -0.8 : 0.8 }
              }
              transition={{ duration: 0.18 }}
              className="relative bg-white/95 border border-[#4A69CE]/20 rounded-3xl p-4 shadow-pastel flex flex-col"
            >
              {/* Pastel Code Header */}
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-[#4A69CE] pb-2.5 border-b border-[#4A69CE]/15">
                <span className="tabular-nums">{member.stampCode}</span>
                <Starburst className="w-3.5 h-3.5" color="#BCA4F5" points={4} />
              </div>

              {/* Pastel Portrait Frame */}
              <div
                className="my-4 p-2 rounded-2xl border border-[#4A69CE]/20"
                style={{
                  backgroundColor: resolvePastelSurface(
                    member.bgColor,
                    '#E5F8F0'
                  ),
                }}
              >
                <div className="aspect-square w-full overflow-hidden rounded-xl border border-white/80">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={getBilingual(member.name, lang)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <TeamStampPortrait
                      variant={member.avatarVariant}
                      bgColor={member.bgColor}
                    />
                  )}
                </div>
              </div>

              {/* Member Info */}
              <div className="flex-1 flex flex-col">
                <h3 className="font-editorial text-xl font-semibold text-[#1E2B58]">
                  {getBilingual(member.name, lang)}
                </h3>
                <p className="text-xs font-semibold text-[#4A69CE] mt-0.5">
                  {getBilingual(member.role, lang)}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[#1E2B58]/65 mt-1">
                  {getBilingual(member.specialty, lang)}
                </p>
                <p className="mt-3 text-xs sm:text-[13px] leading-relaxed text-[#1E2B58]/85">
                  {getBilingual(member.bio, lang)}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
