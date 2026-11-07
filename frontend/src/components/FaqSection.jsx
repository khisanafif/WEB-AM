import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Search,
  Sparkles,
  MessageCircle,
  Compass,
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
  const [openIndex, setOpenIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

        <div className="am-faq-studio-grid">
          <aside className="am-card am-faq-sidebar">
            <div className="am-faq-search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Cari topik pertanyaan..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOpenIndex(0);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="am-faq-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  Reset
                </button>
              )}
            </div>

            <div className="am-faq-cat-list">
              <span className="am-studio-rail-label">Filter Kategori</span>
              {FAQ_CATEGORIES.map((cat) => {
                const count =
                  cat.id === 'all'
                    ? enrichedFaqs.length
                    : enrichedFaqs.filter((f) => f.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`am-faq-cat-btn ${
                      activeCategory === cat.id ? 'is-active' : ''
                    }`}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setOpenIndex(0);
                    }}
                  >
                    <span>{cat.label}</span>
                    <span className="am-faq-cat-count">{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="am-faq-helper-box">
              <div className="am-faq-helper-badge">
                <Compass size={14} /> Layanan Informasi
              </div>
              <h4>Punya Pertanyaan Khusus?</h4>
              <p>
                Tim narahubung Ambulu Mengajar siap membantu sekolah, pelajar,
                maupun mitra kolaborasi secara langsung.
              </p>
              <a
                href="#kontak"
                className="am-btn am-btn-primary am-btn-sm am-btn-full"
              >
                <MessageCircle size={15} /> Hubungi Tim Kami
              </a>
            </div>
          </aside>

          <div className="am-faq-list">
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
              filteredFaqs.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={item.id}
                    className={`am-card am-faq-item ${isOpen ? 'is-open' : ''}`}
                  >
                    <button
                      type="button"
                      className="am-faq-question"
                      onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                      aria-expanded={isOpen}
                    >
                      <span className="am-faq-q-left">
                        <span className="am-faq-num">{item.number}</span>
                        <span className="am-faq-q-text-wrap">
                          <span className="am-faq-item-badge">{item.badge}</span>
                          <span className="am-faq-q-title">{item.q}</span>
                        </span>
                      </span>
                      <ChevronDown
                        size={18}
                        className={`am-faq-chevron ${
                          isOpen ? 'is-rotated' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="am-faq-answer">
                        <p>{item.a}</p>
                        <div className="am-faq-answer-footer">
                          <span className="am-faq-verified">
                            <CheckCircle2 size={14} /> Informasi Resmi Ambulu
                            Mengajar
                          </span>
                          <a
                            href={`https://wa.me/6282257081262?text=${encodeURIComponent(
                              `Halo Kak, saya ingin bertanya lebih lanjut mengenai: "${item.q}"`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="am-faq-ask-wa"
                          >
                            <MessageCircle size={13} /> Tanyakan via WhatsApp
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
