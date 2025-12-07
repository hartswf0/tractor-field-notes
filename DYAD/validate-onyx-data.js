/**
 * ONYX Data Validation Script
 * 
 * Validates the structure of the ONYX data export against the data contract.
 * Reports any missing fields, structural issues, or invalid values.
 * 
 * Usage: node validate-onyx-data.js
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
console.log(`Validating: ${exportFile}\n`);

const data = JSON.parse(fs.readFileSync(path.join(__dirname, exportFile), 'utf8'));

const issues = [];
const warnings = [];

// Validation checks
data.forEach((ch, idx) => {
    const ctx = `Chapter ${ch.id || idx}`;

    // Required fields
    if (!ch.id) issues.push(`${ctx}: Missing 'id'`);
    if (!ch.title) issues.push(`${ctx}: Missing 'title'`);
    if (!ch.subtitle) issues.push(`${ctx}: Missing 'subtitle'`);

    // Assessments
    if (!ch.assessments || !Array.isArray(ch.assessments)) {
        issues.push(`${ctx}: Missing or invalid 'assessments' array`);
    } else if (ch.assessments.length !== 2) {
        warnings.push(`${ctx}: Expected 2 assessments, found ${ch.assessments.length}`);
    } else {
        ch.assessments.forEach((a, ai) => {
            const aCtx = `${ctx} Assessment ${ai + 1}`;
            if (typeof a.score !== 'number') issues.push(`${aCtx}: 'score' is not a number`);
            if (a.score < 0 || a.score > 100) issues.push(`${aCtx}: score ${a.score} out of range [0-100]`);
            if (!a.scoreLabel) warnings.push(`${aCtx}: Missing 'scoreLabel'`);
            if (!a.name) issues.push(`${aCtx}: Missing 'name'`);
        });
    }

    // Final Verdict
    if (!ch.finalVerdict) {
        issues.push(`${ctx}: Missing 'finalVerdict'`);
    } else if (!ch.finalVerdict.winnerName) {
        warnings.push(`${ctx}: 'finalVerdict.winnerName' is empty`);
    }

    // POML block
    if (!ch.poml) {
        warnings.push(`${ctx}: Missing 'poml' block`);
    } else {
        if (!ch.poml.role) warnings.push(`${ctx}: Missing 'poml.role'`);
        if (!ch.poml.modelA) warnings.push(`${ctx}: Missing 'poml.modelA'`);
        if (!ch.poml.modelB) warnings.push(`${ctx}: Missing 'poml.modelB'`);
    }

    // Text content
    if (!ch.text) warnings.push(`${ctx}: Missing rendered 'text' HTML`);
});

// Report
console.log('='.repeat(60));
console.log('ONYX DATA VALIDATION REPORT');
console.log('='.repeat(60));
console.log(`\nTotal Chapters: ${data.length}`);
console.log(`Critical Issues: ${issues.length}`);
console.log(`Warnings: ${warnings.length}`);

if (issues.length) {
    console.log('\n❌ CRITICAL ISSUES:');
    issues.forEach(i => console.log(`   - ${i}`));
}

if (warnings.length) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach(w => console.log(`   - ${w}`));
}

if (!issues.length && !warnings.length) {
    console.log('\n✅ All validation checks passed!');
}

console.log('\n' + '='.repeat(60));

// Exit with error if critical issues
if (issues.length) {
    process.exit(1);
}
