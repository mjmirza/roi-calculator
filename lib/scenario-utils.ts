// Utility functions for saving scenarios to the planner

export interface ScenarioData {
  id: string
  name: string
  calculatorType: 'roi' | 'automation' | 'training' | 'cac-payback' | 'sales-hiring'
  inputs: Record<string, any>
  results: {
    roi: number // ROI percentage
    totalCost: number // Total investment
    paybackMonths: number // Months to break even
    totalReturn: number // Total return amount
    risk: 'low' | 'medium' | 'high'
  }
  createdAt: string
}

export function saveScenario(scenario: ScenarioData): boolean {
  try {
    // Get existing scenarios from localStorage
    const stored = localStorage.getItem('roi-scenarios')
    const scenarios: ScenarioData[] = stored ? JSON.parse(stored) : []

    // Add new scenario
    scenarios.push(scenario)

    // Save back to localStorage
    localStorage.setItem('roi-scenarios', JSON.stringify(scenarios))

    return true
  } catch (error) {
    console.error('Failed to save scenario:', error)
    return false
  }
}

export function generateScenarioId(): string {
  return `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function getDefaultScenarioName(calculatorType: string): string {
  const names = {
    'roi': 'Cold Email Campaign',
    'automation': 'Automation Project',
    'training': 'Training Program',
    'cac-payback': 'CAC Analysis',
    'sales-hiring': 'Sales Hire'
  }
  return names[calculatorType as keyof typeof names] || 'Scenario'
}
