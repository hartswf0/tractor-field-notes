# Tractor Folkologicus

A modular system for thinking about **circles, trade, heart, seed, choice, pattern, and zero** – sometimes as text, sometimes as geometry, sometimes as a swarm of moving dots.

This folder contains several related HTML artefacts. Some are **textual planning sheets**, others are **interactive canvases** that behave like a small "visual rhetoric OS".

This README sketches what each file does and how to use it.

---

## High‑level structure

- **tract‑01 → tract‑06**  
  Early **planning and axiom sheets** for the Tractor system: text, layout, and formalization.

- **tract‑07 family**  
  The **Geometric Thinking Medium** – interactive canvas with circles, trades, seeds, hearts, etc.

- **tract‑08**  
  Early interactive prototype placing the 7 axioms as glyphs on a single canvas.

- **tract‑09**  
  The **Minimal Suite**: a cinematic, one‑gesture introduction to the 7 modules.

- **tract‑07‑flux**  
  The "007" experiment: orange/blue orbs as a **global flux field** shaped by all operators.

A natural tour is:

1. Skim **tract‑05‑formalized.html** / **tract‑06.html** for the axiom language.
2. Watch **tract‑09.html** to see the 7 glyphs introduced in time.
3. Explore **tract‑07‑clean.html** as the main OS: circles, flows, seeds, hearts, patterns, zero.
4. Then open **tract‑07‑flux.html** to feel the same ideas as a swarm / field.

---

## Textual / planning artefacts

These are mostly static HTML pages; open them in a browser.

### `tract-01.html` – Modular Planning System (v1)

- **What it is**: Early **modular planning sheet** for the 7 Tractor modules.
- **UI**: Grid of pattern tabs (1–7), axiom sections in a two‑column layout.
- **Use it for**:
  - Reading the initial formulations of the modules.
  - Sketching how different patterns relate at a glance.

### `tract-02.html` – Modular Planning System (v2)

- **What it is**: A refinement of the planning sheet in `tract‑01`.
- **UI**: Similar structure (tabs, axiom grid) with updated copy/layout.
- **Use it for**:
  - Comparing wording and emphasis against `tract‑01`.
  - Seeing how the planning language evolved.

### `tract-03.html` – Modular Planning System (v3)

- **What it is**: Further iteration on the same modular planning idea.
- **UI**: Same family of components – tabs, axiom grid, sections.
- **Use it for**:
  - A more mature text of the axioms before formalization.

### `tract-04.html` – Modular Planning System (Circle Formalized)

- **What it is**: Focused on **formalizing the Circle module** inside the planning UI.
- **UI**: Same modular rubric, but the Circle block is developed more formally.
- **Use it for**:
  - Bridging between prose axioms and more formalized representations.

### `tract-05-formalized.html` – Formalized Comprehensive Plan

- **What it is**: A **formalized + comprehensive planning sheet**.
- **Notable features**:
  - Canonical axiom lists for each module, with hoverable / clickable definitions.
  - Formal spec blocks (`formal-spec`) written in a controlled grammar (e.g. `1.0 <World> [of] <System>...`).
  - Planning items that can be added per module.
  - A "REF" tab with a guide/reference section.
- **Use it for**:
  - Reading the **canonical axiom set** for Tractor.
  - Using the formal spec grammar as a reference while working on other artefacts.

### `tract-06.html` – Folk System Axioms

- **What it is**: A rich **axiom sheet** for the folk system – similar in spirit to `tract‑05`, but tuned for "folk" vocabulary and emphasis.
- **Notable features**:
  - Axiom items with visual hover emphasis.
  - Highlighted vocabulary (`.highlighted-vocab`) to draw attention to key terms.
- **Use it for**:
  - Sitting with the **language** of the system before diving into dynamic visuals.

---

## Geometric Thinking Medium – 07 family

These are interactive canvases; open them in a browser and then **move the mouse, click, drag**.

### `tract-07.html` – Geometric Thinking Medium (original)

- **What it is**: The original implementation of the **visual rhetoric OS**.
- **Status**: Superseded by `tract‑07‑clean.html` after some internal cleanup; kept for history.
- **Key ideas**:
  - A canvas with a shape palette: circle, trade, heart, seed, choice, pattern, zero.
  - Internal tokens orbiting inside shapes and along trade edges.
  - Module assembly functions for 1–7.

### `tract-07-clean.html` – Geometric Thinking Medium (clean canonical)

- **What it is**: The **current canonical Tractor OS**.
- **UI**:
  - Shape palette on top: tools for **circle / trade / heart / seed / choice / pattern / zero**, each with a tooltip.
  - Knobs for **CLARITY, FLOW, BALANCE**.
  - Scene selector for 1–7 modules (`SCENE_DEFINITIONS`‑driven) plus a manual mode.
  - Footer with **sceneInfo** (what this scene means) and **debugInfo** (counts of circles and trades).
- **Behavior** (core interactions):
  - **Circles** have heart energy; tokens orbit inside them; boundaries pulse with energy.
  - **Trade edges** carry moving particles, with visible arrows; flows depend on FLOW and local damping.
  - **Choice** nodes attach to nearby trade edges and **bias** the direction and strength of flows.
  - **Seeds** attach to circles, grow spirals, emit moving dots, and germinate new circles + edges.
  - **Patterns** act as boost regions: tokens brighten and align when passing through.
  - **Zero** acts as a drain: circles inside its radius lose energy; edges through it dampen.
  - **Heart** fields measure inequality and softly redistribute energy between nearby circles.
- **Use it for**:
  - Hands‑on, **geometric thinking** about the 7 modules.
  - Drawing your own circles/trades/seeds/hearts and watching the moving dot field respond.

### `tract-07b.html` – Geometric Thinking Medium (earlier sandbox)

- **What it is**: A simpler earlier **07‑series sandbox**.
- **UI**:
  - Same general header / canvas / footer structure as 07.
  - Shape palette and parameter knobs.
- **Behavior**:
  - Implements `ShapeRenderer` with basic rendering of circles, hearts, seeds, trades, etc.
  - Has trade edges and particles but without the later JSON scene system and detailed flows.
- **Use it for**:
  - A lighter, more bare‑bones canvas if you want fewer moving parts.

### `tract-08.html` – Early 7‑glyph Canvas

- **What it is**: An early **"7 axioms in one canvas"** experiment.
- **UI**:
  - Similar header and canvas.
  - Places the 7 glyphs (circle, trade, heart, seed, choice, pattern, zero) as static icons.
- **Use it for**:
  - Seeing the move from purely textual axioms into a single visual field.

### `tract-07-flux.html` – 007 Flux Field

- **What it is**: An experimental **flux‑field version** of Tractor, designed to answer: *What if the orange and blue dots were the main objects, and everything else just shaped their field?*
- **UI**:
  - Dark full‑screen canvas.
  - Header: "007 FLUX FIELD – Orbs as a shared field · Shapes as operators".
  - Footer: hint (click to pause) + live stats (orb counts, orange vs blue).
- **Behavior**:
  - A global pool of **orbs** (orange and blue) with position, velocity, and energy.
  - **Circles** attract and swirl orbs; stronger heart energy → stronger pull.
  - **Trade edges** create channels: orbs near them are pushed along the edge, with orange and blue biased in opposite directions.
  - **Heart** zones equalize energy (smooth out hot/cold orbs nearby).
  - **Pattern** zones align orbs tangentially and brighten them, sometimes flipping blue to orange.
  - **Seed** zones swirl and energize orbs, biasing them toward orange.
  - **Zero** points drain energy and sink orbs; low‑energy orbs near the core are recycled and respawned as fresh blue elsewhere.
  - **Choice** adds a directional bias that treats orange and blue differently.
- **Use it for**:
  - Experiencing the modules as a **swarm / flux field** rather than a network of edges.

---

## Minimal Suite and other introductions

### `tract-09.html` – Minimal Suite

- **What it is**: A **cinematic introduction** to the 7 modules.
- **UI**:
  - Dark background, centered white 600×400 card.
  - Each module (1–7) is a single minimal animation:
    - CIRCLE – circle drawing and pulsing.
    - TRADE – line, token, and arrow crossing.
    - HEART – heart outline with a gold line.
    - SEED – circle → seed oval → blue point.
    - CHOICE – a vertical line that forks; the choice point drops.
    - PATTERN – central diamond with three lines.
    - ZERO – point with expanding ripple.
  - Controls: `PLAY` (run modules in sequence), `RESET`, and a `Module i/7` indicator.
- **Use it for**:
  - A **5‑seconds‑per‑module** trailer before diving into the OS.
  - Presentations or teaching as a compact visual summary.

---

## Suggested ways to use this folder

- **For readers / students**:
  - Start with `tract-05-formalized.html` or `tract-06.html` to understand the axioms.
  - Watch `tract-09.html` once or twice.
  - Then play with `tract-07-clean.html` and/or `tract-07-flux.html`.

- **For you as author / designer**:
  - Use 01–06 as **text + planning references** while evolving the geometric OS.
  - Treat 07‑clean and 07‑flux as two complementary "engines":
    - 07‑clean: **network / tokens / edges**.
    - 07‑flux: **field / swarm / operators**.

- **For deploy / hosting**:
  - Make `index.html` a minimal landing page that links to:
    - The main OS: `tract-07-clean.html`.
    - Flux field: `tract-07-flux.html`.
    - Minimal Suite: `tract-09.html`.
    - Textual references: `tract-05-formalized.html`, `tract-06.html`, etc.

---

## Notes

- All of these files are **static HTML**; opening them in a modern browser should be enough.
- Some 07‑series variants (e.g. `tract-07.html`, `tract-07b.html`) are kept as historical waypoints; prefer `tract-07-clean.html` and `tract-07-flux.html` for current use.
