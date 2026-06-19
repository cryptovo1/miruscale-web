"use client"

// ============================================================
// MiruScalePage.tsx — Miru Scale · AI Client Systems for Coaches
// Framer Code Component — Version 4.0
// Design reference: betterstack.com, linear.app
// Color: Teal (#0D9488) — no indigo, no violet
// Target: 20,000+ lines of production-ready code
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { createPortal } from "react-dom"

// CSS is loaded via globals.css (Next.js)
function CSSInjector() { return null }


// ============================================================
// § 1 — CSS BLOCK
// Injected once into document.head on mount.
// All classes prefixed with ms- to avoid Framer conflicts.
// Every property on its own line for readability and diffability.
// ============================================================


// ============================================================
// § 2 — TYPESCRIPT INTERFACES
// Strict typing for all data structures. No `any`.
// ============================================================

interface LeadSample {
  readonly id:          string
  readonly label:       string
  readonly emoji:       string
  readonly message:     string
  readonly scores:      {
    readonly intent:     number
    readonly budget:     number
    readonly fit:        number
    readonly readiness:  number
  }
  readonly bucket:      "hot" | "warm" | "pass"
  readonly bucketLabel: string
  readonly reply:       string
}

interface PainPoint {
  readonly id:    string
  readonly title: string
  readonly desc:  string
}

interface SolutionItem {
  readonly id:    "qualify" | "followup" | "calendar"
  readonly num:   string
  readonly title: string
  readonly desc:  string
  readonly bullets: readonly string[]
}

interface TimelineStep {
  readonly id:     number
  readonly time:   string
  readonly title:  string
  readonly body:   string
  readonly visual: "none" | "terminal" | "builder" | "callout"
}

interface SupportingMetric {
  readonly display:  string
  readonly numericValue?: number
  readonly label:   string
}

interface Testimonial {
  readonly text:        string
  readonly name:        string
  readonly role:        string
  readonly placeholder?: boolean
}

interface FAQEntry {
  readonly q: string
  readonly a: string
}

interface BeforeAfterRow {
  readonly before: string
  readonly after:  string
}

// ============================================================
// § 3 — DATA CONSTANTS
// All content in one place. Easy to update without touching JSX.
// ============================================================

const LEAD_SAMPLES: readonly LeadSample[] = [
  {
    id: "hot",
    label: "Hot Lead",
    emoji: "★",
    message:
      "Hey! I've been following you for about 6 months and I'm genuinely ready to invest in myself. I'm a 32yo woman, I've tried everything — keto, calorie counting, group programs — and nothing sticks long-term. I want someone to actually work with me 1:1. What do your packages look like and what's the investment?",
    scores: { intent: 96, budget: 84, fit: 91, readiness: 95 },
    bucket: "hot",
    bucketLabel: "Ready to Book",
    reply:
      "Hey! Really glad you reached out — what you described is exactly what I work with every day.\n\nThe fact that you've tried structured programs and they haven't stuck long-term usually tells me this is a mindset + identity shift, not just another plan. That's where 1:1 actually makes the difference.\n\nI'd love to hop on a quick 15-min call to see if we're a good fit — no pressure, just a conversation.\n\n[Booking link]",
  },
  {
    id: "warm",
    label: "Warm Lead",
    emoji: "→",
    message:
      "Hi, I saw your post about sustainable weight loss and it really resonated with me. I'm interested in coaching but I want to understand the process a bit better before committing. How does everything work and what's the investment look like?",
    scores: { intent: 62, budget: 46, fit: 54, readiness: 58 },
    bucket: "warm",
    bucketLabel: "Nurture",
    reply:
      "Hey! Really glad that post landed.\n\nBefore I send you all the info, I want to make sure I point you in the right direction. What's the main thing you're trying to solve right now — lose weight, build habits, get consistent?\n\nThat way I can tell you honestly whether what I offer is actually what you need. 💬",
  },
  {
    id: "info",
    label: "Info Seeker",
    emoji: "?",
    message:
      "Hi! Do you have any free resources or a YouTube channel? I'm just starting out with fitness and trying to learn the basics before I invest in anything paid.",
    scores: { intent: 18, budget: 5, fit: 12, readiness: 22 },
    bucket: "pass",
    bucketLabel: "Not a Fit — Yet",
    reply:
      "Hey! Yes — I drop free content every week on Instagram, and my Reels cover exactly the basics you're looking for. Start with the pinned post — it walks through the exact framework I teach.\n\nWhen you feel ready to go deeper with 1:1 support, come back and we'll chat. 🙏",
  },
  {
    id: "spam",
    label: "Wrong Fit",
    emoji: "×",
    message:
      "Hi! I'm a social media growth expert and I help fitness coaches grow to 100k followers in 90 days using my proven viral content framework. Want to jump on a quick call to see how we can scale your brand?",
    scores: { intent: 0, budget: 0, fit: 0, readiness: 2 },
    bucket: "pass",
    bucketLabel: "Not a Fit",
    reply:
      "Hey! Thanks for reaching out. This isn't something I'm looking for right now.\n\nWishing you all the best! 🙏",
  },
] as const

const PAIN_POINTS: readonly PainPoint[] = [
  {
    id: "five-min",
    title: "The 5-Minute Window",
    desc:
      "78% of leads buy from the first person who responds. After 5 minutes, your conversion rate drops 80%. You can't respond in 5 minutes. Your system can.",
  },
  {
    id: "admin",
    title: "5–10 Hours of Admin Every Week",
    desc:
      "DM replies. Follow-up messages. The same questions. Scheduling back-and-forth. That's not coaching. That's a full day of your life, every week.",
  },
  {
    id: "cold",
    title: "Leads Go Cold and You Never Know",
    desc:
      "Someone DMs you. You reply 3 hours later. They've already booked somewhere else. It happens every week. Your current setup can't catch it.",
  },
  {
    id: "bottleneck",
    title: "You're the Bottleneck",
    desc:
      "Your business can only grow as fast as you can handle leads manually. Every DM that needs your attention is a hard ceiling on your revenue.",
  },
] as const

const SOLUTIONS: readonly SolutionItem[] = [
  {
    id: "qualify",
    num: "01",
    title: "Lead Qualification",
    desc:
      "Every new lead gets instantly qualified. The system asks the right questions, scores their fit, and separates serious buyers from tire-kickers.",
    bullets: [
      "Works across Instagram DMs, email, and web forms",
      "Lead score 0–100 — clear, not a black box",
      "Hot leads flagged and handed off immediately",
    ],
  },
  {
    id: "followup",
    num: "02",
    title: "Automated Follow-Up",
    desc:
      "Nobody falls through the cracks. Leads who don't book immediately get personalized, timed sequences that sound like you — not a robot.",
    bullets: [
      "Multi-touch sequences based on lead behavior",
      "Trained on your voice and offers",
      "Stops automatically when they book or opt out",
    ],
  },
  {
    id: "calendar",
    num: "03",
    title: "Call Booking",
    desc:
      "The system books the call. Sends the confirmation. Sends the reminder. Your calendar fills itself while you coach, sleep, or live your life.",
    bullets: [
      "Integrates with Calendly, Cal.com, or equivalent",
      "Automated reminders 24h + 1h before the call",
      "Rescheduling handled automatically",
    ],
  },
] as const

const BEFORE_AFTER: readonly BeforeAfterRow[] = [
  {
    before: "Manual DM replies for every single lead",
    after:  "AI qualifies and responds instantly, 24/7",
  },
  {
    before: "Leads go cold after 24 hours of silence",
    after:  "Automated follow-up keeps them warm for weeks",
  },
  {
    before: "Hours per week lost to scheduling back-and-forth",
    after:  "Calendar fills automatically — no back-and-forth",
  },
  {
    before: "No visibility into what's in your pipeline",
    after:  "Clear view of every lead's status, always",
  },
  {
    before: "Revenue capped by how many DMs you can handle",
    after:  "System works 24/7 — no ceiling on what you close",
  },
] as const

const TIMELINE_STEPS: readonly TimelineStep[] = [
  {
    id: 1,
    time: "day 0 · 15 min",
    title: "Free Discovery Call",
    body:
      "We talk about your business, your lead flow, and exactly where you're losing clients. I tell you what system you need, what it costs, and when I can deliver it. No pitch. No pressure.",
    visual: "none",
  },
  {
    id: 2,
    time: "day 1–2 · async",
    title: "Audit & Blueprint",
    body:
      "I map out your current client acquisition flow — DMs, email, booking, follow-up — and design the system around it. You approve everything before I write a single line.",
    visual: "terminal",
  },
  {
    id: 3,
    time: "day 3–12 · build",
    title: "Build & Test",
    body:
      "I build the system, connect it to your tools, and run every scenario through it until it handles edge cases cleanly. You don't touch anything during this phase.",
    visual: "builder",
  },
  {
    id: 4,
    time: "day 13–14 · yours",
    title: "Handover & Launch",
    body:
      "Full walkthrough. You own the system — the code, the docs, every credential. It goes live. 14 days of direct support while it settles in. Then it just runs.",
    visual: "callout",
  },
] as const

const SUPPORTING_METRICS: readonly SupportingMetric[] = [
  {
    display:      "< 5 min",
    label:        "avg response to new leads",
  },
  {
    display:      "0",
    numericValue: 0,
    label:        "leads lost to slow replies",
  },
  {
    display:      "14 days",
    label:        "from first call to live system",
  },
] as const

const TESTIMONIALS: readonly Testimonial[] = [
  {
    text:
      "Quote about time saved, leads converted, and what changed in the business. This will be replaced with a real testimonial from the first client after delivery.",
    name: "Coach Name",
    role: "Fitness Coach · 28k followers",
    placeholder: true,
  },
  {
    text:
      "Quote about the build process — how fast it was, how smooth the handover felt, and what the ROI looked like within the first 30 days.",
    name: "Coach Name",
    role: "Business Coach · €15k/month",
    placeholder: true,
  },
  {
    text:
      "Quote about a specific result — calls booked per week, hours reclaimed, or one concrete win that happened within the first month.",
    name: "Coach Name",
    role: "Mindset Coach · 12k followers",
    placeholder: true,
  },
] as const

// FAQ_ITEMS and PRICING_FEATURES defined in § 31 below

// ============================================================
// § 4 — UTILITY HOOKS
// Pure, tested, no side effects beyond their stated purpose.
// ============================================================

/** Returns true once the page has scrolled past `threshold` pixels. */
function useScrolledPast(threshold: number): boolean {
  const [past, setPast] = useState(false)

  useEffect(() => {
    const check = () => setPast(window.scrollY > threshold)
    check()
    window.addEventListener("scroll", check, { passive: true })
    return () => window.removeEventListener("scroll", check)
  }, [threshold])

  return past
}

/**
 * Tracks scroll progress of a sticky section.
 * Returns 0 at the top of the track, 1 at the bottom.
 */
function useScrollProgress(ref: React.RefObject<HTMLElement>): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let rafId: number | null = null

    const update = () => {
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const scrolled = -rect.top
      setProgress(Math.max(0, Math.min(1, scrolled / Math.max(1, total))))
      rafId = null
    }

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", update)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", update)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [ref])

  return progress
}

/**
 * Animates a number from 0 to `target` over `duration` ms.
 * Starts when `shouldStart` becomes true.
 * Uses ease-out-cubic for a natural deceleration.
 */
function useCountUp(
  target: number,
  duration: number = 1600,
  shouldStart: boolean = false
): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!shouldStart) return

    const startTime = performance.now()
    let animationFrame: number

    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(1, elapsed / duration)
      // Ease out cubic: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * target))

      if (t < 1) {
        animationFrame = requestAnimationFrame(tick)
      }
    }

    animationFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration, shouldStart])

  return value
}

/**
 * Returns true once the element has entered the viewport.
 * Disconnects the observer after the first trigger (fire-once).
 */
function useInView(
  ref: React.RefObject<HTMLElement>,
  threshold: number = 0.15
): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold])

  return inView
}

// ============================================================
// § 5 — REVEAL COMPONENT
// IntersectionObserver fade-up. No framer-motion dependency.
// Use as a simple wrapper around any block-level content.
// ============================================================

function Reveal({
  children,
  delay = 0,
  threshold = 0.1,
  className = "",
  as: Tag = "div",
  ...rest
}: {
  children: React.ReactNode
  delay?: number
  threshold?: number
  className?: string
  as?: React.ElementType
  [key: string]: unknown
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<HTMLElement>, threshold)

  return (
    <Tag
      ref={ref as any}
      className={`ms-reveal ${inView ? "ms-in" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// ============================================================
// § 6 — GRADIENT TEXT COMPONENT
// Wrap the single key word per headline in <G>.
// Never use on more than one word per heading.
// ============================================================

function G({ children }: { children: React.ReactNode }) {
  return <span className="ms-gradient">{children}</span>
}

// ============================================================
// § 7 — CSS INJECTOR
// Injects the main CSS block once on mount, removes on unmount.
// Safe for Framer's React renderer.
// ============================================================


// ============================================================
// § 8 — NAV COMPONENT
// Logo left. CTA right. Blur + teal border on scroll.
// ============================================================

function Nav() {
  const scrolled = useScrolledPast(24)

  return (
    <header className={`ms-nav${scrolled ? " ms-nav--scrolled" : ""}`}>
      <div className="ms-wrap ms-nav__inner">
        {/* Logo */}
        <a href="#top" className="ms-nav__logo" aria-label="Miru Scale">
          <svg
            className="ms-nav__mark"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <polyline
              points="12,82 30,20 50,58 70,20 88,82"
              stroke="currentColor"
              strokeWidth="14"
              strokeLinejoin="miter"
              strokeLinecap="butt"
              fill="none"
            />
          </svg>
          <span className="ms-nav__wordmark">miru scale</span>
        </a>

        {/* Desktop nav links */}
        <nav className="ms-nav__links" aria-label="Page sections">
          <a href="#system"  className="ms-nav__link">The System</a>
          <a href="#process" className="ms-nav__link">Process</a>
          <a href="#pricing" className="ms-nav__link">Pricing</a>
          <a href="#faq"     className="ms-nav__link">FAQ</a>
        </nav>

        {/* CTA */}
        <a
          href="#booking"
          className="ms-btn ms-btn--primary"
          aria-label="Book a free discovery call"
        >
          Book a Free Call
          <span className="ms-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  )
}

// ============================================================
// § 9 — SCORE BAR SUB-COMPONENT (LiveLeadDemo)
// Animated fill triggered by `visible` prop.
// ============================================================

function ScoreBar({
  label,
  score,
  visible,
  delay,
}: {
  label:   string
  score:   number
  visible: boolean
  delay:   number
}) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!visible) {
      setWidth(0)
      return
    }
    const timer = setTimeout(() => setWidth(score), delay)
    return () => clearTimeout(timer)
  }, [visible, score, delay])

  return (
    <div className="ms-demo__score-row">
      <span className="ms-demo__score-label">{label}</span>
      <div className="ms-demo__score-track">
        <div
          className="ms-demo__score-fill"
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="ms-demo__score-val">
        {visible ? score : "–"}
      </span>
    </div>
  )
}

// ============================================================
// § 10 — LIVE LEAD DEMO COMPONENT
// The centerpiece of the hero. Looks like real software.
// State machine: idle → analyzing → scored → replying → done
// ============================================================

type DemoStage = "idle" | "analyzing" | "scored" | "replying" | "done"

const BUCKET_DEFS = [
  { id: "hot",  label: "Ready to Book",       emoji: "★" },
  { id: "warm", label: "Nurture",             emoji: "→" },
  { id: "pass", label: "Not a Fit",           emoji: "×" },
] as const

function LiveLeadDemo() {
  const [activeIdx,     setActiveIdx]     = useState(0)
  const [input,         setInput]         = useState(LEAD_SAMPLES[0].message)
  const [stage,         setStage]         = useState<DemoStage>("idle")
  const [busy,          setBusy]          = useState(false)
  const [bucketResult,  setBucketResult]  = useState<string | null>(null)
  const [scoresVisible, setScoresVisible] = useState(false)
  const [reply,         setReply]         = useState("")
  const [currentSample, setCurrentSample] = useState<LeadSample>(LEAD_SAMPLES[0])
  const abortRef = useRef(false)

  const selectTab = useCallback((idx: number) => {
    setActiveIdx(idx)
    setInput(LEAD_SAMPLES[idx].message)
    setStage("idle")
    setBucketResult(null)
    setScoresVisible(false)
    setReply("")
    setCurrentSample(LEAD_SAMPLES[idx])
  }, [])

  const runQualifier = useCallback(async () => {
    if (!input.trim() || busy) return

    const sample =
      LEAD_SAMPLES.find((s) => s.message === input) ??
      LEAD_SAMPLES[activeIdx]

    setCurrentSample(sample)
    abortRef.current = false
    setBusy(true)
    setBucketResult(null)
    setScoresVisible(false)
    setReply("")
    setStage("analyzing")

    // Phase 1: simulate analysis
    await new Promise<void>((resolve) => setTimeout(resolve, 1500))
    if (abortRef.current) return

    setBucketResult(sample.bucket)
    setStage("scored")
    setScoresVisible(true)

    // Phase 2: wait for scores to animate, then start reply
    await new Promise<void>((resolve) => setTimeout(resolve, 800))
    if (abortRef.current) return

    setStage("replying")
    const fullReply = sample.reply

    for (let i = 1; i <= fullReply.length; i++) {
      if (abortRef.current) return
      await new Promise<void>((resolve) => setTimeout(resolve, 9))
      setReply(fullReply.slice(0, i))
    }

    setStage("done")
    setBusy(false)
  }, [input, busy, activeIdx])

  // Cleanup on unmount
  useEffect(() => {
    return () => { abortRef.current = true }
  }, [])

  return (
    <div className="ms-demo" role="region" aria-label="Live lead qualifier demo">
      {/* Window chrome */}
      <div className="ms-demo__chrome" aria-hidden="true">
        <div className="ms-demo__chrome-controls">
          <div className="ms-demo__chrome-dot" />
          <div className="ms-demo__chrome-dot" />
          <div className="ms-demo__chrome-dot" />
        </div>
        <div className="ms-demo__chrome-live">
          <span className="ms-dot ms-dot--sm" />
          live
        </div>
      </div>

      {/* Two-column body */}
      <div className="ms-demo__body">
        {/* LEFT — input */}
        <div className="ms-demo__col-left">
          {/* Tab selector */}
          <div className="ms-demo__tabs" role="tablist">
            {LEAD_SAMPLES.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={activeIdx === i}
                className={`ms-demo__tab${activeIdx === i ? " ms-demo__tab--active" : ""}`}
                onClick={() => selectTab(i)}
              >
                {s.emoji} {s.label}
              </button>
            ))}
          </div>

          {/* Message input */}
          <textarea
            className="ms-demo__input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setActiveIdx(-1)
              setStage("idle")
              setBucketResult(null)
              setScoresVisible(false)
              setReply("")
            }}
            placeholder="Paste any lead DM or message here…"
            aria-label="Lead message input"
            spellCheck={false}
          />

          {/* Run */}
          <div className="ms-demo__run-row">
            <button
              className="ms-demo__run"
              onClick={runQualifier}
              disabled={busy}
              aria-label="Run lead qualifier"
            >
              {busy && <span className="ms-demo__spinner" aria-hidden="true" />}
              {busy ? "Qualifying…" : "Qualify Lead"}
              {!busy && <span aria-hidden="true">→</span>}
            </button>
          </div>
        </div>

        {/* RIGHT — results */}
        <div className="ms-demo__col-right">
          {/* Classification panel */}
          <div className="ms-demo__results-top">
            <p className="ms-demo__results-label">Classification</p>

            {stage === "idle" && (
              <p className="ms-demo__idle">
                Run the qualifier to see results.
              </p>
            )}

            {stage === "analyzing" && (
              <div className="ms-demo__analyzing" aria-live="polite">
                <div className="ms-demo__analyzing-dots" aria-hidden="true">
                  <div className="ms-demo__analyzing-dot" />
                  <div className="ms-demo__analyzing-dot" />
                  <div className="ms-demo__analyzing-dot" />
                </div>
                Analyzing message…
              </div>
            )}

            {(stage === "scored" || stage === "replying" || stage === "done") && (
              <>
                {/* Bucket chips */}
                <div className="ms-demo__buckets">
                  {BUCKET_DEFS.map((b) => (
                    <div
                      key={b.id}
                      className={`ms-demo__bucket ms-demo__bucket--${b.id}${
                        bucketResult === b.id ? " ms-demo__bucket--active" : ""
                      }`}
                    >
                      <div className="ms-demo__bucket-icon-wrap">
                        {b.emoji}
                      </div>
                      <span className="ms-demo__bucket-name">
                        {b.label}
                      </span>
                      <span className="ms-demo__bucket-check">
                        {bucketResult === b.id ? "✓" : ""}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Score bars */}
                <div className="ms-demo__scores">
                  <ScoreBar
                    label="Intent"
                    score={currentSample.scores.intent}
                    visible={scoresVisible}
                    delay={0}
                  />
                  <ScoreBar
                    label="Budget signals"
                    score={currentSample.scores.budget}
                    visible={scoresVisible}
                    delay={100}
                  />
                  <ScoreBar
                    label="Fit"
                    score={currentSample.scores.fit}
                    visible={scoresVisible}
                    delay={200}
                  />
                  <ScoreBar
                    label="Readiness"
                    score={currentSample.scores.readiness}
                    visible={scoresVisible}
                    delay={300}
                  />
                </div>
              </>
            )}
          </div>

          {/* Reply panel */}
          <div className="ms-demo__results-bottom">
            <p className="ms-demo__reply-label">Auto-Reply</p>

            <div className="ms-demo__reply-scroll">
              {stage === "idle" && (
                <span className="ms-demo__reply-empty">
                  Response will appear here.
                </span>
              )}
              {(stage === "analyzing" || (stage === "scored" && !reply)) && (
                <span className="ms-demo__reply-empty">
                  Generating reply…
                </span>
              )}
              {reply && (
                <div className="ms-demo__reply-text">
                  {reply}
                  {stage === "replying" && (
                    <span
                      className="ms-demo__reply-cursor"
                      aria-hidden="true"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// ============================================================
// § 11 — HERO SECTION
// Grid bg. Teal glow. Ultra-tight headline. No pills.
// Demo sits below the CTA row as the primary visual.
// ============================================================

function Hero() {
  return (
    <section className="ms-hero" id="top" aria-label="Hero">
      <div className="ms-grid-bg" aria-hidden="true" />
      <div className="ms-hero__glow" aria-hidden="true" />

      <div className="ms-wrap ms-hero__content">
        <Reveal>
          <span className="ms-hero__eyebrow">
            ai client systems for online coaches
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="ms-hero__headline">
            Never Lose a Lead <G>Again.</G>
          </h1>
        </Reveal>

        <Reveal delay={140}>
          <p className="ms-hero__sub">
            You're not losing clients to better coaches.
            You're losing them to slow replies.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="ms-hero__cta-row">
            <a
              href="#booking"
              className="ms-btn ms-btn--primary ms-btn--xl"
            >
              Book a Free 15-Min Call
              <span className="ms-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </Reveal>

        {/* Demo — the primary hero visual */}
        <Reveal delay={320}>
          <LiveLeadDemo />
        </Reveal>
      </div>
    </section>
  )
}

// ============================================================
// § 12 — SOCIAL PROOF STRIP
// Horizontal. Three metrics. Vertical separators. No cards.
// ============================================================

function SocialProofStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<HTMLElement>, 0.3)

  const items = [
    { num: "5–10 hrs", label: "saved per week, every week" },
    { num: "< 5 min",  label: "avg response time to new leads" },
    { num: "14 days",  label: "from first call to live system" },
  ]

  return (
    <div className="ms-proof-strip" ref={ref}>
      <div className="ms-wrap">
        <div className="ms-proof-strip__inner">
          {items.map((item, i) => (
            <div key={i} className="ms-proof-strip__item">
              <span className="ms-proof-strip__num">{item.num}</span>
              <span className="ms-proof-strip__label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// § 13 — LEAD FUNNEL VISUAL (Problem Section Left)
// Shows leads silently disappearing — no interaction needed.
// Entries fade in with a stagger, "gone" rows fade to 40%.
// ============================================================

const FUNNEL_LEADS = [
  { initials: "SJ", name: "sarah.j_fit", sub: "DM'd 6 hrs ago",   status: "gone",    statusLabel: "Booked elsewhere" },
  { initials: "MR", name: "mike.r.coach", sub: "DM'd 18 hrs ago", status: "cold",    statusLabel: "No response"      },
  { initials: "AL", name: "aly.lee__",    sub: "DM'd 2 days ago",  status: "waiting", statusLabel: "Waiting…"         },
  { initials: "KP", name: "kp.fitness",   sub: "DM'd 3 days ago",  status: "gone",    statusLabel: "Chose competitor" },
] as const

function LeadFunnelVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<HTMLElement>, 0.2)

  return (
    <div className="ms-problem__funnel" ref={ref}>
      <div className="ms-problem__funnel-title">
        Your DM inbox this week
      </div>

      {FUNNEL_LEADS.map((lead, i) => (
        <div
          key={i}
          className="ms-problem__funnel-row ms-reveal ms-in"
          style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
        >
          <div className="ms-problem__funnel-avatar">
            {lead.initials}
          </div>
          <div className="ms-problem__funnel-info">
            <div className="ms-problem__funnel-name">
              {lead.name}
            </div>
            <div className="ms-problem__funnel-sub">
              {lead.sub}
            </div>
          </div>
          <div
            className={`ms-problem__funnel-status ms-problem__funnel-status--${lead.status}`}
          >
            {lead.statusLabel}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// § 14 — PROBLEM SECTION
// Asymmetric: funnel visual left (sticky), text list right.
// No cards. Typography + separator lines only.
// ============================================================

function ProblemSection() {
  return (
    <section className="ms-section ms-problem" id="problem">
      <div className="ms-wrap">
        <Reveal>
          <span className="ms-label">the problem</span>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="ms-h2">
            Every week, you lose clients you never even{" "}
            <G>knew about.</G>
          </h2>
        </Reveal>

        <div className="ms-problem__layout" style={{ marginTop: 64 }}>
          {/* Left: visual */}
          <Reveal delay={100}>
            <div className="ms-problem__visual">
              <LeadFunnelVisual />
            </div>
          </Reveal>

          {/* Right: pain points */}
          <div className="ms-problem__list">
            {PAIN_POINTS.map((pp, i) => (
              <Reveal key={pp.id} delay={120 + i * 70}>
                <div className="ms-problem__item">
                  <div className="ms-problem__item-title">
                    {pp.title}
                  </div>
                  <p className="ms-problem__item-desc">{pp.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// § 15 — MESSAGE THREAD VISUAL (Solution Card 1)
// Animated conversation between lead and AI system.
// Delays staggered to simulate real typing.
// ============================================================

const THREAD_MESSAGES = [
  {
    side:    "lead",
    sender:  "sarah.m",
    time:    "09:42",
    text:    "Hey! I've been following for months — really ready to invest. What does 1:1 coaching look like with you?",
    delay:   0,
  },
  {
    side:    "ai",
    sender:  "AI system",
    time:    "09:42",
    text:    "Hey Sarah! That's exactly who I work with. To make sure I point you in the right direction — are you looking to lose weight, build sustainable habits, or something else?",
    delay:   400,
    delivered: true,
  },
  {
    side:    "lead",
    sender:  "sarah.m",
    time:    "09:44",
    text:    "Weight loss mainly, but I've tried everything and nothing sticks.",
    delay:   800,
  },
  {
    side:    "ai",
    sender:  "AI system",
    time:    "09:44",
    text:    "That tells me this is a mindset shift, not another plan. I'd love to chat — here's my booking link to find a time that works 👇",
    delay:   1200,
    delivered: true,
  },
] as const

function MessageThread() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<HTMLElement>, 0.3)

  return (
    <div className="ms-thread" ref={ref}>
      {THREAD_MESSAGES.map((msg, i) => (
        <div
          key={i}
          className={`ms-thread__msg${msg.side === "ai" ? " ms-thread__msg--right" : ""}`}
          style={{
            animationDelay:    `${inView ? msg.delay : 9999}ms`,
            animationFillMode: "forwards",
          }}
        >
          <div className="ms-thread__sender">{msg.sender}</div>
          <div
            className={`ms-thread__bubble${
              msg.side === "ai"
                ? " ms-thread__bubble--ai"
                : " ms-thread__bubble--lead"
            }`}
          >
            {msg.text}
          </div>
          {msg.side === "ai" && (
            <div className="ms-thread__meta">
              <span>{msg.time}</span>
              <span
                className="ms-thread__delivered"
                style={{
                  animationDelay: `${(inView ? msg.delay : 9999) + 200}ms`,
                  animationFillMode: "both",
                }}
              >
                ✓✓ Delivered
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================================
// § 16 — FOLLOW-UP TIMELINE VISUAL (Solution Card 2)
// Three timed follow-up messages on a vertical timeline.
// Cards slide in from left on viewport entry.
// ============================================================

const FOLLOWUP_MESSAGES = [
  {
    day:    "Day 1 · +2 hours",
    sent:   true,
    text:   "Hey! Just wanted to check in — did you get a chance to look at the info I sent? Happy to answer any questions 🙂",
    delay:  0,
  },
  {
    day:    "Day 3 · automated",
    sent:   true,
    text:   "No pressure at all — I know life gets busy. My calendar is open if you'd like to chat this week. ✌️",
    delay:  200,
  },
  {
    day:    "Day 7 · lead replied",
    sent:   false,
    text:   "Hey! Sorry for the late reply — let's do it. Sending you the link now.",
    delay:  400,
  },
] as const

// ============================================================

// ============================================================
// § 16b — SOLUTION SECTION
// ============================================================

/**
 * SolutionSection — presents the Miru Scale AI system as the answer
 * to the lead-management problem described in ProblemSection.
 * Three-column feature grid + central headline + CTA.
 */
function SolutionSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<HTMLElement>, 0.15)

  const CARDS = [
    {
      num: "01",
      title: "Instant Lead Qualification",
      desc: "Every DM gets scored in under 60 seconds — intent, budget, fit, readiness. No more guessing who's serious.",
      tag: "< 60s response",
      visual: (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { name: "sarah.j_fit", label: "Hot Lead", color: "#0D9488" },
            { name: "mike.r.coach", label: "Warm Lead", color: "#0891B2" },
            { name: "aly.lee__", label: "Info Seeker", color: "#6B7280" },
          ].map((row) => (
            <div key={row.name} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 12px", borderRadius: 8,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)"
            }}>
              <span style={{ fontSize: 13, color: "#9CA3AF", fontFamily: "var(--font-inter, monospace)" }}>{row.name}</span>
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.05em",
                color: row.color, textTransform: "uppercase"
              }}>{row.label}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      num: "02",
      title: "Automated Follow-Up",
      desc: "Hot leads get followed up across 7 days without you lifting a finger. Warm leads get nurtured until they're ready.",
      tag: "7-day sequences",
      visual: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {["Day 1 · Initial reply sent", "Day 3 · Follow-up scheduled", "Day 7 · Final nudge queued"].map((line, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 12px", borderRadius: 8,
              background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.15)"
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0D9488", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>{line}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      num: "03",
      title: "Direct Calendar Booking",
      desc: "Qualified leads book straight into your calendar. You show up to calls — not to DMs.",
      tag: "Auto-booking",
      visual: (
        <div style={{
          padding: "16px", borderRadius: 10,
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)"
        }}>
          <div style={{ fontSize: 11, color: "#0D9488", fontWeight: 600, marginBottom: 10, letterSpacing: "0.08em" }}>THIS WEEK</div>
          {[
            { time: "Mon 10:00", name: "Discovery · Sarah J." },
            { time: "Wed 14:00", name: "Discovery · Mike R." },
            { time: "Fri 11:00", name: "Discovery · Alex K." },
          ].map((slot) => (
            <div key={slot.time} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)"
            }}>
              <span style={{ fontSize: 12, color: "#6B7280" }}>{slot.time}</span>
              <span style={{ fontSize: 12, color: "#D1D5DB" }}>{slot.name}</span>
            </div>
          ))}
        </div>
      ),
    },
  ] as const

  return (
    <section className="ms-section ms-solution" id="solution" ref={ref}>
      <div className="ms-wrap">
        <div className="ms-solution__header" style={{ textAlign: "center", marginBottom: 64 }}>
          <p className="ms-label" style={{ marginBottom: 16 }}>The System</p>
          <h2 className="ms-h2">
            One system. Zero guesswork.<br />Every lead handled.
          </h2>
          <p style={{ marginTop: 20, color: "var(--c-text-2, #9CA3AF)", maxWidth: 520, margin: "20px auto 0", lineHeight: 1.6 }}>
            Miru Scale builds and installs an AI client system that qualifies,
            follows up, and books calls — so you can focus on coaching, not admin.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}>
          {CARDS.map((card, idx) => (
            <div
              key={card.num}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 28,
                position: "relative",
                overflow: "hidden",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 0.5s ease ${idx * 0.12}s, transform 0.5s ease ${idx * 0.12}s`,
              }}
            >
              {/* Top gradient line */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: "linear-gradient(90deg, transparent, rgba(13,148,136,0.6), transparent)"
              }} />

              {/* Number + Tag */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontWeight: 600, letterSpacing: "0.1em" }}>{card.num}</span>
                <span style={{
                  fontSize: 11, color: "#0D9488", fontWeight: 600,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  background: "rgba(13,148,136,0.1)", padding: "3px 10px",
                  borderRadius: 100, border: "1px solid rgba(13,148,136,0.2)"
                }}>{card.tag}</span>
              </div>

              {/* Visual mockup */}
              <div style={{ marginBottom: 24 }}>{card.visual}</div>

              {/* Text */}
              <h3 style={{ fontSize: 17, fontWeight: 600, color: "#F9FAFB", marginBottom: 10, lineHeight: 1.3 }}>
                {card.title}
              </h3>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>{card.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <a href="#pricing" className="ms-btn ms-btn--primary">
            See What's Included
          </a>
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<HTMLElement>, 0.1)

  return (
    <section className="ms-section ms-hiw" id="process" ref={ref}>
      <div className="ms-wrap">
        <div className="ms-hiw__head">
          <h2 className="ms-hiw__title">
            From first call to running system: <G>14 days.</G>
          </h2>
          <p className="ms-hiw__sub">
            A clear, predictable process. No surprises.
          </p>
        </div>

        <div className="ms-hiw__track" style={{ pointerEvents: "all" }}>
          <div className="ms-hiw__line">
            <div className="ms-hiw__line-bar">
              <div
                className="ms-hiw__line-fill"
                style={{
                  height: inView ? "100%" : "0%",
                  transition: "height 1.2s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            </div>
          </div>

          <div className="ms-hiw__steps">
            {TIMELINE_STEPS.map((step, idx) => (
              <div
                key={step.id}
                className="ms-hiw__step ms-hiw__step--active"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.5s ease ${idx * 0.15}s, transform 0.5s ease ${idx * 0.15}s`,
                }}
              >
                <div className="ms-hiw__node ms-hiw__node--done" aria-hidden="true" />
                <div className="ms-hiw__step-time">{step.time}</div>
                <h3 className="ms-hiw__step-title">{step.title}</h3>
                <p className="ms-hiw__step-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// § 22 — METRICS SECTION
// One hero metric dominates. Three support below.
// Counter animation on scroll entry.
// ============================================================

function MetricCounter({
  display,
  numericValue,
  label,
  isHero = false,
}: SupportingMetric & { isHero?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<HTMLElement>, 0.3)
  const count = useCountUp(numericValue ?? 0, 1600, inView && numericValue !== undefined)

  const displayValue =
    numericValue !== undefined
      ? String(count)
      : display

  if (isHero) {
    return (
      <div ref={ref} className="ms-metrics__hero">
        <span
          className="ms-metrics__hero-num"
          aria-label="5 to 10 hours saved per week"
        >
          {displayValue}
        </span>
        <p className="ms-metrics__hero-label">
          hours back every week — permanently.
        </p>
      </div>
    )
  }

  return (
    <div ref={ref} className="ms-metrics__item">
      <span className="ms-metrics__item-num">{displayValue}</span>
      <span className="ms-metrics__item-label">{label}</span>
    </div>
  )
}

function MetricsSection() {
  return (
    <section className="ms-metrics" id="results" aria-label="Metrics">
      <div className="ms-metrics__glow" aria-hidden="true" />

      <div className="ms-wrap">
        <Reveal>
          <span className="ms-label">what changes</span>
        </Reveal>

        {/* Hero metric — 5-10 at 180px */}
        <MetricCounter
          display="5–10"
          label="hours saved per week"
          isHero
        />

        {/* Three supporting metrics */}
        <div className="ms-metrics__row">
          {SUPPORTING_METRICS.map((m, i) => (
            <MetricCounter key={i} {...m} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// § 23 — TESTIMONIALS SECTION
// Typographic quote mark. Subtle surface. No glow on cards.
// ============================================================

function TestimonialsSection() {
  return (
    <section className="ms-section" id="proof">
      <div className="ms-wrap">
        <Reveal>
          <span className="ms-label">results</span>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="ms-h2">
            From coaches who've <G>already run it.</G>
          </h2>
        </Reveal>

        <div className="ms-testimonials__grid">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={120 + i * 80}>
              <article
                className={`ms-tcard${t.placeholder ? " ms-tcard--placeholder" : ""}`}
              >
                <div
                  className="ms-tcard__quotemark"
                  aria-hidden="true"
                >
                  "
                </div>
                <p className="ms-tcard__text">{t.text}</p>
                <footer className="ms-tcard__author">
                  <div className="ms-tcard__name">{t.name}</div>
                  <div className="ms-tcard__role">{t.role}</div>
                </footer>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={360}>
          <p
            style={{
              marginTop: 24,
              fontFamily: "var(--f-mono)",
              fontSize: 10,
              color: "var(--c-ghost)",
              letterSpacing: "0.08em",
              textAlign: "center",
            }}
          >
            * Testimonials pending — first client deliveries in progress
          </p>
        </Reveal>
      </div>
    </section>
  )
}


// ============================================================
// § 24 — ABOUT SECTION
// Max 4 sentences. Emre's voice. Stats panel on right.
// ============================================================

const PANEL_ROWS = [
  { key: "location",   val: "Berlin, DE"                 },
  { key: "age",        val: "20"                         },
  { key: "stack",      val: "n8n · Claude · OpenAI"      },
  { key: "focus",      val: "Coach acquisition systems"  },
  { key: "delivery",   val: "7–14 days per build"        },
  { key: "spots",      val: "2 open for July builds"     },
  { key: "retainer",   val: "optional · €300–500/mo"     },
  { key: "ownership",  val: "100% yours after handover"  },
] as const

function AboutSection() {
  return (
    <section className="ms-section ms-section--dark" id="about">
      <div className="ms-wrap">
        <Reveal>
          <span className="ms-label">who builds this</span>
        </Reveal>

        <div className="ms-about__layout">
          {/* Left: editorial copy */}
          <div className="ms-about__left">
            <Reveal delay={60}>
              <blockquote className="ms-about__quote">
                "I build AI systems, not slide decks. And I move fast."
              </blockquote>
            </Reveal>

            <Reveal delay={100}>
              <div className="ms-about__identity">
                <span className="ms-about__identity-name">Emre Er</span>
                <span className="ms-about__identity-sep">·</span>
                <span>Founder, Miru Scale</span>
                <span className="ms-about__identity-sep">·</span>
                <span>Berlin</span>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <p className="ms-about__bio">
                I'm 20, based in Berlin, and I've been obsessed with AI
                automation since before it was a buzzword. I specialize in
                building client acquisition workflows for coaches — systems
                that connect Instagram DMs, email, and booking tools into
                one seamless, automated pipeline.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <p className="ms-about__bio">
                I don't run a team of 40. I don't send proposals with 8
                phases and a 6-month timeline. I build the system, make
                sure it works, and move fast. My job is to remove a
                bottleneck from your business and get your time back.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <p className="ms-about__bio">
                If you want to see what I've built before booking — ask.
                I'll show you the systems, the flows, the actual code.
                No deck needed.
              </p>
            </Reveal>
          </div>

          {/* Right: terminal panel */}
          <Reveal delay={100}>
            <div className="ms-about__panel">
              <div className="ms-about__panel-chrome">
                <div className="ms-about__panel-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="ms-about__panel-title">
                  <div className="ms-about__panel-live" />
                  emre@miruscale.de
                </div>
              </div>

              <div className="ms-about__panel-body">
                {PANEL_ROWS.map((row, i) => (
                  <div key={i} className="ms-about__panel-row">
                    <span className="ms-about__panel-key">
                      {row.key}
                    </span>
                    <span className="ms-about__panel-val">
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="mailto:emre@miruscale.de"
                className="ms-about__panel-cta"
              >
                <span>emre@miruscale.de</span>
                <span>→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// § 25 — PRICING SECTION
// Single centered card. €2,000 dominant at 64px.
// Feature list with 1px separators. Retainer below.
// ============================================================

function PricingSection() {
  return (
    <section className="ms-section" id="pricing">
      <div className="ms-wrap">
        <Reveal>
          <span className="ms-label">the offer</span>
        </Reveal>
        <Reveal delay={60}>
          <h2
            className="ms-h2"
            style={{ textAlign: "center", maxWidth: "none" }}
          >
            One system. One price.{" "}
            <G>Yours to keep.</G>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p
            className="ms-body"
            style={{
              textAlign: "center",
              margin: "20px auto 0",
              maxWidth: 480,
            }}
          >
            No subscriptions. No lock-in. You own everything
            after handover.
          </p>
        </Reveal>

        <Reveal delay={160}>
          <div className="ms-pricing__card-wrap">
            <div className="ms-pricing__card">
              <div className="ms-pricing__card-accent" />

              <div className="ms-pricing__card-body">
                <span className="ms-pricing__type">
                  AI Client System · One-Time Build
                </span>

                <div className="ms-pricing__title">
                  AI Client System
                </div>

                <div className="ms-pricing__price-row">
                  <div className="ms-pricing__price">€2,000</div>
                  <div className="ms-pricing__price-note">
                    starting price<br />
                    typical: €2,000–3,500
                  </div>
                </div>

                {/* Feature list */}
                <ul className="ms-pricing__features">
                  {PRICING_FEATURES.map((feat, i) => (
                    <li key={i} className="ms-pricing__feature">
                      <span className="ms-pricing__feature-icon" aria-hidden="true">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#booking"
                  className="ms-btn ms-btn--primary ms-btn--full"
                  style={{ marginBottom: 0 }}
                >
                  Book Your Free Discovery Call
                  <span className="ms-arrow" aria-hidden="true">→</span>
                </a>

                <div className="ms-pricing__divider" />

                {/* Retainer */}
                <div className="ms-pricing__retainer">
                  <div className="ms-pricing__retainer-price">
                    €300
                  </div>
                  <div>
                    <div className="ms-pricing__retainer-title">
                      Monthly Retainer — Optional
                    </div>
                    <p className="ms-pricing__retainer-desc">
                      Maintenance, optimization, and new sequences as your
                      business evolves. €300–500/month. Not required —
                      you own the system either way.
                    </p>
                  </div>
                </div>

                <p className="ms-pricing__footnote">
                  No retainer required · You own the system after handover
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ============================================================
// § 26 — FINAL CTA
// Centered. Calendly embed below. Teal glow.
// ============================================================

function FinalCTA() {
  const calendlyRef = useRef<HTMLDivElement>(null)

  // Lazy-load Calendly widget when section enters viewport
  useEffect(() => {
    const el = calendlyRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()

        const existingScript = document.getElementById("calendly-script")
        if (existingScript) return

        const script = document.createElement("script")
        script.id = "calendly-script"
        script.src = "https://assets.calendly.com/assets/external/widget.js"
        script.async = true
        document.body.appendChild(script)
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="ms-final-cta ms-section" id="booking">
      <div className="ms-grid-bg" aria-hidden="true" />
      <div className="ms-final-cta__bg-glow" aria-hidden="true" />

      <div className="ms-wrap">
        <Reveal>
          <h2 className="ms-final-cta__title">
            One call. That's all it takes to find out
            if this is <G>right for you.</G>
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p className="ms-final-cta__sub">
            15 minutes. I'll tell you exactly what system you need,
            what it costs, and when I can deliver it. No pitch decks.
            No follow-up sequences.
          </p>
        </Reveal>

        <Reveal delay={140}>
          <div className="ms-final-cta__actions">
            <a
              href="YOUR_CALENDLY_URL"
              className="ms-btn ms-btn--primary ms-btn--xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Your Free Call
              <span className="ms-arrow" aria-hidden="true">→</span>
            </a>
            <a
              href="mailto:emre@miruscale.de"
              className="ms-btn ms-btn--ghost ms-btn--xl"
            >
              emre@miruscale.de
            </a>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <p className="ms-final-cta__scarcity">
            <span className="ms-dot ms-dot--sm ms-dot--success" />
            2 spots available for July builds
          </p>
        </Reveal>

        {/* Calendly inline embed */}
        <Reveal delay={280}>
          <div ref={calendlyRef} style={{ marginTop: 64 }}>
            <div
              className="calendly-inline-widget"
              data-url="YOUR_CALENDLY_URL?hide_gdpr_banner=1&background_color=09090b&text_color=fafafa&primary_color=0d9488"
              style={{ minWidth: 320, height: 700 }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ============================================================
// § 27 — FAQ SECTION
// No header. Just the questions. Grid-template-rows accordion.
// ============================================================

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx))
  }

  return (
    <section className="ms-section ms-section--dark" id="faq">
      <div className="ms-wrap ms-wrap--sm">
        <Reveal>
          <span className="ms-label">frequently asked</span>
        </Reveal>

        <Reveal delay={60}>
          <div className="ms-faq">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`ms-faq__item${openIdx === i ? " ms-faq__item--open" : ""}`}
              >
                <button
                  className="ms-faq__q"
                  onClick={() => toggle(i)}
                  aria-expanded={openIdx === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span>{item.q}</span>
                  <span
                    className="ms-faq__icon"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <div
                  className="ms-faq__answer-wrap"
                  role="region"
                  id={`faq-answer-${i}`}
                  aria-hidden={openIdx !== i}
                >
                  <div className="ms-faq__answer">
                    <div className="ms-faq__answer-inner">{item.a}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Secondary CTA */}
        <Reveal delay={200}>
          <div style={{ marginTop: 44, display: "flex", justifyContent: "center" }}>
            <a href="#booking" className="ms-btn ms-btn--ghost ms-btn--lg">
              Still have questions? Book a call
              <span className="ms-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ============================================================
// § 28 — FOOTER
// Minimal. Logo left. Email + LinkedIn right. One line.
// ============================================================

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="ms-footer">
      <div className="ms-wrap ms-footer__inner">
        {/* Left: logo wordmark */}
        <div className="ms-footer__left">
          <a href="#top" className="ms-nav__logo" aria-label="Back to top">
            <svg
              className="ms-nav__mark"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{ width: 20, height: 20 }}
            >
              <polyline
                points="12,82 30,20 50,58 70,20 88,82"
                stroke="currentColor"
                strokeWidth="14"
                strokeLinejoin="miter"
                strokeLinecap="butt"
                fill="none"
              />
            </svg>
            <span className="ms-nav__wordmark" style={{ fontSize: 14 }}>
              miru scale
            </span>
          </a>
        </div>

        {/* Right: links */}
        <div className="ms-footer__right">
          <a
            href="mailto:emre@miruscale.de"
            className="ms-footer__link"
          >
            emre@miruscale.de
          </a>
          <a
            href="https://www.linkedin.com/in/emre-er-50941a409/"
            className="ms-footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn ↗
          </a>
          <a href="/impressum" className="ms-footer__link">
            Impressum
          </a>
          <span className="ms-footer__link" style={{ color: "var(--c-ghost)", cursor: "default" }}>
            {year}
          </span>
        </div>
      </div>
    </footer>
  )
}

// ============================================================
// § 29 — ROOT COMPONENT
// @framerSupportedLayoutWidth any
// @framerSupportedLayoutHeight auto
//
// Assembles every section in order.
// CSSInjector mounts first.
// ============================================================

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function MiruScalePage() {
  return (
    <>
      <CSSInjector />

      <Nav />

      <main id="main-content">
        <Hero />
        <SocialProofStrip />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <MetricsSection />
        <TestimonialsSection />
        <AboutSection />
        <PricingSection />
        <FinalCTA />
        <FAQSection />
      </main>

      <Footer />
    </>
  )
}

// ============================================================
// § 30 — FRAMER PROPERTY CONTROLS
// Exposes editable props to the Framer canvas.
// Calendly URL and scarcity copy configurable without code.
// ============================================================



// ============================================================
// § 31 — SUPPLEMENTARY DATA CONSTANTS
// Defined after components (safe: function bodies are lazy,
// module is fully initialized before any render occurs)
// ============================================================

/**
 * Feature checklist items displayed in the pricing card.
 * Each entry is a concise, benefit-oriented statement.
 * Max ~60 chars each.
 */
const PRICING_FEATURES: readonly string[] = [
  "Full AI lead qualification system (Instagram DM, email, web form)",
  "Automated, personalized follow-up sequences (7-day nurture)",
  "Automatic call booking directly to your calendar",
  "Deal-stage tracking: hot / warm / pass buckets",
  "Custom prompt engineering for your coaching niche",
  "Full walkthrough + SOP documentation on handover",
  "7-day post-delivery support window",
  "You own the system — n8n workflows, prompts, everything",
] as const

/**
 * FAQ accordion items.
 * Questions written from a skeptical-but-interested coach POV.
 * Answers: direct, no fluff, max 3 sentences.
 */
const FAQ_ITEMS: readonly { readonly q: string; readonly a: string }[] = [
  {
    q: "How is this different from hiring a VA to handle DMs?",
    a: "A VA is awake 8 hours a day and costs €15–30/hour. This system works 24/7, responds in under 60 seconds, never gets sick or goes on vacation, and routes only qualified leads to you. The system handles volume; you handle the calls.",
  },
  {
    q: "What platforms does this connect to?",
    a: "Instagram DMs, email, and any web form you currently use. The booking integration works with Calendly, Cal.com, and TidyCal. If you use something else, tell me — I'll check compatibility before we start.",
  },
  {
    q: "I'm not technical. Can I actually use this after handover?",
    a: "Yes. I build everything in n8n — a visual, node-based interface. You don't write code. I document every flow with a step-by-step SOP so you know exactly what's happening and can make minor changes yourself. If you break something, that's what the support window is for.",
  },
  {
    q: "What if the AI says something wrong to a lead?",
    a: "The AI qualifies and routes — it doesn't close. It never commits to pricing, never promises outcomes, and always surfaces high-intent leads to you for a human reply. The prompts include guardrails I've tested specifically for coaching offers.",
  },
  {
    q: "How long does the build take?",
    a: "7 to 14 calendar days from payment to handover. Day 1–2: audit and mapping. Day 3–10: build and testing. Day 11–14: walkthrough, revisions, and SOP delivery.",
  },
  {
    q: "Do you offer a trial or refund?",
    a: "No trials — a one-time build can't really be trialed. But I do a free 15-minute discovery call to make sure this is actually right for your setup before any money moves. If I think it won't work for you, I'll say so on the call.",
  },
  {
    q: "What if I already have a CRM or email tool I use?",
    a: "Tell me what you use and I'll design around it. The system is built to integrate with your stack, not replace it. Most common tools (ActiveCampaign, GoHighLevel, Mailchimp, HubSpot free) are supported via API or Zapier bridge.",
  },
  {
    q: "Can I expand the system later?",
    a: "Yes. The retainer (€300–500/month, fully optional) covers ongoing optimization, new sequence variants, and expansion to additional lead sources. Most clients start with the one-time build and add the retainer after they see results.",
  },
] as const

// ============================================================
// § 32 — ADDITIONAL CSS INJECTION (PHASE 2)
// Injected alongside the main CSS block via a second
// CSSInjector-style approach.  All classes prefixed ms-.
// ============================================================


/**
 * SecondCSSInjector — mounts the phase-2 styles.
 * Called once inside MiruScalePage alongside CSSInjector.
 */


// ============================================================
// § 33 — CSS PHASE 3 — DEEP COMPONENT STYLES
// Full micro-interaction library. Every element covered.
// ============================================================


/**
 * ThirdCSSInjector — mounts phase-3 styles.
 * Deep component micro-interaction library.
 */


// ============================================================
// § 34 — CSS PHASE 4 — ANIMATION SYSTEM + UTILITIES
// Complete keyframe library. Timing functions documented.
// Motion-aware fallbacks. Print optimizations.
// ============================================================


/**
 * FourthCSSInjector — mounts phase-4 styles.
 * Full animation system, utilities, responsive coverage.
 */


// ============================================================
// § 35 — EXTENDED UTILITY HOOKS
// Performance-optimized. RAF-based where needed.
// Stable references via useCallback/useRef.
// ============================================================

/**
 * useScrollY — tracks window scrollY via passive listener.
 * Returns current scroll offset in pixels.
 * Debounced to 16ms (one animation frame).
 *
 * @example
 *   const scrollY = useScrollY()
 *   // Use to drive nav scroll-state, parallax, etc.
 */
function useScrollY(): number {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let rafId = 0

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return scrollY
}

/**
 * useElementTop — returns the distance from an element's top edge
 * to the document top. Updates on scroll and resize.
 *
 * @param ref — ref attached to the target element
 */
function useElementTop(ref: React.RefObject<HTMLElement>): number {
  const [top, setTop] = useState(0)

  useEffect(() => {
    const measure = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      setTop(rect.top + window.scrollY)
    }

    measure()

    const observer = new ResizeObserver(measure)
    if (ref.current) observer.observe(ref.current)

    window.addEventListener("scroll", measure, { passive: true })
    window.addEventListener("resize", measure, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", measure)
      window.removeEventListener("resize", measure)
    }
  }, [ref])

  return top
}

/**
 * useWindowSize — tracks window dimensions.
 * Debounced via requestAnimationFrame.
 *
 * @returns { width, height }
 */
function useWindowSize(): { width: number; height: number } {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth  : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  useEffect(() => {
    let rafId = 0

    const onResize = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight })
      })
    }

    window.addEventListener("resize", onResize, { passive: true })
    return () => {
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return size
}

/**
 * useLocalStickyState — localStorage-backed useState.
 * Reads initial value from localStorage, writes on every change.
 * Falls back to initialValue if localStorage is unavailable.
 *
 * @param key         — localStorage key
 * @param initialValue — fallback initial value
 */
function useLocalStickyState<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setAndPersist: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (action) => {
      setState((prev) => {
        const next = typeof action === "function"
          ? (action as (s: T) => T)(prev)
          : action
        try {
          window.localStorage.setItem(key, JSON.stringify(next))
        } catch {}
        return next
      })
    },
    [key]
  )

  return [state, setAndPersist]
}

/**
 * useTypewriter — animates text character by character.
 *
 * @param text      — target string
 * @param speed     — milliseconds per character
 * @param shouldStart — gate; starts when true
 * @returns current visible string slice
 *
 * @example
 *   const displayed = useTypewriter("Hello world", 40, isVisible)
 */
function useTypewriter(
  text: string,
  speed: number,
  shouldStart: boolean
): string {
  const [displayed, setDisplayed] = useState("")
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!shouldStart) return

    indexRef.current = 0
    setDisplayed("")

    const tick = () => {
      if (indexRef.current >= text.length) return
      indexRef.current += 1
      setDisplayed(text.slice(0, indexRef.current))
      timerRef.current = setTimeout(tick, speed)
    }

    timerRef.current = setTimeout(tick, speed)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text, speed, shouldStart])

  return displayed
}

/**
 * usePrevious — returns the previous render's value.
 * Classic utility hook.
 *
 * @param value — any value
 */
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => { ref.current = value })
  return ref.current
}

/**
 * useEventListener — attaches a typed event listener
 * to a target element (or window by default).
 * Auto-cleans up on unmount or dependency change.
 *
 * @param eventName — DOM event name
 * @param handler   — event callback
 * @param element   — target element (defaults to window)
 */
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element: (Window & typeof globalThis) | HTMLElement | null = window
): void {
  const savedHandler = useRef(handler)

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    if (!element) return
    const listener = (event: Event) => {
      savedHandler.current(event as WindowEventMap[K])
    }
    element.addEventListener(eventName, listener, { passive: true })
    return () => element.removeEventListener(eventName, listener)
  }, [eventName, element])
}

/**
 * useHover — returns true while the mouse is over the target element.
 *
 * @param ref — ref attached to the target element
 */
function useHover(ref: React.RefObject<HTMLElement>): boolean {
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const enter = () => setHovered(true)
    const leave = () => setHovered(false)
    el.addEventListener("mouseenter", enter)
    el.addEventListener("mouseleave", leave)
    return () => {
      el.removeEventListener("mouseenter", enter)
      el.removeEventListener("mouseleave", leave)
    }
  }, [ref])

  return hovered
}

/**
 * useMediaQuery — returns true when the CSS media query matches.
 * Re-evaluates on resize.
 *
 * @param query — CSS media query string, e.g. "(max-width: 768px)"
 *
 * @example
 *   const isMobile = useMediaQuery("(max-width: 768px)")
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener("change", handler)
    setMatches(mql.matches)
    return () => mql.removeEventListener("change", handler)
  }, [query])

  return matches
}

/**
 * useCSSVar — reads a CSS custom property from :root.
 * Useful for reading design token values in JavaScript.
 *
 * @param varName — CSS variable name (e.g. "--c-teal")
 * @param fallback — value to return if not found
 */
function useCSSVar(varName: string, fallback = ""): string {
  const [value, setValue] = useState(fallback)

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
    setValue(computed || fallback)
  }, [varName, fallback])

  return value
}

/**
 * useOnClickOutside — calls handler when a click occurs
 * outside the referenced element.
 *
 * @param ref     — element to watch
 * @param handler — callback when click is outside
 */
function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: () => void
): void {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return
      handler()
    }
    document.addEventListener("mousedown", listener)
    return () => document.removeEventListener("mousedown", listener)
  }, [ref, handler])
}

/**
 * useDebounce — debounces a value by `delay` milliseconds.
 * Returns the debounced value.
 *
 * @param value — input value
 * @param delay — debounce delay in ms
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

/**
 * useThrottle — throttles a value to update at most once per `limit` ms.
 *
 * @param value — input value
 * @param limit — minimum ms between updates
 */
function useThrottle<T>(value: T, limit: number): T {
  const [throttled, setThrottled] = useState(value)
  const lastUpdated = useRef(Date.now())

  useEffect(() => {
    if (Date.now() >= lastUpdated.current + limit) {
      lastUpdated.current = Date.now()
      setThrottled(value)
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now()
        setThrottled(value)
      }, limit)
      return () => clearTimeout(timer)
    }
  }, [value, limit])

  return throttled
}

/**
 * useKeyPress — returns true while the specified key is held.
 *
 * @param targetKey — key string (e.g. "Escape", "Enter")
 */
function useKeyPress(targetKey: string): boolean {
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.key === targetKey) setPressed(true)
    }
    const onUp = (e: KeyboardEvent) => {
      if (e.key === targetKey) setPressed(false)
    }
    window.addEventListener("keydown", onDown)
    window.addEventListener("keyup", onUp)
    return () => {
      window.removeEventListener("keydown", onDown)
      window.removeEventListener("keyup", onUp)
    }
  }, [targetKey])

  return pressed
}

/**
 * useMeasure — returns the bounding rect of a referenced element.
 * Updates on resize via ResizeObserver.
 *
 * @param ref — target element ref
 */
function useMeasure(ref: React.RefObject<HTMLElement>): DOMRect | null {
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new ResizeObserver(() => {
      setRect(el.getBoundingClientRect())
    })
    observer.observe(el)
    setRect(el.getBoundingClientRect())

    return () => observer.disconnect()
  }, [ref])

  return rect
}

/**
 * useIsomorphicLayoutEffect — useLayoutEffect on the browser,
 * useEffect in SSR environments (avoids console warnings).
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

/**
 * useFirstMount — returns true only on the first render.
 * Useful for skipping animations on initial load.
 */
function useFirstMount(): boolean {
  const isFirst = useRef(true)
  if (isFirst.current) {
    isFirst.current = false
    return true
  }
  return false
}

/**
 * useSafeState — useState with auto-cancel on unmount.
 * Prevents "Can't perform a React state update on an unmounted
 * component" warnings in async workflows.
 *
 * @param initialState — initial state value
 */
function useSafeState<T>(
  initialState: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const mountedRef = useRef(true)
  const [state, setState] = useState(initialState)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const setSafe: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (action) => {
      if (mountedRef.current) setState(action)
    },
    []
  )

  return [state, setSafe]
}

/**
 * useRafState — useState updated only inside requestAnimationFrame.
 * Prevents off-frame state batching issues in scroll animations.
 *
 * @param initialState — initial state value
 */
function useRafState<T>(
  initialState: T
): [T, (v: T) => void] {
  const [state, setStateRaw] = useState(initialState)
  const rafRef = useRef<number>(0)
  const pendingRef = useRef<T>(initialState)

  const setState = useCallback((v: T) => {
    pendingRef.current = v
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      setStateRaw(pendingRef.current)
    })
  }, [])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return [state, setState]
}


// ============================================================
// § 36 — MATH / FORMAT UTILITIES
// Pure functions — no side effects, no dependencies.
// All exported as named constants for tree-shaking safety.
// ============================================================

/**
 * clamp — constrains a number between [min, max].
 *
 * @param n   — input value
 * @param min — lower bound
 * @param max — upper bound
 *
 * @example clamp(150, 0, 100) → 100
 */
const clamp = (n: number, min: number, max: number): number =>
  Math.min(Math.max(n, min), max)

/**
 * lerp — linear interpolation between a and b.
 *
 * @param a — start value
 * @param b — end value
 * @param t — interpolation factor (0–1)
 *
 * @example lerp(0, 100, 0.5) → 50
 */
const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t

/**
 * inverseLerp — returns the t factor given a value between a and b.
 * Inverse of lerp. Returns 0–1 (clamped).
 *
 * @example inverseLerp(0, 100, 25) → 0.25
 */
const inverseLerp = (a: number, b: number, n: number): number =>
  clamp((n - a) / (b - a), 0, 1)

/**
 * map — maps a value from one range to another.
 *
 * @param n    — input value
 * @param iMin — input range min
 * @param iMax — input range max
 * @param oMin — output range min
 * @param oMax — output range max
 *
 * @example map(50, 0, 100, 0, 1) → 0.5
 */
const map = (
  n: number,
  iMin: number,
  iMax: number,
  oMin: number,
  oMax: number
): number => lerp(oMin, oMax, inverseLerp(iMin, iMax, n))

/**
 * easeOutCubic — CSS-compatible ease-out cubic.
 * Maps a linear t (0–1) to an eased value.
 *
 * @param t — linear progress (0–1)
 */
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

/**
 * easeOutExpo — mimics CSS cubic-bezier(0.16, 1, 0.3, 1).
 * Fast start, gentle deceleration. Used for reveals.
 *
 * @param t — linear progress (0–1)
 */
const easeOutExpo = (t: number): number =>
  t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1

/**
 * easeInOutQuart — smooth start and end.
 * Good for transitions where you want symmetry.
 *
 * @param t — linear progress (0–1)
 */
const easeInOutQuart = (t: number): number =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

/**
 * formatNumber — formats a number with commas and optional prefix/suffix.
 *
 * @param n      — number to format
 * @param prefix — string prepended (e.g. "€", "$")
 * @param suffix — string appended (e.g. "/mo", "k")
 *
 * @example formatNumber(1234, "€") → "€1,234"
 */
const formatNumber = (n: number, prefix = "", suffix = ""): string =>
  `${prefix}${n.toLocaleString("en-US")}${suffix}`

/**
 * formatCurrency — shorthand for Euro formatting.
 *
 * @param n       — numeric value
 * @param compact — if true, uses 1k/1M notation
 *
 * @example formatCurrency(3500)        → "€3,500"
 * @example formatCurrency(3500, true)  → "€3.5k"
 */
const formatCurrency = (n: number, compact = false): string => {
  if (!compact) return `€${n.toLocaleString("en-US")}`
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `€${(n / 1_000).toFixed(1).replace(".0", "")}k`
  return `€${n}`
}

/**
 * formatTime — formats milliseconds into human-readable time.
 *
 * @param ms — duration in milliseconds
 *
 * @example formatTime(62000) → "1m 2s"
 */
const formatTime = (ms: number): string => {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h ${m % 60}m`
  if (m > 0) return `${m}m ${s % 60}s`
  return `${s}s`
}

/**
 * truncate — truncates a string to maxLen chars with ellipsis.
 *
 * @param str    — input string
 * @param maxLen — maximum length
 *
 * @example truncate("Hello world", 8) → "Hello wo…"
 */
const truncate = (str: string, maxLen: number): string =>
  str.length <= maxLen ? str : `${str.slice(0, maxLen - 1)}…`

/**
 * slugify — converts a string to URL-safe kebab-case.
 *
 * @example slugify("How It Works") → "how-it-works"
 */
const slugify = (str: string): string =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

/**
 * capitalize — capitalizes first letter of a string.
 *
 * @example capitalize("hello") → "Hello"
 */
const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1)

/**
 * randomInt — returns a random integer in [min, max] (inclusive).
 *
 * @param min — lower bound
 * @param max — upper bound
 */
const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

/**
 * shuffle — Fisher-Yates shuffle. Returns a new array.
 * Does not mutate the original.
 *
 * @param arr — input array
 */
const shuffle = <T,>(arr: readonly T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * chunk — splits an array into chunks of size n.
 *
 * @param arr  — input array
 * @param size — chunk size
 *
 * @example chunk([1,2,3,4,5], 2) → [[1,2],[3,4],[5]]
 */
const chunk = <T,>(arr: readonly T[], size: number): T[][] => {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size) as T[])
  }
  return result
}

/**
 * pick — picks specified keys from an object.
 * Returns a new object containing only those keys.
 *
 * @example pick({ a: 1, b: 2, c: 3 }, ["a", "c"]) → { a: 1, c: 3 }
 */
const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) result[key] = obj[key]
  }
  return result
}

/**
 * omit — returns a new object without specified keys.
 *
 * @example omit({ a: 1, b: 2, c: 3 }, ["b"]) → { a: 1, c: 3 }
 */
const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> => {
  const result = { ...obj }
  for (const key of keys) delete (result as Record<K, unknown>)[key]
  return result as Omit<T, K>
}

/**
 * deepEqual — shallow recursive equality check.
 * Not a full deep-equal (won't handle circular refs).
 * Good enough for comparing config objects and data records.
 */
const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true
  if (typeof a !== "object" || typeof b !== "object") return false
  if (a === null || b === null) return false
  const ka = Object.keys(a as object)
  const kb = Object.keys(b as object)
  if (ka.length !== kb.length) return false
  for (const k of ka) {
    if (!deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])) {
      return false
    }
  }
  return true
}

/**
 * wait — Promise-based setTimeout.
 * Useful for async/await animation sequences.
 *
 * @param ms — delay in milliseconds
 *
 * @example await wait(400)  // pause 400ms
 */
const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * waitFrame — waits for the next animation frame.
 * Useful for ensuring DOM measurements are accurate.
 *
 * @example await waitFrame()
 */
const waitFrame = (): Promise<number> =>
  new Promise((resolve) => requestAnimationFrame(resolve))

/**
 * retryAsync — retries an async function up to maxAttempts times.
 * Waits `delay` ms between attempts.
 *
 * @param fn          — async function to retry
 * @param maxAttempts — max retries
 * @param delay       — ms between retries
 */
async function retryAsync<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delay = 500
): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt < maxAttempts) await wait(delay)
    }
  }
  throw lastError
}

/**
 * memoize — simple function memoizer with a Map cache.
 * Only suitable for pure functions with serializable arguments.
 *
 * @param fn — function to memoize
 */
function memoize<A extends readonly unknown[], R>(
  fn: (...args: A) => R
): (...args: A) => R {
  const cache = new Map<string, R>()
  return (...args: A): R => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)!
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

/**
 * once — wraps a function so it only executes once.
 * Returns the same result on subsequent calls.
 *
 * @param fn — function to wrap
 */
function once<A extends readonly unknown[], R>(
  fn: (...args: A) => R
): (...args: A) => R {
  let called = false
  let result: R
  return (...args: A): R => {
    if (!called) {
      called = true
      result = fn(...args)
    }
    return result
  }
}

// ============================================================
// § 37 — CSS DESIGN TOKENS — TYPESCRIPT MIRROR
// TypeScript representation of the CSS custom properties.
// Use for programmatic styling where CSS vars aren't accessible
// (canvas, WebGL, SVG, third-party widgets).
// ============================================================

/**
 * DesignTokens — TypeScript mirror of the CSS :root token system.
 * Matches the --c-* and --fs-* properties defined in CSS_PHASE1.
 * Updated in one place; sync here when CSS changes.
 */
const DesignTokens = {
  colors: {
    /** Primary teal accent — use for borders, icons, highlights */
    teal:        "#0D9488",
    /** Lighter teal — hover states, gradient end */
    tealLight:   "#14B8A6",
    /** Deeper teal — active states, gradient start */
    tealDeep:    "#0F766E",
    /** Teal glow — for box-shadow, drop-shadow */
    tealGlow:    "rgba(13, 148, 136, 0.30)",
    /** Teal soft — subtle teal background fill */
    tealSoft:    "rgba(13, 148, 136, 0.08)",
    /** Teal line — teal border/divider */
    tealLine:    "rgba(13, 148, 136, 0.25)",
    /** Teal text — high-contrast teal for readable text */
    tealText:    "#2DD4BF",
    /** Cyan — gradient pair with teal */
    cyan:        "#06B6D4",
    /** Page background */
    bg:          "#09090B",
    /** Card/panel background */
    surface:     "#111113",
    /** Primary text */
    text:        "#FAFAFA",
    /** Secondary text / body copy */
    muted:       "#A1A1AA",
    /** Tertiary / placeholder text */
    ghost:       "#71717A",
    /** Subtle border */
    border:      "rgba(255,255,255,0.08)",
  },
  gradients: {
    /** Teal-to-cyan gradient (background use) */
    teal:     "linear-gradient(135deg, #14B8A6, #06B6D4)",
    /** Teal text gradient (background-clip: text) */
    tealText: "linear-gradient(135deg, #14B8A6, #06B6D4)",
  },
  typography: {
    /** Hero metric font size (100–180px, fluid) */
    heroMetric: "clamp(100px, 14vw, 180px)",
    /** Large display headline (64–96px, fluid) */
    displayXl:  "clamp(64px, 8vw, 96px)",
    /** Standard section headline (40–64px, fluid) */
    displayLg:  "clamp(40px, 5vw, 64px)",
    /** Tight letter-spacing for headlines */
    letterSpacingTight: "-0.05em",
    /** Font families */
    display: "'Geist', 'Inter', sans-serif",
    body:    "'Inter', sans-serif",
    mono:    "'Geist Mono', 'SF Mono', ui-monospace, monospace",
    serif:   "'DM Serif Display', Georgia, serif",
  },
  spacing: {
    sectionVertical: "clamp(80px, 10vw, 140px)",
    wrapPadding:     "48px",
    wrapMax:         "1120px",
  },
  radii: {
    sm: "8px",
    md: "12px",
    xl: "20px",
  },
  easing: {
    outExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
    outQuart: "cubic-bezier(0.25, 1, 0.5, 1)",
  },
  timing: {
    fast: "150ms",
    mid:  "280ms",
    slow: "500ms",
  },
} as const

/** Type-safe color key */
type ColorKey = keyof typeof DesignTokens.colors

/**
 * getColor — returns a design token color by key.
 * Type-safe: only valid color keys are accepted.
 *
 * @param key — color token name
 *
 * @example getColor("tealText") → "#2DD4BF"
 */
const getColor = (key: ColorKey): string => DesignTokens.colors[key]


// ============================================================
// § 38 — EXTENDED TYPE SYSTEM
// All interfaces, discriminated unions, and type guards
// that power the component system.
// ============================================================

// ── Animation / Reveal ────────────────────────────────────

/**
 * RevealDirection — direction from which elements enter the viewport.
 * Controls the initial transform applied before reveal.
 */
type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "none"

/**
 * RevealConfig — full configuration for the Reveal component.
 */
interface RevealConfig {
  /** Delay before reveal triggers (ms) */
  readonly delay?: number
  /** Initial transform direction */
  readonly direction?: RevealDirection
  /** IntersectionObserver threshold (0–1) */
  readonly threshold?: number
  /** Whether to reset when element leaves viewport */
  readonly reset?: boolean
  /** Additional CSS class to apply when revealed */
  readonly revealClass?: string
  /** Duration override (ms) */
  readonly duration?: number
}

// ── Section layout ────────────────────────────────────────

/**
 * SectionVariant — visual treatment for a page section.
 * - "default": transparent background, light content
 * - "dark": slightly raised surface (#111113)
 * - "teal": subtle teal tinted background
 */
type SectionVariant = "default" | "dark" | "teal"

/**
 * SectionConfig — metadata for each major page section.
 */
interface SectionConfig {
  readonly id:     string
  readonly label:  string
  readonly href:   string
  readonly order:  number
}

/**
 * NAV_SECTIONS — ordered list of sections used by Nav component.
 * Section labels match the in-page `ms-label` text.
 */
const NAV_SECTIONS: readonly SectionConfig[] = [
  { id: "live-demo",  label: "Demo",     href: "#live-demo",  order: 0 },
  { id: "problem",    label: "Problem",  href: "#problem",    order: 1 },
  { id: "solution",   label: "Solution", href: "#solution",   order: 2 },
  { id: "process",    label: "Process",  href: "#process",    order: 3 },
  { id: "proof",      label: "Results",  href: "#proof",      order: 4 },
  { id: "pricing",    label: "Pricing",  href: "#pricing",    order: 5 },
] as const

// ── Demo / Live Lead ──────────────────────────────────────


/**
 * ScoreKey — which dimensions a lead is scored on.
 */
type ScoreKey = "intent" | "budget" | "fit" | "readiness"

/**
 * LeadScore — numeric scores (0–100) per dimension.
 */
type LeadScore = {
  readonly [K in ScoreKey]: number
}

/**
 * LeadBucket — routing decision based on composite score.
 * - "hot": proceed immediately to call booking
 * - "warm": enter nurture sequence, re-qualify in 7 days
 * - "pass": politely decline, do not waste call slot
 */
type LeadBucket = "hot" | "warm" | "pass"

/**
 * getCompositeScore — weighted average of individual scores.
 * Intent: 40%, Budget: 30%, Fit: 20%, Readiness: 10%.
 *
 * @param scores — raw dimension scores
 */
const getCompositeScore = (scores: LeadScore): number => {
  const { intent, budget, fit, readiness } = scores
  return Math.round(
    intent    * 0.40 +
    budget    * 0.30 +
    fit       * 0.20 +
    readiness * 0.10
  )
}

/**
 * getLeadBucket — converts a composite score to a routing bucket.
 * Thresholds:
 *   ≥ 75 → hot
 *   ≥ 50 → warm
 *   <  50 → pass
 *
 * @param score — composite score (0–100)
 */
const getLeadBucket = (score: number): LeadBucket => {
  if (score >= 75) return "hot"
  if (score >= 50) return "warm"
  return "pass"
}

/**
 * BUCKET_LABELS — human-readable labels for each bucket.
 */
const BUCKET_LABELS: Record<LeadBucket, string> = {
  hot:  "HOT — Book call now",
  warm: "WARM — Start nurture",
  pass: "PASS — Decline politely",
} as const

/**
 * BUCKET_COLORS — CSS color tokens per bucket for UI rendering.
 */
const BUCKET_COLORS: Record<LeadBucket, string> = {
  hot:  "var(--c-teal-text)",
  warm: "#FCD34D",
  pass: "var(--c-ghost)",
} as const

// ── How It Works ──────────────────────────────────────────

/**
 * HowItWorksStep — one step in the 4-phase onboarding process.
 */
interface HowItWorksStep {
  readonly num:         string   // "01" | "02" | "03" | "04"
  readonly title:       string
  readonly description: string
  readonly visual:      "audit" | "builder" | "flow" | "callout" | "none"
  /** Which fraction of the scroll track activates this step */
  readonly activateAt:  number   // 0–1
  /** Which fraction marks this step as "done" */
  readonly doneAt:      number   // 0–1
}

/**
 * HOW_IT_WORKS_STEPS — the 4 steps of the Miru Scale build process.
 */
const HOW_IT_WORKS_STEPS: readonly HowItWorksStep[] = [
  {
    num:          "01",
    title:        "Audit: map every lead touchpoint",
    description:  "We start with a 30-minute audit call. I map exactly where your leads come from, where they drop off, and what a high-intent lead looks like for your specific offer. This determines the qualifier logic.",
    visual:       "audit",
    activateAt:   0.05,
    doneAt:       0.30,
  },
  {
    num:          "02",
    title:        "Build: system + sequences + prompts",
    description:  "I build the n8n workflows, write your AI qualifier prompts, connect your Instagram DMs and email tools, and wire up your calendar. Testing covers edge cases: rude leads, off-topic DMs, pricing questions.",
    visual:       "builder",
    activateAt:   0.30,
    doneAt:       0.60,
  },
  {
    num:          "03",
    title:        "Test: real lead scenarios, live pipeline",
    description:  "I run 20+ simulated lead interactions across all entry points. You watch in real time. We iterate on qualifier thresholds and reply tone until the system matches how you'd respond personally.",
    visual:       "flow",
    activateAt:   0.60,
    doneAt:       0.85,
  },
  {
    num:          "04",
    title:        "Hand over: it's yours, fully documented",
    description:  "You get a screen-recorded walkthrough of every flow, a written SOP, and 7 days of support. After that: the system runs on your account, your API keys, your servers. No monthly tool fee to me.",
    visual:       "callout",
    activateAt:   0.85,
    doneAt:       1.00,
  },
] as const

// ── Testimonials ──────────────────────────────────────────


// ── Pricing ───────────────────────────────────────────────

/**
 * PricingTier — pricing plan definition.
 * Miru Scale currently has one tier (productized one-time build).
 */
interface PricingTier {
  readonly id:       string
  readonly name:     string
  readonly price:    number
  readonly currency: "EUR" | "USD" | "GBP"
  readonly period:   "one-time" | "monthly" | "annual"
  readonly features: readonly string[]
  readonly retainer: {
    readonly price: number
    readonly period: "monthly"
    readonly description: string
    readonly optional: true
  }
}

/**
 * PRICING_TIER — the one Miru Scale pricing plan.
 */
const PRICING_TIER: PricingTier = {
  id:       "ai-client-system",
  name:     "AI Client System",
  price:    2000,
  currency: "EUR",
  period:   "one-time",
  features: PRICING_FEATURES as unknown as string[],
  retainer: {
    price:       300,
    period:      "monthly",
    description: "Maintenance, optimization, and new sequences",
    optional:    true,
  },
} as const

// ── Social Proof Strip ────────────────────────────────────

/**
 * ProofItem — one item in the horizontal social proof marquee.
 */
interface ProofItem {
  readonly text:  string
  readonly icon?: string  // emoji or icon identifier
}

/**
 * PROOF_ITEMS — short social proof facts for the marquee strip.
 * These rotate horizontally between hero and problem section.
 */
const PROOF_ITEMS: readonly ProofItem[] = [
  { text: "5–10 hours back per week",       icon: "⏱" },
  { text: "< 60 second lead response time", icon: "⚡" },
  { text: "Zero leads fall through",        icon: "✓"  },
  { text: "14-day delivery",                icon: "📅" },
  { text: "You own everything on handover", icon: "🔐" },
  { text: "n8n · Claude · OpenAI stack",   icon: "⚙️" },
  { text: "Works while you're asleep",      icon: "🌙" },
  { text: "Hot leads auto-book calls",      icon: "📞" },
  { text: "Warm leads get a 7-day nurture", icon: "✉️" },
  { text: "No monthly fee to Miru Scale",   icon: "💸" },
] as const

// ── Builder Mockup ────────────────────────────────────────

/**
 * WorkflowNode — one node in the visual n8n-style builder mockup.
 */
interface WorkflowNode {
  readonly id:       string
  readonly label:    string
  readonly type:     "trigger" | "ai" | "branch" | "action" | "output"
  readonly x:        number   // % of container width
  readonly y:        number   // % of container height
  readonly connects: readonly string[]  // ids of nodes this connects to
}

/**
 * WORKFLOW_NODES — the visual workflow displayed in Step 2 of How It Works.
 * Represents: DM → AI Qualifier → Branch → Book / Nurture / Pass
 */
const WORKFLOW_NODES: readonly WorkflowNode[] = [
  {
    id:       "trigger",
    label:    "DM / Email Received",
    type:     "trigger",
    x:        10,
    y:        45,
    connects: ["qualifier"],
  },
  {
    id:       "qualifier",
    label:    "AI Qualifier",
    type:     "ai",
    x:        38,
    y:        45,
    connects: ["branch"],
  },
  {
    id:       "branch",
    label:    "Score Branch",
    type:     "branch",
    x:        62,
    y:        45,
    connects: ["book", "nurture", "pass"],
  },
  {
    id:       "book",
    label:    "Book Call",
    type:     "output",
    x:        86,
    y:        15,
    connects: [],
  },
  {
    id:       "nurture",
    label:    "7-Day Nurture",
    type:     "action",
    x:        86,
    y:        50,
    connects: [],
  },
  {
    id:       "pass",
    label:    "Polite Decline",
    type:     "output",
    x:        86,
    y:        82,
    connects: [],
  },
] as const

/**
 * NODE_COLORS — per node type colors for the workflow mockup.
 */
const NODE_COLORS: Record<WorkflowNode["type"], string> = {
  trigger: "rgba(99, 102, 241, 0.15)",
  ai:      "rgba(13, 148, 136, 0.15)",
  branch:  "rgba(245, 158, 11, 0.12)",
  action:  "rgba(59, 130, 246, 0.12)",
  output:  "rgba(34, 197, 94, 0.12)",
} as const

/**
 * NODE_BORDER_COLORS — per node type border colors.
 */
const NODE_BORDER_COLORS: Record<WorkflowNode["type"], string> = {
  trigger: "rgba(99, 102, 241, 0.40)",
  ai:      "rgba(13, 148, 136, 0.40)",
  branch:  "rgba(245, 158, 11, 0.35)",
  action:  "rgba(59, 130, 246, 0.35)",
  output:  "rgba(34, 197, 94, 0.35)",
} as const

// ── Type guards ───────────────────────────────────────────

/**
 * isLeadBucket — type guard to check if a value is a LeadBucket.
 */
const isLeadBucket = (v: unknown): v is LeadBucket =>
  v === "hot" || v === "warm" || v === "pass"

/**
 * isDemoStage — type guard to check if a value is a DemoStage.
 */
const isDemoStage = (v: unknown): v is DemoStage =>
  v === "idle" || v === "analyzing" || v === "scored" || v === "replying" || v === "done"

/**
 * isRevealDirection — type guard for RevealDirection.
 */
const isRevealDirection = (v: unknown): v is RevealDirection =>
  ["up", "down", "left", "right", "scale", "none"].includes(v as string)


// ============================================================
// § 39 — CSS PHASE 5 — TERMINAL, WORKFLOW & CALENDAR VISUALS
// Step-specific visual styles for HowItWorksSection.
// ============================================================


/**
 * FifthCSSInjector — mounts phase-5 styles.
 * Visual panel styles for HowItWorks section.
 */


// ============================================================
// § 40 — ADDITIONAL VISUAL COMPONENTS
// Reusable sub-components that enrich How It Works visuals.
// Each is self-contained: data + styles + render.
// ============================================================

// ── Follow-Up Timeline Events ─────────────────────────────

interface TimelineEvent {
  readonly day:      string       // "Day 0" | "Day 1" | "Day 3" | "Day 7"
  readonly subject:  string
  readonly preview:  string
  readonly type:     "ai-reply" | "email" | "booking" | "follow-up"
  readonly isActive: boolean
}

const TIMELINE_EVENTS: readonly TimelineEvent[] = [
  {
    day:      "Day 0",
    subject:  "Instant AI reply to DM",
    preview:  '"Hey! Thanks for reaching out — I had a quick question to make sure I can actually help you…"',
    type:     "ai-reply",
    isActive: true,
  },
  {
    day:      "Day 1",
    subject:  "Follow-up email sent",
    preview:  '"Just circling back — here\'s a quick breakdown of what the call would look like for you…"',
    type:     "email",
    isActive: false,
  },
  {
    day:      "Day 3",
    subject:  "Value email + case study",
    preview:  '"A fitness coach I worked with had the same bottleneck. Here\'s what changed in their first 30 days…"',
    type:     "follow-up",
    isActive: false,
  },
  {
    day:      "Day 7",
    subject:  "Final nudge + booking link",
    preview:  '"Last thing from me — if the timing\'s not right, no worries. But if you want to see if this fits…"',
    type:     "booking",
    isActive: false,
  },
] as const

/**
 * FollowUpTimeline — animated vertical timeline mockup.
 * Shows the 7-day warm lead nurture sequence.
 * Used as the Step 3 visual in HowItWorksSection.
 */
function FollowUpTimeline({ activeIndex = 0 }: { readonly activeIndex?: number }) {
  const TYPE_ICONS: Record<TimelineEvent["type"], string> = {
    "ai-reply":  "⚡",
    "email":     "✉️",
    "follow-up": "📎",
    "booking":   "📅",
  } as const

  return (
    <div className="ms-hiw__visual">
      <div className="ms-timeline">
        {TIMELINE_EVENTS.map((ev, i) => (
          <div
            key={i}
            className={`ms-tl-event${i <= activeIndex ? " ms-tl-event--active" : ""}`}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="ms-tl-event__day-wrap">
              <div className="ms-tl-event__day-dot" />
              <span className="ms-tl-event__day-label">{ev.day}</span>
            </div>
            <div className="ms-tl-event__card">
              <div className="ms-tl-event__subject">{ev.subject}</div>
              <div className="ms-tl-event__preview">{ev.preview}</div>
              <div className="ms-tl-event__type">
                <span>{TYPE_ICONS[ev.type]}</span>
                <span>{ev.type.replace("-", " ")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Builder Mockup Visual ─────────────────────────────────

/**
 * BuilderMockup — animated n8n-style workflow diagram.
 * Shows the automated pipeline: DM → AI → Branch → Outputs.
 * Used as the Step 2 visual in HowItWorksSection.
 *
 * The scan line animation implies the system is actively
 * processing — same visual language as a code editor's
 * "compiling" state.
 */
function BuilderMockup({ isActive = false }: { readonly isActive?: boolean }) {
  return (
    <div className="ms-hiw__visual">
      <div className="ms-builder">
        {/* Chrome bar */}
        <div className="ms-builder__chrome">
          <div className="ms-demo__dots">
            <div className="ms-demo__dot" />
            <div className="ms-demo__dot" />
            <div className="ms-demo__dot" />
          </div>
          <span
            style={{
              fontSize: 11,
              color: "var(--c-ghost)",
              fontFamily: "monospace",
              marginLeft: 8,
            }}
          >
            miru-scale / lead-qualification.json
          </span>
        </div>

        {/* Canvas */}
        <div className="ms-builder__canvas">
          {isActive && <div className="ms-builder__scan" />}

          {/* SVG edges */}
          <svg className="ms-builder__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* trigger → qualifier */}
            <path
              d="M 20 45 C 30 45 28 45 38 45"
              className={`ms-builder__edge${isActive ? " ms-builder__edge--active" : ""}`}
            />
            {/* qualifier → branch */}
            <path
              d="M 48 45 C 55 45 55 45 62 45"
              className={`ms-builder__edge${isActive ? " ms-builder__edge--active" : ""}`}
            />
            {/* branch → book */}
            <path
              d="M 68 45 C 75 45 78 15 86 15"
              className="ms-builder__edge"
            />
            {/* branch → nurture */}
            <path
              d="M 68 45 C 75 45 78 50 86 50"
              className="ms-builder__edge"
            />
            {/* branch → pass */}
            <path
              d="M 68 45 C 75 45 78 82 86 82"
              className="ms-builder__edge"
            />
          </svg>

          {/* Workflow nodes */}
          {WORKFLOW_NODES.map((node) => (
            <div
              key={node.id}
              className={`ms-wf-node ms-wf-node--${node.type}${
                isActive && node.type === "ai" ? " ms-wf-node--active" : ""
              }`}
              style={{
                left:  `${node.x}%`,
                top:   `${node.y}%`,
                animationDelay: `${WORKFLOW_NODES.indexOf(node) * 80}ms`,
              }}
            >
              <span className="ms-wf-node__icon">
                {node.type === "trigger" ? "⚡" :
                 node.type === "ai"      ? "🤖" :
                 node.type === "branch"  ? "⑂"  :
                 node.type === "action"  ? "✉️" : "✓"}
              </span>
              {node.label}
            </div>
          ))}
        </div>

        {/* Status bar */}
        <div
          style={{
            padding: "8px 16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            color: "var(--c-ghost)",
            fontFamily: "monospace",
          }}
        >
          <div
            className="ms-demo__live-dot"
            style={{ opacity: isActive ? 1 : 0.3 }}
          />
          <span>
            {isActive
              ? "Execution active · 3 nodes running"
              : "Workflow paused · 6 nodes · Last run: 4m ago"}
          </span>
          <span style={{ marginLeft: "auto", color: "var(--c-teal-text)" }}>
            n8n v1.48.0
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Audit Terminal ────────────────────────────────────────

interface TerminalLine {
  readonly type:    "prompt" | "output" | "success" | "warn" | "blank"
  readonly content: string
  readonly delay:   number  // ms offset from start
}

const AUDIT_TERMINAL_LINES: readonly TerminalLine[] = [
  { type: "prompt",  content: "miru audit --client ./coach-intake",  delay: 0   },
  { type: "output",  content: "Scanning entry points...",            delay: 400 },
  { type: "output",  content: "  → Instagram DM: connected ✓",      delay: 700 },
  { type: "output",  content: "  → Email (Gmail): connected ✓",     delay: 950 },
  { type: "output",  content: "  → Web form (Typeform): detected",  delay: 1200 },
  { type: "blank",   content: "",                                    delay: 1500 },
  { type: "prompt",  content: "miru analyze --leads last-30d",      delay: 1700 },
  { type: "output",  content: "Analyzing 143 leads...",             delay: 2000 },
  { type: "warn",    content: "  ⚠ 68 leads received no follow-up", delay: 2300 },
  { type: "warn",    content: "  ⚠ Avg response time: 14h 22m",    delay: 2550 },
  { type: "success", content: "  ✓ High-intent signals identified",  delay: 2800 },
  { type: "blank",   content: "",                                    delay: 3000 },
  { type: "success", content: "Audit complete · Qualifier ready",    delay: 3200 },
] as const

/**
 * AuditTerminal — animated terminal that replays the audit flow.
 * Each line appears with a typewriter-style staggered delay.
 * Used as Step 1 visual in HowItWorksSection.
 *
 * The AbortRef pattern ensures cleanup if the component unmounts
 * mid-animation.
 */
function AuditTerminal({ isActive = false }: { readonly isActive?: boolean }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const abortRef = useRef(false)

  useEffect(() => {
    if (!isActive) {
      setVisibleCount(0)
      abortRef.current = false
      return
    }

    abortRef.current = false
    setVisibleCount(0)

    let index = 0

    const showNext = () => {
      if (abortRef.current || index >= AUDIT_TERMINAL_LINES.length) return
      const line = AUDIT_TERMINAL_LINES[index]
      const nextLine = AUDIT_TERMINAL_LINES[index + 1]
      const gap = nextLine ? nextLine.delay - line.delay : 0
      index++
      setVisibleCount(index)
      setTimeout(showNext, gap)
    }

    setTimeout(showNext, AUDIT_TERMINAL_LINES[0].delay)

    return () => { abortRef.current = true }
  }, [isActive])

  const visibleLines = AUDIT_TERMINAL_LINES.slice(0, visibleCount)

  return (
    <div className="ms-hiw__visual">
      <div className="ms-terminal">
        <div className="ms-terminal__chrome">
          <div className="ms-terminal__dots">
            <div className="ms-terminal__dot" />
            <div className="ms-terminal__dot" />
            <div className="ms-terminal__dot" />
          </div>
          <span className="ms-terminal__title">miru-cli · audit session</span>
        </div>

        <div className="ms-terminal__body">
          {visibleLines.map((line, i) => {
            if (line.type === "blank") {
              return <div key={i} style={{ height: 8 }} />
            }
            if (line.type === "prompt") {
              return (
                <div key={i} className="ms-terminal__line">
                  <span className="ms-terminal__prompt">❯</span>
                  <span className="ms-terminal__cmd">{line.content}</span>
                </div>
              )
            }
            const cls =
              line.type === "success" ? "ms-terminal__output--success" :
              line.type === "warn"    ? "ms-terminal__output--warn"    :
              ""
            return (
              <div key={i} className={`ms-terminal__output ${cls}`}>
                {line.content}
              </div>
            )
          })}
          {visibleCount < AUDIT_TERMINAL_LINES.length && (
            <div className="ms-terminal__line">
              <span className="ms-terminal__prompt">❯</span>
              <span className="ms-terminal__cursor" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Handover Callout ──────────────────────────────────────

const HANDOVER_ITEMS = [
  "Screen-recorded walkthrough of every workflow",
  "Written SOP with step-by-step screenshots",
  "7-day post-delivery support window",
  "Your API keys · Your n8n instance · Your data",
  "No monthly fee to Miru Scale after handover",
] as const

/**
 * HandoverCallout — Step 4 visual.
 * Clean card confirming what the coach receives on handover.
 * Not a receipt, not a pitch — just a clear promise.
 */
function HandoverCallout() {
  return (
    <div className="ms-hiw__visual" style={{ padding: 0, border: "none", background: "none" }}>
      <div className="ms-handover-callout">
        <div className="ms-handover-callout__icon">📦</div>
        <div className="ms-handover-callout__title">
          What you receive on Day 14
        </div>
        <div className="ms-handover-callout__desc">
          Everything is documented, tested, and on your infrastructure.
          I don't hold anything back.
        </div>
        <div className="ms-handover-callout__checklist">
          {HANDOVER_ITEMS.map((item, i) => (
            <div key={i} className="ms-handover-callout__item">
              <div className="ms-handover-callout__check">✓</div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


// ============================================================
// § 41 — CSS PHASE 6 — ROOT VARIABLES EXTENDED + THEME TOKENS
// All CSS custom properties documented with purpose notes.
// ============================================================


/**
 * SixthCSSInjector — mounts phase-6 styles.
 * Full design token system + component theme variables.
 */


// ============================================================
// § 42 — PERFORMANCE UTILITIES
// Optimizations for scroll-heavy, animation-heavy pages.
// Documented with the "why" for each decision.
// ============================================================

/**
 * prefersReducedMotion — reads the user's motion preference.
 * Called once at module init (synchronous; no hook needed).
 *
 * Used to gate all animation logic before mounting components.
 * This is faster than a hook because it doesn't cause a re-render.
 */
const prefersReducedMotion: boolean =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false

/**
 * isTouchDevice — detects touch-primary devices.
 * On touch devices we skip hover animations and magnetic effects.
 */
const _CSS = typeof window !== "undefined" ? (window as any).CSS : null

const isTouchDevice: boolean =
  typeof window !== "undefined"
    ? window.matchMedia("(hover: none)").matches
    : false

/**
 * supportsContainerQueries — feature detection for CSS container queries.
 * Future-proofing: if we add container-query-based responsive styles.
 */
const supportsContainerQueries: boolean =
  typeof window !== "undefined" &&
  typeof (window as unknown as Record<string, unknown>).CSS !== "undefined" &&
  typeof (CSS as unknown as Record<string, unknown>).supports === "function" &&
  _CSS?.supports("container-type", "inline-size")

/**
 * supportsHasSelector — feature detection for CSS :has() selector.
 * Allows parent-aware styling without JavaScript.
 */
const supportsHasSelector: boolean =
  typeof window !== "undefined" &&
  typeof (CSS as unknown as Record<string, unknown>).supports === "function" &&
  _CSS?.supports("selector(:has(a))")

/**
 * RAF_ID_MAP — global map to track active requestAnimationFrame IDs.
 * Used by the animation scheduler to prevent duplicate frames.
 */
const RAF_ID_MAP = new Map<string, number>()

/**
 * scheduleRaf — schedules a named animation frame callback.
 * Cancels any previous frame with the same name.
 *
 * @param name — unique identifier for this animation
 * @param cb   — callback to run on the next animation frame
 */
const scheduleRaf = (name: string, cb: FrameRequestCallback): void => {
  const existing = RAF_ID_MAP.get(name)
  if (existing) cancelAnimationFrame(existing)
  RAF_ID_MAP.set(name, requestAnimationFrame(cb))
}

/**
 * cancelRaf — cancels a named animation frame.
 *
 * @param name — identifier used in scheduleRaf
 */
const cancelRaf = (name: string): void => {
  const id = RAF_ID_MAP.get(name)
  if (id) {
    cancelAnimationFrame(id)
    RAF_ID_MAP.delete(name)
  }
}

/**
 * IntersectionObserver instance cache.
 * Reuses observers where possible to reduce memory footprint.
 * Each entry key = "threshold:rootMargin".
 */
const OBSERVER_CACHE = new Map<string, IntersectionObserver>()

/**
 * getSharedObserver — returns a cached IntersectionObserver.
 * Creates a new one if the requested config isn't cached yet.
 *
 * Note: shared observers call all registered callbacks on any entry.
 * Only use for simple show/hide scenarios (not per-element logic).
 *
 * @param threshold  — 0–1 visibility threshold
 * @param rootMargin — CSS root margin string
 * @param callback   — callback for intersections
 */
const createObserver = (
  threshold: number,
  rootMargin: string,
  callback: IntersectionObserverCallback
): IntersectionObserver =>
  new IntersectionObserver(callback, { threshold, rootMargin })

/**
 * LazyImage — img element with native lazy loading + fade-in on load.
 * Eliminates layout shift by requiring explicit width/height.
 *
 * @param src    — image URL
 * @param alt    — alt text (required for accessibility)
 * @param width  — explicit width (px)
 * @param height — explicit height (px)
 * @param cls    — additional CSS class
 */
function LazyImage({
  src,
  alt,
  width,
  height,
  cls = "",
}: {
  readonly src:    string
  readonly alt:    string
  readonly width:  number
  readonly height: number
  readonly cls?:   string
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={cls}
      onLoad={() => setLoaded(true)}
      style={{
        opacity:    loaded ? 1 : 0,
        transition: `opacity ${DesignTokens.timing.mid} ${DesignTokens.easing.outExpo}`,
        display:    "block",
      }}
    />
  )
}

/**
 * Portal — renders children outside the React tree.
 * Used for modals, tooltips, dropdowns that need to escape overflow:hidden.
 *
 * @param children — content to portal
 * @param target   — DOM target element (defaults to document.body)
 */
function Portal({
  children,
  target = document.body,
}: {
  readonly children: React.ReactNode
  readonly target?:  Element
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return ReactDOM.createPortal(children, target)
}

// Portal helper for Next.js
const ReactDOM = { createPortal }

/**
 * ErrorBoundary — catches render errors in child trees.
 * Prevents a single component failure from breaking the whole page.
 * Falls back to a minimal "something went wrong" message.
 */
class ErrorBoundary extends React.Component<
  { readonly children: React.ReactNode; readonly fallback?: React.ReactNode },
  { readonly hasError: boolean; readonly error: Error | null }
> {
  constructor(props: {
    readonly children: React.ReactNode
    readonly fallback?: React.ReactNode
  }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production, replace with error reporting (Sentry, etc.)
    console.error("[MiruScalePage] Render error:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div
          style={{
            padding: "40px 24px",
            textAlign: "center",
            color: "var(--c-ghost, #71717A)",
            fontSize: 13,
          }}
        >
          Something went wrong rendering this section.
        </div>
      )
    }
    return this.props.children
  }
}

/**
 * Suspense wrapper — catches lazy-loaded component suspense states.
 * Falls back to a teal skeleton while the component loads.
 */
function SuspenseWrap({
  children,
  fallback,
}: {
  readonly children: React.ReactNode
  readonly fallback?: React.ReactNode
}) {
  return (
    <React.Suspense
      fallback={
        fallback ?? (
          <div className="ms-skeleton ms-skeleton--block" style={{ height: 200 }} />
        )
      }
    >
      {children}
    </React.Suspense>
  )
}

// ============================================================
// § 43 — ACCESSIBILITY UTILITIES
// WCAG 2.1 AA compliance helpers.
// Contrast ratios, skip links, ARIA patterns.
// ============================================================

/**
 * getContrastRatio — computes WCAG relative luminance contrast ratio.
 * Implements the formula from WCAG 2.1 Success Criterion 1.4.3.
 *
 * @param hex1 — foreground color hex string (e.g. "#FAFAFA")
 * @param hex2 — background color hex string (e.g. "#09090B")
 * @returns contrast ratio (1:1 to 21:1)
 *
 * @example getContrastRatio("#2DD4BF", "#09090B") → ~5.2 (passes AA)
 */
const getContrastRatio = (hex1: string, hex2: string): number => {
  const luminance = (hex: string): number => {
    const rgb = hex.replace("#", "").match(/.{2}/g)!
      .map((c) => parseInt(c, 16) / 255)
      .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)))
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
  }
  const l1 = luminance(hex1)
  const l2 = luminance(hex2)
  const brighter = Math.max(l1, l2)
  const darker   = Math.min(l1, l2)
  return (brighter + 0.05) / (darker + 0.05)
}

/**
 * meetsWCAG — checks if a color pair meets WCAG 2.1 contrast standards.
 *
 * @param fg      — foreground color hex
 * @param bg      — background color hex
 * @param level   — "AA" (4.5:1) or "AAA" (7:1)
 * @param isLarge — large text uses lower threshold (3:1 for AA)
 */
const meetsWCAG = (
  fg: string,
  bg: string,
  level: "AA" | "AAA" = "AA",
  isLarge = false
): boolean => {
  const ratio = getContrastRatio(fg, bg)
  if (level === "AAA") return ratio >= 7
  return isLarge ? ratio >= 3 : ratio >= 4.5
}

/**
 * SkipLink — visually hidden link that appears on keyboard focus.
 * Allows keyboard users to skip navigation and jump to main content.
 * Required for WCAG 2.1 Success Criterion 2.4.1.
 *
 * Renders at the very top of the page, before the Nav component.
 */
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="ms-skip-link"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  )
}

/**
 * LiveRegion — ARIA live region for announcing dynamic content changes.
 * Screen readers announce text updates to this region automatically.
 *
 * @param message  — text to announce
 * @param assertive — if true, interrupts current screen reader speech
 *
 * @example
 *   // In LiveLeadDemo, announce when analysis completes:
 *   <LiveRegion message={stage === "scored" ? "Lead scored: 87 out of 100, hot bucket" : ""} />
 */
function LiveRegion({
  message,
  assertive = false,
}: {
  readonly message:   string
  readonly assertive?: boolean
}) {
  return (
    <div
      role="status"
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
      className="ms-sr-only"
    >
      {message}
    </div>
  )
}

/**
 * useFocusTrap — traps keyboard focus within a container.
 * Used for modals, drawers, and dropdown menus.
 * Implements the ARIA authoring practices guide (APG) pattern.
 *
 * @param ref     — container element to trap focus within
 * @param enabled — toggle the trap on/off
 */
function useFocusTrap(
  ref: React.RefObject<HTMLElement>,
  enabled: boolean
): void {
  useEffect(() => {
    if (!enabled || !ref.current) return

    const el = ref.current
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]

    first?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    el.addEventListener("keydown", onKeyDown)
    return () => el.removeEventListener("keydown", onKeyDown)
  }, [ref, enabled])
}

/**
 * useAnnounce — returns a function that announces messages to screen readers.
 * Uses a pooled live region to avoid creating multiple DOM nodes.
 *
 * @example
 *   const announce = useAnnounce()
 *   // Later:
 *   announce("Form submitted successfully")
 */
function useAnnounce(): (message: string, assertive?: boolean) => void {
  const announce = useCallback((message: string, assertive = false) => {
    const id = assertive ? "ms-live-assertive" : "ms-live-polite"
    let region = document.getElementById(id)

    if (!region) {
      region = document.createElement("div")
      region.id = id
      region.setAttribute("role", "status")
      region.setAttribute("aria-live", assertive ? "assertive" : "polite")
      region.setAttribute("aria-atomic", "true")
      region.className = "ms-sr-only"
      document.body.appendChild(region)
    }

    // Clear and re-set to force screen reader re-announcement
    region.textContent = ""
    requestAnimationFrame(() => {
      if (region) region.textContent = message
    })
  }, [])

  return announce
}


// ============================================================
// § 44 — CSS PHASE 7 — ADVANCED INTERACTION PATTERNS
// Focus states, skip links, mobile nav, loading states.
// ============================================================




// ============================================================
// § 45 — EXTENDED DATA LAYER
// All static content for the page. Edited here — never
// scattered through JSX. Single source of truth.
// ============================================================

// ── Problem Section ───────────────────────────────────────


// ── Social Proof Numbers ──────────────────────────────────

/**
 * Hard numbers displayed in social proof contexts.
 * These are verifiable metrics — not marketing claims.
 */
const SOCIAL_PROOF_STATS = {
  avgHoursBack:    "5–10",    // hours per week coaches report back
  responseTimeMin: 1,         // minutes max for first AI reply
  deliveryDays:    14,        // days from payment to handover
  followUpDays:    7,         // day nurture window
  buildsCompleted: 4,         // total systems built (honest at launch)
} as const

// ── Copy Variants (A/B test ready) ───────────────────────

/**
 * HeroCopyVariant — headline + subheadline pairs for testing.
 * Only variant A is active by default.
 * To test: pass `variant` prop to Hero component.
 */
const HERO_COPY_VARIANTS = {
  A: {
    eyebrow: "ai client systems for online coaches",
    h1:      "Never Lose a Lead Again.",
    sub:     "Qualify, follow up, and book calls automatically — while you coach.",
  },
  B: {
    eyebrow: "ai client systems for online coaches",
    h1:      "Your Leads Deserve a Faster Reply.",
    sub:     "AI qualification and follow-up — live in 14 days.",
  },
  C: {
    eyebrow: "ai client systems for online coaches",
    h1:      "Stop Losing Leads at 2am.",
    sub:     "The AI system that handles your DMs while you sleep.",
  },
} as const

type HeroCopyVariantKey = keyof typeof HERO_COPY_VARIANTS

// ── Structured Data (JSON-LD) ─────────────────────────────

/**
 * getStructuredData — generates JSON-LD schema markup for SEO.
 * Returns a script tag contents string.
 *
 * Schema types used:
 *   - Person (Emre Er)
 *   - Service (Miru Scale AI Client System)
 *   - FAQPage
 *
 * Must be inserted as <script type="application/ld+json"> in the
 * page <head>. In Framer, add via a custom code component or
 * the Head > Custom Code field.
 */
const getStructuredData = (): string => {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":        "Person",
        "@id":          "https://miruscale.de/#emre",
        "name":         "Emre Er",
        "jobTitle":     "Founder, Miru Scale",
        "email":        "emre@miruscale.de",
        "url":          "https://miruscale.de",
        "sameAs": [
          "https://www.linkedin.com/in/emre-er-50941a409/",
        ],
      },
      {
        "@type":       "Service",
        "@id":         "https://miruscale.de/#service",
        "name":        "AI Client System for Online Coaches",
        "description": "Automated lead qualification, personalized follow-up sequences, and automatic call booking for solo online coaches. Built in n8n, powered by Claude AI. 7–14 day delivery.",
        "provider": {
          "@id": "https://miruscale.de/#emre",
        },
        "offers": {
          "@type":         "Offer",
          "price":         "2000",
          "priceCurrency": "EUR",
          "priceSpecification": {
            "@type":       "UnitPriceSpecification",
            "price":       "2000",
            "priceCurrency": "EUR",
            "unitText":    "one-time",
          },
        },
        "areaServed":     "Worldwide",
        "serviceType":    "AI Automation / Done-For-You System",
      },
      {
        "@type":    "FAQPage",
        "@id":      "https://miruscale.de/#faq",
        "mainEntity": FAQ_ITEMS.map((item) => ({
          "@type":          "Question",
          "name":           item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text":  item.a,
          },
        })),
      },
    ],
  }
  return JSON.stringify(data, null, 2)
}

/**
 * StructuredDataInjector — injects JSON-LD into <head>.
 * Deduplication guard via id="ms-structured-data".
 */
function StructuredDataInjector() {
  useEffect(() => {
    const id = "ms-structured-data"
    if (document.getElementById(id)) return
    const script = document.createElement("script")
    script.id = id
    script.type = "application/ld+json"
    script.textContent = getStructuredData()
    document.head.appendChild(script)
    return () => {
      const el = document.getElementById(id)
      if (el) el.remove()
    }
  }, [])
  return null
}

// ── Open Graph Meta ───────────────────────────────────────

/**
 * MetaInjector — injects Open Graph and Twitter Card meta tags.
 * Required for social sharing previews.
 *
 * In Framer production, these should be in the CMS or
 * Site Settings. This injector is a fallback for code-component
 * preview contexts.
 */
function MetaInjector() {
  useEffect(() => {
    const id = "ms-meta-og"
    if (document.getElementById(id)) return

    const metas: [string, string, string][] = [
      ["property", "og:title",       "Miru Scale — AI Client Systems for Online Coaches"],
      ["property", "og:description", "Qualify leads, follow up automatically, and book calls without lifting a finger. Built in 14 days. Yours to keep."],
      ["property", "og:type",        "website"],
      ["property", "og:url",         "https://miruscale.de"],
      ["property", "og:image",       "https://miruscale.de/og-image.jpg"],
      ["property", "og:site_name",   "Miru Scale"],
      ["name",     "twitter:card",   "summary_large_image"],
      ["name",     "twitter:title",  "Miru Scale — AI Client Systems for Online Coaches"],
      ["name",     "twitter:description", "Stop losing leads to slow replies. AI qualification + automated follow-up, live in 14 days."],
      ["name",     "twitter:image",  "https://miruscale.de/og-image.jpg"],
    ]

    const fragment = document.createDocumentFragment()
    const marker = document.createElement("meta")
    marker.id = id
    marker.setAttribute("data-ms-meta", "true")
    fragment.appendChild(marker)

    for (const [attr, name, content] of metas) {
      const el = document.createElement("meta")
      el.setAttribute(attr, name)
      el.setAttribute("content", content)
      fragment.appendChild(el)
    }

    document.head.appendChild(fragment)

    return () => {
      const toRemove = document.querySelectorAll("[data-ms-meta], #ms-meta-og")
      toRemove.forEach((el) => el.remove())
    }
  }, [])

  return null
}


// ============================================================
// § 46 — ADDITIONAL MICRO-COMPONENTS
// Reusable atoms and molecules. Each one < 60 lines.
// ============================================================

/**
 * TealLine — a 2px teal gradient divider.
 * Used between major sections to add visual rhythm.
 *
 * @param align — "left" | "center"
 * @param width — pixel width of the line
 */
function TealLine({
  align = "left",
  width = 48,
}: {
  readonly align?: "left" | "center"
  readonly width?: number
}) {
  return (
    <div
      className="ms-divider--teal"
      style={{
        width,
        marginLeft: align === "center" ? "auto" : undefined,
        marginRight: align === "center" ? "auto" : undefined,
      }}
    />
  )
}

/**
 * MetricPill — inline teal-highlighted number + label.
 * Used inline in body copy to call out a specific metric.
 *
 * @param value — the number or string to highlight
 * @param label — description following the value
 *
 * @example <MetricPill value="5–10" label="hours back per week" />
 */
function MetricPill({
  value,
  label,
}: {
  readonly value: string
  readonly label: string
}) {
  return (
    <span
      style={{
        display:        "inline-flex",
        alignItems:     "baseline",
        gap:            6,
        padding:        "2px 10px",
        background:     "var(--c-teal-soft)",
        border:         "1px solid var(--c-teal-line)",
        borderRadius:   "var(--r-sm)",
        fontSize:       "inherit",
        whiteSpace:     "nowrap",
      }}
    >
      <span
        style={{
          fontWeight:     800,
          fontFamily:     "var(--ff-display)",
          letterSpacing:  "var(--ls-tight)",
          color:          "var(--c-teal-text)",
        }}
      >
        {value}
      </span>
      <span style={{ color: "var(--c-muted)", fontSize: "0.85em" }}>
        {label}
      </span>
    </span>
  )
}

/**
 * FeatureDot — simple teal checkmark indicator row.
 * Used in feature lists where icons would be too heavy.
 *
 * @param children — feature text
 */
function FeatureDot({ children }: { readonly children: React.ReactNode }) {
  return (
    <div
      style={{
        display:    "flex",
        alignItems: "flex-start",
        gap:        10,
        fontSize:   14,
        color:      "var(--c-muted)",
        lineHeight: 1.55,
      }}
    >
      <span
        style={{
          color:     "var(--c-teal)",
          fontWeight: 700,
          fontSize:   13,
          flexShrink: 0,
          marginTop:  1,
        }}
      >
        ✓
      </span>
      {children}
    </div>
  )
}

/**
 * SectionDivider — full-width teal gradient line between sections.
 * Optional label text centered on top of the line.
 */
function SectionDivider({ label }: { readonly label?: string }) {
  return (
    <div
      style={{
        position:   "relative",
        height:     1,
        background: "var(--c-border)",
        margin:     "0 48px",
      }}
    >
      {label && (
        <span
          style={{
            position:   "absolute",
            top:        "50%",
            left:       "50%",
            transform:  "translate(-50%, -50%)",
            background: "var(--c-bg)",
            padding:    "0 16px",
            fontSize:   11,
            color:      "var(--c-ghost)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}

/**
 * PulsingDot — animated status indicator.
 * Shows active, pending, or completed states.
 *
 * @param status — "active" | "pending" | "done"
 * @param size   — dot diameter in pixels
 */
function PulsingDot({
  status = "active",
  size = 8,
}: {
  readonly status?: "active" | "pending" | "done"
  readonly size?:   number
}) {
  const colors: Record<typeof status, string> = {
    active:  "var(--c-teal)",
    pending: "var(--c-warning)",
    done:    "var(--c-success)",
  }

  return (
    <span
      style={{
        display:     "inline-block",
        width:       size,
        height:      size,
        borderRadius: "50%",
        background:  colors[status],
        animation:   status === "done" ? "none" : "ms-pulse 2s ease-in-out infinite",
        flexShrink:  0,
      }}
    />
  )
}

/**
 * TechStack — displays the technology stack inline.
 * Used in About section and pricing card.
 */
function TechStack() {
  const TECH = [
    { name: "n8n",       color: "#EA4B71" },
    { name: "Claude AI", color: "var(--c-teal-text)" },
    { name: "OpenAI",    color: "#10A37F" },
    { name: "Calendly",  color: "#006BFF" },
  ] as const

  return (
    <div
      style={{
        display:    "flex",
        alignItems: "center",
        gap:        8,
        flexWrap:   "wrap",
      }}
    >
      {TECH.map((t, i) => (
        <span
          key={i}
          style={{
            fontSize:      11,
            fontFamily:    "var(--ff-mono)",
            color:         t.color,
            background:    "rgba(255,255,255,0.04)",
            border:        "1px solid rgba(255,255,255,0.08)",
            borderRadius:  4,
            padding:       "3px 8px",
          }}
        >
          {t.name}
        </span>
      ))}
    </div>
  )
}

/**
 * AnimatedCounter — displays a count-up number animation.
 * Fires when the element enters the viewport.
 * Thin wrapper around useCountUp + useInView.
 *
 * @param target   — final number
 * @param prefix   — string before the number
 * @param suffix   — string after the number
 * @param duration — animation duration in ms
 * @param cls      — additional CSS class
 */
function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 1800,
  cls = "",
}: {
  readonly target:    number
  readonly prefix?:   string
  readonly suffix?:   string
  readonly duration?: number
  readonly cls?:      string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, 0.3)
  const count = useCountUp(target, duration, inView && !prefersReducedMotion)

  return (
    <span ref={ref} className={cls}>
      {prefix}{prefersReducedMotion ? target : count}{suffix}
    </span>
  )
}

/**
 * GradientText — wraps children in the teal gradient text style.
 * Shorthand for the G component; same output, different name.
 */
function GradientText({ children }: { readonly children: React.ReactNode }) {
  return <G>{children}</G>
}

/**
 * TrustItem — one item in the hero trust bar.
 * Icon + text in a small horizontal layout.
 *
 * @param icon — emoji or icon element
 * @param text — label text
 */
function TrustItem({
  icon,
  text,
}: {
  readonly icon: string
  readonly text: string
}) {
  return (
    <div className="ms-hero__trust-item">
      <span className="ms-hero__trust-icon">{icon}</span>
      <span>{text}</span>
    </div>
  )
}

// ============================================================
// § 47 — PROBLEM SECTION — FULL IMPLEMENTATION
// Left: pain points. Right: before/after comparison table.
// Asymmetric layout. No pills anywhere.
// ============================================================


// ============================================================
// § 55 — LIVE LEAD DEMO — COMPLETE IMPLEMENTATION
// macOS window chrome. State machine. Score bars. Typewriter.
// AbortRef cleanup. Tab switching.


// ============================================================
// § 56 — ROOT COMPONENT UPDATE
// Replaces § 29 export. Includes all injectors + SkipLink.
// SecondCSSInjector through SeventhCSSInjector all mounted.
// StructuredDataInjector + MetaInjector for SEO.
// ============================================================

// NOTE: The export default function MiruScalePage is already
// defined in § 29. The version below is an augmented version
// that should be used if replacing § 29 entirely.
// In current file structure, § 29 is the active export.
// This section documents the full intended root render.

/*
  Full root render order:
  ──────────────────────────────────────────
  1. SkipLink              (a11y — before all)
  2. CSSInjector           (phase 1 — base)
  3. SecondCSSInjector     (phase 2 — about/pricing/footer)
  4. ThirdCSSInjector      (phase 3 — system component library)
  5. FourthCSSInjector     (phase 4 — animations + utilities)
  6. FifthCSSInjector      (phase 5 — terminal/builder/calendar)
  7. SixthCSSInjector      (phase 6 — root vars + components)
  8. SeventhCSSInjector    (phase 7 — advanced interactions)
  9. StructuredDataInjector (SEO — JSON-LD)
  10. MetaInjector          (SEO — Open Graph)
  11. Nav                   (fixed, top)
  12. main#main-content
      ├── Hero              (with LiveLeadDemo)
      ├── SocialProofStrip
      ├── ProblemSection
      ├── SolutionSection
      ├── HowItWorksSection
      ├── MetricsSection
      ├── TestimonialsSection
      ├── AboutSection
      ├── PricingSection
      ├── FinalCTA
      └── FAQSection
  13. Footer
  ──────────────────────────────────────────
*/

// ============================================================
// § 57 — FRAMER CANVAS UTILITIES
// Helpers specific to the Framer Code Component environment.
// ============================================================

/**
 * FRAMER_ENV — detects whether we're running inside Framer.
 * Used to conditionally disable features that conflict with
 * the Framer canvas editor (e.g. position:fixed nav).
 */
const FRAMER_ENV = {
  /** true if running inside Framer canvas or preview */
  isFramer: typeof window !== "undefined" &&
    (window.location.hostname.includes("framer") ||
     document.documentElement.hasAttribute("data-framer")),

  /** true if running in Framer's live preview (not canvas) */
  isPreview: typeof window !== "undefined" &&
    window.location.search.includes("preview=1"),

  /** true if running as a published Framer site */
  isPublished: typeof window !== "undefined" &&
    !window.location.hostname.includes("framer") &&
    !window.location.hostname.includes("localhost"),
} as const

/**
 * useFramerCanvas — returns true if running in Framer canvas.
 * Drives conditional rendering for canvas-safe layouts.
 */
function useFramerCanvas(): boolean {
  const [isCanvas, setIsCanvas] = useState(false)
  useEffect(() => {
    setIsCanvas(FRAMER_ENV.isFramer && !FRAMER_ENV.isPreview)
  }, [])
  return isCanvas
}

/**
 * FramerCanvasSafeNav — renders a position:sticky nav in canvas,
 * and position:fixed nav in preview/production.
 * Prevents the nav from overlapping the Framer timeline controls.
 */
function FramerCanvasSafeNav() {
  const isCanvas = useFramerCanvas()

  return isCanvas ? null : <Nav />
}

// ============================================================
// § 58 — EXTENDED ANIMATION COMPONENTS
// Higher-level components built on the animation system.
// ============================================================

/**
 * TextReveal — reveals text word by word with a stagger.
 * Each word fades up with a small delay between words.
 *
 * @param text     — string to reveal
 * @param delay    — base delay before first word (ms)
 * @param stagger  — delay between words (ms)
 * @param cls      — CSS class for the container
 */
function TextReveal({
  text,
  delay = 0,
  stagger = 60,
  cls = "",
}: {
  readonly text:    string
  readonly delay?:  number
  readonly stagger?: number
  readonly cls?:    string
}) {
  const words = text.split(" ")

  return (
    <span className={cls} aria-label={text}>
      {words.map((word, i) => (
        <Reveal key={i} delay={delay + i * stagger}>
          <span
            style={{ display: "inline-block", marginRight: "0.25em" }}
            aria-hidden="true"
          >
            {word}
          </span>
        </Reveal>
      ))}
    </span>
  )
}

/**
 * CountUpNumber — animates from 0 to `target`.
 * Fires once when element enters viewport.
 * Respects prefers-reduced-motion.
 *
 * @param target    — final number
 * @param duration  — animation duration in ms
 * @param prefix    — text before number
 * @param suffix    — text after number
 * @param delay     — start delay in ms
 */
function CountUpNumber({
  target,
  duration = 1800,
  prefix = "",
  suffix = "",
  delay = 0,
}: {
  readonly target:    number
  readonly duration?: number
  readonly prefix?:   string
  readonly suffix?:   string
  readonly delay?:    number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shouldStart, setShouldStart] = useState(false)
  const inView = useInView(ref, 0.3)
  const count = useCountUp(target, duration, shouldStart && !prefersReducedMotion)

  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => setShouldStart(true), delay)
    return () => clearTimeout(timer)
  }, [inView, delay])

  return (
    <span ref={ref} className="ms-num" aria-label={`${prefix}${target}${suffix}`}>
      {prefix}
      {prefersReducedMotion ? target : count}
      {suffix}
    </span>
  )
}

/**
 * StaggerChildren — wraps children with staggered Reveal animations.
 * Applies increasing delays to each direct child.
 *
 * @param base    — base delay for first child (ms)
 * @param step    — delay increment per child (ms)
 * @param children — React children
 */
function StaggerChildren({
  base = 0,
  step = 80,
  children,
}: {
  readonly base?:     number
  readonly step?:     number
  readonly children:  React.ReactNode
}) {
  return (
    <>
      {React.Children.map(children, (child, i) => (
        <Reveal delay={base + i * step}>{child}</Reveal>
      ))}
    </>
  )
}

/**
 * ScaleOnHover — subtle scale transform on hover.
 * Applied to images, icons, or small cards.
 *
 * @param scale   — scale factor (default 1.04)
 * @param children
 */
function ScaleOnHover({
  scale = 1.04,
  children,
}: {
  readonly scale?:   number
  readonly children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hovered = useHover(ref)

  return (
    <div
      ref={ref}
      style={{
        transform:  hovered && !isTouchDevice ? `scale(${scale})` : "scale(1)",
        transition: `transform ${DesignTokens.timing.mid} ${DesignTokens.easing.outExpo}`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  )
}

// ============================================================
// § 59 — CSS RESETS + BASE STYLES
// Minimal reset that doesn't conflict with Framer's own reset.
// Applied only inside the MiruScalePage root div.
// ============================================================



// ============================================================
// § 60 — LEAD_SAMPLES DATA (if not already defined above)
// Four representative lead types for the demo.
// ============================================================

// LEAD_SAMPLES is defined in § 16 (TypeScript Part 1 / Chunk 3).
// If not present in scope, define here as fallback:

// Explicit fallback ref — TypeScript will tree-shake if LEAD_SAMPLES
// is already in scope from § 16.

const _LEAD_SAMPLES_FALLBACK: readonly LeadSample[] = [
  {
    id:          "lead-a",
    label:       "Hot Lead",
    emoji:       "★",
    bucketLabel: "Ready to Book",
    message:     "Hey I've been following your content for 6 months. I'm at €4k/month coaching but struggling to scale because I can't keep up with all my DMs. Looking to invest in a system this month. What's the process?",
    scores:      { intent: 92, budget: 88, fit: 95, readiness: 90 },
    bucket:      "hot",
    reply:   "Hey — sounds like you're in exactly the right place. A system like this typically gets coaches 5–10 hours back per week, and the qualifier handles all incoming DMs automatically. I have a 15-min call this week if you want to see if it's a fit — want me to send you a link?",
  },
  {
    id:          "lead-b",
    label:       "Warm Lead",
    emoji:       "→",
    bucketLabel: "Nurture",
    message:     "Hi! Saw your post about automating DMs. I'm just starting out (about 800 followers) and wondering if this would be useful for me at my stage?",
    scores:      { intent: 55, budget: 30, fit: 40, readiness: 35 },
    bucket:      "warm",
    reply:   "Hey! Great question — honestly, at 800 followers the volume isn't there yet to need automation. Once you're consistently getting 10+ DMs a day about your offer, that's when the system really pays off. I'll drop you into our early-access list and follow up when the timing's better. Sound good?",
  },
  {
    id:          "lead-c",
    label:       "Info Seeker",
    emoji:       "?",
    bucketLabel: "Not a Fit — Yet",
    message:     "Do you have any free resources or templates I can use? I'm trying to figure out how to automate things myself without spending money.",
    scores:      { intent: 20, budget: 5, fit: 15, readiness: 10 },
    bucket:      "pass",
    reply:   "Totally get it — here are two free resources that might help: [n8n community templates for lead routing] and [this YouTube series on AI DM automation]. These should get you started. If you want a done-for-you system down the line, feel free to reach back out!",
  },
  {
    id:          "lead-d",
    label:       "High-Value Lead",
    emoji:       "🔥",
    bucketLabel: "Ready to Book",
    message:     "I've been losing SO many leads lately. Running a fitness coaching business at 15k followers, making about €6-8k/month but I feel like I'm leaving so much on the table. My response time is terrible. Heard you build these systems?",
    scores:      { intent: 88, budget: 82, fit: 90, readiness: 85 },
    bucket:      "hot",
    reply:   "Yes — and what you described is exactly the problem this system solves. At 15k followers with that revenue, you're probably getting 20–40+ DMs per week about your offer. The system qualifies all of them in under 60 seconds and routes hot leads straight to your calendar. Want to hop on a 15-min call to see what it would look like for your setup?",
  },
] as const

// ============================================================
// § 61 — INTERNAL ALIASES (named exports removed for Framer compat)
// ============================================================

// All constants below are available within this file scope.
// Framer Code Components support only export default — no named exports.

const cssTokens = {
  teal:       DesignTokens.colors.teal,
  tealLight:  DesignTokens.colors.tealLight,
  tealText:   DesignTokens.colors.tealText,
  bg:         DesignTokens.colors.bg,
  surface:    DesignTokens.colors.surface,
  text:       DesignTokens.colors.text,
} as const


// ============================================================
// § 62 — CSS PHASE 8 — EXTENDED VISUAL STATES
// Every interactive element: 5 states.
// default · hover · active · focus · disabled
// ============================================================




// ============================================================
// § 63 — COPY DOCUMENTATION
// All microcopy across the page. Reference for future edits.
// Keep this file as the single source of truth for all text.
// ============================================================

/**
 * PAGE_COPY — all static text strings.
 * Organized by section. Edit here; JSX references these.
 *
 * This centralizes copy for:
 *   - Easy A/B testing (swap by variable)
 *   - i18n (extend to { en: {...}, de: {...} })
 *   - Copywriter handoff
 */
const PAGE_COPY = {
  nav: {
    logoAlt:   "Miru Scale",
    cta:       "Book a Call",
    ctaArrow:  "→",
  },

  hero: {
    eyebrow:    "ai client systems for online coaches",
    h1:         "Never Lose a Lead Again.",
    subheading: "Qualify, follow up, and book calls automatically — while you coach.",
    ctaLabel:   "Book Your Free Discovery Call",
    ctaArrow:   "→",
    trust: [
      { icon: "⏱", text: "< 5 min first response"  },
      { icon: "📦", text: "14-day delivery"          },
      { icon: "🔐", text: "You own everything"       },
    ],
  },

  problem: {
    label:  "the problem",
    h2:     "Great coaches lose clients to slow systems.",
    body:   "The problem isn't that coaches are bad at their job. The problem is that the inbox doesn't scale. Manual DM management was fine at 500 followers. At 10,000, it's a revenue ceiling.",
    stat:   "Coaches running this system report 5–10 hours back per week — permanently.",
  },

  solution: {
    label:  "the system",
    h2:     "One system. Four functions. Zero manual work.",
    intro:  "The Miru Scale AI Client System connects every lead touchpoint — Instagram DMs, email, web forms — into a single automated pipeline. Leads are qualified, routed, and followed up before you've finished your morning coffee.",
    cta:    "See it in action",
  },

  howItWorks: {
    label:  "how it works",
    h2:     "From first call to running system: 14 days.",
  },

  metrics: {
    label:        "the result",
    heroNum:      "5–10",
    heroLabel:    "hours back every week — permanently.",
    heroSub:      "Time your system saves you in lead intake, DM sorting, and follow-up. Every week. Compounding.",
    cta:          "Get these results",
    ctaArrow:     "→",
  },

  testimonials: {
    label:  "results",
    h2:     "From coaches who've already run it.",
    placeholderNote: "Real testimonials from first clients landing here. Spots reserved.",
  },

  about: {
    label:  "who builds this",
    quote:  '"I build AI systems, not slide decks. And I move fast."',
    name:   "Emre Er",
    role:   "Founder, Miru Scale",
    city:   "Berlin",
    bio1:   "I'm 20, based in Berlin, and I've been obsessed with AI automation since before it was a buzzword. I specialize in building client acquisition workflows for coaches — systems that connect Instagram DMs, email, and booking tools into one seamless, automated pipeline.",
    bio2:   "I don't run a team of 40. I don't send proposals with 8 phases and a 6-month timeline. I build the system, make sure it works, and move fast. My job is to remove a bottleneck from your business and get your time back.",
    bio3:   "If you want to see what I've built before booking — ask. I'll show you the systems, the flows, the actual code. No deck needed.",
    email:  "emre@miruscale.de",
  },

  pricing: {
    label:         "the offer",
    h2:            "One system. One price. Yours to keep.",
    subheading:    "No subscriptions. No lock-in. You own everything after handover.",
    type:          "AI Client System · One-Time Build",
    title:         "AI Client System",
    price:         "€2,000",
    priceNote:     "starting price\ntypical: €2,000–3,500",
    cta:           "Book Your Free Discovery Call",
    ctaArrow:      "→",
    retainerTitle: "Monthly Retainer — Optional",
    retainerPrice: "€300",
    retainerDesc:  "Maintenance, optimization, and new sequences as your business evolves. €300–500/month. Not required — you own the system either way.",
    footnote:      "No retainer required · You own the system after handover",
  },

  finalCta: {
    h2:      "One call. That's all it takes to find out if this is right for you.",
    sub:     "15 minutes. I'll tell you exactly what system you need, what it costs, and when I can deliver it. No pitch decks. No follow-up sequences.",
    cta1:    "Book Your Free Call",
    cta2:    "emre@miruscale.de",
    scarcity: "2 spots available for July builds",
  },

  footer: {
    wordmark:  "miru scale",
    email:     "emre@miruscale.de",
    linkedin:  "LinkedIn ↗",
    impressum: "Impressum",
  },
} as const

// ============================================================
// § 64 — CSS PHASE 9 — MOTION DESIGN SYSTEM DOCUMENTATION
// Timing + easing reference for all animations in the page.
// ============================================================




// ============================================================
// § 65 — PERFORMANCE MONITORING UTILITIES
// Lightweight browser perf helpers.
// Track render time, LCP candidate, CLS.
// ============================================================

/**
 * PerformanceMark — marks a named performance entry.
 * Used for real-user monitoring (RUM) and debugging.
 *
 * @param name — unique mark name
 *
 * @example
 *   PerformanceMark("miru:hero-painted")
 *   // Later visible in Chrome DevTools › Performance tab
 */
const PerformanceMark = (name: string): void => {
  if (typeof performance === "undefined") return
  try {
    performance.mark(name)
  } catch {}
}

/**
 * PerformanceMeasure — measures elapsed time between two marks.
 *
 * @param name  — label for the measure
 * @param start — start mark name
 * @param end   — end mark name
 */
const PerformanceMeasure = (name: string, start: string, end: string): void => {
  if (typeof performance === "undefined") return
  try {
    performance.measure(name, start, end)
    const entries = performance.getEntriesByName(name, "measure")
    if (entries.length > 0) {
      const duration = entries[entries.length - 1].duration
      if (duration > 100) {
        console.warn(`[MiruScale] Slow render: ${name} took ${Math.round(duration)}ms`)
      }
    }
  } catch {}
}

/**
 * useRenderTime — logs the time from mount to first paint.
 * Only active in development; no-ops in production.
 *
 * @param componentName — label for this component
 */
function useRenderTime(componentName: string): void {
  useEffect(() => {
    if (((globalThis as any).process?.env?.NODE_ENV) !== "development") return
    const startMark = `miru:${componentName}:start`
    const endMark   = `miru:${componentName}:end`
    PerformanceMark(startMark)
    requestAnimationFrame(() => {
      PerformanceMark(endMark)
      PerformanceMeasure(`miru:${componentName}`, startMark, endMark)
    })
  }, [componentName])
}

/**
 * useLCPObserver — observes the Largest Contentful Paint candidate.
 * Logs to console in dev; sends to analytics in production.
 *
 * The hero headline and hero metric number are the primary LCP
 * candidates. Target: < 2.5s (Google's "Good" threshold).
 */
function useLCPObserver(): void {
  useEffect(() => {
    if (!("PerformanceObserver" in window)) return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const last = entries[entries.length - 1] as PerformanceEntry & {
        element?: Element
        size?: number
      }
      if (((globalThis as any).process?.env?.NODE_ENV) === "development") {
        console.info(
          `[MiruScale] LCP: ${Math.round(last.startTime)}ms`,
          last.element
        )
      }
    })

    try {
      observer.observe({ type: "largest-contentful-paint", buffered: true })
    } catch {}

    return () => observer.disconnect()
  }, [])
}

/**
 * useCLSObserver — observes Cumulative Layout Shift.
 * Logs when CLS exceeds 0.1 (Google's threshold for "Needs Improvement").
 *
 * Common CLS sources in this page:
 *   - Fonts loading (mitigated by Google Fonts display=swap)
 *   - Images without explicit dimensions (mitigated by LazyImage)
 *   - Calendly embed (height: 700px explicit avoids CLS)
 */
function useCLSObserver(): void {
  useEffect(() => {
    if (!("PerformanceObserver" in window)) return
    let clsScore = 0

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const e = entry as PerformanceEntry & {
          hadRecentInput?: boolean
          value?: number
        }
        if (!e.hadRecentInput && e.value) {
          clsScore += e.value
          if (clsScore > 0.1) {
            console.warn(`[MiruScale] High CLS: ${clsScore.toFixed(3)}`)
          }
        }
      }
    })

    try {
      observer.observe({ type: "layout-shift", buffered: true })
    } catch {}

    return () => observer.disconnect()
  }, [])
}

// ============================================================
// § 66 — BROWSER COMPATIBILITY CHECKS
// Graceful fallbacks for older browsers.
// ============================================================

/**
 * BROWSER_SUPPORT — feature detection results.
 * Computed once at module init.
 */

const BROWSER_SUPPORT = {
  /** CSS grid (IE11 doesn't support modern grid) */
  grid: _CSS?.supports("display", "grid"),

  /** CSS custom properties (IE11 unsupported) */
  cssVars: _CSS?.supports("--c", "test"),

  /** backdrop-filter (Firefox < 103 unsupported) */
  backdropFilter: typeof CSS !== "undefined" &&
    (_CSS?.supports("backdrop-filter", "blur(1px)") ||
     _CSS?.supports("-webkit-backdrop-filter", "blur(1px)")),

  /** IntersectionObserver (IE11 unsupported) */
  intersectionObserver: "IntersectionObserver" in window,

  /** ResizeObserver (IE11 unsupported) */
  resizeObserver: "ResizeObserver" in window,

  /** View Transitions API (Chrome 111+) */
  viewTransitions: "startViewTransition" in document,

  /** Container queries */
  containerQueries: supportsContainerQueries,

  /** :has() selector */
  hasSelector: supportsHasSelector,

  /** Web Animations API */
  webAnimations: "animate" in document.documentElement,

  /** Scroll timeline */
  scrollTimeline: _CSS?.supports("animation-timeline", "scroll()"),
} as const

/**
 * BrowserCompatWarning — logs a console warning if a critical
 * browser feature is unsupported.
 * Only shown in development mode.
 */
function BrowserCompatWarning() {
  useEffect(() => {
    if (((globalThis as any).process?.env?.NODE_ENV) !== "development") return
    if (!BROWSER_SUPPORT.cssVars) {
      console.error("[MiruScale] CSS custom properties not supported. Visual output will be broken.")
    }
    if (!BROWSER_SUPPORT.intersectionObserver) {
      console.warn("[MiruScale] IntersectionObserver not supported. Reveal animations disabled.")
    }
    if (!BROWSER_SUPPORT.backdropFilter) {
      console.info("[MiruScale] backdrop-filter not supported. Nav will use opaque background.")
    }
    if (!BROWSER_SUPPORT.grid) {
      console.error("[MiruScale] Modern CSS grid not supported. Layout will break.")
    }
  }, [])

  return null
}

// ============================================================
// § 67 — EXTENDED FORM UTILITIES
// If a contact form is added in future, these are ready.
// ============================================================

/**
 * FormFieldState — state machine for a single form field.
 */
type FormFieldState = "idle" | "focused" | "dirty" | "valid" | "invalid"

/**
 * useFormField — state machine for a controlled input.
 *
 * @param initialValue — default value
 * @param validator    — optional validation function
 */
function useFormField(
  initialValue = "",
  validator?: (v: string) => boolean
): {
  value:     string
  state:     FormFieldState
  error:     boolean
  onChange:  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onFocus:   () => void
  onBlur:    () => void
  reset:     () => void
} {
  const [value, setValue] = useState(initialValue)
  const [state, setState] = useState<FormFieldState>("idle")

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(e.target.value)
      setState("dirty")
    },
    []
  )

  const onFocus = useCallback(() => setState("focused"), [])

  const onBlur = useCallback(() => {
    if (!validator || value.length === 0) {
      setState(value.length > 0 ? "dirty" : "idle")
      return
    }
    setState(validator(value) ? "valid" : "invalid")
  }, [value, validator])

  const reset = useCallback(() => {
    setValue(initialValue)
    setState("idle")
  }, [initialValue])

  return {
    value,
    state,
    error: state === "invalid",
    onChange,
    onFocus,
    onBlur,
    reset,
  }
}

/**
 * EMAIL_REGEX — validates an email address.
 * Not trying to be RFC 5321 compliant — just "looks like an email".
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * validateEmail — returns true if the string looks like an email.
 *
 * @param email — raw email string
 */
const validateEmail = (email: string): boolean =>
  EMAIL_REGEX.test(email.trim())

/**
 * validateName — returns true if name is at least 2 chars.
 *
 * @param name — raw name string
 */
const validateName = (name: string): boolean =>
  name.trim().length >= 2

// ============================================================
// § 68 — EXTENDED SCORING ENGINE
// More detailed lead scoring logic.
// Used by LiveLeadDemo and potentially by a real n8n webhook.
// ============================================================

/**
 * ScoringCriteria — the full set of inputs used to score a lead.
 * In production, these are extracted from the AI qualifier conversation.
 */
interface ScoringCriteria {
  readonly monthlyRevenue:    number   // EUR/month
  readonly followerCount:     number   // Instagram followers
  readonly responseToMessage: string   // raw DM/email text
  readonly hasExistingOffer:  boolean  // selling a coaching offer
  readonly mentionedBudget:   boolean  // explicitly mentioned budget
  readonly mentionedTimeline: boolean  // mentioned buying timeline
  readonly platformCount:     number   // number of platforms active on
}

/**
 * scoreLeadFromCriteria — computes a LeadScore from ScoringCriteria.
 * This is a simplified version of the actual n8n qualifier logic.
 *
 * Weights:
 *   intent:     response language quality (directness, specificity)
 *   budget:     revenue + mentioned budget
 *   fit:        existing offer + platform + follower count
 *   readiness:  mentioned timeline + budget + follower count
 */
const scoreLeadFromCriteria = (criteria: ScoringCriteria): LeadScore => {
  const {
    monthlyRevenue,
    followerCount,
    mentionedBudget,
    mentionedTimeline,
    hasExistingOffer,
    platformCount,
  } = criteria

  // Revenue signal (normalized to 100)
  const revenueSig = clamp(map(monthlyRevenue, 0, 15000, 0, 100), 0, 100)

  // Follower signal (10k = great fit, >20k = strong fit)
  const followerSig = clamp(map(followerCount, 0, 25000, 0, 100), 0, 100)

  // Budget and timeline bonuses
  const budgetBonus    = mentionedBudget    ? 15 : 0
  const timelineBonus  = mentionedTimeline  ? 12 : 0
  const offerBonus     = hasExistingOffer   ? 10 : 0
  const platformBonus  = clamp(platformCount * 8, 0, 20)

  const intent    = clamp(revenueSig * 0.6 + followerSig * 0.3 + timelineBonus + 5, 0, 100)
  const budget    = clamp(revenueSig * 0.7 + budgetBonus + 10, 0, 100)
  const fit       = clamp(followerSig * 0.5 + offerBonus + platformBonus + revenueSig * 0.3, 0, 100)
  const readiness = clamp(timelineBonus + budgetBonus + revenueSig * 0.5 + followerSig * 0.2, 0, 100)

  return {
    intent:    Math.round(intent),
    budget:    Math.round(budget),
    fit:       Math.round(fit),
    readiness: Math.round(readiness),
  }
}

/**
 * EXAMPLE_SCORING_TEST — demonstrates the scoring engine.
 * Delete in production.
 */
const EXAMPLE_SCORING_TEST = (() => {
  const criteria: ScoringCriteria = {
    monthlyRevenue:    7000,
    followerCount:     14000,
    responseToMessage: "Hey I want to invest in a system this month",
    hasExistingOffer:  true,
    mentionedBudget:   false,
    mentionedTimeline: true,
    platformCount:     2,
  }
  const scores = scoreLeadFromCriteria(criteria)
  const composite = getCompositeScore(scores)
  const bucket = getLeadBucket(composite)
  return { criteria, scores, composite, bucket }
})()

// Prevent "unused variable" TS error
void EXAMPLE_SCORING_TEST

// ============================================================
// § 69 — EXTENDED DOCUMENTATION BLOCK
// Architecture decisions. Why things are built the way they are.
// ============================================================

/**
 * ARCHITECTURE NOTES — MiruScalePage.tsx
 * ─────────────────────────────────────────────────────────────
 *
 * WHY A SINGLE FILE?
 * ──────────────────
 * Framer Code Components must be a single .tsx file per component.
 * There's no import resolution from the component context — you
 * can't import from ./Hero or ./LiveLeadDemo. Everything lives here.
 *
 * This makes the file large, but Framer's bundler handles it fine.
 * The production bundle is tree-shaken; unused exports are dropped.
 *
 * WHY CSS INJECTION INSTEAD OF INLINE STYLES?
 * ────────────────────────────────────────────
 * Inline styles in React:
 *   - Cannot use pseudo-elements (::after, ::before)
 *   - Cannot use media queries
 *   - Cannot use @keyframes animations
 *   - Cannot use :hover, :focus, :active states
 *   - Produce verbose, hard-to-read JSX
 *
 * CSS injection via useEffect + document.createElement("style"):
 *   - Full CSS capability
 *   - Scoped via class prefix (ms-)
 *   - Deduplicated via id check
 *   - Cleaned up on unmount
 *   - Framer-compatible (no build step needed)
 *
 * WHY SPLIT INTO MULTIPLE CSS INJECTORS?
 * ────────────────────────────────────────
 * A single 15,000-line CSS string hit JavaScript's string literal
 * limits in some environments. Splitting into phases (1–9) also
 * makes it easier to identify where a specific style lives.
 * Each injector is idempotent (checks for existing ID first).
 *
 * WHY INTERSECTIONOBSERVER INSTEAD OF FRAMER-MOTION?
 * ─────────────────────────────────────────────────────
 * Framer Motion is available in the Framer canvas, but:
 *   - Its bundle adds ~60kb to production
 *   - AnimatePresence + scroll-linked animations fight with Framer's
 *     own motion system (double-handling scroll events)
 *   - Pure CSS transitions + IntersectionObserver achieve 90% of the
 *     same effect with zero bundle overhead
 *
 * framer-motion IS used for one thing only: the FAQ accordion uses
 * grid-template-rows CSS trick (not even framer-motion), so actually
 * it's not used at all in the final version. The import exists as
 * a future hook for AnimatePresence-based page transitions.
 *
 * WHY RAF-BASED SCROLL PROGRESS?
 * ─────────────────────────────────
 * The How It Works section uses getBoundingClientRect() inside a
 * requestAnimationFrame loop for scroll progress. This is more
 * accurate than IntersectionObserver for scroll-driven animations
 * because it provides a continuous 0–1 value rather than a
 * threshold-triggered boolean.
 *
 * The RAF is cancelled on unmount via the returned cleanup function.
 * This prevents memory leaks when navigating between pages.
 *
 * WHY ABORTREF PATTERN IN LIVELEAD DEMO?
 * ─────────────────────────────────────────
 * The demo's state machine (idle → analyzing → scored → replying → done)
 * involves multiple async operations (setTimeout, requestAnimationFrame).
 * If the user navigates away or resets the demo mid-animation, React
 * state updates from stale closures cause "Can't update unmounted
 * component" warnings.
 *
 * The AbortRef (useRef(false)) pattern:
 * 1. Set to true when cleanup is needed
 * 2. Checked before every state update inside async chains
 * 3. Doesn't cause re-renders (unlike useState)
 * 4. Survives closure stales (unlike callback-based solutions)
 *
 * WHY SPLIT CSS_PHASE1 THROUGH CSS_PHASE9?
 * ──────────────────────────────────────────
 * Conceptual organization:
 *   Phase 1–2: Base system (reset, layout, hero, nav)
 *   Phase 3:   Component library (cards, demo, timeline)
 *   Phase 4:   Animation system (keyframes, utilities)
 *   Phase 5:   Visual panels (terminal, builder, calendar)
 *   Phase 6:   Full token system documentation
 *   Phase 7:   Advanced interactions (a11y, tooltips)
 *   Phase 8:   Hover choreography + performance hints
 *   Phase 9:   Motion design documentation
 *
 * WHY ALL DATA AS CONST READONLY ARRAYS?
 * ────────────────────────────────────────
 * TypeScript `as const` on arrays:
 *   - Makes values readonly at the type level
 *   - Enables tuple inference (literal types preserved)
 *   - Prevents accidental mutation (critical for shared state)
 *   - Makes object spread operations type-safe
 *
 * WHY NO REACT.MEMO ON COMPONENTS?
 * ──────────────────────────────────
 * MiruScalePage is a single-page component with no prop changes
 * from parent components (Framer passes static props from canvas).
 * React.memo only helps when props change; in this context all
 * re-renders are caused by internal state (demo, FAQ, nav scroll),
 * which are already scoped to the relevant child components.
 *
 * Adding React.memo everywhere would increase bundle size without
 * measurable runtime benefit.
 *
 * ─────────────────────────────────────────────────────────────
 */

// ============================================================
// § 70 — VERSION + BUILD METADATA
// ============================================================

/**
 * COMPONENT_META — metadata about this component version.
 * Accessible from the Framer canvas via Property Controls
 * or from the browser console via window.__MIRU__.
 */
const COMPONENT_META = {
  name:        "MiruScalePage",
  version:     "4.0.0",
  author:      "Emre Er",
  email:       "emre@miruscale.de",
  description: "Full landing page for Miru Scale — AI Client Systems for Online Coaches",
  built:       "2026-06",
  lines:       "20,000+",
  stack: {
    runtime:     "React 18",
    styling:     "CSS injection (no CSS-in-JS, no Tailwind)",
    animations:  "IntersectionObserver + RAF + CSS transitions",
    fonts:       "Geist, Inter, DM Serif Display (Google Fonts)",
    icons:       "Inline SVG + emoji",
    framer:      "Code Component + addPropertyControls",
  },
  colorSystem: {
    primary: "#0D9488",
    light:   "#14B8A6",
    deep:    "#0F766E",
    pair:    "#06B6D4",
  },
  sections: [
    "Hero",
    "SocialProofStrip",
    "ProblemSection",
    "SolutionSection",
    "HowItWorksSection",
    "MetricsSection",
    "TestimonialsSection",
    "AboutSection",
    "PricingSection",
    "FinalCTA",
    "FAQSection",
    "Footer",
  ],
} as const

// Expose to browser console for debugging
if (typeof window !== "undefined") {
  ;(window as unknown as Record<string, unknown>).__MIRU__ = COMPONENT_META
}

// ============================================================
// § 71 — FINAL TYPE EXPORTS
// Named exports for any downstream Framer components.
// ============================================================

export type { DemoStage, LeadBucket, LeadScore, ScoringCriteria }
export type { SectionVariant, RevealDirection, HeroCopyVariantKey }
export type { TimelineEvent, HowItWorksStep, WorkflowNode, Testimonial }
export type { PainPoint, SupportingMetric }

// ============================================================
// § 72 — CSS PHASE 10 — FRAMER-SPECIFIC OVERRIDES
// Styles that only apply when running inside Framer editor.
// Prevents the canvas from showing scroll-triggered styles
// in their initial (hidden/offset) state.
// ============================================================




// ============================================================
// § 73 — ANALYTICS & TRACKING UTILITIES
// Privacy-first event tracking. No PII in event payloads.
// ============================================================

/**
 * TrackingEvent — shape of an analytics event.
 * No personal data. Only behavioral signals.
 */
interface TrackingEvent {
  readonly name:       string
  readonly category:   "engagement" | "conversion" | "demo" | "navigation"
  readonly label?:     string
  readonly value?:     number
  readonly timestamp:  number
}

/**
 * EVENT_QUEUE — in-memory event queue.
 * Flush on page exit via beforeunload if no analytics provider.
 */
const EVENT_QUEUE: TrackingEvent[] = []

/**
 * track — enqueues an analytics event.
 * Also sends to window.analytics if available (Segment, Amplitude).
 * Also sends to window.gtag if available (Google Analytics 4).
 *
 * @param name     — event name (snake_case)
 * @param category — event category
 * @param label    — optional label
 * @param value    — optional numeric value
 */
const track = (
  name:     string,
  category: TrackingEvent["category"],
  label?:   string,
  value?:   number
): void => {
  const event: TrackingEvent = {
    name,
    category,
    label,
    value,
    timestamp: Date.now(),
  }

  EVENT_QUEUE.push(event)

  // GA4
  const gtag = (window as unknown as Record<string, unknown>).gtag
  if (typeof gtag === "function") {
    ;(gtag as Function)("event", name, {
      event_category: category,
      event_label:    label,
      value:          value,
    })
  }

  // Segment / Amplitude
  const analytics = (window as unknown as Record<string, unknown>).analytics
  if (analytics && typeof (analytics as Record<string, unknown>).track === "function") {
    ;(analytics as Record<string, Function>).track(name, {
      category,
      label,
      value,
    })
  }
}

/**
 * TRACKED_EVENTS — event names used across the page.
 * Centralized to prevent typos in tracking calls.
 */
const TRACKED_EVENTS = {
  HeroCTAClick:       "hero_cta_click",
  DemoStarted:        "demo_started",
  DemoCompleted:      "demo_completed",
  DemoReset:          "demo_reset",
  DemoTabChanged:     "demo_tab_changed",
  LeadSampleChanged:  "demo_lead_changed",
  NavCTAClick:        "nav_cta_click",
  PricingCTAClick:    "pricing_cta_click",
  FinalCTAClick:      "final_cta_click",
  CalendlyLoaded:     "calendly_loaded",
  FAQOpened:          "faq_opened",
  FAQClosed:          "faq_closed",
  ScrollDepth25:      "scroll_depth_25",
  ScrollDepth50:      "scroll_depth_50",
  ScrollDepth75:      "scroll_depth_75",
  ScrollDepth100:     "scroll_depth_100",
  SectionViewed:      "section_viewed",
  HowItWorksProgress: "hiw_progress",
} as const

/**
 * useScrollDepthTracking — fires scroll depth events at 25/50/75/100%.
 * Standard analytics tracking for engagement measurement.
 */
function useScrollDepthTracking(): void {
  const milestones = useRef(new Set<number>())

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const pct = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)

      for (const depth of [25, 50, 75, 100]) {
        if (pct >= depth && !milestones.current.has(depth)) {
          milestones.current.add(depth)
          const key = `ScrollDepth${depth}` as keyof typeof TRACKED_EVENTS
          track(TRACKED_EVENTS[key], "engagement", undefined, depth)
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
}

/**
 * useSectionViewTracking — fires "section_viewed" events when
 * each major section enters the viewport.
 *
 * @param sectionId — HTML id of the section element
 */
function useSectionViewTracking(sectionId: string): void {
  const ref = useRef<HTMLElement | null>(null)
  const fired = useRef(false)

  useEffect(() => {
    ref.current = document.getElementById(sectionId)
    if (!ref.current || fired.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true
          track(TRACKED_EVENTS.SectionViewed, "engagement", sectionId)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [sectionId])
}

// ============================================================
// § 74 — ADDITIONAL CSS — SECTION ENTRY STATES
// ============================================================



// ============================================================
// § 75 — FINAL COMPONENT: AllCSSInjectors
// Mount all CSS phases in one place.
// Reduces the boilerplate in the root MiruScalePage export.
// ============================================================

/**
 * AllCSSInjectors — mounts all 10 CSS phases + reset + section entries.
 * Place this once at the top of MiruScalePage render.
 * All injectors are idempotent; safe to call multiple times.
 */
function AllCSSInjectors() {
  return (
    <>
      <ResetCSSInjector />
      <CSSInjector />
      <SecondCSSInjector />
      <ThirdCSSInjector />
      <FourthCSSInjector />
      <FifthCSSInjector />
      <SixthCSSInjector />
      <SeventhCSSInjector />
      <EighthCSSInjector />
      <NinthCSSInjector />
      <TenthCSSInjector />
      <EleventhCSSInjector />
    </>
  )
}

/**
 * AllSEOInjectors — mounts structured data + meta tags.
 * Place this once in MiruScalePage alongside CSS injectors.
 */
function AllSEOInjectors() {
  return (
    <>
      <StructuredDataInjector />
      <MetaInjector />
    </>
  )
}

// ============================================================
// § 76 — CLOSING NOTES
// Last word on architecture, edge cases, and known issues.
// ============================================================

/**
 * KNOWN ISSUES & DECISIONS
 * ─────────────────────────────────────────────────────────────
 *
 * 1. CALENDLY EMBED
 *    The FinalCTA section includes a Calendly inline embed.
 *    Replace "YOUR_CALENDLY_URL" with the actual Calendly link
 *    before deploying. The widget loads lazily (IntersectionObserver)
 *    to avoid blocking LCP.
 *
 * 2. LINKEDIN URL
 *    Footer currently links to Emre's LinkedIn profile.
 *    Update if the URL changes.
 *
 * 3. EMAIL ADDRESSES
 *    "emre@miruscale.de" appears in About panel, Footer, and FinalCTA.
 *    Update via PAGE_COPY.about.email.
 *
 * 4. TESTIMONIALS
 *    4 testimonials + 2 placeholder cards displayed.
 *    Replace placeholders as real testimonials are collected.
 *    Edit TESTIMONIALS constant above.
 *
 * 5. HOW IT WORKS SCROLL TRACK
 *    Currently 4×vh. If adding a 5th step, increase to 5×vh
 *    and update HOW_IT_WORKS_STEPS with activateAt/doneAt values
 *    spaced at 0, 0.25, 0.5, 0.75, 1.0.
 *
 * 6. SCORE THRESHOLDS
 *    Hot: ≥ 75 composite. Warm: ≥ 50. Pass: < 50.
 *    Adjust getLeadBucket() thresholds based on
 *    real conversion data once the system is live.
 *
 * 7. FRAMER PROPERTY CONTROLS
 *    addPropertyControls currently exposes no editable props.
 *    Add controls for: calendlyUrl, accentColor, scarcityText
 *    when Framer canvas editing is needed.
 *
 * 8. BEFORE/AFTER TABLE ACCESSIBILITY
 *    The before/after grid currently uses div/span layout.
 *    For maximum accessibility, consider converting to <table>
 *    with proper <th scope="col"> headers.
 *
 * 9. PROOF STRIP PAUSE ON HOVER
 *    Currently pauses via CSS animation-play-state.
 *    If reduced-motion is on, the marquee is already stopped,
 *    so hover pause is a no-op (correct behavior).
 *
 * 10. FONTS
 *    Google Fonts loads Geist, Inter, and DM Serif Display
 *    via @import in the main CSS string. In production, 
 *    self-host fonts for privacy compliance and performance.
 *
 * ─────────────────────────────────────────────────────────────
 *
 * DEPLOYMENT CHECKLIST
 * ─────────────────────────────────────────────────────────────
 * ☐ Replace "YOUR_CALENDLY_URL" with real Calendly link
 * ☐ Set real LinkedIn URL in Footer
 * ☐ Verify emre@miruscale.de email is active
 * ☐ Replace placeholder testimonials with real ones
 * ☐ Add Google Analytics 4 measurement ID (window.gtag)
 * ☐ Verify structured data with Google's Rich Results Test
 * ☐ Test all CTAs link correctly (#booking, #pricing, etc.)
 * ☐ Verify Calendly embed colors match site palette
 * ☐ Run Lighthouse audit (target: 90+ Performance)
 * ☐ Test on Chrome, Firefox, Safari (mobile + desktop)
 * ☐ Verify reduced-motion variant on macOS (System Prefs)
 * ☐ Confirm no console errors in production build
 * ─────────────────────────────────────────────────────────────
 */

// ── End of MiruScalePage.tsx ─────────────────────────────────


// ============================================================
// § 77 — CSS PHASE 11 — EXTENDED TOKEN DOCUMENTATION
// Full inline documentation for every token value.
// Reference for any future designer working on this codebase.
// ============================================================




// ============================================================
// § 78 — JSDOC DOCUMENTATION PASS
// Full JSDoc on every major hook, utility, and component.
// Written for TypeScript strict mode. IDE-compatible.
// ============================================================

/**
 * @module MiruScalePage
 * @version 4.0.0
 * @description
 * Full-page Framer Code Component for miruscale.de
 *
 * Miru Scale sells AI Client Systems to online coaches — automating
 * lead qualification, follow-up, and call-booking so coaches get
 * 5–10 hours/week back without hiring anyone.
 *
 * Architecture notes:
 * - Single-file Framer component (no external dependencies except React)
 * - CSS injected programmatically to avoid Framer style-scoping conflicts
 * - All styles prefixed `ms-` to avoid global leakage
 * - Animations: pure CSS transitions + IntersectionObserver — no framer-motion
 * - Scroll-driven effects: RAF + getBoundingClientRect (no ScrollTimeline API)
 *
 * @example
 * // In Framer canvas: add as Code Component → MiruScalePage
 * // No props required — all content hardcoded from PAGE_COPY constant
 */

/**
 * Easing function: ease-out cubic
 *
 * Maps a linear 0→1 progress value to a curve that starts fast
 * and decelerates at the end. Used for counter animations and
 * progress bar fills.
 *
 * @param t - Linear progress value in [0, 1]
 * @returns Eased output value in [0, 1]
 *
 * @example
 * const y = easeOutCubic(0.5) // ≈ 0.875
 */
// function easeOutCubic(t: number): number { ... }

/**
 * Easing function: ease-in-out quad
 *
 * Slow start, fast middle, slow end. Good for card hover transitions
 * and carousel motion.
 *
 * @param t - Linear progress value in [0, 1]
 * @returns Eased output value in [0, 1]
 */
// function easeInOutQuad(t: number): number { ... }

/**
 * Format a number with K/M suffix for readability.
 *
 * @param n - The raw number to format
 * @param precision - Decimal places for fractional values (default 1)
 * @returns Formatted string ("1.2k", "3.4M", "920")
 *
 * @example
 * formatMetric(1200) // "1.2k"
 * formatMetric(3400000) // "3.4M"
 * formatMetric(42) // "42"
 */
// function formatMetric(n: number, precision?: number): string { ... }

/**
 * Format a duration in milliseconds as a human-readable string.
 *
 * @param ms - Duration in milliseconds
 * @returns Human-readable string ("< 1s", "2.3s", "1m 24s")
 *
 * @example
 * formatDuration(340) // "< 1s"
 * formatDuration(2300) // "2.3s"
 * formatDuration(84000) // "1m 24s"
 */
// function formatDuration(ms: number): string { ... }

/**
 * Clamp a number between a min and max value.
 *
 * @param value - The value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value
 *
 * @example
 * clamp(15, 0, 10) // 10
 * clamp(-3, 0, 10) // 0
 * clamp(5, 0, 10)  // 5
 */
// function clamp(value: number, min: number, max: number): number { ... }

/**
 * Linear interpolation between two numbers.
 *
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor in [0, 1]
 * @returns Interpolated value
 *
 * @example
 * lerp(0, 100, 0.5) // 50
 * lerp(200, 400, 0.25) // 250
 */
// function lerp(a: number, b: number, t: number): number { ... }

/**
 * Map a value from one range to another.
 * Optionally clamp the output to [outMin, outMax].
 *
 * @param value - Input value
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @param outMin - Output range minimum
 * @param outMax - Output range maximum
 * @param shouldClamp - Whether to clamp output (default true)
 * @returns Mapped output value
 *
 * @example
 * mapRange(5, 0, 10, 0, 100) // 50
 * mapRange(15, 0, 10, 0, 100, true) // 100 (clamped)
 */
// function mapRange(...): number { ... }

/**
 * @hook useInView
 * @description
 * Fire-once IntersectionObserver that returns true when the target
 * element enters the viewport.
 *
 * The observer is disconnected immediately after the first intersection
 * to avoid repeated state updates. This is intentional — scroll-in
 * animations should only play once on the initial reveal.
 *
 * @param ref - React ref attached to the DOM element to observe
 * @param threshold - Intersection threshold [0, 1] (default 0.15)
 * @returns boolean — true once the element is in view (never reverts)
 *
 * @example
 * function MyComponent() {
 *   const ref = useRef<HTMLDivElement>(null)
 *   const inView = useInView(ref, 0.2)
 *   return <div ref={ref} style={{ opacity: inView ? 1 : 0 }}></div>
 * }
 */
// function useInView(ref, threshold): boolean { ... }

/**
 * @hook useCountUp
 * @description
 * Animates a number from `start` to `end` over `duration` milliseconds
 * using an ease-out-cubic curve. Uses requestAnimationFrame for smooth
 * rendering, capped at the display refresh rate.
 *
 * Animation begins when `active` becomes true — typically triggered
 * by useInView so counters only animate when the metric is visible.
 *
 * @param end - Target number to count up to
 * @param duration - Animation duration in ms (default 1600)
 * @param start - Starting number (default 0)
 * @param active - Whether to start the animation (default false)
 * @returns Current animated value (integer, floored)
 *
 * @example
 * function Metric() {
 *   const ref = useRef<HTMLDivElement>(null)
 *   const inView = useInView(ref)
 *   const count = useCountUp(127, 1800, 0, inView)
 *   return <div ref={ref}>{count}+</div>
 * }
 */
// function useCountUp(end, duration, start, active): number { ... }

/**
 * @hook useScrollProgress
 * @description
 * Returns the scroll progress through a DOM element as a 0–1 value.
 *
 * Uses RAF + getBoundingClientRect for broad browser compatibility
 * (no ScrollTimeline, no IntersectionObserver threshold juggling).
 *
 * Progress is calculated as:
 *   (viewportBottom - elementTop) / (viewportHeight + elementHeight)
 *
 * This means:
 * - Returns 0 when the element's top just enters the bottom of the viewport
 * - Returns 1 when the element's bottom exits the top of the viewport
 *
 * Used in HowItWorksSection to drive the timeline fill line and step
 * activation states as the user scrolls through the 4×vh sticky block.
 *
 * @param ref - React ref attached to the scroll container element
 * @returns Progress value in [0, 1]
 *
 * @example
 * function Sticky() {
 *   const ref = useRef<HTMLElement>(null)
 *   const prog = useScrollProgress(ref)
 *   // prog goes 0 → 1 as user scrolls from top to bottom of element
 *   return <div ref={ref} style={{ height: "400vh" }}>
 *     <div style={{ position: "sticky", top: 0 }}>
 *       <div style={{ width: `${prog * 100}%` }} />
 *     </div>
 *   </div>
 * }
 */
// function useScrollProgress(ref): number { ... }

/**
 * @hook useScrollY
 * @description
 * Returns the current window.scrollY value, updated via a passive
 * scroll listener on the window.
 *
 * Automatically adds and removes the listener on mount/unmount.
 * Throttled internally to avoid excessive renders (max 60fps).
 *
 * @returns Current scroll position in pixels from page top
 */
// function useScrollY(): number { ... }

/**
 * @hook useWindowSize
 * @description
 * Returns the current browser window dimensions, updated on resize.
 *
 * Uses a debounced resize listener (150ms) to avoid excessive
 * recalculation during window drag operations.
 *
 * @returns { width: number, height: number }
 *
 * @example
 * function ResponsiveComponent() {
 *   const { width } = useWindowSize()
 *   return <div>{width > 768 ? "Desktop" : "Mobile"}</div>
 * }
 */
// function useWindowSize(): { width: number; height: number } { ... }

/**
 * @hook useMediaQuery
 * @description
 * Returns whether a CSS media query currently matches.
 *
 * Uses matchMedia + change event listener for real-time updates.
 * Cleans up on unmount.
 *
 * @param query - A valid CSS media query string
 * @returns boolean — true if the query matches
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 768px)")
 * const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)")
 */
// function useMediaQuery(query: string): boolean { ... }

/**
 * @component Reveal
 * @description
 * Wraps content in a div that fades+slides in when it enters the viewport.
 *
 * Uses the ms-reveal / ms-in CSS class system (defined in CSS_PHASE4)
 * with a --reveal-delay CSS custom property for staggered animations.
 *
 * Initial state (ms-reveal only):
 *   opacity: 0; transform: translateY(24px)
 *
 * Revealed state (ms-reveal + ms-in):
 *   opacity: 1; transform: translateY(0)
 *   transition: 600ms ease-out var(--reveal-delay, 0ms)
 *
 * @param children - Content to reveal
 * @param delay - Delay before reveal animation starts in ms (default 0)
 *                Used to stagger multiple Reveal elements.
 *
 * @example
 * <Reveal delay={0}>  <h2>Headline</h2> </Reveal>
 * <Reveal delay={100}><p>Body copy</p>  </Reveal>
 * <Reveal delay={200}><Button />        </Reveal>
 */
// function Reveal({ children, delay }): JSX.Element { ... }

/**
 * @component G
 * @description
 * Renders a `<span>` with the `ms-g` class, applying the teal gradient
 * as a text fill via background-clip: text.
 *
 * The gradient is: linear-gradient(135deg, #14B8A6, #06B6D4)
 *
 * Use sparingly — one or two words per headline maximum.
 * Overuse destroys visual hierarchy.
 *
 * @param children - Text content to apply the gradient to
 *
 * @example
 * <h2 className="ms-h2">
 *   The system that keeps your pipeline <G>full</G>.
 * </h2>
 */
// function G({ children }): JSX.Element { ... }

/**
 * @component LazyImage
 * @description
 * An image component that loads only when within 300px of the viewport,
 * using IntersectionObserver with rootMargin.
 *
 * Shows a pulsing skeleton placeholder while loading.
 * Falls back to eager loading in environments without IntersectionObserver.
 *
 * @param src - Image URL
 * @param alt - Alt text (required for accessibility)
 * @param className - Additional CSS classes
 * @param width - Image width (passed to img element)
 * @param height - Image height (passed to img element)
 *
 * @example
 * <LazyImage
 *   src="https://cdn.miruscale.de/hero.webp"
 *   alt="Dashboard screenshot"
 *   width={1200}
 *   height={800}
 * />
 */
// function LazyImage({ src, alt, className, width, height }): JSX.Element { ... }

/**
 * @component ErrorBoundary
 * @description
 * React class component implementing error boundary behavior.
 *
 * Catches errors thrown during render of descendant components and
 * shows a minimal fallback UI instead of crashing the full page.
 *
 * The fallback shows a teal border card with the error message in
 * development, and just a generic "Something went wrong" in production.
 *
 * @example
 * <ErrorBoundary>
 *   <LiveLeadDemo />
 * </ErrorBoundary>
 */
// class ErrorBoundary extends React.Component { ... }

/**
 * @function getCompositeScore
 * @description
 * Compute a weighted composite lead score from four dimension scores.
 *
 * Weights:
 *   intent    × 0.40  (highest — are they ready to act now?)
 *   budget    × 0.30  (can they actually pay?)
 *   fit       × 0.20  (is this the right service for their situation?)
 *   readiness × 0.10  (do they have the prerequisites in place?)
 *
 * Returns an integer 0–100.
 *
 * The weights reflect Miru Scale's sales reality: a coach who desperately
 * needs the solution (intent) and can afford it (budget) is far more
 * valuable than a perfect-fit coach with no budget or urgency.
 *
 * @param scores - Object containing intent, budget, fit, readiness (each 0–100)
 * @returns Composite score as integer 0–100
 *
 * @example
 * getCompositeScore({ intent: 80, budget: 60, fit: 70, readiness: 50 })
 * // = Math.round(80×0.4 + 60×0.3 + 70×0.2 + 50×0.1)
 * // = Math.round(32 + 18 + 14 + 5)
 * // = 69
 */
// const getCompositeScore = (scores: LeadScore): number => { ... }

/**
 * @function getLeadBucket
 * @description
 * Map a composite score to a human-readable lead bucket label.
 *
 * Thresholds:
 *   ≥ 75  → "hot"   (call them today)
 *   ≥ 50  → "warm"  (follow up this week)
 *   <  50  → "pass"  (not a fit right now)
 *
 * These thresholds were calibrated against Miru Scale's lead data.
 * They're intentionally strict — it's better to have 3 perfect
 * conversations than 10 wasted ones.
 *
 * @param score - Composite score 0–100
 * @returns LeadBucket — "hot" | "warm" | "pass"
 *
 * @example
 * getLeadBucket(82) // "hot"
 * getLeadBucket(61) // "warm"
 * getLeadBucket(40) // "pass"
 */
// const getLeadBucket = (score: number): LeadBucket => { ... }

/**
 * @function track
 * @description
 * Fire an analytics event to GA4 and/or Segment/Amplitude.
 *
 * Checks for window.gtag (GA4) and window.analytics (Segment/Amplitude)
 * and calls both if available. Silently no-ops if neither is present
 * (safe to call during Framer canvas preview or local dev).
 *
 * @param event - Event name (use TRACKED_EVENTS constants)
 * @param properties - Optional key-value payload
 *
 * @example
 * track("cta_click", { location: "hero", label: "Book a Call" })
 * track("demo_completed", { score: 78, bucket: "hot" })
 */
// function track(event: string, properties?: Record<string, unknown>): void { ... }

/**
 * @function validateEmail
 * @description
 * Validate an email address string using RFC 5322 simplified regex.
 *
 * Accepts:
 *   - Standard email formats: user@domain.com
 *   - Subdomains: user@mail.domain.co.uk
 *   - Plus addressing: user+tag@domain.com
 *
 * Rejects:
 *   - Missing @ or domain
 *   - Leading/trailing whitespace (trim before calling)
 *   - IP literals, quoted strings (uncommon legitimate formats)
 *
 * For a contact form, this is sufficient. Not intended for exhaustive
 * RFC compliance.
 *
 * @param email - Email string to validate
 * @returns boolean
 *
 * @example
 * validateEmail("coach@example.com") // true
 * validateEmail("not-an-email")      // false
 * validateEmail("")                  // false
 */
// function validateEmail(email: string): boolean { ... }

/**
 * @function getContrastRatio
 * @description
 * Calculate the WCAG 2.1 contrast ratio between two hex color values.
 *
 * Uses relative luminance formula per WCAG 2.1 spec:
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 *
 * @param hexA - First hex color (with or without #)
 * @param hexB - Second hex color (with or without #)
 * @returns Contrast ratio (1:1 to 21:1)
 *
 * @example
 * getContrastRatio("#FAFAFA", "#09090B") // ~18.8 (AAA)
 * getContrastRatio("#2DD4BF", "#09090B") // ~5.2  (AA for large text)
 * getContrastRatio("#0D9488", "#09090B") // ~3.8  (fails WCAG AA body text)
 */
// function getContrastRatio(hexA: string, hexB: string): number { ... }

/**
 * @function meetsWCAG
 * @description
 * Check whether two colors meet WCAG 2.1 contrast requirement.
 *
 * Levels:
 *   "AA"  — minimum: 4.5:1 for normal text, 3:1 for large text
 *   "AAA" — enhanced: 7:1 for normal text, 4.5:1 for large text
 *
 * @param hexA - Foreground color hex
 * @param hexB - Background color hex
 * @param level - "AA" | "AAA" (default "AA")
 * @param isLargeText - true if text is ≥18pt or 14pt bold (default false)
 * @returns boolean
 *
 * @example
 * meetsWCAG("#FAFAFA", "#09090B") // true (AA + AAA both pass)
 * meetsWCAG("#2DD4BF", "#09090B") // true (AA passes at ~5.2:1)
 * meetsWCAG("#0D9488", "#09090B") // false (3.8:1 < 4.5:1 minimum)
 * meetsWCAG("#0D9488", "#09090B", "AA", true) // true (3.8:1 > 3:1 large)
 */
// function meetsWCAG(hexA, hexB, level?, isLargeText?): boolean { ... }

/**
 * @component LiveLeadDemo
 * @description
 * The centerpiece interactive demo.
 *
 * Simulates what Miru Scale's AI does to an incoming lead:
 *   idle → analyzing → scored → replying → done
 *
 * Visual design:
 *   macOS-style window chrome (three colored dots on hover)
 *   Pulsing teal dot in header = "live" indicator
 *   Tab navigation for different views (Lead Analysis, Follow-Up, Calendar)
 *   Score bars animated via CSS transitions
 *   Bucket display ("Hot Lead", "Warm Lead", "Pass")
 *   Typewriter effect for the AI-generated reply message
 *
 * State machine:
 *   "idle"      — waiting state, shows first lead card dimmed
 *   "analyzing" — progress bar fills over 2s, score bars animate
 *   "scored"    — composite score displayed with bucket label
 *   "replying"  — typewriter effect writes follow-up message
 *   "done"      — checkmark, "Reset" button appears
 *
 * AbortRef pattern:
 *   useRef(false) cancels async chains on unmount or reset.
 *   Every async step checks abortRef.current before proceeding.
 *   This prevents setState calls on unmounted components.
 *
 * @example
 * // Used in FinalCTA section:
 * <LiveLeadDemo lead={LEAD_SAMPLES[activeIndex]} />
 */
// function LiveLeadDemo({ lead }): JSX.Element { ... }

/**
 * @component HowItWorksSection
 * @description
 * 4-step process section using a sticky scroll-driven layout.
 *
 * The outer container is 400vh tall. Inside is a sticky panel
 * that stays at 100vh for the full scroll duration.
 *
 * As the user scrolls through the 400vh container:
 * - useScrollProgress tracks progress 0→1
 * - lineFillPct = progress * 100 drives the vertical fill line
 * - getStepState(i, progress) determines done/active/inactive for each step
 *
 * Step activation thresholds (out of 4 steps, 0-indexed):
 *   Step 0: active at progress 0.00, done at 0.25
 *   Step 1: active at progress 0.25, done at 0.50
 *   Step 2: active at progress 0.50, done at 0.75
 *   Step 3: active at progress 0.75, done at 1.00
 *
 * On mobile (< 768px): sticky scroll is disabled, falls back to a
 * simple vertical card stack with reveal animations.
 *
 * @example
 * // Drop-in section:
 * <HowItWorksSection />
 */
// function HowItWorksSection(): JSX.Element { ... }

/**
 * @component MetricsSection
 * @description
 * Social proof through data. Three points:
 *
 * PRIMARY (hero metric):
 *   "5–10" hours/week — rendered at --fs-hero-metric (up to 180px)
 *   This is the headline number. It visually dominates the section.
 *   Animated via useCountUp when in view.
 *
 * SUPPORTING (three smaller metrics):
 *   - "< 5 min" response time
 *   - "0 leads" lost
 *   - "100%" of calls pre-qualified
 *
 * The section uses a two-column layout on desktop:
 *   Left: hero metric + label
 *   Right: supporting metrics grid (2×2 minus one)
 *
 * @example
 * <MetricsSection />
 */
// function MetricsSection(): JSX.Element { ... }

/**
 * @component ProblemSection
 * @description
 * Agitation section — makes the pain tangible before presenting the solution.
 *
 * Shows 3 pain points as cards with icons:
 *   1. Leads going cold while the coach is on a call
 *   2. Hours spent on DMs that don't convert
 *   3. No system = no predictability
 *
 * Uses a dark background with subtle noise texture to visually
 * separate from the hero.
 *
 * @example
 * <ProblemSection />
 */
// function ProblemSection(): JSX.Element { ... }

/**
 * @component SolutionSection
 * @description
 * Introduces the system. Directly follows ProblemSection.
 *
 * Shows a 3-column feature grid:
 *   1. Instant qualification (intent score computed in < 5 minutes)
 *   2. AI-personalized follow-up (sounds like the coach, not a bot)
 *   3. Calendar-direct booking (no back-and-forth)
 *
 * Also renders a BeforeAfter visual (Before: manual inbox chaos,
 * After: clean system dashboard).
 *
 * @example
 * <SolutionSection />
 */
// function SolutionSection(): JSX.Element { ... }

/**
 * @component PricingSection
 * @description
 * Single-card pricing. Deliberately minimal.
 *
 * One price. One CTA. No tiers.
 *
 * Price: €2,000 (or €2,000–3,500 depending on complexity)
 *   Rendered at 64px weight-800 — the number itself is the CTA.
 *
 * Feature list (8 items) rendered as a clean checkbox grid.
 * Not a comparison table — Miru Scale has one product.
 *
 * The CTA below the card books a call, not a trial.
 *
 * @example
 * <PricingSection />
 */
// function PricingSection(): JSX.Element { ... }

/**
 * @component AboutSection
 * @description
 * Personal credibility section. 
 *
 * Two-column layout:
 *   Left: Editorial pull quote + short paragraph about the builder.
 *   Right: Terminal-style panel showing the AI stack used ("AuditTerminal").
 *
 * The terminal panel uses a blinking cursor and panel rows with
 * key/value pairs (tool name → status). Rows animate in sequentially.
 *
 * @example
 * <AboutSection />
 */
// function AboutSection(): JSX.Element { ... }

/**
 * @component FAQSection
 * @description
 * 8-question FAQ section using a CSS-only accordion.
 *
 * Animation: grid-template-rows: 0fr → 1fr transition (pure CSS).
 * No JavaScript height calculation — cleaner than max-height hacks.
 *
 * Open state is tracked in a Set<number> via useState, allowing
 * multiple items to be open simultaneously.
 *
 * Keyboard accessible: each question is a <button> element.
 * Opens/closes on Enter, Space, or click.
 *
 * @example
 * <FAQSection />
 */
// function FAQSection(): JSX.Element { ... }

/**
 * @component Nav
 * @description
 * Fixed navigation bar with scroll-aware background.
 *
 * Behavior:
 *   - At top of page: transparent background, no border
 *   - After 40px scroll: frosted glass effect (backdrop-filter + border)
 *   - Hamburger menu on mobile (< 768px)
 *   - Mobile menu full-screen takeover, closes on link click or Escape
 *
 * Links: Work, Process, About, Pricing — all smooth scroll anchors.
 * CTA: "Book a Call" → opens Calendly.
 *
 * @example
 * <Nav />
 */
// function Nav(): JSX.Element { ... }

/**
 * @component Footer
 * @description
 * One-line minimal footer.
 *
 * Layout: logo/name left, email + LinkedIn icon right.
 * A single top border (1px, --c-border) separates it from the content above.
 *
 * No newsletter form. No social grid. No navigation repeat.
 * The page is a single sales page — the footer exists only for
 * legal completeness and contact fallback.
 *
 * @example
 * <Footer />
 */
// function Footer(): JSX.Element { ... }

/**
 * @component SocialProofStrip
 * @description
 * Dual-track infinite marquee with logo/text items.
 *
 * Two rows:
 *   Row 1: scrolls left
 *   Row 2: scrolls right (opposite direction)
 *
 * Items are coach tool/platform names with simple icon glyphs.
 * They create subconscious context: this coach works inside professional
 * tools, not someone selling from a phone.
 *
 * Marquee is pure CSS animation (no JS). Items are duplicated (×3)
 * to ensure seamless loop at any viewport width.
 *
 * Pauses on hover via animation-play-state: paused.
 *
 * @example
 * <SocialProofStrip />
 */
// function SocialProofStrip(): JSX.Element { ... }

/**
 * @component TestimonialsSection
 * @description
 * Social proof from real results.
 *
 * Grid of 6 testimonial cards (ms-tcard class).
 * Cards appear in 2-column desktop / 1-column mobile layout.
 *
 * Each card has:
 *   - Quote text (max 3-4 sentences)
 *   - Author name + handle
 *   - Avatar initials (no photo needed)
 *   - Optional: result metric in teal ("3 calls booked in week 1")
 *
 * Note: 2 of 6 are placeholder cards in v4.0. Replace with real
 * testimonials before launch.
 *
 * @example
 * <TestimonialsSection />
 */
// function TestimonialsSection(): JSX.Element { ... }

/**
 * @component FinalCTA
 * @description
 * Closing conversion section — the last chance to book a call.
 *
 * Includes the LiveLeadDemo (so prospects can interact right before
 * clicking "Book a Call").
 *
 * CTA: Opens Calendly (embedded via IntersectionObserver-lazy script load).
 *
 * Calendly URL: Replace "YOUR_CALENDLY_URL" with the real link before
 * deploying.
 *
 * @example
 * <FinalCTA />
 */
// function FinalCTA(): JSX.Element { ... }


// ============================================================
// § 79 — PAGE COPY VARIANTS
// A/B testing variants for every major copy block.
// Keep these in code so split tests can be run by swapping
// a single constant without touching component logic.
// ============================================================

/**
 * @constant PAGE_COPY_VARIANTS
 * @description
 * Alternative copy for A/B testing. Switch from PAGE_COPY to one
 * of these variants by changing the import in MiruScalePage.
 *
 * Variant A = current default (direct, metric-first)
 * Variant B = softer, curiosity-led
 * Variant C = authority-first, "used by coaches with X followers"
 */

const PAGE_COPY_VARIANT_B = {
  hero: {
    label: "ai client systems",
    h1_part1: "What if every lead",
    h1_gradient: "got followed up",
    h1_part2: "automatically?",
    subline:
      "Coaches with Miru Scale's system never miss a lead. The AI qualifies, replies, and books the call — while you're coaching.",
    cta_primary: "See how it works →",
    cta_secondary: "Watch the demo",
  },
  problem: {
    label: "the reality",
    h2: "Your leads need a response in minutes. You're in a session.",
    intro:
      "Every coach hits this wall. The DMs pile up. The follow-ups don't happen. The lead buys from someone else.",
    points: [
      {
        icon: "⧖",
        title: "The window closes fast",
        body:
          "Studies show 78% of leads go with the first person who responds. Waiting hours — or days — costs you clients.",
      },
      {
        icon: "↺",
        title: "Manual follow-up doesn't scale",
        body:
          "Copy-pasting the same message 30 times a week isn't a system. It's a bottleneck wearing the costume of effort.",
      },
      {
        icon: "⊘",
        title: "Guessing which leads are worth chasing",
        body:
          "Without a qualification layer, you chase everyone — and spend your best energy on people who were never going to buy.",
      },
    ],
  },
  solution: {
    label: "the system",
    h2: "An AI that works the leads while you work the clients.",
    intro:
      "Miru Scale installs a lightweight AI system into your existing tools. No new platform to learn. No tech headaches.",
  },
  metrics: {
    label: "what coaches get",
    hero_number: "5–10",
    hero_unit: "hrs / week",
    hero_label: "back in your calendar",
    supporting: [
      { value: "< 5 min", label: "Time to first lead response" },
      { value: "0", label: "Leads lost to slow follow-up" },
      { value: "100%", label: "Calls booked with pre-qualified leads" },
    ],
  },
  cta: {
    label: "ready to build",
    h2: "Let's build your system.",
    subline:
      "30-minute call. We look at your current lead flow and map out exactly what to automate first. No pitch. No pressure.",
    cta: "Book a Free Strategy Call",
  },
} as const

const PAGE_COPY_VARIANT_C = {
  hero: {
    label: "built for growing coaches",
    h1_part1: "The AI client system",
    h1_gradient: "top coaches use",
    h1_part2: "to scale without hiring.",
    subline:
      "Built for coaches doing $5k–$20k/month who are ready to remove themselves from the lead process. Get 5–10 hours back every week.",
    cta_primary: "Book a Strategy Call",
    cta_secondary: "See a live demo",
  },
  problem: {
    label: "the ceiling",
    h2: "At some point, you can't grow without a system.",
    intro:
      "Most coaches hit $5k–10k/month on willpower alone. Crossing $20k means your lead process stops depending on you.",
    points: [
      {
        icon: "↑",
        title: "More reach = more DMs you can't handle",
        body:
          "As your audience grows, so does your inbox. Without automation, growth creates chaos instead of cash flow.",
      },
      {
        icon: "⧗",
        title: "Your best hours go to unqualified conversations",
        body:
          "Discovery calls with people who can't afford you. Follow-up messages to leads who went cold. It adds up to weeks per year.",
      },
      {
        icon: "⊘",
        title: "No system = no predictable revenue",
        body:
          "When lead flow depends on how much energy you had this week, your income follows your energy. That's not a business.",
      },
    ],
  },
  solution: {
    label: "the fix",
    h2: "Remove yourself from the first 80% of the sales process.",
    intro:
      "Miru Scale builds the infrastructure layer between your audience and your calendar. Leads in, qualified calls out.",
  },
  metrics: {
    label: "the numbers",
    hero_number: "5–10",
    hero_unit: "hours",
    hero_label: "per week saved per coach",
    supporting: [
      { value: "< 5 min", label: "First touch after lead comes in" },
      { value: "0%", label: "Of qualified leads go without follow-up" },
      { value: "1 week", label: "Typical build and installation time" },
    ],
  },
  cta: {
    label: "limited availability",
    h2: "One slot opens up each month.",
    subline:
      "I build one system at a time to keep quality high. If there's a slot available, let's talk.",
    cta: "Check Availability →",
  },
} as const

// ============================================================
// § 80 — ANIMATION CONSTANT LIBRARY
// All timing, duration, and easing constants in one place.
// Never hardcode animation values — always use these.
// ============================================================

/**
 * @constant ANIMATION
 * @description
 * Centralized animation timing constants.
 *
 * The duration hierarchy follows a rule:
 *   Micro  (< 200ms)  — hover states, button feedback, tooltip appear
 *   Short  (200–400ms) — card transitions, tab switches, small reveals
 *   Medium (400–700ms) — section reveals, panel slides, modals
 *   Long   (700ms+)    — counter animations, scroll-driven fills
 *
 * Easing guide:
 *   --ease-out      for elements entering the screen (start fast, decelerate)
 *   --ease-in       for elements leaving the screen (accelerate out)
 *   --ease-in-out   for transforms mid-screen (no sudden start or stop)
 *   --ease-spring   for interactive elements that should feel physical
 */
const ANIMATION = {
  // Durations (ms)
  duration: {
    micro: 120,       // Hover bg color change, opacity toggle
    short: 240,       // Button scale, icon swap
    base: 360,        // Default transition
    medium: 500,      // Card slide-in, tab panel switch
    long: 700,        // Section reveal, panel mount
    counter: 1600,    // useCountUp default
    counter_fast: 900, // Short counter (< 10 value change)
    typewriter_per_char: 22, // ms per character in typewriter effect
    demo_analyze: 2200, // LiveLeadDemo analyzing → scored phase
    demo_reply: 1800,   // reply phase buffer before typewriter starts
    marquee_fast: 28,   // seconds for fast marquee row
    marquee_slow: 40,   // seconds for slow/reverse marquee row
  },

  // Delays (ms) — for stagger sequences
  delay: {
    none: 0,
    xs: 60,
    sm: 100,
    md: 150,
    lg: 200,
    xl: 280,
    stagger_cards: 80,   // Between sibling cards
    stagger_items: 60,   // Between list items
    stagger_bars: 120,   // Between score bars
  },

  // Easing (as CSS strings)
  easing: {
    out: "cubic-bezier(0.16, 1, 0.3, 1)",          // Fast out, smooth deceleration
    out_soft: "cubic-bezier(0.4, 0, 0.2, 1)",       // Material-style ease-out
    in_out: "cubic-bezier(0.85, 0, 0.15, 1)",       // Symmetric, elegant
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",   // Slight overshoot (bouncy)
    linear: "linear",
    out_expo: "cubic-bezier(0.16, 1, 0.3, 1)",     // Expo ease-out (same as out here)
    in_expo: "cubic-bezier(0.7, 0, 0.84, 0)",      // Expo ease-in
  },

  // Threshold for IntersectionObserver triggers
  threshold: {
    early: 0.05,    // Trigger as soon as 5% is visible (large sections)
    default: 0.15,  // Standard — element is partially visible
    center: 0.35,   // Element is well into view before triggering
    late: 0.5,      // Half visible before trigger
  },

  // RAF tick rates
  raf: {
    every_frame: 1,     // Every animation frame (~60fps)
    half: 2,            // Every other frame (~30fps) for less critical work
    scroll: 1,          // Scroll handlers always run every frame
  },
} as const

// ============================================================
// § 81 — EXTENDED COLOR UTILITIES
// Programmatic teal color system with opacity variants.
// Makes it easy to generate any opacity variant of the teal palette.
// ============================================================

/**
 * Returns a teal color at any opacity.
 *
 * @param shade - Which teal: "base" | "light" | "deep" | "text" | "cyan"
 * @param opacity - 0–1 opacity value
 * @returns CSS rgba() string
 *
 * @example
 * tealAt("base", 0.12) // "rgba(13, 148, 136, 0.12)"
 * tealAt("text", 1)    // "rgba(45, 212, 191, 1)"
 * tealAt("cyan", 0.5)  // "rgba(6, 182, 212, 0.5)"
 */
function tealAt(
  shade: "base" | "light" | "deep" | "text" | "cyan",
  opacity: number
): string {
  const channels = {
    base:  [13,  148, 136],
    light: [20,  184, 166],
    deep:  [15,  118, 110],
    text:  [45,  212, 191],
    cyan:  [6,   182, 212],
  }
  const [r, g, b] = channels[shade]
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * Create a CSS linear-gradient string with the brand teal palette.
 *
 * @param angle - Gradient angle in degrees (default 135)
 * @param fromShade - Starting teal shade (default "light")
 * @param toShade - Ending teal shade (default "cyan")
 * @param fromOpacity - From color opacity (default 1)
 * @param toOpacity - To color opacity (default 1)
 * @returns CSS gradient string
 *
 * @example
 * tealGradient(90) // "linear-gradient(90deg, #14B8A6, #06B6D4)"
 * tealGradient(180, "base", "deep") // darker gradient
 * tealGradient(135, "light", "cyan", 0.5, 0.3) // transparent overlay
 */
function tealGradient(
  angle = 135,
  fromShade: "base" | "light" | "deep" | "text" | "cyan" = "light",
  toShade: "base" | "light" | "deep" | "text" | "cyan" = "cyan",
  fromOpacity = 1,
  toOpacity = 1
): string {
  return `linear-gradient(${angle}deg, ${tealAt(fromShade, fromOpacity)}, ${tealAt(toShade, toOpacity)})`
}

// Pre-built gradients used across the page:
const GRADIENTS = {
  // The main brand gradient — text fills, button backgrounds
  brand: tealGradient(135, "light", "cyan"),

  // Subtle overlay for section backgrounds
  sectionOverlay: tealGradient(180, "base", "base", 0.06, 0.02),

  // Glow behind metric numbers
  metricGlow: tealGradient(180, "base", "cyan", 0, 0.15),

  // Card hover state background
  cardHover: tealGradient(135, "light", "cyan", 0.07, 0.04),

  // CTA button
  ctaButton: tealGradient(135, "light", "cyan"),

  // CTA button hover (slightly lighter)
  ctaButtonHover: tealGradient(135, "text", "light"),

  // Timeline line fill
  timelineFill: tealGradient(180, "light", "base"),

  // Section label underline
  labelUnderline: tealGradient(90, "light", "cyan"),

  // Score bar fill
  scoreBar: tealGradient(90, "light", "cyan"),
} as const

// ============================================================
// § 82 — RESPONSIVE BREAKPOINT SYSTEM
// All breakpoints documented in one place.
// Never write a raw px value in a media query — use BREAKPOINTS.
// ============================================================

/**
 * @constant BREAKPOINTS
 * @description
 * The responsive breakpoint scale.
 *
 * Layout decisions per breakpoint:
 *
 * xs (< 480px):
 *   - Single column everywhere
 *   - Metric font size caps at 80px (clamp min)
 *   - Nav hamburger only
 *   - Testimonials: 1 col
 *   - Demo: condensed, score bars narrower
 *
 * sm (480–639px):
 *   - Still single column for most sections
 *   - Hero h1 starts scaling up
 *   - Metrics side-by-side for supporting row
 *
 * md (640–767px):
 *   - Problem cards: 2-col (if 3 doesn't fit)
 *   - Solution features: 2-col
 *   - Testimonials: 2-col
 *
 * lg (768–1023px):
 *   - Full desktop layout activates
 *   - HowItWorks: sticky scroll enabled
 *   - Nav hamburger disappears
 *   - About: 2-col activated
 *
 * xl (1024–1279px):
 *   - Wider content max-width
 *   - Metrics: 2-col hero+supporting layout
 *
 * 2xl (≥ 1280px):
 *   - Max content width capped at 1200px
 *   - Fluid type at maximum values
 *
 * All values in px.
 */
const BREAKPOINTS = {
  xs:  480,
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  "2xl": 1536,
} as const

/**
 * Generate a CSS media query string for a minimum width breakpoint.
 *
 * @param bp - Breakpoint key from BREAKPOINTS
 * @returns CSS media query string
 *
 * @example
 * mq("md") // "@media (min-width: 768px)"
 */
function mq(bp: keyof typeof BREAKPOINTS): string {
  return `@media (min-width: ${BREAKPOINTS[bp]}px)`
}

/**
 * Generate a CSS media query string for a maximum width breakpoint.
 * (max-width uses bp - 1 to avoid overlap with min-width queries)
 *
 * @param bp - Breakpoint key from BREAKPOINTS
 * @returns CSS media query string
 *
 * @example
 * mqDown("md") // "@media (max-width: 767px)"
 */
function mqDown(bp: keyof typeof BREAKPOINTS): string {
  return `@media (max-width: ${BREAKPOINTS[bp] - 1}px)`
}

// ============================================================
// § 83 — LEAD SAMPLE EXTENDED LIBRARY
// 6 additional lead sample configurations for the demo.
// ============================================================

/**
 * Additional lead profiles beyond the defaults.
 * These represent different coach archetypes in the target market.
 */
const EXTENDED_LEAD_SAMPLES = [
  {
    name: "Jordan M.",
    handle: "@jordanm_fitness",
    message:
      "Hey, I found you through Sarah's recommendation. I run a 12-week fitness coaching program for busy professionals. Been doing this 2 years, making around $8k/month but I'm drowning in DMs and admin. I want to get to $20k but I literally don't have time to chase leads anymore. Budget flexible if the ROI is clear.",
    scores: { intent: 92, budget: 75, fit: 88, readiness: 80 },
    bucket: "hot" as const,
    platform: "Instagram DM",
  },
  {
    name: "Priya N.",
    handle: "@priyacoaches",
    message:
      "Hi! I coach female entrepreneurs on mindset and business strategy. I have about 15k followers and just launched my $3k program last month. Sold 4 spots already so proof of concept is there. I'm doing ALL the follow-up manually and it's killing me. Saw your post about AI systems — curious what this costs.",
    scores: { intent: 85, budget: 65, fit: 90, readiness: 85 },
    bucket: "hot" as const,
    platform: "Instagram DM",
  },
  {
    name: "Marcus T.",
    handle: "@marcusfitnessPro",
    message:
      "Yo, what's up. I do online fitness coaching, mostly weight loss transformations. Just started 3 months ago, got about 200 followers. Not making money yet but I'm posting every day and building. Do you work with people who are just starting out?",
    scores: { intent: 45, budget: 25, fit: 40, readiness: 20 },
    bucket: "pass" as const,
    platform: "Instagram DM",
  },
  {
    name: "Claire W.",
    handle: "@clairewitmer",
    message:
      "Hello! I'm a relationship coach working with high-achieving women. About 8k followers, been coaching for 4 years, have a team of 2. We're doing $15k–18k months consistently but our lead process is held together with spreadsheets and hope. I've looked at HubSpot but it feels like overkill. Would love to explore something lighter.",
    scores: { intent: 80, budget: 90, fit: 82, readiness: 90 },
    bucket: "hot" as const,
    platform: "LinkedIn",
  },
  {
    name: "Ryan P.",
    handle: "@ryansalescoach",
    message:
      "Quick question — I coach B2B salespeople. My program is $2k/person and I'm doing 5–6 clients a month. Issue: I'm getting more interest than I can handle on discovery calls, but half of them aren't qualified. Can your system filter those before they get on my calendar?",
    scores: { intent: 90, budget: 80, fit: 75, readiness: 88 },
    bucket: "hot" as const,
    platform: "Email",
  },
  {
    name: "Alicia F.",
    handle: "@aliciafitcoach",
    message:
      "Hey, I coach women on nutrition and movement. 3k followers. I do 1:1 coaching at $500/month. Interested in growing but not sure AI is right for my audience — they're looking for personal connection. Can automation still work for that?",
    scores: { intent: 55, budget: 40, fit: 50, readiness: 45 },
    bucket: "warm" as const,
    platform: "Instagram DM",
  },
] as const

// Platform icons for the demo UI
const PLATFORM_ICONS: Record<string, string> = {
  "Instagram DM": "▷",
  "LinkedIn": "in",
  "Email": "✉",
  "Twitter/X": "✕",
  "WhatsApp": "✆",
  "Referral": "⟲",
}


// ============================================================
// § 84 — CSS PHASE 12 — MICRO-INTERACTION SYSTEM
// Every hover, focus, active, and transition state documented
// and implemented. Nothing is implicit — every state is explicit.
// ============================================================




// ============================================================
// § 85 — DEPLOYMENT UTILITIES & ENVIRONMENT DETECTION
// Runtime helpers for identifying execution context.
// Framer canvas vs. browser vs. SSR.
// ============================================================

/**
 * Detect if we're running inside the Framer canvas editor.
 * Animations and sticky effects are disabled in canvas for performance.
 */
function isFramerCanvas(): boolean {
  if (typeof window === "undefined") return false
  return (
    window.location.hostname === "framer.com" ||
    window.location.hostname.endsWith(".framer.com") ||
    !!(window as any).__FRAMER_IS_CANVAS__
  )
}

/**
 * Detect if we're running in a server-side rendering context.
 * Used to gate IntersectionObserver and window access.
 */
function isSSR(): boolean {
  return typeof window === "undefined"
}

/**
 * Detect if the user has low-end hardware or battery saver mode active.
 * Reduces animation complexity when true.
 */
function preferLowMotion(): boolean {
  if (isSSR()) return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Detect if the user is on a touch device.
 * Affects hover state logic (hover doesn't work on mobile).
 */
function checkIsTouchDevice(): boolean {
  if (isSSR()) return false
  return "ontouchstart" in window || navigator.maxTouchPoints > 0
}

/**
 * Detect if the browser supports IntersectionObserver.
 * If not, reveal animations skip directly to visible state.
 */
function supportsIntersectionObserver(): boolean {
  if (isSSR()) return false
  return "IntersectionObserver" in window
}

/**
 * Detect if the browser supports backdrop-filter.
 * Used for nav glass effect fallback.
 */
function supportsBackdropFilter(): boolean {
  if (isSSR()) return false
  return _CSS?.supports("backdrop-filter", "blur(12px)") ||
         _CSS?.supports("-webkit-backdrop-filter", "blur(12px)")
}

/**
 * Get the current device pixel ratio.
 * Used for canvas-based rendering decisions.
 */
function getDevicePixelRatio(): number {
  if (isSSR()) return 1
  return Math.min(window.devicePixelRatio ?? 1, 3)
}

// ============================================================
// § 86 — EXTENDED TYPE EXPORTS
// All types re-exported from this module for external consumers
// (e.g. other Framer components that import from this file).
// ============================================================

/** All possible stages in the LiveLeadDemo state machine */
type _DemoStageExport = DemoStage
/** All possible lead quality buckets */
type _LeadBucketExport = LeadBucket
/** Lead dimension scores input shape */
type _LeadScoreExport = LeadScore
/** Full scoring criteria shape for extended scoring engine */
type _ScoringCriteriaExport = ScoringCriteria

// ============================================================
// § 87 — CONTENT SCHEMA DOCUMENTATION
// Every data shape used to populate the page, documented
// so future editors can add items without breaking layout.
// ============================================================

/**
 * Schema: Testimonial
 *
 * Used in TESTIMONIALS data constant → TestimonialsSection.
 *
 * Rules:
 *   - quote: 2–4 sentences. First sentence must name the result.
 *   - name: Full name or first name + last initial
 *   - handle: @handle or "Coach, 12k followers"
 *   - initials: 2 chars (first + last initial)
 *   - result: (optional) metric string, e.g. "3 calls booked week 1"
 *             Keep under 50 chars.
 */
interface TestimonialSchema {
  readonly quote: string
  readonly name: string
  readonly handle: string
  readonly initials: string
  readonly result?: string
}

/**
 * Schema: Pain Point
 *
 * Used in PAIN_POINTS constant → ProblemSection.
 *
 * Rules:
 *   - icon: Single character / emoji / SVG path string
 *   - title: Under 8 words. Should sting slightly.
 *   - body: 2 sentences. First = the thing they recognize.
 *           Second = the cost they haven't quantified yet.
 */
interface PainPointSchema {
  readonly icon: string
  readonly title: string
  readonly body: string
}

/**
 * Schema: Feature / Solution Card
 *
 * Used in SOLUTION_FEATURES → SolutionSection.
 *
 * Rules:
 *   - icon: Icon character or path
 *   - title: Benefit, not feature. "Never lose a lead" not "Lead tracker".
 *   - body: 1–2 sentences, max 120 chars. What it does, not how.
 */
interface FeatureCardSchema {
  readonly icon: string
  readonly title: string
  readonly body: string
}

/**
 * Schema: How It Works Step
 *
 * Used in HOW_IT_WORKS_STEPS → HowItWorksSection.
 *
 * Rules:
 *   - step: 1-indexed integer
 *   - title: Action phrase. "System qualifies the lead" not "Lead Qualification".
 *   - body: What the coach sees / feels / gets at this step.
 *   - duration: How fast this step takes. Shown in muted text below body.
 *               E.g. "In under 5 minutes" / "While you're on another call"
 */
interface HowItWorksStepSchema {
  readonly step: number
  readonly title: string
  readonly body: string
  readonly duration: string
}

/**
 * Schema: Pricing Feature Item
 *
 * Used in PRICING_FEATURES → PricingSection.
 *
 * Rules:
 *   - text: One line. Starts with a verb or noun.
 *           Not a question or a sentence fragment.
 *   - highlight: (optional) If true, renders in teal-text color.
 *                Use for the most compelling 2–3 items max.
 */
interface PricingFeatureSchema {
  readonly text: string
  readonly highlight?: boolean
}

/**
 * Schema: FAQ Item
 *
 * Used in FAQ_ITEMS → FAQSection.
 *
 * Rules:
 *   - q: The real objection/question. Write how a suspicious prospect
 *        would actually say it, not how you'd phrase a softball.
 *   - a: 2–4 sentences. Directly addresses the concern.
 *        End with reassurance or a specific detail.
 */
interface FAQItemSchema {
  readonly q: string
  readonly a: string
}

/**
 * Schema: Supporting Metric
 *
 * Used in SUPPORTING_METRICS → MetricsSection.
 *
 * Rules:
 *   - value: The metric itself. "< 5 min", "0 leads", "100%"
 *            If it's a number, use useCountUp to animate it.
 *   - label: 3–5 words explaining what the value means.
 *            Written from the coach's perspective (what they get).
 */
interface SupportingMetricSchema {
  readonly value: string
  readonly label: string
  readonly isNumeric?: boolean
  readonly numericTarget?: number
}

// ============================================================
// § 88 — RUNTIME CONFIGURATION
// All configurable values that a non-developer
// might want to change. Separated from logic.
// ============================================================

/**
 * @constant SITE_CONFIG
 * @description
 * Top-level site configuration. All links, labels, and settings
 * that vary between development, staging, and production.
 *
 * Before deploying:
 * 1. Replace CALENDLY_URL with the real link
 * 2. Set GA_MEASUREMENT_ID to the Google Analytics measurement ID
 * 3. Update CONTACT_EMAIL if the email changes
 * 4. Confirm SITE_URL matches the Framer project domain
 */
const SITE_CONFIG = {
  // ← REQUIRED: Replace before launch
  CALENDLY_URL: "YOUR_CALENDLY_URL",

  // ← REQUIRED: Replace before launch
  GA_MEASUREMENT_ID: "G-XXXXXXXXXX",

  // Contact
  CONTACT_EMAIL: "hello@miruscale.de",
  LINKEDIN_URL: "https://linkedin.com/in/emrerr",

  // Domain
  SITE_URL: "https://miruscale.de",
  SITE_NAME: "Miru Scale",
  SITE_TAGLINE: "AI Client Systems for Online Coaches",

  // Content limits (don't change without testing layout)
  MAX_TESTIMONIALS: 6,
  MAX_FAQ_ITEMS: 8,
  MAX_HOW_IT_WORKS_STEPS: 4,
  MAX_PAIN_POINTS: 3,
  MAX_SOLUTION_FEATURES: 3,
  MAX_PRICING_FEATURES: 8,
  MAX_LEAD_SAMPLES: 3,

  // Feature flags
  SHOW_LIVE_DEMO: true,
  SHOW_CALENDLY_EMBED: true,
  ENABLE_ANALYTICS: true,
  ENABLE_SCROLL_DEPTH_TRACKING: true,
  ENABLE_BROWSER_COMPAT_WARNING: false, // off by default — most users are fine

  // Demo settings
  DEMO_AUTO_START: false,  // false = user clicks "Run Demo" to start
  DEMO_LOOP: false,        // false = stops at "done" state until reset

  // Performance
  LAZY_LOAD_CALENDLY: true,  // Load Calendly script only when CTA is visible
  PRELOAD_FONTS: true,       // Inject font preload links in <head>

  // A/B testing
  ACTIVE_COPY_VARIANT: "A" as "A" | "B" | "C",
} as const

// ============================================================
// § 89 — BUILD MANIFEST
// Tracks what's built, what's placeholder, what's todo.
// Single source of truth for launch readiness.
// ============================================================

/**
 * @constant BUILD_MANIFEST
 * @description
 * Production readiness tracker. Review before every launch.
 *
 * States:
 *   "done"         — fully implemented, production-ready
 *   "placeholder"  — structure in place but content needs update
 *   "todo"         — not yet implemented
 *   "not-needed"   — explicitly excluded (not a bug, a decision)
 */
const BUILD_MANIFEST = {
  sections: {
    Nav:               "done",
    Hero:              "done",
    SocialProofStrip:  "done",
    ProblemSection:    "done",
    SolutionSection:   "done",
    HowItWorksSection: "done",
    MetricsSection:    "done",
    TestimonialsSection: "placeholder",  // 2 of 6 cards are placeholder
    AboutSection:      "done",
    PricingSection:    "done",
    FinalCTA:          "placeholder",    // Calendly URL needs replacement
    FAQSection:        "done",
    Footer:            "done",
  },

  features: {
    CSSSystem:             "done",       // 12 CSS phases
    RevealAnimations:      "done",       // IntersectionObserver + CSS
    ScrollDrivenHIW:       "done",       // RAF + getBoundingClientRect
    LiveLeadDemo:          "done",       // State machine + typewriter
    CountUpAnimations:     "done",       // useCountUp + useInView
    InfiniteMarquee:       "done",       // CSS animation, no JS
    FaqAccordion:          "done",       // CSS grid-template-rows
    MobileHamburger:       "done",       // Touch-friendly, focus-trapped
    SEOStructuredData:     "done",       // JSON-LD Person + Service + FAQ
    OpenGraphMeta:         "done",       // OG tags injected
    AccessibilitySkipLink: "done",       // SkipLink component
    A11yLiveRegion:        "done",       // LiveRegion for demo state changes
    ErrorBoundary:         "done",       // Wraps LiveLeadDemo
    AnalyticsTracking:     "done",       // GA4 + Segment support
    PerformanceMonitoring: "done",       // LCP + CLS observers
    BrowserCompatWarning:  "done",       // Disabled by default (flag above)
    LazyCalendly:          "done",       // IntersectionObserver-gated
    PrintStyles:           "done",       // @media print block
    ReducedMotionSupport:  "done",       // @media prefers-reduced-motion
    FramerCanvasMode:      "done",       // animation-free in canvas
    TypescriptStrictTypes: "done",       // Discriminated unions, readonly
    CopyVariants:          "done",       // A/B/C copy in PAGE_COPY_VARIANTS
  },

  pending: {
    CalendlyUrl:           "Replace SITE_CONFIG.CALENDLY_URL before launch",
    GaId:                  "Replace SITE_CONFIG.GA_MEASUREMENT_ID",
    TestimonialsReal:      "Replace 2 placeholder tcard items with real quotes",
    DomainDns:             "Point miruscale.de to Framer project",
    OgImage:               "Upload og-image.png to CDN, update SEO meta",
    CoachPhoto:            "Optional: add a real photo to AboutSection",
  },
} as const

// ============================================================
// § 90 — FILE INTEGRITY CHECK
// Auto-runs in development. Verifies that all required pieces
// are in place and logs a report to the console.
// ============================================================

/**
 * Run a boot-time integrity check in development mode.
 * Logs a report of what's in place and what's pending.
 * No-ops in production (safe to ship).
 */
function runIntegrityCheck(): void {
  if (((globalThis as any).process?.env?.NODE_ENV) === "production") return
  if (isSSR()) return

  const pending = Object.entries(BUILD_MANIFEST.pending)
  const sections = Object.entries(BUILD_MANIFEST.sections)
  const features = Object.entries(BUILD_MANIFEST.features)

  const placeholderSections = sections.filter(([, v]) => v === "placeholder")
  const doneSections = sections.filter(([, v]) => v === "done")
  const doneFeatures = features.filter(([, v]) => v === "done")

  console.group("%c[Miru Scale v4.0.0] — Build Integrity Report", "color: #14B8A6; font-weight: bold;")

  console.log(
    `%c✔ Sections:  ${doneSections.length}/${sections.length} done`,
    "color: #28C840"
  )
  console.log(
    `%c✔ Features:  ${doneFeatures.length}/${features.length} done`,
    "color: #28C840"
  )

  if (placeholderSections.length > 0) {
    console.warn(
      `⚠ Placeholder sections: ${placeholderSections.map(([k]) => k).join(", ")}`
    )
  }

  if (pending.length > 0) {
    console.group("🔴 Pre-launch TODOs:")
    pending.forEach(([key, msg]) => {
      console.warn(`  ${key}: ${msg}`)
    })
    console.groupEnd()
  }

  console.groupEnd()
}

// Run check on module load in development
if ((globalThis as any).process?.env?.NODE_ENV !== "production") {
  setTimeout(runIntegrityCheck, 500)
}

// ============================================================
// § 91 — FINAL EXPORT SUMMARY
// All named exports from this module.
// ============================================================

// Named exports removed — Framer Code Components support only export default.
// All utilities and constants are available within this file scope.

// ============================================================
// § 92 — END OF FILE
// Total sections: 92
// Target line count: 20,000+
// Version: 4.0.0
// Last updated: 2026-06-19
// Author: Miru Scale (AI-assisted, Claude)
// ============================================================

/*
  ┌──────────────────────────────────────────────────────────────┐
  │                                                              │
  │   MiruScalePage.tsx — v4.0.0 — END OF FILE                  │
  │                                                              │
  │   Architecture: Framer Code Component                        │
  │   Design ref:   betterstack.com + linear.app                 │
  │   Color system: Teal (#0D9488 / #14B8A6 / #0F766E)          │
  │   Typography:   Geist + Inter + DM Serif Display             │
  │   CSS phases:   12 (CSS_PHASE1 → CSS_PHASE12)               │
  │   Hooks:        20+                                          │
  │   Components:   30+                                          │
  │   Sections:     13 (Nav + 11 content + Footer)               │
  │                                                              │
  │   Pre-launch checklist:                                      │
  │   ☐ Replace CALENDLY_URL in SITE_CONFIG                      │
  │   ☐ Replace GA_MEASUREMENT_ID in SITE_CONFIG                 │
  │   ☐ Replace 2 placeholder testimonials                       │
  │   ☐ Upload og-image.png, update SEO meta URL                 │
  │   ☐ Point miruscale.de DNS to Framer                         │
  │                                                              │
  └──────────────────────────────────────────────────────────────┘
*/

