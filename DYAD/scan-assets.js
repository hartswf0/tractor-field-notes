/**
 * ONYX Asset Scanner
 * 
 * Scans each chapter folder for visual assets and updates:
 * 1. Per-chapter meta.json files
 * 2. Main chapter-manifest.json with hasVisuals and images arrays
 * 
 * Usage: node scan-assets.js
 */

const fs = require('fs');
const path = require('path');

const ASSET_BASE = path.join(__dirname, 'assets', 'chapters');
const MANIFEST_PATH = path.join(__dirname, 'assets', 'chapter-manifest.json');
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

function scanChapterFolder(chapterId) {
    const chapterPath = path.join(ASSET_BASE, chapterId);
    if (!fs.existsSync(chapterPath)) return null;

    const assets = {
        chapterId,
        images: [],
        diagrams: [],
        thumbnails: [],
        lastUpdated: new Date().toISOString()
    };

    ['images', 'diagrams', 'thumbnails'].forEach(folder => {
        const folderPath = path.join(chapterPath, folder);
        if (fs.existsSync(folderPath)) {
            const files = fs.readdirSync(folderPath)
                .filter(f => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()));
            assets[folder] = files;
        }
    });

    // Write per-chapter meta.json
    const metaPath = path.join(chapterPath, 'meta.json');
    fs.writeFileSync(metaPath, JSON.stringify(assets, null, 2));

    return assets;
}

function main() {
    // Load existing manifest
    if (!fs.existsSync(MANIFEST_PATH)) {
        console.error('ERROR: chapter-manifest.json not found. Run generate-manifest.js first.');
        process.exit(1);
    }

    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    let updated = 0;
    let withVisuals = 0;

    manifest.chapters.forEach(ch => {
        const assets = scanChapterFolder(ch.id);
        if (assets) {
            const totalAssets = assets.images.length + assets.diagrams.length + assets.thumbnails.length;
            ch.hasVisuals = totalAssets > 0;
            ch.images = [
                ...assets.thumbnails.map(f => ({ path: `thumbnails/${f}`, type: 'thumbnail' })),
                ...assets.images.map(f => ({ path: `images/${f}`, type: 'portrait' })),
                ...assets.diagrams.map(f => ({ path: `diagrams/${f}`, type: 'diagram' }))
            ];

            if (ch.hasVisuals) {
                withVisuals++;
                updated++;
            }
        }
    });

    // Update manifest
    manifest.lastScanned = new Date().toISOString();
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

    console.log('');
    console.log('✅ Asset scan complete');
    console.log(`   Chapters scanned: ${manifest.chapters.length}`);
    console.log(`   With visuals: ${withVisuals}`);
    console.log(`   Need visuals: ${manifest.chapters.length - withVisuals}`);
    console.log('');
    console.log(`   Manifest updated: ${MANIFEST_PATH}`);
}

main();
