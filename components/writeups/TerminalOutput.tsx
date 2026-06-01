import styles from "./TerminalOutput.module.css";

interface Props {
  cmd: string;
  output: string;
  rawHref?: string;
}

export function TerminalOutput({ cmd, output, rawHref }: Props) {
  const lines = output.trim().split("\n");
  return (
    <figure className={styles.block}>
      <div className={styles.header}>
        <span className={styles.prompt}>
          <span className={styles.dollar}>$</span> {cmd}
        </span>
        {rawHref && (
          <a
            href={rawHref}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.rawLink}
          >
            View raw output ↗
          </a>
        )}
      </div>
      <pre className={styles.body}>
        <code>
          {lines.map((line, i) => (
            <span key={i} className={styles.line}>
              <span className={styles.lineNum}>{i + 1}</span>
              <span className={styles.lineContent}>{line || " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
