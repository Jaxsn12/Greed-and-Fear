const VOTE_CLASS = { 1: "bullish", "-1": "bearish", 0: "neutral" };
const DIRECTION_TEXT = { BULLISH: "Bullish", BEARISH: "Bearish", NEUTRAL: "Neutral" };
const VOLATILITY_CLASS = { VOLATILE: "volatile", STABLE: "stable", UNKNOWN: "unknown" };
const VOLATILITY_TEXT = { VOLATILE: "Volatile", STABLE: "Stable", UNKNOWN: "Unknown" };

function formatTime(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatPercent(pct) {
  if (typeof pct !== "number") return "—";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

function tileBody(signal) {
  if (!signal.ok) {
    return { value: "No data", sub: signal.error || "fetch failed" };
  }
  switch (signal.key) {
    case "nasdaq":
    case "dow":
    case "giftNifty":
      return {
        value: formatPercent(signal.raw.percentChange),
        sub: signal.raw.close != null ? `close ${signal.raw.close.toLocaleString("en-IN")}` : ""
      };
    case "vix":
      return { value: signal.raw.value.toFixed(2), sub: `${formatPercent(signal.raw.percentChange)} vs prev close` };
    case "breadth":
      return {
        value: `${signal.raw.advances} / ${signal.raw.declines}`,
        sub: "advances / declines"
      };
    default:
      return { value: "—", sub: "" };
  }
}

function renderHero(run) {
  const dot = document.getElementById("hero-dot");
  const value = document.getElementById("hero-value");
  const meta = document.getElementById("hero-meta");
  const timestamp = document.getElementById("hero-timestamp");

  if (!run) {
    value.textContent = "No runs yet";
    meta.textContent = "";
    timestamp.textContent = "";
    return;
  }

  const dirClass = VOTE_CLASS[run.direction.call === "BULLISH" ? 1 : run.direction.call === "BEARISH" ? -1 : 0];
  const volClass = VOLATILITY_CLASS[run.volatility.state];

  dot.className = `hero-dot ${dirClass}`;
  value.textContent = run.combined.label;
  meta.innerHTML = `
    ${run.direction.counts.bullish} bullish · ${run.direction.counts.bearish} bearish · ${run.direction.counts.neutral} neutral (of 4 direction signals)
    &nbsp;·&nbsp;
    <span class="badge ${volClass}"><span class="dot"></span>${VOLATILITY_TEXT[run.volatility.state]}${
    run.volatility.value != null ? ` (VIX ${run.volatility.value.toFixed(2)})` : ""
  }</span>
  `;
  timestamp.textContent = `Last run: ${formatTime(run.timestamp)} IST`;
}

function renderTiles(run) {
  const container = document.getElementById("tiles");
  container.innerHTML = "";
  if (!run) return;

  for (const signal of run.signals) {
    const body = tileBody(signal);
    const isVix = signal.key === "vix";
    const cls = isVix ? VOLATILITY_CLASS[signal.volatility] : VOTE_CLASS[signal.vote];
    const tile = document.createElement("div");
    tile.className = `tile${signal.ok ? "" : " error"}`;
    tile.innerHTML = `
      <div class="tile-label"><span class="dot ${cls}"></span>${signal.label}</div>
      <div class="tile-value">${body.value}</div>
      <div class="tile-sub">${body.sub}</div>
    `;
    container.appendChild(tile);
  }
}

function directionIcon(signal) {
  if (!signal || !signal.ok) return "—";
  return { 1: "\u{1F7E2}", "-1": "\u{1F534}", 0: "⚫" }[signal.vote];
}

function volatilityIcon(signal) {
  if (!signal || !signal.ok) return "—";
  return signal.volatility === "VOLATILE" ? "🟠" : "⚪";
}

function renderHistory(history) {
  const body = document.getElementById("history-body");
  body.innerHTML = "";
  const directionOrder = ["nasdaq", "dow", "breadth", "giftNifty"];

  for (const run of history) {
    const byKey = Object.fromEntries(run.signals.map((s) => [s.key, s]));
    const row = document.createElement("tr");
    const dirIcon = { BULLISH: "\u{1F7E2}", BEARISH: "\u{1F534}", NEUTRAL: "⚫" }[run.direction.call];
    row.innerHTML = `
      <td>${formatTime(run.timestamp)}</td>
      <td>${dirIcon} ${DIRECTION_TEXT[run.direction.call]}</td>
      <td>${volatilityIcon(byKey.vix)} ${VOLATILITY_TEXT[run.volatility.state]}</td>
      ${directionOrder.map((key) => `<td>${directionIcon(byKey[key])}</td>`).join("")}
      <td>${byKey.vix && byKey.vix.ok ? byKey.vix.raw.value.toFixed(2) : "—"}</td>
    `;
    body.appendChild(row);
  }
}

async function loadLatest() {
  const run = await fetch("/api/latest").then((r) => r.json());
  renderHero(run);
  renderTiles(run);
}

async function loadHistory() {
  const history = await fetch("/api/history?limit=30").then((r) => r.json());
  renderHistory(history);
}

async function refreshAll() {
  await Promise.all([loadLatest(), loadHistory()]);
}

document.getElementById("refresh").addEventListener("click", async () => {
  const btn = document.getElementById("refresh");
  btn.disabled = true;
  btn.textContent = "Running…";
  try {
    await fetch("/api/run-now", { method: "POST" });
    await refreshAll();
  } finally {
    btn.disabled = false;
    btn.textContent = "Run now";
  }
});

refreshAll();
