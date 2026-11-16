import React, { useEffect, useRef, useState } from 'react';
import { UploadCloud, X, CheckCircle2, AlertCircle } from 'lucide-react';
import type {
  Language,
  OrderFormData,
  OrderFormErrors,
  ServiceId,
  ServiceItem,
} from '../types/studio';
import {
  SERVICES_DATA,
  getBilingual,
  type StudioCopy,
} from '../data/translations';
import {
  formatFileSize,
  hasErrors,
  validateAttachment,
  validateOrderForm,
} from '../utils/studioLogic';
import { submitOrderToSupabase } from '../lib/supabase';
import { Starburst } from './SvgMotifs';

interface OrderSectionProps {
  lang: Language;
  copy: StudioCopy['order'];
  preselectedService: ServiceId | '';
  services?: ServiceItem[];
}

const INITIAL_FORM: OrderFormData = {
  fullName: '',
  email: '',
  whatsapp: '',
  serviceCategory: '',
  projectTitle: '',
  description: '',
  preferences: '',
  deadline: '',
  budget: '',
  notes: '',
  attachmentName: '',
  attachmentSize: 0,
};

export const OrderSection: React.FC<OrderSectionProps> = ({
  lang,
  copy,
  preselectedService,
  services,
}) => {
  const serviceList = services && services.length > 0 ? services : SERVICES_DATA;
  const [formData, setFormData] = useState<OrderFormData>(INITIAL_FORM);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedSlip, setSubmittedSlip] = useState<OrderFormData | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, serviceCategory: preselectedService }));
      setErrors((prev) => ({ ...prev, serviceCategory: undefined }));
      setSubmittedSlip(null);
    }
  }, [preselectedService]);

  useEffect(() => {
    if (hasErrors(errors)) {
      setErrors(validateOrderForm(formData, lang));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const updateField = <K extends keyof OrderFormData>(
    key: K,
    value: OrderFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleFile = (file: File | null) => {
    if (!file) {
      return;
    }
    const attachmentError = validateAttachment(file.name, file.size, lang);
    if (attachmentError) {
      setErrors((prev) => ({ ...prev, attachmentName: attachmentError }));
      return;
    }
    setErrors((prev) => ({ ...prev, attachmentName: undefined }));
    setAttachmentFile(file);
    setFormData((prev) => ({
      ...prev,
      attachmentName: file.name,
      attachmentSize: file.size,
    }));
  };

  const clearAttachment = () => {
    setAttachmentFile(null);
    setFormData((prev) => ({
      ...prev,
      attachmentName: '',
      attachmentSize: 0,
    }));
    setErrors((prev) => ({ ...prev, attachmentName: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateOrderForm(formData, lang);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      setSubmitError(null);
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const result = await submitOrderToSupabase(
        formData,
        lang,
        attachmentFile
      );
      if (result.ok) {
        setSubmittedSlip(formData);
      } else {
        setSubmitError(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setAttachmentFile(null);
    setErrors({});
    setSubmitError(null);
    setSubmittedSlip(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getServiceLabel = (id: ServiceId | '') => {
    const found = serviceList.find((s) => s.id === id);
    return found ? getBilingual(found.title, lang) : '-';
  };

  return (
    <section
      id="order"
      className="relative bg-pastel-stripes py-16 sm:py-22 border-b border-[#4A69CE]/15 scroll-mt-24"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 glass-pastel rounded-3xl px-6 py-5">
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

        {/* Frosted Commission Slip Card */}
        <div className="bg-white/95 border border-[#4A69CE]/25 rounded-3xl shadow-pastel overflow-hidden">
          {/* Pastel Gradient Slip Header Band */}
          <div
            className="border-b border-[#4A69CE]/20 px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-2"
            style={{
              background:
                'linear-gradient(90deg, #E5F8F0 0%, #D7F0FF 52%, #E9DFFD 100%)',
            }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1E2B58]">
              <Starburst className="w-3.5 h-3.5" color="#4A69CE" points={4} />
              {copy.slipHeader}
            </span>
            <span className="text-[11px] font-bold tracking-widest text-[#4A69CE] tabular-nums">
              {copy.slipNumber}
            </span>
          </div>

          {copy.prototypeBanner.trim() && (
            <div className="bg-[#ECFFBE]/65 border-b border-[#4A69CE]/15 px-5 sm:px-8 py-2.5 text-xs text-[#1E2B58]">
              {copy.prototypeBanner}
            </div>
          )}

          {submittedSlip ? (
            <div className="p-6 sm:p-10 space-y-6" data-testid="order-confirmation">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#4A69CE]/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-[#4A69CE] shrink-0" />
                  <div>
                    <h3 className="font-editorial text-2xl font-semibold text-[#1E2B58]">
                      {copy.successState.title}
                    </h3>
                    <p className="text-sm text-[#1E2B58]/80 mt-0.5">
                      {copy.successState.subtitle}
                    </p>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-[#ECFFBE] border border-[#4A69CE]/25 text-[11px] font-bold uppercase tracking-widest text-[#1E2B58] -rotate-2">
                  {copy.successState.stamp}
                </span>
              </div>

              <div className="bg-[#E5F8F0]/70 rounded-2xl border border-[#4A69CE]/20 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#4A69CE]">
                    {copy.successState.summaryLabels.client}
                  </span>
                  <span className="font-semibold text-[#1E2B58]">
                    {submittedSlip.fullName}
                  </span>
                  <span className="block text-xs text-[#1E2B58]/75">
                    {submittedSlip.email} · {submittedSlip.whatsapp}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#4A69CE]">
                    {copy.successState.summaryLabels.service}
                  </span>
                  <span className="font-semibold text-[#1E2B58]">
                    {getServiceLabel(submittedSlip.serviceCategory)}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#4A69CE]">
                    {copy.successState.summaryLabels.project}
                  </span>
                  <span className="font-semibold text-[#1E2B58]">
                    {submittedSlip.projectTitle}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#4A69CE]">
                    {copy.successState.summaryLabels.deadline}
                  </span>
                  <span className="font-semibold text-[#1E2B58] tabular-nums">
                    {submittedSlip.deadline}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#4A69CE]">
                    {copy.successState.summaryLabels.budget}
                  </span>
                  <span className="font-semibold text-[#1E2B58]">
                    {submittedSlip.budget}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#4A69CE]">
                    {copy.successState.summaryLabels.attachment}
                  </span>
                  <span className="font-semibold text-[#1E2B58]">
                    {submittedSlip.attachmentName
                      ? `${submittedSlip.attachmentName} (${formatFileSize(
                          submittedSlip.attachmentSize
                        )})`
                      : copy.successState.summaryLabels.none}
                  </span>
                </div>
              </div>

              <p className="text-xs italic text-[#1E2B58]/75">
                {copy.successState.prototypeNote}
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-[#D7F0FF] hover:bg-[#81CFFF]/60 text-[#1E2B58] border border-[#4A69CE]/25 text-xs font-bold uppercase tracking-[0.12em] cursor-pointer shadow-pastel-sm transition-colors"
              >
                {copy.successState.newOrderBtn}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-5 sm:p-8 space-y-6"
            >
              {/* Row 1: Name, Email, WhatsApp */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label
                    htmlFor="order-fullName"
                    className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1.5"
                  >
                    {copy.fields.fullName.label}
                  </label>
                  <input
                    id="order-fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder={copy.fields.fullName.placeholder}
                    aria-invalid={Boolean(errors.fullName)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] placeholder:text-[#1E2B58]/45 focus:outline-2 focus:outline-[#4A69CE]"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs font-semibold text-[#8A1C2B]">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="order-email"
                    className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1.5"
                  >
                    {copy.fields.email.label}
                  </label>
                  <input
                    id="order-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder={copy.fields.email.placeholder}
                    aria-invalid={Boolean(errors.email)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] placeholder:text-[#1E2B58]/45 focus:outline-2 focus:outline-[#4A69CE]"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs font-semibold text-[#8A1C2B]">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="order-whatsapp"
                    className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1.5"
                  >
                    {copy.fields.whatsapp.label}
                  </label>
                  <input
                    id="order-whatsapp"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => updateField('whatsapp', e.target.value)}
                    placeholder={copy.fields.whatsapp.placeholder}
                    aria-invalid={Boolean(errors.whatsapp)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] placeholder:text-[#1E2B58]/45 focus:outline-2 focus:outline-[#4A69CE]"
                  />
                  {errors.whatsapp && (
                    <p className="mt-1 text-xs font-semibold text-[#8A1C2B]">
                      {errors.whatsapp}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Service Category & Project Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="order-service"
                    className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1.5"
                  >
                    {copy.fields.serviceCategory.label}
                  </label>
                  <select
                    id="order-service"
                    value={formData.serviceCategory}
                    onChange={(e) =>
                      updateField(
                        'serviceCategory',
                        e.target.value as ServiceId | ''
                      )
                    }
                    aria-invalid={Boolean(errors.serviceCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] focus:outline-2 focus:outline-[#4A69CE]"
                  >
                    <option value="">
                      {copy.fields.serviceCategory.placeholder}
                    </option>
                    {serviceList.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {getBilingual(srv.title, lang)}
                      </option>
                    ))}
                  </select>
                  {errors.serviceCategory && (
                    <p className="mt-1 text-xs font-semibold text-[#8A1C2B]">
                      {errors.serviceCategory}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="order-projectTitle"
                    className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1.5"
                  >
                    {copy.fields.projectTitle.label}
                  </label>
                  <input
                    id="order-projectTitle"
                    type="text"
                    value={formData.projectTitle}
                    onChange={(e) => updateField('projectTitle', e.target.value)}
                    placeholder={copy.fields.projectTitle.placeholder}
                    aria-invalid={Boolean(errors.projectTitle)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] placeholder:text-[#1E2B58]/45 focus:outline-2 focus:outline-[#4A69CE]"
                  />
                  {errors.projectTitle && (
                    <p className="mt-1 text-xs font-semibold text-[#8A1C2B]">
                      {errors.projectTitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Detailed Description */}
              <div>
                <label
                  htmlFor="order-description"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1.5"
                >
                  {copy.fields.description.label}
                </label>
                <textarea
                  id="order-description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder={copy.fields.description.placeholder}
                  aria-invalid={Boolean(errors.description)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] placeholder:text-[#1E2B58]/45 focus:outline-2 focus:outline-[#4A69CE]"
                />
                {errors.description && (
                  <p className="mt-1 text-xs font-semibold text-[#8A1C2B]">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Row 4: Design Preferences */}
              <div>
                <label
                  htmlFor="order-preferences"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1.5"
                >
                  {copy.fields.preferences.label}
                </label>
                <input
                  id="order-preferences"
                  type="text"
                  value={formData.preferences}
                  onChange={(e) => updateField('preferences', e.target.value)}
                  placeholder={copy.fields.preferences.placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] placeholder:text-[#1E2B58]/45 focus:outline-2 focus:outline-[#4A69CE]"
                />
              </div>

              {/* Row 5: Reference File Upload Dropzone */}
              <div>
                <p className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1.5">
                  {copy.fields.attachment.label}
                </p>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0] ?? null;
                    handleFile(file);
                  }}
                  className={`relative rounded-2xl border border-dashed border-[#4A69CE]/45 p-5 text-center transition-colors ${
                    isDragging ? 'bg-[#D7F0FF]/70' : 'bg-[#E5F8F0]/55'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    id="order-attachment"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.svg,.zip,.fig,.ai,.psd"
                    onChange={(e) =>
                      handleFile(e.target.files?.[0] ?? null)
                    }
                    className="hidden"
                  />

                  {formData.attachmentName ? (
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <span className="text-sm font-semibold text-[#1E2B58]">
                        {formData.attachmentName} (
                        {formatFileSize(formData.attachmentSize)})
                      </span>
                      <button
                        type="button"
                        onClick={clearAttachment}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FADCE8] border border-[#4A69CE]/25 text-xs font-semibold text-[#1E2B58] cursor-pointer hover:bg-[#BCA4F5]/45"
                      >
                        <X className="w-3.5 h-3.5" />
                        {copy.fields.attachment.remove}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center gap-1.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4A69CE] rounded-xl py-1"
                    >
                      <UploadCloud className="w-6 h-6 text-[#4A69CE]" />
                      <span className="text-sm font-semibold text-[#1E2B58]">
                        {copy.fields.attachment.dropPrompt}
                      </span>
                      <span className="text-xs text-[#1E2B58]/70">
                        {copy.fields.attachment.helper}
                      </span>
                    </button>
                  )}
                </div>
                {errors.attachmentName && (
                  <p className="mt-1 text-xs font-semibold text-[#8A1C2B]">
                    {errors.attachmentName}
                  </p>
                )}
              </div>

              {/* Row 6: Deadline & Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="order-deadline"
                    className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1.5"
                  >
                    {copy.fields.deadline.label}
                  </label>
                  <input
                    id="order-deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => updateField('deadline', e.target.value)}
                    aria-invalid={Boolean(errors.deadline)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] focus:outline-2 focus:outline-[#4A69CE]"
                  />
                  {errors.deadline && (
                    <p className="mt-1 text-xs font-semibold text-[#8A1C2B]">
                      {errors.deadline}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="order-budget"
                    className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1.5"
                  >
                    {copy.fields.budget.label}
                  </label>
                  <select
                    id="order-budget"
                    value={formData.budget}
                    onChange={(e) => updateField('budget', e.target.value)}
                    aria-invalid={Boolean(errors.budget)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] focus:outline-2 focus:outline-[#4A69CE]"
                  >
                    <option value="">{copy.fields.budget.placeholder}</option>
                    {copy.fields.budget.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.budget && (
                    <p className="mt-1 text-xs font-semibold text-[#8A1C2B]">
                      {errors.budget}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 7: Additional Notes */}
              <div>
                <label
                  htmlFor="order-notes"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1E2B58] mb-1.5"
                >
                  {copy.fields.notes.label}
                </label>
                <textarea
                  id="order-notes"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder={copy.fields.notes.placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6FCF9] border border-[#4A69CE]/25 text-sm text-[#1E2B58] placeholder:text-[#1E2B58]/45 focus:outline-2 focus:outline-[#4A69CE]"
                />
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FADCE8] border border-[#8A1C2B]/40 text-xs font-semibold text-[#8A1C2B]"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#4A69CE] hover:bg-[#334FA8] disabled:opacity-60 text-white text-xs sm:text-sm font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer shadow-pastel"
                >
                  {isSubmitting ? copy.submittingBtn : copy.submitBtn}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
