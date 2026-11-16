import React, { useEffect, useState } from 'react';
import { MessageCircle, Instagram, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import type {
  ContactFormData,
  ContactFormErrors,
  Language,
} from '../types/studio';
import type { StudioCopy } from '../data/translations';
import { hasErrors, validateContactForm } from '../utils/studioLogic';
import { submitContactToSupabase } from '../lib/supabase';
import { HeartIcon, Starburst } from './SvgMotifs';

interface ContactFooterProps {
  lang: Language;
  copy: StudioCopy['contact'];
  footerCopy: StudioCopy['footer'];
  navCopy: StudioCopy['nav'];
  brandName?: string;
  onOpenAdmin?: () => void;
}

const INITIAL_CONTACT: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export const ContactFooter: React.FC<ContactFooterProps> = ({
  lang,
  copy,
  footerCopy,
  navCopy,
  brandName,
  onOpenAdmin,
}) => {
  const [contactData, setContactData] =
    useState<ContactFormData>(INITIAL_CONTACT);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (hasErrors(errors)) {
      setErrors(validateContactForm(contactData, lang));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const handleField = <K extends keyof ContactFormData>(
    key: K,
    val: ContactFormData[K]
  ) => {
    setContactData((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateContactForm(contactData, lang);
    if (hasErrors(errs)) {
      setErrors(errs);
      setSubmitError(null);
      return;
    }

    setSubmitError(null);
    setSending(true);
    try {
      const result = await submitContactToSupabase(contactData, lang);
      if (result.ok) {
        setSent(true);
      } else {
        setSubmitError(result.error);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section
        id="contact"
        className="relative bg-dreamy-pastel py-16 sm:py-20 scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Luminous Pastel Channel Cards */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <a
                href="#order"
                className="group p-5 rounded-3xl bg-[#ECFFBE]/80 hover:bg-[#ECFFBE] border border-[#4A69CE]/20 shadow-pastel-sm transition-colors flex items-center gap-4"
              >
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-[#4A69CE]/25 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#4A69CE]" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#4A69CE]">
                    {copy.channels.whatsappLabel}
                  </span>
                  <span className="font-editorial text-lg font-semibold text-[#1E2B58]">
                    {copy.channels.whatsappValue}
                  </span>
                </div>
              </a>

              <a
                href="#portfolio"
                className="group p-5 rounded-3xl bg-[#E9DFFD]/80 hover:bg-[#E9DFFD] border border-[#4A69CE]/20 shadow-pastel-sm transition-colors flex items-center gap-4"
              >
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-[#4A69CE]/25 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-[#4A69CE]" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#4A69CE]">
                    {copy.channels.instagramLabel}
                  </span>
                  <span className="font-editorial text-lg font-semibold text-[#1E2B58]">
                    {copy.channels.instagramValue}
                  </span>
                </div>
              </a>

              <a
                href={`mailto:${copy.channels.emailValue}`}
                className="group p-5 rounded-3xl bg-[#D7F0FF]/85 hover:bg-[#81CFFF]/55 border border-[#4A69CE]/20 shadow-pastel-sm transition-colors flex items-center gap-4"
              >
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-[#4A69CE]/25 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#4A69CE]" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#4A69CE]">
                    {copy.channels.emailLabel}
                  </span>
                  <span className="font-editorial text-lg font-semibold text-[#1E2B58]">
                    {copy.channels.emailValue}
                  </span>
                </div>
              </a>
            </div>

            {/* Right: Quick Contact Card */}
            <div className="lg:col-span-7 bg-white/95 border border-[#4A69CE]/25 rounded-3xl p-5 sm:p-7 shadow-pastel relative">
              <div
                aria-hidden="true"
                className="hidden sm:flex flex-col items-center justify-center w-14 h-16 rounded-2xl border border-dashed border-[#4A69CE]/35 bg-[#E5F8F0] absolute top-5 right-5 rotate-3"
              >
                <HeartIcon className="w-5 h-5" color="#4A69CE" />
                <span className="text-[8px] font-bold tracking-widest mt-1 text-[#4A69CE]">
                  POST
                </span>
              </div>

              <h3 className="font-editorial text-xl font-semibold text-[#1E2B58] pr-16 mb-5">
                {copy.formTitle}
              </h3>

              {sent ? (
                <div className="py-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECFFBE] border border-[#4A69CE]/25 text-xs font-bold uppercase tracking-wider text-[#1E2B58]">
                    <CheckCircle2 className="w-4 h-4 text-[#4A69CE]" />
                    {copy.formFields.sentBadge}
                  </div>
                  <p className="text-sm text-[#1E2B58] leading-relaxed">
                    {copy.formFields.sentMsg}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setContactData(INITIAL_CONTACT);
                      setSubmitError(null);
                      setSent(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#D7F0FF] border border-[#4A69CE]/25 text-xs font-bold uppercase tracking-wider text-[#1E2B58] cursor-pointer"
                  >
                    {copy.formFields.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1"
                      >
                        {copy.formFields.name}
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={contactData.name}
                        onChange={(e) => handleField('name', e.target.value)}
                        placeholder={copy.formFields.namePlaceholder}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] focus:outline-2 focus:outline-[#4A69CE]"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs font-semibold text-[#8A1C2B]">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1"
                      >
                        {copy.formFields.email}
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={contactData.email}
                        onChange={(e) => handleField('email', e.target.value)}
                        placeholder={copy.formFields.emailPlaceholder}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] focus:outline-2 focus:outline-[#4A69CE]"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs font-semibold text-[#8A1C2B]">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1"
                    >
                      {copy.formFields.subject}
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={contactData.subject}
                      onChange={(e) => handleField('subject', e.target.value)}
                      placeholder={copy.formFields.subjectPlaceholder}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] focus:outline-2 focus:outline-[#4A69CE]"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs font-semibold text-[#8A1C2B]">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1"
                    >
                      {copy.formFields.message}
                    </label>
                    <textarea
                      id="contact-message"
                      rows={3}
                      value={contactData.message}
                      onChange={(e) => handleField('message', e.target.value)}
                      placeholder={copy.formFields.messagePlaceholder}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] focus:outline-2 focus:outline-[#4A69CE]"
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs font-semibold text-[#8A1C2B]">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FADCE8] border border-[#8A1C2B]/40 text-xs font-semibold text-[#8A1C2B]"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A69CE] hover:bg-[#334FA8] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-[0.12em] cursor-pointer shadow-pastel-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {sending
                        ? copy.formFields.sendingBtn
                        : copy.formFields.sendBtn}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Luminous Royal Blue Twilight Footer */}
      <footer
        className="text-white py-11 px-4 sm:px-6 lg:px-8 border-t border-[#81CFFF]/35"
        style={{
          background:
            'linear-gradient(135deg, #4A69CE 0%, #3753B4 55%, #263E91 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 font-editorial text-2xl font-bold text-white"
            >
              <Starburst className="w-3.5 h-3.5" color="#ECFFBE" points={4} />
              <span>{brandName || 'Kreasiku'}</span>
            </a>
            <p className="mt-1.5 text-xs sm:text-sm text-[#E5F8F0]/90">
              {footerCopy.tagline}
            </p>
            {footerCopy.prototypeDisclaimer.trim() && (
              <p className="mt-1 text-[11px] text-[#E5F8F0]/70">
                {footerCopy.prototypeDisclaimer}
              </p>
            )}
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-5 text-[11px] font-semibold tracking-[0.14em] uppercase"
          >
            <a href="#about" className="hover:text-[#ECFFBE] transition-colors">
              {navCopy.about}
            </a>
            <a
              href="#services"
              className="hover:text-[#ECFFBE] transition-colors"
            >
              {navCopy.services}
            </a>
            <a
              href="#portfolio"
              className="hover:text-[#ECFFBE] transition-colors"
            >
              {navCopy.portfolio}
            </a>
            <a href="#team" className="hover:text-[#ECFFBE] transition-colors">
              {navCopy.team}
            </a>
            <a href="#order" className="hover:text-[#ECFFBE] transition-colors">
              {navCopy.order}
            </a>
            <a
              href="#contact"
              className="hover:text-[#ECFFBE] transition-colors"
            >
              {navCopy.contact}
            </a>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-5 border-t border-white/20 text-[11px] text-[#E5F8F0]/80 flex flex-wrap items-center justify-between gap-2">
          <span>{footerCopy.copyright}</span>
          <div className="flex items-center gap-4">
            <a
              href="/admin"
              onClick={(e) => {
                if (onOpenAdmin) {
                  e.preventDefault();
                  onOpenAdmin();
                }
              }}
              className="hover:text-[#ECFFBE] underline-offset-4 hover:underline transition-colors"
            >
              {lang === 'id' ? 'Admin Studio' : 'Studio Admin'}
            </a>
            <span>ID / EN</span>
          </div>
        </div>
      </footer>
    </>
  );
};
