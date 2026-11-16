import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { Language, SiteContentConfig } from '../../types/studio';
import { ADMIN_COPY } from '../../data/adminCopy';
import { signOutAdmin, supabase } from '../../lib/supabase';
import { isAdminUser } from '../../utils/adminLogic';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

interface AdminPortalProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  siteConfig: SiteContentConfig;
  onSiteConfigUpdated: (nextConfig: SiteContentConfig) => void;
  onBackToSite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  lang,
  onToggleLang,
  siteConfig,
  onSiteConfigUpdated,
  onBackToSite,
}) => {
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);

  const copy = ADMIN_COPY[lang];

  useEffect(() => {
    let active = true;

    if (!supabase) {
      setChecking(false);
      return;
    }

    const evaluateSession = async (nextSession: Session | null) => {
      if (!active) return;
      if (!nextSession) {
        setSession(null);
        setChecking(false);
        return;
      }

      if (!isAdminUser(nextSession.user)) {
        setRoleError(copy.login.unauthorizedRole);
        setSession(null);
        setChecking(false);
        await signOutAdmin();
        return;
      }

      setRoleError(null);
      setSession(nextSession);
      setChecking(false);
    };

    void supabase.auth.getSession().then(({ data }) => {
      void evaluateSession(data.session ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        void evaluateSession(nextSession ?? null);
      }
    );

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [copy.login.unauthorizedRole]);

  if (checking) {
    return (
      <div className="min-h-screen bg-dreamy-pastel text-[#1E2B58] flex items-center justify-center p-6">
        <div className="bg-white/95 border border-[#4A69CE]/25 rounded-2xl px-6 py-4 shadow-pastel text-sm font-semibold">
          {copy.dashboard.checkingSession}
        </div>
      </div>
    );
  }

  if (!session || !isAdminUser(session.user)) {
    return (
      <AdminLogin
        lang={lang}
        onToggleLang={onToggleLang}
        copy={copy}
        externalError={roleError}
        onBackToSite={onBackToSite}
        onSuccess={() => {
          setRoleError(null);
        }}
      />
    );
  }

  return (
    <AdminDashboard
      lang={lang}
      onToggleLang={onToggleLang}
      copy={copy}
      adminEmail={session.user.email ?? 'admin'}
      siteConfig={siteConfig}
      onSiteConfigUpdated={onSiteConfigUpdated}
      onBackToSite={onBackToSite}
      onSignedOut={() => {
        setSession(null);
      }}
    />
  );
};
