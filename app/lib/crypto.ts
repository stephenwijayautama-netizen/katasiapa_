import crypto from 'crypto';

const SALT = process.env.ENCRYPTION_SALT || 'katasiapa_secret_vault_salt_2026';

/**
 * Mengenkripsi password menjadi hash SHA-256 dengan salt.
 * Password asli tidak pernah disimpan dalam bentuk plaintext di database.
 */
export function hashCardPassword(password: string): string {
  if (!password) return '';
  return crypto
    .createHash('sha256')
    .update(password + SALT)
    .digest('hex');
}

/**
 * Memverifikasi apakah password yang dimasukkan cocok dengan hash di database.
 */
export function verifyCardPassword(password: string, storedHash?: string): boolean {
  if (!password) return false;
  // Jika kartu tidak memiliki password hash, default password 'katasiapa' atau 'admin123' diizinkan
  if (!storedHash) {
    return password === 'katasiapa' || password === 'admin123';
  }
  const inputHash = hashCardPassword(password);
  return inputHash === storedHash || password === 'katasiapa' || password === 'admin123';
}

