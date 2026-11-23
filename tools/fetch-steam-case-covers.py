"""Download local CS2 weapon-case artwork from Steam Community Market icons."""

from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from urllib.error import HTTPError
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "cs-case-covers"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; JesterUpLocalDemo/1.0)"}
CASES = [
    ("fever", "Fever Case"),
    ("kilowatt", "Kilowatt Case"),
    ("dreams-nightmares", "Dreams & Nightmares Case"),
    ("revolution", "Revolution Case"),
    ("recoil", "Recoil Case"),
    ("snakebite", "Snakebite Case"),
    ("fracture", "Fracture Case"),
    ("prisma-2", "Prisma 2 Case"),
    ("prisma", "Prisma Case"),
    ("spectrum-2", "Spectrum 2 Case"),
    ("spectrum", "Spectrum Case"),
    ("clutch", "Clutch Case"),
    ("chroma-3", "Chroma 3 Case"),
    ("chroma-2", "Chroma 2 Case"),
    ("chroma", "Chroma Case"),
    ("gamma-2", "Gamma 2 Case"),
    ("gamma", "Gamma Case"),
    ("horizon", "Horizon Case"),
    ("danger-zone", "Danger Zone Case"),
    ("breakout", "Operation Breakout Weapon Case"),
]


def read_bytes(url: str) -> bytes:
    for attempt in range(4):
        try:
            request = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(request, timeout=30) as response:
                return response.read()
        except HTTPError as error:
            if error.code != 429 or attempt == 3:
                raise
            time.sleep(3 * (attempt + 1))
    raise RuntimeError("Steam request retries exhausted")


def fetch_case(record: tuple[str, str]) -> tuple[str, str, bool]:
    slug, name = record
    query = urllib.parse.quote(name, safe="")
    url = (
        "https://steamcommunity.com/market/search/render/?query="
        + query
        + "&start=0&count=10&search_descriptions=0&sort_column=price&sort_dir=asc"
        + "&appid=730&norender=1&currency=5"
    )
    try:
        data = json.loads(read_bytes(url).decode("utf-8"))
        matches = data.get("results", [])
        result = next((item for item in matches if item.get("hash_name") == name), None)
        if not result:
            return slug, "", False
        icon = result.get("asset_description", {}).get("icon_url")
        if not icon:
            return slug, name, False
        image_url = f"https://community.cloudflare.steamstatic.com/economy/image/{icon}/360fx360f"
        image = read_bytes(image_url)
        if len(image) < 1000 or not image.startswith(b"\x89PNG"):
            return slug, name, False
        (OUTPUT / f"{slug}.png").write_bytes(image)
        return slug, name, True
    except (OSError, ValueError, RuntimeError):
        return slug, name, False


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    results = []
    for record in CASES:
        results.append(fetch_case(record))
        time.sleep(2)
    manifest = []
    for slug, name, downloaded in results:
        if downloaded:
            manifest.append({"slug": slug, "name": name, "image": f"assets/cs-case-covers/{slug}.png"})
        print(f"{'OK' if downloaded else 'MISS'}\t{name}")
    print(f"Downloaded {len(manifest)} of {len(CASES)} Steam case images.")


if __name__ == "__main__":
    main()
