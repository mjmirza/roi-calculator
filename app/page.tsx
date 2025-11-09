"use client"

import { useState, useEffect } from "react"
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
} as const

type CurrencyCode = keyof typeof CURRENCIES

export default function ROICalculator() {
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

  const triggerConfetti = () => {
    if (typeof window !== "undefined") {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // @ts-ignore
        if (window.confetti) {
          // @ts-ignore
          window.confetti(
            Object.assign({}, defaults, {
              particleCount,
              origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
              colors: ["#10b981", "#059669", "#047857"],
            }),
          )
          // @ts-ignore
          window.confetti(
            Object.assign({}, defaults, {
              particleCount,
              origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
              colors: ["#10b981", "#059669", "#047857"],
            }),
          )
        }
      }, 250)
    }
  }

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
  ])

  useEffect(() => {
    const validateRequiredFields = () => {
      const missing: string[] = []
      if (mailboxes < 1) missing.push("Sending mailboxes (min: 1)")
      if (emailsPerDay < 1) missing.push("Emails per day per mailbox (min: 1)")
      if (workingDays < 1) missing.push("Working days per month (min: 1)")
      if (ratioPerReply < 1) missing.push("Ratio per positive reply (min: 1)")
      if (closeRate < 1) missing.push("AEs close-rate (min: 1%)")
      // Updated validation to use LTV
      if (ltv < 1) missing.push("Estimated LTV per deal (min: 1)")

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

    // Cold Email Calculations - REFERENCE IMPLEMENTATION (tools.coldiq.com)
    // Step 1: Total emails sent across all mailboxes
    const totalEmailsAllMailboxes = mailboxes * emailsPerDay * workingDays

    // Step 2: Unique prospects (divide by sequence steps, not multiply!)
    const totalProspects = Math.floor(totalEmailsAllMailboxes / sequenceSteps)

    // Step 3: Opportunities (divide by ratio, not multiply!)
    const opportunities = Math.floor(totalProspects / ratioPerReply)

    // Step 4: Meetings (76% conversion rate to match reference)
    const meetings = Math.floor(opportunities * 0.76)

    // Step 5: Deals
    const deals = Math.floor(meetings * (closeRate / 100))

    // Step 6: Revenue
    const revenue = deals * ltv

    // For compatibility with rest of code, calculate these metrics
    const emailsPerMonth = emailsPerDay * workingDays  // PER MAILBOX (not total!)
    const totalEmails = totalEmailsAllMailboxes  // Total across all mailboxes
    const delivered = Math.round(totalEmails * (1 - bounceRate / 100))
    const opens = Math.round(delivered * (openRate / 100))
    const emailsReplied = Math.round(totalEmails * (replyRate / 100))

    // Leads are defined as total prospects in reference (not opportunities!)
    const positiveReplies = totalProspects  // This should be prospects contacted
    const leads = totalProspects  // Leads Contacted = Prospects in reference

    // Prospects are unique contacts (same as totalProspects in reference)
    const prospects = totalProspects

    console.log("[v0] ===== CALCULATION BREAKDOWN (REFERENCE METHOD) =====")
    console.log("[v0] Revenue Setup:", { domains, mailboxes, emailsPerDay, workingDays, sequenceSteps })
    console.log("[v0] Performance Metrics:", { ratioPerReply, closeRate, ltv })
    console.log("[v0] Email Funnel:")
    console.log("[v0]   totalEmailsAllMailboxes =", mailboxes, "×", emailsPerDay, "×", workingDays, "=", totalEmailsAllMailboxes)
    console.log("[v0]   totalProspects = Math.floor(", totalEmailsAllMailboxes, "÷", sequenceSteps, ") =", totalProspects)
    console.log("[v0]   opportunities = Math.floor(", totalProspects, "÷", ratioPerReply, ") =", opportunities)
    console.log("[v0]   meetings = Math.floor(", opportunities, "× 0.76) =", meetings)
    console.log("[v0]   deals = Math.floor(", meetings, "× (", closeRate, "/ 100)) =", deals)
    console.log("[v0]   revenue =", deals, "×", ltv, "=", revenue)
    console.log("[v0] ===== END BREAKDOWN =====")

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
      emailsReplied: Math.round(totalEmails * (replyRate / 100)), // Recalculating emailsReplied
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
      isValid: validation.isValid,
      missingFields: validation.missingFields,
    })

    // Trigger animations
    if (isClient && prevROI <= 100 && roiWithCommission > 100) {
      triggerConfetti()
    }
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

    // Show a toast or notification about which scenario was loaded
    console.log(`[v0] Loaded scenario: ${scenario.name}`)
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
    // Reset commission state
    setCommissionType("percentage")
    setCommissionRate(10)
    setCommissionFlat(500)
    // Reset commission visibility state
    setShowCommission(false)

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
    const convertedValue = value * currencyInfo.rate

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: currency === "JPY" ? 0 : 2,
      maximumFractionDigits: currency === "JPY" ? 0 : 2,
    }).format(convertedValue)
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
        message: "Your campaign is operating at a loss (including all channels)",
        action: "Reduce costs or improve conversion rates across all channels to achieve profitability",
      })
    }

    // Check LTV/CAC ratio
    if (calculations.combinedCAC > 0 && calculations.ltvCacRatio < 1 && calculations.ltvCacRatio > 0) {
      suggestions.push({
        type: "critical",
        message: "LTV/CAC ratio is below 1:1 - unsustainable",
        action: "Increase deal size, reduce acquisition costs, or improve close rates",
      })
    } else if (calculations.combinedCAC > 0 && calculations.ltvCacRatio < 3 && calculations.ltvCacRatio >= 1) {
      suggestions.push({
        type: "warning",
        message: "LTV/CAC ratio should be 3:1 or higher for healthy growth",
        action: "Focus on increasing customer lifetime value or reducing CAC",
      })
    }

    // Check open rate (Cold Email specific)
    if (enableEmailMetrics && openRate < 40) {
      suggestions.push({
        type: "warning",
        message: `Cold Email Open rate (${openRate}%) is below industry average (40-60%)`,
        action: "Improve subject lines, check deliverability, or warm up domains properly",
      })
    }

    // Check reply rate (Cold Email specific)
    if (enableEmailMetrics && replyRate < 1) {
      suggestions.push({
        type: "warning",
        message: `Cold Email Reply rate (${replyRate}%) is very low`,
        action: "Improve email copy, better targeting, or refine your ICP (Ideal Customer Profile)",
      })
    }

    // Check bounce rate (Cold Email specific)
    if (enableEmailMetrics && bounceRate > 5) {
      suggestions.push({
        type: "critical",
        message: `Cold Email Bounce rate (${bounceRate}%) is too high - damages sender reputation`,
        action: "Use better data providers, verify emails before sending, or clean your lists",
      })
    }

    // Check emails per day (Cold Email specific)
    if (enableEmailMetrics && emailsPerDay > 50) {
      suggestions.push({
        type: "warning",
        message: `Sending ${emailsPerDay} emails/day per mailbox may trigger spam filters`,
        action: "Reduce to 30-50 emails per day per mailbox for better deliverability",
      })
    }

    // Check cold calling rates
    if (enableColdCalling) {
      if (callConnectRate < 20) {
        suggestions.push({
          type: "warning",
          message: `Cold Calling Connect rate (${callConnectRate}%) is low`,
          action: "Improve your calling script, target better leads, or optimize calling times",
        })
      }
      if (callToMeetingRate < 10) {
        suggestions.push({
          type: "warning",
          message: `Cold Calling to Meeting rate (${callToMeetingRate}%) is low`,
          action: "Enhance your post-connection pitch or offer more compelling meeting incentives",
        })
      }
    }

    // Check LinkedIn rates
    if (enableLinkedIn) {
      if (linkedInAcceptRate < 20) {
        suggestions.push({
          type: "warning",
          message: `LinkedIn Accept rate (${linkedInAcceptRate}%) is low`,
          action: "Personalize connection requests, ensure your profile is optimized, or target relevant connections",
        })
      }
      if (linkedInReplyRate < 5) {
        suggestions.push({
          type: "warning",
          message: `LinkedIn Reply rate (${linkedInReplyRate}%) is low`,
          action: "Craft engaging initial messages after connection, and follow up strategically",
        })
      }
      if (linkedInMeetingRate < 15) {
        suggestions.push({
          type: "warning",
          message: `LinkedIn Meeting rate (${linkedInMeetingRate}%) is low`,
          action: "Improve your value proposition and call to action in messages",
        })
      }
    }

    // Check if costs are too high
    if (
      calculations.totalCostAllChannels > calculations.totalRevenueAllChannels &&
      calculations.totalRevenueAllChannels > 0
    ) {
      const costBreakdown = [
        { name: "GTM Engineer", value: engineerCost },
        { name: "Software", value: softwareCost },
        { name: "Mailboxes", value: mailboxCost },
        { name: "Deliverability", value: deliveryCost },
        { name: "Data Provider", value: dataProviderCost },
        { name: "Copywriter", value: copywriterCost },
        { name: "Commission", value: calculations.commissionCost },
        { name: "Cold Calling Software", value: callingSoftwareCost },
        { name: "Caller Salary", value: callerSalaryCost },
        { name: "LinkedIn Tool", value: linkedInToolCost },
        { name: "LinkedIn Manager", value: linkedInManagerCost },
        { name: "Referral Program", value: referralProgramCost },
        { name: "Referral Incentives", value: calculations.referralCost - referralProgramCost },
      ]
        .filter((c) => c.value > 0)
        .sort((a, b) => b.value - a.value)

      if (costBreakdown.length > 0) {
        suggestions.push({
          type: "info",
          message: `Highest cost: ${costBreakdown[0].name} (${formatCurrency(costBreakdown[0].value)})`,
          action: "Consider optimizing this cost or improving output to justify the expense",
        })
      }
    }

    // Check if agency would be better
    if (showAgencyComparison && enableAgency && calculations.costSavingsVsAgency < 0) {
      suggestions.push({
        type: "info",
        message: `Agency would save you ${formatCurrency(Math.abs(calculations.costSavingsVsAgency))}/month`,
        action: "Consider outsourcing to an agency instead of building in-house",
      })
    }

    // Check close rate (applies to all channels)
    if (closeRate < 20) {
      suggestions.push({
        type: "warning",
        message: `Overall Close rate (${closeRate}%) is very low`,
        action: "Improve sales process, qualify leads better, or provide sales training",
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
    for (let i = 1; i <= 5; i++) {
      const cumulativeCash = calculations.totalRevenueAllChannels * i - calculations.totalCostAllChannels * i
      projections.push({
        month: i,
        cash: cumulativeCash,
        profitable: cumulativeCash >= 0, // Corrected condition for profitability
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
        {minValue !== undefined && <span className="text-xs text-muted-foreground ml-1">(min: {minValue})</span>}
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
      <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>

      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">ROI Calculator</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate your cold outreach campaign return on investment across multiple channels
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Select value={currency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
                  <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CURRENCIES).map(([code, info]) => (
                      <SelectItem key={code} value={code}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">{info.symbol}</span>
                          <span>{code}</span>
                          <span className="text-xs text-muted-foreground">- {info.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={shuffleScenario}
                className="gap-2 transition-all hover:scale-105 bg-transparent"
                title="Load a random realistic scenario to test the calculator"
              >
                <Shuffle className="h-4 w-4" />
                Shuffle Scenario
              </Button>
              {/* Removed duplicate handleReset function - calling resetToDefaults directly from button */}
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefaults}
                className="gap-2 transition-all hover:scale-105 bg-transparent"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
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
                    <CardTitle className="text-base">Required Fields Missing</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Please fill in the following required fields to see calculations:
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Calculation Breakdown</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">See how your inputs flow through the system</span>
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
                        <div className="font-semibold mb-1">Total Emails Sent</div>
                        <div className="text-muted-foreground">
                          {mailboxes} mailboxes × {emailsPerDay} emails/day × {workingDays} working days ×{" "}
                          {sequenceSteps} sequence steps
                        </div>
                        <div className="font-mono text-lg mt-2 text-blue-600">
                          = {displayValue(calculations.totalEmails, "number")} emails
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                        2
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">Emails Opened</div>
                        <div className="text-muted-foreground">
                          {displayValue(calculations.totalEmails, "number")} emails × {openRate}% open rate
                        </div>
                        <div className="font-mono text-lg mt-2 text-blue-600">
                          = {displayValue(calculations.emailsOpened, "number")} opens
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                        3
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">Emails Replied</div>
                        <div className="text-muted-foreground">
                          {displayValue(calculations.totalEmails, "number")} emails × {replyRate}% reply rate
                        </div>
                        <div className="font-mono text-lg mt-2 text-blue-600">
                          = {displayValue(calculations.emailsReplied, "number")} replies
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                        4
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">Positive Replies</div>
                        <div className="text-muted-foreground">
                          {displayValue(calculations.emailsReplied, "number")} replies × {positiveReplyRate}% positive
                          rate
                        </div>
                        <div className="font-mono text-lg mt-2 text-blue-600">
                          = {displayValue(calculations.positiveReplies, "number")} positive replies
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                        5
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">Opportunities Created</div>
                        <div className="text-muted-foreground">
                          {displayValue(calculations.positiveReplies, "number")} positive replies ÷ {ratioPerReply}{" "}
                          ratio (1 opportunity per {ratioPerReply} positive replies)
                        </div>
                        <div className="font-mono text-lg mt-2 text-blue-600">
                          = {displayValue(calculations.opportunities, "number")} opportunities
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                        6
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">Meetings Booked</div>
                        <div className="text-muted-foreground">
                          {displayValue(calculations.opportunities, "number")} opportunities × {meetingBookRate}%
                          meeting book rate
                        </div>
                        <div className="font-mono text-lg mt-2 text-blue-600">
                          = {displayValue(calculations.meetings, "number")} meetings
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                        7
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">Deals Closed</div>
                        <div className="text-muted-foreground">Meetings convert to deals (1:1 ratio)</div>
                        <div className="font-mono text-lg mt-2 text-blue-600">
                          = {displayValue(calculations.deals, "number")} deals
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-green-50 border-2 border-green-500/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-xs">
                        8
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1 text-green-700">Total Revenue</div>
                        <div className="text-muted-foreground">
                          {displayValue(calculations.deals, "number")} deals × {formatCurrency(ltv)} LTV per deal
                        </div>
                        <div className="font-mono text-2xl mt-2 text-green-600 font-bold">
                          = {displayValue(calculations.revenue, "currency")}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                          <div className="font-semibold mb-1">Understanding Your Results</div>
                          <div className="space-y-1 text-blue-800">
                            <div>
                              • If changing mailboxes doesn't affect results, check your conversion rates (open rate,
                              reply rate, etc.)
                            </div>
                            <div>
                              • Low conversion rates create bottlenecks - even 10x more emails won't help if only 0.1%
                              convert
                            </div>
                            <div>
                              • The "Ratio per positive reply" is critical - it determines how many positive replies
                              become opportunities
                            </div>
                            <div>• Your close rate affects how many opportunities become actual deals</div>
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
                <CardTitle className="text-base">Revenue Setup</CardTitle>
                <CardDescription>Configure your core outreach parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="domains"
                    label="Domains"
                    tooltip="Number of unique domains you'll use for sending emails. Using multiple domains helps protect your sender reputation."
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
                    label="Sending mailboxes"
                    tooltip="Total number of email accounts you'll use to send campaigns. More mailboxes = higher volume capacity."
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
                    label="Emails per day per mailbox"
                    tooltip="How many emails each mailbox sends daily. Keep this under 50 to maintain good deliverability and avoid spam filters."
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
                    label="Working days per month"
                    tooltip="Number of business days per month you'll be sending emails. Typically 20-22 days (excluding weekends)."
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
                    label="Sequence steps"
                    tooltip="Number of follow-up emails in your sequence. Example: 1 initial email + 2 follow-ups = 3 steps total."
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
                <CardTitle className="text-base">Performance Metrics</CardTitle>
                <CardDescription>Define your conversion rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="ratioPerReply"
                    label="Ratio per positive reply"
                    tooltip="How many emails you need to send to get 1 positive reply. Example: 300 means 1 interested reply per 300 emails sent."
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
                    label="AEs close-rate (%)"
                    tooltip="Percentage of opportunities that your sales team converts into paying customers. Example: 70% means 7 out of 10 opportunities close."
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
                    label="Deal Value / LTV" // Updated label
                    tooltip="Lifetime Value - the total revenue you expect from one customer over their entire relationship with your business."
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
                      <CardTitle className="text-base">Advanced Metrics</CardTitle>
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
                        <span className="text-xs text-muted-foreground">{enableAdvanced ? "Enabled" : "Disabled"}</span>
                      </div>
                    </div>
                    <CardDescription className="mt-1 flex items-start gap-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span className="text-xs">
                        Enable to see detailed email performance metrics on the right panel
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
                      label="Open rate (%)"
                      tooltip="Percentage of emails that get opened. Industry average: 40-60%. Lower rates indicate deliverability issues."
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
                      label="Reply rate (%)"
                      tooltip="Percentage of emails that get any reply (positive or negative). Industry average: 1-5%."
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
                      label="Positive reply rate (%)"
                      tooltip="Of all replies, what percentage are positive/interested? Typically 20-40% of total replies."
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
                      label="Meeting book rate (%)"
                      tooltip="Percentage of positive replies that convert to booked meetings. Industry average: 40-60%."
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
                      label="Bounce rate (%)"
                      tooltip="Percentage of emails that bounce (invalid addresses). Keep under 5% to maintain sender reputation."
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
                      label="Unsubscribe rate (%)"
                      tooltip="Percentage of recipients who unsubscribe. Keep under 1% for healthy campaigns."
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
                      label="Sales cycle length (days)"
                      tooltip="Average number of days from first contact to closed deal. Helps calculate time to revenue."
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
                      label="Monthly churn rate (%)"
                      tooltip="Percentage of customers who cancel each month. Important for calculating true LTV."
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
                <CardTitle className="text-base">Cost Structure</CardTitle>
                <CardDescription>Enter your monthly costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <LabelWithTooltip
                    htmlFor="domainCost"
                    label="Domains monthly cost"
                    tooltip="Monthly cost for all your domains. Typically $10-15 per domain per year, so divide annual cost by 12."
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
                    label="Mailboxes monthly cost"
                    tooltip="Monthly cost for all email accounts. Google Workspace or similar services typically cost $6-12 per mailbox per month."
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
                    label="Deliverability setup cost/month"
                    tooltip="Monthly cost for email warmup services and deliverability tools to ensure your emails reach the inbox, not spam."
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
                    label="Software cost"
                    tooltip="Monthly cost for cold email software platforms (like Instantly, Smartlead, etc.) used to manage and automate campaigns."
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
                    label="GTM Engineer cost"
                    tooltip="Monthly salary/cost for your Go-To-Market engineer or specialist who manages the cold email infrastructure and campaigns."
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
                        label="Email warmup cost"
                        tooltip="Monthly cost for warming up new email accounts to build sender reputation. Typically $20-50 per mailbox."
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
                        label="Data provider cost"
                        tooltip="Monthly cost for lead data providers (Apollo, ZoomInfo, etc.) to source quality contact lists."
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
                        label="Copywriter cost"
                        tooltip="Monthly cost for professional copywriting services to create high-converting email sequences."
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
                      <CardTitle className="text-base">Sales Commission</CardTitle>
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
                          {enableCommission ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                    <CardDescription className="mt-1 flex items-start gap-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span className="text-xs">Enable to see commission impact analysis on the right panel</span>
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
                      Commission Type
                    </Label>
                    <Select
                      value={commissionType}
                      onValueChange={(value) => setCommissionType(value as "percentage" | "flat")}
                    >
                      <SelectTrigger id="commissionType" className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage of Deal Value</SelectItem>
                        <SelectItem value="flat">Flat Rate per Deal</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {commissionType === "percentage"
                        ? "Sales reps earn a percentage of each closed deal"
                        : "Sales reps earn a fixed amount per closed deal"}
                    </p>
                  </div>

                  {commissionType === "percentage" ? (
                    <div className="space-y-2">
                      <LabelWithTooltip
                        htmlFor="commissionRate"
                        label="Commission Rate (%)"
                        tooltip="Percentage of deal value paid to sales reps. Industry standard: 10-20% for B2B sales, 5-10% for high-ticket items."
                      />
                      <Input
                        id="commissionRate"
                        type="number"
                        value={commissionRate || ""}
                        onChange={(e) => handleNumberInput(e.target.value, setCommissionRate)}
                        className="font-mono transition-all focus:ring-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        Sales rep earns {formatCurrency(ltv * (commissionRate / 100))} per deal{" "}
                        {/* Updated to use LTV */}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <LabelWithTooltip
                        htmlFor="commissionFlat"
                        label="Commission per Deal"
                        tooltip="Fixed amount paid to sales reps per closed deal. Common for standardized products or services."
                      />
                      <Input
                        id="commissionFlat"
                        type="number"
                        value={commissionFlat || ""}
                        onChange={(e) => handleNumberInput(e.target.value, setCommissionFlat)}
                        className="font-mono transition-all focus:ring-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        Sales rep earns {formatCurrency(commissionFlat)} per deal
                      </p>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div className="p-3 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Total Monthly Commission</p>
                      <p className="text-lg font-bold tabular-nums text-purple-700 dark:text-purple-400">
                        {displayValue(calculations.commissionCost, "currency")}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Based on {displayValue(calculations.deals, "number")} deals closed per month
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
                      <CardTitle className="text-base">Agency Comparison</CardTitle>
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
                        <span className="text-xs text-muted-foreground">{enableAgency ? "Enabled" : "Disabled"}</span>
                      </div>
                    </div>
                    <CardDescription className="mt-1 flex items-start gap-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span className="text-xs">Enable to compare in-house vs agency costs on the right panel</span>
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
                      label="Agency setup fee (one-time)"
                      tooltip="One-time setup fee charged by agencies to onboard and configure your cold email campaigns."
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
                      label="Agency monthly retainer"
                      tooltip="Fixed monthly fee charged by agencies for managing your cold email campaigns. Typically $5,000-$15,000/month."
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
                      label="Agency per-lead fee"
                      tooltip="Additional cost per qualified lead/opportunity generated. Typically $100-$300 per lead depending on industry."
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
                      <CardTitle className="text-base">Cold Calling</CardTitle>
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
                          {enableColdCalling ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                    <CardDescription className="mt-1 flex items-start gap-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span className="text-xs">
                        Enable to add cold calling metrics and see combined channel performance
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
                      label="Calls per day"
                      tooltip="Number of outbound calls your team makes per day. Industry average: 40-80 calls/day."
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
                      label="Connect rate (%)"
                      tooltip="Percentage of calls where you reach a decision maker. Industry average: 20-40%."
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
                      label="Call to meeting rate (%)"
                      tooltip="Percentage of connected calls that result in a booked meeting. Industry average: 10-20%."
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
                      label="Calling days per month"
                      tooltip="Number of days per month dedicated to cold calling."
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
                      label="Calling software cost (monthly)"
                      tooltip="Monthly cost for calling software (e.g., Aircall, RingCentral, Dialpad)."
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
                      label="Caller salary/cost (monthly)"
                      tooltip="Monthly salary or cost for the person making cold calls."
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
                      <CardTitle className="text-base">LinkedIn Outreach</CardTitle>
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
                        <span className="text-xs text-muted-foreground">{enableLinkedIn ? "Enabled" : "Disabled"}</span>
                      </div>
                    </div>
                    <CardDescription className="mt-1 flex items-start gap-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span className="text-xs">
                        Enable to add LinkedIn outreach metrics and see combined channel performance
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
                      label="Connection requests per day"
                      tooltip="Number of LinkedIn connection requests sent per day. LinkedIn limit: ~100/week."
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
                      label="Accept rate (%)"
                      tooltip="Percentage of connection requests that get accepted. Industry average: 20-40%."
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
                      label="Reply rate (%)"
                      tooltip="Percentage of accepted connections that reply to your message. Industry average: 5-15%."
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
                      label="Meeting booking rate (%)"
                      tooltip="Percentage of replies that convert to booked meetings. Industry average: 15-30%."
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
                      label="LinkedIn tool cost (monthly)"
                      tooltip="Monthly cost for LinkedIn automation tools (e.g., Sales Navigator, Dux-Soup)."
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
                      label="LinkedIn manager cost (monthly)"
                      tooltip="Monthly salary or cost for the person managing LinkedIn outreach."
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
                      <CardTitle className="text-base">Referral Program</CardTitle>
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
                          {enableReferrals ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                    <CardDescription className="mt-1 flex items-start gap-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span className="text-xs">
                        Enable to add referral program metrics and see combined channel performance
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
                      label="Referrals per month"
                      tooltip="Number of qualified referrals you expect to receive per month."
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
                      label="Referral to meeting rate (%)"
                      tooltip="Percentage of referrals that convert to meetings. Referrals typically convert at 30-50%."
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
                      label="Referral incentive per deal"
                      tooltip="Amount paid to the referrer for each successful deal closed."
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
                      label="Program management cost (monthly)"
                      tooltip="Monthly cost to manage and promote your referral program."
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
                      {hasCriticalIssues ? "Critical Issues Detected" : "Optimization Suggestions"}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {hasCriticalIssues
                      ? "Address these issues to improve profitability"
                      : "Tips to improve your campaign performance"}
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
                      +{suggestions.length - 4} more suggestions
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
                      Overall ROI (All Channels)
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
                    Cold Email ROI:{" "}
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
                      Overall Revenue
                    </CardDescription>
                    <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0" />
                  </div>
                  <CardTitle className="text-3xl sm:text-4xl font-bold tabular-nums text-green-700 dark:text-green-400 transition-all break-words leading-tight">
                    {displayValue(calculations.totalRevenueAllChannels, "currency")}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">Total revenue generated per month</p>
                </CardHeader>
              </Card>
            </div>

            {/* Commission Impact - only show if enabled */}
            {enableCommission && (
              <Card className="transition-all hover:shadow-md border-2 border-purple-200 dark:border-purple-900">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-base">Commission Impact Analysis</CardTitle>
                      <CardDescription className="text-xs">How commission affects your bottom line</CardDescription>
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
                      <CardTitle className="text-base">In-House vs Agency Comparison</CardTitle>
                      <CardDescription className="text-xs">Cost analysis and savings breakdown</CardDescription>
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
                        <p className="text-sm font-semibold mb-1">Monthly Savings with In-House</p>
                        <p className="text-xs text-muted-foreground">
                          {isClient && calculations.opportunities > 0
                            ? calculations.costSavingsVsAgency >= 0
                              ? "You save by building in-house"
                              : "Agency would be cheaper"
                            : "Fill required fields to compare"}
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
                    Multi-Channel Performance
                  </CardTitle>
                  <CardDescription>Combined metrics across all enabled channels</CardDescription>
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

            {/* Email Performance Metrics - only show if enabled */}
            {enableEmailMetrics && enableAdvanced && (
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">Email Performance Metrics</CardTitle>
                  <CardDescription className="text-xs">Your email outreach volume and reach</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-3xl font-bold tabular-nums">
                        {displayValue(calculations.emailsPerMonth, "number")}
                      </p>
                      <p className="text-xs text-muted-foreground">Emails/Month per Mailbox</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold tabular-nums">
                        {displayValue(calculations.totalEmails, "number")}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Emails/Month</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold tabular-nums">
                        {displayValue(calculations.prospects, "number")}
                      </p>
                      <p className="text-xs text-muted-foreground">Prospects/Month</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold tabular-nums">{displayValue(calculations.leads, "number")}</p>
                      <p className="text-xs text-muted-foreground">Leads Contacted</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Sales Performance</CardTitle>
                <CardDescription className="text-xs">Your sales funnel metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                    <p className="text-3xl font-bold tabular-nums text-green-700 dark:text-green-400 break-words">
                      {displayValue(calculations.opportunities, "number")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Opportunities</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                    <p className="text-3xl font-bold tabular-nums text-green-700 dark:text-green-400 break-words">
                      {displayValue(calculations.meetings, "number")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Meetings</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                    <p className="text-3xl font-bold tabular-nums text-green-700 dark:text-green-400 break-words">
                      {displayValue(calculations.deals, "number")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Deals Closed</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-900 sm:col-span-2 lg:col-span-1">
                    <p className="text-2xl sm:text-3xl font-bold tabular-nums text-green-700 dark:text-green-400 break-words leading-tight">
                      {displayValue(calculations.totalRevenueAllChannels, "currency")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Financial Analysis</CardTitle>
                <CardDescription className="text-xs">Cost breakdown and efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total Monthly Cost</p>
                    <p className="text-2xl font-bold tabular-nums text-red-700 dark:text-red-400">
                      {displayValue(calculations.totalCostAllChannels, "currency")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Cost per Meeting</p>
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
                    <p className="text-xs text-muted-foreground">Customer Acquisition Cost</p>
                    <p className="text-2xl font-bold tabular-nums">
                      {displayValue(calculations.combinedCAC, "currency")}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                  <span className="text-sm font-medium">LTV/CAC Ratio</span>
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-bold">
                    {calculations.ltvCacRatio > 0 ? calculations.ltvCacRatio.toFixed(1) : "--"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">5-Month Cash Flow Projections</CardTitle>
                <CardDescription className="text-xs">Cumulative cash flow over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-4 pb-2 border-b text-xs font-medium text-muted-foreground">
                    <div>Month</div>
                    <div className="text-right">Cumulative Cash Flow</div>
                    <div className="text-right">Status</div>
                  </div>
                  {getCashFlowProjections().map((projection) => (
                    <div key={projection.month} className="grid grid-cols-3 gap-4 py-2 items-center">
                      <div className="text-sm">Month {projection.month}</div>
                      <div className="text-sm font-mono font-semibold text-right tabular-nums">
                        {formatCurrency(projection.cash)}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
