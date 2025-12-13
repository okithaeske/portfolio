"use client";
import "@/lib/three-style-shim";
import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Menu,
  X,
  Download,
  Mail,
  Github,
  Linkedin,
  Moon,
  Sun,
  ArrowUpRight,
  Sparkles,
  Rocket,
  CircuitBoard,
  Check,
} from "lucide-react";
import { CV_URL, PROJECTS, SKILLS, SOCIAL } from "@/data/portfolio";
import type { Project } from "@/data/portfolio";
import SkillsSection from "@/components/SkillsSection";
import ParallaxBackground from "@/components/effects/ParallaxBackground";
import { motion, fadeInUp, staggerContainer } from "@/components/motion";
import SectionDivider from "@/components/effects/SectionDivider";
import { useFontsReady } from "@/lib/useFontsReady";
import {
  Aurora,
  Beams,
  SplitText,
  SpotlightCard,
  StarBorder,
  ClickSpark,
  GradientText,
  CountUp,
  GlareHover,
  TrueFocus,
  AnimatedList,
} from "@appletosolutions/reactbits";
import Reveal from "@/components/animations/Reveal";

type SplitTextProps = React.ComponentProps<typeof SplitText>;
type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary?: string;
  tech?: string[];
  results: string[];
};

type ProcessStep = {
  title: string;
  detail: string;
  helper: string;
};

type GitHubRepo = {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  archived: boolean;
  disabled: boolean;
  fork: boolean;
  private: boolean;
};

const projectGradients = [
  "from-cyan-500 to-teal-500",
  "from-purple-500 to-blue-500",
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-green-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-indigo-500",
];

const updatedFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const formatHighlights = (repo: GitHubRepo) => [
  `⭐ ${repo.stargazers_count.toLocaleString()} stars`,
  `🍴 ${repo.forks_count.toLocaleString()} forks`,
  `Updated ${updatedFormatter.format(new Date(repo.updated_at))}`,
];

const buildTechChips = (repo: GitHubRepo) => {
  const base = repo.language ? [repo.language] : [];
  const topics = Array.isArray(repo.topics) ? repo.topics : [];
  return Array.from(new Set([...base, ...topics])).filter(Boolean).slice(0, 6);
};

const mapRepoToProject = (repo: GitHubRepo, idx: number): Project => ({
  slug: repo.name.toLowerCase(),
  name: repo.name,
  description: repo.description || 'No description yet.',
  gradient: projectGradients[idx % projectGradients.length],
  url: repo.html_url,
  tech: buildTechChips(repo),
  highlights: formatHighlights(repo),
});

const buildHeroStats = (projectCount: number) => {
  const safeCount = Math.max(projectCount, 1);
  return [
    { label: 'Product launches', value: safeCount * 6, suffix: '+', helper: 'Native & web releases' },
    { label: 'Latency reduced', value: 72, suffix: '%', helper: 'Infra + DX program' },
    { label: 'Deploys / month', value: safeCount * 8, suffix: '', helper: 'Steady shipping pace' },
    { label: 'Teams', value: 4, suffix: '', helper: 'Engineers Collabed' },
  ];
};

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

const heroMeta = [
  { label: 'Current mission', value: 'Traveloute platform lead' },
  { label: 'Specialty', value: 'Flutter, Next.js, realtime systems' },
  { label: 'Availability', value: 'Software Engineering' },
];

const heroWins = [
  'Scaled gamified travel companion to 180k MAU',
  'Cut API latency by 72% using queues + edge cache',
  'Mentored 12 engineers across Colombo, SG, and remote',
];

const heroHighlights = [
  { label: 'Operating mode', value: 'Fractional lead or embedded partner' },
  { label: 'Preferred stack', value: 'Flutter · Next.js · Node · Kafka' },
  { label: 'Focus areas', value: 'DX, realtime systems, enablement' },
];

const principleStatements = [
  'Evidence over ego — dashboards & qualitative signals before aesthetics.',
  'Shared design tokens keep Flutter, web, and ops docs in sync.',
  'DX investments (runbooks, pairing, tooling) unlock calm velocity.',
  'Instrumentation and handoffs shipped with every feature flag.',
];

const experienceTimeline: ExperienceEntry[] = [
  {
    company: 'Traveloute',
    role: 'Engineer',
    period: '2024 — Present',
    location: 'Remote · Colombo',
    summary: 'Leading product engineering pods across Flutter, web, and realtime services for the Traveloute platform.',
    tech: ['Flutter', 'Next.js', 'Kafka', 'AWS', 'Node.js'],
    results: [
      'Shipped the v3 Flutter + web companion serving 180k+ MAU with shared design tokens.',
      'Orchestrated a migration from a monolith to event-driven microservices with Kafka and queue-backed workflows.',
      'Rolled out observability, on-call, and enablement rituals so squads deliver calmly at higher velocity.',
    ],
  },
  {
    company: 'Zentara',
    role: 'Engineer',
    period: '2024 — 2025',
    location: 'Remote',
    summary: 'Built the core wellness platform spanning mobile, AI insights, and compliance-ready APIs.',
    tech: ['Flutter', 'Node.js', 'Python', 'MongoDB', 'AWS'],
    results: [
      'Crafted AI-assisted mood tracking and meditation journeys across Flutter and web clients.',
      'Implemented privacy-first data lakes plus HIPAA-aligned APIs and infrastructure.',
      'Ran design/dev reviews and component-library work to keep wellness programs cohesive.',
    ],
  },
  {
    company: 'H Connect International',
    role: 'Information Technology Intern',
    period: 'Oct 2024 — Oct 2025',
    location: 'Colombo, Sri Lanka',
    summary: 'Supported corporate IT with low-code solutions, automation, and day-to-day operations.',
    tech: ['Microsoft Power Apps', 'Power Automate', 'SharePoint', 'Teams'],
    results: [
      'Built internal Power Apps solutions and automation tooling to streamline workflows.',
      'Assisted daily operations with administrative + IT coordination tasks.',
      'Collaborated on UX refinements for internal dashboards to improve efficiency.',
      'Gained hands-on experience with enterprise automation and support practices.',
    ],
  },
];
const processSteps: ProcessStep[] = [
  {
    title: 'Discovery sprints',
    detail: 'Jobs-to-be-done interviews, user journeys, KPI scoreboards.',
    helper: 'Week 1–2',
  },
  {
    title: 'Proof & telemetry',
    detail: 'Prototypes w/ shared tokens, analytics, and success signals.',
    helper: 'Week 3–4',
  },
  {
    title: 'Hardening & scale',
    detail: 'Edge caching, queues, testing, and progressive delivery.',
    helper: 'Week 5–6',
  },
  {
    title: 'Enable & handoff',
    detail: 'Runbooks, documentation, workshops, hiring + onboarding kits.',
    helper: 'Week 7+',
  },
];

const foundationSignals = [
  { label: 'Latency reduced', value: '72%', helper: 'API + queue tuning' },
  { label: 'Launch cadence', value: '8/mo', helper: 'Average deploys' },
  { label: 'Engineers coached', value: '12', helper: 'Across squads' },
];

const contactLinks = [
  { icon: Mail, label: SOCIAL.email, helper: 'Email', href: `mailto:${SOCIAL.email}` },
  { icon: Github, label: 'GitHub', helper: '@okithaeske', href: SOCIAL.github },
  { icon: Linkedin, label: 'LinkedIn', helper: "Let's connect", href: SOCIAL.linkedin },
];

function FontReadySplitText(props: SplitTextProps) {
  const fontsReady = useFontsReady();

  if (!fontsReady) {
    const { text, className, textAlign } = props;
    return (
      <span
        className={className}
        style={textAlign ? { textAlign, display: "inline-block" } : undefined}
      >
        {text}
      </span>
    );
  }

  return <SplitText {...props} />;
}

const HeroCanvas = dynamic(() => import("@/components/effects/HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDark = true;
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [heroVisible, setHeroVisible] = useState(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const githubUsername = useMemo(
    () => SOCIAL.github.replace('https://github.com/', '').replace(/\/$/, ''),
    []
  );
  const [githubProjects, setGithubProjects] = useState<Project[]>([]);
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubError, setGithubError] = useState<string | null>(null);

    useEffect(() => {
    let aborted = false;
    async function loadRepos() {
      setGithubLoading(true);
      try {
        const res = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100`, {
          headers: { Accept: 'application/vnd.github+json' },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`GitHub ${res.status}`);
        const data: GitHubRepo[] = await res.json();
        if (aborted) return;
        const selected = data
          .filter(repo => !repo.private && !repo.archived && !repo.disabled && !repo.fork && !repo.name.startsWith('.'))
          .sort((a, b) => {
            if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count;
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          })
          .slice(0, 4)
          .map((repo, idx) => mapRepoToProject(repo, idx));
        setGithubProjects(selected);
        setGithubError(null);
      } catch (error) {
        if (!aborted) {
          setGithubError(error instanceof Error ? error.message : 'Failed to load GitHub projects');
        }
      } finally {
        if (!aborted) setGithubLoading(false);
      }
    }
    loadRepos();
    return () => {
      aborted = true;
    };
  }, [githubUsername]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const sections = navLinks.map(link => link.id);
        const current = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 120 && rect.bottom >= 120;
          }
          return false;
        });
        if (current) setActiveSection(current);
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mediaQuery) {
      const frame = requestAnimationFrame(() => setPrefersReducedMotion(false));
      return () => cancelAnimationFrame(frame);
    }

    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePreference);
      return () => mediaQuery.removeEventListener('change', updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      const frame = requestAnimationFrame(() => setHeroVisible(false));
      return () => cancelAnimationFrame(frame);
    }

    const target = heroSectionRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setHeroVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry?.isIntersecting) {
        setHeroVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2, rootMargin: "0px 0px -20%" });

    observer.observe(target);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const containerClass = 'mx-auto w-full px-4 sm:px-6 lg:px-8';
  const skills = SKILLS;
  const showcaseProjects = githubProjects.length ? githubProjects : PROJECTS;
  const heroStats = useMemo(() => buildHeroStats(showcaseProjects.length || 1), [showcaseProjects.length]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <ParallaxBackground isDark={isDark} />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        {!prefersReducedMotion && (
          <>
            <div className="absolute inset-0 opacity-80">
              <Aurora
                colorStops={isDark ? ['#22d3ee', '#a855f7', '#0ea5e9'] : ['#0ea5e9', '#22c55e', '#a855f7']}
                amplitude={0.6}
                blend={2.4}
                speed={0.35}
              />
            </div>
            <div className="absolute inset-0 hidden md:block mix-blend-screen opacity-60">
              <Beams beamNumber={8} beamWidth={2} lightColor={isDark ? '#38bdf8' : '#0f172a'} speed={0.3} />
            </div>
          </>
        )}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.3) 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <nav className={`fixed top-0 w-full z-50 ${isDark ? 'bg-gray-950/80' : 'bg-white/80'} backdrop-blur-lg border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`} role="navigation" aria-label="Primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              ESKE
            </div>
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  className={`text-sm font-medium transition-colors ${activeSection === link.id ? 'text-cyan-400' : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  onClick={() => scrollToSection(link.id)}
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => void 0}
                aria-label="Toggle theme"
                className="rounded-full border border-cyan-500/30 p-1 text-cyan-400"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
            <div className="md:hidden flex items-center gap-3">
              <button
                type="button"
                onClick={() => void 0}
                aria-label="Toggle theme"
                className="rounded-full border border-cyan-500/30 p-1 text-cyan-400"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                className="text-gray-300"
                onClick={() => setIsMenuOpen(prev => !prev)}
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className={`${isDark ? 'bg-gray-950/95' : 'bg-white/95'} border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} md:hidden`}>
            <div className="px-4 py-4 space-y-2">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  className={`block w-full text-left px-4 py-2 rounded-lg ${activeSection === link.id ? (isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-50 text-cyan-700') : (isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100')}`}
                  onClick={() => scrollToSection(link.id)}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      
      <section id="home" ref={heroSectionRef} className="relative min-h-screen pt-24 pb-12 md:pt-28 md:pb-16">
        {heroVisible && !prefersReducedMotion && <HeroCanvas isDark={isDark} />}
        <motion.div
          className={`${containerClass} relative z-10 space-y-12`}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="space-y-8">
              <motion.span
                variants={fadeInUp}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-semibold tracking-[0.3em] ${isDark ? 'border-cyan-500/30 text-cyan-200/80' : 'border-cyan-500/40 text-cyan-700/80'}`}
              >
                <Sparkles className="h-4 w-4" /> Product engineer & DX lead
              </motion.span>
              <motion.div variants={fadeInUp}>
                <FontReadySplitText
                  text="Engineering calm velocity for product teams"
                  splitType="words"
                  className={`text-xs uppercase tracking-[0.5em] ${isDark ? 'text-cyan-200/80' : 'text-cyan-600/70'}`}
                  textAlign="left"
                />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <GradientText className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                  Okitha Kaluthotage
                </GradientText>
              </motion.div>
              <motion.p
                className={`text-lg md:text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'} max-w-2xl`}
                variants={fadeInUp}
              >
                I partner with founders and platform teams to validate bets, harden infra, and coach squads so delivery feels calm—even when the roadmap moves fast.
              </motion.p>
              <motion.div variants={fadeInUp} className="space-y-3">
                {heroWins.map(win => (
                  <div
                    key={win}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${isDark ? 'border-white/10 bg-white/5 text-gray-200' : 'border-slate-200 bg-white text-slate-700'}`}
                  >
                    <Check className="h-4 w-4 text-cyan-400" />
                    <span>{win}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap" variants={fadeInUp}>
                <ClickSpark sparkColor="#22d3ee" sparkRadius={32} sparkCount={12}>
                  <StarBorder
                    as="button"
                    onClick={() => scrollToSection('projects')}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 to-teal-500 px-8 py-4 text-lg font-semibold tracking-wide shadow-lg shadow-cyan-500/30 transition-all"
                    color="rgba(14, 165, 233, 0.8)"
                    speed="3.5s"
                  >
                    View case studies
                    <ArrowUpRight className="w-5 h-5" />
                  </StarBorder>
                </ClickSpark>
                <StarBorder
                  as="a"
                  href={CV_URL}
                  download
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold ${isDark ? 'bg-gray-900/70' : 'bg-white/80'} border ${isDark ? 'border-gray-800/70' : 'border-gray-200/80'} backdrop-blur`}
                  aria-label="Download CV as PDF"
                  color="rgba(168, 85, 247, 0.7)"
                  speed="6s"
                >
                  <Download className="w-5 h-5" />
                  Download CV
                </StarBorder>
              </motion.div>
            </div>
            <div className="space-y-6">
              <Reveal disabled>
                <GlareHover
                  className="rounded-3xl"
                  background={isDark ? 'rgba(2, 6, 23, 0.9)' : 'rgba(255,255,255,0.95)'}
                  glareColor="rgba(14, 165, 233, 0.35)"
                  glareOpacity={0.35}
                  borderRadius="1.75rem"
                >
                  <div className={`rounded-3xl border p-8 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/90 shadow-2xl'}`}>
                    <TrueFocus
                      sentence="Product engineering lead · DX coach · Systems thinker"
                      borderColor={isDark ? '#0ea5e9' : '#0ea5e9'}
                      glowColor={isDark ? '#a855f7' : '#7c3aed'}
                    />
                    <div className="mt-6 space-y-3">
                      {heroHighlights.map(item => (
                        <div
                          key={item.label}
                          className={`rounded-2xl border px-4 py-3 text-sm ${isDark ? 'border-white/10 bg-white/5 text-gray-200' : 'border-slate-200 bg-white text-slate-700'}`}
                        >
                          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">{item.label}</p>
                          <p className="text-base font-semibold">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlareHover>
              </Reveal>
              <Reveal disabled>
                <SpotlightCard
                  spotlightColor="rgba(59, 130, 246, 0.25)"
                  className={`rounded-3xl border p-8 backdrop-blur ${isDark ? 'border-cyan-500/20 bg-white/5' : 'border-slate-200 bg-white/90 shadow-2xl'}`}
                >
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Currently partnering on</p>
                  <div className="mt-4 space-y-4">
                    {heroMeta.map(item => (
                      <StarBorder
                        key={item.label}
                        as="div"
                        color="rgba(14, 165, 233, 0.7)"
                        className={`rounded-2xl border px-4 py-3 text-left ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-200 bg-white/70'}`}
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">{item.label}</p>
                        <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.value}</p>
                      </StarBorder>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <StarBorder
                      as="button"
                      onClick={() => scrollToSection('contact')}
                      className="rounded-2xl px-5 py-3 text-sm font-semibold"
                      color="rgba(248, 250, 252, 0.9)"
                    >
                      Book a call
                    </StarBorder>
                    <StarBorder
                      as="a"
                      href={SOCIAL.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-2xl px-5 py-3 text-sm font-semibold"
                      color="rgba(14, 165, 233, 0.7)"
                    >
                      LinkedIn profile
                    </StarBorder>
                  </div>
                </SpotlightCard>
              </Reveal>
            </div>
          </div>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {heroStats.map((stat, idx) => (
              <Reveal key={stat.label} delay={idx * 90}>
                <div className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/90 shadow-xl'}`}>
                  <div className="flex items-baseline gap-1 text-3xl font-bold">
                    <CountUp to={stat.value} startWhen className="leading-none" />
                    <span className="text-xl font-semibold text-cyan-400">{stat.suffix}</span>
                  </div>
                  <p className={`mt-2 text-xs uppercase tracking-[0.3em] ${isDark ? 'text-cyan-200/70' : 'text-cyan-700/70'}`}>{stat.label}</p>
                  <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.helper}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </motion.div>
      </section>
      <SectionDivider />

      <section id="projects" className="py-16 md:py-20" aria-labelledby="projects-title">
        <div className={`${containerClass} max-w-6xl`}>
          <div className="text-center mb-12 space-y-4">
            <FontReadySplitText
              text="Selected Work"
              splitType="chars"
              className={`text-sm font-semibold uppercase tracking-[0.4em] ${isDark ? 'text-cyan-200/80' : 'text-cyan-600/70'}`}
              textAlign="center"
            />
            <h2 id="projects-title" className="text-4xl font-bold">
              <GradientText>Systems with measurable impact</GradientText>
            </h2>
            <p className={`mx-auto max-w-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Every engagement pairs delightful UX with observability, enablement, and business instrumentation.
            </p>
          </div>
          {githubLoading && !githubProjects.length && (
            <p className="mb-6 text-center text-sm text-cyan-300/80">
              Fetching the latest GitHub projects...
            </p>
          )}
          {githubError && (
            <p className="mb-6 text-center text-sm text-rose-400">
              Couldn&apos;t reach GitHub ({githubError}). Showing saved highlights instead.
            </p>
          )}
          <div className="grid gap-8 lg:grid-cols-2">
            {showcaseProjects.map((project, idx) => (
              <Reveal key={project.slug} delay={idx * 110}>
                <SpotlightCard
                  spotlightColor={isDark ? 'rgba(34, 211, 238, 0.2)' : 'rgba(99, 102, 241, 0.15)'}
                  className={`h-full rounded-3xl border p-8 backdrop-blur ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/90 shadow-xl'}`}
                >
                  <div className={`inline-flex items-center gap-2 rounded-2xl bg-linear-to-r ${project.gradient} px-4 py-2 text-white`}>
                    <span className="text-sm font-semibold uppercase tracking-[0.3em]">{project.slug}</span>
                    <span className="text-lg font-bold">{project.name}</span>
                  </div>
                  <p className={`mt-4 text-base leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {project.description}
                  </p>
                  <ul className={`mt-4 space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {(project.highlights || ['Telemetry + launch playbooks', 'DX coaching for the team']).map((highlight, hIdx) => (
                      <li key={`${project.slug}-highlight-${hIdx}`} className="flex gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-300 shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm">
                    {project.tech.map(tech => (
                      <span
                        key={`${project.slug}-${tech}`}
                        className={`rounded-full px-3 py-1 ${isDark ? 'bg-white/5 text-cyan-100/90' : 'bg-slate-100 text-slate-700'}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.url && (
                    <StarBorder
                      as="a"
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
                      color="rgba(14, 165, 233, 0.8)"
                    >
                      Visit project
                      <ArrowUpRight className="w-4 h-4" />
                    </StarBorder>
                  )}
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>



      <SectionDivider />

      <section id="experience" className="py-16 md:py-20">
        <div className={`${containerClass} max-w-6xl`}>
          <div className="text-center mb-12 space-y-4">
            <FontReadySplitText
              text="Experience"
              splitType="chars"
              className={`text-sm font-semibold uppercase tracking-[0.4em] ${isDark ? 'text-cyan-200/80' : 'text-cyan-600/70'}`}
              textAlign="center"
            />
            <h2 className="text-4xl font-bold">
              <GradientText>From scrappy prototypes to regulated platforms</GradientText>
            </h2>
          </div>
          <div className="space-y-8">
            {experienceTimeline.map((entry, idx) => (
              <Reveal key={entry.company} delay={idx * 90}>
                <SpotlightCard
                  spotlightColor="rgba(14, 165, 233, 0.15)"
                  className={`rounded-3xl border p-8 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/95 shadow-lg'}`}
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <h3 className="text-2xl font-semibold">{entry.company}</h3>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{entry.role}</div>
                    <div className={`ml-auto text-sm font-semibold ${isDark ? 'text-cyan-200' : 'text-cyan-600'}`}>{entry.period}</div>
                  </div>
                  <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{entry.location}</p>
                  {entry.summary && (
                    <p className={`mt-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{entry.summary}</p>
                  )}
                  <div className="mt-4 grid gap-2">
                    {entry.results.map((result, resultIdx) => (
                      <div key={`${entry.company}-result-${resultIdx}`} className={`rounded-2xl border px-4 py-3 text-sm ${isDark ? 'border-white/10 bg-white/5 text-gray-200' : 'border-slate-200 bg-white text-gray-700'}`}>
                        {result}
                      </div>
                    ))}
                  </div>
                  {entry.tech && entry.tech.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      {entry.tech.map(tag => (
                        <span key={`${entry.company}-${tag}`} className={`rounded-full px-3 py-1 ${isDark ? 'bg-white/5 text-gray-200' : 'bg-slate-100 text-slate-700'}`}>{tag}</span>
                      ))}
                    </div>
                  )}
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider flip />

      <section id="skills" className="py-16 md:py-20">
        <SkillsSection isDark={isDark} username={SOCIAL.github.replace('https://github.com/','')} baseSkills={skills} />
      </section>

      <section className="py-16 md:py-20">
        <div className={`${containerClass} max-w-6xl grid gap-8 lg:grid-cols-[2fr_3fr]`}>
          <SpotlightCard
            spotlightColor="rgba(248, 113, 113, 0.2)"
            className={`rounded-3xl border p-8 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/95 shadow-lg'}`}
          >
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <Rocket className="w-6 h-6 text-rose-400" />
              Operating cadence
            </h3>
            <p className={`mt-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Repeatable rituals keep teams aligned. Here is the rhythm I plug into squads.
            </p>
            <div className="mt-6 grid gap-4">
              {processSteps.map(step => (
                <StarBorder
                  key={step.title}
                  as="div"
                  color="rgba(248, 113, 113, 0.6)"
                  className={`rounded-2xl border px-4 py-3 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/90'}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">{step.helper}</p>
                    <ArrowUpRight className="w-4 h-4 text-rose-400" />
                  </div>
                  <p className="text-lg font-semibold">{step.title}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{step.detail}</p>
                </StarBorder>
              ))}
            </div>
          </SpotlightCard>

          <SpotlightCard
            spotlightColor="rgba(14, 165, 233, 0.2)"
            className={`rounded-3xl border p-8 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/95 shadow-lg'}`}
          >
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <CircuitBoard className="w-6 h-6 text-cyan-400" />
              Principles on repeat
            </h3>
            <AnimatedList
              items={principleStatements}
              className="mt-6 space-y-3"
              itemClassName={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${isDark ? 'border-white/10 bg-white/5 text-gray-200' : 'border-slate-200 bg-white text-gray-700'}`}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {foundationSignals.map(signal => (
                <StarBorder
                  key={signal.label}
                  as="div"
                  color="rgba(14, 165, 233, 0.6)"
                  className={`rounded-2xl border px-4 py-3 text-left ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/90'}`}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">{signal.label}</p>
                  <p className="text-2xl font-bold">{signal.value}</p>
                  <p className={`text-xs tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{signal.helper}</p>
                </StarBorder>
              ))}
            </div>
          </SpotlightCard>
        </div>
      </section>

      <SectionDivider />

      <section id="contact" className="py-16 md:py-20">
        <div className={`${containerClass} max-w-6xl grid gap-10 lg:grid-cols-[2fr_3fr]`}>
          <SpotlightCard
            spotlightColor="rgba(34, 211, 238, 0.2)"
            className={`rounded-3xl border p-8 backdrop-blur ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/95 shadow-xl'}`}
          >
            <h3 className="text-3xl font-bold">Let&apos;s build calm velocity together</h3>
            <p className={`mt-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Whether you need a zero-to-one pod, a platform tune-up, or coaching for your engineers, reach out.
            </p>
            <div className="mt-6 space-y-4">
              {contactLinks.map(({ icon: Icon, label, helper, href }) => (
                <GlareHover
                  key={label}
                  className="rounded-2xl"
                  background={isDark ? 'rgba(3,7,18,0.85)' : 'rgba(255,255,255,0.95)'}
                  glareColor="rgba(94, 234, 212, 0.4)"
                  glareOpacity={0.3}
                  borderRadius="1.5rem"
                >
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`flex items-center gap-4 rounded-2xl border px-4 py-3 ${isDark ? 'border-white/5 hover:border-cyan-400/40' : 'border-slate-200 hover:border-cyan-400/40'} transition-colors`}
                  >
                    <Icon className="w-6 h-6 text-cyan-400" />
                    <div className="text-left">
                      <p className="font-semibold">{label}</p>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{helper}</span>
                    </div>
                  </a>
                </GlareHover>
              ))}
            </div>
            <div className="mt-8 space-y-2 text-sm text-gray-400">
              <p>Based in Colombo · partnering remotely with teams across APAC and beyond.</p>
              <p>Available for fractional leadership, architecture reviews, and hands-on build cycles.</p>
            </div>
          </SpotlightCard>

          <SpotlightCard
            spotlightColor="rgba(192, 38, 211, 0.15)"
            className={`rounded-3xl border p-8 backdrop-blur ${isDark ? 'border-purple-500/20 bg-white/5' : 'border-purple-200 bg-white/95 shadow-xl'}`}
          >
            <h3 className="text-2xl font-bold mb-6">Send a message</h3>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const data = new FormData(form);
                const name = String(data.get('name') || '').trim();
                const email = String(data.get('email') || '').trim();
                const message = String(data.get('message') || '').trim();
                if (!name || !email || !message) {
                  alert('Please fill in all fields.');
                  return;
                }
                alert('Thanks! Hook this form up to your preferred provider to send messages.');
                form.reset();
              }}
              aria-label="Contact form"
            >
              <input type="text" name="name" placeholder="Your Name" required className={`w-full rounded-2xl border px-4 py-3 ${isDark ? 'border-white/10 bg-white/5 text-white placeholder-gray-500' : 'border-slate-200 bg-white placeholder-gray-400'} focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none transition-all duration-300`} />
              <input type="email" name="email" placeholder="Your Email" required className={`w-full rounded-2xl border px-4 py-3 ${isDark ? 'border-white/10 bg-white/5 text-white placeholder-gray-500' : 'border-slate-200 bg-white placeholder-gray-400'} focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none transition-all duration-300`} />
              <textarea name="message" placeholder="Your Message" rows={4} required className={`w-full rounded-2xl border px-4 py-3 ${isDark ? 'border-white/10 bg-white/5 text-white placeholder-gray-500' : 'border-slate-200 bg-white placeholder-gray-400'} focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none transition-all duration-300`} />
              <ClickSpark sparkColor="#c084fc" sparkRadius={28} sparkCount={10}>
                <StarBorder
                  as="button"
                  type="submit"
                  className="w-full rounded-2xl bg-linear-to-r from-purple-500 to-cyan-500 px-8 py-4 text-lg font-semibold tracking-wide"
                  color="rgba(248, 250, 252, 0.9)"
                  speed="4s"
                >
                  Send message
                </StarBorder>
              </ClickSpark>
            </form>
          </SpotlightCard>
        </div>
      </section>

      <footer className={`py-8 border-t ${isDark ? 'border-white/5 bg-gray-950/50' : 'border-gray-200 bg-gray-50/50'}`}>
        <div className={`${containerClass} max-w-6xl text-center`}>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            © {new Date().getFullYear()} Okitha Kaluthotage · Built with Next.js, Tailwind, and a lot of coffee.
          </p>
        </div>
      </footer>
    </div>
  );
}
