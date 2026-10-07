"""Object RDN — media pipeline.

Takes the raw 2GIS photos, applies a single unifying colour grade and renders
responsive WebP variants into public/media/.
"""
from PIL import Image, ImageEnhance, ImageOps
import json, os

SRC = "_source_photos"
OUT = os.path.join("public", "media")
os.makedirs(OUT, exist_ok=True)

# Unifying grade: slightly desaturated, black-crushed, mild contrast -> one family.
def grade(im: Image.Image) -> Image.Image:
    im = im.convert("RGB")
    im = ImageEnhance.Color(im).enhance(0.88)
    im = ImageEnhance.Contrast(im).enhance(1.08)
    im = ImageEnhance.Brightness(im).enhance(0.97)
    return im


def crop_ratio(im: Image.Image, ratio: float, anchor_y: float = 0.5, anchor_x: float = 0.5):
    """Crop to `ratio` (w/h) around an anchor point, then never upscale beyond 1.6x."""
    w, h = im.size
    target_w, target_h = (w, int(w / ratio)) if w / h > ratio else (int(h * ratio), h)
    left = int((w - target_w) * anchor_x)
    top = int((h - target_h) * anchor_y)
    return im.crop((left, top, left + target_w, top + target_h))


def save(im: Image.Image, name: str, width: int, quality: int = 76):
    im = im.copy()
    if im.width != width:
        im = im.resize((width, max(1, round(im.height * width / im.width))), Image.LANCZOS)
    path = os.path.join(OUT, name)
    im.save(path, "WEBP", quality=quality, method=6)
    return {"file": name, "w": im.width, "h": im.height, "bytes": os.path.getsize(path)}


def avg_color(im: Image.Image) -> str:
    small = im.convert("RGB").resize((1, 1), Image.LANCZOS)
    r, g, b = small.getpixel((0, 0))
    return f"#{r:02x}{g:02x}{b:02x}"


manifest = {}

SOURCES = {
    "hall":    ("g09_vp_d.jpg",       0.45),   # red neon hall, silhouettes
    "stairs":  ("g11_arina.jpg",      0.42),   # dark staircase + wall lamp
    "corridor":("g12_angelina.jpg",   0.40),   # railing corridor
    "mask":    ("r03_margarita.jpg",  0.44),   # blue brick, mask on shelf
    "posters": ("r01_ksenia_a.jpg",   0.46),   # wall of framed prints
}

for slug, (fname, anchor) in SOURCES.items():
    raw = Image.open(os.path.join(SRC, fname))
    g = grade(raw)

    wide = crop_ratio(g, 16 / 10, anchor_y=anchor)
    tall = crop_ratio(g, 3 / 4, anchor_y=anchor, anchor_x=0.5)

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

# --- Hero: desktop cinematic 16:9 (top-biased crop keeps the silhouettes,
#     deliberately excludes the bottom-right 2GIS watermark), plus portrait mobile.
hall_raw = grade(Image.open(os.path.join(SRC, "g09_vp_d.jpg")))
hero_wide = crop_ratio(hall_raw, 16 / 9, anchor_y=0.30)
hero_tall = crop_ratio(hall_raw, 3 / 4.2, anchor_y=0.42)

manifest["hero"] = {
    "color": avg_color(hero_wide),
    "wide": [
        save(hero_wide, "hero-wide-1920.webp", 1920, 74),
        save(hero_wide, "hero-wide-1280.webp", 1280, 74),
        save(hero_wide, "hero-wide-820.webp", 820),
    ],
    "tall": [
        save(hero_tall, "hero-tall-1200.webp", 1200, 74),
        save(hero_tall, "hero-tall-760.webp", 760),
    ],
}

# --- About block: portrait staircase
stair_raw = grade(Image.open(os.path.join(SRC, "g11_arina.jpg")))
manifest["about"] = {
    "color": avg_color(stair_raw),
    "tall": [
        save(crop_ratio(stair_raw, 4 / 5, anchor_y=0.42), "about-tall-1100.webp", 1100),
        save(crop_ratio(stair_raw, 4 / 5, anchor_y=0.42), "about-tall-700.webp", 700),
    ],
}

# --- Price list photos (real, published by the venue on 2GIS)
for slug, fname in (
    ("price-dom", "p01_dom_proklyatyh.jpg"),
    ("price-pila-a", "p02_pila_a.jpg"),
    ("price-pila-b", "p03_pila_b.jpg"),
):
    im = Image.open(os.path.join(SRC, fname)).convert("RGB")
    manifest[slug] = {
        "color": avg_color(im),
        "tall": [
            save(im, f"{slug}-1200.webp", 1200, 74),
            save(im, f"{slug}-700.webp", 700),
        ],
    }

# --- Open Graph base
og = crop_ratio(hero_wide, 1200 / 630, anchor_y=0.5)
save(og, "og-base.webp", 1200, 72)

with open(os.path.join("_tools", "media-manifest.json"), "w", encoding="utf8") as fh:
    json.dump(manifest, fh, ensure_ascii=False, indent=2)

total = 0
for v in manifest.values():
    for group in ("wide", "tall"):
        for item in v.get(group, []):
            total += item["bytes"]
print(json.dumps(manifest, ensure_ascii=False, indent=2))
print("TOTAL_BYTES", total, round(total / 1024), "KB")
