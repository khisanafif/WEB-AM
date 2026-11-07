import { DEFAULT_BACKEND_STATE } from '../data/ambuluData';

const STORAGE_STATE_KEY = 'am_backend_cms_state_v2';
const STORAGE_TOKEN_KEY = 'am_admin_jwt_token';
const STORAGE_USER_KEY = 'am_admin_user_info';
const STORAGE_API_URL_KEY = 'am_custom_api_url';

export function getApiBaseUrl() {
  const customUrl = localStorage.getItem(STORAGE_API_URL_KEY);
  if (customUrl && customUrl.trim()) {
    return customUrl.trim().replace(/\/+$/, '');
  }
  return (
    import.meta.env.VITE_API_URL || 'https://web-am-backend.vercel.app/api'
  ).replace(/\/+$/, '');
}

export function setCustomApiBaseUrl(url) {
  if (!url || !url.trim()) {
    localStorage.removeItem(STORAGE_API_URL_KEY);
  } else {
    localStorage.setItem(STORAGE_API_URL_KEY, url.trim().replace(/\/+$/, ''));
  }
}

export function getStoredToken() {
  return localStorage.getItem(STORAGE_TOKEN_KEY) || null;
}

export function getStoredAdminUser() {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
}

function mergeCmsState(loaded) {
  const base = JSON.parse(JSON.stringify(DEFAULT_BACKEND_STATE));
  if (!loaded || typeof loaded !== 'object') return base;
  return {
    ...base,
    ...loaded,
    orgInfo: { ...base.orgInfo, ...(loaded.orgInfo || {}) },
    visionMission: { ...base.visionMission, ...(loaded.visionMission || {}) },
    donationConfig: { ...base.donationConfig, ...(loaded.donationConfig || {}) },
  };
}

function getLocalFallbackState() {
  try {
    const raw = localStorage.getItem(STORAGE_STATE_KEY);
    if (raw) {
      return mergeCmsState(JSON.parse(raw));
    }
  } catch {
    // ignore
  }
  const initial = JSON.parse(JSON.stringify(DEFAULT_BACKEND_STATE));
  localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(initial));
  return initial;
}

function saveLocalFallbackState(state) {
  const merged = mergeCmsState(state);
  merged.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(merged));
  } catch {
    // ignore
  }
  return merged;
}

async function requestApi(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || `HTTP Error ${response.status}`);
    }
    return { ok: true, mode: 'online', ...json };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ============================================================================
// PUBLIC & ADMIN API METHODS (Backend Terpisah + Sinkronisasi Lokal)
// ============================================================================

export async function fetchPublicState() {
  try {
    const res = await requestApi('/public/state', { method: 'GET' });
    if (res.data) {
      saveLocalFallbackState(res.data);
      return {
        state: res.data,
        backendStatus: 'online',
        apiUrl: getApiBaseUrl(),
      };
    }
  } catch {
    // Jika backend terpisah belum dinyalakan, gunakan state sinkronisasi lokal
  }
  return {
    state: getLocalFallbackState(),
    backendStatus: 'fallback',
    apiUrl: getApiBaseUrl(),
  };
}

export async function loginAdmin(username, password) {
  const res = await requestApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem(STORAGE_TOKEN_KEY, res.token);
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(res.user));
  return {
    success: true,
    mode: 'online',
    user: res.user,
    token: res.token,
  };
}

export async function createEventApi(eventPayload) {
  try {
    const res = await requestApi('/events', {
      method: 'POST',
      body: JSON.stringify(eventPayload),
    });
    if (res.state) saveLocalFallbackState(res.state);
    return { state: res.state, mode: 'online' };
  } catch {
    const current = getLocalFallbackState();
    const newEvent = {
      id: `evt-${Date.now()}`,
      title: eventPayload.title,
      subtitle: eventPayload.subtitle || 'Program Resmi Ambulu Mengajar',
      category: eventPayload.category || 'Bakti Sosial (AMF)',
      period: eventPayload.period || 'Jadwal Menyusul',
      eventDate:
        eventPayload.eventDate || new Date().toISOString().slice(0, 10),
      location: eventPayload.location || 'Kecamatan Ambulu, Jember',
      status: eventPayload.status || 'upcoming',
      isDonationOpen: Boolean(eventPayload.isDonationOpen),
      poster: eventPayload.poster || '/assets/images/image04.jpg',
      badgeLogo: '/assets/images/image03.png',
      targetAmount: Number(eventPayload.targetAmount) || 0,
      collectedAmount: Number(eventPayload.collectedAmount) || 0,
      donorCount: Number(eventPayload.donorCount) || 0,
      description: eventPayload.description || '',
      completionReport: eventPayload.completionReport || '',
      deliverables: Array.isArray(eventPayload.deliverables)
        ? eventPayload.deliverables
        : String(eventPayload.deliverables || '')
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
      registrationUrl: eventPayload.registrationUrl || '',
    };
    current.events.unshift(newEvent);
    return { state: saveLocalFallbackState(current), mode: 'fallback' };
  }
}

export async function updateEventApi(eventId, eventPayload) {
  try {
    const res = await requestApi(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventPayload),
    });
    if (res.state) saveLocalFallbackState(res.state);
    return { state: res.state, mode: 'online' };
  } catch {
    const current = getLocalFallbackState();
    const idx = current.events.findIndex((e) => e.id === eventId);
    if (idx !== -1) {
      current.events[idx] = {
        ...current.events[idx],
        ...eventPayload,
        targetAmount: Number(eventPayload.targetAmount || 0),
        collectedAmount: Number(eventPayload.collectedAmount || 0),
        donorCount: Number(eventPayload.donorCount || 0),
        deliverables: Array.isArray(eventPayload.deliverables)
          ? eventPayload.deliverables
          : String(eventPayload.deliverables || '')
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean),
      };
    }
    return { state: saveLocalFallbackState(current), mode: 'fallback' };
  }
}

export async function patchEventStatusApi(eventId, statusPayload) {
  try {
    const res = await requestApi(`/events/${eventId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusPayload),
    });
    if (res.state) saveLocalFallbackState(res.state);
    return { state: res.state, mode: 'online' };
  } catch {
    const current = getLocalFallbackState();
    const idx = current.events.findIndex((e) => e.id === eventId);
    if (idx !== -1) {
      if (statusPayload.status) current.events[idx].status = statusPayload.status;
      if (typeof statusPayload.isDonationOpen === 'boolean') {
        current.events[idx].isDonationOpen = statusPayload.isDonationOpen;
      } else if (statusPayload.status === 'completed') {
        current.events[idx].isDonationOpen = false;
      }
      if (statusPayload.completionReport !== undefined) {
        current.events[idx].completionReport = statusPayload.completionReport;
      }
    }
    return { state: saveLocalFallbackState(current), mode: 'fallback' };
  }
}

export async function deleteEventApi(eventId) {
  try {
    const res = await requestApi(`/events/${eventId}`, {
      method: 'DELETE',
    });
    if (res.state) saveLocalFallbackState(res.state);
    return { state: res.state, mode: 'online' };
  } catch {
    const current = getLocalFallbackState();
    current.events = current.events.filter((e) => e.id !== eventId);
    return { state: saveLocalFallbackState(current), mode: 'fallback' };
  }
}

export async function updateDonationConfigApi(configPayload) {
  try {
    const res = await requestApi('/donations/config', {
      method: 'PUT',
      body: JSON.stringify(configPayload),
    });
    if (res.state) saveLocalFallbackState(res.state);
    return { state: res.state, mode: 'online' };
  } catch {
    const current = getLocalFallbackState();
    current.donationConfig = {
      ...current.donationConfig,
      ...configPayload,
      statusBadgeText:
        configPayload.statusBadgeText ||
        (configPayload.isOpen
          ? 'OPEN DONATION — SEDANG BERLANGSUNG'
          : 'DONASI DITUTUP — EVENT TELAH SELESAI'),
    };
    return { state: saveLocalFallbackState(current), mode: 'fallback' };
  }
}

export async function createDonationLogApi(donationPayload) {
  try {
    const res = await requestApi('/donations', {
      method: 'POST',
      body: JSON.stringify(donationPayload),
    });
    if (res.state) saveLocalFallbackState(res.state);
    return { state: res.state, mode: 'online' };
  } catch {
    const current = getLocalFallbackState();
    current.donationsLog.unshift({
      id: `don-${Date.now()}`,
      donorName: donationPayload.donorName || 'Hamba Allah',
      eventId: donationPayload.eventId || 'evt-general',
      eventTitle:
        donationPayload.eventTitle || current.donationConfig.campaignTitle,
      type: donationPayload.type || 'Donasi Dana Tunai',
      amount: Number(donationPayload.amount) || 0,
      bankTarget: donationPayload.bankTarget || 'BRI',
      message: donationPayload.message || '',
      status: donationPayload.status || 'pending',
      createdAt: new Date().toISOString(),
    });
    return { state: saveLocalFallbackState(current), mode: 'fallback' };
  }
}

export async function patchDonationLogApi(donationId, payload) {
  try {
    const res = await requestApi(`/donations/${donationId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    if (res.state) saveLocalFallbackState(res.state);
    return { state: res.state, mode: 'online' };
  } catch {
    const current = getLocalFallbackState();
    const idx = current.donationsLog.findIndex((d) => d.id === donationId);
    if (idx !== -1) {
      current.donationsLog[idx] = {
        ...current.donationsLog[idx],
        ...payload,
      };
    }
    return { state: saveLocalFallbackState(current), mode: 'fallback' };
  }
}

export async function deleteDonationLogApi(donationId) {
  try {
    const res = await requestApi(`/donations/${donationId}`, {
      method: 'DELETE',
    });
    if (res.state) saveLocalFallbackState(res.state);
    return { state: res.state, mode: 'online' };
  } catch {
    const current = getLocalFallbackState();
    current.donationsLog = current.donationsLog.filter(
      (d) => d.id !== donationId
    );
    return { state: saveLocalFallbackState(current), mode: 'fallback' };
  }
}

export async function createGalleryPhotoApi(photoPayload) {
  try {
    const res = await requestApi('/galleries', {
      method: 'POST',
      body: JSON.stringify(photoPayload),
    });
    if (res.state) saveLocalFallbackState(res.state);
    return { state: res.state, mode: 'online' };
  } catch {
    const current = getLocalFallbackState();
    if (!Array.isArray(current.customPhotos)) current.customPhotos = [];
    current.customPhotos.unshift({
      id: `custom-photo-${Date.now()}`,
      src: photoPayload.src || 'assets/images/gallery01/4a1c84c9.jpg',
      title: photoPayload.title || 'Dokumentasi Kegiatan Ambulu Mengajar',
      albumTitle:
        photoPayload.albumTitle ||
        photoPayload.title ||
        'Dokumentasi Terbaru',
      caption: photoPayload.caption || '',
      year: photoPayload.year || new Date().getFullYear().toString(),
      division: photoPayload.division || 'Divisi AMF',
      categoryBadge: photoPayload.categoryBadge || 'Dokumentasi Kegiatan',
      albumId: photoPayload.albumId || 'gallery05',
    });
    return { state: saveLocalFallbackState(current), mode: 'fallback' };
  }
}

export async function deleteGalleryPhotoApi(photoId) {
  try {
    const res = await requestApi(`/galleries/${photoId}`, {
      method: 'DELETE',
    });
    if (res.state) saveLocalFallbackState(res.state);
    return { state: res.state, mode: 'online' };
  } catch {
    const current = getLocalFallbackState();
    current.customPhotos = (current.customPhotos || []).filter(
      (p) => p.id !== photoId
    );
    return { state: saveLocalFallbackState(current), mode: 'fallback' };
  }
}

export async function updateCmsContentApi(cmsPayload) {
  try {
    const res = await requestApi('/cms/content', {
      method: 'PUT',
      body: JSON.stringify(cmsPayload),
    });
    if (res.state) saveLocalFallbackState(res.state);
    return { state: mergeCmsState(res.state), mode: 'online' };
  } catch {
    const current = getLocalFallbackState();
    const updated = {
      ...current,
      ...cmsPayload,
      orgInfo: cmsPayload.orgInfo
        ? { ...current.orgInfo, ...cmsPayload.orgInfo }
        : current.orgInfo,
      visionMission: cmsPayload.visionMission
        ? { ...current.visionMission, ...cmsPayload.visionMission }
        : current.visionMission,
      donationConfig: cmsPayload.donationConfig
        ? { ...current.donationConfig, ...cmsPayload.donationConfig }
        : current.donationConfig,
    };
    return { state: saveLocalFallbackState(updated), mode: 'fallback' };
  }
}

export async function resetBackendDatabaseApi() {
  try {
    const res = await requestApi('/admin/reset', { method: 'POST' });
    if (res.state) saveLocalFallbackState(res.state);
    return { state: res.state, mode: 'online' };
  } catch {
    const initial = JSON.parse(JSON.stringify(DEFAULT_BACKEND_STATE));
    return { state: saveLocalFallbackState(initial), mode: 'fallback' };
  }
}

