import json, numpy as np, soundfile as sf, os
from kokoro_onnx import Kokoro
k = Kokoro('../tts/kokoro.onnx', '../tts/voices.bin')
D, B = 2.465, 2.322
SC = [
 ['¿Estás considerando...'],
 ['¡bancarrota?', 'Antes de decidir...'],
 ['¡Espera!', 'Revisamos tu reporte antes de que tomes esa decisión.'],
 ['Habla con Laura, de Kayscredit.', 'Tu futuro, tu elección.'],
 ['Nuestros servicios.', 'Reparación de crédito. Revisamos errores e inexactitudes en tu reporte.',
  'Mejor puntaje. Accede a mejores tasas, préstamos y tarjetas.', 'Libertad financiera. Un buen crédito te da opciones.'],
 ['Mejor crédito, mejor vida.', 'Mejor crédito: más poder de compra.', 'Más oportunidades: préstamos, vivienda y más.',
  'Tranquilidad: menos deudas, más estabilidad.', 'Libertad financiera: vive la vida en tus propios términos.'],
 ['¡Cuando lleguemos a quinientos seguidores,', 'vienen sorpresas!'],
 ['Habla con Laura.', 'Escríbenos en Instagram: arroba credit keys.', 'O comenta: crédito.', 'Repara tu crédito, construye tu libertad financiera.'],
]
sr = 24000; clips = []
for sc in SC:
    row = []
    for txt in sc:
        a, sr = k.create(txt, voice='ef_dora', speed=1.0, lang='es')
        nz = np.where(np.abs(a) > 0.01)[0]; a = a[max(0, nz[0] - 150):nz[-1] + 1500]
        row.append(a)
    clips.append(row)
GAP = 0.35
starts, ev = [0.0, D], []
for i, row in enumerate(clips):
    s0 = starts[i]
    lead = 0.15 if i != 1 else 0.0
    t = lead; e = []
    for a in row:
        e.append(t); t += len(a) / sr + GAP
    ev.append(e)
    if i >= 1 and i < len(clips) - 1:
        need = s0 + t + 0.25
        n = int(np.ceil((need - D) / B - 1e-6)); starts.append(D + n * B)
end = starts[-1] + ev[-1][-1] + len(clips[-1][-1]) / sr + 2.2
dur = round(end * 30) / 30
out = np.zeros(int((dur + 1) * sr))
for i, row in enumerate(clips):
    for a, e in zip(row, ev[i]):
        s = int((starts[i] + e) * sr); out[s:s + len(a)] += a
sf.write('vo_full.wav', out[:int(dur * sr)], sr)
json.dump({'starts': starts, 'ev': ev, 'dur': dur, 'len': [[len(a)/sr for a in r] for r in clips]}, open('plan.json', 'w'), indent=1)
print(json.dumps({'starts': [round(x, 2) for x in starts], 'dur': dur}))
for i, e in enumerate(ev): print(i, [round(x, 2) for x in e])
