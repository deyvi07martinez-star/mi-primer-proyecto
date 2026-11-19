import sys, soundfile as sf, numpy as np
from kokoro_onnx import Kokoro
k = Kokoro('kokoro.onnx', 'voices.bin')
D, B = 2.465, 2.322
L = [  # (start, max_len, text)
 (0.15, 4.5, "¿Estás pensando en declararte en bancarrota?"),
 (4.85, 4.5, "¡Espera! Antes de decidir, déjanos revisar tu reporte de crédito."),
 (9.55, 4.4, "Habla con Laura, de Kayscredit."),
 (14.2, 6.7, "Te ayudamos a reparar tu crédito, a mejorar tu puntaje, y a lograr tu libertad financiera."),
 (21.15, 4.4, "Mejor crédito... mejor vida."),
 (25.75, 2.2, "¡Y a los quinientos seguidores, vienen sorpresas!"),
 (28.1, 5.4, "Escríbele a Laura en Instagram, a arroba credit keys. ¡O comenta, crédito!"),
]
sr = 24000; out = np.zeros(int(34 * sr))
for i, (st, mx, txt) in enumerate(L):
    sp = 1.1
    while True:
        a, sr = k.create(txt, voice='ef_dora', speed=sp, lang='es')
        nz = np.where(np.abs(a) > 0.01)[0]; a = a[max(0, nz[0]-200):nz[-1]+1200]
        if len(a) / sr <= mx or sp > 1.45: break
        sp += 0.05
    print(i, round(len(a) / sr, 2), 'max', mx, 'speed', round(sp, 2))
    s = int(st * sr); out[s:s + len(a)] += a[:len(out) - s]
sf.write('vo.wav', out, sr)
