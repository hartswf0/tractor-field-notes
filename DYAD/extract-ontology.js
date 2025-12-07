/**
 * Extract Author Ontology from Chapter MD Files
 * 
 * Parses all ch*.md files to extract:
 * - Real author name (e.g., **Walter Benjamin**)
 * - Winner archetype (e.g., THE RAGPICKER)
 * - Loser archetype
 * - Assessment scores and key arguments
 * - Source traditions
 * 
 * Outputs: ontology.json
 */

const fs = require('fs');
const path = require('path');

const chaptersDir = __dirname;
const files = fs.readdirSync(chaptersDir)
    .filter(f => /^ch\d+\.md$/i.test(f))
    .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
    });

console.log(`Found ${files.length} chapter files\n`);

const ontology = {
    generatedAt: new Date().toISOString(),
    chapters: [],
    combatants: {}
};

for (const file of files) {
    const content = fs.readFileSync(path.join(chaptersDir, file), 'utf8');
    const lines = content.split('\n');

    // Extract chapter ID
    const chapterMatch = file.match(/ch(\d+)/i);
    const chapterId = `M-${chapterMatch[1]}`;

    // Extract title (line starting with ## When)
    const titleLine = lines.find(l => /^##\s*When\s+/i.test(l));
    const titleMatch = titleLine?.match(/^##\s*When\s+(.+?)\s+meets\s+(.+?):/i);

    let combatantA = null;
    let combatantB = null;

    if (titleMatch) {
        combatantA = titleMatch[1].trim().toUpperCase();
        combatantB = titleMatch[2].trim().toUpperCase();
    }

    // Extract real author (bold on its own line, usually line 5-6)
    const authorLine = lines.slice(0, 15).find(l => /^\*\*[A-Z][a-z]+\s+[A-Z][a-z]+\*\*$/.test(l.trim()));
    const authorMatch = authorLine?.match(/^\*\*(.+?)\*\*$/);
    const realAuthor = authorMatch ? authorMatch[1].trim() : null;

    // Extract subtitle (## line after When...meets)
    const subtitleLine = lines.find((l, i) => {
        if (i < 2) return false;
        return /^##\s+[A-Z]/.test(l) && !/When\s+/i.test(l);
    });
    const subtitle = subtitleLine?.replace(/^##\s*/, '').trim() || null;

    // Extract assessments - look for "# ASSESSMENT" sections
    const assessments = [];
    let currentAssessment = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Start of assessment block
        if (/^#\s*ASSESSMENT\s*\d+/i.test(line)) {
            if (currentAssessment) assessments.push(currentAssessment);

            const candidateMatch = lines[i]?.match(/CANDIDATE\s*"?([^"]+)"?/i) ||
                lines[i + 1]?.match(/CANDIDATE\s*"?([^"]+)"?/i);

            currentAssessment = {
                archetype: candidateMatch ? candidateMatch[1].trim() : null,
                score: null,
                verdict: null,
                tradition: null,
                keyStrengths: [],
                keyArguments: []
            };
        }

        // Extract score
        if (currentAssessment && /Score:\s*(\d+)/i.test(line)) {
            const scoreMatch = line.match(/Score:\s*(\d+)/i);
            currentAssessment.score = parseInt(scoreMatch[1]);
        }

        // Extract theoretical submission / tradition
        if (currentAssessment && /Theoretical Submission/i.test(line)) {
            const tradMatch = line.match(/Theoretical Submission:\*?\*?\s*(.+)/i);
            if (tradMatch) currentAssessment.tradition = tradMatch[1].trim();
        }

        // Extract verdict
        if (currentAssessment && /\*Verdict:\*\s*\*\*(\w+)\*\*/i.test(line)) {
            const verdictMatch = line.match(/\*Verdict:\*\s*\*\*(\w+)\*\*/i);
            currentAssessment.verdict = verdictMatch[1];
        }
    }

    if (currentAssessment) assessments.push(currentAssessment);

    // Find winner - look for "**Winner:**" or highest score
    let winner = null;
    const winnerLine = lines.find(l => /\*\*Winner:\*\*\s*\*\*(.+?)\*\*/i.test(l));
    if (winnerLine) {
        const winnerMatch = winnerLine.match(/\*\*Winner:\*\*\s*\*\*(.+?)\*\*/i);
        winner = winnerMatch ? winnerMatch[1].trim() : null;
    }

    // If no explicit winner, use highest score
    if (!winner && assessments.length >= 2) {
        assessments.sort((a, b) => (b.score || 0) - (a.score || 0));
        winner = assessments[0]?.archetype;
    }

    // Find winner assessment
    const winnerAssessment = assessments.find(a =>
        a.archetype?.toUpperCase() === winner?.toUpperCase()
    );

    const loserAssessment = assessments.find(a =>
        a.archetype?.toUpperCase() !== winner?.toUpperCase()
    );

    const chapterData = {
        id: chapterId,
        file: file,
        title: titleLine?.replace(/^##\s*/, '').trim() || null,
        subtitle: subtitle,
        realAuthor: realAuthor,
        combatants: {
            a: combatantA,
            b: combatantB
        },
        winner: {
            archetype: winner,
            score: winnerAssessment?.score || null,
            tradition: winnerAssessment?.tradition || null,
            verdict: winnerAssessment?.verdict || null
        },
        loser: {
            archetype: loserAssessment?.archetype || null,
            score: loserAssessment?.score || null,
            tradition: loserAssessment?.tradition || null
        }
    };

    ontology.chapters.push(chapterData);

    // Add to combatants registry
    if (winner) {
        const key = winner.toUpperCase();
        if (!ontology.combatants[key]) {
            ontology.combatants[key] = {
                archetype: winner,
                realAuthor: realAuthor,
                sourceChapter: chapterId,
                tradition: winnerAssessment?.tradition || null,
                score: winnerAssessment?.score || null,
                appearances: 1
            };
        } else {
            ontology.combatants[key].appearances++;
        }
    }

    console.log(`${chapterId}: ${winner || '??'} (${realAuthor || 'unknown'}) — ${winnerAssessment?.score || '?'}/100`);
}

// Write output
fs.writeFileSync(
    path.join(chaptersDir, 'ontology.json'),
    JSON.stringify(ontology, null, 2)
);

console.log(`\n✅ Generated ontology.json`);
console.log(`   ${ontology.chapters.length} chapters processed`);
console.log(`   ${Object.keys(ontology.combatants).length} unique combatants`);

// Summary by author
const authorCounts = {};
for (const ch of ontology.chapters) {
    const author = ch.realAuthor || 'Unknown';
    authorCounts[author] = (authorCounts[author] || 0) + 1;
}

console.log('\n═══ AUTHORS ═══');
Object.entries(authorCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([author, count]) => {
        console.log(`  ${author}: ${count} chapter(s)`);
    });
