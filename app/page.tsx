"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const BOOT_LINES = [
  "INIT SYSTEM...",
  "LOADING MODULES: [██████████] 100%",
  "BYPASSING SECURITY PROTOCOLS...",
  "ACCESS GRANTED.",
  " ",
];

const PORTFOLIO_LINES = [
  "Welcome to the mainframe.",
  "> DESIGNATION: Developer",
  "> STATUS: Active",
  "> HOBBIES: N/A",
  "> Contact me at: me@arcypwn.dev",
  " ",
  "// Systems nominal. Awaiting directives...",
];

const CHAR_FRAMES = [
  "  O  \n /|===--    \n / \\",
  "  O  \n /|===-- *  \n / \\",
  "  O  \n /|===--  * \n / \\",
  "  O  \n /|===--   *\n / \\",
];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

interface TextLine {
  id: number;
  before: string;
  email: string | null;
  after: string;
}

export default function Portfolio() {
  const [bootLines, setBootLines] = useState<TextLine[]>([]);
  const [bootDone, setBootDone] = useState(false);
  const [portfolioLines, setPortfolioLines] = useState<TextLine[]>([]);
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

      // reveal character by character using partial state
      if (raw.trim() === "") {
        setter((prev) => [...prev, { id, before: " ", email: null, after: "" }]);
        await sleep(200);
        continue;
      }

      // build the full line then push; for a real char-by-char effect we push intermediate states
      const full = { id, ...parsed };
      // Type the "before" segment
      for (let i = 1; i <= parsed.before.length; i++) {
        const partial: TextLine = { id, before: parsed.before.slice(0, i), email: null, after: "" };
        setter((prev) => {
          const without = prev.filter((l) => l.id !== id);
          return [...without, partial];
        });
        await sleep(speed);
      }
      // Type the email segment (if present)
      if (parsed.email) {
        for (let i = 1; i <= parsed.email.length; i++) {
          const partial: TextLine = {
            id,
            before: parsed.before,
            email: parsed.email!.slice(0, i),
            after: "",
          };
          setter((prev) => {
            const without = prev.filter((l) => l.id !== id);
            return [...without, partial];
          });
          await sleep(speed);
        }
        // Type the "after" segment
        for (let i = 1; i <= parsed.after.length; i++) {
          const partial: TextLine = {
            id,
            before: parsed.before,
            email: parsed.email,
            after: parsed.after.slice(0, i),
          };
          setter((prev) => {
            const without = prev.filter((l) => l.id !== id);
            return [...without, partial];
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
          <a
            href={`mailto:${line.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.emailLink}
          >
            {line.email}
          </a>
        )}
        {line.after}
      </div>
    );
  }

  return (
    <div className={styles.terminal}>
      {/* Boot sequence */}
      {!bootDone && (
        <div className={styles.bootSequence}>{bootLines.map(renderLine)}</div>
      )}

      {/* Main content */}
      {bootDone && (
        <div className={styles.mainContent}>
          <pre className={styles.asciiTitle}>
            {`  __   ____  ___  _  _ \n / _\\ (  _ \\/ __)( \\/ )\n/    \\ )   /( (__  )  / \n\\_/\\_/(__\\_) \\___)(__/  `}
          </pre>

          <div
            className={`${styles.character} ${jumping ? styles.jumping : ""}`}
            title="Click me to jump!"
            onClick={handleCharClick}
          >
            {CHAR_FRAMES[charFrame]}
          </div>

          <div className={styles.portfolioText}>{portfolioLines.map(renderLine)}</div>

          <div className={styles.nav}>
            <a href="/writeups" className={styles.navLink}>
              {">"} /writeups
            </a>
          </div>

          <span className={styles.cursor} />
        </div>
      )}
    </div>
  );
}
