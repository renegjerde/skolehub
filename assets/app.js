const modules = {
  kaffestatus: {
    title: 'KaffeStatus', icon: '☕', subtitle: 'Pauserommet på arbeidsplassen', path: 'apps/kaffestatus/index.html'
  },
  inspeksjon: {
    title: 'InspeksjonsVakt', icon: '◷', subtitle: 'Din personlige inspeksjonsoversikt', path: 'apps/inspeksjon/index.html'
  },
  pausepuls: {
    title: 'PausePuls', icon: '⚡', subtitle: 'Pauseaktiviteter for 1.–7. trinn', path: 'apps/pausepuls/index.html'
  }
};

const homeView = document.getElementById('homeView');
const moduleView = document.getElementById('moduleView');
const moduleFrame = document.getElementById('moduleFrame');
const moduleTitle = document.getElementById('moduleTitle');
const moduleIcon = document.getElementById('moduleIcon');
const moduleSubtitle = document.getElementById('moduleSubtitle');
let currentModule = '';
let childObservers = [];

function disposeObservers() {
  childObservers.forEach(observer => observer.disconnect());
  childObservers = [];
}

function applyKaffestatusTheme(frame) {
  try {
    const doc = frame.contentDocument;
    if (!doc || !doc.head || !doc.body) return;
    disposeObservers();

    if (!doc.querySelector('link[data-skolehub-font]')) {
      const font = doc.createElement('link');
      font.rel = 'preconnect'; font.href = 'https://fonts.googleapis.com'; font.dataset.skolehubFont = '1';
      doc.head.appendChild(font);
      const fontCss = doc.createElement('link');
      fontCss.rel = 'stylesheet';
      fontCss.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
      doc.head.appendChild(fontCss);
    }

    const theme = doc.createElement('style');
    theme.id = 'skolehub-theme';
    theme.textContent = `
      :root{--sk-bg:#FAF7F2;--sk-ink:#2C1A1D;--sk-muted:#7D6B6E;--sk-shadow:0 10px 28px rgba(44,26,29,.065);--sk-radius:22px}
      html{background:transparent!important;min-height:0!important}
      body{background:transparent!important;background-image:none!important;background-attachment:initial!important;color:var(--sk-ink)!important;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif!important;margin:0!important;min-height:0!important;padding:0!important}
      button,input,select,textarea{font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif!important}
      button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid rgba(199,165,112,.55)!important;outline-offset:2px}
      /* Felles kort- og skjemauttrykk */
      .panel,.dashboard,.next-card,.week-box,.admin-panel,.filters,.detail,.ai,.card,.week-day,.upcoming-item{border-radius:var(--sk-radius)!important;box-shadow:var(--sk-shadow)!important}
      input,select,textarea{border-radius:13px!important}
      /* KaffeStatus */
      .app-container{max-width:520px!important;margin:0 auto!important;padding:0!important;gap:16px!important}
      .app-container>header{display:none!important}
      .app-container>.card{background:rgba(255,255,255,.88)!important;border:1px solid rgba(255,255,255,.95)!important}
      /* InspeksjonsVakt */
      .topbar{display:none!important}
      main{max-width:920px!important;margin:0 auto!important;padding:4px 6px 20px!important}
      .intro{padding:5px 5px 20px!important}
      .intro h1{font-family:'Plus Jakarta Sans',sans-serif!important;color:#2C1A1D!important;letter-spacing:-1.2px!important}
      .intro h1 em{color:#A18B69!important}
      .eyebrow{color:#9A8778!important}
      .hero-symbol{background:#FFF0CA!important;color:#987D51!important;border-radius:26px!important;box-shadow:0 8px 20px rgba(171,133,66,.09)!important}
      .panel,.admin-panel{background:rgba(255,255,255,.88)!important;border:1px solid rgba(255,255,255,.95)!important}
      .dashboard{background:rgba(255,240,202,.48)!important;border:1px solid rgba(255,255,255,.95)!important}
      .next-card{background:rgba(255,255,255,.92)!important;border:1px solid #F0E5D5!important}
      .next-time,.next-area,.next-heading h2,.week-header h3,.panel-heading h2{color:#59453D!important;font-family:'Plus Jakarta Sans',sans-serif!important}
      .next-clock,.step,.admin-icon,.admin-step>span{background:#F7EEDC!important;color:#92784F!important}
      .week-day{background:rgba(255,255,255,.84)!important;border-color:#F0E8DC!important}
      .week-day.is-today{background:#F5F0E5!important;border-color:#D8C29C!important}
      .week-event{background:#EEF4EA!important;border-left-color:#8AA58A!important}
      .week-arrow,.week-current,.button-secondary{background:#F5EFE5!important;color:#786047!important}
      .button-primary{background:#8D7960!important;color:#fff!important}
      .admin-warning{background:#FFF1E9!important;color:#875E51!important}
      .topbar+main+footer{display:none!important}
      /* PausePuls */
      .wrap{max-width:960px!important;margin:0 auto!important;padding:4px 6px 16px!important}
      .top{margin:0 0 17px!important;justify-content:flex-end!important}
      .top .brand{display:none!important}
      .hero h2,.heading h3,.detail h2{font-family:'Plus Jakarta Sans',sans-serif!important;color:#2C1A1D!important}
      .hero p,.sub,.meta{color:#7D6B6E!important}
      .tile{border-radius:18px!important;box-shadow:0 7px 18px rgba(44,26,29,.045)!important}
      .tile.active{border-color:#C8B18A!important;box-shadow:0 0 0 2px rgba(200,177,138,.2)!important}
      .filters,.detail,.ai,.card{background:rgba(255,255,255,.88)!important;border:1px solid rgba(255,255,255,.95)!important}
      .card{border-radius:18px!important}
      .chip{background:#FFF0CA!important;color:#806746!important}
      .btn.primary,.random{background:#8D7960!important;border-color:#8D7960!important;color:#fff!important}
      .btn{border-radius:13px!important}
      .instructions{background:#F7F0E6!important;color:#59483D!important}
      .bar{background:#F0E6D8!important}.bar div{background:#A28A68!important}
      .done{background:#E7F1E5!important;color:#527552!important}
      .panel{background:#F8F1E8!important;border:1px solid #F0E5D5!important}
      .panel p{color:#796452!important}
      .foot{display:none!important}
      @media(max-width:700px){main{padding:0 3px 14px!important}.panel,.dashboard{padding:15px!important}.wrap{padding:0 3px 12px!important}}
    `;
    doc.head.appendChild(theme);

    const sendHeight = () => {
      const body = doc.body;
      const root = doc.documentElement;
      const height = Math.max(body.scrollHeight, body.offsetHeight, root.scrollHeight, root.offsetHeight, 420);
      window.postMessage({ type: 'skolehub:frame-height', height }, window.location.origin);
    };
    const ResizeObserverClass = frame.contentWindow.ResizeObserver;
    if (ResizeObserverClass) {
      const resizeObserver = new ResizeObserverClass(sendHeight);
      resizeObserver.observe(doc.body);
      resizeObserver.observe(doc.documentElement);
      childObservers.push(resizeObserver);
    }
    const MutationObserverClass = frame.contentWindow.MutationObserver;
    if (MutationObserverClass) {
      const mutationObserver = new MutationObserverClass(sendHeight);
      mutationObserver.observe(doc.body, { childList: true, subtree: true, attributes: true, characterData: true });
      childObservers.push(mutationObserver);
    }
    sendHeight();
    frame.contentWindow.addEventListener('resize', sendHeight);
    setTimeout(sendHeight, 250);
    setTimeout(sendHeight, 800);
  } catch (error) {
    console.warn('Kunne ikke tilpasse modulen til SkoleHub-utseendet:', error);
  }
}

function openModule(moduleKey) {
  const module = modules[moduleKey];
  if (!module) return;
  currentModule = moduleKey;
  homeView.hidden = true;
  moduleView.hidden = false;
  moduleTitle.textContent = module.title;
  moduleIcon.textContent = module.icon;
  moduleSubtitle.textContent = module.subtitle;
  document.title = `${module.title} – SkoleHub`;
  if (moduleFrame.dataset.module !== moduleKey) {
    disposeObservers();
    moduleFrame.dataset.module = moduleKey;
    moduleFrame.src = module.path;
  } else {
    applyKaffestatusTheme(moduleFrame);
  }
  if (location.hash !== `#${moduleKey}`) history.replaceState(null, '', `#${moduleKey}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
  currentModule = '';
  homeView.hidden = false;
  moduleView.hidden = true;
  document.title = 'SkoleHub – verktøy for skolehverdagen';
  if (location.hash !== '#hjem') history.replaceState(null, '', '#hjem');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-module]').forEach(button => {
  button.addEventListener('click', () => openModule(button.dataset.module));
});
document.getElementById('backHome').addEventListener('click', goHome);
moduleFrame.addEventListener('load', () => applyKaffestatusTheme(moduleFrame));
window.addEventListener('message', event => {
  if (event.source !== moduleFrame.contentWindow || event.origin !== window.location.origin) return;
  if (event.data?.type === 'skolehub:frame-height' && Number.isFinite(event.data.height)) {
    moduleFrame.style.height = `${Math.max(520, Math.min(event.data.height + 14, 14000))}px`;
  }
});
window.addEventListener('hashchange', () => {
  const key = location.hash.slice(1);
  if (modules[key]) openModule(key);
  else if (!key || key === 'hjem') goHome();
});

const initial = location.hash.slice(1);
if (modules[initial]) openModule(initial);
else goHome();


// Værmelding for Paradis, Bergen – inneværende time fra Open-Meteo (MET Nordic).
(function initParadisWeather() {
  const widget = document.getElementById('weatherWidget');
  const iconEl = document.getElementById('weatherIcon');
  const tempEl = document.getElementById('weatherTemp');
  const labelEl = document.getElementById('weatherLabel');
  if (!widget || !iconEl || !tempEl || !labelEl) return;

  // Fast punkt ved Paradis i Bergen. Værdata gjelder modellruten nær skolen.
  const latitude = 60.3373;
  const longitude = 5.3447;
  const api = new URL('https://api.open-meteo.com/v1/forecast');
  api.search = new URLSearchParams({
    latitude, longitude,
    hourly: 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m',
    daily: 'sunrise,sunset',
    timezone: 'Europe/Oslo', forecast_days: '2',
    temperature_unit: 'celsius', wind_speed_unit: 'ms'
  }).toString();

  const weatherTypes = {
    0: ['☀️', 'Klart', 'sun'], 1: ['🌤️', 'Lettskyet', 'sun'],
    2: ['⛅', 'Delvis skyet', 'cloud'], 3: ['☁️', 'Overskyet', 'cloud'],
    45: ['🌫️', 'Tåke', 'cloud'], 48: ['🌫️', 'Rimtåke', 'cloud'],
    51: ['🌦️', 'Lett yr', 'rain'], 53: ['🌦️', 'Yr', 'rain'], 55: ['🌧️', 'Kraftig yr', 'rain'],
    56: ['🌧️', 'Underkjølt yr', 'rain'], 57: ['🌧️', 'Underkjølt yr', 'rain'],
    61: ['🌧️', 'Lett regn', 'rain'], 63: ['🌧️', 'Regn', 'rain'], 65: ['🌧️', 'Kraftig regn', 'rain'],
    66: ['🌧️', 'Underkjølt regn', 'rain'], 67: ['🌧️', 'Underkjølt regn', 'rain'],
    71: ['🌨️', 'Lett snø', 'snow'], 73: ['❄️', 'Snø', 'snow'], 75: ['❄️', 'Kraftig snø', 'snow'],
    77: ['🌨️', 'Snøkorn', 'snow'], 80: ['🌦️', 'Regnbyger', 'rain'],
    81: ['🌧️', 'Regnbyger', 'rain'], 82: ['⛈️', 'Kraftige byger', 'rain'],
    85: ['🌨️', 'Snøbyger', 'snow'], 86: ['❄️', 'Kraftige snøbyger', 'snow'],
    95: ['⛈️', 'Tordenvær', 'rain'], 96: ['⛈️', 'Hagl og torden', 'rain'], 99: ['⛈️', 'Kraftig hagl og torden', 'rain']
  };

  function showUnavailable() {
    iconEl.textContent = '🌤️'; tempEl.textContent = '–°'; labelEl.textContent = 'Paradis';
    widget.title = 'Værmeldingen er midlertidig utilgjengelig. Prøv igjen senere.';
    widget.setAttribute('aria-label', 'Værmelding for Paradis er midlertidig utilgjengelig');
  }

  async function updateWeather() {
    try {
      const response = await fetch(api.toString(), { cache: 'no-store' });
      if (!response.ok) throw new Error(`Vær-API svarte ${response.status}`);
      const data = await response.json();
      const times = data.hourly?.time || [];
      const now = new Date();
      const localHour = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Oslo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }).format(now).replace(' ', 'T').slice(0, 13) + ':00';
      let index = times.indexOf(localHour);
      if (index < 0) index = times.findIndex(t => t >= localHour);
      if (index < 0) throw new Error('Fant ingen værprognose for inneværende time');

      const code = data.hourly.weather_code[index];
      const [daySymbol, description, tone] = weatherTypes[code] || ['🌤️', 'Værmelding', 'cloud'];
      // Bruk soloppgang og solnedgang for Paradis i Europe/Oslo.
      // Dette er mer robust enn å stole på is_day fra én timeverdi i API-et.
      const forecastHour = times[index]; // lokal tid fordi API-et er bedt om Europe/Oslo
      const forecastDate = forecastHour.slice(0, 10);
      const dailyIndex = data.daily?.time?.indexOf(forecastDate) ?? -1;
      const sunrise = dailyIndex >= 0 ? data.daily.sunrise?.[dailyIndex] : null;
      const sunset = dailyIndex >= 0 ? data.daily.sunset?.[dailyIndex] : null;
      let isNight;
      if (sunrise && sunset) {
        // ISO-lokalstrenger kan sammenlignes direkte siden alle har samme tidssoneformat.
        isNight = forecastHour < sunrise || forecastHour >= sunset;
      } else {
        // Reserve dersom soltidene mangler: bruk lokal klokke i Bergen.
        const hourInBergen = Number(new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/Oslo', hour: '2-digit', hourCycle: 'h23'
        }).format(now));
        isNight = hourInBergen < 7 || hourInBergen >= 19;
      }
      // Nattikonet bygges i to lag: månen først, skyen oppå den.
      // Separate span-elementer gjør at de overlapper i stedet for å stå ved siden av hverandre.
      const nightCloudMarkup = '<span class="night-weather-icon"><span class="night-moon">🌙</span><span class="night-cloud">☁️</span></span>';
      const hasNightCloud = isNight && [1, 2, 3].includes(Number(code));
      const showNightMoon = isNight && Number(code) === 0;
      const symbol = hasNightCloud ? nightCloudMarkup : (showNightMoon ? '🌙' : daySymbol);
      const temperature = Math.round(data.hourly.temperature_2m[index]);
      const rain = data.hourly.precipitation_probability?.[index];
      const wind = data.hourly.wind_speed_10m?.[index];
      const timeLabel = times[index].slice(11, 16);
      const nextTime = times[index + 1]?.slice(11, 16) || '–';
      if (hasNightCloud) iconEl.innerHTML = symbol;
      else iconEl.textContent = symbol;
      tempEl.textContent = `${temperature}°`; labelEl.textContent = 'Paradis';
      widget.classList.remove('is-rain', 'is-cloud', 'is-snow', 'is-night');
      if (tone !== 'sun') widget.classList.add(`is-${tone}`);
      if (isNight) widget.classList.add('is-night');
      const details = `${description} · ${temperature} °C${rain == null ? '' : ` · ${Math.round(rain)} % nedbørsjanse`}${wind == null ? '' : ` · Vind ${Math.round(wind)} m/s`}`;
      widget.title = `Paradis, Bergen · ${timeLabel}–${nextTime}: ${details}. Værdata fra Open-Meteo.`;
      widget.setAttribute('aria-label', `Værmelding Paradis, Bergen, inneværende time: ${details}`);
    } catch (error) {
      console.warn('Kunne ikke hente værmelding for Paradis:', error);
      showUnavailable();
    }
  }

  updateWeather();
  window.setInterval(updateWeather, 30 * 60 * 1000);
  widget.addEventListener('click', () => {
    if (widget.title) alert(widget.title);
  });
})();
