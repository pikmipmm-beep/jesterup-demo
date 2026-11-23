(() => {
  "use strict";

  const STORAGE_KEY = "jesterup-demo-v2";
  const telegramApp = window.Telegram && window.Telegram.WebApp;
  if (telegramApp) {
    telegramApp.ready();
    telegramApp.expand();
    telegramApp.setHeaderColor("#37301e");
    telegramApp.setBackgroundColor("#37301e");
  }
  const START_BALANCE = 1350000;
  const MIN_BET = 1;
  const CURRENCIES = {
    RUB: { rate: 1, symbol: "₽", digits: 0 },
    USDT: { rate: 81.35, symbol: "USDT", digits: 2 },
    GRAM: { rate: 79.87, symbol: "GRAM", digits: 2 }
  };
  const GAMES = {
    mines: { title: "Мины", subtitle: "Открывай кристаллы и забирай растущий множитель.", caption: "25 плиток · найди кристаллы", start: "Начать игру" },
    upgrader: { title: "Апгрейдер", subtitle: "Выбери предмет и крути шанс на улучшение.", caption: "Инвентарь · цель · шанс", start: "Апгрейдировать" },
    rocket: { title: "Ракета", subtitle: "Множитель растёт вместе с полётом — забери его вовремя.", caption: "Виртуальный запуск · успей выйти", start: "Запустить ракету" },
    plane: { title: "Самолёт", subtitle: "Пройди маршрут, следи за высотой и реши, когда садиться.", caption: "Рейс · высота · дистанция · множитель", start: "Начать рейс" },
    roulette: { title: "Рулетка", subtitle: "Выбери цвет и дождись результата локального раунда.", caption: "Красное / чёрное · выплата ×2", start: "Крутить рулетку" },
    plinko: { title: "Плинко", subtitle: "Отпусти шар — множитель зависит от выбранной лунки.", caption: "9 лунок · множители до ×8", start: "Бросить шар" }
  };
  const PLINKO = [8, 4, 2, 1, 0.5, 1, 2, 4, 8];
  const RED = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
  const $ = (selector, parent) => (parent || document).querySelector(selector);
  const $$ = (selector, parent) => Array.from((parent || document).querySelectorAll(selector));
  const el = {
    balance: $("#balanceValue"), currency: $("#currencySelect"), profileBalance: $("#profileBalance"),
    profileCurrency: $("#profileCurrencyNote"), bet: $("#betInput"), betCurrency: $("#betCurrency"),
    betHelp: $("#betHelp"), minBet: $("#minBetValue"), title: $("#gameTitle"), subtitle: $("#gameSubtitle"),
    board: $("#gameBoard"), caption: $("#boardCaption"), message: $("#gameMessage"), badge: $("#roundBadge"),
    multiplier: $("#multiplierValue"), primary: $("#primaryAction"), cashout: $("#cashoutButton"),
    playPanel: $("#playPanel"), minesOptions: $("#minesOptions"), rouletteOptions: $("#rouletteOptions"), rocketOptions: $("#rocketOptions"),
    planeStats: $("#planeStats"), planeFlightStrip: $("#planeFlightStrip"), planeHeight: $("#planeHeight"), planeDistance: $("#planeDistance"), planeMultiplier: $("#planeMultiplier"),
    plinkoOptions: $("#plinkoOptions"), history: $("#historyList"), rounds: $("#roundsPlayed"),
    wins: $("#winsPlayed"), net: $("#sessionNet"), toast: $("#toast"), bonus: $("#claimBonus"),
    bonusState: $("#bonusState"), soundToggle: $("#soundToggle"), caseGrid: $("#caseGrid"),
    caseReveal: $("#caseReveal"), caseRevealTitle: $("#caseRevealTitle"), caseReels: $("#caseReels"), caseSpin: $("#caseSpinButton"),
    caseResults: $("#caseRollResults"), caseLoot: $("#caseLootTable"), caseCost: $("#caseRollCost"), caseTicket: $("#caseRevealTicket"),
    inventory: $("#profileInventory"), upgradePicker: $("#upgradePicker"), upgradePickerGrid: $("#upgradePickerGrid"), upgradeResult: $("#upgradeResult"),
    upgradeResultTitle: $("#upgradeResultTitle"), upgradeResultCard: $("#upgradeResultCard"), planeBetRoller: $("#planeBetRoller"), planeBetValue: $("#planeBetValue")
  };
  const initialState = () => ({
    balanceRub: START_BALANCE, currency: "RUB", betRub: 500, mineCount: 3, rouletteColor: "red",
    history: [], roundsPlayed: 0, winsPlayed: 0, netRub: 0, bonusClaimedDate: "", soundEnabled: true, inventory: []
  });

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved || typeof saved !== "object") return initialState();
      const fresh = initialState();
      const merged = Object.assign(fresh, saved);
      const untouchedOldDefault = Number(saved.balanceRub) === 50000
        && Number(saved.roundsPlayed || 0) === 0
        && Number(saved.winsPlayed || 0) === 0
        && (!Array.isArray(saved.history) || saved.history.length === 0)
        && (!Array.isArray(saved.inventory) || saved.inventory.length === 0);
      merged.balanceRub = untouchedOldDefault
        ? START_BALANCE
        : Number.isFinite(Number(saved.balanceRub)) ? Math.max(0, Number(saved.balanceRub)) : START_BALANCE;
      merged.betRub = Number.isFinite(Number(saved.betRub)) && Number(saved.betRub) >= MIN_BET ? Number(saved.betRub) : 500;
      merged.currency = CURRENCIES[saved.currency] ? saved.currency : "RUB";
      merged.mineCount = [3, 5, 8].includes(Number(saved.mineCount)) ? Number(saved.mineCount) : 3;
      merged.rouletteColor = saved.rouletteColor === "black" ? "black" : "red";
      merged.history = Array.isArray(saved.history) ? saved.history.slice(0, 30) : [];
      merged.roundsPlayed = Number.isFinite(Number(saved.roundsPlayed)) ? Math.max(0, Number(saved.roundsPlayed)) : 0;
      merged.winsPlayed = Number.isFinite(Number(saved.winsPlayed)) ? Math.max(0, Number(saved.winsPlayed)) : 0;
      merged.netRub = Number.isFinite(Number(saved.netRub)) ? Number(saved.netRub) : 0;
      merged.bonusClaimedDate = typeof saved.bonusClaimedDate === "string" ? saved.bonusClaimedDate : "";
      merged.soundEnabled = saved.soundEnabled === true;
      merged.inventory = Array.isArray(saved.inventory) ? saved.inventory.filter((item) => item && typeof item.name === "string" && Number(item.priceRub) > 0).slice(0, 100) : [];
      return merged;
    } catch { return initialState(); }
  }

  let state = loadState();
  let activeGame = "mines";
  let mineRound = null;
  let rocketRound = null;
  let planeRound = null;
  let rocketTimer = null;
  let planeTimer = null;
  let rouletteTimer = null;
  let plinkoTimer = null;
  let rouletteBusy = false;
  let plinkoBusy = false;
  let toastTimer = null;
  let currentMultiplier = 1;
  let currentCaseCategory = "cs2";
  let caseOpenBusy = false;
  let caseOpenTimer = null;
  let planeSpawnTimer = null;
  let planeCheckpointTimer = null;
  let caseCount = 1;
  let selectedCase = null;
  let upgradeSource = null;
  let upgradeTarget = null;
  let upgradeChance = 47.5;
  let upgradeBusy = false;
  let upgradeResultItem = null;
  let upgradeRoundTimer = null;
  let upgradePickerCategory = "cs2";
  let upgradePickerMode = "source";
  let upgradeTargetManual = false;
  let upgradeTargetIndex = 0;
  let casePendingRewards = [];

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* demo continues without storage */ }
  }
  function numberFormat(value, digits) {
    return new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: digits == null ? 2 : digits }).format(value);
  }
  function money(rubles) {
    const currency = CURRENCIES[state.currency] || CURRENCIES.RUB;
    return numberFormat(Number(rubles) / currency.rate, currency.digits) + " " + currency.symbol;
  }
  function displayedBet(rubles) {
    const currency = CURRENCIES[state.currency];
    return numberFormat(Number(rubles) / currency.rate, currency.digits);
  }
  function parseBetAmount(value) {
    const normalized = String(value).trim().replace(/\s/g, "").replace(/,/g, ".");
    return normalized ? Number(normalized) : NaN;
  }
  function multiplier(value) { return "×" + numberFormat(value, 2); }
  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  function localDateKey() {
    const date = new Date();
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }
  function setToast(message, tone) {
    clearTimeout(toastTimer);
    el.toast.textContent = message;
    el.toast.className = "toast" + (tone ? " is-" + tone : "");
    el.toast.hidden = false;
    toastTimer = setTimeout(() => { el.toast.hidden = true; }, 3000);
  }
  function setBadge(label, status) {
    el.badge.textContent = label;
    el.badge.className = "round-badge" + (status ? " is-" + status : "");
  }
  function setMultiplier(value) {
    currentMultiplier = Number(value) || 1;
    el.multiplier.textContent = multiplier(currentMultiplier);
  }
  function isBusy() {
    return Boolean((mineRound && mineRound.active) || rocketRound || planeRound || rouletteBusy || plinkoBusy || upgradeBusy || caseOpenBusy);
  }
  function renderBetValidation() {
    const raw = parseBetAmount(el.bet.value);
    const rub = Number.isFinite(raw) ? raw * CURRENCIES[state.currency].rate : 0;
    const invalid = !Number.isFinite(raw) || raw <= 0 || rub < MIN_BET;
    const tooLarge = rub > state.balanceRub;
    el.betHelp.classList.toggle("is-error", invalid || tooLarge);
    if (invalid) el.betHelp.innerHTML = "Минимальная ставка — <span id=\"minBetValue\">" + money(MIN_BET) + "</span>.";
    else if (tooLarge) el.betHelp.textContent = "Ставка выше доступного демо-баланса.";
    else el.betHelp.innerHTML = "Мин. <span id=\"minBetValue\">" + money(MIN_BET) + "</span> · макс. по балансу";
    const planeLanding = activeGame === "plane" && Boolean(planeRound);
    el.primary.disabled = (isBusy() && !planeLanding) || (!planeLanding && (invalid || tooLarge));
    $$(".case-open").forEach((button) => { button.disabled = isBusy() || caseOpenBusy; });
  }
  function renderBonusState() {
    const claimed = state.bonusClaimedDate === localDateKey();
    el.bonus.disabled = claimed;
    el.bonus.textContent = claimed ? "Бонус уже забран" : "Забрать демо-бонус";
    el.bonusState.textContent = claimed ? "Сегодняшний демо-бонус уже получен." : "Бонус доступен сегодня";
  }
  function renderHistory() {
    if (!state.history.length) {
      el.history.innerHTML = '<p class="empty-state">Здесь появятся результаты первых раундов.</p>';
      return;
    }
    el.history.innerHTML = state.history.slice(0, 12).map((item) => {
      const bet = Number(item.betRub) || 0;
      const payout = Number(item.payoutRub) || 0;
      const won = payout > bet;
      const date = new Date(item.time);
      const time = Number.isNaN(date.getTime()) ? "сессия" : date.toLocaleString("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
      const result = won ? "+" + money(payout - bet) : "−" + money(bet);
      return '<article class="history-row"><div class="history-row__game">' +
        '<span class="history-dot ' + (won ? "is-win" : "is-loss") + '" aria-hidden="true"></span>' +
        '<span><strong>' + escapeText(item.game) + '</strong><small>' + escapeText(time) + " · " + (won ? "раунд завершён с выигрышем" : "ставка сгорела") + '</small></span></div>' +
        '<span class="history-row__stake">ставка ' + money(bet) + '</span>' +
        '<strong class="history-row__result ' + (won ? "" : "is-loss") + '">' + result + "</strong></article>";
    }).join("");
  }
  function renderStats() {
    el.rounds.textContent = numberFormat(state.roundsPlayed, 0);
    el.wins.textContent = numberFormat(state.winsPlayed, 0);
    el.net.textContent = money(state.netRub);
    renderHistory();
  }
  function renderPlaneBetRoller() {
    if (!el.planeBetValue) return;
    el.planeBetValue.textContent = money(state.betRub);
  }
  function renderInventory() {
    if (!el.inventory) return;
    if (!state.inventory.length) {
      el.inventory.innerHTML = '<p class="empty-state">Инвентарь пуст. Открой кейс, чтобы получить предмет.</p>';
      return;
    }
    el.inventory.innerHTML = state.inventory.map((item) => '<article class="inventory-item rarity-' + escapeText(item.rarity || "common") + '">' +
      '<img src="' + escapeText(item.image || "assets/telegram-giftbox.webp") + '" alt="" loading="lazy">' +
      '<div class="inventory-item__copy"><strong>' + escapeText(item.name) + '</strong><span>' + money(item.priceRub) + '</span></div>' +
      '<div class="inventory-item__actions"><button type="button" data-inventory-upgrade="' + escapeText(item.instanceId) + '">Апгрейд</button><button type="button" data-inventory-sell="' + escapeText(item.instanceId) + '">Продать</button></div></article>').join("");
  }
  function renderWallet() {
    el.balance.textContent = money(state.balanceRub);
    el.profileBalance.textContent = money(state.balanceRub);
    el.profileCurrency.textContent = "Снимок курса 22.11.2026: 1 USDT ≈ 81,35 ₽ · 1 GRAM ≈ 79,87 ₽. " +
      numberFormat(START_BALANCE) + " ₽ ≈ " + numberFormat(START_BALANCE / CURRENCIES.USDT.rate, 2) + " USDT или " + numberFormat(START_BALANCE / CURRENCIES.GRAM.rate, 2) + " GRAM.";
    el.currency.value = state.currency;
    el.betCurrency.textContent = CURRENCIES[state.currency].symbol;
    if ($("#upgradeCashCurrency")) $("#upgradeCashCurrency").textContent = CURRENCIES[state.currency].symbol;
    el.minBet.textContent = money(MIN_BET);
    el.bet.value = displayedBet(state.betRub);
    el.bet.step = state.currency === "RUB" ? "1" : "0.01";
    $$("[data-bet-rub]").forEach((button) => { button.textContent = money(Number(button.dataset.betRub)); });
    renderBetValidation();
    renderStats();
    renderBonusState();
    renderSoundToggle();
    renderInventory();
    renderPlaneBetRoller();
  }
  function addHistory(game, bet, payout) {
    state.roundsPlayed += 1;
    if (payout > bet) state.winsPlayed += 1;
    state.netRub += payout - bet;
    state.history.unshift({ game: game, betRub: bet, payoutRub: payout, time: new Date().toISOString() });
    state.history = state.history.slice(0, 30);
    saveState();
    renderWallet();
  }
  function currentBet(showMessage) {
    const amount = parseBetAmount(el.bet.value);
    const rub = amount * CURRENCIES[state.currency].rate;
    if (!Number.isFinite(rub) || rub < MIN_BET) {
      if (showMessage) setToast("Минимальная ставка — " + money(MIN_BET) + ".", "error");
      renderBetValidation();
      return null;
    }
    if (rub > state.balanceRub) {
      if (showMessage) setToast("На виртуальном балансе не хватает средств для этой ставки.", "error");
      renderBetValidation();
      return null;
    }
    state.betRub = rub;
    saveState();
    return rub;
  }
  function setPrimaryLabel(label, arrow) {
    const icon = activeGame === "plane"
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-' + (planeRound ? "stop" : "play") + '"></use></svg>'
      : arrow === false ? "" : '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-arrow"></use></svg>';
    el.primary.innerHTML = escapeText(label) + icon;
    el.primary.setAttribute("aria-label", label);
  }

  function renderSoundToggle() {
    el.soundToggle.setAttribute("aria-pressed", String(state.soundEnabled));
    el.soundToggle.setAttribute("aria-label", state.soundEnabled ? "Выключить звуки" : "Включить звуки");
    el.soundToggle.setAttribute("title", state.soundEnabled ? "Звуки включены" : "Звуки выключены");
    el.soundToggle.classList.toggle("is-on", state.soundEnabled);
    const icon = $("use", el.soundToggle);
    if (icon) icon.setAttribute("href", state.soundEnabled ? "#icon-sound-on" : "#icon-sound-off");
    const label = $("span", el.soundToggle);
    if (label) label.textContent = state.soundEnabled ? "Звук вкл." : "Звук выкл.";
  }

  function playSound(kind) {
    if (!state.soundEnabled) return;
    const sources = { click: "ui-click.ogg", select: "ui-select.ogg", win: "ui-success.ogg", loss: "ui-error.ogg", tick: "ui-tick.ogg", launch: "ui-select.ogg", case: "ui-tick.ogg", explosion: "explosion.wav" };
    try {
      const audio = new Audio("assets/audio/" + (sources[kind] || sources.click));
      audio.volume = kind === "explosion" ? 0.32 : 0.22;
      audio.play().catch(() => {});
    } catch { /* Sound files are optional in the local demo. */ }
  }

  function renderMinesBoard() {
    if (!mineRound) {
      el.board.innerHTML = Array.from({ length: 25 }, (_, index) => '<button class="mine-tile" type="button" data-cell="' + index + '" aria-label="Закрытая плитка ' + (index + 1) + '" disabled></button>').join("");
      return;
    }
    el.board.innerHTML = Array.from({ length: 25 }, (_, index) => {
      const safe = mineRound.safe.has(index);
      const mine = mineRound.revealAll && mineRound.mines.has(index);
      const wasHit = mineRound.hitIndex === index;
      const disabled = !mineRound.active || safe || mineRound.revealAll;
      let className = "mine-tile";
      let icon = "";
      if (safe) {
        className += " is-safe";
        icon = '<svg viewBox="0 0 48 48" aria-hidden="true"><use href="#icon-gem"></use></svg>';
      } else if (mine) {
        className += " is-mine" + (wasHit ? "" : " is-muted");
        icon = '<svg viewBox="0 0 48 48" aria-hidden="true"><use href="#icon-bomb"></use></svg>';
      }
      const label = safe ? "Кристалл " + (index + 1) : mine ? "Мина " + (index + 1) : "Закрытая плитка " + (index + 1);
      return '<button class="' + className + '" type="button" data-cell="' + index + '" aria-label="' + label + '"' + (disabled ? " disabled" : "") + ">" + icon + "</button>";
    }).join("");
  }
  function renderPlinkoBoard() {
    const pegs = [];
    for (let row = 0; row < 8; row += 1) {
      for (let column = 0; column <= row; column += 1) {
        const left = 50 + (column - row / 2) * 11.8;
        const top = 12 + row * 9.7;
        pegs.push('<span class="plinko-peg" style="left:' + left + "%;top:" + top + '%" aria-hidden="true"></span>');
      }
    }
    const buckets = PLINKO.map((value, index) => '<span data-bucket="' + index + '">×' + numberFormat(value, 1) + "</span>").join("");
    el.board.innerHTML = '<div class="plinko-board" aria-label="Доска Плинко">' + pegs.join("") +
      '<span class="plinko-ball" id="plinkoBall" aria-hidden="true"></span>' +
      '<div class="plinko-buckets" aria-label="Возможные множители">' + buckets + "</div></div>";
  }
  function updatePlaneStats(height, distance, value) {
    if (!el.planeStats) return;
    el.planeHeight.textContent = numberFormat(height, 1) + " м";
    el.planeDistance.textContent = numberFormat(distance, 1) + " м";
    el.planeMultiplier.textContent = "×" + numberFormat(value, 1);
  }
  function renderUpgradeBoard() {
    const source = upgradeSource;
    const target = upgradeTarget;
    const slot = (item, side) => item
      ? '<button class="upgrade-slot" type="button" data-upgrade-' + side + '-slot>' +
        '<img src="' + escapeText(item.image || "assets/telegram-giftbox.webp") + '" alt="">' +
        '<span class="upgrade-slot__copy"><strong>' + escapeText(item.name) + '</strong><small>' + (side === "source" ? "Ставка из инвентаря" : "Цель апгрейда") + '</small><span>' + money(item.priceRub) + '</span></span><span class="upgrade-slot__plus">' + (side === "source" ? "↻" : "+") + '</span></button>'
      : '<button class="upgrade-slot is-empty" type="button" data-upgrade-' + side + '-slot><span class="upgrade-slot__plus">+</span><span>' + (side === "source" ? "Выбрать предмет" : "Цель по множителю") + '</span></button>';
    el.board.innerHTML = '<div class="upgrade-machine">' +
      '<div class="upgrade-picks"><p class="upgrade-pick-title">Выбери предмет и цель</p>' + slot(source, "source") + '<span class="upgrade-connector" aria-hidden="true">+</span>' + slot(target, "target") + '</div>' +
      '<div class="upgrade-wheel-row" id="upgradeWheelRow"><div><div class="upgrade-wheel-wrap"><div class="upgrade-wheel" id="upgradeWheel"><div class="upgrade-wheel__hub"><strong id="upgradeChanceValue">' + numberFormat(upgradeChance, 1) + '%</strong><span>ШАНС</span></div></div><div class="upgrade-pointer-arm" id="upgradePointerArm" aria-hidden="true"><span class="upgrade-pointer"></span></div></div><div class="upgrade-target-value">Ценность цели <strong id="upgradeTargetValue">' + money(target ? target.priceRub : 0) + '</strong></div></div>' +
      '<div class="upgrade-controls"><div class="upgrade-multiplier-line"><span>Множитель</span><strong id="upgradeMultiplierValue">×' + numberFormat(upgradeX, 1) + '</strong></div>' +
      '<input class="upgrade-range" id="upgradeRange" type="range" min="0" max="0" step="1" value="' + upgradeTargetIndex + '" aria-label="Выбор цели апгрейда">' +
      '<div class="upgrade-range-labels"><span>Цель 1</span><span>Цель 1</span></div>' +
      '<p class="upgrade-target-hint" id="upgradeTargetName">' + (target ? escapeText(target.name) : "Цель появится после выбора предмета") + '</p>' +
      '<button class="button button--primary upgrade-action" type="button" data-upgrade-spin' + (source && target && !upgradeBusy ? "" : " disabled") + '>Апгрейдировать <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-arrow"/></svg></button></div></div></div>';
    updateUpgradeTarget();
  }
  let upgradeX = 2;
  function upgradeCategory(item) {
    if (item.category === "balance" || item.type === "balance") return "balance";
    if (item.type === "cs2") return "cs2";
    return "gifts";
  }
  function upgradeItems() {
    const cases = window.JESTER_CASES || [];
    const items = new Map();
    cases.flatMap((item) => item.rewards).filter((item) => item.image).forEach((item) => {
      if (!items.has(item.id)) items.set(item.id, { ...item, category: upgradeCategory(item) });
    });
    [250, 500, 100, 2500, 5000, 1000, 10000, 25000, 50000].forEach((value) => {
      if (![...items.values()].some((item) => upgradeCategory(item) === "balance" && item.priceRub === value)) {
        items.set("upgrade-balance-" + value, { id: "upgrade-balance-" + value, name: "Демо-баланс · " + value + " ₽", type: "balance", priceRub: value, priceLabel: value + " ₽", chance: 0, rarity: value >= 10000 ? "legendary" : value >= 1000 ? "epic" : "common", image: "assets/balance-chip.svg", source: "JesterUp", category: "balance" });
      }
    });
    return [...items.values()];
  }
  function upgradeTargetOptions() {
    if (!upgradeSource) return [];
    const category = upgradeCategory(upgradeSource);
    const sourceRub = Number(upgradeSource.priceRub);
    const minRub = sourceRub * 2;
    const maxRub = sourceRub * 100;
    const candidates = upgradeItems().filter((item) => item.category === category && item.priceRub >= minRub && item.priceRub <= maxRub);
    if (category === "balance") {
      [2, 2.5, 3, 4, 5, 7.5, 10, 15, 20, 25, 50, 100].forEach((multiplier) => {
        const value = Math.round(sourceRub * multiplier * 100) / 100;
        if (value < minRub || value > maxRub) return;
        candidates.push({ id: "upgrade-cash-" + upgradeSource.instanceId + "-" + String(multiplier).replace(".", "-"), name: "Демо-баланс · " + money(value), type: "balance", category: "balance", priceRub: value, priceLabel: money(value), image: "assets/balance-chip.svg", rarity: "common", source: "JesterUp" });
      });
    }
    const seen = new Set();
    return candidates.filter((item) => {
      const key = category === "balance" ? String(Math.round(item.priceRub * 100)) : item.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a, b) => a.priceRub - b.priceRub || a.name.localeCompare(b.name, "ru"));
  }
  function updateUpgradeTarget() {
    if (!upgradeSource || activeGame !== "upgrader") return;
    const options = upgradeTargetOptions();
    let selectedIndex = upgradeTargetManual && upgradeTarget ? options.findIndex((item) => item.id === upgradeTarget.id) : -1;
    if (selectedIndex < 0) {
      upgradeTargetManual = false;
      selectedIndex = options.length ? Math.max(0, Math.min(options.length - 1, upgradeTargetIndex)) : -1;
      upgradeTarget = selectedIndex >= 0 ? options[selectedIndex] : null;
    }
    upgradeTargetIndex = Math.max(0, selectedIndex);
    upgradeX = upgradeTarget ? upgradeTarget.priceRub / upgradeSource.priceRub : 2;
    upgradeChance = upgradeTarget ? Math.min(95, 95 / upgradeX) : 0;
    const range = $("#upgradeRange");
    const labels = $$(".upgrade-range-labels span");
    const targetButton = $("[data-upgrade-target-slot]");
    const chance = $("#upgradeChanceValue");
    const xLabel = $("#upgradeMultiplierValue");
    const name = $("#upgradeTargetName");
    const value = $("#upgradeTargetValue");
    const wheel = $("#upgradeWheel");
    const action = $("[data-upgrade-spin]");
    if (range) {
      range.max = String(Math.max(0, options.length - 1));
      range.value = String(upgradeTargetIndex);
      range.disabled = options.length < 2;
    }
    if (labels.length) {
      const ratioLabel = (item) => item ? "×" + numberFormat(item.priceRub / upgradeSource.priceRub, 2) : "Нет целей";
      labels[0].textContent = ratioLabel(options[0]);
      labels[1].textContent = ratioLabel(options[options.length - 1]);
    }
    if (chance) chance.textContent = numberFormat(upgradeChance, 1) + "%";
    if (xLabel) xLabel.textContent = "×" + numberFormat(upgradeX, 2);
    if (name) name.textContent = upgradeTarget ? upgradeTarget.name : "Нет цели для этого предмета";
    if (value) value.textContent = money(upgradeTarget ? upgradeTarget.priceRub : 0);
    if (wheel) wheel.style.setProperty("--chance-deg", (upgradeChance * 3.6) + "deg");
    if (targetButton && upgradeTarget) targetButton.outerHTML = '<button class="upgrade-slot" type="button" data-upgrade-target-slot><img src="' + escapeText(upgradeTarget.image) + '" alt=""><span class="upgrade-slot__copy"><strong>' + escapeText(upgradeTarget.name) + '</strong><small>Цель апгрейда</small><span>' + money(upgradeTarget.priceRub) + '</span></span><span class="upgrade-slot__plus">+</span></button>';
    if (action) action.disabled = !upgradeSource || !upgradeTarget || upgradeBusy;
  }
  function renderPlaneBoard() {
    const carriers = Array.from({ length: 7 }, (_, index) => '<span class="plane-carrier-wrap"><img src="assets/carrier-sprite.png" alt="" loading="lazy">' + (index % 2 ? '<img class="plane-carrier-jet" src="assets/carrier-jet-sprite.png" alt="" loading="lazy">' : "") + '</span>').join("");
    el.board.innerHTML = '<div class="plane-scene" id="planeScene"><div class="plane-horizon"></div><div class="plane-ocean"></div>' +
      '<span class="plane-cloud"></span><span class="plane-cloud"></span><span class="plane-route-title">МАРШРУТ НАД МОРЕМ</span>' +
      '<span class="plane-flight-badge" id="planeSceneMark">JESTERUP · DEMO</span><div class="plane-carrier-belt" id="planeCarrierBelt">' + carriers + '</div>' +
      '<div class="plane-event-layer" id="planeEventLayer"></div><div class="plane-aircraft" id="planeAircraft"><img src="assets/jet-fighter-concept.png" alt="Самолёт JesterUp"></div>' +
      '<img class="plane-hit-flash" id="planeHitFlash" src="assets/plane-small-explosion.png" alt=""></div>';
    updatePlaneStats(0, 0, 1);
  }
  function renderBoard() {
    el.board.className = "game-board game-board--" + activeGame;
    if (activeGame === "mines") {
      renderMinesBoard();
    } else if (activeGame === "upgrader") {
      renderUpgradeBoard();
    } else if (activeGame === "roulette") {
      el.board.innerHTML = '<div class="roulette-pointer" aria-hidden="true"></div>' +
        '<div class="roulette-wheel" id="rouletteWheel" role="img" aria-label="Колесо демо-рулетки"><div class="roulette-wheel__hub">J</div></div>' +
        '<span class="roulette-result" id="rouletteResult">Ожидает ставку</span>';
    } else if (activeGame === "rocket") {
      el.board.innerHTML = '<div class="rocket-scene" id="rocketScene"><div class="rocket-scene__canvas"><video muted playsinline loop preload="metadata" poster="assets/rocket-cover.webp" aria-label="Анимированная ракета"><source src="assets/rocket-launch.mp4" type="video/mp4"></video></div><span class="rocket-scene__label" id="rocketSceneLabel">JESTERUP · DEMO</span></div>';
    } else if (activeGame === "plane") {
      renderPlaneBoard();
    } else {
      renderPlinkoBoard();
    }
  }

  function changeGame(key) {
    if (!GAMES[key]) return;
    if (isBusy() && key !== activeGame) { setToast("Сначала заверши текущий раунд.", "error"); return; }
    if (key === activeGame && !el.playPanel.hidden) return;
    clearInterval(rocketTimer);
    rocketTimer = null;
    activeGame = key;
    el.playPanel.hidden = false;
    el.playPanel.classList.toggle("is-plane-mode", key === "plane");
    el.playPanel.classList.toggle("is-upgrader-mode", key === "upgrader");
    const game = GAMES[key];
    el.title.textContent = game.title;
    el.subtitle.textContent = game.subtitle;
    el.caption.textContent = game.caption;
    el.message.textContent = key === "mines"
      ? "Выбери ставку и нажми «Начать игру»."
      : key === "rocket"
        ? "Полёт начнётся после подтверждения виртуальной ставки."
        : key === "plane"
          ? "Рейс начинается над морем. Подбирай бонусы и посади самолёт до падения в воду."
        : key === "upgrader"
          ? "Выбери предмет из инвентаря — цель и шанс меняются вместе с множителем."
        : key === "roulette"
          ? "Выбери цвет, установи ставку и крути."
          : "Выбери ставку и отправь шар по доске.";
    if (key === "mines" && mineRound && !mineRound.active) mineRound = null;
    setMultiplier(1);
    setBadge("Раунд не начат");
    el.cashout.hidden = key !== "mines" && key !== "rocket";
    el.cashout.disabled = true;
    el.cashout.textContent = "Забрать ×1,00";
    el.minesOptions.classList.toggle("option-row--hidden", key !== "mines");
    el.rouletteOptions.classList.toggle("option-row--hidden", key !== "roulette");
    el.rocketOptions.classList.toggle("option-row--hidden", key !== "rocket");
    el.plinkoOptions.classList.toggle("option-row--hidden", key !== "plinko");
    el.planeStats.hidden = key !== "plane";
    el.planeFlightStrip.hidden = key !== "plane";
    el.planeBetRoller.hidden = key !== "plane";
    setPrimaryLabel(game.start);
    $$(".game-tile").forEach((tile) => {
      const selected = tile.dataset.game === key;
      tile.classList.toggle("is-current", selected);
      tile.setAttribute("aria-pressed", String(selected));
    });
    renderBoard();
    renderBetValidation();
    if (key === "plane") el.board.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function changeMines(value) {
    if (isBusy()) { setToast("Количество мин можно менять между раундами.", "error"); return; }
    state.mineCount = value;
    $$("[data-mines]").forEach((button) => {
      const selected = Number(button.dataset.mines) === value;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    saveState();
  }
  function mineMultiplier(safeCount, mineCount) {
    let survival = 1;
    for (let opened = 0; opened < safeCount; opened += 1) survival *= (25 - mineCount - opened) / (25 - opened);
    return Math.max(1.01, 0.96 / survival);
  }
  function startMines() {
    const bet = currentBet(true);
    if (bet === null) return;
    state.balanceRub -= bet;
    playSound("launch");
    const mines = new Set();
    while (mines.size < state.mineCount) mines.add(Math.floor(Math.random() * 25));
    mineRound = { active: true, betRub: bet, mines: mines, safe: new Set(), mineCount: state.mineCount, hitIndex: null, revealAll: false };
    setMultiplier(1);
    setBadge("Раунд идёт", "playing");
    el.message.textContent = "Ставка списана. Открой безопасную плитку или забери выигрыш после первого кристалла.";
    el.cashout.disabled = true;
    el.cashout.textContent = "Забрать " + money(bet);
    setPrimaryLabel("Игра идёт", false);
    el.primary.disabled = true;
    renderMinesBoard();
    renderWallet();
    saveState();
  }
  function clickMine(index) {
    if (!mineRound || !mineRound.active || mineRound.safe.has(index)) return;
    if (mineRound.mines.has(index)) {
      playSound("loss");
      mineRound.active = false;
      mineRound.revealAll = true;
      mineRound.hitIndex = index;
      el.cashout.disabled = true;
      el.primary.disabled = false;
      setPrimaryLabel("Новый раунд");
      setMultiplier(1);
      setBadge("Мина найдена", "loss");
      el.message.textContent = "Раунд завершён. Виртуальная ставка " + money(mineRound.betRub) + " списана с демо-баланса.";
      renderMinesBoard();
      addResult(GAMES.mines.title, mineRound.betRub, 0);
      return;
    }
    mineRound.safe.add(index);
    playSound("click");
    const value = mineMultiplier(mineRound.safe.size, mineRound.mineCount);
    setMultiplier(value);
    el.cashout.disabled = false;
    el.cashout.textContent = "Забрать " + money(mineRound.betRub * value);
    el.message.textContent = "Кристалл найден. Можно продолжить или забрать " + money(mineRound.betRub * value) + ".";
    renderMinesBoard();
    if (mineRound.safe.size >= 25 - mineRound.mineCount) cashOutMines();
  }
  function cashOutMines() {
    if (!mineRound || !mineRound.active || mineRound.safe.size < 1) return;
    const payout = mineRound.betRub * currentMultiplier;
    mineRound.active = false;
    state.balanceRub += payout;
    el.cashout.disabled = true;
    el.primary.disabled = false;
    setPrimaryLabel("Новый раунд");
    setBadge("Выигрыш забран", "win");
    el.message.textContent = "Забрано " + money(payout) + " · чистый результат " + money(payout - mineRound.betRub) + ".";
    renderMinesBoard();
    addResult(GAMES.mines.title, mineRound.betRub, payout);
    playSound("win");
  }
  function addResult(game, bet, payout) {
    state.roundsPlayed += 1;
    if (payout > bet) state.winsPlayed += 1;
    state.netRub += payout - bet;
    state.history.unshift({ game: game, betRub: bet, payoutRub: payout, time: new Date().toISOString() });
    state.history = state.history.slice(0, 30);
    saveState();
    renderWallet();
  }

  function rouletteColor(number) {
    return number === 0 ? "green" : RED.has(number) ? "red" : "black";
  }
  function setRouletteColor(color) {
    if (isBusy()) return;
    state.rouletteColor = color;
    $$("[data-color]").forEach((button) => {
      const selected = button.dataset.color === color;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    saveState();
  }
  function spinRoulette() {
    const bet = currentBet(true);
    if (bet === null || rouletteBusy) return;
    rouletteBusy = true;
    playSound("launch");
    state.balanceRub -= bet;
    el.primary.disabled = true;
    el.cashout.hidden = true;
    setPrimaryLabel("Колесо вращается", false);
    setBadge("Раунд идёт", "playing");
    el.message.textContent = "Ставка " + money(bet) + " принята в виртуальном раунде.";
    const wheel = $("#rouletteWheel");
    const result = $("#rouletteResult");
    const number = Math.floor(Math.random() * 37);
    const color = rouletteColor(number);
    wheel.style.transform = "rotate(" + (1440 + Math.floor(Math.random() * 360) + number * 7) + "deg)";
    result.textContent = "Колесо вращается";
    result.className = "roulette-result";
    renderWallet();
    saveState();
    rouletteTimer = setTimeout(() => {
      const won = color === state.rouletteColor;
      const payout = won ? bet * 2 : 0;
      state.balanceRub += payout;
      rouletteBusy = false;
      result.textContent = number + " · " + (color === "red" ? "красное" : color === "black" ? "чёрное" : "ноль");
      result.className = "roulette-result is-" + color;
      setBadge(won ? "Выигрыш забран" : "Раунд завершён", won ? "win" : "loss");
      el.message.textContent = won
        ? "Совпало: " + number + " " + (color === "red" ? "красное" : "чёрное") + ". Выплата " + money(payout) + "."
        : "Выпало " + number + " " + (color === "red" ? "красное" : color === "black" ? "чёрное" : "зелёное") + " — ставка списана.";
      setPrimaryLabel("Крутить снова");
      el.primary.disabled = false;
      addResult(GAMES.roulette.title, bet, payout);
      playSound(won ? "win" : "loss");
    }, 1700);
  }

  function launchRocket() {
    const bet = currentBet(true);
    if (bet === null || rocketRound) return;
    state.balanceRub -= bet;
    playSound("launch");
    rocketRound = { betRub: bet, startTime: performance.now(), crashAt: 1.12 + Math.pow(Math.random(), 1.35) * 4.2 };
    $("#rocketScene").classList.add("is-flying");
    const rocketVideo = $("#rocketScene video");
    if (rocketVideo) rocketVideo.play().catch(() => {});
    el.primary.disabled = true;
    el.cashout.hidden = false;
    el.cashout.disabled = false;
    el.cashout.textContent = "Забрать ×1,00";
    el.message.textContent = "Ракета летит. Забери множитель до завершения полёта.";
    setBadge("Ракета в полёте", "playing");
    setMultiplier(1);
    renderWallet();
    saveState();
    rocketTimer = setInterval(() => {
      if (!rocketRound) return;
      const value = Math.exp((performance.now() - rocketRound.startTime) / 3900);
      setMultiplier(value);
      const label = $("#rocketSceneLabel");
      if (label) label.textContent = multiplier(value);
      el.cashout.textContent = "Забрать " + money(rocketRound.betRub * value);
      if (value >= rocketRound.crashAt) crashRocket();
    }, 75);
  }
  function crashRocket() {
    if (!rocketRound) return;
    const bet = rocketRound.betRub;
    clearInterval(rocketTimer);
    rocketTimer = null;
    rocketRound = null;
    const scene = $("#rocketScene");
    if (scene) { scene.classList.remove("is-flying"); scene.classList.add("is-crashed"); }
    const video = $("#rocketScene video");
    if (video) video.pause();
    el.cashout.disabled = true;
    el.primary.disabled = false;
    setPrimaryLabel("Запустить ещё раз");
    setBadge("Завершилось на " + multiplier(currentMultiplier), "loss");
    el.message.textContent = "Полёт завершён на " + multiplier(currentMultiplier) + ". Виртуальная ставка " + money(bet) + " списана.";
    addResult(GAMES.rocket.title, bet, 0);
    playSound("loss");
  }
  function cashOutRocket() {
    if (!rocketRound) return;
    const bet = rocketRound.betRub;
    const payout = bet * currentMultiplier;
    clearInterval(rocketTimer);
    rocketTimer = null;
    rocketRound = null;
    $("#rocketScene").classList.remove("is-flying");
    const video = $("#rocketScene video");
    if (video) video.pause();
    state.balanceRub += payout;
    el.cashout.disabled = true;
    el.primary.disabled = false;
    setPrimaryLabel("Запустить ещё раз");
    setBadge("Выигрыш забран", "win");
    el.message.textContent = "Выход на " + multiplier(currentMultiplier) + " · выплата " + money(payout) + ".";
    addResult(GAMES.rocket.title, bet, payout);
    playSound("win");
  }
  function stopPlane() {
    clearInterval(planeTimer);
    clearInterval(planeSpawnTimer);
    clearTimeout(planeCheckpointTimer);
    planeTimer = planeSpawnTimer = planeCheckpointTimer = null;
    const scene = $("#planeScene");
    if (scene) scene.classList.remove("is-flying", "is-hit");
  }
  function startPlane() {
    const bet = currentBet(true);
    if (bet === null || planeRound) return;
    state.balanceRub -= bet;
    planeRound = { betRub: bet, startTime: performance.now(), lastTime: performance.now(), altitude: 1.5, distance: 0, nextCarrier: 9.5, pickups: 0 };
    setMultiplier(1);
    updatePlaneStats(0, 0, 1);
    setBadge("Рейс начался", "playing");
    el.message.textContent = "Самолёт набирает скорость. Посади его на авианосец или продолжай полёт за бонусами.";
    el.primary.disabled = false;
    el.primary.classList.add("is-stop");
    el.cashout.hidden = true;
    setPrimaryLabel("Посадить самолёт", false);
    const scene = $("#planeScene");
    if (scene) scene.classList.add("is-flying");
    playSound("launch");
    renderWallet();
    saveState();
    planeTimer = setInterval(() => {
      if (!planeRound) return;
      const now = performance.now();
      const delta = Math.min(.12, (now - planeRound.lastTime) / 1000);
      planeRound.lastTime = now;
      const elapsed = (now - planeRound.startTime) / 1000;
      planeRound.altitude -= delta * 0.058;
      planeRound.distance += delta * 42;
      const value = Math.max(1, currentMultiplier + delta * 0.045);
      setMultiplier(value);
      updatePlaneStats(Math.max(0, planeRound.altitude) * 360, planeRound.distance, value);
      const mark = $("#planeSceneMark");
      const aircraft = $("#planeAircraft");
      if (mark) mark.textContent = "×" + numberFormat(value, 2) + " · " + Math.round(planeRound.distance) + " м";
      if (aircraft) aircraft.style.top = Math.max(20, Math.min(67, 66 - planeRound.altitude * 22)) + "%";
      if (planeRound.altitude <= .05) { crashPlane(); return; }
      if (elapsed >= planeRound.nextCarrier) {
        if (planeRound.altitude > .25) {
          finishPlane(planeRound.betRub * currentMultiplier, "win", "Мягкая посадка на авианосец · выплата " + money(planeRound.betRub * currentMultiplier) + ".");
          return;
        }
        planeRound.nextCarrier += 5.5;
        setToast("Самолёт пролетает низко над палубой.");
      }
    }, 70);
    planeSpawnTimer = setInterval(spawnPlaneEvent, 1850);
  }
  function spawnPlaneEvent() {
    if (!planeRound) return;
    const layer = $("#planeEventLayer");
    if (!layer) return;
    const r = Math.random();
    const event = r < .20 ? { kind: "bomb", label: "БОМБА" }
      : r < .48 ? { kind: "plus", label: "+1", value: 1 }
      : r < .69 ? { kind: "plus", label: "+2", value: 2 }
      : r < .75 ? { kind: "plus", label: "+15", value: 15 }
      : r < .91 ? { kind: "multiplier", label: "×2", value: 2 }
      : r < .925 ? { kind: "multiplier", label: "×100", value: 100 }
      : { kind: "blank", label: "" };
    if (event.kind === "blank") return;
    const scene = $("#planeScene");
    const sprite = document.createElement("span");
    sprite.className = "plane-event plane-event--" + (event.kind === "bomb" ? "bomb" : event.kind === "multiplier" ? "multiplier" : "plus");
    sprite.textContent = event.label;
    sprite.style.setProperty("--event-y", (40 + (Math.random() - .5) * 23) + "%");
    $("#planeEventLayer").appendChild(sprite);
    setTimeout(() => {
      if (!planeRound) { sprite.remove(); return; }
      sprite.remove();
      if (Math.random() > .82) return;
      if (event.kind === "bomb") {
        planeRound.altitude -= .62;
        if (scene) { scene.classList.remove("is-hit"); void scene.offsetWidth; scene.classList.add("is-hit"); }
        const flash = $("#planeHitFlash");
        if (flash) { flash.classList.remove("is-active"); void flash.offsetWidth; flash.classList.add("is-active"); }
        playSound("explosion");
        return;
      }
      planeRound.pickups += 1;
      currentMultiplier = event.kind === "plus" ? currentMultiplier + event.value : Math.min(10000, currentMultiplier * event.value);
      planeRound.altitude += event.kind === "plus" ? .32 + event.value * .025 : (event.value === 100 ? 1.2 : .48);
      setMultiplier(currentMultiplier);
      setBadge(event.label + " подобран", "win");
      playSound(event.kind === "multiplier" ? "win" : "select");
      setTimeout(() => { if (planeRound) setBadge("Рейс начался", "playing"); }, 700);
    }, 1090);
  }
  function finishPlane(payout, status, message) {
    if (!planeRound) return;
    const bet = planeRound.betRub;
    stopPlane();
    planeRound = null;
    state.balanceRub += payout;
    el.primary.classList.remove("is-stop");
    el.primary.disabled = false;
    setPrimaryLabel("Начать рейс");
    setBadge(status === "win" ? "Посадка выполнена" : "Рейс завершён", status);
    el.message.textContent = message;
    playSound(status === "win" ? "win" : "loss");
    addResult(GAMES.plane.title, bet, payout);
  }
  function landPlane() {
    if (!planeRound) return;
    const payout = planeRound.betRub * currentMultiplier;
    finishPlane(payout, "win", "Самолёт посажен на ×" + numberFormat(currentMultiplier, 2) + ". Выплата " + money(payout) + ".");
  }
  function crashPlane() {
    if (!planeRound) return;
    const bet = planeRound.betRub;
    const scene = $("#planeScene");
    if (scene) scene.classList.add("is-crashed");
    finishPlane(0, "loss", "Самолёт упал в воду между авианосцами. Ставка " + money(bet) + " списана.");
  }
  function randomBinomial(trials) {
    let result = 0;
    for (let i = 0; i < trials; i += 1) if (Math.random() < 0.5) result += 1;
    return result;
  }
  function dropPlinko() {
    const bet = currentBet(true);
    if (bet === null || plinkoBusy) return;
    plinkoBusy = true;
    playSound("launch");
    state.balanceRub -= bet;
    el.primary.disabled = true;
    el.cashout.hidden = true;
    setPrimaryLabel("Шар в пути", false);
    setBadge("Раунд идёт", "playing");
    el.message.textContent = "Шар отскакивает от штырьков — ждём его лунку.";
    const index = randomBinomial(8);
    const value = PLINKO[index];
    const ball = $("#plinkoBall");
    const buckets = $$(".plinko-buckets span");
    buckets.forEach((item) => item.classList.remove("is-hit"));
    requestAnimationFrame(() => {
      ball.classList.add("is-dropping");
      ball.style.left = (6 + index * 11) + "%";
    });
    renderWallet();
    saveState();
    plinkoTimer = setTimeout(() => {
      const payout = bet * value;
      state.balanceRub += payout;
      plinkoBusy = false;
      if (buckets[index]) buckets[index].classList.add("is-hit");
      setMultiplier(value);
      const won = payout > bet;
      setBadge(won ? "Выигрыш забран" : "Раунд завершён", won ? "win" : "loss");
      el.message.textContent = "Шар попал в ×" + numberFormat(value, 1) + ". Выплата " + money(payout) + ".";
      setPrimaryLabel("Бросить ещё раз");
      el.primary.disabled = false;
      addResult(GAMES.plinko.title, bet, payout);
      playSound(won ? "win" : "click");
    }, 1350);
  }

  function catalogCases(category) {
    return (window.JESTER_CASES || []).filter((item) => item.category === category);
  }
  const caseAnimationJson = new Map();
  const caseAnimationInstances = new Set();
  function stopCaseAnimations() {
    caseAnimationInstances.forEach((animation) => animation.destroy());
    caseAnimationInstances.clear();
  }
  async function startCaseAnimation(container) {
    if (!container || !container.dataset.giftAnimation || !window.lottie || !window.DecompressionStream) return;
    if (container.__caseAnimation) {
      container.__caseAnimation.play();
      return;
    }
    if (container.dataset.loadingAnimation) return;
    container.dataset.loadingAnimation = "true";
    try {
      const source = container.dataset.giftAnimation;
      let animationData = caseAnimationJson.get(source);
      if (!animationData) {
        const response = await fetch(source);
        if (!response.ok) throw new Error("Gift animation unavailable");
        const compressed = await response.arrayBuffer();
        const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("gzip"));
        animationData = JSON.parse(await new Response(stream).text());
        caseAnimationJson.set(source, animationData);
      }
      const animation = window.lottie.loadAnimation({
        container: container.querySelector(".case-collage__motion") || container,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData
      });
      container.__caseAnimation = animation;
      container.classList.add("is-animated");
      caseAnimationInstances.add(animation);
    } catch {
      container.dataset.animationFailed = "true";
    } finally {
      delete container.dataset.loadingAnimation;
    }
  }
  function renderCases(category) {
    currentCaseCategory = category;
    const categoryTitles = { cs2: "CS2 кейсы", gifts: "Telegram подарки и NFT" };
    $$('[data-case-category]').forEach((button) => {
      const selected = button.dataset.caseCategory === category;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    stopCaseAnimations();
    el.caseGrid.setAttribute("aria-labelledby", category === "cs2" ? "caseTabCs2" : "caseTabGifts");
    const cases = catalogCases(category);
    const groups = new Map();
    cases.forEach((item) => {
      if (!groups.has(item.section)) groups.set(item.section, []);
      groups.get(item.section).push(item);
    });
    const caseCard = (item, cardIndex) => {
      const sortedRewards = item.rewards.filter((reward) => reward.image && reward.type !== "balance").sort((a, b) => b.priceRub - a.priceRub);
      const coverReward = item.rewards.find((reward) => reward.id === item.coverItemId && reward.image);
      const featuredRewards = (coverReward ? [coverReward, ...sortedRewards.filter((reward) => reward.id !== coverReward.id)] : sortedRewards).slice(0, 3);
      const art = featuredRewards.slice(0, 3).map((reward, index) => {
        const motion = reward.animation
          ? '<span class="case-collage__motion" aria-hidden="true"></span>'
          : '';
        const animation = reward.animation ? ' data-gift-animation="' + escapeText(reward.animation) + '"' : '';
        return '<span class="case-collage__slot case-collage__slot--' + index + '"' + animation + '><img class="case-collage__item rarity-' + escapeText(reward.rarity || "common") + '" src="' + escapeText(reward.image) + '" alt="" loading="lazy">' + motion + '</span>';
      }).join("");
      const artContent = item.caseCover
        ? '<span class="case-card__crate"><img src="' + escapeText(item.caseCover) + '" alt="" loading="lazy"></span>'
        : '<span class="case-collage" aria-hidden="true">' + art + '</span>';
      const topPrize = sortedRewards[0];
      const label = category === "cs2" ? "CS2" : "TELEGRAM";
      const description = item.description + " · " + item.rewards.length + " призов";
      return '<article class="case-card" style="--case-delay:' + Math.min(cardIndex * 35, 280) + 'ms"><button class="case-card__art case-card__art--' + escapeText(item.category) + '" type="button" data-open-case="' + escapeText(item.id) + '" aria-label="Открыть кейс ' + escapeText(item.name) + ' за ' + escapeText(money(item.ticketRub)) + '">' + artContent + '<span class="case-card__market">' + label + '</span><span class="case-card__drop-label">до ' + escapeText(topPrize ? money(topPrize.priceRub) : money(0)) + '</span></button><div class="case-card__body"><h3>' + escapeText(item.name) + '</h3><p class="case-card__description">' + escapeText(description) + '</p><div class="case-card__footer"><span class="case-card__ticket">Открытие</span><button class="case-open" type="button" data-open-case="' + escapeText(item.id) + '">' + escapeText(money(item.ticketRub)) + '</button></div></div></article>';
    };
    el.caseGrid.innerHTML = cases.length ? [...groups.entries()].map(([section, items]) => {
      const headingId = "case-section-" + category + "-" + items[0].id;
      const cards = items.map((item) => caseCard(item, cases.indexOf(item))).join("");
      return '<section class="case-section" aria-labelledby="' + escapeText(headingId) + '"><header class="case-section__head"><h2 id="' + escapeText(headingId) + '">' + escapeText(section) + '</h2><span>Все ' + items.length + ' <i aria-hidden="true">›</i></span></header><div class="case-section__grid">' + cards + '</div></section>';
    }).join("") : '<p class="empty-state">В разделе «' + escapeText(categoryTitles[category]) + '» пока нет кейсов.</p>';
    renderBetValidation();
  }
  function itemPrice(item) { return money(Number(item.priceRub) || 0); }
  function caseRewardCard(reward, className) {
    const image = reward.image
      ? '<img src="' + escapeText(reward.image) + '" alt="" loading="lazy">'
      : '<span class="loot-item__coin">' + escapeText(String(reward.priceRub)) + ' ₽</span>';
    return '<span class="' + className + ' rarity-' + escapeText(reward.rarity || "common") + '">' + image + '</span>';
  }
  function weightedReward(item) {
    const total = item.rewards.reduce((sum, reward) => sum + Math.max(0, Number(reward.chance) || 0), 0);
    let point = Math.random() * total;
    for (const reward of item.rewards) {
      point -= Math.max(0, Number(reward.chance) || 0);
      if (point <= 0) return reward;
    }
    return item.rewards[item.rewards.length - 1];
  }
  function renderCaseTable(item) {
    el.caseLoot.innerHTML = item.rewards.slice().sort((a, b) => b.priceRub - a.priceRub).map((reward) => {
      const image = reward.image
        ? '<img src="' + escapeText(reward.image) + '" alt="" loading="lazy">'
        : '<span class="loot-item__coin">' + escapeText(String(reward.priceRub)) + ' ₽</span>';
      const title = reward.sourceUrl
        ? '<a href="' + escapeText(reward.sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeText(reward.name) + '</a>'
        : escapeText(reward.name);
      const floor = reward.floorGram
        ? '<span>' + numberFormat(reward.floorGram, 0) + ' GRAM ' + (reward.floorType === "timed-sale" ? "· timed listing" : "· floor") + '</span>'
        : '';
      const chanceDigits = reward.chance < 1 ? 2 : 1;
      return '<article class="loot-item rarity-' + escapeText(reward.rarity || "common") + '">' + image + '<span class="loot-item__copy"><strong>' + title + '</strong><span class="loot-item__meta"><span>' + escapeText(itemPrice(reward)) + '</span><span>' + numberFormat(reward.chance, chanceDigits) + '%</span>' + floor + '</span></span></article>';
    }).join("");
  }
  function updateCaseCost() {
    if (!selectedCase) return;
    const cost = selectedCase.ticketRub * caseCount;
    el.caseTicket.textContent = money(selectedCase.ticketRub) + " · ×" + caseCount;
    el.caseCost.textContent = "Всего · " + money(cost);
    el.caseSpin.disabled = caseOpenBusy || state.balanceRub < cost;
    $$('[data-case-count]').forEach((button) => {
      const selected = Number(button.dataset.caseCount) === caseCount;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
      button.disabled = caseOpenBusy;
    });
  }
  function openCase(caseId) {
    const item = (window.JESTER_CASES || []).find((candidate) => candidate.id === caseId);
    if (!item || caseOpenBusy) return;
    if (isBusy()) { setToast("Сначала заверши текущий игровой раунд.", "error"); return; }
    selectedCase = item;
    caseCount = 1;
    casePendingRewards = [];
    el.caseRevealTitle.textContent = item.name;
    el.caseReels.innerHTML = "";
    el.caseResults.innerHTML = "";
    el.caseSpin.textContent = "Открыть";
    renderCaseTable(item);
    updateCaseCost();
    el.caseReveal.showModal();
    playSound("select");
  }
  function renderCaseReel(winner) {
    const winnerIndex = 22;
    const cards = Array.from({ length: 30 }, (_, index) => {
      const prize = index === winnerIndex ? winner : weightedReward(selectedCase);
      const content = prize.image ? '<img src="' + escapeText(prize.image) + '" alt="" loading="lazy">' : '<strong>' + escapeText(String(prize.priceRub)) + ' ₽</strong>';
      return '<span class="case-reel-card rarity-' + escapeText(prize.rarity || "common") + '" data-index="' + index + '">' + content + '</span>';
    }).join("");
    return { winnerIndex, html: '<div class="case-reel"><div class="case-reel__track">' + cards + '</div><span class="case-reel__pointer"></span></div>' };
  }
  function spinCase() {
    if (!selectedCase || caseOpenBusy) return;
    const cost = selectedCase.ticketRub * caseCount;
    if (state.balanceRub < cost) { setToast("На балансе недостаточно средств для открытия.", "error"); return; }
    caseOpenBusy = true;
    casePendingRewards = Array.from({ length: caseCount }, () => weightedReward(selectedCase));
    state.balanceRub -= cost;
    el.caseResults.innerHTML = "";
    el.caseReels.innerHTML = casePendingRewards.map((reward) => renderCaseReel(reward).html).join("");
    updateCaseCost();
    renderWallet();
    saveState();
    playSound("case");
    requestAnimationFrame(() => {
      $$(".case-reel", el.caseReels).forEach((reel, reelIndex) => {
        const track = $(".case-reel__track", reel);
        const winner = $$('.case-reel-card[data-index="22"]', reel)[0];
        const offset = winner.offsetLeft + winner.offsetWidth / 2 - reel.clientWidth / 2;
        track.style.transform = "translateX(-" + Math.max(0, offset) + "px)";
        reel.style.setProperty("--reel-delay", (reelIndex * 80) + "ms");
      });
    });
    caseOpenTimer = setTimeout(() => {
      let marketValue = 0;
      casePendingRewards.forEach((reward) => {
        marketValue += Number(reward.priceRub) || 0;
        if (reward.type === "balance") state.balanceRub += reward.priceRub;
        else state.inventory.unshift({ ...reward, instanceId: "item-" + Date.now() + "-" + Math.random().toString(36).slice(2), category: reward.type === "cs2" ? "cs2" : "gifts", sourceCase: selectedCase.id });
      });
      state.inventory = state.inventory.slice(0, 100);
      caseOpenBusy = false;
      caseOpenTimer = null;
      addResult("Кейс · " + selectedCase.name + " ×" + caseCount, cost, marketValue);
      el.caseResults.innerHTML = casePendingRewards.map((reward, index) => {
        const img = reward.image ? '<img src="' + escapeText(reward.image) + '" alt="">' : '<span class="loot-item__coin">' + escapeText(String(reward.priceRub)) + ' ₽</span>';
        return '<article class="case-roll-result rarity-' + escapeText(reward.rarity || "common") + '" style="animation-delay:' + (index * .08) + 's">' + img + '<span><strong>' + escapeText(reward.name) + '</strong><span>' + escapeText(reward.priceLabel || itemPrice(reward)) + '</span></span></article>';
      }).join("");
      el.caseSpin.textContent = "Открыть ещё";
      updateCaseCost();
      renderWallet();
      playSound("win");
    }, 4400);
  }
  function renderUpgradePicker(category) {
    upgradePickerCategory = category;
    const targetMode = upgradePickerMode === "target";
    $("#upgradePickerTitle").textContent = targetMode ? "Выбери желаемый предмет" : "Инвентарь · выбери ставку";
    $("#upgradeTargetFilters").hidden = !targetMode;
    $(".upgrade-cash-entry").hidden = targetMode || category !== "balance";
    if ($("#upgradeFilterCurrency")) $("#upgradeFilterCurrency").textContent = CURRENCIES[state.currency].symbol;
    $$('[data-upgrade-category]').forEach((button) => {
      const sourceCategory = upgradeSource && upgradeCategory(upgradeSource);
      button.disabled = targetMode && button.dataset.upgradeCategory !== sourceCategory;
      const selected = button.dataset.upgradeCategory === category;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    const sourceItems = state.inventory.filter((item) => upgradeCategory(item) === category);
    const minField = $("#upgradePriceMin");
    const maxField = $("#upgradePriceMax");
    const minRub = targetMode && parseBetAmount(minField.value) > 0 ? parseBetAmount(minField.value) * CURRENCIES[state.currency].rate : 0;
    const maxParsed = targetMode ? parseBetAmount(maxField.value) : NaN;
    const maxRub = Number.isFinite(maxParsed) && maxParsed > 0 ? maxParsed * CURRENCIES[state.currency].rate : Infinity;
    const items = (targetMode ? upgradeTargetOptions().filter((item) => item.category === category) : sourceItems)
      .filter((item) => !targetMode || (item.priceRub >= minRub && item.priceRub <= maxRub));
    el.upgradePickerGrid.innerHTML = items.length ? items.map((item) => '<button class="upgrade-picker__item rarity-' + escapeText(item.rarity || "common") + '" type="button" data-pick-upgrade="' + escapeText(targetMode ? item.id : item.instanceId) + '"><img src="' + escapeText(item.image || "assets/balance-chip.svg") + '" alt=""><span><strong>' + escapeText(item.name) + '</strong><span>' + money(item.priceRub) + '</span></span></button>').join("")
      : '<p class="empty-state">Подходящих целей не найдено. Попробуй изменить ценовой фильтр.</p>';
  }
  function openUpgradePicker(category, mode) {
    upgradePickerMode = mode || "source";
    renderUpgradePicker(category || upgradePickerCategory || "cs2");
    el.upgradePicker.showModal();
  }
  function addCashUpgradeItem() {
    const amount = parseBetAmount($("#upgradeCashAmount").value);
    const valueRub = amount * CURRENCIES[state.currency].rate;
    if (!Number.isFinite(valueRub) || valueRub < MIN_BET) { setToast("Введи сумму не меньше " + money(MIN_BET) + ".", "error"); return; }
    if (valueRub > state.balanceRub) { setToast("На балансе не хватает виртуальных средств.", "error"); return; }
    state.balanceRub -= valueRub;
    state.inventory.unshift({ instanceId: "cash-" + Date.now(), name: "Демо-баланс · " + money(valueRub), type: "balance", category: "balance", priceRub: valueRub, image: "assets/balance-chip.svg", rarity: "common", source: "JesterUp" });
    renderWallet(); saveState(); renderUpgradePicker("balance"); playSound("select");
  }
  function chooseUpgradeSource(instanceId) {
    if (upgradePickerMode === "target") {
      const target = upgradeTargetOptions().find((candidate) => candidate.id === instanceId);
      if (!target || !upgradeSource) return;
      const ratio = target.priceRub / upgradeSource.priceRub;
      if (ratio < 2 || ratio > 100) { setToast("Цель должна быть дороже ставки в пределах выбранного множителя.", "error"); return; }
      upgradeTarget = target;
      upgradeTargetIndex = upgradeTargetOptions().findIndex((candidate) => candidate.id === target.id);
      upgradeX = ratio;
      upgradeTargetManual = true;
      el.upgradePicker.close();
      renderUpgradeBoard();
      return;
    }
    const item = state.inventory.find((candidate) => candidate.instanceId === instanceId);
    if (!item) return;
    upgradeSource = item;
    upgradeTargetIndex = 0;
    upgradeTargetManual = false;
    upgradeTarget = null;
    el.upgradePicker.close();
    renderUpgradeBoard();
    setMessage("Предмет выбран. Настрой множитель и крути колесо.");
    renderBetValidation();
  }
  function setMessage(message) { el.message.textContent = message; }
  function startUpgrade() {
    if (upgradeBusy || !upgradeSource) return;
    updateUpgradeTarget();
    if (!upgradeTarget) { setToast("Для этого предмета нет подходящей цели.", "error"); return; }
    const source = upgradeSource;
    const target = upgradeTarget;
    upgradeBusy = true;
    upgradeSource = null;
    state.inventory = state.inventory.filter((item) => item.instanceId !== source.instanceId);
    const wheel = $("#upgradeWheel");
    const row = $("#upgradeWheelRow");
    const action = $("[data-upgrade-spin]");
    const won = Math.random() * 100 < upgradeChance;
    const sector = upgradeChance * 3.6;
    const sectorCenter = won ? sector / 2 : sector + (360 - sector) / 2;
    const degrees = 360 * 6 + sectorCenter;
    if (row) row.classList.add("is-spinning");
    const pointer = $("#upgradePointerArm");
    if (pointer) { pointer.style.transition = "none"; pointer.style.transform = "rotate(0deg)"; void pointer.offsetWidth; pointer.style.transition = "transform 3.8s cubic-bezier(.08,.76,.08,1)"; pointer.style.transform = "rotate(" + degrees + "deg)"; }
    if (action) { action.disabled = true; action.textContent = "Колесо вращается…"; }
    setBadge("Апгрейд идёт", "playing");
    setMessage("Колесо вращается.");
    playSound("launch");
    renderWallet();
    saveState();
    upgradeRoundTimer = setTimeout(() => {
      upgradeBusy = false;
      upgradeRoundTimer = null;
      if (row) row.classList.remove("is-spinning");
      if (won) {
        upgradeResultItem = { ...target, instanceId: "upgrade-" + Date.now(), category: target.type === "balance" ? "balance" : target.type === "cs2" ? "cs2" : "gifts" };
        state.inventory.unshift(upgradeResultItem);
        state.inventory = state.inventory.slice(0, 100);
        el.upgradeResultTitle.textContent = "Апгрейд успешен!";
        el.upgradeResultCard.innerHTML = '<div class="upgrade-result__item"><img src="' + escapeText(target.image) + '" alt=""><div><strong>' + escapeText(target.name) + '</strong><span>' + money(target.priceRub) + '</span></div></div>';
        $("#upgradeAgain").disabled = false;
        $("#upgradeSell").hidden = false;
        $("#upgradeKeep").textContent = "Сохранить в инвентаре";
        el.upgradeResult.classList.remove("is-loss");
        el.upgradeResult.showModal();
        setBadge("Апгрейд успешен", "win");
        setMessage("Получен " + target.name + " · " + money(target.priceRub) + ".");
        playSound("win");
        addResult(GAMES.upgrader.title, source.priceRub, target.priceRub);
      } else {
        upgradeResultItem = null;
        setBadge("Не получилось", "loss");
        setMessage("Колесо остановилось мимо цели.");
        playSound("loss");
        addResult(GAMES.upgrader.title, source.priceRub, 0);
        renderUpgradeBoard();
      }
      renderWallet();
      saveState();
    }, 3900);
  }
  function sellInventoryItem(instanceId) {
    const item = state.inventory.find((candidate) => candidate.instanceId === instanceId);
    if (!item) return;
    state.inventory = state.inventory.filter((candidate) => candidate.instanceId !== instanceId);
    state.balanceRub += Number(item.priceRub) || 0;
    renderWallet();
    saveState();
    setToast("Продано за " + money(item.priceRub) + ".", "success");
    playSound("win");
  }
  function finishUpgradeResult(action) {
    if (!upgradeResultItem) { el.upgradeResult.close(); return; }
    if (action === "sell") {
      sellInventoryItem(upgradeResultItem.instanceId);
      upgradeResultItem = null;
    } else if (action === "again") {
      upgradeSource = upgradeResultItem;
      upgradeResultItem = null;
      el.upgradeResult.close();
      activeGame = "upgrader";
      renderUpgradeBoard();
      setMessage("Новый предмет выбран. Настрой следующий множитель.");
      return;
    } else upgradeResultItem = null;
    el.upgradeResult.close();
    renderWallet();
    saveState();
  }

  function runPrimary() {
    if (activeGame === "plane" && planeRound) { landPlane(); return; }
    if (isBusy()) return;
    if (activeGame === "mines") startMines();
    else if (activeGame === "roulette") spinRoulette();
    else if (activeGame === "rocket") launchRocket();
    else if (activeGame === "plane") startPlane();
    else if (activeGame === "upgrader") openUpgradePicker("cs2");
    else if (activeGame === "plinko") dropPlinko();
  }
  function switchView(name) {
    if (!["games", "cases", "bonuses", "profile"].includes(name)) return;
    $$("[data-view]").forEach((view) => {
      const current = view.dataset.view === name;
      view.hidden = !current;
      view.classList.toggle("is-active", current);
    });
    $$("[data-nav]").forEach((button) => {
      const current = button.dataset.nav === name;
      button.classList.toggle("is-active", current);
      if (button.classList.contains("bottom-nav__item")) {
        if (current) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
      }
    });
    if (name === "profile") renderStats();
    if (name === "cases") renderCases(currentCaseCategory);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function claimBonus() {
    if (state.bonusClaimedDate === localDateKey()) { setToast("Сегодняшний демо-бонус уже получен."); return; }
    state.balanceRub += 500;
    state.bonusClaimedDate = localDateKey();
    saveState();
    renderWallet();
    setToast("+" + money(500) + " добавлено на виртуальный баланс.", "success");
    playSound("win");
  }
  function resetDemo() {
    clearInterval(rocketTimer); stopPlane(); clearTimeout(rouletteTimer); clearTimeout(plinkoTimer); clearTimeout(caseOpenTimer); clearTimeout(upgradeRoundTimer);
    rocketTimer = rouletteTimer = plinkoTimer = caseOpenTimer = upgradeRoundTimer = null;
    mineRound = rocketRound = planeRound = null;
    rouletteBusy = plinkoBusy = false;
    caseOpenBusy = false;
    upgradeBusy = false;
    upgradeSource = upgradeTarget = upgradeResultItem = selectedCase = null;
    casePendingRewards = [];
    state = initialState();
    activeGame = "mines";
    el.currency.value = "RUB";
    el.bet.value = "500";
    $$("[data-mines]").forEach((button) => {
      const selected = Number(button.dataset.mines) === 3;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $$("[data-color]").forEach((button) => {
      const selected = button.dataset.color === "red";
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $$(".game-tile").forEach((tile) => {
      tile.classList.remove("is-current");
      tile.setAttribute("aria-pressed", "false");
    });
    el.title.textContent = GAMES.mines.title;
    el.subtitle.textContent = GAMES.mines.subtitle;
    el.caption.textContent = GAMES.mines.caption;
    el.message.textContent = "Выбери ставку и нажми «Начать игру».";
    el.playPanel.hidden = true;
    el.playPanel.classList.remove("is-plane-mode", "is-upgrader-mode");
    el.planeStats.hidden = true;
    el.planeFlightStrip.hidden = true;
    el.planeBetRoller.hidden = true;
    el.cashout.hidden = false;
    el.cashout.disabled = true;
    el.cashout.textContent = "Забрать ×1,00";
    el.minesOptions.classList.remove("option-row--hidden");
    el.rouletteOptions.classList.add("option-row--hidden");
    el.rocketOptions.classList.add("option-row--hidden");
    el.plinkoOptions.classList.add("option-row--hidden");
    setPrimaryLabel(GAMES.mines.start);
    setBadge("Раунд не начат");
    setMultiplier(1);
    renderBoard();
    switchView("games");
    renderWallet();
    saveState();
    setToast("Демо сброшено до 1 350 000 ₽.", "success");
  }

  el.currency.addEventListener("change", () => {
    state.currency = el.currency.value;
    renderWallet();
    renderCases(currentCaseCategory);
    if (activeGame === "upgrader") renderUpgradeBoard();
    saveState();
    setToast("Витрина теперь показывает " + state.currency + ".");
  });
  el.bet.addEventListener("input", () => {
    const amount = parseBetAmount(el.bet.value);
    if (Number.isFinite(amount) && amount > 0) {
      state.betRub = amount * CURRENCIES[state.currency].rate;
      saveState();
    }
    renderBetValidation();
  });
  el.bet.addEventListener("blur", () => {
    const amount = parseBetAmount(el.bet.value);
    if (Number.isFinite(amount) && amount > 0) {
      state.betRub = amount * CURRENCIES[state.currency].rate;
      el.bet.value = displayedBet(state.betRub);
      saveState();
    }
    renderBetValidation();
  });
  $("#betDown").addEventListener("click", () => {
    const amount = currentBet(false);
    state.betRub = Math.max(MIN_BET, (amount == null ? state.betRub : amount) - 100);
    renderWallet(); saveState();
  });
  $("#betUp").addEventListener("click", () => {
    const amount = currentBet(false);
    state.betRub = Math.min(state.balanceRub, (amount == null ? state.betRub : amount) + 100);
    renderWallet(); saveState();
  });
  $$("[data-bet-rub]").forEach((button) => button.addEventListener("click", () => {
    state.betRub = Math.min(Number(button.dataset.betRub), Math.max(MIN_BET, state.balanceRub));
    renderWallet(); saveState();
  }));
  $("[data-bet-max]").addEventListener("click", () => {
    state.betRub = state.balanceRub >= MIN_BET ? state.balanceRub : MIN_BET;
    renderWallet(); saveState();
  });
  function stepPlaneBet(direction) {
    if (planeRound) return;
    const ladder = [1, 2, 5, 10, 20, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000];
    const available = ladder.filter((value) => value <= state.balanceRub);
    if (state.balanceRub >= MIN_BET && !available.includes(state.balanceRub)) available.push(state.balanceRub);
    available.sort((a, b) => a - b);
    if (!available.length) return;
    let index = available.findIndex((value) => value >= state.betRub);
    if (index < 0) index = available.length - 1;
    if (direction < 0 && available[index] > state.betRub) index -= 1;
    else index += direction;
    index = Math.max(0, Math.min(available.length - 1, index));
    state.betRub = available[index];
    renderWallet(); saveState(); playSound("tick");
  }
  el.planeBetRoller.addEventListener("click", (event) => {
    const step = event.target.closest("[data-plane-bet-step]");
    if (step) stepPlaneBet(Number(step.dataset.planeBetStep));
    if (event.target.closest("[data-plane-bet-max]")) {
      state.betRub = Math.max(MIN_BET, state.balanceRub);
      renderWallet(); saveState(); playSound("select");
    }
  });
  el.planeBetRoller.addEventListener("wheel", (event) => {
    event.preventDefault();
    stepPlaneBet(event.deltaY > 0 ? -1 : 1);
  }, { passive: false });
  $$("[data-mines]").forEach((button) => button.addEventListener("click", () => changeMines(Number(button.dataset.mines))));
  $$("[data-color]").forEach((button) => button.addEventListener("click", () => setRouletteColor(button.dataset.color)));
  $$(".game-tile").forEach((tile) => tile.addEventListener("click", () => changeGame(tile.dataset.game)));
  $$("[data-nav]").forEach((button) => button.addEventListener("click", (event) => {
    if (button.tagName === "A") event.preventDefault();
    switchView(button.dataset.nav);
  }));
  $$("[data-case-category]").forEach((button) => button.addEventListener("click", () => renderCases(button.dataset.caseCategory)));
  el.caseGrid.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-open-case]");
    if (opener) openCase(opener.dataset.openCase);
  });
  el.caseGrid.addEventListener("pointerover", (event) => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const motion = event.target.closest("[data-gift-animation]");
    if (motion && !motion.contains(event.relatedTarget)) startCaseAnimation(motion);
  });
  el.caseGrid.addEventListener("pointerout", (event) => {
    const motion = event.target.closest("[data-gift-animation]");
    if (motion && !motion.contains(event.relatedTarget)) motion.__caseAnimation?.pause();
  });
  $$('[data-case-count]').forEach((button) => button.addEventListener("click", () => {
    if (caseOpenBusy) return;
    caseCount = Number(button.dataset.caseCount);
    el.caseReels.innerHTML = "";
    el.caseResults.innerHTML = "";
    updateCaseCost();
  }));
  el.caseSpin.addEventListener("click", spinCase);
  el.soundToggle.addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    saveState();
    renderSoundToggle();
    playSound("click");
    setToast(state.soundEnabled ? "Звуки включены." : "Звуки выключены.");
  });
  $("#closeCaseReveal").addEventListener("click", () => el.caseReveal.close());
  el.caseReveal.addEventListener("click", (event) => {
    if (event.target === el.caseReveal) el.caseReveal.close();
  });
  $("#closeUpgradePicker").addEventListener("click", () => el.upgradePicker.close());
  el.upgradePicker.addEventListener("click", (event) => {
    if (event.target === el.upgradePicker) el.upgradePicker.close();
    const tab = event.target.closest("[data-upgrade-category]");
    if (tab) renderUpgradePicker(tab.dataset.upgradeCategory);
    const pick = event.target.closest("[data-pick-upgrade]");
    if (pick) chooseUpgradeSource(pick.dataset.pickUpgrade);
    if (event.target.closest("#upgradeApplyFilters")) renderUpgradePicker(upgradePickerCategory);
    if (event.target.closest("[data-open-cases]")) { el.upgradePicker.close(); switchView("cases"); }
  });
  $("#upgradeCashAdd").addEventListener("click", addCashUpgradeItem);
  $("#closeUpgradeResult").addEventListener("click", () => finishUpgradeResult("keep"));
  $("#upgradeAgain").addEventListener("click", () => finishUpgradeResult("again"));
  $("#upgradeSell").addEventListener("click", () => finishUpgradeResult("sell"));
  $("#upgradeKeep").addEventListener("click", () => finishUpgradeResult("keep"));
  el.upgradeResult.addEventListener("click", (event) => { if (event.target === el.upgradeResult) finishUpgradeResult("keep"); });
  el.inventory.addEventListener("click", (event) => {
    const sell = event.target.closest("[data-inventory-sell]");
    if (sell) { sellInventoryItem(sell.dataset.inventorySell); return; }
    const pick = event.target.closest("[data-inventory-upgrade]");
    if (pick) {
      const item = state.inventory.find((candidate) => candidate.instanceId === pick.dataset.inventoryUpgrade);
      if (!item) return;
      switchView("games");
      changeGame("upgrader");
      upgradeSource = item;
      renderUpgradeBoard();
      setMessage("Предмет выбран. Настрой множитель и крути колесо.");
    }
  });
  $("#inventoryCases").addEventListener("click", () => switchView("cases"));
  el.board.addEventListener("click", (event) => {
    const tile = event.target.closest("[data-cell]");
    if (tile) clickMine(Number(tile.dataset.cell));
    if (event.target.closest("[data-upgrade-source-slot]")) openUpgradePicker(upgradeSource ? upgradeSource.category : "cs2", "source");
    if (event.target.closest("[data-upgrade-spin]")) startUpgrade();
    if (event.target.closest("[data-upgrade-target-slot]") && upgradeSource) openUpgradePicker(upgradeSource.category || (upgradeSource.type === "cs2" ? "cs2" : upgradeSource.type === "balance" ? "balance" : "gifts"), "target");
  });
  el.board.addEventListener("input", (event) => {
    if (event.target.id === "upgradeRange") { upgradeTargetManual = false; upgradeTargetIndex = Number(event.target.value); updateUpgradeTarget(); }
  });
  el.primary.addEventListener("click", runPrimary);
  el.cashout.addEventListener("click", () => {
    if (activeGame === "mines") cashOutMines();
    if (activeGame === "rocket") cashOutRocket();
  });
  el.bonus.addEventListener("click", claimBonus);
  $("#resetDemo").addEventListener("click", resetDemo);

  $$("[data-mines]").forEach((button) => {
    const selected = Number(button.dataset.mines) === state.mineCount;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  $$("[data-color]").forEach((button) => {
    const selected = button.dataset.color === state.rouletteColor;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  renderWallet();
  renderCases(currentCaseCategory);
  renderBoard();
  setPrimaryLabel(GAMES.mines.start);
  setBadge("Раунд не начат");
  setMultiplier(1);
  const bootScreen = $("#bootScreen");
  if (bootScreen) setTimeout(() => { bootScreen.classList.add("is-leaving"); setTimeout(() => bootScreen.remove(), 420); }, 1100);
})();
