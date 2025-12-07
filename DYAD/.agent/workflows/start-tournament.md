---
description: Start a new philosophical narrative tournament
---

# Start a New Tournament

Create a fresh tournament with new combatants and themes.

## Prerequisites

- A theme or domain (e.g., "Anthropology of AI", "Philosophy of Mind")
- 4-64 theoretical positions to pit against each other

## Steps

### 1. Design Your Combatants

For each entity, define in `characters.json`:

```json
{
  "THE [ARCHETYPE]": {
    "name": "THE [ARCHETYPE]",
    "alias": "[Real Thinker Name]",
    "bracket": "left" or "right",
    "position": [1-32],
    "ontology": "[Their theoretical framework]",
    "core_moves": [
      "[Key concept 1]",
      "[Key concept 2]",
      "[Signature argument]"
    ],
    "source_text": "[Primary text they draw from]"
  }
}
```

### 2. Seed the Bracket

Create `tournament.json` with your bracket structure:

- Left bracket: 32 combatants
- Right bracket: 32 combatants
- Seeding should create interesting early matchups

### 3. Style Reference

Read `spider-test-text.md` (Tim Ingold's ANT/SPIDER dialogue) to understand the target style:
- Speaking FROM the framework, not ABOUT it
- Real pushback and concession
- Concrete examples, not abstract summaries
- Narrator with atmosphere

### 4. Generate Round by Round

Use the `/generate-match` workflow for each match.

Tournament progression:
- Round 1: 32 matches (64 → 32)
- Round 2: 16 matches (32 → 16) 
- Round 3 (Sweet 16): 8 matches (16 → 8)
- Round 4 (Elite 8): Round-robin pools (8 → 4)
- Round 5 (Final 4): Round-robin pools (4 → 2)
- Championship: Multi-match finale

### 5. Update Manifest

After each round, update `narratives.json` with all file paths.

### 6. Serve and View

// turbo
```bash
python3 -m http.server 8765
```

View:
- `tournament.html` - Bracket visualization
- `reader.html` - Book-style reader with Guardian annotations
- `index.html` - Archive browser
