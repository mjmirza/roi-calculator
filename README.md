# ROI Calculator Suite - Professional Business Calculators

A comprehensive suite of production-ready ROI calculators for business decision-makers. Calculate the financial impact of cold outreach, process automation, and employee training investments.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mirza-iqbals-projects/v0-email-roi-calculator)
[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)]()
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2016-black?style=for-the-badge&logo=next.js)]()

## 🎯 Overview

This project provides three specialized ROI calculators, each backed by extensive industry research and real-world data:

1. **Cold Email ROI Calculator** (`/roi`) - Multi-channel outreach campaigns
2. **Process Automation ROI** (`/automation`) - n8n/Make.com automation savings
3. **Employee Training ROI** (`/training`) - Training investment returns

## 🚀 Features

### Main Landing Page (`/`)
- Clean, professional design using shadcn/ui components
- Three calculator cards with feature highlights
- Industry statistics and benchmarks
- Responsive design with mobile support
- Quick navigation to all calculators

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

## 🛠 Tech Stack

- **Framework**: Next.js 16.0.0 (App Router with Turbopack)
- **React**: 19.2.0
- **TypeScript**: Latest
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 📁 Project Structure

```
app/
├── page.tsx              # Main landing page
├── roi/
│   └── page.tsx         # Cold Email ROI Calculator
├── automation/
│   └── page.tsx         # Process Automation ROI
└── training/
    └── page.tsx         # Employee Training ROI

components/
└── ui/                  # shadcn/ui components

docs/                    # Comprehensive documentation
├── AUDIT_SUMMARY.md
├── INDUSTRY_BENCHMARKS.md
├── TEST_SUMMARY.md
└── ...
```

## 🚦 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the calculator suite.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## 📊 URL Structure

- `/` - Main landing page with all calculators
- `/roi` - Cold Email ROI Calculator
- `/automation` - Process Automation ROI Calculator
- `/training` - Employee Training ROI Calculator

## 🧪 Testing

### Test Coverage
- **108 Total Tests** executed across all calculators
- **96.3% Pass Rate** (104 passed, 4 fixed)
- **100% Critical Functionality** verified

### Run Tests

```bash
node test-combined-metrics.js
```

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

## 🔄 Recent Updates

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

- All calculators fully functional
- No critical errors
- Industry-validated formulas
- Comprehensive testing completed
- Mobile-responsive design
- SEO-friendly URLs

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
**Version**: 3.0.0
**Status**: ✅ Production Ready
**Calculators**: 3 (Cold Email, Automation, Training)

🤖 Built with Claude Code
