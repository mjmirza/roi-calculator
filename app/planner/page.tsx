"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Calculator,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Mail,
  Cog,
  GraduationCap,
  UserPlus,
  BarChart3,
  Download,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from "lucide-react"

// Scenario type definition
interface Scenario {
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

// Calculator metadata
const calculatorInfo = {
  'roi': { name: 'Cold Email ROI', icon: Mail, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  'automation': { name: 'Automation ROI', icon: Cog, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  'training': { name: 'Training ROI', icon: GraduationCap, color: 'text-green-600', bgColor: 'bg-green-50' },
  'cac-payback': { name: 'CAC Payback', icon: Target, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  'sales-hiring': { name: 'Sales Hiring ROI', icon: UserPlus, color: 'text-pink-600', bgColor: 'bg-pink-50' }
}

export default function ScenarioPlanner() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([])
  const [view, setView] = useState<'list' | 'comparison'>('list')

  // Load scenarios from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('roi-scenarios')
    if (stored) {
      try {
        setScenarios(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load scenarios:', e)
      }
    }
  }, [])

  // Save scenarios to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('roi-scenarios', JSON.stringify(scenarios))
  }, [scenarios])

  const deleteScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id))
    setSelectedScenarios(selectedScenarios.filter(sid => sid !== id))
  }

  const toggleSelection = (id: string) => {
    if (selectedScenarios.includes(id)) {
      setSelectedScenarios(selectedScenarios.filter(sid => sid !== id))
    } else {
      if (selectedScenarios.length < 3) {
        setSelectedScenarios([...selectedScenarios, id])
      }
    }
  }

  const getRecommendation = () => {
    if (selectedScenarios.length === 0) return null

    const selected = scenarios.filter(s => selectedScenarios.includes(s.id))

    // Find best by different criteria
    const highestROI = selected.reduce((prev, current) =>
      current.results.roi > prev.results.roi ? current : prev
    )
    const fastestPayback = selected.reduce((prev, current) =>
      current.results.paybackMonths < prev.results.paybackMonths ? current : prev
    )
    const lowestRisk = selected.reduce((prev, current) => {
      const riskScore = { low: 1, medium: 2, high: 3 }
      return riskScore[current.results.risk] < riskScore[prev.results.risk] ? current : prev
    })

    // Best ROI per dollar invested
    const bestEfficiency = selected.reduce((prev, current) => {
      const prevEff = prev.results.roi / prev.results.totalCost
      const currEff = current.results.roi / current.results.totalCost
      return currEff > prevEff ? current : prev
    })

    return {
      highestROI,
      fastestPayback,
      lowestRisk,
      bestEfficiency
    }
  }

  const recommendation = getRecommendation()
  const selectedScenarioData = scenarios.filter(s => selectedScenarios.includes(s.id))

  // Calculate comparison stats
  const comparisonStats = selectedScenarioData.length > 0 ? {
    totalInvestment: selectedScenarioData.reduce((sum, s) => sum + (s.results?.totalCost || 0), 0),
    totalReturn: selectedScenarioData.reduce((sum, s) => sum + (s.results?.totalReturn || 0), 0),
    avgPayback: selectedScenarioData.reduce((sum, s) => sum + (s.results?.paybackMonths || 0), 0) / selectedScenarioData.length,
    avgROI: selectedScenarioData.reduce((sum, s) => sum + (s.results?.roi || 0), 0) / selectedScenarioData.length
  } : null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  // Safe number formatting with null checks
  const safeToFixed = (value: any, decimals: number = 0): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return '0'
    }
    return Number(value).toFixed(decimals)
  }

  return (
    <div className="min-h-screen bg-background">
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

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Calculator className="h-6 w-6" />
            <span className="text-xl font-bold">Scenario Planner</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              My Scenarios
            </Button>
            <Button
              variant={view === 'comparison' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('comparison')}
              disabled={selectedScenarios.length < 2}
            >
              Compare ({selectedScenarios.length})
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">ROI Scenario Planner</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Save scenarios from your ROI calculators and compare them side-by-side to make data-driven investment decisions.
          </p>
        </div>

        {view === 'list' ? (
          <>
            {/* Quick Stats */}
            {scenarios.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Scenarios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{scenarios.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Avg ROI</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {safeToFixed(scenarios.reduce((sum, s) => sum + (s.results?.roi || 0), 0) / scenarios.length)}%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Investment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {formatCurrency(scenarios.reduce((sum, s) => sum + s.results.totalCost, 0))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Selected for Comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {selectedScenarios.length}/3
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Select up to 3 scenarios for optimal side-by-side comparison
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Create New Scenario CTA */}
            <Card className="mb-8 border-2 border-dashed border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Scenario
                </CardTitle>
                <CardDescription>
                  Use any of our ROI calculators to create scenarios, then return here to compare them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(calculatorInfo).map(([key, info]) => {
                    const Icon = info.icon
                    return (
                      <Link key={key} href={`/${key}`}>
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Icon className={`h-4 w-4 ${info.color}`} />
                          <span className="text-sm">{info.name}</span>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selection Limit Info Banner */}
            {selectedScenarios.length === 3 && (
              <Card className="mb-6 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">Maximum Selections Reached</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        You've selected the maximum of 3 scenarios for comparison. This limit ensures clear, focused analysis.
                        To select a different scenario, deselect one of your current selections first.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scenarios List */}
            {scenarios.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Scenarios Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first scenario by using one of the ROI calculators above
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Your Scenarios ({scenarios.length})</h2>
                  {selectedScenarios.length >= 2 && (
                    <Button onClick={() => setView('comparison')}>
                      Compare Selected
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>

                {scenarios.map((scenario) => {
                  const info = calculatorInfo[scenario.calculatorType]
                  const Icon = info.icon
                  const isSelected = selectedScenarios.includes(scenario.id)

                  const canSelect = isSelected || selectedScenarios.length < 3

                  return (
                    <Card
                      key={scenario.id}
                      className={`transition-all ${
                        canSelect ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                      } ${
                        isSelected ? 'border-primary border-2 shadow-md' : canSelect ? 'hover:shadow-sm' : ''
                      }`}
                      onClick={() => canSelect && toggleSelection(scenario.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg ${info.bgColor} flex items-center justify-center`}>
                              <Icon className={`h-6 w-6 ${info.color}`} />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{scenario.name}</CardTitle>
                              <CardDescription>{info.name}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteScenario(scenario.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">ROI</p>
                            <p className="text-2xl font-bold text-green-600">
                              {safeToFixed(scenario.results?.roi)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Cost</p>
                            <p className="text-2xl font-bold">
                              {formatCurrency(scenario.results.totalCost)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Payback</p>
                            <p className="text-2xl font-bold">
                              {scenario.results.paybackMonths} mo
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Risk Level</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getRiskColor(scenario.results.risk)}`}>
                              {scenario.results.risk}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Comparison View */}
            <Button
              variant="outline"
              className="mb-6"
              onClick={() => setView('list')}
            >
              ← Back to Scenarios
            </Button>

            {/* Comparison Stats */}
            {comparisonStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Combined Investment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {formatCurrency(comparisonStats.totalInvestment)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Combined Return
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(comparisonStats.totalReturn)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Avg Payback
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {safeToFixed(comparisonStats?.avgPayback, 1)} mo
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Avg ROI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {safeToFixed(comparisonStats?.avgROI)}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recommendations */}
            {recommendation && (
              <Card className="mb-8 border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Recommendations
                  </CardTitle>
                  <CardDescription>
                    Based on your selected scenarios, here are our recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-sm font-semibold text-green-900 mb-2">🏆 Highest ROI</p>
                      <p className="font-bold text-green-700">{recommendation.highestROI.name}</p>
                      <p className="text-sm text-green-600">{safeToFixed(recommendation.highestROI.results?.roi)}% ROI</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-sm font-semibold text-blue-900 mb-2">⚡ Fastest Payback</p>
                      <p className="font-bold text-blue-700">{recommendation.fastestPayback.name}</p>
                      <p className="text-sm text-blue-600">{recommendation.fastestPayback.results.paybackMonths} months</p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                      <p className="text-sm font-semibold text-purple-900 mb-2">🎯 Best Efficiency</p>
                      <p className="font-bold text-purple-700">{recommendation.bestEfficiency.name}</p>
                      <p className="text-sm text-purple-600">Best ROI per dollar invested</p>
                    </div>
                    <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                      <p className="text-sm font-semibold text-orange-900 mb-2">🛡️ Lowest Risk</p>
                      <p className="font-bold text-orange-700">{recommendation.lowestRisk.name}</p>
                      <p className="text-sm text-orange-600 capitalize">{recommendation.lowestRisk.results.risk} risk</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comparison Table */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Side-by-Side Comparison</CardTitle>
                <CardDescription>
                  Detailed comparison of your selected scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Metric</th>
                        {selectedScenarioData.map((scenario) => (
                          <th key={scenario.id} className="text-left py-3 px-4">
                            <div className="flex items-center gap-2">
                              {(() => {
                                const Icon = calculatorInfo[scenario.calculatorType].icon
                                return <Icon className={`h-4 w-4 ${calculatorInfo[scenario.calculatorType].color}`} />
                              })()}
                              <span className="font-semibold">{scenario.name}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 text-muted-foreground">Calculator Type</td>
                        {selectedScenarioData.map((scenario) => (
                          <td key={scenario.id} className="py-3 px-4">
                            {calculatorInfo[scenario.calculatorType].name}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b bg-muted/30">
                        <td className="py-3 px-4 font-semibold">ROI %</td>
                        {selectedScenarioData.map((scenario) => {
                          const isMax = scenario.results.roi === Math.max(...selectedScenarioData.map(s => s.results?.roi || 0))
                          return (
                            <td key={scenario.id} className={`py-3 px-4 font-bold ${isMax ? 'text-green-600' : ''}`}>
                              {safeToFixed(scenario.results?.roi)}%
                              {isMax && ' 🏆'}
                            </td>
                          )
                        })}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-semibold">Total Cost</td>
                        {selectedScenarioData.map((scenario) => (
                          <td key={scenario.id} className="py-3 px-4 font-bold">
                            {formatCurrency(scenario.results.totalCost)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b bg-muted/30">
                        <td className="py-3 px-4 font-semibold">Total Return</td>
                        {selectedScenarioData.map((scenario) => (
                          <td key={scenario.id} className="py-3 px-4 font-bold text-green-600">
                            {formatCurrency(scenario.results.totalReturn)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-semibold">Payback Period</td>
                        {selectedScenarioData.map((scenario) => {
                          const isMin = scenario.results.paybackMonths === Math.min(...selectedScenarioData.map(s => s.results.paybackMonths))
                          return (
                            <td key={scenario.id} className={`py-3 px-4 font-bold ${isMin ? 'text-blue-600' : ''}`}>
                              {scenario.results.paybackMonths} months
                              {isMin && ' ⚡'}
                            </td>
                          )
                        })}
                      </tr>
                      <tr className="border-b bg-muted/30">
                        <td className="py-3 px-4 font-semibold">Risk Level</td>
                        {selectedScenarioData.map((scenario) => (
                          <td key={scenario.id} className="py-3 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getRiskColor(scenario.results.risk)}`}>
                              {scenario.results.risk}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-semibold">ROI per $1 Invested</td>
                        {selectedScenarioData.map((scenario) => {
                          const efficiency = (scenario.results?.roi || 0) / (scenario.results?.totalCost || 1)
                          const isMax = efficiency === Math.max(...selectedScenarioData.map(s => (s.results?.roi || 0) / (s.results?.totalCost || 1)))
                          return (
                            <td key={scenario.id} className={`py-3 px-4 font-bold ${isMax ? 'text-purple-600' : ''}`}>
                              ${safeToFixed(efficiency * 1000, 2)}
                              {isMax && ' 🎯'}
                            </td>
                          )
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Visual Comparison - Bar Chart */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>ROI Comparison</CardTitle>
                <CardDescription>Visual comparison of return on investment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedScenarioData.map((scenario) => {
                    const maxROI = Math.max(...selectedScenarioData.map(s => s.results?.roi || 0))
                    const percentage = ((scenario.results?.roi || 0) / maxROI) * 100
                    const info = calculatorInfo[scenario.calculatorType]

                    return (
                      <div key={scenario.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{scenario.name}</span>
                          <span className="font-bold text-green-600">{safeToFixed(scenario.results?.roi)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-8">
                          <div
                            className={`h-8 rounded-full flex items-center justify-end pr-3 ${info.bgColor} border-2 ${info.color.replace('text-', 'border-')}`}
                            style={{ width: `${percentage}%` }}
                          >
                            {percentage > 20 && (
                              <span className={`text-sm font-semibold ${info.color}`}>
                                {safeToFixed(scenario.results?.roi)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Payback Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Payback Period Comparison</CardTitle>
                <CardDescription>Time to recover your investment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedScenarioData.map((scenario) => {
                    const maxPayback = Math.max(...selectedScenarioData.map(s => s.results.paybackMonths))
                    const percentage = (scenario.results.paybackMonths / maxPayback) * 100
                    const info = calculatorInfo[scenario.calculatorType]

                    return (
                      <div key={scenario.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{scenario.name}</span>
                          <span className="font-bold">{scenario.results.paybackMonths} months</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-8">
                          <div
                            className={`h-8 rounded-full flex items-center justify-end pr-3 ${info.bgColor} border-2 ${info.color.replace('text-', 'border-')}`}
                            style={{ width: `${percentage}%` }}
                          >
                            {percentage > 20 && (
                              <span className={`text-sm font-semibold ${info.color}`}>
                                {scenario.results.paybackMonths}mo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
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
