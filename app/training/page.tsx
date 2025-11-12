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
  GraduationCap,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Clock,
  Target,
  Award,
  Briefcase,
  Mail,
  Cog,
  Save,
  CheckCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { saveScenario, generateScenarioId, getDefaultScenarioName } from "@/lib/scenario-utils"

export default function TrainingROICalculator() {
  const { t } = useLanguage()
  const router = useRouter()
  const [scenarioSaved, setScenarioSaved] = useState(false)

  // Input States
  const [numEmployees, setNumEmployees] = useState(50)
  const [avgAnnualSalary, setAvgAnnualSalary] = useState(62400)
  const [currentTurnoverRate, setCurrentTurnoverRate] = useState(15)
  const [trainingCostPerEmployee, setTrainingCostPerEmployee] = useState(774)
  const [trainingHoursPerEmployee, setTrainingHoursPerEmployee] = useState(40)
  const [expectedProductivityIncrease, setExpectedProductivityIncrease] = useState(20)
  const [expectedTurnoverReduction, setExpectedTurnoverReduction] = useState(35)
  const [expectedErrorReduction, setExpectedErrorReduction] = useState(40)
  const [currentErrorCost, setCurrentErrorCost] = useState(50000)
  const [timeToCompetencyWeeks, setTimeToCompetencyWeeks] = useState(24)
  const [newHiresPerYear, setNewHiresPerYear] = useState(8)
  const [currency, setCurrency] = useState("USD")

  // Calculation Results
  const [results, setResults] = useState({
    // Current costs (without training)
    annualTurnoverCost: 0,
    productivityLoss: 0,
    errorCosts: 0,
    totalCurrentCost: 0,

    // Training costs
    totalTrainingCost: 0,
    employeeTimeCost: 0,
    totalTrainingInvestment: 0,

    // Benefits from training
    turnoverSavings: 0,
    productivityGains: 0,
    errorReductionSavings: 0,
    competencySavings: 0,
    totalAnnualBenefits: 0,

    // ROI Metrics
    netBenefit: 0,
    roi: 0,
    paybackMonths: 0,
    threeYearValue: 0,
    threeYearROI: 0,
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
    avgAnnualSalary,
    currentTurnoverRate,
    trainingCostPerEmployee,
    trainingHoursPerEmployee,
    expectedProductivityIncrease,
    expectedTurnoverReduction,
    expectedErrorReduction,
    currentErrorCost,
    timeToCompetencyWeeks,
    newHiresPerYear,
  ])

  const handleSaveScenario = () => {
    const scenario = {
      id: generateScenarioId(),
      name: getDefaultScenarioName('training'),
      calculatorType: 'training' as const,
      inputs: {
        numEmployees,
        avgAnnualSalary,
        currentTurnoverRate,
        trainingCostPerEmployee,
        expectedProductivityIncrease,
        expectedTurnoverReduction
      },
      results: {
        roi: results.threeYearROI,
        totalCost: results.totalTrainingInvestment,
        paybackMonths: Math.ceil(results.paybackMonths),
        totalReturn: results.threeYearValue,
        risk: results.threeYearROI > 150 ? 'low' as const : results.threeYearROI > 80 ? 'medium' as const : 'high' as const
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
    // 1. Current Costs (Cost of NOT Training)

    // Turnover cost: 33-400% of salary, we use conservative 1.5x (150%)
    const turnoverMultiplier = 1.5
    const employeesTurning = Math.round(numEmployees * (currentTurnoverRate / 100))
    const annualTurnoverCost = employeesTurning * avgAnnualSalary * turnoverMultiplier

    // Productivity loss: Untrained employees operate at 60% capacity = 40% loss
    const untrainedProductivityLoss = 0.40 // 40% less productive
    const productivityLossCost = numEmployees * avgAnnualSalary * untrainedProductivityLoss

    // Error costs (current state)
    const errorCosts = currentErrorCost

    const totalCurrentCost = annualTurnoverCost + productivityLossCost + errorCosts

    // 2. Training Investment
    const directTrainingCost = numEmployees * trainingCostPerEmployee
    const hourlyRate = avgAnnualSalary / 2080
    const employeeTimeCost = numEmployees * trainingHoursPerEmployee * hourlyRate
    const totalTrainingInvestment = directTrainingCost + employeeTimeCost

    // 3. Benefits from Training

    // Turnover reduction savings
    const newTurnoverRate = currentTurnoverRate * (1 - expectedTurnoverReduction / 100)
    const newEmployeesTurning = Math.round(numEmployees * (newTurnoverRate / 100))
    const turnoverReduction = employeesTurning - newEmployeesTurning
    const turnoverSavings = turnoverReduction * avgAnnualSalary * turnoverMultiplier

    // Productivity gains (15-25% improvement typical)
    const productivityGainPercent = expectedProductivityIncrease / 100
    const productivityGains = numEmployees * avgAnnualSalary * productivityGainPercent

    // Error reduction savings
    const errorReductionPercent = expectedErrorReduction / 100
    const errorReductionSavings = currentErrorCost * errorReductionPercent

    // Time to competency improvement (50% faster with good onboarding)
    const competencyImprovementWeeks = timeToCompetencyWeeks * 0.5 // 50% improvement
    const weeksSaved = timeToCompetencyWeeks - competencyImprovementWeeks
    const competencySavingsPerHire = (weeksSaved / 52) * avgAnnualSalary * 0.4 // 40% productivity gap
    const competencySavings = competencySavingsPerHire * newHiresPerYear

    const totalAnnualBenefits = turnoverSavings + productivityGains + errorReductionSavings + competencySavings

    // 4. ROI Calculations
    const netBenefit = totalAnnualBenefits - totalTrainingInvestment
    const roi = totalTrainingInvestment > 0 ? (netBenefit / totalTrainingInvestment) * 100 : 0
    const monthlyBenefit = totalAnnualBenefits / 12
    const paybackMonths = monthlyBenefit > 0 ? totalTrainingInvestment / monthlyBenefit : 999

    // 3-year projection (training cost only in Year 1, benefits compound slightly)
    const year1Net = totalAnnualBenefits - totalTrainingInvestment
    const year2Net = totalAnnualBenefits * 1.05 // 5% improvement
    const year3Net = totalAnnualBenefits * 1.1 // 10% improvement
    const threeYearValue = year1Net + year2Net + year3Net
    const threeYearROI = totalTrainingInvestment > 0 ? (threeYearValue / totalTrainingInvestment) * 100 : 0

    setResults({
      annualTurnoverCost,
      productivityLoss: productivityLossCost,
      errorCosts,
      totalCurrentCost,
      totalTrainingCost: directTrainingCost,
      employeeTimeCost,
      totalTrainingInvestment,
      turnoverSavings,
      productivityGains,
      errorReductionSavings,
      competencySavings,
      totalAnnualBenefits,
      netBenefit,
      roi,
      paybackMonths,
      threeYearValue,
      threeYearROI,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
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
              <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
              <span className="text-xl font-bold">Employee Training ROI</span>
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
          <Card className="border-2 border-green-200 dark:border-green-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Training ROI</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {results.roi.toFixed(0)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Benefit</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(results.netBenefit)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Payback Period</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {results.paybackMonths.toFixed(1)}mo
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 dark:border-orange-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">3-Year Value</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(results.threeYearValue)}
                  </p>
                </div>
                <Award className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Warning Banner */}
        <Card className="mb-8 border-2 border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">Cost of Not Training</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  Without training, your organization is losing {formatCurrency(results.totalCurrentCost)} annually from:
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    <span>Turnover: {formatCurrency(results.annualTurnoverCost)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>Low Productivity: {formatCurrency(results.productivityLoss)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Errors: {formatCurrency(results.errorCosts)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Company Information
                </CardTitle>
                <CardDescription>Current workforce details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="numEmployees">Number of Employees</Label>
                  <Input
                    id="numEmployees"
                    type="number"
                    value={numEmployees}
                    onChange={(e) => setNumEmployees(Number(e.target.value))}
                    min={1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Total employees who would receive training
                  </p>
                </div>

                <div>
                  <Label htmlFor="avgAnnualSalary">Average Annual Salary</Label>
                  <Input
                    id="avgAnnualSalary"
                    type="number"
                    value={avgAnnualSalary}
                    onChange={(e) => setAvgAnnualSalary(Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include base salary + benefits (US avg: $62,400)
                  </p>
                </div>

                <div>
                  <Label htmlFor="currentTurnoverRate">Current Annual Turnover Rate (%)</Label>
                  <Input
                    id="currentTurnoverRate"
                    type="number"
                    value={currentTurnoverRate}
                    onChange={(e) => setCurrentTurnoverRate(Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    2024 average: 15% (varies by industry)
                  </p>
                </div>

                <div>
                  <Label htmlFor="newHiresPerYear">New Hires Per Year</Label>
                  <Input
                    id="newHiresPerYear"
                    type="number"
                    value={newHiresPerYear}
                    onChange={(e) => setNewHiresPerYear(Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Used to calculate onboarding savings
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Current State Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Current Performance Metrics
                </CardTitle>
                <CardDescription>How things are today without training</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentErrorCost">Annual Cost of Employee Errors</Label>
                  <Input
                    id="currentErrorCost"
                    type="number"
                    value={currentErrorCost}
                    onChange={(e) => setCurrentErrorCost(Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Rework, customer service, warranty claims, etc.
                  </p>
                </div>

                <div>
                  <Label htmlFor="timeToCompetencyWeeks">Time to Full Competency (weeks)</Label>
                  <Input
                    id="timeToCompetencyWeeks"
                    type="number"
                    value={timeToCompetencyWeeks}
                    onChange={(e) => setTimeToCompetencyWeeks(Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    How long until new hires are fully productive (avg: 24 weeks)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Training Program Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Training Program Details
                </CardTitle>
                <CardDescription>Your planned training investment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="trainingCostPerEmployee">Training Cost Per Employee</Label>
                  <Input
                    id="trainingCostPerEmployee"
                    type="number"
                    value={trainingCostPerEmployee}
                    onChange={(e) => setTrainingCostPerEmployee(Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Direct costs: courses, materials, facilitators (2024 avg: $774)
                  </p>
                </div>

                <div>
                  <Label htmlFor="trainingHoursPerEmployee">Training Hours Per Employee (annual)</Label>
                  <Input
                    id="trainingHoursPerEmployee"
                    type="number"
                    value={trainingHoursPerEmployee}
                    onChange={(e) => setTrainingHoursPerEmployee(Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Industry standard: 40-60 hours/year (2024 avg: 47)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Expected Improvements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Expected Improvements
                </CardTitle>
                <CardDescription>Conservative estimates from training</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="expectedProductivityIncrease">Productivity Increase (%)</Label>
                  <Input
                    id="expectedProductivityIncrease"
                    type="number"
                    value={expectedProductivityIncrease}
                    onChange={(e) => setExpectedProductivityIncrease(Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Industry benchmark: 15-25% improvement
                  </p>
                </div>

                <div>
                  <Label htmlFor="expectedTurnoverReduction">Turnover Reduction (%)</Label>
                  <Input
                    id="expectedTurnoverReduction"
                    type="number"
                    value={expectedTurnoverReduction}
                    onChange={(e) => setExpectedTurnoverReduction(Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Industry benchmark: 30-50% improvement
                  </p>
                </div>

                <div>
                  <Label htmlFor="expectedErrorReduction">Error Reduction (%)</Label>
                  <Input
                    id="expectedErrorReduction"
                    type="number"
                    value={expectedErrorReduction}
                    onChange={(e) => setExpectedErrorReduction(Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Typical improvement: 40-60% error reduction
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Training Investment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Training Investment</CardTitle>
                <CardDescription>Total first-year cost</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border">
                  <span className="text-sm font-medium">Direct Training Costs</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    -{formatCurrency(results.totalTrainingCost)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border">
                  <span className="text-sm font-medium">Employee Time Cost</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    -{formatCurrency(results.employeeTimeCost)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border">
                  <span className="text-sm font-semibold">Total Training Investment</span>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">
                    -{formatCurrency(results.totalTrainingInvestment)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Annual Benefits */}
            <Card className="border-2 border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-lg">Annual Benefits from Training</CardTitle>
                <CardDescription>First year returns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-900 border">
                  <span className="text-sm font-medium">Turnover Reduction Savings</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    +{formatCurrency(results.turnoverSavings)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-900 border">
                  <span className="text-sm font-medium">Productivity Gains</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    +{formatCurrency(results.productivityGains)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-900 border">
                  <span className="text-sm font-medium">Error Reduction Savings</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    +{formatCurrency(results.errorReductionSavings)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-900 border">
                  <span className="text-sm font-medium">Faster Time to Competency</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    +{formatCurrency(results.competencySavings)}
                  </span>
                </div>

                <Separator />

                <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-300 dark:border-green-800">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-green-900 dark:text-green-100">
                      Total Annual Benefits
                    </span>
                    <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {formatCurrency(results.totalAnnualBenefits)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ROI Analysis */}
            <Card className="border-2 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="text-lg">Return on Investment</CardTitle>
                <CardDescription>Your training ROI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-300 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">First Year ROI</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {results.roi.toFixed(0)}%
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {results.roi > 100 ? "Excellent! ROI above 100% is considered excellent" : "Positive return on investment"}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-300 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300 mb-1">Net Benefit (Year 1)</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {formatCurrency(results.netBenefit)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    After training investment
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
                    <p className="text-xs text-muted-foreground mb-1">3-Year ROI</p>
                    <p className="text-xl font-bold">
                      {results.threeYearROI.toFixed(0)}%
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
                {results.roi > 100 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Excellent ROI
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Your {results.roi.toFixed(0)}% ROI is above the 100% threshold for excellent training programs
                      </p>
                    </div>
                  </div>
                )}

                {results.turnoverSavings > results.totalTrainingInvestment && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Turnover Savings Alone Justify Training
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Turnover reduction savings ({formatCurrency(results.turnoverSavings)}) exceed total training cost
                      </p>
                    </div>
                  </div>
                )}

                {results.productivityGains > 0 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                        Significant Productivity Gains
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        {expectedProductivityIncrease}% productivity improvement worth {formatCurrency(results.productivityGains)} annually
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted border">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">94% of Employees Agree</p>
                    <p className="text-xs text-muted-foreground">
                      94% of employees would stay longer if their company invested in training and development
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3-Year Projection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3-Year Financial Projection</CardTitle>
                <CardDescription>Long-term value of training investment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Year 1</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(results.netBenefit)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Benefits: {formatCurrency(results.totalAnnualBenefits)}</span>
                      <span>Investment: {formatCurrency(results.totalTrainingInvestment)}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Year 2</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(results.totalAnnualBenefits * 1.05)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Benefits continue with 5% improvement (no new training cost)
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Year 3</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(results.totalAnnualBenefits * 1.1)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Benefits grow to 10% above baseline
                    </p>
                  </div>

                  <Separator />

                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-300 dark:border-green-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-green-900 dark:text-green-100">
                        Total 3-Year Value
                      </span>
                      <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {formatCurrency(results.threeYearValue)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-green-600 dark:text-green-400">
                      <span>3-Year ROI: {results.threeYearROI.toFixed(0)}%</span>
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

              <Link href="/automation">
                <div className="p-4 rounded-lg border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Cog className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold">Process Automation ROI</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Calculate savings from n8n/Make.com automation
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
              <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold">Employee Training ROI Calculator</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Calculator Hub
              </Link>
              <Link href="/roi" className="hover:text-foreground transition-colors">
                Cold Email ROI
              </Link>
              <Link href="/automation" className="hover:text-foreground transition-colors">
                Automation ROI
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on research from ATD, SHRM, and 10,000+ training programs
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
