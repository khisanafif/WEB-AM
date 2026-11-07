import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  Sparkles,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import { FAQS } from '../data/ambuluData';

const FAQ_CATEGORIES = [
  { id: 'all', label: 'Semua Topik' },
  { id: 'profil', label: 'Profil & Lokasi' },
  { id: 'relawan', label: 'Relawan & Divisi' },
  { id: 'program', label: 'Beasiswa & Sekolah' },
  { id: 'donasi', label: 'Filantropi Sosial' },
];

export default function FaqSection({ backendState }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const waTarget =
    backendState?.donationConfig?.contactPersons?.[0]?.phoneClean ||
    '6282257081262';

  const enrichedFaqs = useMemo(() => {
    const rawList =
      backendState?.faqs && backendState.faqs.length > 0
        ? backendState.faqs
        : FAQS;
    const categoryMap = ['profil', 'relawan', 'program', 'program', 'donasi'];
    const badgeMap = [
      'Organisasi & Sejarah',
      'Struktur & Divisi',
      'Program AMF',
      'Program AML',
      'Filantropi Sosial',
    ];
    return rawList.map((item, idx) => ({
      ...item,
      id: item.id || `faq-${idx + 1}`,
      number: `0${idx + 1}`,
      category: item.category || categoryMap[idx] || 'profil',
      badge: item.badge || badgeMap[idx] || 'Informasi Umum',
    }));
  }, [backendState?.faqs]);

  const filteredFaqs = useMemo(() => {
    return enrichedFaqs.filter((item) => {
      const matchCat =
        activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        (item.q || '').toLowerCase().includes(q) ||
        (item.a || '').toLowerCase().includes(q) ||
        (item.badge || '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [enrichedFaqs, activeCategory, searchQuery]);

  return (
    <section className="am-section am-section-alt" id="faq">
      <div className="am-container">
        <div className="am-section-header am-header-split">
          <div>
            <span className="am-section-eyebrow">
              <Sparkles size={13} /> Pusat Informasi & Bantuan
            </span>
            <h2 className="am-section-title">
              Pertanyaan yang Sering <span>Diajukan</span>
            </h2>
          </div>
          <p className="am-section-desc">
            Panduan lengkap mengenai keanggotaan relawan, program beasiswa
            tingkat SMA, kunjungan sosialisasi sekolah, serta kegiatan sosial di
            Ambulu Mengajar.
          </p>
        </div>

        {/* COMPACT INLINE TOOLBAR (NO SEPARATE SIDEBAR CARD) */}
        <div className="am-doc-controls-wrapper">
          <div className="am-doc-filter-pills">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`am-filter-pill ${
                  activeCategory === cat.id ? 'is-active' : ''
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="am-search-box">
            <Search size={16} className="am-search-icon" />
            <input
              type="text"
              placeholder="Cari topik pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="am-search-input"
            />
          </div>
        </div>

        {/* DIRECTLY OPEN FAQ CARDS (MOBILE & DESKTOP FRIENDLY) */}
        {filteredFaqs.length === 0 ? (
          <div className="am-card am-empty-state">
            <HelpCircle size={32} />
            <h3>Pertanyaan tidak ditemukan</h3>
            <p>
              Coba gunakan kata kunci lain atau pilih kategori &ldquo;Semua
              Topik&rdquo;.
            </p>
            <button
              type="button"
              className="am-btn am-btn-outline am-btn-sm"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
            >
              Tampilkan Semua FAQ
            </button>
          </div>
        ) : (
          <div className="am-faqs-open-grid">
            {filteredFaqs.map((item) => (
              <article key={item.id} className="am-card am-faq-open-card">
                <div className="am-faq-open-top">
                  <span className="am-faq-num">{item.number}</span>
                  <div className="am-faq-q-text-wrap">
                    <span className="am-faq-item-badge">{item.badge}</span>
                    <h3 className="am-faq-q-title">{item.q}</h3>
                  </div>
                </div>
                <p className="am-faq-open-body">{item.a}</p>
                <div className="am-faq-answer-footer">
                  <span className="am-faq-verified">
                    <CheckCircle2 size={14} /> Informasi Resmi Ambulu Mengajar
                  </span>
                  <a
                    href={`https://wa.me/${waTarget}?text=${encodeURIComponent(
                      `Halo Kak, saya ingin bertanya lebih lanjut mengenai: "${item.q}"`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="am-faq-ask-wa"
                  >
                    <MessageCircle size={13} /> Tanyakan via WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
