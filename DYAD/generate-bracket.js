/**
 * ONYX Tournament: Extract Characters & Seed Bracket
 * 
 * 1. Extracts all winners from Round 1 chapters
 * 2. Creates a character registry with philosophies and scores
 * 3. Seeds the tournament bracket (score-based pairing)
 * 
 * Usage: node generate-bracket.js
 */

const fs = require('fs');
const path = require('path');

// Find the full export file
const files = fs.readdirSync(__dirname).filter(f => /^onyx-full-data.*\.json$/i.test(f));
if (!files.length) {
    console.error('ERROR: No onyx-full-data-*.json found.');
    process.exit(1);
}

const exportFile = files[files.length - 1];
console.log(`Loading: ${exportFile}\n`);

const chapters = JSON.parse(fs.readFileSync(path.join(__dirname, exportFile), 'utf8'));

// ─────────────────────────────────────────────────────────────
// 1. EXTRACT CHARACTERS (Winners from Round 1)
// ─────────────────────────────────────────────────────────────

const characters = {};
const round1 = [];

chapters.forEach(ch => {
    const winner = ch.finalVerdict?.winnerName;
    if (!winner) return;

    // Find the winner's assessment
    const assessment = ch.assessments?.find(a => a.name === winner) || ch.assessments?.[0];
    const loser = ch.assessments?.find(a => a.name !== winner);

    // Build character entry
    if (!characters[winner]) {
        characters[winner] = {
            name: winner,
            alias: assessment?.alias || null,
            philosophy: extractPhilosophy(ch, winner),
            archetype: guessArchetype(winner),
            victories: [],
            scores: [],
            sourceChapters: []
        };
    }

    // Update with this victory
    characters[winner].victories.push({
        chapter: ch.id,
        defeated: loser?.name || 'Unknown',
        score: assessment?.score || 0
    });
    characters[winner].scores.push(assessment?.score || 0);
    characters[winner].sourceChapters.push(ch.id);

    // Build Round 1 matchup record
    round1.push({
        id: ch.id,
        entityA: {
            name: ch.assessments?.[0]?.name,
            alias: ch.assessments?.[0]?.alias,
            score: ch.assessments?.[0]?.score
        },
        entityB: {
            name: ch.assessments?.[1]?.name,
            alias: ch.assessments?.[1]?.alias,
            score: ch.assessments?.[1]?.score
        },
        winner: winner,
        winnerScore: assessment?.score || 0
    });
});

// Calculate average scores for seeding
Object.values(characters).forEach(c => {
    c.avgScore = c.scores.length > 0
        ? Math.round(c.scores.reduce((a, b) => a + b, 0) / c.scores.length)
        : 0;
});

// ─────────────────────────────────────────────────────────────
// 2. SEED ROUND 2 (Score-based: highest vs lowest)
// ─────────────────────────────────────────────────────────────

const winners = Object.values(characters).sort((a, b) => b.avgScore - a.avgScore);
console.log(`Found ${winners.length} unique winners\n`);

// Pair highest with lowest for more interesting matchups
const round2 = [];
const used = new Set();

for (let i = 0; i < Math.floor(winners.length / 2); i++) {
    const top = winners[i];
    const bottom = winners[winners.length - 1 - i];

    if (used.has(top.name) || used.has(bottom.name)) continue;
    used.add(top.name);
    used.add(bottom.name);

    round2.push({
        id: `R2-${String(i + 1).padStart(2, '0')}`,
        entityA: {
            name: top.name,
            alias: top.alias,
            sourceChapter: top.sourceChapters[0],
            philosophy: top.philosophy,
            avgScore: top.avgScore,
            keyArguments: extractKeyArgs(top.name)
        },
        entityB: {
            name: bottom.name,
            alias: bottom.alias,
            sourceChapter: bottom.sourceChapters[0],
            philosophy: bottom.philosophy,
            avgScore: bottom.avgScore,
            keyArguments: extractKeyArgs(bottom.name)
        },
        winner: null,
        narrative: null,
        generatedAt: null
    });
}

// Handle odd winner (bye to next round)
if (winners.length % 2 === 1) {
    const middle = winners[Math.floor(winners.length / 2)];
    if (!used.has(middle.name)) {
        round2.push({
            id: `R2-BYE`,
            entityA: {
                name: middle.name,
                alias: middle.alias,
                sourceChapter: middle.sourceChapters[0],
                avgScore: middle.avgScore
            },
            entityB: null,
            winner: middle.name, // Auto-advance
            narrative: "BYE — advances automatically",
            isBye: true
        });
    }
}

// ─────────────────────────────────────────────────────────────
// 3. BUILD TOURNAMENT STRUCTURE
// ─────────────────────────────────────────────────────────────

const tournament = {
    tournamentId: "ONYX-2025",
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    format: "single_elimination",
    totalRounds: calculateRounds(winners.length),
    rounds: [
        {
            round: 1,
            name: "Chapter Battles (Original)",
            status: "complete",
            matchups: round1
        },
        {
            round: 2,
            name: "Clash of Frameworks",
            status: "pending",
            matchups: round2
        }
    ],
    champion: null
};

// ─────────────────────────────────────────────────────────────
// 4. SAVE OUTPUT
// ─────────────────────────────────────────────────────────────

// Character registry
fs.writeFileSync(
    path.join(__dirname, 'characters.json'),
    JSON.stringify(characters, null, 2)
);

// Tournament bracket
fs.writeFileSync(
    path.join(__dirname, 'tournament.json'),
    JSON.stringify(tournament, null, 2)
);

console.log('✅ Generated:');
console.log(`   characters.json — ${Object.keys(characters).length} philosophical figures`);
console.log(`   tournament.json — ${tournament.rounds.length} rounds`);
console.log(`   Round 2 matchups: ${round2.length} battles pending\n`);

// Preview Round 2
console.log('═══ ROUND 2 PREVIEW ═══');
round2.slice(0, 5).forEach(m => {
    if (m.isBye) {
        console.log(`   ${m.id}: ${m.entityA.name} — BYE`);
    } else {
        console.log(`   ${m.id}: ${m.entityA.name} (${m.entityA.avgScore}) vs ${m.entityB.name} (${m.entityB.avgScore})`);
    }
});
if (round2.length > 5) console.log(`   ... and ${round2.length - 5} more`);

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function extractPhilosophy(chapter, winnerName) {
    // Try to extract from subtitle or POML
    const subtitle = chapter.subtitle || '';
    const modelA = chapter.poml?.modelA || '';
    const modelB = chapter.poml?.modelB || '';

    // Check which model belongs to the winner
    const assessment = chapter.assessments?.find(a => a.name === winnerName);
    // Check if the first criterion exists and has a description
    if (assessment?.criteria?.[0]?.description) {
        return assessment.criteria[0].description.substring(0, 200);
    }

    return `${subtitle} — embodied in ${winnerName}`;
}

function guessArchetype(name) {
    const archetypes = {
        'FOREMAN': 'Pragmatist',
        'GOLEM': 'Mechanist',
        'NAVIGATOR': 'Systems Thinker',
        'ARCHITECT': 'Designer',
        'WIZARD': 'Proceduralist',
        'MECHANIC': 'Structuralist',
        'INTERPRETER': 'Hermenaut',
        'HYBRID': 'Synthesizer',
        'SIMULACRUM': 'Simulationist',
        'CHILD': 'Developmentalist',
        'VISUALIZER': 'Interface Theorist',
        'ANTHROPOLOGIST': 'Cultural Analyst',
        'SYMBOLIST': 'Meaning-Maker',
        'DRIFTER': 'Non-Objectivist',
        'SEMIOLOGIST': 'Sign Reader',
        'RITUALIST': 'Social Theorist',
        'SURGEON': 'Critical Theorist',
        'RAGPICKER': 'Materialist',
        'PHILOSOPHER': 'Epistemic Critic',
        'THEORIST': 'Hegemonist',
        'CHILD-MACHINE': 'Learner',
        'KIN-MAKER': 'Relationalist',
        'WOODCUTTER': 'Essentialist'
    };

    for (const [key, val] of Object.entries(archetypes)) {
        if (name.includes(key)) return val;
    }
    return 'Philosopher';
}

function extractKeyArgs(name) {
    // Placeholder — in production, would parse from chapter text
    return ['[key argument 1]', '[key argument 2]', '[key argument 3]'];
}

function calculateRounds(n) {
    return Math.ceil(Math.log2(n)) + 1;
}
