"""
derive-images.py — responsive derivatives for the Commons stills.

Extends the EXISTING slot system in src/lib/images.ts (`/img/<slot>-<w>.<ext>`).
It does not invent a second one. Every still gets 480/960/1280/1920 in AVIF and
WebP, exactly like the generated plates already in public/img/.

Input : scripts/commons-keep.json  — the hand-reviewed keep list
Output: public/img/<slot>-<w>.avif and .webp
        scripts/derived.json       — slot -> {w, h, widths} for images.ts

Usage: python scripts/derive-images.py
"""

import json
import os

from PIL import Image

KEEP = "scripts/commons-keep.json"
OUT = "public/img"
WIDTHS = [480, 960, 1280, 1920]


def main():
    os.makedirs(OUT, exist_ok=True)
    keep = json.load(open(KEEP, encoding="utf-8"))
    manifest = {}

    for rec in keep:
        slot = rec["slot"]
        src = rec["localFile"]
        im = Image.open(src).convert("RGB")

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

        manifest[slot] = {"widths": widths, "w": largest, "h": lh}
        total = sum(
            os.path.getsize(f"{OUT}/{slot}-{w}.{e}") for w in widths for e in ("webp", "avif")
        )
        print(f"  {slot:26s} {ow}x{oh} -> {widths}  {total/1024:.0f}KB total")

    json.dump(manifest, open("scripts/derived.json", "w", encoding="utf-8"), indent=2)
    print(f"\n{len(manifest)} slots -> scripts/derived.json")


if __name__ == "__main__":
    main()
