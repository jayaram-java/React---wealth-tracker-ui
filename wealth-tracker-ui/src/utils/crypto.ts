function base64ToBytes(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

async function importKey(base64Key: string): Promise<CryptoKey> {
  const keyBytes = base64ToBytes(base64Key);
  if (keyBytes.length !== 32) {
    throw new Error('Encryption key must be exactly 32 bytes');
  }
  return await window.crypto.subtle.importKey(
    'raw',
    keyBytes as BufferSource,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export function generateRequestId(): string {
  const bytes = window.crypto.getRandomValues(new Uint8Array(32));
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function encryptPayload(
  plaintext: string,
  requestId: string,
  base64Key: string
): Promise<string> {
  const key = await importKey(base64Key);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const plaintextBytes = encoder.encode(plaintext);
  const associatedData = encoder.encode(requestId);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
      additionalData: associatedData as BufferSource,
      tagLength: 128,
    },
    key,
    plaintextBytes as BufferSource
  );

  const encryptedBytes = new Uint8Array(encryptedBuffer);
  const wireBytes = new Uint8Array(iv.length + encryptedBytes.length);
  wireBytes.set(iv, 0);
  wireBytes.set(encryptedBytes, iv.length);

  return bytesToBase64(wireBytes);
}

export async function decryptPayload(
  encryptedBase64: string,
  requestId: string,
  base64Key: string
): Promise<string> {
  const key = await importKey(base64Key);
  const wireBytes = base64ToBytes(encryptedBase64);
  if (wireBytes.length < 12 + 16) {
    throw new Error('Encrypted payload is invalid or authentication failed');
  }

  const iv = wireBytes.slice(0, 12);
  const ciphertextAndTag = wireBytes.slice(12);
  const encoder = new TextEncoder();
  const associatedData = encoder.encode(requestId);

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as BufferSource,
        additionalData: associatedData as BufferSource,
        tagLength: 128,
      },
      key,
      ciphertextAndTag as BufferSource
    );
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    throw new Error('Encrypted payload is invalid or authentication failed');
  }
}
