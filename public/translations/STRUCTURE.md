# Translation Dictionary Structure Reference

## Quick Reference Guide

This document provides a quick overview of the translation dictionary structure for developers and translators.

## File Organization

\`\`\`
translations/
├── README.md           # Comprehensive documentation
├── STRUCTURE.md        # This file - quick reference
├── TEMPLATE.json       # Template for new translations
├── en.json            # English (base language)
└── [language].json    # Additional language files
\`\`\`

## Dictionary Structure Overview

### Top Level
\`\`\`json
{
  "[language_code]": {
    // All sections here
  }
}
\`\`\`

### Main Sections (28 total)

| Section | Description | Key Count |
|---------|-------------|-----------|
| `header` | App header, title, navigation | 6 |
| `currencies` | Currency names | 11 |
| `validation` | Error messages, validation | 7 |
| `calculationBreakdown` | Step-by-step calculations | 30+ |
| `revenueSetup` | Revenue inputs | 12 |
| `performanceMetrics` | Performance inputs | 6 |
| `advancedMetrics` | Advanced email metrics | 18 |
| `costStructure` | Cost inputs | 18 |
| `salesCommission` | Commission settings | 16 |
| `agencyComparison` | Agency comparison inputs | 8 |
| `coldCalling` | Cold calling inputs | 14 |
| `linkedInOutreach` | LinkedIn inputs | 14 |
| `referralProgram` | Referral inputs | 10 |
| `suggestions` | Smart suggestions | 30+ |
| `keyMetrics` | KPI displays | 4 |
| `salesPerformance` | Sales funnel | 5 |
| `financialSummary` | Financial summary | 13 |
| `financialAnalysis` | Financial metrics | 5 |
| `commissionImpact` | Commission analysis | 10 |
| `agencyComparisonPanel` | Agency comparison results | 11 |
| `multiChannelPerformance` | Multi-channel metrics | 10 |
| `coldCallingPerformance` | Calling results | 8 |
| `linkedInPerformance` | LinkedIn results | 8 |
| `referralPerformance` | Referral results | 8 |
| `emailPerformanceMetrics` | Email metrics | 6 |
| `cashFlowProjections` | Cash flow table | 12 |
| `benchmarkWarnings` | Benchmark warnings | 3 |
| `common` | Common phrases | 6 |

**Total: 400+ translatable strings**

## Key Naming Conventions

### Pattern 1: Field + Tooltip
\`\`\`json
{
  "fieldName": "Field Label",
  "fieldNameTooltip": "Helpful explanation for the field"
}
\`\`\`

### Pattern 2: Title + Description
\`\`\`json
{
  "title": "Section Title",
  "description": "Section description or subtitle"
}
\`\`\`

### Pattern 3: State Labels
\`\`\`json
{
  "enabled": "Enabled",
  "disabled": "Disabled"
}
\`\`\`

### Pattern 4: Metric Labels
\`\`\`json
{
  "metricName": "Metric Display Name",
  "metricDescription": "What this metric means"
}
\`\`\`

## Translation Priority

### High Priority (Core Functionality)
1. `header` - Application title and navigation
2. `validation` - Error messages users will see
3. `revenueSetup` - Main input section
4. `performanceMetrics` - Main input section
5. `costStructure` - Main input section
6. `keyMetrics` - Primary results display
7. `salesPerformance` - Primary results display

### Medium Priority (Enhanced Features)
8. `advancedMetrics` - Optional features
9. `salesCommission` - Optional features
10. `agencyComparison` - Optional features
11. `suggestions` - Smart recommendations
12. `financialSummary` - Detailed results
13. `financialAnalysis` - Detailed results

### Lower Priority (Additional Channels)
14. `coldCalling` - Additional channel
15. `linkedInOutreach` - Additional channel
16. `referralProgram` - Additional channel
17. `multiChannelPerformance` - Combined metrics
18. `calculationBreakdown` - Educational content
19. `cashFlowProjections` - Advanced projections

## Common Translation Patterns

### Percentages
Keep the `%` symbol after the number:
\`\`\`json
"openRate": "Open rate (%)"  // ✓ Correct
"openRate": "Open rate %"    // ✗ Incorrect
\`\`\`

### Tooltips
Tooltips should be complete sentences:
\`\`\`json
"domainsTooltip": "Number of unique domains you'll use for sending emails."  // ✓ Correct
"domainsTooltip": "Unique domains for sending"  // ✗ Too brief
\`\`\`

### Metrics with Units
Include the unit in parentheses:
\`\`\`json
"salesCycleLength": "Sales cycle length (days)"  // ✓ Correct
"salesCycleLength": "Sales cycle length"         // ✗ Missing unit
\`\`\`

### Labels with Context
\`\`\`json
"monthlyRetainer": "Agency monthly retainer"     // ✓ Context included
"monthlyRetainer": "Monthly retainer"            // ✗ Missing context
\`\`\`

## Technical Terms to Preserve

These terms should generally remain in English or use widely-accepted translations:
- ROI (Return on Investment)
- LTV (Lifetime Value)
- CAC (Customer Acquisition Cost)
- GTM (Go-To-Market)
- ICP (Ideal Customer Profile)
- B2B (Business to Business)

## Currency Handling

Currency symbols are defined in code and don't need translation:
\`\`\`javascript
// In code - DO NOT TRANSLATE
CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar" },  // Translate "US Dollar" only
  EUR: { symbol: "€", name: "Euro" },       // Translate "Euro" only
  // etc.
}
\`\`\`

In translation files, only translate currency names:
\`\`\`json
{
  "currencies": {
    "USD": "[Translate: US Dollar]",
    "EUR": "[Translate: Euro]"
  }
}
\`\`\`

## Validation Messages

Validation messages follow this pattern:
\`\`\`json
{
  "fieldName": "Field name (min: X)",
  "fieldNameDescription": "Detailed explanation"
}
\`\`\`

Example:
\`\`\`json
{
  "sendingMailboxesMin": "Sending mailboxes (min: 1)",
  "sendingMailboxesTooltip": "Total number of email accounts..."
}
\`\`\`

## Contextual Variations

Some strings have multiple variations for different contexts:

### Commission Type Descriptions
\`\`\`json
{
  "commissionTypePercentageDesc": "Sales reps earn a percentage...",
  "commissionTypeFlatDesc": "Sales reps earn a fixed amount..."
}
\`\`\`

### ROI Labels
\`\`\`json
{
  "overallROI": "Overall ROI (All Channels)",
  "coldEmailROI": "Cold Email ROI:",
  "roi": "ROI"  // Short form for tables
}
\`\`\`

## Step-by-Step Breakdown

The calculation breakdown has a special structure:
\`\`\`json
{
  "step1Title": "Total Emails Sent",
  "step1Description": "mailboxes × emails/day × working days",
  "step1Result": "emails"
}
\`\`\`

Each step (1-8) follows this pattern with Title, Description, and Result.

## Suggestions Structure

Suggestions have message + action pairs:
\`\`\`json
{
  "campaignLoss": "Your campaign is operating at a loss...",
  "campaignLossAction": "Reduce costs or improve conversion rates..."
}
\`\`\`

## Multi-Language Testing Checklist

When adding a new language:
- [ ] All 28 sections are present
- [ ] All keys match the English version exactly
- [ ] No keys are added or removed
- [ ] Currency symbols are NOT translated
- [ ] Technical terms are handled appropriately
- [ ] Percentages and units are preserved
- [ ] Tooltip sentences are complete
- [ ] Validation messages are clear
- [ ] File is valid JSON (no syntax errors)
- [ ] Special characters are properly escaped

## Example Complete Section

\`\`\`json
{
  "es": {
    "revenueSetup": {
      "title": "Configuración de Ingresos",
      "description": "Configure los parámetros básicos de su alcance",
      "domains": "Dominios",
      "domainsTooltip": "Número de dominios únicos que usará para enviar correos electrónicos. Usar múltiples dominios ayuda a proteger su reputación de remitente.",
      "sendingMailboxes": "Buzones de envío",
      "sendingMailboxesTooltip": "Número total de cuentas de correo electrónico que utilizará para enviar campañas. Más buzones = mayor capacidad de volumen.",
      "emailsPerDay": "Correos por día por buzón",
      "emailsPerDayTooltip": "Cuántos correos envía cada buzón diariamente. Manténgalo por debajo de 50 para mantener una buena entregabilidad y evitar filtros de spam.",
      "workingDays": "Días laborables por mes",
      "workingDaysTooltip": "Número de días hábiles por mes en los que enviará correos electrónicos. Típicamente 20-22 días (excluyendo fines de semana).",
      "sequenceSteps": "Pasos de secuencia",
      "sequenceStepsTooltip": "Número de correos de seguimiento en su secuencia. Ejemplo: 1 correo inicial + 2 seguimientos = 3 pasos en total."
    }
  }
}
\`\`\`

## Quick Start for Translators

1. Copy `TEMPLATE.json` to `[your_language_code].json`
2. Replace `[LANG_CODE]` with your language code (e.g., `es`, `fr`, `de`)
3. Replace all `[TRANSLATE]` markers with your translations
4. Delete the `INSTRUCTIONS` object
5. Validate JSON syntax
6. Submit for review

## Support

For questions or clarification on any translation strings, please refer to:
- Full documentation in `README.md`
- English reference in `en.json`
- Template with markers in `TEMPLATE.json`
