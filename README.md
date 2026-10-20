# EdukaanPOS

Landing page for Edukaan POS, built from the Claude Design file "Edukaan POS Page v9" (Cargo 3.0 design system).

The page is a static site in `public/`, served by a small [NestJS](https://nestjs.com) server that also stores call-back requests from the contact form.

| Path | What it holds |
| --- | --- |
| `public/index.html` | Page shell and font loading (Inter, IBM Plex Sans Arabic, Noto Sans Devanagari, Noto Nastaliq Urdu) |
| `public/template.js` | **Generated.** The design's page markup, verbatim: inline styles plus `{{ }}` bindings, `<sc-if>` and `<sc-for>` |
| `public/content.js` | **Generated.** Every piece of copy and data from the design (EN/AR/HI/UR × UAE/KSA) |
| `public/design.css` | **Generated.** The design's global styles (fonts, container widths, keyframes) |
| `public/app.js` | Renders `template.js` and holds the page logic ported from the design: menus, stacked feature cards, sideways hardware scroll, reporting charts, testimonial carousel, pricing comparison, FAQ, reveal-on-scroll animations, and the call-back form |
| `public/styles.css` | Hand-written additions: one design token and phone-only layout fixes (the design is laid out for desktop) |
| `public/assets/` | Logos, flags, hero photos, hardware cut-out photos (`hw-*-cut.png`) and integration logos (`int-*`) |
| `src/` | The NestJS server: serves `public/`, plus the API below |
| `test/` | End-to-end tests for the server and API |
| `tools/sync-design.mjs` | Regenerates the three generated files in `public/` from a design export |

## Run locally

Needs Node.js 20 or newer.

```bash
npm install
npm run start:dev
```

Then open http://localhost:3000. Run the tests with `npm test`.

For production: `npm run build`, then `npm run start:prod`. Settings come from environment variables (or a `.env` file); see `.env.example`.

## API

| Route | What it does |
| --- | --- |
| `POST /api/leads` | Saves a call-back request and sends it to the CRM: `{ name, companyName, email?, phone, storeType?, market: "AE" \| "SA", lang?: "en" \| "ar" \| "hi" \| "ur", pageUrl? }`. Validated; at most 10 requests a minute per client. Returns `{ id }`. |
| `GET /api/leads` | Every request so far, newest first. Needs `Authorization: Bearer <LEADS_TOKEN>`; without `LEADS_TOKEN` set, the route returns 404. |
| `GET /api/health` | `{ "status": "ok" }`, for uptime checks. |

Requests are stored as JSON Lines in `LEADS_FILE` (default `data/leads.jsonl`). On a host whose disk is wiped on each deploy, point `LEADS_FILE` at persistent storage.

### CRM

When `CRM_LEADS_URL` is set, each request is also sent to the Tradeling CRM leads API (`src/leads/crm.service.ts`), with the API key from `CRM_API_KEY` in the `CRM_API_KEY_HEADER` header (default `x-api-key`). Keep the keys in the server's environment or a local `.env`; never commit them or put them in `public/`. The local copy is kept either way, so nothing is lost if the CRM is down; failures are logged.

| CRM field | From the form |
| --- | --- |
| `form_type` | Always `POS` |
| `company_name` | Company or shop name |
| `contact_name` | Your name |
| `email` | Email (optional; left out when empty) |
| `phone` | Mobile or WhatsApp number |
| `buyer_segment` | Store type in English ("Mobile shop", "Baqala", "Café", …), or what the visitor typed after choosing "Other" |
| `message` | "Call-back request from the Edukaan POS landing page", with market, language and store type |
| `page_url` | The landing page address |

**Open item:** the stage endpoint currently requires a reCAPTCHA header (`RECAPTCHA.MISSING_RECAPTCHA_HEADER`) and did not accept the API key in place of it. The CRM team needs to confirm the server-to-server endpoint or header for the `tlcrm_` keys before this goes live.

The contact form (name, company, phone, optional email, store type) posts to `/api/leads` and then opens WhatsApp with the details, as before. On a host without the API (GitHub Pages), the save fails quietly and WhatsApp still opens.

## Hosting

- **Full site with the API:** any Node host (Render, Railway, Fly.io, a company server): `npm ci && npm run build && npm run start:prod`.
- **GitHub Pages (page only, no API):** `.github/workflows/pages.yml` publishes `public/` on every push to `main`. One-time setup: Settings → Pages → Source: **GitHub Actions**.

## Updating to a new design version

1. Get the `.dc.html` file for the new version out of Claude Design (and any new files from its `assets/` folder into `public/assets/`).
2. Run:

   ```bash
   npm run sync-design -- "path/to/Edukaan POS Page vN.dc.html"
   ```

3. If the design's `Component` logic changed (new bindings in the template), port the change into `vals()` in `public/app.js`. Any `{{ name }}` the template uses must be returned from `vals()`.

## URL options

- `?country=SA` opens the page for the KSA market. Arabic is the default for KSA.
- `?lang=en`, `?lang=ar`, `?lang=hi` (Hindi) or `?lang=ur` (Urdu) forces a language. Hindi and Urdu fall back to English for anything not yet translated.
- `?pricing=0` hides the pricing section.

## Still to do

- **Testimonial photos:** the design has empty avatar slots on the testimonial cards; they show as grey circles.
- **CRM access:** confirm how the `tlcrm_` API keys authenticate (see CRM above).
