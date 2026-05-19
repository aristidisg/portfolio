/**
 * Symmetric encryption of secrets using a user passphrase.
 *
 * - Key derivation: PBKDF2 (SHA-256, 250k iterations) over the passphrase
 * - Cipher: AES-GCM 256-bit (authenticated, no separate MAC needed)
 * - Stored layout (base64url, all components):
 *     { v: 1, salt, iv, ct }
 *
 * The passphrase itself is never stored. Decryption requires re-entry.
 * `crypto.subtle` is required (every modern browser).
 */

const ITERATIONS = 250_000;
const KEY_LENGTH = 256;

export interface EncryptedBlob {
  v: 1;
  salt: string;
  iv: string;
  ct: string;
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptSecret(
  plaintext: string,
  passphrase: string,
): Promise<EncryptedBlob> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const enc = new TextEncoder();
  const ctBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    enc.encode(plaintext),
  );
  return {
    v: 1,
    salt: bytesToB64Url(salt),
    iv: bytesToB64Url(iv),
    ct: bytesToB64Url(new Uint8Array(ctBuf)),
  };
}

export async function decryptSecret(
  blob: EncryptedBlob,
  passphrase: string,
): Promise<string> {
  if (blob.v !== 1) throw new Error(`Unsupported blob version: ${blob.v}`);
  const salt = b64UrlToBytes(blob.salt);
  const iv = b64UrlToBytes(blob.iv);
  const ct = b64UrlToBytes(blob.ct);
  const key = await deriveKey(passphrase, salt);
  try {
    const plainBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      ct as BufferSource,
    );
    return new TextDecoder().decode(plainBuf);
  } catch {
    throw new Error('Wrong passphrase or corrupted data.');
  }
}

function bytesToB64Url(b: Uint8Array): string {
  let s = '';
  for (let i = 0; i < b.byteLength; i += 1) s += String.fromCharCode(b[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function b64UrlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 ? '='.repeat(4 - (s.length % 4)) : '';
  const b64 = (s + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}
