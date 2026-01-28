# HEPHAESTUS NARRATIVE OS

**Spatiotemporal Transclusion Engine for Recursive Story Architecture**

---

## LOGLINE

> *A divine craftsman forges a shield that contains the entire cosmos—cities at peace and war, harvest and dance, ocean's rim. This project asks: what if we could navigate inside that shield, subdividing each scene infinitely, building narrative operating systems that let us drill from cosmos to atom and back?*

---

## THE AMBITION

Hephaestus Narrative OS is a research prototype exploring **spatial narrative interfaces**—ways of representing story structure not as linear text but as navigable territory. The foundational text is Homer's *Iliad* Book XVIII, specifically the **Shield of Achilles** (lines 468-617), history's most famous ekphrasis: a description of visual art embedded within literature.

The project investigates three questions:

1. **Can narrative be spatialized?** — Stories have hierarchy (books → chapters → scenes → beats → words). Can we render that hierarchy as explorable space?

2. **Can subdivision be infinite?** — The Shield depicts cosmos, cities, fields, dancers. Each contains more. Can we build interfaces where every element can be subdivided recursively?

3. **Can the forge be the story?** — Hephaestus doesn't just make armor; he makes a *world*. Can our tools for making stories become stories themselves?

---

## PROJECT STRUCTURE

```
Hephaestus Narrative OS/
├── index.html              # Forge Index — Transclusion manifest
├── text.md                 # Source: Iliad Book XVIII (Kline trans.)
├── README.md               # This document
│
├── Protocol Ω Brown // HNZ
│   ├── hnz-38.html         # V38 — Voronoi relief terrain
│   ├── hnz-39.html         # V39 — Quad-tree subdivision
│   ├── hnz-40.html         # V40 — Event node architecture
│   ├── hnz-41.html         # V41 — Narrative mass accumulation
│   ├── hnz-42.html         # V42 — Three.js terrain shader
│   └── hnz-43.html         # V43 — Unified stream interface
│
├── Protocol Ω Brown // HF
│   ├── hf-44.html          # V44 — Terminal deck interface
│   ├── hf-45.html          # V45 — Strata stack visualization
│   ├── hf-46.html          # V46 — Synthesis engine
│   ├── hf-48.html          # V48 — Ekphrastic OS
│   └── hf-01.html          # V49 — Ekphrastic Narrator
│
├── Hephaestus Narrative OS
│   ├── hn-os-21.html       # Core system prototype
│   └── hn-os-25.html       # Stable release — 55/45 split viewport
│
├── Story Fracture
│   ├── sf01.html           # Shield of Achilles — 3D visualization
│   └── osf-01.html         # ONYX Story Fracture — mobile-first
│
├── Hephaestus Prime
│   ├── pbc-01.html         # Prompt Breeding Chamber
│   ├── vss-01.html         # Variant Synthesis System
│   └── vss-01.json         # Synthesis state data
│
└── ONYX Special Editions
    ├── hn-odd.html         # Shield tactical grid view
    └── or-ba.html          # Voronoi Story Space — treemap nav
```

---

## FAMILIES EXPLAINED

### Protocol Ω Brown (HNZ / HF)
The core rendering engine. Uses **Three.js** to create 3D terrain from narrative data. Each "event node" has:
- **Type**: CORE (sovereign order), RIM (perturbation), MARGIN (superposition)
- **Weight**: Determines terrain height
- **Prompt**: Narrative content
- **Children**: Quad-tree subdivision

The terrain is a Voronoi diagram where each cell's height represents narrative "mass"—the accumulated weight of story events.

### Hephaestus Narrative OS (HN-OS)
The IDE-style interface. Features:
- **Top viewport**: 3D shield terrain (55% height)
- **Bottom workspace**: Strata editor, provenance chains, artifacts (45% height)
- **Vodel Registry**: Hierarchical file browser for narrative elements
- **Audit Terminal**: Neighbor synapses, material properties, operational log

### Story Fracture (SF / OSF)
Visualization of the Shield's concentric rings:
- **COSMOS**: Earth, sea, sky, constellations (gold)
- **CIVIC**: City of peace, city of war (bronze)
- **AGRI**: Ploughing, harvest, vintage (tin)
- **RIM**: Ocean's stream containing all (kyanos/enamel)

Each ring can be selected, subdivided, and explored.

### Hephaestus Prime (PBC / VSS)
Generative systems for narrative breeding:
- **Prompt Breeding Chamber**: Cross-pollinate narrative prompts
- **Variant Synthesis**: Generate and select story variants

### ONYX Special Editions
Mobile-first interfaces:
- **hn-odd.html**: Tactical grid view with drawer navigation
- **or-ba.html**: Treemap subdivision of Iliad XVIII content

---

## ONTOLOGY

The system uses a tripartite ontology inspired by Spencer-Brown's *Laws of Form*:

| Zone | Name | Prompt Pattern | Color | Material |
|------|------|----------------|-------|----------|
| CORE | Sovereign Order | "Distinction Drawn" | Gold (#fbbf24) | GOLD |
| RIM | Perturbation | "Void Measured" | Bronze (#92400e) | BRONZE |
| MARGIN | Superposition | "Latent Wave" | Slate (#64748b) | TIN |

**Narrative elements** (LEGOS) combine with zones:
- **The Clinamen**: Outlaw swerves into nobility (RIM)
- **The Noble**: Princess becomes Rebel (CORE)
- **The Spark**: Wave collapse, measurement (MARGIN)
- **The Mark**: Bureaucratic severance (CORE)

---

## SOURCE TEXT

**Homer's Iliad, Book XVIII** (A.S. Kline translation)

The book contains seven major sections mapped in `or-ba.html`:

1. **Lines 1-77**: Thetis responds to Achilles' sorrow
2. **Lines 78-147**: Thetis promises fresh armour
3. **Lines 148-242**: Hera tells Achilles to show himself
4. **Lines 243-309**: The Trojan Assembly
5. **Lines 310-367**: Lamentation for Patroclus
6. **Lines 368-467**: Thetis asks Hephaestus for help
7. **Lines 468-617**: **Hephaestus forges the Shield** ← the ekphrastic core

The Shield itself contains:
- Cosmos (earth, sea, sky, stars)
- City of Peace (wedding, trial)
- City of War (siege, ambush)
- Agriculture (ploughing, harvest, vintage)
- Pastoral (cattle, lions, sheep)
- Dance (Ariadne's floor, acrobats)
- Ocean (the containing rim)

---

## TECHNICAL STACK

- **Three.js r128**: 3D rendering, terrain shaders
- **Tailwind CSS**: Utility-first styling via CDN
- **Canvas 2D**: Treemap/Voronoi rendering
- **JetBrains Mono**: Monospace typography
- **Cinzel**: Serif display (Shield headers)
- **Font Awesome 6.4**: Icons

All files are **standalone HTML**—no build step, no dependencies beyond CDN. Open any file directly in a browser.

---

## USAGE

### Quick Start
```bash
# Serve locally
python3 -m http.server 8080

# Open in browser
open http://localhost:8080/index.html
```

### Navigation
- **index.html**: Master manifest—click any artifact to transclude in iframe
- **Arrow keys**: Navigate hierarchy (↑ up, ↓ down, ← prev, → next)
- **Tap/Click**: Select cell, tap again to drill down
- **H key**: Return to root
- **Escape**: Go up one level

### Mobile
All interfaces are mobile-first. The 4B control surface (↑↓←→ + ⌂) appears as a floating control strip.

---

## RESEARCH CONTEXT

This project sits at the intersection of:

- **Digital Humanities**: Computational approaches to classical texts
- **Narrative Theory**: Structuralist decomposition (Propp, Barthes, Genette)
- **HCI**: Zoomable user interfaces, treemaps, information visualization
- **Generative AI**: Prompt engineering, narrative synthesis
- **Philosophy**: Spencer-Brown's calculus of distinctions

The Shield of Achilles is chosen because it is:
1. **Recursively structured**: Cosmos contains cities contain people contain actions
2. **Ekphrastic**: Art describing art (poem describing metalwork)
3. **Generative**: Hephaestus *makes* while Homer *describes*
4. **Complete**: A closed world with beginning (cosmos) and end (ocean)

---

## FUTURE DIRECTIONS

- [ ] **LLM integration**: Generate child nodes via API
- [ ] **Collaborative editing**: Multi-user subdivision
- [ ] **Audio layer**: Sonification of narrative terrain
- [ ] **Export**: Generate static documentation from tree
- [ ] **Import**: Parse arbitrary texts into spatial structure

---

## LICENSE

Source text: A.S. Kline translation, freely reproducible for non-commercial use.

Code: Research prototype, use freely with attribution.

---

## COLOPHON

> *"Then he first made a shield, broad and solid, adorning it skilfully everywhere, and setting round it a glittering triple rim, with a silver strap attached. Five layers it had, and he decorated it with subtle art."*
>
> — Homer, Iliad XVIII.478-482

Built with Cascade. The forge continues.
