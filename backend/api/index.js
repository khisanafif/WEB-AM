const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { SEED_DATA } = require('../data/seedData');

// Konfigurasi Environment Variable (Siap untuk Vercel Serverless & Lokal)
const PORT = process.env.PORT || 5000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ambulumengajar2026';
const JWT_SECRET =
  process.env.JWT_SECRET || 'ambulu-mengajar-jwt-secret-key-2026';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// ============================================================================
// DATABASE ADAPTER (Mendukung Lokal db.json & Vercel Serverless /tmp/db.json)
// ============================================================================
const isVercel = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
);
const DB_FILE_PATH = isVercel
  ? path.join('/tmp', 'ambulu_mengajar_db.json')
  : path.join(__dirname, '..', 'data', 'db.json');

let memoryDb = null;

function readDb() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      memoryDb = JSON.parse(raw);
      return memoryDb;
    }
  } catch (err) {
    console.warn('Warning reading DB file, using memory fallback:', err.message);
  }

  if (!memoryDb) {
    memoryDb = JSON.parse(JSON.stringify(SEED_DATA));
    writeDb(memoryDb);
  }
  return memoryDb;
}

function writeDb(data) {
  data.updatedAt = new Date().toISOString();
  memoryDb = data;
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Warning writing DB file:', err.message);
  }
  return memoryDb;
}

// ============================================================================
// JWT HELPER (Zero-Dependency Native Node Crypto HMAC-SHA256)
// ============================================================================
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return Buffer.from(base64, 'base64').toString('utf-8');
}

function signToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 hari
  const fullPayload = { ...payload, exp };
  const unsigned = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(
    JSON.stringify(fullPayload)
  )}`;
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(unsigned)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${unsigned}.${signature}`;
}

function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signature] = parts;
  const unsigned = `${headerB64}.${payloadB64}`;
  const expectedSig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(unsigned)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSig) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function getAdminFromReq(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : null;
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') return null;
  return decoded;
}

// ============================================================================
// HTTP HELPERS (JSON Body Parser & Response Sender)
// ============================================================================
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

function sendJson(res, statusCode, payload) {
  setCorsHeaders(res);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function parseJsonBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') {
      return resolve(req.body);
    }
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk.toString();
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

// ============================================================================
// MAIN SERVERLESS & HTTP REQUEST HANDLER
// ============================================================================
async function apiHandler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';
  const method = req.method.toUpperCase();

  // 1. Root & Health Check
  if (method === 'GET' && (pathname === '/' || pathname === '/api')) {
    return sendJson(res, 200, {
      service: 'Ambulu Mengajar Backend API (Standalone Vercel Serverless)',
      status: 'online',
      environment: isVercel ? 'vercel-serverless' : 'local-node',
      endpoints: {
        health: '/api/health',
        publicState: '/api/public/state',
        adminLogin: '/api/auth/login',
        events: '/api/events',
        donationsConfig: '/api/donations/config',
        donationsLog: '/api/donations',
      },
    });
  }

  if (method === 'GET' && pathname === '/api/health') {
    const db = readDb();
    return sendJson(res, 200, {
      success: true,
      status: 'ok',
      environment: isVercel ? 'vercel-serverless' : 'local-node',
      eventsCount: db.events.length,
      isDonationOpen: db.donationConfig.isOpen,
      updatedAt: db.updatedAt,
    });
  }

  // 2. Public State Endpoint
  if (method === 'GET' && pathname === '/api/public/state') {
    const db = readDb();
    return sendJson(res, 200, {
      success: true,
      data: {
        events: db.events,
        donationConfig: db.donationConfig,
        donationsLog: db.donationsLog,
        customPhotos: db.customPhotos || [],
        updatedAt: db.updatedAt,
      },
    });
  }

  // 3. Admin Login
  if (method === 'POST' && pathname === '/api/auth/login') {
    const body = await parseJsonBody(req);
    const { username, password } = body;
    const db = readDb();
    const customPassword = db.adminPassword || ADMIN_PASSWORD;

    if (
      String(username || '').trim().toLowerCase() ===
        ADMIN_USERNAME.toLowerCase() &&
      String(password || '') === customPassword
    ) {
      const userPayload = {
        username: ADMIN_USERNAME,
        name: 'Administrator Ambulu Mengajar',
        role: 'admin',
        division: 'Pengurus Inti & AMF',
      };
      const token = signToken(userPayload);
      return sendJson(res, 200, {
        success: true,
        message: 'Login Admin berhasil!',
        token,
        user: userPayload,
      });
    }

    return sendJson(res, 401, {
      success: false,
      message: 'Username atau password Admin salah.',
    });
  }

  if (method === 'GET' && pathname === '/api/auth/me') {
    const admin = getAdminFromReq(req);
    if (!admin) {
      return sendJson(res, 401, {
        success: false,
        message: 'Token tidak valid atau kedaluwarsa.',
      });
    }
    return sendJson(res, 200, { success: true, user: admin });
  }

  // 4. Events Collection (/api/events)
  if (method === 'GET' && pathname === '/api/events') {
    const db = readDb();
    return sendJson(res, 200, { success: true, events: db.events });
  }

  if (method === 'POST' && pathname === '/api/events') {
    const admin = getAdminFromReq(req);
    if (!admin) {
      return sendJson(res, 401, {
        success: false,
        message: 'Akses ditolak. Silakan login sebagai Admin.',
      });
    }

    const body = await parseJsonBody(req);
    if (!body.title) {
      return sendJson(res, 400, {
        success: false,
        message: 'Judul event wajib diisi.',
      });
    }

    const db = readDb();
    const newEvent = {
      id: `evt-${Date.now()}`,
      title: body.title,
      subtitle: body.subtitle || 'Program Resmi Ambulu Mengajar',
      category: body.category || 'Bakti Sosial (AMF)',
      period: body.period || 'Jadwal Menyusul',
      eventDate: body.eventDate || new Date().toISOString().slice(0, 10),
      location: body.location || 'Kecamatan Ambulu, Jember',
      status: body.status || 'upcoming', // 'ongoing' | 'upcoming' | 'completed'
      isDonationOpen: Boolean(body.isDonationOpen),
      poster: body.poster || 'assets/images/image04.jpg',
      badgeLogo: 'assets/images/image03.png',
      targetAmount: Number(body.targetAmount) || 0,
      collectedAmount: Number(body.collectedAmount) || 0,
      donorCount: Number(body.donorCount) || 0,
      description: body.description || '',
      completionReport: body.completionReport || '',
      deliverables: Array.isArray(body.deliverables)
        ? body.deliverables
        : String(body.deliverables || '')
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
      registrationUrl: body.registrationUrl || '',
    };

    db.events.unshift(newEvent);
    writeDb(db);

    return sendJson(res, 201, {
      success: true,
      message: 'Event baru berhasil ditambahkan.',
      event: newEvent,
      state: db,
    });
  }

  // 5. Event Item Routes (/api/events/:id and /api/events/:id/status)
  const eventStatusMatch = pathname.match(/^\/api\/events\/([^/]+)\/status$/);
  if (eventStatusMatch && method === 'PATCH') {
    const admin = getAdminFromReq(req);
    if (!admin) {
      return sendJson(res, 401, {
        success: false,
        message: 'Akses ditolak. Silakan login sebagai Admin.',
      });
    }

    const eventId = decodeURIComponent(eventStatusMatch[1]);
    const db = readDb();
    const idx = db.events.findIndex((e) => e.id === eventId);
    if (idx === -1) {
      return sendJson(res, 404, {
        success: false,
        message: 'Event tidak ditemukan.',
      });
    }

    const body = await parseJsonBody(req);
    const { status, isDonationOpen, completionReport } = body;
    if (status) db.events[idx].status = status;
    if (typeof isDonationOpen === 'boolean') {
      db.events[idx].isDonationOpen = isDonationOpen;
    } else if (status === 'completed') {
      db.events[idx].isDonationOpen = false;
    }
    if (completionReport !== undefined) {
      db.events[idx].completionReport = completionReport;
    }

    writeDb(db);
    return sendJson(res, 200, {
      success: true,
      message: 'Status event berhasil diubah.',
      event: db.events[idx],
      state: db,
    });
  }

  const eventItemMatch = pathname.match(/^\/api\/events\/([^/]+)$/);
  if (eventItemMatch) {
    const admin = getAdminFromReq(req);
    if (!admin) {
      return sendJson(res, 401, {
        success: false,
        message: 'Akses ditolak. Silakan login sebagai Admin.',
      });
    }

    const eventId = decodeURIComponent(eventItemMatch[1]);
    const db = readDb();

    if (method === 'PUT') {
      const idx = db.events.findIndex((e) => e.id === eventId);
      if (idx === -1) {
        return sendJson(res, 404, {
          success: false,
          message: 'Event tidak ditemukan.',
        });
      }

      const body = await parseJsonBody(req);
      const existing = db.events[idx];
      const updated = {
        ...existing,
        ...body,
        id: existing.id,
        targetAmount:
          body.targetAmount !== undefined
            ? Number(body.targetAmount)
            : existing.targetAmount,
        collectedAmount:
          body.collectedAmount !== undefined
            ? Number(body.collectedAmount)
            : existing.collectedAmount,
        donorCount:
          body.donorCount !== undefined
            ? Number(body.donorCount)
            : existing.donorCount,
        deliverables: Array.isArray(body.deliverables)
          ? body.deliverables
          : typeof body.deliverables === 'string'
          ? body.deliverables
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean)
          : existing.deliverables,
      };

      db.events[idx] = updated;
      writeDb(db);

      return sendJson(res, 200, {
        success: true,
        message: 'Data event berhasil diperbarui.',
        event: updated,
        state: db,
      });
    }

    if (method === 'DELETE') {
      const prevLen = db.events.length;
      db.events = db.events.filter((e) => e.id !== eventId);
      if (db.events.length === prevLen) {
        return sendJson(res, 404, {
          success: false,
          message: 'Event tidak ditemukan.',
        });
      }
      writeDb(db);
      return sendJson(res, 200, {
        success: true,
        message: 'Event berhasil dihapus.',
        state: db,
      });
    }
  }

  // 6. Donation Config Route (/api/donations/config)
  if (pathname === '/api/donations/config' && method === 'PUT') {
    const admin = getAdminFromReq(req);
    if (!admin) {
      return sendJson(res, 401, {
        success: false,
        message: 'Akses ditolak. Silakan login sebagai Admin.',
      });
    }

    const body = await parseJsonBody(req);
    const db = readDb();
    db.donationConfig = {
      ...db.donationConfig,
      ...body,
      statusBadgeText:
        body.statusBadgeText ||
        (body.isOpen
          ? 'OPEN DONATION — SEDANG BERLANGSUNG'
          : 'DONASI DITUTUP — EVENT TELAH SELESAI'),
    };

    writeDb(db);
    return sendJson(res, 200, {
      success: true,
      message: 'Konfigurasi status donasi & rekening berhasil disimpan.',
      donationConfig: db.donationConfig,
      state: db,
    });
  }

  // 7. Donations Log Routes (/api/donations & /api/donations/:id)
  if (pathname === '/api/donations' && method === 'POST') {
    const db = readDb();
    const admin = getAdminFromReq(req);
    const body = await parseJsonBody(req);

    if (!db.donationConfig.isOpen && !admin) {
      return sendJson(res, 403, {
        success: false,
        message:
          'Mohon maaf, saat ini penggalangan donasi sedang ditutup karena event telah selesai.',
      });
    }

    const newDonation = {
      id: `don-${Date.now()}`,
      donorName: body.donorName || 'Hamba Allah',
      eventId: body.eventId || 'evt-general',
      eventTitle: body.eventTitle || db.donationConfig.campaignTitle,
      type: body.type || 'Donasi Dana Tunai',
      amount: Number(body.amount) || 0,
      bankTarget: body.bankTarget || 'BRI',
      message: body.message || '',
      status: admin ? body.status || 'verified' : 'pending',
      createdAt: new Date().toISOString(),
    };

    db.donationsLog.unshift(newDonation);
    writeDb(db);

    return sendJson(res, 201, {
      success: true,
      message: 'Catatan konfirmasi donasi berhasil disimpan.',
      donation: newDonation,
      state: db,
    });
  }

  const donationItemMatch = pathname.match(/^\/api\/donations\/([^/]+)$/);
  if (donationItemMatch) {
    const admin = getAdminFromReq(req);
    if (!admin) {
      return sendJson(res, 401, {
        success: false,
        message: 'Akses ditolak. Silakan login sebagai Admin.',
      });
    }

    const donationId = decodeURIComponent(donationItemMatch[1]);
    const db = readDb();

    if (method === 'PATCH') {
      const idx = db.donationsLog.findIndex((d) => d.id === donationId);
      if (idx === -1) {
        return sendJson(res, 404, {
          success: false,
          message: 'Data donasi tidak ditemukan.',
        });
      }
      const body = await parseJsonBody(req);
      if (body.status) db.donationsLog[idx].status = body.status;
      if (body.amount !== undefined)
        db.donationsLog[idx].amount = Number(body.amount);
      if (body.donorName) db.donationsLog[idx].donorName = body.donorName;

      writeDb(db);
      return sendJson(res, 200, {
        success: true,
        message: 'Status donasi berhasil diperbarui.',
        donation: db.donationsLog[idx],
        state: db,
      });
    }

    if (method === 'DELETE') {
      db.donationsLog = db.donationsLog.filter((d) => d.id !== donationId);
      writeDb(db);
      return sendJson(res, 200, {
        success: true,
        message: 'Data log donasi berhasil dihapus.',
        state: db,
      });
    }
  }

  // 8. Custom Gallery Photos Routes (/api/galleries & /api/galleries/:id)
  if (pathname === '/api/galleries' && method === 'POST') {
    const admin = getAdminFromReq(req);
    if (!admin) {
      return sendJson(res, 401, {
        success: false,
        message: 'Akses ditolak. Silakan login sebagai Admin.',
      });
    }
    const body = await parseJsonBody(req);
    const db = readDb();
    if (!Array.isArray(db.customPhotos)) db.customPhotos = [];
    const newPhoto = {
      id: `custom-photo-${Date.now()}`,
      src: body.src || 'assets/images/gallery01/4a1c84c9.jpg',
      title: body.title || 'Dokumentasi Kegiatan Ambulu Mengajar',
      albumTitle: body.albumTitle || body.title || 'Dokumentasi Terbaru',
      caption: body.caption || '',
      year: body.year || new Date().getFullYear().toString(),
      division: body.division || 'Divisi AMF',
      categoryBadge: body.categoryBadge || 'Dokumentasi Kegiatan',
      albumId: body.albumId || 'gallery05',
    };
    db.customPhotos.unshift(newPhoto);
    writeDb(db);
    return sendJson(res, 201, {
      success: true,
      message: 'Foto dokumentasi baru berhasil ditambahkan.',
      photo: newPhoto,
      state: db,
    });
  }

  const galleryItemMatch = pathname.match(/^\/api\/galleries\/([^/]+)$/);
  if (galleryItemMatch && method === 'DELETE') {
    const admin = getAdminFromReq(req);
    if (!admin) {
      return sendJson(res, 401, {
        success: false,
        message: 'Akses ditolak. Silakan login sebagai Admin.',
      });
    }
    const photoId = decodeURIComponent(galleryItemMatch[1]);
    const db = readDb();
    db.customPhotos = (db.customPhotos || []).filter((p) => p.id !== photoId);
    writeDb(db);
    return sendJson(res, 200, {
      success: true,
      message: 'Foto dokumentasi berhasil dihapus.',
      state: db,
    });
  }

  // 9. Admin Database Reset (/api/admin/reset)
  if (pathname === '/api/admin/reset' && method === 'POST') {
    const admin = getAdminFromReq(req);
    if (!admin) {
      return sendJson(res, 401, {
        success: false,
        message: 'Akses ditolak. Silakan login sebagai Admin.',
      });
    }

    const fresh = JSON.parse(JSON.stringify(SEED_DATA));
    writeDb(fresh);
    return sendJson(res, 200, {
      success: true,
      message: 'Database berhasil di-reset ke data awal (Seed Data).',
      state: fresh,
    });
  }

  return sendJson(res, 404, {
    success: false,
    message: `Endpoint ${method} ${pathname} tidak ditemukan.`,
  });
}

// Jalankan server HTTP lokal jika dieksekusi langsung (node api/index.js)
if (require.main === module) {
  const server = http.createServer(apiHandler);
  server.listen(PORT, () => {
    console.log(
      `🚀 [Ambulu Mengajar Backend API] Berjalan di http://localhost:${PORT}`
    );
  });
}

// Export untuk Vercel Serverless Functions
module.exports = apiHandler;
