
const STORAGE_KEY = "routineFarmState.v1";
const LEGACY_KEY = "routineQuestState.v1";
const IMAGE_ROOT = "images";
const AUDIO_ROOT = "assets/audio";
const FULL_DAY_COIN_BONUS = 50;
const MAX_ANIMAL_NAME_LENGTH = 16;
const ANIMAL_GACHA_COST = 300;

const audioAssets = {
  bgm: `${AUDIO_ROOT}/bgm/bgm-main.mp3`,
  se: {
    tap: `${AUDIO_ROOT}/se/se-tap.mp3`,
    transition: `${AUDIO_ROOT}/se/se-transition-02.mp3`,
    gachaStart: `${AUDIO_ROOT}/se/se-transition-01.mp3`,
    gachaOpen: `${AUDIO_ROOT}/se/se-complete.mp3`,
    gachaNormal: `${AUDIO_ROOT}/se/se-buy.mp3`,
    gachaRare: `${AUDIO_ROOT}/se/se-stamp.mp3`,
    gachaSuperRare: `${AUDIO_ROOT}/se/se-reward.mp3`,
    gachaSecret: `${AUDIO_ROOT}/se/se-all-clear.mp3`,
    complete: `${AUDIO_ROOT}/se/se-complete.mp3`,
    stamp: `${AUDIO_ROOT}/se/se-stamp.mp3`,
    reward: `${AUDIO_ROOT}/se/se-reward.mp3`,
    allClear: `${AUDIO_ROOT}/se/se-all-clear.mp3`
  }
};

const defaultAudioSettings = {
  bgmEnabled: true,
  seEnabled: true,
  bgmVolume: 0.3,
  seVolume: 0.3
};

const categories = {
  morning: { label: "朝", eyebrow: "朝のミッション", title: "出発までにやること" },
  afterSchool: { label: "昼", eyebrow: "昼のミッション", title: "帰宅後にやること" },
  night: { label: "夜", eyebrow: "夜のミッション", title: "ねる前にやること" }
};

const rarityMeta = {
  N: { label: "ふつう！", weight: 18, animation: "normal", se: "gachaNormal" },
  R: { label: "レア！", weight: 12, animation: "rare", se: "gachaRare" },
  SR: { label: "すごい！", weight: 7, animation: "superRare", se: "gachaSuperRare" },
  SSR: { label: "きせきの どうぶつ！", weight: 4, animation: "secret", se: "gachaSecret" }
};

const gachaPhaseTimeline = [
  { phase: "shake", at: 360 },
  { phase: "fly", at: 760 },
  { phase: "charge", at: 1780 },
  { phase: "silhouette", at: 2680 },
  { phase: "reveal", at: 3520 },
  { phase: "result", at: 4420 }
];

const defaultTasks = [
  ["起きる", "morning", 20], ["顔を洗う", "morning", 15], ["着替える", "morning", 15], ["朝ごはん", "morning", 20], ["歯磨き", "morning", 15], ["持ち物チェック", "morning", 20], ["ランドセルを持つ", "morning", 15], ["出発", "morning", 15],
  ["手洗い、うがい", "afterSchool", 15], ["連絡帳を出す", "afterSchool", 15], ["宿題", "afterSchool", 40], ["音読", "afterSchool", 20], ["プリントを出す", "afterSchool", 15], ["明日の持ち物を確認", "afterSchool", 20], ["ランドセルに入れる", "afterSchool", 15],
  ["入浴", "night", 20], ["パジャマに着替える", "night", 15], ["歯磨き", "night", 20], ["明日の服を準備", "night", 15], ["寝る準備", "night", 15]
].map(([title, category, coins], index) => ({ id: generateId(), title, category, coins, order: index + 1, enabled: true }));

const animalTypes = [
  { id: "cow", label: "うし", price: 420, rarity: "R", description: "大きくてやさしい牧場の人気者" },
  { id: "chicken", label: "にわとり", price: 220, rarity: "N", description: "元気いっぱいで朝が得意" },
  { id: "sheep", label: "ひつじ", price: 360, rarity: "R", description: "ふわふわでのんびり屋さん" },
  { id: "rabbit", label: "うさぎ", price: 300, rarity: "N", description: "なでられるのが好きな小さな仲間" },
  { id: "goat", label: "やぎ", price: 380, rarity: "R", description: "好奇心旺盛でよく食べます" },
  { id: "dog", label: "いぬ", price: 450, rarity: "SR", description: "牧場を見守る頼れる相棒" },
  { id: "pig", label: "ぶた", price: 340, rarity: "N", description: "ごはんが大好きな明るい子" },
  { id: "duck", label: "あひる", price: 280, rarity: "N", description: "水あびが好きなにぎやかな子" },
  { id: "horse", label: "うま", price: 620, rarity: "SSR", description: "元気に走るあこがれの仲間" },
  { id: "cat", label: "ねこ", price: 390, rarity: "R", description: "気まぐれだけど甘え上手" },
  { id: "alpaca", label: "アルパカ", price: 540, rarity: "SR", description: "ふわふわでおだやかな人気者" }
];

const supplies = [
  { id: "feed", label: "えさ", unit: "3こ", amount: 3, price: 90, image: "item-feed.png", description: "どうぶつのお腹を満たします" },
  { id: "water", label: "水", unit: "3こ", amount: 3, price: 60, image: "item-water.png", description: "のどの渇きをいやします" },
  { id: "premiumFeed", label: "特別えさ", unit: "1こ", amount: 1, price: 150, image: "item-premium-feed.png", description: "お腹ときずなを大きく回復します" },
  { id: "medicine", label: "元気の薬", unit: "1こ", amount: 1, price: 140, image: "item-medicine.png", description: "体調が悪い時に回復できます" },
  { id: "brush", label: "ブラシ", unit: "1こ", amount: 1, price: 120, image: "item-brush.png", description: "お世話のかわりに使えます" },
  { id: "toyBall", label: "あそびボール", unit: "1こ", amount: 1, price: 120, image: "item-toy-ball.png", description: "なつきを上げる遊び道具です" },
  { id: "animalBed", label: "ふかふかベッド", unit: "1こ", amount: 1, price: 180, image: "item-animal-bed.png", description: "休ませて体調を回復します" }
];

const defaultCouponTemplates = [
  { title: "お楽しみクーポン", description: "週末に好きな遊びを1つ選べる" },
  { title: "あそび時間クーポン", description: "好きな遊びを15分プラス" },
  { title: "えらべるクーポン", description: "家族と相談して小さなごほうびを選べる" },
  { title: "本えらびクーポン", description: "読んでほしい本を1冊選べる" }
];

const futureIdeas = [
  { title: "牧場の柵", description: "広い柵、白い柵、レンガの柵などを購入", image: "decor-fence-white.png" },
  { title: "小屋", description: "どうぶつごとの小屋を置ける", image: "decor-barn.png" },
  { title: "畑", description: "野菜を育ててえさを作れる", image: "field-growing.png" },
  { title: "飾り", description: "花、風車、池を牧場に置ける", image: "decor-flower.png" },
  { title: "季節イベント", description: "春夏秋冬で背景や限定どうぶつを追加", image: "farm-bg-festival.png" }
];

const state = loadState();
applyDailyDecay();
let activeView = "missions";
let activeCategory = getSuggestedCategory();
let selectedAnimalIndex = 0;
let toastTimer = null;
let guardianMode = "verify";
let pendingGuardianAction = null;
let audioUnlocked = false;
let bgmDucked = false;
let gachaAnimation = { phase: "idle", result: null, timers: [], button: null, revealed: false };

const audioPlayers = {
  bgm: null,
  se: {}
};

const els = {
  todayLabel: document.querySelector("#todayLabel"), heroMessage: document.querySelector("#heroMessage"), progressFill: document.querySelector("#progressFill"), progressText: document.querySelector("#progressText"),
  farmScene: document.querySelector("#farmScene"), prevAnimalButton: document.querySelector("#prevAnimalButton"), nextAnimalButton: document.querySelector("#nextAnimalButton"),
  coinsValue: document.querySelector("#coinsValue"), feedValue: document.querySelector("#feedValue"), waterValue: document.querySelector("#waterValue"), animalCountValue: document.querySelector("#animalCountValue"),
  categoryEyebrow: document.querySelector("#categoryEyebrow"), categoryTitle: document.querySelector("#categoryTitle"), categoryProgress: document.querySelector("#categoryProgress"), taskList: document.querySelector("#taskList"),
  animalDetail: document.querySelector("#animalDetail"), animalGachaPanel: document.querySelector("#animalGachaPanel"), animalShopGrid: document.querySelector("#animalShopGrid"), supplyShopGrid: document.querySelector("#supplyShopGrid"), futureIdeaGrid: document.querySelector("#futureIdeaGrid"), gachaCoins: document.querySelector("#gachaCoins"), shopCoins: document.querySelector("#shopCoins"),
  couponEyebrow: document.querySelector("#couponEyebrow"), couponTitle: document.querySelector("#couponTitle"), couponGrid: document.querySelector("#couponGrid"), albumGrid: document.querySelector("#albumGrid"), calendarGrid: document.querySelector("#calendarGrid"),
  guardianStatus: document.querySelector("#guardianStatus"), guardianCodeForm: document.querySelector("#guardianCodeForm"), currentGuardianCode: document.querySelector("#currentGuardianCode"), newGuardianCode: document.querySelector("#newGuardianCode"),
  bgmEnabled: document.querySelector("#bgmEnabled"), bgmVolume: document.querySelector("#bgmVolume"), seEnabled: document.querySelector("#seEnabled"), seVolume: document.querySelector("#seVolume"),
  couponTemplateForm: document.querySelector("#couponTemplateForm"), couponTemplateIndex: document.querySelector("#couponTemplateIndex"), couponTemplateTitle: document.querySelector("#couponTemplateTitle"), couponTemplateDescription: document.querySelector("#couponTemplateDescription"), couponSettingsList: document.querySelector("#couponSettingsList"),
  taskForm: document.querySelector("#taskForm"), taskId: document.querySelector("#taskId"), taskTitle: document.querySelector("#taskTitle"), taskCategory: document.querySelector("#taskCategory"), taskCoins: document.querySelector("#taskCoins"), settingsList: document.querySelector("#settingsList"),
  gachaOverlay: document.querySelector("#gachaOverlay"), guardianModal: document.querySelector("#guardianModal"), guardianForm: document.querySelector("#guardianForm"), guardianTitle: document.querySelector("#guardianTitle"), guardianMessage: document.querySelector("#guardianMessage"), guardianCodeLabel: document.querySelector("#guardianCodeLabel"), guardianCodeInput: document.querySelector("#guardianCodeInput"), guardianNewCodeLabel: document.querySelector("#guardianNewCodeLabel"), guardianNewCodeInput: document.querySelector("#guardianNewCodeInput"), guardianError: document.querySelector("#guardianError"), guardianCancelButton: document.querySelector("#guardianCancelButton"), toast: document.querySelector("#toast")
};

initAudio();
bindEvents();
render();
registerServiceWorker();

function bindEvents() {
  document.querySelectorAll(".tab").forEach((button) => button.addEventListener("click", () => { playSe("transition"); activeView = button.dataset.view; render(); }));
  document.querySelectorAll(".category-tab").forEach((button) => button.addEventListener("click", () => { playSe("transition"); activeCategory = button.dataset.category; render(); }));
  document.addEventListener("click", (event) => { if (shouldPlayTapSe(event)) playSe("tap"); }, true);
  document.addEventListener("pointerdown", unlockAudio, { once: true, capture: true });
  document.addEventListener("keydown", unlockAudio, { once: true, capture: true });
  els.prevAnimalButton.addEventListener("click", () => moveAnimal(-1));
  els.nextAnimalButton.addEventListener("click", () => moveAnimal(1));
  document.querySelector("#resetTodayButton").addEventListener("click", () => requestGuardianApproval("今日のチェックをリセットします。", () => { state.checks[todayKey()] = {}; saveState(); showToast("今日のチェックをリセットしました"); render(); }));
  document.querySelector("#settingsMenuButton").addEventListener("click", () => requestGuardianApproval("保護者メニューを開きます。", () => { playSe("transition"); activeView = "settings"; render(); }));
  els.guardianCodeForm.addEventListener("submit", (event) => { event.preventDefault(); changeGuardianCode(); });
  els.guardianForm.addEventListener("submit", (event) => { event.preventDefault(); approveGuardianAction(); });
  els.guardianCancelButton.addEventListener("click", () => closeGuardianModal());
  els.couponTemplateForm.addEventListener("submit", (event) => { event.preventDefault(); saveCouponTemplate(); });
  document.querySelector("#cancelCouponEditButton").addEventListener("click", clearCouponForm);
  document.querySelector("#cancelEditButton").addEventListener("click", clearTaskForm);
  els.taskForm.addEventListener("submit", (event) => { event.preventDefault(); saveTask(); });
  els.bgmEnabled.addEventListener("change", () => updateAudioSetting("bgmEnabled", els.bgmEnabled.checked));
  els.seEnabled.addEventListener("change", () => updateAudioSetting("seEnabled", els.seEnabled.checked));
  els.bgmVolume.addEventListener("input", () => updateAudioSetting("bgmVolume", Number(els.bgmVolume.value) / 100));
  els.seVolume.addEventListener("input", () => updateAudioSetting("seVolume", Number(els.seVolume.value) / 100));
  els.gachaOverlay.addEventListener("click", handleGachaOverlayClick);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (!["http:", "https:"].includes(window.location.protocol)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

function initAudio() {
  audioPlayers.bgm = new Audio(audioAssets.bgm);
  audioPlayers.bgm.loop = true;
  audioPlayers.bgm.preload = "auto";
  Object.entries(audioAssets.se).forEach(([key, source]) => {
    const sound = new Audio(source);
    sound.preload = "auto";
    audioPlayers.se[key] = sound;
  });
  applyAudioSettings();
}

function unlockAudio(event) {
  if (audioUnlocked) return;
  audioUnlocked = true;
  if (event?.target?.id === "bgmEnabled") return;
  startBgm();
}

function startBgm() {
  if (!audioPlayers.bgm || !state.audioSettings.bgmEnabled) return;
  audioPlayers.bgm.volume = getBgmVolume();
  audioPlayers.bgm.play().catch(() => {});
}

function applyAudioSettings() {
  if (audioPlayers.bgm) {
    audioPlayers.bgm.volume = getBgmVolume();
    if (!state.audioSettings.bgmEnabled) audioPlayers.bgm.pause();
    else if (audioUnlocked) startBgm();
  }
  Object.values(audioPlayers.se).forEach((sound) => {
    sound.volume = state.audioSettings.seVolume;
  });
}

function updateAudioSetting(key, value) {
  if (key === "bgmEnabled" || key === "seEnabled") state.audioSettings[key] = Boolean(value);
  else state.audioSettings[key] = clamp(Number(value) || 0, 0, 1);
  applyAudioSettings();
  saveState();
}

function playSe(name) {
  if (!state.audioSettings.seEnabled) return;
  const baseSound = audioPlayers.se[name];
  if (!baseSound) return;
  const sound = baseSound.cloneNode(true);
  sound.volume = state.audioSettings.seVolume;
  sound.play().catch(() => {});
}

function getBgmVolume() {
  return clamp(state.audioSettings.bgmVolume * (bgmDucked ? 0.45 : 1), 0, 1);
}

function setBgmDucked(ducked) {
  bgmDucked = ducked;
  if (audioPlayers.bgm) audioPlayers.bgm.volume = getBgmVolume();
}

function shouldPlayTapSe(event) {
  const button = event.target.closest("button");
  if (!button) return false;
  if (button.matches(".tab, .category-tab, .farm-arrow")) return false;
  return button.id !== "settingsMenuButton";
}
function loadState() {
  const current = readStoredState(STORAGE_KEY);
  if (current) return normalizeState(current);
  const legacy = readStoredState(LEGACY_KEY);
  if (legacy) {
    return normalizeState({
      tasks: Array.isArray(legacy.tasks) ? legacy.tasks.map((task) => ({ id: task.id || generateId(), title: task.title, category: task.category, coins: Number.isFinite(task.coins) ? task.coins : Math.max(10, (Number(task.points) || 5) * 3), order: task.order || 1, enabled: task.enabled !== false })) : defaultTasks,
      checks: legacy.checks || {}, guardianCodeHash: legacy.guardianCodeHash || "", couponTemplates: legacy.couponTemplates || defaultCouponTemplates
    });
  }
  return normalizeState({});
}

function readStoredState(key) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

function normalizeState(source) {
  return {
    tasks: Array.isArray(source.tasks) && source.tasks.length ? source.tasks.map(normalizeTask) : defaultTasks.map((task) => ({ ...task })),
    checks: source.checks && typeof source.checks === "object" ? source.checks : {},
    spentCoins: Number.isFinite(source.spentCoins) ? source.spentCoins : 0,
    inventory: normalizeInventory(source.inventory),
    animals: Array.isArray(source.animals) ? source.animals.map(normalizeAnimal) : [],
    coupons: Array.isArray(source.coupons) ? source.coupons : [],
    album: Array.isArray(source.album) ? source.album : [],
    guardianCodeHash: typeof source.guardianCodeHash === "string" ? source.guardianCodeHash : "",
    couponTemplates: normalizeCouponTemplates(source.couponTemplates),
    audioSettings: normalizeAudioSettings(source.audioSettings)
  };
}

function normalizeTask(task) {
  return { id: task.id || generateId(), title: String(task.title || "ミッション"), category: categories[task.category] ? task.category : "morning", coins: Math.max(0, Number(task.coins) || 0), order: Number(task.order) || 1, enabled: task.enabled !== false };
}

function normalizeInventory(inventory) {
  return supplies.reduce((result, supply) => {
    result[supply.id] = Math.max(0, Number(inventory?.[supply.id]) || 0);
    return result;
  }, {});
}

function normalizeAudioSettings(settings) {
  return {
    bgmEnabled: typeof settings?.bgmEnabled === "boolean" ? settings.bgmEnabled : defaultAudioSettings.bgmEnabled,
    seEnabled: typeof settings?.seEnabled === "boolean" ? settings.seEnabled : defaultAudioSettings.seEnabled,
    bgmVolume: clamp(Number(settings?.bgmVolume ?? defaultAudioSettings.bgmVolume), 0, 1),
    seVolume: clamp(Number(settings?.seVolume ?? defaultAudioSettings.seVolume), 0, 1)
  };
}

function normalizeAnimal(animal) {
  const type = getAnimalType(animal.type) || animalTypes[0];
  return { id: animal.id || generateId(), type: type.id, name: animal.name || type.label, hunger: clamp(Number(animal.hunger) || 70), thirst: clamp(Number(animal.thirst) || 70), health: clamp(Number(animal.health) || 90), affection: clamp(Number(animal.affection) || 10, -40, 120), careDays: Math.max(0, Number(animal.careDays) || 0), status: animal.status || "active", createdAt: animal.createdAt || new Date().toISOString(), leftAt: animal.leftAt || "", lastDecayDate: animal.lastDecayDate || todayKey(), lastFedDate: animal.lastFedDate || "", lastWateredDate: animal.lastWateredDate || "", lastCaredDate: animal.lastCaredDate || "", dailyCompleteDate: animal.dailyCompleteDate || "" };
}

function normalizeCouponTemplates(templates) {
  const source = Array.isArray(templates) && templates.length ? templates : defaultCouponTemplates;
  const normalized = source.map((item) => ({ title: String(item?.title || "").trim(), description: String(item?.description || "").trim() })).filter((item) => item.title && item.description);
  return normalized.length ? normalized : defaultCouponTemplates.map((item) => ({ ...item }));
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function render() {
  const stats = getStats();
  renderShell(stats); renderTabs(); renderMissions(); renderFarmDetail(); renderShop(stats); renderCoupons(); renderAlbum(); renderCalendar(); renderSettings(); renderGuardianStatus();
}

function renderShell(stats) {
  els.todayLabel.textContent = formatDate(todayKey());
  els.coinsValue.textContent = stats.coinBalance;
  els.feedValue.textContent = state.inventory.feed;
  els.waterValue.textContent = state.inventory.water;
  els.animalCountValue.textContent = stats.activeAnimals.length;
  els.progressFill.style.width = `${stats.todayPercent}%`;
  els.progressText.textContent = `${stats.completedToday}/${stats.enabledTasks.length} できた・全部で ${FULL_DAY_COIN_BONUS} コインボーナス`;
  if (!stats.activeAnimals.length) els.heroMessage.textContent = "まずはミッションでコインを集めて、どうぶつを迎えよう";
  else if (stats.needsCareCount) els.heroMessage.textContent = `${stats.needsCareCount}匹がお世話を待っています`;
  else els.heroMessage.textContent = "牧場はいい感じ。今日も続けよう";
  renderFarmScene(stats.activeAnimals);
}

function renderFarmScene(activeAnimals) {
  els.farmScene.style.backgroundImage = `url("${assetPath(getFarmBackground(activeAnimals.length > 0))}")`;
  if (!activeAnimals.length) {
    selectedAnimalIndex = 0;
    els.farmScene.innerHTML = `<div class="farm-empty">柵の中はまだ空っぽです。<br>どうぶつガチャで出会いましょう。</div>${farmFence()}`;
    return;
  }
  selectedAnimalIndex = Math.max(0, Math.min(selectedAnimalIndex, activeAnimals.length - 1));
  const animal = activeAnimals[selectedAnimalIndex];
  els.farmScene.innerHTML = `${farmCounter(selectedAnimalIndex + 1, activeAnimals.length)}<div class="animal-display">${animalArt(animal.type, getAnimalImageState(animal), animal.name)}</div>${farmFence()}<div class="farm-name-label">${escapeHtml(animal.name)}</div>`;
}

function renderTabs() {
  const hasAlbum = state.album.length > 0;
  if (activeView === "album" && !hasAlbum) activeView = "missions";
  document.querySelectorAll(".tab").forEach((button) => {
    button.hidden = button.dataset.view === "album" && !hasAlbum;
    button.classList.toggle("active", button.dataset.view === activeView);
  });
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === `${activeView}View`));
  document.querySelectorAll(".category-tab").forEach((button) => button.classList.toggle("active", button.dataset.category === activeCategory));
}

function renderMissions() {
  const category = categories[activeCategory];
  const tasks = getTasksByCategory(activeCategory);
  const doneCount = tasks.filter((task) => isDone(todayKey(), task.id)).length;
  els.categoryEyebrow.textContent = category.eyebrow;
  els.categoryTitle.textContent = category.title;
  els.categoryProgress.textContent = `${doneCount}/${tasks.length}`;
  els.taskList.innerHTML = "";
  if (!tasks.length) { els.taskList.append(emptyMessage("保護者メニューからミッションを追加できます")); return; }
  tasks.forEach((task) => {
    const done = isDone(todayKey(), task.id);
    const button = document.createElement("button");
    button.className = `task-card${done ? " done" : ""}`;
    button.type = "button";
    button.setAttribute("aria-pressed", String(done));
    button.innerHTML = `<span class="check-mark" aria-hidden="true">✓</span><span class="task-title">${escapeHtml(task.title)}</span><span class="task-points">${task.coins}コイン</span>`;
    button.addEventListener("click", () => toggleTask(task));
    els.taskList.append(button);
  });
}
function renderFarmDetail() {
  const animals = getActiveAnimals();
  if (!animals.length) { els.animalDetail.innerHTML = `<div class="helper-text">まだどうぶつがいません。どうぶつガチャで出会うと、ここでお世話できます。</div>`; return; }
  const animal = animals[Math.min(selectedAnimalIndex, animals.length - 1)];
  const animalType = getAnimalType(animal.type);
  const mood = getAnimalMood(animal);
  const inventoryText = supplies.map((supply) => `${supply.label}: ${state.inventory[supply.id] || 0}`).join(" / ");
  els.animalDetail.innerHTML = `
    <div class="animal-profile">
      <div class="animal-portrait">${animalArt(animal.type, getAnimalImageState(animal), animal.name)}</div>
      <div class="section-head compact"><div><p class="eyebrow">${escapeHtml(animalType.label)}</p><h2>${escapeHtml(animal.name)}</h2></div><span class="pill">${mood.label}</span></div>
    </div>
    <form class="animal-name-form" id="animalNameForm">
      <label for="animalNameInput">どうぶつの名前
        <input id="animalNameInput" name="animalName" type="text" maxlength="${MAX_ANIMAL_NAME_LENGTH}" autocomplete="off" value="${escapeHtml(animal.name)}">
      </label>
      <button class="secondary-button" type="submit">名前を保存</button>
    </form>
    <div class="animal-status-grid">${statusCard("お腹", animal.hunger)}${statusCard("水分", animal.thirst)}${statusCard("体調", animal.health)}${statusCard("なつき", animal.affection, 120)}</div>
    <p class="helper-text">${escapeHtml(mood.message)}</p>
    <div class="care-actions">
      ${careActionButton("feed", `えさ (${state.inventory.feed || 0})`, "primary-button")}
      ${careActionButton("water", `水 (${state.inventory.water || 0})`, "primary-button")}
      ${careActionButton("care", "なでる", "secondary-button")}
      ${careActionButton("premiumFeed", `特別えさ (${state.inventory.premiumFeed || 0})`, "secondary-button")}
      ${careActionButton("medicine", `薬 (${state.inventory.medicine || 0})`, "secondary-button")}
      ${careActionButton("brush", `ブラシ (${state.inventory.brush || 0})`, "secondary-button")}
      ${careActionButton("toyBall", `ボール (${state.inventory.toyBall || 0})`, "secondary-button")}
      ${careActionButton("animalBed", `ベッド (${state.inventory.animalBed || 0})`, "secondary-button")}
    </div>
    <p class="helper-text">持ちもの: ${escapeHtml(inventoryText)}</p>
    <p class="helper-text">連続お世話記録: ${animal.careDays}日 / なかよし目標: 7日以上・なつき100</p>`;
  const nameForm = els.animalDetail.querySelector("#animalNameForm");
  nameForm.addEventListener("submit", (event) => { event.preventDefault(); renameAnimal(animal.id); });
  document.querySelectorAll("[data-care-action]").forEach((button) => button.addEventListener("click", () => careAnimal(animal.id, button.dataset.careAction)));
}

function statusCard(label, value, max = 100) {
  const percent = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return `<article class="status-card">${assetImage(statusIcon(label), "", "status-icon")}<span class="stat-label">${label}</span><strong>${Math.round(value)}</strong><div class="meter"><div class="meter-track"><span style="width:${percent}%"></span></div></div></article>`;
}

function renderShop(stats) {
  els.gachaCoins.textContent = `${stats.coinBalance}コイン`;
  els.shopCoins.textContent = `${stats.coinBalance}コイン`;
  els.animalGachaPanel.innerHTML = `
    <div class="gacha-machine" aria-hidden="true"></div>
    <div>
      <p class="eyebrow">1回 ${ANIMAL_GACHA_COST}コイン</p>
      <h2>どうぶつと出会う</h2>
      <p class="helper-text">どのどうぶつが来るかはお楽しみ。レアリティが高いほど出会いにくくなります。</p>
    </div>
    <button class="primary-button gacha-draw-button" id="animalGachaButton" type="button"${stats.coinBalance < ANIMAL_GACHA_COST ? " disabled" : ""}>ガチャをまわす</button>`;
  els.animalGachaPanel.querySelector("#animalGachaButton").addEventListener("click", drawAnimalGacha);
  els.animalShopGrid.innerHTML = "";
  animalTypes.forEach((type) => {
    const rarity = getRarityInfo(type.rarity);
    const card = document.createElement("article");
    card.className = "shop-card";
    card.innerHTML = `<div class="shop-art">${animalArt(type.id, "normal", type.label)}</div><div><span class="rarity-badge rarity-${escapeHtml(type.rarity)}">${escapeHtml(rarity.label)}</span><strong>${type.label}</strong><span>${escapeHtml(type.description)}</span></div>`;
    els.animalShopGrid.append(card);
  });
  els.supplyShopGrid.innerHTML = "";
  supplies.forEach((supply) => {
    const card = document.createElement("article");
    card.className = "shop-card";
    card.innerHTML = `<div class="shop-art">${assetImage(supply.image, supply.label, "shop-image")}</div><div><strong>${supply.label} ${supply.unit}</strong><span>${supply.price}コイン・${supply.description}</span></div>`;
    const button = document.createElement("button");
    button.className = "primary-button"; button.type = "button"; button.textContent = stats.coinBalance >= supply.price ? "買う" : "コイン不足"; button.disabled = stats.coinBalance < supply.price;
    button.addEventListener("click", () => buySupply(supply.id));
    card.append(button); els.supplyShopGrid.append(card);
  });
  els.futureIdeaGrid.innerHTML = futureIdeas.map((idea) => `<article class="idea-card"><div class="idea-art">${assetImage(idea.image, idea.title, "idea-image")}</div><strong>${escapeHtml(idea.title)}</strong><span>${escapeHtml(idea.description)}</span></article>`).join("");
}

function renderCoupons() {
  els.couponGrid.innerHTML = "";
  const hasCoupons = state.coupons.length > 0;
  els.couponEyebrow.textContent = hasCoupons ? "プレゼント" : "ひみつ";
  els.couponTitle.textContent = hasCoupons ? "もらったもの" : "まだなにもありません";
  if (!hasCoupons) { els.couponGrid.append(emptyMessage("どうぶつと仲良くなると、いいことがあるかも")); return; }
  state.coupons.forEach((coupon) => {
    const item = document.createElement("article");
    item.className = `coupon-ticket earned${coupon.usedAt ? " used" : ""}`;
    item.innerHTML = `<span class="coupon-kicker">${escapeHtml(coupon.fromAnimal)}からのお礼</span><strong>${escapeHtml(coupon.title)}</strong><span>${escapeHtml(coupon.description)}</span><small>${formatDate(coupon.createdDate)}</small>`;
    const button = document.createElement("button");
    button.className = coupon.usedAt ? "secondary-button" : "primary-button"; button.type = "button"; button.textContent = coupon.usedAt ? "未使用に戻す" : "使った";
    button.addEventListener("click", () => toggleCouponUsed(coupon.id));
    item.append(button); els.couponGrid.append(item);
  });
}

function renderAlbum() {
  els.albumGrid.innerHTML = "";
  if (!state.album.length) { els.albumGrid.append(emptyMessage("記録はまだありません")); return; }
  [...state.album].reverse().forEach((record) => {
    const item = document.createElement("article");
    item.className = "album-card";
    item.innerHTML = `<div class="album-snapshot">${animalArt(record.type, getAlbumImageState(record), record.name)}</div><div><strong>${escapeHtml(record.name)}</strong><span>${escapeHtml(record.reason)}・${formatDate(record.date)}</span></div><p class="helper-text">${escapeHtml(record.note)}</p>`;
    els.albumGrid.append(item);
  });
}

function renderCalendar() {
  els.calendarGrid.innerHTML = "";
  lastDates(14).forEach((date) => {
    const summary = getDaySummary(date);
    const item = document.createElement("article");
    item.className = `calendar-day ${summary.className}`;
    item.innerHTML = `${calendarStamp(summary.className)}<strong>${formatShortDate(date)}</strong><span>${summary.label}</span>`;
    els.calendarGrid.append(item);
  });
}

function renderSettings() {
  renderAudioSettings();
  renderCouponSettings();
  els.settingsList.innerHTML = "";
  state.tasks.filter((task) => task.enabled).sort(sortTasks).forEach((task) => {
    const item = document.createElement("article"); item.className = "settings-item";
    item.innerHTML = `<div><strong>${escapeHtml(task.title)}</strong><span>${categories[task.category].label}・${task.coins}コイン</span></div><div class="settings-actions"><button type="button">編集</button><button type="button">削除</button></div>`;
    const [editButton, deleteButton] = item.querySelectorAll("button");
    editButton.addEventListener("click", () => editTask(task.id)); deleteButton.addEventListener("click", () => deleteTask(task.id));
    els.settingsList.append(item);
  });
}

function renderAudioSettings() {
  els.bgmEnabled.checked = state.audioSettings.bgmEnabled;
  els.seEnabled.checked = state.audioSettings.seEnabled;
  els.bgmVolume.value = Math.round(state.audioSettings.bgmVolume * 100);
  els.seVolume.value = Math.round(state.audioSettings.seVolume * 100);
}

function renderCouponSettings() {
  els.couponSettingsList.innerHTML = "";
  state.couponTemplates.forEach((coupon, index) => {
    const item = document.createElement("article"); item.className = "settings-item";
    item.innerHTML = `<div><strong>${escapeHtml(coupon.title)}</strong><span>${escapeHtml(coupon.description)}</span></div><div class="settings-actions"><button type="button">編集</button><button type="button">削除</button></div>`;
    const [editButton, deleteButton] = item.querySelectorAll("button");
    editButton.addEventListener("click", () => editCouponTemplate(index)); deleteButton.addEventListener("click", () => deleteCouponTemplate(index));
    els.couponSettingsList.append(item);
  });
}

function renderGuardianStatus() {
  els.guardianStatus.textContent = state.guardianCodeHash ? "設定済みです。チェック取り消し、クーポン使用、設定変更には承認が必要です。" : "未設定です。最初に4文字以上の保護者コードを設定してください。";
  els.currentGuardianCode.disabled = !state.guardianCodeHash;
}
function toggleTask(task) {
  if (isDone(todayKey(), task.id)) requestGuardianApproval(`${task.title}を未完了に戻します。`, () => applyTaskToggle(task));
  else applyTaskToggle(task);
}

function applyTaskToggle(task) {
  const date = todayKey(); state.checks[date] ||= {};
  const enabledTasks = state.tasks.filter((item) => item.enabled);
  const doneBefore = enabledTasks.filter((item) => isDone(date, item.id)).length;
  const wasFullDay = isFullDay(date, enabledTasks);
  if (state.checks[date][task.id]) { delete state.checks[date][task.id]; showToast("チェックを戻しました"); }
  else {
    state.checks[date][task.id] = new Date().toISOString();
    showToast(`${task.title} できた！ ${task.coins}コイン`);
    playSe("complete");
    if (doneBefore === 0) playSe("stamp");
    if (!wasFullDay && isFullDay(date, enabledTasks)) playSe("allClear");
  }
  saveState(); render();
}

function drawAnimalGacha() {
  if (gachaAnimation.phase !== "idle") return;
  if (getStats().coinBalance < ANIMAL_GACHA_COST) { showToast("コインが足りません"); return; }
  const button = document.querySelector("#animalGachaButton");
  button?.classList.add("gacha-button-press");
  els.animalGachaPanel.classList.add("shaking");
  const type = pickGachaAnimal();
  const isNew = !hasKnownAnimalType(type.id);
  state.spentCoins += ANIMAL_GACHA_COST;
  const animal = addAnimalToFarm(type);
  saveState();
  startGachaAnimation({ animal, type, isNew, rarity: getRarityInfo(type.rarity) }, button);
}

function addAnimalToFarm(type) {
  const count = state.animals.filter((animal) => animal.type === type.id).length + 1;
  const animal = normalizeAnimal({ id: generateId(), type: type.id, name: `${type.label}${count}`, hunger: 75, thirst: 75, health: 90, affection: 15, createdAt: new Date().toISOString(), lastDecayDate: todayKey() });
  state.animals.push(animal);
  selectedAnimalIndex = getActiveAnimals().length - 1;
  return animal;
}

function startGachaAnimation(result, button) {
  clearGachaTimers();
  gachaAnimation = { phase: "press", result, timers: [], button, revealed: false };
  setBgmDucked(true);
  playSe("gachaStart");
  renderGachaAnimation();
  gachaPhaseTimeline.forEach(({ phase, at }) => {
    const timer = setTimeout(() => setGachaPhase(phase), at);
    gachaAnimation.timers.push(timer);
  });
}

function setGachaPhase(phase) {
  if (gachaAnimation.phase === "idle") return;
  gachaAnimation.phase = phase;
  if (phase === "silhouette" && !gachaAnimation.revealed) {
    gachaAnimation.revealed = true;
    playSe("gachaOpen");
    playSe(gachaAnimation.result.rarity.se);
  }
  if (phase === "result") setBgmDucked(false);
  renderGachaAnimation();
}

function finishGachaAnimation() {
  if (gachaAnimation.phase === "idle") return;
  clearGachaTimers();
  if (!gachaAnimation.revealed) {
    gachaAnimation.revealed = true;
    playSe("gachaOpen");
    playSe(gachaAnimation.result.rarity.se);
  }
  gachaAnimation.phase = "result";
  setBgmDucked(false);
  renderGachaAnimation();
}

function closeGachaAnimation(nextView = "farm") {
  clearGachaTimers();
  gachaAnimation.button?.classList.remove("gacha-button-press");
  els.animalGachaPanel.classList.remove("shaking");
  gachaAnimation = { phase: "idle", result: null, timers: [], button: null, revealed: false };
  setBgmDucked(false);
  els.gachaOverlay.hidden = true;
  els.gachaOverlay.innerHTML = "";
  activeView = nextView;
  render();
}

function handleGachaOverlayClick(event) {
  const button = event.target.closest("[data-gacha-action]");
  if (!button) return;
  const action = button.dataset.gachaAction;
  if (action === "skip") { finishGachaAnimation(); return; }
  if (action === "register") { showToast("ずかんにとうろくしました"); closeGachaAnimation("farm"); return; }
  if (action === "again") {
    closeGachaAnimation("gacha");
    if (getStats().coinBalance < ANIMAL_GACHA_COST) { showToast("コインが足りません"); return; }
    setTimeout(drawAnimalGacha, 0);
    return;
  }
  closeGachaAnimation("farm");
}

function renderGachaAnimation() {
  const { phase, result } = gachaAnimation;
  if (phase === "idle" || !result) { els.gachaOverlay.hidden = true; return; }
  const rarityClass = result.rarity.animation;
  const phaseClass = `phase-${phase}`;
  els.gachaOverlay.hidden = false;
  els.gachaOverlay.innerHTML = `
    <div class="gacha-stage ${rarityClass} ${phaseClass}" role="dialog" aria-modal="true" aria-label="どうぶつガチャの結果">
      ${phase === "result" ? "" : '<button class="gacha-skip" type="button" data-gacha-action="skip">スキップ</button>'}
      <div class="gacha-light"></div>
      <div class="gacha-burst"></div>
      <div class="gacha-sparkles">${gachaSparkles(result.rarity)}</div>
      <div class="gacha-particles">${gachaParticles(result.rarity, phase)}</div>
      <div class="gacha-message">${gachaMessage(phase)}</div>
      ${gachaCapsule(phase)}
      ${gachaOpenCapsule(phase)}
      ${gachaAnimalReveal(result, phase)}
      ${gachaResultPanel(result, phase)}
    </div>`;
}

function gachaMessage(phase) {
  const messages = {
    press: ["どうぶつガチャ", "ボタンをおした！"],
    shake: ["どうぶつガチャ", "ガチャガチャ..."],
    fly: ["どうぶつガチャ", "カプセルがとびだした！"],
    charge: ["どうぶつガチャ", "もうすぐあくよ..."],
    silhouette: ["だれかな？", "すこしだけ見えてきた！"],
    reveal: ["やったね！", "どうぶつがあらわれた！"],
    result: ["であえたよ", "牧場にあたらしい仲間！"]
  }[phase] || ["どうぶつガチャ", "わくわく"];
  return `<p class="eyebrow">${messages[0]}</p><h2>${messages[1]}</h2>`;
}

function gachaCapsule(phase) {
  return ["press", "shake", "fly", "charge"].includes(phase) ? '<div class="gacha-capsule" aria-hidden="true"></div>' : "";
}

function gachaOpenCapsule(phase) {
  return ["silhouette", "reveal", "result"].includes(phase) ? '<div class="gacha-open-capsule" aria-hidden="true"><span></span><span></span></div>' : "";
}

function gachaAnimalReveal(result, phase) {
  if (!["silhouette", "reveal", "result"].includes(phase)) return "";
  const revealClass = phase === "silhouette" ? "gacha-silhouette" : "gacha-reveal";
  const newBadge = result.isNew && phase !== "silhouette" ? '<div class="new-badge">NEW!</div>' : "";
  return `<div class="gacha-animal-wrap ${revealClass}">${newBadge}${animalArt(result.type.id, "happy", result.animal.name).replace("farm-animal", "gacha-animal")}</div>`;
}

function gachaResultPanel(result, phase) {
  if (phase !== "result") return "";
  const againDisabled = getStats().coinBalance < ANIMAL_GACHA_COST ? " disabled" : "";
  return `
    <div class="gacha-result">
      <span class="gacha-rarity ${result.rarity.animation}">${escapeHtml(result.rarity.label)}</span>
      <h2>${escapeHtml(result.animal.name)}</h2>
      <p class="helper-text">${escapeHtml(result.type.description)}</p>
      <div class="gacha-actions">
        <button class="secondary-button" type="button" data-gacha-action="register">ずかんにとうろく</button>
        <button class="secondary-button" type="button" data-gacha-action="again"${againDisabled}>もういちど</button>
        <button class="primary-button" type="button" data-gacha-action="ok">OK</button>
      </div>
    </div>`;
}

function gachaSparkles(rarity) {
  const count = { normal: 12, rare: 18, superRare: 24, secret: 32 }[rarity.animation] || 12;
  return Array.from({ length: count }, (_, index) => {
    const x = 8 + ((index * 37) % 84);
    const y = 10 + ((index * 53) % 78);
    const size = 5 + (index % 4) * 2;
    const delay = (index % 8) * 0.16;
    return `<span class="sparkle" style="--x:${x}%;--y:${y}%;--s:${size}px;--d:${delay}s"></span>`;
  }).join("");
}

function gachaParticles(rarity, phase) {
  if (!["silhouette", "reveal", "result"].includes(phase)) return "";
  const shapes = rarity.animation === "normal" ? ["★", "♡"] : rarity.animation === "rare" ? ["★", "✦", "♡"] : ["★", "✦", "♡", "◆"];
  const colors = rarity.animation === "secret" ? ["#ff6fa4", "#43a4ff", "#f0b84a", "#55a86a"] : rarity.animation === "superRare" ? ["#43a4ff", "#ff8fc4", "#f0b84a"] : rarity.animation === "rare" ? ["#f0b84a", "#fff3a8", "#e56f5e"] : ["#f0b84a", "#74b978"];
  const count = { normal: 18, rare: 26, superRare: 34, secret: 44 }[rarity.animation] || 18;
  return Array.from({ length: count }, (_, index) => {
    const x = 9 + ((index * 29) % 84);
    const y = 56 + ((index * 17) % 26);
    const size = 14 + (index % 5) * 3;
    const delay = (index % 12) * 0.08;
    const shape = shapes[index % shapes.length];
    const color = colors[index % colors.length];
    return `<span class="particle" style="--x:${x}%;--y:${y}%;--s:${size}px;--d:${delay}s;--c:${color}">${shape}</span>`;
  }).join("");
}

function clearGachaTimers() {
  gachaAnimation.timers.forEach((timer) => clearTimeout(timer));
  gachaAnimation.timers = [];
}

function hasKnownAnimalType(typeId) {
  return state.animals.some((animal) => animal.type === typeId) || state.album.some((record) => record.type === typeId);
}

function renameAnimal(id) {
  const animal = state.animals.find((item) => item.id === id && item.status === "active"); if (!animal) return;
  const input = els.animalDetail.querySelector("#animalNameInput");
  const nextName = input?.value.trim() || "";
  if (!nextName) { showToast("名前を入力してください"); input?.focus(); return; }
  if (nextName.length > MAX_ANIMAL_NAME_LENGTH) { showToast(`名前は${MAX_ANIMAL_NAME_LENGTH}文字以内にしてください`); input?.focus(); return; }
  if (nextName === animal.name) { showToast("名前はそのままです"); return; }
  requestGuardianApproval(`${animal.name}の名前を${nextName}に変更します。`, () => {
    animal.name = nextName;
    saveState(); showToast("名前を保存しました"); render();
  });
}

function buySupply(id) {
  const supply = supplies.find((item) => item.id === id); if (!supply) return;
  if (getStats().coinBalance < supply.price) { showToast("コインが足りません"); return; }
  state.spentCoins += supply.price; state.inventory[id] = (state.inventory[id] || 0) + supply.amount;
  saveState(); showToast(`${supply.label}を${supply.amount}こ買いました`); render();
}

function careAnimal(id, action) {
  const animal = state.animals.find((item) => item.id === id && item.status === "active"); if (!animal) return;
  const today = todayKey();
  if (action === "feed") {
    if (state.inventory.feed <= 0) { showToast("えさがありません。ショップで用意しましょう"); return; }
    if (animal.hunger >= 100) { showToast("もうお腹いっぱいです"); return; }
    state.inventory.feed -= 1; animal.hunger = clamp(animal.hunger + 35); animal.health = clamp(animal.health + 4); animal.affection = clamp(animal.affection + 4, -40, 120); animal.lastFedDate = today; showToast(`${animal.name}にえさをあげました`);
  }
  if (action === "water") {
    if (state.inventory.water <= 0) { showToast("水がありません。ショップで用意しましょう"); return; }
    if (animal.thirst >= 100) { showToast("水は十分です"); return; }
    state.inventory.water -= 1; animal.thirst = clamp(animal.thirst + 35); animal.health = clamp(animal.health + 4); animal.affection = clamp(animal.affection + 3, -40, 120); animal.lastWateredDate = today; showToast(`${animal.name}に水をあげました`);
  }
  if (action === "care") {
    if (animal.lastCaredDate === today) { showToast("今日はもうたくさんなでました"); return; }
    animal.health = clamp(animal.health + 3); animal.affection = clamp(animal.affection + 10, -40, 120); animal.lastCaredDate = today; showToast(`${animal.name}をなでました`);
  }
  if (action === "premiumFeed") {
    if ((state.inventory.premiumFeed || 0) <= 0) { showToast("特別えさがありません。ショップで用意しましょう"); return; }
    state.inventory.premiumFeed -= 1; animal.hunger = clamp(animal.hunger + 55); animal.health = clamp(animal.health + 8); animal.affection = clamp(animal.affection + 12, -40, 120); animal.lastFedDate = today; showToast(`${animal.name}に特別えさをあげました`);
  }
  if (action === "medicine") {
    if ((state.inventory.medicine || 0) <= 0) { showToast("元気の薬がありません"); return; }
    if (animal.health >= 100) { showToast("体調は十分よさそうです"); return; }
    state.inventory.medicine -= 1; animal.health = clamp(animal.health + 38); animal.affection = clamp(animal.affection + 3, -40, 120); showToast(`${animal.name}の体調が回復しました`);
  }
  if (action === "brush") {
    if ((state.inventory.brush || 0) <= 0) { showToast("ブラシがありません"); return; }
    if (animal.lastCaredDate === today) { showToast("今日はもう十分お世話しました"); return; }
    state.inventory.brush -= 1; animal.health = clamp(animal.health + 5); animal.affection = clamp(animal.affection + 16, -40, 120); animal.lastCaredDate = today; showToast(`${animal.name}をブラッシングしました`);
  }
  if (action === "toyBall") {
    if ((state.inventory.toyBall || 0) <= 0) { showToast("あそびボールがありません"); return; }
    if (animal.lastCaredDate === today) { showToast("今日はもう十分遊びました"); return; }
    state.inventory.toyBall -= 1; animal.health = clamp(animal.health + 4); animal.affection = clamp(animal.affection + 18, -40, 120); animal.lastCaredDate = today; showToast(`${animal.name}とボールで遊びました`);
  }
  if (action === "animalBed") {
    if ((state.inventory.animalBed || 0) <= 0) { showToast("ふかふかベッドがありません"); return; }
    if (animal.health >= 100) { showToast("もう元気いっぱいです"); return; }
    state.inventory.animalBed -= 1; animal.health = clamp(animal.health + 28); animal.affection = clamp(animal.affection + 5, -40, 120); showToast(`${animal.name}を休ませました`);
  }
  checkDailyCareComplete(animal);
  checkAnimalGratitude(animal);
  saveState(); render();
}

function checkDailyCareComplete(animal) {
  const today = todayKey();
  if (animal.dailyCompleteDate === today) return;
  if (animal.lastFedDate === today && animal.lastWateredDate === today && animal.lastCaredDate === today) {
    animal.dailyCompleteDate = today; animal.careDays += 1; animal.affection = clamp(animal.affection + 8, -40, 120); animal.health = clamp(animal.health + 5);
    showToast(`${animal.name}とのきずなが深まりました`);
  }
}

function checkAnimalGratitude(animal) {
  if (animal.status !== "active") return;
  if (animal.careDays >= 7 && animal.affection >= 100 && animal.health >= 75) {
    const template = state.couponTemplates[state.coupons.length % state.couponTemplates.length];
    const coupon = { id: generateId(), title: `${animal.name}からの${template.title}`, description: template.description, fromAnimal: animal.name, createdDate: todayKey(), usedAt: "" };
    state.coupons.push(coupon);
    addAlbum(animal, "恩返し", `${coupon.title}を残して旅立ちました。`, "farewell");
    animal.status = "grateful"; animal.leftAt = new Date().toISOString();
    playSe("reward");
    showToast(`${animal.name}が恩返しクーポンをくれました`);
  }
}

function applyDailyDecay() {
  const today = todayKey(); let changed = false;
  state.animals.forEach((animal) => {
    if (animal.status !== "active") return;
    const days = daysBetween(animal.lastDecayDate || today, today);
    if (days <= 0) return;
    animal.hunger = clamp(animal.hunger - 18 * days);
    animal.thirst = clamp(animal.thirst - 22 * days);
    animal.affection = clamp(animal.affection - 5 * days, -40, 120);
    if (animal.hunger < 35 || animal.thirst < 35) animal.health = clamp(animal.health - 13 * days);
    if (animal.health <= 0 || animal.affection <= -25) {
      animal.status = "escaped"; animal.leftAt = new Date().toISOString();
      addAlbum(animal, "お別れ", "お世話が足りず、牧場からいなくなりました。", animal.health <= 0 ? "sick" : "wary");
    }
    animal.lastDecayDate = today; changed = true;
  });
  if (changed) saveState();
}

function addAlbum(animal, reason, note, imageState = "normal") {
  if (state.album.some((item) => item.animalId === animal.id && item.reason === reason)) return;
  state.album.push({ id: generateId(), animalId: animal.id, type: animal.type, imageState, name: animal.name, reason, note, date: todayKey() });
}

function toggleCouponUsed(id) {
  const coupon = state.coupons.find((item) => item.id === id); if (!coupon) return;
  requestGuardianApproval(`${coupon.title}を${coupon.usedAt ? "未使用に戻します" : "使用済みにします"}。`, () => {
    coupon.usedAt = coupon.usedAt ? "" : new Date().toISOString(); saveState(); showToast(coupon.usedAt ? "クーポンを使用済みにしました" : "クーポンを未使用に戻しました"); render();
  });
}
function saveTask() {
  const title = els.taskTitle.value.trim(); if (!title) return;
  const id = els.taskId.value; const category = els.taskCategory.value; const coins = Math.max(0, Math.min(300, Number(els.taskCoins.value) || 0));
  requestGuardianApproval(id ? "ミッションを更新します。" : "ミッションを追加します。", () => {
    if (id) { const task = state.tasks.find((item) => item.id === id); if (task) Object.assign(task, { title, category, coins }); showToast("ミッションを更新しました"); }
    else { state.tasks.push({ id: generateId(), title, category, coins, order: nextOrder(category), enabled: true }); showToast("ミッションを追加しました"); }
    clearTaskForm(); saveState(); render();
  });
}

function editTask(id) { const task = state.tasks.find((item) => item.id === id); if (!task) return; els.taskId.value = task.id; els.taskTitle.value = task.title; els.taskCategory.value = task.category; els.taskCoins.value = task.coins; els.taskTitle.focus(); }
function deleteTask(id) { const task = state.tasks.find((item) => item.id === id); if (!task) return; requestGuardianApproval(`${task.title}を削除します。`, () => { task.enabled = false; saveState(); showToast("ミッションを削除しました"); render(); }); }
function clearTaskForm() { els.taskId.value = ""; els.taskTitle.value = ""; els.taskCategory.value = activeCategory; els.taskCoins.value = 20; }

function saveCouponTemplate() {
  const indexValue = els.couponTemplateIndex.value; const title = els.couponTemplateTitle.value.trim(); const description = els.couponTemplateDescription.value.trim();
  if (!title || !description) { showToast("クーポン名と内容を入力してください"); return; }
  requestGuardianApproval(indexValue === "" ? "クーポン内容を追加します。" : "クーポン内容を更新します。", () => {
    const coupon = { title, description };
    if (indexValue === "") state.couponTemplates.push(coupon); else state.couponTemplates[Number(indexValue)] = coupon;
    clearCouponForm(); saveState(); showToast("クーポン内容を保存しました"); render();
  });
}
function editCouponTemplate(index) { const coupon = state.couponTemplates[index]; if (!coupon) return; els.couponTemplateIndex.value = index; els.couponTemplateTitle.value = coupon.title; els.couponTemplateDescription.value = coupon.description; els.couponTemplateTitle.focus(); }
function deleteCouponTemplate(index) { const coupon = state.couponTemplates[index]; if (!coupon) return; requestGuardianApproval(`${coupon.title}を削除します。`, () => { if (state.couponTemplates.length <= 1) { showToast("クーポン内容は1つ以上必要です"); return; } state.couponTemplates.splice(index, 1); clearCouponForm(); saveState(); render(); }); }
function clearCouponForm() { els.couponTemplateIndex.value = ""; els.couponTemplateTitle.value = ""; els.couponTemplateDescription.value = ""; }

function changeGuardianCode() {
  const currentCode = els.currentGuardianCode.value.trim(); const nextCode = els.newGuardianCode.value.trim();
  if (!isValidGuardianCode(nextCode)) { showToast("新しいコードは4文字以上で入力してください"); return; }
  if (state.guardianCodeHash && !verifyGuardianCode(currentCode)) { showToast("現在の保護者コードが違います"); return; }
  state.guardianCodeHash = hashGuardianCode(nextCode); els.currentGuardianCode.value = ""; els.newGuardianCode.value = ""; saveState(); renderGuardianStatus(); showToast("保護者コードを保存しました");
}

function requestGuardianApproval(message, onApproved) { pendingGuardianAction = onApproved; guardianMode = state.guardianCodeHash ? "verify" : "setup"; openGuardianModal(message); }
function openGuardianModal(message) { const setup = guardianMode === "setup"; els.guardianTitle.textContent = setup ? "保護者コードを設定" : "保護者の承認"; els.guardianMessage.textContent = setup ? `${message} 初回は、保護者が4文字以上のコードを設定してください。` : message; els.guardianCodeLabel.hidden = setup; els.guardianNewCodeLabel.hidden = !setup; els.guardianError.textContent = ""; els.guardianCodeInput.value = ""; els.guardianNewCodeInput.value = ""; els.guardianModal.hidden = false; setTimeout(() => (setup ? els.guardianNewCodeInput : els.guardianCodeInput).focus(), 0); }
function approveGuardianAction() { if (guardianMode === "setup") { const code = els.guardianNewCodeInput.value.trim(); if (!isValidGuardianCode(code)) { els.guardianError.textContent = "コードは4文字以上で入力してください。"; return; } state.guardianCodeHash = hashGuardianCode(code); saveState(); closeGuardianModal(false); renderGuardianStatus(); runPendingGuardianAction(); return; } if (!verifyGuardianCode(els.guardianCodeInput.value.trim())) { els.guardianError.textContent = "保護者コードが違います。"; els.guardianCodeInput.select(); return; } closeGuardianModal(false); runPendingGuardianAction(); }
function closeGuardianModal(clearPending = true) { els.guardianModal.hidden = true; els.guardianError.textContent = ""; els.guardianCodeInput.value = ""; els.guardianNewCodeInput.value = ""; if (clearPending) pendingGuardianAction = null; }
function runPendingGuardianAction() { const action = pendingGuardianAction; pendingGuardianAction = null; if (typeof action === "function") action(); }
function isValidGuardianCode(code) { return code.length >= 4 && code.length <= 12; }
function verifyGuardianCode(code) { return Boolean(state.guardianCodeHash) && hashGuardianCode(code) === state.guardianCodeHash; }
function hashGuardianCode(code) { const text = `routine-guardian:${code}`; let hash = 2166136261; for (let i = 0; i < text.length; i += 1) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 16777619); } return (hash >>> 0).toString(16); }

function getStats() {
  const enabledTasks = state.tasks.filter((task) => task.enabled).sort(sortTasks); const today = todayKey();
  const completedToday = enabledTasks.filter((task) => isDone(today, task.id)).length; const todayPercent = enabledTasks.length ? Math.round((completedToday / enabledTasks.length) * 100) : 0;
  const totalCoins = calculateTotalCoins(enabledTasks); const coinBalance = totalCoins - state.spentCoins; const activeAnimals = getActiveAnimals();
  const needsCareCount = activeAnimals.filter((animal) => animal.lastFedDate !== today || animal.lastWateredDate !== today || animal.lastCaredDate !== today).length;
  return { enabledTasks, completedToday, todayPercent, totalCoins, coinBalance, activeAnimals, needsCareCount };
}

function calculateTotalCoins(tasks) { return Object.keys(state.checks).reduce((sum, date) => { const daily = tasks.reduce((taskSum, task) => taskSum + (isDone(date, task.id) ? task.coins : 0), 0); return sum + daily + (isFullDay(date, tasks) ? FULL_DAY_COIN_BONUS : 0); }, 0); }
function isFullDay(date, tasks) { return tasks.length > 0 && tasks.every((task) => isDone(date, task.id)); }
function isDone(date, taskId) { return Boolean(state.checks[date]?.[taskId]); }
function getDaySummary(date) { const tasks = state.tasks.filter((task) => task.enabled); const done = tasks.filter((task) => isDone(date, task.id)).length; if (done === 0) return { className: "", label: "まだ" }; if (done === tasks.length) return { className: "full", label: "全部できた" }; return { className: "some", label: `${done}/${tasks.length}` }; }
function getTasksByCategory(category) { return state.tasks.filter((task) => task.enabled && task.category === category).sort(sortTasks); }
function sortTasks(a, b) { if (a.category !== b.category) return Object.keys(categories).indexOf(a.category) - Object.keys(categories).indexOf(b.category); return a.order - b.order; }
function nextOrder(category) { const tasks = state.tasks.filter((task) => task.category === category); return tasks.length ? Math.max(...tasks.map((task) => task.order || 0)) + 1 : 1; }
function getActiveAnimals() { return state.animals.filter((animal) => animal.status === "active"); }
function getAnimalType(id) { return animalTypes.find((type) => type.id === id); }
function getRarityInfo(rarity) { return rarityMeta[rarity] || rarityMeta.N; }
function pickGachaAnimal() {
  const totalWeight = animalTypes.reduce((sum, type) => sum + getRarityInfo(type.rarity).weight, 0);
  let roll = Math.random() * totalWeight;
  return animalTypes.find((type) => {
    roll -= getRarityInfo(type.rarity).weight;
    return roll <= 0;
  }) || animalTypes[0];
}
function getAnimalMood(animal) { if (animal.health < 35) return { label: "体調不良", message: "体調が悪そうです。えさ、水、なでるを続けて回復させましょう。" }; if (animal.affection < 20 && (animal.hunger < 40 || animal.thirst < 40)) return { label: "警戒中", message: "少し攻撃的になっています。無理せず毎日お世話しましょう。" }; if (animal.hunger < 35 || animal.thirst < 35) return { label: "お腹ぺこぺこ", message: "えさか水が足りません。早めにお世話しましょう。" }; if (animal.affection >= 80) return { label: "なついている", message: "あなたのことが大好きです。特別ないいことがあるかもしれません。" }; return { label: "元気", message: "今日もお世話すると、もっと仲良くなれます。" }; }
function getAnimalImageState(animal) { if (animal.health < 35) return "sick"; if (animal.affection < 20 && (animal.hunger < 40 || animal.thirst < 40)) return "wary"; if (animal.hunger < 35 || animal.thirst < 35) return "hungry"; if (animal.affection >= 80) return "happy"; return "normal"; }
function getAlbumImageState(record) { if (record.imageState) return record.imageState; return record.reason === "恩返し" ? "farewell" : "wary"; }
function animalArt(type, state = "normal", alt = "") { const animal = getAnimalType(type) || animalTypes[0]; return assetImage(`animal-${animal.id}-${state}.png`, alt || animal.label, "farm-animal"); }
function farmFence() { return assetImage("farm-fence-front.png", "", "farm-fence"); }
function getFarmBackground(hasAnimals) {
  if (!hasAnimals) return "farm-empty.png";
  const hour = new Date().getHours();
  if (hour < 5 || hour >= 19) return "farm-bg-night.png";
  const month = new Date().getMonth() + 1;
  if (month <= 2 || month === 12) return "farm-bg-winter.png";
  if (month <= 5) return "farm-bg-spring.png";
  if (month <= 8) return "farm-bg-summer.png";
  return "farm-bg-autumn.png";
}
function farmCounter(current, total) { return `<div class="farm-counter" aria-label="${total}匹中${current}匹目">どうぶつ ${current} / ${total}</div>`; }
function careActionButton(action, label, className) { return `<button class="${className}" type="button" data-care-action="${escapeHtml(action)}">${escapeHtml(label)}</button>`; }
function statusIcon(label) { return { "お腹": "icon-feed.png", "水分": "icon-water.png", "体調": "icon-health.png", "なつき": "icon-heart.png" }[label] || "icon-heart.png"; }
function calendarStamp(className) { if (className === "full") return assetImage("calendar-stamp-perfect.png", "", "calendar-stamp"); if (className === "some") return assetImage("calendar-stamp-done.png", "", "calendar-stamp"); return ""; }
function assetPath(fileName) { return `${IMAGE_ROOT}/${fileName}`; }
function assetImage(fileName, alt = "", className = "asset-image") { return `<img class="${className}" src="${assetPath(fileName)}" alt="${escapeHtml(alt)}" loading="lazy">`; }
function moveAnimal(direction) { const animals = getActiveAnimals(); if (!animals.length) return; playSe("transition"); selectedAnimalIndex = (selectedAnimalIndex + direction + animals.length) % animals.length; render(); }
function todayKey() { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function lastDates(count) { return Array.from({ length: count }, (_, index) => { const date = new Date(); date.setDate(date.getDate() - index); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }); }
function daysBetween(fromKey, toKey) { const from = new Date(`${fromKey}T00:00:00`); const to = new Date(`${toKey}T00:00:00`); return Math.max(0, Math.floor((to - from) / 86400000)); }
function formatDate(dateKey) { const date = new Date(`${dateKey}T00:00:00`); return new Intl.DateTimeFormat("ja-JP", { month: "long", day: "numeric", weekday: "long" }).format(date); }
function formatShortDate(dateKey) { const date = new Date(`${dateKey}T00:00:00`); return new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric", weekday: "short" }).format(date); }
function getSuggestedCategory() { const hour = new Date().getHours(); if (hour < 12) return "morning"; if (hour < 18) return "afterSchool"; return "night"; }
function generateId() { return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`; }
function clamp(value, min = 0, max = 100) { return Math.max(min, Math.min(max, value)); }
function showToast(message) { els.toast.textContent = message; els.toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2300); }
function emptyMessage(text) { const item = document.createElement("article"); item.className = "panel-card"; item.innerHTML = `<strong>${escapeHtml(text)}</strong>`; return item; }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
