'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Check,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  ChevronLeft,
  Sun,
  Snowflake,
  CloudRain,
  CloudSun,
  BatteryLow,
  Zap,
  Brain,
  Leaf,
  Droplets,
  Flame,
  Sprout,
  ShieldCheck,
  Cookie,
  Cherry,
  Crown,
  Milk,
} from 'lucide-react';
import { PRODUCTS, Product, ProductVariant } from '@/data/products';

// ── Flavour entries ─────────────────────────────────────────────────────────
// Each product is either a single flavour (badam milk, lassi) or a set of
// variants (milkshake, smoothie) — the quiz recommends one specific flavour,
// so it scores/ranks over the flattened list rather than raw products.
interface FlavourEntry {
  key: string;
  product: Product;
  variant: ProductVariant | null;
}

const FLAVOUR_ENTRIES: FlavourEntry[] = PRODUCTS.flatMap((product): FlavourEntry[] =>
  product.variants.length > 0
    ? product.variants.map((variant) => ({ key: variant.id, product, variant }))
    : [{ key: product.id, product, variant: null }],
);

// ── Recommendation copy ─────────────────────────────────────────────────────
interface ProductRecommendationData {
  whyMatches: string[];
  fact: string;
}

const RECOMMENDATIONS: Record<string, ProductRecommendationData> = {
  'var-mango': {
    whyMatches: [
      '25% real Ratnagiri Alphonso mango chunks deliver authentic fruit texture and sustained natural energy.',
      'Wholesome dairy base restores fluids and electrolytes lost to warm Indian weather.',
      'Rich in natural Vitamin A and fruit fibre with zero chemical preservatives.',
    ],
    fact:
      'Ratnagiri Alphonso mangoes contain natural digestive enzymes and potassium, which makes a real-fruit smoothie a good pick for summer hydration and post-work recovery.',
  },
  'var-berry': {
    whyMatches: [
      'Dark berries bring antioxidant anthocyanins to help counter everyday oxidative stress.',
      'Real berries and sweet mango together provide immunity-supporting Vitamin C.',
      'A creamy dairy base keeps you going and feels satisfying.',
    ],
    fact:
      'Mixed berries rank among the most antioxidant-dense foods, which is why they show up so often in recovery and wellness drinks.',
  },
  'var-breakfast': {
    whyMatches: [
      'Oats, dates and 4 super seeds bring steady fibre and slow-release energy.',
      '6g of protein per serve to power through a busy morning.',
      'No added sugar, so the sweetness comes from real dates and banana.',
    ],
    fact:
      'Oats are a rich source of beta-glucan fibre, which helps slow digestion and keep energy steadier for longer.',
  },
  'var-choco': {
    whyMatches: [
      'Belgian cocoa gives a rich, feel-good treat on a demanding day.',
      '6.1g dairy protein per serve provides sustained energy and satisfying richness.',
      'Flash UHT processed with no artificial preservatives.',
    ],
    fact:
      'Cocoa naturally contains theobromine and flavanols, a gentler lift than the sharp spike and crash of caffeine.',
  },
  'var-vanilla': {
    whyMatches: [
      'Smooth vanilla and white chocolate notes make for a calm, comforting sip.',
      'Rich standardised milk offers gentle nourishment.',
      'Aseptic carton locks in dairy nutrients for an easy afternoon or evening treat.',
    ],
    fact:
      'Vanilla is one of the most widely loved comfort aromas, and its scent is often used in studies on relaxation.',
  },
  'badam-milk': {
    whyMatches: [
      'Real California almond slivers, rich in Vitamin E and heart-healthy fats.',
      'Saffron and cardamom bring the warmth of traditional homemade badam doodh.',
      '5.2g dairy protein and calcium per 100ml for steady daily stamina.',
    ],
    fact:
      'Almonds are one of the best natural sources of Vitamin E, an antioxidant that helps protect your cells.',
  },
  'aashirvaad-lassi': {
    whyMatches: [
      'Cultured from fresh full-fat curd with live probiotic cultures (over 10⁷ CFU/ml).',
      'Naturally cooling and hydrating on hot days.',
      'Homestyle tang that is easy on the stomach.',
    ],
    fact:
      'Traditional dahi lassi contains Lactobacillus cultures that support gut health and help your body absorb nutrients.',
  },
};

// ── Questions ───────────────────────────────────────────────────────────────
interface QuizOption {
  id: string;
  icon: LucideIcon;
  accent: string; // tint used for icon + hover/selected glow
  label: string;
  sublabel: string;
  scores: Record<string, number>;
}

interface QuizQuestion {
  id: number;
  step: string; // short label for the stepper
  question: string;
  subtitle: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    step: 'Weather',
    question: "What's the weather like today?",
    subtitle: "We'll pick something that suits the day.",
    options: [
      { id: 'hot', icon: Sun, accent: '#F2A33A', label: 'Hot & sunny', sublabel: 'Something icy and refreshing', scores: { 'aashirvaad-lassi': 3, 'var-mango': 3, 'var-berry': 1 } },
      { id: 'cold', icon: Snowflake, accent: '#7CC4F2', label: 'Cold & chilly', sublabel: 'Something rich and warming', scores: { 'var-choco': 3, 'badam-milk': 3, 'var-vanilla': 2 } },
      { id: 'rainy', icon: CloudRain, accent: '#8E9BD8', label: 'Rainy & overcast', sublabel: 'Something cosy to curl up with', scores: { 'var-choco': 3, 'badam-milk': 2, 'var-vanilla': 2 } },
      { id: 'pleasant', icon: CloudSun, accent: '#9CC58A', label: 'Pleasant & mild', sublabel: 'Anything good works', scores: { 'var-mango': 2, 'var-berry': 2, 'aashirvaad-lassi': 2, 'var-choco': 1, 'var-breakfast': 2 } },
    ],
  },
  {
    id: 2,
    step: 'Mood',
    question: 'How are you feeling right now?',
    subtitle: 'Your energy level shapes what will hit the spot.',
    options: [
      { id: 'tired', icon: BatteryLow, accent: '#E08A6B', label: 'Tired & drained', sublabel: 'I need a proper recharge', scores: { 'var-choco': 3, 'badam-milk': 3, 'var-mango': 2, 'var-breakfast': 3 } },
      { id: 'energized', icon: Zap, accent: '#F2C94C', label: 'Energised & active', sublabel: 'Keep the momentum going', scores: { 'var-mango': 3, 'var-berry': 3, 'var-breakfast': 2 } },
      { id: 'stressed', icon: Brain, accent: '#C18FD6', label: 'Stressed & overworked', sublabel: 'I want something comforting', scores: { 'var-choco': 3, 'var-vanilla': 3, 'var-berry': 2 } },
      { id: 'refreshing', icon: Leaf, accent: '#7FCB9B', label: 'In need of a reset', sublabel: 'Something light and reviving', scores: { 'aashirvaad-lassi': 3, 'var-mango': 2, 'var-berry': 2 } },
    ],
  },
  {
    id: 3,
    step: 'Goal',
    question: 'What do you want from your drink?',
    subtitle: 'Pick the one that matters most today.',
    options: [
      { id: 'hydration', icon: Droplets, accent: '#6FB8E8', label: 'Hydration', sublabel: 'Restore fluids and electrolytes', scores: { 'aashirvaad-lassi': 4, 'var-mango': 3, 'var-berry': 2 } },
      { id: 'energy', icon: Flame, accent: '#EE8A4A', label: 'Energy boost', sublabel: 'Steady stamina from dairy protein', scores: { 'var-choco': 4, 'badam-milk': 3, 'var-mango': 2, 'var-breakfast': 3 } },
      { id: 'detox', icon: Sprout, accent: '#8FCB7A', label: 'Easy digestion', sublabel: 'Probiotics and a light feel', scores: { 'aashirvaad-lassi': 4, 'var-berry': 3, 'var-breakfast': 2 } },
      { id: 'immunity', icon: ShieldCheck, accent: '#D9B45A', label: 'Immunity support', sublabel: 'Antioxidants and traditional nourishment', scores: { 'var-berry': 4, 'badam-milk': 4 } },
    ],
  },
  {
    id: 4,
    step: 'Flavour',
    question: 'Which flavour are you craving?',
    subtitle: 'Last one. Go with your gut.',
    options: [
      { id: 'cocoa', icon: Cookie, accent: '#B07A52', label: 'Rich Belgian cocoa', sublabel: 'Deep, decadent chocolate', scores: { 'var-choco': 5, 'var-vanilla': 2 } },
      { id: 'fruits', icon: Cherry, accent: '#F08A5D', label: 'Real fruit', sublabel: 'Alphonso mango and berries', scores: { 'var-mango': 5, 'var-berry': 5, 'var-breakfast': 3 } },
      { id: 'saffron', icon: Crown, accent: '#E3B341', label: 'Saffron & almond', sublabel: 'Kesar with California almonds', scores: { 'badam-milk': 5 } },
      { id: 'curd', icon: Milk, accent: '#DCD3C2', label: 'Cool, tangy lassi', sublabel: 'Thick homestyle curd', scores: { 'aashirvaad-lassi': 5 } },
    ],
  },
];

const ADVANCE_DELAY_MS = 380;

// ── Scoring (pure) ──────────────────────────────────────────────────────────
// Scores are derived from the answer list, so going back never double-counts.
function computeScores(answers: (QuizOption | null)[]) {
  const totals: Record<string, number> = {};
  answers.forEach((opt) => {
    if (!opt) return;
    Object.entries(opt.scores).forEach(([id, pts]) => {
      totals[id] = (totals[id] || 0) + pts;
    });
  });
  return totals;
}

// Ties are broken by the flavour answer (the most explicit preference),
// then by the goal answer, then by catalogue order.
function rankProducts(answers: (QuizOption | null)[]) {
  const totals = computeScores(answers);
  const tieBreak = (key: string) =>
    (answers[3]?.scores[key] || 0) * 100 + (answers[2]?.scores[key] || 0);

  return FLAVOUR_ENTRIES.map((entry) => ({ entry, score: totals[entry.key] || 0 }))
    .sort((a, b) => b.score - a.score || tieBreak(b.entry.key) - tieBreak(a.entry.key));
}

// ── Component ───────────────────────────────────────────────────────────────
export default function DrinkQuiz() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(QuizOption | null)[]>(() => QUESTIONS.map(() => null));
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const TOTAL = QUESTIONS.length;
  const question = QUESTIONS[step];

  const ranking = useMemo(() => (finished ? rankProducts(answers) : []), [finished, answers]);
  const result: FlavourEntry | null = ranking[0]?.entry ?? null;
  const runnerUp: FlavourEntry | null = ranking[1] && ranking[1].score > 0 ? ranking[1].entry : null;

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  // Move focus to the new heading so screen readers announce each question.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step, finished]);

  const select = useCallback(
    (option: QuizOption) => {
      if (pendingId) return; // ignore double clicks during the confirm beat
      setPendingId(option.id);
      setAnswers((prev) => {
        const next = [...prev];
        next[step] = option;
        return next;
      });

      advanceTimer.current = setTimeout(
        () => {
          setPendingId(null);
          if (step + 1 < TOTAL) setStep(step + 1);
          else setFinished(true);
        },
        reduceMotion ? 0 : ADVANCE_DELAY_MS,
      );
    },
    [pendingId, step, TOTAL, reduceMotion],
  );

  const goBack = () => {
    if (step === 0 || pendingId) return;
    setStep((s) => s - 1);
  };

  const retake = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setAnswers(QUESTIONS.map(() => null));
    setPendingId(null);
    setStep(0);
    setFinished(false);
  };

  // Keyboard shortcuts: 1–4 to answer, Backspace to go back.
  useEffect(() => {
    if (finished) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, [contenteditable="true"]')) return;
      const n = Number(e.key);
      if (n >= 1 && n <= question.options.length) {
        e.preventDefault();
        select(question.options[n - 1]);
      } else if (e.key === 'Backspace' && step > 0) {
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, question, select, step]);

  const slide = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 } };

  return (
    <section className="mb-14 sm:mb-16" aria-label="Drink finder quiz">
      <div className="grid lg:grid-cols-[300px_1fr] rounded-3xl overflow-hidden border border-[rgba(212,175,55,0.28)] shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
        {/* Lifestyle photo panel — extra flourish on larger screens where there's room to spare */}
        <div className="relative hidden lg:block">
          <Image
            src="/assets/kvs/lifestyle-berry-chill.webp"
            alt="A woman enjoying a Sunfeast Berry Smoothie at home"
            fill
            sizes="300px"
            className="object-cover object-[68%_35%]"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#140A06]" />
        </div>

        <div className="relative bg-[#140A06] p-5 sm:p-9 overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-[300px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.15) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />

          <div className="relative z-10">
            <AnimatePresence mode="wait" initial={false}>
              {!finished ? (
                <motion.div key="quiz" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  {/* ── Stepper ─────────────────────────────────────────── */}
                  <nav aria-label="Quiz progress" className="mb-8">
                    <p className="text-[13px] text-[var(--gold-light)] mb-3 text-center sm:text-left">
                      Find your perfect drink
                    </p>
                    <ol className="grid grid-cols-4 gap-2">
                      {QUESTIONS.map((q, i) => {
                        const done = answers[i] !== null && i !== step;
                        const current = i === step;
                        return (
                          <li key={q.id} aria-current={current ? 'step' : undefined}>
                            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold-light)]"
                                initial={false}
                                animate={{ width: done ? '100%' : current ? '40%' : '0%' }}
                                transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
                              />
                            </div>
                            <span
                              className={`mt-2 block text-[11px] sm:text-xs transition-colors ${current
                                  ? 'text-[#FAF3E0] font-semibold'
                                  : done
                                    ? 'text-[var(--gold-light)]'
                                    : 'text-[#9C8E7A]'
                                }`}
                            >
                              <span className="sr-only">Step {i + 1} of {TOTAL}: </span>
                              {q.step}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  </nav>

                  {/* ── Question ────────────────────────────────────────── */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      {...slide}
                      transition={{ duration: reduceMotion ? 0.15 : 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="text-center max-w-xl mx-auto mb-7">
                        <h3
                          ref={headingRef}
                          tabIndex={-1}
                          id={`q-${question.id}`}
                          className="font-display text-2xl sm:text-[2rem] font-bold text-[#FAF3E0] leading-tight outline-none"
                        >
                          {question.question}
                        </h3>
                        <p className="text-sm text-[#CBB89D] mt-2">{question.subtitle}</p>
                      </div>

                      <div
                        role="radiogroup"
                        aria-labelledby={`q-${question.id}`}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto"
                      >
                        {question.options.map((option, idx) => {
                          const Icon = option.icon;
                          const selected = pendingId
                            ? pendingId === option.id
                            : answers[step]?.id === option.id;
                          const dimmed = pendingId !== null && !selected;

                          return (
                            <button
                              key={option.id}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onClick={() => select(option)}
                              style={{ ['--accent' as string]: option.accent }}
                              className={`group relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl text-left cursor-pointer border transition-[border-color,background-color,opacity,box-shadow] duration-200
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140A06]
                                ${selected
                                  ? 'border-[var(--gold)] bg-[rgba(212,175,55,0.12)] shadow-[0_0_0_1px_var(--gold),0_12px_30px_-12px_var(--accent)]'
                                  : 'border-[rgba(212,175,55,0.2)] bg-white/[0.02] hover:border-[color:var(--accent)] hover:bg-white/[0.04] hover:shadow-[0_12px_30px_-14px_var(--accent)]'
                                }
                                ${dimmed ? 'opacity-40' : 'opacity-100'}`}
                            >
                              <span
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                                style={{
                                  background: `color-mix(in srgb, ${option.accent} 14%, transparent)`,
                                  color: option.accent,
                                }}
                              >
                                <Icon size={24} strokeWidth={1.6} aria-hidden />
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="block text-[15px] font-semibold text-[#FAF3E0]">
                                  {option.label}
                                </span>
                                <span className="block text-[13px] text-[#B8AD9E] mt-0.5 leading-snug">
                                  {option.sublabel}
                                </span>
                              </span>

                              {selected ? (
                                <motion.span
                                  initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="w-6 h-6 rounded-full bg-[var(--gold)] text-[#120701] flex items-center justify-center shrink-0"
                                >
                                  <Check size={14} strokeWidth={3} aria-hidden />
                                </motion.span>
                              ) : (
                                <kbd
                                  aria-hidden
                                  className="hidden sm:flex w-6 h-6 rounded-md border border-white/10 text-[11px] text-[#9C8E7A] items-center justify-center shrink-0 font-sans"
                                >
                                  {idx + 1}
                                </kbd>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-center min-h-[40px] pt-4">
                        {step > 0 && (
                          <button
                            type="button"
                            onClick={goBack}
                            className="inline-flex items-center gap-1.5 text-[13px] text-[#B8AD9E] hover:text-[#FAF3E0] transition-colors cursor-pointer py-1.5 px-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                          >
                            <ChevronLeft size={15} aria-hidden />
                            Back to {QUESTIONS[step - 1].step.toLowerCase()}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              ) : (
                result && (
                  <motion.div
                    key="result"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ResultView
                      entry={result}
                      runnerUp={runnerUp}
                      answers={answers}
                      headingRef={headingRef}
                      onRetake={retake}
                    />
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Result view ─────────────────────────────────────────────────────────────
function ResultView({
  entry,
  runnerUp,
  answers,
  headingRef,
  onRetake,
}: {
  entry: FlavourEntry;
  runnerUp: FlavourEntry | null;
  answers: (QuizOption | null)[];
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onRetake: () => void;
}) {
  const { product, variant } = entry;
  const rec = RECOMMENDATIONS[entry.key];
  const displayName = variant?.name || product.name;
  const displayTagline = variant?.tagline || product.tagline;
  const displayImage = variant?.image || product.packshot;
  const accentColor = variant?.color || product.accentColor;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Packshot */}
      <div className="lg:col-span-5 flex justify-center">
        <div
          className="relative w-full max-w-[320px] aspect-[7/8] rounded-3xl overflow-hidden flex items-end justify-center p-6"
          style={{
            background: `radial-gradient(ellipse at 50% 85%, ${accentColor}33 0%, #100603 75%)`,
            border: `1px solid ${accentColor}40`,
          }}
        >
          <span
            className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
            style={{
              background: `${accentColor}30`,
              color: product.accentLight,
              border: `1px solid ${accentColor}55`,
            }}
          >
            {product.brand}
          </span>
          <div className="relative w-44 h-60">
            <Image
              src={displayImage}
              alt={displayName}
              fill
              sizes="(max-width: 1024px) 60vw, 320px"
              className="object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="lg:col-span-7 space-y-5">
        <div>
          <p className="text-[13px] text-[var(--gold-light)]">Your match</p>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-3xl sm:text-4xl font-bold text-[#FAF3E0] mt-1 leading-tight outline-none"
          >
            {displayName}
          </h3>
          {displayTagline && (
            <p className="text-sm italic text-[#CBB89D] mt-1.5">&ldquo;{displayTagline}&rdquo;</p>
          )}
        </div>

        {/* What they picked, so the match feels earned */}
        <ul className="flex flex-wrap gap-2" aria-label="Your answers">
          {answers.map((a) =>
            a ? (
              <li
                key={a.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-[#E8DCC6] bg-white/[0.04] border border-white/10"
              >
                <a.icon size={13} style={{ color: a.accent }} aria-hidden />
                {a.label}
              </li>
            ) : null,
          )}
        </ul>

        {rec && (
          <>
            <ul className="space-y-2.5">
              {rec.whyMatches.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-sm text-[#CBB89D] leading-snug">
                  <CheckCircle2 size={17} className="shrink-0 mt-0.5" style={{ color: accentColor }} aria-hidden />
                  {bullet}
                </li>
              ))}
            </ul>

            <aside className="flex items-start gap-3 p-4 rounded-2xl border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.06)]">
              <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-[rgba(212,175,55,0.18)] shrink-0">
                <Lightbulb size={16} className="text-[var(--gold)]" aria-hidden />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-[var(--gold-light)] mb-0.5">Did you know?</p>
                <p className="text-[13px] text-[#FAF3E0] leading-relaxed">{rec.fact}</p>
              </div>
            </aside>
          </>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            href={`/product/${product.id}`}
            className="btn-gold py-3 px-6 rounded-xl text-sm font-bold inline-flex items-center gap-2 transition-transform hover:scale-[1.03] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140A06]"
          >
            View product
            <ArrowRight size={15} className="text-[#120701]" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={onRetake}
            className="btn-secondary py-3 px-5 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          >
            <RotateCcw size={14} aria-hidden />
            Retake quiz
          </button>
        </div>

        {runnerUp && (
          <p className="text-[13px] text-[#9C8E7A]">
            Also a good fit:{' '}
            <Link
              href={`/product/${runnerUp.product.id}`}
              className="text-[#E8DCC6] underline decoration-[rgba(212,175,55,0.4)] underline-offset-4 hover:text-[var(--gold-light)]"
            >
              {runnerUp.variant?.name || runnerUp.product.name}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}