export class CryptoService {
  private algorithm: AesCtrParams;
  private key: CryptoKey;

  constructor(secretKey: string) {
    this.algorithm = { name: 'AES-CTR', length: 256 };
    this.key = this.importKey(secretKey);
  }

  private async importKey(secretKey: string): Promise<CryptoKey> {
    const encodedKey = new TextEncoder().encode(secretKey);
    return await crypto.subtle.importKey('raw', encodedKey, this.algorithm, false, [
      'encrypt',
      'decrypt',
    ]);
  }

  async encrypt(text: string): Promise<{ iv: string; content: string }> {
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encodedText = new TextEncoder().encode(text);
    const encryptedData = await crypto.subtle.encrypt(
      { ...this.algorithm, counter: iv, length: 64 },
      this.key,
      encodedText
    );

    return {
      iv: Array.from(iv)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(''),
      content: Buffer.from(encryptedData).toString('hex'),
    };
  }

  async decrypt(hash: { iv: string; content: string }): Promise<string> {
    const iv = new Uint8Array(hash.iv.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const encryptedData = Buffer.from(hash.content, 'hex');
    const decryptedData = await crypto.subtle.decrypt(
      { ...this.algorithm, counter: iv, length: 64 },
      this.key,
      encryptedData
    );

    return new TextDecoder().decode(decryptedData);
  }

  maskApiKey(apiKey: string) {
    return apiKey.slice(0, 4) + '*'.repeat(apiKey.length - 8) + apiKey.slice(-4);
  }
}
