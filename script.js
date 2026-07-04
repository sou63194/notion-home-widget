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
  "焚き火を眺めるように、心を静める時間を。",
  "木々は焦らず、それでも確かに育っていく。",
  "星空の下では、小さな悩みも少し軽くなる。",
  "風の音に耳を澄ませば、今この瞬間に還れる。",
  "薪がはぜる音は、今日一日の合図。",
  "森の静けさが、明日への力をくれる。",
  "焚き火の炎のように、静かに、でも確かに燃え続ける。",
  "夜空を見上げる余裕を、今日も忘れずに。",
];

const THEMES = [
  // [開始時, 挨拶, bg-1, bg-2, accent-1, accent-2, stars, fire]
  { from: 5, to: 10, greeting: "おはようございます", bg1: "#16241b", bg2: "#2c3f2a", a1: "#ffb37c", a2: "#8fd19e", stars: false, fire: false },
  { from: 10, to: 16, greeting: "こんにちは", bg1: "#12251c", bg2: "#1f3d2c", a1: "#8fd19e", a2: "#e0c97c", stars: false, fire: false },
  { from: 16, to: 19, greeting: "こんにちは", bg1: "#2b1710", bg2: "#4a2916", a1: "#ff9d4d", a2: "#ffcf7c", stars: false, fire: true },
  { from: 19, to: 24, greeting: "こんばんは", bg1: "#070b14", bg2: "#101a2c", a1: "#ffcf7c", a2: "#8fb4ff", stars: true, fire: true },
  { from: 0, to: 5, greeting: "こんばんは", bg1: "#04060d", bg2: "#0a0f1e", a1: "#6b8fff", a2: "#a685ff", stars: true, fire: false },
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

  document.body.classList.toggle("has-stars", theme.stars);
  document.body.classList.toggle("has-fire", theme.fire);
}

function generateStars(count) {
  const container = document.getElementById("stars");
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.top = `${Math.random() * 70}%`;
    star.style.left = `${Math.random() * 100}%`;
    const size = Math.random() < 0.15 ? 3 : 2;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    star.style.animationDuration = `${2.5 + Math.random() * 2.5}s`;
    container.appendChild(star);
  }
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

generateStars(70);
updateGreetingAndTheme();
updateClock();
updateQuote();
updateYearProgress();
updateWeather();

setInterval(updateClock, 1000);
setInterval(updateGreetingAndTheme, 60 * 1000); // 1分ごとに時間帯をチェック
setInterval(updateWeather, 10 * 60 * 1000); // 10分ごとに更新
