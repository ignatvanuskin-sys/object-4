from PIL import Image, ImageDraw, ImageFont
import os, glob

SRC = "_source_photos"
files = sorted(glob.glob(os.path.join(SRC, "g*.jpg"))) + sorted(glob.glob(os.path.join(SRC, "r*.jpg")))
files = [f for f in files if not os.path.basename(f).startswith(("r06_", "r07_", "r08_"))]

CELL_W, CELL_H = 460, 340
COLS = 5
ROWS = (len(files) + COLS - 1) // COLS
LABEL_H = 34

sheet = Image.new("RGB", (COLS * CELL_W, ROWS * (CELL_H + LABEL_H)), (18, 18, 20))
draw = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 20)
except Exception:
    font = ImageFont.load_default()

meta = []
for i, f in enumerate(files):
    try:
        im = Image.open(f).convert("RGB")
    except Exception as e:
        print("skip", f, e)
        continue
    w, h = im.size
    meta.append((os.path.basename(f), w, h, round(w / h, 3)))
    im.thumbnail((CELL_W - 8, CELL_H - 8))
    x = (i % COLS) * CELL_W
    y = (i // COLS) * (CELL_H + LABEL_H)
    sheet.paste(im, (x + 4, y + 4))
    draw.text((x + 8, y + CELL_H + 4), f"{os.path.basename(f)}  {w}x{h} {round(w/h,2)}", fill=(240, 240, 240), font=font)

sheet.save("_tools/contact-sheet.png")
print("FILES:", len(files))
for m in meta:
    print(m)
print("sheet:", sheet.size)
