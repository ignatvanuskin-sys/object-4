from PIL import Image, ImageDraw, ImageFont
import os, glob

SRC = "_source_photos"
keep = ["g09_vp_d.jpg", "g11_arina.jpg", "g12_angelina.jpg", "r01_ksenia_a.jpg", "r02_ksenia_b.jpg", "r03_margarita.jpg", "g08_vp_c.jpg", "g01_building_vp.jpg"]
files = [os.path.join(SRC, k) for k in keep]

CELL_W, CELL_H = 640, 700
COLS = 4
LABEL_H = 32
ROWS = (len(files) + COLS - 1) // COLS

sheet = Image.new("RGB", (COLS * CELL_W, ROWS * (CELL_H + LABEL_H)), (18, 18, 20))
draw = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22)
except Exception:
    font = ImageFont.load_default()

for i, f in enumerate(files):
    im = Image.open(f).convert("RGB")
    w, h = im.size
    im.thumbnail((CELL_W - 10, CELL_H - 10))
    x = (i % COLS) * CELL_W
    y = (i // COLS) * (CELL_H + LABEL_H)
    sheet.paste(im, (x + 5, y + 5))
    draw.text((x + 8, y + CELL_H + 2), f"{os.path.basename(f)} {w}x{h}", fill=(240, 240, 240), font=font)

sheet.save("_tools/contact-sheet-2.png")
print("sheet:", sheet.size)
