# Translation Dictionary for ROI Calculator

This directory contains translation files for the ROI Calculator application. The structure is designed to make it easy for translation agents to add support for multiple languages.

## File Structure

\`\`\`
translations/
├── README.md          # This file
├── en.json           # English (base language)
├── es.json           # Spanish (to be added)
├── fr.json           # French (to be added)
├── de.json           # German (to be added)
└── [other languages] # Add as needed
\`\`\`

## Translation Dictionary Structure

The translation dictionary is organized into logical sections that correspond to different parts of the application:

### Main Sections

1. **header** - Application header, title, and top-level navigation
2. **currencies** - Currency names for all supported currencies
3. **validation** - Error messages and validation feedback
4. **calculationBreakdown** - Step-by-step calculation explanations
5. **revenueSetup** - Revenue configuration section
6. **performanceMetrics** - Performance metrics inputs
7. **advancedMetrics** - Advanced email performance metrics
8. **costStructure** - Cost input fields
9. **salesCommission** - Sales commission configuration
10. **agencyComparison** - Agency comparison inputs
11. **coldCalling** - Cold calling channel inputs
12. **linkedInOutreach** - LinkedIn outreach channel inputs
13. **referralProgram** - Referral program channel inputs
14. **suggestions** - Smart suggestions and warnings
15. **keyMetrics** - Key performance indicators display
16. **salesPerformance** - Sales funnel metrics display
17. **financialSummary** - Financial summary cards
18. **financialAnalysis** - Financial analysis metrics
19. **commissionImpact** - Commission impact analysis
20. **agencyComparisonPanel** - Agency comparison results
21. **multiChannelPerformance** - Multi-channel metrics
22. **coldCallingPerformance** - Cold calling results
23. **linkedInPerformance** - LinkedIn results
24. **referralPerformance** - Referral program results
25. **emailPerformanceMetrics** - Email metrics display
26. **cashFlowProjections** - Cash flow projections table
27. **benchmarkWarnings** - Benchmark warning messages
28. **common** - Common words and phrases used throughout

## How to Add a New Language

1. Copy the `en.json` file and rename it with the appropriate language code (e.g., `es.json` for Spanish)
2. Translate all string values while keeping the keys unchanged
3. Maintain the JSON structure exactly as it appears in the English version
4. For tooltips and descriptions, preserve technical terminology where appropriate
5. Test the translation for proper formatting and context

## Translation Guidelines

### DO:
- Keep all JSON keys in English (don't translate the keys)
- Translate all string values to the target language
- Maintain placeholder syntax (e.g., `{value}` if present)
- Preserve formatting characters (e.g., `%`, `$`, special symbols)
- Keep technical terms consistent throughout
- Consider cultural context for numbers and currency

### DON'T:
- Don't modify the JSON structure
- Don't translate technical field names that are industry standard
- Don't remove or add new keys without updating all language files
- Don't change placeholder variables or formatting codes

## Example Translation

English (en.json):
\`\`\`json
{
  "en": {
    "header": {
      "title": "ROI Calculator",
      "subtitle": "Calculate your cold outreach campaign return on investment across multiple channels"
    }
  }
}
\`\`\`

Spanish (es.json):
\`\`\`json
{
  "es": {
    "header": {
      "title": "Calculadora de ROI",
      "subtitle": "Calcule el retorno de inversión de su campaña de contacto en frío a través de múltiples canales"
    }
  }
}
\`\`\`

## Translation Coverage

The current English translation file (`en.json`) contains:
- 400+ user-facing text strings
- 28 major sections
- Complete coverage of all UI elements including:
  - Button labels
  - Card titles and descriptions
  - Input labels and placeholders
  - Tooltips and help text
  - Error and validation messages
  - Success messages
  - Table headers
  - Section titles
  - Smart suggestions
  - Performance metrics labels

## Special Considerations

### Currency and Numbers
- Currency symbols are defined separately in the code and don't need translation
- Number formatting follows locale conventions automatically
- Percentage signs (%) should be preserved in translations

### Technical Terms
The following terms should generally remain in English or use widely-accepted translations:
- ROI (Return on Investment)
- LTV (Lifetime Value)
- CAC (Customer Acquisition Cost)
- GTM (Go-To-Market)
- ICP (Ideal Customer Profile)

### Tooltips
Tooltips contain helpful explanations and should be translated with care to:
- Maintain clarity and conciseness
- Preserve technical accuracy
- Keep the helpful, educational tone

## Supported Languages (To Be Added)

Priority languages for translation:
- [ ] Spanish (es)
- [ ] French (fr)
- [ ] German (de)
- [ ] Portuguese (pt)
- [ ] Italian (it)
- [ ] Japanese (ja)
- [ ] Chinese Simplified (zh-CN)
- [ ] Chinese Traditional (zh-TW)
- [ ] Korean (ko)
- [ ] Dutch (nl)
- [ ] Arabic (ar)
- [ ] Hindi (hi)

## Integration with Application

To integrate a new language file:
1. Add the translation file to the `translations/` directory
2. Update the language selector component to include the new language
3. Import the new translation file in the i18n configuration
4. Test all UI elements with the new language

## Quality Assurance

Before submitting a translation:
- [ ] All strings are translated (no English remains except technical terms)
- [ ] JSON syntax is valid (no syntax errors)
- [ ] All keys from en.json are present
- [ ] No extra keys are added
- [ ] Formatting codes and placeholders are preserved
- [ ] Text fits within UI constraints (test with actual UI)
- [ ] Technical terminology is accurate
- [ ] Tone and voice are consistent

## Contributing

When contributing translations:
1. Create a new branch for your translation
2. Add your language file
3. Update this README with your language in the supported languages list
4. Submit a pull request with a description of the translation
5. Include screenshots if UI layout is affected by text length

## Contact

For questions about translations or to contribute a new language, please contact the development team.
