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

const CHAR_FRAMES = [
  "  O  \n /|===--    \n / \\",
  "  O  \n /|===-- *  \n / \\",
  "  O  \n /|===--  * \n / \\",
  "  O  \n /|===--   *\n / \\",
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "#00cc44",
  Medium: "#ddaa00",
  Hard: "#cc4400",
  Insane: "#cc0044",
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

interface TextLine {
  id: number;
  before: string;
  email: string | null;
  after: string;
}

export default function TerminalPage({ writeups }: { writeups: WriteupMeta[] }) {
  const [bootLines, setBootLines] = useState<TextLine[]>([]);
  const [bootDone, setBootDone] = useState(false);
  const [portfolioLines, setPortfolioLines] = useState<TextLine[]>([]);
  const [textDone, setTextDone] = useState(false);
  const [charFrame, setCharFrame] = useState(0);
  const [jumping, setJumping] = useState(false);
  const lineIdRef = useRef(0);

  function nextId() {
    return lineIdRef.current++;
  }

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
      await typeLines(BOOT_LINES, setBootLines, 20);
      setBootDone(true);
      await sleep(100);
      await typeLines(PORTFOLIO_LINES, setPortfolioLines, 40);
      setTextDone(true);
    }
    init();

    const interval = setInterval(() => {
      setCharFrame((f) => (f + 1) % CHAR_FRAMES.length);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  function handleCharClick() {
    if (!jumping) {
      setJumping(true);
      setTimeout(() => setJumping(false), 500);
    }
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
          <pre className={styles.asciiTitle}>
            {`  __   ____  ___  _  _ \n / _\\ (  _ \\/ __)( \\/ )\n/    \\ )   /( (__  )  / \n\\_/\\_/(__\\_) \\___)(__/  `}
          </pre>

          <div
            className={`${styles.character} ${jumping ? styles.jumping : ""}`}
            title="click me"
            onClick={handleCharClick}
          >
            {CHAR_FRAMES[charFrame]}
          </div>

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
        </div>
      )}
    </div>
  );
}
