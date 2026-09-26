'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  Check,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
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
import Reveal from '@/components/Reveal';

// ── Flavour entries ─────────────────────────────────────────────────────────
// Each product is either a single flavour (badam milk, lassi) or a set of
// variants (milkshake, smoothie). The quiz recommends one specific flavour,
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
interface DrinkQuizProps {
  /** Skip the built-in "Drink Finder" eyebrow/heading — used on the Products
   * page, where that heading is already shown in the hero section above. */
  hideHeading?: boolean;
}

export default function DrinkQuiz({ hideHeading = false }: DrinkQuizProps = {}) {
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
  // Only on an actual step change, so loading the page never steals focus.
  const lastView = useRef({ step, finished });
  useEffect(() => {
    if (lastView.current.step === step && lastView.current.finished === finished) return;
    lastView.current = { step, finished };
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
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : ADVANCE_DELAY_MS,
      );
    },
    [pendingId, step, TOTAL],
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

  return (
    <section id="quiz" className="py-16 sm:py-24 lg:py-[96px] px-5 sm:px-10 lg:px-20" style={{ background: 'var(--bg-light)' }} aria-label="Drink finder quiz">
      <div className="max-w-[1280px] mx-auto">
        {!hideHeading && (
          <Reveal className="flex flex-col lg:flex-row justify-between lg:items-end gap-5 mb-8 sm:mb-10">
            <div>
              <p className="mb-4 text-[13px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-on-light)' }}>
                Drink Finder
              </p>
              <h2 className="text-[34px] sm:text-[44px] lg:text-[56px] leading-[1.02] font-medium tracking-[-0.02em]" style={{ color: 'var(--text-on-light)' }}>
                Find your perfect drink
              </h2>
            </div>
            <p className="max-w-[420px] text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-on-light-muted)' }}>
              Four quick questions on weather, mood, goal and flavour. We&apos;ll match you to one of seven flavours.
            </p>
          </Reveal>
        )}

        <Reveal delay={120} className="grid lg:grid-cols-[400px_minmax(0,1fr)] rounded overflow-hidden bg-[var(--surface-light)]">
          {/* Lifestyle photo panel: extra flourish on larger screens where there's room to spare */}
          <div className="relative hidden sm:block min-h-[320px] lg:min-h-[460px]">
            <Image
              src="/assets/kvs/lifestyle-berry-chill.webp"
              alt="A woman enjoying a Sunfeast Berry Smoothie at home"
              fill
              sizes="400px"
              className="object-cover object-[68%_35%]"
              unoptimized
            />
          </div>

          <div className="relative p-5 sm:p-9 lg:p-10 overflow-hidden">
          <div className="relative z-10">
              {!finished ? (
                <div key="quiz">
                  {/* ── Stepper ─────────────────────────────────────────── */}
                  <nav aria-label="Quiz progress" className="mb-8">
                    <ol className="grid grid-cols-4 gap-2">
                      {QUESTIONS.map((q, i) => {
                        const done = answers[i] !== null && i !== step;
                        const current = i === step;
                        return (
                          <li key={q.id} aria-current={current ? 'step' : undefined}>
                            <div className="h-[3px] overflow-hidden" style={{ background: 'rgba(29,15,9,0.15)' }}>
                              <div
                                className="h-full transition-[width] duration-[350ms] ease-out"
                                style={{ background: 'var(--text-on-light)', width: done || current ? '100%' : '0%' }}
                              />
                            </div>
                            <span
                              className="mt-2 block text-[13px] transition-colors"
                              style={{
                                color: current ? 'var(--text-on-light)' : 'var(--text-on-light-muted)',
                                fontWeight: current ? 600 : 400,
                              }}
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
                  <div key={step} className="quiz-step">
                      <div className="mb-6">
                        <h3
                          ref={headingRef}
                          tabIndex={-1}
                          id={`q-${question.id}`}
                          className="text-2xl sm:text-[2rem] font-medium leading-tight outline-none"
                          style={{ color: 'var(--text-on-light)' }}
                        >
                          {question.question}
                        </h3>
                        <p className="text-[15px] mt-2" style={{ color: 'var(--text-on-light-muted)' }}>{question.subtitle}</p>
                      </div>

                      <div
                        role="radiogroup"
                        aria-labelledby={`q-${question.id}`}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                      >
                        {question.options.map((option, idx) => {
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
                              className={`group relative flex items-center gap-3.5 min-h-[72px] px-[18px] py-3.5 rounded text-left cursor-pointer border transition-[border-color,background-color,opacity] duration-200 ${dimmed ? 'opacity-40' : 'opacity-100'}`}
                              style={{
                                background: selected ? 'var(--text-on-light)' : 'var(--bg-light)',
                                color: selected ? 'var(--bg-light)' : 'var(--text-on-light)',
                                borderColor: selected ? 'var(--text-on-light)' : 'var(--border-on-light-strong)',
                              }}
                            >
                              <span className="min-w-0 flex-1 flex flex-col gap-0.5">
                                <span className="text-base font-medium">
                                  {option.label}
                                </span>
                                <span className="text-sm opacity-80">
                                  {option.sublabel}
                                </span>
                              </span>

                              <span
                                className="w-[26px] h-[26px] rounded-full border flex items-center justify-center text-xs shrink-0"
                                style={{ borderColor: selected ? 'var(--bg-light)' : 'var(--border-on-light-strong)' }}
                              >
                                {selected ? <Check size={13} strokeWidth={3} aria-hidden /> : idx + 1}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="min-h-[44px] pt-[18px]">
                        {step > 0 && (
                          <button
                            type="button"
                            onClick={goBack}
                            className="inline-flex items-center gap-1 text-[15px] cursor-pointer"
                            style={{ color: 'var(--text-on-light-muted)' }}
                          >
                            ← Back to {QUESTIONS[step - 1].step.toLowerCase()}
                          </button>
                        )}
                      </div>
                  </div>
                </div>
              ) : (
                result && (
                  <div key="result" className="panel-in">
                    <ResultView
                      entry={result}
                      runnerUp={runnerUp}
                      answers={answers}
                      headingRef={headingRef}
                      onRetake={retake}
                    />
                  </div>
                )
              )}
          </div>
          </div>
        </Reveal>
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
          className="relative w-full max-w-[320px] aspect-[4/5] overflow-hidden flex items-center justify-center rounded"
          style={{ background: `color-mix(in srgb, ${accentColor} 22%, #F2E8D5)` }}
        >
          <div className="relative w-40 h-56">
            <Image
              src={displayImage}
              alt={displayName}
              fill
              sizes="(max-width: 1024px) 60vw, 320px"
              className="object-contain object-bottom drop-shadow-[0_18px_18px_rgba(9,5,3,0.25)]"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="lg:col-span-7 space-y-5">
        <div>
          <p className="text-[13px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-on-light)' }}>Your match</p>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="text-3xl sm:text-4xl font-medium mt-2.5 leading-tight outline-none"
            style={{ color: 'var(--text-on-light)' }}
          >
            {displayName}
          </h3>
          {displayTagline && (
            <p className="text-[15px] italic mt-1.5" style={{ color: 'var(--text-on-light-muted)' }}>&ldquo;{displayTagline}&rdquo;</p>
          )}
        </div>

        {/* What they picked, so the match feels earned */}
        <ul className="flex flex-wrap gap-2" aria-label="Your answers">
          {answers.map((a) =>
            a ? (
              <li
                key={a.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border"
                style={{ color: 'var(--text-on-light)', borderColor: 'var(--border-on-light)' }}
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
                <li key={bullet} className="flex items-start gap-2.5 text-sm leading-snug" style={{ color: 'var(--text-on-light-muted)' }}>
                  <CheckCircle2 size={17} className="shrink-0 mt-0.5" style={{ color: accentColor }} aria-hidden />
                  {bullet}
                </li>
              ))}
            </ul>

            <aside className="p-4 rounded" style={{ background: 'var(--bg-light)' }}>
              <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--accent-on-light)' }}>Did you know?</p>
              <p className="text-[15px] leading-relaxed" style={{ color: 'var(--text-on-light)' }}>{rec.fact}</p>
            </aside>
          </>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            href={`/product/${product.id}`}
            className="btn-dark h-12 px-6 rounded-full text-sm font-semibold inline-flex items-center gap-2 tracking-[0.04em] uppercase"
          >
            View product
            <ArrowRight size={15} aria-hidden />
          </Link>
          <button
            type="button"
            onClick={onRetake}
            className="btn-outline-dark h-12 px-5 rounded-full text-sm font-semibold inline-flex items-center gap-1.5 tracking-[0.04em] uppercase"
          >
            <RotateCcw size={14} aria-hidden />
            Retake quiz
          </button>
        </div>

        {runnerUp && (
          <p className="text-sm" style={{ color: 'var(--text-on-light-muted)' }}>
            Also a good fit:{' '}
            <Link
              href={`/product/${runnerUp.product.id}`}
              className="underline underline-offset-4"
              style={{ color: 'var(--text-on-light)' }}
            >
              {runnerUp.variant?.name || runnerUp.product.name}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}