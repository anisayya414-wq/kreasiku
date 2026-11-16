import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type {
  BilingualText,
  Language,
  PortfolioCategory,
  PortfolioItem,
  PortfolioMediaType,
  ServiceItem,
  SiteContentConfig,
  TeamMember,
  TestimonialItem,
} from '../../types/studio';
import type { AdminCopy } from '../../data/adminCopy';
import {
  fetchPublicSiteConfig,
  saveSiteContentConfig,
  uploadSiteAssetImage,
} from '../../lib/supabase';
import {
  getDefaultSiteContentConfig,
  mergeSiteContentConfig,
} from '../../utils/siteConfigLogic';
import {
  parsePortfolioVideoUrl,
  validatePortfolioVideoUrl,
  validatePortfolioVideosInConfig,
} from '../../utils/portfolioVideo';

interface AdminSiteEditorProps {
  lang: Language;
  copy: AdminCopy['dashboard']['siteEditor'];
  initialConfig: SiteContentConfig;
  onConfigPublished: (nextConfig: SiteContentConfig) => void;
}

type EditorSubTab =
  | 'brandHero'
  | 'aboutTestimonials'
  | 'team'
  | 'portfolio'
  | 'servicesContact';

const PORTFOLIO_CATEGORIES: Exclude<PortfolioCategory, 'all'>[] = [
  'poster-design',
  'graphic-design',
  'social-media-design',
  'video-editing',
  'digital-illustration',
  'other-projects',
];

const TEAM_COLORS = ['#E5F8F0', '#ECFFBE', '#E9DFFD', '#D7F0FF'];
const PORTFOLIO_TONES = ['#E5F8F0', '#ECFFBE', '#E9DFFD', '#D7F0FF', '#FADCE8'];
const TESTIMONIAL_TONES = ['#E5F8F0', '#ECFFBE', '#E9DFFD', '#D7F0FF', '#FADCE8'];

function splitLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function updateBilingual(
  current: BilingualText,
  editLang: Language,
  nextVal: string
): BilingualText {
  return {
    ...current,
    [editLang]: nextVal,
  };
}

interface ImageSlotUploaderProps {
  label: string;
  imageUrl: string;
  busy: boolean;
  onUpload: (file: File) => void;
  onUrlChange: (url: string) => void;
  onClear: () => void;
  uploadLabel: string;
  uploadingLabel: string;
  clearLabel: string;
  urlLabel: string;
  defaultHint: string;
}

const ImageSlotUploader: React.FC<ImageSlotUploaderProps> = ({
  label,
  imageUrl,
  busy,
  onUpload,
  onUrlChange,
  onClear,
  uploadLabel,
  uploadingLabel,
  clearLabel,
  urlLabel,
  defaultHint,
}) => {
  return (
    <div className="border border-[#4A69CE]/25 bg-[#F6FCF9] p-3.5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1E2B58]">
          {label}
        </span>
        {imageUrl ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 px-2 py-1 bg-[#E9DFFD] hover:bg-[#BCA4F5]/45 border border-[#4A69CE]/25 text-[11px] font-bold text-[#1E2B58] cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>{clearLabel}</span>
          </button>
        ) : null}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="w-20 h-20 shrink-0 border border-[#4A69CE]/25 bg-white/95 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={label}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-[#1E2B58]/40" />
          )}
        </div>

        <div className="flex-1 w-full space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D7F0FF] hover:bg-[#81CFFF]/60 border border-[#4A69CE]/25 text-xs font-bold text-[#1E2B58] cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>{busy ? uploadingLabel : uploadLabel}</span>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
                disabled={busy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = '';
                  if (f) onUpload(f);
                }}
                className="hidden"
              />
            </label>
            {!imageUrl && (
              <span className="text-[11px] text-[#1E2B58]/65 italic">
                {defaultHint}
              </span>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1E2B58]/75 mb-1">
              {urlLabel}
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://..."
              className="w-full px-2.5 py-1.5 bg-white/95 border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminSiteEditor: React.FC<AdminSiteEditorProps> = ({
  lang,
  copy,
  initialConfig,
  onConfigPublished,
}) => {
  const [draft, setDraft] = useState<SiteContentConfig>(() =>
    mergeSiteContentConfig(initialConfig)
  );
  const [editLang, setEditLang] = useState<Language>(lang);
  const [subTab, setSubTab] = useState<EditorSubTab>('brandHero');
  const [saving, setSaving] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    setDraft(mergeSiteContentConfig(initialConfig));
  }, [initialConfig]);

  const handleSave = async () => {
    const invalidVideo = validatePortfolioVideosInConfig(draft.portfolio, lang);
    if (invalidVideo) {
      setSubTab('portfolio');
      setFeedback({
        type: 'error',
        text: `${copy.fields.videoFixBeforeSave}: "${invalidVideo.title}" — ${invalidVideo.error}`,
      });
      return;
    }

    setSaving(true);
    setFeedback(null);
    const res = await saveSiteContentConfig(draft, lang);
    if (res.ok) {
      setDraft(res.data);
      onConfigPublished(res.data);
      setFeedback({ type: 'success', text: copy.savedMsg });
    } else {
      setFeedback({ type: 'error', text: res.error });
    }
    setSaving(false);
  };

  const handleReload = async () => {
    setReloading(true);
    setFeedback(null);
    const latest = await fetchPublicSiteConfig();
    if (latest) {
      setDraft(latest);
      onConfigPublished(latest);
    } else {
      setDraft(getDefaultSiteContentConfig());
    }
    setReloading(false);
  };

  const handleConfirmReset = () => {
    setDraft(getDefaultSiteContentConfig());
    setConfirmingReset(false);
    setFeedback({ type: 'success', text: copy.resetDoneMsg });
  };

  const handleUploadImage = async (
    slotKey: string,
    folder: 'hero' | 'team' | 'portfolio',
    file: File,
    applyUrl: (url: string) => void
  ) => {
    setUploadingSlot(slotKey);
    setFeedback(null);
    const res = await uploadSiteAssetImage(folder, file, lang);
    if (res.ok) {
      applyUrl(res.data);
    } else {
      setFeedback({ type: 'error', text: res.error });
    }
    setUploadingSlot(null);
  };

  const handleAddTestimonial = () => {
    const nextItem: TestimonialItem = {
      id: `testi-${Date.now()}`,
      style: 'handwritten',
      paperTone: TESTIMONIAL_TONES[draft.testimonials.length % TESTIMONIAL_TONES.length],
      tapeColor: '#D7F0FF',
      tiltDeg: draft.testimonials.length % 2 === 0 ? -1 : 1,
      dispatchCode: `NOTE #${String(draft.testimonials.length + 1).padStart(2, '0')}`,
      dateLabel: '2025',
      quote: {
        en: 'Great visual direction and thoughtful studio collaboration.',
        id: 'Arahan visual rapi dan kolaborasi studio yang menyenangkan.',
      },
      senderPlaceholder: {
        en: 'Client Partner',
        id: 'Klien Studio',
      },
      projectTag: {
        en: 'Creative Project',
        id: 'Proyek Kreatif',
      },
    };
    setDraft((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, nextItem],
    }));
  };

  const handleAddTeamMember = () => {
    const nextMember: TeamMember = {
      id: `member-${Date.now()}`,
      stampCode: `KRS-${String(draft.team.length + 1).padStart(2, '0')}`,
      bgColor: TEAM_COLORS[draft.team.length % TEAM_COLORS.length],
      name: {
        en: 'New Studio Member',
        id: 'Anggota Tim Baru',
      },
      role: {
        en: 'Creative Specialist',
        id: 'Spesialis Kreatif',
      },
      specialty: {
        en: 'Visual Design & Direction',
        id: 'Desain Visual & Arahan',
      },
      bio: {
        en: 'Crafts tailored visuals with clear storytelling and handmade studio detail.',
        id: 'Merancang visual yang disesuaikan dengan cerita merek dan detail studio.',
      },
      avatarVariant: 'designer',
      imageUrl: '',
    };
    setDraft((prev) => ({
      ...prev,
      team: [...prev.team, nextMember],
    }));
  };

  const handleAddPortfolioItem = () => {
    const idx = draft.portfolio.length + 1;
    const nextItem: PortfolioItem = {
      id: `work-${Date.now()}`,
      archiveNumber: `NO. ${String(idx).padStart(2, '0')}`,
      category: 'graphic-design',
      variant: 'postcard',
      tiltDeg: idx % 2 === 0 ? 1.5 : -1.5,
      bgTone: PORTFOLIO_TONES[idx % PORTFOLIO_TONES.length],
      title: {
        en: 'New Portfolio Piece',
        id: 'Karya Portofolio Baru',
      },
      categoryLabel: {
        en: 'Graphic Design',
        id: 'Desain Grafis',
      },
      yearPlaceholder: '2025',
      summary: {
        en: 'Custom creative deliverable crafted at Kreasiku Studio.',
        id: 'Karya kreatif khusus yang dibuat di Studio Kreasiku.',
      },
      deliverables: {
        en: ['Main Artwork', 'Print & Digital Ready'],
        id: ['Karya Utama', 'Siap Cetak & Digital'],
      },
      dimensions: 'A4 / 1080×1350',
      artVariant: 'brand-stamp',
      media_type: 'image',
      video_url: '',
      thumbnail: '',
      imageUrl: '',
    };
    setDraft((prev) => ({
      ...prev,
      portfolio: [...prev.portfolio, nextItem],
    }));
  };

  const updateService = (
    index: number,
    updater: (item: ServiceItem) => ServiceItem
  ) => {
    setDraft((prev) => ({
      ...prev,
      services: prev.services.map((srv, i) => (i === index ? updater(srv) : srv)),
    }));
  };

  return (
    <section className="space-y-5">
      {/* Top Toolbar */}
      <div className="bg-white/95 border border-[#4A69CE]/25 p-4 sm:p-5 shadow-pastel-sm rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-editorial text-xl sm:text-2xl font-semibold text-[#1E2B58]">
            {copy.title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#1E2B58]/80 max-w-2xl">
            {copy.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Content Language Toggle */}
          <div className="inline-flex items-center gap-2 border border-[#4A69CE]/25 bg-[#F6FCF9] px-2.5 py-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E2B58]/75">
              {copy.editingLangLabel}:
            </span>
            <button
              type="button"
              onClick={() => setEditLang('id')}
              className={`px-2 py-0.5 text-xs font-bold uppercase cursor-pointer ${
                editLang === 'id'
                  ? 'bg-[#4A69CE] text-white'
                  : 'text-[#1E2B58] hover:bg-[#E9DFFD]/55'
              }`}
            >
              ID
            </button>
            <button
              type="button"
              onClick={() => setEditLang('en')}
              className={`px-2 py-0.5 text-xs font-bold uppercase cursor-pointer ${
                editLang === 'en'
                  ? 'bg-[#4A69CE] text-white'
                  : 'text-[#1E2B58] hover:bg-[#D7F0FF]/60'
              }`}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={() => void handleReload()}
            disabled={reloading || saving}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F6FCF9] hover:bg-[#D7F0FF] disabled:opacity-60 border border-[#4A69CE]/25 text-xs font-bold uppercase tracking-wider text-[#1E2B58] cursor-pointer min-h-[38px]"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${reloading ? 'animate-spin' : ''}`}
            />
            <span>{copy.reloadBtn}</span>
          </button>

          {confirmingReset ? (
            <div className="inline-flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-3 py-2 bg-[#E9DFFD] hover:bg-[#BCA4F5]/45 border border-[#8A1C2B]/40 text-xs font-bold uppercase tracking-wider text-[#8A1C2B] cursor-pointer min-h-[38px]"
              >
                {copy.confirmResetBtn}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="px-3 py-2 bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs font-bold uppercase tracking-wider text-[#1E2B58] cursor-pointer min-h-[38px]"
              >
                {copy.cancelResetBtn}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F6FCF9] hover:bg-[#FADCE8]/85 border border-[#4A69CE]/25 text-xs font-bold uppercase tracking-wider text-[#1E2B58] cursor-pointer min-h-[38px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{copy.resetBtn}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving || Boolean(uploadingSlot)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4A69CE] hover:bg-[#334FA8] disabled:opacity-60 text-white border border-[#4A69CE]/25 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-pastel-sm rounded-xl min-h-[38px]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? copy.savingBtn : copy.saveBtn}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          className={`flex items-start gap-2.5 p-3.5 border text-xs sm:text-sm font-semibold ${
            feedback.type === 'success'
              ? 'bg-[#ECFFBE]/80 border-[#4A69CE]/25 text-[#1E2B58]'
              : 'bg-[#FADCE8] border-[#8A1C2B]/40 text-[#8A1C2B]'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Sub-navigation Tabs */}
      <div
        role="tablist"
        aria-label="Site content categories"
        className="flex flex-wrap gap-2"
      >
        {(
          [
            ['brandHero', copy.subtabs.brandHero],
            ['aboutTestimonials', copy.subtabs.aboutTestimonials],
            ['team', copy.subtabs.team],
            ['portfolio', copy.subtabs.portfolio],
            ['servicesContact', copy.subtabs.servicesContact],
          ] as [EditorSubTab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={subTab === key}
            onClick={() => setSubTab(key)}
            className={`px-3.5 py-2 rounded-xl border border-[#4A69CE]/25 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
              subTab === key
                ? 'bg-[#4A69CE] text-white'
                : 'bg-white/95 text-[#1E2B58] hover:bg-[#E5F8F0]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 1. BRAND & HERO */}
      {subTab === 'brandHero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white/95 border border-[#4A69CE]/25 rounded-2xl p-5 shadow-pastel-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.brandName}
                </label>
                <input
                  type="text"
                  value={draft.brandName}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, brandName: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.studioLabel} ({editLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={draft.hero.studioLabel[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        studioLabel: updateBilingual(
                          prev.hero.studioLabel,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                {copy.fields.headline} ({editLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={draft.hero.headline[editLang]}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      headline: updateBilingual(
                        prev.hero.headline,
                        editLang,
                        e.target.value
                      ),
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                {copy.fields.tagline} ({editLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={draft.hero.tagline[editLang]}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      tagline: updateBilingual(
                        prev.hero.tagline,
                        editLang,
                        e.target.value
                      ),
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                {copy.fields.overview} ({editLang.toUpperCase()})
              </label>
              <textarea
                rows={3}
                value={draft.hero.overview[editLang]}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      overview: updateBilingual(
                        prev.hero.overview,
                        editLang,
                        e.target.value
                      ),
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.ctaExplore} ({editLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={draft.hero.ctaExplore[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        ctaExplore: updateBilingual(
                          prev.hero.ctaExplore,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.ctaStart} ({editLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={draft.hero.ctaStart[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        ctaStart: updateBilingual(
                          prev.hero.ctaStart,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                {copy.fields.marqueeItems} ({editLang.toUpperCase()}) —{' '}
                <span className="font-normal normal-case opacity-75">
                  {copy.fields.marqueeHint}
                </span>
              </label>
              <textarea
                rows={4}
                value={draft.marqueeTop[editLang].join('\n')}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    marqueeTop: {
                      ...prev.marqueeTop,
                      [editLang]: splitLines(e.target.value),
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dashed border-[#4A69CE]/20">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.doubleMarqueeTop} ({editLang.toUpperCase()}) —{' '}
                  <span className="font-normal normal-case opacity-75">
                    {copy.fields.marqueeHint}
                  </span>
                </label>
                <textarea
                  rows={4}
                  value={draft.doubleMarquee.topItems[editLang].join('\n')}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      doubleMarquee: {
                        ...prev.doubleMarquee,
                        topItems: {
                          ...prev.doubleMarquee.topItems,
                          [editLang]: splitLines(e.target.value),
                        },
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.doubleMarqueeBottom} ({editLang.toUpperCase()}) —{' '}
                  <span className="font-normal normal-case opacity-75">
                    {copy.fields.marqueeHint}
                  </span>
                </label>
                <textarea
                  rows={4}
                  value={draft.doubleMarquee.bottomItems[editLang].join('\n')}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      doubleMarquee: {
                        ...prev.doubleMarquee,
                        bottomItems: {
                          ...prev.doubleMarquee.bottomItems,
                          [editLang]: splitLines(e.target.value),
                        },
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/95 border border-[#4A69CE]/25 rounded-2xl p-5 shadow-pastel-sm space-y-4">
            <h3 className="font-editorial text-lg font-semibold text-[#1E2B58]">
              {copy.fields.heroImagesTitle}
            </h3>
            {[0, 1, 2].map((idx) => {
              const slotKey = `hero-${idx}`;
              return (
                <ImageSlotUploader
                  key={slotKey}
                  label={`${copy.fields.heroImageSlot} #${idx + 1}`}
                  imageUrl={draft.hero.sceneImages[idx] ?? ''}
                  busy={uploadingSlot === slotKey}
                  uploadLabel={copy.fields.uploadImageBtn}
                  uploadingLabel={copy.fields.uploadingImageBtn}
                  clearLabel={copy.fields.clearImageBtn}
                  urlLabel={copy.fields.imageUrlLabel}
                  defaultHint={copy.fields.defaultIllustrationHint}
                  onUpload={(file) =>
                    void handleUploadImage(slotKey, 'hero', file, (url) =>
                      setDraft((prev) => {
                        const nextImages: [string, string, string] = [
                          ...prev.hero.sceneImages,
                        ] as [string, string, string];
                        nextImages[idx] = url;
                        return {
                          ...prev,
                          hero: { ...prev.hero, sceneImages: nextImages },
                        };
                      })
                    )
                  }
                  onUrlChange={(url) =>
                    setDraft((prev) => {
                      const nextImages: [string, string, string] = [
                        ...prev.hero.sceneImages,
                      ] as [string, string, string];
                      nextImages[idx] = url;
                      return {
                        ...prev,
                        hero: { ...prev.hero, sceneImages: nextImages },
                      };
                    })
                  }
                  onClear={() =>
                    setDraft((prev) => {
                      const nextImages: [string, string, string] = [
                        ...prev.hero.sceneImages,
                      ] as [string, string, string];
                      nextImages[idx] = '';
                      return {
                        ...prev,
                        hero: { ...prev.hero, sceneImages: nextImages },
                      };
                    })
                  }
                />
              );
            })}
          </div>

          {/* Hero Collage Card Texts (3 Scenes) */}
          <div className="lg:col-span-12 bg-white/95 border border-[#4A69CE]/25 rounded-2xl p-5 shadow-pastel-sm space-y-4">
            <h3 className="font-editorial text-lg font-semibold text-[#1E2B58]">
              {copy.fields.heroScenesTitle} ({editLang.toUpperCase()})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {draft.hero.scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  className="bg-[#F6FCF9] border border-[#4A69CE]/25 rounded-2xl p-4 shadow-pastel-sm space-y-3"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-[#4A69CE] pb-2 border-b border-dashed border-[#4A69CE]/25">
                    {copy.fields.heroImageSlot} #{idx + 1}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.sceneThumbLabel}
                      </label>
                      <input
                        type="text"
                        value={scene.thumbLabel[editLang]}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              scenes: prev.hero.scenes.map((sc, i) =>
                                i === idx
                                  ? {
                                      ...sc,
                                      thumbLabel: updateBilingual(
                                        sc.thumbLabel,
                                        editLang,
                                        e.target.value
                                      ),
                                    }
                                  : sc
                              ),
                            },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 bg-white/95 border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.sceneStickerTag}
                      </label>
                      <input
                        type="text"
                        value={scene.stickerTag[editLang]}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              scenes: prev.hero.scenes.map((sc, i) =>
                                i === idx
                                  ? {
                                      ...sc,
                                      stickerTag: updateBilingual(
                                        sc.stickerTag,
                                        editLang,
                                        e.target.value
                                      ),
                                    }
                                  : sc
                              ),
                            },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 bg-white/95 border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                      {copy.fields.scenePostcardTitle}
                    </label>
                    <input
                      type="text"
                      value={scene.postcardTitle[editLang]}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            scenes: prev.hero.scenes.map((sc, i) =>
                              i === idx
                                ? {
                                    ...sc,
                                    postcardTitle: updateBilingual(
                                      sc.postcardTitle,
                                      editLang,
                                      e.target.value
                                    ),
                                  }
                                : sc
                            ),
                          },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white/95 border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                      {copy.fields.scenePostcardSub}
                    </label>
                    <input
                      type="text"
                      value={scene.postcardSub[editLang]}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            scenes: prev.hero.scenes.map((sc, i) =>
                              i === idx
                                ? {
                                    ...sc,
                                    postcardSub: updateBilingual(
                                      sc.postcardSub,
                                      editLang,
                                      e.target.value
                                    ),
                                  }
                                : sc
                            ),
                          },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white/95 border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                      {copy.fields.sceneLetterHeading}
                    </label>
                    <input
                      type="text"
                      value={scene.letterHeading[editLang]}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            scenes: prev.hero.scenes.map((sc, i) =>
                              i === idx
                                ? {
                                    ...sc,
                                    letterHeading: updateBilingual(
                                      sc.letterHeading,
                                      editLang,
                                      e.target.value
                                    ),
                                  }
                                : sc
                            ),
                          },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white/95 border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                      {copy.fields.sceneLetterBody}
                    </label>
                    <textarea
                      rows={3}
                      value={scene.letterBody[editLang]}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            scenes: prev.hero.scenes.map((sc, i) =>
                              i === idx
                                ? {
                                    ...sc,
                                    letterBody: updateBilingual(
                                      sc.letterBody,
                                      editLang,
                                      e.target.value
                                    ),
                                  }
                                : sc
                            ),
                          },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white/95 border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Accordions (3 Cards) */}
          <div className="lg:col-span-12 bg-white/95 border border-[#4A69CE]/25 rounded-2xl p-5 shadow-pastel-sm space-y-4">
            <h3 className="font-editorial text-lg font-semibold text-[#1E2B58]">
              {copy.fields.heroAccordionsTitle} ({editLang.toUpperCase()})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {draft.hero.accordions.map((acc, idx) => (
                <div
                  key={acc.id}
                  className="bg-[#F6FCF9] border border-[#4A69CE]/25 rounded-2xl p-4 shadow-pastel-sm space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-dashed border-[#4A69CE]/25">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4A69CE]">
                      #{idx + 1} · {acc.id}
                    </span>
                    <input
                      type="color"
                      aria-label={copy.fields.bgColor}
                      value={acc.bg}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            accordions: prev.hero.accordions.map((item, i) =>
                              i === idx ? { ...item, bg: e.target.value } : item
                            ),
                          },
                        }))
                      }
                      className="w-7 h-6 border border-[#4A69CE]/25 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                      {copy.fields.accordionTitle}
                    </label>
                    <input
                      type="text"
                      value={acc.title[editLang]}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            accordions: prev.hero.accordions.map((item, i) =>
                              i === idx
                                ? {
                                    ...item,
                                    title: updateBilingual(
                                      item.title,
                                      editLang,
                                      e.target.value
                                    ),
                                  }
                                : item
                            ),
                          },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white/95 border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                      {copy.fields.accordionContent}
                    </label>
                    <textarea
                      rows={3}
                      value={acc.content[editLang]}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            accordions: prev.hero.accordions.map((item, i) =>
                              i === idx
                                ? {
                                    ...item,
                                    content: updateBilingual(
                                      item.content,
                                      editLang,
                                      e.target.value
                                    ),
                                  }
                                : item
                            ),
                          },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white/95 border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ABOUT & TESTIMONIALS */}
      {subTab === 'aboutTestimonials' && (
        <div className="space-y-6">
          <div className="bg-white/95 border border-[#4A69CE]/25 rounded-2xl p-5 shadow-pastel-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.aboutTitle} ({editLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={draft.about.title[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      about: {
                        ...prev.about,
                        title: updateBilingual(
                          prev.about.title,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.aboutSubtitle} ({editLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={draft.about.subtitle[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      about: {
                        ...prev.about,
                        subtitle: updateBilingual(
                          prev.about.subtitle,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58]">
                  {copy.fields.storyTitle} ({editLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={draft.about.storyTitle[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      about: {
                        ...prev.about,
                        storyTitle: updateBilingual(
                          prev.about.storyTitle,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] pt-1">
                  {copy.fields.storyText} ({editLang.toUpperCase()})
                </label>
                <textarea
                  rows={4}
                  value={draft.about.storyText[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      about: {
                        ...prev.about,
                        storyText: updateBilingual(
                          prev.about.storyText,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58]">
                  {copy.fields.visionTitle} ({editLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={draft.about.visionTitle[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      about: {
                        ...prev.about,
                        visionTitle: updateBilingual(
                          prev.about.visionTitle,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] pt-1">
                  {copy.fields.visionText} ({editLang.toUpperCase()})
                </label>
                <textarea
                  rows={4}
                  value={draft.about.visionText[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      about: {
                        ...prev.about,
                        visionText: updateBilingual(
                          prev.about.visionText,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.missionItems} ({editLang.toUpperCase()}) —{' '}
                  <span className="font-normal normal-case opacity-75">
                    {copy.fields.linesHint}
                  </span>
                </label>
                <textarea
                  rows={4}
                  value={draft.about.missionItems[editLang].join('\n')}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      about: {
                        ...prev.about,
                        missionItems: {
                          ...prev.about.missionItems,
                          [editLang]: splitLines(e.target.value),
                        },
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.valuesList} ({editLang.toUpperCase()}) —{' '}
                  <span className="font-normal normal-case opacity-75">
                    {copy.fields.linesHint}
                  </span>
                </label>
                <textarea
                  rows={4}
                  value={draft.about.valuesList[editLang].join('\n')}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      about: {
                        ...prev.about,
                        valuesList: {
                          ...prev.about.valuesList,
                          [editLang]: splitLines(e.target.value),
                        },
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
            </div>
          </div>

          {/* Testimonials Section Header & Notice */}
          <div className="bg-white/95 border border-[#4A69CE]/25 rounded-2xl p-5 shadow-pastel-sm space-y-4">
            <h3 className="font-editorial text-lg font-semibold text-[#1E2B58]">
              {copy.fields.testimonialsHeaderTitle} ({editLang.toUpperCase()})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.testimonialsEyebrow}
                </label>
                <input
                  type="text"
                  value={draft.about.testimonialsEyebrow[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      about: {
                        ...prev.about,
                        testimonialsEyebrow: updateBilingual(
                          prev.about.testimonialsEyebrow,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.testimonialsSectionTitle}
                </label>
                <input
                  type="text"
                  value={draft.about.testimonialsTitle[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      about: {
                        ...prev.about,
                        testimonialsTitle: updateBilingual(
                          prev.about.testimonialsTitle,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                {copy.fields.testimonialsNote}
              </label>
              <input
                type="text"
                value={draft.about.testimonialsNote[editLang]}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    about: {
                      ...prev.about,
                      testimonialsNote: updateBilingual(
                        prev.about.testimonialsNote,
                        editLang,
                        e.target.value
                      ),
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
              />
              <p className="mt-1 text-[11px] text-[#1E2B58]/70">
                {copy.fields.clearPlaceholderHint}
              </p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-editorial text-xl font-semibold text-[#1E2B58]">
                {copy.fields.testimonialsTitle} ({draft.testimonials.length})
              </h3>
              <button
                type="button"
                onClick={handleAddTestimonial}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#ECFFBE] hover:bg-[#d8f39e] border border-[#4A69CE]/25 text-xs font-bold uppercase tracking-wider text-[#1E2B58] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{copy.fields.addTestimonial}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {draft.testimonials.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-white/95 border border-[#4A69CE]/25 rounded-2xl p-4 shadow-pastel-sm space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-dashed border-[#4A69CE]/25">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4A69CE]">
                      {item.dispatchCode}
                    </span>
                    {draft.testimonials.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            testimonials: prev.testimonials.filter(
                              (t) => t.id !== item.id
                            ),
                          }))
                        }
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[#E9DFFD] border border-[#4A69CE]/25 text-[11px] font-bold text-[#1E2B58] cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{copy.fields.deleteItemBtn}</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                      {copy.fields.quote} ({editLang.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      value={item.quote[editLang]}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          testimonials: prev.testimonials.map((t, i) =>
                            i === idx
                              ? {
                                  ...t,
                                  quote: updateBilingual(
                                    t.quote,
                                    editLang,
                                    e.target.value
                                  ),
                                }
                              : t
                          ),
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.senderName} ({editLang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={item.senderPlaceholder[editLang]}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            testimonials: prev.testimonials.map((t, i) =>
                              i === idx
                                ? {
                                    ...t,
                                    senderPlaceholder: updateBilingual(
                                      t.senderPlaceholder,
                                      editLang,
                                      e.target.value
                                    ),
                                  }
                                : t
                            ),
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.projectTag} ({editLang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={item.projectTag[editLang]}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            testimonials: prev.testimonials.map((t, i) =>
                              i === idx
                                ? {
                                    ...t,
                                    projectTag: updateBilingual(
                                      t.projectTag,
                                      editLang,
                                      e.target.value
                                    ),
                                  }
                                : t
                            ),
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.dateLabel}
                      </label>
                      <input
                        type="text"
                        value={item.dateLabel}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            testimonials: prev.testimonials.map((t, i) =>
                              i === idx ? { ...t, dateLabel: e.target.value } : t
                            ),
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.cardStyle}
                      </label>
                      <select
                        value={item.style}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            testimonials: prev.testimonials.map((t, i) =>
                              i === idx
                                ? {
                                    ...t,
                                    style: e.target.value as
                                      | 'handwritten'
                                      | 'telegram',
                                  }
                                : t
                            ),
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      >
                        <option value="handwritten">Handwritten Note</option>
                        <option value="telegram">Studio Telegram</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TEAM MEMBERS */}
      {subTab === 'team' && (
        <div className="space-y-5">
          {/* Team Section Header & Notice */}
          <div className="bg-white/95 border border-[#4A69CE]/25 rounded-2xl p-5 shadow-pastel-sm space-y-4">
            <h3 className="font-editorial text-lg font-semibold text-[#1E2B58]">
              {copy.fields.teamHeaderTitle} ({editLang.toUpperCase()})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.sectionEyebrow}
                </label>
                <input
                  type="text"
                  value={draft.teamHeader.eyebrow[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      teamHeader: {
                        ...prev.teamHeader,
                        eyebrow: updateBilingual(
                          prev.teamHeader.eyebrow,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.sectionTitle}
                </label>
                <input
                  type="text"
                  value={draft.teamHeader.title[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      teamHeader: {
                        ...prev.teamHeader,
                        title: updateBilingual(
                          prev.teamHeader.title,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                {copy.fields.sectionSubtitle}
              </label>
              <textarea
                rows={2}
                value={draft.teamHeader.subtitle[editLang]}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    teamHeader: {
                      ...prev.teamHeader,
                      subtitle: updateBilingual(
                        prev.teamHeader.subtitle,
                        editLang,
                        e.target.value
                      ),
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                {copy.fields.sectionNotice}
              </label>
              <input
                type="text"
                value={draft.teamHeader.notice[editLang]}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    teamHeader: {
                      ...prev.teamHeader,
                      notice: updateBilingual(
                        prev.teamHeader.notice,
                        editLang,
                        e.target.value
                      ),
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
              />
              <p className="mt-1 text-[11px] text-[#1E2B58]/70">
                {copy.fields.clearPlaceholderHint}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <h3 className="font-editorial text-xl font-semibold text-[#1E2B58]">
              {copy.fields.teamTitle} ({draft.team.length})
            </h3>
            <button
              type="button"
              onClick={handleAddTeamMember}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#ECFFBE] hover:bg-[#d8f39e] border border-[#4A69CE]/25 text-xs font-bold uppercase tracking-wider text-[#1E2B58] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{copy.fields.addTeamMember}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {draft.team.map((member, idx) => {
              const slotKey = `team-${member.id}`;
              return (
                <div
                  key={member.id}
                  className="bg-white/95 border border-[#4A69CE]/25 p-4 sm:p-5 space-y-4"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-dashed border-[#4A69CE]/25">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4A69CE]">
                      {member.stampCode} · {member.name[editLang]}
                    </span>
                    {draft.team.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            team: prev.team.filter((m) => m.id !== member.id),
                          }))
                        }
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[#E9DFFD] border border-[#4A69CE]/25 text-[11px] font-bold text-[#1E2B58] cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{copy.fields.deleteItemBtn}</span>
                      </button>
                    )}
                  </div>

                  <ImageSlotUploader
                    label={copy.fields.memberName}
                    imageUrl={member.imageUrl ?? ''}
                    busy={uploadingSlot === slotKey}
                    uploadLabel={copy.fields.uploadImageBtn}
                    uploadingLabel={copy.fields.uploadingImageBtn}
                    clearLabel={copy.fields.clearImageBtn}
                    urlLabel={copy.fields.imageUrlLabel}
                    defaultHint={copy.fields.defaultIllustrationHint}
                    onUpload={(file) =>
                      void handleUploadImage(slotKey, 'team', file, (url) =>
                        setDraft((prev) => ({
                          ...prev,
                          team: prev.team.map((m, i) =>
                            i === idx ? { ...m, imageUrl: url } : m
                          ),
                        }))
                      )
                    }
                    onUrlChange={(url) =>
                      setDraft((prev) => ({
                        ...prev,
                        team: prev.team.map((m, i) =>
                          i === idx ? { ...m, imageUrl: url } : m
                        ),
                      }))
                    }
                    onClear={() =>
                      setDraft((prev) => ({
                        ...prev,
                        team: prev.team.map((m, i) =>
                          i === idx ? { ...m, imageUrl: '' } : m
                        ),
                      }))
                    }
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.stampCode}
                      </label>
                      <input
                        type="text"
                        value={member.stampCode}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            team: prev.team.map((m, i) =>
                              i === idx ? { ...m, stampCode: e.target.value } : m
                            ),
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.memberName} ({editLang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={member.name[editLang]}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            team: prev.team.map((m, i) =>
                              i === idx
                                ? {
                                    ...m,
                                    name: updateBilingual(
                                      m.name,
                                      editLang,
                                      e.target.value
                                    ),
                                  }
                                : m
                            ),
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.memberRole} ({editLang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={member.role[editLang]}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            team: prev.team.map((m, i) =>
                              i === idx
                                ? {
                                    ...m,
                                    role: updateBilingual(
                                      m.role,
                                      editLang,
                                      e.target.value
                                    ),
                                  }
                                : m
                            ),
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.memberSpecialty} ({editLang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={member.specialty[editLang]}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            team: prev.team.map((m, i) =>
                              i === idx
                                ? {
                                    ...m,
                                    specialty: updateBilingual(
                                      m.specialty,
                                      editLang,
                                      e.target.value
                                    ),
                                  }
                                : m
                            ),
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                      {copy.fields.memberBio} ({editLang.toUpperCase()})
                    </label>
                    <textarea
                      rows={2}
                      value={member.bio[editLang]}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          team: prev.team.map((m, i) =>
                            i === idx
                              ? {
                                  ...m,
                                  bio: updateBilingual(
                                    m.bio,
                                    editLang,
                                    e.target.value
                                  ),
                                }
                              : m
                          ),
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. PORTFOLIO */}
      {subTab === 'portfolio' && (
        <div className="space-y-5">
          {/* Portfolio Section Header & Notice */}
          <div className="bg-white/95 border border-[#4A69CE]/25 rounded-2xl p-5 shadow-pastel-sm space-y-4">
            <h3 className="font-editorial text-lg font-semibold text-[#1E2B58]">
              {copy.fields.portfolioHeaderTitle} ({editLang.toUpperCase()})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.sectionEyebrow}
                </label>
                <input
                  type="text"
                  value={draft.portfolioHeader.eyebrow[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      portfolioHeader: {
                        ...prev.portfolioHeader,
                        eyebrow: updateBilingual(
                          prev.portfolioHeader.eyebrow,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.sectionTitle}
                </label>
                <input
                  type="text"
                  value={draft.portfolioHeader.title[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      portfolioHeader: {
                        ...prev.portfolioHeader,
                        title: updateBilingual(
                          prev.portfolioHeader.title,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                {copy.fields.sectionSubtitle}
              </label>
              <textarea
                rows={2}
                value={draft.portfolioHeader.subtitle[editLang]}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    portfolioHeader: {
                      ...prev.portfolioHeader,
                      subtitle: updateBilingual(
                        prev.portfolioHeader.subtitle,
                        editLang,
                        e.target.value
                      ),
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                {copy.fields.sectionNotice}
              </label>
              <input
                type="text"
                value={draft.portfolioHeader.notice[editLang]}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    portfolioHeader: {
                      ...prev.portfolioHeader,
                      notice: updateBilingual(
                        prev.portfolioHeader.notice,
                        editLang,
                        e.target.value
                      ),
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
              />
              <p className="mt-1 text-[11px] text-[#1E2B58]/70">
                {copy.fields.clearPlaceholderHint}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <h3 className="font-editorial text-xl font-semibold text-[#1E2B58]">
              {copy.fields.portfolioTitle} ({draft.portfolio.length})
            </h3>
            <button
              type="button"
              onClick={handleAddPortfolioItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#ECFFBE] hover:bg-[#d8f39e] border border-[#4A69CE]/25 text-xs font-bold uppercase tracking-wider text-[#1E2B58] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{copy.fields.addPortfolioItem}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {draft.portfolio.map((item, idx) => {
              const slotKey = `portfolio-${item.id}`;
              const mediaType: PortfolioMediaType =
                item.media_type === 'video' ? 'video' : 'image';
              const isVideoItem = mediaType === 'video';
              const videoUrlVal = item.video_url ?? '';
              const videoValidationError = isVideoItem
                ? validatePortfolioVideoUrl(videoUrlVal, lang)
                : null;
              const parsedVideo = isVideoItem
                ? parsePortfolioVideoUrl(videoUrlVal)
                : null;

              return (
                <div
                  key={item.id}
                  className="bg-white/95 border border-[#4A69CE]/25 p-4 sm:p-5 space-y-4"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-dashed border-[#4A69CE]/25">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4A69CE]">
                      {item.archiveNumber} · {item.title[editLang]}
                    </span>
                    {draft.portfolio.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            portfolio: prev.portfolio.filter(
                              (p) => p.id !== item.id
                            ),
                          }))
                        }
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[#E9DFFD] border border-[#4A69CE]/25 text-[11px] font-bold text-[#1E2B58] cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{copy.fields.deleteItemBtn}</span>
                      </button>
                    )}
                  </div>

                  {/* Media Type Switcher */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                      {copy.fields.mediaType}
                    </label>
                    <select
                      value={mediaType}
                      onChange={(e) => {
                        const nextType = e.target.value as PortfolioMediaType;
                        setDraft((prev) => ({
                          ...prev,
                          portfolio: prev.portfolio.map((p, i) =>
                            i === idx ? { ...p, media_type: nextType } : p
                          ),
                        }));
                      }}
                      className="w-full px-2.5 py-1.5 bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs font-semibold text-[#1E2B58]"
                    >
                      <option value="image">{copy.fields.mediaTypeImage}</option>
                      <option value="video">{copy.fields.mediaTypeVideo}</option>
                    </select>
                  </div>

                  {isVideoItem ? (
                    <div className="space-y-3">
                      <div className="border border-[#4A69CE]/25 bg-[#F6FCF9] p-3.5 space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58]">
                          {copy.fields.videoUrl}
                        </label>
                        <input
                          type="url"
                          value={videoUrlVal}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              portfolio: prev.portfolio.map((p, i) =>
                                i === idx
                                  ? { ...p, video_url: e.target.value }
                                  : p
                              ),
                            }))
                          }
                          placeholder={copy.fields.videoUrlPlaceholder}
                          className={`w-full px-2.5 py-1.5 bg-white/95 border text-xs text-[#1E2B58] ${
                            videoValidationError
                              ? 'border-[#8A1C2B]/40'
                              : 'border-[#4A69CE]/25'
                          }`}
                        />
                        {parsedVideo ? (
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-[#1E2B58] bg-[#E5F8F0] border border-[#4A69CE]/25 px-2.5 py-1.5">
                            <span>
                              {copy.fields.videoDetected}:{' '}
                              {parsedVideo.provider.toUpperCase()} (
                              {parsedVideo.videoId})
                            </span>
                          </div>
                        ) : (
                          videoValidationError && (
                            <p className="text-[11px] font-semibold text-[#8A1C2B]">
                              {videoValidationError}
                            </p>
                          )
                        )}
                      </div>

                      <ImageSlotUploader
                        label={copy.fields.videoThumbnail}
                        imageUrl={item.thumbnail ?? ''}
                        busy={uploadingSlot === slotKey}
                        uploadLabel={copy.fields.uploadImageBtn}
                        uploadingLabel={copy.fields.uploadingImageBtn}
                        clearLabel={copy.fields.clearImageBtn}
                        urlLabel={copy.fields.imageUrlLabel}
                        defaultHint={copy.fields.videoThumbnailHint}
                        onUpload={(file) =>
                          void handleUploadImage(
                            slotKey,
                            'portfolio',
                            file,
                            (url) =>
                              setDraft((prev) => ({
                                ...prev,
                                portfolio: prev.portfolio.map((p, i) =>
                                  i === idx ? { ...p, thumbnail: url } : p
                                ),
                              }))
                          )
                        }
                        onUrlChange={(url) =>
                          setDraft((prev) => ({
                            ...prev,
                            portfolio: prev.portfolio.map((p, i) =>
                              i === idx ? { ...p, thumbnail: url } : p
                            ),
                          }))
                        }
                        onClear={() =>
                          setDraft((prev) => ({
                            ...prev,
                            portfolio: prev.portfolio.map((p, i) =>
                              i === idx ? { ...p, thumbnail: '' } : p
                            ),
                          }))
                        }
                      />

                      {!item.thumbnail?.trim() &&
                        parsedVideo?.defaultThumbnailUrl && (
                          <div className="flex items-center gap-3 border border-dashed border-[#4A69CE]/35 bg-white/90 p-2.5">
                            <img
                              src={parsedVideo.defaultThumbnailUrl}
                              alt="YouTube preview"
                              referrerPolicy="no-referrer"
                              className="w-16 h-11 object-cover border border-[#4A69CE]/25 shrink-0"
                            />
                            <span className="text-[11px] text-[#1E2B58]/80">
                              {copy.fields.videoThumbnailHint}
                            </span>
                          </div>
                        )}
                    </div>
                  ) : (
                    <ImageSlotUploader
                      label={copy.fields.itemTitle}
                      imageUrl={item.imageUrl ?? ''}
                      busy={uploadingSlot === slotKey}
                      uploadLabel={copy.fields.uploadImageBtn}
                      uploadingLabel={copy.fields.uploadingImageBtn}
                      clearLabel={copy.fields.clearImageBtn}
                      urlLabel={copy.fields.imageUrlLabel}
                      defaultHint={copy.fields.defaultIllustrationHint}
                      onUpload={(file) =>
                        void handleUploadImage(
                          slotKey,
                          'portfolio',
                          file,
                          (url) =>
                            setDraft((prev) => ({
                              ...prev,
                              portfolio: prev.portfolio.map((p, i) =>
                                i === idx ? { ...p, imageUrl: url } : p
                              ),
                            }))
                        )
                      }
                      onUrlChange={(url) =>
                        setDraft((prev) => ({
                          ...prev,
                          portfolio: prev.portfolio.map((p, i) =>
                            i === idx ? { ...p, imageUrl: url } : p
                          ),
                        }))
                      }
                      onClear={() =>
                        setDraft((prev) => ({
                          ...prev,
                          portfolio: prev.portfolio.map((p, i) =>
                            i === idx ? { ...p, imageUrl: '' } : p
                          ),
                        }))
                      }
                    />
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.itemTitle} ({editLang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={item.title[editLang]}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            portfolio: prev.portfolio.map((p, i) =>
                              i === idx
                                ? {
                                    ...p,
                                    title: updateBilingual(
                                      p.title,
                                      editLang,
                                      e.target.value
                                    ),
                                  }
                                : p
                            ),
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.categoryLabel} ({editLang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={item.categoryLabel[editLang]}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            portfolio: prev.portfolio.map((p, i) =>
                              i === idx
                                ? {
                                    ...p,
                                    categoryLabel: updateBilingual(
                                      p.categoryLabel,
                                      editLang,
                                      e.target.value
                                    ),
                                  }
                                : p
                            ),
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.category}
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            portfolio: prev.portfolio.map((p, i) =>
                              i === idx
                                ? {
                                    ...p,
                                    category: e.target
                                      .value as PortfolioItem['category'],
                                  }
                                : p
                            ),
                          }))
                        }
                        className="w-full px-2.5 py-1.5 bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      >
                        {PORTFOLIO_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.cardVariant}
                      </label>
                      <select
                        value={item.variant}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            portfolio: prev.portfolio.map((p, i) =>
                              i === idx
                                ? {
                                    ...p,
                                    variant: e.target
                                      .value as PortfolioItem['variant'],
                                  }
                                : p
                            ),
                          }))
                        }
                        className="w-full px-2.5 py-1.5 bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      >
                        <option value="postcard">Postcard</option>
                        <option value="polaroid">Polaroid</option>
                        <option value="taped">Taped Print</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.yearLabel}
                      </label>
                      <input
                        type="text"
                        value={item.yearPlaceholder}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            portfolio: prev.portfolio.map((p, i) =>
                              i === idx
                                ? { ...p, yearPlaceholder: e.target.value }
                                : p
                            ),
                          }))
                        }
                        className="w-full px-2.5 py-1.5 bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                      {copy.fields.summary} ({editLang.toUpperCase()})
                    </label>
                    <textarea
                      rows={2}
                      value={item.summary[editLang]}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          portfolio: prev.portfolio.map((p, i) =>
                            i === idx
                              ? {
                                  ...p,
                                  summary: updateBilingual(
                                    p.summary,
                                    editLang,
                                    e.target.value
                                  ),
                                }
                              : p
                          ),
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.deliverables} ({editLang.toUpperCase()})
                      </label>
                      <textarea
                        rows={2}
                        value={item.deliverables[editLang].join('\n')}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            portfolio: prev.portfolio.map((p, i) =>
                              i === idx
                                ? {
                                    ...p,
                                    deliverables: {
                                      ...p.deliverables,
                                      [editLang]: splitLines(e.target.value),
                                    },
                                  }
                                : p
                            ),
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.dimensions}
                      </label>
                      <input
                        type="text"
                        value={item.dimensions}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            portfolio: prev.portfolio.map((p, i) =>
                              i === idx ? { ...p, dimensions: e.target.value } : p
                            ),
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. SERVICES & CONTACT */}
      {subTab === 'servicesContact' && (
        <div className="space-y-6">
          {/* Services & Order Section Headers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white/95 border border-[#4A69CE]/25 rounded-2xl p-5 shadow-pastel-sm space-y-4">
              <h3 className="font-editorial text-lg font-semibold text-[#1E2B58]">
                {copy.fields.servicesHeaderTitle} ({editLang.toUpperCase()})
              </h3>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.sectionEyebrow}
                </label>
                <input
                  type="text"
                  value={draft.servicesHeader.eyebrow[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      servicesHeader: {
                        ...prev.servicesHeader,
                        eyebrow: updateBilingual(
                          prev.servicesHeader.eyebrow,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.sectionTitle}
                </label>
                <input
                  type="text"
                  value={draft.servicesHeader.title[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      servicesHeader: {
                        ...prev.servicesHeader,
                        title: updateBilingual(
                          prev.servicesHeader.title,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.sectionSubtitle}
                </label>
                <textarea
                  rows={3}
                  value={draft.servicesHeader.subtitle[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      servicesHeader: {
                        ...prev.servicesHeader,
                        subtitle: updateBilingual(
                          prev.servicesHeader.subtitle,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
            </div>

            <div className="bg-white/95 border border-[#4A69CE]/25 rounded-2xl p-5 shadow-pastel-sm space-y-4">
              <h3 className="font-editorial text-lg font-semibold text-[#1E2B58]">
                {copy.fields.orderHeaderTitle} ({editLang.toUpperCase()})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                    {copy.fields.sectionEyebrow}
                  </label>
                  <input
                    type="text"
                    value={draft.orderHeader.eyebrow[editLang]}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        orderHeader: {
                          ...prev.orderHeader,
                          eyebrow: updateBilingual(
                            prev.orderHeader.eyebrow,
                            editLang,
                            e.target.value
                          ),
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                    {copy.fields.sectionTitle}
                  </label>
                  <input
                    type="text"
                    value={draft.orderHeader.title[editLang]}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        orderHeader: {
                          ...prev.orderHeader,
                          title: updateBilingual(
                            prev.orderHeader.title,
                            editLang,
                            e.target.value
                          ),
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.sectionSubtitle}
                </label>
                <textarea
                  rows={2}
                  value={draft.orderHeader.subtitle[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      orderHeader: {
                        ...prev.orderHeader,
                        subtitle: updateBilingual(
                          prev.orderHeader.subtitle,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                    {copy.fields.slipHeader}
                  </label>
                  <input
                    type="text"
                    value={draft.orderHeader.slipHeader[editLang]}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        orderHeader: {
                          ...prev.orderHeader,
                          slipHeader: updateBilingual(
                            prev.orderHeader.slipHeader,
                            editLang,
                            e.target.value
                          ),
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                    {copy.fields.slipNumber}
                  </label>
                  <input
                    type="text"
                    value={draft.orderHeader.slipNumber[editLang]}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        orderHeader: {
                          ...prev.orderHeader,
                          slipNumber: updateBilingual(
                            prev.orderHeader.slipNumber,
                            editLang,
                            e.target.value
                          ),
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.orderBanner}
                </label>
                <input
                  type="text"
                  value={draft.orderHeader.banner[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      orderHeader: {
                        ...prev.orderHeader,
                        banner: updateBilingual(
                          prev.orderHeader.banner,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
                <p className="mt-1 text-[11px] text-[#1E2B58]/70">
                  {copy.fields.clearPlaceholderHint}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Contact Channels & Section Header */}
            <div className="bg-white/95 border border-[#4A69CE]/25 rounded-2xl p-5 shadow-pastel-sm space-y-4">
              <h3 className="font-editorial text-lg font-semibold text-[#1E2B58]">
                {copy.fields.contactTitle} ({editLang.toUpperCase()})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                    {copy.fields.sectionEyebrow}
                  </label>
                  <input
                    type="text"
                    value={draft.contact.eyebrow[editLang]}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          eyebrow: updateBilingual(
                            prev.contact.eyebrow,
                            editLang,
                            e.target.value
                          ),
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                    {copy.fields.sectionTitle}
                  </label>
                  <input
                    type="text"
                    value={draft.contact.title[editLang]}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          title: updateBilingual(
                            prev.contact.title,
                            editLang,
                            e.target.value
                          ),
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.sectionSubtitle}
                </label>
                <textarea
                  rows={2}
                  value={draft.contact.subtitle[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        subtitle: updateBilingual(
                          prev.contact.subtitle,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.contactFormTitle}
                </label>
                <input
                  type="text"
                  value={draft.contact.formTitle[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        formTitle: updateBilingual(
                          prev.contact.formTitle,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
              <div className="pt-2 border-t border-dashed border-[#4A69CE]/20 space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                    {copy.fields.whatsappValue}
                  </label>
                  <input
                    type="text"
                    value={draft.contact.whatsappValue}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, whatsappValue: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                    {copy.fields.instagramValue}
                  </label>
                  <input
                    type="text"
                    value={draft.contact.instagramValue}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, instagramValue: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                    {copy.fields.emailValue}
                  </label>
                  <input
                    type="email"
                    value={draft.contact.emailValue}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, emailValue: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                  />
                </div>
              </div>
            </div>

            {/* Footer Texts */}
            <div className="bg-white/95 border border-[#4A69CE]/25 rounded-2xl p-5 shadow-pastel-sm space-y-4">
              <h3 className="font-editorial text-lg font-semibold text-[#1E2B58]">
                {copy.fields.footerTitle} ({editLang.toUpperCase()})
              </h3>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.footerTagline}
                </label>
                <input
                  type="text"
                  value={draft.footer.tagline[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        tagline: updateBilingual(
                          prev.footer.tagline,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.footerDisclaimer}
                </label>
                <input
                  type="text"
                  value={draft.footer.disclaimer[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        disclaimer: updateBilingual(
                          prev.footer.disclaimer,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
                <p className="mt-1 text-[11px] text-[#1E2B58]/70">
                  {copy.fields.clearPlaceholderHint}
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                  {copy.fields.footerCopyright}
                </label>
                <input
                  type="text"
                  value={draft.footer.copyright[editLang]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        copyright: updateBilingual(
                          prev.footer.copyright,
                          editLang,
                          e.target.value
                        ),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58]"
                />
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="space-y-4">
            <h3 className="font-editorial text-xl font-semibold text-[#1E2B58]">
              {copy.fields.servicesTitle}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {draft.services.map((srv, idx) => (
                <div
                  key={srv.id}
                  className="bg-white/95 border border-[#4A69CE]/25 rounded-2xl p-4 shadow-pastel-sm space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#4A69CE]">
                    <span>
                      {srv.code} · {srv.id}
                    </span>
                    <input
                      type="color"
                      aria-label={copy.fields.bgColor}
                      value={srv.bgColor}
                      onChange={(e) =>
                        updateService(idx, (s) => ({
                          ...s,
                          bgColor: e.target.value,
                        }))
                      }
                      className="w-7 h-6 border border-[#4A69CE]/25 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.serviceTitle} ({editLang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={srv.title[editLang]}
                        onChange={(e) =>
                          updateService(idx, (s) => ({
                            ...s,
                            title: updateBilingual(
                              s.title,
                              editLang,
                              e.target.value
                            ),
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.turnaround} ({editLang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={srv.turnaround[editLang]}
                        onChange={(e) =>
                          updateService(idx, (s) => ({
                            ...s,
                            turnaround: updateBilingual(
                              s.turnaround,
                              editLang,
                              e.target.value
                            ),
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                      {copy.fields.shortDesc} ({editLang.toUpperCase()})
                    </label>
                    <textarea
                      rows={2}
                      value={srv.shortDesc[editLang]}
                      onChange={(e) =>
                        updateService(idx, (s) => ({
                          ...s,
                          shortDesc: updateBilingual(
                            s.shortDesc,
                            editLang,
                            e.target.value
                          ),
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.deliverables} ({editLang.toUpperCase()})
                      </label>
                      <textarea
                        rows={3}
                        value={srv.deliverables[editLang].join('\n')}
                        onChange={(e) =>
                          updateService(idx, (s) => ({
                            ...s,
                            deliverables: {
                              ...s.deliverables,
                              [editLang]: splitLines(e.target.value),
                            },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2B58] mb-1">
                        {copy.fields.previewCaption} ({editLang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={srv.previewCaption[editLang]}
                        onChange={(e) =>
                          updateService(idx, (s) => ({
                            ...s,
                            previewCaption: updateBilingual(
                              s.previewCaption,
                              editLang,
                              e.target.value
                            ),
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-xs text-[#1E2B58]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
