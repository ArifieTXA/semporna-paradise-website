"""
harvest-commons.py — free-licence stills of the Semporna area from Wikimedia Commons.

CONTEXT.md §5 (owner override, 2026-09-03) allows real photography ONLY where the
company owns it or it carries a free licence. This script covers the second half.

Rules it enforces, not suggests:
  * Only permissive licences pass: CC0, Public Domain, CC BY, CC BY-SA. Anything
    else — NC, ND, "fair use", unknown — is rejected and never downloaded.
  * Every survivor keeps its author, licence, licence URL and source page URL.
    CC BY and CC BY-SA both REQUIRE attribution, so a file with no recorded
    author is rejected too.
  * Subject blocklist. This is a tourism site: soldiers, armoured cars, police
    and security imagery are dropped even when the licence is fine.

Output:
  img-raw/commons/<slug>.jpg          the 1920px rendition
  scripts/commons-harvest.json        machine record, feeds photo-credits.ts

Usage: python scripts/harvest-commons.py
"""

import json
import os
import re
import sys
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = "SempornaParadiseSiteBuild/1.0 (static site build; contact via https://www.instagram.com/sem4naparadise/)"
OUT_DIR = "img-raw/commons"
RECORD = "scripts/commons-harvest.json"

# Searches, in priority order. The label is what the picture is FOR on the page.
SEARCHES = [
    ("Bohey Dulang Semporna", "bohey-dulang"),
    ("Tun Sakaran Marine Park", "tun-sakaran"),
    ("Sipadan island", "sipadan"),
    ("Mabul island Sabah", "mabul"),
    ("Kapalai Sabah", "kapalai"),
    ("Bajau Laut stilt house Semporna", "stilt-village"),
    ("Semporna jetty boat", "jetty"),
    ("Sipadan reef fish", "reef"),
    ("Sabah coral reef Celebes Sea", "reef"),
    ("Mataking island", "mataking"),
]

OK_LICENCE = re.compile(
    r"^(cc0|public domain|cc by(?:-sa)?(?:\s|-)?\d(\.\d)?|cc by(?:-sa)?)$", re.I
)
BAD_LICENCE = re.compile(r"\bnc\b|non-?commercial|\bnd\b|no-?deriv|fair use|non-free", re.I)

BLOCK_SUBJECT = re.compile(
    r"armou?red|soldier|military|esscom|police|army|weapon|patrol|barrack|"
    r"funeral|corpse|protest|riot",
    re.I,
)

MIN_PX = 1200 * 800


def api(params):
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as r:
        return json.load(r)


def strip_html(s):
    s = re.sub(r"<[^>]+>", "", s or "")
    return re.sub(r"\s+", " ", s).strip()


def search(term, limit=25):
    d = api({
        "action": "query", "format": "json", "generator": "search",
        "gsrsearch": f"filetype:bitmap {term}", "gsrnamespace": "6",
        "gsrlimit": str(limit), "prop": "imageinfo",
        "iiprop": "url|extmetadata|size", "iiurlwidth": "1920",
    })
    return list(d.get("query", {}).get("pages", {}).values())


def vet(page):
    """Return a record dict, or None with a printed reason."""
    title = page["title"]
    if BLOCK_SUBJECT.search(title):
        return None, "blocked subject"

    ii = page.get("imageinfo", [{}])[0]
    em = ii.get("extmetadata", {})

    lic = strip_html(em.get("LicenseShortName", {}).get("value", ""))
    if not lic or BAD_LICENCE.search(lic) or not OK_LICENCE.match(lic.strip()):
        return None, f"licence not permissive ({lic or 'unknown'})"

    author = strip_html(em.get("Artist", {}).get("value", ""))
    if not author:
        return None, "no recorded author — CC BY/BY-SA need attribution"

    desc = strip_html(em.get("ImageDescription", {}).get("value", ""))
    if BLOCK_SUBJECT.search(desc):
        return None, "blocked subject in description"

    if ii.get("width", 0) * ii.get("height", 0) < MIN_PX:
        return None, "too small"

    return {
        "title": title,
        "author": author[:160],
        "licence": lic,
        "licenceUrl": strip_html(em.get("LicenseUrl", {}).get("value", "")),
        "sourcePage": ii.get("descriptionurl", ""),
        "downloadUrl": ii.get("thumburl") or ii.get("url"),
        "origW": ii.get("width"),
        "origH": ii.get("height"),
        "description": desc[:220],
    }, None


def slugify(title, label, n):
    stem = re.sub(r"^File:", "", title)
    stem = re.sub(r"\.[a-zA-Z]+$", "", stem)
    stem = re.sub(r"[^a-zA-Z0-9]+", "-", stem).strip("-").lower()[:40]
    return f"{label}-{n:02d}-{stem}"


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    kept, seen = [], set()

    for term, label in SEARCHES:
        try:
            pages = search(term)
        except Exception as e:
            print(f"  ! search failed for {term!r}: {e}")
            continue
        n = 0
        for p in pages:
            if p["title"] in seen:
                continue
            rec, why = vet(p)
            if rec is None:
                continue
            seen.add(p["title"])
            n += 1
            rec["label"] = label
            rec["slug"] = slugify(rec["title"], label, n)
            kept.append(rec)
            if n >= 4:
                break
        print(f"  {term:38s} -> {n} kept")

    print(f"\nvetted {len(kept)} files. downloading...")
    ok = []
    for rec in kept:
        dest = os.path.join(OUT_DIR, rec["slug"] + ".jpg")
        if not os.path.exists(dest):
            try:
                req = urllib.request.Request(rec["downloadUrl"], headers={"User-Agent": UA})
                with urllib.request.urlopen(req, timeout=90) as r, open(dest, "wb") as f:
                    f.write(r.read())
            except Exception as e:
                print(f"  ! download failed {rec['slug']}: {e}")
                continue
        rec["localFile"] = dest
        rec["bytes"] = os.path.getsize(dest)
        ok.append(rec)

    with open(RECORD, "w", encoding="utf-8") as f:
        json.dump(ok, f, indent=2, ensure_ascii=False)

    print(f"\ndownloaded {len(ok)} -> {OUT_DIR}")
    print(f"record      -> {RECORD}")
    for r in ok:
        print(f"  {r['slug']:52s} {r['licence']:12s} {r['origW']}x{r['origH']}")


if __name__ == "__main__":
    sys.exit(main())
