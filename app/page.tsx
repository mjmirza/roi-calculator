"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Cog, GraduationCap, Calculator, Target, UserPlus, BarChart3 } from "lucide-react"

export default function LandingPage() {
  const calculators = [
    {
      title: "Cold Email ROI Calculator",
      description: "Calculate the ROI of your cold email outreach campaigns across multiple channels including email, cold calling, LinkedIn, and referrals.",
      icon: Mail,
      href: "/roi",
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
      features: [
        "Productivity loss from untrained employees",
        "Turnover cost analysis",
        "Training investment vs. returns",
        "Skill obsolescence impact"
      ],
      stats: "Untrained employees operate at 60% capacity"
    },
    {
      title: "CAC Payback Calculator",
      description: "Measure how quickly you recover customer acquisition costs. Calculate CAC payback period, LTV:CAC ratio, and sales efficiency metrics.",
      icon: Target,
      href: "/cac-payback",
      features: [
        "CAC Payback Period calculation",
        "LTV:CAC ratio analysis",
        "Magic Number sales efficiency",
        "Industry benchmark comparisons"
      ],
      stats: "Median SaaS payback: 18 months"
    },
    {
      title: "Sales Hiring ROI Calculator",
      description: "Determine when to hire sales reps and calculate the financial impact. Analyze break-even timelines, ramp periods, and hiring capacity.",
      icon: UserPlus,
      href: "/sales-hiring",
      features: [
        "Break-even analysis for new hires",
        "Ramp time revenue projections",
        "Hiring capacity score",
        "Role-specific benchmarks (SDR/AE/AM)"
      ],
      stats: "Average SDR break-even: 6 months"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            <span className="text-xl font-bold">ROI Calculator Suite</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/roi" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Cold Email ROI
            </Link>
            <Link href="/automation" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Automation ROI
            </Link>
            <Link href="/training" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Training ROI
            </Link>
            <Link href="/cac-payback" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              CAC Payback
            </Link>
            <Link href="/sales-hiring" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sales Hiring
            </Link>
            <Link href="/planner">
              <Button size="sm" className="ml-2">
                <BarChart3 className="h-4 w-4 mr-2" />
                Scenario Planner
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Professional ROI Calculators
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Make data-driven decisions with our suite of professional ROI calculators.
            Calculate the financial impact of your investments in cold outreach, automation, employee training, customer acquisition, and sales hiring.
          </p>
        </div>

        {/* Scenario Planner CTA */}
        <Card className="max-w-4xl mx-auto mb-12 border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl md:text-3xl">Compare Multiple Scenarios</CardTitle>
            <CardDescription className="text-base">
              Can't decide between hiring, automation, or training? Use our Scenario Planner to compare multiple options side-by-side and get clear recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/planner">
              <Button size="lg" className="text-base px-8">
                <BarChart3 className="h-5 w-5 mr-2" />
                Open Scenario Planner
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-4">
              Save scenarios from any calculator, compare up to 3 at once, and get data-driven recommendations
            </p>
          </CardContent>
        </Card>

        {/* Calculator Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
          {calculators.map((calculator) => {
            const Icon = calculator.icon
            return (
              <Card key={calculator.href} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{calculator.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {calculator.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-4 p-3 rounded-lg bg-muted/50 border">
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
                  <div className="mt-auto space-y-3">
                    <div className="p-2 rounded bg-muted border text-center">
                      <p className="text-xs font-medium text-muted-foreground">
                        {calculator.stats}
                      </p>
                    </div>
                    <Link href={calculator.href}>
                      <Button className="w-full" variant="default">
                        Open Calculator
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Section */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Why Use Our ROI Calculators?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-semibold mb-2">Instant Results</h3>
                <p className="text-sm text-muted-foreground">
                  Get real-time calculations as you type. No waiting, no complicated forms.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Industry Benchmarks</h3>
                <p className="text-sm text-muted-foreground">
                  Based on real-world data and industry-standard formulas.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Stakeholder-Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Present compelling financial cases to executives and decision-makers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

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
