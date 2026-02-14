declare module 'gifenc' {
  interface GIFEncoderInstance {
    writeFrame(index: Uint8Array, width: number, height: number, opts?: { palette?: number[][]; delay?: number }): void;
    finish(): void;
    bytes(): Uint8Array<ArrayBuffer>;
  }
  export function GIFEncoder(): GIFEncoderInstance;
  export function quantize(rgba: Uint8ClampedArray, maxColors: number, opts?: object): number[][];
  export function applyPalette(rgba: Uint8ClampedArray, palette: number[][], format?: string): Uint8Array;
}
