"""Zooms the bottom-right corner of the FINAL media files on disk.

The browser happily serves the previous build from cache because the file names
are identical and /media/* is immutable-cached, so screenshots are not proof.
This inspects the real bytes the server has on disk.
"""
from PIL import Image, ImageDraw, ImageFont
import os

NAMES = [
    "stairs-tall-800", "mask-tall-800", "posters-tall-800",
    "hall-wide-1100", "stairs-wide-1100", "about-tall-700", "hero-wide-1280",
]

font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 17)
rows = []
for n in NAMES:
    p = os.path.join("public", "media", n + ".webp")
    im = Image.open(p).convert("RGB")
    w, h = im.size
    c = im.crop((int(w * 0.50), int(h * 0.78), w, h))
    c = c.resize((780, max(1, round(c.height * 780 / c.width))), Image.LANCZOS)
    rows.append((f"{n}  {w}x{h}", c))

total_h = sum(c.height + 28 for _, c in rows)
sheet = Image.new("RGB", (780, total_h), (12, 12, 14))
d = ImageDraw.Draw(sheet)
y = 0
for label, c in rows:
    d.text((4, y + 4), label + "  — bottom-right 50% x 22%", fill=(245, 245, 245), font=font)
    sheet.paste(c, (0, y + 28))
    y += c.height + 28

sheet.save("_tools/corner-check.png")
print("saved _tools/corner-check.png", sheet.size)
