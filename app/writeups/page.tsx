import Link from "next/link";
import { getAllWriteups } from "@/lib/writeups";
import styles from "./writeups.module.css";

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "#00cc44",
  Medium: "#ddaa00",
  Hard: "#cc4400",
  Insane: "#cc0044",
};

export default function WriteupsIndex() {
  const writeups = getAllWriteups();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>arcy.terminal</Link>
            <span className={styles.sep}>/</span>
            <span>writeups</span>
          </div>
          <h1 className={styles.title}>writeups</h1>
          <p className={styles.subtitle}>
            {writeups.length} {writeups.length === 1 ? "writeup" : "writeups"} — CTF &amp; pentest walkthroughs
          </p>
        </header>

        <div className={styles.list}>
          {writeups.map((w) => (
            <Link key={w.slug} href={`/writeups/${w.slug}`} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardTitle}>{w.title}</span>
                <div className={styles.badges}>
                  <span className={styles.platform}>{w.platform}</span>
                  <span
                    className={styles.difficulty}
                    style={{ color: DIFFICULTY_COLOR[w.difficulty] ?? "#aaa" }}
                  >
                    {w.difficulty}
                  </span>
                  {w.status === "in-progress" && (
                    <span className={styles.wip}>WIP</span>
                  )}
                </div>
              </div>
              <p className={styles.cardDesc}>{w.description}</p>
              <div className={styles.cardBottom}>
                <span className={styles.date}>{w.date}</span>
                <div className={styles.tags}>
                  {w.tags.map((t) => (
                    <span key={t} className={styles.tag}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
