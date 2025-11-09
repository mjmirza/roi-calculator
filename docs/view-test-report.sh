#!/bin/bash

echo "================================================"
echo "  Multi-Language Stress Test Report Viewer"
echo "================================================"
echo ""

# Find the most recent HTML report
LATEST_REPORT=$(ls -t test-reports/ml-test-report-*.html 2>/dev/null | head -1)

if [ -z "$LATEST_REPORT" ]; then
    echo "❌ No test reports found!"
    echo ""
    echo "Run the tests first:"
    echo "  node generate-ml-test-report.js"
    exit 1
fi

echo "📊 Opening latest test report:"
echo "   $LATEST_REPORT"
echo ""

# Open in default browser
if command -v open &> /dev/null; then
    # macOS
    open "$LATEST_REPORT"
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open "$LATEST_REPORT"
elif command -v start &> /dev/null; then
    # Windows
    start "$LATEST_REPORT"
else
    echo "⚠️  Could not automatically open browser"
    echo "📂 Please open manually: $LATEST_REPORT"
fi

echo ""
echo "✅ Done!"
echo ""
