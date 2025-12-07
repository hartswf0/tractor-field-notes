/**
 * ONYX Thematic Analyzer
 * 
 * Analyzes all chapters to extract:
 * - Key philosophical themes
 * - Theoretical traditions
 * - Natural matchup pairings
 * - Theme clusters for bracket seeding
 * 
 * Outputs:
 * - thematic-analysis.json (structured data)
 * - thematic-scratchpad.md (human-readable analysis)
 * 
 * Usage: node analyze-themes.js
 */

const fs = require('fs');
const path = require('path');

// Load full chapter data
const files = fs.readdirSync(__dirname).filter(f => /^onyx-full-data.*\.json$/i.test(f));
if (!files.length) {
    console.error('ERROR: No onyx-full-data-*.json found.');
    process.exit(1);
}

const chapters = JSON.parse(fs.readFileSync(path.join(__dirname, files[files.length - 1]), 'utf8'));
console.log(`Analyzing ${chapters.length} chapters...\n`);

// ─────────────────────────────────────────────────────────────
// THEME EXTRACTION
// ─────────────────────────────────────────────────────────────

// Define philosophical traditions and their keyword markers
const TRADITIONS = {
    'Structuralism': ['structure', 'system', 'pattern', 'framework', 'grammar', 'syntax', 'code'],
    'Phenomenology': ['experience', 'perception', 'consciousness', 'embodied', 'lived', 'being'],
    'Pragmatism': ['practical', 'use', 'action', 'tool', 'function', 'builder', 'work'],
    'Semiotics': ['sign', 'symbol', 'meaning', 'representation', 'interpretation', 'language'],
    'Critical Theory': ['power', 'ideology', 'hegemony', 'critique', 'cultural', 'media'],
    'Systems Theory': ['system', 'complexity', 'network', 'feedback', 'ecology', 'relation'],
    'Post-Structuralism': ['difference', 'play', 'deconstruction', 'trace', 'flow', 'rhizome'],
    'Cybernetics': ['machine', 'control', 'information', 'computation', 'AI', 'algorithm'],
    'Hermeneutics': ['interpretation', 'understanding', 'text', 'meaning', 'context', 'horizon'],
    'Media Theory': ['medium', 'image', 'reproduction', 'aura', 'technical', 'apparatus']
};

// Known thinkers and their traditions
const THINKERS = {
    'Wittgenstein': 'Pragmatism',
    'Augustine': 'Semiotics',
    'Geertz': 'Hermeneutics',
    'Barthes': 'Semiotics',
    'Benjamin': 'Critical Theory',
    'Deleuze': 'Post-Structuralism',
    'Serres': 'Systems Theory',
    'Turing': 'Cybernetics',
    'Calvino': 'Structuralism',
    'Flusser': 'Media Theory',
    'Hall': 'Critical Theory',
    'Carey': 'Media Theory',
    'Sontag': 'Critical Theory',
    'Heidegger': 'Phenomenology',
    'Scott': 'Critical Theory',
    'Youngblood': 'Media Theory',
    'Victor': 'Cybernetics',
    'Bratton': 'Systems Theory',
    'Winograd': 'Cybernetics',
    'von Neumann': 'Cybernetics'
};

// Analyze each chapter
const analysis = chapters.map(ch => {
    const text = (ch.text || '').toLowerCase();
    const title = (ch.title || '').toLowerCase();
    const subtitle = (ch.subtitle || '').toLowerCase();
    const combined = `${title} ${subtitle} ${text}`;

    // Extract winner info
    const winner = ch.finalVerdict?.winnerName || '';
    const winnerAssessment = ch.assessments?.find(a => a.name === winner);
    const loser = ch.assessments?.find(a => a.name !== winner);

    // Detect traditions by keyword frequency
    const traditionScores = {};
    for (const [tradition, keywords] of Object.entries(TRADITIONS)) {
        let score = 0;
        for (const kw of keywords) {
            const regex = new RegExp(`\\b${kw}`, 'gi');
            const matches = combined.match(regex);
            if (matches) score += matches.length;
        }
        if (score > 0) traditionScores[tradition] = score;
    }

    // Sort traditions by score
    const sortedTraditions = Object.entries(traditionScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([t]) => t);

    // Detect thinker from alias
    const alias = winnerAssessment?.alias || '';
    let primaryThinker = null;
    let primaryTradition = null;

    for (const [thinker, tradition] of Object.entries(THINKERS)) {
        if (alias.toLowerCase().includes(thinker.toLowerCase()) ||
            combined.includes(thinker.toLowerCase())) {
            primaryThinker = thinker;
            primaryTradition = tradition;
            break;
        }
    }

    // Extract key concepts from title/subtitle
    const concepts = extractConcepts(title + ' ' + subtitle);

    // Determine primary theme
    const primaryTheme = primaryTradition || sortedTraditions[0] || 'General Philosophy';

    return {
        id: ch.id,
        title: ch.title,
        subtitle: ch.subtitle,
        winner: {
            name: winner,
            alias: winnerAssessment?.alias || null,
            score: winnerAssessment?.score || 0
        },
        loser: {
            name: loser?.name || 'Unknown',
            alias: loser?.alias || null,
            score: loser?.score || 0
        },
        themes: {
            primary: primaryTheme,
            secondary: sortedTraditions.filter(t => t !== primaryTheme),
            thinker: primaryThinker,
            concepts: concepts
        },
        traditionScores
    };
});

// ─────────────────────────────────────────────────────────────
// CLUSTER BY THEME
// ─────────────────────────────────────────────────────────────

const clusters = {};
for (const ch of analysis) {
    const theme = ch.themes.primary;
    if (!clusters[theme]) clusters[theme] = [];
    clusters[theme].push(ch);
}

// Sort clusters by size
const sortedClusters = Object.entries(clusters)
    .sort((a, b) => b[1].length - a[1].length);

console.log('═══ THEME CLUSTERS ═══');
sortedClusters.forEach(([theme, members]) => {
    console.log(`\n${theme} (${members.length} chapters)`);
    members.forEach(m => console.log(`   ${m.id}: ${m.winner.name} (${m.themes.thinker || 'n/a'})`));
});

// ─────────────────────────────────────────────────────────────
// GENERATE THEMATIC MATCHUPS
// ─────────────────────────────────────────────────────────────

// Strategy: Match across traditions for interesting philosophical clash
// e.g., Structuralism vs Post-Structuralism, Cybernetics vs Phenomenology

const CLASH_MAP = {
    'Structuralism': 'Post-Structuralism',
    'Post-Structuralism': 'Structuralism',
    'Pragmatism': 'Semiotics',
    'Semiotics': 'Pragmatism',
    'Critical Theory': 'Systems Theory',
    'Systems Theory': 'Critical Theory',
    'Cybernetics': 'Phenomenology',
    'Phenomenology': 'Cybernetics',
    'Hermeneutics': 'Media Theory',
    'Media Theory': 'Hermeneutics'
};

// Create bracket sides
const leftSide = [];
const rightSide = [];
const used = new Set();

// Sort all by score
const sortedByScore = [...analysis].sort((a, b) => b.winner.score - a.winner.score);

// Distribute to sides, trying to create thematic clashes
for (const ch of sortedByScore) {
    if (used.has(ch.id)) continue;

    const idealOpponent = CLASH_MAP[ch.themes.primary];
    const opponent = sortedByScore.find(c =>
        !used.has(c.id) &&
        c.id !== ch.id &&
        c.themes.primary === idealOpponent
    );

    if (opponent) {
        leftSide.push(ch);
        rightSide.push(opponent);
        used.add(ch.id);
        used.add(opponent.id);
    }
}

// Add remaining to balance sides
for (const ch of sortedByScore) {
    if (used.has(ch.id)) continue;
    if (leftSide.length <= rightSide.length) {
        leftSide.push(ch);
    } else {
        rightSide.push(ch);
    }
    used.add(ch.id);
}

console.log(`\n═══ BRACKET SIDES ═══`);
console.log(`Left side: ${leftSide.length} | Right side: ${rightSide.length}`);

// ─────────────────────────────────────────────────────────────
// GENERATE ROUND 2 MATCHUPS (Within each side)
// ─────────────────────────────────────────────────────────────

function pairForRound2(side, prefix) {
    const matchups = [];
    for (let i = 0; i < side.length; i += 2) {
        if (i + 1 < side.length) {
            matchups.push({
                id: `${prefix}-${String(Math.floor(i / 2) + 1).padStart(2, '0')}`,
                entityA: {
                    name: side[i].winner.name,
                    alias: side[i].winner.alias,
                    sourceChapter: side[i].id,
                    theme: side[i].themes.primary,
                    score: side[i].winner.score
                },
                entityB: {
                    name: side[i + 1].winner.name,
                    alias: side[i + 1].winner.alias,
                    sourceChapter: side[i + 1].id,
                    theme: side[i + 1].themes.primary,
                    score: side[i + 1].winner.score
                },
                thematicClash: `${side[i].themes.primary} vs ${side[i + 1].themes.primary}`,
                winner: null
            });
        } else {
            // Odd one out - bye
            matchups.push({
                id: `${prefix}-BYE`,
                entityA: {
                    name: side[i].winner.name,
                    alias: side[i].winner.alias,
                    sourceChapter: side[i].id,
                    theme: side[i].themes.primary,
                    score: side[i].winner.score
                },
                entityB: null,
                winner: side[i].winner.name,
                isBye: true
            });
        }
    }
    return matchups;
}

const leftR2 = pairForRound2(leftSide, 'L2');
const rightR2 = pairForRound2(rightSide, 'R2');

// ─────────────────────────────────────────────────────────────
// BUILD TWO-SIDED BRACKET
// ─────────────────────────────────────────────────────────────

const twoSidedBracket = {
    tournamentId: "ONYX-2025-THEMATIC",
    version: "2.0.0",
    generatedAt: new Date().toISOString(),
    format: "single_elimination_two_sided",
    thematicSeeding: true,
    clusters: sortedClusters.map(([theme, members]) => ({
        theme,
        count: members.length,
        chapters: members.map(m => m.id)
    })),
    left: {
        name: "Western Bracket",
        rounds: [
            {
                round: 1,
                name: "First Round",
                status: "complete",
                matchups: leftSide.map((ch, i) => ({
                    id: ch.id,
                    entityA: { name: ch.loser.name, alias: ch.loser.alias, score: ch.loser.score },
                    entityB: { name: ch.winner.name, alias: ch.winner.alias, score: ch.winner.score },
                    winner: ch.winner.name,
                    theme: ch.themes.primary
                }))
            },
            {
                round: 2,
                name: "Second Round",
                status: "pending",
                matchups: leftR2
            }
        ]
    },
    right: {
        name: "Eastern Bracket",
        rounds: [
            {
                round: 1,
                name: "First Round",
                status: "complete",
                matchups: rightSide.map((ch, i) => ({
                    id: ch.id,
                    entityA: { name: ch.loser.name, alias: ch.loser.alias, score: ch.loser.score },
                    entityB: { name: ch.winner.name, alias: ch.winner.alias, score: ch.winner.score },
                    winner: ch.winner.name,
                    theme: ch.themes.primary
                }))
            },
            {
                round: 2,
                name: "Second Round",
                status: "pending",
                matchups: rightR2
            }
        ]
    },
    finals: {
        leftChampion: null,
        rightChampion: null,
        grandFinal: null,
        champion: null
    }
};

// ─────────────────────────────────────────────────────────────
// WRITE OUTPUTS
// ─────────────────────────────────────────────────────────────

// Structured analysis
fs.writeFileSync(
    path.join(__dirname, 'thematic-analysis.json'),
    JSON.stringify({ chapters: analysis, clusters: sortedClusters.map(([t, m]) => ({ theme: t, members: m })) }, null, 2)
);

// Two-sided bracket
fs.writeFileSync(
    path.join(__dirname, 'bracket-two-sided.json'),
    JSON.stringify(twoSidedBracket, null, 2)
);

// Human-readable scratchpad
const scratchpad = generateScratchpad(analysis, sortedClusters, leftR2, rightR2);
fs.writeFileSync(path.join(__dirname, 'thematic-scratchpad.md'), scratchpad);

console.log('\n✅ Generated:');
console.log('   thematic-analysis.json — Per-chapter theme extraction');
console.log('   bracket-two-sided.json — Two-sided bracket structure');
console.log('   thematic-scratchpad.md — Human-readable analysis');
console.log(`\n   Left bracket: ${leftSide.length} chapters → ${leftR2.length} R2 matchups`);
console.log(`   Right bracket: ${rightSide.length} chapters → ${rightR2.length} R2 matchups`);

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function extractConcepts(text) {
    const concepts = [];
    const patterns = [
        /\b(meaning|language|sign|symbol|interpretation|understanding)\b/gi,
        /\b(machine|computation|algorithm|code|program)\b/gi,
        /\b(culture|society|ritual|practice|performance)\b/gi,
        /\b(image|media|representation|reproduction)\b/gi,
        /\b(system|network|relation|complexity|ecology)\b/gi,
        /\b(knowledge|truth|belief|experience|perception)\b/gi
    ];

    for (const p of patterns) {
        const matches = text.match(p);
        if (matches) concepts.push(...matches.map(m => m.toLowerCase()));
    }

    return [...new Set(concepts)].slice(0, 5);
}

function generateScratchpad(analysis, clusters, leftR2, rightR2) {
    let md = `# ONYX Thematic Analysis Scratchpad
Generated: ${new Date().toISOString()}

## Theme Clusters

`;

    for (const [theme, members] of clusters) {
        md += `### ${theme} (${members.length} chapters)\n`;
        for (const m of members) {
            md += `- **${m.id}**: ${m.winner.name}`;
            if (m.themes.thinker) md += ` (${m.themes.thinker})`;
            md += ` — Score: ${m.winner.score}\n`;
        }
        md += '\n';
    }

    md += `---

## Round 2 Matchups — Left Bracket

| Matchup | Entity A | Theme | Entity B | Theme | Clash |
|---------|----------|-------|----------|-------|-------|
`;

    for (const m of leftR2) {
        if (m.isBye) {
            md += `| ${m.id} | ${m.entityA.name} | ${m.entityA.theme} | BYE | — | Auto-advance |\n`;
        } else {
            md += `| ${m.id} | ${m.entityA.name} | ${m.entityA.theme} | ${m.entityB.name} | ${m.entityB.theme} | ${m.thematicClash} |\n`;
        }
    }

    md += `
## Round 2 Matchups — Right Bracket

| Matchup | Entity A | Theme | Entity B | Theme | Clash |
|---------|----------|-------|----------|-------|-------|
`;

    for (const m of rightR2) {
        if (m.isBye) {
            md += `| ${m.id} | ${m.entityA.name} | ${m.entityA.theme} | BYE | — | Auto-advance |\n`;
        } else {
            md += `| ${m.id} | ${m.entityA.name} | ${m.entityA.theme} | ${m.entityB.name} | ${m.entityB.theme} | ${m.thematicClash} |\n`;
        }
    }

    md += `
---

## Key Observations

1. **Dominant Traditions**: ${clusters.slice(0, 3).map(([t]) => t).join(', ')}
2. **Thematic Pairs**: Structuralism ↔ Post-Structuralism, Cybernetics ↔ Phenomenology
3. **Thinker Distribution**: Serres appears frequently in Systems Theory cluster

## Matchup Logic

Chapters are paired to create *productive philosophical tension*:
- A Deleuzian figure vs a Structuralist creates genuine debate
- Cybernetics vs Phenomenology stages the classic AI/consciousness clash
- Benjamin's media critique vs Barthes' semiotics = rich intertextuality
`;

    return md;
}
