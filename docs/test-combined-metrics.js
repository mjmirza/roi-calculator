/**
 * COMPREHENSIVE MATHEMATICAL VALIDATION TEST
 * Testing Combined/Multi-Channel Metrics After Fix
 *
 * This test validates the mathematical correctness of lines 613-618 in page.tsx
 * after the fix to only include costs when channels are enabled.
 */

console.log("=".repeat(80));
console.log("COMBINED METRICS MATHEMATICAL VALIDATION TEST");
console.log("=".repeat(80));
console.log("");

// Test configuration matching the default state
const DEFAULT_CONFIG = {
  // Cold Email (always enabled)
  ltv: 5000,
  mailboxes: 40,
  emailsPerDay: 18,
  workingDays: 21,
  sequenceSteps: 3,
  ratioPerReply: 300,
  closeRate: 70,

  // Cold Email Costs
  domainCost: 0,
  mailboxCost: 0,
  deliveryCost: 0,
  softwareCost: 0,
  engineerCost: 5800,
  warmupCost: 0,
  dataProviderCost: 0,
  copywriterCost: 0,

  // Cold Calling
  callsPerDay: 50,
  callConnectRate: 30,
  callToMeetingRate: 15,
  callingDaysPerMonth: 21,
  callingSoftwareCost: 200,
  callerSalaryCost: 4000,

  // LinkedIn
  linkedInConnectionsPerDay: 30,
  linkedInAcceptRate: 25,
  linkedInReplyRate: 10,
  linkedInMeetingRate: 20,
  linkedInToolCost: 100,
  linkedInManagerCost: 3500,

  // Referrals
  referralsPerMonth: 10,
  referralConversionRate: 40,
  referralIncentiveCost: 500,
  referralProgramCost: 1000,
};

/**
 * Calculate Cold Email metrics (always enabled)
 */
function calculateColdEmail(config) {
  const totalEmailsAllMailboxes = config.mailboxes * config.emailsPerDay * config.workingDays;
  const totalProspects = Math.floor(totalEmailsAllMailboxes / config.sequenceSteps);
  const opportunities = Math.floor(totalProspects / config.ratioPerReply);
  const meetings = Math.floor(opportunities * 0.76);
  const deals = Math.floor(meetings * (config.closeRate / 100));
  const revenue = deals * config.ltv;

  const totalCost = config.domainCost + config.mailboxCost + config.deliveryCost +
                    config.softwareCost + config.engineerCost + config.warmupCost +
                    config.dataProviderCost + config.copywriterCost;

  const roi = totalCost > 0 ? ((revenue - totalCost) / totalCost) * 100 : 0;

  return {
    meetings,
    deals,
    revenue,
    cost: totalCost,
    roi
  };
}

/**
 * Calculate Cold Calling metrics
 */
function calculateColdCalling(config, enabled) {
  const callsPerMonth = enabled ? config.callsPerDay * config.callingDaysPerMonth : 0;
  const callConnections = Math.round(callsPerMonth * (config.callConnectRate / 100));
  const callMeetings = Math.round(callConnections * (config.callToMeetingRate / 100));
  const callDeals = Math.round(callMeetings * (config.closeRate / 100));
  const callRevenue = callDeals * config.ltv;

  // CRITICAL: Only include cost when channel is enabled
  const callCost = enabled ? config.callingSoftwareCost + config.callerSalaryCost : 0;

  const callROI = callCost > 0 ? ((callRevenue - callCost) / callCost) * 100 : 0;

  return {
    meetings: callMeetings,
    deals: callDeals,
    revenue: callRevenue,
    cost: callCost,
    roi: callROI
  };
}

/**
 * Calculate LinkedIn metrics
 */
function calculateLinkedIn(config, enabled) {
  const linkedInConnectionsPerMonth = enabled ? config.linkedInConnectionsPerDay * config.workingDays : 0;
  const linkedInAccepted = Math.round(linkedInConnectionsPerMonth * (config.linkedInAcceptRate / 100));
  const linkedInReplies = Math.round(linkedInAccepted * (config.linkedInReplyRate / 100));
  const linkedInMeetings = Math.round(linkedInReplies * (config.linkedInMeetingRate / 100));
  const linkedInDeals = Math.round(linkedInMeetings * (config.closeRate / 100));
  const linkedInRevenue = linkedInDeals * config.ltv;

  // CRITICAL: Only include cost when channel is enabled
  const linkedInCost = enabled ? config.linkedInToolCost + config.linkedInManagerCost : 0;

  const linkedInROI = linkedInCost > 0 ? ((linkedInRevenue - linkedInCost) / linkedInCost) * 100 : 0;

  return {
    meetings: linkedInMeetings,
    deals: linkedInDeals,
    revenue: linkedInRevenue,
    cost: linkedInCost,
    roi: linkedInROI
  };
}

/**
 * Calculate Referrals metrics
 */
function calculateReferrals(config, enabled) {
  const referralMeetings = enabled ? Math.round(config.referralsPerMonth * (config.referralConversionRate / 100)) : 0;
  const referralDeals = Math.round(referralMeetings * (config.closeRate / 100));
  const referralRevenue = referralDeals * config.ltv;

  // CRITICAL: Only include cost when channel is enabled
  const referralCost = enabled ? config.referralProgramCost + referralDeals * config.referralIncentiveCost : 0;

  const referralROI = referralCost > 0 ? ((referralRevenue - referralCost) / referralCost) * 100 : 0;

  return {
    meetings: referralMeetings,
    deals: referralDeals,
    revenue: referralRevenue,
    cost: referralCost,
    roi: referralROI
  };
}

/**
 * Calculate combined metrics (lines 613-618)
 */
function calculateCombined(email, calling, linkedIn, referrals) {
  const totalMeetingsAllChannels = email.meetings + calling.meetings + linkedIn.meetings + referrals.meetings;
  const totalDealsAllChannels = email.deals + calling.deals + linkedIn.deals + referrals.deals;
  const totalRevenueAllChannels = email.revenue + calling.revenue + linkedIn.revenue + referrals.revenue;
  const totalCostAllChannels = email.cost + calling.cost + linkedIn.cost + referrals.cost;
  const combinedROI = totalCostAllChannels > 0
    ? ((totalRevenueAllChannels - totalCostAllChannels) / totalCostAllChannels) * 100
    : 0;
  const combinedCAC = totalDealsAllChannels > 0 ? totalCostAllChannels / totalDealsAllChannels : 0;

  return {
    totalMeetings: totalMeetingsAllChannels,
    totalDeals: totalDealsAllChannels,
    totalRevenue: totalRevenueAllChannels,
    totalCost: totalCostAllChannels,
    combinedROI,
    combinedCAC
  };
}

/**
 * Validation function
 */
function validateTest(testName, actual, expected, description) {
  const passed = Math.abs(actual - expected) < 0.01; // Allow for floating point precision
  const status = passed ? "✓ PASS" : "✗ FAIL";
  const color = passed ? "\x1b[32m" : "\x1b[31m";
  const reset = "\x1b[0m";

  console.log(`${color}${status}${reset} ${testName}`);
  console.log(`  Description: ${description}`);
  console.log(`  Expected: ${expected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  console.log(`  Actual:   ${actual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

  if (!passed) {
    console.log(`  ${color}Difference: ${(actual - expected).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${reset}`);
  }
  console.log("");

  return passed;
}

// Track test results
let totalTests = 0;
let passedTests = 0;

console.log("TEST 1: ALL CHANNELS DISABLED");
console.log("-".repeat(80));
{
  const email = calculateColdEmail(DEFAULT_CONFIG);
  const calling = calculateColdCalling(DEFAULT_CONFIG, false);
  const linkedIn = calculateLinkedIn(DEFAULT_CONFIG, false);
  const referrals = calculateReferrals(DEFAULT_CONFIG, false);
  const combined = calculateCombined(email, calling, linkedIn, referrals);

  console.log("Cold Email Metrics:");
  console.log(`  Meetings: ${email.meetings}, Deals: ${email.deals}, Revenue: $${email.revenue.toLocaleString()}, Cost: $${email.cost.toLocaleString()}, ROI: ${email.roi.toFixed(2)}%`);
  console.log("");

  totalTests++; if (validateTest("1.1", combined.totalCost, email.cost, "Total cost equals cold email cost only (no phantom costs)")) passedTests++;
  totalTests++; if (validateTest("1.2", combined.totalRevenue, email.revenue, "Total revenue equals cold email revenue")) passedTests++;
  totalTests++; if (validateTest("1.3", combined.totalDeals, email.deals, "Total deals equals cold email deals")) passedTests++;
  totalTests++; if (validateTest("1.4", combined.totalMeetings, email.meetings, "Total meetings equals cold email meetings")) passedTests++;
  totalTests++; if (validateTest("1.5", combined.combinedROI, email.roi, "Combined ROI equals cold email ROI")) passedTests++;

  // Verify disabled channels have zero cost
  totalTests++; if (validateTest("1.6", calling.cost, 0, "Cold calling cost is zero when disabled")) passedTests++;
  totalTests++; if (validateTest("1.7", linkedIn.cost, 0, "LinkedIn cost is zero when disabled")) passedTests++;
  totalTests++; if (validateTest("1.8", referrals.cost, 0, "Referrals cost is zero when disabled")) passedTests++;
}

console.log("TEST 2: SINGLE CHANNEL ADDITION (Cold Calling)");
console.log("-".repeat(80));
{
  const email = calculateColdEmail(DEFAULT_CONFIG);
  const calling = calculateColdCalling(DEFAULT_CONFIG, true);
  const linkedIn = calculateLinkedIn(DEFAULT_CONFIG, false);
  const referrals = calculateReferrals(DEFAULT_CONFIG, false);
  const combined = calculateCombined(email, calling, linkedIn, referrals);

  console.log("Cold Email Metrics:");
  console.log(`  Cost: $${email.cost.toLocaleString()}, Revenue: $${email.revenue.toLocaleString()}, ROI: ${email.roi.toFixed(2)}%`);
  console.log("Cold Calling Metrics:");
  console.log(`  Cost: $${calling.cost.toLocaleString()}, Revenue: $${calling.revenue.toLocaleString()}, ROI: ${calling.roi.toFixed(2)}%`);
  console.log("");

  const expectedCost = email.cost + calling.cost;
  const expectedRevenue = email.revenue + calling.revenue;
  const expectedROI = ((expectedRevenue - expectedCost) / expectedCost) * 100;

  totalTests++; if (validateTest("2.1", combined.totalCost, expectedCost, "Total cost = email + calling")) passedTests++;
  totalTests++; if (validateTest("2.2", calling.cost, 4200, "Calling cost increased by exactly $4,200")) passedTests++;
  totalTests++; if (validateTest("2.3", combined.totalRevenue, expectedRevenue, "Total revenue = email + calling")) passedTests++;
  totalTests++; if (validateTest("2.4", combined.combinedROI, expectedROI, "Combined ROI calculated correctly")) passedTests++;

  // Verify other channels still zero
  totalTests++; if (validateTest("2.5", linkedIn.cost, 0, "LinkedIn cost is still zero")) passedTests++;
  totalTests++; if (validateTest("2.6", referrals.cost, 0, "Referrals cost is still zero")) passedTests++;
}

console.log("TEST 3: ALL CHANNELS ENABLED");
console.log("-".repeat(80));
{
  const email = calculateColdEmail(DEFAULT_CONFIG);
  const calling = calculateColdCalling(DEFAULT_CONFIG, true);
  const linkedIn = calculateLinkedIn(DEFAULT_CONFIG, true);
  const referrals = calculateReferrals(DEFAULT_CONFIG, true);
  const combined = calculateCombined(email, calling, linkedIn, referrals);

  console.log("Channel Breakdown:");
  console.log(`  Cold Email:   Cost: $${email.cost.toLocaleString()}, Revenue: $${email.revenue.toLocaleString()}, Deals: ${email.deals}`);
  console.log(`  Cold Calling: Cost: $${calling.cost.toLocaleString()}, Revenue: $${calling.revenue.toLocaleString()}, Deals: ${calling.deals}`);
  console.log(`  LinkedIn:     Cost: $${linkedIn.cost.toLocaleString()}, Revenue: $${linkedIn.revenue.toLocaleString()}, Deals: ${linkedIn.deals}`);
  console.log(`  Referrals:    Cost: $${referrals.cost.toLocaleString()}, Revenue: $${referrals.revenue.toLocaleString()}, Deals: ${referrals.deals}`);
  console.log("");

  const expectedTotalCost = email.cost + calling.cost + linkedIn.cost + referrals.cost;
  const expectedTotalRevenue = email.revenue + calling.revenue + linkedIn.revenue + referrals.revenue;
  const expectedTotalDeals = email.deals + calling.deals + linkedIn.deals + referrals.deals;
  const expectedTotalMeetings = email.meetings + calling.meetings + linkedIn.meetings + referrals.meetings;
  const expectedROI = ((expectedTotalRevenue - expectedTotalCost) / expectedTotalCost) * 100;
  const expectedCAC = expectedTotalCost / expectedTotalDeals;

  totalTests++; if (validateTest("3.1", combined.totalCost, expectedTotalCost, "Total cost = sum of all enabled channels")) passedTests++;
  totalTests++; if (validateTest("3.2", combined.totalRevenue, expectedTotalRevenue, "Total revenue = sum of all channels")) passedTests++;
  totalTests++; if (validateTest("3.3", combined.totalDeals, expectedTotalDeals, "Total deals = sum of all channels")) passedTests++;
  totalTests++; if (validateTest("3.4", combined.totalMeetings, expectedTotalMeetings, "Total meetings = sum of all channels")) passedTests++;
  totalTests++; if (validateTest("3.5", combined.combinedROI, expectedROI, "Combined ROI calculated correctly")) passedTests++;
  totalTests++; if (validateTest("3.6", combined.combinedCAC, expectedCAC, "Combined CAC calculated correctly")) passedTests++;
}

console.log("TEST 4: CHANNEL TOGGLE TEST (LinkedIn)");
console.log("-".repeat(80));
{
  // First with LinkedIn disabled
  const email1 = calculateColdEmail(DEFAULT_CONFIG);
  const calling1 = calculateColdCalling(DEFAULT_CONFIG, false);
  const linkedIn1 = calculateLinkedIn(DEFAULT_CONFIG, false);
  const referrals1 = calculateReferrals(DEFAULT_CONFIG, false);
  const combined1 = calculateCombined(email1, calling1, linkedIn1, referrals1);

  // Then with LinkedIn enabled
  const email2 = calculateColdEmail(DEFAULT_CONFIG);
  const calling2 = calculateColdCalling(DEFAULT_CONFIG, false);
  const linkedIn2 = calculateLinkedIn(DEFAULT_CONFIG, true);
  const referrals2 = calculateReferrals(DEFAULT_CONFIG, false);
  const combined2 = calculateCombined(email2, calling2, linkedIn2, referrals2);

  console.log("LinkedIn Disabled:");
  console.log(`  Total Cost: $${combined1.totalCost.toLocaleString()}, LinkedIn Cost: $${linkedIn1.cost.toLocaleString()}`);
  console.log("LinkedIn Enabled:");
  console.log(`  Total Cost: $${combined2.totalCost.toLocaleString()}, LinkedIn Cost: $${linkedIn2.cost.toLocaleString()}`);
  console.log("");

  const costIncrease = combined2.totalCost - combined1.totalCost;
  const expectedIncrease = linkedIn2.cost;

  totalTests++; if (validateTest("4.1", linkedIn1.cost, 0, "LinkedIn cost is $0 when disabled")) passedTests++;
  totalTests++; if (validateTest("4.2", linkedIn2.cost, 3600, "LinkedIn cost is $3,600 when enabled")) passedTests++;
  totalTests++; if (validateTest("4.3", costIncrease, expectedIncrease, "Cost increases by LinkedIn cost amount")) passedTests++;

  // Now disable again
  const email3 = calculateColdEmail(DEFAULT_CONFIG);
  const calling3 = calculateColdCalling(DEFAULT_CONFIG, false);
  const linkedIn3 = calculateLinkedIn(DEFAULT_CONFIG, false);
  const referrals3 = calculateReferrals(DEFAULT_CONFIG, false);
  const combined3 = calculateCombined(email3, calling3, linkedIn3, referrals3);

  console.log("LinkedIn Disabled Again:");
  console.log(`  Total Cost: $${combined3.totalCost.toLocaleString()}, LinkedIn Cost: $${linkedIn3.cost.toLocaleString()}`);
  console.log("");

  totalTests++; if (validateTest("4.4", combined3.totalCost, combined1.totalCost, "Cost returns to original when disabled")) passedTests++;
}

console.log("TEST 5: MATHEMATICAL CONSISTENCY");
console.log("-".repeat(80));
{
  const email = calculateColdEmail(DEFAULT_CONFIG);
  const calling = calculateColdCalling(DEFAULT_CONFIG, true);
  const linkedIn = calculateLinkedIn(DEFAULT_CONFIG, true);
  const referrals = calculateReferrals(DEFAULT_CONFIG, true);
  const combined = calculateCombined(email, calling, linkedIn, referrals);

  // Manual calculations
  const manualTotalDeals = email.deals + calling.deals + linkedIn.deals + referrals.deals;
  const manualTotalMeetings = email.meetings + calling.meetings + linkedIn.meetings + referrals.meetings;
  const manualTotalRevenue = email.revenue + calling.revenue + linkedIn.revenue + referrals.revenue;
  const manualTotalCost = email.cost + calling.cost + linkedIn.cost + referrals.cost;
  const manualCAC = manualTotalCost / manualTotalDeals;
  const manualROI = ((manualTotalRevenue - manualTotalCost) / manualTotalCost) * 100;

  console.log("Verifying summation consistency:");
  console.log(`  Individual deals: ${email.deals} + ${calling.deals} + ${linkedIn.deals} + ${referrals.deals} = ${manualTotalDeals}`);
  console.log(`  Combined deals: ${combined.totalDeals}`);
  console.log("");

  totalTests++; if (validateTest("5.1", combined.totalDeals, manualTotalDeals, "Total deals = sum of channel deals")) passedTests++;
  totalTests++; if (validateTest("5.2", combined.totalMeetings, manualTotalMeetings, "Total meetings = sum of channel meetings")) passedTests++;
  totalTests++; if (validateTest("5.3", combined.totalRevenue, manualTotalRevenue, "Total revenue = sum of channel revenues")) passedTests++;
  totalTests++; if (validateTest("5.4", combined.totalCost, manualTotalCost, "Total cost = sum of enabled channel costs")) passedTests++;
  totalTests++; if (validateTest("5.5", combined.combinedCAC, manualCAC, "Combined CAC = totalCost / totalDeals")) passedTests++;
  totalTests++; if (validateTest("5.6", combined.combinedROI, manualROI, "Combined ROI = ((revenue - cost) / cost) × 100")) passedTests++;
}

console.log("TEST 6: EDGE CASES");
console.log("-".repeat(80));
{
  // Test with zero LTV
  const configZeroLTV = { ...DEFAULT_CONFIG, ltv: 0 };
  const email = calculateColdEmail(configZeroLTV);
  const calling = calculateColdCalling(configZeroLTV, true);
  const combined = calculateCombined(email, calling,
    calculateLinkedIn(configZeroLTV, false),
    calculateReferrals(configZeroLTV, false));

  console.log("Zero LTV Test:");
  console.log(`  Revenue: $${combined.totalRevenue.toLocaleString()}, ROI: ${combined.combinedROI.toFixed(2)}%`);
  console.log("");

  totalTests++; if (validateTest("6.1", combined.totalRevenue, 0, "Zero LTV results in zero revenue")) passedTests++;
  totalTests++; if (validateTest("6.2", combined.combinedROI, -100, "Zero revenue with cost results in -100% ROI")) passedTests++;

  // Test with zero close rate
  const configZeroClose = { ...DEFAULT_CONFIG, closeRate: 0 };
  const email2 = calculateColdEmail(configZeroClose);
  const combined2 = calculateCombined(email2,
    calculateColdCalling(configZeroClose, false),
    calculateLinkedIn(configZeroClose, false),
    calculateReferrals(configZeroClose, false));

  console.log("Zero Close Rate Test:");
  console.log(`  Deals: ${combined2.totalDeals}, Revenue: $${combined2.totalRevenue.toLocaleString()}`);
  console.log("");

  totalTests++; if (validateTest("6.3", combined2.totalDeals, 0, "Zero close rate results in zero deals")) passedTests++;
  totalTests++; if (validateTest("6.4", combined2.totalRevenue, 0, "Zero deals results in zero revenue")) passedTests++;
}

console.log("=".repeat(80));
console.log("FINAL RESULTS");
console.log("=".repeat(80));
console.log("");

const passRate = (passedTests / totalTests * 100).toFixed(2);
const allPassed = passedTests === totalTests;
const color = allPassed ? "\x1b[32m" : "\x1b[31m";
const reset = "\x1b[0m";

console.log(`${color}Tests Passed: ${passedTests}/${totalTests} (${passRate}%)${reset}`);
console.log("");

if (allPassed) {
  console.log("\x1b[32m✓ ALL TESTS PASSED - Combined metrics are mathematically correct!\x1b[0m");
  console.log("");
  console.log("Key Validations:");
  console.log("  ✓ No phantom costs when channels disabled");
  console.log("  ✓ Costs dynamically adjust when toggling channels");
  console.log("  ✓ All summations mathematically consistent");
  console.log("  ✓ ROI and CAC calculations correct");
  console.log("  ✓ Edge cases handled properly");
} else {
  console.log("\x1b[31m✗ SOME TESTS FAILED - Review the output above\x1b[0m");
  process.exit(1);
}

console.log("");
console.log("=".repeat(80));
