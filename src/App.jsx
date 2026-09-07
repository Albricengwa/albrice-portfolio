import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Mail,
  MapPin,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Award,
  Clock,
  Menu,
  X,
  Upload,
  Download,
  ExternalLink,
  Code2,
  Brain,
  TrendingUp,
  Bot,
  Globe,
  Lightbulb,
  Megaphone,
  Palette,
  BarChart3,
  Briefcase,
  GraduationCap,
  Link2,
  GitBranch,
} from 'lucide-react'
import { usePortfolio } from './context/PortfolioContext'

gsap.registerPlugin(ScrollTrigger)

/* ----------------------------------------------------------------
   SCROLL REVEAL HOOK — reliable replacement for GSAP from()
---------------------------------------------------------------- */
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

const ICON_MAP = {
  Brain, Code2, TrendingUp, Bot, Globe, Lightbulb, Megaphone, Palette, BarChart3,
  Award, ShieldCheck, Clock, Briefcase, GraduationCap,
}

function getIcon(name) {
  return ICON_MAP[name] || Code2
}

/* ----------------------------------------------------------------
   NAV
---------------------------------------------------------------- */
const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const { data } = usePortfolio()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          scrolled ? 'glass shadow-lg shadow-primary/10' : 'bg-transparent'
        } rounded-full px-4 sm:px-6 py-2.5 w-[calc(100%-2rem)] max-w-5xl`}
      >
        <div className="flex items-center justify-between gap-6">
          <a href="#home" className="flex items-center gap-2 group">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <span className="font-display font-bold text-white text-lg">A</span>
              <span className="absolute inset-0 rounded-full ring-2 ring-primary/30 group-hover:ring-primary/50 transition" />
            </span>
            <span className={`font-display font-bold tracking-tight text-lg ${scrolled ? 'text-ink' : 'text-white'} transition-colors hidden sm:inline`}>
              {data.profile.name.split(' ')[0]}
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`text-sm font-medium tracking-tight lift-on-hover ${
                  scrolled ? 'text-ink/70 hover:text-accent' : 'text-white/90 hover:text-white'
                } transition-colors`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="hidden lg:inline-flex magnetic-btn items-center gap-1.5 bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-accent/30"
          >
            Hire Me
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
          </a>

          <button
            onClick={() => setOpen(true)}
            className={`lg:hidden p-2 rounded-full ${scrolled ? 'text-ink' : 'text-white'}`}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-[60] transition-all duration-500 lg:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-deep/90 backdrop-blur-2xl" onClick={() => setOpen(false)} />
        <div className={`absolute top-0 left-0 right-0 bg-background rounded-b-5xl px-6 pt-8 pb-12 transition-transform duration-500 ${open ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex items-center justify-between mb-10">
            <span className="font-display font-bold text-xl text-ink">{data.profile.name.split(' ')[0]}</span>
            <button onClick={() => setOpen(false)} className="p-2 rounded-full bg-divider/40">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="font-display text-3xl font-semibold text-ink py-3 border-b border-divider">
                {link.label}
              </a>
            ))}
          </div>
          <a href="#contact" onClick={() => setOpen(false)} className="mt-8 magnetic-btn flex items-center justify-center gap-2 bg-accent text-white px-6 py-4 rounded-full font-semibold w-full">
            Hire Me <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </>
  )
}

/* ----------------------------------------------------------------
   HERO
---------------------------------------------------------------- */
function Hero() {
  const { data } = usePortfolio()

  return (
    <section id="home" className="relative min-h-[100dvh] w-full overflow-hidden">
      <style>{`
        @keyframes hero-rise-1 { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hero-rise-2 { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hero-rise-3 { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .hero-line-1 { animation: hero-rise-1 1s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        .hero-line-2 { animation: hero-rise-2 1.2s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
        .hero-meta-anim { animation: hero-rise-3 0.8s cubic-bezier(0.16,1,0.3,1) 0.8s both; }
        .hero-cta-anim { animation: hero-rise-3 0.8s cubic-bezier(0.16,1,0.3,1) 1s both; }
        .hero-photo-anim { animation: hero-rise-3 0.8s cubic-bezier(0.16,1,0.3,1) 1.1s both; }
      `}</style>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #323120 0%, #442A22 40%, #5D4037 70%, #8B5E3C 100%)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/30 to-transparent" />
      </div>

      {/* Floating code particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-[18%] h-2 w-2 rounded-full bg-accent/60 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[55%] right-[10%] h-1.5 w-1.5 rounded-full bg-white/40 animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[40%] right-[26%] h-1 w-1 rounded-full bg-accent/70 animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[30%] left-[12%] h-1.5 w-1.5 rounded-full bg-white/30 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[65%] left-[22%] h-1 w-1 rounded-full bg-accent/50 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Top frame */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <div>
            <p className="hero-meta-anim font-mono text-xs uppercase tracking-[0.25em] text-white/60 mb-6">
              {data.profile.location}
            </p>
            <h1 className="font-display font-extrabold text-white leading-[0.95] tracking-tight">
              <span className="hero-line-1 block text-4xl sm:text-5xl md:text-6xl">
                {data.profile.title}
              </span>
              <span className="hero-line-2 block font-serif italic font-medium text-accent text-5xl sm:text-6xl md:text-7xl mt-2" style={{ lineHeight: '0.95' }}>
                Building the future.
              </span>
            </h1>

            <p className="hero-meta-anim max-w-xl text-white/70 text-base sm:text-lg mt-8 leading-relaxed">
              {data.profile.summary}
            </p>

            <div className="hero-cta-anim mt-10 flex flex-wrap gap-4">
              <a href="#contact" className="magnetic-btn group inline-flex items-center justify-center gap-2 bg-accent text-white font-semibold px-7 py-4 rounded-full shadow-2xl shadow-accent/40">
                Get in Touch
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="#projects" className="lift-on-hover inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 font-medium px-7 py-4 rounded-full">
                <Briefcase className="h-4 w-4" />
                View Projects
              </a>
            </div>
          </div>

          {/* Photo side */}
          <div className="hero-photo-anim hidden lg:flex justify-center">
            {data.profile.photoUrl ? (
              <img src={data.profile.photoUrl} alt={data.profile.name} className="w-80 h-80 object-cover rounded-5xl shadow-2xl shadow-black/40 border-2 border-white/10" />
            ) : (
              <div className="w-80 h-80 rounded-5xl bg-white/5 border-2 border-white/10 flex items-center justify-center backdrop-blur-sm">
                <span className="font-display font-bold text-8xl text-white/20">
                  {data.profile.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-6 sm:right-12 hidden md:flex flex-col items-center gap-2 text-white/50">
          <span className="font-mono uppercase text-[10px] tracking-[0.3em]">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   CODE BRACKET SIGNATURE ANIMATION (Tech/AI theme)
---------------------------------------------------------------- */
function CodeSignatureAnim() {
  const [statusIdx, setStatusIdx] = useState(0)
  const [count, setCount] = useState(12)

  const statuses = [
    { text: 'Analyzing requirements...', label: 'Scanning', tone: 'accent' },
    { text: 'AI model processing', label: 'Active', tone: 'primary' },
    { text: 'Solution deployed · live', label: 'Complete', tone: 'emerald' },
    { text: 'Monitoring performance', label: 'Stable', tone: 'emerald' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((idx) => {
        const next = (idx + 1) % statuses.length
        if (next === 2) setCount((c) => c + 1)
        return next
      })
    }, 2300)
    return () => clearInterval(interval)
  }, [])

  const codeLines = [
    { left: '12%', delay: '0.0s', dur: '2.6s', size: 14 },
    { left: '28%', delay: '1.3s', dur: '3.0s', size: 11 },
    { left: '42%', delay: '0.6s', dur: '2.8s', size: 16 },
    { left: '55%', delay: '1.8s', dur: '2.4s', size: 12 },
    { left: '68%', delay: '0.9s', dur: '3.1s', size: 15 },
    { left: '80%', delay: '2.0s', dur: '2.7s', size: 11 },
    { left: '90%', delay: '0.4s', dur: '2.9s', size: 14 },
  ]

  const ripples = [
    { left: '25%', delay: '0.2s' },
    { left: '50%', delay: '1.0s' },
    { left: '75%', delay: '1.8s' },
  ]

  const status = statuses[statusIdx]
  const toneText = status.tone === 'emerald' ? 'text-emerald-600' : status.tone === 'accent' ? 'text-accent' : 'text-primary'
  const toneDot = status.tone === 'emerald' ? 'bg-emerald-500' : status.tone === 'accent' ? 'bg-accent' : 'bg-primary'

  return (
    <div className="relative h-44 w-full rounded-3xl overflow-hidden border border-accent/15" style={{ background: 'linear-gradient(180deg, #F9F5F0 0%, #F2E9E4 70%, #E7E3CA 100%)' }}>
      <div className="absolute -top-8 -left-6 h-20 w-32 rounded-full bg-white/60 blur-2xl" />
      <div className="absolute top-2 right-10 h-14 w-24 rounded-full bg-white/50 blur-xl" />

      {/* Header */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">AI Pipeline</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-display font-bold text-sm text-ink tabular-nums">{String(count).padStart(2, '0')}</span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted">deployed</span>
        </div>
      </div>

      {/* Code bracket bar */}
      <svg className="absolute left-3 right-3 top-9 h-5" viewBox="0 0 400 20" preserveAspectRatio="none">
        <rect x="0" y="6" width="400" height="8" rx="4" fill="#A0522D" fillOpacity="0.15" />
        <rect x="0" y="7" width="400" height="2" fill="#8B5E3C" fillOpacity="0.3" />
        <rect x="0" y="4" width="6" height="12" rx="1.5" fill="#A0522D" fillOpacity="0.5" />
        <rect x="394" y="4" width="6" height="12" rx="1.5" fill="#A0522D" fillOpacity="0.5" />
        {[60, 152, 248, 340].map((x) => (
          <g key={x}>
            <rect x={x - 3} y="2" width="6" height="6" rx="1" fill="#8B5E3C" />
            <rect x={x - 4} y="13" width="8" height="3" rx="1" fill="#8B5E3C" fillOpacity="0.7" />
          </g>
        ))}
      </svg>

      {/* Falling code brackets */}
      <div className="absolute inset-x-0 top-14 bottom-11 overflow-hidden">
        {codeLines.map((d, i) => (
          <svg key={i} className="absolute top-0" style={{ left: d.left, width: `${d.size}px`, height: `${Math.round(d.size * 1.5)}px`, animation: `code-fall ${d.dur} cubic-bezier(0.55,0.05,0.7,0.45) ${d.delay} infinite`, filter: 'drop-shadow(0 1px 2px rgba(160,82,45,0.3))', transform: 'translateX(-50%)' }} viewBox="0 0 24 36">
            <defs>
              <linearGradient id={`code-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4C3BE" />
                <stop offset="50%" stopColor="#A0522D" />
                <stop offset="100%" stopColor="#8B5E3C" />
              </linearGradient>
            </defs>
            <text x="12" y="24" textAnchor="middle" fontSize="20" fontFamily="monospace" fontWeight="bold" fill={`url(#code-${i})`}>
              {['<', '/', '>', '{', '}', '(', ')'][i % 7]}
            </text>
          </svg>
        ))}
      </div>

      {/* Base line */}
      <svg className="absolute bottom-9 left-3 right-3 h-3" viewBox="0 0 200 12" preserveAspectRatio="none">
        <path d="M 0,6 Q 12.5,2 25,6 T 50,6 T 75,6 T 100,6 T 125,6 T 150,6 T 175,6 T 200,6" fill="none" stroke="#A0522D" strokeOpacity="0.35" strokeWidth="1.2" />
      </svg>

      {/* Ripples */}
      <div className="absolute bottom-[34px] left-3 right-3 h-2">
        {ripples.map((r, i) => (
          <span key={i} className="absolute top-0 -translate-x-1/2 rounded-full border border-accent/40" style={{ left: r.left, width: '4px', height: '4px', animation: `code-ripple 2.4s ease-out ${r.delay} infinite` }} />
        ))}
      </div>

      {/* Status */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`relative h-2 w-2 rounded-full ${toneDot}`}>
            {status.tone === 'accent' && <span className={`absolute inset-0 rounded-full ${toneDot} animate-ping`} />}
          </span>
          <span key={status.text} className={`font-mono text-[10px] truncate ${toneText}`} style={{ animation: 'code-fadein 0.35s ease-out' }}>{status.text}</span>
        </div>
        <span className={`font-mono text-[9px] uppercase tracking-[0.2em] whitespace-nowrap pl-2 ${toneText}`}>{status.label}</span>
      </div>

      <style>{`
        @keyframes code-fall {
          0%   { transform: translate(-50%, -10px); opacity: 0; }
          12%  { opacity: 1; }
          82%  { opacity: 1; }
          100% { transform: translate(-50%, 95px); opacity: 0; }
        }
        @keyframes code-ripple {
          0%   { transform: translateX(-50%) scale(0.4); opacity: 0.9; }
          80%  { transform: translateX(-50%) scale(3.5); opacity: 0; }
          100% { transform: translateX(-50%) scale(3.5); opacity: 0; }
        }
        @keyframes code-fadein {
          from { opacity: 0; transform: translateY(2px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

/* ----------------------------------------------------------------
   SKILL SHUFFLER
---------------------------------------------------------------- */
function SkillShuffler() {
  const { data } = usePortfolio()
  const items = data.skills.slice(0, 3).map((s) => ({
    tag: s.category,
    label: s.items.slice(0, 2).join(' · '),
    count: `${s.items.length} skills`,
  }))
  const [stack, setStack] = useState(items.length > 0 ? items : [{ tag: 'Skills', label: 'Add skills in admin', count: '0' }])

  useEffect(() => {
    if (stack.length <= 1) return
    const interval = setInterval(() => {
      setStack((prev) => { const next = [...prev]; next.unshift(next.pop()); return next })
    }, 3000)
    return () => clearInterval(interval)
  }, [stack.length])

  return (
    <div className="relative h-44 w-full">
      {stack.map((item, i) => (
        <div key={item.tag} style={{ transform: `translate(${i * 14}px, ${i * 14}px) scale(${1 - i * 0.05})`, zIndex: stack.length - i, opacity: 1 - i * 0.25, transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease' }} className="absolute inset-0 bg-white border border-divider rounded-3xl p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-full">{item.tag}</span>
            <span className="font-mono text-xs text-muted">{item.count}</span>
          </div>
          <div className="mt-4 font-display text-lg font-semibold text-ink leading-tight">{item.label}</div>
          <div className="mt-3 flex items-center gap-1.5">
            {Array.from({ length: 24 }).map((_, idx) => (
              <span key={idx} className="h-1 w-1 rounded-full" style={{ background: idx < 24 - i * 6 ? '#A0522D' : '#D4C3BE' }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ----------------------------------------------------------------
   PROJECT CAROUSEL
---------------------------------------------------------------- */
function ProjectCarousel() {
  const { data } = usePortfolio()
  const [step, setStep] = useState(0)
  const projects = data.projects.slice(0, 3)

  useEffect(() => {
    if (projects.length === 0) return
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % Math.max(projects.length, 1))
    }, 2500)
    return () => clearInterval(interval)
  }, [projects.length])

  const current = projects[step] || { title: 'No projects yet', tags: [] }

  return (
    <div className="relative h-44 w-full bg-white border border-divider rounded-3xl p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Portfolio</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {step + 1}/{projects.length || 1}
        </span>
      </div>
      <div className="mt-2">
        <h4 className="font-display font-bold text-xl text-ink leading-tight transition-all duration-300" key={current.title}>{current.title}</h4>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {(current.tags || []).map((tag) => (
            <span key={tag} className="bg-parchment text-primary text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex gap-1.5">
        {projects.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i === step ? 'bg-accent' : 'bg-divider'}`} />
        ))}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------
   FEATURES (3 interactive cards)
---------------------------------------------------------------- */
function Features() {
  const [sectionRef, visible] = useReveal(0.1)

  const cards = [
    { eyebrow: '01 / Expertise', heading: 'Core Skills', sub: 'Full-stack capabilities', text: 'From AI automation and Python backends to responsive frontends, I bring versatile engineering skills to every project.', Component: SkillShuffler },
    { eyebrow: '02 / Process', heading: 'AI Pipeline', sub: 'Intelligent automation', text: 'I build end-to-end AI automation pipelines that analyze, process, and deploy solutions, reducing manual work and boosting output.', Component: CodeSignatureAnim },
    { eyebrow: '03 / Portfolio', heading: 'Projects', sub: 'Real-world results', text: 'Websites, AI integrations, and marketing systems built for real businesses. Each one solves a specific operational challenge.', Component: ProjectCarousel },
  ]

  return (
    <section id="skills" ref={sectionRef} className="relative py-28 sm:py-40 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className={`max-w-3xl mb-16 sm:mb-24 transition-all duration-1000 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">╱ What I Do</span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-ink mt-4 leading-[1.05] tracking-tight">
            Skills & Expertise.
            <span className="block font-serif italic font-medium text-accent mt-1">Three pillars.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <article key={idx} style={{ transitionDelay: visible ? `${idx * 150}ms` : '0ms' }} className={`group relative bg-surface border border-divider rounded-5xl p-7 hover:border-accent/40 transition-all duration-700 ease-out shadow-sm hover:shadow-xl hover:shadow-accent/10 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{card.eyebrow}</span>
                <ArrowUpRight className="h-5 w-5 text-ink/30 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" strokeWidth={1.8} />
              </div>
              <card.Component />
              <div className="mt-6">
                <h3 className="font-display font-bold text-2xl text-ink leading-tight">{card.heading}</h3>
                <p className="font-serif italic text-accent text-sm mt-1">{card.sub}</p>
                <p className="text-muted text-[15px] mt-4 leading-relaxed">{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   COUNTUP
---------------------------------------------------------------- */
function CountUp({ target, duration = 1800 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const startTime = performance.now()
        const animate = (now) => {
          const t = Math.min((now - startTime) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3)
          setCount(Math.floor(target * eased))
          if (t < 1) requestAnimationFrame(animate)
          else setCount(target)
        }
        requestAnimationFrame(animate)
      }
    }, { threshold: 0.35 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count}</span>
}

/* ----------------------------------------------------------------
   PILLARS (Stats)
---------------------------------------------------------------- */
function Pillars() {
  const { data } = usePortfolio()
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.15 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const pillars = [
    { n: '01', title: 'Projects', target: data.projects.length, suffix: '+', label: 'delivered', desc: 'Real-world projects built for businesses, from websites to AI-integrated enterprise systems.' },
    { n: '02', title: 'Roles', target: data.experience.length, suffix: '+', label: 'professional roles', desc: 'Cross-functional experience spanning software engineering, marketing leadership, and AI consulting.' },
    { n: '03', title: 'Certified', target: data.certifications.length, suffix: '', label: 'certifications', desc: 'Industry-recognized certifications validating technical expertise and professional capability.' },
  ]

  return (
    <section ref={ref} className="relative py-28 sm:py-40 px-6 sm:px-10 lg:px-16 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[44rem] rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className={`flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-24 transition-all duration-1000 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="max-w-2xl">
            <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-accent mb-5">╱ By the Numbers</span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-ink leading-[1.05] tracking-tight">
              Track record
              <span className="block font-serif italic font-medium text-accent">that speaks.</span>
            </h2>
          </div>
          <p className="text-muted text-lg leading-relaxed max-w-md lg:text-right">Real numbers from real work, not marketing. Just what I deliver.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-divider rounded-5xl overflow-hidden border border-divider shadow-xl shadow-accent/5">
          {pillars.map((p, i) => (
            <article key={i} style={{ transitionDelay: visible ? `${i * 150}ms` : '0ms' }} className={`pillar-card relative bg-surface p-9 sm:p-12 group overflow-hidden transition-all duration-1000 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center justify-between mb-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">{p.n} / {p.title}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-accent/40 group-hover:bg-accent group-hover:scale-150 transition-all duration-500" />
              </div>
              <div className="flex items-end gap-1 leading-none">
                <span className="font-display font-extrabold text-[6rem] sm:text-[8rem] md:text-[9rem] leading-[0.85] text-ink tabular-nums tracking-tight">
                  <CountUp target={p.target} duration={1800 + i * 200} />
                </span>
                <span className="font-serif italic font-medium text-4xl sm:text-5xl md:text-6xl text-accent mb-3 sm:mb-4">{p.suffix}</span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mt-5">{p.label}</p>
              <p className="text-muted text-[15px] mt-6 leading-relaxed max-w-xs">{p.desc}</p>
              <div className="absolute bottom-0 left-9 right-9 sm:left-12 sm:right-12 h-px bg-divider overflow-hidden">
                <div className="h-full bg-gradient-to-r from-transparent via-accent to-transparent" style={{ animation: `pillar-sweep 4s ease-in-out ${i * 0.4}s infinite` }} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pillar-sweep {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  )
}

/* ----------------------------------------------------------------
   EXPERIENCE TIMELINE (Sticky Stack)
---------------------------------------------------------------- */
function ExperienceTimeline() {
  const { data } = usePortfolio()
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.exp-card')
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return
        gsap.to(card, {
          scrollTrigger: { trigger: card, start: 'top top+=100', endTrigger: cards[cards.length - 1], end: 'top top+=120', scrub: 1 },
          scale: 0.92, filter: 'blur(6px) saturate(0.7)', opacity: 0.5, ease: 'none',
        })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const steps = data.experience.map((exp, idx) => ({
    num: String(idx + 1).padStart(2, '0'),
    title: exp.role,
    tagline: exp.company,
    text: exp.description,
    meta: `${exp.period} · ${exp.location}`,
    highlights: exp.highlights || [],
  }))

  if (steps.length === 0) return null

  return (
    <section id="experience" ref={containerRef} className="relative px-4 sm:px-6 py-20">
      <div className="max-w-7xl mx-auto mb-16 px-2 sm:px-10">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">╱ Experience</span>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-ink mt-4 leading-[1.05] tracking-tight max-w-3xl">
          Career path.
          <span className="block font-serif italic font-medium text-accent">Real impact.</span>
        </h2>
      </div>

      <div className="space-y-8">
        {steps.map((step, idx) => (
          <article key={idx} className="exp-card sticky top-24 sm:top-28 mx-auto max-w-6xl bg-gradient-to-br from-surface to-background border border-divider rounded-6xl overflow-hidden shadow-2xl shadow-primary/5">
            <div className="p-8 sm:p-12 lg:p-16">
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted">{step.meta}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent bg-accent/10 px-2.5 py-1 rounded-full">Step {step.num}</span>
              </div>
              <span className="font-display font-extrabold text-[5rem] sm:text-[7rem] leading-none text-accent/10 block">{step.num}</span>
              <h3 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-ink leading-[1.02] tracking-tight -mt-6">{step.title}</h3>
              <p className="font-serif italic text-accent text-xl sm:text-2xl mt-3">{step.tagline}</p>
              <p className="text-muted text-base sm:text-lg leading-relaxed max-w-2xl mt-6">{step.text}</p>
              {step.highlights.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {step.highlights.map((h) => (
                    <span key={h} className="bg-parchment text-primary text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full">{h}</span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   SERVICES GRID
---------------------------------------------------------------- */
function ServicesGrid() {
  const { data } = usePortfolio()
  const [ref, visible] = useReveal(0.1)

  return (
    <section id="projects" ref={ref} className="relative py-24 px-6 sm:px-10 lg:px-16 bg-deep text-white overflow-hidden rounded-t-6xl">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">╱ What I Offer</span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl mt-4 leading-[1.05] tracking-tight">
              Services,
              <span className="block font-serif italic font-medium text-accent">end to end.</span>
            </h2>
          </div>
          <p className="text-white/60 max-w-md text-base leading-relaxed">Full-service solutions, from AI consulting and automation to web development and brand strategy.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-4xl overflow-hidden">
          {data.services.map((svc, i) => {
            const Icon = getIcon(svc.icon)
            return (
              <div key={svc.id} style={{ transitionDelay: visible ? `${i * 60}ms` : '0ms' }} className={`group bg-deep p-7 sm:p-9 hover:bg-white/[0.02] transition-all duration-700 ease-out relative ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <div className="flex items-start justify-between mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-500">
                    <Icon className="h-5 w-5 text-accent group-hover:text-deep" strokeWidth={2} />
                  </div>
                  <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl mb-3">{svc.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{svc.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   TRUST SIGNALS (Certifications + Education)
---------------------------------------------------------------- */
function TrustSignals() {
  const { data } = usePortfolio()
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.15 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const badges = [
    ...data.certifications.map((c) => ({
      Icon: Award,
      title: c.title,
      text: `${c.issuer} · ${c.year}`,
    })),
    ...data.education.map((e) => ({
      Icon: GraduationCap,
      title: e.degree,
      text: `${e.field} · ${e.school}`,
    })),
    {
      Icon: MapPin,
      title: 'Remote Ready',
      text: 'Open to remote opportunities in the US market. Available for full-time, contract, or consulting roles.',
    },
  ]

  return (
    <section ref={ref} className="relative py-14 sm:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">╱ Credentials</span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink mt-3 tracking-tight">More than a résumé.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {badges.map(({ Icon, title, text }, i) => (
            <div key={i} style={{ transitionDelay: visible ? `${i * 120}ms` : '0ms' }} className={`bg-white border border-divider rounded-4xl p-6 hover:border-accent/40 transition-all duration-700 ease-out shadow-sm ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <Icon className="h-6 w-6 text-accent mb-3" strokeWidth={1.8} />
              <h3 className="font-display font-bold text-lg text-ink mb-1.5">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a href="#contact" className="magnetic-btn inline-flex items-center gap-2 bg-accent text-white font-semibold px-7 py-3.5 rounded-full shadow-xl shadow-accent/30">
            Let's Talk <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   CONTACT FORM
---------------------------------------------------------------- */
function Field({ label, type = 'text', required, value, onChange }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2 block">{label} {required && '*'}</label>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-background border border-divider rounded-2xl px-4 py-3.5 text-ink placeholder-muted/60 focus:border-accent focus:ring-4 focus:ring-accent/15 outline-none transition font-body" />
    </div>
  )
}

function ContactForm() {
  const { data } = usePortfolio()
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 1200)
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32 px-6 sm:px-10 lg:px-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left */}
          <div className="lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">╱ Get in Touch</span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-ink mt-4 leading-[1.05] tracking-tight">
              Let's build
              <span className="block font-serif italic font-medium text-accent">something great.</span>
            </h2>
            <p className="text-muted text-lg mt-6 leading-relaxed max-w-md">
              Whether you need an AI automation specialist, a web developer, or a strategic consultant, I'm ready to help.
            </p>

            <div className="mt-10 space-y-4">
              <a href={`mailto:${data.profile.email}`} className="lift-on-hover flex items-center gap-4 group">
                <span className="h-12 w-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent transition">
                  <Mail className="h-5 w-5 text-accent group-hover:text-white" />
                </span>
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">Email</span>
                  <span className="font-display font-semibold text-ink text-lg">{data.profile.email}</span>
                </span>
              </a>

              <div className="flex items-center gap-4">
                <span className="h-12 w-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-accent" />
                </span>
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">Location</span>
                  <span className="font-display font-semibold text-ink text-lg">{data.profile.location}</span>
                </span>
              </div>

              {data.profile.linkedin && (
                <a href={data.profile.linkedin} target="_blank" rel="noopener noreferrer" className="lift-on-hover flex items-center gap-4 group">
                  <span className="h-12 w-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent transition">
                    <Link2 className="h-5 w-5 text-accent group-hover:text-white" />
                  </span>
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">LinkedIn</span>
                    <span className="font-display font-semibold text-ink text-lg">View Profile</span>
                  </span>
                </a>
              )}

              {data.profile.github && (
                <a href={data.profile.github} target="_blank" rel="noopener noreferrer" className="lift-on-hover flex items-center gap-4 group">
                  <span className="h-12 w-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent transition">
                    <GitBranch className="h-5 w-5 text-accent group-hover:text-white" />
                  </span>
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">GitHub</span>
                    <span className="font-display font-semibold text-ink text-lg">View Projects</span>
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="bg-surface border border-divider rounded-5xl p-7 sm:p-10 shadow-xl shadow-primary/5">
              {status !== 'sent' ? (
                <>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Your Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                    <Field label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                    <Field label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
                    <Field label="Role / Subject" value={form.subject || ''} onChange={(v) => setForm({ ...form, subject: v })} />
                  </div>
                  <div className="mt-5">
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2 block">Message *</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} placeholder="Tell me about your project or opportunity..." className="w-full bg-background border border-divider rounded-2xl px-4 py-3.5 text-ink placeholder-muted/60 focus:border-accent focus:ring-4 focus:ring-accent/15 outline-none transition resize-none font-body" />
                  </div>
                  <div className="mt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-xs text-muted">I'll respond within 24 hours. Fields with * are required.</p>
                    <button type="submit" disabled={status === 'sending'} className="magnetic-btn inline-flex items-center gap-2 bg-accent text-white font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-accent/30 disabled:opacity-50">
                      {status === 'sending' ? 'Sending...' : 'Send Message'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="h-16 w-16 mx-auto rounded-full bg-accent/15 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-ink mb-3">Thanks for reaching out!</h3>
                  <p className="text-muted max-w-md mx-auto">I'll get back to you as soon as possible to discuss how we can work together.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   FOOTER
---------------------------------------------------------------- */
function Footer() {
  const { data } = usePortfolio()

  return (
    <footer className="relative bg-deep text-white rounded-t-6xl mt-12 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[40rem] rounded-full bg-accent/15 blur-3xl" />

      <div className="relative px-6 sm:px-10 lg:px-16 pt-20 pb-10 max-w-7xl mx-auto">
        {/* Tagline */}
        <div className="border-b border-white/10 pb-12 mb-12">
          <h2 className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl leading-[0.92] tracking-tight">
            Let's build
            <span className="font-serif italic font-medium text-accent block">the future.</span>
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-8 gap-6">
            <p className="text-white/50 max-w-md">{data.profile.name} · {data.profile.title}. Open to remote opportunities.</p>
            <a href="#contact" className="magnetic-btn inline-flex items-center gap-2 bg-accent text-white font-semibold px-7 py-3.5 rounded-full self-start sm:self-auto">
              Get in Touch <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-9 w-9 rounded-full bg-accent flex items-center justify-center">
                <span className="font-display font-bold text-white text-sm">A</span>
              </span>
              <span className="font-display font-bold text-lg">{data.profile.name}</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">{data.profile.summary.slice(0, 150)}...</p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-4">Services</p>
            <ul className="space-y-2.5">
              {data.services.slice(0, 4).map((s) => (
                <li key={s.id}><a href="#projects" className="text-white/65 hover:text-accent transition text-sm">{s.title}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-4">Navigate</p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}><a href={l.href} className="text-white/65 hover:text-accent transition text-sm">{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-4">Connect</p>
            <ul className="space-y-2.5">
              <li><a href={`mailto:${data.profile.email}`} className="text-white/65 hover:text-accent transition text-sm">{data.profile.email}</a></li>
              {data.profile.linkedin && <li><a href={data.profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/65 hover:text-accent transition text-sm">LinkedIn</a></li>}
              {data.profile.github && <li><a href={data.profile.github} target="_blank" rel="noopener noreferrer" className="text-white/65 hover:text-accent transition text-sm">GitHub</a></li>}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">Available for Hire · Remote Ready</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/50 text-xs font-mono">
            <Link to="/admin" className="hover:text-accent transition">Admin</Link>
            <span>© {new Date().getFullYear()} {data.profile.name}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ----------------------------------------------------------------
   APP
---------------------------------------------------------------- */
export default function App() {
  useEffect(() => {
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 200)
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 1000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="relative">
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pillars />
        <ExperienceTimeline />
        <ServicesGrid />
        <TrustSignals />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}
