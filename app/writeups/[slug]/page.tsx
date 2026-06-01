import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSlugs, getWriteup } from "@/lib/writeups";
import { TerminalOutput, Screenshot, Note } from "@/components/writeups";
import styles from "./slug.module.css";

export async function generateStaticParams() {
  return getAllSlugs();
}

const components = { TerminalOutput, Screenshot, Note };

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "#00cc44",
  Medium: "#ddaa00",
  Hard: "#cc4400",
  Insane: "#cc0044",
};

export default async function WriteupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { meta, content } = getWriteup(slug);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb nav */}
        <nav className={styles.breadcrumb}>
          <Link href="/" className={styles.bcLink}>arcy.terminal</Link>
          <span className={styles.sep}>/</span>
          <Link href="/writeups" className={styles.bcLink}>writeups</Link>
          <span className={styles.sep}>/</span>
          <span className={styles.bcCurrent}>{meta.title.toLowerCase()}</span>
        </nav>

        {/* Writeup header */}
        <header className={styles.header}>
          <h1 className={styles.title}>{meta.title}</h1>
          <div className={styles.meta}>
            <span className={styles.platform}>{meta.platform}</span>
            <span
              className={styles.difficulty}
              style={{ color: DIFFICULTY_COLOR[meta.difficulty] ?? "#aaa" }}
            >
              {meta.difficulty}
            </span>
            <span className={styles.os}>{meta.os}</span>
            <span className={styles.date}>{meta.date}</span>
            {meta.status === "in-progress" && (
              <span className={styles.wip}>⚑ IN PROGRESS</span>
            )}
          </div>
          <div className={styles.tags}>
            {meta.tags.map((t) => (
              <span key={t} className={styles.tag}>#{t}</span>
            ))}
          </div>
          <p className={styles.description}>{meta.description}</p>
        </header>

        {/* MDX content */}
        <article className={styles.article}>
          <MDXRemote source={content} components={components} />
        </article>

        <footer className={styles.footer}>
          <Link href="/writeups" className={styles.backLink}>
            ← back to writeups
          </Link>
        </footer>
      </div>
    </div>
  );
}
