"""Crops the bottom-right corner of every source and stacks them with a percent
ruler, so the exact watermark box can be measured instead of guessed."""
from PIL import Image, ImageDraw, ImageFont
import os

SRC = "_source_photos"
USED = [
    "g09_vp_d.jpg", "g11_arina.jpg", "g12_angelina.jpg", "r01_ksenia_a.jpg",
    "r03_margarita.jpg", "p01_dom_proklyatyh.jpg", "p02_pila_a.jpg", "p03_pila_b.jpg",
]
WH, WW = 0.16, 0.30  # take the last 16% of height and 30% of width

font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 18)
row_h = 150
label_w = 220
sheet = Image.new("RGB", (label_w + 900, len(USED) * (row_h + 6)), (16, 16, 18))
d = ImageDraw.Draw(sheet)

for i, name in enumerate(USED):
    im = Image.open(os.path.join(SRC, name)).convert("RGB")
    w, h = im.size
    box = (int(w * (1 - WW)), int(h * (1 - WH)), w, h)
    crop = im.crop(box)
    # Scale to 900 wide, keep ratio -> shows exactly where the mark sits in %.
    cw = 900
    ch = max(1, round(crop.height * cw / crop.width))
    crop = crop.resize((cw, ch), Image.LANCZOS)
    y = i * (row_h + 6)
    if ch > row_h:
        crop = crop.crop((0, ch - row_h, cw, ch))  # keep the bottom edge
        ch = row_h
    sheet.paste(crop, (label_w, y))
    d.text((8, y + 8), name, fill=(240, 240, 240), font=font)
    d.text((8, y + 30), f"{w}x{h}", fill=(150, 150, 150), font=font)
    # rulers: 1% of source height / width
    d.text((8, y + 54), f"box: right {int(WW*100)}% / bottom {int(WH*100)}%", fill=(150, 150, 150), font=font)

# Percent grid over the strip: bottom = 100% of height at the very bottom edge
d.text((label_w + 4, sheet.height - 2), "", fill=(255, 0, 0))
sheet.save("_tools/watermark-zoom.png")
print("saved", sheet.size, "-> _tools/watermark-zoom.png")
