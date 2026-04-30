"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

// ── TYPES ──────────────────────────────────────────────────────────────────
type TweakFeel   = "butter" | "flow" | "direct";
type TweakDepth  = "shallow" | "deep" | "abyss";
type TweakSignal = "cyber" | "ghost" | "ember";
interface TweakState { feel: TweakFeel; depth: TweakDepth; signal: TweakSignal; }

type GHRepo = {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
};

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const FEEL_MAP:   Record<TweakFeel,   number>                       = { butter: 0.035, flow: 0.07, direct: 0.16 };
const DEPTH_MAP:  Record<TweakDepth,  { scale: number; blur: number }> = { shallow: { scale: 0.03, blur: 1.5 }, deep: { scale: 0.08, blur: 4 }, abyss: { scale: 0.18, blur: 9 } };
const SIGNAL_MAP: Record<TweakSignal, { cyan: string; purple: string }> = {
  cyber: { cyan: "#00f0ff", purple: "#a259f7" },
  ghost: { cyan: "#c8c8c8", purple: "#787878" },
  ember: { cyan: "#ff6030", purple: "#ff3366" },
};
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f7df1e", "C#": "#239120", Go: "#00add8",
  Dart: "#0175c2", Python: "#3572a5", PHP: "#777bb4", Java: "#b07219",
  "Jupyter Notebook": "#da5b0b", HTML: "#e34c26",
};
const PAGE_SIZE  = 3;
const LABELS     = ["SECTOR_00 // ENTRY", "SECTOR_01 // ABOUT", "SECTOR_02 // STACK", "SECTOR_03 // WORK", "SECTOR_04 // CONTACT"];
const TOTAL_SECS = 5;

// ── COMPONENT ──────────────────────────────────────────────────────────────
export default function Portfolio() {
  // Tweaks (user-selected defaults from design tool)
  const [tweaks, setTweaks]   = useState<TweakState>({ feel: "butter", depth: "abyss", signal: "ghost" });
  const [showTP, setShowTP]   = useState(false);

  // GitHub
  const [ghRepos, setGhRepos] = useState<GHRepo[]>([]);
  const [ghLabel, setGhLabel] = useState("");
  const [projPage, setProjPage] = useState(0);

  // Easter eggs
  const [eggOpen,    setEggOpen]    = useState(false);
  const [chaosToast, setChaosToast] = useState(false);

  // ── REFS (DOM + animation state) ──────────────────────────────────────
  const curDotRef      = useRef<HTMLDivElement>(null);
  const curRingRef     = useRef<HTMLDivElement>(null);
  const atmoCvRef      = useRef<HTMLCanvasElement>(null);
  const heroCvRef      = useRef<HTMLCanvasElement>(null);
  const eggCvRef       = useRef<HTMLCanvasElement>(null);
  const progRef        = useRef<HTMLDivElement>(null);
  const scrollStageRef = useRef<HTMLDivElement>(null);
  const projStripRef   = useRef<HTMLDivElement>(null);

  // Section refs
  const secRefs = useRef<Array<HTMLDivElement | null>>([null, null, null, null, null]);
  // HUD refs (updated imperatively from rAF loop)
  const hudSectionRef  = useRef<HTMLDivElement>(null);
  const hudDepthRef    = useRef<HTMLDivElement>(null);
  const navDotsRef     = useRef<Array<HTMLDivElement | null>>([null, null, null, null, null]);

  // Animation state refs
  const lerpRef        = useRef(FEEL_MAP.butter);
  const depthScaleRef  = useRef(DEPTH_MAP.abyss.scale);
  const depthBlurRef   = useRef(DEPTH_MAP.abyss.blur);
  const heroScrollPct  = useRef(0);
  const scatterActive  = useRef(false);
  const scatterOrigin  = useRef({ x: 0, y: 0 });
  const eggTimerRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  // Triple-click refs
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── APPLY TWEAKS → CSS vars + animation config ────────────────────────
  useEffect(() => {
    lerpRef.current       = FEEL_MAP[tweaks.feel];
    const d               = DEPTH_MAP[tweaks.depth];
    depthScaleRef.current = d.scale;
    depthBlurRef.current  = d.blur;
    const s               = SIGNAL_MAP[tweaks.signal];
    document.documentElement.style.setProperty("--cv2-cyan",   s.cyan);
    document.documentElement.style.setProperty("--cv2-purple", s.purple);
  }, [tweaks]);

  // ── CUSTOM CURSOR ─────────────────────────────────────────────────────
  useEffect(() => {
    const dot  = curDotRef.current;
    const ring = curRingRef.current;
    if (!dot || !ring) return;
    let mx = 0, my = 0, rx = 0, ry = 0, raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
    };
    const animCur = () => {
      rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      raf = requestAnimationFrame(animCur);
    };

    // Hover state: expand ring on interactive elements
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest("a,button,[data-hov]"))
        document.body.classList.add("cv2-hov");
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest("a,button,[data-hov]"))
        document.body.classList.remove("cv2-hov");
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover",  onOver);
    document.addEventListener("mouseout",   onOut);
    raf = requestAnimationFrame(animCur);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ── HERO PARTICLE SPHERE ─────────────────────────────────────────────
  useEffect(() => {
    const cv = heroCvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const N = 280;
    let W = 0, H = 0;

    const resize = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: N }, (_, i) => {
      const phi   = Math.acos(1 - 2 * (i + 0.5) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return { px: Math.sin(phi) * Math.cos(theta), py: Math.sin(phi) * Math.sin(theta), pz: Math.cos(phi), r: Math.random() * 0.8 + 0.3, alpha: Math.random() * 0.6 + 0.2 };
    });

    let rot = 0, scatterT = 0, raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      rot += 0.003;
      const sp    = heroScrollPct.current;
      const scale = W * 0.22 * (1 + sp * 0.4);
      const cx    = W / 2, cy = H / 2;
      const t     = Date.now() * 0.001;

      // fog pulse
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.3 + Math.sin(t) * 20);
      grd.addColorStop(0, "rgba(0,240,255,0.03)"); grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);

      if (scatterActive.current) scatterT = Math.min(scatterT + 0.06, 1);
      else                        scatterT = Math.max(scatterT - 0.03, 0);

      pts.map(p => {
        const x2 = p.px * Math.cos(rot) - p.pz * Math.sin(rot);
        const z2 = p.px * Math.sin(rot) + p.pz * Math.cos(rot);
        let sx = cx + x2 * scale, sy = cy + p.py * scale;
        if (scatterT > 0) {
          const ox = scatterOrigin.current.x, oy = scatterOrigin.current.y;
          const ang  = Math.atan2(sy - oy, sx - ox) + p.alpha * 2;
          const dist = scatterT * W * 0.35;
          const ease = scatterT < 0.5 ? scatterT * 2 : (1 - scatterT) * 2;
          sx += Math.cos(ang) * dist * ease; sy += Math.sin(ang) * dist * ease;
        }
        return { sx, sy, z: z2, r: p.r, a: p.alpha };
      }).sort((a, b) => a.z - b.z).forEach(p => {
        const depth = (p.z + 1) / 2;
        const alpha = p.a * (0.3 + depth * 0.7) * (1 - sp * 0.6);
        ctx.beginPath(); ctx.arc(p.sx, p.sy, p.r * (0.5 + depth * 0.8), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,240,255,${alpha})`; ctx.fill();
        if (depth > 0.7) {
          ctx.beginPath(); ctx.arc(p.sx, p.sy, p.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,240,255,${alpha * 0.2})`; ctx.fill();
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);

  // ── ATMOSPHERE CANVAS ─────────────────────────────────────────────────
  useEffect(() => {
    const cv = atmoCvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    let W = 0, H = 0;
    const resize = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const dust = Array.from({ length: 80 }, () => ({
      x: Math.random() * 1920, y: Math.random() * 1080,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.2 + 0.2, a: Math.random() * 0.25 + 0.05,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dust.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(162,89,247,${d.a})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);

  // ── SCROLL ENGINE (LERP) ──────────────────────────────────────────────
  useEffect(() => {
    let targetPct = 0, smoothPct = 0, raf: number;

    const onScroll = () => {
      const stage = scrollStageRef.current;
      if (!stage) return;
      const total = stage.offsetHeight - window.innerHeight;
      targetPct = Math.max(0, Math.min(1, window.scrollY / total));
    };

    const applySection = (sIdx: number, sFrac: number) => {
      // HUD
      if (hudSectionRef.current)
        hudSectionRef.current.textContent = LABELS[Math.min(sIdx, LABELS.length - 1)];
      if (hudDepthRef.current)
        hudDepthRef.current.textContent = `DEPTH ${String(Math.round(smoothPct * 100)).padStart(3, "0")}%`;

      // Nav dots
      navDotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        const active = i === sIdx;
        dot.style.background    = active ? "var(--cv2-cyan)" : "transparent";
        dot.style.borderColor   = active ? "var(--cv2-cyan)" : "rgba(0,240,255,0.3)";
        dot.style.boxShadow     = active ? "0 0 6px var(--cv2-cyan)" : "none";
      });

      // Progress bar
      if (progRef.current) progRef.current.style.transform = `scaleX(${smoothPct})`;

      const DS = depthScaleRef.current;
      const DB = depthBlurRef.current;

      // Section transforms
      secRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i === sIdx) {
          let scale = 1, opacity = 1, ty = 0, blur = 0, tz = 0;
          if (sFrac > 0.72) {
            const ex = (sFrac - 0.72) / 0.28;
            scale   = 1 - ex * DS; opacity = 1 - ex; ty = -ex * 50; blur = ex * DB; tz = -ex * 80;
          }
          el.style.transform    = `perspective(900px) translateY(${ty}px) translateZ(${tz}px) scale(${scale})`;
          el.style.opacity      = String(opacity);
          el.style.filter       = blur > 0.1 ? `blur(${blur}px)` : "";
          el.style.pointerEvents = "all";
        } else if (i === sIdx + 1) {
          const en   = Math.max(0, sFrac - 0.65) / 0.35;
          const blur = (1 - en) * DB * 0.6;
          el.style.transform    = `perspective(900px) translateY(${(1-en)*80}px) translateZ(${(1-en)*-120}px) scale(${0.92+en*0.08})`;
          el.style.opacity      = String(Math.min(1, en * 1.4));
          el.style.filter       = blur > 0.1 ? `blur(${blur}px)` : "";
          el.style.pointerEvents = en > 0.5 ? "all" : "none";
        } else {
          const past = i < sIdx;
          el.style.transform    = `perspective(900px) translateY(${past?-50:80}px) translateZ(${past?80:-120}px) scale(${past?1-DS:0.92})`;
          el.style.opacity      = "0";
          el.style.filter       = `blur(${DB * 0.5}px)`;
          el.style.pointerEvents = "none";
        }
      });

      heroScrollPct.current = sIdx === 0 ? sFrac : (sIdx > 0 ? 1 : 0);

      // Fog opacity
      const fogA = document.getElementById("cv2-fog-a");
      const fogB = document.getElementById("cv2-fog-b");
      const fogOp = Math.max(0, 1 - sIdx * 0.18);
      if (fogA) fogA.style.opacity = String(fogOp);
      if (fogB) fogB.style.opacity = String(fogOp * 0.7);
    };

    const loop = () => {
      smoothPct += (targetPct - smoothPct) * lerpRef.current;
      const sIdx  = Math.min(TOTAL_SECS - 1, Math.floor(smoothPct * TOTAL_SECS));
      const sFrac = (smoothPct * TOTAL_SECS) % 1;
      applySection(sIdx, sFrac);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    applySection(0, 0);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // ── HERO ENTRANCE ─────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      const ids = ["cv2-hero-label", "cv2-hero-name", "cv2-hero-sub", "cv2-hero-hint"];
      ids.forEach(id => {
        const el = document.getElementById(id) as HTMLElement | null;
        if (!el) return;
        el.style.opacity   = "1";
        el.style.transform = id === "cv2-hero-name" ? "scale(1)" : id === "cv2-hero-label" ? "translateY(0)" : el.style.transform;
      });
    }, 300);
    return () => clearTimeout(t);
  }, []);

  // ── TYPEWRITER ────────────────────────────────────────────────────────
  useEffect(() => {
    const el = document.getElementById("cv2-typed-text");
    const bl = document.getElementById("cv2-typed-cursor");
    if (!el || !bl) return;

    const phrases = ["Code and Chaos", "Integration Dev", "Cloud Dev", "Half Code, Half Chaos"];
    let pi = 0, ci = 0, del = false;
    const blink = setInterval(() => { bl.style.opacity = bl.style.opacity === "0" ? "1" : "0"; }, 530);

    let t: ReturnType<typeof setTimeout>;
    function type() {
      const ph = phrases[pi];
      if (!del) { el!.textContent = ph.slice(0, ++ci); if (ci === ph.length) { del = true; t = setTimeout(type, 2000); return; } }
      else       { el!.textContent = ph.slice(0, --ci); if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; } }
      t = setTimeout(type, del ? 45 : 85);
    }
    t = setTimeout(type, 1600);
    return () => { clearTimeout(t); clearInterval(blink); };
  }, []);

  // ── GITHUB FETCH ──────────────────────────────────────────────────────
  const loadGH = useCallback((force = false) => {
    const KEY = "ok_gh2", TS = "ok_gh2_ts", TTL = 36e5;
    if (!force) {
      const c = localStorage.getItem(KEY), ts = localStorage.getItem(TS);
      if (c && ts && Date.now() - +ts < TTL) { setGhRepos(JSON.parse(c)); setGhLabel("cached"); return; }
    }
    setGhLabel("Syncing...");
    fetch("https://api.github.com/users/okithaeske/repos?sort=pushed&per_page=20")
      .then(r => r.json())
      .then((repos: GHRepo[]) => {
        const filtered = repos.filter(r => !r.fork).sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
        localStorage.setItem(KEY, JSON.stringify(filtered));
        localStorage.setItem(TS, String(Date.now()));
        setGhRepos(filtered); setProjPage(0);
        setGhLabel(`↻ ${filtered.length} repos synced`);
      })
      .catch(() => setGhLabel("API error"));
  }, []);

  useEffect(() => { loadGH(); }, [loadGH]);

  // ── DRAG-TO-SCROLL on project strip ───────────────────────────────────
  useEffect(() => {
    const el = projStripRef.current;
    if (!el) return;
    let down = false, startX = 0, startScroll = 0;
    const onDown  = (e: MouseEvent) => { down = true; startX = e.pageX - el.offsetLeft; startScroll = el.scrollLeft; };
    const onUp    = () => { down = false; };
    const onMove  = (e: MouseEvent) => { if (!down) return; e.preventDefault(); el.scrollLeft = startScroll - (e.pageX - el.offsetLeft - startX) * 1.5; };
    el.addEventListener("mousedown",  onDown);
    el.addEventListener("mouseleave", onUp);
    el.addEventListener("mouseup",    onUp);
    el.addEventListener("mousemove",  onMove);
    return () => { el.removeEventListener("mousedown",  onDown); el.removeEventListener("mouseleave", onUp); el.removeEventListener("mouseup", onUp); el.removeEventListener("mousemove", onMove); };
  }, []);

  // ── KONAMI EGG ────────────────────────────────────────────────────────
  useEffect(() => {
    const K = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]; let kp = 0;
    const onKey = (e: KeyboardEvent) => { if (e.key === K[kp]) { kp++; if (kp === K.length) { kp = 0; setEggOpen(true); } } else kp = 0; };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // ── TYPE "chaos" EGG ──────────────────────────────────────────────────
  useEffect(() => {
    let seq = "";
    const onKey = (e: KeyboardEvent) => {
      seq = (seq + e.key).slice(-5);
      if (seq.toLowerCase() === "chaos") { seq = ""; setChaosToast(true); setTimeout(() => setChaosToast(false), 3000); }
    };
    document.addEventListener("keypress", onKey);
    return () => document.removeEventListener("keypress", onKey);
  }, []);

  // ── MATRIX RAIN (egg canvas) ──────────────────────────────────────────
  useEffect(() => {
    if (!eggOpen) { if (eggTimerRef.current) { clearInterval(eggTimerRef.current); eggTimerRef.current = null; } return; }
    const cv = eggCvRef.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    const cols  = Math.floor(cv.width / 16);
    const drops = Array<number>(cols).fill(1);
    const chars = "アイウエオ0123456789ABCDEF<>{}[]";
    eggTimerRef.current = setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,.05)"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = "#00ff41"; ctx.font = "14px monospace";
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, y * 16);
        if (y * 16 > cv.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 40);
    return () => { if (eggTimerRef.current) clearInterval(eggTimerRef.current); };
  }, [eggOpen]);

  // ── IDLE GLITCH ───────────────────────────────────────────────────────
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;
    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        const label = hudSectionRef.current; if (!label) return;
        const orig  = label.textContent || "";
        const msgs  = ["> SIGNAL_LOST", "> STILL THERE?", "> system.idle()", "> ..."];
        let i = 0;
        const flicker = setInterval(() => {
          label.textContent  = msgs[i % msgs.length];
          label.style.color  = i % 2 === 0 ? "var(--cv2-purple)" : "var(--cv2-cyan)";
          if (++i > 8) { clearInterval(flicker); label.textContent = orig; label.style.color = ""; resetIdle(); }
        }, 300);
      }, 20000);
    };
    window.addEventListener("scroll",    resetIdle, { passive: true });
    window.addEventListener("mousemove", resetIdle);
    resetIdle();
    return () => { clearTimeout(idleTimer); window.removeEventListener("scroll", resetIdle); window.removeEventListener("mousemove", resetIdle); };
  }, []);

  // ── GLITCH BURST (triple-click name) ─────────────────────────────────
  const glitchBurst = useCallback(() => {
    const el = document.getElementById("cv2-hero-name") as HTMLElement | null;
    if (!el) return;
    el.style.transition = "none";
    let frame = 0;
    const burst = setInterval(() => {
      const r = () => (Math.random() - 0.5) * (8 - frame);
      el.style.transform  = `translate(${r()}px,${r()}px) skewX(${r()}deg)`;
      el.style.textShadow = `${r()*2}px 0 var(--cv2-cyan), ${r()*2}px 0 var(--cv2-purple)`;
      if (++frame > 12) { clearInterval(burst); el.style.transform = "scale(1)"; el.style.textShadow = ""; el.style.transition = ""; }
    }, 50);
  }, []);

  // ── GOTO SECTION ──────────────────────────────────────────────────────
  const goTo = useCallback((idx: number) => {
    const stage = scrollStageRef.current; if (!stage) return;
    window.scrollTo({ top: (idx / TOTAL_SECS) * (stage.offsetHeight - window.innerHeight), behavior: "smooth" });
  }, []);

  // ── DERIVED ───────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(ghRepos.length / PAGE_SIZE));
  const pagedRepos = ghRepos.slice(projPage * PAGE_SIZE, projPage * PAGE_SIZE + PAGE_SIZE);

  // ── RENDER ────────────────────────────────────────────────────────────
  return (
    <>
      {/* CURSOR */}
      <div
        ref={curDotRef}
        id="cv2-cur-dot"
        style={{ position:"fixed",pointerEvents:"none",borderRadius:"50%",zIndex:9999,transform:"translate(-50%,-50%)",
          width:6,height:6,background:"var(--cv2-cyan)",boxShadow:"0 0 8px var(--cv2-cyan)",left:0,top:0 }}
      />
      <div
        ref={curRingRef}
        id="cv2-cur-ring"
        style={{ position:"fixed",pointerEvents:"none",borderRadius:"50%",zIndex:9998,transform:"translate(-50%,-50%)",
          width:32,height:32,border:"1px solid rgba(0,240,255,0.4)",
          transition:"width .2s,height .2s,border-color .2s",left:0,top:0 }}
      />

      {/* TWEAKS PANEL */}
      {showTP && (
        <div style={{ position:"fixed",bottom:28,right:28,zIndex:9000,width:272,
          background:"rgba(4,4,14,0.96)",border:"1px solid rgba(0,240,255,0.22)",
          backdropFilter:"blur(16px)",fontFamily:"var(--cv2-mono)",
          boxShadow:"0 0 40px rgba(0,240,255,0.07),0 24px 48px rgba(0,0,0,0.7)" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 17px",borderBottom:"1px solid rgba(0,240,255,0.09)" }}>
            <span style={{ fontSize:10,color:"var(--cv2-cyan)",letterSpacing:".22em",textTransform:"uppercase" }}>Tweaks</span>
            <button onClick={() => setShowTP(false)} style={{ background:"none",border:"none",color:"var(--cv2-muted)",fontSize:16,cursor:"none",lineHeight:1 }}>×</button>
          </div>
          <TweakRow label="// Feel" desc="Scroll inertia — how fast visuals chase your finger">
            {(["butter","flow","direct"] as TweakFeel[]).map(v => (
              <TweakBtn key={v} active={tweaks.feel===v} onClick={() => setTweaks(p=>({...p,feel:v}))}>{v.charAt(0).toUpperCase()+v.slice(1)}</TweakBtn>
            ))}
          </TweakRow>
          <TweakRow label="// Depth" desc="How far sections zoom and blur when passing through">
            {(["shallow","deep","abyss"] as TweakDepth[]).map(v => (
              <TweakBtn key={v} active={tweaks.depth===v} onClick={() => setTweaks(p=>({...p,depth:v}))}>{v.charAt(0).toUpperCase()+v.slice(1)}</TweakBtn>
            ))}
          </TweakRow>
          <TweakRow label="// Signal" desc="Accent color frequency across the whole page" last>
            {(["cyber","ghost","ember"] as TweakSignal[]).map(v => (
              <TweakBtn key={v} active={tweaks.signal===v} onClick={() => setTweaks(p=>({...p,signal:v}))}>{v.charAt(0).toUpperCase()+v.slice(1)}</TweakBtn>
            ))}
          </TweakRow>
        </div>
      )}

      {/* CHAOS TOAST */}
      {chaosToast && (
        <div style={{ position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:9500,
          fontFamily:"var(--cv2-mono)",fontSize:13,color:"var(--cv2-cyan)",
          background:"rgba(4,4,14,0.95)",border:"1px solid rgba(0,240,255,0.3)",
          padding:"28px 40px",textAlign:"center",lineHeight:2,
          backdropFilter:"blur(12px)",boxShadow:"0 0 60px rgba(0,240,255,0.15)" }}>
          <div style={{ fontSize:22,marginBottom:8,letterSpacing:".05em" }}>CHAOS MODE</div>
          <div style={{ color:"var(--cv2-muted)",fontSize:11 }}>&gt; unlocked by: okitha_eske</div>
          <div style={{ color:"var(--cv2-muted)",fontSize:10,marginTop:4 }}>&gt; half_code · half_chaos · all_system</div>
        </div>
      )}

      {/* EGG OVERLAY */}
      {eggOpen && (
        <div style={{ position:"fixed",inset:0,zIndex:99999,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column" }}>
          <canvas ref={eggCvRef} style={{ position:"absolute",inset:0 }} />
          <div style={{ position:"relative",zIndex:2,fontFamily:"var(--cv2-mono)",color:"#00ff41",textAlign:"center",fontSize:16,lineHeight:2.2 }}>
            ↑ ↑ ↓ ↓ ← → ← → B A<br />
            <span style={{ fontSize:13,color:"#fff" }}>You found the chaos.</span><br />
            <span style={{ fontSize:10,color:"#555" }}>&gt; access_granted: okitha_secret_mode</span>
          </div>
          <button onClick={() => setEggOpen(false)} style={{ position:"absolute",top:24,right:24,fontFamily:"var(--cv2-mono)",fontSize:11,letterSpacing:".1em",color:"#00ff41",background:"transparent",border:"1px solid #00ff41",padding:"8px 16px",cursor:"none",zIndex:3 }}>ESC // EXIT</button>
        </div>
      )}

      {/* ── SCROLL STAGE ── */}
      <div ref={scrollStageRef} style={{ height:"700vh",position:"relative" }}>
        <div style={{ position:"sticky",top:0,width:"100%",height:"100vh",overflow:"hidden" }}>

          {/* ATMOSPHERE */}
          <canvas ref={atmoCvRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0 }} />
          <div id="cv2-fog-a" style={{ position:"absolute",inset:"-20%",borderRadius:"50%",pointerEvents:"none",zIndex:1,background:"radial-gradient(ellipse at 50% 40%, rgba(0,240,255,0.06) 0%, transparent 65%)" }} />
          <div id="cv2-fog-b" style={{ position:"absolute",inset:"-20%",borderRadius:"50%",pointerEvents:"none",zIndex:1,background:"radial-gradient(ellipse at 50% 60%, rgba(162,89,247,0.04) 0%, transparent 60%)",animation:"cv2FogDrift 12s ease-in-out infinite alternate" }} />
          <div style={{ position:"absolute",inset:"-20%",borderRadius:"50%",pointerEvents:"none",zIndex:1,background:"radial-gradient(ellipse at 30% 50%, rgba(0,0,30,0.7) 0%, transparent 70%)" }} />
          <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(3,3,10,0.85) 100%)",zIndex:2,pointerEvents:"none" }} />

          {/* PROGRESS BAR */}
          <div ref={progRef} style={{ position:"absolute",top:0,left:0,right:0,height:1,zIndex:11,background:"linear-gradient(90deg, var(--cv2-cyan), var(--cv2-purple))",transformOrigin:"left",transform:"scaleX(0)" }} />

          {/* HUD FRAME */}
          <div style={{ position:"absolute",inset:0,zIndex:10,pointerEvents:"none",fontFamily:"var(--cv2-mono)",fontSize:11,color:"var(--cv2-muted)",letterSpacing:".12em" }}>
            {/* TL */}
            <div style={{ position:"absolute",top:28,left:36,display:"flex",flexDirection:"column",gap:4 }}>
              <div style={{ color:"var(--cv2-cyan)" }}>OK_ESKE</div>
              <div>// backend_engineer</div>
            </div>
            {/* TR */}
            <div style={{ position:"absolute",top:28,right:36,textAlign:"right",display:"flex",flexDirection:"column",gap:4 }}>
              <div ref={hudSectionRef}>SECTOR_00 // ENTRY</div>
              <div
                id="cv2-hud-coords"
                style={{ cursor:"none",pointerEvents:"all" }}
                onClick={() => {
                  const el = document.getElementById("cv2-hud-coords") as HTMLElement | null;
                  if (!el) return;
                  el.style.color = "var(--cv2-cyan)";
                  el.textContent = "> PING SENT · COLOMBO, LK";
                  setTimeout(() => { el.style.color = ""; el.textContent = "LAT 6.9271° N · LNG 79.8612° E"; }, 2000);
                }}
              >LAT 6.9271° N · LNG 79.8612° E</div>
            </div>
            {/* BL */}
            <div style={{ position:"absolute",bottom:28,left:36 }}>
              <div ref={hudDepthRef}>DEPTH 000%</div>
            </div>
            {/* BR */}
            <div style={{ position:"absolute",bottom:28,right:36,textAlign:"right",display:"flex",flexDirection:"column",gap:4 }}>
              <div>2026</div>
              <div style={{ color:"rgba(0,240,255,0.3)" }}>// try ↑↑↓↓←→←→BA</div>
            </div>
          </div>

          {/* NAV DOTS */}
          <div style={{ position:"absolute",right:36,top:"50%",transform:"translateY(-50%)",zIndex:12,display:"flex",flexDirection:"column",gap:10,pointerEvents:"all" }}>
            {["Entry","About","Stack","Work","Contact"].map((title, i) => (
              <div
                key={title}
                ref={el => { navDotsRef.current[i] = el; }}
                onClick={() => goTo(i)}
                title={title}
                data-hov=""
                style={{ width:6,height:6,borderRadius:"50%",border:"1px solid rgba(0,240,255,0.3)",cursor:"none",transition:"all 0.3s",background:"transparent" }}
              />
            ))}
          </div>

          {/* TWEAKS BUTTON */}
          <div style={{ position:"absolute",top:28,left:"50%",transform:"translateX(-50%)",zIndex:12,pointerEvents:"all" }}>
            <button
              onClick={() => setShowTP(p => !p)}
              style={{ fontFamily:"var(--cv2-mono)",fontSize:10,letterSpacing:".12em",textTransform:"uppercase",padding:"6px 16px",border:"1px solid rgba(0,240,255,0.2)",background:"transparent",color:"var(--cv2-muted)",cursor:"none",transition:"all .25s" }}
            >Tweaks</button>
          </div>

          {/* ── SEC 0: HERO ── */}
          <div
            ref={el => { secRefs.current[0] = el; }}
            style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",willChange:"transform, opacity",zIndex:5 }}
          >
            <canvas ref={heroCvRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:3 }} />
            {/* scatter click target */}
            <div
              style={{ position:"absolute",inset:0,zIndex:4,cursor:"none" }}
              onClick={e => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                scatterOrigin.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
                scatterActive.current = true;
                setTimeout(() => { scatterActive.current = false; }, 1800);
              }}
            />
            <div id="cv2-hero-label" style={{ position:"relative",zIndex:6,fontFamily:"var(--cv2-mono)",fontSize:11,color:"var(--cv2-cyan)",letterSpacing:".3em",textTransform:"uppercase",marginBottom:20,opacity:0,transform:"translateY(12px)",transition:"opacity 1s, transform 1s" }}>
              // backend_engineer.ts · integration_dev · cloud_dev
            </div>
            <h1
              id="cv2-hero-name"
              style={{ position:"relative",zIndex:6,fontSize:"clamp(52px,8vw,112px)",fontWeight:700,letterSpacing:"-0.03em",lineHeight:0.92,textAlign:"center",opacity:0,transform:"scale(0.94)",transition:"opacity 1.2s, transform 1.2s",cursor:"none" }}
              onClick={() => {
                clickCount.current++;
                if (clickTimer.current) clearTimeout(clickTimer.current);
                clickTimer.current = setTimeout(() => { if (clickCount.current >= 3) glitchBurst(); clickCount.current = 0; }, 400);
              }}
            >
              OKITHA<span style={{ color:"var(--cv2-cyan)",display:"block" }}>KALUTHOTAGE</span>
            </h1>
            <div id="cv2-hero-sub" style={{ position:"relative",zIndex:6,fontFamily:"var(--cv2-mono)",fontSize:14,color:"var(--cv2-muted)",marginTop:24,opacity:0,transition:"opacity 1s 0.4s" }}>
              <span id="cv2-typed-text" /><span id="cv2-typed-cursor" style={{ color:"var(--cv2-cyan)" }}>_</span>
            </div>
            <div id="cv2-hero-hint" style={{ position:"absolute",bottom:40,left:"50%",transform:"translateX(-50%)",zIndex:6,fontFamily:"var(--cv2-mono)",fontSize:10,color:"var(--cv2-muted)",letterSpacing:".2em",display:"flex",flexDirection:"column",alignItems:"center",gap:8,opacity:0,transition:"opacity 1s 1.2s" }}>
              <div style={{ width:1,height:40,background:"linear-gradient(to bottom, var(--cv2-cyan), transparent)",animation:"cv2Beam 2s ease-in-out infinite" }} />
              <span>SCROLL TO ENTER</span>
            </div>
          </div>

          {/* ── SEC 1: ABOUT ── */}
          <div
            ref={el => { secRefs.current[1] = el; }}
            style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",willChange:"transform, opacity",zIndex:4 }}
          >
            <div style={{ display:"grid",gridTemplateColumns:"1fr 480px",gap:80,alignItems:"center",padding:"0 80px",width:"100%",maxWidth:1200 }}>
              <div>
                <div style={{ fontFamily:"var(--cv2-mono)",fontSize:10,color:"var(--cv2-cyan)",letterSpacing:".25em",marginBottom:20 }}>// SECTOR_01 · ABOUT</div>
                <div style={{ fontSize:"clamp(32px,4vw,56px)",fontWeight:700,lineHeight:1.1,letterSpacing:"-0.02em" }}>
                  I build systems<br />that scale <em style={{ fontStyle:"normal",color:"var(--cv2-cyan)" }}>quietly</em><br />and break <em style={{ fontStyle:"normal",color:"var(--cv2-cyan)" }}>loudly.</em>
                </div>
              </div>
              <div>
                <div style={{ fontSize:15,color:"#7070a0",lineHeight:1.8 }}>
                  <p>Backend Engineer focused on <strong style={{ color:"var(--cv2-text)" }}>cloud-native integrations</strong> and enterprise automation. Currently building financial integration platforms on <strong style={{ color:"var(--cv2-text)" }}>Azure</strong> — connecting systems, automating chaos.</p>
                  <p style={{ marginTop:16 }}>I live in the backend: <strong style={{ color:"var(--cv2-text)" }}>TypeScript, C#, Go</strong>. Cloud-first thinker. Reliability-obsessed. Chaos-curious.</p>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,marginTop:32,border:"1px solid rgba(0,240,255,0.1)" }}>
                  {([["18","Repos"],["5+","Languages"],["☁","Azure · AWS"]] as [string,string][]).map(([n,l]) => (
                    <div key={l} style={{ padding:"18px 20px",background:"rgba(0,240,255,0.02)" }}>
                      <div style={{ fontFamily:"var(--cv2-mono)",fontSize:28,color:"var(--cv2-cyan)",fontWeight:700 }}>{n}</div>
                      <div style={{ fontSize:11,color:"var(--cv2-muted)",marginTop:2,letterSpacing:".06em" }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:24 }}>
                  <a href="mailto:okithask@gmail.com" style={{ fontFamily:"var(--cv2-mono)",fontSize:11,color:"var(--cv2-cyan)",textDecoration:"none",letterSpacing:".1em",borderBottom:"1px solid rgba(0,240,255,0.3)",paddingBottom:2 }}>okithask@gmail.com →</a>
                </div>
              </div>
            </div>
          </div>

          {/* ── SEC 2: SKILLS ── */}
          <div
            ref={el => { secRefs.current[2] = el; }}
            style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",willChange:"transform, opacity",zIndex:4 }}
          >
            <div style={{ padding:"0 80px",width:"100%",maxWidth:1200 }}>
              <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:48 }}>
                <div>
                  <div style={{ fontFamily:"var(--cv2-mono)",fontSize:10,color:"var(--cv2-cyan)",letterSpacing:".25em",marginBottom:12 }}>// SECTOR_02 · STACK</div>
                  <div style={{ fontSize:"clamp(36px,4vw,56px)",fontWeight:700,letterSpacing:"-0.02em" }}>The Weapons<br /><span style={{ color:"var(--cv2-cyan)" }}>of Choice</span></div>
                </div>
                <div style={{ fontFamily:"var(--cv2-mono)",fontSize:10,color:"var(--cv2-muted)",letterSpacing:".1em",paddingBottom:8 }}>
                  LANG_COUNT 09<br />CLOUD_PROVIDERS 03<br />FRAMEWORKS 08
                </div>
              </div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:10 }}>
                {([
                  ["TypeScript",1],["C#",1],["Go",1],["Azure",1],[".NET",1],["Azure Functions",1],
                  ["Dart",2],["Python",2],["Java",2],["React",2],["Next.js",2],["Flutter",2],["Node.js",2],["Angular",2],["Laravel",2],["Docker",2],["AWS",2],["Firebase",2],
                  ["PostgreSQL",3],["MongoDB",3],["Redis",3],["MSSQL",3],["MySQL",3],["Supabase",3],["GitHub Actions",3],["Bash",3],["PowerShell",3],
                ] as [string,number][]).map(([label, tier]) => (
                  <span key={label} style={{
                    fontFamily:"var(--cv2-mono)",fontSize:12,padding:"8px 18px",border:"1px solid",borderRadius:1,transition:"all 0.35s",cursor:"none",
                    borderColor: tier===1?"rgba(0,240,255,0.5)":tier===2?"rgba(162,89,247,0.35)":"rgba(255,255,255,0.08)",
                    color:       tier===1?"var(--cv2-cyan)":tier===2?"#c090f7":"var(--cv2-muted)",
                    background:  tier===1?"rgba(0,240,255,0.04)":tier===2?"rgba(162,89,247,0.03)":"transparent",
                  }}>{label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── SEC 3: PROJECTS ── */}
          <div
            ref={el => { secRefs.current[3] = el; }}
            style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 80px",alignItems:"flex-start",willChange:"transform, opacity",zIndex:4 }}
          >
            <div style={{ fontFamily:"var(--cv2-mono)",fontSize:10,color:"var(--cv2-cyan)",letterSpacing:".25em",textTransform:"uppercase",marginBottom:8,display:"flex",alignItems:"center",gap:12 }}>
              <span style={{ display:"block",width:20,height:1,background:"var(--cv2-cyan)" }} />
              SECTOR_03 · WORK
            </div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",maxWidth:1200,marginBottom:28 }}>
              <div style={{ fontSize:"clamp(28px,3.5vw,48px)",fontWeight:700,letterSpacing:"-0.02em" }}>Selected <span style={{ color:"var(--cv2-cyan)" }}>Projects</span></div>
              <div style={{ display:"flex",alignItems:"center",gap:16 }}>
                <span style={{ fontFamily:"var(--cv2-mono)",fontSize:10,color:"var(--cv2-muted)" }}>{ghLabel}</span>
                <button onClick={() => loadGH(true)} style={{ fontFamily:"var(--cv2-mono)",fontSize:10,letterSpacing:".1em",textTransform:"uppercase",padding:"8px 16px",border:"1px solid rgba(0,240,255,0.2)",background:"transparent",color:"var(--cv2-cyan)",cursor:"none",transition:"all .3s" }}>↻ Sync GitHub</button>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <button onClick={() => setProjPage(p => Math.max(0,p-1))} disabled={projPage===0} style={{ fontFamily:"var(--cv2-mono)",fontSize:14,padding:"8px 14px",border:"1px solid rgba(0,240,255,0.2)",background:"transparent",color:"var(--cv2-cyan)",cursor:"none",transition:"all .3s",opacity:projPage===0?0.25:1,lineHeight:1 }}>←</button>
                  <span style={{ fontFamily:"var(--cv2-mono)",fontSize:11,color:"var(--cv2-muted)",letterSpacing:".1em",minWidth:52,textAlign:"center" }}>{String(projPage+1).padStart(2,"0")} / {String(totalPages).padStart(2,"0")}</span>
                  <button onClick={() => setProjPage(p => Math.min(totalPages-1,p+1))} disabled={projPage>=totalPages-1} style={{ fontFamily:"var(--cv2-mono)",fontSize:14,padding:"8px 14px",border:"1px solid rgba(0,240,255,0.2)",background:"transparent",color:"var(--cv2-cyan)",cursor:"none",transition:"all .3s",opacity:projPage>=totalPages-1?0.25:1,lineHeight:1 }}>→</button>
                </div>
              </div>
            </div>
            <div
              ref={projStripRef}
              style={{ width:"100%",maxWidth:1200,overflowX:"auto",display:"flex",gap:20,paddingBottom:16,scrollbarWidth:"thin",scrollbarColor:"rgba(0,240,255,0.2) transparent",cursor:"grab" }}
            >
              <ProjCard id="PROJ_00" badge="PRIVATE" title="Azure Enterprise Integration"
                desc="Cloud-based enterprise platform connecting financial systems via Azure Logic Apps, Functions, TypeScript. High-throughput pipelines, CI/CD via Azure DevOps."
                tags={["TypeScript","Azure","Logic Apps","Bicep"]}
                link="https://github.com/okithaeske" corner="★ FEATURED" />
              {ghRepos.length === 0 && (
                <div style={{ flexShrink:0,width:240,padding:"40px 28px",border:"1px solid rgba(0,240,255,0.08)",fontFamily:"var(--cv2-mono)",fontSize:11,color:"var(--cv2-muted)",display:"flex",flexDirection:"column",gap:12,justifyContent:"center" }}>
                  <div style={{ color:"var(--cv2-cyan)" }}>◌</div>
                  <div>fetching from github.com/okithaeske...</div>
                </div>
              )}
              {pagedRepos.map((r, i) => (
                <ProjCard
                  key={r.name}
                  id={`PROJ_${String(projPage*PAGE_SIZE+i+1).padStart(2,"0")}`}
                  badge={new Date(r.pushed_at).toLocaleDateString("en-US",{month:"short",year:"numeric"})}
                  title={r.name.replace(/[-_]/g," ")}
                  desc={r.description || "No description."}
                  tags={[r.language || "misc"]}
                  tagDot={LANG_COLORS[r.language||""] || "#666"}
                  link={r.html_url}
                  corner={`// ${(r.language||"MISC").toUpperCase()}`}
                  stars={r.stargazers_count > 0 ? r.stargazers_count : undefined}
                />
              ))}
            </div>
            <div style={{ fontFamily:"var(--cv2-mono)",fontSize:10,color:"var(--cv2-muted)",marginTop:12 }}>← drag to explore all repos</div>
          </div>

          {/* ── SEC 4: CONTACT ── */}
          <div
            ref={el => { secRefs.current[4] = el; }}
            style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",willChange:"transform, opacity",zIndex:4 }}
          >
            <div style={{ textAlign:"center",maxWidth:700,padding:"0 40px" }}>
              <div style={{ fontFamily:"var(--cv2-mono)",fontSize:10,color:"var(--cv2-cyan)",letterSpacing:".25em",textTransform:"uppercase",marginBottom:24 }}>// SECTOR_04 · CONTACT</div>
              <div style={{ fontSize:"clamp(40px,6vw,80px)",fontWeight:700,letterSpacing:"-0.03em",lineHeight:1,marginBottom:48 }}>
                Let&apos;s build<br /><span style={{ color:"var(--cv2-cyan)" }}>something.</span>
              </div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center" }}>
                {([
                  ["Email",           "mailto:okithask@gmail.com"],
                  ["LinkedIn",        "https://linkedin.com/in/okitha-kaluthotage-a666b5331"],
                  ["GitHub",          "https://github.com/okithaeske"],
                  ["Instagram",       "https://instagram.com/okitha_eske"],
                  ["Stack Overflow",  "https://stackoverflow.com/users/30860024"],
                ] as [string,string][]).map(([label,href]) => (
                  <a key={label} href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{ fontFamily:"var(--cv2-mono)",fontSize:11,letterSpacing:".12em",textTransform:"uppercase",textDecoration:"none",color:"var(--cv2-muted)",padding:"12px 24px",border:"1px solid rgba(255,255,255,0.08)",transition:"all 0.3s",cursor:"none" }}
                    onMouseEnter={e => { const el=e.currentTarget; el.style.borderColor="var(--cv2-cyan)"; el.style.color="var(--cv2-cyan)"; }}
                    onMouseLeave={e => { const el=e.currentTarget; el.style.borderColor="rgba(255,255,255,0.08)"; el.style.color="var(--cv2-muted)"; }}
                  >{label}</a>
                ))}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"0 36px 20px",display:"flex",justifyContent:"space-between",fontFamily:"var(--cv2-mono)",fontSize:10,color:"var(--cv2-muted)",pointerEvents:"none",zIndex:12 }}>
            <span>Okitha Kaluthotage © 2026</span>
            <span>Code and Chaos</span>
          </div>

        </div>{/* /sticky-world */}
      </div>{/* /scroll-stage */}
    </>
  );
}

// ── HELPER COMPONENTS ──────────────────────────────────────────────────────
function TweakRow({ label, desc, children, last }: { label:string; desc:string; children:React.ReactNode; last?:boolean }) {
  return (
    <div style={{ padding:`16px 17px ${last?"14px":"12px"}`,borderBottom:last?"none":"1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ fontSize:9,color:"var(--cv2-purple)",letterSpacing:".18em",textTransform:"uppercase",marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:10,color:"var(--cv2-muted)",lineHeight:1.5,marginBottom:10 }}>{desc}</div>
      <div style={{ display:"flex",gap:6 }}>{children}</div>
    </div>
  );
}

function TweakBtn({ active, onClick, children }: { active:boolean; onClick:()=>void; children:React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ flex:1,fontFamily:"var(--cv2-mono)",fontSize:10,letterSpacing:".07em",textTransform:"uppercase",padding:"8px 4px",background:active?"rgba(0,240,255,0.06)":"transparent",border:`1px solid ${active?"var(--cv2-cyan)":"rgba(255,255,255,0.07)"}`,color:active?"var(--cv2-cyan)":"var(--cv2-muted)",cursor:"none",transition:"all .25s",textAlign:"center" }}>
      {children}
    </button>
  );
}

function ProjCard({ id, badge, title, desc, tags, tagDot, link, corner, stars }: {
  id:string; badge:string; title:string; desc:string; tags:string[]; tagDot?:string; link:string; corner:string; stars?:number;
}) {
  return (
    <div
      style={{ flexShrink:0,width:320,border:"1px solid rgba(0,240,255,0.12)",background:"rgba(3,3,16,0.8)",backdropFilter:"blur(12px)",padding:28,position:"relative",overflow:"hidden",transition:"border-color 0.3s",cursor:"none",display:"flex",flexDirection:"column" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor="rgba(0,240,255,0.35)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor="rgba(0,240,255,0.12)")}
    >
      <div style={{ fontFamily:"var(--cv2-mono)",fontSize:9,color:"var(--cv2-muted)",letterSpacing:".2em",marginBottom:16,display:"flex",justifyContent:"space-between" }}>
        <span>{id} // FEATURED</span><span style={{ color:"var(--cv2-cyan)" }}>{badge}</span>
      </div>
      <div style={{ fontSize:17,fontWeight:600,marginBottom:10,color:"var(--cv2-text)" }}>{title}</div>
      <div style={{ fontSize:13,color:"#6060a0",lineHeight:1.65,marginBottom:20,flex:1 }}>{desc}</div>
      <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:20 }}>
        {tags.map(t => (
          <span key={t} style={{ fontFamily:"var(--cv2-mono)",fontSize:10,color:"var(--cv2-purple)",border:"1px solid rgba(162,89,247,0.2)",padding:"3px 10px",display:"inline-flex",alignItems:"center",gap:4 }}>
            {tagDot && <span style={{ width:8,height:8,borderRadius:"50%",display:"inline-block",background:tagDot,flexShrink:0 }} />}
            {t}
          </span>
        ))}
        {stars !== undefined && <span style={{ fontFamily:"var(--cv2-mono)",fontSize:10,color:"var(--cv2-purple)",border:"1px solid rgba(162,89,247,0.2)",padding:"3px 10px" }}>★ {stars}</span>}
      </div>
      <a href={link} target="_blank" rel="noopener noreferrer"
        style={{ fontFamily:"var(--cv2-mono)",fontSize:10,color:"var(--cv2-cyan)",textDecoration:"none",letterSpacing:".1em",textTransform:"uppercase",display:"inline-flex",alignItems:"center",gap:8,transition:"gap 0.3s" }}
        onMouseEnter={e => (e.currentTarget.style.gap="14px")}
        onMouseLeave={e => (e.currentTarget.style.gap="8px")}
      >{link.includes("/repos") || !link.includes("github.com") ? "View Repo →" : "GitHub Profile →"}</a>
      <div style={{ position:"absolute",bottom:16,right:16,fontFamily:"var(--cv2-mono)",fontSize:9,color:"rgba(0,240,255,0.2)" }}>{corner}</div>
    </div>
  );
}
