#!/usr/bin/env python3
"""Fetch an openly licensed player photo from Wikipedia/Wikimedia Commons.

Usage: python3 tools/fetch_photo.py "<Wikipedia article title>" <slug>
Writes img/players/<slug>.jpg (<=150KB, max 600px on the long side) and prints a JSON
photo object {url, localPath, license, author, sourceUrl, title} on success, or
{"photo": null, "reason": ...} if no acceptable license was found.
Only CC-BY, CC-BY-SA, CC0 and public-domain licenses are accepted.
"""
import io, json, os, re, sys, urllib.parse, urllib.request

UA = "USOpenKidsGuide/1.0 (family project; contact via github) python-urllib"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALLOWED = re.compile(r"(cc[- ]by(?:[- ]sa)?(?:[- ]\d(\.\d)?)?|cc0|public domain|pd-)", re.I)
BANNED = re.compile(r"(nc|nd|non-?commercial|no derivatives|fair use|copyright|all rights)", re.I)

def api(url, params):
    q = urllib.parse.urlencode(params)
    req = urllib.request.Request(url + "?" + q, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())

def strip_html(s):
    return re.sub(r"<[^>]+>", "", s or "").strip()

def candidate_files(title):
    """Yield candidate Commons file names for the article: page image first, then all images on page."""
    seen = []
    d = api("https://en.wikipedia.org/w/api.php", {"action": "query", "prop": "pageimages|images", "titles": title,
            "format": "json", "piprop": "name", "imlimit": 50, "redirects": 1})
    for p in d.get("query", {}).get("pages", {}).values():
        pi = p.get("pageimage")
        if pi:
            seen.append("File:" + pi)
        for im in p.get("images", []):
            t = im["title"]
            if t not in seen and re.search(r"\.(jpe?g|png|webp)$", t, re.I) and not re.search(r"(flag|icon|logo|symbol|wiki|commons|crystal|edit|star|medal|cup|trophy|racket|question|pictogram)", t, re.I):
                seen.append(t)
    return seen

def file_meta(fname):
    d = api("https://commons.wikimedia.org/w/api.php", {"action": "query", "titles": fname, "prop": "imageinfo",
            "iiprop": "url|extmetadata|size|mime", "iiurlwidth": 800, "format": "json"})
    for p in d.get("query", {}).get("pages", {}).values():
        ii = (p.get("imageinfo") or [None])[0]
        if not ii:
            return None
        em = ii.get("extmetadata", {})
        lic = strip_html(em.get("LicenseShortName", {}).get("value", "")) or strip_html(em.get("License", {}).get("value", ""))
        author = strip_html(em.get("Artist", {}).get("value", "")) or "Unknown"
        return {"file": fname, "license": lic, "author": author[:120],
                "thumb": ii.get("thumburl") or ii.get("url"), "url": ii.get("url"),
                "sourceUrl": "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(fname.replace(" ", "_")),
                "mime": ii.get("mime"), "w": ii.get("width"), "h": ii.get("height")}

def ok_license(lic):
    return bool(lic) and bool(ALLOWED.search(lic)) and not BANNED.search(lic)

def download_and_compress(url, out_path):
    from PIL import Image, ImageOps
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    im = Image.open(io.BytesIO(data))
    im = ImageOps.exif_transpose(im).convert("RGB")
    im.thumbnail((600, 600))
    for q in (82, 74, 66, 58, 50, 42):
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=q, optimize=True, progressive=True)
        if buf.tell() <= 150 * 1024:
            break
    with open(out_path, "wb") as f:
        f.write(buf.getvalue())
    return buf.tell(), im.size

def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(2)
    title, slug = sys.argv[1], sys.argv[2]
    tried = []
    for fname in candidate_files(title):
        meta = file_meta(fname)
        if not meta or not meta.get("thumb"):
            continue
        tried.append((fname, meta["license"]))
        if not ok_license(meta["license"]):
            continue
        if meta["w"] and meta["h"] and meta["w"] < 200:
            continue
        out = os.path.join(ROOT, "img", "players", slug + ".jpg")
        size, dims = download_and_compress(meta["thumb"], out)
        print(json.dumps({"url": meta["url"], "localPath": "img/players/" + slug + ".jpg", "license": meta["license"],
                          "author": meta["author"], "sourceUrl": meta["sourceUrl"], "title": fname,
                          "bytes": size, "width": dims[0], "height": dims[1]}, ensure_ascii=False))
        return
    print(json.dumps({"photo": None, "reason": "no acceptable license", "tried": tried}, ensure_ascii=False))

if __name__ == "__main__":
    main()
