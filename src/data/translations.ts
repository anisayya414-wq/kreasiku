import type {
  BilingualText,
  PortfolioCategory,
  PortfolioItem,
  ServiceItem,
  TeamMember,
  TestimonialItem,
} from '../types/studio';

export interface StudioCopy {
  marqueeTop: string[];
  nav: {
    about: string;
    services: string;
    portfolio: string;
    team: string;
    order: string;
    contact: string;
    menuLabel: string;
    closeMenu: string;
  };
  hero: {
    studioLabel: string;
    headline: string;
    tagline: string;
    overview: string;
    ctaExplore: string;
    ctaStart: string;
    collageNotes: {
      postcardLabel: string;
      letterLabel: string;
      stickerLabel: string;
      letterHeading: string;
      letterBody: string;
      stampLabel: string;
    };
    scenes: {
      id: string;
      thumbLabel: string;
      postcardTitle: string;
      postcardSub: string;
      letterHeading: string;
      letterBody: string;
      stickerTag: string;
    }[];
    accordions: {
      id: string;
      title: string;
      bg: string;
      content: string;
    }[];
  };
  about: {
    title: string;
    subtitle: string;
    storyTitle: string;
    storyText: string;
    visionTitle: string;
    visionText: string;
    missionTitle: string;
    missionItems: string[];
    valuesTitle: string;
    valuesList: string[];
    callouts: {
      postcard: string;
      letter: string;
      sticker: string;
      seal: string;
    };
    testimonials: {
      eyebrow: string;
      title: string;
      placeholderNote: string;
      prevLabel: string;
      nextLabel: string;
      telegramBadge: string;
      noteBadge: string;
      stampedLabel: string;
      selectNotePrefix: string;
    };
  };
  doubleMarquee: {
    topItems: string[];
    bottomItems: string[];
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    deliverablesLabel: string;
    turnaroundLabel: string;
    commissionBtn: string;
    expandHint: string;
  };
  portfolio: {
    eyebrow: string;
    title: string;
    subtitle: string;
    placeholderNotice: string;
    openPreview: string;
    closeModal: string;
    deliverablesTitle: string;
    dimensionsLabel: string;
    archiveTag: string;
    orderSimilarBtn: string;
    videoBadge: string;
    playVideoAria: string;
    videoUnavailable: string;
    filters: { id: PortfolioCategory; label: string }[];
  };
  team: {
    eyebrow: string;
    title: string;
    subtitle: string;
    placeholderNote: string;
  };
  order: {
    eyebrow: string;
    title: string;
    subtitle: string;
    slipHeader: string;
    slipNumber: string;
    fields: {
      fullName: { label: string; placeholder: string };
      email: { label: string; placeholder: string };
      whatsapp: { label: string; placeholder: string };
      serviceCategory: { label: string; placeholder: string };
      projectTitle: { label: string; placeholder: string };
      description: { label: string; placeholder: string };
      preferences: { label: string; placeholder: string };
      attachment: {
        label: string;
        dropPrompt: string;
        helper: string;
        remove: string;
      };
      deadline: { label: string };
      budget: { label: string; placeholder: string; options: string[] };
      notes: { label: string; placeholder: string };
    };
    submitBtn: string;
    submittingBtn: string;
    prototypeBanner: string;
    successState: {
      stamp: string;
      title: string;
      subtitle: string;
      prototypeNote: string;
      summaryLabels: {
        client: string;
        service: string;
        project: string;
        deadline: string;
        budget: string;
        attachment: string;
        none: string;
      };
      newOrderBtn: string;
    };
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    channels: {
      whatsappLabel: string;
      whatsappValue: string;
      instagramLabel: string;
      instagramValue: string;
      emailLabel: string;
      emailValue: string;
    };
    formTitle: string;
    formFields: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      subject: string;
      subjectPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      sendBtn: string;
      sendingBtn: string;
      sentBadge: string;
      sentMsg: string;
      sendAnother: string;
    };
  };
  footer: {
    tagline: string;
    prototypeDisclaimer: string;
    copyright: string;
  };
}

export const TRANSLATIONS: Record<'en' | 'id', StudioCopy> = {
  en: {
    marqueeTop: [
      'CREATIVE COMMISSIONS OPEN',
      'VIDEO EDITING & POSTER DESIGN',
      'YOUR IDEAS, OUR CREATION',
      'GRAPHIC & SOCIAL MEDIA DESIGN',
      'CUSTOM DIGITAL ILLUSTRATION',
    ],
    nav: {
      about: 'ABOUT',
      services: 'SERVICES',
      portfolio: 'PORTFOLIO',
      team: 'TEAM',
      order: 'ORDER',
      contact: 'CONTACT',
      menuLabel: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
    },
    hero: {
      studioLabel: 'Digital Creative Studio',
      headline: 'Kreasiku — Your Ideas, Our Creation',
      tagline: 'Tactile craft, thoughtful storytelling, and playful visual design.',
      overview:
        'From expressive video edits and collectible posters to cohesive social media kits and custom digital illustrations, Kreasiku turns raw concepts into memorable visual stories ready for screen and print.',
      ctaExplore: 'Explore Our Work',
      ctaStart: 'Start a Project',
      collageNotes: {
        postcardLabel: 'Postcard Art',
        letterLabel: 'Studio Manifesto',
        stickerLabel: 'Die-Cut Craft',
        letterHeading: 'Hello, Maker!',
        letterBody:
          'Every brief begins as a sketch on warm paper. We pair crisp typography, playful color palettes, and paced motion so your audience feels the care behind every pixel and frame.',
        stampLabel: 'KREASIKU STUDIO',
      },
      scenes: [
        {
          id: 'scene-manifesto',
          thumbLabel: 'Print & Manifesto',
          postcardTitle: 'Summer Bloom',
          postcardSub: 'Poster & Print Series',
          letterHeading: 'Hello, Maker!',
          letterBody:
            'Every brief begins as a sketch on warm paper. We pair crisp typography, playful color palettes, and paced motion so your audience feels the care behind every pixel and frame.',
          stickerTag: 'Handmade Visuals',
        },
        {
          id: 'scene-motion',
          thumbLabel: 'Motion & Reels',
          postcardTitle: 'Frame by Frame',
          postcardSub: 'Video Editing Studio',
          letterHeading: 'Cut & Rhythm',
          letterBody:
            'Rhythmic cuts, tactile motion graphics, and custom title cards crafted to hold attention across vertical reels, YouTube essays, and campaign teasers.',
          stickerTag: '24fps Storyteller',
        },
        {
          id: 'scene-illust',
          thumbLabel: 'Stickers & Brand',
          postcardTitle: 'Kindred Goods',
          postcardSub: 'Illustration & Brand Kit',
          letterHeading: 'Drawn With Care',
          letterBody:
            'Custom illustrated mascots, packaging stickers, and social carousel templates built with unmistakable personality so small brands feel instantly iconic.',
          stickerTag: 'Custom Vector Art',
        },
      ],
      accordions: [
        {
          id: 'how-we-work',
          title: 'How we work',
          bg: '#F3C6CF',
          content:
            'Share your raw idea via our Commission Order Slip. Within 24 hours we align on creative direction, mood references, and milestones—keeping feedback warm, transparent, and collaborative.',
        },
        {
          id: 'what-we-create',
          title: 'What we create',
          bg: '#C5D9F1',
          content:
            'Six dedicated creative disciplines: Video Editing, Poster Design, Graphic Design, Social Media Design, Custom Creative Projects, and Digital Illustration tailored to your brief.',
        },
        {
          id: 'process-timeline',
          title: 'Process & timeline',
          bg: '#D4D18C',
          content:
            '1. Brief & Moodboard -> 2. First Concept Draft (2–4 business days) -> 3. Guided Revisions -> 4. Final Master Files ready for print, social, or broadcast.',
        },
      ],
    },
    about: {
      title: 'What Kreasiku creates',
      subtitle: 'hover around and see what happens',
      storyTitle: 'Studio Story',
      storyText:
        'Kreasiku was born from the love of tactile print shops, handwritten notes, and modern digital storytelling. We bridge nostalgic warmth with sharp contemporary execution across motion, graphics, and illustration.',
      visionTitle: 'Our Vision',
      visionText:
        'To make thoughtful, character-rich visual design accessible for independent creators, growing brands, and community projects.',
      missionTitle: 'Our Mission',
      missionItems: [
        'Translate abstract ideas into clear, expressive visual assets.',
        'Deliver responsive, collaborative creative workflows without agency clutter.',
        'Craft cohesive work across video, print posters, social feeds, and custom illustration.',
      ],
      valuesTitle: 'Creative Values',
      valuesList: [
        'Human Warmth First',
        'Playful Precision',
        'Story-Led Composition',
        'Reliable Turnaround',
      ],
      callouts: {
        postcard: 'postcard with original art',
        letter: 'creative brief & story',
        sticker: 'die-cut visual craft',
        seal: 'hand-designed!',
      },
      testimonials: {
        eyebrow: 'Studio Desk Mail',
        title: 'Notes & telegrams from collaborators',
        placeholderNote:
          'Sample placeholder feedback slips illustrating the studio correspondence format.',
        prevLabel: 'Previous note',
        nextLabel: 'Next note',
        telegramBadge: 'TELEGRAM · KREASIKU DISPATCH',
        noteBadge: 'HANDWRITTEN SCRAP NOTE',
        stampedLabel: 'RECEIVED',
        selectNotePrefix: 'View note',
      },
    },
    doubleMarquee: {
      topItems: [
        'Playful Craft, Modern Visuals',
        'Hand-Designed Art & Custom Edits',
        'Your Ideas, Our Creation',
      ],
      bottomItems: [
        'Video Editing',
        'Poster Design',
        'Graphic Design',
        'Social Media Design',
        'Digital Illustration',
        'Custom Projects',
      ],
    },
    services: {
      eyebrow: 'Studio Menu',
      title: 'How we bring ideas to life',
      subtitle:
        'Select any service folder below to inspect deliverables, typical timelines, and a tactile studio preview.',
      deliverablesLabel: 'Included Deliverables',
      turnaroundLabel: 'Typical Turnaround',
      commissionBtn: 'Commission This Service',
      expandHint: 'Click to open folder',
    },
    portfolio: {
      eyebrow: 'Selected Archive',
      title: 'Postcards from the studio desk',
      subtitle:
        'An editorial collection of placeholder archive studies demonstrating composition, rhythm, and tactile styling across all disciplines.',
      placeholderNotice:
        'Archive items below are clearly labeled studio concept placeholders—no fabricated client claims.',
      openPreview: 'Open Archive Note',
      closeModal: 'Close preview',
      deliverablesTitle: 'Archive Scope',
      dimensionsLabel: 'Format',
      archiveTag: 'Studio Archive',
      orderSimilarBtn: 'Request Similar Style',
      videoBadge: 'Video',
      playVideoAria: 'Play video',
      videoUnavailable: 'Video link is not configured yet.',
      filters: [
        { id: 'all', label: 'All' },
        { id: 'poster-design', label: 'Poster Design' },
        { id: 'graphic-design', label: 'Graphic Design' },
        { id: 'social-media-design', label: 'Social Media Design' },
        { id: 'video-editing', label: 'Video Editing' },
        { id: 'digital-illustration', label: 'Digital Illustration' },
        { id: 'other-projects', label: 'Other Projects' },
      ],
    },
    team: {
      eyebrow: 'Studio Postage',
      title: 'The hands behind the desk',
      subtitle:
        'Meet the creative studio roles collaborating on your briefs. Easily customizable team stamp cards.',
      placeholderNote:
        'Team cards use editable placeholder profiles ready to update with real studio members.',
    },
    order: {
      eyebrow: 'Print-Shop Dispatch',
      title: 'Commission Order Slip',
      subtitle:
        'Fill out your project ticket below. Attach moodboards or rough sketches so our team can review your brief right away.',
      slipHeader: 'KREASIKU CREATIVE COMMISSION SLIP',
      slipNumber: 'FORM NO. KR-2026',
      fields: {
        fullName: {
          label: 'Full Name *',
          placeholder: 'e.g. Nadia Pratama',
        },
        email: {
          label: 'Email Address *',
          placeholder: 'you@example.com',
        },
        whatsapp: {
          label: 'WhatsApp Number *',
          placeholder: '+62 812-0000-0000',
        },
        serviceCategory: {
          label: 'Service Category *',
          placeholder: 'Select a creative service...',
        },
        projectTitle: {
          label: 'Project Title *',
          placeholder: 'e.g. Indie Music Night Poster Series',
        },
        description: {
          label: 'Detailed Project Description *',
          placeholder:
            'Tell us the story, target audience, key text/assets to include, and where the final design will be used...',
        },
        preferences: {
          label: 'Design Preferences (Mood, Colors, References)',
          placeholder:
            'e.g. Warm pastel stationery vibe, bold serif headlines, retro grain...',
        },
        attachment: {
          label: 'Reference File Upload (Optional)',
          dropPrompt: 'Click to upload or drag & drop reference file',
          helper: 'PDF, PNG, JPG, SVG, ZIP, FIG, AI, or PSD up to 10 MB',
          remove: 'Remove file',
        },
        deadline: {
          label: 'Target Deadline *',
        },
        budget: {
          label: 'Estimated Budget *',
          placeholder: 'Select budget range...',
          options: [
            'Starter (< IDR 500K / < $35)',
            'Standard (IDR 500K – 1.5M / $35 – $100)',
            'Studio Pack (IDR 1.5M – 4M / $100 – $260)',
            'Full Campaign (IDR 4M+ / $260+)',
            'Custom / Discuss Together',
          ],
        },
        notes: {
          label: 'Additional Notes',
          placeholder: 'Any extra links, aspect ratios, or special requests...',
        },
      },
      submitBtn: 'Stamp & Submit Commission',
      submittingBtn: 'Stamping Order Slip...',
      prototypeBanner:
        'Live Studio Queue: Commission details and uploaded reference files are securely saved to our private studio archive in Supabase.',
      successState: {
        stamp: 'RECEIVED · SAVED',
        title: 'Commission Slip Submitted!',
        subtitle:
          'Thank you for sending your brief. Your commission details have been saved to our studio database.',
        prototypeNote:
          'Any attached reference file is safely stored in our private studio vault and accessible only to our authorized studio team.',
        summaryLabels: {
          client: 'Client',
          service: 'Service',
          project: 'Project Title',
          deadline: 'Deadline',
          budget: 'Estimated Budget',
          attachment: 'Reference File',
          none: 'No file attached',
        },
        newOrderBtn: 'Submit Another Commission',
      },
    },
    contact: {
      eyebrow: 'Mail & Channels',
      title: 'Send a quick studio postcard',
      subtitle:
        'Have a quick question before filling the full commission slip? Reach us via stamp channels or send a direct postcard note.',
      channels: {
        whatsappLabel: 'WhatsApp Studio',
        whatsappValue: '+62 812-0000-0000 (Placeholder)',
        instagramLabel: 'Instagram',
        instagramValue: '@kreasiku.studio (Placeholder)',
        emailLabel: 'Studio Email',
        emailValue: 'hello@kreasiku.example',
      },
      formTitle: 'Quick Contact Postcard',
      formFields: {
        name: 'Your Name *',
        namePlaceholder: 'Your name',
        email: 'Email *',
        emailPlaceholder: 'you@example.com',
        subject: 'Subject *',
        subjectPlaceholder: 'Question about poster & video bundle',
        message: 'Postcard Note *',
        messagePlaceholder: 'Write a short hello or question...',
        sendBtn: 'Send Postcard',
        sendingBtn: 'Sending...',
        sentBadge: 'POSTCARD SENT',
        sentMsg:
          'Thank you! Your message has been saved to our studio inbox and our team will reply soon.',
        sendAnother: 'Write Another Postcard',
      },
    },
    footer: {
      tagline: 'Your Ideas, Our Creation — Indie Digital Creative Studio.',
      prototypeDisclaimer:
        'Studio portfolio archives, team stamps, and contact channels currently display placeholder details.',
      copyright: '© 2026 Kreasiku Creative Studio. All rights reserved.',
    },
  },
  id: {
    marqueeTop: [
      'KOMISI KREATIF DIBUKA',
      'EDITING VIDEO & DESAIN POSTER',
      'IDE ANDA, KREASI KAMI',
      'DESAIN GRAFIS & MEDIA SOSIAL',
      'ILUSTRASI DIGITAL KUSTOM',
    ],
    nav: {
      about: 'TENTANG',
      services: 'LAYANAN',
      portfolio: 'PORTOFOLIO',
      team: 'TIM',
      order: 'PESAN',
      contact: 'KONTAK',
      menuLabel: 'Buka menu navigasi',
      closeMenu: 'Tutup menu navigasi',
    },
    hero: {
      studioLabel: 'Studio Kreatif Digital',
      headline: 'Kreasiku — Ide Anda, Kreasi Kami',
      tagline: 'Sentuhan taktil, cerita visual yang hangat, dan desain penuh karakter.',
      overview:
        'Mulai dari editing video yang ekspresif, poster cetak yang berkarakter, hingga kit media sosial dan ilustrasi digital kustom—Kreasiku mengubah ide mentah Anda menjadi karya visual yang berkesan.',
      ctaExplore: 'Lihat Karya Kami',
      ctaStart: 'Mulai Proyek',
      collageNotes: {
        postcardLabel: 'Kartu Pos Karya',
        letterLabel: 'Manifesto Studio',
        stickerLabel: 'Stiker Die-Cut',
        letterHeading: 'Halo, Kreator!',
        letterBody:
          'Setiap proyek dimulai dari sketsa di atas kertas hangat. Kami memadukan tipografi tegas, palet warna lembut, dan ritme gerak agar pesan Anda terasa hidup di setiap layar.',
        stampLabel: 'STUDIO KREASIKU',
      },
      scenes: [
        {
          id: 'scene-manifesto',
          thumbLabel: 'Cetak & Manifesto',
          postcardTitle: 'Mekar Musim Panas',
          postcardSub: 'Seri Poster & Cetak',
          letterHeading: 'Halo, Kreator!',
          letterBody:
            'Setiap proyek dimulai dari sketsa di atas kertas hangat. Kami memadukan tipografi tegas, palet warna lembut, dan ritme gerak agar pesan Anda terasa hidup di setiap layar.',
          stickerTag: 'Karya Buatan Tangan',
        },
        {
          id: 'scene-motion',
          thumbLabel: 'Gerak & Video',
          postcardTitle: 'Bingkai demi Bingkai',
          postcardSub: 'Studio Editing Video',
          letterHeading: 'Potongan & Ritme',
          letterBody:
            'Potongan ritmis, motion graphics taktil, dan kartu judul khusus untuk menjaga perhatian audiens di reels vertikal, video YouTube, hingga teaser kampanye.',
          stickerTag: 'Cerita 24fps',
        },
        {
          id: 'scene-illust',
          thumbLabel: 'Stiker & Merek',
          postcardTitle: 'Koleksi Hangat',
          postcardSub: 'Ilustrasi & Kit Merek',
          letterHeading: 'Digambar Teliti',
          letterBody:
            'Maskot ilustrasi kustom, stiker kemasan, dan template carousel media sosial dengan karakter kuat sehingga merek kecil terasa langsung ikonik.',
          stickerTag: 'Ilustrasi Vektor',
        },
      ],
      accordions: [
        {
          id: 'how-we-work',
          title: 'Cara kami bekerja',
          bg: '#F3C6CF',
          content:
            'Kirimkan ide awal Anda lewat Formulir Pemesanan Komisi. Dalam 24 jam kami menyelaraskan arah visual, referensi mood, dan lini masa secara kolaboratif dan transparan.',
        },
        {
          id: 'what-we-create',
          title: 'Apa yang kami buat',
          bg: '#C5D9F1',
          content:
            'Enam disiplin kreatif utama: Editing Video, Desain Poster, Desain Grafis, Desain Media Sosial, Proyek Kreatif Kustom, dan Ilustrasi Digital sesuai kebutuhan Anda.',
        },
        {
          id: 'process-timeline',
          title: 'Proses & estimasi waktu',
          bg: '#D4D18C',
          content:
            '1. Brief & Moodboard -> 2. Draf Konsep Pertama (2–4 hari kerja) -> 3. Revisi Terarah -> 4. File Master Final siap cetak, unggah media sosial, atau tayang.',
        },
      ],
    },
    about: {
      title: 'Yang Kreasiku ciptakan',
      subtitle: 'arahkan kursor dan lihat kejutannya',
      storyTitle: 'Kisah Studio',
      storyText:
        'Kreasiku lahir dari kecintaan pada studio cetak klasik, catatan tulisan tangan, dan penceritaan digital modern. Kami menjembatani kehangatan nostalgia dengan eksekusi visual masa kini.',
      visionTitle: 'Visi Kami',
      visionText:
        'Menjadikan desain visual yang berkarakter dan penuh perhatian mudah diakses oleh kreator independen, merek berkembang, dan proyek komunitas.',
      missionTitle: 'Misi Kami',
      missionItems: [
        'Menerjemahkan ide abstrak menjadi aset visual yang jelas dan ekspresif.',
        'Menghadirkan alur kerja kreatif yang responsif tanpa birokrasi rumit.',
        'Merancang karya selaras lintas video, poster cetak, media sosial, dan ilustrasi.',
      ],
      valuesTitle: 'Nilai Kreatif',
      valuesList: [
        'Kehangatan Manusiawi',
        'Presisi Penuh Keceriaan',
        'Komposisi Berbasis Cerita',
        'Waktu Pengerjaan Andal',
      ],
      callouts: {
        postcard: 'kartu pos karya asli',
        letter: 'surat cerita & brief',
        sticker: 'stiker potong kreatif',
        seal: 'dirancang tangan!',
      },
      testimonials: {
        eyebrow: 'Surat Meja Studio',
        title: 'Catatan & telegram dari kolaborator',
        placeholderNote:
          'Contoh catatan umpan balik placeholder yang menampilkan format korespondensi studio.',
        prevLabel: 'Catatan sebelumnya',
        nextLabel: 'Catatan berikutnya',
        telegramBadge: 'TELEGRAM · PENGIRIMAN KREASIKU',
        noteBadge: 'CATATAN TULISAN TANGAN',
        stampedLabel: 'DITERIMA',
        selectNotePrefix: 'Lihat catatan',
      },
    },
    doubleMarquee: {
      topItems: [
        'Sentuhan Klasik, Visual Modern',
        'Desain Tangan & Editing Kustom',
        'Ide Anda, Kreasi Kami',
      ],
      bottomItems: [
        'Editing Video',
        'Desain Poster',
        'Desain Grafis',
        'Desain Media Sosial',
        'Ilustrasi Digital',
        'Proyek Kustom',
      ],
    },
    services: {
      eyebrow: 'Menu Studio',
      title: 'Cara kami mewujudkan ide Anda',
      subtitle:
        'Klik salah satu folder layanan di bawah untuk melihat cakupan output, estimasi pengerjaan, dan pratinjau visual.',
      deliverablesLabel: 'Output yang Didapat',
      turnaroundLabel: 'Estimasi Pengerjaan',
      commissionBtn: 'Pesan Layanan Ini',
      expandHint: 'Klik untuk buka folder',
    },
    portfolio: {
      eyebrow: 'Arsip Terpilih',
      title: 'Kartu pos dari meja studio',
      subtitle:
        'Koleksi studi arsip placeholder untuk menampilkan komposisi, ritme visual, dan gaya taktil di setiap layanan kami.',
      placeholderNotice:
        'Seluruh karya di bawah ini adalah studi arsip placeholder berlabel jelas tanpa klaim klien fiktif.',
      openPreview: 'Buka Catatan Arsip',
      closeModal: 'Tutup pratinjau',
      deliverablesTitle: 'Cakupan Arsip',
      dimensionsLabel: 'Format',
      archiveTag: 'Arsip Studio',
      orderSimilarBtn: 'Pesan Gaya Serupa',
      videoBadge: 'Video',
      playVideoAria: 'Putar video',
      videoUnavailable: 'Tautan video belum diatur.',
      filters: [
        { id: 'all', label: 'Semua' },
        { id: 'poster-design', label: 'Desain Poster' },
        { id: 'graphic-design', label: 'Desain Grafis' },
        { id: 'social-media-design', label: 'Desain Media Sosial' },
        { id: 'video-editing', label: 'Editing Video' },
        { id: 'digital-illustration', label: 'Ilustrasi Digital' },
        { id: 'other-projects', label: 'Proyek Lainnya' },
      ],
    },
    team: {
      eyebrow: 'Perangko Studio',
      title: 'Tangan kreatif di balik meja',
      subtitle:
        'Kenali peran kreatif di balik setiap brief Anda. Kartu profil perangko ini mudah disesuaikan.',
      placeholderNote:
        'Kartu tim menggunakan profil placeholder yang siap diganti dengan data anggota asli.',
    },
    order: {
      eyebrow: 'Formulir Studio Cetak',
      title: 'Slip Pemesanan Komisi',
      subtitle:
        'Lengkapi detail proyek Anda di bawah ini. Lampirkan referensi atau sketsa agar tim kami dapat langsung meninjaunya.',
      slipHeader: 'SLIP KOMISI KREATIF KREASIKU',
      slipNumber: 'NO. FORM KR-2026',
      fields: {
        fullName: {
          label: 'Nama Lengkap *',
          placeholder: 'cth. Nadia Pratama',
        },
        email: {
          label: 'Alamat Email *',
          placeholder: 'anda@contoh.com',
        },
        whatsapp: {
          label: 'Nomor WhatsApp *',
          placeholder: '+62 812-0000-0000',
        },
        serviceCategory: {
          label: 'Kategori Layanan *',
          placeholder: 'Pilih kategori layanan kreatif...',
        },
        projectTitle: {
          label: 'Judul Proyek *',
          placeholder: 'cth. Seri Poster Acara Musik Indie',
        },
        description: {
          label: 'Deskripsi Detail Proyek *',
          placeholder:
            'Ceritakan konsep, target audiens, teks/aset utama yang wajib ada, serta platform penggunaannya...',
        },
        preferences: {
          label: 'Preferensi Desain (Mood, Warna, Referensi)',
          placeholder:
            'cth. Nuansa pastel kertas hangat, judul serif tegas, tekstur retro...',
        },
        attachment: {
          label: 'Unggah File Referensi (Opsional)',
          dropPrompt: 'Klik untuk unggah atau seret file referensi ke sini',
          helper: 'Format PDF, PNG, JPG, SVG, ZIP, FIG, AI, atau PSD maks 10 MB',
          remove: 'Hapus file',
        },
        deadline: {
          label: 'Target Tenggat Waktu *',
        },
        budget: {
          label: 'Estimasi Anggaran *',
          placeholder: 'Pilih kisaran anggaran...',
          options: [
            'Pemula (< Rp 500rb)',
            'Standar (Rp 500rb – Rp 1,5jt)',
            'Paket Studio (Rp 1,5jt – Rp 4jt)',
            'Kampanye Penuh (Rp 4jt+)',
            'Kustom / Diskusi Bersama',
          ],
        },
        notes: {
          label: 'Catatan Tambahan',
          placeholder: 'Tautan tambahan, rasio ukuran, atau permintaan khusus...',
        },
      },
      submitBtn: 'Cap & Kirim Komisi',
      submittingBtn: 'Mengirim Slip Pesanan...',
      prototypeBanner:
        'Antrean Studio Langsung: Detail komisi dan file referensi Anda disimpan dengan aman ke arsip privat studio di Supabase.',
      successState: {
        stamp: 'DITERIMA · TERSIMPAN',
        title: 'Slip Komisi Terkirim!',
        subtitle:
          'Terima kasih telah mengirimkan brief Anda. Detail komisi telah berhasil disimpan ke database studio kami.',
        prototypeNote:
          'File referensi yang Anda unggah disimpan secara privat dan hanya dapat diakses oleh tim admin studio kami.',
        summaryLabels: {
          client: 'Klien',
          service: 'Layanan',
          project: 'Judul Proyek',
          deadline: 'Tenggat Waktu',
          budget: 'Estimasi Anggaran',
          attachment: 'File Referensi',
          none: 'Tidak ada file dilampirkan',
        },
        newOrderBtn: 'Buat Pesanan Baru',
      },
    },
    contact: {
      eyebrow: 'Pos & Kanal',
      title: 'Kirim kartu pos singkat ke studio',
      subtitle:
        'Ada pertanyaan sebelum mengisi slip komisi lengkap? Hubungi kami lewat kanal perangko atau kirim catatan kartu pos langsung.',
      channels: {
        whatsappLabel: 'WhatsApp Studio',
        whatsappValue: '+62 812-0000-0000 (Placeholder)',
        instagramLabel: 'Instagram',
        instagramValue: '@kreasiku.studio (Placeholder)',
        emailLabel: 'Email Studio',
        emailValue: 'hello@kreasiku.example',
      },
      formTitle: 'Kartu Pos Kontak Cepat',
      formFields: {
        name: 'Nama Anda *',
        namePlaceholder: 'Nama lengkap',
        email: 'Email *',
        emailPlaceholder: 'anda@contoh.com',
        subject: 'Subjek *',
        subjectPlaceholder: 'Pertanyaan paket poster & video',
        message: 'Catatan Kartu Pos *',
        messagePlaceholder: 'Tulis sapaan atau pertanyaan singkat Anda...',
        sendBtn: 'Kirim Kartu Pos',
        sendingBtn: 'Mengirim...',
        sentBadge: 'KARTU POS TERKIRIM',
        sentMsg:
          'Terima kasih! Pesan Anda telah berhasil disimpan ke kotak masuk studio kami dan tim akan segera membalas.',
        sendAnother: 'Tulis Kartu Pos Lain',
      },
    },
    footer: {
      tagline: 'Ide Anda, Kreasi Kami — Studio Kreatif Digital Independen.',
      prototypeDisclaimer:
        'Arsip portofolio, perangko tim, dan kanal kontak studio saat ini menampilkan data placeholder.',
      copyright: '© 2026 Studio Kreatif Kreasiku. Hak cipta dilindungi.',
    },
  },
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'video-editing',
    code: 'SRV-01',
    bgColor: '#F3C6CF',
    accentColor: '#4A1F2D',
    title: {
      en: 'Video Editing',
      id: 'Editing Video',
    },
    shortDesc: {
      en: 'Rhythmic cuts, tactile captions, color grading, and narrative pacing for reels, YouTube, and brand stories.',
      id: 'Potongan ritmis, takarir dinamis, color grading, dan alur cerita untuk reels, YouTube, dan profil merek.',
    },
    turnaround: {
      en: '3–5 business days',
      id: '3–5 hari kerja',
    },
    deliverables: {
      en: [
        'Vertical Reels / TikTok & 16:9 YouTube master cuts',
        'Custom motion title cards & kinetic subtitles',
        'Sound design balancing & warm color grading',
        'Up to 2 structured revision rounds',
      ],
      id: [
        'Master video vertikal Reels / TikTok & 16:9 YouTube',
        'Kartu judul motion kustom & subtitel dinamis',
        'Penyeimbangan audio & color grading hangat',
        'Hingga 2 putaran revisi terstruktur',
      ],
    },
    previewCaption: {
      en: '24fps Timeline & Title Cards',
      id: 'Lini Masa 24fps & Kartu Judul',
    },
  },
  {
    id: 'poster-design',
    code: 'SRV-02',
    bgColor: '#C5D9F1',
    accentColor: '#3B2322',
    title: {
      en: 'Poster Design',
      id: 'Desain Poster',
    },
    shortDesc: {
      en: 'Collectible event posters, editorial broadsheets, music gig prints, and high-resolution campaign key visuals.',
      id: 'Poster acara koleksi, selebaran editorial, poster konser musik, dan key visual kampanye resolusi tinggi.',
    },
    turnaround: {
      en: '2–4 business days',
      id: '2–4 hari kerja',
    },
    deliverables: {
      en: [
        'Print-ready CMYK PDF (A3 / A2 / custom size) with bleed',
        'Web & story-ready RGB teaser adaptations',
        'Custom display typography & tactile grain finish',
        'Layered source file option included',
      ],
      id: [
        'PDF CMYK siap cetak (A3 / A2 / kustom) dengan bleed',
        'Adaptasi RGB untuk unggahan web & Instagram Story',
        'Tipografi display kustom & sentuhan tekstur kertas',
        'Opsi file sumber berlapis (layered source)',
      ],
    },
    previewCaption: {
      en: 'A3 Print-Shop Press Ready',
      id: 'Siap Cetak Press A3',
    },
  },
  {
    id: 'graphic-design',
    code: 'SRV-03',
    bgColor: '#D4D18C',
    accentColor: '#3B2322',
    title: {
      en: 'Graphic Design',
      id: 'Desain Grafis',
    },
    shortDesc: {
      en: 'Cohesive visual identities, zines, packaging stickers, event kits, and brand collateral with unmistakable charm.',
      id: 'Identitas visual selaras, zine editorial, stiker kemasan, kit acara, dan kolateral merek yang memikat.',
    },
    turnaround: {
      en: '4–7 business days',
      id: '4–7 hari kerja',
    },
    deliverables: {
      en: [
        'Logo marks, stamps & mini visual guideline sheet',
        'Print collateral (postcards, menus, tags, packaging)',
        'Color palette & typographic pairing specification',
        'Vector SVG, EPS, and high-res PNG exports',
      ],
      id: [
        'Logo, stempel merek & panduan visual ringkas',
        'Kolateral cetak (kartu pos, menu, label, kemasan)',
        'Spesifikasi palet warna & paduan tipografi',
        'Ekspor vektor SVG, EPS, dan PNG resolusi tinggi',
      ],
    },
    previewCaption: {
      en: 'Brand Stamps & Tactile Print',
      id: 'Stempel Merek & Cetak Taktil',
    },
  },
  {
    id: 'social-media-design',
    code: 'SRV-04',
    bgColor: '#F9E8A2',
    accentColor: '#3B2322',
    title: {
      en: 'Social Media Design',
      id: 'Desain Media Sosial',
    },
    shortDesc: {
      en: 'Scroll-stopping carousel decks, story templates, launch grids, and cohesive feed art direction.',
      id: 'Carousel edukasi menarik, template story, tata letak peluncuran, dan arahan visual feed yang rapi.',
    },
    turnaround: {
      en: '2–4 business days',
      id: '2–4 hari kerja',
    },
    deliverables: {
      en: [
        'Multi-slide Instagram/LinkedIn carousel sets (4:5)',
        'Editable Figma / Canva-ready template system',
        'Coordinated Stories & highlight cover stamps',
        'Consistent typography & grid rhythm guide',
      ],
      id: [
        'Paket carousel Instagram/LinkedIn multi-slide (4:5)',
        'Sistem template siap edit di Figma / Canva',
        'Story terkoordinasi & ikon highlight stempel',
        'Panduan ritme grid & tipografi konsisten',
      ],
    },
    previewCaption: {
      en: 'Cohesive Carousel & Grid Kit',
      id: 'Kit Carousel & Grid Selaras',
    },
  },
  {
    id: 'custom-creative-projects',
    code: 'SRV-05',
    bgColor: '#F2B89B',
    accentColor: '#3B2322',
    title: {
      en: 'Custom Creative Projects',
      id: 'Proyek Kreatif Kustom',
    },
    shortDesc: {
      en: 'Bespoke multi-discipline bundles—combining merch graphics, animated teasers, event stationery, and digital zines.',
      id: 'Paket lintas disiplin khusus—menggabungkan grafis merchandise, teaser animasi, alat tulis acara, dan zine digital.',
    },
    turnaround: {
      en: '5–10 business days',
      id: '5–10 hari kerja',
    },
    deliverables: {
      en: [
        'Tailored creative scope built around your launch',
        'Mixed print + motion deliverables in one unified look',
        'Dedicated creative check-in & asset handoff pack',
        'Flexible licensing for personal or commercial runs',
      ],
      id: [
        'Cakupan kreatif khusus sesuai peluncuran Anda',
        'Gabungan aset cetak + motion dalam satu gaya utuh',
        'Sesi diskusi khusus & paket serah terima lengkap',
        'Lisensi fleksibel untuk keperluan personal maupun komersial',
      ],
    },
    previewCaption: {
      en: 'Tailored Multi-Format Bundles',
      id: 'Paket Kustom Multi-Format',
    },
  },
  {
    id: 'digital-illustration',
    code: 'SRV-06',
    bgColor: '#E2D9EE',
    accentColor: '#3B2322',
    title: {
      en: 'Digital Illustration',
      id: 'Ilustrasi Digital',
    },
    shortDesc: {
      en: 'Playful character mascots, botanical spot art, editorial illustrations, and die-cut sticker packs.',
      id: 'Maskot karakter ceria, ilustrasi botani, gambar editorial, dan paket stiker die-cut siap cetak.',
    },
    turnaround: {
      en: '3–6 business days',
      id: '3–6 hari kerja',
    },
    deliverables: {
      en: [
        'Custom hand-crafted flat or textured vector art',
        'Transparent PNGs + die-cut kiss-cut sticker outlines',
        'Sketch approval stage before final ink & coloring',
        'Scalable master files for web and merchandise',
      ],
      id: [
        'Karya vektor ilustrasi tangan bergaya flat atau bertekstur',
        'PNG transparan + garis potong stiker die-cut',
        'Tahap persetujuan sketsa sebelum pewarnaan akhir',
        'File master skalabel untuk web dan merchandise',
      ],
    },
    previewCaption: {
      en: 'Mascots, Flora & Die-Cut Packs',
      id: 'Maskot, Flora & Paket Stiker',
    },
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'arch-01',
    archiveNumber: 'Archive 01',
    category: 'poster-design',
    variant: 'postcard',
    tiltDeg: -2.2,
    bgTone: '#F3C6CF',
    title: {
      en: 'Archive 01 — Botanical Exhibition Poster',
      id: 'Arsip 01 — Poster Pameran Botani',
    },
    categoryLabel: {
      en: 'Poster Design',
      id: 'Desain Poster',
    },
    yearPlaceholder: 'Placeholder Series · 2026',
    summary: {
      en: 'Placeholder poster study exploring expressive serif display type layered over flat hand-drawn flora and warm paper textures.',
      id: 'Studi poster placeholder yang mengeksplorasi tipografi serif ekspresif di atas ilustrasi flora dan tekstur kertas hangat.',
    },
    deliverables: {
      en: ['A2 Print Poster Layout', 'Typography System', 'Story Teaser Frame'],
      id: ['Tata Letak Poster A2', 'Sistem Tipografi', 'Bingkai Teaser Story'],
    },
    dimensions: 'A2 (420 × 594 mm)',
    artVariant: 'poster-flora',
  },
  {
    id: 'arch-02',
    archiveNumber: 'Archive 02',
    category: 'video-editing',
    variant: 'polaroid',
    tiltDeg: 1.8,
    bgTone: '#C5D9F1',
    title: {
      en: 'Archive 02 — Studio Reel Title Sequence',
      id: 'Arsip 02 — Sekuens Judul Reel Studio',
    },
    categoryLabel: {
      en: 'Video Editing',
      id: 'Editing Video',
    },
    yearPlaceholder: 'Placeholder Reel · 2026',
    summary: {
      en: 'Placeholder motion-editing concept pairing rhythmic 24fps cuts with analog stamp overlays and kinetic chapter titles.',
      id: 'Konsep editing gerak placeholder yang memadukan potongan 24fps ritmis dengan stempel analog dan judul bab kinetik.',
    },
    deliverables: {
      en: ['9:16 Vertical Cut', 'Motion Stamp Overlays', 'Subtitled Master'],
      id: ['Potongan Vertikal 9:16', 'Overlay Stempel Motion', 'Master Bersubtitel'],
    },
    dimensions: '1080 × 1920 px · 45s',
    artVariant: 'video-reel',
  },
  {
    id: 'arch-03',
    archiveNumber: 'Archive 03',
    category: 'graphic-design',
    variant: 'taped',
    tiltDeg: -1.2,
    bgTone: '#D4D18C',
    title: {
      en: 'Archive 03 — Indie Stationery Brand Kit',
      id: 'Arsip 03 — Kit Merek Alat Tulis Indie',
    },
    categoryLabel: {
      en: 'Graphic Design',
      id: 'Desain Grafis',
    },
    yearPlaceholder: 'Placeholder Identity · 2026',
    summary: {
      en: 'Placeholder brand identity exploration featuring custom postal seals, envelope monograms, and espresso-ink packaging labels.',
      id: 'Eksplorasi identitas merek placeholder dengan segel pos kustom, monogram amplop, dan label kemasan tinta espresso.',
    },
    deliverables: {
      en: ['Brand Seal & Wordmark', 'Packaging Stickers', 'Color Spec Card'],
      id: ['Segel Merek & Wordmark', 'Stiker Kemasan', 'Kartu Spesifikasi Warna'],
    },
    dimensions: 'Vector Identity Suite',
    artVariant: 'brand-stamp',
  },
  {
    id: 'arch-04',
    archiveNumber: 'Archive 04',
    category: 'social-media-design',
    variant: 'postcard',
    tiltDeg: 2.1,
    bgTone: '#F9E8A2',
    title: {
      en: 'Archive 04 — Editorial Carousel Deck',
      id: 'Arsip 04 — Dek Carousel Editorial',
    },
    categoryLabel: {
      en: 'Social Media Design',
      id: 'Desain Media Sosial',
    },
    yearPlaceholder: 'Placeholder Feed · 2026',
    summary: {
      en: 'Placeholder 6-slide social carousel layout built with scrapbook cutouts, clean reading hierarchy, and pastel callout cards.',
      id: 'Tata letak carousel media sosial 6-slide placeholder dengan potongan scrapbook, hierarki baca jelas, dan kartu pastel.',
    },
    deliverables: {
      en: ['6-Slide 4:5 Deck', 'Cover Hook Template', 'Story Poll Stickers'],
      id: ['Dek 6-Slide 4:5', 'Template Sampul', 'Stiker Polling Story'],
    },
    dimensions: '1080 × 1350 px',
    artVariant: 'social-grid',
  },
  {
    id: 'arch-05',
    archiveNumber: 'Archive 05',
    category: 'digital-illustration',
    variant: 'polaroid',
    tiltDeg: -2.5,
    bgTone: '#F2B89B',
    title: {
      en: 'Archive 05 — Die-Cut Sticker Sheet',
      id: 'Arsip 05 — Lembar Stiker Die-Cut',
    },
    categoryLabel: {
      en: 'Digital Illustration',
      id: 'Ilustrasi Digital',
    },
    yearPlaceholder: 'Placeholder Art · 2026',
    summary: {
      en: 'Placeholder sticker pack illustration featuring playful retro props, florals, and crisp white kiss-cut die lines.',
      id: 'Ilustrasi paket stiker placeholder menampilkan properti retro ceria, bunga, dan garis potong putih kiss-cut yang rapi.',
    },
    deliverables: {
      en: ['8 Custom Spot Vectors', 'Kiss-Cut Print Sheet', 'Transparent PNG Pack'],
      id: ['8 Vektor Spot Kustom', 'Lembar Cetak Kiss-Cut', 'Paket PNG Transparan'],
    },
    dimensions: 'A5 Kiss-Cut Sheet',
    artVariant: 'sticker-sheet',
  },
  {
    id: 'arch-06',
    archiveNumber: 'Archive 06',
    category: 'other-projects',
    variant: 'taped',
    tiltDeg: 1.4,
    bgTone: '#E2D9EE',
    title: {
      en: 'Archive 06 — Folded Community Zine',
      id: 'Arsip 06 — Zine Lipat Komunitas',
    },
    categoryLabel: {
      en: 'Other Projects',
      id: 'Proyek Lainnya',
    },
    yearPlaceholder: 'Placeholder Bundle · 2026',
    summary: {
      en: 'Placeholder custom creative bundle combining a mini 8-page folded zine, event wristband, and illustrated thank-you postcard.',
      id: 'Paket proyek kreatif kustom placeholder berisi zine lipat 8 halaman, gelang acara, dan kartu pos ucapan terima kasih.',
    },
    deliverables: {
      en: ['8-Page Print Zine', 'Thank-You Postcard', 'Custom Ticket Stub'],
      id: ['Zine Cetak 8 Halaman', 'Kartu Pos Ucapan', 'Sobekan Tiket Kustom'],
    },
    dimensions: 'A5 Saddle-Stitched',
    artVariant: 'zine-spread',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member-01',
    stampCode: 'STAMP 01',
    bgColor: '#F3C6CF',
    name: {
      en: 'Creative Member 01',
      id: 'Anggota Kreatif 01',
    },
    role: {
      en: 'Role Placeholder · Creative Direction',
      id: 'Placeholder Peran · Arahan Kreatif',
    },
    specialty: {
      en: 'Poster & Brand Systems',
      id: 'Poster & Sistem Merek',
    },
    bio: {
      en: 'Bio Placeholder — Guides visual storytelling, editorial typography, and tactile print concepts for studio commissions.',
      id: 'Placeholder Bio — Mengarahkan cerita visual, tipografi editorial, dan konsep cetak taktil untuk setiap komisi.',
    },
    avatarVariant: 'director',
  },
  {
    id: 'member-02',
    stampCode: 'STAMP 02',
    bgColor: '#C5D9F1',
    name: {
      en: 'Creative Member 02',
      id: 'Anggota Kreatif 02',
    },
    role: {
      en: 'Role Placeholder · Video & Motion',
      id: 'Placeholder Peran · Video & Motion',
    },
    specialty: {
      en: 'Editing & Pacing',
      id: 'Editing & Ritme Visual',
    },
    bio: {
      en: 'Bio Placeholder — Crafts rhythmic edits, custom kinetic titles, and warm color passes across short- and long-form video.',
      id: 'Placeholder Bio — Merangkai potongan ritmis, judul kinetik kustom, dan pewarnaan hangat untuk video pendek maupun panjang.',
    },
    avatarVariant: 'editor',
  },
  {
    id: 'member-03',
    stampCode: 'STAMP 03',
    bgColor: '#D4D18C',
    name: {
      en: 'Creative Member 03',
      id: 'Anggota Kreatif 03',
    },
    role: {
      en: 'Role Placeholder · Graphic & Social',
      id: 'Placeholder Peran · Grafis & Sosial',
    },
    specialty: {
      en: 'Carousels & Identity',
      id: 'Carousel & Identitas',
    },
    bio: {
      en: 'Bio Placeholder — Designs structured social media kits, playful grid systems, and print-ready marketing layouts.',
      id: 'Placeholder Bio — Merancang kit media sosial terstruktur, sistem grid ceria, dan tata letak pemasaran siap cetak.',
    },
    avatarVariant: 'designer',
  },
  {
    id: 'member-04',
    stampCode: 'STAMP 04',
    bgColor: '#F9E8A2',
    name: {
      en: 'Creative Member 04',
      id: 'Anggota Kreatif 04',
    },
    role: {
      en: 'Role Placeholder · Illustration',
      id: 'Placeholder Peran · Ilustrasi',
    },
    specialty: {
      en: 'Characters & Die-Cut Art',
      id: 'Karakter & Stiker Die-Cut',
    },
    bio: {
      en: 'Bio Placeholder — Illustrates custom mascots, botanical motifs, and sticker sheets that bring warmth to digital brands.',
      id: 'Placeholder Bio — Menggambar maskot kustom, motif botani, dan lembar stiker yang memberi kehangatan bagi merek digital.',
    },
    avatarVariant: 'illustrator',
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'note-01',
    style: 'handwritten',
    paperTone: '#FAF6F0',
    tapeColor: '#F3C6CF',
    tiltDeg: -1.2,
    dispatchCode: 'NOTE 01',
    dateLabel: '14 OCT · PLACEHOLDER',
    quote: {
      en: '“Every poster draft felt like opening a carefully wrapped parcel—warm color choices, legible type, and zero clutter.”',
      id: '“Setiap draf poster terasa seperti membuka paket yang dibungkus teliti—pilihan warna hangat, tipografi jelas, dan rapi.”',
    },
    senderPlaceholder: {
      en: 'Client Placeholder 01 · Indie Maker',
      id: 'Placeholder Klien 01 · Kreator Indie',
    },
    projectTag: {
      en: 'Poster Design',
      id: 'Desain Poster',
    },
  },
  {
    id: 'note-02',
    style: 'telegram',
    paperTone: '#F4EFE6',
    tapeColor: '#C5D9F1',
    tiltDeg: 1.0,
    dispatchCode: 'WIRE KR-02',
    dateLabel: '22 NOV · PLACEHOLDER',
    quote: {
      en: 'PACING ON OUR VERTICAL REEL HIT THE MARK STOP MOTION TITLES READ CLEARLY ON FIRST FRAME STOP READY FOR LAUNCH STOP',
      id: 'RITME PADA REEL VERTIKAL KAMI SANGAT PAS TITIK JUDUL MOTION TERBACA JELAS SEJAK FRAME AWAL TITIK SIAP TAYANG TITIK',
    },
    senderPlaceholder: {
      en: 'Client Placeholder 02 · Event Host',
      id: 'Placeholder Klien 02 · Penyelenggara Acara',
    },
    projectTag: {
      en: 'Video Editing',
      id: 'Editing Video',
    },
  },
  {
    id: 'note-03',
    style: 'handwritten',
    paperTone: '#F9E8A2',
    tapeColor: '#D4D18C',
    tiltDeg: -0.9,
    dispatchCode: 'NOTE 03',
    dateLabel: '03 DEC · PLACEHOLDER',
    quote: {
      en: '“Our sticker sheet and carousel kit finally gave our tiny storefront one recognizable voice across print and Instagram.”',
      id: '“Lembar stiker dan kit carousel dari studio akhirnya memberi toko kecil kami satu karakter visual yang konsisten di cetak dan Instagram.”',
    },
    senderPlaceholder: {
      en: 'Client Placeholder 03 · Small Brand',
      id: 'Placeholder Klien 03 · Merek Lokal',
    },
    projectTag: {
      en: 'Social Media & Illustration',
      id: 'Media Sosial & Ilustrasi',
    },
  },
  {
    id: 'note-04',
    style: 'telegram',
    paperTone: '#FAF6F0',
    tapeColor: '#F2B89B',
    tiltDeg: 1.2,
    dispatchCode: 'WIRE KR-04',
    dateLabel: '19 JAN · PLACEHOLDER',
    quote: {
      en: 'BRIEFING WAS EFFORTLESS STOP SKETCH CHECK-IN KEPT REVISIONS MINIMAL STOP FINAL VECTOR PACK RECEIVED ON SCHEDULE STOP',
      id: 'PROSES BRIEF SANGAT LANCAR TITIK TINJAUAN SKETSA MEMBUAT REVISI MINIMAL TITIK PAKET VEKTOR FINAL DITERIMA TEPAT WAKTU TITIK',
    },
    senderPlaceholder: {
      en: 'Client Placeholder 04 · Community Zine',
      id: 'Placeholder Klien 04 · Zine Komunitas',
    },
    projectTag: {
      en: 'Custom Creative Project',
      id: 'Proyek Kreatif Kustom',
    },
  },
];

export function getBilingual(text: BilingualText, lang: 'en' | 'id'): string {
  return text[lang];
}
