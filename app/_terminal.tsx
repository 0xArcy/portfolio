"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import type { WriteupMeta } from "@/lib/writeups";

const BOOT_LINES = [
  "INIT SYSTEM...",
  "LOADING MODULES: [██████████] 100%",
  "BYPASSING SECURITY PROTOCOLS...",
  "ACCESS GRANTED.",
  " ",
];

const PORTFOLIO_LINES = [
  "> whoami",
  "  arcy. developer. hacker.",
  "> contact: me@arcypwn.dev",
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "#00cc44",
  Medium: "#ddaa00",
  Hard: "#cc4400",
  Insane: "#cc0044",
};

type Phase = "idle" | "drawing" | "shooting" | "fading";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

interface TextLine {
  id: number;
  before: string;
  email: string | null;
  after: string;
}

function HackerChar({ phase }: { phase: Phase }) {
  const isIdle     = phase === "idle";
  const isGunOut   = phase === "drawing" || phase === "shooting";
  const isShooting = phase === "shooting";
  const isFading   = phase === "fading";

  return (
    <svg
      viewBox="0 0 90 88"
      width="90"
      height="88"
      overflow="visible"
      className={`${styles.charSvg} ${isShooting ? styles.shootJerk : ""}`}
    >
      <defs>
        <filter id="sGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="mFlash" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Head */}
      <circle
        cx="52" cy="14" r="11"
        fill="none" stroke="#00ff41" strokeWidth="2"
        filter="url(#sGlow)"
      />

      {/* Body */}
      <line
        x1="52" y1="25" x2="52" y2="57"
        stroke="#00ff41" strokeWidth="2.5" strokeLinecap="round"
        filter="url(#sGlow)"
      />

      {/* Left arm — casual idle, hidden during gun phase */}
      <line
        x1="52" y1="34" x2="34" y2="50"
        stroke="#00ff41" strokeWidth="2.5" strokeLinecap="round"
        filter="url(#sGlow)"
        style={{ opacity: isGunOut ? 0 : 1, transition: "opacity 0.15s" }}
      />

      {/* Right arm — waves in idle, still during gun phase */}
      <g
        className={`${styles.rightArm} ${isIdle ? styles.rightArmWave : ""}`}
      >
        <line
          x1="52" y1="34" x2="70" y2="50"
          stroke="#00ff41" strokeWidth="2.5" strokeLinecap="round"
          filter="url(#sGlow)"
        />
      </g>

      {/* Left leg — static */}
      <line
        x1="52" y1="57" x2="38" y2="84"
        stroke="#00ff41" strokeWidth="2.5" strokeLinecap="round"
        filter="url(#sGlow)"
      />

      {/* Right leg — static */}
      <line
        x1="52" y1="57" x2="66" y2="84"
        stroke="#00ff41" strokeWidth="2.5" strokeLinecap="round"
        filter="url(#sGlow)"
      />

      {/* Gun group — always in DOM, animated in/out */}
      <g
        className={`
          ${styles.gunGroup}
          ${phase === "drawing"  ? styles.gunDraw    : ""}
          ${phase === "shooting" ? styles.gunVisible  : ""}
          ${phase === "fading"   ? styles.gunFade     : ""}
        `}
      >
        {/* Gun arm */}
        <line
          x1="52" y1="34" x2="16" y2="44"
          stroke="#00ff41" strokeWidth="2.5" strokeLinecap="round"
          filter="url(#sGlow)"
        />
        {/* Gun body */}
        <rect x="2"  y="37" width="18" height="10" rx="2"   fill="#00ff41" filter="url(#sGlow)" />
        {/* Barrel */}
        <rect x="-9" y="39" width="13" height="6"  rx="1.5" fill="#00ff41" />
        {/* Grip */}
        <rect x="14" y="45" width="5"  height="7"  rx="1"   fill="#007a20" />
        {/* Detail groove */}
        <line x1="5" y1="40" x2="5" y2="45" stroke="#007a20" strokeWidth="1.5" />

        {/* Muzzle flash */}
        {isShooting && (
          <g filter="url(#mFlash)">
            <line x1="-9" y1="42" x2="-24" y2="33" stroke="#ffff88" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-9" y1="42" x2="-24" y2="51" stroke="#ffff88" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-9" y1="42" x2="-28" y2="42" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="-17" cy="42" r="5" fill="#ffffcc" opacity="0.7" />
          </g>
        )}
      </g>
    </svg>
  );
}

function FireBurst() {
  const sparks = [
    { left: "5%",  delay: 0,  height: 38 },
    { left: "14%", delay: 35, height: 52 },
    { left: "25%", delay: 10, height: 44 },
    { left: "36%", delay: 55, height: 60 },
    { left: "47%", delay: 20, height: 48 },
    { left: "58%", delay: 45, height: 55 },
    { left: "69%", delay: 5,  height: 40 },
    { left: "80%", delay: 30, height: 50 },
    { left: "91%", delay: 60, height: 36 },
  ];
  return (
    <div className={styles.sparksContainer} aria-hidden="true">
      {sparks.map((s, i) => (
        <div
          key={i}
          className={styles.spark}
          style={{
            left: s.left,
            animationDelay: `${s.delay}ms`,
            "--spark-height": `-${s.height}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function TerminalPage({ writeups }: { writeups: WriteupMeta[] }) {
  const [bootLines, setBootLines]           = useState<TextLine[]>([]);
  const [bootDone, setBootDone]             = useState(false);
  const [portfolioLines, setPortfolioLines] = useState<TextLine[]>([]);
  const [textDone, setTextDone]             = useState(false);
  const [phase, setPhase]                   = useState<Phase>("idle");
  const [hit, setHit]                       = useState(false);
  const lineIdRef = useRef(0);

  function nextId() { return lineIdRef.current++; }

  function parseLine(text: string): Omit<TextLine, "id"> {
    const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
    const match = text.match(emailRegex);
    if (match) {
      return {
        before: text.slice(0, match.index),
        email: match[0],
        after: text.slice((match.index ?? 0) + match[0].length),
      };
    }
    return { before: text, email: null, after: "" };
  }

  async function typeLines(
    lines: string[],
    setter: React.Dispatch<React.SetStateAction<TextLine[]>>,
    speed: number
  ) {
    for (const raw of lines) {
      const id = nextId();
      const parsed = parseLine(raw);
      if (raw.trim() === "") {
        setter((prev) => [...prev, { id, before: " ", email: null, after: "" }]);
        await sleep(200);
        continue;
      }
      const full = { id, ...parsed };
      for (let i = 1; i <= parsed.before.length; i++) {
        setter((prev) => {
          const without = prev.filter((l) => l.id !== id);
          return [...without, { id, before: parsed.before.slice(0, i), email: null, after: "" }];
        });
        await sleep(speed);
      }
      if (parsed.email) {
        for (let i = 1; i <= parsed.email.length; i++) {
          setter((prev) => {
            const without = prev.filter((l) => l.id !== id);
            return [...without, { id, before: parsed.before, email: parsed.email!.slice(0, i), after: "" }];
          });
          await sleep(speed);
        }
        for (let i = 1; i <= parsed.after.length; i++) {
          setter((prev) => {
            const without = prev.filter((l) => l.id !== id);
            return [...without, { id, before: parsed.before, email: parsed.email, after: parsed.after.slice(0, i) }];
          });
          await sleep(speed);
        }
      }
      setter((prev) => {
        const without = prev.filter((l) => l.id !== id);
        return [...without, full];
      });
      await sleep(200);
    }
  }

  useEffect(() => {
    async function init() {
      if (sessionStorage.getItem("booted")) {
        setBootLines(BOOT_LINES.map((t, i) => ({ id: i, before: t, email: null, after: "" })));
        setBootDone(true);
        setPortfolioLines(PORTFOLIO_LINES.map((t, i) => ({ id: BOOT_LINES.length + i, before: t, email: null, after: "" })));
        setTextDone(true);
        return;
      }
      await typeLines(BOOT_LINES, setBootLines, 20);
      setBootDone(true);
      await sleep(100);
      await typeLines(PORTFOLIO_LINES, setPortfolioLines, 40);
      setTextDone(true);
      sessionStorage.setItem("booted", "1");
    }
    init();
  }, []);

  function handleCharClick() {
    if (phase !== "idle") return;

    // 1. Draw gun
    setPhase("drawing");

    setTimeout(() => {
      // 2. BANG — laser + muzzle flash
      setPhase("shooting");

      setTimeout(() => {
        // 3. Impact — fire on title, gun fades
        setPhase("fading");
        setHit(true);

        setTimeout(() => {
          setHit(false);
          setPhase("idle");
        }, 750);
      }, 300);
    }, 420);
  }

  function renderLine(line: TextLine) {
    return (
      <div key={line.id} className={styles.textLine}>
        {line.before}
        {line.email && (
          <a href={`mailto:${line.email}`} className={styles.emailLink}>
            {line.email}
          </a>
        )}
        {line.after}
      </div>
    );
  }

  return (
    <div className={styles.terminal}>
      {!bootDone && (
        <div className={styles.bootSequence}>{bootLines.map(renderLine)}</div>
      )}

      {bootDone && (
        <div className={styles.mainContent}>
          {/* Title */}
          <div className={styles.titleWrapper}>
            {hit && <FireBurst />}
            <pre className={`${styles.asciiTitle} ${hit ? styles.titleHit : ""}`}>
              {`  __   ____  ___  _  _ \n / _\\ (  _ \\/ __)( \\/ )\n/    \\ )   /( (__  )  / \n\\_/\\_/(__\\_) \\___)(__/  `}
            </pre>
          </div>

          {/* Laser — only during shooting phase */}
          {phase === "shooting" && <div className={styles.laser} />}

          {/* Character */}
          <button
            className={styles.character}
            onClick={handleCharClick}
            aria-label="Click to shoot"
          >
            <HackerChar phase={phase} />
          </button>

          <div className={styles.portfolioText}>{portfolioLines.map(renderLine)}</div>

          {textDone && (
            <div className={styles.writeups}>
              <div className={styles.writeupsHeader}>// recent operations</div>
              <div className={styles.writeupsList}>
                {writeups.map((w) => (
                  <Link key={w.slug} href={`/writeups/${w.slug}`} className={styles.writeupEntry}>
                    <span className={styles.writeupSlug}>{w.slug}</span>
                    <span className={styles.writeupMeta}>
                      <span>{w.platform.toLowerCase()}</span>
                      <span className={styles.writeupSep}>·</span>
                      <span style={{ color: DIFFICULTY_COLOR[w.difficulty] ?? "#aaa" }}>
                        {w.difficulty.toLowerCase()}
                      </span>
                      <span className={styles.writeupSep}>·</span>
                      <span>{w.os.toLowerCase()}</span>
                    </span>
                    <span className={styles.writeupDate}>{w.date}</span>
                  </Link>
                ))}
              </div>
              <Link href="/writeups" className={styles.writeupsAll}>
                {">"} all writeups →
              </Link>
            </div>
          )}

          <span className={styles.cursor} />

          <footer className={styles.copyright}>
            © {new Date().getFullYear()} arcypwn. all rights reserved.
          </footer>
        </div>
      )}
    </div>
  );
}
