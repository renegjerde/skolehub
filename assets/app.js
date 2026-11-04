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
