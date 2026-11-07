import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FAQS } from '../data/ambuluData';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="am-section am-section-alt" id="faq">
      <div className="am-container am-faq-container">
        <div className="am-section-header">
          <span className="am-section-eyebrow">Informasi & Tanya Jawab</span>
          <h2 className="am-section-title">
            Pertanyaan yang Sering <span>Diajukan</span>
          </h2>
          <p className="am-section-desc">
            Panduan singkat mengenai keanggotaan relawan, program beasiswa SMA
            (AMF), sosialisasi sekolah, dan penyaluran donasi di Ambulu
            Mengajar.
          </p>
          <hr className="am-carrd-divider" />
        </div>

        <div className="am-faq-list">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`am-card am-faq-item ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  type="button"
                  className="am-faq-question"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                >
                  <span className="am-faq-q-left">
                    <HelpCircle size={18} className="am-faq-icon" />
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`am-faq-chevron ${isOpen ? 'is-rotated' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="am-faq-answer">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

