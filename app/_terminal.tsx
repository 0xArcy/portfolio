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

const ARM_CHARS = ["\\", "-", "/"] as const;

function HackerChar({ phase }: { phase: Phase }) {
  const isIdle     = phase === "idle";
  const isGunOut   = phase === "drawing" || phase === "shooting";
  const isShooting = phase === "shooting";
  const isFading   = phase === "fading";
  const [armFrame, setArmFrame] = useState(0);

  useEffect(() => {
    if (!isIdle) { setArmFrame(0); return; }
    const id = setInterval(() => setArmFrame((f) => (f + 1) % 3), 280);
    return () => clearInterval(id);
  }, [isIdle]);

  // Body line: /| + waving arm char (dropped when gun is out)
  const bodyLine = isGunOut || isFading ? "/|" : `/|${ARM_CHARS[armFrame]}`;

  const font = "'Courier New', Courier, monospace";
  const sz   = 15;

  return (
    <svg
      viewBox="0 0 70 60"
      width="70"
      height="60"
      overflow="visible"
      className={`${styles.charSvg} ${isShooting ? styles.shootJerk : ""}`}
    >
      <defs>
        <filter id="sGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
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

      {/* Head — "O" monospace char */}
      <text x="17" y="15" fontFamily={font} fontSize={sz} fill="#00ff41" filter="url(#sGlow)">O</text>

      {/* Body + right arm — "/|\" cycling for wave */}
      <text x="8" y="31" fontFamily={font} fontSize={sz} fill="#00ff41" filter="url(#sGlow)">{bodyLine}</text>

      {/* Legs */}
      <text x="8" y="49" fontFamily={font} fontSize={sz} fill="#00ff41" filter="url(#sGlow)">{"/ \\"}</text>

      {/* Gun group — scales in from the arm connection point */}
      <g
        className={`
          ${styles.gunGroup}
          ${phase === "drawing"  ? styles.gunDraw   : ""}
          ${phase === "shooting" ? styles.gunVisible : ""}
          ${phase === "fading"   ? styles.gunFade    : ""}
        `}
      >
        {/* Gun body */}
        <rect x="-20" y="23" width="28" height="11" rx="2"   fill="#00ff41" filter="url(#sGlow)" />
        {/* Barrel */}
        <rect x="-32" y="25" width="14" height="7"  rx="1.5" fill="#00ff41" />
        {/* Grip */}
        <rect x="-12" y="32" width="6"  height="8"  rx="1"   fill="#007a20" />
        {/* Groove */}
        <line x1="-17" y1="25" x2="-17" y2="32" stroke="#007a20" strokeWidth="1.5" />

        {/* Muzzle flash */}
        {isShooting && (
          <g filter="url(#mFlash)">
            <line x1="-32" y1="28" x2="-46" y2="20" stroke="#ffff88" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-32" y1="28" x2="-46" y2="36" stroke="#ffff88" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-32" y1="28" x2="-50" y2="28" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="-40" cy="28" r="5" fill="#ffffcc" opacity="0.7" />
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
