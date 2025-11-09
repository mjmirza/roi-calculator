"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageSelector } from "@/components/language/LanguageSelector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  InfoIcon,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  DollarSign,
  Shuffle,
  XCircle,
  Calculator,
  Info,
  Phone,
  Linkedin,
  UserPlus,
  Lightbulb,
  Percent,
  Building2,
  Users,
  BarChart3,
  Mail,
} from "lucide-react"

const CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar", rate: 1.0 },
  EUR: { symbol: "€", name: "Euro", rate: 0.92 },
  GBP: { symbol: "£", name: "British Pound", rate: 0.79 },
  JPY: { symbol: "¥", name: "Japanese Yen", rate: 149.5 },
  CNY: { symbol: "¥", name: "Chinese Yuan", rate: 7.24 },
  AUD: { symbol: "A$", name: "Australian Dollar", rate: 1.53 },
  CAD: { symbol: "C$", name: "Canadian Dollar", rate: 1.36 },
  CHF: { symbol: "CHF", name: "Swiss Franc", rate: 0.88 },
  INR: { symbol: "₹", name: "Indian Rupee", rate: 83.12 },
  SGD: { symbol: "S$", name: "Singapore Dollar", rate: 1.34 },
  AED: { symbol: "د.إ", name: "UAE Dirham", rate: 3.67 },
} as const

// Corporate tax rates by country (2024-2025 data)
const CORPORATE_TAX_RATES = {
  USD: 0.21,    // USA: 21%
  EUR: 0.299,   // Germany: 29.9%
  GBP: 0.25,    // UK: 25%
  JPY: 0.3062,  // Japan: 30.62%
  CNY: 0.25,    // China: 25%
  AUD: 0.30,    // Australia: 30%
  CAD: 0.265,   // Canada: 26.5% (average)
  CHF: 0.144,   // Switzerland: 14.4%
  INR: 0.25,    // India: 25% (standard rate)
  SGD: 0.17,    // Singapore: 17%
  AED: 0.09,    // UAE: 9% (above AED 375k threshold)
} as const

type CurrencyCode = keyof typeof CURRENCIES

export default function ROICalculator() {
  const { t } = useLanguage()
  const [isClient, setIsClient] = useState(false)

  const [enableEmailMetrics, setEnableEmailMetrics] = useState(true)
  const [enableAdvanced, setEnableAdvanced] = useState(false)
  const [enableAgency, setEnableAgency] = useState(false)
  const [enableCommission, setEnableCommission] = useState(false)
  const [enableColdCalling, setEnableColdCalling] = useState(false)
  const [enableLinkedIn, setEnableLinkedIn] = useState(false)
  const [enableReferrals, setEnableReferrals] = useState(false)

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showAgencyComparison, setShowAgencyComparison] = useState(false)
  const [showCommission, setShowCommission] = useState(false)
  const [showColdCalling, setShowColdCalling] = useState(false)
  const [showLinkedIn, setShowLinkedIn] = useState(false)
  const [showReferrals, setShowReferrals] = useState(false)

  const [showCalculationBreakdown, setShowCalculationBreakdown] = useState(false)

  const [currency, setCurrency] = useState<CurrencyCode>("USD")
  const [enableTax, setEnableTax] = useState(false)

  // Commission tracking state
  const [commissionType, setCommissionType] = useState<"percentage" | "flat">("percentage")
  const [commissionRate, setCommissionRate] = useState(10) // 10% default
  const [commissionFlat, setCommissionFlat] = useState(500) // $500 per deal default

  const [callsPerDay, setCallsPerDay] = useState(50)
  const [callConnectRate, setCallConnectRate] = useState(30)
  const [callToMeetingRate, setCallToMeetingRate] = useState(15)
  const [callingDaysPerMonth, setCallingDaysPerMonth] = useState(21)
  const [callingSoftwareCost, setCallingSoftwareCost] = useState(200)
  const [callerSalaryCost, setCallerSalaryCost] = useState(4000)

  const [linkedInConnectionsPerDay, setLinkedInConnectionsPerDay] = useState(30)
  const [linkedInAcceptRate, setLinkedInAcceptRate] = useState(25)
  const [linkedInReplyRate, setLinkedInReplyRate] = useState(10)
  const [linkedInMeetingRate, setLinkedInMeetingRate] = useState(20)
  const [linkedInToolCost, setLinkedInToolCost] = useState(100)
  const [linkedInManagerCost, setLinkedInManagerCost] = useState(3500)

  const [referralsPerMonth, setReferralsPerMonth] = useState(10)
  const [referralConversionRate, setReferralConversionRate] = useState(40)
  const [referralIncentiveCost, setReferralIncentiveCost] = useState(500)
  const [referralProgramCost, setReferralProgramCost] = useState(1000)

  // Revenue Setup
  const [domains, setDomains] = useState(20)
  const [mailboxes, setMailboxes] = useState(40)
  const [emailsPerDay, setEmailsPerDay] = useState(18)
  const [workingDays, setWorkingDays] = useState(21)
  const [sequenceSteps, setSequenceSteps] = useState(3)
  const [ratioPerReply, setRatioPerReply] = useState(300)
  const [closeRate, setCloseRate] = useState(70)

  // Performance Metrics
  const [openRate, setOpenRate] = useState(45)
  const [replyRate, setReplyRate] = useState(2)
  const [positiveReplyRate, setPositiveReplyRate] = useState(30)
  const [meetingBookRate, setMeetingBookRate] = useState(50)
  const [bounceRate, setBounceRate] = useState(5)
  const [unsubscribeRate, setUnsubscribeRate] = useState(1)
  const [ltv, setLtv] = useState(5000) // Use LTV for revenue calculations
  const [salesCycleLength, setSalesCycleLength] = useState(30)
  const [churnRate, setChurnRate] = useState(5)

  // Cost Structure
  const [domainCost, setDomainCost] = useState(0)
  const [mailboxCost, setMailboxCost] = useState(0)
  const [deliveryCost, setDeliveryCost] = useState(0)
  const [softwareCost, setSoftwareCost] = useState(0)
  const [engineerCost, setEngineerCost] = useState(5800)

  const [warmupCost, setWarmupCost] = useState(0)
  const [dataProviderCost, setDataProviderCost] = useState(0)
  const [copywriterCost, setCopywriterCost] = useState(0)

  const [agencySetupFee, setAgencySetupFee] = useState(5000)
  const [agencyMonthlyFee, setAgencyMonthlyFee] = useState(8000)
  const [agencyPerLeadFee, setAgencyPerLeadFee] = useState(150)

  const [calculations, setCalculations] = useState({
    emailsPerMonth: 0,
    totalEmails: 0,
    prospects: 0,
    leads: 0,
    opportunities: 0, // Declared opportunities
    meetings: 0,
    deals: 0,
    revenue: 0,
    totalCost: 0,
    costPerMeeting: 0,
    cac: 0,
    roi: 0,
    ltvCacRatio: 0,
    emailsOpened: 0,
    emailsReplied: 0,
    positiveReplies: 0,
    meetingsBooked: 0, // meetingsBooked was undeclared, this fixes it.
    emailsBounced: 0,
    unsubscribes: 0,
    effectiveReach: 0,
    monthsToBreakeven: 0,
    annualRevenue: 0,
    annualProfit: 0,
    paybackPeriod: 0,
    agencyTotalCost: 0,
    agencyCostPerLead: 0,
    agencyROI: 0,
    costSavingsVsAgency: 0,
    commissionCost: 0,
    totalCostWithCommission: 0,
    roiWithCommission: 0,
    cacWithCommission: 0,
    profitWithoutCommission: 0,
    profitWithCommission: 0,
    callsPerMonth: 0,
    callConnections: 0,
    callMeetings: 0,
    callDeals: 0,
    callRevenue: 0,
    callCost: 0,
    callROI: 0,
    callCAC: 0,
    linkedInConnectionsPerMonth: 0,
    linkedInAccepted: 0,
    linkedInReplies: 0,
    linkedInMeetings: 0,
    linkedInDeals: 0,
    linkedInRevenue: 0,
    linkedInCost: 0,
    linkedInROI: 0,
    linkedInCAC: 0,
    referralMeetings: 0,
    referralDeals: 0,
    referralRevenue: 0,
    referralCost: 0,
    referralROI: 0,
    referralCAC: 0,
    totalMeetingsAllChannels: 0,
    totalDealsAllChannels: 0,
    totalRevenueAllChannels: 0,
    totalCostAllChannels: 0,
    combinedROI: 0,
    combinedCAC: 0,
    isValid: false,
    missingFields: [] as string[],
  })

  const [prevROI, setPrevROI] = useState(0)
  const [isValidated, setIsValidated] = useState(false) // New state to track validation

  const triggerWarning = () => {
    const element = document.getElementById("roi-card")
    if (element) {
      element.classList.add("animate-shake")
      setTimeout(() => {
        element.classList.remove("animate-shake")
      }, 500)
    }
  }

  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem("roiCalculatorData")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setDomains(data.domains ?? 20)
        setMailboxes(data.mailboxes ?? 40)
        setEmailsPerDay(data.emailsPerDay ?? 18)
        setWorkingDays(data.workingDays ?? 21)
        setSequenceSteps(data.sequenceSteps ?? 3)
        setRatioPerReply(data.ratioPerReply ?? 300)
        setCloseRate(data.closeRate ?? 70)
        setLtv(data.ltv ?? 5000)
        // Removed avgDealSize load
        setDomainCost(data.domainCost ?? 0)
        setMailboxCost(data.mailboxCost ?? 0)
        setDeliveryCost(data.deliveryCost ?? 0)
        setSoftwareCost(data.softwareCost ?? 0)
        setEngineerCost(data.engineerCost ?? 5800)
        setShowAdvanced(data.showAdvanced ?? false)
        setShowAgencyComparison(data.showAgencyComparison ?? false)
        setOpenRate(data.openRate ?? 45)
        setReplyRate(data.replyRate ?? 2)
        setPositiveReplyRate(data.positiveReplyRate ?? 30)
        setMeetingBookRate(data.meetingBookRate ?? 50)
        setBounceRate(data.bounceRate ?? 5)
        setUnsubscribeRate(data.unsubscribeRate ?? 1)
        // Removed avgDealSize load
        setSalesCycleLength(data.salesCycleLength ?? 30)
        setChurnRate(data.churnRate ?? 5)
        setWarmupCost(data.warmupCost ?? 0)
        setDataProviderCost(data.dataProviderCost ?? 0)
        setCopywriterCost(data.copywriterCost ?? 0)
        setAgencySetupFee(data.agencySetupFee ?? 5000)
        setAgencyMonthlyFee(data.agencyMonthlyFee ?? 8000)
        setAgencyPerLeadFee(data.agencyPerLeadFee ?? 150)
        setCurrency(data.currency ?? "USD")
        setEnableTax(data.enableTax ?? false)
        // Load commission state
        setCommissionType(data.commissionType ?? "percentage")
        setCommissionRate(data.commissionRate ?? 10)
        setCommissionFlat(data.commissionFlat ?? 500)
        // Load commission visibility state
        setShowCommission(data.showCommission ?? false)

        // Load all toggle states from localStorage
        setEnableEmailMetrics(data.enableEmailMetrics ?? true)
        setEnableAdvanced(data.enableAdvanced ?? false)
        setEnableAgency(data.enableAgency ?? false)
        setEnableCommission(data.enableCommission ?? false)
        setEnableColdCalling(data.enableColdCalling ?? false)
        setEnableLinkedIn(data.enableLinkedIn ?? false)
        setEnableReferrals(data.enableReferrals ?? false)

        // Load Cold Calling state variables
        setCallsPerDay(data.callsPerDay ?? 50)
        setCallConnectRate(data.callConnectRate ?? 30)
        setCallToMeetingRate(data.callToMeetingRate ?? 15)
        setCallingDaysPerMonth(data.callingDaysPerMonth ?? 21)
        setCallingSoftwareCost(data.callingSoftwareCost ?? 200)
        setCallerSalaryCost(data.callerSalaryCost ?? 4000)

        // Load LinkedIn Outreach state variables
        setLinkedInConnectionsPerDay(data.linkedInConnectionsPerDay ?? 30)
        setLinkedInAcceptRate(data.linkedInAcceptRate ?? 25)
        setLinkedInReplyRate(data.linkedInReplyRate ?? 10)
        setLinkedInMeetingRate(data.linkedInMeetingRate ?? 20)
        setLinkedInToolCost(data.linkedInToolCost ?? 100)
        setLinkedInManagerCost(data.linkedInManagerCost ?? 3500)

        // Load Referral Program state variables
        setReferralsPerMonth(data.referralsPerMonth ?? 10)
        setReferralConversionRate(data.referralConversionRate ?? 40)
        setReferralIncentiveCost(data.referralIncentiveCost ?? 500)
        setReferralProgramCost(data.referralProgramCost ?? 1000)
      } catch (e) {
        console.error("Failed to load saved data", e)
      }
    }
  }, [])

  useEffect(() => {
    if (!isClient) return
    const data = {
      domains,
      mailboxes,
      emailsPerDay,
      workingDays,
      sequenceSteps,
      ratioPerReply,
      closeRate,
      ltv,
      // avgDealSize removed
      domainCost,
      mailboxCost,
      deliveryCost,
      softwareCost,
      engineerCost,
      showAdvanced,
      showAgencyComparison,
      openRate,
      replyRate,
      positiveReplyRate,
      meetingBookRate,
      bounceRate,
      unsubscribeRate,
      // avgDealSize removed
      salesCycleLength,
      churnRate,
      warmupCost,
      dataProviderCost,
      copywriterCost,
      agencySetupFee,
      agencyMonthlyFee,
      agencyPerLeadFee,
      currency,
      enableTax,
      // Save commission state
      commissionType,
      commissionRate,
      commissionFlat,
      // Save commission visibility state
      showCommission,
      enableEmailMetrics,
      enableAdvanced,
      enableAgency,
      enableCommission,
      enableColdCalling,
      enableLinkedIn,
      enableReferrals,
      // Save Cold Calling state variables
      callsPerDay,
      callConnectRate,
      callToMeetingRate,
      callingDaysPerMonth,
      callingSoftwareCost,
      callerSalaryCost,
      // Save LinkedIn Outreach state variables
      linkedInConnectionsPerDay,
      linkedInAcceptRate,
      linkedInReplyRate,
      linkedInMeetingRate,
      linkedInToolCost,
      linkedInManagerCost,
      // Save Referral Program state variables
      referralsPerMonth,
      referralConversionRate,
      referralIncentiveCost,
      referralProgramCost,
    }
    localStorage.setItem("roiCalculatorData", JSON.stringify(data))
  }, [
    isClient,
    domains,
    mailboxes,
    emailsPerDay,
    workingDays,
    sequenceSteps,
    ratioPerReply,
    closeRate,
    ltv,
    domainCost,
    mailboxCost,
    deliveryCost,
    softwareCost,
    engineerCost,
    showAdvanced,
    showAgencyComparison,
    openRate,
    replyRate,
    positiveReplyRate,
    meetingBookRate,
    bounceRate,
    unsubscribeRate,
    // avgDealSize removed
    salesCycleLength,
    churnRate,
    warmupCost,
    dataProviderCost,
    copywriterCost,
    agencyMonthlyFee,
    agencyPerLeadFee,
    agencySetupFee, // Added missing dependency
    // Include commission dependencies
    commissionType,
    commissionRate,
    commissionFlat,
    showCommission,
    // Include all toggle and new channel dependencies
    enableEmailMetrics,
    enableAdvanced,
    enableAgency,
    enableCommission,
    enableColdCalling,
    enableLinkedIn,
    enableReferrals,
    callsPerDay,
    callConnectRate,
    callToMeetingRate,
    callingDaysPerMonth,
    callingSoftwareCost,
    callerSalaryCost,
    linkedInConnectionsPerDay,
    linkedInAcceptRate,
    linkedInReplyRate,
    linkedInMeetingRate,
    linkedInToolCost,
    linkedInManagerCost,
    referralsPerMonth,
    referralConversionRate,
    referralIncentiveCost,
    referralProgramCost,
    currency,
    enableTax,
  ])

  useEffect(() => {
    const validateRequiredFields = () => {
      const missing: string[] = []
      if (mailboxes < 1) missing.push(t("validation.sendingMailboxesMin"))
      if (emailsPerDay < 1) missing.push(t("validation.emailsPerDayMin"))
      if (workingDays < 1) missing.push(t("validation.workingDaysMin"))
      if (ratioPerReply < 1) missing.push(t("validation.ratioPerReplyMin"))
      if (closeRate < 1) missing.push(t("validation.closeRateMin"))
      // Updated validation to use LTV
      if (ltv < 1) missing.push(t("validation.ltvMin"))

      return {
        isValid: missing.length === 0,
        missingFields: missing,
      }
    }

    const validation = validateRequiredFields()

    setCalculations((prev) => ({
      ...prev,
      isValid: validation.isValid,
      missingFields: validation.missingFields,
    }))
    setIsValidated(validation.isValid) // Update validation state

    // Cold Email Calculations - Using Advanced Metrics
    // Step 1: Total emails sent across all mailboxes
    const totalEmailsAllMailboxes = mailboxes * emailsPerDay * workingDays
    const emailsPerMonth = emailsPerDay * workingDays  // PER MAILBOX (not total!)
    const totalEmails = totalEmailsAllMailboxes  // Total across all mailboxes

    // Step 2: Account for bounces - emails actually delivered
    const delivered = Math.round(totalEmails * (1 - bounceRate / 100))

    // Step 3: Opens (using user's openRate)
    const opens = Math.round(delivered * (openRate / 100))

    // Step 4: Replies (using user's replyRate on total emails)
    const emailsReplied = Math.round(totalEmails * (replyRate / 100))

    // Step 5: Positive replies (using user's positiveReplyRate)
    const positiveReplies = Math.round(emailsReplied * (positiveReplyRate / 100))

    // Step 6: Meetings (using user's meetingBookRate, NOT hardcoded 76%!)
    const meetings = Math.round(positiveReplies * (meetingBookRate / 100))

    // Step 7: Deals closed (using user's closeRate)
    const deals = Math.round(meetings * (closeRate / 100))

    // Step 8: Revenue
    const revenue = deals * ltv

    // Legacy compatibility - calculate prospects and opportunities for backward compatibility
    const totalProspects = Math.floor(totalEmailsAllMailboxes / sequenceSteps)
    const opportunities = Math.floor(totalProspects / ratioPerReply)

    // Leads are positive replies (actual interested prospects)
    const leads = positiveReplies

    // Prospects are unique contacts
    const prospects = totalProspects

    const emailsBounced = Math.round(totalEmails * (bounceRate / 100))
    const unsubscribes = Math.round(totalEmails * (unsubscribeRate / 100))
    const effectiveReach = totalEmails - emailsBounced - unsubscribes

    const totalCost =
      domainCost +
      mailboxCost +
      deliveryCost +
      softwareCost +
      engineerCost +
      warmupCost +
      dataProviderCost +
      copywriterCost

    const costPerMeeting = meetings > 0 ? totalCost / meetings : 0
    const cac = deals > 0 ? totalCost / deals : 0
    const roi = totalCost > 0 ? ((revenue - totalCost) / totalCost) * 100 : 0
    // Updated LTV/CAC ratio to use LTV
    const ltvCacRatio = cac > 0 ? ltv / cac : 0

    const monthlyProfit = revenue - totalCost
    const annualRevenue = revenue * 12
    const annualProfit = monthlyProfit * 12
    const monthsToBreakeven = monthlyProfit > 0 ? Math.ceil(totalCost / monthlyProfit) : 0
    const paybackPeriod = cac > 0 && monthlyProfit > 0 && deals > 0 ? cac / (monthlyProfit / deals) : 0

    // Agency Comparison
    const agencyTotalCost = agencySetupFee + agencyMonthlyFee + agencyPerLeadFee * leads
    const agencyCostPerLead = leads > 0 ? agencyTotalCost / leads : 0
    const agencyROI = agencyTotalCost > 0 ? ((revenue - agencyTotalCost) / agencyTotalCost) * 100 : 0
    const costSavingsVsAgency = agencyTotalCost - totalCost

    // Commission Calculations
    // Updated commission calculation to use LTV
    const commissionCost =
      commissionType === "percentage" ? deals * ltv * (commissionRate / 100) : deals * commissionFlat
    const totalCostWithCommission = totalCost + commissionCost
    const roiWithCommission =
      totalCostWithCommission > 0 ? ((revenue - totalCostWithCommission) / totalCostWithCommission) * 100 : 0
    const cacWithCommission = deals > 0 ? totalCostWithCommission / deals : 0
    const profitWithoutCommission = revenue - totalCost
    const profitWithCommission = revenue - totalCostWithCommission

    const callsPerMonth = enableColdCalling ? callsPerDay * callingDaysPerMonth : 0
    const callConnections = Math.round(callsPerMonth * (callConnectRate / 100))
    const callMeetings = Math.round(callConnections * (callToMeetingRate / 100))
    const callDeals = Math.round(callMeetings * (closeRate / 100))
    // Updated call revenue to use LTV
    const callRevenue = callDeals * ltv
    // FIXED: Only include cost when channel is enabled
    const callCost = enableColdCalling ? callingSoftwareCost + callerSalaryCost : 0
    const callROI = callCost > 0 ? ((callRevenue - callCost) / callCost) * 100 : 0
    const callCAC = callDeals > 0 ? callCost / callDeals : 0

    const linkedInConnectionsPerMonth = enableLinkedIn ? linkedInConnectionsPerDay * workingDays : 0
    const linkedInAccepted = Math.round(linkedInConnectionsPerMonth * (linkedInAcceptRate / 100))
    const linkedInReplies = Math.round(linkedInAccepted * (linkedInReplyRate / 100))
    const linkedInMeetings = Math.round(linkedInReplies * (linkedInMeetingRate / 100))
    const linkedInDeals = Math.round(linkedInMeetings * (closeRate / 100))
    // Updated LinkedIn revenue to use LTV
    const linkedInRevenue = linkedInDeals * ltv
    // FIXED: Only include cost when channel is enabled
    const linkedInCost = enableLinkedIn ? linkedInToolCost + linkedInManagerCost : 0
    const linkedInROI = linkedInCost > 0 ? ((linkedInRevenue - linkedInCost) / linkedInCost) * 100 : 0
    const linkedInCAC = linkedInDeals > 0 ? linkedInCost / linkedInDeals : 0

    const referralMeetings = enableReferrals ? Math.round(referralsPerMonth * (referralConversionRate / 100)) : 0
    const referralDeals = Math.round(referralMeetings * (closeRate / 100))
    // Updated referral revenue to use LTV
    const referralRevenue = referralDeals * ltv
    // FIXED: Only include cost when channel is enabled
    const referralCost = enableReferrals ? referralProgramCost + referralDeals * referralIncentiveCost : 0
    const referralROI = referralCost > 0 ? ((referralRevenue - referralCost) / referralCost) * 100 : 0
    const referralCAC = referralDeals > 0 ? referralCost / referralDeals : 0

    const totalMeetingsAllChannels = meetings + callMeetings + linkedInMeetings + referralMeetings
    const totalDealsAllChannels = deals + callDeals + linkedInDeals + referralDeals
    const totalRevenueAllChannels = revenue + callRevenue + linkedInRevenue + referralRevenue
    const totalCostAllChannels = totalCost + callCost + linkedInCost + referralCost
    const combinedROI =
      totalCostAllChannels > 0 ? ((totalRevenueAllChannels - totalCostAllChannels) / totalCostAllChannels) * 100 : 0
    const combinedCAC = totalDealsAllChannels > 0 ? totalCostAllChannels / totalDealsAllChannels : 0

    // Tax calculations
    const taxRate = CORPORATE_TAX_RATES[currency]
    const netIncomeBeforeTax = totalRevenueAllChannels - totalCostAllChannels - (enableCommission ? commissionCost : 0)
    const taxAmount = enableTax && netIncomeBeforeTax > 0 ? netIncomeBeforeTax * taxRate : 0
    const netIncomeAfterTax = netIncomeBeforeTax - taxAmount
    const afterTaxROI = totalCostAllChannels > 0 ? (netIncomeAfterTax / totalCostAllChannels) * 100 : 0

    setCalculations({
      emailsPerMonth,
      totalEmails,
      prospects: prospects, // Using totalProspects from reference calculation
      leads: leads, // Leads are now positive replies
      opportunities,
      meetings,
      deals,
      revenue,
      totalCost,
      costPerMeeting,
      cac,
      roi,
      ltvCacRatio,
      emailsOpened: opens, // Assigning calculated opens
      emailsReplied, // Using calculated emailsReplied
      positiveReplies,
      meetingsBooked: meetings, // Assigning the calculated meetings to meetingsBooked
      emailsBounced,
      unsubscribes,
      effectiveReach,
      monthsToBreakeven,
      annualRevenue,
      annualProfit,
      paybackPeriod,
      agencyTotalCost,
      agencyCostPerLead,
      agencyROI,
      costSavingsVsAgency,
      // Set commission calculations
      commissionCost,
      totalCostWithCommission,
      roiWithCommission,
      cacWithCommission,
      profitWithoutCommission,
      profitWithCommission,
      callsPerMonth,
      callConnections,
      callMeetings,
      callDeals,
      callRevenue,
      callCost,
      callROI,
      callCAC,
      linkedInConnectionsPerMonth,
      linkedInAccepted,
      linkedInReplies,
      linkedInMeetings,
      linkedInDeals,
      linkedInRevenue,
      linkedInCost,
      linkedInROI,
      linkedInCAC,
      referralMeetings,
      referralDeals,
      referralRevenue,
      referralCost,
      referralROI,
      referralCAC,
      totalMeetingsAllChannels,
      totalDealsAllChannels,
      totalRevenueAllChannels,
      totalCostAllChannels,
      combinedROI,
      combinedCAC,
      taxRate,
      netIncomeBeforeTax,
      taxAmount,
      netIncomeAfterTax,
      afterTaxROI,
      isValid: validation.isValid,
      missingFields: validation.missingFields,
    })

    // Trigger animations
    if (isClient && prevROI >= 0 && roiWithCommission < 0) {
      triggerWarning()
    }
    setPrevROI(roiWithCommission)
  }, [
    isClient,
    domains,
    mailboxes,
    emailsPerDay,
    workingDays,
    sequenceSteps,
    ratioPerReply,
    closeRate,
    ltv,
    domainCost,
    mailboxCost,
    deliveryCost,
    softwareCost,
    engineerCost,
    prevROI,
    openRate,
    replyRate,
    positiveReplyRate,
    meetingBookRate,
    bounceRate,
    unsubscribeRate,
    // avgDealSize removed
    salesCycleLength,
    churnRate,
    warmupCost,
    dataProviderCost,
    copywriterCost,
    agencyMonthlyFee,
    agencyPerLeadFee,
    agencySetupFee, // Added missing dependency
    // Include commission dependencies
    commissionType,
    commissionRate,
    commissionFlat,
    showCommission,
    // Include all toggle and new channel dependencies
    enableEmailMetrics,
    enableAdvanced,
    enableAgency,
    enableCommission,
    enableColdCalling,
    enableLinkedIn,
    enableReferrals,
    callsPerDay,
    callConnectRate,
    callToMeetingRate,
    callingDaysPerMonth,
    callingSoftwareCost,
    callerSalaryCost,
    linkedInConnectionsPerDay,
    linkedInAcceptRate,
    linkedInReplyRate,
    linkedInMeetingRate,
    linkedInToolCost,
    linkedInManagerCost,
    referralsPerMonth,
    referralConversionRate,
    referralIncentiveCost,
    referralProgramCost,
    currency,
    enableTax,
  ])

  const shuffleScenario = () => {
    const scenarios = [
      {
        name: "Startup - High Touch",
        domains: 10,
        mailboxes: 20,
        emailsPerDay: 15,
        workingDays: 21,
        sequenceSteps: 5,
        ratioPerReply: 200,
        closeRate: 60,
        ltv: 8000,
        openRate: 50,
        replyRate: 3,
        positiveReplyRate: 40,
        meetingBookRate: 60,
        bounceRate: 3,
        unsubscribeRate: 0.5,
        domainCost: 15,
        mailboxCost: 5,
        deliveryCost: 100,
        softwareCost: 200,
        engineerCost: 6500,
        commissionRate: 15,
        callsPerDay: 30,
        callConnectRate: 35,
        callToMeetingRate: 20,
        linkedInConnectionsPerDay: 20,
        linkedInAcceptRate: 30,
        linkedInReplyRate: 12,
        linkedInMeetingRate: 25,
        linkedInToolCost: 80,
        linkedInManagerCost: 3000,
        referralsPerMonth: 5,
        referralConversionRate: 45,
        referralIncentiveCost: 300,
        referralProgramCost: 500,
      },
      {
        name: "Scale-up - Optimized",
        domains: 30,
        mailboxes: 60,
        emailsPerDay: 20,
        workingDays: 21,
        sequenceSteps: 4,
        ratioPerReply: 250,
        closeRate: 70,
        ltv: 6000,
        openRate: 48,
        replyRate: 2.5,
        positiveReplyRate: 35,
        meetingBookRate: 55,
        bounceRate: 4,
        unsubscribeRate: 0.8,
        domainCost: 12,
        mailboxCost: 4,
        deliveryCost: 150,
        softwareCost: 400,
        engineerCost: 7000,
        commissionRate: 12,
        callsPerDay: 60,
        callConnectRate: 30,
        callToMeetingRate: 15,
        linkedInConnectionsPerDay: 40,
        linkedInAcceptRate: 25,
        linkedInReplyRate: 10,
        linkedInMeetingRate: 20,
        linkedInToolCost: 100,
        linkedInManagerCost: 3500,
        referralsPerMonth: 10,
        referralConversionRate: 40,
        referralIncentiveCost: 500,
        referralProgramCost: 1000,
      },
      {
        name: "Enterprise - High Volume",
        domains: 50,
        mailboxes: 100,
        emailsPerDay: 25,
        workingDays: 21,
        sequenceSteps: 3,
        ratioPerReply: 350,
        closeRate: 75,
        ltv: 4000,
        openRate: 42,
        replyRate: 1.8,
        positiveReplyRate: 28,
        meetingBookRate: 50,
        bounceRate: 6,
        unsubscribeRate: 1.2,
        domainCost: 10,
        mailboxCost: 3,
        deliveryCost: 200,
        softwareCost: 600,
        engineerCost: 8000,
        commissionRate: 10,
        callsPerDay: 80,
        callConnectRate: 25,
        callToMeetingRate: 12,
        linkedInConnectionsPerDay: 50,
        linkedInAcceptRate: 20,
        linkedInReplyRate: 8,
        linkedInMeetingRate: 15,
        linkedInToolCost: 150,
        linkedInManagerCost: 4000,
        referralsPerMonth: 15,
        referralConversionRate: 35,
        referralIncentiveCost: 750,
        referralProgramCost: 1500,
      },
    ]

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]

    setDomains(scenario.domains)
    setMailboxes(scenario.mailboxes)
    setEmailsPerDay(scenario.emailsPerDay)
    setWorkingDays(scenario.workingDays)
    setSequenceSteps(scenario.sequenceSteps)
    setRatioPerReply(scenario.ratioPerReply)
    setCloseRate(scenario.closeRate)
    setLtv(scenario.ltv)

    setDomainCost(scenario.domainCost)
    setMailboxCost(scenario.mailboxCost)
    setDeliveryCost(scenario.deliveryCost)
    setSoftwareCost(scenario.softwareCost)
    setEngineerCost(scenario.engineerCost)

    setOpenRate(scenario.openRate)
    setReplyRate(scenario.replyRate)
    setPositiveReplyRate(scenario.positiveReplyRate)
    setMeetingBookRate(scenario.meetingBookRate)
    setBounceRate(scenario.bounceRate)
    setUnsubscribeRate(scenario.unsubscribeRate)

    setCommissionRate(scenario.commissionRate)

    setCallsPerDay(scenario.callsPerDay)
    setCallConnectRate(scenario.callConnectRate)
    setCallToMeetingRate(scenario.callToMeetingRate)

    setLinkedInConnectionsPerDay(scenario.linkedInConnectionsPerDay)
    setLinkedInAcceptRate(scenario.linkedInAcceptRate)
    setLinkedInReplyRate(scenario.linkedInReplyRate)
    setLinkedInMeetingRate(scenario.linkedInMeetingRate)
    setLinkedInToolCost(scenario.linkedInToolCost)
    setLinkedInManagerCost(scenario.linkedInManagerCost)

    setReferralsPerMonth(scenario.referralsPerMonth)
    setReferralConversionRate(scenario.referralConversionRate)
    setReferralIncentiveCost(scenario.referralIncentiveCost)
    setReferralProgramCost(scenario.referralProgramCost)

    setEnableAdvanced(true)
    setShowAdvanced(true)
    setEnableCommission(true)
    setShowCommission(true)
    setEnableColdCalling(true)
    setShowColdCalling(true)
    setEnableLinkedIn(true)
    setShowLinkedIn(true)
    setEnableReferrals(true)
    setShowReferrals(true)

    setShowCalculationBreakdown(true)
  }

  // Rename reset to resetToDefaults for clarity
  const resetToDefaults = () => {
    setDomains(20)
    setMailboxes(40)
    setEmailsPerDay(18)
    setWorkingDays(21)
    setSequenceSteps(3)
    setRatioPerReply(300)
    setCloseRate(70)
    setLtv(5000)
    setDomainCost(0)
    setMailboxCost(0)
    setDeliveryCost(0)
    setSoftwareCost(0)
    setEngineerCost(5800)
    setShowAdvanced(false)
    setShowAgencyComparison(false)
    setOpenRate(45)
    setReplyRate(2)
    setPositiveReplyRate(30)
    setMeetingBookRate(50)
    setBounceRate(5)
    setUnsubscribeRate(1)
    // Removed avgDealSize reset, using ltv
    setSalesCycleLength(30)
    setChurnRate(5)
    setWarmupCost(0)
    setDataProviderCost(0)
    setCopywriterCost(0)
    setAgencySetupFee(5000)
    setAgencyMonthlyFee(8000)
    setAgencyPerLeadFee(150)
    setCurrency("USD")
    setEnableTax(false)
    // Reset commission state
    setCommissionType("percentage")
    setCommissionRate(10)
    setCommissionFlat(500)
    // Reset commission visibility state
    setShowCommission(false)

    // Reset additional visibility states
    setShowColdCalling(false)
    setShowLinkedIn(false)
    setShowReferrals(false)
    setShowCalculationBreakdown(false)

    // Reset all toggle states to default
    setEnableEmailMetrics(true)
    setEnableAdvanced(false)
    setEnableAgency(false)
    setEnableCommission(false)
    setEnableColdCalling(false)
    setEnableLinkedIn(false)
    setEnableReferrals(false)

    // Reset Cold Calling state variables to default
    setCallsPerDay(50)
    setCallConnectRate(30)
    setCallToMeetingRate(15)
    setCallingDaysPerMonth(21)
    setCallingSoftwareCost(200)
    setCallerSalaryCost(4000)

    // Reset LinkedIn Outreach state variables to default
    setLinkedInConnectionsPerDay(30)
    setLinkedInAcceptRate(25)
    setLinkedInReplyRate(10)
    setLinkedInMeetingRate(20)
    setLinkedInToolCost(100)
    setLinkedInManagerCost(3500)

    // Reset Referral Program state variables to default
    setReferralsPerMonth(10)
    setReferralConversionRate(40)
    setReferralIncentiveCost(500)
    setReferralProgramCost(1000)

    localStorage.removeItem("roiCalculatorData")
  }

  const handleNumberInput = (value: string, setter: (val: number) => void) => {
    if (value === "") {
      setter(0)
    } else {
      const num = Number(value)
      if (!isNaN(num)) {
        setter(num)
      }
    }
  }

  const formatCurrency = (value: number) => {
    const currencyInfo = CURRENCIES[currency]
    // Only change the symbol, do NOT convert the value
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: currency === "JPY" ? 0 : 2,
      maximumFractionDigits: currency === "JPY" ? 0 : 2,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(Math.round(value))
  }

  const displayValue = (
    value: number | string | undefined,
    formatter?: "currency" | "percentage" | "number" | string,
  ) => {
    // Check if calculations are valid before displaying numbers
    const isDataValid = calculations.isValid // Use a local variable for clarity

    if (!isDataValid && typeof value === "number" && value !== 0) return "--" // Show '--' only if not valid and value is not zero
    if (value === undefined || value === null) return "--"
    if (typeof value === "number") {
      if (value === 0 && isDataValid) return "0" // Display 0 if valid and the value is 0
      if (formatter === "currency") return formatCurrency(value)
      if (formatter === "percentage") return `${value.toFixed(1)}%`
      if (formatter === "number") return formatNumber(value)
      // For general percentage display (like in suggestions)
      if (formatter && typeof formatter === "string" && formatter.endsWith("%")) return `${value.toFixed(1)}%`
      return value.toString()
    }
    return value
  }

  const getBenchmarkWarning = (metric: string, value: number) => {
    const benchmarks: Record<string, { min: number; max: number; unit: string }> = {
      openRate: { min: 40, max: 60, unit: "%" },
      replyRate: { min: 1, max: 5, unit: "%" },
      bounceRate: { min: 0, max: 5, unit: "%" },
      emailsPerDay: { min: 10, max: 50, unit: "" },
      closeRate: { min: 20, max: 80, unit: "%" },
      callsPerDay: { min: 40, max: 80, unit: "" },
      callConnectRate: { min: 20, max: 40, unit: "%" },
      callToMeetingRate: { min: 10, max: 20, unit: "%" },
      linkedInConnectionsPerDay: { min: 20, max: 50, unit: "" },
      linkedInAcceptRate: { min: 20, max: 40, unit: "%" },
      linkedInReplyRate: { min: 5, max: 15, unit: "%" },
      linkedInMeetingRate: { min: 15, max: 30, unit: "%" },
      referralConversionRate: { min: 30, max: 50, unit: "%" },
    }

    const benchmark = benchmarks[metric]
    if (!benchmark) return null

    if (value < benchmark.min) {
      return `Below industry average (${benchmark.min}${benchmark.unit}+)`
    }
    if (value > benchmark.max) {
      return `Above typical range (${benchmark.max}${benchmark.unit} max recommended)`
    }
    return null
  }

  const getSmartSuggestions = () => {
    const suggestions: { type: "critical" | "warning" | "info"; message: string; action: string }[] = []

    if (!calculations.isValid) return suggestions

    // Check ROI
    if (calculations.combinedROI < 0) {
      suggestions.push({
        type: "critical",
        message: t("suggestions.campaignLoss"),
        action: t("suggestions.campaignLossAction"),
      })
    }

    // Check LTV/CAC ratio
    if (calculations.combinedCAC > 0 && calculations.ltvCacRatio < 1 && calculations.ltvCacRatio > 0) {
      suggestions.push({
        type: "critical",
        message: t("suggestions.ltvCacBelow1"),
        action: t("suggestions.ltvCacBelow1Action"),
      })
    } else if (calculations.combinedCAC > 0 && calculations.ltvCacRatio < 3 && calculations.ltvCacRatio >= 1) {
      suggestions.push({
        type: "warning",
        message: t("suggestions.ltvCacBelow3"),
        action: t("suggestions.ltvCacBelow3Action"),
      })
    }

    // Check open rate (Cold Email specific)
    if (enableEmailMetrics && openRate < 40) {
      suggestions.push({
        type: "warning",
        message: `${t("suggestions.openRateLow")} (${openRate}%) ${t("suggestions.belowIndustryAverage")} (40-60%)`,
        action: t("suggestions.openRateLowAction"),
      })
    }

    // Check reply rate (Cold Email specific)
    if (enableEmailMetrics && replyRate < 1) {
      suggestions.push({
        type: "warning",
        message: `${t("suggestions.replyRateLow")} (${replyRate}%) ${t("suggestions.isVeryLow")}`,
        action: t("suggestions.replyRateLowAction"),
      })
    }

    // Check bounce rate (Cold Email specific)
    if (enableEmailMetrics && bounceRate > 5) {
      suggestions.push({
        type: "critical",
        message: `${t("suggestions.bounceRateHigh")} (${bounceRate}%) ${t("suggestions.isTooHigh")}`,
        action: t("suggestions.bounceRateHighAction"),
      })
    }

    // Check emails per day (Cold Email specific)
    if (enableEmailMetrics && emailsPerDay > 50) {
      suggestions.push({
        type: "warning",
        message: `${t("suggestions.emailsPerDayHigh")} ${emailsPerDay} ${t("suggestions.emailsPerDayPerMailboxMayTrigger")}`,
        action: t("suggestions.emailsPerDayHighAction"),
      })
    }

    // Check cold calling rates
    if (enableColdCalling) {
      if (callConnectRate < 20) {
        suggestions.push({
          type: "warning",
          message: `${t("suggestions.callConnectRateLow")} (${callConnectRate}%) ${t("suggestions.isLow")}`,
          action: t("suggestions.callConnectRateLowAction"),
        })
      }
      if (callToMeetingRate < 10) {
        suggestions.push({
          type: "warning",
          message: `${t("suggestions.callToMeetingRateLow")} (${callToMeetingRate}%) ${t("suggestions.isLow")}`,
          action: t("suggestions.callToMeetingRateLowAction"),
        })
      }
    }

    // Check LinkedIn rates
    if (enableLinkedIn) {
      if (linkedInAcceptRate < 20) {
        suggestions.push({
          type: "warning",
          message: `${t("suggestions.linkedInAcceptRateLow")} (${linkedInAcceptRate}%) ${t("suggestions.isLow")}`,
          action: t("suggestions.linkedInAcceptRateLowAction"),
        })
      }
      if (linkedInReplyRate < 5) {
        suggestions.push({
          type: "warning",
          message: `${t("suggestions.linkedInReplyRateLow")} (${linkedInReplyRate}%) ${t("suggestions.isLow")}`,
          action: t("suggestions.linkedInReplyRateLowAction"),
        })
      }
      if (linkedInMeetingRate < 15) {
        suggestions.push({
          type: "warning",
          message: `${t("suggestions.linkedInMeetingRateLow")} (${linkedInMeetingRate}%) ${t("suggestions.isLow")}`,
          action: t("suggestions.linkedInMeetingRateLowAction"),
        })
      }
    }

    // Check if costs are too high
    if (
      calculations.totalCostAllChannels > calculations.totalRevenueAllChannels &&
      calculations.totalRevenueAllChannels > 0
    ) {
      const costBreakdown = [
        { name: t("costItems.gtmEngineer"), value: engineerCost },
        { name: t("costItems.software"), value: softwareCost },
        { name: t("costItems.mailboxes"), value: mailboxCost },
        { name: t("costItems.deliverability"), value: deliveryCost },
        { name: t("costItems.dataProvider"), value: dataProviderCost },
        { name: t("costItems.copywriter"), value: copywriterCost },
        { name: t("costItems.commission"), value: calculations.commissionCost },
        { name: t("costItems.coldCallingSoftware"), value: callingSoftwareCost },
        { name: t("costItems.callerSalary"), value: callerSalaryCost },
        { name: t("costItems.linkedInTool"), value: linkedInToolCost },
        { name: t("costItems.linkedInManager"), value: linkedInManagerCost },
        { name: t("costItems.referralProgram"), value: referralProgramCost },
        { name: t("costItems.referralIncentives"), value: calculations.referralCost - referralProgramCost },
      ]
        .filter((c) => c.value > 0)
        .sort((a, b) => b.value - a.value)

      if (costBreakdown.length > 0) {
        suggestions.push({
          type: "info",
          message: `${t("suggestions.highestCost")} ${costBreakdown[0].name} (${formatCurrency(costBreakdown[0].value)})`,
          action: t("suggestions.highestCostAction"),
        })
      }
    }

    // Check if agency would be better
    if (showAgencyComparison && enableAgency && calculations.costSavingsVsAgency < 0) {
      suggestions.push({
        type: "info",
        message: `${t("suggestions.agencySavings")} ${formatCurrency(Math.abs(calculations.costSavingsVsAgency))}/month`,
        action: t("suggestions.agencySavingsAction"),
      })
    }

    // Check close rate (applies to all channels)
    if (closeRate < 20) {
      suggestions.push({
        type: "warning",
        message: `${t("suggestions.closeRateLow")} (${closeRate}%) ${t("suggestions.isVeryLow")}`,
        action: t("suggestions.closeRateLowAction"),
      })
    }

    return suggestions
  }

  const suggestions = getSmartSuggestions()
  const hasCriticalIssues = suggestions.some((s) => s.type === "critical")
  // const isDataValid = calculations.isValid // Use the calculated isValid property

  // Cash flow projections
  const getCashFlowProjections = () => {
    const projections = []
    for (let i = 1; i <= 6; i++) {
      // Calculate cumulative values for this month
      const cumulativeRevenue = calculations.totalRevenueAllChannels * i
      const cumulativeBaseCost = calculations.totalCostAllChannels * i

      // Add commission costs if enabled
      const cumulativeCommissionCost = enableCommission ? calculations.commissionCost * i : 0

      // Calculate net cash flow (revenue - base costs - commission)
      const netCashFlow = cumulativeRevenue - cumulativeBaseCost - cumulativeCommissionCost

      projections.push({
        month: i,
        revenue: cumulativeRevenue,
        baseCost: cumulativeBaseCost,
        commissionCost: cumulativeCommissionCost,
        totalCost: cumulativeBaseCost + cumulativeCommissionCost,
        netCashFlow: netCashFlow,
        profitable: netCashFlow >= 0,
      })
    }
    return projections
  }

  // Helper component for labels with tooltips
  const LabelWithTooltip = ({
    htmlFor,
    label,
    tooltip,
    warning,
    required,
    minValue,
  }: {
    htmlFor: string
    label: string
    tooltip: string
    warning?: string | null
    required?: boolean
    minValue?: number
  }) => (
    <div className="flex items-start gap-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium flex-1">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
        {minValue !== undefined && <span className="text-xs text-muted-foreground ml-1">({t("validation.minLabel")}: {minValue})</span>}
        {warning && (
          <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500 mt-1">
            <AlertTriangle className="h-3 w-3" />
            {warning}
          </span>
        )}
      </Label>
      <div className="group relative">
        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
        <div className="absolute right-0 top-6 w-64 p-3 bg-popover text-popover-foreground text-xs rounded-md border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
          {tooltip}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("header.title")}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t("header.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <Select value={currency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder={t("header.selectCurrency")} />
                </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CURRENCIES).map(([code, info]) => (
                      <SelectItem key={code} value={code}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">{info.symbol}</span>
                          <span>{code}</span>
                          <span className="text-xs text-muted-foreground">- {t(`currencies.${code}`)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              <div className="flex items-center gap-2 border rounded-md px-3 py-1.5 bg-background">
                <label htmlFor="tax-toggle" className="text-sm font-medium cursor-pointer">
                  {t("header.includeTax")} ({(CORPORATE_TAX_RATES[currency] * 100).toFixed(1)}%)
                </label>
                <Switch id="tax-toggle" checked={enableTax} onCheckedChange={setEnableTax} />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={shuffleScenario}
                className="gap-2 transition-all hover:scale-105 bg-transparent"
                title={t("header.shuffleScenarioTooltip")}
              >
                <Shuffle className="h-4 w-4" />
                {t("header.shuffleScenario")}
              </Button>
              {/* Removed duplicate handleReset function - calling resetToDefaults directly from button */}
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefaults}
                className="gap-2 transition-all hover:scale-105 bg-transparent"
              >
                <RotateCcw className="h-4 w-4" />
                {t("header.reset")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[420px_1fr] gap-6 items-start">
          <div className="space-y-6">
            {!isValidated && calculations.missingFields.length > 0 && (
              <Card className="border-2 border-red-600/50 bg-red-50/50 dark:bg-red-950/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <CardTitle className="text-base">{t("validation.requiredFieldsMissing")}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {t("validation.fillRequiredFields")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {calculations.missingFields.map((field, idx) => (
                      <li key={idx} className="text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                        <XCircle className="h-3 w-3" />
                        {field}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Calculation Breakdown section */}
            <Card className="mb-6 border-2 border-blue-500/20 bg-blue-50/5">
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setShowCalculationBreakdown(!showCalculationBreakdown)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calculator className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg break-words">{t("calculationBreakdown.title")}</CardTitle>
                    </div>
                    <CardDescription className="text-xs">{t("calculationBreakdown.subtitle")}</CardDescription>
                  </div>
                  <div className="flex-shrink-0">
                    {showCalculationBreakdown ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              {showCalculationBreakdown && (
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                        1
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{t("calculationBreakdown.step1Title")}</div>
                        <div className="text-muted-foreground">
                          {t("calculationBreakdown.step1Description")}
                        </div>
                        <div className="font-mono text-lg mt-2 text-blue-600">
                          = {displayValue(calculations.totalEmails, "number")} {t("calculationBreakdown.step1Result")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                        2
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{t("calculationBreakdown.step2Title")}</div>
                        <div className="text-muted-foreground">
                          {t("calculationBreakdown.step2Description")}
                        </div>
                        <div className="font-mono text-lg mt-2 text-blue-600">
                          = {displayValue(calculations.emailsOpened, "number")} {t("calculationBreakdown.step2Result")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                        3
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{t("calculationBreakdown.step3Title")}</div>
                        <div className="text-muted-foreground">
                          {t("calculationBreakdown.step3Description")}
                        </div>
                        <div className="font-mono text-lg mt-2 text-blue-600">
                          = {displayValue(calculations.emailsReplied, "number")} {t("calculationBreakdown.step3Result")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                        4
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{t("calculationBreakdown.step4Title")}</div>
                        <div className="text-muted-foreground">
                          {t("calculationBreakdown.step4Description")}
                        </div>
                        <div className="font-mono text-lg mt-2 text-blue-600">
                          = {displayValue(calculations.positiveReplies, "number")} {t("calculationBreakdown.step4Result")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                        5
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{t("calculationBreakdown.step5Title")}</div>
                        <div className="text-muted-foreground">
                          {t("calculationBreakdown.step5Description")} {ratioPerReply} {t("calculationBreakdown.step5Description2")}
                        </div>
                        <div className="font-mono text-lg mt-2 text-blue-600">
                          = {displayValue(calculations.opportunities, "number")} {t("calculationBreakdown.step5Result")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                        6
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{t("calculationBreakdown.step6Title")}</div>
                        <div className="text-muted-foreground">
                          {t("calculationBreakdown.step6Description")}
                        </div>
                        <div className="font-mono text-lg mt-2 text-blue-600">
                          = {displayValue(calculations.meetings, "number")} {t("calculationBreakdown.step6Result")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                        7
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{t("calculationBreakdown.step7Title")}</div>
                        <div className="text-muted-foreground">{t("calculationBreakdown.step7Description")}</div>
                        <div className="font-mono text-lg mt-2 text-blue-600">
                          = {displayValue(calculations.deals, "number")} {t("calculationBreakdown.step7Result")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-green-50 border-2 border-green-500/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-xs">
                        8
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1 text-green-700">{t("calculationBreakdown.step8Title")}</div>
                        <div className="text-muted-foreground">
                          {t("calculationBreakdown.step8Description")}
                        </div>
                        <div className="font-mono text-2xl mt-2 text-green-600 font-bold">
                          {displayValue(calculations.revenue, "currency")}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                          <div className="font-semibold mb-1">{t("calculationBreakdown.understandingTitle")}</div>
                          <div className="space-y-1 text-blue-800">
                            <div>
                              • {t("calculationBreakdown.understandingPoint1")}
                            </div>
                            <div>
                              • {t("calculationBreakdown.understandingPoint2")}
                            </div>
                            <div>
                              • {t("calculationBreakdown.understandingPoint3")}
                            </div>
                            <div>• {t("calculationBreakdown.understandingPoint4")}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Revenue Setup */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">{t("revenueSetup.title")}</CardTitle>
                <CardDescription>{t("revenueSetup.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="domains"
                    label={t("revenueSetup.domains")}
                    tooltip={t("revenueSetup.domainsTooltip")}
                  />
                  <Input
                    id="domains"
                    type="number"
                    value={domains || ""}
                    onChange={(e) => handleNumberInput(e.target.value, setDomains)}
                    className="font-mono transition-all focus:ring-2"
                  />
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="mailboxes"
                    label={t("revenueSetup.sendingMailboxes")}
                    tooltip={t("revenueSetup.sendingMailboxesTooltip")}
                    required
                    minValue={1}
                  />
                  <Input
                    id="mailboxes"
                    type="number"
                    value={mailboxes || ""}
                    onChange={(e) => handleNumberInput(e.target.value, setMailboxes)}
                    className={`font-mono transition-all focus:ring-2 ${mailboxes < 1 ? "border-red-500" : ""}`}
                  />
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="emailsPerDay"
                    label={t("revenueSetup.emailsPerDay")}
                    tooltip={t("revenueSetup.emailsPerDayTooltip")}
                    warning={getBenchmarkWarning("emailsPerDay", emailsPerDay)}
                    required
                    minValue={1}
                  />
                  <Input
                    id="emailsPerDay"
                    type="number"
                    value={emailsPerDay || ""}
                    onChange={(e) => handleNumberInput(e.target.value, setEmailsPerDay)}
                    className={`font-mono transition-all focus:ring-2 ${emailsPerDay < 1 ? "border-red-500" : ""}`}
                  />
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="workingDays"
                    label={t("revenueSetup.workingDays")}
                    tooltip={t("revenueSetup.workingDaysTooltip")}
                    required
                    minValue={1}
                  />
                  <Input
                    id="workingDays"
                    type="number"
                    value={workingDays || ""}
                    onChange={(e) => handleNumberInput(e.target.value, setWorkingDays)}
                    className={`font-mono transition-all focus:ring-2 ${workingDays < 1 ? "border-red-500" : ""}`}
                  />
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="sequenceSteps"
                    label={t("revenueSetup.sequenceSteps")}
                    tooltip={t("revenueSetup.sequenceStepsTooltip")}
                  />
                  <Input
                    id="sequenceSteps"
                    type="number"
                    value={sequenceSteps || ""}
                    onChange={(e) => handleNumberInput(e.target.value, setSequenceSteps)}
                    className="font-mono transition-all focus:ring-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">{t("performanceMetrics.title")}</CardTitle>
                <CardDescription>{t("performanceMetrics.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="ratioPerReply"
                    label={t("performanceMetrics.ratioPerReply")}
                    tooltip={t("performanceMetrics.ratioPerReplyTooltip")}
                    required
                    minValue={1}
                  />
                  <Input
                    id="ratioPerReply"
                    type="number"
                    value={ratioPerReply || ""}
                    onChange={(e) => handleNumberInput(e.target.value, setRatioPerReply)}
                    className={`font-mono transition-all focus:ring-2 ${ratioPerReply < 1 ? "border-red-500" : ""}`}
                  />
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="closeRate"
                    label={t("performanceMetrics.closeRate")}
                    tooltip={t("performanceMetrics.closeRateTooltip")}
                    warning={getBenchmarkWarning("closeRate", closeRate)}
                    required
                    minValue={1}
                  />
                  <Input
                    id="closeRate"
                    type="number"
                    value={closeRate || ""}
                    onChange={(e) => handleNumberInput(e.target.value, setCloseRate)}
                    className={`font-mono transition-all focus:ring-2 ${closeRate < 1 ? "border-red-500" : ""}`}
                  />
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="ltv"
                    label={t("performanceMetrics.dealValueLTV")} // Updated label
                    tooltip={t("performanceMetrics.dealValueLTVTooltip")}
                    required
                    minValue={1}
                  />
                  <Input
                    id="ltv"
                    type="number"
                    value={ltv || ""}
                    onChange={(e) => handleNumberInput(e.target.value, setLtv)}
                    className={`font-mono transition-all focus:ring-2 ${ltv < 1 ? "border-red-500" : ""}`} // Simplified validation to just ltv
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-md border-2">
              <CardHeader className="cursor-pointer" onClick={() => setShowAdvanced(!showAdvanced)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base">{t("advancedMetrics.title")}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={enableAdvanced}
                          onCheckedChange={(checked) => {
                            setEnableAdvanced(checked)
                            if (checked) {
                              setShowAdvanced(true)
                            } else {
                              setShowAdvanced(false)
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-xs text-muted-foreground">{enableAdvanced ? t("advancedMetrics.enabled") : t("advancedMetrics.disabled")}</span>
                      </div>
                    </div>
                    <CardDescription className="mt-1 flex items-start gap-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span className="text-xs">
                        {t("advancedMetrics.description")}
                      </span>
                    </CardDescription>
                  </div>
                  {showAdvanced ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardHeader>
              {showAdvanced && enableAdvanced && (
                <CardContent className="space-y-4 pt-0">
                  <Separator className="mb-4" />
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="openRate"
                      label={t("advancedMetrics.openRate")}
                      tooltip={t("advancedMetrics.openRateTooltip")}
                      warning={getBenchmarkWarning("openRate", openRate)}
                    />
                    <Input
                      id="openRate"
                      type="number"
                      value={openRate || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setOpenRate)}
                      className="font-mono transition-all focus:ring-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="replyRate"
                      label={t("advancedMetrics.replyRate")}
                      tooltip={t("advancedMetrics.replyRateTooltip")}
                      warning={getBenchmarkWarning("replyRate", replyRate)}
                    />
                    <Input
                      id="replyRate"
                      type="number"
                      value={replyRate || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setReplyRate)}
                      className="font-mono transition-all focus:ring-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="positiveReplyRate"
                      label={t("advancedMetrics.positiveReplyRate")}
                      tooltip={t("advancedMetrics.positiveReplyRateTooltip")}
                    />
                    <Input
                      id="positiveReplyRate"
                      type="number"
                      value={positiveReplyRate || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setPositiveReplyRate)}
                      className="font-mono transition-all focus:ring-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="meetingBookRate"
                      label={t("advancedMetrics.meetingBookRate")}
                      tooltip={t("advancedMetrics.meetingBookRateTooltip")}
                    />
                    <Input
                      id="meetingBookRate"
                      type="number"
                      value={meetingBookRate || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setMeetingBookRate)}
                      className="font-mono transition-all focus:ring-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="bounceRate"
                      label={t("advancedMetrics.bounceRate")}
                      tooltip={t("advancedMetrics.bounceRateTooltip")}
                      warning={getBenchmarkWarning("bounceRate", bounceRate)}
                    />
                    <Input
                      id="bounceRate"
                      type="number"
                      value={bounceRate || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setBounceRate)}
                      className="font-mono transition-all focus:ring-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="unsubscribeRate"
                      label={t("advancedMetrics.unsubscribeRate")}
                      tooltip={t("advancedMetrics.unsubscribeRateTooltip")}
                    />
                    <Input
                      id="unsubscribeRate"
                      type="number"
                      value={unsubscribeRate || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setUnsubscribeRate)}
                      className="font-mono transition-all focus:ring-2"
                    />
                  </div>
                  {/* Removed avgDealSize input */}
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="salesCycleLength"
                      label={t("advancedMetrics.salesCycleLength")}
                      tooltip={t("advancedMetrics.salesCycleLengthTooltip")}
                    />
                    <Input
                      id="salesCycleLength"
                      type="number"
                      value={salesCycleLength || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setSalesCycleLength)}
                      className="font-mono transition-all focus:ring-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="churnRate"
                      label={t("advancedMetrics.churnRate")}
                      tooltip={t("advancedMetrics.churnRateTooltip")}
                    />
                    <Input
                      id="churnRate"
                      type="number"
                      value={churnRate || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setChurnRate)}
                      className="font-mono transition-all focus:ring-2"
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">{t("costStructure.title")}</CardTitle>
                <CardDescription>{t("costStructure.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="domainCost"
                    label={t("costStructure.domainCost")}
                    tooltip={t("costStructure.domainCostTooltip")}
                  />
                  <Input
                    id="domainCost"
                    type="number"
                    value={domainCost || ""}
                    onChange={(e) => handleNumberInput(e.target.value, setDomainCost)}
                    className="font-mono transition-all focus:ring-2"
                  />
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="mailboxCost"
                    label={t("costStructure.mailboxCost")}
                    tooltip={t("costStructure.mailboxCostTooltip")}
                  />
                  <Input
                    id="mailboxCost"
                    type="number"
                    value={mailboxCost || ""}
                    onChange={(e) => handleNumberInput(e.target.value, setMailboxCost)}
                    className="font-mono transition-all focus:ring-2"
                  />
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="deliveryCost"
                    label={t("costStructure.deliveryCost")}
                    tooltip={t("costStructure.deliveryCostTooltip")}
                  />
                  <Input
                    id="deliveryCost"
                    type="number"
                    value={deliveryCost || ""}
                    onChange={(e) => handleNumberInput(e.target.value, setDeliveryCost)}
                    className="font-mono transition-all focus:ring-2"
                  />
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="softwareCost"
                    label={t("costStructure.softwareCost")}
                    tooltip={t("costStructure.softwareCostTooltip")}
                  />
                  <Input
                    id="softwareCost"
                    type="number"
                    value={softwareCost || ""}
                    onChange={(e) => handleNumberInput(e.target.value, setSoftwareCost)}
                    className="font-mono transition-all focus:ring-2"
                  />
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="engineerCost"
                    label={t("costStructure.engineerCost")}
                    tooltip={t("costStructure.engineerCostTooltip")}
                  />
                  <Input
                    id="engineerCost"
                    type="number"
                    value={engineerCost || ""}
                    onChange={(e) => handleNumberInput(e.target.value, setEngineerCost)}
                    className="font-mono transition-all focus:ring-2"
                  />
                </div>

                {showAdvanced && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <LabelWithTooltip
                        htmlFor="warmupCost"
                        label={t("costStructure.warmupCost")}
                        tooltip={t("costStructure.warmupCostTooltip")}
                      />
                      <Input
                        id="warmupCost"
                        type="number"
                        value={warmupCost || ""}
                        onChange={(e) => handleNumberInput(e.target.value, setWarmupCost)}
                        className="font-mono transition-all focus:ring-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <LabelWithTooltip
                        htmlFor="dataProviderCost"
                        label={t("costStructure.dataProviderCost")}
                        tooltip={t("costStructure.dataProviderCostTooltip")}
                      />
                      <Input
                        id="dataProviderCost"
                        type="number"
                        value={dataProviderCost || ""}
                        onChange={(e) => handleNumberInput(e.target.value, setDataProviderCost)}
                        className="font-mono transition-all focus:ring-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <LabelWithTooltip
                        htmlFor="copywriterCost"
                        label={t("costStructure.copywriterCost")}
                        tooltip={t("costStructure.copywriterCostTooltip")}
                      />
                      <Input
                        id="copywriterCost"
                        type="number"
                        value={copywriterCost || ""}
                        onChange={(e) => handleNumberInput(e.target.value, setCopywriterCost)}
                        className="font-mono transition-all focus:ring-2"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-md border-2 border-purple-200 dark:border-purple-900">
              <CardHeader className="cursor-pointer" onClick={() => setShowCommission(!showCommission)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base">{t("salesCommission.title")}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={enableCommission}
                          onCheckedChange={(checked) => {
                            setEnableCommission(checked)
                            if (checked) {
                              setShowCommission(true)
                            } else {
                              setShowCommission(false)
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-xs text-muted-foreground">
                          {enableCommission ? t("salesCommission.enabled") : t("salesCommission.disabled")}
                        </span>
                      </div>
                    </div>
                    <CardDescription className="mt-1 flex items-start gap-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span className="text-xs">{t("salesCommission.description")}</span>
                    </CardDescription>
                  </div>
                  {showCommission ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardHeader>
              {showCommission && enableCommission && (
                <CardContent className="space-y-4 pt-0">
                  <Separator className="mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="commissionType" className="text-sm font-medium">
                      {t("salesCommission.commissionType")}
                    </Label>
                    <Select
                      value={commissionType}
                      onValueChange={(value) => setCommissionType(value as "percentage" | "flat")}
                    >
                      <SelectTrigger id="commissionType" className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">{t("salesCommission.commissionTypePercentage")}</SelectItem>
                        <SelectItem value="flat">{t("salesCommission.commissionTypeFlat")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {commissionType === "percentage"
                        ? t("salesCommission.commissionTypePercentageDesc")
                        : t("salesCommission.commissionTypeFlatDesc")}
                    </p>
                  </div>

                  {commissionType === "percentage" ? (
                    <div className="space-y-2">
                      <LabelWithTooltip
                        htmlFor="commissionRate"
                        label={t("salesCommission.commissionRate")}
                        tooltip={t("salesCommission.commissionRateTooltip")}
                      />
                      <Input
                        id="commissionRate"
                        type="number"
                        value={commissionRate || ""}
                        onChange={(e) => handleNumberInput(e.target.value, setCommissionRate)}
                        className="font-mono transition-all focus:ring-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("salesCommission.salesRepEarnsPercentage")} {formatCurrency(ltv * (commissionRate / 100))} {t("salesCommission.perDeal")}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <LabelWithTooltip
                        htmlFor="commissionFlat"
                        label={t("salesCommission.commissionPerDeal")}
                        tooltip={t("salesCommission.commissionPerDealTooltip")}
                      />
                      <Input
                        id="commissionFlat"
                        type="number"
                        value={commissionFlat || ""}
                        onChange={(e) => handleNumberInput(e.target.value, setCommissionFlat)}
                        className="font-mono transition-all focus:ring-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("salesCommission.salesRepEarnsFlat")} {formatCurrency(commissionFlat)} {t("salesCommission.perDeal")}
                      </p>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div className="p-3 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{t("salesCommission.totalMonthlyCommission")}</p>
                      <p className="text-lg font-bold tabular-nums text-purple-700 dark:text-purple-400">
                        {displayValue(calculations.commissionCost, "currency")}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("salesCommission.basedOnDeals")} {displayValue(calculations.deals, "number")} {t("salesCommission.dealsClosedPerMonth")}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            <Card className="transition-all hover:shadow-md border-2 border-blue-200 dark:border-blue-900">
              <CardHeader className="cursor-pointer" onClick={() => setShowAgencyComparison(!showAgencyComparison)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base">{t("agencyComparison.title")}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={enableAgency}
                          onCheckedChange={(checked) => {
                            setEnableAgency(checked)
                            if (checked) {
                              setShowAgencyComparison(true)
                            } else {
                              setShowAgencyComparison(false)
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-xs text-muted-foreground">{enableAgency ? t("agencyComparison.enabled") : t("agencyComparison.disabled")}</span>
                      </div>
                    </div>
                    <CardDescription className="mt-1 flex items-start gap-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span className="text-xs">{t("agencyComparison.description")}</span>
                    </CardDescription>
                  </div>
                  {showAgencyComparison ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardHeader>
              {showAgencyComparison && enableAgency && (
                <CardContent className="space-y-4 pt-0">
                  <Separator className="mb-4" />
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="agencySetupFee"
                      label={t("agencyComparison.setupFee")}
                      tooltip={t("agencyComparison.setupFeeTooltip")}
                    />
                    <Input
                      id="agencySetupFee"
                      type="number"
                      value={agencySetupFee || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setAgencySetupFee)}
                      className="font-mono transition-all focus:ring-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="agencyMonthlyFee"
                      label={t("agencyComparison.monthlyRetainer")}
                      tooltip={t("agencyComparison.monthlyRetainerTooltip")}
                    />
                    <Input
                      id="agencyMonthlyFee"
                      type="number"
                      value={agencyMonthlyFee || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setAgencyMonthlyFee)}
                      className="font-mono transition-all focus:ring-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="agencyPerLeadFee"
                      label={t("agencyComparison.perLeadFee")}
                      tooltip={t("agencyComparison.perLeadFeeTooltip")}
                    />
                    <Input
                      id="agencyPerLeadFee"
                      type="number"
                      value={agencyPerLeadFee || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setAgencyPerLeadFee)}
                      className="font-mono transition-all focus:ring-2"
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            <Card className="transition-all hover:shadow-md border-2 border-blue-200 dark:border-blue-900">
              <CardHeader className="cursor-pointer" onClick={() => setShowColdCalling(!showColdCalling)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base">{t("coldCalling.title")}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={enableColdCalling}
                          onCheckedChange={(checked) => {
                            setEnableColdCalling(checked)
                            if (checked) {
                              setShowColdCalling(true)
                            } else {
                              setShowColdCalling(false)
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-xs text-muted-foreground">
                          {enableColdCalling ? t("coldCalling.enabled") : t("coldCalling.disabled")}
                        </span>
                      </div>
                    </div>
                    <CardDescription className="mt-1 flex items-start gap-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span className="text-xs">
                        {t("coldCalling.description")}
                      </span>
                    </CardDescription>
                  </div>
                  {showColdCalling ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardHeader>
              {showColdCalling && enableColdCalling && (
                <CardContent className="space-y-4 pt-0">
                  <Separator className="mb-4" />
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="callsPerDay"
                      label={t("coldCalling.callsPerDay")}
                      tooltip={t("coldCalling.callsPerDayTooltip")}
                      warning={getBenchmarkWarning("callsPerDay", callsPerDay)}
                    />
                    <Input
                      id="callsPerDay"
                      type="number"
                      value={callsPerDay || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setCallsPerDay)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="callConnectRate"
                      label={t("coldCalling.connectRate")}
                      tooltip={t("coldCalling.connectRateTooltip")}
                      warning={getBenchmarkWarning("callConnectRate", callConnectRate)}
                    />
                    <Input
                      id="callConnectRate"
                      type="number"
                      value={callConnectRate || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setCallConnectRate)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="callToMeetingRate"
                      label={t("coldCalling.callToMeetingRate")}
                      tooltip={t("coldCalling.callToMeetingRateTooltip")}
                      warning={getBenchmarkWarning("callToMeetingRate", callToMeetingRate)}
                    />
                    <Input
                      id="callToMeetingRate"
                      type="number"
                      value={callToMeetingRate || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setCallToMeetingRate)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="callingDaysPerMonth"
                      label={t("coldCalling.callingDaysPerMonth")}
                      tooltip={t("coldCalling.callingDaysPerMonthTooltip")}
                    />
                    <Input
                      id="callingDaysPerMonth"
                      type="number"
                      value={callingDaysPerMonth || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setCallingDaysPerMonth)}
                      className="font-mono"
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="callingSoftwareCost"
                      label={t("coldCalling.softwareCost")}
                      tooltip={t("coldCalling.softwareCostTooltip")}
                    />
                    <Input
                      id="callingSoftwareCost"
                      type="number"
                      value={callingSoftwareCost || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setCallingSoftwareCost)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="callerSalaryCost"
                      label={t("coldCalling.salartCost")}
                      tooltip={t("coldCalling.salaryCostTooltip")}
                    />
                    <Input
                      id="callerSalaryCost"
                      type="number"
                      value={callerSalaryCost || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setCallerSalaryCost)}
                      className="font-mono"
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            <Card className="transition-all hover:shadow-md border-2 border-blue-200 dark:border-blue-900">
              <CardHeader className="cursor-pointer" onClick={() => setShowLinkedIn(!showLinkedIn)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base">{t("linkedInOutreach.title")}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={enableLinkedIn}
                          onCheckedChange={(checked) => {
                            setEnableLinkedIn(checked)
                            if (checked) {
                              setShowLinkedIn(true)
                            } else {
                              setShowLinkedIn(false)
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-xs text-muted-foreground">{enableLinkedIn ? t("linkedInOutreach.enabled") : t("linkedInOutreach.disabled")}</span>
                      </div>
                    </div>
                    <CardDescription className="mt-1 flex items-start gap-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span className="text-xs">
                        {t("linkedInOutreach.description")}
                      </span>
                    </CardDescription>
                  </div>
                  {showLinkedIn ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardHeader>
              {showLinkedIn && enableLinkedIn && (
                <CardContent className="space-y-4 pt-0">
                  <Separator className="mb-4" />
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="linkedInConnectionsPerDay"
                      label={t("linkedInOutreach.connectionsPerDay")}
                      tooltip={t("linkedInOutreach.connectionsPerDayTooltip")}
                      warning={getBenchmarkWarning("linkedInConnectionsPerDay", linkedInConnectionsPerDay)}
                    />
                    <Input
                      id="linkedInConnectionsPerDay"
                      type="number"
                      value={linkedInConnectionsPerDay || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setLinkedInConnectionsPerDay)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="linkedInAcceptRate"
                      label={t("linkedInOutreach.acceptRate")}
                      tooltip={t("linkedInOutreach.acceptRateTooltip")}
                      warning={getBenchmarkWarning("linkedInAcceptRate", linkedInAcceptRate)}
                    />
                    <Input
                      id="linkedInAcceptRate"
                      type="number"
                      value={linkedInAcceptRate || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setLinkedInAcceptRate)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="linkedInReplyRate"
                      label={t("linkedInOutreach.replyRate")}
                      tooltip={t("linkedInOutreach.replyRateTooltip")}
                      warning={getBenchmarkWarning("linkedInReplyRate", linkedInReplyRate)}
                    />
                    <Input
                      id="linkedInReplyRate"
                      type="number"
                      value={linkedInReplyRate || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setLinkedInReplyRate)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="linkedInMeetingRate"
                      label={t("linkedInOutreach.meetingBookingRate")}
                      tooltip={t("linkedInOutreach.meetingBookingRateTooltip")}
                      warning={getBenchmarkWarning("linkedInMeetingRate", linkedInMeetingRate)}
                    />
                    <Input
                      id="linkedInMeetingRate"
                      type="number"
                      value={linkedInMeetingRate || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setLinkedInMeetingRate)}
                      className="font-mono"
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="linkedInToolCost"
                      label={t("linkedInOutreach.toolCost")}
                      tooltip={t("linkedInOutreach.toolCostTooltip")}
                    />
                    <Input
                      id="linkedInToolCost"
                      type="number"
                      value={linkedInToolCost || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setLinkedInToolCost)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="linkedInManagerCost"
                      label={t("linkedInOutreach.managerCost")}
                      tooltip={t("linkedInOutreach.managerCostTooltip")}
                    />
                    <Input
                      id="linkedInManagerCost"
                      type="number"
                      value={linkedInManagerCost || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setLinkedInManagerCost)}
                      className="font-mono"
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            <Card className="transition-all hover:shadow-md border-2 border-green-200 dark:border-green-900">
              <CardHeader className="cursor-pointer" onClick={() => setShowReferrals(!showReferrals)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <UserPlus className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-base">{t("referralProgram.title")}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={enableReferrals}
                          onCheckedChange={(checked) => {
                            setEnableReferrals(checked)
                            if (checked) {
                              setShowReferrals(true)
                            } else {
                              setShowReferrals(false)
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-xs text-muted-foreground">
                          {enableReferrals ? t("referralProgram.enabled") : t("referralProgram.disabled")}
                        </span>
                      </div>
                    </div>
                    <CardDescription className="mt-1 flex items-start gap-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span className="text-xs">
                        {t("referralProgram.description")}
                      </span>
                    </CardDescription>
                  </div>
                  {showReferrals ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardHeader>
              {showReferrals && enableReferrals && (
                <CardContent className="space-y-4 pt-0">
                  <Separator className="mb-4" />
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="referralsPerMonth"
                      label={t("referralProgram.referralsPerMonth")}
                      tooltip={t("referralProgram.referralsPerMonthTooltip")}
                    />
                    <Input
                      id="referralsPerMonth"
                      type="number"
                      value={referralsPerMonth || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setReferralsPerMonth)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="referralConversionRate"
                      label={t("referralProgram.conversionRate")}
                      tooltip={t("referralProgram.conversionRateTooltip")}
                      warning={getBenchmarkWarning("referralConversionRate", referralConversionRate)}
                    />
                    <Input
                      id="referralConversionRate"
                      type="number"
                      value={referralConversionRate || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setReferralConversionRate)}
                      className="font-mono"
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="referralIncentiveCost"
                      label={t("referralProgram.incentiveCost")}
                      tooltip={t("referralProgram.incentiveCostTooltip")}
                    />
                    <Input
                      id="referralIncentiveCost"
                      type="number"
                      value={referralIncentiveCost || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setReferralIncentiveCost)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip
                      htmlFor="referralProgramCost"
                      label={t("referralProgram.programCost")}
                      tooltip={t("referralProgram.programCostTooltip")}
                    />
                    <Input
                      id="referralProgramCost"
                      type="number"
                      value={referralProgramCost || ""}
                      onChange={(e) => handleNumberInput(e.target.value, setReferralProgramCost)}
                      className="font-mono"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            {suggestions.length > 0 && (
              <Card
                className={`border-2 transition-all ${
                  hasCriticalIssues
                    ? "border-red-600/50 bg-red-50/50 dark:bg-red-950/30 animate-shake"
                    : "border-amber-600/50 bg-amber-50/50 dark:bg-amber-950/30"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {hasCriticalIssues ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                    )}
                    <CardTitle className="text-base">
                      {hasCriticalIssues ? t("suggestions.criticalIssues") : t("suggestions.optimizationSuggestions")}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {hasCriticalIssues
                      ? t("suggestions.criticalDescription")
                      : t("suggestions.optimizationDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestions.slice(0, 4).map((suggestion, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        suggestion.type === "critical"
                          ? "bg-red-100/50 dark:bg-red-950/50 border-red-300 dark:border-red-800"
                          : suggestion.type === "warning"
                            ? "bg-amber-100/50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800"
                            : "bg-blue-100/50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                            suggestion.type === "critical"
                              ? "text-red-600"
                              : suggestion.type === "warning"
                                ? "text-amber-600"
                                : "text-blue-600"
                          }`}
                        />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{suggestion.message}</p>
                          <p className="text-xs text-muted-foreground">{suggestion.action}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {suggestions.length > 4 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      +{suggestions.length - 4} {t("suggestions.moreSuggestions")}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Key Metrics (Updated) */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card
                id="roi-card"
                className={`border-2 transition-all hover:shadow-lg ${calculations.combinedROI > 0 ? "border-green-600/20 bg-green-50/50 dark:bg-green-950/20" : calculations.combinedROI < 0 ? "border-red-600/20 bg-red-50/50 dark:bg-red-950/20" : ""}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-xs uppercase tracking-wider font-medium">
                      {t("keyMetrics.overallROI")}
                    </CardDescription>
                    {calculations.combinedROI > 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : calculations.combinedROI < 0 ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : null}
                  </div>
                  <CardTitle
                    className={`text-4xl font-bold tabular-nums transition-all ${calculations.combinedROI > 0 ? "text-green-700 dark:text-green-400" : calculations.combinedROI < 0 ? "text-red-700 dark:text-red-400" : ""}`}
                  >
                    {displayValue(
                      isClient
                        ? `${calculations.combinedROI >= 0 ? "+" : ""}${calculations.combinedROI.toFixed(1)}%`
                        : "--",
                      "percentage",
                    )}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("keyMetrics.coldEmailROI")}{" "}
                    {displayValue(
                      isClient ? `${calculations.roi >= 0 ? "+" : ""}${calculations.roi.toFixed(1)}%` : "--",
                      "percentage",
                    )}
                  </p>
                </CardHeader>
              </Card>
              <Card className="border-2 border-green-600/20 bg-green-50/50 dark:bg-green-950/20 transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-xs uppercase tracking-wider font-medium">
                      {t("keyMetrics.overallRevenue")}
                    </CardDescription>
                    <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0" />
                  </div>
                  <CardTitle className="text-3xl sm:text-4xl font-bold tabular-nums text-green-700 dark:text-green-400 transition-all break-words leading-tight">
                    {displayValue(calculations.totalRevenueAllChannels, "currency")}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{t("keyMetrics.totalRevenueGenerated")}</p>
                </CardHeader>
              </Card>
            </div>

            {/* Email Performance Metrics - only show if enabled */}
            {enableEmailMetrics && enableAdvanced && (
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">{t("emailPerformanceMetrics.title")}</CardTitle>
                  <CardDescription className="text-xs">{t("emailPerformanceMetrics.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-3xl font-bold tabular-nums">
                        {displayValue(calculations.emailsPerMonth, "number")}
                      </p>
                      <p className="text-xs text-muted-foreground">{t("emailPerformanceMetrics.emailsPerMonthPerMailbox")}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold tabular-nums">
                        {displayValue(calculations.totalEmails, "number")}
                      </p>
                      <p className="text-xs text-muted-foreground">{t("emailPerformanceMetrics.totalEmailsPerMonth")}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold tabular-nums">
                        {displayValue(calculations.prospects, "number")}
                      </p>
                      <p className="text-xs text-muted-foreground">{t("emailPerformanceMetrics.prospectsPerMonth")}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold tabular-nums">{displayValue(calculations.leads, "number")}</p>
                      <p className="text-xs text-muted-foreground">{t("emailPerformanceMetrics.leadsContacted")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sales Performance */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">{t("salesPerformance.title")}</CardTitle>
                <CardDescription className="text-xs">{t("salesPerformance.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                    <p className="text-3xl font-bold tabular-nums text-green-700 dark:text-green-400 break-words">
                      {displayValue(calculations.opportunities, "number")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{t("salesPerformance.opportunities")}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                    <p className="text-3xl font-bold tabular-nums text-green-700 dark:text-green-400 break-words">
                      {displayValue(calculations.meetings, "number")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{t("salesPerformance.meetings")}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                    <p className="text-3xl font-bold tabular-nums text-green-700 dark:text-green-400 break-words">
                      {displayValue(calculations.deals, "number")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{t("salesPerformance.dealsClosed")}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-900 sm:col-span-2 lg:col-span-1">
                    <p className="text-2xl sm:text-3xl font-bold tabular-nums text-green-700 dark:text-green-400 break-words leading-tight">
                      {displayValue(calculations.totalRevenueAllChannels, "currency")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{t("salesPerformance.revenue")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary - Always show */}
            <Card className="border-2 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="text-base">{t("financialSummary.title")}</CardTitle>
                <CardDescription className="text-xs">{t("financialSummary.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {/* Total Revenue */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-900 border border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">{t("financialSummary.totalMonthlyRevenue")}</span>
                    </div>
                    <span className="text-lg font-bold font-mono tabular-nums text-green-600 dark:text-green-400">
                      {displayValue(calculations.totalRevenueAllChannels, "currency")}
                    </span>
                  </div>

                  {/* Operating Costs */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-900 border border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-sm font-medium">{t("financialSummary.totalOperatingCosts")}</span>
                    </div>
                    <span className="text-lg font-bold font-mono tabular-nums text-red-600 dark:text-red-400">
                      -{displayValue(calculations.totalCostAllChannels, "currency")}
                    </span>
                  </div>

                  {/* Commission Paid (if enabled) */}
                  {enableCommission && calculations.commissionCost > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-900 border border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-sm font-medium">
                          {t("financialSummary.commission")} {commissionType === "percentage" ? `(${commissionRate}%)` : `($${commissionFlat}/deal)`}
                        </span>
                      </div>
                      <span className="text-lg font-bold font-mono tabular-nums text-purple-600 dark:text-purple-400">
                        -{displayValue(calculations.commissionCost, "currency")}
                      </span>
                    </div>
                  )}

                  {/* Separator */}
                  <div className="border-t-2 border-dashed border-border"></div>

                  {/* Net Income (without commission) */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-300 dark:border-green-800">
                    <div>
                      <span className="text-sm font-semibold text-green-900 dark:text-green-100">
                        {!enableCommission ? t("financialSummary.netIncomeBeforeCommission") : t("financialSummary.netIncome")}
                      </span>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                        {t("financialSummary.revenueMinusOperatingCosts")}
                      </p>
                    </div>
                    <span className="text-2xl font-bold font-mono tabular-nums text-green-700 dark:text-green-300">
                      {displayValue(
                        calculations.totalRevenueAllChannels - calculations.totalCostAllChannels,
                        "currency",
                      )}
                    </span>
                  </div>

                  {/* Net Income After Commission (if enabled) */}
                  {enableCommission && (
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-300 dark:border-blue-800">
                      <div>
                        <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                          {t("financialSummary.netIncomeAfterCommission")}
                        </span>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                          {t("financialSummary.revenueMinusAllCosts")}
                        </p>
                      </div>
                      <span className="text-2xl font-bold font-mono tabular-nums text-blue-700 dark:text-blue-300">
                        {displayValue(calculations.profitWithCommission, "currency")}
                      </span>
                    </div>
                  )}

                  {/* Tax Section (if enabled) */}
                  {enableTax && (
                    <>
                      <div className="border-t-2 border-dashed border-border"></div>

                      {/* Tax Amount */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-900 border border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <span className="text-sm font-medium">
                            {t("financialSummary.corporateTax")} ({(CORPORATE_TAX_RATES[currency] * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <span className="text-lg font-bold font-mono tabular-nums text-orange-600 dark:text-orange-400">
                          -{displayValue(calculations.taxAmount, "currency")}
                        </span>
                      </div>

                      {/* Net Income After Tax */}
                      <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-300 dark:border-emerald-800">
                        <div>
                          <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                            {t("financialSummary.netIncomeAfterTax")}
                          </span>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                            {t("financialSummary.finalProfitAfterDeductions")}
                          </p>
                        </div>
                        <span className="text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-300">
                          {displayValue(calculations.netIncomeAfterTax, "currency")}
                        </span>
                      </div>

                      {/* After-Tax ROI */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border border-teal-300 dark:border-teal-800">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                          <span className="text-sm font-medium">{t("financialSummary.afterTaxROI")}</span>
                        </div>
                        <span className="text-lg font-bold font-mono tabular-nums text-teal-700 dark:text-teal-300">
                          {displayValue(calculations.afterTaxROI, "percentage")}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Financial Analysis */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">{t("financialAnalysis.title")}</CardTitle>
                <CardDescription className="text-xs">{t("financialAnalysis.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t("financialAnalysis.totalMonthlyCost")}</p>
                    <p className="text-2xl font-bold tabular-nums text-red-700 dark:text-red-400">
                      {displayValue(calculations.totalCostAllChannels, "currency")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t("financialAnalysis.costPerMeeting")}</p>
                    <p className="text-2xl font-bold tabular-nums">
                      {displayValue(
                        calculations.totalMeetingsAllChannels > 0
                          ? calculations.totalCostAllChannels / calculations.totalMeetingsAllChannels
                          : 0,
                        "currency",
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t("financialAnalysis.customerAcquisitionCost")}</p>
                    <p className="text-2xl font-bold tabular-nums">
                      {displayValue(calculations.combinedCAC, "currency")}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                  <span className="text-sm font-medium">{t("financialAnalysis.ltvCacRatio")}</span>
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-bold">
                    {calculations.ltvCacRatio > 0 ? calculations.ltvCacRatio.toFixed(1) : "--"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Commission Impact - only show if enabled */}
            {enableCommission && (
              <Card className="transition-all hover:shadow-md border-2 border-purple-200 dark:border-purple-900">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-base">{t("commissionImpact.title")}</CardTitle>
                      <CardDescription className="text-xs">{t("commissionImpact.description")}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                      <p className="text-sm font-semibold mb-3">Without Commission</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Total Cost</span>
                          <span className="text-sm font-mono font-semibold text-red-700 dark:text-red-400">
                            {displayValue(calculations.totalCost, "currency")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Monthly Profit</span>
                          <span
                            className={`text-sm font-mono font-semibold ${calculations.profitWithoutCommission >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
                          >
                            {displayValue(calculations.profitWithoutCommission, "currency")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">CAC</span>
                          <span className="text-sm font-mono font-semibold">
                            {displayValue(calculations.cac, "currency")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">ROI</span>
                          <span
                            className={`text-sm font-mono font-semibold ${calculations.roi > 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
                          >
                            {displayValue(
                              isClient ? `${calculations.roi >= 0 ? "+" : ""}${calculations.roi.toFixed(1)}%` : "--",
                              "percentage",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 p-4 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900">
                      <p className="text-sm font-semibold mb-3">With Commission</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Total Cost</span>
                          <span className="text-sm font-mono font-semibold text-red-700 dark:text-red-400">
                            {displayValue(calculations.totalCostWithCommission, "currency")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Monthly Profit</span>
                          <span
                            className={`text-sm font-mono font-semibold ${calculations.profitWithCommission > 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
                          >
                            {displayValue(calculations.profitWithCommission, "currency")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">CAC</span>
                          <span className="text-sm font-mono font-semibold">
                            {displayValue(calculations.cacWithCommission, "currency")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">ROI</span>
                          <span
                            className={`text-sm font-mono font-semibold ${calculations.roiWithCommission > 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
                          >
                            {displayValue(
                              isClient
                                ? `${calculations.roiWithCommission > 0 ? "+" : ""}${calculations.roiWithCommission.toFixed(1)}%`
                                : "--",
                              "percentage",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="p-4 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">Commission Cost Impact</p>
                        <p className="text-xs text-muted-foreground">
                          {commissionType === "percentage"
                            ? `${commissionRate}% of deal value per sale`
                            : `${formatCurrency(commissionFlat)} per deal`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold tabular-nums text-purple-700 dark:text-purple-400">
                          {displayValue(calculations.commissionCost, "currency")}
                        </p>
                        <p className="text-xs text-muted-foreground">per month</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Agency Comparison - only show if enabled */}
            {enableAgency && (
              <Card className="transition-all hover:shadow-md border-2 border-blue-200 dark:border-blue-900">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-base">{t("agencyComparisonPanel.title")}</CardTitle>
                      <CardDescription className="text-xs">{t("agencyComparisonPanel.description")}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4" />
                        <p className="text-sm font-semibold">In-House (Your Setup)</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Monthly Cost</p>
                        <p className="text-2xl font-bold tabular-nums text-red-700 dark:text-red-400">
                          {displayValue(calculations.totalCost, "currency")}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Cost per Lead</p>
                        <p className="text-xl font-bold tabular-nums">
                          {displayValue(
                            isClient && calculations.opportunities > 0
                              ? calculations.totalCost / calculations.opportunities
                              : 0,
                            "currency",
                          )}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">ROI</p>
                        <p
                          className={`text-xl font-bold ${calculations.roi >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
                        >
                          {displayValue(
                            isClient ? `${calculations.roi >= 0 ? "+" : ""}${calculations.roi.toFixed(1)}%` : "--",
                            "percentage",
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4" />
                        <p className="text-sm font-semibold">Agency</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Monthly Cost</p>
                        <p className="text-2xl font-bold tabular-nums text-red-700 dark:text-red-400">
                          {displayValue(calculations.agencyTotalCost, "currency")}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Cost per Lead</p>
                        <p className="text-xl font-bold tabular-nums">
                          {displayValue(calculations.agencyCostPerLead, "currency")}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">ROI</p>
                        <p
                          className={`text-xl font-bold ${calculations.agencyROI >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
                        >
                          {displayValue(
                            isClient
                              ? `${calculations.agencyROI >= 0 ? "+" : ""}${calculations.agencyROI.toFixed(1)}%`
                              : "--",
                            "percentage",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="p-4 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold mb-1">{t("agencyComparisonPanel.monthlySavings")}</p>
                        <p className="text-xs text-muted-foreground">
                          {isClient && calculations.opportunities > 0
                            ? calculations.costSavingsVsAgency >= 0
                              ? t("agencyComparisonPanel.youSaveByBuilding")
                              : t("agencyComparisonPanel.agencyWouldBeCheaper")
                            : t("agencyComparisonPanel.fillRequiredFieldsToCompare")}
                        </p>
                      </div>
                      <p
                        className={`text-3xl font-bold tabular-nums ${calculations.costSavingsVsAgency >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
                      >
                        {displayValue(
                          isClient && calculations.opportunities > 0
                            ? `${calculations.costSavingsVsAgency >= 0 ? "+" : ""}${formatCurrency(calculations.costSavingsVsAgency)}`
                            : "--",
                          "currency",
                        )}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-900">
                      <p className="text-xs text-muted-foreground">Annual savings</p>
                      <p className="text-xl font-bold tabular-nums text-green-700 dark:text-green-400">
                        {displayValue(calculations.costSavingsVsAgency * 12, "currency")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Multi-Channel Performance */}
            {(enableColdCalling || enableLinkedIn || enableReferrals) && (
              <Card className="transition-all hover:shadow-md border-2 border-purple-200 dark:border-purple-900">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    {t("multiChannelPerformance.title")}
                  </CardTitle>
                  <CardDescription>{t("multiChannelPerformance.description")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">
                        {displayValue(calculations.totalMeetingsAllChannels, "number")}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Meetings</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">{displayValue(calculations.totalDealsAllChannels, "number")}</p>
                      <p className="text-xs text-muted-foreground">Total Deals</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-green-600">
                        {displayValue(calculations.totalRevenueAllChannels, "currency")}
                      </p>
                      <p className="text-xs text-muted-foreground">Combined Revenue</p>
                    </div>
                    <div className="space-y-1">
                      <p
                        className={`text-2xl font-bold ${calculations.combinedROI >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {displayValue(
                          isClient
                            ? `${calculations.combinedROI >= 0 ? "+" : ""}${calculations.combinedROI.toFixed(1)}%`
                            : "--",
                          "percentage",
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">Combined ROI</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Revenue by Channel</p>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center gap-2">
                          <Mail className="h-4 w-4" /> Cold Email
                        </span>
                        <span className="font-medium">{displayValue(calculations.revenue, "currency")}</span>
                      </div>
                      {enableColdCalling && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm flex items-center gap-2">
                            <Phone className="h-4 w-4" /> Cold Calling
                          </span>
                          <span className="font-medium">{displayValue(calculations.callRevenue, "currency")}</span>
                        </div>
                      )}
                      {enableLinkedIn && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm flex items-center gap-2">
                            <Linkedin className="h-4 w-4" /> LinkedIn
                          </span>
                          <span className="font-medium">{displayValue(calculations.linkedInRevenue, "currency")}</span>
                        </div>
                      )}
                      {enableReferrals && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm flex items-center gap-2">
                            <UserPlus className="h-4 w-4" /> Referrals
                          </span>
                          <span className="font-medium">{displayValue(calculations.referralRevenue, "currency")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {enableColdCalling && (
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    Cold Calling Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xl font-bold">{displayValue(calculations.callsPerMonth, "number")}</p>
                      <p className="text-xs text-muted-foreground">Calls/Month</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-bold">{displayValue(calculations.callConnections, "number")}</p>
                      <p className="text-xs text-muted-foreground">Connections</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-bold">{displayValue(calculations.callMeetings, "number")}</p>
                      <p className="text-xs text-muted-foreground">Meetings</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-bold">{displayValue(calculations.callDeals, "number")}</p>
                      <p className="text-xs text-muted-foreground">Deals</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-green-600">
                        {displayValue(calculations.callRevenue, "currency")}
                      </p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                    <div className="space-y-1">
                      <p
                        className={`text-lg font-bold ${calculations.callROI >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {displayValue(
                          isClient
                            ? `${calculations.callROI >= 0 ? "+" : ""}${calculations.callROI.toFixed(1)}%`
                            : "--",
                          "percentage",
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">ROI</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-red-600">
                        {displayValue(calculations.callCost, "currency")}
                      </p>
                      <p className="text-xs text-muted-foreground">Cost</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold">{displayValue(calculations.callCAC, "currency")}</p>
                      <p className="text-xs text-muted-foreground">CAC</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {enableLinkedIn && (
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Linkedin className="h-5 w-5 text-blue-600" />
                    LinkedIn Outreach Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xl font-bold">
                        {displayValue(calculations.linkedInConnectionsPerMonth, "number")}
                      </p>
                      <p className="text-xs text-muted-foreground">Requests/Month</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-bold">{displayValue(calculations.linkedInAccepted, "number")}</p>
                      <p className="text-xs text-muted-foreground">Accepted</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-bold">{displayValue(calculations.linkedInMeetings, "number")}</p>
                      <p className="text-xs text-muted-foreground">Meetings</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-bold">{displayValue(calculations.linkedInDeals, "number")}</p>
                      <p className="text-xs text-muted-foreground">Deals</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-green-600">
                        {displayValue(calculations.linkedInRevenue, "currency")}
                      </p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                    <div className="space-y-1">
                      <p
                        className={`text-lg font-bold ${calculations.linkedInROI >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {displayValue(
                          isClient
                            ? `${calculations.linkedInROI >= 0 ? "+" : ""}${calculations.linkedInROI.toFixed(1)}%`
                            : "--",
                          "percentage",
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">ROI</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-red-600">
                        {displayValue(calculations.linkedInCost, "currency")}
                      </p>
                      <p className="text-xs text-muted-foreground">Cost</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold">{displayValue(calculations.linkedInCAC, "currency")}</p>
                      <p className="text-xs text-muted-foreground">CAC</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {enableReferrals && (
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-green-600" />
                    Referral Program Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xl font-bold">{displayValue(referralsPerMonth, "number")}</p>
                      <p className="text-xs text-muted-foreground">Referrals/Month</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-bold">{displayValue(calculations.referralMeetings, "number")}</p>
                      <p className="text-xs text-muted-foreground">Meetings</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-bold">{displayValue(calculations.referralDeals, "number")}</p>
                      <p className="text-xs text-muted-foreground">Deals</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-bold">{displayValue(`${referralConversionRate}%`)}</p>
                      <p className="text-xs text-muted-foreground">Conversion</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-green-600">
                        {displayValue(calculations.referralRevenue, "currency")}
                      </p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                    <div className="space-y-1">
                      <p
                        className={`text-lg font-bold ${calculations.referralROI >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {displayValue(
                          isClient
                            ? `${calculations.referralROI >= 0 ? "+" : ""}${calculations.referralROI.toFixed(1)}%`
                            : "--",
                          "percentage",
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">ROI</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-red-600">
                        {displayValue(calculations.referralCost, "currency")}
                      </p>
                      <p className="text-xs text-muted-foreground">Cost</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold">{displayValue(calculations.referralCAC, "currency")}</p>
                      <p className="text-xs text-muted-foreground">CAC</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">{t("cashFlowProjections.title")}</CardTitle>
                <CardDescription className="text-xs">
                  {t("cashFlowProjections.description")} {enableCommission && t("cashFlowProjections.includingCommission")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Summary Table */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-4 pb-2 border-b text-xs font-medium text-muted-foreground">
                      <div>Month</div>
                      <div className="text-right">Net Cash Flow</div>
                      <div className="text-right">Status</div>
                    </div>
                    {getCashFlowProjections().map((projection) => (
                      <div key={projection.month} className="grid grid-cols-3 gap-4 py-2 items-center">
                        <div className="text-sm font-medium">Month {projection.month}</div>
                        <div className="text-sm font-mono font-semibold text-right tabular-nums">
                          {formatCurrency(projection.netCashFlow)}
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              projection.profitable
                                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                            }`}
                          >
                            {projection.profitable ? "Profitable" : "Loss"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-3">Detailed Monthly Breakdown</h4>
                    <div className="space-y-3">
                      {getCashFlowProjections().map((projection) => (
                        <div
                          key={`detail-${projection.month}`}
                          className="p-3 rounded-lg bg-muted/50 border border-border"
                        >
                          <div className="font-semibold text-sm mb-2">Month {projection.month}</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Cumulative Revenue:</span>
                              <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                                +{formatCurrency(projection.revenue)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Operating Costs:</span>
                              <span className="font-mono font-semibold text-red-600 dark:text-red-400">
                                -{formatCurrency(projection.baseCost)}
                              </span>
                            </div>
                            {enableCommission && projection.commissionCost > 0 && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Commission Costs:</span>
                                <span className="font-mono font-semibold text-red-600 dark:text-red-400">
                                  -{formatCurrency(projection.commissionCost)}
                                </span>
                              </div>
                            )}
                            <div className="pt-1 mt-1 border-t border-border/50 flex justify-between font-semibold">
                              <span>Net Cash Flow:</span>
                              <span
                                className={`font-mono ${projection.profitable ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                              >
                                {formatCurrency(projection.netCashFlow)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
