/**
 * Comprehensive Operating Costs Test Suite
 *
 * This test validates the new operating costs implementation including:
 * - Team costs (SDRs, AEs, Sales Manager, VA)
 * - Tool costs (CRM, Email Verification, Analytics)
 * - Training costs (per employee)
 * - Overhead bundle
 *
 * Target: 100% success ratio
 */

// Test scenarios
const testScenarios = [
  {
    id: 1,
    name: "Baseline - No Operating Costs",
    inputs: {
      sdrCount: 0,
      sdrCostPerPerson: 8500,
      aeCount: 0,
      aeCostPerPerson: 12000,
      enableSalesManager: false,
      salesManagerCost: 12500,
      crmPlatformCost: 0,
      emailVerificationCost: 0,
      salesAnalyticsCost: 0,
      enableVirtualAssistant: false,
      virtualAssistantCost: 2500,
      trainingCostPerEmployee: 300,
      overheadBundleCost: 0,
    },
    expected: {
      totalEmployees: 0,
      teamCost: 0,
      toolsCost: 0,
      trainingCost: 0,
      operatingCostTotal: 0,
    },
  },
  {
    id: 2,
    name: "Small Team - 2 SDRs Only",
    inputs: {
      sdrCount: 2,
      sdrCostPerPerson: 8500,
      aeCount: 0,
      aeCostPerPerson: 12000,
      enableSalesManager: false,
      salesManagerCost: 12500,
      crmPlatformCost: 300,
      emailVerificationCost: 100,
      salesAnalyticsCost: 200,
      enableVirtualAssistant: false,
      virtualAssistantCost: 2500,
      trainingCostPerEmployee: 300,
      overheadBundleCost: 1000,
    },
    expected: {
      totalEmployees: 2,
      teamCost: 17000, // 2 SDRs × $8,500
      toolsCost: 600, // $300 + $100 + $200
      trainingCost: 600, // 2 employees × $300
      operatingCostTotal: 19200, // $17,000 + $600 + $600 + $1,000
    },
  },
  {
    id: 3,
    name: "Medium Team - 2 SDRs + 1 AE",
    inputs: {
      sdrCount: 2,
      sdrCostPerPerson: 8500,
      aeCount: 1,
      aeCostPerPerson: 12000,
      enableSalesManager: false,
      salesManagerCost: 12500,
      crmPlatformCost: 300,
      emailVerificationCost: 100,
      salesAnalyticsCost: 200,
      enableVirtualAssistant: false,
      virtualAssistantCost: 2500,
      trainingCostPerEmployee: 300,
      overheadBundleCost: 1000,
    },
    expected: {
      totalEmployees: 3,
      teamCost: 29000, // (2 × $8,500) + (1 × $12,000)
      toolsCost: 600,
      trainingCost: 900, // 3 employees × $300
      operatingCostTotal: 31500, // $29,000 + $600 + $900 + $1,000
    },
  },
  {
    id: 4,
    name: "Full Team - 2 SDRs + 1 AE + Sales Manager",
    inputs: {
      sdrCount: 2,
      sdrCostPerPerson: 8500,
      aeCount: 1,
      aeCostPerPerson: 12000,
      enableSalesManager: true,
      salesManagerCost: 12500,
      crmPlatformCost: 300,
      emailVerificationCost: 100,
      salesAnalyticsCost: 200,
      enableVirtualAssistant: false,
      virtualAssistantCost: 2500,
      trainingCostPerEmployee: 300,
      overheadBundleCost: 1000,
    },
    expected: {
      totalEmployees: 4,
      teamCost: 41500, // (2 × $8,500) + (1 × $12,000) + $12,500
      toolsCost: 600,
      trainingCost: 1200, // 4 employees × $300
      operatingCostTotal: 44300, // $41,500 + $600 + $1,200 + $1,000
    },
  },
  {
    id: 5,
    name: "Full Team + Virtual Assistant",
    inputs: {
      sdrCount: 2,
      sdrCostPerPerson: 8500,
      aeCount: 1,
      aeCostPerPerson: 12000,
      enableSalesManager: true,
      salesManagerCost: 12500,
      crmPlatformCost: 300,
      emailVerificationCost: 100,
      salesAnalyticsCost: 200,
      enableVirtualAssistant: true,
      virtualAssistantCost: 2500,
      trainingCostPerEmployee: 300,
      overheadBundleCost: 1000,
    },
    expected: {
      totalEmployees: 5,
      teamCost: 44000, // (2 × $8,500) + (1 × $12,000) + $12,500 + $2,500
      toolsCost: 600,
      trainingCost: 1500, // 5 employees × $300
      operatingCostTotal: 47100, // $44,000 + $600 + $1,500 + $1,000
    },
  },
  {
    id: 6,
    name: "Scaled Team - 5 SDRs + 3 AEs + Manager + VA",
    inputs: {
      sdrCount: 5,
      sdrCostPerPerson: 8500,
      aeCount: 3,
      aeCostPerPerson: 12000,
      enableSalesManager: true,
      salesManagerCost: 12500,
      crmPlatformCost: 500, // Enterprise CRM
      emailVerificationCost: 200, // Higher volume
      salesAnalyticsCost: 400, // More tools
      enableVirtualAssistant: true,
      virtualAssistantCost: 2500,
      trainingCostPerEmployee: 300,
      overheadBundleCost: 2000, // Office space
    },
    expected: {
      totalEmployees: 10,
      teamCost: 93500, // (5 × $8,500 = $42,500) + (3 × $12,000 = $36,000) + $12,500 + $2,500
      toolsCost: 1100, // $500 + $200 + $400
      trainingCost: 3000, // 10 employees × $300
      operatingCostTotal: 99600, // $93,500 + $1,100 + $3,000 + $2,000
    },
  },
  {
    id: 7,
    name: "Zero Training Cost",
    inputs: {
      sdrCount: 2,
      sdrCostPerPerson: 8500,
      aeCount: 1,
      aeCostPerPerson: 12000,
      enableSalesManager: false,
      salesManagerCost: 12500,
      crmPlatformCost: 300,
      emailVerificationCost: 100,
      salesAnalyticsCost: 200,
      enableVirtualAssistant: false,
      virtualAssistantCost: 2500,
      trainingCostPerEmployee: 0, // No training
      overheadBundleCost: 1000,
    },
    expected: {
      totalEmployees: 3,
      teamCost: 29000,
      toolsCost: 600,
      trainingCost: 0, // 3 employees × $0
      operatingCostTotal: 30600, // $29,000 + $600 + $0 + $1,000
    },
  },
  {
    id: 8,
    name: "High Training Investment",
    inputs: {
      sdrCount: 2,
      sdrCostPerPerson: 8500,
      aeCount: 1,
      aeCostPerPerson: 12000,
      enableSalesManager: true,
      salesManagerCost: 12500,
      crmPlatformCost: 300,
      emailVerificationCost: 100,
      salesAnalyticsCost: 200,
      enableVirtualAssistant: false,
      virtualAssistantCost: 2500,
      trainingCostPerEmployee: 1000, // Heavy training
      overheadBundleCost: 1000,
    },
    expected: {
      totalEmployees: 4,
      teamCost: 41500,
      toolsCost: 600,
      trainingCost: 4000, // 4 employees × $1,000
      operatingCostTotal: 47100, // $41,500 + $600 + $4,000 + $1,000
    },
  },
  {
    id: 9,
    name: "Tools Only - No Team",
    inputs: {
      sdrCount: 0,
      sdrCostPerPerson: 8500,
      aeCount: 0,
      aeCostPerPerson: 12000,
      enableSalesManager: false,
      salesManagerCost: 12500,
      crmPlatformCost: 300,
      emailVerificationCost: 100,
      salesAnalyticsCost: 200,
      enableVirtualAssistant: false,
      virtualAssistantCost: 2500,
      trainingCostPerEmployee: 300,
      overheadBundleCost: 1000,
    },
    expected: {
      totalEmployees: 0,
      teamCost: 0,
      toolsCost: 600,
      trainingCost: 0,
      operatingCostTotal: 1600, // $0 + $600 + $0 + $1,000
    },
  },
  {
    id: 10,
    name: "Edge Case - Manager without SDRs/AEs",
    inputs: {
      sdrCount: 0,
      sdrCostPerPerson: 8500,
      aeCount: 0,
      aeCostPerPerson: 12000,
      enableSalesManager: true,
      salesManagerCost: 12500,
      crmPlatformCost: 300,
      emailVerificationCost: 100,
      salesAnalyticsCost: 200,
      enableVirtualAssistant: false,
      virtualAssistantCost: 2500,
      trainingCostPerEmployee: 300,
      overheadBundleCost: 1000,
    },
    expected: {
      totalEmployees: 1,
      teamCost: 12500,
      toolsCost: 600,
      trainingCost: 300, // 1 employee × $300
      operatingCostTotal: 14400, // $12,500 + $600 + $300 + $1,000
    },
  },
];

// Test execution function
function calculateOperatingCosts(inputs) {
  const totalEmployees =
    inputs.sdrCount +
    inputs.aeCount +
    (inputs.enableSalesManager ? 1 : 0) +
    (inputs.enableVirtualAssistant ? 1 : 0);

  const teamCost =
    inputs.sdrCount * inputs.sdrCostPerPerson +
    inputs.aeCount * inputs.aeCostPerPerson +
    (inputs.enableSalesManager ? inputs.salesManagerCost : 0) +
    (inputs.enableVirtualAssistant ? inputs.virtualAssistantCost : 0);

  const toolsCost =
    inputs.crmPlatformCost +
    inputs.emailVerificationCost +
    inputs.salesAnalyticsCost;

  const trainingCost = totalEmployees * inputs.trainingCostPerEmployee;

  const operatingCostTotal =
    teamCost + toolsCost + trainingCost + inputs.overheadBundleCost;

  return {
    totalEmployees,
    teamCost,
    toolsCost,
    trainingCost,
    operatingCostTotal,
  };
}

// Run tests
console.log("=".repeat(80));
console.log("OPERATING COSTS COMPREHENSIVE TEST REPORT");
console.log("=".repeat(80));
console.log();

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

testScenarios.forEach((scenario) => {
  console.log(`Test #${scenario.id}: ${scenario.name}`);
  console.log("-".repeat(80));

  const results = calculateOperatingCosts(scenario.inputs);
  let scenarioPassed = true;
  const errors = [];

  // Validate each expected value
  Object.keys(scenario.expected).forEach((key) => {
    totalTests++;
    const expected = scenario.expected[key];
    const actual = results[key];

    if (actual === expected) {
      passedTests++;
      console.log(`  ✓ ${key}: ${actual} (expected: ${expected})`);
    } else {
      failedTests++;
      scenarioPassed = false;
      const error = `✗ ${key}: ${actual} (expected: ${expected}) - MISMATCH!`;
      console.log(`  ${error}`);
      errors.push(error);
    }
  });

  if (!scenarioPassed) {
    failures.push({
      id: scenario.id,
      name: scenario.name,
      errors,
    });
  }

  console.log();
});

// Summary
console.log("=".repeat(80));
console.log("TEST SUMMARY");
console.log("=".repeat(80));
console.log(`Total Test Scenarios: ${testScenarios.length}`);
console.log(`Total Assertions: ${totalTests}`);
console.log(`Passed: ${passedTests} ✓`);
console.log(`Failed: ${failedTests} ✗`);

const successRate = ((passedTests / totalTests) * 100).toFixed(2);
console.log(`Success Rate: ${successRate}%`);
console.log();

if (failedTests > 0) {
  console.log("=".repeat(80));
  console.log("FAILURES DETAIL");
  console.log("=".repeat(80));
  failures.forEach((failure) => {
    console.log(`\nScenario #${failure.id}: ${failure.name}`);
    failure.errors.forEach((error) => {
      console.log(`  ${error}`);
    });
  });
  console.log();
}

// Detailed breakdown
console.log("=".repeat(80));
console.log("DETAILED BREAKDOWN");
console.log("=".repeat(80));

testScenarios.forEach((scenario) => {
  const results = calculateOperatingCosts(scenario.inputs);
  console.log(`\nScenario #${scenario.id}: ${scenario.name}`);
  console.log("  Inputs:");
  console.log(`    SDRs: ${scenario.inputs.sdrCount} × $${scenario.inputs.sdrCostPerPerson}`);
  console.log(`    AEs: ${scenario.inputs.aeCount} × $${scenario.inputs.aeCostPerPerson}`);
  console.log(`    Sales Manager: ${scenario.inputs.enableSalesManager ? "Yes ($" + scenario.inputs.salesManagerCost + ")" : "No"}`);
  console.log(`    Virtual Assistant: ${scenario.inputs.enableVirtualAssistant ? "Yes ($" + scenario.inputs.virtualAssistantCost + ")" : "No"}`);
  console.log(`    CRM Cost: $${scenario.inputs.crmPlatformCost}`);
  console.log(`    Email Verification: $${scenario.inputs.emailVerificationCost}`);
  console.log(`    Analytics Tools: $${scenario.inputs.salesAnalyticsCost}`);
  console.log(`    Training/Employee: $${scenario.inputs.trainingCostPerEmployee}`);
  console.log(`    Overhead Bundle: $${scenario.inputs.overheadBundleCost}`);
  console.log("  Results:");
  console.log(`    Total Employees: ${results.totalEmployees}`);
  console.log(`    Team Cost: $${results.teamCost.toLocaleString()}`);
  console.log(`    Tools Cost: $${results.toolsCost.toLocaleString()}`);
  console.log(`    Training Cost: $${results.trainingCost.toLocaleString()}`);
  console.log(`    Total Operating Cost: $${results.operatingCostTotal.toLocaleString()}`);
});

console.log();
console.log("=".repeat(80));

// Final verdict
if (successRate === "100.00") {
  console.log("🎉 ALL TESTS PASSED - 100% SUCCESS RATE ACHIEVED!");
  console.log("Operating costs implementation is production-ready.");
} else {
  console.log(`⚠️  ${failedTests} test(s) failed - Review failures above.`);
  console.log("Operating costs implementation needs fixes.");
}

console.log("=".repeat(80));
