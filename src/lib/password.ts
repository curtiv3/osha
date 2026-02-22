const ITERATIONS = 120_000;
const KEY_LENGTH = 32;

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

async function derive(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const saltBuffer = salt.buffer.slice(salt.byteOffset, salt.byteOffset + salt.byteLength);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBuffer as unknown as BufferSource, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    KEY_LENGTH * 8,
  );

  return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt);

  return `${toHex(salt)}:${toHex(hash)}`;
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  const [saltHex, hashHex] = passwordHash.split(":");

  if (!saltHex || !hashHex) {
    return false;
  }

  const salt = fromHex(saltHex);
  const expectedHash = fromHex(hashHex);
  const computed = await derive(password, salt);

  if (computed.length !== expectedHash.length) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < computed.length; i += 1) {
    mismatch |= computed[i] ^ expectedHash[i];
  }

  return mismatch === 0;
}
