# Formula Comparison Table

## Complete Formula Breakdown: Reference vs Local

### Overview Table

| Step | Reference Calculator | Local Calculator | Match? |
|------|---------------------|------------------|--------|
| **Total Emails** | `emailsPerDay × workingDays × mailboxes` | `(mailboxes × emailsPerDay × workingDays) × sequenceSteps` | ❌ Different |
| **Prospects** | `Math.floor(totalEmails ÷ sequenceSteps)` | Not calculated | ❌ Missing |
| **Delivered** | Not calculated | `Math.round(totalEmails × (1 - bounceRate ÷ 100))` | ❌ Extra step |
| **Opens** | Not calculated | `Math.round(delivered × (openRate ÷ 100))` | ❌ Extra step |
| **Clicks** | Not calculated | `Math.round(opens × (clickRate ÷ 100))` | ❌ Extra step |
| **Opportunities** | `Math.floor(prospects ÷ ratioPerReply)` | `Math.round(clicks × (positiveReplyRate ÷ 100))` | ❌ Different |
| **Meetings** | `Math.floor(opportunities × 0.76)` | `Math.round(opportunities × 0.75)` | ❌ Different |
| **Deals** | `Math.floor(meetings × (closeRate ÷ 100))` | `Math.round(meetings × (closeRate ÷ 100))` | ⚠️ Partial |
| **Revenue** | `deals × ltv` | `deals × ltv` | ✅ Match |

---

## Detailed Step-by-Step Comparison

### Step 1: Total Emails Calculation

| | Reference | Local |
|---|---|---|
| **Formula** | `totalEmailsAllMailboxes = emailsPerDay × workingDays × sendingMailboxes` | `totalEmails = (mailboxes × emailsPerDay × workingDays) × sequenceSteps` |
| **Example** | `18 × 21 × 3 = 1,134` | `(3 × 18 × 21) × 3 = 3,402` |
| **Meaning** | Total emails sent (sum of all touches) | Total touchpoints (emails × sequence multiplier) |
| **Difference** | Counts base emails only | Multiplies by sequence steps |
| **Impact** | Used as basis for prospects | Inflates funnel size by 3x (with 3 steps) |

---

### Step 2: Prospects Calculation

| | Reference | Local |
|---|---|---|
| **Formula** | `totalProspects = Math.floor(totalEmailsAllMailboxes ÷ sequenceSteps)` | Not calculated (skipped) |
| **Example** | `Math.floor(1,134 ÷ 3) = 378` | N/A |
| **Meaning** | Unique prospects contacted | N/A |
| **Difference** | Divides by sequenceSteps | Doesn't normalize for sequences |
| **Impact** | Creates proper prospect count | Missing fundamental step |

**Why this matters:**
- Reference: "1,134 emails sent to 378 unique prospects (3 emails each)"
- Local: "3,402 total emails" (no concept of unique prospects)

---

### Step 3: Bounce Handling

| | Reference | Local |
|---|---|---|
| **Formula** | Not in main calculation | `delivered = Math.round(totalEmails × (1 - bounceRate ÷ 100))` |
| **Example** | N/A | `Math.round(3,402 × 0.95) = 3,232` |
| **Meaning** | N/A | Emails successfully delivered |
| **Difference** | Ignores bounce in ROI calc | Applies 5% reduction |
| **Impact** | Full funnel | 5% funnel reduction |

---

### Step 4: Open Rate

| | Reference | Local |
|---|---|---|
| **Formula** | Not in main calculation | `opens = Math.round(delivered × (openRate ÷ 100))` |
| **Example** | N/A | `Math.round(3,232 × 0.45) = 1,454` |
| **Meaning** | N/A | Emails opened |
| **Difference** | Ignores open rate | Applies 45% conversion |
| **Impact** | Full funnel | 55% funnel reduction |

---

### Step 5: Click Rate (MAJOR ISSUE)

| | Reference | Local |
|---|---|---|
| **Formula** | Not in main calculation | `clicks = Math.round(opens × (clickRate ÷ 100))` where `clickRate = 1.0` |
| **Example** | N/A | `Math.round(1,454 × 0.01) = 15` |
| **Meaning** | N/A | Link clicks (doesn't apply to cold email) |
| **Difference** | No click tracking | Hardcoded 1% click rate |
| **Impact** | Full funnel | 99% funnel reduction! |

**This is the biggest error:**
- Click rate is for tracking link clicks in emails
- Cold email typically measures reply rate, not click rate
- 1% click rate creates massive, incorrect funnel reduction
- This single line causes ~90% discrepancy

---

### Step 6: Opportunities Calculation

| | Reference | Local |
|---|---|---|
| **Formula** | `opportunities = Math.floor(totalProspects ÷ ratioPerReply)` | `opportunities = Math.round(clicks × (conversionRate ÷ 100))` where `conversionRate = positiveReplyRate` |
| **Example** | `Math.floor(378 ÷ 300) = 1` | `Math.round(15 × 0.30) = 5` |
| **Meaning** | 1 opportunity per X prospects | X% of clicks become opportunities |
| **Operation** | Division | Multiplication |
| **Rate Used** | ratioPerReply = 300 (1/300 = 0.33%) | positiveReplyRate = 30% |
| **Difference** | Uses ratio as divisor | Uses percentage as multiplier |
| **Impact** | Conservative (0.33% conversion) | Optimistic (30% conversion = 90x higher) |

**Mathematical comparison:**
- Reference: `378 prospects ÷ 300 = 1.26 → 1 opportunity`
- Local: `15 clicks × 30% = 4.5 → 5 opportunities`

**Rate comparison:**
- Reference: 1/300 = 0.33% conversion rate
- Local: 30% conversion rate (after already losing 99% to click rate)

---

### Step 7: Meetings Calculation

| | Reference | Local |
|---|---|---|
| **Formula** | `meetings = Math.floor(opportunities × 0.76)` | `meetings = Math.round(opportunities × 0.75)` |
| **Example** | `Math.floor(1 × 0.76) = 0` | `Math.round(5 × 0.75) = 4` |
| **Rate** | 76% | 75% |
| **Rounding** | Floor (always down) | Round (standard) |
| **Difference** | 1% rate difference + different rounding | |
| **Impact** | More conservative | More optimistic |

---

### Step 8: Deals Calculation

| | Reference | Local |
|---|---|---|
| **Formula** | `deals = Math.floor(meetings × (closeRate ÷ 100))` | `deals = Math.round(meetings × (closeRate ÷ 100))` |
| **Example** | `Math.floor(0 × 0.70) = 0` | `Math.round(4 × 0.70) = 3` |
| **Rate** | closeRate (same) | closeRate (same) |
| **Rounding** | Floor (always down) | Round (standard) |
| **Difference** | Rounding method only | |
| **Impact** | Conservative | Optimistic |

---

### Step 9: Revenue Calculation

| | Reference | Local |
|---|---|---|
| **Formula** | `revenue = deals × ltv` | `revenue = deals × ltv` |
| **Example** | `0 × $5,000 = $0` | `3 × $5,000 = $15,000` |
| **Difference** | None (same formula) | |
| **Impact** | Same IF deals match | |

---

## Complete Calculation Flow Comparison

### Reference Calculator Flow:
\`\`\`
Input: 3 mailboxes, 18 emails/day, 21 days, 3 steps, 300 ratio, 70% close

Step 1: totalEmailsAllMailboxes
        18 × 21 × 3 = 1,134 emails

Step 2: totalProspects
        floor(1,134 ÷ 3) = floor(378) = 378 prospects

Step 3: opportunities
        floor(378 ÷ 300) = floor(1.26) = 1 opportunity

Step 4: meetings
        floor(1 × 0.76) = floor(0.76) = 0 meetings

Step 5: deals
        floor(0 × 0.70) = floor(0) = 0 deals

Step 6: revenue
        0 × $5,000 = $0
\`\`\`

### Local Calculator Flow:
\`\`\`
Input: 3 mailboxes, 18 emails/day, 21 days, 3 steps, 300 ratio, 70% close

Step 1: emailsPerMonth
        3 × 18 × 21 = 1,134

Step 2: totalEmails
        1,134 × 3 = 3,402 emails

Step 3: delivered
        round(3,402 × 0.95) = 3,232 delivered

Step 4: opens
        round(3,232 × 0.45) = 1,454 opens

Step 5: clicks
        round(1,454 × 0.01) = 15 clicks

Step 6: opportunities
        round(15 × 0.30) = 5 opportunities

Step 7: meetings
        round(5 × 0.75) = 4 meetings

Step 8: deals
        round(4 × 0.70) = 3 deals

Step 9: revenue
        3 × $5,000 = $15,000
\`\`\`

---

## Conversion Rate Comparison

### Reference Calculator Conversion Rates:

| From | To | Formula | Rate | Example |
|------|----|----|------|---------|
| Emails | Prospects | `emails ÷ steps` | 1 per sequence | 1,134 → 378 (33%) |
| Prospects | Opportunities | `prospects ÷ ratio` | 1/300 | 378 → 1 (0.26%) |
| Opportunities | Meetings | `opps × 0.76` | 76% | 1 → 0 (0%) |
| Meetings | Deals | `meetings × close%` | 70% | 0 → 0 |

**Overall: 1,134 emails → 0 deals = 0% conversion**

### Local Calculator Conversion Rates:

| From | To | Formula | Rate | Example |
|------|----|----|------|---------|
| Emails | Delivered | `emails × 95%` | 95% | 3,402 → 3,232 (95%) |
| Delivered | Opens | `delivered × 45%` | 45% | 3,232 → 1,454 (45%) |
| Opens | Clicks | `opens × 1%` | 1% | 1,454 → 15 (1%) |
| Clicks | Opportunities | `clicks × 30%` | 30% | 15 → 5 (30%) |
| Opportunities | Meetings | `opps × 75%` | 75% | 5 → 4 (75%) |
| Meetings | Deals | `meetings × 70%` | 70% | 4 → 3 (70%) |

**Overall: 3,402 emails → 3 deals = 0.088% conversion**

---

## Compounding Impact Analysis

### Reference: Simple Multiplier Chain
\`\`\`
1,134 × (1/3) × (1/300) × 0.76 × 0.70 = 0.66 → 0 deals
                ↑         ↑      ↑      ↑
            prospects   opps   mtgs   deals
\`\`\`

### Local: Complex Multi-Stage Funnel
\`\`\`
3,402 × 0.95 × 0.45 × 0.01 × 0.30 × 0.75 × 0.70 = 2.41 → 2-3 deals
         ↑      ↑      ↑      ↑      ↑      ↑
      deliv   open   click   opp   mtgs   deals
\`\`\`

**Key differences in compounding:**
1. Local starts with 3x more emails (3,402 vs 1,134)
2. Local applies 6 conversion steps vs Reference's 3
3. Despite more steps, Local's 30% opportunity conversion is 90x higher than Reference's 0.33%
4. The 1% click rate in Local creates massive reduction but is offset by inflated starting point

---

## Rounding Impact Analysis

### With 100.5 opportunities:

| Method | Formula | Result | Difference |
|--------|---------|--------|------------|
| Reference | `Math.floor(100.5)` | 100 | Baseline |
| Local | `Math.round(100.5)` | 101 | +1% |

### With 100.4 opportunities:

| Method | Formula | Result | Difference |
|--------|---------|--------|------------|
| Reference | `Math.floor(100.4)` | 100 | Baseline |
| Local | `Math.round(100.4)` | 100 | 0% |

**Average impact:** Math.round() produces ~0.5% higher results on average

**Compounded through funnel:** 0.5% per step × 3 steps = ~1.5% optimistic bias

---

## Parameter Usage Comparison

| Parameter | Reference Uses? | Local Uses? | Purpose |
|-----------|----------------|-------------|---------|
| mailboxes | ✅ Yes | ✅ Yes | Calculate total email volume |
| emailsPerDay | ✅ Yes | ✅ Yes | Calculate total email volume |
| workingDays | ✅ Yes | ✅ Yes | Calculate total email volume |
| sequenceSteps | ✅ Yes (divisor) | ✅ Yes (multiplier) | **OPPOSITE operations** |
| ratioPerReply | ✅ Yes (divisor) | ❌ No | Reference: calculate opportunities |
| closeRate | ✅ Yes | ✅ Yes | Calculate deals from meetings |
| ltv | ✅ Yes | ✅ Yes | Calculate revenue |
| bounceRate | ❌ No | ✅ Yes | Local: reduce funnel |
| openRate | ❌ No | ✅ Yes | Local: reduce funnel |
| replyRate | ❌ No | ⚠️ Partial | Local: separate calculation |
| positiveReplyRate | ❌ No | ✅ Yes | Local: opportunity conversion |
| clickRate | ❌ No | ✅ Yes (hardcoded 1%) | **Local error: shouldn't exist** |

---

## Key Insights

### 1. Sequence Steps is Backwards
- **Reference:** Divides by sequenceSteps (correct - normalizes to unique prospects)
- **Local:** Multiplies by sequenceSteps (wrong - inflates funnel)
- **Impact:** 3x difference with 3 sequence steps

### 2. Click Rate Doesn't Belong
- **Reference:** Doesn't use click rate (correct for cold email)
- **Local:** Applies 1% click rate (wrong - causes 99% reduction)
- **Impact:** Massive funnel reduction that shouldn't exist

### 3. Conversion Math is Different
- **Reference:** Division by ratio (prospects ÷ 300 = 0.33% conversion)
- **Local:** Multiplication by percentage (clicks × 30% conversion)
- **Impact:** 90x difference in conversion rates

### 4. Rounding Philosophy
- **Reference:** Math.floor() = conservative, guaranteed results
- **Local:** Math.round() = expected, average results
- **Impact:** ~1-2% optimistic bias in Local

### 5. Meeting Conversion
- **Reference:** 76%
- **Local:** 75%
- **Impact:** Minimal (1% difference)

---

## Recommendation Summary

**Use Reference methodology:**
1. ✅ Divide by sequenceSteps to get prospects
2. ✅ Divide prospects by ratioPerReply for opportunities
3. ✅ Use Math.floor() throughout
4. ✅ Use 76% meeting conversion
5. ❌ Don't use click rate
6. ❌ Don't use bounceRate in main ROI calculation
7. ❌ Don't use openRate in main ROI calculation
8. ❌ Don't use positiveReplyRate in opportunity calculation

This creates a simple, conservative, accurate calculator that matches the production version.
