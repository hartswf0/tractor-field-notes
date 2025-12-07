# Narrative Generation Scaling Observations

## Tiebreaker Protocol (Established R2-03)
In the event of a numerical tie (e.g., 98-98), the Guardian breaks the tie based on **Contextual Urgency**.
*   **Precedent**: R2-03 (Surgeon vs Woodcutter). Both scored 98 for philosophical depth. The Surgeon won because his argument (Anti-Fascism) was deemed more urgent than the Woodcutter's (Dwelling) in the context of the "burning forest."
*   **Rule**: If scores are equal, the combatant who addresses the immediate crisis wins over the one who addresses the eternal condition.

## Summary of Test Run (3 Matchups)

| Match | Combatant A | Combatant B | Winner | Score | Margin |
|-------|-------------|-------------|--------|-------|--------|
| R2-01 | THE RAGPICKER (Benjamin) | THE SURFER (Deleuze) | Ragpicker | 91-86 | 5 pts |
| R2-02 | THE CHILD-MACHINE (Turing) | THE ANTHROPOLOGIST (Geertz) | Anthropologist | 91-89 | 2 pts |
| R2-03 | THE PARASITE (Serres) | THE CACOPHONY (Serres) | Cacophony | 91-90 | 1 pt |
| L2-01 | THE RAGPICKER (Benjamin) | THE SURFER (Deleuze) | Ragpicker | 98-96 | 2 pts |
| L2-02 | THE MAN (Serres) | THE MONEY-CHANGER (Serres) | Money-Changer | 93-93 | Tie (Arc) |
| L2-03 | THE TROUBLEMAKER (Serres) | THE DEVIL (Serres) | Troublemaker | 95-91 | 4 pts |
| L2-04 | THE SYSTEM-BUILDER (Tansley) | THE SEMIOLOGIST (Barthes) | Semiologist | 94-92 | 2 pts |
| L2-05 | THE PARASITE (Serres) | THE CACOPHONY (Serres) | Parasite | 97-94 | 3 pts |
| L2-06 | THE PARASITE (Serres) | THE SYMBOLIST (Geertz) | Parasite | 97-96 | 1 pt |
| L2-07 | THE RITUALIST (Carey) | THE CHILD-MACHINE (Turing) | Child-Machine | 99-96 | 3 pts |
| L2-08 | THE KIN-MAKER (Indigenous) | THE DRIFTER (Stanley) | Drifter | 98-97 | 1 pt |
| L2-09 | THE ANTHROPOLOGIST (Geertz) | THE SIMULACRUM (Generative) | Anthropologist | 97-95 | 2 pts |
| L2-10 | THE WIZARD (Winograd) | THE GOLEM (SHRDLU) | Wizard | 95-90 | 5 pts |
| R2-01 | THE PARASITE (Serres) | THE BIOLOGIST (Lettvin) | Parasite | 97-95 | 2 pts |
| R2-02 | THE CULTIVATOR (Scott) | THE VISUALIZER (Victor) | Cultivator | 98-94 | 4 pts |
| R2-03 | THE SURGEON (Benjamin) | THE WOODCUTTER (Heidegger) | Surgeon | 98-98 | Tie (Context) |
| R2-04 | THE ASTROBIOLOGIST (Bratton) | THE FOREMAN (Wittgenstein) | Astrobiologist | 97-96 | 1 pt |
| R2-05 | THE PILOT (Scott) | THE THEORIST (Hall) | Pilot | 95-92 | 3 pts |
| R2-06 | THE DREAMER (Ha & Schmidhuber) | THE FUNCTIONARY (Flusser) | Functionary | 96-94 | 2 pts |
| R2-07 | THE MACHINE (Youngblood) | THE PHILOSOPHER (Sontag) | Philosopher | 98-88 | 10 pts |
| R2-08 | THE CHILD (Winograd) | THE MECHANIC (Calvino) | Child | 96-95 | 1 pt |
| R2-09 | THE ARCHITECT (Geertz) | THE INTERPRETER (Winograd) | Architect | 97-85 | 12 pts |
| R2-10 | THE HYBRID (Neurosymbolic) | THE NAVIGATOR (Winograd) | Hybrid | 96-85 | 11 pts |

---

## Key Observations

### 1. Cross-Tradition Matches are More Competitive

- R2-01 (Benjamin vs Deleuze) produced real opposition
- R2-02 (Turing vs Geertz) produced strong pushback
- R2-03 (Serres vs Serres) tended toward synthesis

**Implication**: Bracket seeding should prioritize cross-tradition clashes for early rounds, saving within-tradition (or within-author) matches for later elimination.

### 2. "Mattering" is a Powerful Argument

Both Anthropologists arguments (R2-01 and R2-02) won on variations of "what matters to you?" — demanding significance, stakes, biography.

**Pattern**: Arguments about mechanism tend to lose to arguments about meaning unless mechanism can demonstrate consequence.

### 3. Same-Author Matches Produce Dialectical Accommodation

R2-03 showed that when both combatants derive from the same thinker, the dialogue gravitates toward mutual dependence rather than opposition.

**Options**:
1. Accept synthesis as valid outcome (interesting philosophically)
2. Force opposition by asking "which concept is more primary?" 
3. Avoid same-author matchups via bracket structure

### 4. Guardian Scores Cluster High

All winners scored 91. All losers scored 86-90. This compression may make late-round differentiation difficult.

**Possible adjustments**:
- Calibrate rubric to produce wider spread
- Use comparative ranking (who wins?) rather than absolute scores
- Introduce "knockout criteria" — clear defeat on one criterion lowers floor

### 5. Ingold Style Works at Scale

All three matchups successfully used the Ingold dialogue structure:
- Personified positions
- Real pushback
- Narrator sets scene
- No forced resolution

The one-shot approach appears robust.

---

## Sequence Recommendations

### Pre-Generation Steps
1. Check source chapters for combatant data
2. Build POML identity blocks (voice instructions matter!)
3. Select scene location that reflects clash vector
4. Draft hook that forces immediate engagement

### Generation Steps
1. Run generator — capture narrative
2. Check for Round 1 repetition (constraint is important)
3. Verify [SPEAKER] markers are present

### Post-Generation Steps
1. Write clash-specific rubric (4 criteria)
2. Run Guardian — capture assessment
3. Verify winner is declared with justification
4. Store both files in narratives/

### Tournament Update Steps
1. Update bracket-two-sided.json with winner
2. Seed winner into next round matchup
3. Archive loser data for potential resurrection (loser's bracket?)

---

## Open Questions

1. **What happens when scores are tied?** — Need tiebreaker protocol
2. **How do we handle Round 3+ context?** — Winners accumulate arguments; how much enters next round's prompt?
3. **Should losers quote into winner's context?** — "You defeated X by arguing Y" could enrich dialogue
4. **Manual vs automated?** — Current workflow is manual; could be scripted with LLM API calls

---

## Next Steps

1. [ ] Generate R2-04 through R2-06 to confirm scaling
2. [ ] Build prompt template for Round 3 (include winner's key arguments from R2)
3. [ ] Script the generation/assessment workflow for faster iteration
4. [ ] Design tiebreaker protocol
5. [ ] Update bracket.html with Round 2 results
