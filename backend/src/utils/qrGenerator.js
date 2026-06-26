const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

async function generateQRCode(slug, domain) {
  const url = `${domain}/memorial/${slug}`;
  const fileName = `qr-${slug}.png`;
  const filePath = path.join(__dirname, '../../uploads/qrcodes', fileName);

  await QRCode.toFile(filePath, url, {
    width: 300,
    margin: 2,
    color: {
      dark: '#0F172A',
      light: '#F8FAFC',
    },
  });

  return { url, filePath: `/uploads/qrcodes/${fileName}`, fileName };
}

async function generateQRBase64(slug, domain) {
  const url = `${domain}/memorial/${slug}`;
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: {
      dark: '#0F172A',
      light: '#F8FAFC',
    },
  });
  return { url, qrDataUrl };
}

async function generateQRFromUrl(targetUrl) {
  const qrDataUrl = await QRCode.toDataURL(targetUrl, {
    width: 300,
    margin: 2,
    color: {
      dark: '#0F172A',
      light: '#F8FAFC',
    },
  });
  return { url: targetUrl, qrDataUrl };
}

module.exports = { generateQRCode, generateQRBase64, generateQRFromUrl };
