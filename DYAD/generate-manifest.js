/**
 * ONYX Infrastructure: Generate Chapter Manifest with Asset Paths
 * 
 * Creates a structured manifest linking chapters to their asset folders
 * and extracting key metadata for downstream rendering.
 * 
 * Usage: node generate-manifest.js
 */

const fs = require('fs');
const path = require('path');

// Find the full export file
const files = fs.readdirSync(__dirname).filter(f => /^onyx-full-data.*\.json$/i.test(f));
if (!files.length) {
    console.error('ERROR: No onyx-full-data-*.json found. Run export from onyx-thumb.html first.');
    process.exit(1);
}

const exportFile = files[files.length - 1];
console.log(`Using data export: ${exportFile}`);

const data = JSON.parse(fs.readFileSync(path.join(__dirname, exportFile), 'utf8'));
const assetBase = './assets/chapters';

// Build manifest
const manifest = {
    version: '1.0.0',
    dataSource: exportFile,
    generatedAt: new Date().toISOString(),
    totalChapters: data.length,
    chapters: data.map(ch => {
        const assetPath = `${assetBase}/${ch.id}`;

        // Extract participant names from assessments
        const p1 = ch.assessments?.[0] || {};
        const p2 = ch.assessments?.[1] || {};

        return {
            id: ch.id,
            file: ch.file,
            title: ch.title,
            subtitle: ch.subtitle,

            // Participants
            entityA: {
                name: p1.name || null,
                alias: p1.alias || null,
                score: p1.score || null,
                scoreLabel: p1.scoreLabel || null
            },
            entityB: {
                name: p2.name || null,
                alias: p2.alias || null,
                score: p2.score || null,
                scoreLabel: p2.scoreLabel || null
            },

            // Verdict
            winner: ch.finalVerdict?.winnerName || null,

            // POML metadata
            guardianRole: ch.poml?.role || null,

            // Asset paths
            assetPath: assetPath,
            images: [],
            hasVisuals: false,

            // Visual opportunity hints
            visualOpportunities: {
                portraits: [p1.name, p2.name].filter(Boolean),
                conceptDiagrams: ch.poml?.modelA && ch.poml?.modelB
                    ? [ch.poml.modelA, ch.poml.modelB]
                    : [],
                verdictBadge: !!ch.finalVerdict?.winnerName
            }
        };
    })
};

// Write manifest
const outputPath = path.join(__dirname, 'assets', 'chapter-manifest.json');

// Ensure assets directory exists
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));

console.log(`\n✅ Generated manifest: ${outputPath}`);
console.log(`   Chapters: ${manifest.totalChapters}`);
console.log(`   Version: ${manifest.version}`);
