// Edukaan POS landing page — renders COPY / DATA (content.js) for the chosen market (AE / SA) and language (en / ar).
// URL options: ?country=SA  ?lang=ar  ?demo=0 (freeze the hero POS animation)  ?pricing=0 (hide pricing)
(function () {
  'use strict';

  const params = new URLSearchParams(location.search);
  const reducedMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const config = {
    country: params.get('country') === 'SA' ? 'SA' : 'AE',
    lang: ['en', 'ar'].includes(params.get('lang')) ? params.get('lang') : 'auto',
    animateDemo: params.has('demo') ? params.get('demo') !== '0' : !reducedMotion,
    showPricing: params.get('pricing') !== '0',
  };
  const WHATSAPP = '97144910000';

  // Hero background photo per market. The design has empty image slots for these;
  // drop a file into assets/ and set its path here (e.g. 'assets/hero-ae.jpg') to show it.
  const HERO_PHOTOS = { AE: null, SA: null };
  const TRUSTED_LOGOS = [
    { file: 'trusted-samsung.svg', name: 'Samsung', size: 'width:140px' },
    { file: 'trusted-huawei.png', name: 'Huawei', size: 'height:56px' },
    { file: 'trusted-nokia.svg', name: 'Nokia', size: 'width:120px' },
    { file: 'trusted-mycandy.svg', name: 'My Candy', size: 'height:52px' },
    { file: 'trusted-switch.svg', name: 'Switch', size: 'width:112px' },
  ];
  const HW_PHOTOS = ['terminal', 'printer', 'scanner', 'drawer', 'card'];
  // Integration logos per column; `only` limits a logo to one market.
  const INTEGRATIONS = {
    pay: [
      { key: 'mada', name: 'mada', only: 'SA' },
      { key: 'network', name: 'Network International', only: 'AE' },
      { key: 'magnati', name: 'Magnati', only: 'AE' },
      { key: 'visa', name: 'Visa' },
      { key: 'mastercard', name: 'Mastercard' },
      { key: 'applepay', name: 'Apple Pay' },
      { key: 'samsungpay', name: 'Samsung Pay', only: 'AE' },
      { key: 'tamara', name: 'Tamara' },
      { key: 'tabby', name: 'Tabby' },
    ],
    market: [
      { key: 'amazon', name: 'Amazon' },
      { key: 'noon', name: 'Noon', bg: '#feee00' },
      { key: 'tradeling', name: 'Tradeling' },
    ],
    erp: [
      { key: 'odoo', name: 'Odoo' },
      { key: 'netsuite', name: 'Oracle NetSuite' },
      { key: 'sap', name: 'SAP' },
      { key: 'zatca', name: 'ZATCA', only: 'SA' },
      { key: 'dynamics', name: 'Microsoft Dynamics 365' },
    ],
  };

  const state = { country: null, lang: null, openFaq: -1, feat: 0, regionOpen: false, tick: 0, posIn: false };
  const app = document.getElementById('app');

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const map = (list, fn) => list.map(fn).join('');
  const pad2 = i => String(i + 1).padStart(2, '0');

  const country = () => state.country ?? config.country;
  const lang = () => {
    if (state.lang) return state.lang;
    if (config.lang !== 'auto') return config.lang;
    return country() === 'SA' ? 'ar' : 'en';
  };

  function ctx() {
    const c = country(), l = lang(), sa = c === 'SA', ar = l === 'ar';
    return {
      c, l, sa, ar,
      cur: ar ? (sa ? 'ر.س' : 'د.إ') : (sa ? 'SAR' : 'AED'),
      t: { ...COPY[l].base, ...COPY[l][c] },
      d: DATA[l],
    };
  }

  const WA_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.3 5.3 5.3 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.1.6 2.8.5a2.4 2.4 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.4-.2Z"/></svg>';

  const groupLogo = ({ sa }) => sa
    ? '<img src="assets/axiom.png" alt="axiom by tradeling">'
    : '<img src="assets/tradeling.png" alt="tradeling.com">';

  // ---------- sections ----------

  function nav({ c, l, t }) {
    return `
    <header class="nav" data-screen-label="nav">
      <div class="wrap nav-inner">
        <img class="nav-logo" src="assets/edukaan-white.png" alt="edukaan by tradeling">
        <nav class="nav-links">
          <a href="#features">${esc(t.navFeatures)}</a><a href="#hardware">${esc(t.navHardware)}</a>${config.showPricing ? `<a href="#pricing">${esc(t.navPricing)}</a>` : ''}<a href="#faq">${esc(t.navFaq)}</a>
        </nav>
        <div class="nav-actions">
          <div class="region">
            <button class="pill-btn" data-act="region" aria-haspopup="listbox" aria-expanded="${state.regionOpen}">
              <span class="dot" style="background:var(--orange)"></span><span class="cn-full">${esc(COPY[l].names[c])}</span><span class="cn-short">${esc(t.countryTag)}</span><span class="caret">▾</span>
            </button>
            ${state.regionOpen ? `
            <div class="region-menu" role="listbox">
              <div class="overline">${esc(t.regionTitle)}</div>
              ${map(['AE', 'SA'], cc => `
                <button class="region-opt${cc === c ? ' active' : ''}" role="option" aria-selected="${cc === c}" data-act="country" data-cc="${cc}">
                  <span>${esc(COPY[l].names[cc])}</span>${cc === c ? '<span class="check">✓</span>' : ''}
                </button>`)}
            </div>` : ''}
          </div>
          <div class="lang" role="group" aria-label="Language">
            <button class="${l === 'en' ? 'on' : ''}" data-act="lang" data-l="en" lang="en">EN</button>
            <button class="${l === 'ar' ? 'on' : ''}" data-act="lang" data-l="ar" lang="ar">عربي</button>
          </div>
          <a class="btn btn-primary nav-cta" href="#contact">${esc(t.ctaShort)}</a>
        </div>
      </div>
    </header>`;
  }

  function hero({ c, t, d }) {
    const photo = HERO_PHOTOS[c];
    return `
    <section class="hero-band" data-screen-label="hero">
    ${photo ? `
      <div class="hero-bg" aria-hidden="true">
        <img class="hero-photo" src="${photo}" alt="">
        <div class="hero-fade-x"></div>
        <div class="hero-fade-y"></div>
      </div>` : ''}
    <div class="wrap hero">
      <div class="stack hero-copy">
        <div class="tags">
          ${map(d.retail[c], r => `<span class="tag">${esc(r)}</span>`)}
        </div>
        <h1>${esc(t.heroA)}<span>${esc(t.heroB)}</span>${esc(t.heroC)}</h1>
        <p class="hero-sub">${esc(t.heroSub)}</p>
        <div class="cta-row">
          <a class="btn btn-primary btn-lg" href="#contact">${WA_ICON}${esc(t.cta)}</a>
          <span class="cta-note">${esc(t.ctaNote)}</span>
        </div>
      </div>
      <div class="pos${state.posIn ? ' in' : ''}" aria-hidden="true">
        <div class="tab-tilt">
          <div class="tab-bezel">
            <div class="tab-body">
              <div class="tab-cam"></div>
              <div class="tab-screen">
                <div class="pos-screen">
                  <div class="pos-main">
                    <div class="pos-head"><b>${esc(t.saleNo)}</b><small>${esc(t.saleMeta)}</small></div>
                    <div id="pos-live"></div>
                  </div>
                  <div class="pos-side" id="pos-side"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="tab-handle start"><span></span><span></span></div>
          <div class="tab-handle end"><span></span></div>
          <div class="low-stock"><div>${esc(t.lowStock)}</div><div>${esc(t.reorder)} →</div></div>
        </div>
        <div class="tab-stand"></div>
        <div class="tab-shadow"></div>
      </div>
    </div>
    </section>`;
  }

  function trusted({ t }) {
    return `
    <section class="light trusted" data-screen-label="trusted by">
      <div class="trusted-title">${esc(t.trustedBy)}</div>
      <div class="trusted-band">
        <div class="wrap">
          <div class="trusted-grid">
            ${map(TRUSTED_LOGOS, (l, i) => `<div class="trusted-cell${i % 2 ? '' : ' shade'}"><img src="assets/${l.file}" alt="${esc(l.name)}" style="${l.size}"></div>`)}
          </div>
        </div>
      </div>
    </section>`;
  }

  // Scroll story: each feature is a tall step on the left; the sticky tablet on the right shows the step nearest mid-screen.
  function features({ c, t, d }) {
    const list = d.features[c];
    const i = Math.min(state.feat, list.length - 1);
    return `
    <section id="features" class="light" data-screen-label="features">
      <div class="wrap feat-head">
        <h2 class="h2">${esc(t.featTitle)}</h2>
        <div class="feat-sub">${esc(t.featSub)}</div>
      </div>
      <div class="wrap feat-story">
        <div class="feat-list">
          ${map(list, (f, j) => `
            <div class="feat-step" data-feat="${j}">
              <div class="feat-item${j === i ? ' on' : ''}">
                <div class="feat-rail"></div>
                <div class="stack feat-copy">
                  <div class="overline">${pad2(j)} / ${String(list.length).padStart(2, '0')}</div>
                  <div class="feat-title">${esc(f.title)}</div>
                  <div class="feat-body">${esc(f.body)}</div>
                  <div class="chips">${map(f.chips || [], ch => `<span class="chip">${esc(ch)}</span>`)}</div>
                  <div class="feat-stats">
                    <div class="feat-stat"><b>${esc(f.stat)}</b><span>${esc(f.statLabel)}</span></div>
                    <div class="feat-mini">${map(f.mini || [], m => `<div><i></i><span>${esc(m)}</span></div>`)}</div>
                  </div>
                </div>
              </div>
            </div>`)}
        </div>
        <div class="feat-device" aria-hidden="true">
          <div class="dev-frame">
            <div class="dev-notch"></div>
            <div class="dev-screen">
              <div class="dev-bar">
                <div class="dev-app"><img src="assets/edukaan-dark.png" alt=""><span id="dev-card">· ${esc(list[i].cardTitle)}</span></div>
                <div class="dev-dots">${map(list, (f, j) => `<span class="${j === i ? 'on' : ''}"></span>`)}</div>
              </div>
              <div class="dev-body in" id="dev-body">${deviceBody(list[i], i, list.length)}</div>
            </div>
          </div>
          <div class="feat-pills">${map(list, (f, j) => `<button class="${j === i ? 'on' : ''}" data-act="feat-jump" data-i="${j}" tabindex="-1">${pad2(j)}</button>`)}</div>
        </div>
      </div>
    </section>`;
  }

  function deviceBody(a, i, n) {
    return `
      <div class="dev-title"><div>${esc(a.screenTitle || a.cardTitle)}</div><span class="dev-badge">${esc(a.badge)}</span></div>
      ${map(a.rows, r => `<div class="dev-row"><span>${esc(r.k)}</span><span>${esc(r.v)}</span></div>`)}
      <div class="dev-tiles">${map(a.tiles || [], tl => `<div><small>${esc(tl.k)}</small><b>${esc(tl.v)}</b></div>`)}</div>
      <div class="dev-foot">
        <div class="dev-progress"><div style="width:${Math.round(((i + 1) / n) * 100)}%"></div></div>
        <div class="dev-action">${esc(a.action)}</div>
      </div>`;
  }

  // Swap the active feature in place (no full re-render) so the CSS transitions can play.
  function setFeat(i) {
    if (i === state.feat) return;
    state.feat = i;
    const list = ctx().d.features[country()];
    const sec = document.getElementById('features');
    if (!sec) return;
    sec.querySelectorAll('.feat-item').forEach((el, j) => el.classList.toggle('on', j === i));
    sec.querySelectorAll('.dev-dots span, .feat-pills button').forEach(el => el.classList.remove('on'));
    sec.querySelectorAll('.dev-dots span')[i]?.classList.add('on');
    sec.querySelectorAll('.feat-pills button')[i]?.classList.add('on');
    document.getElementById('dev-card').textContent = '· ' + list[i].cardTitle;
    const body = document.getElementById('dev-body');
    body.classList.remove('in');
    clearTimeout(setFeat.t);
    setFeat.t = setTimeout(() => { body.innerHTML = deviceBody(list[i], i, list.length); body.classList.add('in'); }, 180);
  }

  function pickFeat() {
    const steps = document.querySelectorAll('.feat-step');
    if (!steps.length) return;
    const mid = innerHeight / 2;
    let best = -1, bestD = Infinity;
    steps.forEach((el, j) => {
      const b = el.getBoundingClientRect();
      const dist = b.top <= mid && b.bottom >= mid ? 0 : Math.min(Math.abs(b.top - mid), Math.abs(b.bottom - mid));
      if (dist < bestD) { bestD = dist; best = j; }
    });
    if (best >= 0) setFeat(best);
  }

  function hub({ t, d }) {
    const card = h => `
      <div class="hub-card">
        <div class="overline muted">${esc(h.tag)}</div>
        <div class="t">${esc(h.title)}</div>
        <div class="b">${esc(h.body)}</div>
      </div>`;
    return `
    <div class="wrap"><div class="rule-dark"></div></div>
    <section class="wrap hub" data-screen-label="one pos hub">
      <div class="stack hub-head">
        <div class="overline accent eyebrow">${esc(t.hubOverline)}</div>
        <h2 class="h2">${esc(t.hubTitle)}</h2>
      </div>
      <div class="hub-grid">
        ${map(d.hub.slice(0, 3), card)}
        <div class="hub-line"></div><div class="hub-line"></div><div class="hub-line"></div>
        <div class="hub-core">
          <div class="hub-core-id">
            <img src="assets/edukaan-white.png" alt="edukaan">
            <div><div class="t">${esc(t.hubCore)}</div><div class="s">${esc(t.hubCoreSub)}</div></div>
          </div>
          <div class="hub-stats">
            ${map(d.hubStats, s => `<div class="hub-stat"><b>${esc(s.v)}</b><small>${esc(s.k)}</small></div>`)}
          </div>
        </div>
        <div class="hub-line down"></div><div class="hub-line down"></div><div class="hub-line down"></div>
        ${map(d.hub.slice(3, 6), card)}
      </div>
    </section>`;
  }

  function reporting({ c, t, d, cur }) {
    const rep = d.rep[c];
    const bars = [62, 48, 55, 71, 44, 88, 100];
    return `
    <div class="wrap"><div class="rule-dark"></div></div>
    <section id="reporting" class="wrap split reporting" data-screen-label="reporting">
      <div class="stack">
        <div class="overline accent eyebrow">${esc(t.repOverline)}</div>
        <h2 class="h2">${esc(t.repTitle)}</h2>
        <p class="lead">${esc(t.repBody)}</p>
        <div class="points">
          ${map(d.repPoints, p => `<div class="point"><i>✓</i><span>${esc(p)}</span></div>`)}
        </div>
      </div>
      <div class="dash">
        <div class="dash-head"><b>${esc(t.repDash)}</b><small>${esc(t.repRange)}</small></div>
        <div class="kpis">
          ${map(rep.kpis, k => `
            <div class="kpi">
              <div class="k">${esc(k.k)}</div>
              <div class="v">${esc(k.cur ? `${cur} ${k.v}` : k.v)}</div>
              <div class="d${/^[−-]/.test(k.d) ? ' neg' : ''}">${esc(k.d)}</div>
            </div>`)}
        </div>
        <div>
          <div class="chart-head"><span>${esc(t.repChart)}</span><span>${esc(t.repChartNote)}</span></div>
          <div class="bars">${map(bars, (h, i) => `<div class="${i === 6 ? 'today' : ''}" style="height:${h}%"></div>`)}</div>
          <div class="bar-days">${map(d.days, day => `<div>${esc(day)}</div>`)}</div>
        </div>
        <div class="movers">
          <div>
            <div class="overline top">${esc(t.repTop)}</div>
            ${map(rep.top, r => `<div class="mover"><span>${esc(r.item)}</span><span>${esc(r.v)}</span></div>`)}
          </div>
          <div>
            <div class="overline slow">${esc(t.repSlow)}</div>
            ${map(rep.slow, r => `<div class="mover muted"><span>${esc(r.item)}</span><span>${esc(r.v)}</span></div>`)}
          </div>
        </div>
      </div>
    </section>`;
  }

  function wholesale(v) {
    const { c, t, d } = v;
    return `
    <div class="wrap"><div class="rule-dark"></div></div>
    <section id="wholesale" class="wrap split wholesale" data-screen-label="wholesale">
      <div class="stack">
        <div class="overline accent eyebrow">${esc(t.recOverline)}</div>
        <h2 class="h2">${esc(t.recTitle)}</h2>
        <p class="lead">${esc(t.recBody)}</p>
        <div class="repl">
          <div class="repl-head"><div class="overline muted">${esc(t.replTitle)}</div><div class="repl-on">● ${esc(t.replOn)}</div></div>
          ${map(d.repl[c], r => `
            <div class="repl-item lvl-${r.level}">
              <b>${esc(r.item)}</b>
              <div class="badge">${esc(r.status)}</div>
              <div class="meter"><div style="width:${esc(r.pct)}"></div></div>
              <div class="repl-note">${esc(r.note)}</div>
            </div>`)}
        </div>
        <div class="supplier">
          <div class="supplier-logo">${groupLogo(v)}</div>
          <span>${esc(t.recSupplier)}</span>
        </div>
      </div>
      <div class="receipt-tilt">
        <div class="receipt">
          <div class="receipt-head"><img src="assets/edukaan-dark.png" alt="edukaan"><div>${esc(t.recHead)}</div></div>
          <div class="rule"></div>
          <div class="receipt-lines">${map(d.receipt[c], r => `<div class="row"><span>${esc(r)}</span><span>✓</span></div>`)}</div>
          <div class="rule"></div>
          <div class="row systems"><span>${esc(t.recSystems)}</span><span>1</span></div>
          <div class="row meta"><span>${esc(t.recSetup)}</span><span>${esc(t.recSetupVal)}</span></div>
          <div class="row meta"><span>${esc(t.recContract)}</span><span>${esc(t.recContractVal)}</span></div>
          <div class="rule"></div>
          <div class="thanks">${esc(t.recThanks)}</div>
          <div class="barcode"></div>
        </div>
      </div>
    </section>`;
  }

  function stepsHardware({ t, d }) {
    return `
    <section id="hardware" class="light" data-screen-label="steps and hardware">
      <div class="wrap steps-hw">
        <div>
          <h2 class="h2">${esc(t.stepsTitle)}</h2>
          <div class="steps">
            ${map(d.steps, (s, i) => `<div class="step"><div class="n">${pad2(i)}</div><div class="t">${esc(s.title)}</div><div class="b">${esc(s.body)}</div></div>`)}
          </div>
        </div>
        <div>
          <div class="rule-light"></div>
          <div class="hw-head"><h2>${esc(t.hwTitle)}</h2><div>${esc(t.hwNote)}</div></div>
          <div class="hw-grid">
            ${map(d.hardware, (h, i) => `
              <div class="hw">
                <div class="hw-photo"><img src="assets/hw-${HW_PHOTOS[i]}.png" alt="${esc(h.name)}"></div>
                <div><div class="hw-name">${esc(h.name)}</div><div class="hw-spec">${esc(h.spec)}</div></div>
              </div>`)}
          </div>
        </div>
      </div>
    </section>`;
  }

  function integrations({ sa, t }) {
    const col = (title, logos) => `
      <div class="int-col">
        <div class="int-col-title">${esc(title)}</div>
        <div class="int-logos">
          ${map(logos.filter(l => !l.only || l.only === (sa ? 'SA' : 'AE')), l => `
            <div class="int-logo"${l.bg ? ` style="background:${l.bg}"` : ''}><img src="assets/int-${l.key}.png" alt="${esc(l.name)}"></div>`)}
        </div>
      </div>`;
    return `
    <section class="light" data-screen-label="integrations">
      <div class="wrap integrations">
        <div class="rule-mid"></div>
        <div class="stack int-head">
          <div class="overline eyebrow">${esc(t.intTitle)}</div>
          <h2>${esc(t.intHeadline)}</h2>
        </div>
        <div class="int-grid">
          ${col(t.intPay, INTEGRATIONS.pay)}
          ${col(t.intMarket, INTEGRATIONS.market)}
          ${col(t.intErp, INTEGRATIONS.erp)}
        </div>
      </div>
    </section>`;
  }

  function pricing({ t, d, cur }) {
    if (!config.showPricing) return '';
    return `
    <section id="pricing" class="light" data-screen-label="pricing">
      <div class="wrap pricing">
        <div class="price-head">
          <div><h2 class="h2">${esc(t.priceTitle)}</h2><div class="sub">${esc(t.priceSub)}</div></div>
          <div class="note">${esc(t.priceNote)}</div>
        </div>
        <div class="plans">
          ${map(d.plans, (p, i) => `
            <div class="plan${i === 1 ? ' hi' : ''}">
              <div class="plan-top"><div class="plan-name">${esc(p.name)}</div>${i === 1 ? `<span class="overline plan-badge">${esc(t.priceBadge)}</span>` : ''}</div>
              <div class="plan-price">${esc(p.price ? `${cur} ${p.price}` : p.priceLabel)}</div>
              <div class="plan-desc">${esc(p.desc)}</div>
              <div class="plan-items">
                ${p.lead ? `<div class="lead-in">${esc(p.lead)}</div>` : ''}
                ${map(p.items, it => `<div class="it"><span>✓</span><span>${esc(it)}</span></div>`)}
              </div>
              ${p.excluded && p.excluded.length ? `
                <div class="plan-excl">
                  <div class="overline">${esc(t.notIncluded)}</div>
                  ${map(p.excluded, x => `<div class="it"><span>—</span><span>${esc(x)}</span></div>`)}
                </div>` : ''}
              <a class="btn plan-btn" href="#contact">${esc(p.btn)}</a>
            </div>`)}
        </div>
      </div>
    </section>`;
  }

  function stories({ c, d }) {
    return `
    <div class="wrap"><div class="rule-dark"></div></div>
    <section class="wrap stories" data-screen-label="stories">
      <div class="story-grid">
        ${map(d.stories[c], s => `
          <figure class="story" style="margin:0">
            <div class="stat">${esc(s.stat)}</div>
            <blockquote class="q" style="margin:0">“${esc(s.quote)}”</blockquote>
            <figcaption class="who">${esc(s.who)} · ${esc(s.where)}</figcaption>
          </figure>`)}
      </div>
    </section>`;
  }

  function faq({ c, t, d }) {
    return `
    <div class="wrap"><div class="rule-dark"></div></div>
    <section id="faq" class="wrap faq" data-screen-label="faq">
      <h2>${esc(t.faqTitle)}</h2>
      <div class="faq-list">
        ${map(d.faq[c], (f, i) => {
          const open = state.openFaq === i;
          return `
          <div class="faq-item">
            <button class="faq-q" data-act="faq" data-i="${i}" aria-expanded="${open}"><span>${esc(f.q)}</span><span class="sign">${open ? '−' : '+'}</span></button>
            ${open ? `<div class="faq-a">${esc(f.a)}</div>` : ''}
          </div>`;
        })}
      </div>
    </section>`;
  }

  function contact({ c, t, d }) {
    return `
    <section id="contact" class="contact" data-screen-label="contact">
      <div class="wrap split">
        <div class="stack">
          <h2>${esc(t.contactTitle)}</h2>
          <a class="btn btn-dark btn-lg" href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">${WA_ICON}${esc(t.cta)}</a>
          <div class="phone" dir="ltr">+971 44 910000</div>
        </div>
        <form class="form" id="callback">
          <div class="form-title">${esc(t.formTitle)}</div>
          <input id="f-name" name="name" required autocomplete="name" placeholder="${esc(t.fName)}" aria-label="${esc(t.fName)}">
          <input id="f-phone" name="phone" type="tel" required autocomplete="tel" dir="ltr" placeholder="${esc(t.fPhone)}" aria-label="${esc(t.fPhone)}">
          <select id="f-type" name="type" aria-label="Store type">${map(d.retail[c], r => `<option>${esc(r)}</option>`)}</select>
          <button class="btn btn-primary" type="submit">${esc(t.fSend)}</button>
        </form>
      </div>
    </section>`;
  }

  function footer(v) {
    const { t } = v;
    return `
    <footer class="wrap footer" data-screen-label="footer">
      <div class="foot-grid">
        <div class="foot-col foot-brand"><img src="assets/edukaan-white.png" alt="edukaan by tradeling"><div>${esc(t.footBlurb)}</div></div>
        <div class="foot-col">
          <div class="overline">${esc(t.footGroup)}</div>
          <div class="foot-logo">${groupLogo(v)}</div>
          <div>${esc(t.footAddr)}</div>
        </div>
        <div class="foot-col">
          <div class="overline">${esc(t.footContact)}</div>
          <div dir="ltr">+971 44 910000</div>
          <a href="mailto:support@tradeling.com" style="color:inherit">support@tradeling.com</a>
        </div>
      </div>
      <div class="foot-bottom"><span>© 2026 Tradeling Group. ${esc(t.footRights)}</span><span>${esc(t.footPrivacy)}</span></div>
    </footer>`;
  }

  // ---------- hero POS demo (re-rendered every tick) ----------
  // Timeline: type each item into the search box, add it, then pay, then loop.

  function renderPos() {
    const live = document.getElementById('pos-live'), side = document.getElementById('pos-side');
    if (!live) return;
    const { c, sa, t, d, cur } = ctx();
    const cartSrc = d.cart[c];
    const anim = config.animateDemo;
    const PAUSE = 5, PAY_HOLD = 10, DONE_HOLD = 16;
    const segs = cartSrc.map(x => Math.min(x[0].length, 22) + PAUSE);
    const total = segs.reduce((a, b) => a + b, 0) + 8 + PAY_HOLD + DONE_HOLD;
    let f = anim ? state.tick % total : total, shown = cartSrc.length, typed = '', paying = false, paid = false;
    if (anim) {
      shown = 0;
      for (let i = 0; i < segs.length; i++) {
        if (f < segs[i]) { typed = cartSrc[i][0].slice(0, Math.min(f, cartSrc[i][0].length, 22)); break; }
        f -= segs[i]; shown = i + 1;
      }
      if (shown === cartSrc.length) {
        if (f >= 8) paying = true;
        if (f >= 8 + PAY_HOLD) paid = true;
      }
    }
    const cursor = anim && !paid && state.tick % 6 < 3 ? '|' : ' ';
    const visible = cartSrc.slice(0, shown);
    const rate = sa ? 0.15 : 0.05, sub = visible.reduce((s, x) => s + x[1], 0), vat = sub * rate / (1 + rate);
    const fmt = n => `${cur} ${n.toFixed(2)}`;

    live.outerHTML = `<div id="pos-live" style="display:contents">
      <div class="scan${typed ? ' typing' : ''}">${esc(typed ? typed + cursor : t.scanHint)}</div>
      <div class="cart">
        ${map(visible, x => `<div class="row"><span>${esc(x[0])}</span><span class="amt">${esc(fmt(x[1]))}</span></div>`)}
        ${paid ? `<div class="paid-overlay"><div class="paid-chip"><i>✓</i>${esc(t.paidLabel)}</div></div>` : ''}
      </div>
      <div class="totals">
        <div class="row vat"><span>${esc(t.vatLine)}</span><span>${esc(fmt(vat))}</span></div>
        <div class="row grand"><span>${esc(t.total)}</span><span>${esc(fmt(sub))}</span></div>
      </div>
    </div>`;
    side.innerHTML = `
      <div class="overline">${esc(t.payWith)}</div>
      ${map(d.pay[c], (name, i) => `<div class="pay${i === 0 ? ' primary' : ''}${i === 0 && paying ? ' paying' : ''}">${esc(name)}</div>`)}
      <div class="comp-foot"><span class="dot" style="background:var(--green)"></span>${esc(t.compFoot)}</div>`;
  }

  // ---------- full render ----------

  function render() {
    // keep anything typed into the call-back form across re-renders
    const kept = ['f-name', 'f-phone', 'f-type'].map(id => document.getElementById(id)?.value);
    const v = ctx();
    document.documentElement.lang = v.l;
    document.documentElement.dir = v.ar ? 'rtl' : 'ltr';
    document.title = v.ar ? 'إدكان POS' : 'Edukaan POS';
    app.innerHTML = nav(v) + '<main>' + hero(v) + trusted(v) + features(v) + hub(v) + reporting(v) + wholesale(v)
      + stepsHardware(v) + integrations(v) + pricing(v) + stories(v) + faq(v) + contact(v) + '</main>' + footer(v);
    ['f-name', 'f-phone'].forEach((id, i) => { if (kept[i]) document.getElementById(id).value = kept[i]; });
    renderPos();
    requestAnimationFrame(pickFeat);
  }

  function setState(patch) { Object.assign(state, patch); render(); }

  // ---------- events ----------

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) {
      if (state.regionOpen && !e.target.closest('.region')) setState({ regionOpen: false });
      return;
    }
    const i = Number(el.dataset.i);
    switch (el.dataset.act) {
      case 'region': setState({ regionOpen: !state.regionOpen }); break;
      case 'country': setState({ country: el.dataset.cc, lang: null, regionOpen: false, feat: 0, openFaq: -1 }); break;
      case 'lang': setState({ lang: el.dataset.l, regionOpen: false }); break;
      case 'feat-jump': {
        const el = document.querySelectorAll('.feat-step')[i];
        if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * 0.15, behavior: 'smooth' });
        break;
      }
      case 'faq': setState({ openFaq: state.openFaq === i ? -1 : i }); break;
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && state.regionOpen) setState({ regionOpen: false });
  });

  // Call-back form: hand the details to WhatsApp so the team gets them straight away.
  document.addEventListener('submit', e => {
    if (e.target.id !== 'callback') return;
    e.preventDefault();
    const f = e.target.elements;
    const msg = `Hi Edukaan, please call me back.\nName: ${f.namedItem('name').value}\nWhatsApp: ${f.namedItem('phone').value}\nStore type: ${f.namedItem('type').value}\nMarket: ${COPY.en.names[country()]}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });

  render();
  let raf = 0;
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; pickFeat(); }); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  setTimeout(pickFeat, 300);
  // Hero tablet swings in from a slight angle shortly after load.
  setTimeout(() => { state.posIn = true; document.querySelector('.pos')?.classList.add('in'); }, reducedMotion ? 0 : 600);
  if (config.animateDemo) setInterval(() => { if (!document.hidden) { state.tick++; renderPos(); } }, 110);
})();
