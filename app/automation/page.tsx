"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageSelector } from "@/components/language/LanguageSelector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  TrendingUp,
  Cog,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Users,
  Zap,
  BarChart3,
  Mail,
  GraduationCap,
  Save,
  CheckCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { saveScenario, generateScenarioId, getDefaultScenarioName } from "@/lib/scenario-utils"

export default function AutomationROICalculator() {
  const { t } = useLanguage()
  const router = useRouter()
  const [scenarioSaved, setScenarioSaved] = useState(false)

  // Input States
  const [companySize, setCompanySize] = useState("medium")
  const [numEmployees, setNumEmployees] = useState(10)
  const [avgHourlyCost, setAvgHourlyCost] = useState(43.78)
  const [hoursPerWeek, setHoursPerWeek] = useState(6)
  const [automationPercent, setAutomationPercent] = useState(75)
  const [numWorkflows, setNumWorkflows] = useState(5)
  const [workflowComplexity, setWorkflowComplexity] = useState("moderate")
  const [monthlyExecutions, setMonthlyExecutions] = useState(10000)
  const [platform, setPlatform] = useState("n8n-cloud")
  const [currentErrorRate, setCurrentErrorRate] = useState(1.6)
  const [avgErrorCost, setAvgErrorCost] = useState(100)
  const [monthlyTransactions, setMonthlyTransactions] = useState(10000)
  const [implementationApproach, setImplementationApproach] = useState("consultant")
  const [currency, setCurrency] = useState("USD")

  // Calculation Results
  const [results, setResults] = useState({
    // Labor Savings
    annualLaborSavings: 0,
    totalHoursSaved: 0,
    fteEquivalent: 0,

    // Error Reduction
    errorSavings: 0,
    errorReduction: 0,

    // Costs
    platformCost: 0,
    implementationCost: 0,
    maintenanceCost: 0,
    totalFirstYearCost: 0,
    totalYearTwoCost: 0,
    totalYearThreeCost: 0,

    // ROI Metrics
    firstYearROI: 0,
    threeYearROI: 0,
    paybackMonths: 0,
    totalThreeYearValue: 0,

    // Productivity
    productivityGainPercent: 25,
    productivityValue: 0,
  })

  const CURRENCIES = {
    USD: { symbol: "$", name: "US Dollar", rate: 1.0 },
    EUR: { symbol: "€", name: "Euro", rate: 0.92 },
    GBP: { symbol: "£", name: "British Pound", rate: 0.79 },
    AUD: { symbol: "A$", name: "Australian Dollar", rate: 1.53 },
    CAD: { symbol: "C$", name: "Canadian Dollar", rate: 1.36 },
    INR: { symbol: "₹", name: "Indian Rupee", rate: 83.12 },
  } as const

  const formatCurrency = (value: number) => {
    const rate = CURRENCIES[currency as keyof typeof CURRENCIES]?.rate || 1.0
    const symbol = CURRENCIES[currency as keyof typeof CURRENCIES]?.symbol || "$"
    const convertedValue = value * rate
    return `${symbol}${convertedValue.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`
  }

  useEffect(() => {
    calculateROI()
  }, [
    numEmployees,
    avgHourlyCost,
    hoursPerWeek,
    automationPercent,
    numWorkflows,
    workflowComplexity,
    monthlyExecutions,
    platform,
    currentErrorRate,
    avgErrorCost,
    monthlyTransactions,
    implementationApproach,
  ])

  const handleSaveScenario = () => {
    const totalAnnualBenefits = results.annualLaborSavings + results.errorSavings + results.productivityValue

    const scenario = {
      id: generateScenarioId(),
      name: getDefaultScenarioName('automation'),
      calculatorType: 'automation' as const,
      inputs: {
        companySize,
        numEmployees,
        avgHourlyCost,
        hoursPerWeek,
        automationPercent,
        numWorkflows,
        platform,
        implementationApproach
      },
      results: {
        roi: results.firstYearROI,
        totalCost: results.totalFirstYearCost,
        paybackMonths: Math.ceil(results.paybackMonths),
        totalReturn: totalAnnualBenefits,
        risk: results.firstYearROI > 200 ? 'low' as const : results.firstYearROI > 100 ? 'medium' as const : 'high' as const
      },
      createdAt: new Date().toISOString()
    }

    const success = saveScenario(scenario)
    if (success) {
      setScenarioSaved(true)
      setTimeout(() => {
        router.push('/planner')
      }, 1500)
    }
  }

  const calculateROI = () => {
    // 1. Labor Cost Savings
    const hoursPerEmployee = hoursPerWeek * 52 // Annual hours
    const totalHours = hoursPerEmployee * numEmployees * (automationPercent / 100)
    const laborSavings = totalHours * avgHourlyCost
    const fte = totalHours / 2080

    // 2. Error Reduction
    const automatedErrorRate = 0.01 // 99% accuracy
    const errorReduction = ((currentErrorRate - automatedErrorRate) / currentErrorRate) * 100
    const annualTransactions = monthlyTransactions * 12
    const manualErrors = annualTransactions * (currentErrorRate / 100)
    const automatedErrors = annualTransactions * (automatedErrorRate / 100)
    const errorsSaved = manualErrors - automatedErrors
    const errorSavings = errorsSaved * avgErrorCost

    // 3. Productivity Gain Value
    const avgAnnualSalary = avgHourlyCost * 2080
    const productivityValue = (25 / 100) * numEmployees * avgAnnualSalary * (automationPercent / 100)

    // 4. Platform Costs
    let platformCost = 0
    if (platform === "n8n-cloud") {
      if (monthlyExecutions <= 2500) platformCost = 20 * 12
      else if (monthlyExecutions <= 10000) platformCost = 50 * 12
      else if (monthlyExecutions <= 50000) platformCost = 120 * 12
      else platformCost = 300 * 12 // Business tier estimate
    } else if (platform === "n8n-self") {
      platformCost = 400 * 12 // $400/month infrastructure
    } else if (platform === "make") {
      const stepsPerWorkflow = workflowComplexity === "simple" ? 3 : workflowComplexity === "moderate" ? 8 : 15
      const monthlyOperations = monthlyExecutions * stepsPerWorkflow
      if (monthlyOperations <= 10000) platformCost = 9 * 12
      else if (monthlyOperations <= 50000) platformCost = 50 * 12
      else platformCost = (monthlyOperations / 1000) * 1.06 * 12
    }

    // 5. Implementation Costs
    let implementationCost = 0
    if (implementationApproach === "diy") {
      implementationCost = 15000 // Basic internal setup
    } else if (implementationApproach === "consultant") {
      implementationCost = 50000 // Mid-range with consultant
    } else {
      implementationCost = 100000 // Fully outsourced
    }

    // 6. Maintenance (15% of implementation, starting Year 2)
    const maintenanceCost = implementationCost * 0.15

    // 7. Total Costs by Year
    const year1Cost = implementationCost + platformCost
    const year2Cost = platformCost + maintenanceCost
    const year3Cost = platformCost + maintenanceCost

    // 8. Total Benefits
    const totalAnnualBenefits = laborSavings + errorSavings + productivityValue

    // 9. ROI Calculations
    const year1ROI = year1Cost > 0 ? ((totalAnnualBenefits - year1Cost) / year1Cost) * 100 : 0

    const threeYearBenefits = totalAnnualBenefits * 3
    const threeYearCosts = year1Cost + year2Cost + year3Cost
    const threeYearROI = threeYearCosts > 0 ? ((threeYearBenefits - threeYearCosts) / threeYearCosts) * 100 : 0
    const threeYearValue = threeYearBenefits - threeYearCosts

    // 10. Payback Period
    const monthlyBenefit = totalAnnualBenefits / 12
    const monthlyPlatformCost = platformCost / 12
    const netMonthlyBenefit = monthlyBenefit - monthlyPlatformCost
    const paybackMonths = netMonthlyBenefit > 0 ? implementationCost / netMonthlyBenefit : 999

    setResults({
      annualLaborSavings: laborSavings,
      totalHoursSaved: totalHours,
      fteEquivalent: fte,
      errorSavings: errorSavings,
      errorReduction: errorReduction,
      platformCost: platformCost,
      implementationCost: implementationCost,
      maintenanceCost: maintenanceCost,
      totalFirstYearCost: year1Cost,
      totalYearTwoCost: year2Cost,
      totalYearThreeCost: year3Cost,
      firstYearROI: year1ROI,
      threeYearROI: threeYearROI,
      paybackMonths: paybackMonths,
      totalThreeYearValue: threeYearValue,
      productivityGainPercent: 25,
      productivityValue: productivityValue,
    })
  }

  const getPlatformName = () => {
    if (platform === "n8n-cloud") return "n8n Cloud"
    if (platform === "n8n-self") return "n8n Self-Hosted"
    if (platform === "make") return "Make.com"
    return platform
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hub
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Cog className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <span className="text-xl font-bold">Process Automation ROI</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={scenarioSaved ? "default" : "outline"}
              size="sm"
              onClick={handleSaveScenario}
              disabled={scenarioSaved}
            >
              {scenarioSaved ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Scenario
                </>
              )}
            </Button>
            <LanguageSelector />
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CURRENCIES).map(([code, curr]) => (
                  <SelectItem key={code} value={code}>
                    {curr.symbol} {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-purple-200 dark:border-purple-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Year 1 ROI</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {results.firstYearROI.toFixed(0)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">3-Year Value</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(results.totalThreeYearValue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Payback Period</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {results.paybackMonths.toFixed(1)}mo
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 dark:border-orange-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hours Saved/Year</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {results.totalHoursSaved.toFixed(0)}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Company Information
                </CardTitle>
                <CardDescription>Basic information about your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select value={companySize} onValueChange={setCompanySize}>
                    <SelectTrigger id="companySize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (1-50 employees)</SelectItem>
                      <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                      <SelectItem value="large">Large (201-1000 employees)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="numEmployees">Number of Employees Affected</Label>
                  <Input
                    id="numEmployees"
                    type="number"
                    value={numEmployees}
                    onChange={(e) => setNumEmployees(Number(e.target.value))}
                    min={1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    How many employees will benefit from automation?
                  </p>
                </div>

                <div>
                  <Label htmlFor="avgHourlyCost">Average Employee Hourly Cost</Label>
                  <Input
                    id="avgHourlyCost"
                    type="number"
                    value={avgHourlyCost}
                    onChange={(e) => setAvgHourlyCost(Number(e.target.value))}
                    min={0}
                    step={0.01}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include salary + benefits (US avg: $43.78/hr)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Current Process Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Current Process Metrics
                </CardTitle>
                <CardDescription>How work is done today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hoursPerWeek">Hours Spent on Manual Tasks (per employee/week)</Label>
                  <Input
                    id="hoursPerWeek"
                    type="number"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    min={0}
                    max={40}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Industry average: 5-10 hours/week
                  </p>
                </div>

                <div>
                  <Label htmlFor="automationPercent">Automation Success Rate (%)</Label>
                  <Input
                    id="automationPercent"
                    type="number"
                    value={automationPercent}
                    onChange={(e) => setAutomationPercent(Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Realistic estimate: 60-80% of tasks automated
                  </p>
                </div>

                <div>
                  <Label htmlFor="currentErrorRate">Current Error Rate (%)</Label>
                  <Input
                    id="currentErrorRate"
                    type="number"
                    value={currentErrorRate}
                    onChange={(e) => setCurrentErrorRate(Number(e.target.value))}
                    min={0}
                    max={100}
                    step={0.1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Manual data entry average: 1.6%
                  </p>
                </div>

                <div>
                  <Label htmlFor="avgErrorCost">Average Cost Per Error</Label>
                  <Input
                    id="avgErrorCost"
                    type="number"
                    value={avgErrorCost}
                    onChange={(e) => setAvgErrorCost(Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include rework time + customer service
                  </p>
                </div>

                <div>
                  <Label htmlFor="monthlyTransactions">Monthly Transactions</Label>
                  <Input
                    id="monthlyTransactions"
                    type="number"
                    value={monthlyTransactions}
                    onChange={(e) => setMonthlyTransactions(Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Invoices, data entries, reports, etc.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Automation Scope */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cog className="h-5 w-5" />
                  Automation Configuration
                </CardTitle>
                <CardDescription>Your automation setup</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="numWorkflows">Number of Workflows</Label>
                  <Input
                    id="numWorkflows"
                    type="number"
                    value={numWorkflows}
                    onChange={(e) => setNumWorkflows(Number(e.target.value))}
                    min={1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Start with 3-5 core workflows
                  </p>
                </div>

                <div>
                  <Label htmlFor="workflowComplexity">Workflow Complexity</Label>
                  <Select value={workflowComplexity} onValueChange={setWorkflowComplexity}>
                    <SelectTrigger id="workflowComplexity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple (2-5 steps)</SelectItem>
                      <SelectItem value="moderate">Moderate (6-15 steps)</SelectItem>
                      <SelectItem value="complex">Complex (15+ steps)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="monthlyExecutions">Monthly Workflow Executions</Label>
                  <Input
                    id="monthlyExecutions"
                    type="number"
                    value={monthlyExecutions}
                    onChange={(e) => setMonthlyExecutions(Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    How many times workflows run per month
                  </p>
                </div>

                <div>
                  <Label htmlFor="platform">Platform Choice</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger id="platform">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="n8n-cloud">n8n Cloud</SelectItem>
                      <SelectItem value="n8n-self">n8n Self-Hosted</SelectItem>
                      <SelectItem value="make">Make.com</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="implementationApproach">Implementation Approach</Label>
                  <Select value={implementationApproach} onValueChange={setImplementationApproach}>
                    <SelectTrigger id="implementationApproach">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diy">DIY (In-house team)</SelectItem>
                      <SelectItem value="consultant">Consultant-assisted</SelectItem>
                      <SelectItem value="outsourced">Fully Outsourced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Financial Summary */}
            <Card className="border-2 border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20">
              <CardHeader>
                <CardTitle className="text-lg">Financial Summary</CardTitle>
                <CardDescription>First year impact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-900 border">
                  <span className="text-sm font-medium">Annual Labor Savings</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(results.annualLaborSavings)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-900 border">
                  <span className="text-sm font-medium">Error Reduction Savings</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(results.errorSavings)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-900 border">
                  <span className="text-sm font-medium">Productivity Gains</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(results.productivityValue)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-900 border">
                  <span className="text-sm font-medium">Total Annual Benefits</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(results.annualLaborSavings + results.errorSavings + results.productivityValue)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost Breakdown</CardTitle>
                <CardDescription>Investment required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border">
                  <span className="text-sm font-medium">Implementation Cost</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    -{formatCurrency(results.implementationCost)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border">
                  <span className="text-sm font-medium">Annual Platform Cost ({getPlatformName()})</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    -{formatCurrency(results.platformCost)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border">
                  <span className="text-sm font-medium">Year 1 Total Cost</span>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">
                    -{formatCurrency(results.totalFirstYearCost)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* ROI Metrics */}
            <Card className="border-2 border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-lg">Return on Investment</CardTitle>
                <CardDescription>Your automation ROI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-300 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300 mb-1">First Year ROI</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {results.firstYearROI.toFixed(0)}%
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {results.firstYearROI > 150 ? "Excellent! Above industry average" : "Good return on investment"}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-300 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">3-Year ROI</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {results.threeYearROI.toFixed(0)}%
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Total 3-year value: {formatCurrency(results.totalThreeYearValue)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted border">
                    <p className="text-xs text-muted-foreground mb-1">Payback Period</p>
                    <p className="text-xl font-bold">
                      {results.paybackMonths.toFixed(1)} months
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted border">
                    <p className="text-xs text-muted-foreground mb-1">FTE Saved</p>
                    <p className="text-xl font-bold">
                      {results.fteEquivalent.toFixed(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.errorReduction > 80 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Excellent Error Reduction
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        {results.errorReduction.toFixed(1)}% error reduction saves {formatCurrency(results.errorSavings)} annually
                      </p>
                    </div>
                  </div>
                )}

                {results.paybackMonths < 12 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Fast Payback Period
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Break even in {results.paybackMonths.toFixed(1)} months - faster than industry average
                      </p>
                    </div>
                  </div>
                )}

                {results.totalHoursSaved > 500 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                        Significant Time Savings
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        {results.totalHoursSaved.toFixed(0)} hours saved = {results.fteEquivalent.toFixed(1)} FTE equivalents
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted border">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Industry Benchmark</p>
                    <p className="text-xs text-muted-foreground">
                      Average automation ROI: 150-300% in first year. Your projected ROI: {results.firstYearROI.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3-Year Projection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3-Year Financial Projection</CardTitle>
                <CardDescription>Long-term value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Year 1</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatCurrency((results.annualLaborSavings + results.errorSavings + results.productivityValue) - results.totalFirstYearCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Benefits: {formatCurrency(results.annualLaborSavings + results.errorSavings + results.productivityValue)}</span>
                      <span>Costs: {formatCurrency(results.totalFirstYearCost)}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Year 2</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatCurrency((results.annualLaborSavings + results.errorSavings + results.productivityValue) - results.totalYearTwoCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Benefits: {formatCurrency(results.annualLaborSavings + results.errorSavings + results.productivityValue)}</span>
                      <span>Costs: {formatCurrency(results.totalYearTwoCost)}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Year 3</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatCurrency((results.annualLaborSavings + results.errorSavings + results.productivityValue) - results.totalYearThreeCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Benefits: {formatCurrency(results.annualLaborSavings + results.errorSavings + results.productivityValue)}</span>
                      <span>Costs: {formatCurrency(results.totalYearThreeCost)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-300 dark:border-green-800">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-green-900 dark:text-green-100">Total 3-Year Value</span>
                      <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {formatCurrency(results.totalThreeYearValue)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Calculators */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Explore Other ROI Calculators</CardTitle>
            <CardDescription>Complete your business case with our other calculators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/roi">
                <div className="p-4 rounded-lg border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold">Cold Email ROI Calculator</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Calculate ROI from cold email outreach campaigns
                  </p>
                </div>
              </Link>

              <Link href="/training">
                <div className="p-4 rounded-lg border-2 border-transparent hover:border-green-300 dark:hover:border-green-700 transition-all cursor-pointer bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold">Employee Training ROI</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Measure the impact of employee training programs
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Cog className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold">Process Automation ROI Calculator</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Calculator Hub
              </Link>
              <Link href="/roi" className="hover:text-foreground transition-colors">
                Cold Email ROI
              </Link>
              <Link href="/training" className="hover:text-foreground transition-colors">
                Training ROI
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on industry research from McKinsey, Forrester, and 10,000+ implementations
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
