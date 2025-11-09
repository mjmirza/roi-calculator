#!/usr/bin/env node

/**
 * Translation Verification Test Script
 * Verifies all translation files have the correct structure and keys
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = path.join(__dirname, 'public', 'translations');
const EXPECTED_LANGUAGES = ['en', 'es', 'pt', 'de', 'fr', 'zh', 'ja', 'ar', 'hi', 'ru'];

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Get all translation keys from a nested object
 */
function getAllKeys(obj, prefix = '') {
  const keys = [];

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else if (typeof obj[key] === 'string') {
      keys.push(fullKey);
    }
  }

  return keys.sort();
}

/**
 * Load and verify a translation file
 */
function loadTranslation(language) {
  const filePath = path.join(TRANSLATIONS_DIR, `${language}.json`);

  if (!fs.existsSync(filePath)) {
    return { error: `File not found: ${filePath}` };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    // Check if the data has the language wrapper
    if (!data[language]) {
      return { error: `Missing language wrapper "${language}" in ${language}.json` };
    }

    const translations = data[language];
    const keys = getAllKeys(translations);

    return { translations, keys, filePath };
  } catch (error) {
    return { error: `Error loading ${language}.json: ${error.message}` };
  }
}

/**
 * Verify critical translation sections
 */
function verifyCriticalSections(language, translations) {
  const criticalSections = [
    'header.title',
    'header.subtitle',
    'revenueSetup.title',
    'revenueSetup.domains',
    'revenueSetup.sendingMailboxes',
    'performanceMetrics.title',
    'performanceMetrics.ratioPerReply',
    'validation.requiredFieldsMissing',
    'validation.fillRequiredFields',
    'calculationBreakdown.title',
    'suggestions.criticalIssues',
    'suggestions.optimizationSuggestions',
  ];

  const missing = [];

  for (const key of criticalSections) {
    const parts = key.split('.');
    let current = translations;
    let found = true;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        found = false;
        break;
      }
    }

    if (!found || typeof current !== 'string') {
      missing.push(key);
    }
  }

  return missing;
}

/**
 * Main test function
 */
function runTests() {
  log('\n='.repeat(80), 'cyan');
  log('TRANSLATION VERIFICATION TEST', 'bold');
  log('='.repeat(80), 'cyan');

  const results = {
    total: EXPECTED_LANGUAGES.length,
    passed: 0,
    failed: 0,
    errors: [],
    warnings: [],
  };

  // Load all translations
  log('\n1. Loading Translation Files...', 'blue');
  const loadedTranslations = {};

  for (const lang of EXPECTED_LANGUAGES) {
    const result = loadTranslation(lang);

    if (result.error) {
      log(`   ✗ ${lang}: ${result.error}`, 'red');
      results.failed++;
      results.errors.push({ language: lang, error: result.error });
    } else {
      log(`   ✓ ${lang}: ${result.keys.length} keys loaded`, 'green');
      loadedTranslations[lang] = result;
      results.passed++;
    }
  }

  // Verify key consistency
  log('\n2. Verifying Key Consistency...', 'blue');

  if (Object.keys(loadedTranslations).length > 0) {
    const languages = Object.keys(loadedTranslations);
    const referenceKeys = loadedTranslations[languages[0]].keys;
    log(`   Reference: ${languages[0]} with ${referenceKeys.length} keys`, 'cyan');

    let allMatch = true;

    for (const lang of languages.slice(1)) {
      const langKeys = loadedTranslations[lang].keys;

      // Find missing and extra keys
      const missing = referenceKeys.filter(key => !langKeys.includes(key));
      const extra = langKeys.filter(key => !referenceKeys.includes(key));

      if (missing.length > 0 || extra.length > 0) {
        allMatch = false;
        log(`   ✗ ${lang}: Key mismatch`, 'red');

        if (missing.length > 0) {
          log(`     Missing keys (${missing.length}):`, 'yellow');
          missing.slice(0, 10).forEach(key => log(`       - ${key}`, 'yellow'));
          if (missing.length > 10) {
            log(`       ... and ${missing.length - 10} more`, 'yellow');
          }
        }

        if (extra.length > 0) {
          log(`     Extra keys (${extra.length}):`, 'yellow');
          extra.slice(0, 10).forEach(key => log(`       - ${key}`, 'yellow'));
          if (extra.length > 10) {
            log(`       ... and ${extra.length - 10} more`, 'yellow');
          }
        }

        results.warnings.push({ language: lang, missing, extra });
      } else {
        log(`   ✓ ${lang}: All ${langKeys.length} keys match`, 'green');
      }
    }

    if (allMatch) {
      log(`   ✓ All languages have consistent keys (${referenceKeys.length} keys each)`, 'green');
    }
  }

  // Verify critical sections
  log('\n3. Verifying Critical Translation Sections...', 'blue');

  for (const lang in loadedTranslations) {
    const missing = verifyCriticalSections(lang, loadedTranslations[lang].translations);

    if (missing.length > 0) {
      log(`   ✗ ${lang}: Missing ${missing.length} critical keys`, 'red');
      missing.forEach(key => log(`     - ${key}`, 'yellow'));
      results.warnings.push({ language: lang, missingCritical: missing });
    } else {
      log(`   ✓ ${lang}: All critical sections present`, 'green');
    }
  }

  // Verify structure
  log('\n4. Verifying Translation Structure...', 'blue');

  for (const lang in loadedTranslations) {
    const { translations } = loadedTranslations[lang];
    const sections = Object.keys(translations);

    const expectedSections = [
      'header',
      'currencies',
      'validation',
      'calculationBreakdown',
      'revenueSetup',
      'performanceMetrics',
      'advancedMetrics',
      'costStructure',
      'suggestions',
    ];

    const missingSections = expectedSections.filter(s => !sections.includes(s));

    if (missingSections.length > 0) {
      log(`   ✗ ${lang}: Missing sections: ${missingSections.join(', ')}`, 'red');
    } else {
      log(`   ✓ ${lang}: All expected sections present (${sections.length} sections)`, 'green');
    }
  }

  // Final summary
  log('\n' + '='.repeat(80), 'cyan');
  log('SUMMARY', 'bold');
  log('='.repeat(80), 'cyan');

  log(`\nTotal Languages: ${results.total}`, 'cyan');
  log(`Passed: ${results.passed}`, results.passed === results.total ? 'green' : 'yellow');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');

  if (results.errors.length > 0) {
    log(`\nErrors (${results.errors.length}):`, 'red');
    results.errors.forEach(e => {
      log(`  - ${e.language}: ${e.error}`, 'red');
    });
  }

  if (results.warnings.length > 0) {
    log(`\nWarnings (${results.warnings.length}):`, 'yellow');
    log('  Check details above for missing/extra keys', 'yellow');
  }

  // Check if all tests passed
  const allPassed = results.passed === results.total &&
                    results.errors.length === 0 &&
                    results.warnings.length === 0;

  if (allPassed) {
    log('\n✓ ALL TESTS PASSED!', 'green');
    log('Translation system is ready for production.', 'green');
  } else {
    log('\n✗ SOME TESTS FAILED', 'red');
    log('Please review the errors and warnings above.', 'yellow');
  }

  log('\n' + '='.repeat(80), 'cyan');

  // Return exit code
  process.exit(allPassed ? 0 : 1);
}

// Run tests
runTests();
