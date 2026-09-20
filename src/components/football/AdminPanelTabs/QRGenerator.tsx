'use client';

import { useEffect, useState } from 'react';

export default function QRGenerator() {
  const [qrUrl, setQrUrl] = useState('');
  const [clubName, setClubName] = useState('Club de Fútbol');

  useEffect(() => {
    // Generate QR code using qr-server API
    const pageUrl = window.location.origin + '/football-public';
    const qrEndpoint = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pageUrl)}`;
    setQrUrl(qrEndpoint);
  }, []);

  const handleDownload = () => {
    if (qrUrl) {
      const link = document.createElement('a');
      link.href = qrUrl.replace('?', '?format=png&'); // Ensure PNG format
      link.download = `qr-codigo-${clubName}.png`;
      link.click();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Código QR - ${clubName}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                font-family: Arial, sans-serif;
                background: white;
              }
              img {
                margin: 20px;
                border: 10px solid #1e293b;
              }
              h1 {
                color: #1e293b;
                margin-top: 20px;
              }
              p {
                color: #64748b;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            <h1>${clubName}</h1>
            <img src="${qrUrl}&format=png" alt="QR Code" />
            <p>Escanea este código para acceder a la plataforma</p>
            <p style="font-size: 12px; margin-top: 30px;">Sin costo adicional - Acceso directo a la plataforma</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  return (
    <div className="space-y-6">
      {/* Club Name */}
      <div className="bg-white/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">📝 Nombre del Club</h3>
        <input
          type="text"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          className="w-full px-4 py-2 bg-slate-800 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Nombre del Club"
        />
      </div>

      {/* QR Preview */}
      <div className="bg-white/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">🎯 Vista Previa del Código QR</h3>
        <div className="flex flex-col items-center">
          {qrUrl && (
            <div className="bg-white p-6 rounded-lg mb-6">
              <img
                src={`${qrUrl}&format=png`}
                alt="QR Code"
                width={300}
                height={300}
                className="border-4 border-slate-900"
              />
            </div>
          )}
          <p className="text-blue-200 text-center">
            Escanea este código para acceder a la plataforma sin costo
          </p>
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-200 mb-3">ℹ️ Información</h3>
        <ul className="text-blue-100 space-y-2 text-sm">
          <li>✓ El código QR dirige a: <span className="font-mono text-xs text-blue-300">{window.location.origin}/football-public</span></li>
          <li>✓ Acceso COMPLETAMENTE GRATUITO sin contraseña</li>
          <li>✓ Compatible con cualquier smartphone o tablet</li>
          <li>✓ Imprime en grande (A3) para máxima visibilidad</li>
          <li>✓ Sin requiere instalación ni app especial</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
        >
          📥 Descargar QR
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
        >
          🖨️ Imprimir QR
        </button>
      </div>

      {/* Print Instructions */}
      <div className="bg-white/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">📋 Instrucciones para Imprimir</h3>
        <ol className="text-blue-100 space-y-2 text-sm">
          <li>1. Haz clic en "Imprimir QR"</li>
          <li>2. Selecciona el tamaño de papel (Recomendado: A3 para maximizar tamaño)</li>
          <li>3. Configura márgenes mínimos</li>
          <li>4. Imprime y coloca en lugar visible del club</li>
          <li>5. Los jugadores podrán escanear con cualquier teléfono</li>
        </ol>
      </div>
    </div>
  );
}
