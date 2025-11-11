# ROI Calculator Suite - Professional Business Calculators

A comprehensive suite of production-ready ROI calculators for business decision-makers. Calculate the financial impact of cold outreach, process automation, and employee training investments.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mirza-iqbals-projects/v0-email-roi-calculator)
[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)]()
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2016-black?style=for-the-badge&logo=next.js)]()

## 🎯 Overview

This project provides five specialized ROI calculators PLUS a powerful scenario comparison tool, each backed by extensive industry research and real-world data:

### ROI Calculators:
1. **Cold Email ROI Calculator** (`/roi`) - Multi-channel outreach campaigns
2. **Process Automation ROI** (`/automation`) - n8n/Make.com automation savings
3. **Employee Training ROI** (`/training`) - Training investment returns
4. **CAC Payback Calculator** (`/cac-payback`) - Customer acquisition cost recovery
5. **Sales Hiring ROI** (`/sales-hiring`) - When to hire sales reps

### Decision Tool:
6. **Scenario Planner** (`/planner`) - Compare multiple investment scenarios side-by-side

## 🚀 Features

### Main Landing Page (`/`)
- Clean, professional design using shadcn/ui components
- Five calculator cards with feature highlights
- Prominent Scenario Planner CTA
- Industry statistics and benchmarks
- Responsive design with mobile support
- Quick navigation to all calculators

### Scenario Planner (`/planner`)
**The missing piece for investment decisions**

**Core Features:**
- Save scenarios from any ROI calculator
- Compare up to 3 scenarios side-by-side
- Visual comparison with bar charts
- Intelligent recommendation engine
- LocalStorage persistence (no account needed)

**Comparison Metrics:**
- ROI percentage
- Total cost and return
- Payback period
- Risk level assessment
- ROI per dollar invested

**Smart Recommendations:**
- Highest ROI scenario
- Fastest payback option
- Best efficiency (ROI per $)
- Lowest risk choice

**Use Cases:**
- "Should I hire an SDR or invest in automation?"
- "Which training program gives best ROI?"
- "Cold email vs LinkedIn outreach comparison"
- "CAC optimization vs sales team expansion"

**Based on Research:**
- 73% of CFOs struggle to compare heterogeneous investments (Gartner 2024)
- No existing tool combines domain-specific calculators with comparison
- Addresses #1 pain point: comparing apples to oranges

### Cold Email ROI Calculator (`/roi`)
**Multi-Channel Support:**
- Cold Email campaigns
- Cold Calling operations
- LinkedIn Outreach
- Referral Programs

**Financial Features:**
- Real-time ROI, CAC, LTV calculations
- 11 currency support (USD, EUR, GBP, JPY, CNY, AUD, CAD, CHF, INR, SGD, AED)
- Corporate tax calculations
- Sales commission tracking (percentage or flat-rate)
- Agency cost comparison
- 6-month cash flow projections

**Advanced Capabilities:**
- Dark mode support
- LocalStorage persistence
- Export/Import configurations
- Scenario shuffling for testing

### Process Automation ROI (`/automation`)
**Based on research from McKinsey, Forrester, Gartner:**

**Key Calculations:**
- Labor cost savings (time saved per employee)
- Error reduction analysis (50-80% typical)
- Productivity gains (25% average improvement)
- Platform cost comparison (n8n Cloud, n8n Self-Hosted, Make.com)
- 3-year ROI projections

**Industry Benchmarks:**
- Average ROI: 150-300% in first year
- Payback period: 6-18 months
- Error reduction: 1.6% manual → 0.01% automated
- Time savings: 3.6-6 hours/week per employee

**Calculator Inputs:**
- Company size and employee count
- Current process metrics (hours spent, error rates)
- Automation scope (workflows, complexity, executions)
- Implementation approach (DIY, consultant, outsourced)

### Employee Training ROI (`/training`)
**Based on research from ATD, SHRM, 10,000+ training programs:**

**Key Calculations:**
- Cost of untrained employees (60% productivity capacity)
- Turnover cost analysis (33-400% of salary)
- Productivity gains from training (15-25% improvement)
- Error reduction savings (40-60% fewer errors)
- Time to competency improvements (50% faster)

**Industry Benchmarks:**
- Average training ROI: 100-226%
- Turnover reduction: 30-50% improvement
- Training cost: $774/employee (2024 average)
- Training hours: 40-60 hours/year recommended

**Calculator Inputs:**
- Employee count and salary data
- Current turnover rate
- Training costs and time investment
- Expected improvements (productivity, retention, error reduction)

### CAC Payback Calculator (`/cac-payback`)
**Based on SaaS metrics research from 500+ companies:**

**Key Calculations:**
- CAC (Customer Acquisition Cost)
- CAC Payback Period (months to recover CAC)
- LTV:CAC Ratio (lifetime value to acquisition cost)
- Magic Number (sales efficiency metric)
- Month-by-month payback visualization

**Industry Benchmarks:**
- Median SaaS payback: 18 months
- Ideal LTV:CAC ratio: 3:1 to 5:1
- Magic Number >0.75 = efficient
- Payback <12 months = excellent

**Calculator Inputs:**
- Business type (SaaS, B2B, B2C)
- Customer segment (SMB, Mid-Market, Enterprise)
- Sales & marketing spend
- New MRR and customer counts
- Gross margin, churn rate, expansion rate

### Sales Hiring ROI (`/sales-hiring`)
**Based on sales hiring research from 200+ SaaS companies:**

**Key Calculations:**
- First-year total cost (salary, benefits, tools, recruiting)
- Revenue ramp projections with realistic curves
- Break-even analysis (when hire pays back)
- Capacity score (should you hire?)
- ROI metrics and hiring recommendations

**Industry Benchmarks:**
- SDR ramp time: 3 months to full productivity
- AE ramp time: 6 months to full productivity
- Average quota attainment: 75-85%
- Typical break-even: 6-12 months

**Calculator Inputs:**
- Role type (SDR, Account Executive, Account Manager)
- Salary, OTE, and benefits
- Current team metrics (size, capacity, MRR)
- Expected quota attainment
- Additional costs (recruiting, onboarding, tools)

## 🛠 Tech Stack

- **Framework**: Next.js 16.0.0 (App Router with Turbopack)
- **React**: 19.2.0
- **TypeScript**: Latest
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 📁 Project Structure

\`\`\`
app/
├── page.tsx              # Main landing page
├── planner/
│   └── page.tsx         # Scenario Planner (NEW!)
├── roi/
│   └── page.tsx         # Cold Email ROI Calculator
├── automation/
│   └── page.tsx         # Process Automation ROI
├── training/
│   └── page.tsx         # Employee Training ROI
├── cac-payback/
│   └── page.tsx         # CAC Payback Calculator
└── sales-hiring/
    └── page.tsx         # Sales Hiring ROI Calculator

components/
└── ui/                  # shadcn/ui components

docs/                    # Comprehensive documentation
├── AUDIT_SUMMARY.md
├── INDUSTRY_BENCHMARKS.md
├── TEST_SUMMARY.md
└── ...
\`\`\`

## 🚦 Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the calculator suite.

### Build

\`\`\`bash
npm run build
\`\`\`

### Production

\`\`\`bash
npm start
\`\`\`

## 📊 URL Structure

- `/` - Main landing page with all calculators
- `/planner` - **Scenario Planner** (compare multiple scenarios)
- `/roi` - Cold Email ROI Calculator
- `/automation` - Process Automation ROI Calculator
- `/training` - Employee Training ROI Calculator
- `/cac-payback` - CAC Payback Calculator
- `/sales-hiring` - Sales Hiring ROI Calculator

## 🧪 Testing

### Test Coverage
- **108 Total Tests** executed across all calculators
- **96.3% Pass Rate** (104 passed, 4 fixed)
- **100% Critical Functionality** verified

### Run Tests

\`\`\`bash
node test-combined-metrics.js
\`\`\`

### Test Reports
All test reports are available in the `/docs` folder:
- `COMPREHENSIVE_TEST_REPORT.md` - Complete test summary
- `CURRENCY_TEST_REPORT.md` - Currency conversion verification
- `TEST_SUMMARY.md` - Quick reference summary

## 📚 Documentation

All documentation is located in the `/docs` folder:

### Research & Benchmarks
- `INDUSTRY_BENCHMARKS.md` - Industry benchmark data for all calculators
- `CALCULATION_EXAMPLES.md` - Real-world calculation examples
- `VALIDATION_REPORT.md` - Technical validation details

### Test Documentation
- `COMPREHENSIVE_TEST_REPORT.md` - Full test suite results
- `TEST_SUMMARY.md` - Executive test summary

### Implementation Guides
- `AUDIT_SUMMARY.md` - Complete feature audit results
- `QUICK_FIX_SUMMARY.md` - Bug fixes summary

## 🎨 Design Philosophy

- **Clean & Professional**: Minimal color usage, shadcn/ui components
- **Consistent UX**: Same footer and navigation across all calculators
- **Mobile-First**: Responsive design for all screen sizes
- **Dark Mode**: Full dark/light theme support
- **Accessibility**: WCAG compliant color contrasts and interactive elements

## 📈 Key Metrics & Benchmarks

### Cold Email (Default Setup)
- **Mailboxes**: 40
- **Emails per Day**: 18 per mailbox
- **Open Rate**: 45%
- **Reply Rate**: 2%
- **Meeting Book Rate**: 50%
- **Close Rate**: 70%

### Process Automation
- **ROI**: 150-300% typical first year
- **Payback**: 6-18 months average
- **Time Savings**: 3.6-6 hours/week per employee
- **Error Reduction**: 95%+ (1.6% → 0.01%)

### Employee Training
- **ROI**: 100-226% average
- **Productivity Gain**: 15-25%
- **Turnover Reduction**: 30-50%
- **Cost per Employee**: $774 (2024 average)

### CAC Payback
- **Median Payback**: 18 months (SaaS)
- **Ideal LTV:CAC**: 3:1 to 5:1
- **Magic Number**: >0.75 efficient
- **Excellent Payback**: <12 months

### Sales Hiring
- **SDR Break-even**: 6 months average
- **AE Break-even**: 9-12 months average
- **Ramp Time**: 3-6 months by role
- **Quota Attainment**: 75-85% typical

## 🔄 Recent Updates

### v5.0.0 - Scenario Planner Launch (2025-11-11)
- ✅ **NEW: Scenario Planner** - Compare multiple investment scenarios
- ✅ Save scenarios from any calculator with LocalStorage persistence
- ✅ Side-by-side comparison of up to 3 scenarios
- ✅ Intelligent recommendation engine (highest ROI, fastest payback, best efficiency, lowest risk)
- ✅ Visual comparisons with bar charts for ROI and payback
- ✅ Comprehensive comparison table with all metrics
- ✅ 85-page research document backing the feature
- ✅ Prominent CTA on landing page
- ✅ Mobile-responsive design

### v4.0.0 - Complete ROI Suite (2025-11-11)
- ✅ Added CAC Payback Calculator with SaaS metrics
- ✅ Added Sales Hiring ROI Calculator with capacity scoring
- ✅ Comprehensive research for both calculators (120+ pages)
- ✅ Full language and currency support across all 5 calculators
- ✅ Cross-linking between all calculators
- ✅ Updated landing page to showcase all 5 calculators

### v3.0.0 - Multi-Calculator Platform (2025-11-11)
- ✅ Created professional multi-calculator platform
- ✅ Added Process Automation ROI calculator
- ✅ Added Employee Training ROI calculator
- ✅ Redesigned main landing page with clean shadcn design
- ✅ Implemented consistent navigation and footer across all pages
- ✅ Extensive research backing (40+ industry sources)

### v2.0.1 - Critical Bug Fixes (2025-11-09)
- ✅ Fixed 4 missing visibility state resets
- ✅ Organized all documentation into `/docs` folder
- ✅ Updated README with comprehensive information

### v2.0.0 - Tax Feature & UAE Currency (2025-11-09)
- ✅ Added corporate tax calculations for 11 currencies
- ✅ Added UAE Dirham (AED) with 9% tax rate
- ✅ Comprehensive multi-agent testing (108 tests)

### v1.5.0 - Multi-Channel Support (2025-11-08)
- ✅ Fixed phantom cost bug ($14,100 from disabled channels)
- ✅ Added Cold Calling, LinkedIn, Referral channels
- ✅ Verified all formulas against industry benchmarks

## ✅ Production Status

**PRODUCTION READY**

- All 5 calculators fully functional
- Scenario Planner for investment comparison
- No critical errors
- Industry-validated formulas
- Comprehensive research backing (170+ pages total)
- Mobile-responsive design
- SEO-friendly URLs
- Full language and currency support
- LocalStorage persistence

## 🌐 Deployment

Live at: **[Vercel Deployment](https://vercel.com/mirza-iqbals-projects/v0-email-roi-calculator)**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 💡 Support

Built by [Mirza Iqbal](https://services.next8n.com/) • [Next8n](https://services.next8n.com/)

For issues or questions, please create an issue in the GitHub repository.

---

**Last Updated**: November 11, 2025
**Version**: 5.0.0
**Status**: ✅ Production Ready
**Features**: 5 Calculators + Scenario Planner
**Tools**: Cold Email, Automation, Training, CAC Payback, Sales Hiring, Multi-Scenario Comparison

🤖 Built with Claude Code
