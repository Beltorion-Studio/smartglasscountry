export class CryptoService {
  // Define a static salt for simplicity; in a real-world scenario, you'd generate a unique salt per password.
  private static salt = new TextEncoder().encode('a-unique-salt');

  async hashPassword(plaintextPassword: string): Promise<string> {
    const passwordBuffer = new TextEncoder().encode(plaintextPassword);

    // Import the password as a crypto key
    const key = await crypto.subtle.importKey('raw', passwordBuffer, { name: 'PBKDF2' }, false, [
      'deriveBits',
    ]);

    // Derive the hash using PBKDF2 with HMAC SHA-256 and the predefined salt
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: CryptoService.salt,
        iterations: 100000, // The number of iterations should be as high as possible without causing too much delay.
        hash: 'SHA-256',
      },
      key,
      256 // The number of bits to derive; 256 bits = 32 bytes
    );

    // Convert the derived bits to a hex string
    const hashArray = Array.from(new Uint8Array(derivedBits));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  maskApiKey(apiKey: string): string {
    return apiKey.slice(0, 4) + '*'.repeat(apiKey.length - 8) + apiKey.slice(-4);
  }
}
