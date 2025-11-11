"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Cog, GraduationCap, TrendingUp, Zap, Users } from "lucide-react"

export default function LandingPage() {
  const calculators = [
    {
      title: "Cold Email ROI Calculator",
      description: "Calculate the ROI of your cold email outreach campaigns across multiple channels including email, cold calling, LinkedIn, and referrals.",
      icon: Mail,
      href: "/roi",
      color: "from-blue-500 to-cyan-500",
      features: [
        "Multi-channel analysis (Email, Cold Calling, LinkedIn, Referrals)",
        "Financial projections with 6-month cash flow",
        "Sales commission and agency cost tracking",
        "Real-time ROI calculations"
      ],
      stats: "Calculate pipeline value from cold outreach"
    },
    {
      title: "Process Automation ROI",
      description: "Discover how much you can save by automating workflows with n8n or Make.com. Calculate time savings, cost reduction, and productivity gains.",
      icon: Cog,
      href: "/automation",
      color: "from-purple-500 to-pink-500",
      features: [
        "Labor cost savings from automation",
        "Error reduction and quality improvements",
        "Platform comparison (n8n vs Make.com)",
        "3-year ROI projections"
      ],
      stats: "Average ROI: 150-300% in first year"
    },
    {
      title: "Employee Training ROI",
      description: "Measure the financial impact of training your employees. See how much untrained employees cost your organization in lost productivity and errors.",
      icon: GraduationCap,
      href: "/training",
      color: "from-green-500 to-emerald-500",
      features: [
        "Productivity loss from untrained employees",
        "Turnover cost analysis",
        "Training investment vs. returns",
        "Skill obsolescence impact"
      ],
      stats: "Untrained employees operate at 60% capacity"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold">ROI Calculator Suite</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/roi" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Cold Email ROI
            </Link>
            <Link href="/automation" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Automation ROI
            </Link>
            <Link href="/training" className="text-sm font-medium hover:text-green-600 transition-colors">
              Training ROI
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Free ROI Calculators for Business Decision-Makers
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Calculate Your ROI in 60 Seconds
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Make data-driven decisions with our suite of professional ROI calculators.
            Show stakeholders the exact financial impact of your investments in cold outreach,
            automation, and employee training.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Trusted by 10,000+ businesses</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Industry-standard formulas</span>
            </div>
          </div>
        </div>

        {/* Calculator Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {calculators.map((calculator) => {
            const Icon = calculator.icon
            return (
              <Card
                key={calculator.href}
                className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 flex flex-col"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${calculator.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{calculator.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {calculator.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Key Features:</p>
                    <ul className="space-y-1">
                      {calculator.features.map((feature, idx) => (
                        <li key={idx} className="text-xs flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <div className="mb-4 p-2 rounded bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        {calculator.stats}
                      </p>
                    </div>
                    <Link href={calculator.href}>
                      <Button className="w-full group-hover:shadow-lg transition-shadow" size="lg">
                        Start Calculating
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Benefits Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Use Our ROI Calculators?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-muted-foreground">
                Get real-time calculations as you type. No waiting, no complicated forms.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Industry Benchmarks</h3>
              <p className="text-sm text-muted-foreground">
                Based on real-world data and industry-standard formulas used by Fortune 500 companies.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Stakeholder-Ready</h3>
              <p className="text-sm text-muted-foreground">
                Present compelling financial cases to executives, investors, and decision-makers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold">ROI Calculator Suite</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/roi" className="hover:text-foreground transition-colors">
                Cold Email ROI
              </Link>
              <Link href="/automation" className="hover:text-foreground transition-colors">
                Automation ROI
              </Link>
              <Link href="/training" className="hover:text-foreground transition-colors">
                Training ROI
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
