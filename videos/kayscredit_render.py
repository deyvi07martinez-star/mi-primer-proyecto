import sys, math, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

W, H, FPS = 1080, 1920, 30
DUR = 34.0
D = 2.465            # drop (song 120.065 - start 117.6)
B = 2.322            # bar length (4 beats @ 103.36 BPM)
FD = '/usr/share/fonts/opentype/inter/'
def F(name, size): return ImageFont.truetype(FD + name, size)

NAVY = (4, 10, 30); BLUE = (30, 91, 255); LBLUE = (77, 163, 255); WHITE = (255, 255, 255)
GREY = (190, 205, 235)

# ---------- easing ----------
def clamp(x, a=0, b=1): return max(a, min(b, x))
def eo(x): x = clamp(x); return 1 - (1 - x) ** 3
def ebk(x):  # ease out back
    x = clamp(x); c1 = 1.70158; c3 = c1 + 1
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2
def eel(x):  # elastic-ish
    x = clamp(x)
    if x in (0, 1): return x
    return 2 ** (-10 * x) * math.sin((x * 10 - 0.75) * 2 * math.pi / 3) + 1
def prog(t, a, d): return clamp((t - a) / d)

# ---------- assets ----------
fl = Image.open('flyer.jpg').convert('RGB')
laura = fl.crop((25, 8, 318, 492))
logo = fl.crop((328, 38, 718, 158)).convert('RGB')
la = np.asarray(logo).astype(np.float32)
lum = la.max(2)
alpha = np.clip((lum - 55) * 3.2, 0, 255).astype(np.uint8)
bluish = (la[..., 2] > la[..., 0] + 60) & (la[..., 2] > 90)
la2 = la.copy(); la2[bluish] = (120, 190, 255)
alpha = np.where(bluish, np.clip((la[..., 2] - 70) * 3, 0, 255), alpha).astype(np.uint8)
logo = Image.fromarray(la2.astype(np.uint8)).convert('RGBA'); logo.putalpha(Image.fromarray(alpha))
gift = fl.crop((872, 688, 998, 800)).convert('RGBA')
gm = Image.new('L', gift.size, 0); ImageDraw.Draw(gm).ellipse((6, 2, 120, 112), 255)
gm = gm.filter(ImageFilter.GaussianBlur(8)); gift.putalpha(gm)

def rounded_photo(img, w, h, r, border=6):
    img = img.resize((w, int(img.height * w / img.width)), Image.LANCZOS)
    img = img.crop((0, 0, w, h)).filter(ImageFilter.UnsharpMask(2, 60, 2))
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, w - 1, h - 1), r, fill=255)
    out = Image.new('RGBA', (w + border * 2, h + border * 2), (0, 0, 0, 0))
    bd = Image.new('RGBA', out.size, (0, 0, 0, 0))
    ImageDraw.Draw(bd).rounded_rectangle((0, 0, out.width - 1, out.height - 1), r + border, fill=LBLUE + (255,))
    out.alpha_composite(bd)
    ph = img.convert('RGBA'); ph.putalpha(m)
    out.alpha_composite(ph, (border, border))
    return out
laura_card = rounded_photo(laura, 600, 860, 48)
laura_small = laura.crop((40, 0, 260, 220)).resize((300, 300), Image.LANCZOS)
cm = Image.new('L', (300, 300), 0); ImageDraw.Draw(cm).ellipse((0, 0, 299, 299), 255)
lc = Image.new('RGBA', (316, 316), (0, 0, 0, 0)); ImageDraw.Draw(lc).ellipse((0, 0, 315, 315), fill=LBLUE + (255,))
ls = laura_small.convert('RGBA'); ls.putalpha(cm); lc.alpha_composite(ls, (8, 8)); laura_circle = lc

# ---------- background (precomputed) ----------
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
base = np.zeros((H, W, 3), np.float32)
g = yy / H
for i, (c0, c1) in enumerate(zip((2, 4, 14), (6, 16, 52))):
    base[..., i] = c0 + (c1 - c0) * g
vig = 1 - 0.55 * np.clip(((xx - W / 2) / (W * 0.75)) ** 2 + ((yy - H / 2) / (H * 0.7)) ** 2, 0, 1)
SM = 4  # glows computed at low res
ys, xs = np.mgrid[0:H // SM, 0:W // SM].astype(np.float32) * SM
rng = np.random.default_rng(7)
parts = [(rng.uniform(0, W), rng.uniform(0, H), rng.uniform(1.5, 4.5), rng.uniform(20, 70), rng.uniform(0.2, 0.8)) for _ in range(70)]
grain_bank = [Image.fromarray((rng.normal(0, 3, (H // 2, W // 2))).clip(-20, 20).astype(np.int8).view(np.uint8)) for _ in range(4)]

def blob(cx, cy, r, inten):
    return inten * np.exp(-(((xs - cx) ** 2 + (ys - cy) ** 2) / (2 * r * r)))

def background(t, pulse):
    l = blob(W * (0.5 + 0.35 * math.sin(t * 0.6)), H * (0.3 + 0.1 * math.cos(t * 0.4)), 330, 0.55 + 0.45 * pulse)
    l += blob(W * (0.5 - 0.4 * math.cos(t * 0.45)), H * (0.8 + 0.08 * math.sin(t * 0.7)), 380, 0.4 + 0.3 * pulse)
    lu = np.asarray(Image.fromarray((l * 120).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)).astype(np.float32) / 120
    img = base.copy()
    img[..., 0] += lu * 20; img[..., 1] += lu * 60; img[..., 2] += lu * 190
    img *= vig[..., None]
    im = Image.fromarray(img.clip(0, 255).astype(np.uint8))
    d = ImageDraw.Draw(im, 'RGBA')
    # perspective grid floor (subtle)
    for k in range(-8, 9):
        d.line((W / 2 + k * 40, 1250, W / 2 + k * 260, H), fill=(60, 120, 255, 28), width=2)
    off = (t * 60) % 80
    for j in range(10):
        y = 1250 + ((j * 80 + off) ** 1.25) * 0.55
        if y < H: d.line((0, y, W, y), fill=(60, 120, 255, 22), width=2)
    for (px, py, pr, sp, a) in parts:
        y = (py - t * sp) % H
        d.ellipse((px - pr, y - pr, px + pr, y + pr), fill=(140, 190, 255, int(255 * a * 0.5)))
    return im

# ---------- text helpers ----------
def text_img(txt, font, fill=WHITE, stroke=0, sfill=None, shadow=True, glow=None):
    bb = list(font.getbbox(txt, stroke_width=stroke)); rb = font.getbbox('ÁÉgjy', stroke_width=stroke); bb[1], bb[3] = rb[1], rb[3]
    pad = 40
    w, h = bb[2] - bb[0] + pad * 2, bb[3] - bb[1] + pad * 2
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    org = (pad - bb[0], pad - bb[1])
    if glow:
        gl = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        ImageDraw.Draw(gl).text(org, txt, font=font, fill=glow + (255,), stroke_width=stroke + 4, stroke_fill=glow + (255,))
        gl = gl.filter(ImageFilter.GaussianBlur(18)); im.alpha_composite(gl); im.alpha_composite(gl)
    if shadow:
        sh = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        ImageDraw.Draw(sh).text((org[0], org[1] + 8), txt, font=font, fill=(0, 0, 20, 170), stroke_width=stroke)
        im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(8)))
    d = ImageDraw.Draw(im)
    d.text(org, txt, font=font, fill=fill, stroke_width=stroke, stroke_fill=sfill or fill)
    return im
CACHE = {}
def T(key, *a, **k):
    if key not in CACHE: CACHE[key] = text_img(*a, **k)
    return CACHE[key]

def paste(canvas, im, cx, cy, scale=1.0, alpha=1.0, rot=0):
    if alpha <= 0.01 or scale <= 0.01: return
    if scale != 1.0:
        im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.BILINEAR)
    if rot: im = im.rotate(rot, Image.BICUBIC, expand=True)
    if alpha < 1:
        a = im.getchannel('A').point(lambda v: int(v * alpha)); im = im.copy(); im.putalpha(a)
    canvas.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2)))

def pill(w, h, fill, outline=None, r=None):
    im = Image.new('RGBA', (w + 60, h + 60), (0, 0, 0, 0))
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((30, 40, 30 + w, 40 + h), r or h // 2, fill=(0, 0, 20, 150))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(12)))
    ImageDraw.Draw(im).rounded_rectangle((30, 30, 30 + w, 30 + h), r or h // 2, fill=fill, outline=outline, width=4 if outline else 0)
    return im

# ---------- icons (simple line icons) ----------
def icon(kind, s=120, col=WHITE):
    im = Image.new('RGBA', (s, s), (0, 0, 0, 0)); d = ImageDraw.Draw(im); w = max(6, s // 14)
    if kind == 'doc':
        d.rounded_rectangle((s * .22, s * .12, s * .7, s * .85), 8, outline=col, width=w)
        for i in range(3): d.line((s * .32, s * (.32 + i * .15), s * .58, s * (.32 + i * .15)), fill=col, width=w)
        d.ellipse((s * .5, s * .52, s * .82, s * .84), outline=col, width=w); d.line((s * .78, s * .8, s * .92, s * .94), fill=col, width=w)
    elif kind == 'chart':
        for i, hh in enumerate((.3, .45, .6, .75)):
            d.rectangle((s * (.15 + i * .19), s * (.9 - hh), s * (.27 + i * .19), s * .9), fill=col)
        d.line((s * .12, s * .55, s * .45, s * .3, s * .6, s * .4, s * .9, s * .1), fill=col, width=w)
    elif kind == 'shield':
        d.polygon([(s * .5, s * .08), (s * .88, s * .22), (s * .82, s * .62), (s * .5, s * .92), (s * .18, s * .62), (s * .12, s * .22)], outline=col, width=w)
        d.line((s * .32, s * .5, s * .46, s * .64, s * .7, s * .38), fill=col, width=w)
    elif kind == 'gauge':
        d.arc((s * .08, s * .18, s * .92, s * 1.02), 180, 360, fill=col, width=w)
        d.line((s * .5, s * .6, s * .74, s * .32), fill=col, width=w); d.ellipse((s * .43, s * .53, s * .57, s * .67), fill=col)
    elif kind == 'card':
        d.rounded_rectangle((s * .08, s * .22, s * .92, s * .78), 10, outline=col, width=w)
        d.rectangle((s * .08, s * .34, s * .92, s * .44), fill=col); d.line((s * .2, s * .64, s * .45, s * .64), fill=col, width=w)
    elif kind == 'dollar':
        d.ellipse((s * .08, s * .08, s * .92, s * .92), outline=col, width=w)
        f = F('Inter-Black.otf', int(s * .55)); d.text((s * .5, s * .5), '$', font=f, fill=col, anchor='mm')
    elif kind == 'person':
        d.ellipse((s * .38, s * .06, s * .62, s * .3), fill=col)
        d.line((s * .5, s * .32, s * .5, s * .66), fill=col, width=w * 2)
        d.line((s * .18, s * .18, s * .5, s * .42, s * .82, s * .18), fill=col, width=w)
        d.line((s * .5, s * .62, s * .3, s * .94), fill=col, width=w); d.line((s * .5, s * .62, s * .7, s * .94), fill=col, width=w)
    elif kind == 'ig':
        d.rounded_rectangle((s * .1, s * .1, s * .9, s * .9), s * .24, outline=col, width=w)
        d.ellipse((s * .3, s * .3, s * .7, s * .7), outline=col, width=w); d.ellipse((s * .66, s * .2, s * .76, s * .3), fill=col)
    elif kind == 'chat':
        d.rounded_rectangle((s * .08, s * .12, s * .92, s * .72), s * .18, outline=col, width=w)
        d.polygon([(s * .25, s * .68), (s * .45, s * .7), (s * .22, s * .9)], fill=col)
    return im

def circ_icon(kind, s=150):
    im = Image.new('RGBA', (s + 40, s + 40), (0, 0, 0, 0))
    gl = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(gl).ellipse((20, 20, 20 + s, 20 + s), fill=BLUE + (200,))
    im.alpha_composite(gl.filter(ImageFilter.GaussianBlur(14)))
    ImageDraw.Draw(im).ellipse((20, 20, 20 + s, 20 + s), fill=BLUE + (255,), outline=LBLUE + (255,), width=4)
    ic = icon(kind, int(s * .55)); im.alpha_composite(ic, (20 + (s - ic.width) // 2, 20 + (s - ic.height) // 2))
    return im

# ---------- fonts ----------
fBlackI = lambda s: F('Inter-BlackItalic.otf', s)
fBlack = lambda s: F('Inter-Black.otf', s)
fXB = lambda s: F('Inter-ExtraBold.otf', s)
fSB = lambda s: F('Inter-SemiBold.otf', s)
fMI = lambda s: F('Inter-MediumItalic.otf', s)

# ---------- word-by-word caption ----------
def caption_lines(canvas, t, t0, lines, y0, size=78, step=0.16, hl=(), lh=1.22, font=None):
    font = font or fBlack(size)
    y = y0; k = 0
    for line in lines:
        words = line.split(' ')
        imgs = []
        for wd in words:
            col = LBLUE if wd.strip('“”.,¿?') in hl else WHITE
            imgs.append(T(('cap', wd, size, col), wd, font, fill=col, glow=(BLUE if col == LBLUE else None)))
        widths = [im.width - 80 for im in imgs]; sp = size * 0.28
        total = sum(widths) + sp * (len(words) - 1)
        x = W / 2 - total / 2
        for im, wdt in zip(imgs, widths):
            p = prog(t, t0 + k * step, 0.28)
            if p > 0:
                paste(canvas, im, x + wdt / 2, y + (1 - eo(p)) * 40, scale=0.6 + 0.4 * ebk(p), alpha=eo(p))
            x += wdt + sp; k += 1
        y += size * lh

# ---------- scenes ----------
def bar_t(n): return D + n * B
S2, S3, S4, S5, S6, S7, S8 = D, bar_t(1), bar_t(3), bar_t(5), bar_t(8), bar_t(10), bar_t(11)

def scene_hook(c, t):
    # build-up: words appear on the pre-drop beats
    z = 1 + 0.03 * t
    p1 = prog(t, 0.05, 0.35); p2 = prog(t, 0.75, 0.35)
    paste(c, T('h1', '¿ESTÁS', fBlackI(150), glow=BLUE), W / 2, 780, z * (0.5 + 0.5 * ebk(p1)), eo(p1))
    paste(c, T('h2', 'CONSIDERANDO', fBlackI(104), glow=BLUE), W / 2, 950, z * (0.5 + 0.5 * ebk(p2)), eo(p2))
    # countdown dots on the riser
    for i in range(3):
        pi = prog(t, 1.4 + i * 0.3, 0.2)
        if pi > 0: ImageDraw.Draw(c).ellipse((W / 2 - 90 + i * 90 - 14 * eo(pi), 1150 - 14 * eo(pi), W / 2 - 90 + i * 90 + 14 * eo(pi), 1150 + 14 * eo(pi)), fill=LBLUE)

def scene_bancarrota(c, t):
    lt = t - S2
    sh = max(0, 1 - lt / 0.5) * 26
    dx, dy = (math.sin(lt * 90) * sh, math.cos(lt * 77) * sh)
    paste(c, T('h1b', '¿ESTÁS CONSIDERANDO', fBlackI(76)), W / 2 + dx, 740 + dy, 1, 1)
    s = 2.4 - 1.4 * eo(prog(lt, 0, 0.18)) + 0.03 * math.sin(lt * 6)
    paste(c, T('bk', 'BANCARROTA?', fBlackI(150), fill=WHITE, glow=BLUE, stroke=0), W / 2 + dx, 930 + dy, s * 0.84, eo(prog(lt, 0, 0.1)))
    # blue underline swipe
    pw = eo(prog(lt, 0.25, 0.35))
    d = ImageDraw.Draw(c); d.rounded_rectangle((W / 2 - 430 * pw, 1060, W / 2 + 430 * pw, 1076), 8, fill=BLUE)
    if pw > 0: caption_lines(c, t, S2 + 0.7, ['Antes de decidir...'], 1170, size=64, font=fMI(64))

def scene_espera(c, t):
    lt = t - S3
    p = prog(lt, 0, 0.3)
    paste(c, pill(520, 130, BLUE + (255,)), W / 2, 640, ebk(p), eo(p))
    paste(c, T('esp', 'ESPERA ✋'.replace(' ✋', ''), fBlack(92)), W / 2, 640, ebk(p), eo(p))
    caption_lines(c, t, S3 + 0.45, ['Revisamos tu', 'reporte ANTES', 'de que tomes', 'esa decisión.'], 880, size=96, step=0.17, hl=('ANTES',))
    # doc icon pop
    pi = prog(lt, 2.6, 0.4)
    paste(c, circ_icon('doc', 170), W / 2, 1400, ebk(pi), eo(pi))

def scene_laura(c, t):
    lt = t - S4
    p = prog(lt, 0, 0.55)
    y = 800 + (1 - eo(p)) * 900
    rot = (1 - eo(p)) * -8 + math.sin(lt * 1.3) * 0.8
    # glow behind
    gl = Image.new('RGBA', (760, 1020), (0, 0, 0, 0)); ImageDraw.Draw(gl).rounded_rectangle((80, 80, 680, 940), 60, fill=BLUE + (230,))
    gl = CACHE.setdefault('lglow', gl.filter(ImageFilter.GaussianBlur(40)))
    paste(c, gl, W / 2, y, 1.0 + 0.02 * math.sin(lt * 4), eo(p))
    paste(c, laura_card, W / 2, y, 0.92 + 0.03 * lt / (2 * B), 1, rot)
    # logo on top
    pl = prog(lt, 0.5, 0.45)
    paste(c, logo, W / 2, 285, 1.95 * (0.6 + 0.4 * ebk(pl)), eo(pl))
    # name tag
    pt = prog(lt, 0.9, 0.4)
    tag = CACHE.setdefault('tag', pill(620, 120, (255, 255, 255, 255)))
    paste(c, tag, W / 2 + (1 - eo(pt)) * 600, 1290, 1, eo(pt))
    paste(c, T('hl', 'Habla con Laura', fBlack(64), fill=NAVY, shadow=False), W / 2 + (1 - eo(pt)) * 600, 1290, 1, eo(pt))
    pc = prog(lt, 1.5, 0.4)
    paste(c, T('lsub', 'Tu futuro, tu elección', fMI(52), fill=GREY), W / 2, 1420, 1, eo(pc))

SERV = [('doc', 'REPARACIÓN DE CRÉDITO', 'Revisamos errores e', 'inexactitudes en tu reporte'),
        ('chart', 'MEJOR PUNTAJE', 'Accede a mejores tasas,', 'préstamos y tarjetas'),
        ('shield', 'LIBERTAD FINANCIERA', 'Un buen crédito', 'te da opciones')]
def scene_servicios(c, t):
    lt = t - S5
    ph = prog(lt, 0, 0.35)
    paste(c, pill(640, 110, BLUE + (255,)), W / 2, 380, ebk(ph), eo(ph))
    paste(c, T('ns', 'NUESTROS SERVICIOS', fXB(52)), W / 2, 380, ebk(ph), eo(ph))
    d = ImageDraw.Draw(c, 'RGBA')
    for i, (ic, ttl, l1, l2) in enumerate(SERV):
        ti = 0.35 + i * B
        p = prog(lt, ti, 0.45)
        if p <= 0: continue
        cy = 640 + i * 290; cx = W / 2 + (1 - eo(p)) * (W if i % 2 == 0 else -W)
        card = CACHE.get(('card', i))
        if card is None:
            card = pill(900, 240, (255, 255, 255, 245), r=36)
            cd = ImageDraw.Draw(card)
            ci = circ_icon(ic, 130); card.alpha_composite(ci, (50, 30 + (240 - ci.height) // 2))
            cd.text((250, 78), ttl, font=fBlack(46), fill=(20, 60, 200))
            cd.text((250, 142), l1, font=fSB(36), fill=(30, 35, 55)); cd.text((250, 188), l2, font=fSB(36), fill=(30, 35, 55))
            CACHE[('card', i)] = card
        active = 1.0 if (lt - ti) < B else 0.0
        paste(c, card, cx, cy, 1.0 + 0.03 * active * math.sin(min(lt - ti, 1) * math.pi), 1.0 if active or lt < ti + B else 0.75)
    # progress bar
    pr = clamp((lt - 0.35) / (3 * B - 0.6))
    d.rounded_rectangle((140, 1500, 940, 1514), 7, fill=(255, 255, 255, 50))
    d.rounded_rectangle((140, 1500, 140 + 800 * eo(pr), 1514), 7, fill=LBLUE + (255,))
    n = min(3, int((lt - 0.35) // B) + 1) if lt > 0.35 else 0
    paste(c, T(('pn', n), f'{n}/3', fXB(40), fill=GREY), W / 2, 1565, 1, 1 if n else 0)

BEN = [('gauge', 'MEJOR CRÉDITO', 'Más poder de compra'), ('card', 'MÁS OPORTUNIDADES', 'Préstamos, vivienda y más'),
       ('dollar', 'TRANQUILIDAD', 'Menos deudas, más estabilidad'), ('person', 'LIBERTAD FINANCIERA', 'Vive la vida en tus propios términos')]
def scene_beneficios(c, t):
    lt = t - S6
    paste(c, T('mcmv', 'MEJOR CRÉDITO, MEJOR VIDA', fXB(50), fill=LBLUE), W / 2, 420, 1, eo(prog(lt, 0, 0.3)))
    step = B / 2
    i = min(3, int(lt // step)); li = lt - i * step
    ic, ttl, sub = BEN[i]
    p = prog(li, 0, 0.28); out = prog(li, step - 0.12, 0.12) if i < 3 else 0
    a = eo(p) * (1 - out)
    paste(c, circ_icon(ic, 260), W / 2, 760, 0.4 + 0.6 * eel(prog(li, 0, 0.6)), a)
    words = ttl.split(' ')
    for k, wd in enumerate(words):
        pk = prog(li, 0.05 + k * 0.08, 0.25)
        paste(c, T(('bt', wd), wd, fBlackI(118 if len(ttl) < 16 else 104), glow=BLUE), W / 2, 1040 + k * 135 - (len(words) - 1) * 60, 0.6 + 0.4 * ebk(pk), eo(pk) * (1 - out))
    paste(c, T(('bs', i), sub, fSB(50), fill=GREY), W / 2, 1300, 1, eo(prog(li, 0.25, 0.3)) * (1 - out))
    # dots indicator
    d = ImageDraw.Draw(c)
    for k in range(4):
        r = 12 if k == i else 8
        d.ellipse((W / 2 - 75 + k * 50 - r, 1420 - r, W / 2 - 75 + k * 50 + r, 1420 + r), fill=LBLUE if k == i else (90, 110, 160))

def scene_500(c, t):
    lt = t - S7
    paste(c, T('cll', '¡CUANDO LLEGUEMOS A', fXB(60)), W / 2, 520, 1, eo(prog(lt, 0, 0.25)))
    n = int(500 * eo(prog(lt, 0.1, 1.1)))
    s = 1 + 0.12 * math.sin(clamp((lt - 1.2) / 0.3) * math.pi)
    paste(c, text_img(str(n), fBlack(300), glow=BLUE), W / 2, 760, s, 1)
    pp = prog(lt, 0.3, 0.3)
    paste(c, pill(560, 110, BLUE + (255,)), W / 2, 960, ebk(pp), eo(pp))
    paste(c, T('seg', 'SEGUIDORES', fBlack(68)), W / 2, 960, ebk(pp), eo(pp))
    pv = prog(lt, 1.2, 0.4)
    paste(c, T('vs', 'vienen sorpresas!', fBlackI(90), glow=BLUE), W / 2, 1110, 0.6 + 0.4 * ebk(pv), eo(pv))
    pg = prog(lt, 1.35, 0.5)
    paste(c, gift, W / 2, 1330, 2.0 * eel(pg), eo(pg), rot=math.sin(lt * 9) * 6 * eo(pg))

def scene_cta(c, t):
    lt = t - S8
    p = prog(lt, 0, 0.4)
    paste(c, logo, W / 2, 300, 1.7, eo(p))
    pc = prog(lt, 0.2, 0.5)
    paste(c, laura_circle, W / 2, 560, 0.3 + 0.7 * eel(pc), eo(pc))
    pt = prog(lt, 0.5, 0.35)
    paste(c, T('hl2', 'Habla con Laura', fBlack(84), glow=BLUE), W / 2, 790, 0.6 + 0.4 * ebk(pt), eo(pt))
    # IG card
    pi = prog(lt, 0.9, 0.45)
    ig = CACHE.get('igcard')
    if ig is None:
        ig = pill(880, 200, (255, 255, 255, 250), r=44); d = ImageDraw.Draw(ig)
        ic = circ_icon('ig', 140); ig.alpha_composite(ic, (55, 30 + (200 - ic.height) // 2))
        d.text((260, 70), 'Escríbenos en Instagram', font=fSB(38), fill=(60, 70, 100))
        d.text((256, 116), '@creditkays', font=fBlack(76), fill=(20, 60, 200))
        CACHE['igcard'] = ig
    pulse = 1 + 0.025 * math.sin(max(0, lt - 1.4) * 2 * math.pi / (B / 2))
    paste(c, ig, W / 2, 1000 + (1 - eo(pi)) * 200, pulse * (0.8 + 0.2 * ebk(pi)), eo(pi))
    # comment CTA
    pk = prog(lt, 1.6, 0.4)
    paste(c, T('cm1', 'o comenta', fMI(56), fill=GREY), W / 2, 1180, 1, eo(pk))
    pk2 = prog(lt, 1.85, 0.35)
    paste(c, pill(560, 130, BLUE + (255,), outline=LBLUE + (255,)), W / 2, 1310, ebk(pk2) * pulse, eo(pk2))
    paste(c, T('cm2', '“CRÉDITO”', fBlackI(84)), W / 2, 1310, ebk(pk2) * pulse, eo(pk2))
    pf = prog(lt, 2.4, 0.4)
    paste(c, T('foot', 'Repara tu crédito, construye tu libertad financiera', fSB(34), fill=GREY), W / 2, 1450, 1, eo(pf))

SCENES = [(0, S2, scene_hook), (S2, S3, scene_bancarrota), (S3, S4, scene_espera), (S4, S5, scene_laura),
          (S5, S6, scene_servicios), (S6, S7, scene_beneficios), (S7, S8, scene_500), (S8, 99, scene_cta)]
CUTS = [s[0] for s in SCENES[1:]]

def frame(t):
    since = min([t - c for c in CUTS if t >= c] + [9])
    beat_ph = ((t - D) % (B / 4)) / (B / 4) if t >= D else 1
    pulse = math.exp(-beat_ph * 4) if t >= D else 0.2 * t / D
    c = background(t, pulse).convert('RGBA')
    for (a, b, fn) in SCENES:
        if a <= t < b:
            layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); fn(layer, t)
            # transition: zoom-punch in + blur on scene start, quick fade out at end
            pin = prog(t - a, 0, 0.22)
            if pin < 1:
                s = 1.12 - 0.12 * eo(pin)
                layer = layer.resize((int(W * s), int(H * s)), Image.BILINEAR).crop((int((W * s - W) / 2), int((H * s - H) / 2), int((W * s - W) / 2) + W, int((H * s - H) / 2) + H))
                if pin < 0.6: layer = layer.filter(ImageFilter.GaussianBlur(10 * (1 - pin / 0.6)))
            pout = prog(t, b - 0.12, 0.12) if b < 99 else 0
            if pout > 0:
                al = layer.getchannel('A').point(lambda v: int(v * (1 - pout))); layer.putalpha(al)
            c.alpha_composite(layer)
    # flash on cuts
    fl_a = max(0, 1 - since / 0.15) * (0.55 if since < 9 else 0)
    if abs(t - S2) < 0.2: fl_a = max(fl_a, max(0, 1 - (t - S2) / 0.25) * 0.9) if t >= S2 else fl_a
    c = c.convert('RGB')
    if fl_a > 0.01: c = Image.blend(c, Image.new('RGB', (W, H), (200, 225, 255)), fl_a)
    # grain
    gr = grain_bank[int(t * FPS) % 4].resize((W, H)).convert('L')
    arr = np.asarray(c).astype(np.int16) + (np.asarray(gr).astype(np.int8).astype(np.int16)[..., None])
    # final fade to black
    fo = clamp((t - (DUR - 0.6)) / 0.6)
    arr = arr * (1 - fo)
    return arr.clip(0, 255).astype(np.uint8)

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'stills':
        for t in map(float, sys.argv[2:]):
            Image.fromarray(frame(t)).save(f'qc_{t:05.2f}.png')
    else:
        a, b = (float(sys.argv[2]), float(sys.argv[3])) if len(sys.argv) > 3 else (0, DUR)
        out = sys.argv[4] if len(sys.argv) > 4 else 'video.mp4'
        p = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'medium', '-b:v', '22M', '-maxrate', '24M', '-bufsize', '40M', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
        for i in range(int(round(a * FPS)), int(round(b * FPS))):
            p.stdin.write(frame(i / FPS).tobytes())
        p.stdin.close(); p.wait()
