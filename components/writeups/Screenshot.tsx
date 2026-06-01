import styles from "./Screenshot.module.css";

interface Props {
  src: string;
  alt: string;
  caption?: string;
}

export function Screenshot({ src, alt, caption }: Props) {
  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        <div className={styles.titlebar}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.titleText}>{caption || alt}</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={styles.img} />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
