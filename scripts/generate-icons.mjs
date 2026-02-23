/**
 * Generates minimal valid PNG icons for the PWA manifest.
 * Uses only Node.js built-ins (zlib + crypto).
 */
import { createWriteStream, mkdirSync } from 'fs';
import { deflateSync } from 'zlib';

// CRC table
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) crc = crcTable[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.allocUnsafe(4); len.writeUInt32BE(data.length);
  const crcBuf = crc32(Buffer.concat([typeBytes, data]));
  const crcBytes = Buffer.allocUnsafe(4); crcBytes.writeUInt32BE(crcBuf);
  return Buffer.concat([len, typeBytes, data, crcBytes]);
}

function makePNG(size, r, g, b) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0);   // width
  ihdr.writeUInt32BE(size, 4);   // height
  ihdr.writeUInt8(8, 8);         // bit depth
  ihdr.writeUInt8(2, 9);         // color type: RGB
  ihdr.writeUInt8(0, 10);        // compression
  ihdr.writeUInt8(0, 11);        // filter
  ihdr.writeUInt8(0, 12);        // interlace

  // Raw scanlines: each row = filter_byte(0) + size*3 bytes
  const raw = Buffer.allocUnsafe(size * (1 + size * 3));
  for (let y = 0; y < size; y++) {
    raw[y * (1 + size * 3)] = 0; // filter type None
    for (let x = 0; x < size; x++) {
      // Draw a rounded rectangle / circle feel: darken corners
      const cx = x - size / 2, cy = y - size / 2;
      const dist = Math.sqrt(cx * cx + cy * cy) / (size / 2);
      const inCircle = dist <= 0.85;
      const base = y * (1 + size * 3) + 1 + x * 3;
      if (inCircle) {
        raw[base]     = r;
        raw[base + 1] = g;
        raw[base + 2] = b;
      } else {
        raw[base]     = Math.round(r * 0.6);
        raw[base + 1] = Math.round(g * 0.6);
        raw[base + 2] = Math.round(b * 0.6);
      }
    }
  }

  const idat = deflateSync(raw);

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Terracotta brown matching the app's --color-bg-card (#3d3329)
const R = 0x6b, G = 0x4e, B = 0x36; // warm brown — readable as app icon

mkdirSync('public/icons', { recursive: true });

for (const size of [192, 512]) {
  const out = createWriteStream(`public/icons/icon-${size}x${size}.png`);
  out.write(makePNG(size, R, G, B));
  out.end(() => console.log(`✓ icon-${size}x${size}.png`));
}
