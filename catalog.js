(() => {
  const steamSearch = "https://steamcommunity.com/market/search?appid=730&lock_appid=730";
  const steamItem = (name) => "https://steamcommunity.com/market/listings/730/" + encodeURIComponent(name);
  const telegramGifts = "https://core.telegram.org/api/gifts";
  const telegramFloors = "https://tggifts.com/floors";
  const fragmentCollection = (slug) => "https://tggifts.com/c/" + slug;
  const roundPrice = (value) => Math.round(value * 100) / 100;

  const cash = [1, 3, 5, 10, 25, 50, 100].map((value) => ({
    id: "rub-" + value,
    name: "Баланс · " + value + " ₽",
    type: "balance",
    priceRub: value,
    priceLabel: value + " ₽",
    rarity: value >= 50 ? "uncommon" : "common",
    image: "assets/balance-chip.svg",
    source: "JesterUp"
  }));
  const balance = Object.fromEntries(cash.map((item) => [item.id, item]));

  const cs2Loot = [
    { id: "cs-p250-sand", name: "P250 | Sand Dune (Battle-Scarred)", priceRub: 3.44, image: "assets/steam-p250-sand-dune.png", rarity: "common", sourceUrl: steamItem("P250 | Sand Dune (Battle-Scarred)") },
    { id: "cs-mp9-sand-dashed", name: "MP9 | Sand Dashed (Battle-Scarred)", priceRub: 2.46, image: "assets/cs2-mp9-sand-dashed.png", rarity: "common", sourceUrl: "https://steamcommunity.com/market/listings/730/G18222094013004" },
    { id: "cs-mac10-monkeyflage", name: "MAC-10 | Monkeyflage (Battle-Scarred)", priceRub: 6, image: "assets/cs2-mac10-monkeyflage.png", rarity: "common", sourceUrl: "https://steamcommunity.com/market/listings/730/G181120FE083004" },
    { id: "cs-glock-high-beam", name: "Glock-18 | High Beam (Factory New)", priceRub: 12.94, image: "assets/cs2-glock-high-beam.webp", rarity: "common", sourceUrl: steamItem("Glock-18 | High Beam (Factory New)") },
    { id: "cs-mp7-coral", name: "MP7 | Coral Paisley (Factory New)", priceRub: 17.93, image: "assets/cs2-mp7-coral-paisley.webp", rarity: "common", sourceUrl: steamItem("MP7 | Coral Paisley (Factory New)") },
    { id: "cs-m4a4-magnesium", name: "M4A4 | Magnesium (Field-Tested)", priceRub: 44.78, image: "assets/cs2-m4a4-magnesium.png", rarity: "uncommon", sourceUrl: steamItem("M4A4 | Magnesium (Field-Tested)") },
    { id: "cs-deagle-tilted", name: "Desert Eagle | Tilted (Factory New)", priceRub: 108.51, image: "assets/cs2-deagle-tilted.webp", rarity: "rare", sourceUrl: steamItem("Desert Eagle | Tilted (Factory New)") },
    { id: "cs-black-lotus", name: "M4A1-S | Black Lotus (Field-Tested)", priceRub: 323.74, image: "assets/black-lotus.webp", rarity: "rare", sourceUrl: steamItem("M4A1-S | Black Lotus (Field-Tested)") },
    { id: "cs-awp-atheris", name: "AWP | Atheris (Field-Tested)", priceRub: 372.48, image: "assets/awp-atheris.webp", rarity: "rare", sourceUrl: steamItem("AWP | Atheris (Field-Tested)") },
    { id: "cs-ak-inheritance", name: "AK-47 | Inheritance (Field-Tested)", priceRub: 2788.54, image: "assets/ak-inheritance.webp", rarity: "epic", sourceUrl: steamItem("AK-47 | Inheritance (Field-Tested)") },
    { id: "cs-shadow-daggers", name: "★ Shadow Daggers | Black Laminate (Field-Tested)", priceRub: 3421.22, image: "assets/cs2-shadow-daggers.webp", rarity: "knife", sourceUrl: steamItem("★ Shadow Daggers | Black Laminate (Field-Tested)") },
    { id: "cs-ak-neon-rider", name: "AK-47 | Neon Rider (Field-Tested)", priceRub: 3599.47, image: "assets/cs2-ak-neon-rider.png", rarity: "epic", sourceUrl: steamItem("AK-47 | Neon Rider (Field-Tested)") },
    { id: "cs-ak-redline", name: "AK-47 | Redline (Field-Tested)", priceRub: 2316.04, image: "assets/cs2-ak-redline.png", rarity: "rare", sourceUrl: steamItem("AK-47 | Redline (Field-Tested)") },
    { id: "cs-awp-asiimov", name: "AWP | Asiimov (Field-Tested)", priceRub: 9368.01, image: "assets/cs2-awp-asiimov.png", rarity: "epic", sourceUrl: steamItem("AWP | Asiimov (Field-Tested)") },
    { id: "cs-m4-printstream", name: "M4A1-S | Printstream (Field-Tested)", priceRub: 13220.86, image: "assets/cs2-m4-printstream.png", rarity: "legendary", sourceUrl: steamItem("M4A1-S | Printstream (Field-Tested)") },
    { id: "cs-m4-temukau", name: "M4A4 | Temukau (Field-Tested)", priceRub: 2326, image: "assets/cs2-m4-temukau.png", rarity: "rare", sourceUrl: steamItem("M4A4 | Temukau (Field-Tested)") },
    { id: "cs-karambit-doppler", name: "★ Karambit | Doppler (Factory New)", priceRub: 123895.48, image: "assets/cs2-karambit-doppler.png", rarity: "knife", sourceUrl: steamItem("★ Karambit | Doppler (Factory New)") },
    { id: "cs-m9-autotronic", name: "★ M9 Bayonet | Autotronic (Field-Tested)", priceRub: 59585.41, image: "assets/cs2-m9-autotronic.png", rarity: "knife", sourceUrl: steamItem("★ M9 Bayonet | Autotronic (Field-Tested)") },
    { id: "cs-bayonet-fade", name: "★ Bayonet | Fade (Factory New)", priceRub: 32015.91, image: "assets/cs2-bayonet-fade.png", rarity: "knife", sourceUrl: steamItem("★ Bayonet | Fade (Factory New)") },
    { id: "cs-skeleton-slaughter", name: "★ Skeleton Knife | Slaughter (Field-Tested)", priceRub: 37994.8, image: "assets/cs2-skeleton-slaughter.png", rarity: "knife", sourceUrl: steamItem("★ Skeleton Knife | Slaughter (Field-Tested)") },
    { id: "cs-karambit-tiger-tooth", name: "★ Karambit | Tiger Tooth (Factory New)", priceRub: 80804.2, image: "assets/cs2-karambit-tiger-tooth.png", rarity: "knife", sourceUrl: steamItem("★ Karambit | Tiger Tooth (Factory New)") },
    { id: "cs-m9-doppler", name: "★ M9 Bayonet | Doppler (Factory New)", priceRub: 77098.72, image: "assets/cs2-m9-doppler.png", rarity: "knife", sourceUrl: steamItem("★ M9 Bayonet | Doppler (Factory New)") },
    { id: "cs-stiletto-tiger-tooth", name: "★ Stiletto Knife | Tiger Tooth (Factory New)", priceRub: 24843.64, image: "assets/cs2-stiletto-tiger-tooth.png", rarity: "knife", sourceUrl: steamItem("★ Stiletto Knife | Tiger Tooth (Factory New)") },
    { id: "cs-talon-doppler", name: "★ Talon Knife | Doppler (Factory New)", priceRub: 66329.44, image: "assets/cs2-talon-doppler.png", rarity: "knife", sourceUrl: steamItem("★ Talon Knife | Doppler (Factory New)") },
    { id: "cs-ursus-doppler", name: "★ Ursus Knife | Doppler (Factory New)", priceRub: 21850.23, image: "assets/cs2-ursus-doppler.png", rarity: "knife", sourceUrl: steamItem("★ Ursus Knife | Doppler (Factory New)") },
    { id: "cs-ak-fuel-injector", name: "AK-47 | Fuel Injector (Field-Tested)", priceRub: 11092.55, image: "assets/cs2-ak-fuel-injector.png", rarity: "epic", sourceUrl: steamItem("AK-47 | Fuel Injector (Field-Tested)") },
    { id: "cs-ak-asiimov", name: "AK-47 | Asiimov (Field-Tested)", priceRub: 3418.46, image: "assets/cs2-ak-asiimov.png", rarity: "epic", sourceUrl: steamItem("AK-47 | Asiimov (Field-Tested)") },
    { id: "cs-awp-wildfire", name: "AWP | Wildfire (Field-Tested)", priceRub: 3639.01, image: "assets/cs2-awp-wildfire.png", rarity: "epic", sourceUrl: steamItem("AWP | Wildfire (Field-Tested)") },
    { id: "cs-usp-kill-confirmed", name: "USP-S | Kill Confirmed (Field-Tested)", priceRub: 6141.74, image: "assets/cs2-usp-kill-confirmed.png", rarity: "epic", sourceUrl: steamItem("USP-S | Kill Confirmed (Field-Tested)") },
    { id: "cs-m4-neo-noir", name: "M4A4 | Neo-Noir (Field-Tested)", priceRub: 2625.13, image: "assets/cs2-m4-neo-noir.png", rarity: "rare", sourceUrl: steamItem("M4A4 | Neo-Noir (Field-Tested)") },
    { id: "cs-awp-phobos", name: "AWP | Phobos (Field-Tested)", priceRub: 181.13, image: "assets/awp-phobos.png", rarity: "uncommon", sourceUrl: steamItem("AWP | Phobos (Field-Tested)") },
    { id: "cs-famas-valence", name: "FAMAS | Valence (Field-Tested)", priceRub: 272.82, image: "assets/famas-valence.png", rarity: "rare", sourceUrl: steamItem("FAMAS | Valence (Field-Tested)") },
    { id: "cs-usp-cortex", name: "USP-S | Cortex (Field-Tested)", priceRub: 303.06, image: "assets/usp-cortex.png", rarity: "rare", sourceUrl: steamItem("USP-S | Cortex (Field-Tested)") },
    { id: "cs-m4-flashback", name: "M4A1-S | Flashback (Field-Tested)", priceRub: 319.73, image: "assets/m4-flashback.png", rarity: "rare", sourceUrl: steamItem("M4A1-S | Flashback (Field-Tested)") },
    { id: "cs-ak-elite-build", name: "AK-47 | Elite Build (Field-Tested)", priceRub: 171.26, image: "assets/ak-elite-build.png", rarity: "uncommon", sourceUrl: steamItem("AK-47 | Elite Build (Field-Tested)") },
    { id: "cs-awp-dragon-lore", name: "AWP | Dragon Lore (Factory New)", priceRub: 780815, image: "assets/cs2-awp-dragon-lore.webp", rarity: "legendary", sourceUrl: "https://steamdb.com/en/skins/cs2/awp/awp-dragon-lore-factory-new" },
    { id: "cs-butterfly-emerald", name: "★ Butterfly Knife | Gamma Doppler Emerald (Factory New)", priceRub: 481662.86, image: "assets/cs2-butterfly-emerald.png", rarity: "knife", sourceUrl: "https://cs2bet.com/cs2-knives/butterfly-knife/" }
  ].map((item) => ({ ...item, type: "cs2", category: "cs2", priceLabel: roundPrice(item.priceRub).toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₽", source: "Steam Market" }));

  const giftLoot = [
    { id: "tg-heart", name: "Love Heart", priceRub: 18.9, priceLabel: "15 ⭐ · ≈19 ₽", chance: 0, rarity: "common", image: "assets/telegram-heart.webp", source: "Telegram Gifts", sourceUrl: telegramGifts },
    { id: "tg-teddy", name: "Teddy Bear", priceRub: 18.9, priceLabel: "15 ⭐ · ≈19 ₽", chance: 0, rarity: "common", image: "assets/telegram-teddy.webp", source: "Telegram Gifts", sourceUrl: telegramGifts },
    { id: "tg-rose", name: "Red Rose", priceRub: 31.5, priceLabel: "25 ⭐ · ≈32 ₽", chance: 0, rarity: "common", image: "assets/telegram-rose.webp", source: "Telegram Gifts", sourceUrl: telegramGifts },
    { id: "tg-giftbox", name: "Gift Box", priceRub: 31.5, priceLabel: "25 ⭐ · ≈32 ₽", chance: 0, rarity: "common", image: "assets/telegram-giftbox.webp", source: "Telegram Gifts", sourceUrl: telegramGifts },
    { id: "tg-cake", name: "Birthday Cake", priceRub: 63.1, priceLabel: "50 ⭐ · ≈63 ₽", chance: 0, rarity: "uncommon", image: "assets/telegram-cake.webp", source: "Telegram Gifts", sourceUrl: telegramGifts },
    { id: "tg-flowers", name: "Bouquet of Flowers", priceRub: 63.1, priceLabel: "50 ⭐ · ≈63 ₽", chance: 0, rarity: "uncommon", image: "assets/telegram-bouquet.webp", source: "Telegram Gifts", sourceUrl: telegramGifts },
    { id: "tg-trophy", name: "Trophy", priceRub: 126.2, priceLabel: "100 ⭐ · ≈126 ₽", chance: 0, rarity: "rare", image: "assets/telegram-trophy.webp", source: "Telegram Gifts", sourceUrl: telegramGifts },
    { id: "tg-ring", name: "Diamond Ring", priceRub: 126.2, priceLabel: "100 ⭐ · ≈126 ₽", chance: 0, rarity: "rare", image: "assets/telegram-diamond-ring.webp", source: "Telegram Gifts", sourceUrl: telegramGifts }
  ];

  const nftLoot = (window.JESTER_NFT_COLLECTIONS || []).map((gift) => {
    const priceRub = roundPrice(gift.priceRub);
    const rarity = priceRub >= 100000 ? "legendary" : priceRub >= 10000 ? "epic" : priceRub >= 2000 ? "rare" : "common";
    const floorNote = gift.floorType === "timed-sale" ? " · timed listing" : " · floor";
    return {
      id: gift.id,
      name: gift.name + " · NFT",
      type: "nft",
      category: "gifts",
      floorGram: gift.floorGram,
      floorType: gift.floorType,
      priceRub,
      priceLabel: gift.floorGram + " GRAM" + floorNote,
      rarity,
      image: gift.image,
      animation: gift.animation || "",
      source: "Fragment collectible floor",
      sourceUrl: gift.sourceUrl || fragmentCollection(gift.slug)
    };
  });

  const loot = new Map([
    ...cash.map((item) => [item.id, item]),
    ...cs2Loot.map((item) => [item.id, item]),
    ...giftLoot.map((item) => [item.id, item]),
    ...nftLoot.map((item) => [item.id, item])
  ]);
  const giftLowOne = ["bigyear", "candycane", "happybrownie", "icecream", "jesterhat", "lolpop", "deskcalendar", "bdaycandle"];
  const giftLowTwo = ["jesterhat", "lolpop", "inputkey"];
  const giftVip = ["plushpepe", "durovscap", "swisswatch", "heartlocket", "algorithmcup"];
  const remainingNfts = nftLoot
    .filter((item) => !new Set([...giftLowOne, ...giftLowTwo]).has(item.id.replace("tg-", "")))
    .sort((a, b) => a.priceRub - b.priceRub);
  const nftBySlug = new Map(nftLoot.map((item) => [item.id.replace("tg-", ""), item]));
  const chooseSpread = (items, count, offset = 0) => {
    if (items.length <= count) return items.slice();
    const start = ((offset % items.length) + items.length) % items.length;
    return Array.from({ length: count }, (_, index) => items[(start + Math.floor((index + 0.5) * items.length / count)) % items.length]);
  };
  const buildGiftNfts = (caseIndex) => {
    if (caseIndex === 0) return giftLowOne.map((slug) => nftBySlug.get(slug)).filter(Boolean);
    if (caseIndex === 1) return giftLowTwo.map((slug) => nftBySlug.get(slug)).filter(Boolean);
    const segmentIndex = caseIndex - 2;
    const segmentCount = 18;
    const start = Math.floor(segmentIndex * remainingNfts.length / segmentCount);
    const end = Math.floor((segmentIndex + 1) * remainingNfts.length / segmentCount);
    const segment = remainingNfts.slice(start, Math.max(start + 1, end));
    if (caseIndex >= 18) return [...new Map([...segment, ...giftVip.map((slug) => nftBySlug.get(slug)).filter(Boolean)].map((item) => [item.id, item])).values()];
    return segment;
  };
  const makeWeightedRewards = (items, weight) => {
    const unique = [...new Map(items.filter(Boolean).map((item) => [item.id, item])).values()];
    const weights = unique.map((item) => Math.max(0.001, weight(item)));
    const total = weights.reduce((sum, value) => sum + value, 0) || 1;
    let assigned = 0;
    return unique.map((item, index) => {
      const chance = index === unique.length - 1
        ? Math.max(0, 100 - assigned)
        : Math.round(weights[index] / total * 10000) / 100;
      assigned += chance;
      return { ...item, chance };
    });
  };
  const csCaseBlueprints = [
    ["Бомж", "Сдача", 9, 273, "cs-famas-valence"],
    ["Бомж", "Пыльный дроп", 15, 320, "cs-m4-flashback"],
    ["Дешёвые", "Пистолетный", 25, 500, "cs-usp-cortex"],
    ["Дешёвые", "Лоу-бай", 35, 1000, "cs-awp-phobos"],
    ["Дешёвые", "Форс-бай", 50, 2000, "cs-ak-elite-build"],
    ["Пистолеты", "Первый выстрел", 75, 3500, "cs-deagle-tilted"],
    ["Пистолеты", "Точный прицел", 100, 5000, "cs-m4a4-magnesium"],
    ["Пистолеты", "Горячая обойма", 150, 8000, "cs-ak-neon-rider"],
    ["Винтовки", "Короткий раунд", 250, 12000, "cs-awp-asiimov"],
    ["Винтовки", "Длинная дистанция", 500, 18000, "cs-m4-printstream"],
    ["Винтовки", "Точный контроль", 900, 30000, "cs-stiletto-tiger-tooth"],
    ["Ножи", "Клинок", 1500, 40000, "cs-bayonet-fade"],
    ["Ножи", "Грани", 2500, 60000, "cs-skeleton-slaughter"],
    ["Ножи", "Витрина", 5000, 80000, "cs-m9-autotronic"],
    ["Премиум", "Редкий узор", 10000, 100000, "cs-m9-doppler"],
    ["Премиум", "Сапфировый свет", 25000, 140000, "cs-karambit-doppler"],
    ["Легенды", "Топовый паттерн", 50000, 250000, "cs-butterfly-emerald"],
    ["Легенды", "Изумрудная грань", 75000, 481663, "cs-butterfly-emerald"],
    ["VIP", "Dragon Lore", 100000, 780815, "cs-awp-dragon-lore"],
    ["VIP", "Emerald Reserve", 150000, 481663, "cs-butterfly-emerald"]
  ];
  const csCaseCovers = ["fever", "kilowatt", "dreams-nightmares", "revolution", "recoil", "snakebite", "fracture", "prisma-2", "prisma", "spectrum-2", "spectrum", "clutch", "chroma-3", "chroma-2", "chroma", "gamma-2", "gamma", "horizon", "danger-zone", "breakout"];
  const giftCaseBlueprints = [
    ["Бомж", "Фарм-кейс", 9, "tg-deskcalendar"],
    ["Бомж", "Мелочь", 15, "tg-jesterhat"],
    ["Дешёвые", "Сладкий дроп", 25, "tg-candycane"],
    ["Дешёвые", "Праздничный", 35, "tg-bdaycandle"],
    ["Дешёвые", "Сдача", 50, "tg-lushbouquet"],
    ["50/50", "Мишка и торт", 75, "tg-toybear"],
    ["50/50", "Роза и алмаз", 100, "tg-diamondring"],
    ["50/50", "Сюрприз", 150, "tg-miragelamp"],
    ["На сдачу", "Карамель", 250, "tg-hypnolollipop"],
    ["На сдачу", "Ягодный микс", 500, "tg-berrybox"],
    ["На сдачу", "Подарочный ряд", 750, "tg-sakuraflower"],
    ["Премиум", "Коллекционный вечер", 1200, "tg-gemsignet"],
    ["Премиум", "Золотая лента", 2500, "tg-swisswatch"],
    ["Премиум", "Редкий экземпляр", 5000, "tg-mini-oscar"],
    ["Коллекция", "Хранилище", 10000, "tg-lootbag"],
    ["Коллекция", "Редкие модели", 25000, "tg-durovsglasses"],
    ["Легенды", "Семейная коллекция", 50000, "tg-preciouspeach"],
    ["Легенды", "Большая редкость", 75000, "tg-resistancedog"],
    ["VIP", "Pepe Reserve", 80000, "tg-plushpepe"],
    ["VIP", "Золотой Peacock", 120000, "tg-plushpepe"]
  ];
  const csWeight = (item) => item.type === "balance"
    ? ({ 1: 30, 3: 16, 5: 9 }[item.priceRub] || 3)
    : 58 / Math.pow(item.priceRub + 1, 0.49);
  const giftWeight = (item, ticketRub) => {
    if (item.type === "balance") return ticketRub >= 35 ? ({ 1: 2.2, 3: 1.8, 5: 1.5 }[item.priceRub] || 1) : ({ 1: 30, 3: 16, 5: 9 }[item.priceRub] || 3);
    if (ticketRub >= 35 && (item.id === "tg-teddy" || item.id === "tg-rose")) return 36;
    if (item.type === "nft") return 1.55 / Math.pow(Math.max(1, item.priceRub / 500), 0.33);
    return 74 / Math.pow(item.priceRub + 1, 0.49);
  };
  const trimSmallPrizes = (items, ticketRub) => ticketRub < 1500
    ? items
    : items.filter((item) => item.type !== "balance" && item.priceRub >= ticketRub * 0.1);
  const spreadCaseItems = (items, caseIndex) => {
    const sorted = items.slice().sort((a, b) => a.priceRub - b.priceRub);
    if (sorted.length <= 14) return sorted;
    const low = sorted.slice(0, 5);
    const top = sorted[sorted.length - 1];
    const middle = sorted.slice(5, -1);
    const sampled = chooseSpread(middle, 8, caseIndex * 3);
    return [...new Map([...low, ...sampled, top].map((item) => [item.id, item])).values()];
  };
  const csCases = csCaseBlueprints.map(([section, name, ticketRub, ceiling, coverId], index) => {
    const csItems = cs2Loot.filter((item) => item.priceRub <= ceiling);
    const prizes = spreadCaseItems(csItems, index);
    const cover = loot.get(coverId) || prizes[prizes.length - 1];
    if (cover && !prizes.some((item) => item.id === cover.id)) prizes.push(cover);
    return {
      id: "cs2-case-" + String(index + 1).padStart(2, "0"),
      category: "cs2",
      section,
      name,
      description: "Реальные CS2-предметы · рыночный снимок 22.11.2026",
      ticketRub,
      image: cover.image,
      coverItemId: cover.id,
      caseCover: "assets/cs-case-covers/" + csCaseCovers[index] + ".png",
      marketSource: "Steam Community Market",
      marketUrl: steamSearch,
      rewards: makeWeightedRewards(trimSmallPrizes([...cash.slice(0, 3), ...prizes], ticketRub), csWeight)
    };
  });
  const giftsCases = giftCaseBlueprints.map(([section, name, ticketRub, coverId], index) => {
    const regulars = ticketRub >= 35
      ? [...giftLoot.filter((gift) => gift.id === "tg-teddy" || gift.id === "tg-rose"), ...chooseSpread(giftLoot.filter((gift) => gift.id !== "tg-teddy" && gift.id !== "tg-rose"), 3, index * 2)]
      : Array.from({ length: 5 }, (_, offset) => giftLoot[(index * 3 + offset * 3) % giftLoot.length]);
    const nfts = buildGiftNfts(index);
    const cover = loot.get(coverId) || nfts[0] || regulars[0];
    return {
      id: "gifts-case-" + String(index + 1).padStart(2, "0"),
      category: "gifts",
      section,
      name,
      description: "Обычные Telegram-подарки и NFT-коллекции в одном пуле",
      ticketRub,
      image: cover.image,
      coverItemId: cover.id,
      marketSource: "Fragment · TG Gifts",
      marketUrl: telegramFloors,
      rewards: makeWeightedRewards(trimSmallPrizes([...cash.slice(0, 3), ...regulars, ...nfts, cover], ticketRub), (item) => giftWeight(item, ticketRub))
    };
  });
  window.JESTER_CASES = [...csCases, ...giftsCases];
})();
