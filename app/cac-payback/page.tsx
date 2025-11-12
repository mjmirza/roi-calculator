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
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Target,
  BarChart3,
  Zap,
  Mail,
  Cog,
  GraduationCap,
  Users,
  Save,
  CheckCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { saveScenario, generateScenarioId, getDefaultScenarioName } from "@/lib/scenario-utils"

export default function CACPaybackCalculator() {
  const { t } = useLanguage()
  const router = useRouter()
  const [scenarioSaved, setScenarioSaved] = useState(false)

  // Input States
  const [businessType, setBusinessType] = useState("saas")
  const [customerSegment, setCustomerSegment] = useState("mid-market")
  const [salesMarketingSpend, setSalesMarketingSpend] = useState(100000)
  const [newMRR, setNewMRR] = useState(50000)
  const [newCustomers, setNewCustomers] = useState(50)
  const [grossMargin, setGrossMargin] = useState(77)
  const [churnRate, setChurnRate] = useState(3.5)
  const [expansionRate, setExpansionRate] = useState(10)
  const [currency, setCurrency] = useState("USD")

  // Results State
  const [results, setResults] = useState({
    cacPaybackMonths: 0,
    cac: 0,
    arpa: 0,
    ltv: 0,
    ltvCacRatio: 0,
    magicNumber: 0,
    paybackHealth: "good",
    ltvCacHealth: "good",
    monthlyPayback: [] as Array<{ month: number; cumulative: number; percentPaid: number }>,
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

  const getBenchmark = () => {
    const benchmarks: Record<string, Record<string, number>> = {
      saas: {
        smb: 12,
        "mid-market": 18,
        enterprise: 24,
      },
      b2b: {
        smb: 9,
        "mid-market": 14,
        enterprise: 20,
      },
      b2c: {
        smb: 6,
        "mid-market": 9,
        enterprise: 12,
      },
    }
    return benchmarks[businessType]?.[customerSegment] || 18
  }

  useEffect(() => {
    calculateMetrics()
  }, [
    salesMarketingSpend,
    newMRR,
    newCustomers,
    grossMargin,
    churnRate,
    expansionRate,
    businessType,
    customerSegment,
  ])

  const handleSaveScenario = () => {
    const scenario = {
      id: generateScenarioId(),
      name: getDefaultScenarioName('cac-payback'),
      calculatorType: 'cac-payback' as const,
      inputs: {
        businessType,
        customerSegment,
        salesMarketingSpend,
        newMRR,
        newCustomers,
        grossMargin,
        churnRate,
        expansionRate
      },
      results: {
        roi: results.ltvCacRatio * 100, // Convert ratio to percentage
        totalCost: results.cac,
        paybackMonths: Math.ceil(results.cacPaybackMonths),
        totalReturn: results.ltv,
        risk: results.cacPaybackMonths < 12 ? 'low' as const : results.cacPaybackMonths < 18 ? 'medium' as const : 'high' as const
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

  const calculateMetrics = () => {
    // 1. CAC (Customer Acquisition Cost)
    const cac = newCustomers > 0 ? salesMarketingSpend / newCustomers : 0

    // 2. ARPA (Average Revenue Per Account)
    const arpa = newCustomers > 0 ? newMRR / newCustomers : 0

    // 3. CAC Payback Period (Gross Margin Adjusted)
    const grossMarginDecimal = grossMargin / 100
    const monthlyGrossProfit = arpa * grossMarginDecimal
    const cacPaybackMonths = monthlyGrossProfit > 0 ? cac / monthlyGrossProfit : 0

    // 4. LTV (Lifetime Value)
    const monthlyChurnRate = churnRate / 100
    const customerLifetimeMonths = monthlyChurnRate > 0 ? 1 / monthlyChurnRate : 0
    const netExpansionRate = 1 + expansionRate / 100
    const ltv = arpa * grossMarginDecimal * customerLifetimeMonths * netExpansionRate

    // 5. LTV:CAC Ratio
    const ltvCacRatio = cac > 0 ? ltv / cac : 0

    // 6. Magic Number (simplified - would need quarterly data for true calculation)
    const magicNumber = salesMarketingSpend > 0 ? (newMRR * 12) / salesMarketingSpend : 0

    // 7. Health Indicators
    const benchmark = getBenchmark()
    let paybackHealth = "good"
    if (cacPaybackMonths < 12) paybackHealth = "excellent"
    else if (cacPaybackMonths > benchmark) paybackHealth = "concerning"
    else if (cacPaybackMonths > 24) paybackHealth = "poor"

    let ltvCacHealth = "good"
    if (ltvCacRatio >= 3 && ltvCacRatio <= 5) ltvCacHealth = "excellent"
    else if (ltvCacRatio < 2) ltvCacHealth = "poor"
    else if (ltvCacRatio > 5) ltvCacHealth = "underinvesting"
    else if (ltvCacRatio < 3) ltvCacHealth = "fair"

    // 8. Monthly Payback Progress
    const monthlyPayback = []
    const monthsToShow = Math.ceil(cacPaybackMonths) + 6
    for (let month = 1; month <= Math.min(monthsToShow, 36); month++) {
      const cumulative = monthlyGrossProfit * month
      const percentPaid = cac > 0 ? Math.min((cumulative / cac) * 100, 100) : 0
      monthlyPayback.push({ month, cumulative, percentPaid })
    }

    setResults({
      cacPaybackMonths,
      cac,
      arpa,
      ltv,
      ltvCacRatio,
      magicNumber,
      paybackHealth,
      ltvCacHealth,
      monthlyPayback,
    })
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900"
      case "good":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900"
      case "fair":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900"
      case "concerning":
        return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900"
      case "poor":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
      case "underinvesting":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900"
      default:
        return "text-muted-foreground bg-muted border-border"
    }
  }

  const getHealthLabel = (health: string) => {
    switch (health) {
      case "excellent":
        return "🟢 Excellent"
      case "good":
        return "🟢 Good"
      case "fair":
        return "🟡 Fair"
      case "concerning":
        return "🟠 Concerning"
      case "poor":
        return "🔴 Poor"
      case "underinvesting":
        return "🟣 Underinvesting"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hub
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">CAC Payback Calculator</span>
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
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">CAC Payback</p>
                  <p className="text-2xl font-bold">{results.cacPaybackMonths.toFixed(1)} mo</p>
                  <p className="text-xs text-muted-foreground mt-1">{getHealthLabel(results.paybackHealth)}</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">LTV:CAC Ratio</p>
                  <p className="text-2xl font-bold">{results.ltvCacRatio.toFixed(1)}:1</p>
                  <p className="text-xs text-muted-foreground mt-1">{getHealthLabel(results.ltvCacHealth)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Customer LTV</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.ltv)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Magic Number</p>
                  <p className="text-2xl font-bold">{results.magicNumber.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {results.magicNumber >= 1.0 ? "🟢 Excellent" : results.magicNumber >= 0.75 ? "🟡 Good" : "🔴 Poor"}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* Business Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Business Configuration
                </CardTitle>
                <CardDescription>Configure your business type and customer segment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select value={businessType} onValueChange={setBusinessType}>
                    <SelectTrigger id="businessType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="b2b">B2B (Non-SaaS)</SelectItem>
                      <SelectItem value="b2c">B2C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="customerSegment">Customer Segment</Label>
                  <Select value={customerSegment} onValueChange={setCustomerSegment}>
                    <SelectTrigger id="customerSegment">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smb">SMB (Small Business)</SelectItem>
                      <SelectItem value="mid-market">Mid-Market</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Benchmark target: {getBenchmark()} months
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sales & Marketing Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Sales & Marketing Metrics
                </CardTitle>
                <CardDescription>Monthly spending and new customer data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="salesMarketingSpend">Monthly S&M Spend</Label>
                  <Input
                    id="salesMarketingSpend"
                    type="number"
                    value={salesMarketingSpend}
                    onChange={(e) => setSalesMarketingSpend(Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include all sales & marketing expenses
                  </p>
                </div>

                <div>
                  <Label htmlFor="newMRR">New MRR from New Customers</Label>
                  <Input
                    id="newMRR"
                    type="number"
                    value={newMRR}
                    onChange={(e) => setNewMRR(Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Monthly recurring revenue from new customers only
                  </p>
                </div>

                <div>
                  <Label htmlFor="newCustomers">New Customers Acquired</Label>
                  <Input
                    id="newCustomers"
                    type="number"
                    value={newCustomers}
                    onChange={(e) => setNewCustomers(Number(e.target.value))}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Number of paying customers added this month
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-muted border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Calculated CAC:</span>
                    <span className="text-lg font-bold">{formatCurrency(results.cac)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">Calculated ARPA:</span>
                    <span className="text-lg font-bold">{formatCurrency(results.arpa)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Economics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Business Economics
                </CardTitle>
                <CardDescription>Profitability and retention metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="grossMargin">Gross Margin (%)</Label>
                  <Input
                    id="grossMargin"
                    type="number"
                    value={grossMargin}
                    onChange={(e) => setGrossMargin(Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    SaaS median: 77%, Target: 75%+
                  </p>
                </div>

                <div>
                  <Label htmlFor="churnRate">Monthly Churn Rate (%)</Label>
                  <Input
                    id="churnRate"
                    type="number"
                    value={churnRate}
                    onChange={(e) => setChurnRate(Number(e.target.value))}
                    min={0}
                    max={100}
                    step={0.1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    B2B SaaS average: 3.5%, Target: &lt;3%
                  </p>
                </div>

                <div>
                  <Label htmlFor="expansionRate">Monthly Expansion Rate (%)</Label>
                  <Input
                    id="expansionRate"
                    type="number"
                    value={expansionRate}
                    onChange={(e) => setExpansionRate(Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upsells, cross-sells, and seat expansion
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* CAC Payback Analysis */}
            <Card className={`border-2 ${getHealthColor(results.paybackHealth)}`}>
              <CardHeader>
                <CardTitle className="text-lg">CAC Payback Analysis</CardTitle>
                <CardDescription>How quickly you recover customer acquisition costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 rounded-lg bg-background border-2">
                  <p className="text-sm text-muted-foreground mb-2">CAC Payback Period</p>
                  <p className="text-5xl font-bold mb-2">{results.cacPaybackMonths.toFixed(1)}</p>
                  <p className="text-lg font-semibold">months</p>
                  <p className="text-sm mt-2">{getHealthLabel(results.paybackHealth)}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your CAC Payback:</span>
                    <span className="font-semibold">{results.cacPaybackMonths.toFixed(1)} months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Industry Benchmark:</span>
                    <span className="font-semibold">{getBenchmark()} months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Best-in-Class:</span>
                    <span className="font-semibold">6-12 months</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-semibold">Payback Progress</p>
                  <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${Math.min((12 / results.cacPaybackMonths) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Progress toward 12-month target
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* LTV:CAC Ratio */}
            <Card className={`border-2 ${getHealthColor(results.ltvCacHealth)}`}>
              <CardHeader>
                <CardTitle className="text-lg">LTV:CAC Ratio</CardTitle>
                <CardDescription>Customer lifetime value vs acquisition cost</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 rounded-lg bg-background border-2">
                  <p className="text-sm text-muted-foreground mb-2">LTV:CAC Ratio</p>
                  <p className="text-5xl font-bold mb-2">{results.ltvCacRatio.toFixed(1)}</p>
                  <p className="text-lg font-semibold">: 1</p>
                  <p className="text-sm mt-2">{getHealthLabel(results.ltvCacHealth)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted border text-center">
                    <p className="text-xs text-muted-foreground mb-1">Lifetime Value</p>
                    <p className="text-xl font-bold">{formatCurrency(results.ltv)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted border text-center">
                    <p className="text-xs text-muted-foreground mb-1">Acquisition Cost</p>
                    <p className="text-xl font-bold">{formatCurrency(results.cac)}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your Ratio:</span>
                    <span className="font-semibold">{results.ltvCacRatio.toFixed(1)}:1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target Range:</span>
                    <span className="font-semibold">3:1 to 5:1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Industry Average:</span>
                    <span className="font-semibold">6:1</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Payback Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Month-by-Month Payback</CardTitle>
                <CardDescription>Revenue accumulation toward CAC recovery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {results.monthlyPayback.slice(0, 24).map((month) => (
                    <div key={month.month} className="flex items-center gap-3">
                      <span className="text-xs font-medium w-16">Month {month.month}</span>
                      <div className="flex-1">
                        <div className="w-full h-6 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              month.percentPaid >= 100
                                ? "bg-green-500"
                                : month.percentPaid >= 75
                                ? "bg-blue-500"
                                : month.percentPaid >= 50
                                ? "bg-yellow-500"
                                : "bg-orange-500"
                            }`}
                            style={{ width: `${month.percentPaid}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-medium w-20 text-right">
                        {month.percentPaid.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.cacPaybackMonths < 12 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Excellent CAC Payback
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Your {results.cacPaybackMonths.toFixed(1)}-month payback is faster than the {getBenchmark()}-month benchmark
                      </p>
                    </div>
                  </div>
                )}

                {results.ltvCacRatio >= 3 && results.ltvCacRatio <= 5 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Healthy LTV:CAC Ratio
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Your {results.ltvCacRatio.toFixed(1)}:1 ratio is in the ideal 3:1 to 5:1 range
                      </p>
                    </div>
                  </div>
                )}

                {results.magicNumber >= 1.0 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Exceptional Sales Efficiency
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Magic Number of {results.magicNumber.toFixed(2)} shows excellent S&M efficiency
                      </p>
                    </div>
                  </div>
                )}

                {results.cacPaybackMonths > getBenchmark() && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900">
                    <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                        Above Industry Benchmark
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-300">
                        Consider optimizing sales efficiency or increasing ARPA to reduce payback period
                      </p>
                    </div>
                  </div>
                )}

                {results.ltvCacRatio < 3 && results.ltvCacRatio > 0 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900">
                    <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                        Low LTV:CAC Ratio
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-300">
                        Target 3:1 or higher by reducing churn or increasing customer lifetime value
                      </p>
                    </div>
                  </div>
                )}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/roi">
                <div className="p-4 rounded-lg border-2 border-transparent hover:border-primary transition-all cursor-pointer bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm">Cold Email ROI</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Calculate multi-channel outreach ROI
                  </p>
                </div>
              </Link>

              <Link href="/automation">
                <div className="p-4 rounded-lg border-2 border-transparent hover:border-primary transition-all cursor-pointer bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Cog className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm">Automation ROI</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    n8n/Make.com automation savings
                  </p>
                </div>
              </Link>

              <Link href="/training">
                <div className="p-4 rounded-lg border-2 border-transparent hover:border-primary transition-all cursor-pointer bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm">Training ROI</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Employee training impact
                  </p>
                </div>
              </Link>

              <Link href="/sales-hiring">
                <div className="p-4 rounded-lg border-2 border-transparent hover:border-primary transition-all cursor-pointer bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm">Sales Hiring ROI</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When to hire sales reps
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

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
