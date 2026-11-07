import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Server,
  LogOut,
  RefreshCw,
  Calendar,
  HeartHandshake,
  KeyRound,
  Sparkles,
  AlertCircle,
  Building2,
  Compass,
  Layers,
  Camera,
  HelpCircle,
  Save,
} from 'lucide-react';
import {
  loginAdmin,
  clearAdminSession,
  createEventApi,
  updateEventApi,
  patchEventStatusApi,
  deleteEventApi,
  updateDonationConfigApi,
  createDonationLogApi,
  patchDonationLogApi,
  deleteDonationLogApi,
  createGalleryPhotoApi,
  deleteGalleryPhotoApi,
  updateCmsContentApi,
  resetBackendDatabaseApi,
  getApiBaseUrl,
  setCustomApiBaseUrl,
  fetchPublicState,
} from '../services/apiClient';
import { DOCUMENTATION_ALBUMS } from '../data/ambuluData';

const EMPTY_EVENT_FORM = {
  title: '',
  subtitle: '',
  category: 'Bakti Sosial (AMF)',
  period: '',
  eventDate: new Date().toISOString().slice(0, 10),
  location: 'Kecamatan Ambulu, Jember',
  status: 'upcoming',
  isDonationOpen: false,
  poster: 'assets/images/image04.jpg',
  targetAmount: 0,
  collectedAmount: 0,
  description: '',
  completionReport: '',
  deliverables: '',
  registrationUrl: '',
};

export default function AdminPortalModal({
  isOpen,
  onClose,
  adminUser,
  onAdminAuthChange,
  backendState,
  backendStatus,
  onStateChange,
  onBackendStatusChange,
}) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // CMS Tabs: 'profile' | 'about' | 'divisions' | 'events' | 'donations' | 'media-faq' | 'backend'
  const [activeTab, setActiveTab] = useState('profile');

  // 1. Profile & Hero Draft
  const [orgDraft, setOrgDraft] = useState(backendState?.orgInfo || {});
  const [statsDraft, setStatsDraft] = useState(backendState?.heroStats || []);

  // 2. About, Vision, Mission & Milestones Draft
  const [visionDraft, setVisionDraft] = useState(
    backendState?.visionMission?.vision || ''
  );
  const [missionsDraft, setMissionsDraft] = useState(
    backendState?.visionMission?.missions || []
  );
  const [milestonesDraft, setMilestonesDraft] = useState(
    backendState?.milestones || []
  );

  // 3. Divisions Draft
  const [divisionsDraft, setDivisionsDraft] = useState(
    backendState?.divisions || []
  );
  const [selectedEditDivIdx, setSelectedEditDivIdx] = useState(0);

  // 4. Events Form
  const [editingEventId, setEditingEventId] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM);

  // 5. Donations & Bank Accounts Draft
  const [configDraft, setConfigDraft] = useState(
    backendState?.donationConfig || {}
  );
  const [newLogForm, setNewLogForm] = useState({
    donorName: '',
    type: 'Donasi Dana Tunai',
    amount: 100000,
    bankTarget: 'BRI',
    eventTitle: 'Program Bakti Sosial AMF',
  });

  // 6. Media Gallery, FAQ & Social Links Draft
  const [newPhotoForm, setNewPhotoForm] = useState({
    title: '',
    caption: '',
    year: new Date().getFullYear().toString(),
    division: 'Divisi AMF',
    albumId: 'gallery05',
    src: 'assets/images/gallery01/4a1c84c9.jpg',
  });
  const [faqsDraft, setFaqsDraft] = useState(backendState?.faqs || []);
  const [socialsDraft, setSocialsDraft] = useState(
    backendState?.socialLinks || []
  );

  // 7. Backend URL
  const [apiUrlInput, setApiUrlInput] = useState(getApiBaseUrl());

  // Sync drafts whenever backendState changes
  useEffect(() => {
    if (!backendState) return;
    setOrgDraft(backendState.orgInfo || {});
    setStatsDraft(backendState.heroStats || []);
    setVisionDraft(backendState.visionMission?.vision || '');
    setMissionsDraft(backendState.visionMission?.missions || []);
    setMilestonesDraft(backendState.milestones || []);
    setDivisionsDraft(backendState.divisions || []);
    setConfigDraft(backendState.donationConfig || {});
    setFaqsDraft(backendState.faqs || []);
    setSocialsDraft(backendState.socialLinks || []);
  }, [backendState]);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3200);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      const res = await loginAdmin(username, password);
      onAdminAuthChange(res.user);
      if (onBackendStatusChange) onBackendStatusChange(res.mode);
      showToast(`Selamat datang, ${res.user.name}!`);
    } catch (err) {
      setAuthError(err.message || 'Gagal login sebagai Admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    onAdminAuthChange(null);
    setPassword('');
    showToast('Anda telah keluar dari sesi Admin.');
  };

  // Save CMS Section Helper
  const handleSaveCmsPayload = async (payload, successMessage) => {
    setLoading(true);
    try {
      const res = await updateCmsContentApi(payload);
      onStateChange(res.state);
      showToast(successMessage || 'Perubahan berhasil disimpan ke website!');
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers
  const handleQuickEventStatus = async (evtId, newStatus) => {
    setLoading(true);
    try {
      const res = await patchEventStatusApi(evtId, {
        status: newStatus,
        isDonationOpen: newStatus === 'ongoing',
      });
      onStateChange(res.state);
      showToast('Status kegiatan berhasil diperbarui.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEditEvent = (evt) => {
    setEditingEventId(evt.id);
    setEventForm({
      title: evt.title || '',
      subtitle: evt.subtitle || '',
      category: evt.category || 'Bakti Sosial (AMF)',
      period: evt.period || '',
      eventDate: evt.eventDate || '',
      location: evt.location || '',
      status: evt.status || 'completed',
      isDonationOpen: Boolean(evt.isDonationOpen),
      poster: evt.poster || 'assets/images/image04.jpg',
      targetAmount: evt.targetAmount || 0,
      collectedAmount: evt.collectedAmount || 0,
      description: evt.description || '',
      completionReport: evt.completionReport || '',
      deliverables: Array.isArray(evt.deliverables)
        ? evt.deliverables.join('\n')
        : '',
      registrationUrl: evt.registrationUrl || '',
    });
    setShowEventForm(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingEventId) {
        const res = await updateEventApi(editingEventId, eventForm);
        onStateChange(res.state);
        showToast('Perubahan kegiatan berhasil disimpan!');
      } else {
        const res = await createEventApi(eventForm);
        onStateChange(res.state);
        showToast('Kegiatan baru berhasil ditambahkan!');
      }
      setShowEventForm(false);
      setEditingEventId(null);
      setEventForm(EMPTY_EVENT_FORM);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (evtId) => {
    setLoading(true);
    try {
      const res = await deleteEventApi(evtId);
      onStateChange(res.state);
      showToast('Kegiatan berhasil dihapus.');
    } finally {
      setLoading(false);
    }
  };

  // Donation Config Handlers
  const handleToggleGlobalDonation = async (nextOpen) => {
    setLoading(true);
    try {
      const updated = {
        ...configDraft,
        isOpen: nextOpen,
        statusBadgeText: nextOpen
          ? 'OPEN DONATION — SEDANG BERLANGSUNG'
          : 'PROGRAM DONASI TELAH SELESAI',
      };
      const res = await updateDonationConfigApi(updated);
      onStateChange(res.state);
      showToast(
        nextOpen
          ? 'Penerimaan donasi berhasil dibuka!'
          : 'Periode donasi ditandai selesai.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDonationConfig = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateDonationConfigApi(configDraft);
      onStateChange(res.state);
      showToast('Pengaturan donasi, rekening & narahubung berhasil disimpan!');
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualLog = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createDonationLogApi({
        ...newLogForm,
        status: 'verified',
      });
      onStateChange(res.state);
      setNewLogForm({
        donorName: '',
        type: 'Donasi Dana Tunai',
        amount: 100000,
        bankTarget: 'BRI',
        eventTitle: 'Program Bakti Sosial AMF',
      });
      showToast('Catatan penyaluran donasi berhasil ditambahkan.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerifyDonation = async (log) => {
    const nextStatus = log.status === 'verified' ? 'pending' : 'verified';
    const res = await patchDonationLogApi(log.id, { status: nextStatus });
    onStateChange(res.state);
    showToast(`Status donasi ${log.donorName} diperbarui.`);
  };

  const handleDeleteDonationLog = async (logId) => {
    const res = await deleteDonationLogApi(logId);
    onStateChange(res.state);
    showToast('Catatan donasi dihapus.');
  };

  // Gallery Handlers
  const handleAddGalleryPhoto = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const targetAlbum = DOCUMENTATION_ALBUMS.find(
        (a) => a.id === newPhotoForm.albumId
      );
      const res = await createGalleryPhotoApi({
        ...newPhotoForm,
        albumTitle: targetAlbum?.exactTitle || newPhotoForm.title,
      });
      onStateChange(res.state);
      setNewPhotoForm({
        title: '',
        caption: '',
        year: new Date().getFullYear().toString(),
        division: 'Divisi AMF',
        albumId: 'gallery05',
        src: 'assets/images/gallery01/4a1c84c9.jpg',
      });
      showToast('Foto dokumentasi baru berhasil ditambahkan ke galeri!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGalleryPhoto = async (photoId) => {
    const res = await deleteGalleryPhotoApi(photoId);
    onStateChange(res.state);
    showToast('Foto dokumentasi dihapus.');
  };

  const handleSaveBackendUrl = async (e) => {
    e.preventDefault();
    setCustomApiBaseUrl(apiUrlInput);
    setLoading(true);
    const refreshed = await fetchPublicState();
    onStateChange(refreshed.state);
    if (onBackendStatusChange) onBackendStatusChange(refreshed.backendStatus);
    setLoading(false);
    showToast(`Endpoint Backend diatur ke ${refreshed.apiUrl}`);
  };

  const handleResetAllData = async () => {
    setLoading(true);
    const res = await resetBackendDatabaseApi();
    onStateChange(res.state);
    setLoading(false);
    showToast('Seluruh konten website dikembalikan ke pengaturan awal.');
  };

  const currentEditDiv = divisionsDraft[selectedEditDivIdx] || divisionsDraft[0];

  return (
    <div
      className="am-cmd-backdrop am-admin-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Sistem Manajemen Konten Admin"
    >
      <div className="am-admin-modal" onClick={(e) => e.stopPropagation()}>
        {/* TOP BAR */}
        <div className="am-admin-topbar">
          <div className="am-admin-topbar-left">
            <div className="am-admin-shield">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2>CMS & Panel Kontrol Website Ambulu Mengajar</h2>
              <div className="am-admin-conn-row">
                <span
                  className={`am-conn-dot ${
                    backendStatus === 'online' ? 'is-online' : 'is-fallback'
                  }`}
                />
                <span>
                  {backendStatus === 'online'
                    ? `Terhubung ke Server Backend (${getApiBaseUrl()})`
                    : `Sinkronisasi Aktif (${getApiBaseUrl()})`}
                </span>
              </div>
            </div>
          </div>

          <div className="am-admin-topbar-right">
            {adminUser && (
              <button
                type="button"
                className="am-btn am-btn-outline am-btn-sm"
                onClick={handleLogout}
              >
                <LogOut size={14} /> Keluar ({adminUser.username})
              </button>
            )}
            <button
              type="button"
              className="am-admin-close-btn"
              onClick={onClose}
              aria-label="Tutup Panel Admin"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {toastMsg && (
          <div className="am-admin-toast">
            <CheckCircle2 size={16} />
            <span>{toastMsg}</span>
          </div>
        )}

        {!adminUser ? (
          /* ================================================================
             VIEW 1: ADMIN LOGIN FORM
             ================================================================ */
          <div className="am-admin-login-stage">
            <div className="am-admin-login-card">
              <div className="am-login-badge">
                <KeyRound size={15} /> Autentikasi Pengurus
              </div>
              <h3>Login Panel Admin</h3>
              <p>
                Masuk untuk mengelola seluruh konten website: Profil & Hero,
                Sejarah & Visi-Misi, 4 Divisi, Kegiatan, Donasi & Rekening,
                Galeri Dokumentasi, hingga FAQ.
              </p>

              {authError && (
                <div className="am-login-error">
                  <AlertCircle size={16} />
                  <span>{authError}</span>
                </div>
              )}

              <form
                onSubmit={handleLoginSubmit}
                className="am-admin-login-form"
              >
                <div className="am-form-group">
                  <label htmlFor="adminUser">Username Admin</label>
                  <input
                    id="adminUser"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                  />
                </div>

                <div className="am-form-group">
                  <label htmlFor="adminPass">Password Admin</label>
                  <input
                    id="adminPass"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password admin..."
                  />
                </div>

                <div className="am-login-demo-box">
                  <div>
                    <strong>Akses Pengurus:</strong>
                    <span>
                      Username: <code>admin</code> • Password:{' '}
                      <code>ambulumengajar2026</code>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="am-demo-fill-btn"
                    onClick={() => {
                      setUsername('admin');
                      setPassword('ambulumengajar2026');
                    }}
                  >
                    <Sparkles size={13} /> Isi Otomatis
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="am-btn am-btn-primary am-btn-full"
                >
                  <ShieldCheck size={17} />
                  <span>
                    {loading ? 'Memverifikasi...' : 'Masuk ke Panel Kontrol'}
                  </span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ================================================================
             VIEW 2: FULL CMS ADMIN DASHBOARD (7 TABS FOR ENTIRE FRONTEND)
             ================================================================ */
          <div className="am-admin-dashboard">
            <div className="am-admin-tabs">
              <button
                type="button"
                className={`am-admin-tab ${
                  activeTab === 'profile' ? 'is-active' : ''
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <Building2 size={14} />
                <span>1. Profil & Hero</span>
              </button>
              <button
                type="button"
                className={`am-admin-tab ${
                  activeTab === 'about' ? 'is-active' : ''
                }`}
                onClick={() => setActiveTab('about')}
              >
                <Compass size={14} />
                <span>2. Visi, Misi & Sejarah</span>
              </button>
              <button
                type="button"
                className={`am-admin-tab ${
                  activeTab === 'divisions' ? 'is-active' : ''
                }`}
                onClick={() => setActiveTab('divisions')}
              >
                <Layers size={14} />
                <span>3. Empat Divisi</span>
              </button>
              <button
                type="button"
                className={`am-admin-tab ${
                  activeTab === 'events' ? 'is-active' : ''
                }`}
                onClick={() => setActiveTab('events')}
              >
                <Calendar size={14} />
                <span>4. Program & Event</span>
              </button>
              <button
                type="button"
                className={`am-admin-tab ${
                  activeTab === 'donations' ? 'is-active' : ''
                }`}
                onClick={() => setActiveTab('donations')}
              >
                <HeartHandshake size={14} />
                <span>5. Donasi & Rekening</span>
              </button>
              <button
                type="button"
                className={`am-admin-tab ${
                  activeTab === 'media-faq' ? 'is-active' : ''
                }`}
                onClick={() => setActiveTab('media-faq')}
              >
                <Camera size={14} />
                <span>6. Galeri, FAQ & Sosmed</span>
              </button>
              <button
                type="button"
                className={`am-admin-tab ${
                  activeTab === 'backend' ? 'is-active' : ''
                }`}
                onClick={() => setActiveTab('backend')}
              >
                <Server size={14} />
                <span>7. Server & Reset</span>
              </button>
            </div>

            {/* ==============================================================
                TAB 1: PROFIL ORGANISASI & HERO UTAMA
               ============================================================== */}
            {activeTab === 'profile' && (
              <div className="am-admin-panel-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveCmsPayload(
                      { orgInfo: orgDraft, heroStats: statsDraft },
                      'Profil Organisasi & Statistik Hero berhasil diperbarui!'
                    );
                  }}
                  className="am-card am-admin-config-form"
                >
                  <h4>Pengaturan Identitas & Teks Hero Utama</h4>
                  <div className="am-form-row">
                    <div className="am-form-group">
                      <label>Nama Organisasi</label>
                      <input
                        type="text"
                        value={orgDraft.name || ''}
                        onChange={(e) =>
                          setOrgDraft({ ...orgDraft, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="am-form-group">
                      <label>Kategori Organisasi</label>
                      <input
                        type="text"
                        value={orgDraft.category || ''}
                        onChange={(e) =>
                          setOrgDraft({ ...orgDraft, category: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="am-form-row">
                    <div className="am-form-group">
                      <label>Tagline / Slogan</label>
                      <input
                        type="text"
                        value={orgDraft.tagline || ''}
                        onChange={(e) =>
                          setOrgDraft({ ...orgDraft, tagline: e.target.value })
                        }
                      />
                    </div>
                    <div className="am-form-group">
                      <label>Lokasi & Wilayah</label>
                      <input
                        type="text"
                        value={orgDraft.location || ''}
                        onChange={(e) =>
                          setOrgDraft({ ...orgDraft, location: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="am-form-group">
                    <label>Deskripsi Utama Organisasi (Tab Profil Utama)</label>
                    <textarea
                      rows={3}
                      value={orgDraft.description || ''}
                      onChange={(e) =>
                        setOrgDraft({
                          ...orgDraft,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="am-form-row">
                    <div className="am-form-group">
                      <label>Teks Fokus Pendidikan (Tab 2 Hero)</label>
                      <textarea
                        rows={3}
                        value={orgDraft.educationFocus || ''}
                        onChange={(e) =>
                          setOrgDraft({
                            ...orgDraft,
                            educationFocus: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="am-form-group">
                      <label>Teks Fokus Beasiswa & Sosial (Tab 3 Hero)</label>
                      <textarea
                        rows={3}
                        value={orgDraft.socialFocus || ''}
                        onChange={(e) =>
                          setOrgDraft({
                            ...orgDraft,
                            socialFocus: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <h4>Empat Kartu Statistik Hero</h4>
                  <div className="am-form-row">
                    {statsDraft.map((st, idx) => (
                      <div
                        key={st.id || idx}
                        className="am-card"
                        style={{
                          padding: '1rem',
                          background: 'rgba(0,0,0,0.2)',
                        }}
                      >
                        <div className="am-form-group">
                          <label>Angka / Nilai Metrik {idx + 1}</label>
                          <input
                            type="text"
                            value={st.value}
                            onChange={(e) => {
                              const next = [...statsDraft];
                              next[idx] = { ...st, value: e.target.value };
                              setStatsDraft(next);
                            }}
                          />
                        </div>
                        <div className="am-form-group">
                          <label>Judul Metrik {idx + 1}</label>
                          <input
                            type="text"
                            value={st.label}
                            onChange={(e) => {
                              const next = [...statsDraft];
                              next[idx] = { ...st, label: e.target.value };
                              setStatsDraft(next);
                            }}
                          />
                        </div>
                        <div className="am-form-group">
                          <label>Keterangan Detail</label>
                          <input
                            type="text"
                            value={st.detail}
                            onChange={(e) => {
                              const next = [...statsDraft];
                              next[idx] = { ...st, detail: e.target.value };
                              setStatsDraft(next);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="am-btn am-btn-primary am-btn-sm"
                  >
                    <Save size={15} /> Simpan Profil & Hero
                  </button>
                </form>
              </div>
            )}

            {/* ==============================================================
                TAB 2: VISI, MISI & SEJARAH ORGANISASI
               ============================================================== */}
            {activeTab === 'about' && (
              <div className="am-admin-panel-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveCmsPayload(
                      {
                        visionMission: {
                          vision: visionDraft,
                          missions: missionsDraft,
                        },
                        milestones: milestonesDraft,
                      },
                      'Visi, Misi & Sejarah berhasil diperbarui!'
                    );
                  }}
                  className="am-card am-admin-config-form"
                >
                  <h4>Visi & Pilar Misi Organisasi</h4>
                  <div className="am-form-group">
                    <label>Teks Visi Utama</label>
                    <textarea
                      rows={3}
                      value={visionDraft}
                      onChange={(e) => setVisionDraft(e.target.value)}
                    />
                  </div>

                  <div className="am-admin-panel-head">
                    <h4>Daftar Pilar Misi ({missionsDraft.length})</h4>
                    <button
                      type="button"
                      className="am-btn am-btn-outline am-btn-sm"
                      onClick={() =>
                        setMissionsDraft([
                          ...missionsDraft,
                          {
                            id: `mis-${Date.now()}`,
                            title: 'Pilar Misi Baru',
                            desc: 'Deskripsi pilar misi...',
                          },
                        ])
                      }
                    >
                      <Plus size={14} /> Tambah Misi
                    </button>
                  </div>

                  {missionsDraft.map((m, idx) => (
                    <div key={m.id || idx} className="am-form-row">
                      <div className="am-form-group">
                        <label>Judul Misi {idx + 1}</label>
                        <input
                          type="text"
                          value={m.title}
                          onChange={(e) => {
                            const next = [...missionsDraft];
                            next[idx] = { ...m, title: e.target.value };
                            setMissionsDraft(next);
                          }}
                        />
                      </div>
                      <div
                        className="am-form-group"
                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}
                      >
                        <div style={{ flex: 1 }}>
                          <label>Penjelasan Misi {idx + 1}</label>
                          <input
                            type="text"
                            value={m.desc}
                            onChange={(e) => {
                              const next = [...missionsDraft];
                              next[idx] = { ...m, desc: e.target.value };
                              setMissionsDraft(next);
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          className="am-btn am-btn-danger am-btn-sm"
                          onClick={() =>
                            setMissionsDraft(
                              missionsDraft.filter((_, i) => i !== idx)
                            )
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="am-admin-panel-head" style={{ marginTop: '1rem' }}>
                    <h4>Jejak Sejarah / Milestone ({milestonesDraft.length})</h4>
                    <button
                      type="button"
                      className="am-btn am-btn-outline am-btn-sm"
                      onClick={() =>
                        setMilestonesDraft([
                          ...milestonesDraft,
                          {
                            id: `ms-${Date.now()}`,
                            year: '2026',
                            badge: 'Fase Baru',
                            title: 'Tonggak Sejarah Baru',
                            desc: 'Deskripsi capaian sejarah...',
                          },
                        ])
                      }
                    >
                      <Plus size={14} /> Tambah Tahun Sejarah
                    </button>
                  </div>

                  {milestonesDraft.map((ms, idx) => (
                    <div
                      key={ms.id || idx}
                      className="am-card"
                      style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)' }}
                    >
                      <div className="am-form-row">
                        <div className="am-form-group">
                          <label>Tahun / Periode</label>
                          <input
                            type="text"
                            value={ms.year}
                            onChange={(e) => {
                              const next = [...milestonesDraft];
                              next[idx] = { ...ms, year: e.target.value };
                              setMilestonesDraft(next);
                            }}
                          />
                        </div>
                        <div className="am-form-group">
                          <label>Judul Tonggak Sejarah</label>
                          <input
                            type="text"
                            value={ms.title}
                            onChange={(e) => {
                              const next = [...milestonesDraft];
                              next[idx] = { ...ms, title: e.target.value };
                              setMilestonesDraft(next);
                            }}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'flex-end',
                          marginTop: '0.5rem',
                        }}
                      >
                        <div className="am-form-group" style={{ flex: 1 }}>
                          <label>Deskripsi Sejarah</label>
                          <input
                            type="text"
                            value={ms.desc}
                            onChange={(e) => {
                              const next = [...milestonesDraft];
                              next[idx] = { ...ms, desc: e.target.value };
                              setMilestonesDraft(next);
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          className="am-btn am-btn-danger am-btn-sm"
                          onClick={() =>
                            setMilestonesDraft(
                              milestonesDraft.filter((_, i) => i !== idx)
                            )
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={loading}
                    className="am-btn am-btn-primary am-btn-sm"
                  >
                    <Save size={15} /> Simpan Visi, Misi & Sejarah
                  </button>
                </form>
              </div>
            )}

            {/* ==============================================================
                TAB 3: KELOLA 4 DIVISI ORGANISASI
               ============================================================== */}
            {activeTab === 'divisions' && currentEditDiv && (
              <div className="am-admin-panel-body">
                <div className="am-event-filter-pills">
                  {divisionsDraft.map((d, idx) => (
                    <button
                      key={d.id}
                      type="button"
                      className={`am-filter-pill ${
                        selectedEditDivIdx === idx ? 'is-active' : ''
                      }`}
                      onClick={() => setSelectedEditDivIdx(idx)}
                    >
                      Edit Divisi {d.code}
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveCmsPayload(
                      { divisions: divisionsDraft },
                      `Data Divisi ${currentEditDiv.code} berhasil diperbarui!`
                    );
                  }}
                  className="am-card am-admin-config-form"
                >
                  <h4>Edit Detail {currentEditDiv.exactTitle}</h4>
                  <div className="am-form-row">
                    <div className="am-form-group">
                      <label>Judul Tampilan Divisi</label>
                      <input
                        type="text"
                        value={currentEditDiv.exactTitle || ''}
                        onChange={(e) => {
                          const next = [...divisionsDraft];
                          next[selectedEditDivIdx] = {
                            ...currentEditDiv,
                            exactTitle: e.target.value,
                          };
                          setDivisionsDraft(next);
                        }}
                      />
                    </div>
                    <div className="am-form-group">
                      <label>Nama Lengkap Divisi</label>
                      <input
                        type="text"
                        value={currentEditDiv.fullName || ''}
                        onChange={(e) => {
                          const next = [...divisionsDraft];
                          next[selectedEditDivIdx] = {
                            ...currentEditDiv,
                            fullName: e.target.value,
                          };
                          setDivisionsDraft(next);
                        }}
                      />
                    </div>
                  </div>

                  <div className="am-form-group">
                    <label>Tagline Divisi</label>
                    <input
                      type="text"
                      value={currentEditDiv.tagline || ''}
                      onChange={(e) => {
                        const next = [...divisionsDraft];
                        next[selectedEditDivIdx] = {
                          ...currentEditDiv,
                          tagline: e.target.value,
                        };
                        setDivisionsDraft(next);
                      }}
                    />
                  </div>

                  <div className="am-form-group">
                    <label>Deskripsi Lengkap Divisi</label>
                    <textarea
                      rows={3}
                      value={currentEditDiv.description || ''}
                      onChange={(e) => {
                        const next = [...divisionsDraft];
                        next[selectedEditDivIdx] = {
                          ...currentEditDiv,
                          description: e.target.value,
                        };
                        setDivisionsDraft(next);
                      }}
                    />
                  </div>

                  <div className="am-form-group">
                    <label>
                      Fokus & Tanggung Jawab Utama (Pisahkan per baris)
                    </label>
                    <textarea
                      rows={3}
                      value={(currentEditDiv.carrdPoints || []).join('\n')}
                      onChange={(e) => {
                        const next = [...divisionsDraft];
                        next[selectedEditDivIdx] = {
                          ...currentEditDiv,
                          carrdPoints: e.target.value
                            .split('\n')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        };
                        setDivisionsDraft(next);
                      }}
                    />
                  </div>

                  <div className="am-form-group">
                    <label>Program Kerja Divisi (Pisahkan per baris)</label>
                    <textarea
                      rows={4}
                      value={(currentEditDiv.programs || [])
                        .map((p) => (typeof p === 'string' ? p : p.name))
                        .join('\n')}
                      onChange={(e) => {
                        const next = [...divisionsDraft];
                        next[selectedEditDivIdx] = {
                          ...currentEditDiv,
                          programs: e.target.value
                            .split('\n')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        };
                        setDivisionsDraft(next);
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="am-btn am-btn-primary am-btn-sm"
                  >
                    <Save size={15} /> Simpan Perubahan Divisi
                  </button>
                </form>
              </div>
            )}

            {/* ==============================================================
                TAB 4: KELOLA PROGRAM & EVENT
               ============================================================== */}
            {activeTab === 'events' && (
              <div className="am-admin-panel-body">
                <div className="am-admin-panel-head">
                  <div>
                    <h3>Daftar Program & Kegiatan</h3>
                    <p>
                      Kelola status pelaksanaan kegiatan, laporan penyaluran, dan
                      agenda baru.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="am-btn am-btn-primary am-btn-sm"
                    onClick={() => {
                      setEditingEventId(null);
                      setEventForm(EMPTY_EVENT_FORM);
                      setShowEventForm(!showEventForm);
                    }}
                  >
                    <Plus size={15} />
                    <span>
                      {showEventForm ? 'Tutup Formulir' : 'Tambah Kegiatan Baru'}
                    </span>
                  </button>
                </div>

                {showEventForm && (
                  <form
                    onSubmit={handleSaveEvent}
                    className="am-card am-admin-event-form"
                  >
                    <h4>
                      {editingEventId
                        ? 'Edit Data Kegiatan'
                        : 'Tambah Kegiatan Baru'}
                    </h4>
                    <div className="am-form-row">
                      <div className="am-form-group">
                        <label>Judul Kegiatan</label>
                        <input
                          type="text"
                          required
                          value={eventForm.title}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="am-form-group">
                        <label>Kategori / Divisi</label>
                        <input
                          type="text"
                          value={eventForm.category}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              category: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="am-form-row">
                      <div className="am-form-group">
                        <label>Periode Pelaksanaan</label>
                        <input
                          type="text"
                          required
                          value={eventForm.period}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              period: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="am-form-group">
                        <label>Status Kegiatan</label>
                        <select
                          value={eventForm.status}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="completed">Telah Terlaksana</option>
                          <option value="ongoing">Sedang Berlangsung</option>
                          <option value="upcoming">Agenda Berikutnya</option>
                        </select>
                      </div>
                    </div>

                    <div className="am-form-row">
                      <div className="am-form-group">
                        <label>Lokasi Kegiatan</label>
                        <input
                          type="text"
                          value={eventForm.location}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="am-form-group">
                        <label>Path / URL Poster</label>
                        <input
                          type="text"
                          value={eventForm.poster}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              poster: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="am-form-group">
                      <label>Ringkasan Pelaksanaan / Laporan Kegiatan</label>
                      <textarea
                        rows={2}
                        value={eventForm.completionReport}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            completionReport: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="am-form-group">
                      <label>
                        Cakupan & Realisasi Program (Pisahkan per baris)
                      </label>
                      <textarea
                        rows={3}
                        value={eventForm.deliverables}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            deliverables: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="am-admin-form-actions">
                      <button
                        type="button"
                        className="am-btn am-btn-outline am-btn-sm"
                        onClick={() => setShowEventForm(false)}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="am-btn am-btn-primary am-btn-sm"
                      >
                        Simpan Kegiatan
                      </button>
                    </div>
                  </form>
                )}

                <div className="am-admin-events-list">
                  {(backendState?.events || []).map((evt) => (
                    <div key={evt.id} className="am-card am-admin-event-item">
                      <div className="am-admin-evt-main">
                        <div className="am-admin-evt-badges">
                          <span
                            className={`am-evt-mini-badge is-${evt.status}`}
                          >
                            {evt.status === 'completed'
                              ? 'Telah Terlaksana'
                              : evt.status === 'ongoing'
                              ? 'Sedang Berlangsung'
                              : 'Agenda Berikutnya'}
                          </span>
                          <span className="am-admin-evt-cat">
                            {evt.category}
                          </span>
                        </div>
                        <h4>{evt.title}</h4>
                        <p className="am-admin-evt-meta">
                          Periode: <strong>{evt.period}</strong> • Lokasi:{' '}
                          {evt.location}
                        </p>
                      </div>

                      <div className="am-admin-evt-controls">
                        <div className="am-quick-status-group">
                          <span>Status:</span>
                          <div className="am-quick-status-btns">
                            <button
                              type="button"
                              className={`am-qstatus-btn ${
                                evt.status === 'completed' ? 'is-active' : ''
                              }`}
                              onClick={() =>
                                handleQuickEventStatus(evt.id, 'completed')
                              }
                            >
                              Terlaksana
                            </button>
                            <button
                              type="button"
                              className={`am-qstatus-btn ${
                                evt.status === 'ongoing' ? 'is-active' : ''
                              }`}
                              onClick={() =>
                                handleQuickEventStatus(evt.id, 'ongoing')
                              }
                            >
                              Berlangsung
                            </button>
                            <button
                              type="button"
                              className={`am-qstatus-btn ${
                                evt.status === 'upcoming' ? 'is-active' : ''
                              }`}
                              onClick={() =>
                                handleQuickEventStatus(evt.id, 'upcoming')
                              }
                            >
                              Agenda Baru
                            </button>
                          </div>
                        </div>

                        <div className="am-admin-evt-actions">
                          <button
                            type="button"
                            className="am-btn am-btn-outline am-btn-sm"
                            onClick={() => handleStartEditEvent(evt)}
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            className="am-btn am-btn-danger am-btn-sm"
                            onClick={() => handleDeleteEvent(evt.id)}
                          >
                            <Trash2 size={14} /> Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 5: DONASI, REKENING BANK & NARAHUBUNG
               ============================================================== */}
            {activeTab === 'donations' && (
              <div className="am-admin-panel-body">
                <div className="am-card am-admin-donation-toggle-card">
                  <div className="am-dtoggle-info">
                    <span
                      className={`am-live-status-pill ${
                        configDraft.isOpen ? 'is-open' : 'is-closed'
                      }`}
                    >
                      {configDraft.isOpen
                        ? 'OPEN DONATION AKTIF'
                        : 'PERIODE DONASI SELESAI / DITUTUP'}
                    </span>
                    <h3>Status Penerimaan Donasi Publik</h3>
                    <p>
                      Aktifkan tombol di samping saat membuka penggalangan donasi
                      baru, atau tutup saat program telah selesai dilaksanakan.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={loading}
                    className={`am-btn ${
                      configDraft.isOpen ? 'am-btn-danger' : 'am-btn-primary'
                    }`}
                    onClick={() =>
                      handleToggleGlobalDonation(!configDraft.isOpen)
                    }
                  >
                    {configDraft.isOpen ? (
                      <>
                        <Lock size={16} /> Tandai Donasi Selesai
                      </>
                    ) : (
                      <>
                        <Unlock size={16} /> Buka Periode Donasi Baru
                      </>
                    )}
                  </button>
                </div>

                <form
                  onSubmit={handleSaveDonationConfig}
                  className="am-card am-admin-config-form"
                >
                  <h4>Pengaturan Teks & Rekening Resmi</h4>
                  <div className="am-form-group">
                    <label>Judul Program Donasi</label>
                    <input
                      type="text"
                      value={configDraft.campaignTitle || ''}
                      onChange={(e) =>
                        setConfigDraft({
                          ...configDraft,
                          campaignTitle: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="am-form-group">
                    <label>Judul Laporan Saat Periode Donasi Selesai</label>
                    <input
                      type="text"
                      value={configDraft.closedNoticeTitle || ''}
                      onChange={(e) =>
                        setConfigDraft({
                          ...configDraft,
                          closedNoticeTitle: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="am-form-group">
                    <label>Deskripsi Laporan Penyelesaian Donasi</label>
                    <textarea
                      rows={3}
                      value={configDraft.closedNoticeDesc || ''}
                      onChange={(e) =>
                        setConfigDraft({
                          ...configDraft,
                          closedNoticeDesc: e.target.value,
                        })
                      }
                    />
                  </div>

                  <h4>Daftar Rekening Resmi</h4>
                  {(configDraft.bankAccounts || []).map((acc, idx) => (
                    <div key={acc.id || idx} className="am-form-row">
                      <div className="am-form-group">
                        <label>Nama Bank / E-Wallet</label>
                        <input
                          type="text"
                          value={acc.bank}
                          onChange={(e) => {
                            const next = [...(configDraft.bankAccounts || [])];
                            next[idx] = { ...acc, bank: e.target.value };
                            setConfigDraft({
                              ...configDraft,
                              bankAccounts: next,
                            });
                          }}
                        />
                      </div>
                      <div className="am-form-group">
                        <label>Nomor Rekening & Atas Nama</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            value={acc.number}
                            placeholder="Nomor Rekening"
                            onChange={(e) => {
                              const next = [
                                ...(configDraft.bankAccounts || []),
                              ];
                              next[idx] = {
                                ...acc,
                                number: e.target.value,
                                numberClean: e.target.value.replace(/\s+/g, ''),
                              };
                              setConfigDraft({
                                ...configDraft,
                                bankAccounts: next,
                              });
                            }}
                          />
                          <input
                            type="text"
                            value={acc.holder}
                            placeholder="Atas Nama"
                            onChange={(e) => {
                              const next = [
                                ...(configDraft.bankAccounts || []),
                              ];
                              next[idx] = { ...acc, holder: e.target.value };
                              setConfigDraft({
                                ...configDraft,
                                bankAccounts: next,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={loading}
                    className="am-btn am-btn-primary am-btn-sm"
                  >
                    <Save size={15} /> Simpan Pengaturan Donasi & Rekening
                  </button>
                </form>

                {/* Riwayat Donatur */}
                <form
                  onSubmit={handleAddManualLog}
                  className="am-card am-admin-config-form"
                >
                  <h4>Tambah Riwayat Penyaluran / Donatur</h4>
                  <div className="am-form-row">
                    <div className="am-form-group">
                      <label>Nama Donatur</label>
                      <input
                        type="text"
                        required
                        value={newLogForm.donorName}
                        onChange={(e) =>
                          setNewLogForm({
                            ...newLogForm,
                            donorName: e.target.value,
                          })
                        }
                        placeholder="Hamba Allah"
                      />
                    </div>
                    <div className="am-form-group">
                      <label>Nominal (Rp)</label>
                      <input
                        type="number"
                        value={newLogForm.amount}
                        onChange={(e) =>
                          setNewLogForm({
                            ...newLogForm,
                            amount: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="am-btn am-btn-outline am-btn-sm"
                  >
                    <Plus size={14} /> Tambah Riwayat
                  </button>

                  <div className="am-admin-events-list">
                    {(backendState?.donationsLog || []).map((log) => (
                      <div key={log.id} className="am-card am-admin-event-item">
                        <div className="am-admin-evt-main">
                          <h4>
                            {log.donorName} — Rp{' '}
                            {Number(log.amount || 0).toLocaleString('id-ID')}
                          </h4>
                          <p className="am-admin-evt-meta">
                            {log.type} • {log.eventTitle}
                          </p>
                        </div>
                        <div className="am-admin-evt-actions">
                          <button
                            type="button"
                            className="am-btn am-btn-outline am-btn-sm"
                            onClick={() => handleToggleVerifyDonation(log)}
                          >
                            {log.status === 'verified'
                              ? 'Tersalurkan'
                              : 'Verifikasi'}
                          </button>
                          <button
                            type="button"
                            className="am-btn am-btn-danger am-btn-sm"
                            onClick={() => handleDeleteDonationLog(log.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </form>
              </div>
            )}

            {/* ==============================================================
                TAB 6: GALERI DOKUMENTASI, FAQ & SOSIAL MEDIA
               ============================================================== */}
            {activeTab === 'media-faq' && (
              <div className="am-admin-panel-body">
                {/* Tambah Foto Dokumentasi */}
                <form
                  onSubmit={handleAddGalleryPhoto}
                  className="am-card am-admin-config-form"
                >
                  <h4>Tambah Foto Dokumentasi Kegiatan</h4>
                  <div className="am-form-row">
                    <div className="am-form-group">
                      <label>Pilih Album Kegiatan</label>
                      <select
                        value={newPhotoForm.albumId}
                        onChange={(e) =>
                          setNewPhotoForm({
                            ...newPhotoForm,
                            albumId: e.target.value,
                          })
                        }
                      >
                        {DOCUMENTATION_ALBUMS.map((alb) => (
                          <option key={alb.id} value={alb.id}>
                            {alb.exactTitle}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="am-form-group">
                      <label>URL / Path Gambar</label>
                      <input
                        type="text"
                        required
                        value={newPhotoForm.src}
                        onChange={(e) =>
                          setNewPhotoForm({
                            ...newPhotoForm,
                            src: e.target.value,
                          })
                        }
                        placeholder="https://... atau assets/images/..."
                      />
                    </div>
                  </div>
                  <div className="am-form-row">
                    <div className="am-form-group">
                      <label>Keterangan Foto (Caption)</label>
                      <input
                        type="text"
                        required
                        value={newPhotoForm.caption}
                        onChange={(e) =>
                          setNewPhotoForm({
                            ...newPhotoForm,
                            caption: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="am-form-group">
                      <label>Tahun Kegiatan</label>
                      <input
                        type="text"
                        value={newPhotoForm.year}
                        onChange={(e) =>
                          setNewPhotoForm({
                            ...newPhotoForm,
                            year: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="am-btn am-btn-primary am-btn-sm"
                  >
                    <Plus size={14} /> Tambahkan Foto ke Galeri
                  </button>

                  {(backendState?.customPhotos || []).length > 0 && (
                    <div className="am-admin-events-list">
                      {(backendState?.customPhotos || []).map((ph) => (
                        <div
                          key={ph.id}
                          className="am-card am-admin-event-item"
                        >
                          <div className="am-admin-evt-main">
                            <h4>{ph.albumTitle}</h4>
                            <p className="am-admin-evt-meta">{ph.caption}</p>
                          </div>
                          <button
                            type="button"
                            className="am-btn am-btn-danger am-btn-sm"
                            onClick={() => handleDeleteGalleryPhoto(ph.id)}
                          >
                            <Trash2 size={14} /> Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </form>

                {/* Edit FAQ & Sosial Media */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveCmsPayload(
                      { faqs: faqsDraft, socialLinks: socialsDraft },
                      'Daftar FAQ & Tautan Sosial Media berhasil diperbarui!'
                    );
                  }}
                  className="am-card am-admin-config-form"
                >
                  <div className="am-admin-panel-head">
                    <h4>Daftar Tanya Jawab / FAQ ({faqsDraft.length})</h4>
                    <button
                      type="button"
                      className="am-btn am-btn-outline am-btn-sm"
                      onClick={() =>
                        setFaqsDraft([
                          ...faqsDraft,
                          {
                            id: `faq-${Date.now()}`,
                            category: 'profil',
                            badge: 'Informasi Umum',
                            q: 'Pertanyaan Baru?',
                            a: 'Jawaban lengkap...',
                          },
                        ])
                      }
                    >
                      <Plus size={14} /> Tambah FAQ
                    </button>
                  </div>

                  {faqsDraft.map((fq, idx) => (
                    <div
                      key={fq.id || idx}
                      className="am-card"
                      style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)' }}
                    >
                      <div className="am-form-group">
                        <label>Pertanyaan {idx + 1}</label>
                        <input
                          type="text"
                          value={fq.q}
                          onChange={(e) => {
                            const next = [...faqsDraft];
                            next[idx] = { ...fq, q: e.target.value };
                            setFaqsDraft(next);
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'flex-end',
                          marginTop: '0.5rem',
                        }}
                      >
                        <div className="am-form-group" style={{ flex: 1 }}>
                          <label>Jawaban</label>
                          <textarea
                            rows={2}
                            value={fq.a}
                            onChange={(e) => {
                              const next = [...faqsDraft];
                              next[idx] = { ...fq, a: e.target.value };
                              setFaqsDraft(next);
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          className="am-btn am-btn-danger am-btn-sm"
                          onClick={() =>
                            setFaqsDraft(faqsDraft.filter((_, i) => i !== idx))
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <h4>Tautan Media Sosial Resmi</h4>
                  <div className="am-form-row">
                    {socialsDraft.map((soc, idx) => (
                      <div key={soc.id || idx} className="am-form-group">
                        <label>
                          {soc.name} ({soc.handle})
                        </label>
                        <input
                          type="text"
                          value={soc.url}
                          onChange={(e) => {
                            const next = [...socialsDraft];
                            next[idx] = { ...soc, url: e.target.value };
                            setSocialsDraft(next);
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="am-btn am-btn-primary am-btn-sm"
                  >
                    <Save size={15} /> Simpan FAQ & Sosial Media
                  </button>
                </form>
              </div>
            )}

            {/* ==============================================================
                TAB 7: SERVER BACKEND & RESET DATA
               ============================================================== */}
            {activeTab === 'backend' && (
              <div className="am-admin-panel-body">
                <div className="am-card am-admin-config-form">
                  <h4>Konfigurasi URL Server Backend</h4>
                  <form onSubmit={handleSaveBackendUrl} className="am-form-row">
                    <div className="am-form-group" style={{ flex: 1 }}>
                      <label>Endpoint API Backend</label>
                      <input
                        type="text"
                        value={apiUrlInput}
                        onChange={(e) => setApiUrlInput(e.target.value)}
                        placeholder="https://web-am-backend.vercel.app/api"
                      />
                    </div>
                    <button
                      type="submit"
                      className="am-btn am-btn-primary am-btn-sm"
                      style={{ alignSelf: 'flex-end' }}
                    >
                      <RefreshCw size={14} /> Simpan & Hubungkan
                    </button>
                  </form>
                </div>

                <div className="am-card am-admin-config-form">
                  <h4>Kembalikan Seluruh Konten ke Pengaturan Awal</h4>
                  <p className="am-channels-sub">
                    Gunakan tombol di bawah apabila ingin mengembalikan seluruh
                    teks, divisi, kegiatan, dan FAQ ke data standar.
                  </p>
                  <button
                    type="button"
                    className="am-btn am-btn-outline am-btn-sm"
                    onClick={handleResetAllData}
                  >
                    <RefreshCw size={14} /> Reset Seluruh Konten
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
