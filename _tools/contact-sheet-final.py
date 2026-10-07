"""Contact sheet of the FINAL rendered WebP variants, to eyeball framing and
confirm no watermark survived."""
from PIL import Image, ImageDraw, ImageFont
import glob, os

OUT = "public/media"
files = []
for slug in ["hero", "hall", "stairs", "corridor", "mask", "posters", "about"]:
    for kind, w in (("wide", 1100), ("tall", 800)):
        p = os.path.join(OUT, f"{slug}-{kind}-{w}.webp")
        if os.path.exists(p):
            files.append((f"{slug}-{kind}", p))
for slug in ["priceDom", "pricePilaA", "pricePilaB"]:
    p = os.path.join(OUT, f"{slug}-700.webp")
    if os.path.exists(p):
        files.append((slug, p))

CELL_W, CELL_H = 470, 330
COLS = 5
LABEL_H = 26
ROWS = (len(files) + COLS - 1) // COLS

sheet = Image.new("RGB", (COLS * CELL_W, ROWS * (CELL_H + LABEL_H)), (14, 14, 16))
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 19)
except Exception:
    font = ImageFont.load_default()

for i, (label, path) in enumerate(files):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    im.thumbnail((CELL_W - 8, CELL_H - 8))
    x = (i % COLS) * CELL_W
    y = (i // COLS) * (CELL_H + LABEL_H)
    sheet.paste(im, (x + 4, y + 4))
    d.text((x + 8, y + CELL_H + 2), f"{label}  {w}x{h}  r={round(w/h,2)}", fill=(238, 238, 238), font=font)

sheet.save("_tools/final-sheet.png")
print("cells:", len(files), "sheet:", sheet.size)
