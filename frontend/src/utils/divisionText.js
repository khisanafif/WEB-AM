const WORDS = [
  'Nol',
  'Satu',
  'Dua',
  'Tiga',
  'Empat',
  'Lima',
  'Enam',
  'Tujuh',
  'Delapan',
  'Sembilan',
  'Sepuluh',
  'Sebelas',
  'Dua Belas',
];

/** Jumlah divisi dalam kata, mis. 4 -> "Empat". Di atas 12 memakai angka. */
export function divisionCountWord(n) {
  return n >= 0 && n < WORDS.length ? WORDS[n] : String(n);
}

/** Daftar singkatan divisi, mis. "HRD, AML, AMF, dan KOMINFO". */
export function divisionCodesText(divisions) {
  const codes = (divisions || []).map((d) => d.code).filter(Boolean);
  if (codes.length === 0) return '';
  if (codes.length === 1) return codes[0];
  return `${codes.slice(0, -1).join(', ')}, dan ${codes[codes.length - 1]}`;
}

/** Membuat divisi baru dengan isi kosong (diisi admin lewat panel). */
export function createEmptyDivision() {
  const stamp = Date.now();
  return {
    id: `div-${stamp}`,
    code: 'BARU',
    shortTitle: 'Divisi Baru',
    exactTitle: 'Divisi Baru',
    fullName: '',
    tagline: '',
    description: '',
    accentColor: '#FF8CA8',
    carrdPoints: [],
    programs: [],
    skills: [],
  };
}
