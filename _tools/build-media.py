"""Object RDN — media pipeline v2.

Fixes over v1:
  * crop_ratio() branches were swapped, so any image whose ratio sat on the
    "wrong" side of the target produced PIL's out-of-bounds black padding.
    That is why several frames had black bars and looked mis-framed.
  * the 2GIS capture watermark (bottom-right) is now removed before any art
    direction happens.
  * the grade is much heavier and colder, to match the new dark art direction.

Run:  python _tools/build-media.py
It rewrites public/media/*.webp, _tools/media-manifest.json and lib/media.ts.
"""
from PIL import Image, ImageEnhance
import json, os

SRC = "_source_photos"
# The path is versioned on purpose. /media/* is served with immutable caching,
# so overwriting a file under the same name leaves every browser and every CDN
# edge serving the old bytes — which is exactly how a fixed watermark kept
# showing up. Bump MEDIA_VERSION whenever the pipeline output changes.
MEDIA_VERSION = "v2"
OUT = os.path.join("public", "media", MEDIA_VERSION)
os.makedirs(OUT, exist_ok=True)

# ---------------------------------------------------------------------------
# The 2GIS watermark sits at roughly x 90–99 %, y 95.5–97.5 % of every frame it
# captured. Cutting the right 13.5 % and bottom 9 % removes it with margin.
# The price sheets are documents: they only need the bottom cut, because their
# price column reaches to ~90 % of the width.
# ---------------------------------------------------------------------------
WATERMARK_RIGHT = 0.135
WATERMARK_BOTTOM = 0.09
# Price sheets are documents: instead of shaving a strip off the bottom (which
# was clipping the last line) they are trimmed to the text block, which removes
# the corner watermark and the decorative margins in one move.
SHEET_BOX = (0.06, 0.03, 0.94, 0.93)


def strip_watermark(im: Image.Image, bottom: float, right: float = 0.0) -> Image.Image:
    w, h = im.size
    return im.crop((0, 0, int(w * (1 - right)), int(h * (1 - bottom))))


def grade(im: Image.Image, strength: float = 1.0) -> Image.Image:
    """Cold, crushed, desaturated — one gloomy family for every frame."""
    im = im.convert("RGB")
    im = ImageEnhance.Color(im).enhance(1 - 0.22 * strength)
    im = ImageEnhance.Contrast(im).enhance(1 + 0.14 * strength)
    im = ImageEnhance.Brightness(im).enhance(1 - 0.10 * strength)
    return im


def crop_ratio(im: Image.Image, ratio: float, anchor_y: float = 0.5, anchor_x: float = 0.5):
    """Crop to `ratio` = w/h, keeping the largest possible area.

    ratio > image ratio  -> the image is too tall: keep full width, cut height.
    ratio < image ratio  -> the image is too wide: keep full height, cut width.
    """
    w, h = im.size
    if w / h <= ratio:
        target_w, target_h = w, max(1, round(w / ratio))
    else:
        target_w, target_h = max(1, round(h * ratio)), h
    left = round((w - target_w) * anchor_x)
    top = round((h - target_h) * anchor_y)
    return im.crop((left, top, left + target_w, top + target_h))


def save(im: Image.Image, name: str, width: int, quality: int = 74):
    out = im.copy()
    if out.width != width:
        out = out.resize((width, max(1, round(out.height * width / out.width))), Image.LANCZOS)
    path = os.path.join(OUT, name)
    out.save(path, "WEBP", quality=quality, method=6)
    return {"file": name, "w": out.width, "h": out.height, "bytes": os.path.getsize(path)}


def avg_color(im: Image.Image) -> str:
    r, g, b = im.convert("RGB").resize((1, 1), Image.LANCZOS).getpixel((0, 0))
    return f"#{r:02x}{g:02x}{b:02x}"


def load(name: str, *, sheet: bool = False, precrop=None) -> Image.Image:
    im = Image.open(os.path.join(SRC, name))
    if sheet:
        w, h = im.size
        l, t, r, b = SHEET_BOX
        return im.crop((round(w * l), round(h * t), round(w * r), round(h * b)))
    im = strip_watermark(im, WATERMARK_BOTTOM, WATERMARK_RIGHT)
    if precrop:
        w, h = im.size
        l, t, r, b = precrop
        im = im.crop((round(w * l), round(h * t), round(w * r), round(h * b)))
    return im


# Every frame needs its own crop anchors: a wide crop keeps the full width and
# cuts height, so vertical framing is what decides whether the subject survives.
SOURCES = {
    # red neon hall, silhouettes + masked actor
    "hall":     dict(file="g09_vp_d.jpg",      precrop=None,                     wide_y=0.40, tall_y=0.38, tall_x=0.52),
    # dark staircase, framed prints on the wall
    "stairs":   dict(file="g11_arina.jpg",     precrop=None,                     wide_y=0.46, tall_y=0.40, tall_x=0.54),
    # g12_angelina (corridor) is deliberately not published: roughly a third of
    # every crop of it is dead black, which read as a hole in the gallery grid.
    # blue-lit brick, mask on a shelf
    "mask":     dict(file="r03_margarita.jpg", precrop=None,                     wide_y=0.44, tall_y=0.42, tall_x=0.50),
    # wall of framed prints
    "posters":  dict(file="r01_ksenia_a.jpg",  precrop=(0.04, 0.06, 1.0, 0.96),  wide_y=0.42, tall_y=0.44, tall_x=0.50),
}

manifest: dict = {}

for slug, cfg in SOURCES.items():
    g = grade(load(cfg["file"], precrop=cfg["precrop"]))
    wide = crop_ratio(g, 16 / 10, anchor_y=cfg["wide_y"])
    tall = crop_ratio(g, 3 / 4, anchor_y=cfg["tall_y"], anchor_x=cfg["tall_x"])

    manifest[slug] = {
        "color": avg_color(wide),
        "wide": [
            save(wide, f"{slug}-wide-1600.webp", 1600),
            save(wide, f"{slug}-wide-1100.webp", 1100),
            save(wide, f"{slug}-wide-700.webp", 700),
        ],
        "tall": [
            save(tall, f"{slug}-tall-1200.webp", 1200),
            save(tall, f"{slug}-tall-800.webp", 800),
            save(tall, f"{slug}-tall-500.webp", 500),
        ],
    }

# --- Hero: cinematic 16:9 for desktop, 5:7 portrait for phones -----------------
hall = grade(load("g09_vp_d.jpg"))
hero_wide = crop_ratio(hall, 16 / 9, anchor_y=0.30)
hero_tall = crop_ratio(hall, 1200 / 1680, anchor_y=0.42, anchor_x=0.54)

manifest["hero"] = {
    "color": avg_color(hero_wide),
    "wide": [
        save(hero_wide, "hero-wide-1920.webp", 1920, 72),
        save(hero_wide, "hero-wide-1280.webp", 1280, 72),
        save(hero_wide, "hero-wide-820.webp", 820),
    ],
    "tall": [
        save(hero_tall, "hero-tall-1200.webp", 1200, 72),
        save(hero_tall, "hero-tall-760.webp", 760),
    ],
}

# --- About block: 4:5 portrait ------------------------------------------------
stairs = grade(load("g11_arina.jpg"))
about = crop_ratio(stairs, 4 / 5, anchor_y=0.40, anchor_x=0.56)
manifest["about"] = {
    "color": avg_color(about),
    "tall": [
        save(about, "about-tall-1100.webp", 1100),
        save(about, "about-tall-700.webp", 700),
    ],
}

# --- Price sheets (real documents published by the venue) --------------------
for slug, fname in (
    ("priceDom", "p01_dom_proklyatyh.jpg"),
    ("pricePilaA", "p02_pila_a.jpg"),
    ("pricePilaB", "p03_pila_b.jpg"),
):
    sheet = load(fname, sheet=True)
    manifest[slug] = {
        "color": avg_color(sheet),
        "tall": [
            save(sheet, f"{slug}-1200.webp", 1200),
            save(sheet, f"{slug}-700.webp", 700),
        ],
    }

with open(os.path.join("_tools", "media-manifest.json"), "w", encoding="utf8") as fh:
    json.dump(manifest, fh, ensure_ascii=False, indent=2)

total = sum(i["bytes"] for v in manifest.values() for k in ("wide", "tall") for i in v.get(k, []))
print(json.dumps(manifest, ensure_ascii=False, indent=2))
print("TOTAL", round(total / 1024), "KB")
