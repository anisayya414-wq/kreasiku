import { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import type { Language, ServiceId, SiteContentConfig } from './types/studio';
import { isAdminRoute } from './utils/adminLogic';
import {
  buildLocalizedStudioCopy,
  getDefaultSiteContentConfig,
} from './utils/siteConfigLogic';
import { fetchPublicSiteConfig } from './lib/supabase';
import { NavbarAndMarquee } from './components/NavbarAndMarquee';
import { HeroSection } from './components/HeroSection';
import { ScallopedAwningDivider } from './components/SvgMotifs';
import { AboutSection } from './components/AboutSection';
import { DoubleMarquee } from './components/DoubleMarquee';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { TeamSection } from './components/TeamSection';
import { OrderSection } from './components/OrderSection';
import { ContactFooter } from './components/ContactFooter';
import { AdminPortal } from './components/admin/AdminPortal';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [selectedService, setSelectedService] = useState<ServiceId | ''>('');
  const [siteConfig, setSiteConfig] = useState<SiteContentConfig>(() =>
    getDefaultSiteContentConfig()
  );
  const [adminView, setAdminView] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? isAdminRoute(window.location.pathname, window.location.hash)
      : false
  );

  useEffect(() => {
    let active = true;
    void fetchPublicSiteConfig().then((remote) => {
      if (active && remote) {
        setSiteConfig(remote);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const syncRoute = () => {
      setAdminView(isAdminRoute(window.location.pathname, window.location.hash));
    };
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  const navigateToPublic = () => {
    window.history.pushState({}, '', '/');
    setAdminView(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setAdminView(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  if (adminView) {
    return (
      <MotionConfig reducedMotion="user">
        <AdminPortal
          lang={lang}
          onToggleLang={setLang}
          siteConfig={siteConfig}
          onSiteConfigUpdated={setSiteConfig}
          onBackToSite={navigateToPublic}
        />
      </MotionConfig>
    );
  }

  const copy = buildLocalizedStudioCopy(siteConfig, lang);

  const handleCommissionService = (serviceId: ServiceId) => {
    setSelectedService(serviceId);
    const el = document.getElementById('order');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#F6FCF9] text-[#1E2B58]">
        <NavbarAndMarquee
          lang={lang}
          onToggleLang={setLang}
          copy={copy}
          brandName={siteConfig.brandName}
        />

        <main className="flex-1">
          <HeroSection
            copy={copy.hero}
            sceneImages={siteConfig.hero.sceneImages}
          />

          <ScallopedAwningDivider />

          <AboutSection
            lang={lang}
            copy={copy.about}
            testimonials={siteConfig.testimonials}
          />

          <DoubleMarquee copy={copy.doubleMarquee} />

          <ServicesSection
            lang={lang}
            copy={copy.services}
            services={siteConfig.services}
            onCommissionService={handleCommissionService}
          />

          <PortfolioSection
            lang={lang}
            copy={copy.portfolio}
            items={siteConfig.portfolio}
            onOrderSimilar={handleCommissionService}
          />

          <TeamSection
            lang={lang}
            copy={copy.team}
            members={siteConfig.team}
          />

          <OrderSection
            lang={lang}
            copy={copy.order}
            preselectedService={selectedService}
            services={siteConfig.services}
          />
        </main>

        <ContactFooter
          lang={lang}
          copy={copy.contact}
          footerCopy={copy.footer}
          navCopy={copy.nav}
          brandName={siteConfig.brandName}
          onOpenAdmin={navigateToAdmin}
        />
      </div>
    </MotionConfig>
  );
}
