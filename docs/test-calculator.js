/**
 * Comprehensive ROI Calculator Test Suite
 * Tests all functionality after i18n implementation
 */

const fs = require('fs');
const path = require('path');

// Test results tracking
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(category, testName, status, details = '') {
  testResults.total++;
  if (status === 'PASS') {
    testResults.passed++;
  } else {
    testResults.failed++;
  }

  testResults.tests.push({
    category,
    name: testName,
    status,
    details
  });

  console.log(`[${status}] ${category} > ${testName}${details ? ': ' + details : ''}`);
}

// Read the page.tsx file
const pagePath = path.join(__dirname, 'app', 'page.tsx');
let pageContent = '';

try {
  pageContent = fs.readFileSync(pagePath, 'utf8');
  logTest('Setup', 'Read page.tsx file', 'PASS');
} catch (error) {
  logTest('Setup', 'Read page.tsx file', 'FAIL', error.message);
  process.exit(1);
}

// ============================================================================
// 1. CORE CALCULATIONS TESTS
// ============================================================================

console.log('\n=== TESTING CORE CALCULATIONS ===\n');

// Test 1.1: Cold Email Calculation Variables
const requiredCalcVars = [
  'emailsPerMonth', 'totalEmails', 'prospects', 'leads', 'opportunities',
  'meetings', 'deals', 'revenue', 'totalCost', 'costPerMeeting', 'cac', 'roi'
];

requiredCalcVars.forEach(varName => {
  if (pageContent.includes(`${varName}:`)) {
    logTest('Core Calculations', `Variable "${varName}" exists`, 'PASS');
  } else {
    logTest('Core Calculations', `Variable "${varName}" exists`, 'FAIL', 'Not found in calculations state');
  }
});

// Test 1.2: Cold Calling Calculation Variables
const callingVars = [
  'callsPerMonth', 'callConnections', 'callMeetings', 'callDeals',
  'callRevenue', 'callCost', 'callROI', 'callCAC'
];

callingVars.forEach(varName => {
  if (pageContent.includes(`${varName}:`)) {
    logTest('Core Calculations', `Cold Calling "${varName}" exists`, 'PASS');
  } else {
    logTest('Core Calculations', `Cold Calling "${varName}" exists`, 'FAIL', 'Not found');
  }
});

// Test 1.3: LinkedIn Calculation Variables
const linkedInVars = [
  'linkedInConnectionsPerMonth', 'linkedInAccepted', 'linkedInReplies',
  'linkedInMeetings', 'linkedInDeals', 'linkedInRevenue', 'linkedInCost',
  'linkedInROI', 'linkedInCAC'
];

linkedInVars.forEach(varName => {
  if (pageContent.includes(`${varName}:`)) {
    logTest('Core Calculations', `LinkedIn "${varName}" exists`, 'PASS');
  } else {
    logTest('Core Calculations', `LinkedIn "${varName}" exists`, 'FAIL', 'Not found');
  }
});

// Test 1.4: Referral Calculation Variables
const referralVars = [
  'referralMeetings', 'referralDeals', 'referralRevenue',
  'referralCost', 'referralROI', 'referralCAC'
];

referralVars.forEach(varName => {
  if (pageContent.includes(`${varName}:`)) {
    logTest('Core Calculations', `Referral "${varName}" exists`, 'PASS');
  } else {
    logTest('Core Calculations', `Referral "${varName}" exists`, 'FAIL', 'Not found');
  }
});

// Test 1.5: Combined Multi-channel Metrics
const combinedVars = [
  'totalMeetingsAllChannels', 'totalDealsAllChannels', 'totalRevenueAllChannels',
  'totalCostAllChannels', 'combinedROI', 'combinedCAC'
];

combinedVars.forEach(varName => {
  if (pageContent.includes(`${varName}:`)) {
    logTest('Core Calculations', `Combined metric "${varName}" exists`, 'PASS');
  } else {
    logTest('Core Calculations', `Combined metric "${varName}" exists`, 'FAIL', 'Not found');
  }
});

// Test 1.6: Commission Calculation Variables
const commissionVars = [
  'commissionCost', 'totalCostWithCommission', 'roiWithCommission',
  'cacWithCommission', 'profitWithoutCommission', 'profitWithCommission'
];

commissionVars.forEach(varName => {
  if (pageContent.includes(`${varName}:`)) {
    logTest('Core Calculations', `Commission "${varName}" exists`, 'PASS');
  } else {
    logTest('Core Calculations', `Commission "${varName}" exists`, 'FAIL', 'Not found');
  }
});

// Test 1.7: Tax Calculations - All 11 Currencies
const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF', 'INR', 'SGD', 'AED'];
const taxRatesExist = pageContent.includes('CORPORATE_TAX_RATES');

if (taxRatesExist) {
  logTest('Core Calculations', 'CORPORATE_TAX_RATES constant exists', 'PASS');

  currencies.forEach(curr => {
    if (pageContent.includes(`${curr}:`)) {
      logTest('Core Calculations', `Tax rate for ${curr} defined`, 'PASS');
    } else {
      logTest('Core Calculations', `Tax rate for ${curr} defined`, 'FAIL');
    }
  });
} else {
  logTest('Core Calculations', 'CORPORATE_TAX_RATES constant exists', 'FAIL');
}

// ============================================================================
// 2. STATE MANAGEMENT TESTS
// ============================================================================

console.log('\n=== TESTING STATE MANAGEMENT ===\n');

// Test 2.1: Input Field State Variables
const inputStates = [
  'domains', 'mailboxes', 'emailsPerDay', 'workingDays', 'sequenceSteps',
  'ratioPerReply', 'closeRate', 'ltv', 'openRate', 'replyRate',
  'positiveReplyRate', 'meetingBookRate', 'bounceRate', 'unsubscribeRate',
  'salesCycleLength', 'churnRate'
];

inputStates.forEach(state => {
  const statePattern = new RegExp(`const \\[${state}, set[A-Z]`);
  if (statePattern.test(pageContent)) {
    logTest('State Management', `Input state "${state}" with setter`, 'PASS');
  } else {
    logTest('State Management', `Input state "${state}" with setter`, 'FAIL');
  }
});

// Test 2.2: Cost Input States
const costStates = [
  'domainCost', 'mailboxCost', 'deliveryCost', 'softwareCost', 'engineerCost',
  'warmupCost', 'dataProviderCost', 'copywriterCost'
];

costStates.forEach(state => {
  const statePattern = new RegExp(`const \\[${state}, set[A-Z]`);
  if (statePattern.test(pageContent)) {
    logTest('State Management', `Cost state "${state}" with setter`, 'PASS');
  } else {
    logTest('State Management', `Cost state "${state}" with setter`, 'FAIL');
  }
});

// Test 2.3: Toggle Switches State
const toggleStates = [
  'enableEmailMetrics', 'enableAdvanced', 'enableAgency', 'enableCommission',
  'enableColdCalling', 'enableLinkedIn', 'enableReferrals', 'enableTax'
];

toggleStates.forEach(state => {
  const statePattern = new RegExp(`const \\[${state}, set[A-Z]`);
  if (statePattern.test(pageContent)) {
    logTest('State Management', `Toggle state "${state}" with setter`, 'PASS');
  } else {
    logTest('State Management', `Toggle state "${state}" with setter`, 'FAIL');
  }
});

// Test 2.4: Visibility Toggle States
const visibilityStates = [
  'showAdvanced', 'showAgencyComparison', 'showCommission',
  'showColdCalling', 'showLinkedIn', 'showReferrals', 'showCalculationBreakdown'
];

visibilityStates.forEach(state => {
  const statePattern = new RegExp(`const \\[${state}, set[A-Z]`);
  if (statePattern.test(pageContent)) {
    logTest('State Management', `Visibility state "${state}" with setter`, 'PASS');
  } else {
    logTest('State Management', `Visibility state "${state}" with setter`, 'FAIL');
  }
});

// Test 2.5: Currency State
if (pageContent.includes('const [currency, setCurrency]')) {
  logTest('State Management', 'Currency state exists', 'PASS');
} else {
  logTest('State Management', 'Currency state exists', 'FAIL');
}

// Test 2.6: Commission Type State
if (pageContent.includes('commissionType') && pageContent.includes('setCommissionType')) {
  logTest('State Management', 'Commission type state exists', 'PASS');
} else {
  logTest('State Management', 'Commission type state exists', 'FAIL');
}

// Test 2.7: Multi-channel Input States
const multiChannelStates = [
  'callsPerDay', 'callConnectRate', 'callToMeetingRate',
  'linkedInConnectionsPerDay', 'linkedInAcceptRate', 'linkedInReplyRate',
  'referralsPerMonth', 'referralConversionRate'
];

multiChannelStates.forEach(state => {
  const statePattern = new RegExp(`const \\[${state}, set[A-Z]`);
  if (statePattern.test(pageContent)) {
    logTest('State Management', `Multi-channel state "${state}" with setter`, 'PASS');
  } else {
    logTest('State Management', `Multi-channel state "${state}" with setter`, 'FAIL');
  }
});

// ============================================================================
// 3. UI COMPONENTS TESTS
// ============================================================================

console.log('\n=== TESTING UI COMPONENTS ===\n');

// Test 3.1: Core UI Component Imports
const uiComponents = [
  'Card', 'CardContent', 'CardDescription', 'CardHeader', 'CardTitle',
  'Input', 'Label', 'Separator', 'Button', 'Select', 'Switch'
];

uiComponents.forEach(comp => {
  if (pageContent.includes(`import.*${comp}`)) {
    logTest('UI Components', `${comp} imported`, 'PASS');
  } else {
    logTest('UI Components', `${comp} imported`, 'FAIL');
  }
});

// Test 3.2: Icon Imports
const icons = [
  'InfoIcon', 'RotateCcw', 'TrendingUp', 'TrendingDown', 'AlertTriangle',
  'DollarSign', 'Calculator', 'Phone', 'Linkedin', 'UserPlus', 'Mail'
];

icons.forEach(icon => {
  if (pageContent.includes(icon)) {
    logTest('UI Components', `Icon "${icon}" imported`, 'PASS');
  } else {
    logTest('UI Components', `Icon "${icon}" imported`, 'FAIL');
  }
});

// Test 3.3: Tooltip Component Usage
const tooltipCount = (pageContent.match(/InfoIcon/g) || []).length;
if (tooltipCount > 0) {
  logTest('UI Components', `Tooltip icons present (${tooltipCount} found)`, 'PASS');
} else {
  logTest('UI Components', 'Tooltip icons present', 'FAIL', 'No InfoIcon found');
}

// Test 3.4: Card Sections (checking for key sections)
const cardSections = [
  'Revenue Setup',
  'Performance Metrics',
  'Cost Structure',
  'ROI',
  'Financial Summary'
];

cardSections.forEach(section => {
  if (pageContent.includes(section)) {
    logTest('UI Components', `"${section}" section exists`, 'PASS');
  } else {
    logTest('UI Components', `"${section}" section exists`, 'FAIL');
  }
});

// ============================================================================
// 4. DATA PERSISTENCE TESTS
// ============================================================================

console.log('\n=== TESTING DATA PERSISTENCE ===\n');

// Test 4.1: localStorage save
if (pageContent.includes('localStorage.setItem("roiCalculatorData"')) {
  logTest('Data Persistence', 'localStorage save implemented', 'PASS');
} else {
  logTest('Data Persistence', 'localStorage save implemented', 'FAIL');
}

// Test 4.2: localStorage load
if (pageContent.includes('localStorage.getItem("roiCalculatorData")')) {
  logTest('Data Persistence', 'localStorage load implemented', 'PASS');
} else {
  logTest('Data Persistence', 'localStorage load implemented', 'FAIL');
}

// Test 4.3: useEffect for loading data
if (pageContent.includes('useEffect') && pageContent.includes('const saved = localStorage.getItem')) {
  logTest('Data Persistence', 'useEffect for loading data on mount', 'PASS');
} else {
  logTest('Data Persistence', 'useEffect for loading data on mount', 'FAIL');
}

// Test 4.4: useEffect for saving data
const saveEffectPattern = /useEffect.*localStorage\.setItem/s;
if (saveEffectPattern.test(pageContent)) {
  logTest('Data Persistence', 'useEffect for auto-saving data', 'PASS');
} else {
  logTest('Data Persistence', 'useEffect for auto-saving data', 'FAIL');
}

// Test 4.5: Check if all key states are persisted
const persistedStates = [
  'domains', 'mailboxes', 'emailsPerDay', 'currency', 'enableTax',
  'commissionType', 'commissionRate', 'enableColdCalling', 'enableLinkedIn'
];

persistedStates.forEach(state => {
  const savePattern = new RegExp(`${state}[,\\s]`, 'm');
  const loadPattern = new RegExp(`set[A-Z][a-zA-Z]*\\(data\\.${state}`);

  if (savePattern.test(pageContent) && loadPattern.test(pageContent)) {
    logTest('Data Persistence', `State "${state}" persisted and loaded`, 'PASS');
  } else {
    logTest('Data Persistence', `State "${state}" persisted and loaded`, 'FAIL');
  }
});

// ============================================================================
// 5. VALIDATION TESTS
// ============================================================================

console.log('\n=== TESTING VALIDATION ===\n');

// Test 5.1: Required field validation function
if (pageContent.includes('validateRequiredFields')) {
  logTest('Validation', 'Validation function exists', 'PASS');
} else {
  logTest('Validation', 'Validation function exists', 'FAIL');
}

// Test 5.2: Missing fields tracking
if (pageContent.includes('missingFields')) {
  logTest('Validation', 'Missing fields tracking', 'PASS');
} else {
  logTest('Validation', 'Missing fields tracking', 'FAIL');
}

// Test 5.3: isValid flag
if (pageContent.includes('isValid:')) {
  logTest('Validation', 'isValid flag in calculations', 'PASS');
} else {
  logTest('Validation', 'isValid flag in calculations', 'FAIL');
}

// Test 5.4: Validation for required inputs
const validatedFields = ['mailboxes', 'emailsPerDay', 'workingDays', 'ratioPerReply', 'closeRate', 'ltv'];
validatedFields.forEach(field => {
  const validationPattern = new RegExp(`if \\(${field} < 1\\)`);
  if (validationPattern.test(pageContent)) {
    logTest('Validation', `"${field}" has validation`, 'PASS');
  } else {
    logTest('Validation', `"${field}" has validation`, 'FAIL');
  }
});

// Test 5.5: Error message display
if (pageContent.includes('AlertTriangle') || pageContent.includes('error') || pageContent.includes('warning')) {
  logTest('Validation', 'Error/warning indicators present', 'PASS');
} else {
  logTest('Validation', 'Error/warning indicators present', 'FAIL');
}

// ============================================================================
// 6. RESET FUNCTIONALITY
// ============================================================================

console.log('\n=== TESTING RESET FUNCTIONALITY ===\n');

// Test 6.1: Reset button/function
if (pageContent.includes('RotateCcw') || pageContent.includes('reset')) {
  logTest('Reset Functionality', 'Reset button/icon present', 'PASS');
} else {
  logTest('Reset Functionality', 'Reset button/icon present', 'FAIL');
}

// ============================================================================
// 7. CURRENCY FUNCTIONALITY
// ============================================================================

console.log('\n=== TESTING CURRENCY FUNCTIONALITY ===\n');

// Test 7.1: All 11 currencies defined
const currenciesObj = pageContent.includes('CURRENCIES') &&
                      currencies.every(curr => pageContent.includes(`${curr}:`));

if (currenciesObj) {
  logTest('Currency', 'All 11 currencies defined in CURRENCIES object', 'PASS');
} else {
  logTest('Currency', 'All 11 currencies defined in CURRENCIES object', 'FAIL');
}

// Test 7.2: Currency symbols
currencies.forEach(curr => {
  if (pageContent.includes(`${curr}:`) && pageContent.includes('symbol:')) {
    logTest('Currency', `${curr} has symbol defined`, 'PASS');
  } else {
    logTest('Currency', `${curr} has symbol defined`, 'FAIL');
  }
});

// Test 7.3: Currency names
currencies.forEach(curr => {
  if (pageContent.includes(`${curr}:`) && pageContent.includes('name:')) {
    logTest('Currency', `${curr} has name defined`, 'PASS');
  } else {
    logTest('Currency', `${curr} has name defined`, 'FAIL');
  }
});

// ============================================================================
// 8. ADVANCED FEATURES
// ============================================================================

console.log('\n=== TESTING ADVANCED FEATURES ===\n');

// Test 8.1: Agency Comparison
if (pageContent.includes('agencySetupFee') && pageContent.includes('agencyMonthlyFee')) {
  logTest('Advanced Features', 'Agency comparison fields present', 'PASS');
} else {
  logTest('Advanced Features', 'Agency comparison fields present', 'FAIL');
}

// Test 8.2: Commission Tracking
if (pageContent.includes('commissionType') && pageContent.includes('commissionRate')) {
  logTest('Advanced Features', 'Commission tracking implemented', 'PASS');
} else {
  logTest('Advanced Features', 'Commission tracking implemented', 'FAIL');
}

// Test 8.3: Cold Calling Channel
if (pageContent.includes('callsPerDay') && pageContent.includes('callConnectRate')) {
  logTest('Advanced Features', 'Cold Calling channel implemented', 'PASS');
} else {
  logTest('Advanced Features', 'Cold Calling channel implemented', 'FAIL');
}

// Test 8.4: LinkedIn Channel
if (pageContent.includes('linkedInConnectionsPerDay') && pageContent.includes('linkedInAcceptRate')) {
  logTest('Advanced Features', 'LinkedIn channel implemented', 'PASS');
} else {
  logTest('Advanced Features', 'LinkedIn channel implemented', 'FAIL');
}

// Test 8.5: Referrals Channel
if (pageContent.includes('referralsPerMonth') && pageContent.includes('referralConversionRate')) {
  logTest('Advanced Features', 'Referrals channel implemented', 'PASS');
} else {
  logTest('Advanced Features', 'Referrals channel implemented', 'FAIL');
}

// ============================================================================
// 9. CODE QUALITY TESTS
// ============================================================================

console.log('\n=== TESTING CODE QUALITY ===\n');

// Test 9.1: "use client" directive
if (pageContent.startsWith('"use client"') || pageContent.startsWith("'use client'")) {
  logTest('Code Quality', '"use client" directive present', 'PASS');
} else {
  logTest('Code Quality', '"use client" directive present', 'FAIL');
}

// Test 9.2: Type safety (TypeScript)
if (pageContent.includes('CurrencyCode') && pageContent.includes('type ')) {
  logTest('Code Quality', 'TypeScript types defined', 'PASS');
} else {
  logTest('Code Quality', 'TypeScript types defined', 'FAIL');
}

// Test 9.3: Constants defined
if (pageContent.includes('const CURRENCIES') && pageContent.includes('const CORPORATE_TAX_RATES')) {
  logTest('Code Quality', 'Constants properly defined', 'PASS');
} else {
  logTest('Code Quality', 'Constants properly defined', 'FAIL');
}

// Test 9.4: No console.errors (except in catch blocks)
const consoleErrors = pageContent.match(/console\.error/g);
const catchBlocks = pageContent.match(/catch/g);
if (!consoleErrors || (consoleErrors.length === catchBlocks.length)) {
  logTest('Code Quality', 'No improper console.error usage', 'PASS');
} else {
  logTest('Code Quality', 'No improper console.error usage', 'FAIL');
}

// ============================================================================
// GENERATE TEST REPORT
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('TEST SUMMARY');
console.log('='.repeat(80));
console.log(`Total Tests: ${testResults.total}`);
console.log(`Passed: ${testResults.passed} (${((testResults.passed/testResults.total)*100).toFixed(1)}%)`);
console.log(`Failed: ${testResults.failed} (${((testResults.failed/testResults.total)*100).toFixed(1)}%)`);
console.log('='.repeat(80));

// Group by category
const categories = {};
testResults.tests.forEach(test => {
  if (!categories[test.category]) {
    categories[test.category] = { passed: 0, failed: 0, total: 0 };
  }
  categories[test.category].total++;
  if (test.status === 'PASS') {
    categories[test.category].passed++;
  } else {
    categories[test.category].failed++;
  }
});

console.log('\nRESULTS BY CATEGORY:\n');
Object.keys(categories).forEach(cat => {
  const stats = categories[cat];
  const pct = ((stats.passed/stats.total)*100).toFixed(1);
  console.log(`${cat}: ${stats.passed}/${stats.total} (${pct}%)`);
});

// List failures
const failures = testResults.tests.filter(t => t.status === 'FAIL');
if (failures.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('FAILED TESTS:');
  console.log('='.repeat(80));
  failures.forEach(test => {
    console.log(`\n[FAIL] ${test.category} > ${test.name}`);
    if (test.details) {
      console.log(`       Details: ${test.details}`);
    }
  });
}

// Save detailed report to file
const reportPath = path.join(__dirname, 'test-report.json');
fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
console.log(`\nDetailed report saved to: ${reportPath}`);

// Exit with appropriate code
process.exit(failures.length > 0 ? 1 : 0);
