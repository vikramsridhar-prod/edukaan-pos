# EdukaanPOS

Landing page for Edukaan POS, built from the Claude Design file "Edukaan POS Page v8" (Cargo 3.0 design system).

This is a static site with no build step: plain HTML, CSS and JavaScript.

| File | What it holds |
| --- | --- |
| `index.html` | Page shell and font loading (Inter, IBM Plex Sans Arabic, Noto Sans Devanagari, Noto Nastaliq Urdu) |
| `template.js` | **Generated.** The design's page markup, verbatim: inline styles plus `{{ }}` bindings, `<sc-if>` and `<sc-for>` |
| `content.js` | **Generated.** Every piece of copy and data from the design (EN/AR/HI/UR × UAE/KSA) |
| `design.css` | **Generated.** The design's global styles (fonts, container widths, keyframes) |
| `app.js` | Renders `template.js` and holds the page logic ported from the design: menus, stacked feature cards, sideways hardware scroll, reporting charts, testimonial carousel, pricing comparison, FAQ, reveal-on-scroll animations, and the call-back form |
| `styles.css` | Hand-written additions: one design token and phone-only layout fixes (the design is laid out for desktop) |
| `tools/sync-design.mjs` | Regenerates the three generated files from a design export |
| `assets/` | Logos, flags, hero photos, hardware cut-out photos (`hw-*-cut.png`) and integration logos (`int-*`) |

## Run locally

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765.

## Updating to a new design version

1. Get the `.dc.html` file for the new version out of Claude Design (and any new files from its `assets/` folder into `assets/`).
2. Run:

   ```bash
   node tools/sync-design.mjs "path/to/Edukaan POS Page vN.dc.html"
   ```

3. If the design's `Component` logic changed (new bindings in the template), port the change into `vals()` in `app.js`. Any `{{ name }}` the template uses must be returned from `vals()`.

## URL options

- `?country=SA` opens the page for the KSA market. Arabic is the default for KSA.
- `?lang=en`, `?lang=ar`, `?lang=hi` (Hindi) or `?lang=ur` (Urdu) forces a language. Hindi and Urdu fall back to English for anything not yet translated.
- `?pricing=0` hides the pricing section.

## Still to do

- **Testimonial photos:** the design has empty avatar slots on the testimonial cards; they show as grey circles.
- **Call-back form:** "Send" opens WhatsApp with the details prefilled. Connect it to a CRM or form endpoint if you need the leads stored.
