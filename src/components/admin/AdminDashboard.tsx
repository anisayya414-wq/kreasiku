import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Inbox,
  LogOut,
  Mail,
  MessageCircle,
  Palette,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import {
  ORDER_STATUSES,
  type AdminContactMessageRecord,
  type AdminOrderWithAttachments,
  type Language,
  type OrderStatus,
  type SiteContentConfig,
} from '../../types/studio';
import type { AdminCopy } from '../../data/adminCopy';
import { SERVICES_DATA, getBilingual } from '../../data/translations';
import {
  createAttachmentSignedUrl,
  fetchAdminDashboardData,
  signOutAdmin,
  updateOrderStatusAsAdmin,
} from '../../lib/supabase';
import {
  computeOrderStatusCounts,
  filterAdminOrders,
  filterContactMessages,
  formatAdminDate,
  formatWhatsAppHref,
  isPreviewableImageExt,
} from '../../utils/adminLogic';
import { formatFileSize } from '../../utils/studioLogic';
import { Starburst } from '../SvgMotifs';
import { AdminSiteEditor } from './AdminSiteEditor';

interface AdminDashboardProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  copy: AdminCopy;
  adminEmail: string;
  siteConfig: SiteContentConfig;
  onSiteConfigUpdated: (nextConfig: SiteContentConfig) => void;
  onBackToSite: () => void;
  onSignedOut: () => void;
}

type DashboardTab = 'orders' | 'messages' | 'site';

const STATUS_SURFACE: Record<OrderStatus, string> = {
  Pending: 'bg-[#ECFFBE] text-[#1E2B58] border-[#4A69CE]/25',
  'In Review': 'bg-[#D7F0FF] text-[#1E2B58] border-[#4A69CE]/25',
  'In Progress': 'bg-[#E9DFFD] text-[#1E2B58] border-[#4A69CE]/25',
  Completed: 'bg-[#E5F8F0] text-[#1E2B58] border-[#4A69CE]/25',
  Cancelled: 'bg-[#FADCE8] text-[#8A1C2B] border-[#8A1C2B]/30',
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  onToggleLang,
  copy,
  adminEmail,
  siteConfig,
  onSiteConfigUpdated,
  onBackToSite,
  onSignedOut,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('orders');
  const [orders, setOrders] = useState<AdminOrderWithAttachments[]>([]);
  const [messages, setMessages] = useState<AdminContactMessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [messageSearch, setMessageSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [draftStatus, setDraftStatus] = useState<OrderStatus>('Pending');
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [busyAttachmentId, setBusyAttachmentId] = useState<string | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<{
    filename: string;
    url: string;
  } | null>(null);

  const loadData = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setLoadError(null);

      const res = await fetchAdminDashboardData(lang);
      if (res.ok) {
        setOrders(res.data.orders);
        setMessages(res.data.messages);
        setSelectedOrderId((prev) => {
          if (prev && res.data.orders.some((o) => o.id === prev)) {
            return prev;
          }
          return res.data.orders[0]?.id ?? null;
        });
      } else {
        setLoadError(res.error);
      }

      setLoading(false);
      setRefreshing(false);
    },
    [lang]
  );

  useEffect(() => {
    void loadData(false);
  }, [loadData]);

  const counts = useMemo(() => computeOrderStatusCounts(orders), [orders]);

  const filteredOrders = useMemo(
    () => filterAdminOrders(orders, statusFilter, orderSearch),
    [orders, statusFilter, orderSearch]
  );

  const filteredMessages = useMemo(
    () => filterContactMessages(messages, messageSearch),
    [messages, messageSearch]
  );

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  useEffect(() => {
    if (selectedOrder) {
      setDraftStatus(selectedOrder.status);
      setStatusFeedback(null);
      setAttachmentError(null);
    }
  }, [selectedOrder?.id, selectedOrder?.status]);

  const getServiceLabel = (serviceId: string) => {
    const match =
      siteConfig.services.find((s) => s.id === serviceId) ??
      SERVICES_DATA.find((s) => s.id === serviceId);
    return match ? getBilingual(match.title, lang) : serviceId;
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) {
      return;
    }
    setSavingStatus(true);
    setStatusFeedback(null);

    const res = await updateOrderStatusAsAdmin(
      selectedOrder.id,
      draftStatus,
      lang
    );
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: res.data.status } : o
        )
      );
      setStatusFeedback({
        type: 'success',
        text: copy.dashboard.ordersView.detail.statusSavedMsg,
      });
    } else {
      setStatusFeedback({
        type: 'error',
        text: res.error,
      });
    }
    setSavingStatus(false);
  };

  const handleAttachmentAction = async (
    attId: string,
    storagePath: string,
    filename: string,
    mode: 'preview' | 'download'
  ) => {
    setBusyAttachmentId(attId);
    setAttachmentError(null);
    try {
      const res = await createAttachmentSignedUrl(storagePath, lang, 120);
      if (!res.ok) {
        setAttachmentError(res.error);
        return;
      }

      if (mode === 'preview') {
        setPreviewModal({ filename, url: res.data });
      } else {
        const link = document.createElement('a');
        link.href = res.data;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } finally {
      setBusyAttachmentId(null);
    }
  };

  const handleSignOut = async () => {
    await signOutAdmin();
    onSignedOut();
  };

  return (
    <div className="min-h-screen bg-dreamy-pastel text-[#1E2B58] flex flex-col">
      {/* Top Studio Desk Header */}
      <header className="sticky top-0 z-30 bg-[#F6FCF9]/90 backdrop-blur-md border-b border-[#4A69CE]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#1E2B58] hover:text-[#4A69CE] transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{copy.backToSite}</span>
            </button>
            <span aria-hidden="true" className="text-[#4A69CE]/35 hidden sm:inline">
              /
            </span>
            <span className="inline-flex items-center gap-1.5 font-editorial text-xl font-bold text-[#1E2B58] whitespace-nowrap shrink-0">
              <Starburst className="w-3.5 h-3.5" color="#4A69CE" points={4} />
              <span>{siteConfig.brandName || 'Kreasiku'}</span>
            </span>
            <span className="hidden md:inline text-xs font-bold uppercase tracking-[0.14em] text-[#4A69CE] whitespace-nowrap shrink-0">
              {copy.brandSub}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="hidden lg:inline text-xs text-[#1E2B58]/75 truncate max-w-[200px]">
              {copy.dashboard.signedInAs}: <strong className="text-[#1E2B58]">{adminEmail}</strong>
            </span>

            <button
              type="button"
              onClick={() => void loadData(true)}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#D7F0FF] hover:bg-[#81CFFF]/60 disabled:opacity-60 border border-[#4A69CE]/25 text-xs font-bold uppercase tracking-wider text-[#1E2B58] cursor-pointer shadow-pastel-sm whitespace-nowrap shrink-0 min-h-[38px]"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}
              />
              <span className="hidden sm:inline">
                {refreshing
                  ? copy.dashboard.refreshingBtn
                  : copy.dashboard.refreshBtn}
              </span>
            </button>

            <div
              role="group"
              aria-label="Language switcher"
              className="inline-flex items-center border border-[#4A69CE]/25 rounded-xl bg-white/90 p-0.5 shadow-pastel-sm shrink-0"
            >
              <button
                type="button"
                onClick={() => onToggleLang('id')}
                aria-pressed={lang === 'id'}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold uppercase cursor-pointer min-h-[28px] ${
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
                className={`px-2 py-1 rounded-lg text-[11px] font-bold uppercase cursor-pointer min-h-[28px] ${
                  lang === 'en'
                    ? 'bg-[#4A69CE] text-white'
                    : 'text-[#1E2B58] hover:bg-[#81CFFF]/25'
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#FADCE8] border border-[#4A69CE]/25 text-xs font-bold uppercase tracking-wider text-[#1E2B58] cursor-pointer shadow-pastel-sm whitespace-nowrap shrink-0 min-h-[38px]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copy.dashboard.signOutBtn}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Heading + Main Section Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#4A69CE]/20 pb-5">
          <div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1E2B58] [text-wrap:balance]">
              {copy.dashboard.title}
            </h1>
            <p className="mt-1 text-sm text-[#1E2B58]/80 max-w-2xl">
              {copy.dashboard.subtitle}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Admin sections"
            className="inline-flex flex-wrap border border-[#4A69CE]/25 rounded-2xl bg-white/90 p-1 shadow-pastel-sm self-start md:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap min-h-[38px] transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#4A69CE] text-white'
                  : 'text-[#1E2B58] hover:bg-[#E5F8F0]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{copy.dashboard.tabs.orders}</span>
              <span className="tabular-nums opacity-85">({counts.total})</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'messages'}
              onClick={() => setActiveTab('messages')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap min-h-[38px] transition-colors ${
                activeTab === 'messages'
                  ? 'bg-[#4A69CE] text-white'
                  : 'text-[#1E2B58] hover:bg-[#D7F0FF]'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>{copy.dashboard.tabs.messages}</span>
              <span className="tabular-nums opacity-85">({messages.length})</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'site'}
              onClick={() => setActiveTab('site')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap min-h-[38px] transition-colors ${
                activeTab === 'site'
                  ? 'bg-[#4A69CE] text-white'
                  : 'text-[#1E2B58] hover:bg-[#ECFFBE]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{copy.dashboard.tabs.site}</span>
            </button>
          </div>
        </div>

        {loadError && activeTab !== 'site' && (
          <div
            role="alert"
            className="flex items-start gap-2.5 p-4 rounded-2xl bg-[#FADCE8] border border-[#8A1C2B]/40 text-sm font-semibold text-[#8A1C2B]"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{loadError}</span>
          </div>
        )}

        {/* KPI Summary Strip */}
        {activeTab !== 'site' && (
          <section
            aria-label={copy.dashboard.kpis.totalOrders}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab('orders');
                setStatusFilter('ALL');
              }}
              className={`text-left p-4 rounded-2xl border transition-colors cursor-pointer ${
                statusFilter === 'ALL' && activeTab === 'orders'
                  ? 'bg-[#4A69CE] text-white border-[#4A69CE] shadow-pastel-sm'
                  : 'bg-white/90 text-[#1E2B58] border-[#4A69CE]/20 hover:bg-[#E5F8F0]'
              }`}
            >
              <span className="block text-[11px] font-bold uppercase tracking-[0.12em] opacity-80">
                {copy.dashboard.kpis.totalOrders}
              </span>
              <span className="mt-1 block font-editorial text-2xl font-bold tabular-nums">
                {counts.total}
              </span>
            </button>

            {ORDER_STATUSES.map((st) => {
              const isActive = statusFilter === st && activeTab === 'orders';
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setActiveTab('orders');
                    setStatusFilter(st);
                  }}
                  className={`text-left p-4 rounded-2xl border transition-colors cursor-pointer ${
                    isActive
                      ? `${STATUS_SURFACE[st]} shadow-pastel-sm ring-2 ring-[#4A69CE]/35`
                      : 'bg-white/90 text-[#1E2B58] border-[#4A69CE]/20 hover:bg-[#F6FCF9]'
                  }`}
                >
                  <span className="block text-[11px] font-bold uppercase tracking-[0.12em] opacity-80">
                    {copy.statuses[st]}
                  </span>
                  <span className="mt-1 block font-editorial text-2xl font-bold tabular-nums">
                    {counts[st]}
                  </span>
                </button>
              );
            })}
          </section>
        )}

        {activeTab === 'orders' ? (
          <section className="space-y-4">
            {/* Search + Filter Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#4A69CE] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder={copy.dashboard.ordersView.searchPlaceholder}
                  aria-label={copy.dashboard.ordersView.searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/95 border border-[#4A69CE]/25 text-sm text-[#1E2B58] placeholder:text-[#1E2B58]/50 focus:outline-2 focus:outline-[#4A69CE]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap min-h-[36px] ${
                    statusFilter === 'ALL'
                      ? 'bg-[#4A69CE] text-white border-[#4A69CE]'
                      : 'bg-white text-[#1E2B58] border-[#4A69CE]/20 hover:bg-[#E5F8F0]'
                  }`}
                >
                  {copy.dashboard.kpis.allFilter} ({counts.total})
                </button>
                {ORDER_STATUSES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap min-h-[36px] ${
                      statusFilter === st
                        ? STATUS_SURFACE[st]
                        : 'bg-white text-[#1E2B58] border-[#4A69CE]/20 hover:bg-[#E5F8F0]'
                    }`}
                  >
                    {copy.statuses[st]} ({counts[st]})
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="p-8 rounded-2xl bg-white/90 border border-[#4A69CE]/20 text-sm text-[#1E2B58]/80">
                {copy.dashboard.ordersView.loading}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Orders List */}
                <div className="lg:col-span-7 rounded-2xl bg-white/95 border border-[#4A69CE]/20 overflow-hidden shadow-pastel-sm">
                  {filteredOrders.length === 0 ? (
                    <div className="p-8 text-center space-y-2">
                      <p className="font-editorial text-xl font-semibold text-[#1E2B58]">
                        {copy.dashboard.ordersView.emptyTitle}
                      </p>
                      <p className="text-sm text-[#1E2B58]/75 max-w-md mx-auto">
                        {copy.dashboard.ordersView.emptyDesc}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#4A69CE]/15">
                      {filteredOrders.map((order) => {
                        const isSelected = order.id === selectedOrder?.id;
                        return (
                          <button
                            key={order.id}
                            type="button"
                            onClick={() => setSelectedOrderId(order.id)}
                            className={`w-full text-left p-4 sm:px-5 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-[#E5F8F0]'
                                : 'bg-white hover:bg-[#F6FCF9]'
                            }`}
                          >
                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-[#1E2B58]/75">
                                <span className="font-semibold text-[#4A69CE]">
                                  {getServiceLabel(order.service)}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="tabular-nums">
                                  {formatAdminDate(order.created_at, lang)}
                                </span>
                                {order.attachments.length > 0 && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="tabular-nums font-semibold text-[#1E2B58]">
                                      {order.attachments.length}{' '}
                                      {copy.dashboard.ordersView.tableHeaders.files}
                                    </span>
                                  </>
                                )}
                              </div>
                              <p className="font-editorial text-base sm:text-lg font-semibold text-[#1E2B58] truncate">
                                {order.project_title}
                              </p>
                              <p className="text-xs text-[#1E2B58]/80 truncate">
                                {order.customer_name} · {order.email} ·{' '}
                                <span className="tabular-nums">{order.deadline}</span>
                              </p>
                            </div>

                            <span
                              className={`self-start sm:self-center shrink-0 px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${STATUS_SURFACE[order.status]}`}
                            >
                              {copy.statuses[order.status]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Order Detail Panel */}
                <aside className="lg:col-span-5 rounded-3xl bg-white/95 border border-[#4A69CE]/25 shadow-pastel overflow-hidden">
                  {!selectedOrder ? (
                    <div className="p-8 text-center space-y-2">
                      <p className="font-editorial text-xl font-semibold text-[#1E2B58]">
                        {copy.dashboard.ordersView.selectPromptTitle}
                      </p>
                      <p className="text-sm text-[#1E2B58]/75">
                        {copy.dashboard.ordersView.selectPromptDesc}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div
                        className="border-b border-[#4A69CE]/20 px-5 py-3.5 flex items-center justify-between gap-2"
                        style={{
                          background:
                            'linear-gradient(90deg, #E5F8F0 0%, #D7F0FF 55%, #E9DFFD 100%)',
                        }}
                      >
                        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#1E2B58]">
                          {copy.dashboard.ordersView.detail.title}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${STATUS_SURFACE[selectedOrder.status]}`}
                        >
                          {copy.statuses[selectedOrder.status]}
                        </span>
                      </div>

                      <div className="p-5 space-y-5">
                        <div>
                          <h2 className="font-editorial text-xl font-semibold text-[#1E2B58] [text-wrap:balance]">
                            {selectedOrder.project_title}
                          </h2>
                          <p className="mt-1 text-xs text-[#1E2B58]/75 tabular-nums">
                            {copy.dashboard.ordersView.detail.createdLabel}:{' '}
                            {formatAdminDate(selectedOrder.created_at, lang)} ·{' '}
                            <span className="font-mono">{selectedOrder.id.slice(0, 8)}</span>
                          </p>
                        </div>

                        {/* Customer Info */}
                        <div className="pt-4 border-t border-[#4A69CE]/15 space-y-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A69CE]">
                            {copy.dashboard.ordersView.detail.customerSection}
                          </h3>
                          <p className="text-sm font-semibold text-[#1E2B58]">
                            {selectedOrder.customer_name}
                          </p>
                          <p className="text-xs text-[#1E2B58]/85">
                            {selectedOrder.email} ·{' '}
                            <span className="tabular-nums">{selectedOrder.whatsapp}</span>
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <a
                              href={formatWhatsAppHref(selectedOrder.whatsapp)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ECFFBE] hover:bg-[#ddf5a6] border border-[#4A69CE]/20 text-xs font-bold text-[#1E2B58] whitespace-nowrap"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              {copy.dashboard.ordersView.detail.whatsappAction}
                            </a>
                            <a
                              href={`mailto:${selectedOrder.email}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D7F0FF] hover:bg-[#81CFFF]/60 border border-[#4A69CE]/20 text-xs font-bold text-[#1E2B58] whitespace-nowrap"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              {copy.dashboard.ordersView.detail.emailAction}
                            </a>
                          </div>
                        </div>

                        {/* Project Brief */}
                        <div className="pt-4 border-t border-[#4A69CE]/15 space-y-3">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A69CE]">
                            {copy.dashboard.ordersView.detail.briefSection}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="block font-bold uppercase tracking-wider text-[#1E2B58]/70">
                                {copy.dashboard.ordersView.detail.serviceLabel}
                              </span>
                              <span className="font-semibold text-[#1E2B58]">
                                {getServiceLabel(selectedOrder.service)}
                              </span>
                            </div>
                            <div>
                              <span className="block font-bold uppercase tracking-wider text-[#1E2B58]/70">
                                {copy.dashboard.ordersView.detail.deadlineLabel}
                              </span>
                              <span className="font-semibold text-[#1E2B58] tabular-nums">
                                {selectedOrder.deadline}
                              </span>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="block font-bold uppercase tracking-wider text-[#1E2B58]/70">
                                {copy.dashboard.ordersView.detail.budgetLabel}
                              </span>
                              <span className="font-semibold text-[#1E2B58]">
                                {selectedOrder.budget}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-[#1E2B58] leading-relaxed whitespace-pre-wrap rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/20 p-3">
                            {selectedOrder.description}
                          </p>

                          <div className="space-y-1.5 text-xs">
                            <p>
                              <strong className="uppercase tracking-wider text-[#1E2B58]/75">
                                {copy.dashboard.ordersView.detail.preferencesLabel}:{' '}
                              </strong>
                              <span className="text-[#1E2B58]">
                                {selectedOrder.preferences ||
                                  copy.dashboard.ordersView.detail.noneText}
                              </span>
                            </p>
                            <p>
                              <strong className="uppercase tracking-wider text-[#1E2B58]/75">
                                {copy.dashboard.ordersView.detail.notesLabel}:{' '}
                              </strong>
                              <span className="text-[#1E2B58]">
                                {selectedOrder.notes ||
                                  copy.dashboard.ordersView.detail.noneText}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Status Management */}
                        <div className="pt-4 border-t border-[#4A69CE]/15 space-y-2.5">
                          <label
                            htmlFor="admin-order-status"
                            className="block text-xs font-bold uppercase tracking-wider text-[#4A69CE]"
                          >
                            {copy.dashboard.ordersView.detail.statusSection}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <select
                              id="admin-order-status"
                              value={draftStatus}
                              onChange={(e) => {
                                setDraftStatus(e.target.value as OrderStatus);
                                setStatusFeedback(null);
                              }}
                              className="flex-1 px-3 py-2 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm font-medium text-[#1E2B58] focus:outline-2 focus:outline-[#4A69CE]"
                            >
                              {ORDER_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {copy.statuses[st]}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => void handleSaveStatus()}
                              disabled={
                                savingStatus || draftStatus === selectedOrder.status
                              }
                              className="px-4 py-2 rounded-xl bg-[#4A69CE] hover:bg-[#334FA8] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap min-h-[40px]"
                            >
                              {savingStatus
                                ? copy.dashboard.ordersView.detail.savingStatusBtn
                                : copy.dashboard.ordersView.detail.saveStatusBtn}
                            </button>
                          </div>

                          {statusFeedback && (
                            <div
                              role="status"
                              className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold ${
                                statusFeedback.type === 'success'
                                  ? 'bg-[#E5F8F0] border-[#4A69CE]/25 text-[#1E2B58]'
                                  : 'bg-[#FADCE8] border-[#8A1C2B]/40 text-[#8A1C2B]'
                              }`}
                            >
                              {statusFeedback.type === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#4A69CE]" />
                              ) : (
                                <AlertCircle className="w-4 h-4 shrink-0" />
                              )}
                              <span>{statusFeedback.text}</span>
                            </div>
                          )}
                        </div>

                        {/* Private Reference Files */}
                        <div className="pt-4 border-t border-[#4A69CE]/15 space-y-2.5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A69CE]">
                            {copy.dashboard.ordersView.detail.attachmentsSection}
                          </h3>

                          {selectedOrder.attachments.length === 0 ? (
                            <p className="text-xs text-[#1E2B58]/70">
                              {copy.dashboard.ordersView.detail.noAttachments}
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {selectedOrder.attachments.map((att) => {
                                const isBusy = busyAttachmentId === att.id;
                                const canPreview = isPreviewableImageExt(att.file_ext);
                                return (
                                  <div
                                    key={att.id}
                                    className="p-3 rounded-2xl bg-[#F6FCF9] border border-[#4A69CE]/20 space-y-2"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[#1E2B58] break-all">
                                          {att.original_filename}
                                        </p>
                                        <p className="text-xs text-[#1E2B58]/75 tabular-nums">
                                          {att.file_ext.toUpperCase()} ·{' '}
                                          {formatFileSize(att.file_size)}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                      {canPreview && (
                                        <button
                                          type="button"
                                          disabled={isBusy}
                                          onClick={() =>
                                            void handleAttachmentAction(
                                              att.id,
                                              att.storage_path,
                                              att.original_filename,
                                              'preview'
                                            )
                                          }
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D7F0FF] hover:bg-[#81CFFF]/60 disabled:opacity-60 border border-[#4A69CE]/20 text-xs font-bold text-[#1E2B58] cursor-pointer"
                                        >
                                          <ImageIcon className="w-3.5 h-3.5" />
                                          {isBusy
                                            ? copy.dashboard.ordersView.detail
                                                .generatingLink
                                            : copy.dashboard.ordersView.detail
                                                .previewBtn}
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        disabled={isBusy}
                                        onClick={() =>
                                          void handleAttachmentAction(
                                            att.id,
                                            att.storage_path,
                                            att.original_filename,
                                            'download'
                                          )
                                        }
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ECFFBE] hover:bg-[#ddf5a6] disabled:opacity-60 border border-[#4A69CE]/20 text-xs font-bold text-[#1E2B58] cursor-pointer"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        {isBusy
                                          ? copy.dashboard.ordersView.detail
                                              .generatingLink
                                          : copy.dashboard.ordersView.detail
                                              .openSignedBtn}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                              <p className="text-[11px] text-[#1E2B58]/70">
                                {copy.dashboard.ordersView.detail.signedUrlHint}
                              </p>
                            </div>
                          )}

                          {attachmentError && (
                            <div
                              role="alert"
                              className="flex items-start gap-2 p-2.5 rounded-xl bg-[#FADCE8] border border-[#8A1C2B]/40 text-xs font-semibold text-[#8A1C2B]"
                            >
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>{attachmentError}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </aside>
              </div>
            )}
          </section>
        ) : activeTab === 'messages' ? (
          /* Contact Messages View */
          <section className="space-y-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-[#4A69CE] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                placeholder={copy.dashboard.messagesView.searchPlaceholder}
                aria-label={copy.dashboard.messagesView.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/95 border border-[#4A69CE]/25 text-sm text-[#1E2B58] placeholder:text-[#1E2B58]/50 focus:outline-2 focus:outline-[#4A69CE]"
              />
            </div>

            {loading ? (
              <div className="p-8 rounded-2xl bg-white/90 border border-[#4A69CE]/20 text-sm text-[#1E2B58]/80">
                {copy.dashboard.messagesView.loading}
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white/90 border border-[#4A69CE]/20 text-center space-y-2">
                <p className="font-editorial text-xl font-semibold text-[#1E2B58]">
                  {copy.dashboard.messagesView.emptyTitle}
                </p>
                <p className="text-sm text-[#1E2B58]/75 max-w-md mx-auto">
                  {copy.dashboard.messagesView.emptyDesc}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredMessages.map((msg) => (
                  <article
                    key={msg.id}
                    className="rounded-3xl bg-white/95 border border-[#4A69CE]/20 p-5 shadow-pastel-sm flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#1E2B58]/75">
                        <span className="font-semibold text-[#4A69CE]">
                          {msg.email}
                        </span>
                        <span className="tabular-nums">
                          {copy.dashboard.messagesView.receivedAt}:{' '}
                          {formatAdminDate(msg.created_at, lang)}
                        </span>
                      </div>
                      <h3 className="font-editorial text-lg font-semibold text-[#1E2B58]">
                        {msg.name}
                      </h3>
                      <p className="text-sm text-[#1E2B58] leading-relaxed whitespace-pre-wrap rounded-2xl bg-[#F6FCF9] border border-[#4A69CE]/15 p-3">
                        {msg.message}
                      </p>
                    </div>

                    <div>
                      <a
                        href={`mailto:${msg.email}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D7F0FF] hover:bg-[#81CFFF]/60 border border-[#4A69CE]/20 text-xs font-bold uppercase tracking-wider text-[#1E2B58]"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{copy.dashboard.messagesView.replyBtn}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : (
          <AdminSiteEditor
            lang={lang}
            copy={copy.dashboard.siteEditor}
            initialConfig={siteConfig}
            onConfigPublished={onSiteConfigUpdated}
          />
        )}
      </main>

      {/* Signed Image Preview Modal */}
      {previewModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={previewModal.filename}
          className="fixed inset-0 z-50 bg-[#1E2B58]/65 flex items-center justify-center p-4"
          onClick={() => setPreviewModal(null)}
        >
          <div
            className="w-full max-w-3xl bg-[#F6FCF9] border border-[#4A69CE]/30 rounded-3xl shadow-pastel overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#D7F0FF] border-b border-[#4A69CE]/20 px-5 py-3 flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#1E2B58] truncate">
                {previewModal.filename}
              </span>
              <button
                type="button"
                onClick={() => setPreviewModal(null)}
                aria-label={copy.dashboard.ordersView.detail.closePreview}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-[#4A69CE]/25 text-xs font-bold text-[#1E2B58] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{copy.dashboard.ordersView.detail.closePreview}</span>
              </button>
            </div>
            <div className="p-4 sm:p-6 bg-white flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={previewModal.url}
                alt={previewModal.filename}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[65vh] object-contain rounded-xl border border-[#4A69CE]/20 bg-[#F6FCF9]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
