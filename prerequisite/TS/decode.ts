const bs58 = require('bs58');
const fs = require('fs');
let b = bs58.decode('Phantom Private Key');
let j = new Uint8Array(b.buffer, b.byteOffset, b.byteLength / Uint8Array.BYTES_PER_ELEMENT);
fs.writeFileSync('key.json', `[${j}]`);