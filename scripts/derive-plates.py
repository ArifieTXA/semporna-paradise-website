"""
derive-plates.py — responsive derivatives for the GENERATED plates.

Sibling of derive-images.py, which does the same job for the Wikimedia Commons
stills. Same slot system (`/img/<slot>-<w>.<ext>`), same widths, same encoders —
only the input list differs, so the two never fight over a slot.

Input : scripts/plates.json    — slot, source PNG, model, one-line note
Output: public/img/<slot>-<w>.avif and .webp
        prints the `IMAGES` rows to paste into src/lib/images.ts

Provenance for every plate is recorded in img-raw/SOURCES.md. Each was written
from public research as a TEXT prompt only: no third-party photograph was used
as a source file or as an image input. CONTEXT.md §5.

Usage: python scripts/derive-plates.py
"""

import json
import os

from PIL import Image

Image.MAX_IMAGE_PIXELS = None

PLATES = "scripts/plates.json"
OUT = "public/img"
WIDTHS = [480, 960, 1280, 1920]


def main():
    os.makedirs(OUT, exist_ok=True)
    plates = json.load(open(PLATES, encoding="utf-8"))
    rows = []

    for rec in plates:
        slot = rec["slot"]
        im = Image.open(rec["localFile"]).convert("RGB")

        # Optional crop box, normalised 0-1 (left, top, right, bottom).
        if rec.get("crop"):
            l, t, r, b = rec["crop"]
            W, H = im.size
            im = im.crop((int(l * W), int(t * H), int(r * W), int(b * H)))

        ow, oh = im.size
        widths = [w for w in WIDTHS if w <= ow] or [min(WIDTHS)]
        largest = max(widths)
        lh = round(oh * largest / ow)

        for w in widths:
            h = round(oh * w / ow)
            rs = im.resize((w, h), Image.LANCZOS)
            rs.save(f"{OUT}/{slot}-{w}.webp", "WEBP", quality=78, method=6)
            rs.save(f"{OUT}/{slot}-{w}.avif", "AVIF", quality=55)

        total = sum(
            os.path.getsize(f"{OUT}/{slot}-{w}.{e}") for w in widths for e in ("webp", "avif")
        )
        print(f"  {slot:26s} {ow}x{oh} -> {widths}  {total/1024:.0f}KB total")
        rows.append((slot, widths, largest, lh))

    print("\n--- paste into src/lib/images.ts ---")
    for slot, widths, w, h in rows:
        print(f'  "{slot}": {{ widths: {widths}, w: {w}, h: {h} }},')


if __name__ == "__main__":
    main()
