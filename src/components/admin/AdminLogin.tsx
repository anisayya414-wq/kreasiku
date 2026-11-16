import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import type { Language } from '../../types/studio';
import type { AdminCopy } from '../../data/adminCopy';
import { isSupabaseConfigured, signInAdmin } from '../../lib/supabase';
import { FlowingPastelRibbons, Starburst } from '../SvgMotifs';

interface AdminLoginProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  copy: AdminCopy;
  externalError?: string | null;
  onBackToSite: () => void;
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  lang,
  onToggleLang,
  copy,
  externalError,
  onBackToSite,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured = isSupabaseConfigured();
  const displayError = error || externalError || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) {
      setError(copy.login.notConfigured);
      return;
    }
    if (!email.trim() || !password) {
      setError(copy.login.missingCredentials);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const result = await signInAdmin(email, password, lang);
      if (result.ok) {
        onSuccess();
      } else {
        setError(result.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-dreamy-pastel text-[#1E2B58] flex flex-col overflow-hidden">
      <FlowingPastelRibbons className="absolute inset-x-0 bottom-0 w-full h-72 opacity-55" />

      {/* Top Bar */}
      <header className="relative z-10 w-full bg-[#F6FCF9]/90 backdrop-blur-md border-b border-[#4A69CE]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToSite}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#1E2B58] hover:text-[#4A69CE] transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{copy.backToSite}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 font-editorial text-xl sm:text-2xl font-bold text-[#1E2B58] whitespace-nowrap shrink-0">
            <Starburst className="w-3.5 h-3.5" color="#4A69CE" points={4} />
            <span>Kreasiku</span>
          </span>

          <div
            role="group"
            aria-label="Language switcher"
            className="inline-flex items-center border border-[#4A69CE]/25 rounded-xl bg-white/90 p-0.5 shadow-pastel-sm shrink-0"
          >
            <button
              type="button"
              onClick={() => onToggleLang('id')}
              aria-pressed={lang === 'id'}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider cursor-pointer min-h-[28px] transition-colors ${
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
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider cursor-pointer min-h-[28px] transition-colors ${
                lang === 'en'
                  ? 'bg-[#4A69CE] text-white'
                  : 'text-[#1E2B58] hover:bg-[#81CFFF]/25'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white/95 border border-[#4A69CE]/25 rounded-3xl shadow-pastel overflow-hidden">
          <div
            className="border-b border-[#4A69CE]/20 px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3"
            style={{
              background:
                'linear-gradient(90deg, #E5F8F0 0%, #D7F0FF 55%, #E9DFFD 100%)',
            }}
          >
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.13em] text-[#1E2B58]">
              <Lock className="w-3.5 h-3.5 shrink-0 text-[#4A69CE]" />
              <span>{copy.login.eyebrow}</span>
            </span>
            <span className="text-[11px] font-bold tracking-wider text-[#4A69CE] whitespace-nowrap shrink-0">
              {copy.brandSub}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1E2B58] [text-wrap:balance]">
                {copy.login.title}
              </h1>
              <p className="mt-2 text-sm text-[#1E2B58]/80 leading-relaxed">
                {copy.login.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1.5"
                >
                  {copy.login.emailLabel}
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={copy.login.emailPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] placeholder:text-[#1E2B58]/45 focus:outline-2 focus:outline-[#4A69CE]"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1.5"
                >
                  {copy.login.passwordLabel}
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder={copy.login.passwordPlaceholder}
                    className="w-full pl-3.5 pr-11 py-2.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] placeholder:text-[#1E2B58]/45 focus:outline-2 focus:outline-[#4A69CE]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword
                        ? copy.login.hidePassword
                        : copy.login.showPassword
                    }
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[#4A69CE]/80 hover:text-[#4A69CE] cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {displayError && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FADCE8] border border-[#8A1C2B]/40 text-xs font-semibold text-[#8A1C2B]"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{displayError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-5 rounded-xl bg-[#4A69CE] hover:bg-[#334FA8] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-[0.14em] cursor-pointer shadow-pastel-sm transition-colors min-h-[44px]"
              >
                {submitting ? copy.login.submittingBtn : copy.login.submitBtn}
              </button>
            </form>

            <p className="pt-4 border-t border-[#4A69CE]/20 text-xs text-[#1E2B58]/75 leading-relaxed">
              {copy.login.provisionNotice}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
