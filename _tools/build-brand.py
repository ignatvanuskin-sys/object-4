"""Renders the share card (og.png) and the iOS touch icon from the real hero
photograph plus the site's own geometric mark. No third-party assets."""
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import os

INK = (11, 11, 12)
PAPER = (239, 236, 230)
SIGNAL = (225, 59, 34)

FONTS = [
    "C:/Windows/Fonts/seguibl.ttf",
    "C:/Windows/Fonts/ariblk.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/tahomabd.ttf",
    "C:/Windows/Fonts/verdanab.ttf",
]


def font(size):
    for path in FONTS:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()


def mark(draw, x, y, size, stroke=PAPER, accent=SIGNAL):
    """Blocky seven-segment '4', same geometry as app/icon.svg."""
    u = size / 64
    draw.rectangle([x + 46 * u, y + 8 * u, x + 57 * u, y + 56 * u], fill=stroke)
    draw.rectangle([x + 7 * u, y + 8 * u, x + 18 * u, y + 38 * u], fill=stroke)
    draw.rectangle([x + 7 * u, y + 27 * u, x + 57 * u, y + 38 * u], fill=accent)


def cover(im, w, h, anchor_y=0.42):
    ratio = w / h
    iw, ih = im.size
    if iw / ih > ratio:
        tw, th = int(ih * ratio), ih
    else:
        tw, th = iw, int(iw / ratio)
    left = int((iw - tw) / 2)
    top = int((ih - th) * anchor_y)
    return im.crop((left, top, left + tw, top + th)).resize((w, h), Image.LANCZOS)


# ---------------------------------------------------------------- share card
hero = Image.open(os.path.join("_source_photos", "g09_vp_d.jpg")).convert("RGB")
card = cover(hero, 1200, 630, anchor_y=0.34)
card = ImageEnhance.Color(card).enhance(0.82)
card = ImageEnhance.Brightness(card).enhance(0.55)

# Vignette-ish darkening so the type always sits on ≥ 7:1 contrast.
overlay = Image.new("L", card.size, 0)
od = ImageDraw.Draw(overlay)
for y in range(card.size[1]):
    od.line([(0, y), (card.size[0], y)], fill=int(150 + 90 * (y / card.size[1])))
card = Image.composite(Image.new("RGB", card.size, INK), card, overlay)

d = ImageDraw.Draw(card)
d.rectangle([0, 0, 1200, 8], fill=SIGNAL)

mark(d, 72, 68, 46)

d.text((140, 72), "ХОРРОР-КВЕСТ · РУДНЫЙ", font=font(22), fill=(200, 198, 192))

f_h1 = font(92)
d.text((70, 168), "ОБЪЕКТ №4", font=f_h1, fill=PAPER)

f_sub = font(38)
d.text((72, 300), "Вход добровольный.", font=f_sub, fill=(232, 229, 223))
d.text((72, 350), "Выход — по правилам объекта.", font=f_sub, fill=(168, 165, 160))

d.line([(72, 470), (1128, 470)], fill=(90, 90, 94), width=1)

f_meta = font(26)
d.text((72, 500), "2ГИС 5,0 · 28 оценок", font=f_meta, fill=(205, 202, 196))
d.text((470, 500), "Ежедневно 12:00 — 00:00", font=f_meta, fill=(205, 202, 196))
d.text((880, 500), "+7 708 941 92 83", font=f_meta, fill=PAPER)
d.text((72, 552), "Две локации: «Дом проклятых» · «Пила»", font=font(22), fill=(150, 148, 144))

card.save("public/og.png", "PNG", optimize=True)

# ------------------------------------------------------------- touch icon
icon = Image.new("RGB", (180, 180), INK)
di = ImageDraw.Draw(icon)
mark(di, 30, 30, 120)
icon.save("app/apple-icon.png", "PNG", optimize=True)

print("og.png", os.path.getsize("public/og.png"), "bytes")
print("apple-icon.png", os.path.getsize("app/apple-icon.png"), "bytes")
