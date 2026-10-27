# Ugo Chukwu — Personal Developer Portfolio

> **Handoff note for Hermes (read this first):** This README is your working brief. Build in small steps, in this project, without asking Ugo to repeat himself. If a fact is not in this file, do not invent it — build with a clearly marked `TODO` placeholder and ask Ugo for that one fact only. Explain every file and change in plain, beginner-friendly language, test in the browser after each step, and fix errors before moving on. Ugo is tired tonight, so keep questions to a minimum and keep progress visible.

## 1. Project Overview

This project is a personal portfolio website for **Ugo Chukwu**. It introduces him, showcases his real technical skills, explains his development journey, and provides a way for visitors to contact him.

The website takes visual inspiration from the Mr. Bayo portfolio at https://mrbayo.dev/ — warm cream background, dark text, gold accents, clean typography, pill header, card grids — while using Ugo's own content, branding, layout and implementation. It is **inspired by, not a copy of**, that site.

## 2. Project Goals

- Build a professional and modern developer portfolio.
- Learn React and TypeScript by building a real project.
- Understand how each component, style, and interaction works.
- Create an engaging experience with smooth animations and motion.
- Make the website responsive on desktop, tablet, and mobile.
- Keep the personal portfolio separate from the Bluezo Tech brand website.

## 3. Technology Stack

- **React:** Builds the user interface using reusable components.
- **TypeScript:** Adds types to JavaScript to help catch errors and understand the structure of the code.
- **Vite:** Runs the development server and builds the website for production.
- **HTML:** Provides the structure of the webpage through JSX.
- **CSS:** Controls the visual design, layout, responsiveness, and animations.
- **Git:** Can be used to track changes as the project develops.

Begin with the tools already installed by the Vite setup. Additional libraries will only be added when the project needs them — do not install unnecessary dependencies.

## 4. Where the project lives, and how to run it

- **Working directory — note the spelling:** `C:\Users\user\Desktop\Porfolio\Portfolio` — "Porfolio", missing the first "t". The path `~/Desktop/Portfolio/Portfolio` used in an earlier version of this README does **not** exist, so do not use it.
- **Development server:** `http://localhost:5173/` — already running.
- **Entry files:** `index.html`, `src/main.tsx`, `src/App.tsx`.
- **Not a git repository yet** (no `.git`) — Hermes recommends `git init` and a first commit before further work, so there is an undo point.

Before adding new features, fix the **1 problem** (now identified by Hermes, 26 October 2026): TypeScript error TS6133 in `src/App.tsx`, line 6 — `bluezoLogo` is imported from `./assets/images/bluezo-horizontal-master.svg` but never used. The project sets `"noUnusedLocals": true` in `tsconfig.app.json`, so this is a hard error: `npm run build` (`tsc -b && vite build`) currently fails at the type-check stage, even though the dev server still shows the site fine. Fix it first — either delete the unused import, or place the Bluezo logo where Ugo says it belongs — and confirm `npx tsc -b` passes before building anything else.

## 5. Branding and Identity

- **Portfolio owner:** Ugochukwu (full name: Chukwuekem Ugochukwu Melchi — use "Ugochukwu" as the public name).
- **Header identity (as already built):** "Mr Ugo" — Ugo confirmed 27 October 2026 that "Mr Ugo" may also be used.
- **Personal identity:** Ugochukwu remains the main identity presented throughout the portfolio. The copyright line currently says "Ugochukwu" — that matches; "Ugo Chukwu" in the old README was a shortened form, not a separate identity.
- Bluezo Tech is a separate technology initiative and must not be presented as the name of this personal portfolio. Do not rebrand the header or footer as Bluezo Tech, and do not add the Bluezo Tech logo unless Ugo explicitly tells you where it goes.

## 6. Current Project Status (corrected 27 October 2026, from Hermes's file-by-file inspection — this replaces both the old "initial setup" status and the screenshot-based status, which had three errors)

Corrections to the earlier status:
- The hero photo is **not** `src/assets/hero.png` — that file is the purple Vite starter graphic and is unused. The real photo, used by the hero, is `src/assets/images/ugo-profile.jpeg`.
- `src/pages/Experience.tsx` is **not** empty — it is 1,148 bytes with three title-only entries (see section 7.3).
- `src/components/siteHeader.tsx` is **not** the live header — it is a dead file, imported by nothing, and its nav is wrong (see section 7.1).

Done:
- [x] Create the React and TypeScript project with Vite.
- [x] Install project dependencies, including `react-router-dom` 7.18 (installed 26 October 2026, now in use).
- [x] Start the development server and confirm that the page opens at `http://localhost:5173/`.
- [x] Build the homepage in `src/App.tsx` (161 lines) — its own inline pill header, hero, dark technology marquee (13 items, rendered twice for a seamless loop), About block, and a footer that doubles as the Contact section. Routes: `/` → Home, `/experience` → Experience.
- [x] Build the hero section:
  - Eyebrow: "HELLO, I'M UGO"
  - Headline: "I build practical digital experiences." ("digital experiences." in gold)
  - Circular profile photo with a gold arc and rotating gold ring, from `src/assets/images/ugo-profile.jpeg`.
  - Two buttons and a badge.
- [x] Create the Experience page — `src/pages/Experience.tsx` (37 lines) with three entries, titles only, no dates, no descriptions, no links:
  - Somtico Technologies Inc. — "Junior Web Developer — Independent Contractor"
  - Stem Lantern — "Social Media Manager & Content Creator"
  - Bluezo Tech — "Founder and Lead Developer" (this third entry uses `<p>` where the first two use `<h3>`, so it renders smaller/lighter)
- [x] Style the site in `src/App.css` (714 lines, header/hero/portrait/marquee/about/experience/footer, breakpoints at 1000/760/480, reduced-motion block) — Hermes calls this the most finished file in the project.

Known problems (Hermes, 26 October 2026):
- **The 1 problem:** TS6133, unused `bluezoLogo` import in `App.tsx` — see section 4. Production build currently fails.
- **Two headers:** `App.tsx` has its own inline header and does **not** use `siteHeader.tsx`. `siteHeader.tsx` (25 lines) is dead, and if it were ever wired in, its nav — Source Code, Classes, E-books, Experience, About, Contact, Support Me, Hire Me — is Mr. Bayo's store nav, not Ugo's. Five of those routes do not exist. One header must be chosen and the other deleted.
- **No shared layout:** `/experience` has no header, no footer, no nav — a dead end (browser Back is the only exit). The Experience link in the header is a plain `<a href>`, so it does a full page reload instead of client-side navigation.
- **Header is not sticky** (computed position: relative; it scrolls away). Mr. Bayo's header is also not sticky, so stickiness is Ugo's call, not a gap to copy.
- **`src/index.css` (84 lines) is where the design is quietly broken:**
  - `--bg` is `#f3eef3` (pink-lavender), not the warm cream `#f3eee3`.
  - `h1` uses `calc(2.5rem, 6w, 42.5rem)` and `h2` uses `calc(1.75rem, 3w, 2.5rem)` — `6w`/`3w` are not units, so both are invalid and section headings fall back to the browser default 24px instead of 36px.
  - Leftover purple starter tokens (`--accent-bg` / `--accent-border`, rgba(170,59,255,…)) and an invalid font reference on `body`.
  - **No font files are loaded at all** (`document.fonts.size = 0`, text measures identical to Arial) — "Plus Jakarta Sans" in the CSS is currently a promise, not reality.
- **Branding leakage:** `index.html` title is literally "portfolio", with no meta description, no Open Graph tags, and no font link. Its favicon (`/favicon.svg`) is the Bluezo Tech blue "B" monogram. `site.webmanifest` is named "Bluezo Tech" with theme `#081A31`, but is not linked from `index.html`, so it does nothing today.
- **Marquee is not a Skills section:** it has no heading, no grouping, no levels — and 11 of its 13 entries are Mr. Bayo's exact skill set, same icon CDN and colours. That list must be confirmed or cut before it is published as Ugo's.

Files already in the project:
- `public/` — `favicon.ico`, `favicon.svg` (Bluezo blue B), `icons.svg` (GitHub / X / Discord / Bluesky symbols, unused but handy later), `site.webmanifest`
- `src/assets/` — `hero.png` (unused Vite graphic), `react.svg`, `vite.svg` (starter leftovers, unused), `images/ugo-profile.jpeg` (real photo), `images/bluezo-horizontal-master.svg` (imported but unused — the 1 problem)
- `src/components/` — `siteHeader.tsx` (dead, wrong nav)
- `src/pages/` — `Experience.tsx`
- `src/` — `App.tsx`, `App.css`, `index.css`, `main.tsx`
- Root — `package.json` (React 19, react-dom 19, react-router-dom 7.18, Vite 8, TypeScript 6, oxlint; scripts: dev, build, lint, preview), `index.html`, `vite.config.ts`, `tsconfig.app.json`, `.oxlintrc.json`, `.gitignore`

Still to do, in Hermes's build order:
- [ ] Step 1 — Fix TS6133 (delete the unused import, or place the Bluezo logo where Ugo says it belongs).
- [ ] Step 2 — One header, shared: either use `siteHeader.tsx` with Ugo's five links (About, Experience, Skills, Projects, Contact) and delete the Bayo links, or keep the inline header and delete `siteHeader.tsx`.
- [ ] Step 3 — Shared layout so `/experience` gets header and footer, and swap `<a href="/experience">` for `<Link>`.
- [ ] Step 4 — Repair `index.css`: background to `#f3eee3`, replace both broken `calc()` with `clamp()`, delete purple leftover tokens, and actually load Plus Jakarta Sans + Inter.
- [ ] Step 5 — Skills section (`#skills`): real heading, grouped cards, honest content only after Ugo confirms the list.
- [ ] Step 6 — About expansion: Ugo's own text (interest, what he is learning now, goals), and only statistics he can honestly claim.
- [ ] Step 7 — Projects section (`#projects`) with a card grid, real projects only — or hide it for v1 / show one honest "currently building" card.
- [ ] Step 8 — Contact as its own section, then a real footer (name, nav links, back-to-top, copyright).
- [ ] Step 9 — Experience content: dates, one line of what he did per entry, fix the third entry's markup, and turn the ↗ arrows into real links or remove them.
- [ ] Step 10 — Polish: sticky-header decision, smooth scrolling, scroll-reveal animations, route titles, meta description, a personal favicon, then `npx tsc -b` + `npm run build` + a mobile pass at 390px.
- [ ] Bonus, before step 1 — `git init` and a first commit.

## 7. Website Sections

### 7.1 Navigation

Built, but in two places — see section 6. The live header is inline in `App.tsx` (pill look is good, only 3 links: About, Experience, Contact, and it is not sticky). `siteHeader.tsx` is dead and carries Mr. Bayo's store nav — do not wire it in as-is. Step 2 in section 6 decides which header survives, with Ugo's five links (About, Experience, Skills, Projects, Contact).

### 7.2 Hero Section

Already built (see section 6). Keep Ugo's own headline and intro — do not replace them with the reference site's wording ("I build practical software with Python" belongs to Mr. Bayo, not to Ugo).

It includes:
- A greeting introducing Ugo.
- A short, clear developer introduction.
- An animated headline or text effect.
- A profile photograph (`src/assets/images/ugo-profile.jpeg` — corrected; `hero.png` is the unused Vite graphic).
- Buttons that lead to relevant sections, such as About and Contact, once those sections exist.

### 7.3 About Me

A short introduction covering who Ugo is, his interest in technology, what he is learning, and his development goals. Use only what Ugo has actually said — if the text is not supplied, leave a `TODO` placeholder.

### 7.4 Experience

Page exists at `/experience` with three title-only entries (Somtico Technologies Inc., Stem Lantern, Bluezo Tech — see section 6), but no dates, no descriptions, no links, no header or footer, and the third entry renders smaller than the first two. **Ugo confirmed 27 October 2026: Hermes may add what it wants here** — i.e. Hermes is authorised to draft the one-line descriptions for each entry from the role titles, in plain language. Guardrail on that permission: draft descriptions only, no invented dates, employers, metrics, or achievements, and show the drafted page to Ugo for review before it is treated as final. Fix the markup and the dead-end navigation (section 6, steps 3 and 9) at the same time.

### 7.5 Skills

Does not exist yet as a section — no id, no component, no nav link. The dark marquee in `App.tsx` is decoration, not a Skills section. **Confirmed 27 October 2026 by Ugo himself: the marquee's 13 entries are his** — JavaScript, TypeScript, React, Next.js, Node.js, Python, FastAPI, Django, PostgreSQL, Supabase, AI/LLMs, Automation, Tailwind CSS. The earlier concern that this list was copied from Mr. Bayo is now closed: Ugo says these skills are his, so Hermes may build the Skills section from this list. Do not add a 14th skill without asking him.

### 7.6 Projects

This section is optional at the beginning. Add real projects only when they are ready. Do not invent projects, claim ownership of another developer's work, or display another person's work as Ugo's. In particular, never present Mr. Bayo's projects (Botpaa, Helpme Ai, ojembaa) as Ugo's.

### 7.7 Contact

A section where visitors can find appropriate contact links and reach Ugo. The contact methods will be added only after Ugo confirms which details should be public. Do not publish an email, phone number, or social handle from memory.

### 7.8 Footer

A simple footer containing Ugo's name and relevant links.

## 8. Design Direction — verified tokens from the reference site

These values were verified on 26 October 2026 from the mrbayo.dev page source and its stylesheet. Use them as the starting palette and type scale, then adjust to give Ugo's site its own identity. Do not copy the reference site's code, images, or copy — only these design facts:

- **Fonts:** Plus Jakarta Sans (main, weights 400–800), Inter as fallback — `font-family: Plus Jakarta Sans, Inter, sans-serif`. Both are self-hosted on the reference site, not Google Fonts. For this Vite project, load them from Google Fonts or bundle them — either is fine, but keep the same pairing.
- **Background:** warm cream `#f3eee3`.
- **Headings:** near-black `#111827`, weight 800. Hero headline 50px on desktop (36px on phones); section headings 36px (30px on phones).
- **Body text:** dark grey `#666666`; card titles and labels `#1f1f1f`; navigation links `#3d3d3d`; muted text `#9a9a9a`.
- **Gold accent:** `#c88b11`; heading highlight gradient `#c99022 → #e4b248 → #c98917`.
- **Buttons:** black `#111111` primary (hover `#000000`); white secondary; gold `#c88b11` for a form submit button if one is added.
- **Cards and surfaces:** translucent white with light borders (`#00000014`); header pill background translucent white.
- **Dark accents:** `#141414` for a dark strip or footer.
- **Shape and feel:** rounded pill header, rounded buttons and cards, subtle shadows, polished transitions, comfortable spacing, single centred column with card grids for listings.

Ugo's hero already follows this direction (cream background, black headline, gold "digital experiences.", circular photo with gold arc). Keep that look; do not rebuild the hero to match the reference site exactly.

## 9. Animation and Interaction

Possible effects include:
- Animated greeting or headline text.
- Smooth entrance animations when sections appear.
- Subtle movement in selected visual elements.
- Hover effects on buttons and navigation links.
- Animated skill elements.
- Smooth scrolling between sections.

Animations must support the content rather than distract visitors. Respect reduced-motion preferences where appropriate.

## 10. Responsive Design

The website must work well on desktop computers, laptops, tablets, and mobile phones. Navigation, typography, images, spacing, and animations will adapt to different screen sizes.

## 11. What Hermes still needs from Ugo (ask for these, one at a time, only when you reach them — Hermes's 27 October questions, in his order)

1. **Skills — ANSWERED 27 October 2026.** All 13 marquee entries are Ugo's: JavaScript, TypeScript, React, Next.js, Node.js, Python, FastAPI, Django, PostgreSQL, Supabase, AI/LLMs, Automation, Tailwind CSS. Build the Skills section from this list.
2. **Experience details — PARTLY ANSWERED 27 October 2026.** Ugo authorised Hermes to add what it wants here: draft the one-line descriptions from the role titles, no invented dates/metrics/achievements, and show the draft to Ugo for review. Still open: is "Founder and Lead Developer" at Bluezo the wording he wants shown, and should the Bluezo logo appear there (the CSS rule is already waiting for it)?
3. **About text.** The current paragraph says he has "experience in web development, digital content creation, technical support, and platform operations". Is that accurate and in his words? And what is he learning right now, and what goal should the page point at?
4. **Contact and public identity — IDENTITY ANSWERED 27 October 2026.** Public name is **Ugochukwu**, and "Mr Ugo" may also be used (header). Still open: is the email currently in the footer the address he wants public, and should the WhatsApp link stay labelled for Bluezo Tech or become personal? Any GitHub / LinkedIn / X to list?
5. **Projects.** Does he have any real, listable projects yet (name, one line, link, stack)? If not: hide the Projects section for v1, or show one honest "currently building" card?
6. **Branding decision.** The favicon and site.webmanifest are Bluezo Tech assets, and the unused import is the Bluezo logo — while this README says the portfolio must not be presented as Bluezo Tech. Replace the favicon with something personal, or keep Bluezo visible as "a project I founded" (the Experience entry already says that)?
7. **Photo (corrected).** The real photo is `src/assets/images/ugo-profile.jpeg`, not `hero.png`. Confirm he is happy for that photo to be public.

Until an answer arrives, use a visible `TODO` placeholder, never invented content.

## 12. Project Structure

Keep the code organized and understandable:

- `src/App.tsx` — the main application component.
- `src/App.css` — styles for the main application and its components.
- `src/index.css` — global styles, typography, and shared design rules.
- `src/components/` — reusable components (e.g. `siteHeader.tsx`).
- `src/pages/` — page sections (e.g. `Experience.tsx`).
- `src/assets/` — imported images and other assets used by the application.
- `public/` — static files that should be served directly without being imported into the code.
- `index.html` — the HTML entry point used by Vite.
- `package.json` — project metadata, dependencies, and development scripts.
- `tsconfig.json` and related TypeScript configuration files — TypeScript settings.

Create additional components and folders as the website grows, rather than placing everything in one large component.

## 13. Learning Approach

This is both a portfolio project and a learning project. Hermes will:
1. Understand the existing Vite and React starter files.
2. Plan the design before writing the main interface.
3. Build the website in small, manageable steps.
4. Explain important code and TypeScript concepts as they are used.
5. Test each stage in the browser.
6. Fix errors before moving to the next stage.
7. Keep the code maintainable rather than placing everything in one large component.

Ugo should understand the code written instead of blindly copying it.

## 14. Development Rules

- Do not delete or replace project files without understanding their purpose.
- Do not install unnecessary dependencies.
- Do not copy the reference developer's personal photo, logo, projects, wording, or code as Ugo's own.
- Do not invent experience, clients, qualifications, or achievements.
- Keep the design clean, accessible, responsive, and professional.
- Explain unfamiliar code in beginner-friendly language.
- Test changes in the browser as you build.

## 15. Definition of Done

The first version will be considered ready when:
- The portfolio clearly introduces Ugo Chukwu.
- The design is polished and consistent.
- The main sections work correctly.
- Animations run smoothly.
- The layout works on desktop and mobile.
- Contact links work.
- There are no obvious runtime errors.
- The code is organized and understandable.
- The project can be built for production successfully.

---

**Project owner:** Ugo Chukwu
**Project type:** Personal developer portfolio
**Framework:** React
**Language:** TypeScript
**Build tool:** Vite
**Status:** Hero and inline header built, dev server running at `http://localhost:5173/`; Experience page has 3 title-only entries; About is one paragraph; Skills and Projects do not exist yet; Contact exists only as the footer; production build currently fails on TS6133 (unused Bluezo logo import). Hermes inspection, 26 October 2026, corrected this README on 27 October 2026.
