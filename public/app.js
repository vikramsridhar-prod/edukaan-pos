// Edukaan POS landing page.
// template.js holds the design's markup verbatim ({{ }} bindings, <sc-if>, <sc-for>); content.js holds its copy
// and data. This file renders that template and ports the design's Component logic (state, derived values, effects).
// URL options: ?country=SA  ?lang=en|ar|hi|ur  ?pricing=0 (hide pricing)
(function () {
  'use strict';

  const LANGS = ['en', 'ar', 'hi', 'ur'];
  // Tradeling's reCAPTCHA v3 site key (public by design); the CRM's leads endpoint needs a token from it. This is the
  // production key; the server can supply another one (RECAPTCHA_SITE_KEY, e.g. staging) through GET api/config.
  const RECAPTCHA_SITE_KEY = '6LfGq-keAAAAAIaTPgUvRvwnWF9GtmtAce0o9E1B';
  const RECAPTCHA_ACTION = 'contactUs';
  const params = new URLSearchParams(location.search);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const props = {
    country: params.get('country') === 'SA' ? 'SA' : 'AE',
    lang: LANGS.includes(params.get('lang')) ? params.get('lang') : 'auto',
    showPricing: params.get('pricing') !== '0',
  };

  // ---------------------------------------------------------------------------
  // Template renderer: builds DOM from the template with a scope, then morphs it into the page so
  // elements keep their identity (scroll positions, effect-driven inline styles) across renders.
  // ---------------------------------------------------------------------------

  const tplEl = document.createElement('template');
  tplEl.innerHTML = window.EDUKAAN_TEMPLATE;
  const SKIP_ATTRS = /^(hint-|style-(hover|focus|active)$)/;
  const EXPR = /\{\{\s*([^}]+?)\s*\}\}/g;
  const ONLY_EXPR = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;

  // Contact form fields that are not in the design file: company name and email (both required; the CRM needs an email). They are
  // cloned from the design's name field, so they match its styling, and re-applied on every design sync. Every input
  // also gets a name so the submit handler can find it.
  (function addFormFields() {
    const form = tplEl.content.querySelector('#contact');
    const nameInput = form && form.querySelector('input[placeholder="{{ t.fName }}"]');
    const phoneInput = form && form.querySelector('input[placeholder="{{ t.fPhone }}"]');
    if (!nameInput || !phoneInput) return;
    const field = (name, placeholder, extra) => {
      const el = nameInput.cloneNode(false);
      el.setAttribute('name', name);
      el.setAttribute('placeholder', placeholder);
      el.setAttribute('aria-label', placeholder);
      for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v);
      return el;
    };
    nameInput.setAttribute('name', 'name');
    nameInput.setAttribute('autocomplete', 'name');
    phoneInput.setAttribute('name', 'phone');
    phoneInput.setAttribute('autocomplete', 'tel');
    nameInput.after(field('company', '{{ fCompany }}', { autocomplete: 'organization' }));
    phoneInput.after(field('email', '{{ fEmail }}', { type: 'email', autocomplete: 'email', inputmode: 'email', dir: 'ltr' }));
    form.querySelector('input[placeholder="{{ shopOtherPh }}"]')?.setAttribute('name', 'storeOther');

    // After a successful send the card shows a confirmation instead of the fields; a failed send shows an error
    // above the button. The button reads "Sending…" while the request is in flight.
    const card = nameInput.parentElement;
    const sendBtn = [...card.querySelectorAll('button')].find(b => b.textContent.includes('{{ t.fSend }}'));
    if (!sendBtn) return;
    sendBtn.setAttribute('name', 'send');
    sendBtn.setAttribute('aria-busy', '{{ formSending }}');
    sendBtn.textContent = '{{ sendLabel }}';
    const tpl = html => { const t = document.createElement('template'); t.innerHTML = html; return t.content.firstElementChild; };
    const fields = tpl('<sc-if value="{{ formOpen }}"></sc-if>');
    while (card.firstChild) fields.appendChild(card.firstChild);
    card.appendChild(fields);
    sendBtn.before(tpl('<sc-if value="{{ formError }}"><div role="alert" style="background:#faefed;color:#9b1106;border-radius:8px;padding:12px 14px;font-size:14px;line-height:20px">{{ formErrorText }}</div></sc-if>'));
    card.appendChild(tpl(`<sc-if value="{{ formSent }}"><div role="status" aria-live="polite" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:16px;min-height:360px;padding:16px 8px">
      <span style="width:64px;height:64px;border-radius:50%;background:#E9FAF0;display:flex;align-items:center;justify-content:center"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg></span>
      <div style="font-size:24px;line-height:32px;font-weight:600">{{ sentTitle }}</div>
      <div style="font-size:16px;line-height:24px;color:#505153;max-width:36ch">{{ sentBody }}</div>
    </div></sc-if>`));
  })();

  // style-hover / style-focus / style-active become generated CSS classes (inline styles need !important to lose).
  const pseudoClass = new WeakMap();
  (function buildPseudoCss() {
    let n = 0, css = '';
    tplEl.content.querySelectorAll('*').forEach(el => {
      const rules = [['hover', ':hover'], ['focus', ':focus'], ['active', ':active']].filter(([k]) => el.hasAttribute('style-' + k));
      if (!rules.length) return;
      const cls = 'dx' + n++;
      pseudoClass.set(el, cls);
      for (const [k, sel] of rules) {
        const decls = el.getAttribute('style-' + k).split(';').map(s => s.trim()).filter(Boolean)
          .map(d => d.replace(/\s*!important\s*$/, '') + ' !important').join(';');
        css += `.${cls}${sel}{${decls}}\n`;
      }
    });
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  })();

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function lookup(path, scope) {
    if (path === 'true') return true;
    if (path === 'false') return false;
    const [head, ...rest] = path.split('.');
    let v = scope[head];
    for (const k of rest) v = v == null ? undefined : v[k];
    return v;
  }
  const raw = (value, scope) => { const m = ONLY_EXPR.exec(value); return m ? lookup(m[1], scope) : value; };
  const interp = (value, scope) => value.replace(EXPR, (_, p) => { const v = lookup(p, scope); return v == null || v === false ? '' : String(v); });

  function build(nodes, scope, out) {
    for (const node of nodes) {
      if (node.nodeType === 3) {
        // Plain values join into text; {html} values (markup built in vals()) are parsed in place.
        let text = '', pos = 0;
        const flush = () => { if (text) out.push(document.createTextNode(text)); text = ''; };
        for (const m of node.nodeValue.matchAll(EXPR)) {
          text += node.nodeValue.slice(pos, m.index);
          pos = m.index + m[0].length;
          const v = lookup(m[1], scope);
          if (v && v.html !== undefined) {
            flush();
            const t = document.createElement('template');
            t.innerHTML = v.html;
            for (const c of [...t.content.childNodes]) out.push(markStatic(c));
          } else if (v != null && v !== false) text += String(v);
        }
        text += node.nodeValue.slice(pos);
        flush();
        continue;
      }
      if (node.nodeType !== 1) continue;
      const tag = node.localName;
      if (tag === 'sc-if') { if (raw(node.getAttribute('value'), scope)) build(node.childNodes, scope, out); continue; }
      if (tag === 'sc-for') {
        const list = raw(node.getAttribute('list'), scope) || [];
        const as = node.getAttribute('as');
        list.forEach((item, i) => build(node.childNodes, { ...scope, [as]: item, $index: i }, out));
        continue;
      }
      if (tag === 'x-import') continue; // design image-slot placeholder (empty story avatar)
      out.push(buildElement(node, scope));
    }
    return out;
  }

  // Elements parsed from an {html} value: record their attributes so morph can diff them like template elements.
  function markStatic(node) {
    if (node.nodeType !== 1) return node;
    node.__last = {}; node.__h = {};
    for (const a of node.attributes) node.__last[a.name] = a.value;
    node.childNodes.forEach(markStatic);
    return node;
  }

  function buildElement(node, scope) {
    const el = document.createElementNS(node.namespaceURI, node.localName);
    el.__last = {};
    el.__h = {};
    for (const a of node.attributes) {
      if (/^on[a-z]+$/.test(a.name)) {
        const fn = raw(a.value, scope);
        if (typeof fn === 'function') el.__h[a.name.slice(2)] = fn;
        continue;
      }
      if (a.name === 'ref') { el.__ref = raw(a.value, scope); continue; }
      if (SKIP_ATTRS.test(a.name)) continue;
      let v = interp(a.value, scope);
      if (a.name === 'class' && pseudoClass.has(node)) v += ' ' + pseudoClass.get(node);
      el.__last[a.name] = v;
      el.setAttribute(a.name, v);
    }
    if (pseudoClass.has(node) && !node.hasAttribute('class')) {
      el.__last.class = pseudoClass.get(node);
      el.setAttribute('class', el.__last.class);
    }
    for (const type of Object.keys(el.__h)) listen(el, type);
    if (el.__ref) el.__ref.current = el;
    for (const child of build(node.childNodes, scope, [])) el.appendChild(child);
    return el;
  }

  // One real listener per element and event type; it calls whichever handler the latest render bound.
  function listen(el, type) {
    el.__on = el.__on || {};
    if (el.__on[type]) return;
    el.__on[type] = true;
    el.addEventListener(type, e => el.__h[type] && el.__h[type](e), type === 'scroll' ? { passive: true } : undefined);
  }

  const sameKind = (a, b) => a.nodeType === b.nodeType && (a.nodeType !== 1 || (a.localName === b.localName && a.namespaceURI === b.namespaceURI));

  function morph(oldEl, newEl) {
    // Only touch attributes this renderer set, so effect-driven inline styles survive unless the template value changed.
    const last = oldEl.__last || {};
    for (const [k, v] of Object.entries(newEl.__last)) if (last[k] !== v) oldEl.setAttribute(k, v);
    for (const k of Object.keys(last)) if (!(k in newEl.__last)) oldEl.removeAttribute(k);
    oldEl.__last = newEl.__last;
    oldEl.__h = newEl.__h;
    for (const type of Object.keys(newEl.__h)) listen(oldEl, type);
    if (newEl.__ref) { oldEl.__ref = newEl.__ref; newEl.__ref.current = oldEl; }
    morphChildren(oldEl, [...newEl.childNodes]);
  }

  function morphChildren(parent, next) {
    const prev = [...parent.childNodes];
    next.forEach((n, i) => {
      const o = prev[i];
      if (!o) parent.appendChild(n);
      else if (!sameKind(o, n)) parent.replaceChild(n, o);
      else if (n.nodeType === 1) { if (o.__last) morph(o, n); else parent.replaceChild(n, o); }
      else if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue;
    });
    for (let i = next.length; i < prev.length; i++) prev[i].remove();
  }

  // ---------------------------------------------------------------------------
  // Component: state + derived values (port of the design's renderVals / _rv).
  // ---------------------------------------------------------------------------

  const state = { formStatus: 'idle', country: null, lang: null, openFaq: 0, regionOpen: false, langOpen: false, shopOpen: false, shop: null, cmpOpen: false, chartTab: 'rev', velHover: -1, hwHover: -1, navSolid: false, replIn: false, sStart: true, sEnd: false };
  const refs = { hw: { current: null }, hwTrack: { current: null }, hwBar: { current: null }, story: { current: null }, repl: { current: null }, shop: { current: null } };
  const featRefs = Array.from({ length: 6 }, () => ({ current: null }));

  const FORM_COPY = {
    fCompany: { en: 'Company or shop name', ar: 'اسم الشركة أو المحل', hi: 'कंपनी या दुकान का नाम', ur: 'کمپنی یا دکان کا نام' },
    fEmail: { en: 'Email', ar: 'البريد الإلكتروني', hi: 'ईमेल', ur: 'ای میل' },
    sending: { en: 'Sending…', ar: 'جارٍ الإرسال…', hi: 'भेजा जा रहा है…', ur: 'بھیجا جا رہا ہے…' },
    sentTitle: { en: 'Thank you!', ar: 'شكراً لك!', hi: 'धन्यवाद!', ur: 'شکریہ!' },
    sentBody: {
      en: 'Your request has been submitted. One of our team members will get in touch within the next 48 hours.',
      ar: 'تم إرسال طلبك. سيتواصل معك أحد أعضاء فريقنا خلال 48 ساعة.',
      hi: 'आपका अनुरोध भेज दिया गया है। हमारी टीम का कोई सदस्य अगले 48 घंटों में आपसे संपर्क करेगा।',
      ur: 'آپ کی درخواست جمع ہو گئی ہے۔ ہماری ٹیم کا کوئی رکن اگلے 48 گھنٹوں میں آپ سے رابطہ کرے گا۔',
    },
    sendError: {
      en: 'Something went wrong and your request was not sent. Please try again.',
      ar: 'حدث خطأ ولم يُرسل طلبك. يرجى المحاولة مرة أخرى.',
      hi: 'कुछ गलत हो गया और आपका अनुरोध नहीं भेजा गया। कृपया फिर से कोशिश करें।',
      ur: 'کچھ غلط ہو گیا اور آپ کی درخواست نہیں بھیجی گئی۔ براہ کرم دوبارہ کوشش کریں۔',
    },
  };
  const OTHER = { en: 'Other', ar: 'أخرى', hi: 'अन्य', ur: 'دیگر' };
  const OTHER_PH = { en: 'Your shop type', ar: 'نوع محلك', hi: 'आपकी दुकान का प्रकार', ur: 'آپ کی دکان کی قسم' };
  const SMART = { en: ['Smart', 'before'], ar: ['الذكية', 'after'], hi: ['स्मार्ट', 'before'], ur: ['اسمارٹ', 'before'] };

  const country = () => state.country ?? props.country;
  const lang = () => state.lang || (props.lang !== 'auto' ? props.lang : country() === 'SA' ? 'ar' : 'en');

  // Animated line joining the three setup steps (two halves, each with a moving highlight).
  function stepLine(rtl) {
    const seg = (left, delay) => `<div style="position:absolute;top:0;bottom:0;left:${left};width:50%;overflow:hidden;transform:${rtl ? 'scaleX(-1)' : 'none'}"><div style="position:absolute;top:0;bottom:0;left:0;width:40%;background:linear-gradient(90deg,rgba(79,220,133,0) 0%,#4FDC85 50%,rgba(79,220,133,0) 100%);animation:stepFlow 2.8s cubic-bezier(.45,0,.55,1) ${delay}s infinite"></div></div>`;
    return { html: `<div style="position:absolute;inset:0;background:#dcdee0">${seg('0%', 0)}${seg('50%', 1.4)}</div>` };
  }

  function storyGo(n) {
    const el = refs.story.current; if (!el) return;
    const card = el.firstElementChild;
    const w = card ? card.getBoundingClientRect().width + 24 : el.clientWidth;
    const rtl = getComputedStyle(el).direction === 'rtl';
    el.scrollBy({ left: n * w * (rtl ? -1 : 1), behavior: 'smooth' });
  }
  function storyScroll() {
    const el = refs.story.current; if (!el) return;
    const x = Math.abs(el.scrollLeft);
    const s = x < 4, e = x + el.clientWidth >= el.scrollWidth - 4;
    if (s !== state.sStart || e !== state.sEnd) setState({ sStart: s, sEnd: e });
  }

  function vals() {
    const c = country(), l = lang(), sa = c === 'SA', ar = l === 'ar' || l === 'ur';
    const cur = l === 'ar' ? (sa ? 'ر.س' : 'د.إ') : (sa ? 'SAR' : 'AED');
    const CL = COPY[l] || COPY.en;
    const t = { ...COPY.en.base, ...COPY.en[c], ...CL.base, ...CL[c] };
    const d = { ...DATA.en, ...(DATA[l] || {}) };
    const langs = LANGS.map(k => { const on = k === l; return { key: k, label: LANG_LABELS[k], active: on, bg: on ? '#E9FAF0' : 'transparent', pick: () => setState({ lang: k, langOpen: false }) }; });
    const countries = ['AE', 'SA'].map(cc => ({ name: COUNTRY_NAMES[cc], flag: FLAGS[cc], ae: cc === 'AE', sa: cc === 'SA', active: cc === c, bg: cc === c ? '#E9FAF0' : 'transparent', pick: () => setState({ country: cc, lang: null, regionOpen: false, openFaq: 0, shop: null }) }));
    const faqs = d.faq[c].map((f, i) => ({ ...f, border: i === 0 ? 'none' : '1px solid #d3d4d6', open: state.openFaq === i, sign: state.openFaq === i ? '−' : '+', toggle: () => setState({ openFaq: state.openFaq === i ? -1 : i }) }));
    const nf = d.features[c].length;
    const features = d.features[c].map((f, i) => ({
      ...f, chips: f.chips || [], stat: f.stat || '', statLabel: f.statLabel || '', mini: f.mini || [], badge: f.badge || '', tiles: f.tiles || [],
      n: String(i + 1).padStart(2, '0'), total: String(nf).padStart(2, '0'), stickyTop: (96 + i * 28) + 'px', stickyMb: ((nf - 1 - i) * 28) + 'px',
      ...(i === nf - 1 ? { cardBg: '#091233', fg: '#fff', muted: '#C3CBE8', pillBg: '#1E2A5A', rule: '#2A3666' } : { cardBg: '#f3f4f5', fg: '#1b1c1d', muted: '#505153', pillBg: '#fff', rule: '#dcdee0' }),
      ref: featRefs[i],
    }));
    const plans = d.plans.map((p, i) => {
      const hi = i === 1;
      return { ...p, price: p.price ? `${cur} ${p.price}` : p.priceLabel, hasExcluded: !!(p.excluded && p.excluded.length), excluded: p.excluded || [], lead: p.lead || null, keyItems: p.items.slice(0, 4), per: p.price ? p.desc.split(' · ')[0] : null, desc: p.price ? p.desc.split(' · ').slice(1).join(' · ') : p.desc, popular: hi ? (t.priceBadgePopular || 'Most popular') : null, outerPad: hi ? '0 4px 4px' : '0', outerMt: hi ? '0' : '36px', outerBg: hi ? 'linear-gradient(180deg,#FFD866 0%,#FCB808 55%,#C98F00 100%)' : 'transparent', outerShadow: hi ? '0 24px 48px -24px rgba(252,184,8,.45)' : 'none', innerBorder: hi ? 'transparent' : '#e6e8ea', innerShadow: hi ? 'none' : '0 1px 2px rgba(8,9,10,.05),0 16px 32px -24px rgba(8,9,10,.18)', colBg: hi ? '#FFFAEB' : 'transparent', btnBg: hi ? '#FCB808' : '#fff', btnFg: hi ? '#021B18' : '#1b1c1d', btnBorder: hi ? '#FCB808' : '#d3d4d6', btnSize: '16px', badge: null };
    });
    const Y = true, N = false;
    const cmpData = [
      { name: 'Outlets & users', rows: [['Outlets', '1', 'Up to 10', 'Unlimited'], ['Users', 'Up to 3', 'Up to 30', 'Unlimited'], ['Installations', '1 register', 'Per outlet', 'Unlimited']] },
      { name: 'Selling', rows: [['Catalogue, search & cart', Y, Y, Y], ['IMEI & serial capture', Y, Y, Y], ['Cash payments', Y, Y, Y], ['Integrated payment terminal', N, Y, Y], ['BNPL — Tabby & Tamara', N, Y, Y], ['Promotions, VAS & loyalty', N, Y, Y]] },
      { name: 'Stock & channels', rows: [['Real-time stock', 'One outlet', 'All outlets', 'All outlets'], ['Marketplace integrations', N, '2 channels', 'Unlimited'], ['Smart replenishment from Tradeling', N, Y, Y], ['AI recommendations & auto-cataloguing', N, Y, Y]] },
      { name: 'Finance & reporting', rows: [['Tax-compliant invoicing', Y, Y, Y], ['Accounting module', 'Basic', 'Advanced', 'Advanced'], ['Reports', 'Standard', 'Advanced analytics', 'Advanced analytics'], ['QFunder credit line', N, N, Y]] },
      { name: 'Integrations & support', rows: [['Custom & ERP integrations, open API', N, N, Y], ['Custom development', N, N, Y], ['Data migration', N, N, 'White-glove'], ['Support', 'Email', 'Priority, extended hours', 'Dedicated CSM · SLA']] },
    ];
    const cmpGroups = cmpData.map(g => ({ name: g.name, rows: g.rows.map(r => ({ label: r[0], cells: r.slice(1).map((v, ci) => ({ yes: v !== false, no: v === false, text: v === true ? 'Included' : v === false ? '' : v, bg: ci === 1 ? '#FFFAEB' : 'transparent' })) })) }));

    // Reporting: "Product velocity" chart derived from top sellers / slow movers.
    const chart = (() => {
      const num = v => parseInt(String(v).replace(/[^0-9]/g, ''), 10) || 0;
      const top = d.rep[c].top, slow = d.rep[c].slow;
      const wt = [.21, .24, .26, .29], sw = [[0, 0, 0, 0], [1, 0, 1, 0], [0, 1, 1, 1]];
      const wk = [0, 1, 2, 3].map(i => ({ top: top.map(r => Math.round(num(r.v) * wt[i])), slow: slow.map((r, j) => Math.min(num(r.v), (sw[j] || [0, 0, 0, 0])[i])) }));
      const tT = wk.map(w => w.top.reduce((a, b) => a + b, 0)), tS = wk.map(w => w.slow.reduce((a, b) => a + b, 0));
      const ymax = Math.max(...tT) * 1.15 || 1;
      const X = i => 37.5 + i * 75, Yp = v => 118 - (v / ymax) * 112;
      const line = arr => arr.map((v, i) => (i ? 'L' : 'M') + X(i) + ' ' + Yp(v).toFixed(1)).join('');
      const hv = state.velHover;
      const labels = l === 'ar' ? ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'] : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const pts = [...tT.map((v, i) => ({ x: X(i) / 3 + '%', y: Yp(v) / 1.2 + '%', c: '#2f9e44', s: hv === i ? 'scale(1.4)' : 'scale(1)' })), ...tS.map((v, i) => ({ x: X(i) / 3 + '%', y: Yp(v) / 1.2 + '%', c: '#25D366', s: hv === i ? 'scale(1.4)' : 'scale(1)' }))];
      const tip = hv == null || hv < 0 ? null : { x: X(hv) / 3 + '%', tf: hv === 0 ? 'translateX(-10%)' : hv === 3 ? 'translateX(-90%)' : 'translateX(-50%)', label: labels[hv], rows: [...top.map((r, j) => ({ item: r.item, n: wk[hv].top[j], c: '#2f9e44' })), ...slow.map((r, j) => ({ item: r.item, n: wk[hv].slow[j], c: '#25D366' }))] };
      const ct = state.chartTab;
      return {
        chartTabs: [['rev', t.repChart], ['vel', l === 'ar' ? 'حركة المنتجات' : 'Product velocity']].map(([k, label]) => ({ label, go: () => setState({ chartTab: k }), bg: ct === k ? '#fff' : 'transparent', fg: ct === k ? '#1b1c1d' : '#505153', sh: ct === k ? '0 1px 2px rgba(8,9,10,.08),inset 0 0 0 1px #e6e8ea' : 'none' })),
        showRev: ct === 'rev', showVel: ct === 'vel', chartNote: ct === 'rev' ? t.repChartNote : (l === 'ar' ? 'وحدات أسبوعياً · مرّر للتفاصيل' : 'Units per week · hover for detail'),
        velLineTop: line(tT), velAreaTop: line(tT) + 'L' + X(3) + ' 120L' + X(0) + ' 120Z', velLineSlow: line(tS), velGuide: tip ? 'M' + X(hv) + ' 0V120' : '', velPts: pts, velTip: tip,
        velLeave: () => setState({ velHover: -1 }), velCols: labels.map((lab, i) => ({ label: lab, enter: () => setState({ velHover: i }) })),
      };
    })();

    const types = [...(d.retail[c] || []), OTHER[l] || OTHER.en];
    const shopSel = state.shop ?? types[0];
    const shopOpen = state.shopOpen;
    const shopIsOther = shopSel === types[types.length - 1];

    // Hero headline: the "POS" in heroC becomes a yellow "Smart POS" (Arabic: "نقاط البيع الذكية").
    const hc = t.heroC || '', hm = hc.match(/POS|نقاط البيع/), hi0 = hm ? hm.index : -1;
    const smart = SMART[l] || SMART.en;
    const posWord = smart[1] === 'before' ? `<span>${esc(smart[0])}</span> ${esc(hm && hm[0])}` : `${esc(hm && hm[0])} <span>${esc(smart[0])}</span>`;

    return {
      heroPre: hm ? hc.slice(0, hi0) : hc, heroPosWord: hm ? { html: `<span style="color:#FCB808;white-space:nowrap">${posWord}</span>` } : '', heroPost: hm ? hc.slice(hi0 + hm[0].length) : '',
      saOnlyDisp: sa ? 'inline' : 'none',
      navBg: state.navSolid ? 'rgba(30,57,162,.92)' : 'transparent', navBlur: state.navSolid ? 'blur(12px)' : 'none', navLine: state.navSolid ? 'rgba(255,255,255,.14)' : 'transparent',
      dir: ar ? 'rtl' : 'ltr', isRtl: ar, isLtr: !ar, heroFlip: 'none', bidi: l === 'ur' || l === 'hi' ? 'mixed' : 'none', t, isSA: sa, isAE: !sa, showPricing: props.showPricing,
      countryLabel: { AE: 'UAE', SA: 'KSA' }[c] || c, countryFlag: FLAGS[c], regionOpen: state.regionOpen, toggleRegion: () => setState({ regionOpen: !state.regionOpen, langOpen: false }), countries,
      langs, langLabel: LANG_LABELS[l], langOpen: state.langOpen, toggleLang: () => setState({ langOpen: !state.langOpen, regionOpen: false }),
      retailTypes: d.retail[c] || [], features,
      receipt: d.receipt[c], steps: d.steps.map((s, i) => ({ n: String(i + 1).padStart(2, '0'), ...s })), stepLine: stepLine(ar),
      cmpGroups, cmpRows: state.cmpOpen ? '1fr' : '0fr', cmpChevron: state.cmpOpen ? 'rotate(180deg)' : 'rotate(0deg)', cmpLabel: state.cmpOpen ? 'Hide full comparison' : 'Compare all features', cmpTitle: 'Compare features by plan', cmpSub: 'Every feature, side by side.', cmpFeature: 'Feature', toggleCmp: () => setState({ cmpOpen: !state.cmpOpen }),
      hwCards: d.hardware.slice(0, 5).map((x, i) => { const on = state.hwHover === i; const img = ['terminal', 'printer', 'scanner', 'drawer', 'card'][i]; return { ...x, imgUrl: 'url(assets/hw-' + img + '-cut.png)', glow: on ? 1 : 0, scale: on ? 'scale(1.1) translateY(-4%)' : 'scale(1)', enter: () => setState({ hwHover: i }), leave: () => setState({ hwHover: -1 }) }; }),
      plans,
      hubTop: d.hub.slice(0, 3).map((x, i) => ({ ...x, ...ISO[i] })), hubBottom: d.hub.slice(3, 6).map((x, i) => ({ ...x, ...ISO[i + 3] })), hubStats: d.hubStats,
      repPoints: d.repPoints, ...chart,
      repKpis: d.rep[c].kpis.map(k => ({ ...k, v: k.cur ? `${cur} ${k.v}` : k.v, color: k.d.startsWith('−') || k.d.startsWith('-') ? '#9b1106' : '#217220' })),
      repBars: [62, 48, 55, 71, 44, 88, 100].map((h, i) => ({ h: h + '%', day: d.days[i], color: i === 6 ? '#25D366' : '#d3d4d6' })),
      replRef: refs.repl, repl: d.repl[c].map((r, ri) => ({ ...r, op: state.replIn ? 1 : 0, tf: state.replIn ? 'translateY(0)' : 'translateY(16px)', delay: (ri * 140) + 'ms', barDelay: (300 + ri * 140) + 'ms', pctNow: state.replIn ? r.pct : '0%', badgeBg: r.level === 'low' ? '#E9FAF0' : r.level === 'ordered' ? '#dcf0fa' : '#eefaed', badgeFg: r.level === 'low' ? '#128C4A' : r.level === 'ordered' ? '#026c8c' : '#217220', barColor: r.level === 'low' ? '#25D366' : r.level === 'ordered' ? '#06b5eb' : '#37b237' })),
      hwRef: refs.hw, hwTrackRef: refs.hwTrack, hwBarRef: refs.hwBar,
      stories: d.stories[c], storyRef: refs.story, storyScroll, storyPrev: () => storyGo(-1), storyNext: () => storyGo(1), storyPrevOp: state.sStart === false ? 1 : 0.35, storyNextOp: state.sEnd ? 0.35 : 1, arrowFlip: ar ? 'scaleX(-1)' : 'none',
      faqs,
      shopRef: refs.shop, shopOpen, shopLabel: shopSel, shopChev: shopOpen ? 'rotate(180deg)' : 'rotate(0deg)', shopBorder: shopOpen ? '#1E39A2' : '#d3d4d6', shopRing: shopOpen ? '0 0 0 3px rgba(30,57,162,.18)' : 'none',
      toggleShop: () => setState({ shopOpen: !shopOpen }), shopKey: e => { if (e.key === 'Escape') setState({ shopOpen: false }); },
      shopOptions: types.map((r, i) => ({ label: r, active: r === shopSel, bg: r === shopSel ? '#f3f4f5' : 'transparent', weight: r === shopSel ? 600 : 400, pick: () => setState({ shop: r, shopOpen: false, focusOther: i === types.length - 1 }) })),
      shopIsOther, shopOtherPh: OTHER_PH[l] || OTHER_PH.en,
      fCompany: FORM_COPY.fCompany[l] || FORM_COPY.fCompany.en, fEmail: FORM_COPY.fEmail[l] || FORM_COPY.fEmail.en,
      formOpen: state.formStatus !== 'sent', formSent: state.formStatus === 'sent', formSending: state.formStatus === 'sending' ? 'true' : 'false',
      formError: state.formStatus === 'error', formErrorText: FORM_COPY.sendError[l] || FORM_COPY.sendError.en,
      sendLabel: state.formStatus === 'sending' ? (FORM_COPY.sending[l] || FORM_COPY.sending.en) : t.fSend,
      sentTitle: FORM_COPY.sentTitle[l] || FORM_COPY.sentTitle.en, sentBody: FORM_COPY.sentBody[l] || FORM_COPY.sentBody.en,
      lang: l,
    };
  }

  // ---------------------------------------------------------------------------
  // Render loop
  // ---------------------------------------------------------------------------

  const app = document.getElementById('app');
  let scheduled = false;
  function setState(patch) {
    Object.assign(state, patch);
    if (scheduled) return;
    scheduled = true;
    // requestAnimationFrame does not run in hidden tabs, so fall back to a timer there.
    (document.hidden ? fn => setTimeout(fn, 16) : requestAnimationFrame)(() => { scheduled = false; render(); });
  }

  function render() {
    const v = vals();
    document.documentElement.lang = v.lang;
    document.documentElement.dir = v.dir;
    document.title = v.lang === 'ar' ? 'إدكان POS' : 'Edukaan POS';
    morphChildren(app, build(tplEl.content.childNodes, v, []));
    afterRender();
  }

  // ---------------------------------------------------------------------------
  // Effects (scroll-driven motion, reveal-on-scroll, observers)
  // ---------------------------------------------------------------------------

  // Feature cards stack as you scroll: covered cards shrink and dim slightly.
  function stackFx() {
    const els = featRefs.map(r => r.current).filter(Boolean); if (!els.length) return;
    const tops = els.map((el, i) => 96 + i * 28);
    els.forEach((el, i) => {
      let depth = 0; const hgt = el.offsetHeight || 1;
      for (let j = i + 1; j < els.length; j++) { const p = 1 - (els[j].getBoundingClientRect().top - tops[j]) / hgt; depth += Math.max(0, Math.min(1, p)); }
      el.style.transform = 'scale(' + (1 - depth * 0.04).toFixed(4) + ')';
      const prev = els[i - 1]; const over = prev && el.getBoundingClientRect().top < prev.getBoundingClientRect().bottom - 4;
      el.style.boxShadow = over ? '0 -16px 32px -20px rgba(8,9,10,.22)' : 'none';
      el.style.filter = depth > 0.01 ? 'brightness(' + (1 - Math.min(depth, 3) * 0.03).toFixed(3) + ')' : 'none';
    });
  }

  // Hardware: the section is tall; while it is pinned, vertical scroll slides the card track sideways.
  function sizeHw() { const s = refs.hw.current, t = refs.hwTrack.current; if (s && t) s.style.height = (t.scrollWidth - innerWidth + innerHeight + 64) + 'px'; }
  function hwFx() {
    const s = refs.hw.current, t = refs.hwTrack.current; if (!s || !t) return;
    const r = s.getBoundingClientRect(), span = s.offsetHeight - innerHeight, p = span > 0 ? Math.max(0, Math.min(1, -r.top / span)) : 0;
    const dist = Math.max(0, t.scrollWidth - innerWidth), rtl = getComputedStyle(t).direction === 'rtl';
    t.style.transform = 'translate3d(' + ((rtl ? 1 : -1) * p * dist).toFixed(1) + 'px,0,0)';
    if (refs.hwBar.current) refs.hwBar.current.style.width = (p * 100).toFixed(1) + '%';
  }

  function navFx() {
    const hero = document.querySelector('[data-screen-label="hero"]');
    const solid = hero ? hero.getBoundingClientRect().top < -8 : scrollY > 8;
    if (solid !== state.navSolid) setState({ navSolid: solid });
  }

  // Headings rise in word by word; [data-reveal] blocks fade up, when they scroll into view.
  let rio = null;
  function revealInit() {
    if (reducedMotion || !('IntersectionObserver' in window)) return;
    rio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { rio.unobserve(en.target); revealPlay(en.target); } }), { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    revealScan();
  }
  function revealScan() {
    if (!rio) return;
    app.querySelectorAll('h1:not([data-rx]),h2:not([data-rx]),[data-reveal]:not([data-rx])').forEach(el => {
      el.setAttribute('data-rx', '1');
      if (el.tagName === 'H1' || el.tagName === 'H2') el.style.visibility = 'hidden';
      else { el.style.opacity = '0'; el.style.transform = 'translateY(32px)'; }
      if (el.tagName === 'H1') setTimeout(() => revealPlay(el), 150); else rio.observe(el);
    });
  }
  function revealPlay(el) {
    if (el.tagName !== 'H1' && el.tagName !== 'H2') {
      const sib = el.parentElement ? Math.min(4, [...el.parentElement.children].indexOf(el)) : 0;
      el.style.transition = 'opacity 900ms cubic-bezier(.2,.6,.2,1) ' + (sib * 80) + 'ms, transform 900ms cubic-bezier(.2,.8,.2,1) ' + (sib * 80) + 'ms';
      requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    const c = el.cloneNode(true); c.removeAttribute('id'); c.setAttribute('aria-hidden', 'true');
    Object.assign(c.style, { position: 'absolute', left: (r.left + scrollX) + 'px', top: (r.top + scrollY) + 'px', width: (Math.ceil(r.width) + 4) + 'px', margin: '0', fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, textWrap: cs.textWrap || 'wrap', pointerEvents: 'none', zIndex: '5', visibility: 'visible', color: cs.color, direction: cs.direction, textAlign: cs.textAlign, fontFamily: cs.fontFamily });
    let n = 0;
    const walk = node => [...node.childNodes].forEach(t => {
      if (t.nodeType === 3) {
        const f = document.createDocumentFragment();
        t.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return; if (/^\s+$/.test(part)) { f.appendChild(document.createTextNode(' ')); return; }
          const o = document.createElement('span'); o.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.12em;margin-bottom:-.12em';
          const w = document.createElement('span'); w.textContent = part; w.style.cssText = 'display:inline-block;transform:translateY(110%) rotate(4deg);transform-origin:0 100%;transition:transform 1000ms cubic-bezier(.2,.8,.2,1) ' + (n++ * 60) + 'ms';
          o.appendChild(w); f.appendChild(o);
        });
        t.replaceWith(f);
      } else if (t.nodeType === 1) walk(t);
    });
    walk(c); document.body.appendChild(c);
    requestAnimationFrame(() => requestAnimationFrame(() => c.querySelectorAll('span > span').forEach(w => { w.style.transform = 'none'; })));
    setTimeout(() => { el.style.visibility = ''; c.remove(); }, 1000 + n * 60 + 50);
  }

  let replIO = null;
  function afterRender() {
    if (state.focusOther) { state.focusOther = false; document.querySelector('#contact input[autofocus]')?.focus(); }
    revealScan();
    stackFx();
    hwFx();
    if (!replIO && refs.repl.current) {
      if ('IntersectionObserver' in window) {
        replIO = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { setState({ replIn: true }); replIO.disconnect(); } }, { threshold: 0.3 });
        replIO.observe(refs.repl.current);
      } else setState({ replIn: true });
    }
  }

  // ---------------------------------------------------------------------------
  // Global events
  // ---------------------------------------------------------------------------

  let raf = 0;
  const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; stackFx(); hwFx(); navFx(); }); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { sizeHw(); onScroll(); });

  // Close the market / language menus and the store-type list on an outside press or Escape.
  document.addEventListener('mousedown', e => {
    if (state.shopOpen && refs.shop.current && !refs.shop.current.contains(e.target)) setState({ shopOpen: false });
    const nav = document.querySelector('[data-screen-label="nav"]');
    const inMenu = nav && [...nav.querySelectorAll('button')].some(b => b.parentElement.contains(e.target));
    if ((state.regionOpen || state.langOpen) && !inMenu) setState({ regionOpen: false, langOpen: false });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && (state.regionOpen || state.langOpen)) setState({ regionOpen: false, langOpen: false }); });

  // reCAPTCHA v3: the script loads when a visitor starts on the contact form (not on every page view).
  let recaptchaLoad = null;
  function loadRecaptcha() {
    if (!recaptchaLoad) {
      recaptchaLoad = fetch('api/config').then(r => (r.ok ? r.json() : {})).catch(() => ({}))
        .then(cfg => new Promise((resolve, reject) => {
          const key = cfg.recaptchaSiteKey || RECAPTCHA_SITE_KEY;
          const s = document.createElement('script');
          s.src = `https://www.google.com/recaptcha/api.js?render=${key}`;
          s.async = true;
          s.onload = () => window.grecaptcha.ready(() => resolve(key));
          s.onerror = reject;
          document.head.appendChild(s);
        }));
    }
    return recaptchaLoad;
  }
  // Resolves to a token, or '' if reCAPTCHA is blocked or slow; the lead is then still saved, just not sent to the CRM.
  function recaptchaToken() {
    const timeout = new Promise(resolve => setTimeout(() => resolve(''), 8000));
    const token = loadRecaptcha().then(key => window.grecaptcha.execute(key, { action: RECAPTCHA_ACTION })).catch(() => '');
    return Promise.race([token, timeout]);
  }
  document.addEventListener('focusin', e => { if (e.target.closest('#contact input, #contact button')) loadRecaptcha().catch(() => {}); });

  // Call-back form: save the request with the NestJS API (POST /api/leads), which sends it on to the CRM with the
  // reCAPTCHA token, then show a confirmation in place of the form (or an error, so the visitor can try again).
  document.addEventListener('click', e => {
    const btn = e.target.closest('#contact button[name="send"]');
    if (!btn || state.formStatus === 'sending') return;
    const input = n => document.querySelector(`#contact input[name="${n}"]`);
    const val = n => (input(n)?.value || '').trim();
    // All four are required (the CRM rejects leads without an email), and the email must look like one.
    const missing = ['name', 'company', 'phone', 'email'].find(n => !val(n)) || (!input('email').checkValidity() ? 'email' : null);
    if (missing) { input(missing).focus(); return; }
    const v = vals();
    // The CRM gets the store type in English whatever the page language; "Other" sends what the visitor typed.
    const idx = v.shopOptions.findIndex(o => o.active);
    const storeType = v.shopIsOther ? (val('storeOther') || 'Other') : (DATA.en.retail[country()] || [])[idx] || v.shopLabel;
    const lead = { name: val('name'), companyName: val('company'), email: val('email'), phone: val('phone'), storeType, market: country(), lang: lang(), pageUrl: location.href.split('#')[0] };
    setState({ formStatus: 'sending' });
    recaptchaToken()
      .then(token => fetch('api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { 'g-recaptcha-response': token } : {}) },
        body: JSON.stringify(lead),
      }))
      .then(res => setState({ formStatus: res.ok ? 'sent' : 'error' }))
      .catch(() => setState({ formStatus: 'error' }));
  });

  render();
  navFx();
  setTimeout(revealInit, 50);
  setTimeout(stackFx, 300);
  setTimeout(() => { sizeHw(); hwFx(); }, 400);
  setTimeout(() => { sizeHw(); hwFx(); }, 1500);
})();
