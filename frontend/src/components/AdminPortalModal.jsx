import React, { useState } from 'react';
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
  Coins,
  KeyRound,
  Sparkles,
  AlertCircle,
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
  resetBackendDatabaseApi,
  getApiBaseUrl,
  setCustomApiBaseUrl,
  fetchPublicState,
} from '../services/apiClient';

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
  // Login State
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'donation-config' | 'donation-log' | 'backend'

  // Event Form State
  const [editingEventId, setEditingEventId] = useState(null);
  const [ showEventForm, setShowEventForm ] = useState(false);
  const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM);

  // Donation Config Form State
  const donationConfig = backendState?.donationConfig || {
    isOpen: false,
    campaignTitle: '',
    closedNoticeTitle: '',
    closedNoticeDesc: '',
    activeNoticeDesc: '',
    bankAccounts: [],
    contactPersons: [],
  };
  const [configDraft, setConfigDraft] = useState(null);

  // Manual Donation Log Form
  const [newLogForm, setNewLogForm] = useState({
    donorName: '',
    type: 'Donasi Dana Tunai',
    amount: 100000,
    bankTarget: 'BRI',
    eventTitle: 'Program Bakti Sosial AMF',
  });

  // Backend API URL config
  const [apiUrlInput, setApiUrlInput] = useState(getApiBaseUrl());

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
      showToast(
        `Selamat datang, ${res.user.name}! (${
          res.mode === 'online' ? 'Terhubung ke Backend API' : 'Mode Sinkronisasi Lokal'
        })`
      );
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

  // Event Handlers
  const handleQuickEventStatus = async (evtId, newStatus) => {
    setLoading(true);
    try {
      const res = await patchEventStatusApi(evtId, {
        status: newStatus,
        isDonationOpen: newStatus === 'ongoing',
      });
      onStateChange(res.state);
      showToast(`Status event diubah menjadi "${newStatus.toUpperCase()}".`);
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
        showToast('Perubahan event berhasil disimpan!');
      } else {
        const res = await createEventApi(eventForm);
        onStateChange(res.state);
        showToast('Event baru berhasil ditambahkan!');
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
      showToast('Event berhasil dihapus.');
    } finally {
      setLoading(false);
    }
  };

  // Donation Config Handlers
  const activeConfig = configDraft || donationConfig;

  const handleToggleGlobalDonation = async (nextOpen) => {
    setLoading(true);
    try {
      const updated = {
        ...activeConfig,
        isOpen: nextOpen,
        statusBadgeText: nextOpen
          ? 'OPEN DONATION — SEDANG BERLANGSUNG'
          : 'DONASI DITUTUP — EVENT TELAH SELESAI',
      };
      const res = await updateDonationConfigApi(updated);
      onStateChange(res.state);
      setConfigDraft(null);
      showToast(
        nextOpen
          ? 'Open Donation berhasil DIBUKA untuk publik!'
          : 'Penggalangan Donasi berhasil DITUTUP (Event Selesai).'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDonationConfig = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateDonationConfigApi(activeConfig);
      onStateChange(res.state);
      setConfigDraft(null);
      showToast('Pengaturan kampanye donasi & pengumuman berhasil disimpan!');
    } finally {
      setLoading(false);
    }
  };

  // Donation Log Handlers
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
      showToast('Catatan donasi baru berhasil ditambahkan.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerifyDonation = async (log) => {
    const nextStatus = log.status === 'verified' ? 'pending' : 'verified';
    const res = await patchDonationLogApi(log.id, { status: nextStatus });
    onStateChange(res.state);
    showToast(`Status donasi ${log.donorName} diubah ke ${nextStatus}.`);
  };

  const handleDeleteDonationLog = async (logId) => {
    const res = await deleteDonationLogApi(logId);
    onStateChange(res.state);
    showToast('Catatan donasi dihapus.');
  };

  const handleSaveBackendUrl = async (e) => {
    e.preventDefault();
    setCustomApiBaseUrl(apiUrlInput);
    setLoading(true);
    const refreshed = await fetchPublicState();
    onStateChange(refreshed.state);
    if (onBackendStatusChange) onBackendStatusChange(refreshed.backendStatus);
    setLoading(false);
    showToast(
      `Endpoint Backend diatur ke ${refreshed.apiUrl} (${
        refreshed.backendStatus === 'online' ? 'Terhubung!' : 'Mode Fallback Lokal'
      })`
    );
  };

  const handleResetAllData = async () => {
    setLoading(true);
    const res = await resetBackendDatabaseApi();
    onStateChange(res.state);
    setConfigDraft(null);
    setLoading(false);
    showToast('Seluruh data berhasil dikembalikan ke pengaturan awal (Seed Data).');
  };

  return (
    <div
      className="am-cmd-backdrop am-admin-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Portal Admin Ambulu Mengajar"
    >
      <div
        className="am-admin-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BAR */}
        <div className="am-admin-topbar">
          <div className="am-admin-topbar-left">
            <div className="am-admin-shield">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2>Portal Admin & Manajemen Event</h2>
              <div className="am-admin-conn-row">
                <span
                  className={`am-conn-dot ${
                    backendStatus === 'online' ? 'is-online' : 'is-fallback'
                  }`}
                />
                <span>
                  {backendStatus === 'online'
                    ? `Terhubung ke Backend API (${getApiBaseUrl()})`
                    : `Sinkronisasi Aktif • Siap Koneksi ke Backend Vercel (${getApiBaseUrl()})`}
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

        {/* TOAST NOTIFICATION */}
        {toastMsg && (
          <div className="am-admin-toast">
            <CheckCircle2 size={16} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* CONTENT STAGE */}
        {!adminUser ? (
          /* ================================================================
             VIEW 1: ADMIN LOGIN FORM
             ================================================================ */
          <div className="am-admin-login-stage">
            <div className="am-admin-login-card">
              <div className="am-login-badge">
                <KeyRound size={15} /> Autentikasi Pengurus Ambulu Mengajar
              </div>
              <h3>Login Dashboard Admin</h3>
              <p>
                Masuk untuk mengubah status Event (Selesai / Segera Hadir /
                Sedang Berlangsung), membuka atau menutup Open Donation, serta
                mengelola laporan penyaluran AMF.
              </p>

              {authError && (
                <div className="am-login-error">
                  <AlertCircle size={16} />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="am-admin-login-form">
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
                    <strong>Kredensial Default Pengurus:</strong>
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
                  <span>{loading ? 'Memverifikasi...' : 'Masuk ke Dashboard Admin'}</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ================================================================
             VIEW 2: AUTHENTICATED ADMIN DASHBOARD
             ================================================================ */
          <div className="am-admin-dashboard">
            {/* NAVIGATION TABS */}
            <div className="am-admin-tabs">
              <button
                type="button"
                className={`am-admin-tab ${
                  activeTab === 'events' ? 'is-active' : ''
                }`}
                onClick={() => setActiveTab('events')}
              >
                <Calendar size={15} />
                <span>Kelola Event ({backendState?.events?.length || 0})</span>
              </button>
              <button
                type="button"
                className={`am-admin-tab ${
                  activeTab === 'donation-config' ? 'is-active' : ''
                }`}
                onClick={() => setActiveTab('donation-config')}
              >
                <HeartHandshake size={15} />
                <span>
                  Status Donasi (
                  {donationConfig.isOpen ? 'Dibuka' : 'Ditutup / Selesai'})
                </span>
              </button>
              <button
                type="button"
                className={`am-admin-tab ${
                  activeTab === 'donation-log' ? 'is-active' : ''
                }`}
                onClick={() => setActiveTab('donation-log')}
              >
                <Coins size={15} />
                <span>
                  Log Donatur ({backendState?.donationsLog?.length || 0})
                </span>
              </button>
              <button
                type="button"
                className={`am-admin-tab ${
                  activeTab === 'backend' ? 'is-active' : ''
                }`}
                onClick={() => setActiveTab('backend')}
              >
                <Server size={15} />
                <span>Koneksi Backend Vercel</span>
              </button>
            </div>

            {/* TAB 1: KELOLA EVENT */}
            {activeTab === 'events' && (
              <div className="am-admin-panel-body">
                <div className="am-admin-panel-head">
                  <div>
                    <h3>Daftar Program & Event Ambulu Mengajar</h3>
                    <p>
                      Ubah status event menjadi <strong>Selesai</strong>,{' '}
                      <strong>Segera Hadir</strong>, atau{' '}
                      <strong>Sedang Berlangsung</strong>, atau tambahkan event
                      baru.
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
                      {showEventForm ? 'Tutup Formulir' : 'Tambah Event Baru'}
                    </span>
                  </button>
                </div>

                {/* Form Tambah / Edit Event */}
                {showEventForm && (
                  <form
                    onSubmit={handleSaveEvent}
                    className="am-card am-admin-event-form"
                  >
                    <h4>
                      {editingEventId
                        ? 'Edit Data Event'
                        : 'Tambah Program / Event Baru'}
                    </h4>
                    <div className="am-form-row">
                      <div className="am-form-group">
                        <label>Judul Event</label>
                        <input
                          type="text"
                          required
                          value={eventForm.title}
                          onChange={(e) =>
                            setEventForm({ ...eventForm, title: e.target.value })
                          }
                          placeholder="Contoh: AMF Bakti Sosial Ramadhan 2026"
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
                          placeholder="Bakti Sosial (AMF)"
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
                          placeholder="Contoh: 10 – 20 Maret 2026"
                        />
                      </div>
                      <div className="am-form-group">
                        <label>Status Event</label>
                        <select
                          value={eventForm.status}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="completed">
                            Selesai / Terlaksana (Arsip)
                          </option>
                          <option value="ongoing">
                            Sedang Berlangsung (Aktif)
                          </option>
                          <option value="upcoming">
                            Segera Hadir (Upcoming)
                          </option>
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
                        <label>URL Poster (Default atau Link Gambar)</label>
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
                      <label>
                        Laporan Penyelesaian / Keterangan Status Event
                      </label>
                      <textarea
                        rows={2}
                        value={eventForm.completionReport}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            completionReport: e.target.value,
                          })
                        }
                        placeholder="Tuliskan laporan hasil kegiatan jika sudah selesai, atau informasi pendaftaran jika sedang berlangsung..."
                      />
                    </div>

                    <div className="am-form-group">
                      <label>
                        Poin Realisasi / Cakupan Kegiatan (Pisahkan per baris)
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
                        placeholder="Penyaluran donasi santunan&#10;Buka puasa bersama"
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
                        Simpan Event
                      </button>
                    </div>
                  </form>
                )}

                {/* Event List Table/Cards */}
                <div className="am-admin-events-list">
                  {(backendState?.events || []).map((evt) => (
                    <div key={evt.id} className="am-card am-admin-event-item">
                      <div className="am-admin-evt-main">
                        <div className="am-admin-evt-badges">
                          <span
                            className={`am-evt-mini-badge is-${evt.status}`}
                          >
                            {evt.status === 'completed'
                              ? 'Selesai / Terlaksana'
                              : evt.status === 'ongoing'
                              ? 'Sedang Berlangsung'
                              : 'Segera Hadir'}
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
                        <p className="am-admin-evt-report">
                          {evt.completionReport || evt.description}
                        </p>
                      </div>

                      <div className="am-admin-evt-controls">
                        <div className="am-quick-status-group">
                          <span>Ubah Status Cepat:</span>
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
                              Selesai
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
                              Segera Hadir
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

            {/* TAB 2: PENGATURAN STATUS DONASI */}
            {activeTab === 'donation-config' && (
              <div className="am-admin-panel-body">
                <div className="am-card am-admin-donation-toggle-card">
                  <div className="am-dtoggle-info">
                    <span
                      className={`am-live-status-pill ${
                        activeConfig.isOpen ? 'is-open' : 'is-closed'
                      }`}
                    >
                      {activeConfig.isOpen
                        ? 'STATUS SAAT INI: OPEN DONATION DIBUKA'
                        : 'STATUS SAAT INI: DONASI DITUTUP (EVENT SELESAI)'}
                    </span>
                    <h3>Saklar Utama Penerimaan Donasi Publik</h3>
                    <p>
                      Karena Event KURMA telah selesai, status default adalah{' '}
                      <strong>Ditutup</strong>. Jika Divisi AMF mengadakan Open
                      Donation baru, klik tombol di samping untuk membuka
                      formulir interaktif & nomor rekening di halaman depan.
                    </p>
                  </div>

                  <div className="am-dtoggle-actions">
                    <button
                      type="button"
                      disabled={loading}
                      className={`am-btn ${
                        activeConfig.isOpen
                          ? 'am-btn-danger'
                          : 'am-btn-primary'
                      }`}
                      onClick={() =>
                        handleToggleGlobalDonation(!activeConfig.isOpen)
                      }
                    >
                      {activeConfig.isOpen ? (
                        <>
                          <Lock size={16} /> Tutup Donasi (Tandai Selesai)
                        </>
                      ) : (
                        <>
                          <Unlock size={16} /> Buka Open Donation Baru
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <form
                  onSubmit={handleSaveDonationConfig}
                  className="am-card am-admin-config-form"
                >
                  <h4>Edit Teks Pengumuman Status Event & Donasi</h4>
                  <div className="am-form-group">
                    <label>Judul Kampanye Donasi (Saat Dibuka)</label>
                    <input
                      type="text"
                      value={activeConfig.campaignTitle}
                      onChange={(e) =>
                        setConfigDraft({
                          ...activeConfig,
                          campaignTitle: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="am-form-group">
                    <label>Judul Pemberitahuan Saat Donasi Ditutup / Selesai</label>
                    <input
                      type="text"
                      value={activeConfig.closedNoticeTitle}
                      onChange={(e) =>
                        setConfigDraft({
                          ...activeConfig,
                          closedNoticeTitle: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="am-form-group">
                    <label>
                      Pesan Penjelasan Saat Event & Donasi Telah Selesai
                    </label>
                    <textarea
                      rows={3}
                      value={activeConfig.closedNoticeDesc}
                      onChange={(e) =>
                        setConfigDraft({
                          ...activeConfig,
                          closedNoticeDesc: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="am-btn am-btn-primary am-btn-sm"
                  >
                    Simpan Pengaturan Donasi
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: LOG DONATUR */}
            {activeTab === 'donation-log' && (
              <div className="am-admin-panel-body">
                <form
                  onSubmit={handleAddManualLog}
                  className="am-card am-admin-config-form"
                >
                  <h4>Tambah Catatan Penyaluran / Donatur Terverifikasi</h4>
                  <div className="am-form-row">
                    <div className="am-form-group">
                      <label>Nama Donatur</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Hamba Allah / Alumni AM"
                        value={newLogForm.donorName}
                        onChange={(e) =>
                          setNewLogForm({
                            ...newLogForm,
                            donorName: e.target.value,
                          })
                        }
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
                  <div className="am-form-row">
                    <div className="am-form-group">
                      <label>Jenis Bantuan</label>
                      <input
                        type="text"
                        value={newLogForm.type}
                        onChange={(e) =>
                          setNewLogForm({
                            ...newLogForm,
                            type: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="am-form-group">
                      <label>Program / Event Tujuan</label>
                      <input
                        type="text"
                        value={newLogForm.eventTitle}
                        onChange={(e) =>
                          setNewLogForm({
                            ...newLogForm,
                            eventTitle: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="am-btn am-btn-primary am-btn-sm"
                  >
                    <Plus size={14} /> Tambahkan ke Riwayat Donasi
                  </button>
                </form>

                <div className="am-admin-events-list">
                  {(backendState?.donationsLog || []).map((log) => (
                    <div key={log.id} className="am-card am-admin-event-item">
                      <div className="am-admin-evt-main">
                        <div className="am-admin-evt-badges">
                          <span
                            className={`am-evt-mini-badge ${
                              log.status === 'verified'
                                ? 'is-completed'
                                : 'is-upcoming'
                            }`}
                          >
                            {log.status === 'verified'
                              ? 'Terverifikasi / Tersalurkan'
                              : 'Menunggu Verifikasi'}
                          </span>
                          <span className="am-admin-evt-cat">
                            Via {log.bankTarget}
                          </span>
                        </div>
                        <h4>
                          {log.donorName} — Rp{' '}
                          {Number(log.amount || 0).toLocaleString('id-ID')}
                        </h4>
                        <p className="am-admin-evt-meta">
                          {log.type} • Program: <strong>{log.eventTitle}</strong>
                        </p>
                      </div>
                      <div className="am-admin-evt-actions">
                        <button
                          type="button"
                          className="am-btn am-btn-outline am-btn-sm"
                          onClick={() => handleToggleVerifyDonation(log)}
                        >
                          <CheckCircle2 size={14} />{' '}
                          {log.status === 'verified'
                            ? 'Tandai Pending'
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
              </div>
            )}

            {/* TAB 4: KONEKSI BACKEND VERCEL */}
            {activeTab === 'backend' && (
              <div className="am-admin-panel-body">
                <div className="am-card am-admin-config-form">
                  <h4>Konfigurasi Endpoint Backend Terpisah (Vercel)</h4>
                  <p className="am-channels-sub">
                    Backend berada di folder terpisah <code>c:\WEB AM\backend</code>{' '}
                    dan dapat di-hosting di Vercel sebagai project tersendiri.
                    Masukkan URL API Backend Vercel Anda di bawah ini:
                  </p>
                  <form onSubmit={handleSaveBackendUrl} className="am-form-row">
                    <div className="am-form-group" style={{ flex: 1 }}>
                      <label>URL API Backend</label>
                      <input
                        type="text"
                        value={apiUrlInput}
                        onChange={(e) => setApiUrlInput(e.target.value)}
                        placeholder="https://ambulu-mengajar-backend.vercel.app/api"
                      />
                    </div>
                    <button
                      type="submit"
                      className="am-btn am-btn-primary am-btn-sm"
                      style={{ alignSelf: 'flex-end' }}
                    >
                      <RefreshCw size={14} /> Hubungkan & Uji Koneksi
                    </button>
                  </form>
                </div>

                <div className="am-card am-admin-config-form">
                  <h4>Reset Data ke Default (Seed Data)</h4>
                  <p className="am-channels-sub">
                    Kembalikan daftar event dan konfigurasi donasi ke kondisi
                    awal (Event KURMA 2022 Selesai / Donasi Ditutup).
                  </p>
                  <button
                    type="button"
                    className="am-btn am-btn-outline am-btn-sm"
                    onClick={handleResetAllData}
                  >
                    <RefreshCw size={14} /> Reset Database ke Awal
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

