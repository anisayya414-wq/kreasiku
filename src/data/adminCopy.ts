import type { Language, OrderStatus } from '../types/studio';

export interface AdminCopy {
  brandSub: string;
  backToSite: string;
  login: {
    eyebrow: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    showPassword: string;
    hidePassword: string;
    submitBtn: string;
    submittingBtn: string;
    provisionNotice: string;
    missingCredentials: string;
    notConfigured: string;
    unauthorizedRole: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    signedInAs: string;
    refreshBtn: string;
    refreshingBtn: string;
    signOutBtn: string;
    tabs: {
      orders: string;
      messages: string;
      site: string;
    };
    kpis: {
      totalOrders: string;
      allFilter: string;
    };
    ordersView: {
      searchPlaceholder: string;
      loading: string;
      emptyTitle: string;
      emptyDesc: string;
      selectPromptTitle: string;
      selectPromptDesc: string;
      tableHeaders: {
        client: string;
        project: string;
        deadline: string;
        status: string;
        files: string;
      };
      detail: {
        title: string;
        createdLabel: string;
        customerSection: string;
        whatsappAction: string;
        emailAction: string;
        briefSection: string;
        serviceLabel: string;
        budgetLabel: string;
        deadlineLabel: string;
        preferencesLabel: string;
        notesLabel: string;
        noneText: string;
        statusSection: string;
        statusLabel: string;
        saveStatusBtn: string;
        savingStatusBtn: string;
        statusSavedMsg: string;
        attachmentsSection: string;
        noAttachments: string;
        openSignedBtn: string;
        previewBtn: string;
        generatingLink: string;
        signedUrlHint: string;
        closePreview: string;
      };
    };
    messagesView: {
      searchPlaceholder: string;
      loading: string;
      emptyTitle: string;
      emptyDesc: string;
      replyBtn: string;
      receivedAt: string;
    };
    siteEditor: {
      title: string;
      subtitle: string;
      editingLangLabel: string;
      saveBtn: string;
      savingBtn: string;
      reloadBtn: string;
      resetBtn: string;
      confirmResetBtn: string;
      cancelResetBtn: string;
      savedMsg: string;
      resetDoneMsg: string;
      subtabs: {
        brandHero: string;
        aboutTestimonials: string;
        team: string;
        portfolio: string;
        servicesContact: string;
      };
      fields: {
        brandName: string;
        marqueeItems: string;
        marqueeHint: string;
        doubleMarqueeTop: string;
        doubleMarqueeBottom: string;
        studioLabel: string;
        headline: string;
        tagline: string;
        overview: string;
        ctaExplore: string;
        ctaStart: string;
        heroImagesTitle: string;
        heroImageSlot: string;
        heroScenesTitle: string;
        sceneThumbLabel: string;
        scenePostcardTitle: string;
        scenePostcardSub: string;
        sceneLetterHeading: string;
        sceneLetterBody: string;
        sceneStickerTag: string;
        heroAccordionsTitle: string;
        accordionTitle: string;
        accordionContent: string;
        aboutTitle: string;
        aboutSubtitle: string;
        storyTitle: string;
        storyText: string;
        visionTitle: string;
        visionText: string;
        missionItems: string;
        valuesList: string;
        linesHint: string;
        testimonialsHeaderTitle: string;
        testimonialsEyebrow: string;
        testimonialsSectionTitle: string;
        testimonialsNote: string;
        clearPlaceholderHint: string;
        testimonialsTitle: string;
        addTestimonial: string;
        quote: string;
        senderName: string;
        projectTag: string;
        dateLabel: string;
        cardStyle: string;
        sectionEyebrow: string;
        sectionTitle: string;
        sectionSubtitle: string;
        sectionNotice: string;
        teamHeaderTitle: string;
        teamTitle: string;
        addTeamMember: string;
        stampCode: string;
        memberName: string;
        memberRole: string;
        memberSpecialty: string;
        memberBio: string;
        bgColor: string;
        portfolioHeaderTitle: string;
        portfolioTitle: string;
        addPortfolioItem: string;
        mediaType: string;
        mediaTypeImage: string;
        mediaTypeVideo: string;
        videoUrl: string;
        videoUrlPlaceholder: string;
        videoThumbnail: string;
        videoThumbnailHint: string;
        videoDetected: string;
        videoFixBeforeSave: string;
        itemTitle: string;
        category: string;
        categoryLabel: string;
        cardVariant: string;
        yearLabel: string;
        dimensions: string;
        summary: string;
        deliverables: string;
        servicesHeaderTitle: string;
        servicesTitle: string;
        serviceTitle: string;
        shortDesc: string;
        turnaround: string;
        previewCaption: string;
        orderHeaderTitle: string;
        slipHeader: string;
        slipNumber: string;
        orderBanner: string;
        contactTitle: string;
        contactFormTitle: string;
        whatsappValue: string;
        instagramValue: string;
        emailValue: string;
        footerTitle: string;
        footerTagline: string;
        footerDisclaimer: string;
        footerCopyright: string;
        imageUrlLabel: string;
        uploadImageBtn: string;
        uploadingImageBtn: string;
        clearImageBtn: string;
        defaultIllustrationHint: string;
        deleteItemBtn: string;
      };
    };
    checkingSession: string;
  };
  statuses: Record<OrderStatus, string>;
}

export const ADMIN_COPY: Record<Language, AdminCopy> = {
  en: {
    brandSub: 'Studio Desk',
    backToSite: 'Public Site',
    login: {
      eyebrow: 'Authorized Access Only',
      title: 'Kreasiku Admin Desk',
      subtitle:
        'Sign in with your studio administrator account to review commissions, update statuses, and access private customer reference files.',
      emailLabel: 'Admin Email',
      emailPlaceholder: 'admin@kreasiku.studio',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter admin password',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      submitBtn: 'Sign In to Studio Desk',
      submittingBtn: 'Verifying Credentials...',
      provisionNotice:
        'Public registration is disabled. Admin accounts are provisioned directly via Supabase Auth with app_metadata role = admin.',
      missingCredentials: 'Please enter both admin email and password.',
      notConfigured:
        'Supabase environment variables are missing. Admin authentication is unavailable.',
      unauthorizedRole:
        'Access denied: this account does not have the required studio admin role.',
    },
    dashboard: {
      title: 'Commission & Inbox Ledger',
      subtitle:
        'Manage incoming creative briefs, status progress, private reference files, and quick contact postcards.',
      signedInAs: 'Signed in',
      refreshBtn: 'Refresh',
      refreshingBtn: 'Syncing...',
      signOutBtn: 'Sign Out',
      tabs: {
        orders: 'Commission Orders',
        messages: 'Contact Messages',
        site: 'Site Content',
      },
      kpis: {
        totalOrders: 'Total Orders',
        allFilter: 'All',
      },
      ordersView: {
        searchPlaceholder: 'Search client, email, project title, or service...',
        loading: 'Loading studio orders and attachments...',
        emptyTitle: 'No matching orders found',
        emptyDesc:
          'New commissions submitted through the public Order Slip will appear here automatically.',
        selectPromptTitle: 'Select a commission slip',
        selectPromptDesc:
          'Click any order row to inspect full customer details, update progress status, and open private reference files.',
        tableHeaders: {
          client: 'Client',
          project: 'Project & Service',
          deadline: 'Deadline',
          status: 'Status',
          files: 'Files',
        },
        detail: {
          title: 'Commission Ticket',
          createdLabel: 'Submitted',
          customerSection: 'Customer Information',
          whatsappAction: 'Open WhatsApp',
          emailAction: 'Send Email',
          briefSection: 'Project Brief & Specifications',
          serviceLabel: 'Service',
          budgetLabel: 'Estimated Budget',
          deadlineLabel: 'Target Deadline',
          preferencesLabel: 'Design Preferences',
          notesLabel: 'Additional Notes',
          noneText: 'Not specified',
          statusSection: 'Order Status Management',
          statusLabel: 'Current Workflow Status',
          saveStatusBtn: 'Update Status',
          savingStatusBtn: 'Saving...',
          statusSavedMsg: 'Order status updated in Supabase.',
          attachmentsSection: 'Private Reference Files',
          noAttachments: 'No reference files attached to this order.',
          openSignedBtn: 'Download / Open (2m link)',
          previewBtn: 'Preview Image',
          generatingLink: 'Signing URL...',
          signedUrlHint:
            'Files remain in private storage. Links expire automatically after 120 seconds.',
          closePreview: 'Close Preview',
        },
      },
      messagesView: {
        searchPlaceholder: 'Search sender name, email, or message...',
        loading: 'Loading studio contact postcards...',
        emptyTitle: 'No contact messages found',
        emptyDesc:
          'Quick postcards sent from the public Contact form will appear here.',
        replyBtn: 'Reply via Email',
        receivedAt: 'Received',
      },
      siteEditor: {
        title: 'Site Appearance & Content Studio',
        subtitle:
          'Customize the public website brand name, hero images, studio story, team members, portfolio items, services, and contact info.',
        editingLangLabel: 'Editing Copy Language',
        saveBtn: 'Save Changes',
        savingBtn: 'Saving...',
        reloadBtn: 'Reload Saved',
        resetBtn: 'Reset Defaults',
        confirmResetBtn: 'Confirm Reset',
        cancelResetBtn: 'Cancel',
        savedMsg: 'Website content saved to Supabase. Changes are now live.',
        resetDoneMsg:
          'Draft reverted to default studio copy. Click Save Changes to publish defaults.',
        subtabs: {
          brandHero: 'Brand & Hero',
          aboutTestimonials: 'About & Notes',
          team: 'Team',
          portfolio: 'Portfolio',
          servicesContact: 'Services & Contact',
        },
        fields: {
          brandName: 'Studio / Brand Name',
          marqueeItems: 'Top Marquee Phrases',
          marqueeHint: 'One phrase per line',
          doubleMarqueeTop: 'Middle Band — Upper Ribbon Phrases',
          doubleMarqueeBottom: 'Middle Band — Lower Ribbon Phrases',
          studioLabel: 'Hero Eyebrow Label',
          headline: 'Hero Headline',
          tagline: 'Hero Tagline',
          overview: 'Hero Overview Description',
          ctaExplore: 'Primary Button Label',
          ctaStart: 'Secondary Button Label',
          heroImagesTitle: 'Hero Collage Postcard Images (3 Slots)',
          heroImageSlot: 'Collage Card',
          heroScenesTitle: 'Hero Collage Card Texts & Manifesto Letters',
          sceneThumbLabel: 'Tab Label',
          scenePostcardTitle: 'Postcard Title',
          scenePostcardSub: 'Postcard Subtitle',
          sceneLetterHeading: 'Envelope Letter Greeting',
          sceneLetterBody: 'Envelope Letter Copy',
          sceneStickerTag: 'Envelope Pocket Label',
          heroAccordionsTitle: 'Hero Expandable Accordions (3 Cards)',
          accordionTitle: 'Accordion Heading',
          accordionContent: 'Accordion Body Text',
          aboutTitle: 'About Section Title',
          aboutSubtitle: 'About Section Subtitle',
          storyTitle: 'Story Card Title',
          storyText: 'Story Description',
          visionTitle: 'Vision Card Title',
          visionText: 'Vision Description',
          missionItems: 'Mission Items',
          valuesList: 'Creative Values',
          linesHint: 'One item per line',
          testimonialsHeaderTitle: 'Testimonials Section Header',
          testimonialsEyebrow: 'Testimonials Eyebrow',
          testimonialsSectionTitle: 'Testimonials Title',
          testimonialsNote: 'Testimonials Small Note',
          clearPlaceholderHint: 'Leave blank to hide this notice on the public site',
          testimonialsTitle: 'Client Notes & Testimonials',
          addTestimonial: 'Add Note',
          quote: 'Quote / Feedback',
          senderName: 'Client Name / Label',
          projectTag: 'Project Tag',
          dateLabel: 'Date Label',
          cardStyle: 'Note Style',
          sectionEyebrow: 'Section Eyebrow',
          sectionTitle: 'Section Title',
          sectionSubtitle: 'Section Subtitle',
          sectionNotice: 'Small Placeholder Notice',
          teamHeaderTitle: 'Team Section Header & Notice',
          teamTitle: 'Team Members',
          addTeamMember: 'Add Member',
          stampCode: 'Stamp Code',
          memberName: 'Member Name',
          memberRole: 'Role / Title',
          memberSpecialty: 'Specialty',
          memberBio: 'Short Bio',
          bgColor: 'Card Tint Color',
          portfolioHeaderTitle: 'Portfolio Section Header & Notice',
          portfolioTitle: 'Portfolio Archive Items',
          addPortfolioItem: 'Add Work',
          mediaType: 'Media Type',
          mediaTypeImage: 'Image / Illustration',
          mediaTypeVideo: 'Video (YouTube / Vimeo)',
          videoUrl: 'Video URL (YouTube or Vimeo)',
          videoUrlPlaceholder: 'https://www.youtube.com/watch?v=... or https://vimeo.com/...',
          videoThumbnail: 'Video Thumbnail (Optional)',
          videoThumbnailHint: 'Optional custom cover (YouTube thumbnails auto-load if left blank)',
          videoDetected: 'Valid video link detected',
          videoFixBeforeSave: 'Please fix the invalid video URL in Portfolio before saving',
          itemTitle: 'Work Title',
          category: 'Category Filter',
          categoryLabel: 'Category Display Label',
          cardVariant: 'Frame Style',
          yearLabel: 'Year / Tag',
          dimensions: 'Format / Dimensions',
          summary: 'Summary',
          deliverables: 'Deliverables',
          servicesHeaderTitle: 'Services Section Header',
          servicesTitle: 'Studio Services (6 Categories)',
          serviceTitle: 'Service Name',
          shortDesc: 'Short Description',
          turnaround: 'Turnaround Estimate',
          previewCaption: 'Sticker Caption',
          orderHeaderTitle: 'Commission Order Slip Header',
          slipHeader: 'Slip Banner Title',
          slipNumber: 'Slip Code / Number',
          orderBanner: 'Slip Info Strip',
          contactTitle: 'Contact Channels & Section Header',
          contactFormTitle: 'Contact Card Heading',
          whatsappValue: 'WhatsApp Display Number',
          instagramValue: 'Instagram Handle',
          emailValue: 'Studio Contact Email',
          footerTitle: 'Footer Copy',
          footerTagline: 'Footer Tagline',
          footerDisclaimer: 'Footer Small Notice',
          footerCopyright: 'Copyright Line',
          imageUrlLabel: 'Custom Image URL',
          uploadImageBtn: 'Upload Image',
          uploadingImageBtn: 'Uploading...',
          clearImageBtn: 'Use Default Art',
          defaultIllustrationHint: 'Using default illustrated artwork',
          deleteItemBtn: 'Remove',
        },
      },
      checkingSession: 'Verifying studio admin session...',
    },
    statuses: {
      Pending: 'Pending',
      'In Review': 'In Review',
      'In Progress': 'In Progress',
      Completed: 'Completed',
      Cancelled: 'Cancelled',
    },
  },
  id: {
    brandSub: 'Meja Admin',
    backToSite: 'Situs Publik',
    login: {
      eyebrow: 'Khusus Admin Berwenang',
      title: 'Meja Admin Kreasiku',
      subtitle:
        'Masuk menggunakan akun administrator studio untuk meninjau pesanan, memperbarui status, dan mengakses file referensi privat pelanggan.',
      emailLabel: 'Email Admin',
      emailPlaceholder: 'admin@kreasiku.studio',
      passwordLabel: 'Kata Sandi',
      passwordPlaceholder: 'Masukkan kata sandi admin',
      showPassword: 'Tampilkan kata sandi',
      hidePassword: 'Sembunyikan kata sandi',
      submitBtn: 'Masuk ke Meja Admin',
      submittingBtn: 'Memverifikasi Akses...',
      provisionNotice:
        'Registrasi publik dinonaktifkan. Akun admin hanya dibuat melalui Supabase Auth dengan app_metadata role = admin.',
      missingCredentials: 'Harap masukkan email admin dan kata sandi.',
      notConfigured:
        'Konfigurasi Supabase belum tersedia. Autentikasi admin tidak aktif.',
      unauthorizedRole:
        'Akses ditolak: akun ini tidak memiliki peran admin yang berwenang.',
    },
    dashboard: {
      title: 'Buku Besar Komisi & Pesan',
      subtitle:
        'Kelola brief komisi masuk, pembaruan status pengerjaan, file referensi privat, pesan kontak, serta tampilan konten website.',
      signedInAs: 'Masuk sebagai',
      refreshBtn: 'Muat Ulang',
      refreshingBtn: 'Menyinkronkan...',
      signOutBtn: 'Keluar',
      tabs: {
        orders: 'Pesanan Komisi',
        messages: 'Pesan Kontak',
        site: 'Tampilan Web',
      },
      kpis: {
        totalOrders: 'Total Pesanan',
        allFilter: 'Semua',
      },
      ordersView: {
        searchPlaceholder: 'Cari nama klien, email, judul proyek, atau layanan...',
        loading: 'Memuat data pesanan dan lampiran studio...',
        emptyTitle: 'Belum ada pesanan yang cocok',
        emptyDesc:
          'Pesanan baru yang dikirim dari formulir publik akan otomatis tampil di daftar ini.',
        selectPromptTitle: 'Pilih salah satu slip pesanan',
        selectPromptDesc:
          'Klik baris pesanan untuk melihat detail pelanggan, memperbarui status pengerjaan, dan mengakses file referensi privat.',
        tableHeaders: {
          client: 'Pelanggan',
          project: 'Proyek & Layanan',
          deadline: 'Tenggat',
          status: 'Status',
          files: 'File',
        },
        detail: {
          title: 'Detail Tiket Komisi',
          createdLabel: 'Dikirim',
          customerSection: 'Informasi Pelanggan',
          whatsappAction: 'Hubungi WhatsApp',
          emailAction: 'Kirim Email',
          briefSection: 'Brief & Spesifikasi Proyek',
          serviceLabel: 'Layanan',
          budgetLabel: 'Estimasi Anggaran',
          deadlineLabel: 'Target Tenggat',
          preferencesLabel: 'Preferensi Desain',
          notesLabel: 'Catatan Tambahan',
          noneText: 'Tidak dicantumkan',
          statusSection: 'Manajemen Status Pesanan',
          statusLabel: 'Status Pengerjaan',
          saveStatusBtn: 'Simpan Status',
          savingStatusBtn: 'Menyimpan...',
          statusSavedMsg: 'Status pesanan berhasil diperbarui di Supabase.',
          attachmentsSection: 'File Referensi Privat',
          noAttachments: 'Tidak ada file referensi yang dilampirkan.',
          openSignedBtn: 'Unduh / Buka (2 mnt)',
          previewBtn: 'Pratinjau Gambar',
          generatingLink: 'Membuat tautan privat...',
          signedUrlHint:
            'File tetap tersimpan di bucket privat. Tautan sementara kedaluwarsa otomatis dalam 120 detik.',
          closePreview: 'Tutup Pratinjau',
        },
      },
      messagesView: {
        searchPlaceholder: 'Cari nama pengirim, email, atau isi pesan...',
        loading: 'Memuat daftar pesan kontak...',
        emptyTitle: 'Tidak ada pesan kontak ditemukan',
        emptyDesc:
          'Kartu pos pertanyaan yang dikirim dari formulir Contact publik akan muncul di sini.',
        replyBtn: 'Balas lewat Email',
        receivedAt: 'Diterima',
      },
      siteEditor: {
        title: 'Editor Tampilan & Konten Website',
        subtitle:
          'Ubah nama studio/merek, gambar hero, cerita tentang kami, anggota tim, karya portofolio, layanan, dan kontak yang tampil di situs publik.',
        editingLangLabel: 'Bahasa Teks yang Diedit',
        saveBtn: 'Simpan Perubahan',
        savingBtn: 'Menyimpan...',
        reloadBtn: 'Muat Ulang',
        resetBtn: 'Reset Default',
        confirmResetBtn: 'Konfirmasi Reset',
        cancelResetBtn: 'Batal',
        savedMsg:
          'Konten website berhasil disimpan ke Supabase dan langsung tampil di halaman publik.',
        resetDoneMsg:
          'Draf dikembalikan ke bawaan awal. Klik Simpan Perubahan untuk menerbitkannya.',
        subtabs: {
          brandHero: 'Brand & Hero',
          aboutTestimonials: 'Tentang & Testimoni',
          team: 'Tim',
          portfolio: 'Portofolio',
          servicesContact: 'Layanan & Kontak',
        },
        fields: {
          brandName: 'Nama Studio / Merek',
          marqueeItems: 'Teks Pita Berjalan Atas',
          marqueeHint: 'Satu kalimat per baris',
          doubleMarqueeTop: 'Pita Tengah — Baris Atas',
          doubleMarqueeBottom: 'Pita Tengah — Baris Bawah',
          studioLabel: 'Label Kecil Hero',
          headline: 'Judul Utama Hero',
          tagline: 'Subjudul / Tagline Hero',
          overview: 'Deskripsi Singkat Hero',
          ctaExplore: 'Teks Tombol Utama',
          ctaStart: 'Teks Tombol Kedua',
          heroImagesTitle: 'Gambar Kartu Kolase Hero (3 Slot)',
          heroImageSlot: 'Kartu Kolase',
          heroScenesTitle: 'Teks Kartu Kolase & Surat Manifesto Hero',
          sceneThumbLabel: 'Label Tab',
          scenePostcardTitle: 'Judul Kartu Pos',
          scenePostcardSub: 'Subjudul Kartu Pos',
          sceneLetterHeading: 'Sapaan Surat Amplop',
          sceneLetterBody: 'Isi Surat Amplop',
          sceneStickerTag: 'Label Kantong Amplop',
          heroAccordionsTitle: 'Accordion Info Hero (3 Kartu)',
          accordionTitle: 'Judul Accordion',
          accordionContent: 'Isi Penjelasan Accordion',
          aboutTitle: 'Judul Bagian Tentang Kami',
          aboutSubtitle: 'Subjudul Tentang Kami',
          storyTitle: 'Judul Kartu Cerita',
          storyText: 'Isi Cerita Studio',
          visionTitle: 'Judul Kartu Visi',
          visionText: 'Isi Visi Studio',
          missionItems: 'Poin Misi Studio',
          valuesList: 'Nilai Kreatif Studio',
          linesHint: 'Satu poin per baris',
          testimonialsHeaderTitle: 'Judul & Catatan Bagian Testimoni',
          testimonialsEyebrow: 'Label Kecil Testimoni',
          testimonialsSectionTitle: 'Judul Bagian Testimoni',
          testimonialsNote: 'Catatan Kecil Testimoni',
          clearPlaceholderHint: 'Kosongkan untuk menyembunyikan catatan ini di situs publik',
          testimonialsTitle: 'Catatan Klien & Testimoni',
          addTestimonial: 'Tambah Testimoni',
          quote: 'Kutipan / Ulasan',
          senderName: 'Nama / Identitas Pengirim',
          projectTag: 'Label Proyek',
          dateLabel: 'Label Tanggal',
          cardStyle: 'Gaya Kartu',
          sectionEyebrow: 'Label Kecil Bagian',
          sectionTitle: 'Judul Bagian',
          sectionSubtitle: 'Subjudul / Deskripsi Bagian',
          sectionNotice: 'Catatan Kecil Placeholder',
          teamHeaderTitle: 'Judul & Catatan Bagian Tim',
          teamTitle: 'Anggota Tim Studio',
          addTeamMember: 'Tambah Anggota',
          stampCode: 'Kode Prangko',
          memberName: 'Nama Anggota',
          memberRole: 'Peran / Jabatan',
          memberSpecialty: 'Keahlian Utama',
          memberBio: 'Bio Singkat',
          bgColor: 'Warna Latar Kartu',
          portfolioHeaderTitle: 'Judul & Catatan Bagian Portofolio',
          portfolioTitle: 'Daftar Karya Portofolio',
          addPortfolioItem: 'Tambah Karya',
          mediaType: 'Jenis Media',
          mediaTypeImage: 'Gambar / Ilustrasi',
          mediaTypeVideo: 'Video (YouTube / Vimeo)',
          videoUrl: 'URL Video (YouTube atau Vimeo)',
          videoUrlPlaceholder: 'https://www.youtube.com/watch?v=... atau https://vimeo.com/...',
          videoThumbnail: 'Thumbnail Video (Opsional)',
          videoThumbnailHint: 'Sampul kustom opsional (thumbnail YouTube otomatis jika dikosongkan)',
          videoDetected: 'Tautan video valid terdeteksi',
          videoFixBeforeSave: 'Harap perbaiki URL video yang belum valid di bagian Portofolio sebelum menyimpan',
          itemTitle: 'Judul Karya',
          category: 'Kategori Filter',
          categoryLabel: 'Label Kategori',
          cardVariant: 'Gaya Bingkai',
          yearLabel: 'Tahun / Label',
          dimensions: 'Dimensi / Format',
          summary: 'Ringkasan Karya',
          deliverables: 'Output / Deliverables',
          servicesHeaderTitle: 'Judul Bagian Layanan',
          servicesTitle: 'Daftar Layanan Studio (6 Kategori)',
          serviceTitle: 'Nama Layanan',
          shortDesc: 'Deskripsi Singkat',
          turnaround: 'Estimasi Pengerjaan',
          previewCaption: 'Label Stiker',
          orderHeaderTitle: 'Header & Banner Formulir Order',
          slipHeader: 'Judul Strip Slip Order',
          slipNumber: 'Nomor / Kode Formulir',
          orderBanner: 'Teks Info Strip Order',
          contactTitle: 'Kanal & Header Bagian Kontak',
          contactFormTitle: 'Judul Formulir Kontak',
          whatsappValue: 'Nomor WhatsApp Tampil',
          instagramValue: 'Akun Instagram',
          emailValue: 'Email Kontak Studio',
          footerTitle: 'Konten Footer',
          footerTagline: 'Tagline Footer',
          footerDisclaimer: 'Catatan Kecil Footer',
          footerCopyright: 'Teks Hak Cipta',
          imageUrlLabel: 'URL Gambar Kustom',
          uploadImageBtn: 'Unggah Gambar',
          uploadingImageBtn: 'Mengunggah...',
          clearImageBtn: 'Pakai Ilustrasi Default',
          defaultIllustrationHint: 'Menggunakan ilustrasi bawaan',
          deleteItemBtn: 'Hapus',
        },
      },
      checkingSession: 'Memeriksa sesi admin studio...',
    },
    statuses: {
      Pending: 'Pending',
      'In Review': 'In Review',
      'In Progress': 'In Progress',
      Completed: 'Completed',
      Cancelled: 'Cancelled',
    },
  },
};
