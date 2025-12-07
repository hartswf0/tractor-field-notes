---
description: Generate a tournament match (narrative + assessment)
---

# Generate Tournament Match

This workflow generates a single tournament match: narrative dialogue followed by Guardian assessment.

## Prerequisites

- The combatants are defined in `characters.json`
- The match slot exists in `tournament.json`
- You have the match ID (e.g., `L2-05`)

## Steps

### 1. Get Combatant Information

Read `characters.json` to get the two combatants for this match:
- Name, alias, ontology, core_moves
- Source text references

### 2. Create Scene Setup

Design the scene:
- **Location**: A specific, evocative place
- **Hook**: An object or moment that triggers the debate
- **Clash Vector**: The core tension (e.g., "Memory ↔ Speed")

### 3. Generate Narrative

Use the narrative-forge.poml template with your LLM:

```
Fill <combatant_A>, <combatant_B>, and <scene_setup> tags.
Generate 800-1200 word dialogue following Ingold's ANT/SPIDER style.
Ensure [SPEAKER_A], [SPEAKER_B], [NARRATOR], and [SHIFT] markers.
```

// turbo
Save to: `narratives/[ID]-[name-a]-vs-[name-b].md`

### 4. Generate Assessment

Use darkmatter-guardian.md with:

```
RUBRIC:
A. Argument From Framework (embody, don't summarize)
B. Genuine Pushback (real debate, not parallel monologues)
C. Philosophical Depth (substantive claims)
D. Narrative Craft (atmosphere, SHIFT moment)
E. Darkness Confrontation (engage difficulty)

TEXT UNDER ASSESSMENT:
[Paste the narrative from step 3]
```

// turbo
Save to: `narratives/[ID]-assessment.md`

### 5. Record Result

Update `tournament.json`:
- Set winner from assessment
- Add scores for both combatants

// turbo
Update `narratives.json`:
- Add paths for narrative and assessment files

### 6. Verify

// turbo
Run `python3 -m http.server 8765` if not already running.

Open `http://localhost:8765/reader.html` and navigate to the new chapter.
Confirm:
- Narrative displays correctly
- Guardian annotations appear
- Verdict panel shows scores and winner
