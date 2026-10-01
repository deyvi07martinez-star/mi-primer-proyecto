// Uso: node qr.js https://mi-pagina.vercel.app ./carpeta-de-salida
// Requiere: npm i qrcode   (en una carpeta temporal, no en el proyecto)
const QRCode = require('qrcode');
const fs = require('fs');
const URL = process.argv[2];
const OUT = (process.argv[3] || '.') + '/';
if (!URL) { console.error('Falta la URL'); process.exit(1); }

(async () => {
  await QRCode.toFile(OUT + 'qr.png', URL, { errorCorrectionLevel: 'H', margin: 4, width: 1200,
    color: { dark: '#06070aff', light: '#ffffffff' } });
  fs.writeFileSync(OUT + 'qr.svg', await QRCode.toString(URL, { type: 'svg', errorCorrectionLevel: 'H', margin: 4,
    color: { dark: '#06070a', light: '#ffffff' } }));
  fs.writeFileSync(OUT + 'qr-dataurl.txt', await QRCode.toDataURL(URL, { errorCorrectionLevel: 'H', margin: 1, width: 900,
    color: { dark: '#06070aff', light: '#ffffffff' } }));
  console.log('QR generado para', URL);
})();
