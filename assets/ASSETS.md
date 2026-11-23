# Asset sources

Images and sounds are stored locally so game boards and case previews do not depend on remote image hosting at runtime. Raster provenance sidecars are generated with Impeccable `embed-prompt --scan`.

## Brand and lobby art

- `jesterup-logo.webp` is the user's original logo image. `jesterup-logo-muted.webp` is the same image with its flat background shifted to muted gold for the loading screen, header, and profile; the logo art and wordmark are preserved. `game-mines.webp`, `game-rocket.webp`, `game-plane.webp`, `game-upgrader.webp`, and `game-plinko.webp` are user-supplied game art, converted locally to WebP for the game lobby.
- `index.html` embeds the Lucide `volume-2` and `volume-x` SVG paths for the sound toggle. Source: [Lucide](https://github.com/lucide-icons/lucide), ISC license; see `LUCIDE-LICENSE.txt`.

## Game art

- `mines-cover.webp` — [Mines game image](https://minescasino1win.net/hitting-a-bomb-while-playing-mines-on-a-five-by-five-grid.webp)
- `rocket-cover.webp` — [Rocket X game image](https://www.trueprob.com/blog/1win-rocket-x-2.webp)
- `rocket-launch.mp4` — [Free Rocket Launch animation](https://lottiefiles.com/free-animation/rocket-launch-Qz1CEnU0Ia)
- `roulette-cover.webp` — [Roulette image](https://www.semanariotiempo.cl/wp-content/uploads/2024/02/ruleta-casino.jpg)
- `plinko-cover.webp` — [Plinko board image](https://www.gameworkscreative.com/assets/images/da455320-332f-455a-9e99-0bc98d51eac6-1-105-c-768x1024-768x1024.jpg)
- `carrier-sprite.png`, `carrier-jet-sprite.png` — [Sea Warfare set](https://opengameart.org/content/sea-warfare-set-ships-and-more), CC0/public domain, Lowder2
- `plane-ocean-sprites.png` — [Animated ocean tile](https://opengameart.org/content/animated-ocean-water-tile), CC0/public domain, POKOMOKO
- `plane-interceptor-sprites.png`, `plane-crash-sprites.png`, `plane-small-explosion.png`, `plane-pickup-sprites.png`, `plane-ability-icons.png`, `jet-fighter-concept.png` — [Jet Plane Sprites](https://opengameart.org/content/jet-plane-sprites), CC0/public domain, CptDrunkBear
- `balance-chip.svg` — JesterUp demo UI asset.

## CS2 items

- CS2 skins and knives are stored as `cs2-*.png`, `cs2-*.webp`, `black-lotus.webp`, `awp-atheris.webp`, `ak-inheritance.webp`, `steam-p250-sand-dune.png`, and the additional Steam-icon downloads (`awp-phobos.png`, `famas-valence.png`, `usp-cortex.png`, `m4-flashback.png`, `ak-elite-build.png`). Their Steam Community Market price snapshots are dated 22 November 2026.
- `cs-case-covers/*.png` — 20 CS2 weapon-case icons downloaded from Steam Community Market and rendered at 360px for case-card artwork.
- `cs2-awp-dragon-lore.webp` — BitSkins listing artwork. Its displayed price is an approximately $9,500 market reference from SteamDB converted at the 22 November 2026 Bank of Russia USD/RUB rate.
- `cs2-butterfly-emerald.png` — Butterfly Gamma Doppler Emerald render from SkinsMonkey. The displayed price is a $5,860.28 market reference from CS2Bet converted at the same Bank of Russia rate. Both high-tier prices are dated estimates; the exact skin pattern, float and current offer affect market value.

## Telegram gifts

- `telegram-heart.webp`, `telegram-teddy.webp`, `telegram-giftbox.webp`, `telegram-rose.webp`, `telegram-cake.webp`, `telegram-bouquet.webp`, `telegram-trophy.webp`, `telegram-diamond-ring.webp` — [GiftClub Telegram gift catalog](https://giftclub.app/telegram-gifts)
- Ordinary gift Stars prices follow the [Telegram Gifts API](https://core.telegram.org/api/gifts). Gift values are shown as Stars plus an estimated RUB equivalent.
- `telegram-nft-data.js` — 124 collectible Telegram gift collections with collection names, Fragment floor in GRAM, RUB conversion, local image and animation paths. Refresh data with `tools/refresh-telegram-catalog.py`.
- `telegram-nft/*.png` — 256px first frames of real Telegram gift models, returned by [Gift Changes API](https://api.changes.tg/); original Fragment `thumb.webp` collection icons remain as fallback art.
- `telegram-nft-animations/*.tgs` — locally downloaded Telegram sticker model animations from Gift Changes API. The case gallery loads the compressed TGS on hover and renders it with the bundled Lottie player. Gift Changes API attribution is shown in the case price note.
- Collection prices are read from [TG Gifts floor tracking](https://tggifts.com/floors) and link to Fragment. Rows marked as a timed listing did not show a live floor and are identified as such in the prize table.
- The case pools also include regular Telegram gifts and their estimated Stars-to-RUB value from the [Telegram Gifts API](https://core.telegram.org/api/gifts).

## Sound

- `assets/lottie.min.js` — Lottie Web 5.12.2 (Bodymovin), bundled from cdnjs to play local TGS files. Distributed under the MIT license; see `assets/Lottie-LICENSE.txt`.
- `audio/ui-click.ogg`, `audio/ui-select.ogg`, `audio/ui-success.ogg`, `audio/ui-error.ogg`, `audio/ui-tick.ogg` — [Kenney interface sound pack](https://opengameart.org/content/interface-sounds), CC0.
- `audio/explosion.wav` — [Explosion effect](https://opengameart.org/content/explosion-0), CC0, TinyWorlds.

## Price snapshot

CS2 prices are Steam Community Market observations. Telegram collectible gift floors come from [TG Gifts](https://tggifts.com/floors) and are converted at 1 GRAM = 79.87 ₽. Gift and USD reference rates are static snapshots from 22 November 2026; Dragon Lore and Butterfly Emerald use third-party market references because live Steam listings are not available for those high-value variants. Currency display uses [USDT/RUB](https://currency.world/exchange_rates/USDT/RUB), [GRAM/RUB on CoinGecko](https://www.coingecko.com/en/coins/gram/rub) and the [Bank of Russia USD/RUB reference rate](https://www.cbr.ru/currency_base/daily/). The displayed chance tables are demo-authored and do not represent publisher drop rates. Case openings use virtual credits and do not deliver items.

