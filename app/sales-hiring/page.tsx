"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageSelector } from "@/components/language/LanguageSelector"
import { useRouter } from "next/navigation"
import { saveScenario, generateScenarioId, getDefaultScenarioName } from "@/lib/scenario-utils"
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Calculator,
  Mail,
  Cog,
  GraduationCap,
  Target,
  UserPlus,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Save,
  ArrowLeft
} from "lucide-react"

// Currency data with symbols and conversion rates
const currencies = {
  USD: { symbol: "$", rate: 1, name: "US Dollar" },
  EUR: { symbol: "€", rate: 0.92, name: "Euro" },
  GBP: { symbol: "£", rate: 0.79, name: "British Pound" },
  AUD: { symbol: "A$", rate: 1.52, name: "Australian Dollar" },
  CAD: { symbol: "C$", rate: 1.36, name: "Canadian Dollar" },
  INR: { symbol: "₹", rate: 83.12, name: "Indian Rupee" }
}

type CurrencyCode = keyof typeof currencies

// Role configurations with industry benchmarks
const roleConfigs = {
  sdr: {
    name: "SDR (Sales Development Rep)",
    avgSalary: 60000,
    avgOTE: 80000,
    rampMonths: 3,
    avgQuotaAttainment: 85,
    avgMeetingsPerMonth: 20,
    description: "Focuses on outbound prospecting and qualifying leads"
  },
  ae: {
    name: "Account Executive",
    avgSalary: 80000,
    avgOTE: 140000,
    rampMonths: 6,
    avgQuotaAttainment: 75,
    avgDealsPerMonth: 3,
    description: "Closes deals and manages sales cycles"
  },
  am: {
    name: "Account Manager",
    avgSalary: 75000,
    avgOTE: 110000,
    rampMonths: 4,
    avgQuotaAttainment: 80,
    avgAccountsManaged: 50,
    description: "Manages existing accounts and drives expansion"
  }
}

type RoleType = keyof typeof roleConfigs

export default function SalesHiringROICalculator() {
  const { t } = useLanguage()
  const router = useRouter()
  const [scenarioSaved, setScenarioSaved] = useState(false)

  // Configuration State
  const [currency, setCurrency] = useState<CurrencyCode>("USD")
  const [roleType, setRoleType] = useState<RoleType>("sdr")

  // Business Metrics
  const [currentTeamSize, setCurrentTeamSize] = useState(5)
  const [currentMRR, setCurrentMRR] = useState(100000)
  const [avgDealSize, setAvgDealSize] = useState(5000)
  const [salesCycleLength, setSalesCycleLength] = useState(45)
  const [currentCapacity, setCurrentCapacity] = useState(80)

  // New Hire Details
  const [baseSalary, setBaseSalary] = useState(roleConfigs[roleType].avgSalary)
  const [ote, setOTE] = useState(roleConfigs[roleType].avgOTE)
  const [rampTime, setRampTime] = useState(roleConfigs[roleType].rampMonths)
  const [expectedQuotaAttainment, setExpectedQuotaAttainment] = useState(roleConfigs[roleType].avgQuotaAttainment)
  const [monthlyQuota, setMonthlyQuota] = useState(20000)

  // Additional Costs
  const [recruitingCost, setRecruitingCost] = useState(5000)
  const [onboardingCost, setOnboardingCost] = useState(3000)
  const [toolsCostPerMonth, setToolsCostPerMonth] = useState(500)
  const [benefitsPercentage, setBenefitsPercentage] = useState(25)

  // Update role-specific defaults when role changes
  useEffect(() => {
    const config = roleConfigs[roleType]
    setBaseSalary(config.avgSalary)
    setOTE(config.avgOTE)
    setRampTime(config.rampMonths)
    setExpectedQuotaAttainment(config.avgQuotaAttainment)
  }, [roleType])

  // Currency conversion helper
  const convertToCurrency = (amount: number, fromCurrency: CurrencyCode = "USD"): number => {
    const usdAmount = amount / currencies[fromCurrency].rate
    return usdAmount * currencies[currency].rate
  }

  const formatCurrency = (amount: number): string => {
    const converted = convertToCurrency(amount)
    return `${currencies[currency].symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`
  }

  // CALCULATIONS

  // 1. Total Cost of New Hire (First Year)
  const monthlyBaseSalary = baseSalary / 12
  const monthlyBenefitsCost = monthlyBaseSalary * (benefitsPercentage / 100)
  const totalMonthlyCost = monthlyBaseSalary + monthlyBenefitsCost + toolsCostPerMonth
  const totalFirstYearCost = recruitingCost + onboardingCost + (totalMonthlyCost * 12)

  // 2. Ramp-up Revenue Projection
  const calculateRampRevenue = () => {
    const monthlyRevenue = []
    let totalRevenue = 0

    for (let month = 1; month <= 12; month++) {
      let productivityPercent = 0

      if (month <= rampTime) {
        // During ramp: gradual increase using sigmoid curve
        // Month 1: ~25%, Month 2: ~50%, Month 3: ~75%
        productivityPercent = (month / rampTime) * (expectedQuotaAttainment / 100)
      } else {
        // After ramp: full productivity
        productivityPercent = expectedQuotaAttainment / 100
      }

      const monthRevenue = monthlyQuota * productivityPercent
      totalRevenue += monthRevenue

      monthlyRevenue.push({
        month,
        productivity: productivityPercent * 100,
        revenue: monthRevenue,
        cumulativeRevenue: totalRevenue
      })
    }

    return { monthlyRevenue, totalRevenue }
  }

  const { monthlyRevenue, totalRevenue } = calculateRampRevenue()

  // 3. Break-even Analysis
  const calculateBreakEven = () => {
    let cumulativeCost = recruitingCost + onboardingCost
    let cumulativeRevenue = 0

    for (let month = 1; month <= 24; month++) {
      cumulativeCost += totalMonthlyCost

      if (month <= 12) {
        cumulativeRevenue = monthlyRevenue[month - 1].cumulativeRevenue
      } else {
        // After year 1, assume full productivity
        cumulativeRevenue += monthlyQuota * (expectedQuotaAttainment / 100)
      }

      if (cumulativeRevenue >= cumulativeCost) {
        return {
          breakEvenMonth: month,
          cumulativeCost,
          cumulativeRevenue
        }
      }
    }

    return {
      breakEvenMonth: 24,
      cumulativeCost,
      cumulativeRevenue
    }
  }

  const { breakEvenMonth, cumulativeCost, cumulativeRevenue } = calculateBreakEven()

  // 4. Capacity Score (Should you hire?)
  const calculateCapacityScore = () => {
    // Factors: Current capacity, team size efficiency, growth potential
    let score = 0
    let recommendations = []

    // Current capacity (40 points max)
    if (currentCapacity >= 90) {
      score += 40
      recommendations.push("Team is at or over capacity - hire soon")
    } else if (currentCapacity >= 75) {
      score += 25
      recommendations.push("Team capacity is high - consider hiring")
    } else if (currentCapacity >= 60) {
      score += 10
      recommendations.push("Team has some capacity - hiring optional")
    } else {
      score += 0
      recommendations.push("Team has available capacity - hiring not urgent")
    }

    // Revenue per rep (30 points max)
    const revenuePerRep = currentMRR / currentTeamSize
    const benchmarkRevenuePerRep = roleType === "ae" ? 50000 : roleType === "sdr" ? 15000 : 30000

    if (revenuePerRep > benchmarkRevenuePerRep * 1.2) {
      score += 30
      recommendations.push("Revenue per rep is high - scale with more hires")
    } else if (revenuePerRep > benchmarkRevenuePerRep) {
      score += 20
      recommendations.push("Revenue per rep is healthy")
    } else {
      score += 5
      recommendations.push("Focus on improving rep productivity first")
    }

    // Break-even time (30 points max)
    if (breakEvenMonth <= 6) {
      score += 30
      recommendations.push("Fast payback - financially sound to hire")
    } else if (breakEvenMonth <= 12) {
      score += 20
      recommendations.push("Reasonable payback period")
    } else if (breakEvenMonth <= 18) {
      score += 10
      recommendations.push("Long payback - ensure you have runway")
    } else {
      score += 0
      recommendations.push("Very long payback - reconsider hiring parameters")
    }

    return { score, recommendations }
  }

  const { score: capacityScore, recommendations } = calculateCapacityScore()

  // 5. ROI Metrics
  const firstYearNetRevenue = totalRevenue - totalFirstYearCost
  const firstYearROI = ((totalRevenue - totalFirstYearCost) / totalFirstYearCost) * 100
  const paybackPeriod = breakEvenMonth

  // 6. Hiring Recommendation
  const getHiringRecommendation = () => {
    if (capacityScore >= 80) {
      return {
        status: "strongly-recommended",
        message: "Strong hiring signal - proceed with confidence",
        color: "text-green-600 dark:text-green-400"
      }
    } else if (capacityScore >= 60) {
      return {
        status: "recommended",
        message: "Positive hiring signal - evaluate candidates",
        color: "text-blue-600 dark:text-blue-400"
      }
    } else if (capacityScore >= 40) {
      return {
        status: "conditional",
        message: "Conditional hire - address concerns first",
        color: "text-yellow-600 dark:text-yellow-400"
      }
    } else {
      return {
        status: "not-recommended",
        message: "Not recommended - focus on current team efficiency",
        color: "text-orange-600 dark:text-orange-400"
      }
    }
  }

  const hiringRecommendation = getHiringRecommendation()

  // Save Scenario Function
  const handleSaveScenario = () => {
    const scenario = {
      id: generateScenarioId(),
      name: getDefaultScenarioName('sales-hiring'),
      calculatorType: 'sales-hiring' as const,
      inputs: {
        currency,
        roleType,
        currentTeamSize,
        currentMRR,
        avgDealSize,
        salesCycleLength,
        currentCapacity,
        baseSalary,
        ote,
        rampTime,
        expectedQuotaAttainment,
        monthlyQuota,
        recruitingCost,
        onboardingCost,
        toolsCostPerMonth,
        benefitsPercentage
      },
      results: {
        roi: firstYearROI,
        totalCost: totalFirstYearCost,
        paybackMonths: Math.ceil(breakEvenMonth),
        totalReturn: totalRevenue,
        risk: firstYearROI > 150 ? 'low' as const : firstYearROI > 80 ? 'medium' as const : 'high' as const
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* Mobile CTA Banner */}
      <div className="lg:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 text-center">
        <a
          href="https://services.next8n.com/book-consultation"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sm hover:underline"
        >
          🚀 Get Expert Help - Book Free Consultation →
        </a>
      </div>

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          {/* Mobile Layout */}
          <div className="lg:hidden flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-xs">Back</span>
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                <span className="text-base font-bold">Sales Hiring ROI</span>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2 flex-1">
                <Button
                  variant={scenarioSaved ? "default" : "outline"}
                  size="sm"
                  onClick={handleSaveScenario}
                  disabled={scenarioSaved}
                  className="gap-1 text-xs flex-1"
                >
                  {scenarioSaved ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3" />
                      Save
                    </>
                  )}
                </Button>
                <LanguageSelector />
              </div>
              <Select value={currency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
                <SelectTrigger className="w-24 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currencies).map(([code, curr]) => (
                    <SelectItem key={code} value={code}>
                      {curr.symbol} {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Hub
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                <span className="text-xl font-bold">Sales Hiring ROI</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant={scenarioSaved ? "default" : "outline"}
                size="sm"
                onClick={handleSaveScenario}
                disabled={scenarioSaved}
                className="gap-2 transition-all hover:scale-105"
              >
                {scenarioSaved ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Scenario
                  </>
                )}
              </Button>
              <LanguageSelector />
              <Select value={currency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currencies).map(([code, curr]) => (
                    <SelectItem key={code} value={code}>
                      {curr.symbol} {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sales Hiring ROI Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate the financial impact of hiring a sales rep. Determine when to hire,
            break-even timelines, and expected returns.
          </p>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Break-Even Month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {breakEvenMonth} {breakEvenMonth === 1 ? 'month' : 'months'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Time to recover investment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                First Year ROI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${firstYearROI > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {firstYearROI > 0 ? '+' : ''}{firstYearROI.toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Return on investment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                First Year Revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total revenue generated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Capacity Score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {capacityScore}/100
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Hiring readiness score
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-1 space-y-6">
            {/* Role Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Role Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="roleType">Sales Role</Label>
                  <Select value={roleType} onValueChange={(value) => setRoleType(value as RoleType)}>
                    <SelectTrigger id="roleType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleConfigs).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {roleConfigs[roleType].description}
                  </p>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="baseSalary">Base Salary (Annual)</Label>
                  <Input
                    id="baseSalary"
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Industry avg: {formatCurrency(roleConfigs[roleType].avgSalary)}
                  </p>
                </div>

                <div>
                  <Label htmlFor="ote">OTE (On-Target Earnings)</Label>
                  <Input
                    id="ote"
                    type="number"
                    value={ote}
                    onChange={(e) => setOTE(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Base + Commission at 100% quota
                  </p>
                </div>

                <div>
                  <Label htmlFor="rampTime">Ramp Time (Months)</Label>
                  <Input
                    id="rampTime"
                    type="number"
                    value={rampTime}
                    onChange={(e) => setRampTime(Number(e.target.value))}
                    min={1}
                    max={12}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Time to reach full productivity
                  </p>
                </div>

                <div>
                  <Label htmlFor="quotaAttainment">Expected Quota Attainment (%)</Label>
                  <Input
                    id="quotaAttainment"
                    type="number"
                    value={expectedQuotaAttainment}
                    onChange={(e) => setExpectedQuotaAttainment(Number(e.target.value))}
                    min={0}
                    max={200}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Industry avg: {roleConfigs[roleType].avgQuotaAttainment}%
                  </p>
                </div>

                <div>
                  <Label htmlFor="monthlyQuota">Monthly Quota</Label>
                  <Input
                    id="monthlyQuota"
                    type="number"
                    value={monthlyQuota}
                    onChange={(e) => setMonthlyQuota(Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Current Business Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Current Business Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentTeamSize">Current Sales Team Size</Label>
                  <Input
                    id="currentTeamSize"
                    type="number"
                    value={currentTeamSize}
                    onChange={(e) => setCurrentTeamSize(Number(e.target.value))}
                    min={1}
                  />
                </div>

                <div>
                  <Label htmlFor="currentMRR">Current MRR</Label>
                  <Input
                    id="currentMRR"
                    type="number"
                    value={currentMRR}
                    onChange={(e) => setCurrentMRR(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="avgDealSize">Average Deal Size</Label>
                  <Input
                    id="avgDealSize"
                    type="number"
                    value={avgDealSize}
                    onChange={(e) => setAvgDealSize(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="salesCycleLength">Sales Cycle Length (Days)</Label>
                  <Input
                    id="salesCycleLength"
                    type="number"
                    value={salesCycleLength}
                    onChange={(e) => setSalesCycleLength(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="currentCapacity">Current Team Capacity (%)</Label>
                  <Input
                    id="currentCapacity"
                    type="number"
                    value={currentCapacity}
                    onChange={(e) => setCurrentCapacity(Number(e.target.value))}
                    min={0}
                    max={150}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    100% = fully utilized, &gt;90% = over capacity
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Additional Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recruitingCost">Recruiting Cost</Label>
                  <Input
                    id="recruitingCost"
                    type="number"
                    value={recruitingCost}
                    onChange={(e) => setRecruitingCost(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="onboardingCost">Onboarding & Training Cost</Label>
                  <Input
                    id="onboardingCost"
                    type="number"
                    value={onboardingCost}
                    onChange={(e) => setOnboardingCost(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="toolsCost">Tools Cost (Monthly)</Label>
                  <Input
                    id="toolsCost"
                    type="number"
                    value={toolsCostPerMonth}
                    onChange={(e) => setToolsCostPerMonth(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    CRM, email, phone, etc.
                  </p>
                </div>

                <div>
                  <Label htmlFor="benefits">Benefits (% of Salary)</Label>
                  <Input
                    id="benefits"
                    type="number"
                    value={benefitsPercentage}
                    onChange={(e) => setBenefitsPercentage(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Healthcare, 401k, etc. (typically 20-30%)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hiring Recommendation */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Hiring Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold mb-4 ${hiringRecommendation.color}`}>
                  {hiringRecommendation.message}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Capacity Score:</span>
                    <span className="font-bold">{capacityScore}/100</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary rounded-full h-3 transition-all"
                      style={{ width: `${capacityScore}%` }}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Key Factors:</h4>
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>First Year Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(totalFirstYearCost)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(totalRevenue)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Salary:</span>
                    <span className="font-medium">{formatCurrency(baseSalary)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Benefits ({benefitsPercentage}%):</span>
                    <span className="font-medium">{formatCurrency(baseSalary * (benefitsPercentage / 100))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tools (12 months):</span>
                    <span className="font-medium">{formatCurrency(toolsCostPerMonth * 12)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Recruiting:</span>
                    <span className="font-medium">{formatCurrency(recruitingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Onboarding:</span>
                    <span className="font-medium">{formatCurrency(onboardingCost)}</span>
                  </div>
                </div>

                <Separator />

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Net Impact (Year 1):</span>
                    <span className={`text-2xl font-bold ${firstYearNetRevenue > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {firstYearNetRevenue > 0 ? '+' : ''}{formatCurrency(firstYearNetRevenue)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    ROI: {firstYearROI > 0 ? '+' : ''}{firstYearROI.toFixed(1)}% | Break-even: Month {breakEvenMonth}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Revenue Ramp */}
            <Card>
              <CardHeader>
                <CardTitle>12-Month Revenue Ramp</CardTitle>
                <CardDescription>
                  Expected revenue generation as rep reaches full productivity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlyRevenue.map((month) => {
                    const isBreakEven = month.cumulativeRevenue >= (recruitingCost + onboardingCost + (totalMonthlyCost * month.month))
                    const productivityColor =
                      month.productivity >= expectedQuotaAttainment ? 'bg-green-500' :
                      month.productivity >= expectedQuotaAttainment * 0.75 ? 'bg-blue-500' :
                      month.productivity >= expectedQuotaAttainment * 0.5 ? 'bg-yellow-500' :
                      'bg-orange-500'

                    return (
                      <div key={month.month} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">
                            Month {month.month}
                            {isBreakEven && month.month === breakEvenMonth && (
                              <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                                ● Break-even
                              </span>
                            )}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-muted-foreground">
                              {month.productivity.toFixed(0)}% productive
                            </span>
                            <span className="font-bold tabular-nums">
                              {formatCurrency(month.revenue)}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`${productivityColor} rounded-full h-2 transition-all`}
                            style={{ width: `${(month.revenue / monthlyQuota) * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Separator className="my-4" />

                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Year 1 Revenue:</span>
                    <span className="font-bold">{formatCurrency(totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Average Monthly:</span>
                    <span className="font-bold">{formatCurrency(totalRevenue / 12)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Revenue Per Rep</p>
                    <p className="text-sm text-muted-foreground">
                      Current team: {formatCurrency(currentMRR / currentTeamSize)}/mo per rep.
                      New hire will add {formatCurrency(totalRevenue / 12)}/mo after ramp.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Payback Period</p>
                    <p className="text-sm text-muted-foreground">
                      You'll break even in month {breakEvenMonth}.
                      {breakEvenMonth <= 6 && " This is excellent for SaaS."}
                      {breakEvenMonth > 6 && breakEvenMonth <= 12 && " This is typical for SaaS."}
                      {breakEvenMonth > 12 && " Longer than average - ensure runway is adequate."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Ramp Efficiency</p>
                    <p className="text-sm text-muted-foreground">
                      {rampTime}-month ramp to {expectedQuotaAttainment}% quota attainment.
                      Industry benchmark for {roleConfigs[roleType].name}: {roleConfigs[roleType].rampMonths} months.
                    </p>
                  </div>
                </div>

                {currentCapacity >= 90 && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Capacity Alert</p>
                      <p className="text-sm text-muted-foreground">
                        Your team is at {currentCapacity}% capacity. High capacity indicates hiring urgency to avoid losing deals.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Calculators */}
            <Card>
              <CardHeader>
                <CardTitle>Related Calculators</CardTitle>
                <CardDescription>
                  Explore other ROI calculators to make comprehensive business decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/roi" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-sm">Cold Email ROI</p>
                      <p className="text-xs text-muted-foreground">Multi-channel outreach</p>
                    </div>
                  </Link>

                  <Link href="/automation" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
                    <Cog className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-sm">Automation ROI</p>
                      <p className="text-xs text-muted-foreground">Process automation</p>
                    </div>
                  </Link>

                  <Link href="/training" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-sm">Training ROI</p>
                      <p className="text-xs text-muted-foreground">Employee development</p>
                    </div>
                  </Link>

                  <Link href="/cac-payback" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-sm">CAC Payback</p>
                      <p className="text-xs text-muted-foreground">Customer acquisition</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Built by</span>
              <a
                href="https://services.next8n.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                Mirza Iqbal
              </a>
              <span>•</span>
              <a
                href="https://services.next8n.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Next8n
              </a>
            </div>
            <a
              href="https://services.next8n.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              Need Assistance? Book a Meeting
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
