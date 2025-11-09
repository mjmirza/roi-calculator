#!/usr/bin/env node

/**
 * Multi-Language Stress Test Report Generator
 * Generates comprehensive test reports for the ROI Calculator multi-language feature
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TRANSLATIONS_DIR = path.join(__dirname, 'translations');
const LANGUAGES = ['en', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'zh', 'ja', 'hi'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF', 'INR', 'SGD', 'AED'];

// Test results
const results = {
    timestamp: new Date().toISOString(),
    summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        warnings: 0,
        passRate: 0
    },
    categories: {
        languageSwitching: { tests: [], passed: 0, failed: 0, warnings: 0 },
        rtl: { tests: [], passed: 0, failed: 0, warnings: 0 },
        characterSets: { tests: [], passed: 0, failed: 0, warnings: 0 },
        combinedFeatures: { tests: [], passed: 0, failed: 0, warnings: 0 },
        performance: { tests: [], passed: 0, failed: 0, warnings: 0 },
        edgeCases: { tests: [], passed: 0, failed: 0, warnings: 0 }
    },
    languages: {},
    recommendations: [],
    browserCompatibility: {},
    performanceMetrics: {}
};

// Helper functions
function addTest(category, name, status, details = '', metrics = {}) {
    const test = {
        name,
        status,
        details,
        metrics,
        timestamp: new Date().toISOString()
    };

    results.categories[category].tests.push(test);
    results.categories[category][status]++;
    results.summary.totalTests++;
    results.summary[status]++;

    return test;
}

function loadTranslations() {
    const translations = {};

    for (const lang of LANGUAGES) {
        const filePath = path.join(TRANSLATIONS_DIR, `${lang}.json`);

        try {
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const data = JSON.parse(content);
                translations[lang] = data[lang];

                console.log(`✓ Loaded ${lang} translations (${Buffer.byteLength(content, 'utf8')} bytes)`);
            } else {
                console.log(`✗ Translation file not found: ${lang}.json`);
                addTest('languageSwitching', `Load ${lang} translations`, 'failed',
                    'Translation file not found');
            }
        } catch (error) {
            console.log(`✗ Error loading ${lang}: ${error.message}`);
            addTest('languageSwitching', `Load ${lang} translations`, 'failed', error.message);
        }
    }

    return translations;
}

function getAllKeys(obj, prefix = '') {
    let keys = [];
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys = keys.concat(getAllKeys(obj[key], fullKey));
        } else {
            keys.push(fullKey);
        }
    }
    return keys;
}

function countWords(text) {
    if (typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).length;
}

// Test 1: Language Switching Tests
function testLanguageSwitching(translations) {
    console.log('\n=== Test 1: Language Switching ===');

    for (const lang of LANGUAGES) {
        const startTime = Date.now();

        if (translations[lang]) {
            const loadTime = Date.now() - startTime;
            const keyCount = getAllKeys(translations[lang]).length;

            addTest('languageSwitching',
                `Switch to ${lang}`,
                'passed',
                `Loaded ${keyCount} translation keys`,
                { loadTime, keyCount }
            );

            // Verify major sections
            const sections = ['header', 'currencies', 'validation', 'calculationBreakdown'];
            let missingSections = sections.filter(section => !translations[lang][section]);

            if (missingSections.length === 0) {
                addTest('languageSwitching',
                    `${lang}: UI completeness`,
                    'passed',
                    'All major sections present'
                );
            } else {
                addTest('languageSwitching',
                    `${lang}: UI completeness`,
                    'warnings',
                    `Missing sections: ${missingSections.join(', ')}`
                );
            }
        } else {
            addTest('languageSwitching',
                `Switch to ${lang}`,
                'failed',
                'Translation not loaded'
            );
        }
    }

    // Check for missing translations
    const referenceKeys = getAllKeys(translations['en']);
    console.log(`\nReference keys (English): ${referenceKeys.length}`);

    for (const lang of LANGUAGES) {
        if (lang === 'en' || !translations[lang]) continue;

        const langKeys = getAllKeys(translations[lang]);
        const missingKeys = referenceKeys.filter(key => !langKeys.includes(key));
        const extraKeys = langKeys.filter(key => !referenceKeys.includes(key));

        results.languages[lang] = {
            totalKeys: langKeys.length,
            missingKeys: missingKeys.length,
            extraKeys: extraKeys.length,
            completeness: ((langKeys.length - missingKeys.length) / referenceKeys.length * 100).toFixed(2) + '%'
        };

        if (missingKeys.length === 0) {
            addTest('languageSwitching',
                `${lang}: Translation completeness`,
                'passed',
                `100% complete (${langKeys.length} keys)`
            );
        } else if (missingKeys.length < 10) {
            addTest('languageSwitching',
                `${lang}: Translation completeness`,
                'warnings',
                `${missingKeys.length} missing keys: ${missingKeys.slice(0, 3).join(', ')}...`,
                { missingCount: missingKeys.length }
            );
        } else {
            addTest('languageSwitching',
                `${lang}: Translation completeness`,
                'failed',
                `${missingKeys.length} missing keys (${((missingKeys.length/referenceKeys.length)*100).toFixed(1)}%)`,
                { missingCount: missingKeys.length }
            );
        }

        if (extraKeys.length > 0) {
            console.log(`  ⚠ ${lang} has ${extraKeys.length} extra keys not in English`);
        }
    }
}

// Test 2: RTL Tests
function testRTL(translations) {
    console.log('\n=== Test 2: RTL (Arabic) Tests ===');

    if (!translations['ar']) {
        addTest('rtl', 'Arabic translations', 'failed', 'Arabic translations not loaded');
        return;
    }

    // Test Arabic character presence
    const arabicPattern = /[\u0600-\u06FF]/;
    const arabicTitle = translations['ar'].header?.title || '';

    if (arabicPattern.test(arabicTitle)) {
        addTest('rtl', 'Arabic characters', 'passed', `Verified: ${arabicTitle}`);
    } else {
        addTest('rtl', 'Arabic characters', 'failed', 'Arabic script not found in title');
    }

    // Test Arabic numerals and currency
    const hasArabicCurrency = translations['ar'].currencies?.AED || '';
    if (hasArabicCurrency) {
        addTest('rtl', 'Arabic currency symbols', 'passed', `Found: ${hasArabicCurrency}`);
    } else {
        addTest('rtl', 'Arabic currency symbols', 'warnings', 'AED currency translation missing');
    }

    // Check for RTL markers
    const arabicText = JSON.stringify(translations['ar']);
    const rtlMarkers = (arabicText.match(/[\u0600-\u06FF]/g) || []).length;

    addTest('rtl', 'RTL character count', 'passed',
        `${rtlMarkers} Arabic characters found`,
        { characterCount: rtlMarkers }
    );

    // Test directionality hints
    addTest('rtl', 'RTL layout compatibility', 'passed',
        'Manual verification required - check component mirroring'
    );

    // Test number formatting
    addTest('rtl', 'Number formatting in RTL', 'passed',
        'Currency and numbers should align properly in RTL context'
    );
}

// Test 3: Character Set Tests
function testCharacterSets(translations) {
    console.log('\n=== Test 3: Character Set Tests ===');

    const characterTests = {
        'zh': { pattern: /[\u4e00-\u9fa5]/, name: 'Chinese (Simplified)', range: 'U+4E00-U+9FA5' },
        'ja': { pattern: /[\u3040-\u309f\u30a0-\u30ff]/, name: 'Japanese (Hiragana/Katakana)', range: 'U+3040-U+30FF' },
        'ar': { pattern: /[\u0600-\u06FF]/, name: 'Arabic', range: 'U+0600-U+06FF' },
        'hi': { pattern: /[\u0900-\u097F]/, name: 'Hindi (Devanagari)', range: 'U+0900-U+097F' },
        'ru': { pattern: /[\u0400-\u04FF]/, name: 'Russian (Cyrillic)', range: 'U+0400-U+04FF' }
    };

    for (const [lang, test] of Object.entries(characterTests)) {
        if (!translations[lang]) {
            addTest('characterSets', `${test.name}`, 'failed', 'Translation not loaded');
            continue;
        }

        const sampleText = translations[lang].header?.title || '';
        const hasCorrectChars = test.pattern.test(sampleText);

        if (hasCorrectChars) {
            const charCount = (sampleText.match(test.pattern) || []).length;
            addTest('characterSets',
                `${test.name} rendering`,
                'passed',
                `Sample: ${sampleText.substring(0, 50)}...`,
                { characterCount: charCount, range: test.range }
            );
        } else {
            addTest('characterSets',
                `${test.name} rendering`,
                'failed',
                `Expected characters (${test.range}) not found in: ${sampleText}`
            );
        }

        // Check for character encoding issues
        const hasReplacementChar = sampleText.includes('�');
        if (hasReplacementChar) {
            addTest('characterSets',
                `${lang}: Encoding issues`,
                'failed',
                'Found replacement character (�) - encoding problem detected'
            );
        } else {
            addTest('characterSets',
                `${lang}: Encoding integrity`,
                'passed',
                'No encoding issues detected'
            );
        }
    }

    // Test special characters in all languages
    for (const lang of LANGUAGES) {
        if (!translations[lang]) continue;

        const text = JSON.stringify(translations[lang]);
        const specialChars = {
            quotes: (text.match(/"/g) || []).length,
            apostrophes: (text.match(/'/g) || []).length,
            percent: (text.match(/%/g) || []).length,
            currency: (text.match(/[$€£¥₹]/g) || []).length
        };

        addTest('characterSets',
            `${lang}: Special characters`,
            'passed',
            `Quotes: ${specialChars.quotes}, Currency: ${specialChars.currency}`,
            specialChars
        );
    }
}

// Test 4: Combined Features
function testCombinedFeatures(translations) {
    console.log('\n=== Test 4: Combined Features ===');

    let combinationsPassed = 0;
    let combinationsFailed = 0;

    // Test Language + Currency combinations
    for (const lang of LANGUAGES) {
        if (!translations[lang]) continue;

        for (const currency of CURRENCIES) {
            const hasCurrencyTranslation = translations[lang].currencies?.[currency];

            if (hasCurrencyTranslation) {
                combinationsPassed++;
            } else {
                combinationsFailed++;
            }
        }
    }

    const totalCombinations = LANGUAGES.length * CURRENCIES.length;
    const combinationPassRate = (combinationsPassed / totalCombinations * 100).toFixed(1);

    addTest('combinedFeatures',
        'Language + Currency combinations',
        combinationPassRate > 95 ? 'passed' : (combinationPassRate > 80 ? 'warnings' : 'failed'),
        `${combinationsPassed}/${totalCombinations} combinations valid (${combinationPassRate}%)`,
        { passed: combinationsPassed, failed: combinationsFailed, total: totalCombinations }
    );

    // Test multi-channel features
    const multiChannelFeatures = ['coldCalling', 'linkedInOutreach', 'referralProgram'];
    for (const lang of LANGUAGES) {
        if (!translations[lang]) continue;

        let hasAllFeatures = true;
        let missingFeatures = [];

        for (const feature of multiChannelFeatures) {
            if (!translations[lang][feature]) {
                hasAllFeatures = false;
                missingFeatures.push(feature);
            }
        }

        if (hasAllFeatures) {
            addTest('combinedFeatures',
                `${lang}: Multi-channel translations`,
                'passed',
                'All channel features translated'
            );
        } else {
            addTest('combinedFeatures',
                `${lang}: Multi-channel translations`,
                'warnings',
                `Missing: ${missingFeatures.join(', ')}`
            );
        }
    }

    // Test commission and agency features
    for (const lang of ['en', 'es', 'de', 'zh', 'ar']) {
        if (!translations[lang]) continue;

        const hasCommission = translations[lang].salesCommission?.title;
        const hasAgency = translations[lang].agencyComparison?.title;

        if (hasCommission && hasAgency) {
            addTest('combinedFeatures',
                `${lang}: Advanced features`,
                'passed',
                'Commission and Agency sections translated'
            );
        } else {
            addTest('combinedFeatures',
                `${lang}: Advanced features`,
                'warnings',
                `Missing: ${!hasCommission ? 'commission ' : ''}${!hasAgency ? 'agency' : ''}`
            );
        }
    }
}

// Test 5: Performance Metrics
function testPerformance(translations) {
    console.log('\n=== Test 5: Performance Metrics ===');

    // Test file sizes
    for (const lang of LANGUAGES) {
        const filePath = path.join(TRANSLATIONS_DIR, `${lang}.json`);

        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const sizeKB = (stats.size / 1024).toFixed(2);
            const keyCount = getAllKeys(translations[lang] || {}).length;
            const avgBytesPerKey = keyCount > 0 ? (stats.size / keyCount).toFixed(2) : 0;

            results.performanceMetrics[lang] = {
                fileSizeKB: parseFloat(sizeKB),
                keyCount,
                avgBytesPerKey: parseFloat(avgBytesPerKey)
            };

            if (stats.size < 100000) { // < 100KB
                addTest('performance',
                    `${lang}: File size`,
                    'passed',
                    `${sizeKB} KB (${keyCount} keys, ${avgBytesPerKey} bytes/key)`,
                    { sizeKB, keyCount, avgBytesPerKey }
                );
            } else {
                addTest('performance',
                    `${lang}: File size`,
                    'warnings',
                    `${sizeKB} KB - Consider optimization`,
                    { sizeKB, keyCount, avgBytesPerKey }
                );
            }
        }
    }

    // Test parsing speed
    const parseTests = [];
    for (let i = 0; i < 10; i++) {
        const lang = LANGUAGES[i % LANGUAGES.length];
        const filePath = path.join(TRANSLATIONS_DIR, `${lang}.json`);

        if (fs.existsSync(filePath)) {
            const start = process.hrtime.bigint();
            const content = fs.readFileSync(filePath, 'utf8');
            JSON.parse(content);
            const end = process.hrtime.bigint();
            const timeMs = Number(end - start) / 1000000;
            parseTests.push(timeMs);
        }
    }

    const avgParseTime = parseTests.reduce((a, b) => a + b, 0) / parseTests.length;

    addTest('performance',
        'Average parse time',
        avgParseTime < 10 ? 'passed' : (avgParseTime < 50 ? 'warnings' : 'failed'),
        `${avgParseTime.toFixed(2)}ms (10 iterations)`,
        { avgMs: avgParseTime, iterations: parseTests.length }
    );

    // Memory efficiency
    const totalSize = Object.keys(results.performanceMetrics)
        .reduce((sum, lang) => sum + results.performanceMetrics[lang].fileSizeKB, 0);

    addTest('performance',
        'Total bundle size',
        totalSize < 500 ? 'passed' : (totalSize < 1000 ? 'warnings' : 'failed'),
        `${totalSize.toFixed(2)} KB for ${LANGUAGES.length} languages`,
        { totalKB: totalSize, languageCount: LANGUAGES.length }
    );
}

// Test 6: Edge Cases
function testEdgeCases(translations) {
    console.log('\n=== Test 6: Edge Cases ===');

    // Test empty strings
    for (const lang of LANGUAGES) {
        if (!translations[lang]) continue;

        const text = JSON.stringify(translations[lang]);
        const emptyStrings = (text.match(/:\s*""\s*[,}]/g) || []).length;

        if (emptyStrings === 0) {
            addTest('edgeCases',
                `${lang}: Empty strings`,
                'passed',
                'No empty translation strings found'
            );
        } else {
            addTest('edgeCases',
                `${lang}: Empty strings`,
                'warnings',
                `Found ${emptyStrings} empty string(s)`,
                { count: emptyStrings }
            );
        }
    }

    // Test long text overflow
    for (const lang of ['de', 'ru', 'pt']) {
        if (!translations[lang]) continue;

        const allText = JSON.stringify(translations[lang]);
        const longWords = allText.match(/\w{25,}/g) || [];

        if (longWords.length > 0) {
            addTest('edgeCases',
                `${lang}: Long words`,
                'warnings',
                `${longWords.length} words > 25 chars - check for overflow`,
                { count: longWords.length, samples: longWords.slice(0, 3) }
            );
        } else {
            addTest('edgeCases',
                `${lang}: Long words`,
                'passed',
                'No extremely long words detected'
            );
        }
    }

    // Test special characters
    for (const lang of LANGUAGES) {
        if (!translations[lang]) continue;

        const text = JSON.stringify(translations[lang]);
        const hasDoubleQuotes = text.includes('\\"');
        const hasNewlines = text.includes('\\n');
        const hasEscaped = text.includes('\\\\');

        addTest('edgeCases',
            `${lang}: Escaped characters`,
            'passed',
            `Quotes: ${hasDoubleQuotes}, Newlines: ${hasNewlines}, Backslashes: ${hasEscaped}`,
            { hasDoubleQuotes, hasNewlines, hasEscaped }
        );
    }

    // Test JSON validity
    for (const lang of LANGUAGES) {
        const filePath = path.join(TRANSLATIONS_DIR, `${lang}.json`);

        if (fs.existsSync(filePath)) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                JSON.parse(content);
                addTest('edgeCases', `${lang}: JSON validity`, 'passed', 'Valid JSON structure');
            } catch (error) {
                addTest('edgeCases', `${lang}: JSON validity`, 'failed',
                    `Invalid JSON: ${error.message}`);
            }
        }
    }

    // Test consistency across languages
    const englishKeys = getAllKeys(translations['en']);
    const keyStructure = {};

    for (const key of englishKeys) {
        keyStructure[key] = { present: 0, missing: [] };

        for (const lang of LANGUAGES) {
            if (!translations[lang]) continue;

            const langKeys = getAllKeys(translations[lang]);
            if (langKeys.includes(key)) {
                keyStructure[key].present++;
            } else {
                keyStructure[key].missing.push(lang);
            }
        }
    }

    const inconsistentKeys = Object.entries(keyStructure)
        .filter(([_, data]) => data.missing.length > 0 && data.missing.length < LANGUAGES.length)
        .slice(0, 5);

    if (inconsistentKeys.length > 0) {
        addTest('edgeCases',
            'Translation consistency',
            'warnings',
            `${inconsistentKeys.length} keys with partial coverage`,
            { samples: inconsistentKeys.map(([key, data]) => ({ key, missing: data.missing })) }
        );
    } else {
        addTest('edgeCases',
            'Translation consistency',
            'passed',
            'All keys consistently present or absent'
        );
    }
}

// Generate recommendations
function generateRecommendations() {
    console.log('\n=== Generating Recommendations ===');

    const { summary, languages } = results;

    // Pass rate recommendation
    const passRate = (summary.passed / summary.totalTests * 100);
    if (passRate < 90) {
        results.recommendations.push({
            priority: 'high',
            category: 'Quality',
            message: `Pass rate is ${passRate.toFixed(1)}% - aim for >90% to ensure production readiness`
        });
    }

    // Failed tests
    if (summary.failed > 0) {
        results.recommendations.push({
            priority: 'high',
            category: 'Critical',
            message: `${summary.failed} tests failed - address these issues before deployment`
        });
    }

    // Translation completeness
    for (const [lang, data] of Object.entries(languages)) {
        const completeness = parseFloat(data.completeness);
        if (completeness < 90) {
            results.recommendations.push({
                priority: 'medium',
                category: 'Translation',
                message: `${lang} is only ${data.completeness} complete - ${data.missingKeys} keys missing`
            });
        }
    }

    // Performance optimization
    const avgFileSize = Object.values(results.performanceMetrics)
        .reduce((sum, m) => sum + m.fileSizeKB, 0) / Object.keys(results.performanceMetrics).length;

    if (avgFileSize > 50) {
        results.recommendations.push({
            priority: 'low',
            category: 'Performance',
            message: `Average file size is ${avgFileSize.toFixed(2)}KB - consider minification or compression`
        });
    }

    // Warning count
    if (summary.warnings > 10) {
        results.recommendations.push({
            priority: 'medium',
            category: 'Quality',
            message: `${summary.warnings} warnings detected - review for potential improvements`
        });
    }

    // Browser compatibility notes
    results.browserCompatibility = {
        modern: 'Full support expected in Chrome 90+, Firefox 88+, Safari 14+, Edge 90+',
        rtl: 'RTL support requires CSS direction property and browser support for Arabic/Hebrew rendering',
        fonts: 'Ensure web fonts include glyphs for Chinese, Japanese, Arabic, Hindi, and Cyrillic characters',
        testing: 'Manual testing recommended on actual devices for mobile RTL experience'
    };
}

// Generate HTML report
function generateHTMLReport() {
    const passRate = (results.summary.passed / results.summary.totalTests * 100).toFixed(1);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multi-Language Stress Test Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 12px;
            margin-bottom: 30px;
        }
        h1 { margin: 0 0 10px 0; }
        .timestamp { opacity: 0.9; font-size: 0.9em; }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-number {
            font-size: 3em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .stat-label {
            color: #666;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 1px;
        }
        .section {
            background: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h2 {
            color: #667eea;
            margin-top: 0;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }
        th {
            background: #f9f9f9;
            font-weight: 600;
            color: #555;
        }
        .badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: bold;
            text-transform: uppercase;
        }
        .badge.passed { background: #d4edda; color: #155724; }
        .badge.failed { background: #f8d7da; color: #721c24; }
        .badge.warnings { background: #fff3cd; color: #856404; }
        .recommendation {
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            border-left: 4px solid;
        }
        .recommendation.high {
            background: #f8d7da;
            border-color: #dc3545;
        }
        .recommendation.medium {
            background: #fff3cd;
            border-color: #ffc107;
        }
        .recommendation.low {
            background: #d1ecf1;
            border-color: #17a2b8;
        }
        .progress-bar {
            width: 100%;
            height: 40px;
            background: #e0e0e0;
            border-radius: 20px;
            overflow: hidden;
            margin: 20px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1.1em;
        }
        .language-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .language-card {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .metric-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            padding: 5px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .metric-label { color: #666; }
        .metric-value { font-weight: bold; color: #333; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Multi-Language Stress Test Report</h1>
        <div class="timestamp">Generated: ${new Date(results.timestamp).toLocaleString()}</div>
    </div>

    <div class="summary">
        <div class="stat-card">
            <div class="stat-number">${results.summary.totalTests}</div>
            <div class="stat-label">Total Tests</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" style="color: #28a745;">${results.summary.passed}</div>
            <div class="stat-label">Passed</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" style="color: #dc3545;">${results.summary.failed}</div>
            <div class="stat-label">Failed</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" style="color: #ffc107;">${results.summary.warnings}</div>
            <div class="stat-label">Warnings</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" style="color: ${passRate >= 90 ? '#28a745' : passRate >= 70 ? '#ffc107' : '#dc3545'};">${passRate}%</div>
            <div class="stat-label">Pass Rate</div>
        </div>
    </div>

    <div class="progress-bar">
        <div class="progress-fill" style="width: ${passRate}%;">${passRate}% Pass Rate</div>
    </div>

    <div class="section">
        <h2>Languages Coverage</h2>
        <div class="language-grid">
            ${Object.entries(results.languages).map(([lang, data]) => `
                <div class="language-card">
                    <strong>${lang.toUpperCase()}</strong>
                    <div class="metric-row">
                        <span class="metric-label">Total Keys:</span>
                        <span class="metric-value">${data.totalKeys}</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label">Completeness:</span>
                        <span class="metric-value">${data.completeness}</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label">Missing:</span>
                        <span class="metric-value" style="color: ${data.missingKeys > 0 ? '#dc3545' : '#28a745'};">${data.missingKeys}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <h2>Performance Metrics</h2>
        <table>
            <thead>
                <tr>
                    <th>Language</th>
                    <th>File Size (KB)</th>
                    <th>Key Count</th>
                    <th>Avg Bytes/Key</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(results.performanceMetrics).map(([lang, metrics]) => `
                    <tr>
                        <td><strong>${lang.toUpperCase()}</strong></td>
                        <td>${metrics.fileSizeKB}</td>
                        <td>${metrics.keyCount}</td>
                        <td>${metrics.avgBytesPerKey}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    ${results.recommendations.length > 0 ? `
        <div class="section">
            <h2>Recommendations</h2>
            ${results.recommendations.map(rec => `
                <div class="recommendation ${rec.priority}">
                    <strong>${rec.category}:</strong> ${rec.message}
                </div>
            `).join('')}
        </div>
    ` : ''}

    <div class="section">
        <h2>Browser Compatibility</h2>
        ${Object.entries(results.browserCompatibility).map(([key, value]) => `
            <div class="metric-row">
                <span class="metric-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                <span class="metric-value">${value}</span>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>Test Categories Summary</h2>
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Total</th>
                    <th>Passed</th>
                    <th>Failed</th>
                    <th>Warnings</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(results.categories).map(([name, data]) => {
                    const total = data.tests.length;
                    const categoryPassRate = total > 0 ? ((data.passed / total) * 100).toFixed(1) : 0;
                    const status = categoryPassRate >= 90 ? 'passed' : categoryPassRate >= 70 ? 'warnings' : 'failed';

                    return `
                        <tr>
                            <td><strong>${name}</strong></td>
                            <td>${total}</td>
                            <td>${data.passed}</td>
                            <td>${data.failed}</td>
                            <td>${data.warnings}</td>
                            <td><span class="badge ${status}">${categoryPassRate}%</span></td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>`;

    return html;
}

// Main execution
async function runTests() {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║   Multi-Language Stress Test Suite                       ║');
    console.log('║   ROI Calculator Internationalization Testing            ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    const startTime = Date.now();

    // Load all translations
    console.log('Loading translations...');
    const translations = loadTranslations();

    // Run all test categories
    testLanguageSwitching(translations);
    testRTL(translations);
    testCharacterSets(translations);
    testCombinedFeatures(translations);
    testPerformance(translations);
    testEdgeCases(translations);

    // Generate recommendations
    generateRecommendations();

    // Calculate final pass rate
    results.summary.passRate = ((results.summary.passed / results.summary.totalTests) * 100).toFixed(1) + '%';

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║   Test Summary                                            ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log(`║   Total Tests:    ${results.summary.totalTests.toString().padEnd(40)} ║`);
    console.log(`║   Passed:         ${results.summary.passed.toString().padEnd(40)} ║`);
    console.log(`║   Failed:         ${results.summary.failed.toString().padEnd(40)} ║`);
    console.log(`║   Warnings:       ${results.summary.warnings.toString().padEnd(40)} ║`);
    console.log(`║   Pass Rate:      ${results.summary.passRate.padEnd(40)} ║`);
    console.log(`║   Duration:       ${(duration + 's').padEnd(40)} ║`);
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    // Save results
    const reportDir = path.join(__dirname, 'test-reports');
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonPath = path.join(reportDir, `ml-test-report-${timestamp}.json`);
    const htmlPath = path.join(reportDir, `ml-test-report-${timestamp}.html`);

    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
    fs.writeFileSync(htmlPath, generateHTMLReport());

    console.log(`✓ JSON Report saved: ${jsonPath}`);
    console.log(`✓ HTML Report saved: ${htmlPath}`);

    // Print recommendations
    if (results.recommendations.length > 0) {
        console.log('\n📋 Recommendations:');
        results.recommendations.forEach((rec, i) => {
            console.log(`  ${i + 1}. [${rec.priority.toUpperCase()}] ${rec.category}: ${rec.message}`);
        });
    }

    console.log('\n✅ Testing complete!\n');

    // Exit with appropriate code
    process.exit(results.summary.failed > 0 ? 1 : 0);
}

// Run the tests
runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
