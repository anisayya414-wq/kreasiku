export type Language = 'en' | 'id';

export type ServiceId =
  | 'video-editing'
  | 'poster-design'
  | 'graphic-design'
  | 'social-media-design'
  | 'custom-creative-projects'
  | 'digital-illustration';

export type PortfolioCategory =
  | 'all'
  | 'poster-design'
  | 'graphic-design'
  | 'social-media-design'
  | 'video-editing'
  | 'digital-illustration'
  | 'other-projects';

export interface BilingualText {
  en: string;
  id: string;
}

export interface ServiceItem {
  id: ServiceId;
  code: string;
  bgColor: string;
  accentColor: string;
  title: BilingualText;
  shortDesc: BilingualText;
  turnaround: BilingualText;
  deliverables: {
    en: string[];
    id: string[];
  };
  previewCaption: BilingualText;
}

export type PortfolioMediaType = 'image' | 'video';

export interface PortfolioItem {
  id: string;
  archiveNumber: string;
  category: Exclude<PortfolioCategory, 'all'>;
  variant: 'postcard' | 'polaroid' | 'taped';
  tiltDeg: number;
  bgTone: string;
  title: BilingualText;
  categoryLabel: BilingualText;
  yearPlaceholder: string;
  summary: BilingualText;
  deliverables: {
    en: string[];
    id: string[];
  };
  dimensions: string;
  artVariant:
    | 'poster-flora'
    | 'video-reel'
    | 'brand-stamp'
    | 'social-grid'
    | 'illust-botanical'
    | 'zine-spread'
    | 'poster-cinema'
    | 'sticker-sheet';
  imageUrl?: string;
  media_type?: PortfolioMediaType;
  video_url?: string;
  thumbnail?: string;
}

export interface TeamMember {
  id: string;
  stampCode: string;
  bgColor: string;
  name: BilingualText;
  role: BilingualText;
  specialty: BilingualText;
  bio: BilingualText;
  avatarVariant: 'illustrator' | 'editor' | 'designer' | 'director';
  imageUrl?: string;
}

export interface OrderFormData {
  fullName: string;
  email: string;
  whatsapp: string;
  serviceCategory: ServiceId | '';
  projectTitle: string;
  description: string;
  preferences: string;
  deadline: string;
  budget: string;
  notes: string;
  attachmentName: string;
  attachmentSize: number;
}

export type OrderFormErrors = Partial<Record<keyof OrderFormData, string>>;

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

export interface OrderInsertPayload {
  id?: string;
  customer_name: string;
  email: string;
  whatsapp: string;
  service: string;
  project_title: string;
  description: string;
  preferences: string | null;
  deadline: string;
  budget: string;
  notes: string | null;
}

export interface OrderAttachmentInsertPayload {
  order_id: string;
  bucket_id: 'order-references';
  storage_path: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  file_ext: string;
}

export interface ContactMessageInsertPayload {
  name: string;
  email: string;
  message: string;
}

export interface TestimonialItem {
  id: string;
  style: 'handwritten' | 'telegram';
  paperTone: string;
  tapeColor: string;
  tiltDeg: number;
  dispatchCode: string;
  dateLabel: string;
  quote: BilingualText;
  senderPlaceholder: BilingualText;
  projectTag: BilingualText;
}

export const ORDER_STATUSES = [
  'Pending',
  'In Review',
  'In Progress',
  'Completed',
  'Cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderAttachmentRecord {
  id: string;
  order_id: string;
  bucket_id: string;
  storage_path: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  file_ext: string;
  created_at: string;
}

export interface AdminOrderRecord {
  id: string;
  customer_name: string;
  email: string;
  whatsapp: string;
  service: string;
  project_title: string;
  description: string;
  preferences: string | null;
  deadline: string;
  budget: string;
  notes: string | null;
  status: OrderStatus;
  created_at: string;
}

export interface AdminOrderWithAttachments extends AdminOrderRecord {
  attachments: OrderAttachmentRecord[];
}

export interface AdminContactMessageRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface OrderStatusCounts {
  total: number;
  Pending: number;
  'In Review': number;
  'In Progress': number;
  Completed: number;
  Cancelled: number;
}

export interface HeroSceneConfig {
  id: string;
  thumbLabel: BilingualText;
  postcardTitle: BilingualText;
  postcardSub: BilingualText;
  letterHeading: BilingualText;
  letterBody: BilingualText;
  stickerTag: BilingualText;
}

export interface HeroAccordionConfig {
  id: string;
  bg: string;
  title: BilingualText;
  content: BilingualText;
}

export interface SiteContentConfig {
  brandName: string;
  marqueeTop: {
    en: string[];
    id: string[];
  };
  doubleMarquee: {
    topItems: {
      en: string[];
      id: string[];
    };
    bottomItems: {
      en: string[];
      id: string[];
    };
  };
  hero: {
    studioLabel: BilingualText;
    headline: BilingualText;
    tagline: BilingualText;
    overview: BilingualText;
    ctaExplore: BilingualText;
    ctaStart: BilingualText;
    sceneImages: [string, string, string];
    scenes: HeroSceneConfig[];
    accordions: HeroAccordionConfig[];
  };
  about: {
    title: BilingualText;
    subtitle: BilingualText;
    storyTitle: BilingualText;
    storyText: BilingualText;
    visionTitle: BilingualText;
    visionText: BilingualText;
    missionItems: {
      en: string[];
      id: string[];
    };
    valuesList: {
      en: string[];
      id: string[];
    };
    testimonialsEyebrow: BilingualText;
    testimonialsTitle: BilingualText;
    testimonialsNote: BilingualText;
  };
  servicesHeader: {
    eyebrow: BilingualText;
    title: BilingualText;
    subtitle: BilingualText;
  };
  portfolioHeader: {
    eyebrow: BilingualText;
    title: BilingualText;
    subtitle: BilingualText;
    notice: BilingualText;
  };
  teamHeader: {
    eyebrow: BilingualText;
    title: BilingualText;
    subtitle: BilingualText;
    notice: BilingualText;
  };
  orderHeader: {
    eyebrow: BilingualText;
    title: BilingualText;
    subtitle: BilingualText;
    slipHeader: BilingualText;
    slipNumber: BilingualText;
    banner: BilingualText;
  };
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  team: TeamMember[];
  testimonials: TestimonialItem[];
  contact: {
    eyebrow: BilingualText;
    title: BilingualText;
    subtitle: BilingualText;
    formTitle: BilingualText;
    whatsappValue: string;
    instagramValue: string;
    emailValue: string;
  };
  footer: {
    tagline: BilingualText;
    disclaimer: BilingualText;
    copyright: BilingualText;
  };
}
