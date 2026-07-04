// 名古屋市の緯度経度(位置を変えたい場合はここを書き換える)
const LATITUDE = 35.1815;
const LONGITUDE = 136.9066;

const WEATHER_CODE_MAP = {
  0: ["☀️", "快晴"],
  1: ["🌤️", "晴れ"],
  2: ["⛅", "曇り時々晴れ"],
  3: ["☁️", "曇り"],
  45: ["🌫️", "霧"],
  48: ["🌫️", "霧氷"],
  51: ["🌦️", "小雨"],
  53: ["🌦️", "小雨"],
  55: ["🌧️", "雨"],
  61: ["🌧️", "雨"],
  63: ["🌧️", "雨"],
  65: ["🌧️", "強い雨"],
  71: ["🌨️", "雪"],
  73: ["🌨️", "雪"],
  75: ["❄️", "大雪"],
  77: ["❄️", "霧雪"],
  80: ["🌦️", "にわか雨"],
  81: ["🌧️", "にわか雨"],
  82: ["⛈️", "激しいにわか雨"],
  85: ["🌨️", "にわか雪"],
  86: ["❄️", "激しいにわか雪"],
  95: ["⛈️", "雷雨"],
  96: ["⛈️", "雷雨(雹あり)"],
  99: ["⛈️", "雷雨(雹あり)"],
};

const QUOTES = [
  "今日という日は、残りの人生の最初の日。",
  "小さな一歩が、大きな変化を生む。",
  "焦らず、着実に。",
  "できることから、一つずつ。",
  "今日の積み重ねが、未来をつくる。",
  "休むことも、前に進むうちのひとつ。",
  "完璧じゃなくていい、続けることが大事。",
  "今この瞬間を大切に。",
];

const THEMES = [
  // [開始時, 挨拶, bg-1, bg-2, accent-1, accent-2]
  { from: 5, to: 10, greeting: "おはようございます", bg1: "#2a2338", bg2: "#4a3450", a1: "#ffb37c", a2: "#ff7ca0" },
  { from: 10, to: 16, greeting: "こんにちは", bg1: "#0d1830", bg2: "#1a2c4d", a1: "#7cc7ff", a2: "#7c9dff" },
  { from: 16, to: 19, greeting: "こんにちは", bg1: "#301a2a", bg2: "#4d2438", a1: "#ff9d7c", a2: "#ffce7c" },
  { from: 19, to: 24, greeting: "こんばんは", bg1: "#0d0f1e", bg2: "#1a1d35", a1: "#7c9dff", a2: "#a06bff" },
  { from: 0, to: 5, greeting: "こんばんは", bg1: "#0a0a16", bg2: "#141428", a1: "#5c6bff", a2: "#7c4bff" },
];

function currentTheme(hour) {
  return THEMES.find((t) => hour >= t.from && hour < t.to) || THEMES[THEMES.length - 1];
}

function updateGreetingAndTheme() {
  const hour = new Date().getHours();
  const theme = currentTheme(hour);

  document.getElementById("greeting").textContent = theme.greeting;

  const root = document.documentElement.style;
  root.setProperty("--bg-1", theme.bg1);
  root.setProperty("--bg-2", theme.bg2);
  root.setProperty("--accent-1", theme.a1);
  root.setProperty("--accent-2", theme.a2);
}

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("clock").textContent = `${h}:${m}:${s}`;

  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日(${days[now.getDay()]})`;
  document.getElementById("date").textContent = dateStr;
}

function formatTime(isoString) {
  const d = new Date(isoString);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

async function updateWeather() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=Asia%2FTokyo`;
    const res = await fetch(url);
    const data = await res.json();

    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    const [emoji, desc] = WEATHER_CODE_MAP[code] || ["🌡️", "-"];

    document.getElementById("weather-emoji").textContent = emoji;
    document.getElementById("weather-temp").textContent = `${temp}°`;
    document.getElementById("weather-desc").textContent = desc;

    document.getElementById("sunrise").textContent = formatTime(data.daily.sunrise[0]);
    document.getElementById("sunset").textContent = formatTime(data.daily.sunset[0]);
  } catch (e) {
    document.getElementById("weather-desc").textContent = "取得できませんでした";
  }
}

function updateQuote() {
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const quote = QUOTES[dayIndex % QUOTES.length];
  document.getElementById("quote").textContent = quote;
}

function updateYearProgress() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear() + 1, 0, 1);
  const percent = ((now - start) / (end - start)) * 100;

  document.getElementById("year-progress-fill").style.width = `${percent}%`;
  document.getElementById("year-progress-text").textContent =
    `${now.getFullYear()}年 ${percent.toFixed(1)}% 経過`;
}

updateGreetingAndTheme();
updateClock();
updateQuote();
updateYearProgress();
updateWeather();

setInterval(updateClock, 1000);
setInterval(updateGreetingAndTheme, 60 * 1000); // 1分ごとに時間帯をチェック
setInterval(updateWeather, 10 * 60 * 1000); // 10分ごとに更新
