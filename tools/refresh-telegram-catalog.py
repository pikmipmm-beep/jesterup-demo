"""Download Telegram collectible gift thumbnails and their Fragment floor snapshot."""

from __future__ import annotations

import concurrent.futures
import html
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "telegram-nft"
ANIMATION_DIR = ROOT / "assets" / "telegram-nft-animations"
OUTPUT = ROOT / "telegram-nft-data.js"
FLOORS_URL = "https://tggifts.com/floors"
GRAM_RUB = 79.87
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; JesterUpLocalDemo/1.0)",
    "Referer": "https://fragment.com/",
}


def read_url(url: str) -> bytes:
    for attempt in range(3):
        try:
            request = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(request, timeout=25) as response:
                return response.read()
        except Exception:
            if attempt == 2:
                raise
            time.sleep(0.4 * (attempt + 1))
    raise RuntimeError("Unreachable retry state")


def text_from_markup(value: str) -> str:
    return html.unescape(re.sub(r"<[^>]*>", "", value)).strip()


def parse_collections(page: str) -> list[dict[str, object]]:
    records = []
    for row in re.findall(r"<tr\b[^>]*>.*?</tr>", page, flags=re.I | re.S):
        anchor = re.search(
            r'<a\s+class="gname"\s+href="/c/([^\"]+)"[^>]*>(.*?)</a>',
            row,
            flags=re.I | re.S,
        )
        floor_cell = re.search(
            r'<td\s+data-l="Floor \(Fragment\)">(.*?)</td>',
            row,
            flags=re.I | re.S,
        )
        if not anchor or not floor_cell:
            continue
        floor_text = text_from_markup(floor_cell.group(1))
        price_match = re.search(r"\d[\d,]*(?:\.\d+)?", floor_text)
        if not price_match:
            continue
        slug = anchor.group(1)
        name = text_from_markup(anchor.group(2))
        floor_gram = float(price_match.group(0).replace(",", ""))
        records.append(
            {
                "id": "tg-" + slug,
                "slug": slug,
                "name": name,
                "floorGram": floor_gram,
                "priceRub": round(floor_gram * GRAM_RUB, 2),
                "image": f"assets/telegram-nft/{slug}.webp",
                "floorType": "timed-sale" if "timed sale" in floor_text.lower() else "floor",
                "sourceUrl": f"https://fragment.com/gifts/{slug}",
            }
        )
    unique: dict[str, dict[str, object]] = {}
    for record in records:
        unique[str(record["slug"])] = record
    return sorted(unique.values(), key=lambda item: (float(item["priceRub"]), str(item["slug"])))


def download_image(record: dict[str, object]) -> tuple[str, bool]:
    slug = str(record["slug"])
    destination = ASSET_DIR / f"{slug}.webp"
    try:
        image = read_url(f"https://fragment.com/file/gifts/{slug}/thumb.webp")
        if len(image) < 500 or not image.startswith(b"RIFF"):
            return slug, False
        destination.write_bytes(image)
        return slug, True
    except Exception:
        return slug, False


def download_animation(record: dict[str, object]) -> tuple[str, bool]:
    slug = str(record["slug"])
    try:
        models = json.loads(read_url(f"https://api.changes.tg/models/{slug}").decode("utf-8"))
        model = next((entry for entry in models if not entry.get("crafted")), None)
        if not model:
            return slug, False
        model_name = str(model.get("name") or "")
        if not model_name:
            return slug, False
        encoded_model = urllib.parse.quote(model_name, safe="")
        poster = read_url(f"https://api.changes.tg/model/{slug}/{encoded_model}.png?size=256")
        if poster.startswith(b"\x89PNG"):
            (ASSET_DIR / f"{slug}.png").write_bytes(poster)
            record["image"] = f"assets/telegram-nft/{slug}.png"
        animation = read_url(f"https://api.changes.tg/model/{slug}/{encoded_model}.tgs")
        if len(animation) < 1000 or not animation.startswith(b"\x1f\x8b"):
            return slug, False
        (ANIMATION_DIR / f"{slug}.tgs").write_bytes(animation)
        record["animation"] = f"assets/telegram-nft-animations/{slug}.tgs"
        record["animationModel"] = model_name
        return slug, True
    except Exception:
        return slug, False


def main() -> None:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    ANIMATION_DIR.mkdir(parents=True, exist_ok=True)
    page = read_url(FLOORS_URL).decode("utf-8", errors="replace")
    records = parse_collections(page)
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(download_image, records))
    available = {slug for slug, ok in results if ok}
    for record in records:
        if str(record["slug"]) not in available:
            record["image"] = "assets/telegram-giftbox.webp"
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        animations = list(pool.map(download_animation, records))
    animated = {slug for slug, ok in animations if ok}
    OUTPUT.write_text(
        "// Fragment collectible thumbs and floor snapshot via TG Gifts; refreshed locally.\n"
        "window.JESTER_NFT_COLLECTIONS = "
        + json.dumps(records, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    print(f"Collections: {len(records)}; thumbnails downloaded: {len(available)}; animations downloaded: {len(animated)}")
    print(f"Catalog: {OUTPUT}")
    print(f"Image directory: {ASSET_DIR}")


if __name__ == "__main__":
    main()
