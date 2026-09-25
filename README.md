# EdukaanPOS

Landing page for Edukaan POS, built from the Claude Design file "Edukaan POS Page v2" (Cargo 3.0 design system).

This is a static site with no build step: plain HTML, CSS and JavaScript.

| File | What it holds |
| --- | --- |
| `index.html` | Page shell and font loading (Inter Tight and IBM Plex Sans Arabic) |
| `styles.css` | All styles and colour tokens |
| `content.js` | Every piece of copy and demo data for EN/AR × UAE/KSA. Edit text here. |
| `app.js` | Rendering, the market and language switches, the feature scroll story, the FAQ, the animated POS demo, and the call-back form |
| `assets/` | Brand logos, hardware photos (`hw-*`) and integration logos (`int-*`) |

## Run locally

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765.

## URL options

- `?country=SA` opens the page for the KSA market. Arabic is the default for KSA.
- `?lang=ar` or `?lang=en` forces a language.
- `?demo=0` freezes the hero POS animation. The animation is also off when the visitor has "reduce motion" turned on.
- `?pricing=0` hides the pricing section.

## Still to do

- **Hero background photos:** the design has empty slots for a UAE photo and a KSA photo. Put the images in `assets/` and set `HERO_PHOTOS` at the top of `app.js`. The fade overlay turns on automatically.
- **Testimonials:** the testimonial attributions are marked "(placeholder)" in the design copy.
- **Call-back form:** submitting the form opens WhatsApp with the details prefilled. Connect it to a CRM or form endpoint if you need the leads stored.
