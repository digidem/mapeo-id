declare module 'sodium-universal' {
  export function crypto_generichash(
    output: Buffer | Uint8Array,
    input: Buffer | Uint8Array,
    key?: Buffer | Uint8Array,
  ): void
  /**
   * Fill `buffer` with random data.
   */
  export function randombytes_buf(buffer: Buffer | Uint8Array): void
}
