/**
 * Seed Data Lengkap CMS untuk Backend API Ambulu Mengajar
 * Mencakup seluruh konten Frontend: Profil Organisasi, Statistik Hero,
 * Visi & Misi, Sejarah, 4 Divisi, Event, Konfigurasi Donasi & Rekening,
 * Galeri Dokumentasi, FAQ, dan Kanal Sosial Media.
 */

const SEED_DATA = {
  orgInfo: {
    name: 'Ambulu Mengajar',
    shortName: 'AM',
    tagline: 'Mengabdi, Menginspirasi, Membangun Pendidikan Ambulu',
    category: 'Organisasi Non-Profit Pendidikan & Sosial',
    location: 'Kecamatan Ambulu, Kabupaten Jember, Jawa Timur',
    foundedYear: '2011',
    description:
      'Ambulu Mengajar adalah organisasi non-profit di bidang pendidikan dan sosial. Kami berfokus dalam membantu pelajar di Kecamatan Ambulu dan sekitarnya untuk melanjutkan pendidikan setinggi mungkin melalui pendampingan edukasi, sosialisasi perguruan tinggi, beasiswa pendidikan, dan aksi kemanusiaan.',
    educationFocus:
      'Memfasilitasi siswa-siswi SMA/SMK/MA sederajat di wilayah Ambulu dengan bimbingan belajar, pengenalan dunia perkuliahan, bedah jurusan, serta motivasi studi lanjut bersama mahasiswa asal Ambulu dari berbagai perguruan tinggi di Indonesia.',
    socialFocus:
      'Menggerakkan kepedulian sosial masyarakat melalui penyelenggaraan beasiswa pendidikan tingkat SMA serta aksi bakti sosial kemanusiaan di panti asuhan dan masyarakat sekitar.',
    logoMain: 'assets/images/image01.png',
    logoFooter: 'assets/images/image02.png',
    logoBadge: 'assets/images/image03.png',
  },

  heroStats: [
    {
      id: 'stat-1',
      value: '2011',
      label: 'Tahun Inisiasi Gerakan',
      detail: 'Lebih dari satu dekade mendampingi pelajar di Kecamatan Ambulu.',
    },
    {
      id: 'stat-2',
      value: '4 Divisi',
      label: 'Pilar Organisasi',
      detail: 'Sinergi divisi HRD, AML, AMF, dan KOMINFO yang terstruktur.',
    },
    {
      id: 'stat-3',
      value: '5+ Program',
      label: 'Agenda Tahunan Utama',
      detail: 'Goes To School, Beasiswa SMA, Pembidik Misi, dan Bakti Sosial.',
    },
    {
      id: 'stat-4',
      value: 'Ambulu',
      label: 'Pusat Pengabdian',
      detail: 'Fokus berdampak nyata bagi pelajar & masyarakat Jember Selatan.',
    },
  ],

  visionMission: {
    vision:
      'Menjadi wadah pengabdian dan gerakan kolaboratif pemuda-mahasiswa yang inklusif, berkelanjutan, dan berdampak nyata dalam meningkatkan akses serta mutu pendidikan maupun kepedulian sosial di Kecamatan Ambulu dan sekitarnya.',
    missions: [
      {
        id: 'mis-1',
        title: 'Pendampingan & Edukasi Pelajar',
        desc: 'Menyelenggarakan kegiatan belajar mengajar, pendampingan akademik, dan motivasi pendidikan bagi pelajar di Kecamatan Ambulu melalui program Ambulu Mengajar Learning (AML).',
      },
      {
        id: 'mis-2',
        title: 'Akses Beasiswa & Filantropi',
        desc: 'Memperluas akses informasi beasiswa perguruan tinggi serta menyalurkan program beasiswa tingkat SMA dan bakti sosial melalui Ambulu Mengajar Foundation (AMF).',
      },
      {
        id: 'mis-3',
        title: 'Pengembangan Kapasitas Relawan',
        desc: 'Membangun kualitas sumber daya manusia anggota serta mempererat jejaring kekeluargaan internal maupun kolaborasi eksternal melalui Human Resource Development (HRD).',
      },
      {
        id: 'mis-4',
        title: 'Literasi Digital & Informasi Publik',
        desc: 'Menyebarluaskan konten edukatif, informasi beasiswa, dan dokumentasi gerakan positif secara kreatif melalui Divisi Komunikasi dan Informatika (KOMINFO).',
      },
    ],
  },

  milestones: [
    {
      id: 'ms-2011',
      year: '2011',
      title: 'Awal Inisiasi Gerakan',
      desc: 'Lahirnya semangat kolektif pemuda dan mahasiswa asal Kecamatan Ambulu untuk berbagi informasi pendidikan tinggi kepada adik-adik pelajar di kampung halaman.',
      image: 'assets/images/gallery01/4a1c84c9.jpg',
    },
    {
      id: 'ms-2017',
      year: '2017',
      title: 'Penguatan Struktur 4 Divisi',
      desc: 'Penataan struktur organisasi yang semakin sistematis melalui empat divisi fungsional: HRD, AML, AMF, dan KOMINFO.',
      image: 'assets/images/gallery01/431bd9c3.jpg',
    },
    {
      id: 'ms-2019',
      year: '2019',
      title: 'Perluasan Goes To School & Beasiswa',
      desc: 'Ekspansi jangkauan sosialisasi kampus ke berbagai sekolah menengah di Ambulu dan sekitarnya serta inisiasi pendampingan beasiswa.',
      image: 'assets/images/gallery04/939e1c43.jpg',
    },
    {
      id: 'ms-2021',
      year: '2021',
      title: 'Aksi Bakti Sosial & Pembidik Mimpi',
      desc: 'Pelaksanaan program AMF Baksos di Panti Asuhan Immamul Mutaqien dan As Sofyan, serta kolaborasi beasiswa AMF X Pembidik Mimpi.',
      image: 'assets/images/gallery02/25b467bc.jpg',
    },
    {
      id: 'ms-2022',
      year: '2022 – Kini',
      title: 'Kolaborasi Berkelanjutan & Dampak Luas',
      desc: 'Penyelenggaraan Goes To School, AMF X Pembidik Misi, Kunjungan Ramadhan (KURMA), serta penguatan ekosistem edukasi digital.',
      image: 'assets/images/gallery05/eea98a03.jpg',
    },
  ],

  divisions: [
    {
      id: 'hrd',
      code: 'HRD',
      exactTitle: 'DIVISI HRD',
      fullName: 'Human Resource Development',
      tagline: 'Pengembangan Sumber Daya Anggota & Jaringan Relasi Organisasi',
      accentColor: '#FF8CA8',
      carrdPoints: [
        'Bertanggung jawab dalam pengembangan sumber daya manusia anggota Ambulu Mengajar',
        'Membangun hubungan baik di internal maupun eksternal Ambulu Mengajar',
      ],
      description:
        'Divisi HRD berperan sebagai jantung pengelolaan sumber daya manusia di dalam Ambulu Mengajar, mulai dari rekrutmen relawan, peningkatan kapasitas anggota, hingga menjaga harmonisasi internal dan kemitraan eksternal.',
      programs: [
        {
          name: 'Open Recruitment & Onboarding Relawan',
          desc: 'Penjaringan, seleksi, dan orientasi anggota baru Ambulu Mengajar.',
        },
        {
          name: 'Capacity Building & Upgrading',
          desc: 'Pelatihan kepemimpinan, manajemen organisasi, dan komunikasi publik bagi pengurus.',
        },
        {
          name: 'Internal Bonding & Kekeluargaan',
          desc: 'Forum silaturahmi lintas angkatan untuk menjaga solidaritas anggota.',
        },
        {
          name: 'Kemitraan & Relasi Eksternal',
          desc: 'Menjalin hubungan kerja sama dengan pihak sekolah, alumni, dan komunitas.',
        },
      ],
      skills: [
        'Manajemen SDM',
        'Leadership & Team Building',
        'Public Relations',
        'Komunikasi Interpersonal',
      ],
    },
    {
      id: 'aml',
      code: 'AML',
      exactTitle: 'DIVISI AML (Ambulu Mengajar Learning)',
      fullName: 'Ambulu Mengajar Learning',
      tagline: 'Penggerak Kegiatan Belajar Mengajar & Edukasi Sosial',
      accentColor: '#FBBF24',
      carrdPoints: [
        'Menyelenggarakan kegiatan belajar mengajar',
        'Menyelenggarakan acara sosial di bidang pendidikan',
      ],
      description:
        'Divisi AML merupakan garda terdepan pelaksanaan program pengajaran, pendampingan belajar, serta kegiatan sosial-edukatif secara langsung bersama para pelajar di Kecamatan Ambulu dan sekitarnya.',
      programs: [
        {
          name: 'Ambulu Mengajar Goes To School',
          desc: 'Kunjungan sosialisasi dunia perkuliahan dan motivasi studi lanjut ke SMA/SMK/MA.',
        },
        {
          name: 'Kelas Pendampingan & Bimbingan Belajar',
          desc: 'Sesi belajar interaktif dan persiapan ujian masuk perguruan tinggi.',
        },
        {
          name: 'Sharing Session & Bedah Jurusan',
          desc: 'Forum diskusi interaktif antara siswa dengan mahasiswa berbagai program studi.',
        },
        {
          name: 'Edukasi Sosial Masyarakat',
          desc: 'Kegiatan literasi dan kelas inspirasi di lingkungan masyarakat Ambulu.',
        },
      ],
      skills: [
        'Teaching & Mentoring',
        'Kurikulum Edukasi',
        'Event Management',
        'Public Speaking',
      ],
    },
    {
      id: 'amf',
      code: 'AMF',
      exactTitle: 'DIVISI AMF (Ambulu Mengajar Foundation)',
      fullName: 'Ambulu Mengajar Foundation / Filantropi',
      tagline: 'Pengelola Program Beasiswa Pendidikan & Bakti Sosial Kemanusiaan',
      accentColor: '#34D399',
      carrdPoints: [
        'Menyelenggarakan beasiswa tingkat SMA',
        'Menyediakan segala informasi tentang beasiswa',
      ],
      description:
        'Divisi AMF berfokus pada pemerataan kesempatan pendidikan melalui penyelenggaraan beasiswa tingkat SMA, penyediaan pusat informasi beasiswa kuliah, serta penggalangan donasi bakti sosial.',
      programs: [
        {
          name: 'Beasiswa Pelajar SMA/Sederajat',
          desc: 'Penyaluran bantuan biaya pendidikan dan pendampingan bagi siswa berprestasi.',
        },
        {
          name: 'AMF X Pembidik Misi / Pembidik Mimpi',
          desc: 'Kolaborasi sosialisasi dan pendampingan pendaftaran beasiswa perguruan tinggi.',
        },
        {
          name: 'Pusat Informasi Beasiswa',
          desc: 'Kurasi informasi beasiswa nasional untuk pelajar dan mahasiswa asal Ambulu.',
        },
        {
          name: 'AMF Bakti Sosial & Kunjungan Ramadhan',
          desc: 'Aksi kemanusiaan dan penyaluran santunan ke panti asuhan serta masyarakat.',
        },
      ],
      skills: [
        'Manajemen Beasiswa',
        'Social Fundraising',
        'Community Development',
        'Kemanusiaan & Filantropi',
      ],
    },
    {
      id: 'kominfo',
      code: 'KOMINFO',
      exactTitle: 'DIVISI KOMINFO',
      fullName: 'Komunikasi dan Informatika',
      tagline: 'Pusat Kreativitas Visual, Publikasi Digital & Dokumentasi',
      accentColor: '#60A5FA',
      carrdPoints: [
        'Bertanggung jawab dalam bidang komunikasi dan informatika seperti pengelolaan media sosial',
      ],
      description:
        'Divisi KOMINFO menjadi wajah informasi publik Ambulu Mengajar melalui pengelolaan media sosial resmi, desain komunikasi visual, produksi dokumentasi foto/video, serta publikasi kegiatan.',
      programs: [
        {
          name: 'Manajemen Media Sosial Resmi',
          desc: 'Pengelolaan konten edukatif di Instagram, YouTube, LinkedIn, dan kanal digital.',
        },
        {
          name: 'Visual Branding & Desain Grafis',
          desc: 'Perancangan poster kegiatan, infografis beasiswa, dan identitas visual organisasi.',
        },
        {
          name: 'Dokumentasi Foto & Video Kegiatan',
          desc: 'Peliputan dan pengarsipan visual seluruh rangkaian kegiatan Ambulu Mengajar.',
        },
        {
          name: 'Publikasi Informasi & Kampanye Sosial',
          desc: 'Penyebaran pengumuman rekrutmen, agenda sekolah, dan laporan transparansi.',
        },
      ],
      skills: [
        'Social Media Strategy',
        'Graphic Design',
        'Fotografi & Videografi',
        'Copywriting & Content',
      ],
    },
  ],

  events: [
    {
      id: 'evt-kurma-2022',
      title: 'KURMA — Kunjungan Ramadhan: Panti Asuhan "Immamul Mutaqin"',
      subtitle: 'Bakti Sosial & Santunan Ramadhan — Ambulu Mengajar Filantropi (AMF)',
      category: 'Bakti Sosial (AMF)',
      period: '14 – 22 April 2022',
      eventDate: '2022-04-22',
      location: 'Panti Asuhan Immamul Mutaqin, Ambulu, Jember',
      status: 'completed',
      isDonationOpen: false,
      poster: 'assets/images/image04.jpg',
      badgeLogo: 'assets/images/image03.png',
      targetAmount: 10000000,
      collectedAmount: 10000000,
      donorCount: 68,
      description:
        'Kegiatan penggalangan donasi terbuka dan kunjungan bakti sosial Ramadhan bersama adik-adik Panti Asuhan Immamul Mutaqin yang diselenggarakan oleh Divisi Ambulu Mengajar Filantropi (AMF).',
      completionReport:
        'Kegiatan KURMA (Kunjungan Ramadhan) dan penyaluran donasi untuk Panti Asuhan "Immamul Mutaqin" telah selesai dilaksanakan pada 22 April 2022. Seluruh amanah donasi dana tunai, sembako, dan pakaian layak pakai telah disalurkan sepenuhnya kepada penerima manfaat.',
      deliverables: [
        'Penyaluran donasi dana tunai & santunan pendidikan',
        'Paket sembako & kebutuhan pokok panti asuhan',
        'Pakaian layak pakai & perlengkapan ibadah',
        'Buka puasa bersama & kelas motivasi Ramadhan',
      ],
      registrationUrl: '',
    },
    {
      id: 'evt-amf-pembidik-misi',
      title: 'AMF X Pembidik Misi — Sosialisasi & Pendampingan Beasiswa',
      subtitle: 'Kolaborasi Akses Beasiswa Perguruan Tinggi & SMA',
      category: 'Beasiswa & Pendidikan (AMF)',
      period: 'Program Tahunan Terlaksana',
      eventDate: '2022-06-15',
      location: 'SMA/SMK/MA se-Kecamatan Ambulu, Jember',
      status: 'completed',
      isDonationOpen: false,
      poster: 'assets/images/gallery05/eea98a03.jpg',
      badgeLogo: 'assets/images/image03.png',
      targetAmount: 0,
      collectedAmount: 0,
      donorCount: 0,
      description:
        'Kolaborasi strategis Ambulu Mengajar Filantropi (AMF) bersama Pembidik Misi untuk memberikan edukasi beasiswa, bedah jalur masuk perguruan tinggi, serta pendampingan siswa berprestasi.',
      completionReport:
        'Program sosialisasi AMF X Pembidik Misi telah terlaksana dengan antusiasme tinggi dari pelajar SMA/SMK sederajat di Kecamatan Ambulu.',
      deliverables: [
        'Talkshow & bedah beasiswa kuliah (KIP-K / Beasiswa Unggulan)',
        'Sesi mentoring bersama mahasiswa asal Ambulu',
        'Pendampingan pemberkasan & motivasi studi lanjut',
      ],
      registrationUrl: '',
    },
    {
      id: 'evt-goes-to-school-next',
      title: 'Ambulu Mengajar Goes To School & Open Recruitment Relawan',
      subtitle: 'Sosialisasi Kampus & Rekrutmen Pengurus Baru (AML & HRD)',
      category: 'Sosialisasi & Rekrutmen (AML / HRD)',
      period: 'Agenda Tahunan Berikutnya',
      eventDate: '2026-08-01',
      location: 'Kecamatan Ambulu, Kabupaten Jember',
      status: 'upcoming',
      isDonationOpen: false,
      poster: 'assets/images/gallery01/4a1c84c9.jpg',
      badgeLogo: 'assets/images/image03.png',
      targetAmount: 0,
      collectedAmount: 0,
      donorCount: 0,
      description:
        'Agenda kunjungan edukatif ke sekolah-sekolah menengah atas di Kecamatan Ambulu serta pembukaan rekrutmen relawan mahasiswa baru Ambulu Mengajar.',
      completionReport:
        'Program kunjungan sekolah dan rekrutmen relawan periode berikutnya sedang dalam tahap persiapan jadwal bersama pihak sekolah mitra di Kecamatan Ambulu.',
      deliverables: [
        'Roadshow sosialisasi dunia perkuliahan ke SMA/SMK/MA',
        'Open Recruitment relawan divisi HRD, AML, AMF, dan KOMINFO',
        'Penjaringan calon penerima Beasiswa SMA Ambulu Mengajar',
      ],
      registrationUrl: 'https://linktr.ee/AmbuluMengajar',
    },
  ],

  donationConfig: {
    isOpen: false,
    campaignTitle: 'Program Donasi Bakti Sosial & Beasiswa AMF',
    statusBadgeText: 'PROGRAM DONASI TELAH SELESAI',
    closedNoticeTitle: 'Penyaluran Donasi Program KURMA Telah Selesai Dilaksanakan',
    closedNoticeDesc:
      'Terima kasih yang sebesar-besarnya kepada seluruh donatur dan mitra kebaikan. Penggalangan donasi kegiatan KURMA (Panti Asuhan Immamul Mutaqin) telah resmi berakhir dan seluruh bantuan telah diserahterimakan kepada penerima manfaat. Nantikan informasi pembukaan program bakti sosial dan beasiswa periode berikutnya.',
    activeNoticeDesc:
      'Salurkan dukungan terbaik Anda untuk program Beasiswa SMA & Bakti Sosial Ambulu Mengajar Filantropi (AMF) melalui rekening resmi di bawah ini.',
    bankAccounts: [
      {
        id: 'bank-bri',
        bank: 'BRI',
        number: '1161 0101 4968 502',
        numberClean: '116101014968502',
        holder: 'Tria Mariska',
        badgeColor: '#00529C',
        isActive: true,
      },
      {
        id: 'bank-bca',
        bank: 'BCA',
        number: '3340427938',
        numberClean: '3340427938',
        holder: 'Renni Sisanty',
        badgeColor: '#0066AE',
        isActive: true,
      },
      {
        id: 'bank-bni',
        bank: 'BNI',
        number: '1336008241',
        numberClean: '1336008241',
        holder: 'Lia Anggraeni',
        badgeColor: '#F15A23',
        isActive: true,
      },
      {
        id: 'bank-ewallet',
        bank: 'Dompet Digital (Dana / OVO / GoPay / ShopeePay)',
        number: '085784051899',
        numberClean: '085784051899',
        holder: 'Lia Anggraeni',
        badgeColor: '#10B981',
        isActive: true,
      },
    ],
    contactPersons: [
      {
        id: 'cp-melinia',
        name: 'Melinia',
        role: 'Narahubung Resmi 1',
        phoneDisplay: '+62 822-5708-1262',
        phoneClean: '6282257081262',
        waLink:
          'https://wa.me/6282257081262?text=Halo%20Kak%20Melinia%20(Ambulu%20Mengajar)%2C%20saya%20ingin%20bertanya%20mengenai%20program%20Ambulu%20Mengajar.',
      },
      {
        id: 'cp-fruston',
        name: 'Fruston',
        role: 'Narahubung Resmi 2',
        phoneDisplay: '+62 822-3742-3063',
        phoneClean: '6282237423063',
        waLink:
          'https://wa.me/6282237423063?text=Halo%20Kak%20Fruston%20(Ambulu%20Mengajar)%2C%20saya%20ingin%20bertanya%20mengenai%20program%20Ambulu%20Mengajar.',
      },
    ],
  },

  donationsLog: [
    {
      id: 'don-001',
      donorName: 'Hamba Allah (Alumni SMAN Ambulu)',
      eventId: 'evt-kurma-2022',
      eventTitle: 'KURMA — Panti Asuhan Immamul Mutaqin',
      type: 'Donasi Dana Tunai',
      amount: 500000,
      bankTarget: 'BRI',
      message: 'Semoga berkah untuk adik-adik di Panti Asuhan Immamul Mutaqin.',
      status: 'verified',
      createdAt: '2022-04-18T09:30:00.000Z',
    },
    {
      id: 'don-002',
      donorName: 'Keluarga Besar Relawan AM',
      eventId: 'evt-kurma-2022',
      eventTitle: 'KURMA — Panti Asuhan Immamul Mutaqin',
      type: 'Sembako & Pakaian Layak Pakai',
      amount: 1250000,
      bankTarget: 'BCA',
      message: 'Titip amanah paket sembako Ramadhan.',
      status: 'verified',
      createdAt: '2022-04-20T14:15:00.000Z',
    },
  ],

  customPhotos: [],

  faqs: [
    {
      id: 'faq-1',
      category: 'profil',
      badge: 'Organisasi & Sejarah',
      q: 'Apa itu Ambulu Mengajar dan siapa saja anggotanya?',
      a: 'Ambulu Mengajar adalah organisasi non-profit di bidang pendidikan dan sosial yang berfokus membantu pelajar di Kecamatan Ambulu (Kabupaten Jember) dan sekitarnya agar dapat melanjutkan pendidikan setinggi mungkin. Anggotanya terdiri dari mahasiswa dan pemuda asal Ambulu yang menempuh pendidikan di berbagai perguruan tinggi di Indonesia.',
    },
    {
      id: 'faq-2',
      category: 'relawan',
      badge: 'Struktur & Divisi',
      q: 'Apa saja divisi yang ada di dalam Ambulu Mengajar?',
      a: 'Terdapat 4 divisi utama: (1) Divisi HRD (Human Resource Development) untuk pengembangan SDM dan relasi internal-eksternal, (2) Divisi AML (Ambulu Mengajar Learning) untuk kegiatan belajar mengajar dan acara sosial pendidikan, (3) Divisi AMF (Ambulu Mengajar Foundation) untuk penyelenggaraan beasiswa tingkat SMA dan informasi beasiswa lainnya, serta (4) Divisi KOMINFO untuk komunikasi, informatika, dan media sosial.',
    },
    {
      id: 'faq-3',
      category: 'program',
      badge: 'Program AMF',
      q: 'Bagaimana cara pelajar SMA di Ambulu mendapatkan informasi atau mendaftar beasiswa AMF?',
      a: 'Informasi pembukaan pendaftaran beasiswa SMA dari Ambulu Mengajar Foundation (seperti program AMF X Pembidik Misi / Pembidik Mimpi) diumumkan secara berkala melalui akun Instagram resmi @ambulumengajar, kanal Linktree resmi, serta sosialisasi langsung ke sekolah-sekolah di Kecamatan Ambulu.',
    },
    {
      id: 'faq-4',
      category: 'program',
      badge: 'Program AML',
      q: 'Bagaimana cara sekolah mengundang tim Ambulu Mengajar Goes To School?',
      a: 'Pihak sekolah (Guru BK, Kesiswaan, atau OSIS) di wilayah Kecamatan Ambulu dan sekitarnya dapat menghubungi narahubung resmi kami melalui WhatsApp atau mengisi formulir sinergi di bagian Kontak untuk menjadwalkan kunjungan sosialisasi perguruan tinggi.',
    },
    {
      id: 'faq-5',
      category: 'donasi',
      badge: 'Filantropi Sosial',
      q: 'Bagaimana cara berpartisipasi dalam program Bakti Sosial atau Donasi Pendidikan?',
      a: 'Masyarakat dan mitra kebaikan dapat menyalurkan dukungan melalui rekening resmi BRI, BCA, BNI, atau Dompet Digital saat periode penggalangan donasi dibuka, maupun menghubungi narahubung resmi kami untuk kolaborasi penyaluran bantuan pendidikan dan sosial.',
    },
  ],

  socialLinks: [
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@ambulumengajar',
      desc: 'Update kegiatan terbaru, info beasiswa, rekrutmen & dokumentasi',
      url: 'https://www.instagram.com/ambulumengajar/?utm_medium=copy_link',
      iconId: 'icon-910',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      handle: 'Ambulu Mengajar',
      desc: 'Profil organisasi profesional & jejaring alumni/pengurus',
      url: 'https://www.linkedin.com/company/ambulu-mengajar/?viewAsMember=true',
      iconId: 'icon-90b',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      handle: 'Ambulu Mengajar Official',
      desc: 'Dokumentasi video kegiatan, profil & edukasi perkuliahan',
      url: 'https://www.youtube.com/channel/UCcLwJF8tjEnR3WATtyyGGVQ',
      iconId: 'icon-90d',
    },
    {
      id: 'linktree',
      name: 'Linktree',
      handle: 'linktr.ee/AmbuluMengajar',
      desc: 'Pusat tautan pendaftaran kegiatan, buku panduan & narahubung resmi',
      url: 'https://linktr.ee/AmbuluMengajar',
      iconId: 'icon-b0b',
    },
  ],

  updatedAt: new Date().toISOString(),
};

module.exports = { SEED_DATA };
