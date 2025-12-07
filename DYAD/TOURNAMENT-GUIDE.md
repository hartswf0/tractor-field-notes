# THE ONYX PROTOCOL
## Philosophical Combat at the Edge of Thought

---

> *"Where you see a chain of events, I see one single catastrophe which keeps piling wreckage upon wreckage."*  
> — THE RAGPICKER, 99/100, decimating THE CHRONICLER

---

## What Is ONYX?

ONYX is a 64-combatant philosophical tournament where theoretical positions clash in narrative combat, assessed by an unforgiving arbiter.

This is not a debate. This is not a seminar.

This is intellectual blood sport.

Every matchup produces:
- A **narrative dialogue** where ideas fight to the death
- A **Guardian assessment** that exposes every weakness, crowns every strength, and declares a winner

From 64 to 1. Only the strongest framework survives.

---

## The Two-Phase Strike

Every match is a **two-phase operation**. They operate blind to each other.

**PHASE 1: THE NARRATIVE FORGE**
- Takes two combatant POML prompts
- Produces 800-1200 word philosophical dialogue
- Style model: Tim Ingold's "When ANT meets SPIDER"
- Never sees the rubric

**PHASE 2: THE DARK MATTER GUARDIAN**
- Takes the finished narrative + rubric
- Produces adversarial assessment with scores
- Declares winner with justification
- Never sees the combatant prompts

---

## Core Files

| File | Purpose |
|------|---------|
| `narrative-forge.poml` | Narrative generator template |
| `darkmatter-gaurdian.md` | Guardian grading system (354 lines) |
| `spider-test-text.md` | Style exemplar (Ingold, 278 lines) |
| `characters.json` | All 64 combatants with ontologies |
| `tournament.json` | Bracket data and results |
| `narratives.json` | Index to all narrative files |

---

## Generating a Match

### Step 1: Build the Combatant Prompts

For each combatant, create a POML block:

```xml
<poml>
  <role>THE RAGPICKER (Walter Benjamin)</role>
  
  <theoretical_position>
    tradition: Critical Theory / Messianic Materialism
    source_text: "Theses on the Philosophy of History" (1940)
    core_claim: History is one single catastrophe
    method: Jetztzeit — seize memory at the moment of danger
    key_metaphors:
      - The Angel of History
      - The Storm from Paradise
      - Brushing history against the grain
  </theoretical_position>
  
  <from_chapter id="M-29">
    winning_arguments:
      - "Where you see a chain of events, I see one catastrophe"
      - "The enemy has not ceased to be victorious"
      - "Not even the dead will be safe if he wins"
  </from_chapter>
  
  <voice_instructions>
    - See wreckage where others see monuments
    - Invoke the claims of the dead upon the living
    - Time is not empty; it is FILLED with revolutionary possibility
  </voice_instructions>
</poml>
```

### Step 2: Set the Scene

```
Location: An abandoned data center. Dead servers stand like monuments.
Clash Vector: MESSIANIC TIME vs SERPENTINE MODULATION
Hook: A data breach has exposed millions of debt records.
```

### Step 3: Generate Narrative

Feed both combatant prompts + scene + one-shot example (Ingold) to LLM.

Output must include markers:
```
[NARRATOR] Scene-setting
[SPEAKER_A: THE RAGPICKER] Dialogue
[SPEAKER_B: THE SURFER] Response with pushback
[SHIFT] The turning point
```

Save to: `narratives/R2-01-ragpicker-vs-surfer.md`

### Step 4: Build Guardian Rubric

Create clash-specific criteria:

```xml
<custom_rubric>
  ## CLASH VECTOR: Messianic Time vs Serpentine Modulation
  
  ### Criterion 1: Temporality Argument (25%)
  - Ragpicker: Jetztzeit, revolutionary interruption
  - Surfer: Continuous modulation, perpetual present
  
  ### Criterion 2: Resistance Strategy (25%)
  - Ragpicker: Emergency brake, redeem the past
  - Surfer: New weapons, glitches for the information machine
  
  ### Criterion 3: Fidelity to Source (25%)
  Check against original texts. Red flags: anachronism, flattening.
  
  ### Criterion 4: Dialogical Engagement (25%)
  "But there you are surely wrong" vs ignoring opponent
</custom_rubric>
```

### Step 5: Run Guardian Assessment

Feed narrative + rubric to Guardian. Output format:

```markdown
## Calibration
Core Task: [What is being assessed]
Clash Vector: [Central tension]
Darkness Prior: [Risk assessment]

### CANDIDATE A: THE RAGPICKER
#### Criterion: Temporality
*   **Evidence**: "quoted text"
*   **Guardian Critique**: Assessment
*   *Verdict*: **Light**

**Overall Grade: 98/100**

### CANDIDATE B: THE SURFER
[Same structure]

## Final Comparative Verdict
| Feature | RAGPICKER | SURFER | Guardian |
**Winner**: THE RAGPICKER
**Guardian Justification**: [Why]
```

Save to: `narratives/R2-01-assessment.md`

### Step 6: Record Result

Update `tournament.json` with winner and scores.
Update `narratives.json` with file paths.

---

## Ingold's Law

The style model is Tim Ingold's "When ANT meets SPIDER."

### The Four Commandments

**I. Speak FROM, not ABOUT**

Bad: "According to Actor Network Theory, agency is distributed..."

Good: "We act-ants are not isolated individuals. We can accomplish these feats because we collaborate."

**II. Strike with Pushback**

Bad: "That's an interesting perspective."

Good: "But there you are surely wrong!"

**III. Make It Concrete**

Bad: "Networks connect heterogeneous entities."

Good: "I have seen you dragging worms and bugs that you have killed for food to your nests..."

**IV. No Clean Endings**

Bad: They agreed to disagree.

Good: "I cannot understand a word of what you say." And with that, she scuttles off.

---

## Verdict Scale

| Level | Meaning |
|-------|---------|
| **Light** | Well-supported, passes strict scrutiny |
| **Twilight** | Partial, notable gaps |
| **Shadow** | Speculative, rhetorically inflated |
| **Void** | No support, pure hand-waving |

---

## Viewing

```bash
python3 -m http.server 8765
```

- **index.html** — Archive browser
- **tournament.html** — Bracket viewer
- **reader.html** — Book of ONYX with Guardian annotations

---

*"The pile of debris grows skyward."*  
— THE RAGPICKER
