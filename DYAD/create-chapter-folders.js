/**
 * ONYX Infrastructure Setup: Create Chapter Asset Folders
 * 
 * Creates the folder structure for visual assets:
 * /assets/chapters/M-XX/images|diagrams|thumbnails
 * 
 * Usage: node create-chapter-folders.js
 */

const fs = require('fs');
const path = require('path');

// Find the full export file
const files = fs.readdirSync(__dirname).filter(f => /^onyx-full-data.*\.json$/i.test(f));
if (!files.length) {
    console.error('ERROR: No onyx-full-data-*.json found. Run export from onyx-thumb.html first.');
    process.exit(1);
}

const exportFile = files[files.length - 1]; // Use most recent
console.log(`Using data export: ${exportFile}`);

const data = JSON.parse(fs.readFileSync(path.join(__dirname, exportFile), 'utf8'));
const basePath = path.join(__dirname, 'assets', 'chapters');

// Create folders
let created = 0;
data.forEach(ch => {
    if (!ch.id) return;

    ['images', 'diagrams', 'thumbnails'].forEach(sub => {
        const fullPath = path.join(basePath, ch.id, sub);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            created++;
        }
    });
});

console.log(`\n✅ Created ${created} folders for ${data.length} chapters`);
console.log(`   Base path: ${basePath}`);
console.log(`   Structure: /assets/chapters/M-XX/{images,diagrams,thumbnails}`);
