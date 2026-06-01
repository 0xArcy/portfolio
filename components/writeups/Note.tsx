import styles from "./Note.module.css";

interface Props {
  type?: "note" | "warning" | "tip" | "flag";
  children: React.ReactNode;
}

const ICONS = {
  note: "//",
  warning: "!!",
  tip: ">>",
  flag: "⚑ ",
};

const LABELS = {
  note: "NOTE",
  warning: "WARNING",
  tip: "TIP",
  flag: "FLAG",
};

export function Note({ type = "note", children }: Props) {
  return (
    <aside className={`${styles.aside} ${styles[type]}`}>
      <div className={styles.label}>
        <span className={styles.icon}>{ICONS[type]}</span>
        {LABELS[type]}
      </div>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
