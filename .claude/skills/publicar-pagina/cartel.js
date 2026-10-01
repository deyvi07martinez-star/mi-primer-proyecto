// Cartel imprimible con el QR. Uso: node cartel.js https://mi-pagina.vercel.app ./salida
// Antes corre qr.js en la misma carpeta (lee qr-dataurl.txt). Cambia los textos del HTML por los de la página nueva.
// Requiere playwright-core y Chromium en /opt/pw-browsers (ajusta executablePath si cambia la versión).
const fs = require('fs');
const { chromium } = require('playwright-core');
const qr = fs.readFileSync('qr-dataurl.txt', 'utf8').trim();
const URL = process.argv[2];
const OUT = process.argv[3] || '.';

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box;}
body{width:1240px;height:1754px;background:#06070a;color:#f4f7fb;
  font-family:'DejaVu Sans',Arial,Helvetica,sans-serif;display:flex;flex-direction:column;
  align-items:center;justify-content:space-between;padding:90px 80px;position:relative;overflow:hidden;}
.glow{position:absolute;top:-340px;left:50%;transform:translateX(-50%);width:1300px;height:900px;
  background:radial-gradient(ellipse,rgba(29,78,216,0.45),transparent 62%);}
.glow2{position:absolute;bottom:-360px;left:50%;transform:translateX(-50%);width:1400px;height:900px;
  background:radial-gradient(ellipse,rgba(11,47,122,0.5),transparent 62%);}
.top,.mid,.bot{position:relative;z-index:2;text-align:center;width:100%;}
.ball{width:86px;height:86px;margin:0 auto 26px;}
h1{font-size:104px;font-weight:800;letter-spacing:10px;line-height:1;}
h1 .dot{color:#60a5fa;}
.sub{margin-top:18px;font-size:34px;font-weight:700;letter-spacing:13px;color:#60a5fa;}
.rule{width:180px;height:5px;background:#1d4ed8;margin:40px auto 0;border-radius:3px;}
.card{background:#fff;border-radius:34px;padding:42px;width:760px;margin:0 auto;
  box-shadow:0 34px 90px rgba(0,0,0,0.6);}
.card img{width:100%;display:block;}
.scan{margin-top:46px;font-size:52px;font-weight:800;letter-spacing:3px;}
.scan span{color:#60a5fa;}
.desc{margin-top:22px;font-size:31px;color:rgba(244,247,251,0.78);line-height:1.5;}
.chips{display:flex;gap:20px;justify-content:center;margin-top:44px;flex-wrap:wrap;}
.chip{border:2px solid rgba(96,165,250,0.5);background:rgba(29,78,216,0.16);border-radius:60px;
  padding:16px 34px;font-size:27px;font-weight:700;color:#dce9ff;}
.hours{margin-top:40px;font-size:30px;font-weight:700;color:#f4f7fb;letter-spacing:1px;}
.hours small{display:block;margin-top:10px;font-size:24px;font-weight:400;color:rgba(244,247,251,0.6);letter-spacing:0;}
.link{margin-top:34px;font-size:21px;color:rgba(244,247,251,0.45);word-break:break-all;}
</style></head><body>
<div class="glow"></div><div class="glow2"></div>
<div class="top">
  <svg class="ball" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#f4f7fb" stroke="#3b82f6" stroke-width="4"/><path d="M50 20l15 11-6 18H41l-6-18 15-11Z" fill="#06070a"/><path d="M20 45l13 10-5 16-14-2M80 45L67 55l5 16 14-2M38 84l5-12h14l5 12-12 5-12-5Z" fill="#06070a" opacity="0.9"/></svg>
  <h1>LIGA<span class="dot">•</span>CLUB</h1>
  <div class="sub">LOS PRADOS F.C.</div>
  <div class="rule"></div>
</div>
<div class="mid">
  <div class="card"><img src="${qr}" alt="QR"></div>
  <div class="scan">ESCANEA Y <span>ENTRA</span></div>
  <div class="desc">Mira los 26 equipos de la A a la Z,<br>quién va ganando y el partido en vivo.</div>
</div>
<div class="bot">
  <div class="chips"><span class="chip">⚽ 5 contra 5</span><span class="chip">⏱ 15 minutos</span><span class="chip">🏆 Gana y te quedas</span></div>
  <div class="hours">MARTES 2:00 – 6:30 PM &nbsp;·&nbsp; VIERNES 2:00 – 6:00 PM
    <small>Lunes, miércoles, jueves, sábado y domingo: cerrado</small></div>
  <div class="link">${URL}</div>
</div>
</body></html>`;

fs.writeFileSync('cartel.html', html);
(async () => {
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
  const p = await b.newPage({ viewport:{width:1240,height:1754}, deviceScaleFactor:1.5 });
  await p.goto('file://' + process.cwd() + '/cartel.html');
  await p.waitForTimeout(700);
  await p.screenshot({ path:OUT + '/cartel.png' });
  await p.pdf({ path:OUT + '/cartel.pdf', format:'A4', printBackground:true });
  await b.close();
  console.log('cartel listo');
})();
