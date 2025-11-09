# Multi-Language Testing Guide

This directory contains comprehensive stress testing tools for the ROI Calculator's multi-language feature.

## 📋 Quick Start

### Run All Tests (Automated)
```bash
node generate-ml-test-report.js
```

### View Test Report
```bash
./view-test-report.sh
# Or manually open: test-reports/ml-test-report-*.html
```

### Interactive Browser Testing
```bash
# Option 1: Direct open (if using a local server)
open multi-language-stress-test.html

# Option 2: Use a local server
npx serve .
# Then navigate to http://localhost:3000/multi-language-stress-test.html
```

---

## 📁 Files Overview

### Test Files

| File | Purpose | Type |
|------|---------|------|
| `multi-language-stress-test.html` | Interactive browser-based test suite | HTML |
| `generate-ml-test-report.js` | Automated test runner with report generation | Node.js |
| `view-test-report.sh` | Helper script to open latest report | Bash |
| `MULTI_LANGUAGE_STRESS_TEST_REPORT.md` | Comprehensive test results & analysis | Markdown |

### Generated Reports

Reports are saved in `/test-reports/` directory:
- `ml-test-report-TIMESTAMP.json` - Machine-readable results
- `ml-test-report-TIMESTAMP.html` - Human-readable visual report

---

## 🧪 Test Coverage

### 1. Language Switching Tests (29 tests)
- Load all 10 languages
- Verify UI element updates
- Check translation completeness
- Detect missing translations

### 2. RTL Testing - Arabic (5 tests)
- Arabic character rendering
- RTL layout application
- Currency symbol display
- Number formatting
- Component mirroring

### 3. Character Set Tests (20 tests)
- Chinese (CJK Ideographs)
- Japanese (Hiragana/Katakana/Kanji)
- Arabic script
- Hindi (Devanagari)
- Russian (Cyrillic)
- Special character handling

### 4. Combined Features (16 tests)
- 110 Language × Currency combinations
- Multi-channel feature translations
- Advanced feature coverage
- Tax & commission toggles

### 5. Performance Tests (12 tests)
- File size analysis (10 languages)
- Parse time benchmarks
- Bundle size optimization
- Memory efficiency

### 6. Edge Cases (34 tests)
- Empty string detection
- Long word overflow checks
- Special character escaping
- JSON validity
- Translation consistency
- Rapid switching stability

**Total: 116+ comprehensive test scenarios**

---

## 📊 Understanding Test Results

### Pass Rate Targets

| Pass Rate | Status | Action Required |
|-----------|--------|-----------------|
| ≥ 95% | 🟢 Excellent | Production ready |
| 90-94% | 🟡 Good | Minor fixes recommended |
| 80-89% | 🟠 Fair | Address warnings before prod |
| < 80% | 🔴 Poor | Critical fixes required |

### Test Status Indicators

- ✅ **Passed** - Test completed successfully
- ❌ **Failed** - Test found critical issues
- ⚠️ **Warning** - Test passed with minor concerns

---

## 🔍 Interpreting Reports

### HTML Report Sections

1. **Summary Dashboard**
   - Overall pass/fail statistics
   - Pass rate percentage
   - Test execution time

2. **Languages Coverage**
   - Translation completeness per language
   - Missing key counts
   - File size metrics

3. **Performance Metrics**
   - Parse times
   - Bundle sizes
   - Optimization scores

4. **Recommendations**
   - Prioritized action items
   - Browser compatibility notes
   - Deployment checklist

### JSON Report Structure

```json
{
  "timestamp": "ISO-8601 timestamp",
  "summary": {
    "totalTests": 116,
    "passed": 102,
    "failed": 1,
    "warnings": 13,
    "passRate": "87.9%"
  },
  "categories": {
    // Detailed test results by category
  },
  "languages": {
    // Per-language statistics
  },
  "performanceMetrics": {
    // File sizes and timing data
  },
  "recommendations": [
    // Action items
  ]
}
```

---

## 🌐 Supported Languages

| Language | Code | Direction | Script | Status |
|----------|------|-----------|--------|--------|
| English | en | LTR | Latin | ✅ Reference |
| Spanish | es | LTR | Latin | ✅ Complete |
| French | fr | LTR | Latin | ✅ Complete |
| German | de | LTR | Latin | ✅ Complete |
| Portuguese | pt | LTR | Latin | ✅ Complete |
| Russian | ru | LTR | Cyrillic | ✅ Complete |
| **Arabic** | ar | **RTL** | Arabic | ✅ Complete |
| Chinese | zh | LTR | CJK | ✅ Complete |
| Japanese | ja | LTR | Kanji/Kana | ✅ Complete |
| Hindi | hi | LTR | Devanagari | ✅ Complete |

**Total:** 10 languages, 11 currencies, 110 combinations

---

## 🚀 Running Specific Tests

### Test Only One Language
```javascript
// Edit generate-ml-test-report.js
const LANGUAGES = ['en', 'es']; // Test only English and Spanish
```

### Test Only Performance
```javascript
// In generate-ml-test-report.js, comment out other test functions:
// testLanguageSwitching(translations);
// testRTL(translations);
// testCharacterSets(translations);
// testCombinedFeatures(translations);
testPerformance(translations); // Only this one
// testEdgeCases(translations);
```

### Rapid Switch Test (Interactive)
1. Open `multi-language-stress-test.html`
2. Click "⚡ Rapid Language Switch Test"
3. Observe 50 rapid switches in real-time

---

## 🐛 Common Issues & Solutions

### Issue: "Translation file not found"
**Solution:** Ensure all language files exist in `/translations/` directory:
```bash
ls translations/*.json
```

### Issue: "Tests passing but UI broken"
**Solution:** Run interactive browser tests for visual validation:
```bash
open multi-language-stress-test.html
```

### Issue: "Japanese character test failing"
**Note:** This is a known issue. Japanese uses Kanji (CJK) instead of pure Hiragana/Katakana. The test expects Hiragana but Japanese legitimately uses Kanji. This is a test validation issue, not a functionality problem.

**Fix:** Update the regex in `generate-ml-test-report.js`:
```javascript
// Change:
'ja': { pattern: /[\u3040-\u309f\u30a0-\u30ff]/, ... }

// To:
'ja': { pattern: /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/, ... }
```

### Issue: "Long words in German/Russian"
**Solution:** This is expected. German compounds words and Russian has long technical terms. Manual UI testing recommended to check for overflow.

---

## 📱 Manual Testing Checklist

### Desktop Browsers
- [ ] Chrome - Test all languages
- [ ] Firefox - Test all languages
- [ ] Safari - Test all languages
- [ ] Edge - Test all languages

### RTL Testing (Arabic)
- [ ] Layout mirrors correctly
- [ ] Text aligns right
- [ ] Inputs work properly
- [ ] Numbers format correctly
- [ ] Currency symbols display

### Mobile Testing
- [ ] iOS Safari - Test 3+ languages
- [ ] Android Chrome - Test 3+ languages
- [ ] RTL mode on mobile (Arabic)
- [ ] Small screen overflow (German)
- [ ] Touch interactions work

### Accessibility
- [ ] Screen reader announces language changes
- [ ] Keyboard navigation works in all languages
- [ ] Focus indicators visible
- [ ] Tab order correct (reversed in RTL)

---

## 🎯 Pre-Deployment Checklist

### Required
- [ ] All automated tests passing (>90%)
- [ ] Manual browser testing complete
- [ ] RTL testing validated (Arabic)
- [ ] Mobile testing complete
- [ ] No critical failures in reports

### Recommended
- [ ] Performance benchmarks reviewed
- [ ] Bundle size optimized
- [ ] Fonts loaded for all scripts
- [ ] Analytics tracking implemented
- [ ] User feedback mechanism in place

### Optional Enhancements
- [ ] Language auto-detection
- [ ] Lazy loading for languages
- [ ] Font preloading optimization
- [ ] Visual regression tests
- [ ] E2E test coverage

---

## 📈 Continuous Testing

### Run Tests on Every Commit
Add to your CI/CD pipeline:
```bash
# .github/workflows/test.yml (GitHub Actions)
- name: Run Multi-Language Tests
  run: node generate-ml-test-report.js

- name: Upload Test Reports
  uses: actions/upload-artifact@v3
  with:
    name: ml-test-reports
    path: test-reports/
```

### Weekly Performance Checks
```bash
# Cron job to track bundle size over time
0 0 * * 0 cd /path/to/roi-calculator && node generate-ml-test-report.js
```

---

## 🔧 Customization

### Add a New Language
1. Create translation file: `/translations/XX.json`
2. Follow structure in `TEMPLATE.json`
3. Add language code to `LANGUAGES` array in scripts
4. Run tests to verify completeness

### Add New Test Category
In `generate-ml-test-report.js`:
```javascript
// Add category to results structure
results.categories.myNewCategory = {
  tests: [],
  passed: 0,
  failed: 0,
  warnings: 0
};

// Create test function
function testMyNewCategory(translations) {
  // Your test logic here
  addTest('myNewCategory', 'Test name', 'passed', 'Details');
}

// Call in runTests()
testMyNewCategory(translations);
```

---

## 📞 Support

### Resources
- Full report: `MULTI_LANGUAGE_STRESS_TEST_REPORT.md`
- Translation structure: `translations/STRUCTURE.md`
- Translation guide: `translations/README.md`

### Troubleshooting
1. Check test reports in `/test-reports/`
2. Run interactive tests for visual debugging
3. Review translation files for missing keys
4. Verify JSON syntax with `node -c translations/XX.json`

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-09 | Initial test suite release |

---

**Last Updated:** November 9, 2025
**Maintained By:** ROI Calculator Team
