"""Kayscredit reel — clean warm look, rendered natively in 4K (2160x3840).
All layout is written in a 1080x1920 logical space and scaled by S."""
import sys, math, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

S = 2
LW, LH = 1080, 1920
W, H = LW * S, LH * S
FPS, DUR = 30, 34.0
D, B = 2.465, 2.322
FD = '/usr/share/fonts/opentype/inter/'
def F(name, size): return ImageFont.truetype(FD + name, int(size * S))
def sc(v): return int(round(v * S))

# warm palette
CREAM = (255, 244, 230); GOLD = (232, 168, 84); LGOLD = (250, 204, 140); AMBER = (214, 120, 52)
ESP = (44, 26, 16); MUTED = (222, 198, 174); WHITE = (255, 250, 244)

def clamp(x, a=0, b=1): return max(a, min(b, x))
def eo(x): x = clamp(x); return 1 - (1 - x) ** 3
def ebk(x):
    x = clamp(x); c1 = 1.4; c3 = c1 + 1
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2
def prog(t, a, d): return clamp((t - a) / d)

def new(w, h, mode='RGBA'): return Image.new(mode, (sc(w), sc(h)), (0, 0, 0, 0) if mode == 'RGBA' else 0)

class SDraw:
    """ImageDraw wrapper taking logical coordinates."""
    def __init__(self, im): self.d = ImageDraw.Draw(im, 'RGBA' if im.mode == 'RGBA' else None)
    @staticmethod
    def _xy(xy):
        out = []
        for v in xy:
            out.append(tuple(sc(a) for a in v) if isinstance(v, (tuple, list)) else sc(v))
        return out
    def __getattr__(self, name):
        fn = getattr(self.d, name)
        def wrap(xy, *a, **k):
            if 'width' in k: k['width'] = sc(k['width'])
            if 'radius' in k: k['radius'] = sc(k['radius'])
            if name == 'rounded_rectangle' and a: a = (sc(a[0]),) + a[1:]
            return fn(self._xy(xy), *a, **k)
        return wrap

# ---------- assets ----------
fl = Image.open('flyer.jpg').convert('RGB')
def warm(im, k=1.0):
    hsv = np.asarray(im.convert('HSV')).copy()
    h, sat = hsv[..., 0].astype(np.int16), hsv[..., 1]
    blue = (h > 130) & (h < 185) & (sat > 70)
    hsv[..., 0] = np.where(blue, 22, h).astype(np.uint8)
    hsv[..., 1] = np.where(blue, (sat * 0.75).astype(np.uint8), sat)
    im = Image.fromarray(hsv, 'HSV').convert('RGB')
    a = np.asarray(im).astype(np.float32)
    a[..., 0] *= 1 + 0.07 * k; a[..., 1] *= 1 + 0.02 * k; a[..., 2] *= 1 - 0.10 * k
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))
laura = warm(fl.crop((25, 8, 318, 492)))
laura = ImageEnhance.Contrast(laura).enhance(1.04)

lg = np.asarray(fl.crop((328, 38, 718, 158))).astype(np.float32)
lum = lg.max(2)
alpha = np.clip((lum - 55) * 3.2, 0, 255)
bluish = (lg[..., 2] > lg[..., 0] + 60) & (lg[..., 2] > 90)
rgb = np.full(lg.shape, CREAM, np.float32)
rgb[bluish] = GOLD
alpha = np.where(bluish, np.clip((lg[..., 2] - 70) * 3, 0, 255), alpha)
logo = Image.fromarray(np.dstack([rgb, alpha]).astype(np.uint8), 'RGBA')
logo = logo.resize((logo.width * 4, logo.height * 4), Image.LANCZOS)

gift = warm(fl.crop((872, 688, 998, 800)), 0.6).convert('RGBA')
gift = gift.resize((gift.width * 4, gift.height * 4), Image.LANCZOS)
gm = Image.new('L', gift.size, 0); ImageDraw.Draw(gm).ellipse((24, 8, 480, 448), 255)
gift.putalpha(gm.filter(ImageFilter.GaussianBlur(30)))

def soft_shadow(w, h, r, blur=22, a=120, dy=14):
    im = new(w + 120, h + 120); SDraw(im).rounded_rectangle((60, 60 + dy, 60 + w, 60 + h + dy), r, fill=(20, 8, 2, a))
    return im.filter(ImageFilter.GaussianBlur(sc(blur)))

def photo_card(img, w, h, r, border=5):
    big = img.resize((sc(w), int(img.height * sc(w) / img.width)), Image.LANCZOS).crop((0, 0, sc(w), sc(h)))
    big = big.filter(ImageFilter.UnsharpMask(sc(2), 50, 2))
    m = new(w, h, 'L'); SDraw(m).rounded_rectangle((0, 0, w - 0.5, h - 0.5), r, fill=255)
    out = new(w + 120 + border * 2, h + 120 + border * 2)
    out.alpha_composite(soft_shadow(w + border * 2, h + border * 2, r + border, 30, 150, 20))
    SDraw(out).rounded_rectangle((60, 60, 60 + w + border * 2, 60 + h + border * 2), r + border, fill=LGOLD + (255,))
    ph = big.convert('RGBA'); ph.putalpha(m); out.alpha_composite(ph, (sc(60 + border), sc(60 + border)))
    return out
laura_card = photo_card(laura, 600, 860, 44)

def photo_circle(img, d, border=6):
    c = img.crop((40, 0, 260, 220)).resize((sc(d), sc(d)), Image.LANCZOS)
    m = new(d, d, 'L'); SDraw(m).ellipse((0, 0, d, d), fill=255)
    out = new(d + border * 2 + 80, d + border * 2 + 80)
    sh = new(d + border * 2 + 80, d + border * 2 + 80); SDraw(sh).ellipse((40, 52, 40 + d + border * 2, 52 + d + border * 2), fill=(20, 8, 2, 140))
    out.alpha_composite(sh.filter(ImageFilter.GaussianBlur(sc(18))))
    SDraw(out).ellipse((40, 40, 40 + d + border * 2, 40 + d + border * 2), fill=LGOLD + (255,))
    ci = c.convert('RGBA'); ci.putalpha(m); out.alpha_composite(ci, (sc(40 + border), sc(40 + border)))
    return out
laura_circle = photo_circle(laura, 300)

# ---------- background: warm gradient + slow amber light ----------
g = np.linspace(0, 1, H, dtype=np.float32)[:, None]
top, bot = np.array((24, 15, 11), np.float32), np.array((54, 32, 20), np.float32)
grad = top + (bot - top) * g[..., None]
xx = np.linspace(-1, 1, W, dtype=np.float32)[None, :]; yy = np.linspace(-1, 1, H, dtype=np.float32)[:, None]
vig = (1 - 0.35 * np.clip(xx ** 2 * 0.8 + yy ** 2 * 0.6, 0, 1))[..., None]
BASE = Image.fromarray((np.broadcast_to(grad, (H, W, 3)) * vig).clip(0, 255).astype(np.uint8))
gs = 8; ys, xs = np.mgrid[0:LH // gs, 0:LW // gs].astype(np.float32) * gs
def blob(cx, cy, r): return np.exp(-(((xs - cx) ** 2 + (ys - cy) ** 2) / (2 * r * r)))
AMBER_LAYER = Image.new('RGB', (W, H), (255, 150, 70))
def background(t, pulse):
    l = 0.55 * blob(LW * (0.5 + 0.25 * math.sin(t * 0.35)), LH * (0.32 + 0.06 * math.cos(t * 0.3)), 420)
    l += 0.35 * blob(LW * (0.5 - 0.3 * math.cos(t * 0.28)), LH * 0.85, 480)
    l *= 0.85 + 0.15 * pulse
    m = Image.fromarray((l * 255 * 0.42).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    return Image.composite(AMBER_LAYER, BASE, m)

# ---------- text ----------
CACHE = {}
def text_img(txt, font, fill=WHITE, shadow=True, glow=None):
    bb = list(font.getbbox(txt)); rb = font.getbbox('ÁÉgjy'); bb[1], bb[3] = rb[1], rb[3]
    pad = sc(30); w, h = bb[2] - bb[0] + pad * 2, bb[3] - bb[1] + pad * 2
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); org = (pad - bb[0], pad - bb[1])
    if glow:
        gl = Image.new('RGBA', (w, h), (0, 0, 0, 0)); ImageDraw.Draw(gl).text(org, txt, font=font, fill=glow + (110,))
        im.alpha_composite(gl.filter(ImageFilter.GaussianBlur(sc(14))))
    if shadow:
        sh = Image.new('RGBA', (w, h), (0, 0, 0, 0)); ImageDraw.Draw(sh).text((org[0], org[1] + sc(5)), txt, font=font, fill=(20, 8, 2, 130))
        im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(sc(6))))
    ImageDraw.Draw(im).text(org, txt, font=font, fill=fill)
    return im
def T(key, *a, **k):
    if key not in CACHE: CACHE[key] = text_img(*a, **k)
    return CACHE[key]

def paste(canvas, im, cx, cy, scale=1.0, alpha=1.0, rot=0):
    if alpha <= 0.01 or scale <= 0.01: return
    if abs(scale - 1) > 0.002:
        im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.BILINEAR)
    if rot: im = im.rotate(rot, Image.BICUBIC, expand=True)
    if alpha < 0.995:
        im = im.copy(); im.putalpha(im.getchannel('A').point(lambda v: int(v * alpha)))
    canvas.alpha_composite(im, (int(sc(cx) - im.width / 2), int(sc(cy) - im.height / 2)))

def pill(w, h, fill, r=None, outline=None):
    im = new(w + 120, h + 120); r = h / 2 if r is None else r
    im.alpha_composite(soft_shadow(w, h, r, 18, 110, 10))
    SDraw(im).rounded_rectangle((60, 60, 60 + w, 60 + h), r, fill=fill, outline=outline, width=3 if outline else 0)
    return im

def icon(kind, s=120, col=WHITE):
    im = new(s, s); d = SDraw(im); w = max(5, s / 14)
    if kind == 'doc':
        d.rounded_rectangle((s * .22, s * .12, s * .7, s * .85), 6, outline=col, width=w)
        for i in range(3): d.line((s * .32, s * (.32 + i * .15), s * .58, s * (.32 + i * .15)), fill=col, width=w)
        d.ellipse((s * .5, s * .52, s * .82, s * .84), outline=col, width=w); d.line((s * .78, s * .8, s * .92, s * .94), fill=col, width=w)
    elif kind == 'chart':
        for i, hh in enumerate((.3, .45, .6, .75)): d.rounded_rectangle((s * (.15 + i * .19), s * (.9 - hh), s * (.27 + i * .19), s * .9), 2, fill=col)
    elif kind == 'shield':
        d.polygon([(s * .5, s * .08), (s * .88, s * .22), (s * .82, s * .62), (s * .5, s * .92), (s * .18, s * .62), (s * .12, s * .22)], outline=col, width=w)
        d.line((s * .32, s * .5, s * .46, s * .64, s * .7, s * .38), fill=col, width=w, joint='curve')
    elif kind == 'gauge':
        im2 = im; ImageDraw.Draw(im2).arc((sc(s * .08), sc(s * .18), sc(s * .92), sc(s * 1.02)), 180, 360, fill=col, width=sc(w))
        d.line((s * .5, s * .6, s * .74, s * .32), fill=col, width=w); d.ellipse((s * .43, s * .53, s * .57, s * .67), fill=col)
    elif kind == 'card':
        d.rounded_rectangle((s * .08, s * .22, s * .92, s * .78), 8, outline=col, width=w)
        d.rectangle((s * .08, s * .34, s * .92, s * .44), fill=col); d.line((s * .2, s * .64, s * .45, s * .64), fill=col, width=w)
    elif kind == 'dollar':
        d.ellipse((s * .08, s * .08, s * .92, s * .92), outline=col, width=w)
        d.text((s * .5, s * .52), '$', font=F('Inter-Black.otf', s * .55), fill=col, anchor='mm')
    elif kind == 'person':
        d.ellipse((s * .38, s * .06, s * .62, s * .3), fill=col)
        d.line((s * .5, s * .32, s * .5, s * .66), fill=col, width=w * 2)
        d.line((s * .18, s * .18, s * .5, s * .42, s * .82, s * .18), fill=col, width=w, joint='curve')
        d.line((s * .5, s * .62, s * .3, s * .94), fill=col, width=w); d.line((s * .5, s * .62, s * .7, s * .94), fill=col, width=w)
    elif kind == 'ig':
        d.rounded_rectangle((s * .1, s * .1, s * .9, s * .9), s * .24, outline=col, width=w)
        d.ellipse((s * .3, s * .3, s * .7, s * .7), outline=col, width=w); d.ellipse((s * .66, s * .2, s * .76, s * .3), fill=col)
    return im

def circ_icon(kind, s=150):
    key = ('ci', kind, s)
    if key in CACHE: return CACHE[key]
    im = new(s + 80, s + 80)
    sh = new(s + 80, s + 80); SDraw(sh).ellipse((40, 50, 40 + s, 50 + s), fill=(20, 8, 2, 120))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(sc(14))))
    SDraw(im).ellipse((40, 40, 40 + s, 40 + s), fill=GOLD + (255,))
    ic = icon(kind, s * .52, ESP); im.alpha_composite(ic, ((im.width - ic.width) // 2, (im.height - ic.height) // 2))
    CACHE[key] = im; return im

fBlackI = lambda s: F('Inter-BlackItalic.otf', s)
fBlack = lambda s: F('Inter-Black.otf', s)
fXB = lambda s: F('Inter-ExtraBold.otf', s)
fSB = lambda s: F('Inter-SemiBold.otf', s)
fMI = lambda s: F('Inter-MediumItalic.otf', s)

def caption_lines(c, t, t0, lines, y0, size=78, step=0.16, hl=(), lh=1.22, font=None):
    font = font or fBlack(size); y = y0; k = 0
    for line in lines:
        words = line.split(' '); imgs = []
        for wd in words:
            col = LGOLD if wd.strip('“”.,¿?') in hl else WHITE
            imgs.append(T(('cap', wd, size, col, id(font)), wd, font, fill=col))
        widths = [(im.width - sc(60)) / S for im in imgs]; sp = size * 0.28
        x = LW / 2 - (sum(widths) + sp * (len(words) - 1)) / 2
        for im, wdt in zip(imgs, widths):
            p = prog(t, t0 + k * step, 0.32)
            if p > 0: paste(c, im, x + wdt / 2, y + (1 - eo(p)) * 26, 0.85 + 0.15 * eo(p), eo(p))
            x += wdt + sp; k += 1
        y += size * lh

import json
PLAN = json.load(open('plan.json')); ST = PLAN['starts']; EV = PLAN['ev']; LN = PLAN['len']
DUR = PLAN['dur']
S2, S3, S4, S5, S6, S7, S8 = ST[1:]

def scene_hook(c, t):
    p1 = prog(t, EV[0][0], 0.4); p2 = prog(t, EV[0][0] + 0.55, 0.4)
    paste(c, T('h1', '¿ESTÁS', fBlackI(150)), LW / 2, 780 + (1 - eo(p1)) * 40, 1, eo(p1))
    paste(c, T('h2', 'CONSIDERANDO', fBlackI(104)), LW / 2, 950 + (1 - eo(p2)) * 40, 1, eo(p2))
    d = SDraw(c)
    for i in range(3):
        pi = eo(prog(t, 1.5 + i * 0.25, 0.25))
        if pi > 0: d.ellipse((LW / 2 - 60 + i * 60 - 9 * pi, 1120 - 9 * pi, LW / 2 - 60 + i * 60 + 9 * pi, 1120 + 9 * pi), fill=GOLD)

def scene_bancarrota(c, t):
    lt = t - S2; E = EV[1]
    sh = max(0, 1 - lt / 0.35) * 8; dx = math.sin(lt * 70) * sh
    paste(c, T('h1b', '¿ESTÁS CONSIDERANDO', fBlackI(70), fill=MUTED), LW / 2, 750, 1, 1)
    s = 1.35 - 0.35 * eo(prog(lt, 0, 0.2))
    paste(c, T('bk', 'BANCARROTA?', fBlackI(146), fill=WHITE, glow=AMBER), LW / 2 + dx, 920, s * 0.86, eo(prog(lt, 0, 0.12)))
    pw = eo(prog(lt, 0.25, 0.4))
    if pw > 0: SDraw(c).rounded_rectangle((LW / 2 - 300 * pw, 1040, LW / 2 + 300 * pw, 1050), 5, fill=GOLD)
    caption_lines(c, lt, E[1], ['Antes de decidir...'], 1140, size=60, step=LN[1][1] / 4, font=fMI(60))

def scene_espera(c, t):
    lt = t - S3; E = EV[2]; p = prog(lt, E[0], 0.35)
    paste(c, CACHE.setdefault('esppill', pill(440, 120, GOLD + (255,))), LW / 2, 640, 0.9 + 0.1 * ebk(p), eo(p))
    paste(c, T('esp', 'ESPERA', fBlack(80), fill=ESP, shadow=False), LW / 2, 640, 0.9 + 0.1 * ebk(p), eo(p))
    caption_lines(c, lt, E[1], ['Revisamos tu', 'reporte ANTES', 'de que tomes', 'esa decisión.'], 880, size=94, step=LN[2][1] / 10, hl=('ANTES',))
    pi = prog(lt, E[1] + LN[2][1], 0.45)
    paste(c, circ_icon('doc', 150), LW / 2, 1400, 0.85 + 0.15 * ebk(pi), eo(pi))

def scene_laura(c, t):
    lt = t - S4; E = EV[3]; p = prog(lt, 0, 0.7)
    y = 820 + (1 - eo(p)) * 260
    paste(c, laura_card, LW / 2, y, 0.9 + 0.02 * lt / 4.6, eo(p))
    pt = prog(lt, E[0] + 0.1, 0.45)
    paste(c, CACHE.setdefault('tag', pill(560, 110, CREAM + (255,))), LW / 2, 1300 + (1 - eo(pt)) * 30, 1, eo(pt))
    paste(c, T('hl', 'Habla con Laura', fBlack(58), fill=ESP, shadow=False), LW / 2, 1300 + (1 - eo(pt)) * 30, 1, eo(pt))
    pl = prog(lt, E[0] + 0.9, 0.5)
    paste(c, logo, LW / 2, 280 + (1 - eo(pl)) * 20, 0.95, eo(pl))
    paste(c, T('lsub', 'Tu futuro, tu elección', fMI(48), fill=MUTED), LW / 2, 1420, 1, eo(prog(lt, E[1], 0.45)))

SERV = [('doc', 'REPARACIÓN DE CRÉDITO', 'Revisamos errores e', 'inexactitudes en tu reporte'),
        ('chart', 'MEJOR PUNTAJE', 'Accede a mejores tasas,', 'préstamos y tarjetas'),
        ('shield', 'LIBERTAD FINANCIERA', 'Un buen crédito', 'te da opciones')]
def scene_servicios(c, t):
    lt = t - S5; E = EV[4]; ph = prog(lt, E[0], 0.4)
    paste(c, T('ns', 'NUESTROS SERVICIOS', fXB(48), fill=LGOLD), LW / 2, 400, 1, eo(ph))
    for i, (ic, ttl, l1, l2) in enumerate(SERV):
        ti = E[i + 1]; p = prog(lt, ti, 0.55)
        if p <= 0: continue
        key = ('card', i)
        if key not in CACHE:
            card = pill(900, 230, CREAM + (255,), r=32); d = SDraw(card)
            ci = circ_icon(ic, 120); card.alpha_composite(ci, (sc(100), sc(60 + 115) - ci.height // 2))
            d.text((300, 120), ttl, font=fBlack(42), fill=(150, 88, 30))
            d.text((300, 176), l1, font=fSB(34), fill=ESP); d.text((300, 220), l2, font=fSB(34), fill=ESP)
            CACHE[key] = card
        nxt = E[i + 2] if i + 2 < len(E) else 99
        paste(c, CACHE[key], LW / 2, 650 + i * 280 + (1 - eo(p)) * 60, 1, eo(p) * (1 if lt < nxt else 0.8))
    n = sum(1 for e in E[1:] if lt >= e)
    pr = (n - 1 + clamp((lt - E[n]) / LN[4][n])) / 3 if n else 0
    d = SDraw(c)
    d.rounded_rectangle((240, 1520, 840, 1528), 4, fill=(255, 240, 220, 50))
    if pr > 0: d.rounded_rectangle((240, 1520, 240 + 600 * pr, 1528), 4, fill=GOLD + (255,))
    if n: paste(c, T(('pn', n), f'{n}/3', fXB(36), fill=MUTED, shadow=False), LW / 2, 1575, 1, 1)

BEN = [('gauge', 'MEJOR CRÉDITO', 'Más poder de compra'), ('card', 'MÁS OPORTUNIDADES', 'Préstamos, vivienda y más'),
       ('dollar', 'TRANQUILIDAD', 'Menos deudas, más estabilidad'), ('person', 'LIBERTAD FINANCIERA', 'Vive la vida en tus propios términos')]
def scene_beneficios(c, t):
    lt = t - S6; E = EV[5]
    pre = lt < E[1]
    ph = eo(prog(lt, E[0], 0.4))
    hy = 440 + (1 - eo(prog(lt, E[1] - 0.4, 0.4))) * 480 if True else 440
    paste(c, T('mcmv', 'MEJOR CRÉDITO, MEJOR VIDA', fXB(46), fill=LGOLD), LW / 2, hy, 1 + 0.5 * (hy - 440) / 480, ph)
    if pre: return
    i = sum(1 for e in E[1:] if lt >= e) - 1
    li = lt - E[i + 1]; step = (E[i + 2] - E[i + 1]) if i < 3 else 99
    ic, ttl, sub = BEN[i]
    out = prog(li, step - 0.14, 0.14) if i < 3 else 0
    a = eo(prog(li, 0, 0.3)) * (1 - out)
    paste(c, circ_icon(ic, 230), LW / 2, 770 + (1 - eo(prog(li, 0, 0.4))) * 30, 1, a)
    words = ttl.split(' ')
    for k, wd in enumerate(words):
        pk = prog(li, 0.06 + k * 0.25, 0.3)
        paste(c, T(('bt', wd), wd, fBlackI(112 if len(ttl) < 16 else 100)), LW / 2,
              1050 + k * 130 - (len(words) - 1) * 60 + (1 - eo(pk)) * 30, 1, eo(pk) * (1 - out))
    paste(c, T(('bs', i), sub, fSB(46), fill=MUTED), LW / 2, 1300, 1, eo(prog(li, 0.9, 0.3)) * (1 - out))
    d = SDraw(c)
    for k in range(4):
        r = 9 if k == i else 6
        d.ellipse((LW / 2 - 60 + k * 40 - r, 1420 - r, LW / 2 - 60 + k * 40 + r, 1420 + r), fill=GOLD if k == i else (120, 90, 70))

def scene_500(c, t):
    lt = t - S7; E = EV[6]
    paste(c, T('cll', '¡CUANDO LLEGUEMOS A', fXB(54), fill=MUTED), LW / 2, 540, 1, eo(prog(lt, E[0], 0.3)))
    n = int(500 * eo(prog(lt, E[0] + 0.3, LN[6][0] - 0.3)))
    paste(c, T(('n', n), str(n), fBlack(280)), LW / 2, 770, 1, 1)
    pp = prog(lt, E[0] + LN[6][0] - 0.6, 0.35)
    paste(c, CACHE.setdefault('segp', pill(500, 104, GOLD + (255,))), LW / 2, 975, 0.92 + 0.08 * ebk(pp), eo(pp))
    paste(c, T('seg', 'SEGUIDORES', fBlack(60), fill=ESP, shadow=False), LW / 2, 975, 0.92 + 0.08 * ebk(pp), eo(pp))
    pv = prog(lt, E[1], 0.4)
    paste(c, T('vs', 'vienen sorpresas!', fBlackI(84)), LW / 2, 1120 + (1 - eo(pv)) * 25, 1, eo(pv))
    pg = prog(lt, E[1] + 0.2, 0.5)
    paste(c, gift, LW / 2, 1340 + (1 - eo(pg)) * 40, (0.9 + 0.1 * ebk(pg)), eo(pg), rot=math.sin(lt * 5) * 3 * eo(pg))

def scene_cta(c, t):
    lt = t - S8; E = EV[7]
    paste(c, logo, LW / 2, 300, 0.85, eo(prog(lt, 0, 0.45)))
    pc = prog(lt, 0.1, 0.55)
    paste(c, laura_circle, LW / 2, 570 + (1 - eo(pc)) * 30, 0.9 + 0.1 * ebk(pc), eo(pc))
    pt = prog(lt, E[0], 0.4)
    paste(c, T('hl2', 'Habla con Laura', fBlack(80)), LW / 2, 800 + (1 - eo(pt)) * 25, 1, eo(pt))
    if 'igcard' not in CACHE:
        ig = pill(860, 190, CREAM + (255,), r=40); d = SDraw(ig)
        ci = circ_icon('ig', 120); ig.alpha_composite(ci, (sc(90), sc(60 + 95) - ci.height // 2))
        d.text((290, 98), 'Escríbenos en Instagram', font=fSB(36), fill=(120, 90, 70))
        d.text((286, 140), '@creditkays', font=fBlack(72), fill=(150, 88, 30))
        CACHE['igcard'] = ig
    pi = prog(lt, E[1], 0.5)
    pulse = 1 + 0.012 * math.sin(max(0, lt - E[1] - 0.5) * 2 * math.pi / B)
    paste(c, CACHE['igcard'], LW / 2, 1010 + (1 - eo(pi)) * 50, pulse, eo(pi))
    paste(c, T('cm1', 'o comenta', fMI(52), fill=MUTED), LW / 2, 1190, 1, eo(prog(lt, E[2], 0.4)))
    pk2 = prog(lt, E[2] + 0.4, 0.4)
    paste(c, CACHE.setdefault('cmp', pill(500, 120, GOLD + (255,))), LW / 2, 1315, pulse * (0.92 + 0.08 * ebk(pk2)), eo(pk2))
    paste(c, T('cm2', '“CRÉDITO”', fBlackI(76), fill=ESP, shadow=False), LW / 2, 1315, pulse * (0.92 + 0.08 * ebk(pk2)), eo(pk2))
    paste(c, T('foot', 'Repara tu crédito, construye tu libertad financiera', fSB(32), fill=MUTED, shadow=False), LW / 2, 1450, 1, eo(prog(lt, E[3], 0.45)))

SCENES = [(0, S2, scene_hook), (S2, S3, scene_bancarrota), (S3, S4, scene_espera), (S4, S5, scene_laura),
          (S5, S6, scene_servicios), (S6, S7, scene_beneficios), (S7, S8, scene_500), (S8, 999, scene_cta)]

def frame(t):
    beat_ph = ((t - D) % B) / B if t >= D else 1
    pulse = math.exp(-beat_ph * 3) if t >= D else 0
    c = background(t, pulse).convert('RGBA')
    for (a, b, fn) in SCENES:
        if a <= t < b:
            layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); fn(layer, t)
            pout = prog(t, b - 0.15, 0.15) if b < 999 else 0
            if pout > 0: layer.putalpha(layer.getchannel('A').point(lambda v: int(v * (1 - pout))))
            c.alpha_composite(layer)
    c = c.convert('RGB')
    fo = clamp((t - (DUR - 0.6)) / 0.6)
    if fo > 0: c = Image.eval(c, lambda v: int(v * (1 - fo)))
    return c

if __name__ == '__main__':
    if sys.argv[1] == 'stills':
        for t in map(float, sys.argv[2:]): frame(t).save(f'q4_{t:05.2f}.png')
    else:
        a, b, out = float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
        p = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'faster', '-b:v', '45M', '-maxrate', '55M', '-bufsize', '90M',
                              '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '5.2', out], stdin=subprocess.PIPE)
        for i in range(int(round(a * FPS)), int(round(b * FPS))): p.stdin.write(frame(i / FPS).tobytes())
        p.stdin.close(); p.wait()
