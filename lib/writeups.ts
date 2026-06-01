import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface WriteupMeta {
  slug: string;
  title: string;
  date: string;
  platform: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Insane";
  os: string;
  tags: string[];
  description: string;
  status?: "complete" | "in-progress";
}

export function getAllWriteups(): WriteupMeta[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map((f) => {
      const slug = f.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
      const { data } = matter(raw);
      return { slug, ...data } as WriteupMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getWriteup(slug: string): { meta: WriteupMeta; content: string } {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { meta: { slug, ...data } as WriteupMeta, content };
}

export function getAllSlugs(): { slug: string }[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => ({ slug: f.replace(/\.mdx$/, "") }));
}
